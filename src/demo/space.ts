/* Which space the /demo page embeds, if any. The page shows the real widget only when a build turns the switch on
   (PUBLIC_DEMO_LIVE=true; off by default) and is given both the address of the instance's embed.js and a publishable
   key, as preview environment variables set by whoever holds the key; neither ever enters this public repository.
   While the switch is off the page shows the recorded walkthrough only and never says "Try it". A production build never embeds it (CLAUDE.md: a demo goes on
   no page real people use until a demo space exists), and a secret key is refused outright. Pure, so
   tests/demo.test.mjs can check every case without a build. */
export interface DemoSpace {
  /** The instance's embed.js, https only. The widget asks the Space API on the same origin. */
  script: string;
  /** The space's publishable key; it works only on the origins the space allows. */
  key: string;
}

export interface DemoEnv {
  PUBLIC_DEMO_EMBED_URL?: string;
  PUBLIC_DEMO_KEY?: string;
  /** The switch: "true" mounts the widget; anything else, or nothing, leaves the page on the recording. */
  PUBLIC_DEMO_LIVE?: string;
  VERCEL_ENV?: string;
}

export function demoSpace(env: DemoEnv): DemoSpace | null {
  if (env.VERCEL_ENV === 'production') return null;
  const script = env.PUBLIC_DEMO_EMBED_URL?.trim(), key = env.PUBLIC_DEMO_KEY?.trim();
  if (!script || !key) return null;
  if (key.startsWith('sk_')) throw new Error('PUBLIC_DEMO_KEY holds a secret key: rotate it, and give the page a publishable key');
  if (!key.startsWith('pk_')) throw new Error('PUBLIC_DEMO_KEY is not a publishable key (pk_…)');
  let url: URL;
  try { url = new URL(script); } catch { throw new Error('PUBLIC_DEMO_EMBED_URL is not a URL'); }
  if (url.protocol !== 'https:' || !url.pathname.endsWith('/embed.js')) throw new Error('PUBLIC_DEMO_EMBED_URL must be an https address of embed.js');
  // Checked even while the switch is off, so a secret key is refused before anyone turns it on.
  if (env.PUBLIC_DEMO_LIVE?.trim() !== 'true') return null;
  return { script: url.href, key };
}
