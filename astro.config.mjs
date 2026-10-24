// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  // Where production runs today. The launch domain is to be named by the owner (linkbot-domain-tbd.invalid until then).
  site: 'https://linkbot-site.vercel.app',
  output: 'static',
  trailingSlash: 'ignore',
  integrations: [
    react(),
    tailwind({ applyBaseStyles: false }),
    sitemap(),
  ],
  build: { inlineStylesheets: 'auto' },
  vite: { ssr: { noExternal: ['gsap', 'lenis'] } },
});
