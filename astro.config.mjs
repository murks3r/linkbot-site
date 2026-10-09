// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

import { describeSite, resolveSite } from './src/lib/site-origin.mjs';
import { previewGuard } from './src/lib/preview-guard.mjs';

/**
 * The site origin is resolved once, here, from the environment:
 *
 *   SITE_ORIGIN   explicit origin for any environment (required for a real
 *                 production build; see docs/preview/README.md)
 *   VERCEL_ENV    `preview` forces the deployment's own host, so a preview can
 *                 never emit canonical URLs for a custom domain
 *   VERCEL_URL    Vercel's own host for this deployment
 *
 * `linkbot.org` is rejected outright — the organisation no longer owns it, and
 * the final public domain is undecided. Everything downstream (canonical,
 * og:url, og:image, JSON-LD, sitemap) derives from `site`, so no two absolute
 * URLs in a build can disagree.
 */
const site = resolveSite(process.env);
console.log(`[linkbot] ${describeSite(site)}`);

export default defineConfig({
  site: site.origin,
  output: 'static',
  trailingSlash: 'ignore',
  integrations: [
    react(),
    tailwind({ applyBaseStyles: false }),
    // The jobsite routes (/jobs, /jobs/<id>, /jobs/saved — PR #11) are noindex
    // while they are fixture-backed and must not enter the sitemap.
    sitemap({ filter: (page) => !new URL(page).pathname.startsWith('/jobs') }),
    // Non-production guard (PR #10): robots.txt and the visible notice.
    previewGuard(),
  ],
  build: { inlineStylesheets: 'auto' },
  vite: { ssr: { noExternal: ['gsap', 'lenis'] } },
});
