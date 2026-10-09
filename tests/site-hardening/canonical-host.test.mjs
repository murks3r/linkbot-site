/**
 * Canonical-host and external-resource coherence across source files.
 * These run without a build, so a stale or missing `dist/` can never hide
 * domain drift or an unexpected third-party host.
 */
import assert from 'node:assert/strict';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';
import test from 'node:test';
import {
  ALLOWED_EXTERNAL_HOSTS,
  RESERVED_FIXTURE_HOSTS,
  ROOT,
  SITE,
  configuredSiteOrigin,
  exists,
  readText,
} from './helpers.mjs';

const TEXT_EXTENSIONS = ['.astro', '.ts', '.tsx', '.js', '.mjs', '.css', '.json', '.md', '.txt', '.html'];
const SKIP_DIRECTORIES = new Set(['node_modules', 'dist', '.git', '.astro', 'docs', 'tests']);

function* walk(directory) {
  for (const entry of readdirSync(directory)) {
    if (SKIP_DIRECTORIES.has(entry)) continue;
    const full = join(directory, entry);
    if (statSync(full).isDirectory()) yield* walk(full);
    else if (TEXT_EXTENSIONS.includes(entry.slice(entry.lastIndexOf('.')))) yield full;
  }
}

test('astro.config.mjs derives the canonical host from the environment', () => {
  const config = readText('astro.config.mjs');
  assert.match(config, /site:\s*site\.origin/, 'astro.config.mjs must feed the resolved origin to `site`');
  assert.match(config, /resolveSite\(process\.env\)/, 'the origin must come from the shared resolver');
  assert.doesNotMatch(
    config,
    /site:\s*['"]https?:\/\//,
    'astro.config.mjs must not hardcode a site origin',
  );
  assert.equal(configuredSiteOrigin(), SITE.origin);
});

test('SEO.astro derives absolute URLs from Astro.site and keeps no domain fallback', () => {
  const seo = readText('src/components/SEO.astro');
  assert.doesNotMatch(
    seo,
    /https?:\/\/(?:www\.)?linkbot\.org/,
    'SEO.astro must not name a domain as an origin: a fallback host ships canonical authority to whoever owns it',
  );
  assert.doesNotMatch(
    seo,
    /SITE_ORIGIN\s*=\s*['"]/,
    'the fallback constant must be gone — the origin comes from astro.config.mjs',
  );
  assert.match(seo, /Astro\.site/);
  assert.match(
    seo,
    /if\s*\(!site\)\s*\{[\s\S]*throw/,
    'SEO.astro must fail the build when no origin was resolved, not invent one',
  );

  // Recorded, not asserted away: the contact *address* is still on the same
  // domain. That is a contact decision (docs/site-hardening/02 §1, and
  // docs/preview/domain-migration.md §3.4), not an origin decision.
  const emails = [...seo.matchAll(/[a-z0-9._-]+@linkbot\.org/gi)].map((match) => match[0]);
  assert.ok(emails.length > 0, 'expected the published contact address to still be present');
});

test('the jobsite uses the same resolver and exposes no second origin variable', () => {
  const seo = readText('src/jobsite/components/JobsiteSEO.astro');
  assert.match(seo, /Astro\.site/, 'the jobsite must take the origin the build resolved');
  assert.match(seo, /if\s*\(!site\)\s*\{[\s\S]*throw/);
  assert.doesNotMatch(seo, /PUBLIC_SITE_ORIGIN|getSiteOrigin/);

  const config = readText('src/jobsite/config.ts');
  assert.doesNotMatch(
    config,
    /getSiteOrigin|PUBLIC_SITE_ORIGIN\s*[?:]/,
    'a second origin variable is a second place to disagree with the document',
  );
  assert.doesNotMatch(readText('.env.example'), /^PUBLIC_SITE_ORIGIN=/m);
});

test('astro.config.mjs keeps the fixture-backed jobsite out of the sitemap', () => {
  const config = readText('astro.config.mjs');
  assert.match(
    config,
    /sitemap\(\{\s*filter:/,
    'the sitemap must exclude /jobs while it is fixture-backed (see src/jobsite)',
  );
  assert.match(config, /startsWith\('\/jobs'\)/);
});

test('every absolute URL in source and public assets points at an approved host', () => {
  const offenders = [];
  for (const file of walk(resolve(ROOT, 'src'))) {
    collectOffenders(file, offenders);
  }
  for (const file of walk(resolve(ROOT, 'public'))) {
    collectOffenders(file, offenders);
  }
  for (const relative of ['astro.config.mjs', 'vercel.json', 'package.json', 'README.md']) {
    if (exists(relative)) collectOffenders(resolve(ROOT, relative), offenders);
  }
  assert.deepEqual(offenders, [], `unexpected external hosts: ${offenders.join(', ')}`);
});

test('robots.txt and llms.txt name no host of their own', () => {
  for (const file of ['public/robots.txt', 'public/llms.txt']) {
    const absolute = [...readText(file).matchAll(/https?:\/\/[^\s"'<>)]+/g)].map((match) => match[0]);
    assert.deepEqual(
      absolute,
      [],
      `${file} must name no host: it is a static file, so any literal is wrong in every ` +
        'other environment. The Sitemap directive is injected into the build output instead ' +
        '(src/lib/preview-guard.mjs) and llms.txt must stay relative.',
    );
  }
});

test('jobsite fixtures cite reserved hosts only, so no real employer or source is named', () => {
  const offenders = [];
  for (const file of ['src/jobsite/fixtures/opportunities.ts', 'src/jobsite/fixture-adapter.ts']) {
    if (!exists(file)) continue;
    for (const match of readText(file).matchAll(/https?:\/\/([a-zA-Z0-9.-]+)/g)) {
      if (!RESERVED_FIXTURE_HOSTS.includes(match[1].toLowerCase())) {
        offenders.push(`${file}: ${match[0]}`);
      }
    }
  }
  assert.deepEqual(
    offenders,
    [],
    'labelled fixture supply must be built from RFC 2606 reserved names only',
  );
});

test('crawler-relevant third-party assets are preconnected', () => {
  const layout = readText('src/layouts/BaseLayout.astro');
  for (const host of new Set([...layout.matchAll(/https:\/\/[^\s"'/]+/g)].map((match) => match[1]))) {
    if (ALLOWED_EXTERNAL_HOSTS.has(host) && host.startsWith('fonts.')) {
      assert.ok(
        layout.includes(`rel="preconnect" href="https://${host}"`),
        `render-blocking third-party host https://${host} needs a preconnect hint`,
      );
    }
  }
});

function collectOffenders(file, offenders) {
  const contents = readFileSync(file, 'utf8');
  for (const match of contents.matchAll(/https?:\/\/([a-zA-Z0-9.-]+)/g)) {
    const host = match[1].toLowerCase();
    if (!ALLOWED_EXTERNAL_HOSTS.has(host)) offenders.push(`${host} (${file.replace(`${ROOT}/`, '')})`);
  }
}
