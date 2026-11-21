// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { shareImages } from './src/integrations/share-images.ts';
import { demoImages } from './src/integrations/demo-images.ts';
import { llmsFull } from './src/integrations/llms-full.ts';
import { remarkOpenCoreLinks } from './src/integrations/open-core-links.ts';

/* The public site is static and crawlable, in five languages: English at the root, the others
   under /de, /es, /it and /fr (src/i18n). SITE_URL is the canonical origin (canonical links,
   Open Graph and the sitemap derive from it). The default is where production runs today; the
   launch domain is to be named by the owner (linkbot-domain-tbd.invalid until then), so a deploy
   sets it.
   A build with PUBLIC_NOINDEX=1 is never indexed; Vercel's preview deployments are behind its
   login and send X-Robots-Tag: noindex themselves. Drafts for the owner (src/drafts) stay out of the sitemap, /jobs with each posting's page under it.
   The developer docs are Markdown (src/content.config.ts); their links point into the site (remarkOpenCoreLinks). */
const site = process.env.SITE_URL || 'https://linkbot-site.vercel.app';
const locales = ['en', 'de', 'es', 'it', 'fr'];

/* SITE_TARGET=jobs (npm run build:jobs) builds the jobs site instead: its own pages only (src/jobs-site/pages: the board
   as the home page, each listing, /jobs/mine, /companies, /how-it-works, /sources, imprint and privacy), in English and
   German, into dist-jobs/. No developer docs and no Linkbot page exist in that build. Its origin is SITE_URL (the
   .invalid placeholder until the owner names a domain); its sitemap is written only with the owner's publication go
   (JOBS_PUBLISHED=1, src/jobs-site/data.ts). */
const jobs = defineConfig({
  site: process.env.SITE_URL || 'https://jobs-domain-tbd.invalid',
  srcDir: './src/jobs-site',
  outDir: './dist-jobs',
  output: 'static',
  trailingSlash: 'never',
  build: { format: 'file', inlineStylesheets: 'auto' },
  i18n: { defaultLocale: 'en', locales: ['en', 'de'], routing: { prefixDefaultLocale: false } },
  integrations: process.env.JOBS_PUBLISHED === '1' ? [sitemap({ i18n: { defaultLocale: 'en', locales: { en: 'en', de: 'de' } } })] : [],
});

export default process.env.SITE_TARGET === 'jobs' ? jobs : defineConfig({
  site,
  output: 'static',
  trailingSlash: 'never',
  build: { format: 'file', inlineStylesheets: 'auto' },
  i18n: { defaultLocale: 'en', locales, routing: { prefixDefaultLocale: false } },
  markdown: { remarkPlugins: [remarkOpenCoreLinks], shikiConfig: { theme: 'github-light' } },
  integrations: [shareImages(), demoImages(), llmsFull(), sitemap({
    filter: page => !page.endsWith('/404') && !page.endsWith('/for-intermediaries') && !page.endsWith('/developers/login-with-linkbot')
      && !page.endsWith('/developers/a-new-vertical') && !page.endsWith('/developers/prepare-a-request') && !/\/jobs(\/[^/]+)?$/.test(page),
    i18n: { defaultLocale: 'en', locales: Object.fromEntries(locales.map(l => [l, l])) },
  })],
});
