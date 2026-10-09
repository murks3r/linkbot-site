// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://linkbot.org',
  output: 'static',
  trailingSlash: 'ignore',
  integrations: [
    react(),
    tailwind({ applyBaseStyles: false }),
    // The jobsite preview is noindex (see src/jobsite/components/JobsiteSEO.astro)
    // and must not enter the sitemap while it is fixture-backed.
    sitemap({ filter: (page) => !new URL(page).pathname.startsWith('/jobs') }),
  ],
  build: { inlineStylesheets: 'auto' },
  vite: { ssr: { noExternal: ['gsap', 'lenis'] } },
});
