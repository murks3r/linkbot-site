// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

/* The public site is static and crawlable, in five languages: English at the root, the others
   under /de, /es, /it and /fr (src/i18n). SITE_URL is the canonical origin (canonical links,
   Open Graph and the sitemap derive from it). The default is where production runs today; the
   launch domain is the owner's decision (linkbot.org is not the owner's), so a deploy sets it.
   A build with PUBLIC_NOINDEX=1 is never indexed; Vercel's preview deployments are behind its
   login and send X-Robots-Tag: noindex themselves. */
const site = process.env.SITE_URL || 'https://linkbot-site.vercel.app';
const locales = ['en', 'de', 'es', 'it', 'fr'];

export default defineConfig({
  site,
  output: 'static',
  trailingSlash: 'never',
  build: { format: 'file', inlineStylesheets: 'auto' },
  i18n: { defaultLocale: 'en', locales, routing: { prefixDefaultLocale: false } },
  integrations: [sitemap({
    filter: page => !page.endsWith('/404'),
    i18n: { defaultLocale: 'en', locales: Object.fromEntries(locales.map(l => [l, l])) },
  })],
});
