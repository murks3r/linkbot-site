// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { rm } from 'node:fs/promises';

/* The public site is static and crawlable. SITE_URL is the canonical origin (canonical links,
   Open Graph and the sitemap derive from it); the launch domain is the owner's decision, so a
   deploy sets it explicitly. Previews set PUBLIC_NOINDEX=1 and are never indexed. */
const site = process.env.SITE_URL || 'https://linkbot.org';

/* The density stages other than the default are preview options (the switcher's `density` axis and
   /__preview/noise, both only in PUBLIC_PREVIEW_VARIANTS=1 builds): a production build ships the d2
   tile alone. Nothing in a production page refers to the others. */
const PREVIEW_TILES = ['material/noise-d1-light.webp', 'material/noise-d3-dense.webp', 'material/paper.webp'];
const previewTilesOnly = {
  name: 'linkbot-preview-tiles',
  hooks: { 'astro:build:done': async (/** @type {{ dir: URL }} */ { dir }) => { if (process.env.PUBLIC_PREVIEW_VARIANTS !== '1') for (const file of PREVIEW_TILES) await rm(new URL(file, dir), { force: true }); } },
};

export default defineConfig({
  site,
  output: 'static',
  trailingSlash: 'never',
  build: { format: 'file', inlineStylesheets: 'auto' },
  integrations: [sitemap({ filter: page => !page.endsWith('/404') && !page.includes('/__preview/') }), previewTilesOnly],
});
