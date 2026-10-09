/**
 * Preview foundation, part 2: built-output smoke checks.
 *
 * Serves `dist/` from a stdlib static server and asserts, against real HTTP
 * responses: routing, document metadata, the origin every absolute URL is built
 * from, internal links, and the non-production guard.
 *
 * Requires a build: `npm run smoke` builds first, `npm run smoke:dist` reuses an
 * existing `dist/`.
 *
 * Set `PREVIEW_URL=https://<deployment-host>` to additionally classify a real
 * deployment. Vercel Authentication is enabled for this project's previews, so a
 * protected preview answers `302 -> vercel.com/sso-api`; that is recorded as
 * `sso-protected` and passes. Only an unreachable or erroring deployment fails.
 */

import assert from 'node:assert/strict';
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { dirname, join, posix } from 'node:path';
import { fileURLToPath } from 'node:url';
import { after, before, test } from 'node:test';

import { resolveSite } from '../../src/lib/site-origin.mjs';
import { serveStatic } from './server.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const DIST = join(ROOT, 'dist');

const site = resolveSite(process.env);
const PREVIEW_URL = process.env.PREVIEW_URL?.trim() || undefined;

/** Third-party origins the page is allowed to reference. */
const EXTERNAL_ALLOWLIST = new Set(['fonts.googleapis.com', 'fonts.gstatic.com']);

/** @type {{ origin: string, close: () => Promise<void> }} */
let server;

before(async () => {
  assert.ok(
    existsSync(DIST) && statSync(DIST).isDirectory(),
    'dist/ is missing — run `npm run build` or `npm run smoke`',
  );
  server = await serveStatic(DIST);
});

after(async () => {
  await server?.close();
});

/** @param {string} path */
async function get(path) {
  return fetch(new URL(path, server.origin), { redirect: 'manual' });
}

function walk(dir, found = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) walk(full, found);
    else found.push(full);
  }
  return found;
}

const distFiles = () => walk(DIST).map((file) => file.slice(DIST.length + 1));
const htmlFiles = () => distFiles().filter((file) => file.endsWith('.html'));

/** Text assets a stale absolute URL would hide in. */
const textAssets = () =>
  distFiles().filter((file) => /\.(html|xml|txt|json|css|js|mjs|svg)$/.test(file));

const home = () => readFileSync(join(DIST, 'index.html'), 'utf8');

/** @param {string} html @param {string} name */
function metaContent(html, name) {
  const match = new RegExp(`<meta\\s+name="${name}"\\s+content="([^"]*)"`, 'i').exec(html);
  return match?.[1];
}

/**
 * Extract anchors and asset references from a document.
 *
 * Anchors and assets are kept apart because they carry different risk: an
 * outbound anchor is a deliberate hand-off, an asset reference is a third-party
 * dependency. Returns `{ tag, raw, rel }` — `tag` is `'a'` or `'asset'`.
 *
 * @param {string} html
 */
function references(html) {
  const found = [];

  for (const match of html.matchAll(/<a\s([^>]*)>/g)) {
    const href = /\bhref="([^"]*)"/.exec(match[1])?.[1];
    if (href !== undefined) {
      found.push({ tag: 'a', raw: href, rel: /\brel="([^"]*)"/.exec(match[1])?.[1] ?? '' });
    }
  }

  for (const match of html.matchAll(/<(?:link|script|img|source|iframe)\s([^>]*)>/g)) {
    const raw = /\b(?:href|src)="([^"]*)"/.exec(match[1])?.[1];
    if (raw !== undefined) found.push({ tag: 'asset', raw, rel: '' });
  }

  return found;
}

/** @param {string} html */
function jsonLdBlocks(html) {
  const blocks = [];
  const pattern = /<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g;
  let match;
  while ((match = pattern.exec(html)) !== null) blocks.push(JSON.parse(match[1]));
  return blocks;
}

/** Every string value in a JSON-LD graph, flattened. */
function jsonLdValues(node, out = []) {
  if (typeof node === 'string') out.push(node);
  else if (Array.isArray(node)) node.forEach((item) => jsonLdValues(item, out));
  else if (node && typeof node === 'object') Object.values(node).forEach((value) => jsonLdValues(value, out));
  return out;
}

test('routing: the built site serves every expected route', async () => {
  const routes = [
    ['/', 'text/html'],
    ['/index.html', 'text/html'],
    ['/favicon.svg', 'image/svg+xml'],
    ['/og.svg', 'image/svg+xml'],
    ['/llms.txt', 'text/plain'],
    ['/robots.txt', 'text/plain'],
  ];

  for (const [route, type] of routes) {
    const response = await get(route);
    assert.equal(response.status, 200, `${route} should be served`);
    const contentType = response.headers.get('content-type') ?? '';
    assert.ok(contentType.startsWith(type), `${route} served as ${contentType}, expected ${type}`);
  }

  const sitemap = await get('/sitemap-index.xml');
  assert.equal(sitemap.status, 200, 'the sitemap must be emitted');
  assert.match(sitemap.headers.get('content-type') ?? '', /^application\/xml/);
});

test('routing: unknown paths 404 rather than falling back to the homepage', async () => {
  for (const route of ['/no-such-page', '/access', '/no-such-directory/']) {
    const response = await get(route);
    assert.equal(response.status, 404, `${route} must not resolve to the homepage`);
  }
});

test('metadata: the homepage declares a title, description and social card', async () => {
  const html = home();

  assert.match(html, /<title>[^<]*Linkbot[^<]*<\/title>/);
  const description = metaContent(html, 'description');
  assert.ok(description && description.length > 40, 'a real meta description is required');
  assert.equal(metaContent(html, 'viewport') !== undefined, true, 'viewport meta must be present');
  assert.notEqual(metaContent(html, 'theme-color'), undefined);

  assert.match(html, /<meta property="og:title"/);
  assert.match(html, /<meta property="og:description"/);
  assert.match(html, /<meta property="og:image"/);
  assert.match(html, /<meta name="twitter:card"/);
});

test('metadata: canonical and og:url agree with the origin this build was given', async () => {
  const html = home();
  const canonical = /<link rel="canonical" href="([^"]+)"/.exec(html)?.[1];
  const ogUrl = /<meta property="og:url" content="([^"]+)"/.exec(html)?.[1];
  const ogImage = /<meta property="og:image" content="([^"]+)"/.exec(html)?.[1];

  assert.ok(canonical, 'a canonical link is required');
  assert.equal(ogUrl, canonical, 'og:url must equal the canonical URL');
  assert.equal(new URL(canonical).origin, site.origin, 'canonical must use the configured origin');
  assert.equal(new URL(ogImage).origin, site.origin, 'og:image must use the configured origin');

  for (const [label, value] of [
    ['canonical', canonical],
    ['og:url', ogUrl],
    ['og:image', ogImage],
  ]) {
    assert.doesNotMatch(value, /linkbot\.org/, `${label} must not cite linkbot.org`);
  }
});

test('metadata: structured data parses and cites only this build origin', async () => {
  const blocks = jsonLdBlocks(home());
  assert.ok(blocks.length >= 1, 'structured data is expected');

  const values = blocks.flatMap((block) => jsonLdValues(block));
  const absolute = values.filter((value) => /^https?:\/\//.test(value));

  assert.ok(
    absolute.some((value) => value.startsWith(`${site.origin}/`)),
    `structured data must cite ${site.origin}`,
  );

  if (site.indexable) {
    // Gated on purpose: on `main`, src/components/SEO.astro hardcodes the legacy
    // origin in its JSON-LD. PR #6 owns that file. See
    // docs/preview/domain-migration.md — this assertion is the migration's
    // acceptance test and stays red for a production-origin build until then.
    assert.ok(
      !absolute.some((value) => /linkbot\.org/.test(value)),
      'SEO.astro still emits linkbot.org in structured data; see docs/preview/domain-migration.md',
    );
  } else {
    assert.ok(
      !values.some((value) => /https?:\/\/(?:www\.)?linkbot\.org/.test(value)),
      'a non-production build must not cite the legacy domain at all',
    );
  }
});

test('metadata: no built asset cites a domain this organisation does not own', async () => {
  const offenders = [];
  for (const file of textAssets()) {
    const content = readFileSync(join(DIST, file), 'utf8');
    for (const match of content.matchAll(/https?:\/\/(?:www\.)?linkbot\.org[^\s"'<>]*/gi)) {
      offenders.push(`${file}: ${match[0]}`);
    }
  }
  assert.deepEqual(offenders, [], 'absolute URLs must use the configured origin');
});

test('metadata: the only remaining linkbot.org reference is the contact address', async () => {
  const offenders = [];
  const contacts = [];

  for (const file of textAssets()) {
    const content = readFileSync(join(DIST, file), 'utf8');
    for (const match of content.matchAll(/mailto:([^"'\s>]*)/gi)) {
      if (match[1].includes('linkbot.org')) contacts.push(`${file}: ${match[1]}`);
    }
    // Remove every tolerated use — mailto: targets and bare addresses — then
    // anything still naming the domain is an undeclared absolute reference.
    const stripped = content
      .replace(/mailto:[^"'\s>]*/gi, 'MAILTO')
      .replace(/[a-z0-9._-]+@[a-z0-9.-]*linkbot\.org/gi, 'EMAIL');
    for (const match of stripped.matchAll(/linkbot\.org/gi)) {
      const start = Math.max(0, (match.index ?? 0) - 50);
      offenders.push(`${file}: ...${stripped.slice(start, (match.index ?? 0) + 12).replace(/\s+/g, ' ')}`);
    }
  }

  assert.deepEqual(offenders, []);
  assert.ok(contacts.length > 0, 'the contact address should still be present');
  // Recorded, not asserted away: index.astro's mailto: points at a domain the
  // organisation does not own. Fixing it touches the homepage (owned by another
  // workstream), so it is a release-checklist item instead.
  console.log(`[preview-smoke] contact address on an unowned domain: ${[...new Set(contacts)].join(', ')}`);
});

test('non-production guard: previews are noindex, production is not', async () => {
  const html = home();
  const directives = [...html.matchAll(/<meta\s+name="robots"\s+content="([^"]*)"/gi)].map(
    (match) => match[1],
  );
  // The marker element, not the string: BaseLayout's scoped style sheet always
  // contains the `[data-preview-notice]` selector, so a bare substring check
  // would "find" the notice in a production build that renders none.
  const hasNotice = /data-preview-notice="true"/.test(html);

  if (site.indexable) {
    assert.equal(hasNotice, false, 'a production build must not show the preview notice');
    for (const directive of directives) {
      assert.doesNotMatch(directive, /noindex/, 'a production build must not be marked noindex');
    }
    return;
  }

  assert.ok(directives.length > 0, 'a non-production build must declare robots directives');
  assert.ok(
    directives.some((directive) => /noindex/.test(directive)),
    'a non-production build must be noindex',
  );
  for (const directive of directives) {
    // `noindex` must not be contradicted by a sibling `index` directive in the
    // same head. BaseLayout emits this guard's directive itself; once
    // PR #6's SEO.astro (which emits its own) is merged, pass the `robots` prop
    // down instead of emitting a second meta — see docs/preview/domain-migration.md.
    assert.doesNotMatch(
      directive,
      /(^|[,\s])index([,\s]|$)/,
      `contradictory robots directives in one head: ${JSON.stringify(directives)}`,
    );
  }

  assert.ok(hasNotice, 'a non-production build must display a visible non-production notice');
  assert.match(html, /Not production/i);
  assert.match(html, /Non-production preview build/i);
  assert.ok(html.includes(site.origin), 'the notice must name the origin it is served from');
});

test('non-production guard: the built robots.txt refuses crawlers, production advertises its sitemap', async () => {
  const robots = await (await get('/robots.txt')).text();

  if (site.indexable) {
    assert.doesNotMatch(robots, /^Disallow: \/$/m, 'production robots.txt must be untouched');
    const directives = [...robots.matchAll(/^Sitemap:\s*(\S+)\s*$/gim)].map((match) => match[1]);
    assert.equal(directives.length, 1, 'a production build must advertise exactly one sitemap');
    assert.equal(
      new URL(directives[0]).origin,
      site.origin,
      'the sitemap directive must name this build origin',
    );
    return;
  }

  assert.match(robots, /^User-agent: \*$/m);
  assert.match(robots, /^Disallow: \/$/m);
  assert.doesNotMatch(robots, /linkbot\.org/);
  assert.doesNotMatch(robots, /^Sitemap:/m, 'a preview must not advertise a sitemap URL');
});

test('jobsite: /jobs and its detail routes are served, noindex and out of the sitemap', async () => {
  const jobs = await get('/jobs');
  assert.equal(jobs.status, 200, '/jobs must be served');
  const html = await jobs.text();

  assert.match(html, /<meta name="robots" content="noindex/i, 'every jobsite route must be noindex');
  assert.match(html, /sample data/i, 'fixture supply must be labelled in the rendered page');

  const canonical = /<link rel="canonical" href="([^"]+)"/.exec(html)?.[1];
  assert.ok(canonical, 'the jobsite must emit a canonical on the origin this build resolved');
  assert.equal(new URL(canonical).origin, site.origin);
  assert.doesNotMatch(canonical, /linkbot\.org/);

  const detailHref = /href="(\/jobs\/[^"#?]+)"/.exec(html)?.[1];
  assert.ok(detailHref, 'the listing page must link at least one detail route');
  const detail = await get(detailHref);
  assert.equal(detail.status, 200, `${detailHref} must be served`);
  assert.match(await detail.text(), /<meta name="robots" content="noindex/i);

  // No /jobs URL may reach the sitemap: the sitemap filter in astro.config.mjs
  // and the noindex directive are two halves of the same guard.
  const index = await (await get('/sitemap-index.xml')).text();
  const children = [...index.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
  const documents = [index];
  for (const child of children) {
    documents.push(await (await get(new URL(child).pathname)).text());
  }
  const locs = documents.flatMap((doc) => [...doc.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]));
  assert.ok(locs.length > 0, 'the sitemap must list at least one URL');
  assert.deepEqual(
    locs.filter((loc) => new URL(loc).pathname.startsWith('/jobs')).map((loc) => new URL(loc).pathname),
    [],
    'the fixture-backed jobsite must not be advertised in the sitemap',
  );
});

test('links: every internal reference resolves, and every external one is declared', async () => {
  const missing = [];
  const external = [];

  for (const file of htmlFiles()) {
    const html = readFileSync(join(DIST, file), 'utf8');
    const pagePath = `/${file.replace(/index\.html$/, '')}`;

    // Anchors and asset references carry different risks. An outbound anchor is a
    // deliberate hand-off (the jobsite hands a visitor to the original posting)
    // and is only acceptable when it says so with rel="noopener noreferrer
    // nofollow". An asset reference (src, stylesheet, preload) must not reach a
    // third party at all unless that host is explicitly allow-listed.
    for (const { tag, raw, rel } of references(html)) {
      if (raw === '' || raw.startsWith('data:') || raw.startsWith('mailto:') || raw.startsWith('tel:')) continue;
      if (raw.startsWith('#')) continue;

      if (/^[a-z][a-z0-9+.-]*:\/\//i.test(raw) || raw.startsWith('//')) {
        const url = new URL(raw.startsWith('//') ? `https:${raw}` : raw);
        if (url.origin === site.origin) continue;

        if (tag === 'a') {
          const declared =
            /\bnoopener\b/.test(rel) && /\bnoreferrer\b/.test(rel) && /\bnofollow\b/.test(rel);
          if (!declared) {
            missing.push(
              `${file}: outbound anchor ${raw} must declare rel="noopener noreferrer nofollow"`,
            );
            continue;
          }
          external.push(`${file}: ${url.host}`);
          continue;
        }

        if (!EXTERNAL_ALLOWLIST.has(url.hostname)) {
          missing.push(`${file}: undeclared external asset reference ${raw}`);
        }
        continue;
      }

      const resolved = raw.startsWith('/')
        ? posix.normalize(raw)
        : posix.normalize(posix.join(pagePath, raw));
      const target = resolved.split(/[?#]/)[0].replace(/^\//, '');
      const candidates = [target, `${target}.html`, posix.join(target, 'index.html')];

      if (!candidates.some((candidate) => candidate !== '' && existsSync(join(DIST, candidate)))) {
        missing.push(`${file}: ${raw} -> no built file`);
      }
    }
  }

  assert.deepEqual(missing, []);
  if (external.length > 0) {
    console.log(
      `[preview-smoke] outbound anchors with rel="noopener noreferrer nofollow": ` +
        `${external.length} on ${new Set(external.map((entry) => entry.split(': ')[1])).size} host(s)`,
    );
  }
});

test('links: in-page anchors point at ids that exist', async () => {
  const missing = [];
  const pattern = /href="#([^"]*)"/g;

  for (const file of htmlFiles()) {
    const html = readFileSync(join(DIST, file), 'utf8');
    let match;
    while ((match = pattern.exec(html)) !== null) {
      if (match[1] === '') continue;
      if (!new RegExp(`id="${match[1]}"`).test(html)) missing.push(`${file}: #${match[1]}`);
    }
  }

  assert.deepEqual(missing, []);
});

test('preview accessibility: the local preview answers and serves the site', async () => {
  const response = await get('/');
  assert.equal(response.status, 200);
  assert.match(await response.text(), /<html/);
});

test('preview accessibility: a deployed preview URL is reachable or SSO-protected', async (t) => {
  if (!PREVIEW_URL) {
    t.diagnostic('PREVIEW_URL not set — skipping remote deployment classification');
    return;
  }

  const response = await fetch(PREVIEW_URL, { redirect: 'manual' });
  const location = response.headers.get('location') ?? '';

  if (response.status >= 200 && response.status < 300) {
    const html = await response.text();
    assert.match(html, /<html/, `${PREVIEW_URL} did not return a document`);
    t.diagnostic(`${PREVIEW_URL} is publicly reachable (HTTP ${response.status})`);
    return;
  }

  if ([301, 302, 303, 307, 308].includes(response.status)) {
    if (/vercel\.com\/sso-api/.test(location)) {
      t.diagnostic(
        `${PREVIEW_URL} is deployed but protected by Vercel Authentication (HTTP ${response.status} -> vercel.com/sso-api)`,
      );
      return;
    }
    throw new Error(`${PREVIEW_URL} redirected to an unexpected location: ${location}`);
  }

  throw new Error(`${PREVIEW_URL} is not reachable: HTTP ${response.status}`);
});
