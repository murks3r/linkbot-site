/**
 * Shared helpers for the site-hardening regression tests.
 *
 * These tests run on the repository's own build output and source files only:
 * no test framework, no extra dependencies (`node --test`).
 */
import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..');

/** The canonical host this site claims. Everything absolute must agree with it. */
export const CANONICAL_HOST = 'linkbot.org';
export const CANONICAL_ORIGIN = `https://${CANONICAL_HOST}`;

/**
 * Hosts that may legitimately appear in source/public assets. Anything else is
 * an unexpected external dependency (or a stale staging/apex domain).
 */
export const ALLOWED_EXTERNAL_HOSTS = new Set([
  CANONICAL_HOST,
  'www.w3.org', // SVG/XML namespaces
  'schema.org',
  'fonts.googleapis.com',
  'fonts.gstatic.com',
  'openapi.vercel.sh', // vercel.json $schema
  'localhost', // documented dev server (README)
  '127.0.0.1',
]);

export function readText(relativePath) {
  return readFileSync(resolve(ROOT, relativePath), 'utf8');
}

export function exists(relativePath) {
  return existsSync(resolve(ROOT, relativePath));
}

/** Origin declared as `site` in astro.config.mjs — the build's source of truth. */
export function configuredSiteOrigin() {
  const config = readText('astro.config.mjs');
  const match = config.match(/site:\s*['"]([^'"]+)['"]/);
  if (!match) throw new Error('astro.config.mjs declares no `site`');
  return new URL(match[1]).origin;
}

/**
 * The built page. `dist/` is gitignored, so callers must skip explicitly when
 * the build has not run — never silently pass.
 */
export function loadBuiltHtml() {
  const path = 'dist/index.html';
  if (!exists(path)) {
    return { ok: false, reason: 'dist/index.html missing — run `npm run build` first' };
  }
  return { ok: true, html: readText(path) };
}

export function loadBuiltFile(relativePath) {
  if (!exists(relativePath)) {
    return { ok: false, reason: `${relativePath} missing — run \`npm run build\` first` };
  }
  return { ok: true, text: readText(relativePath) };
}

/** All `<meta ...>` tags in the document head, parsed into attribute maps. */
export function headMetaTags(html) {
  const head = html.split('</head>')[0] ?? html;
  const tags = [];
  for (const match of head.matchAll(/<meta\s+([^>]*?)\/?>/g)) {
    const attributes = {};
    for (const attribute of match[1].matchAll(/([a-zA-Z:-]+)\s*=\s*"([^"]*)"/g)) {
      attributes[attribute[1].toLowerCase()] = attribute[2];
    }
    tags.push(attributes);
  }
  return tags;
}

/** Value of the first meta tag matching `name` or `property` (case-insensitive). */
export function metaContent(html, key) {
  const tag = headMetaTags(html).find(
    (attributes) => (attributes.name ?? '').toLowerCase() === key.toLowerCase()
      || (attributes.property ?? '').toLowerCase() === key.toLowerCase(),
  );
  return tag?.content;
}

export function allMetaContents(html, key) {
  return headMetaTags(html)
    .filter((attributes) => (attributes.name ?? '').toLowerCase() === key.toLowerCase()
      || (attributes.property ?? '').toLowerCase() === key.toLowerCase())
    .map((attributes) => attributes.content);
}

/** JSON-LD blocks in document order, parsed. Throws on malformed JSON. */
export function parseJsonLdBlocks(html) {
  return [...html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)]
    .map((match) => JSON.parse(match[1]));
}

/**
 * robots.txt parser: blank-line separated groups; consecutive `User-agent`
 * lines share the following rules (RFC 9309 §2.2.1).
 */
export function parseRobots(text) {
  const groups = [];
  let current = null;
  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.replace(/#.*$/, '').trim();
    if (line === '') {
      // Only a genuinely blank line ends a group; comment-only lines are
      // transparent and must not split the group they annotate.
      if (rawLine.trim() === '') current = null;
      continue;
    }
    const separator = line.indexOf(':');
    if (separator === -1) continue;
    const field = line.slice(0, separator).trim().toLowerCase();
    const value = line.slice(separator + 1).trim();
    // Document-level directive, never a group rule (RFC 9309 §2.2.4).
    if (field === 'sitemap') continue;
    if (field === 'user-agent') {
      if (!current || current.locked) {
        current = { agents: [], rules: [], locked: false };
        groups.push(current);
      }
      current.agents.push(value.toLowerCase());
      continue;
    }
    if (!current) {
      current = { agents: [], rules: [], locked: true };
      groups.push(current);
    }
    current.locked = true;
    current.rules.push({ field, value });
  }
  return groups;
}

export function sitemapDirectives(text) {
  return text
    .split(/\r?\n/)
    .map((line) => line.replace(/#.*$/, '').trim())
    .filter((line) => /^sitemap:/i.test(line))
    .map((line) => line.slice(line.indexOf(':') + 1).trim());
}

/** ids present in a document. */
export function elementIds(html) {
  return [...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]);
}

/** ids referenced by aria-* attributes and same-document hrefs. */
export function referencedIds(html) {
  const references = [];
  for (const match of html.matchAll(/aria-(?:labelledby|describedby|controls|owns)="([^"]+)"/g)) {
    references.push(...match[1].split(/\s+/).filter(Boolean));
  }
  for (const match of html.matchAll(/href="#([^"]+)"/g)) {
    if (match[1] !== '') references.push(match[1]);
  }
  return references;
}

export function headingLevels(html) {
  return [...html.matchAll(/<h([1-6])\b[^>]*>/g)].map((match) => Number(match[1]));
}

/** Real pixel dimensions of an SVG asset, from width/height attributes or viewBox. */
export function svgDimensions(relativePath) {
  const svg = readText(relativePath);
  const width = svg.match(/\bwidth="(\d+(?:\.\d+)?)"/);
  const height = svg.match(/\bheight="(\d+(?:\.\d+)?)"/);
  if (width && height) return { width: Number(width[1]), height: Number(height[1]) };
  const viewBox = svg.match(/viewBox="([^"]+)"/);
  if (!viewBox) throw new Error(`${relativePath} declares no width/height or viewBox`);
  const [, , boxWidth, boxHeight] = viewBox[1].split(/\s+/).map(Number);
  return { width: boxWidth, height: boxHeight };
}

const MIME_BY_EXTENSION = {
  svg: 'image/svg+xml',
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  webp: 'image/webp',
  gif: 'image/gif',
};

export function mimeForUrl(url) {
  const extension = new URL(url).pathname.split('.').pop()?.toLowerCase() ?? '';
  return MIME_BY_EXTENSION[extension];
}

export const RASTER_EXTENSIONS = new Set(['png', 'jpg', 'jpeg', 'webp', 'gif']);
