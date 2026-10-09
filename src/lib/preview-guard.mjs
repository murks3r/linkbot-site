/**
 * Astro integration that keeps non-production builds from being indexed and
 * from advertising a domain this organisation does not own.
 *
 * It runs only after `astro build`, and only when the build is not indexable
 * (see `resolveSite` in ./site-origin.mjs): localhost, `*.vercel.app` preview
 * deployments, and any deployment without an explicit production `SITE_ORIGIN`.
 * Production builds are left byte-identical — the integration logs that fact and
 * returns without touching the output.
 *
 * Two things happen on a non-production build:
 *
 * 1. `dist/robots.txt` is replaced with `Disallow: /`. The repository's
 *    `public/robots.txt` is owned by the SEO workstream (PR #6) and is never
 *    modified here; only the build output is.
 *
 * 2. TEMPORARY SHIM — `src/components/SEO.astro` on `main` hardcodes
 *    `https://linkbot.org` in its JSON-LD block, so a preview built from `main`
 *    would still advertise a domain the organisation does not own. Until PR #6
 *    (which derives the structured-data origin from `Astro.site`) is merged,
 *    this hook rewrites the legacy origin in the build output to the origin this
 *    build was actually given. Delete `rewriteLegacyOrigins` — and this file's
 *    import of it — in the same change that lands PR #6. See
 *    docs/preview/domain-migration.md for the exact reconciliation patch.
 */

import { readFile, readdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { resolveSite } from './site-origin.mjs';

/** Origins that must never appear in this site's output. */
const LEGACY_ORIGIN = /https?:\/\/(?:www\.)?linkbot\.org/gi;

/** Markers used by the smoke tests to detect leftovers. */
export const LEGACY_ORIGIN_MARKER = 'linkbot.org';

/**
 * robots.txt for a non-production build: refuse everything, and advertise no
 * sitemap (a sitemap URL is an absolute URL, and this build has no canonical
 * domain to point at).
 *
 * @param {{ origin: string, source: string }} site
 */
export function previewRobotsTxt(site) {
  return [
    '# Non-production build. This deployment is not the Linkbot production site.',
    `# Build origin: ${site.origin}`,
    '# Canonical-domain migration: docs/preview/domain-migration.md',
    '',
    'User-agent: *',
    'Disallow: /',
    '',
  ].join('\n');
}

/**
 * @param {string} dir
 * @returns {Promise<string[]>} absolute paths of text assets that can hold a URL
 */
async function collectTextAssets(dir) {
  const extensions = ['.html', '.txt', '.xml', '.json'];
  const found = [];
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) found.push(...(await collectTextAssets(full)));
    else if (extensions.some((extension) => entry.name.endsWith(extension))) found.push(full);
  }
  return found;
}

/**
 * @param {string} dir
 * @param {string} origin
 * @returns {Promise<string[]>} files that were rewritten
 */
async function rewriteLegacyOrigins(dir, origin) {
  const rewritten = [];
  for (const file of await collectTextAssets(dir)) {
    const content = await readFile(file, 'utf8');
    if (!content.includes(LEGACY_ORIGIN_MARKER)) continue;
    LEGACY_ORIGIN.lastIndex = 0;
    await writeFile(file, content.replace(LEGACY_ORIGIN, origin), 'utf8');
    rewritten.push(file);
  }
  return rewritten;
}

/** @returns {import('astro').AstroIntegration} */
export function previewGuard() {
  return {
    name: 'linkbot-preview-guard',
    hooks: {
      'astro:build:done': async ({ dir, logger }) => {
        const site = resolveSite(process.env);
        const outDir = fileURLToPath(dir);

        if (site.indexable) {
          logger.info(
            `preview guard: production build for ${site.origin} — robots.txt and SEO output left untouched`,
          );
          return;
        }

        await writeFile(join(outDir, 'robots.txt'), previewRobotsTxt(site), 'utf8');

        const rewritten = await rewriteLegacyOrigins(outDir, site.origin);
        logger.info(
          `preview guard: non-production build (${site.stage}, from ${site.source}) ` +
            `at ${site.origin} — robots.txt disallows all; rewritten legacy origin in ` +
            `${rewritten.length} output file(s) [temporary shim, remove with PR #6]`,
        );
      },
    },
  };
}
