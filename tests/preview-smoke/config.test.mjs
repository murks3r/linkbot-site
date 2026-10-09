/**
 * Preview foundation, part 1: configuration and lockfile invariants.
 *
 * These checks need no build — they assert the properties a build depends on:
 * the origin resolver's decisions, that no deployment configuration can leak a
 * domain this organisation does not own, that preview-only rules are scoped so
 * they cannot match production, and that the lockfile is real and complete.
 *
 * Run: node --test tests/preview-smoke/   (or `npm run smoke`)
 */

import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';

import {
  LEGACY_HOSTS,
  LOCAL_ORIGIN,
  describeSite,
  resolveSite,
} from '../../src/lib/site-origin.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');

const read = (relative) => readFileSync(join(ROOT, relative), 'utf8');
const readJson = (relative) => JSON.parse(read(relative));

/** Hosts that must never be treated as a preview by a `has` host rule. */
const PRODUCTION_HOSTS = [
  'linkbot-site.vercel.app',
  'linkbot-m3.vercel.app',
  'linkbot.org',
  'www.linkbot.org',
  'preview.linkbot-site.example',
];

/** A realistic Vercel branch alias, of the shape this project actually produces. */
const PREVIEW_HOST = 'linkbot-m3-git-parallel-web-preview-foundation-v1-geoprocure.vercel.app';

test('origin resolver: local build is localhost and never indexable', () => {
  const site = resolveSite({});
  assert.equal(site.origin, LOCAL_ORIGIN);
  assert.equal(site.stage, 'local');
  assert.equal(site.indexable, false);
});

test('origin resolver: explicit public origin is indexable', () => {
  const site = resolveSite({ SITE_ORIGIN: 'https://careers.example.com' });
  assert.equal(site.origin, 'https://careers.example.com');
  assert.equal(site.stage, 'production');
  assert.equal(site.indexable, true);
});

test('origin resolver: accepted SITE_ORIGIN forms are normalised', () => {
  assert.equal(resolveSite({ SITE_ORIGIN: 'example.com/' }).origin, 'https://example.com');
  assert.equal(
    resolveSite({ SITE_ORIGIN: '  https://example.com/path?q=1#frag  ' }).origin,
    'https://example.com',
  );
  assert.equal(resolveSite({ SITE_ORIGIN: 'http://example.com:8080' }).origin, 'http://example.com:8080');
});

test('origin resolver: a loopback SITE_ORIGIN stays a non-indexable local build', () => {
  const site = resolveSite({ SITE_ORIGIN: 'http://localhost:4321' });
  assert.equal(site.origin, 'http://localhost:4321');
  assert.equal(site.indexable, false);
});

test('origin resolver: a Vercel preview never claims a custom domain', () => {
  const site = resolveSite({
    VERCEL_ENV: 'preview',
    VERCEL_URL: PREVIEW_HOST,
    SITE_ORIGIN: 'https://careers.example.com',
  });
  assert.equal(
    site.origin,
    `https://${PREVIEW_HOST}`,
    'a preview must use its own deployment host even when SITE_ORIGIN is configured',
  );
  assert.equal(site.stage, 'preview');
  assert.equal(site.indexable, false);
});

test('origin resolver: a Vercel preview without VERCEL_URL falls back to localhost, not a domain', () => {
  const site = resolveSite({ VERCEL_ENV: 'preview', SITE_ORIGIN: 'https://careers.example.com' });
  assert.equal(site.origin, LOCAL_ORIGIN);
  assert.equal(site.indexable, false);
});

test('origin resolver: a production deployment without SITE_ORIGIN is not indexable', () => {
  const site = resolveSite({ VERCEL_ENV: 'production', VERCEL_URL: 'linkbot-m3.vercel.app' });
  assert.equal(site.origin, 'https://linkbot-m3.vercel.app');
  assert.equal(site.indexable, false, 'a *.vercel.app host is not a canonical domain');
});

test('origin resolver: a production deployment with SITE_ORIGIN is indexable', () => {
  const site = resolveSite({
    VERCEL_ENV: 'production',
    VERCEL_URL: 'linkbot-m3-abc123-geoprocure.vercel.app',
    SITE_ORIGIN: 'https://careers.example.com',
  });
  assert.equal(site.origin, 'https://careers.example.com');
  assert.equal(site.indexable, true);
});

test('origin resolver: VERCEL_URL is used when no explicit origin is set', () => {
  const site = resolveSite({ VERCEL_URL: PREVIEW_HOST });
  assert.equal(site.origin, `https://${PREVIEW_HOST}`);
  assert.equal(site.indexable, false);
});

test('origin resolver: linkbot.org is rejected in every input position', () => {
  for (const value of ['https://linkbot.org', 'linkbot.org', 'http://www.linkbot.org/']) {
    assert.throws(
      () => resolveSite({ SITE_ORIGIN: value }),
      /does not own/,
      `SITE_ORIGIN=${value} must fail the build`,
    );
  }
  assert.throws(() => resolveSite({ VERCEL_URL: 'linkbot.org' }), /does not own/);
  assert.ok(LEGACY_HOSTS.includes('linkbot.org'));
});

test('origin resolver: unparseable or non-http origins fail the build', () => {
  assert.throws(() => resolveSite({ SITE_ORIGIN: 'ftp://example.com' }), /http or https/);
  assert.throws(() => resolveSite({ SITE_ORIGIN: 'https://' }), /not a valid origin/);
});

test('origin resolver: describeSite reports origin, stage and source', () => {
  const line = describeSite(resolveSite({ VERCEL_ENV: 'preview', VERCEL_URL: PREVIEW_HOST }));
  assert.match(line, /stage=preview/);
  assert.match(line, /indexable=false/);
  assert.match(line, /vercel-preview-deployment-host/);
});

test('astro.config.mjs derives its site origin from the environment', () => {
  const config = read('astro.config.mjs');
  assert.match(config, /resolveSite\(process\.env\)/);
  assert.doesNotMatch(
    config,
    /['"]https?:\/\/[^'"]*linkbot\.org/,
    'the hardcoded production origin must be gone',
  );
  assert.match(config, /site: site\.origin/);
  assert.match(config, /previewGuard\(\)/);
});

test('vercel.json installs reproducibly and preserves the existing production rules', () => {
  const vercel = readJson('vercel.json');
  assert.equal(vercel.framework, 'astro');
  assert.equal(vercel.buildCommand, 'npm run build');
  assert.equal(vercel.outputDirectory, 'dist');
  assert.equal(vercel.installCommand, 'npm ci', 'a committed lockfile means npm ci');
  assert.equal(vercel.trailingSlash, false);

  const security = vercel.headers.find((rule) => rule.source === '/(.*)' && !rule.has);
  assert.ok(security, 'the catch-all security header rule must remain');
  const keys = security.headers.map((header) => header.key);
  for (const key of [
    'X-Content-Type-Options',
    'Referrer-Policy',
    'X-Frame-Options',
    'Permissions-Policy',
  ]) {
    assert.ok(keys.includes(key), `${key} must remain on all responses`);
  }
});

test('vercel.json attaches no custom domain and no production-affecting redirect', () => {
  const vercel = readJson('vercel.json');
  assert.equal(vercel.domains, undefined, 'no custom domain may be attached from the repo');
  assert.equal(vercel.redirects, undefined);
  assert.equal(vercel.alias, undefined);
  assert.doesNotMatch(read('vercel.json'), /linkbot\.org/);
});

test('vercel.json preview rules are host-scoped and cannot match production', () => {
  const vercel = readJson('vercel.json');

  const scoped = [...vercel.headers, ...(vercel.rewrites ?? [])].filter(
    (rule) => rule.source !== '/(.*)' || rule.has !== undefined,
  );

  const previewRules = scoped.filter(
    (rule) =>
      rule.has !== undefined &&
      (rule.headers ?? []).some((header) => header.key === 'X-Robots-Tag'),
  );
  assert.ok(previewRules.length > 0, 'at least one X-Robots-Tag rule is expected');

  const robotsRewrite = (vercel.rewrites ?? []).filter((rule) => rule.source === '/robots.txt');
  assert.equal(robotsRewrite.length, 1, 'previews must serve a preview-specific robots.txt');

  for (const rule of [...previewRules, ...robotsRewrite]) {
    assert.ok(rule.has, `rule for ${rule.source} must be host-scoped`);
    for (const condition of rule.has) {
      assert.equal(condition.type, 'host');
      const pattern = new RegExp(condition.value);
      assert.match(
        PREVIEW_HOST,
        pattern,
        `host rule ${condition.value} must match a real preview alias`,
      );
      for (const host of PRODUCTION_HOSTS) {
        assert.doesNotMatch(
          host,
          pattern,
          `host rule ${condition.value} must not match production host ${host}`,
        );
      }
    }
  }

  const noindex = previewRules[0].headers.find((header) => header.key === 'X-Robots-Tag');
  assert.match(noindex.value, /noindex/);
});

test('the preview robots.txt disallows everything and names no domain', () => {
  const robots = read(robotsRewritePath(readJson('vercel.json')));
  assert.match(robots, /^User-agent: \*$/m);
  assert.match(robots, /^Disallow: \/$/m);
  assert.doesNotMatch(robots, /linkbot\.org/);
  assert.doesNotMatch(robots, /^Sitemap:/m, 'a preview must not advertise a sitemap URL');
});

/** @param {{ rewrites?: Array<{ source: string, destination: string }> }} vercel */
function robotsRewritePath(vercel) {
  const rule = (vercel.rewrites ?? []).find((candidate) => candidate.source === '/robots.txt');
  assert.ok(rule, 'the /robots.txt rewrite must exist');
  return join('public', rule.destination.replace(/^\//, ''));
}

test('package-lock.json is a real, complete and cross-platform lockfile', () => {
  const lock = readJson('package-lock.json');
  const pkg = readJson('package.json');

  assert.equal(lock.lockfileVersion, 3);
  assert.equal(lock.name, pkg.name);
  assert.equal(lock.version, pkg.version);
  assert.ok(
    Object.keys(lock.packages ?? {}).length > 100,
    'a placeholder lockfile has no packages',
  );

  // Every declared dependency must be locked at the top level, at the same range.
  const root = lock.packages[''];
  for (const field of ['dependencies', 'devDependencies']) {
    for (const [name, range] of Object.entries(pkg[field] ?? {})) {
      assert.equal(root[field]?.[name], range, `${field}.${name} drifted between package.json and the lockfile`);
      assert.ok(lock.packages[`node_modules/${name}`], `${name} is not locked`);
    }
  }

  // npm omits other platforms' optional binaries from `node_modules` but must
  // record them in the lockfile, otherwise `npm ci` on Vercel's Linux runners
  // installs no native rollup/esbuild/sharp build.
  for (const platformPackage of [
    'node_modules/@rollup/rollup-linux-x64-gnu',
    'node_modules/@esbuild/linux-x64',
    'node_modules/@img/sharp-linux-x64',
  ]) {
    assert.ok(
      lock.packages[platformPackage],
      `${platformPackage} missing from the lockfile — npm ci would fail on Linux`,
    );
  }
});

test('no committed npm configuration overrides the registry or install behaviour', () => {
  for (const file of ['.npmrc', 'npm-shrinkwrap.json', '.yarnrc', 'yarn.lock', 'pnpm-lock.yaml']) {
    assert.equal(existsSync(join(ROOT, file)), false, `${file} must not be committed`);
  }
});
