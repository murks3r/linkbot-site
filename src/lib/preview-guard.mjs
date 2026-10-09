/**
 * Astro integration that keeps every build honest about the origin it is served
 * from, and keeps non-production builds out of search indexes.
 *
 * It runs after `astro build` and takes one decision from `resolveSite`
 * (./site-origin.mjs), so the crawl policy and the origin can never disagree
 * with the document, the canonical URL or the visible notice.
 *
 * What it does:
 *
 * 1. `dist/robots.txt` — the crawl policy is environment-independent, but the
 *    `Sitemap:` directive is an absolute URL and therefore is not.
 *    `public/robots.txt` cannot hold one (a literal names a single
 *    environment's host, and the organisation's former domain must not appear at
 *    all), so this hook owns that line:
 *      - indexable build -> append `Sitemap: <origin>/sitemap-index.xml`;
 *      - any other build -> replace the file with `Disallow: /`, no sitemap.
 *    An indexable build is otherwise left byte-identical.
 *
 * 2. Nothing else. The former `rewriteLegacyOrigins` shim is deliberately gone:
 *    `src/components/SEO.astro` derives its origin from `Astro.site` and
 *    `public/llms.txt` names no host, so there is no legacy domain left to
 *    rewrite. A shim that silently repairs a hardcoded domain is how one gets
 *    back in unnoticed — see docs/preview/domain-migration.md §3.7 and
 *    docs/integration/jobsite-preview-v1.md.
 */

import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { resolveSite } from './site-origin.mjs';

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
 * Add this build's own sitemap directive to a robots.txt document. Any
 * pre-existing directive is dropped first, so a rebuild can never accumulate
 * two.
 *
 * @param {string} source robots.txt as copied from `public/`
 * @param {string} origin the origin this build is actually served from
 */
export function robotsTxtWithSitemap(source, origin) {
  const lines = source.split(/\r?\n/).filter((line) => !/^\s*sitemap\s*:/i.test(line));
  while (lines.length > 0 && lines[lines.length - 1].trim() === '') lines.pop();
  lines.push('', `Sitemap: ${origin}/sitemap-index.xml`, '');
  return lines.join('\n');
}

/** @returns {import('astro').AstroIntegration} */
export function previewGuard() {
  return {
    name: 'linkbot-preview-guard',
    hooks: {
      'astro:build:done': async ({ dir, logger }) => {
        const site = resolveSite(process.env);
        const outDir = fileURLToPath(dir);
        const robotsPath = join(outDir, 'robots.txt');

        if (site.indexable) {
          const source = await readFile(robotsPath, 'utf8');
          await writeFile(robotsPath, robotsTxtWithSitemap(source, site.origin), 'utf8');
          logger.info(
            `preview guard: production build for ${site.origin} — crawl policy copied ` +
              'verbatim, Sitemap directive set to the build origin, no noindex injected',
          );
          return;
        }

        await writeFile(robotsPath, previewRobotsTxt(site), 'utf8');
        logger.info(
          `preview guard: non-production build (${site.stage}, from ${site.source}) ` +
            `at ${site.origin} — robots.txt disallows all and advertises no sitemap`,
        );
      },
    },
  };
}
