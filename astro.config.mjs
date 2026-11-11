// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { shareImages } from './src/integrations/share-images.ts';
import { llmsFull } from './src/integrations/llms-full.ts';
import { remarkOpenCoreLinks } from './src/integrations/open-core-links.ts';
import { remarkPublicName } from './src/integrations/public-name.ts';

/* The developer site is static and crawlable, in five languages: English at the root, the others
   under /de, /es, /it and /fr (src/i18n). SITE_URL is the canonical origin (canonical links,
   Open Graph, schema.org, robots.txt and the sitemap derive from it). The default is docs.sensalio.de
   (agreed with Verticals, 2026-11-11: the marketing site is sensalio.de, src/lib/marketing.ts); a build
   for another origin sets SITE_URL.
   A build with PUBLIC_NOINDEX=1 is never indexed; Vercel's preview deployments are behind its
   login and send X-Robots-Tag: noindex themselves. Drafts for the owner (src/drafts) stay out of the sitemap.
   The developer docs are Markdown (src/content.config.ts); their links point into the site (remarkOpenCoreLinks), and the
   site's own pages write the public name as {name} (remarkPublicName). */
const site = process.env.SITE_URL || 'https://docs.sensalio.de';
const locales = ['en', 'de', 'es', 'it', 'fr'];

export default defineConfig({
  site,
  output: 'static',
  trailingSlash: 'never',
  build: { format: 'file', inlineStylesheets: 'auto' },
  i18n: { defaultLocale: 'en', locales, routing: { prefixDefaultLocale: false } },
  markdown: { remarkPlugins: [remarkOpenCoreLinks, remarkPublicName], shikiConfig: { theme: 'github-light' } },
  integrations: [shareImages(), llmsFull(), sitemap({
    filter: page => !page.endsWith('/404') && !page.endsWith('/developers/login-with-linkbot')
      && !page.endsWith('/developers/a-new-vertical') && !page.endsWith('/developers/prepare-a-request'),
    i18n: { defaultLocale: 'en', locales: Object.fromEntries(locales.map(l => [l, l])) },
  })],
});
