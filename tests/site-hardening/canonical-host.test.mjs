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
  CANONICAL_ORIGIN,
  ROOT,
  configuredSiteOrigin,
  exists,
  readText,
  sitemapDirectives,
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

test('astro.config.mjs declares the canonical host', () => {
  assert.equal(configuredSiteOrigin(), CANONICAL_ORIGIN);
});

test('SEO.astro fallback origin matches the configured site', () => {
  const seo = readText('src/components/SEO.astro');
  const fallback = seo.match(/SITE_ORIGIN\s*=\s*['"]([^'"]+)['"]/);
  assert.ok(fallback, 'SEO.astro must keep a single SITE_ORIGIN fallback constant');
  assert.equal(new URL(fallback[1]).origin, configuredSiteOrigin());
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

test('robots.txt and llms.txt agree on the canonical host', () => {
  const sitemapHost = new URL(sitemapDirectives(readText('public/robots.txt'))[0]).origin;
  const llms = readText('public/llms.txt');
  const hosts = new Set(
    [...llms.matchAll(/https?:\/\/([^\s/)>,\]]+)/g)].map((match) => match[1]),
  );
  for (const host of hosts) {
    assert.equal(`https://${host}`, sitemapHost, `llms.txt host ${host} disagrees with robots.txt`);
  }
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
