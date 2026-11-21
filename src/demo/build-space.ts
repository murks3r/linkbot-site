/* The demo space of this build (src/demo/space.ts), read from its environment: /demo mounts the widget for it, and
   the landing page's opening says "Try it" only when there is one. */
import { demoSpace } from './space';

export const buildSpace = () => demoSpace({
  PUBLIC_DEMO_EMBED_URL: import.meta.env.PUBLIC_DEMO_EMBED_URL,
  PUBLIC_DEMO_KEY: import.meta.env.PUBLIC_DEMO_KEY,
  PUBLIC_DEMO_LIVE: import.meta.env.PUBLIC_DEMO_LIVE,
  VERCEL_ENV: process.env.VERCEL_ENV,
});
