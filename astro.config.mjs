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
/* A9's comparison preview (integration): the directions' story files (public/directions/<key>/) are
   used only by their preview homes (/__preview/home/<key>), so a production build ships none of them. */
const PREVIEW_DIRS = ['directions/'];
const previewTilesOnly = {
  name: 'linkbot-preview-tiles',
  hooks: { 'astro:build:done': async (/** @type {{ dir: URL }} */ { dir }) => { if (process.env.PUBLIC_PREVIEW_VARIANTS !== '1') for (const file of [...PREVIEW_TILES, ...PREVIEW_DIRS]) await rm(new URL(file, dir), { force: true, recursive: true }); } },
};

/* A9's comparison preview (founder G5, integration): the direction homes (/__preview/home/<key>, one
   page per finished direction, src/preview/home-<key>.astro; the keys are src/lib/variants.ts's
   DIRECTIONS) are pages of preview builds only. Their routes are injected only when
   PUBLIC_PREVIEW_VARIANTS=1, so a production build does not compile them at all: none of their
   components or styles can reach dist. */
const COMPARISON = ['begegnung', 'puzzle'];
const comparisonPages = {
  name: 'linkbot-a9-comparison',
  hooks: { 'astro:config:setup': (/** @type {{ injectRoute: (route: { pattern: string; entrypoint: string }) => void }} */ { injectRoute }) => {
    if (process.env.PUBLIC_PREVIEW_VARIANTS !== '1') return;
    for (const key of COMPARISON) injectRoute({ pattern: `/__preview/home/${key}`, entrypoint: `./src/preview/home-${key}.astro` });
  } },
};

export default defineConfig({
  site,
  output: 'static',
  trailingSlash: 'never',
  build: { format: 'file', inlineStylesheets: 'auto' },
  integrations: [sitemap({ filter: page => !page.endsWith('/404') && !page.includes('/__preview/') }), previewTilesOnly, comparisonPages],
});
