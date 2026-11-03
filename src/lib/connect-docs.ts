/* What /developers quotes from the Connect lane's repository: where its docs and examples sit, and the two snippets,
   verbatim. The words around them are in the catalogues (developers); these stay as they are in every language.
   Source: murks3r/linkbot-connect on build/vision at ef9ec25, chosen by the Connect lane on 2026-10-25; rows in
   docs/truth-check.md (developers.*). */

export const CONNECT_REPO = 'murks3r/linkbot-connect';
export const CONNECT_BRANCH = 'build/vision';

/** The repository is private as of the status date, so its paths are text, not links: a link would end in a 404 for
    every visitor. Set it to true on the day the owner makes the repository public, and the paths become links. */
export const CONNECT_PUBLIC = false;

export const connectUrl = (path: string): string => `https://github.com/${CONNECT_REPO}/tree/${CONNECT_BRANCH}/${path}`;

/** The documents and examples the page points to, in its order; the catalogue describes each under the same key. */
export const DOC_PATHS = {
  embed5: 'docs/guides/embed-in-five-minutes.md',
  quickstart: 'docs/guides/developer-quickstart.md',
  nextjs: 'examples/nextjs',
  astro: 'examples/astro',
  embedRef: 'docs/reference/embed.md',
  sdkRef: 'docs/reference/sdk.md',
  webhooks: 'docs/guides/webhooks.md',
} as const;
export type DocKey = keyof typeof DOC_PATHS;

/** examples/snippets/embed.html, as docs/guides/embed-in-five-minutes.md quotes it. */
export const EMBED_SNIPPET = `<script src="EMBED_URL" async></script>
<div data-linkbot="pk_…" data-mode="describe" data-side="seeking" data-locale="de"></div>`;

/** What EMBED_URL stands for: each space's own instance serves the script; there is no central host. */
export const EMBED_URL = 'https://{space_host}/embed/v0/embed.js';

/** examples/webhooks/register.ts, as docs/guides/webhooks.md quotes it. */
export const SDK_SNIPPET = `// Run once, from your server: registers your receiver and returns the signing secret, shown only this once.
import { createSpaceClient } from '@linkbot-connect/sdk';

export async function registerWebhook(url: string): Promise<string> {
  const linkbot = createSpaceClient({ baseUrl: process.env.LINKBOT_API_BASE!, secretKey: process.env.LINKBOT_SECRET_KEY! });
  // The acting operator: an active one in your space's register (GET /operators).
  const actor = { operator_id: process.env.LINKBOT_OPERATOR_ID! };
  const { data } = await linkbot.POST('/webhooks', { body: { url, events: ['match.proposed', 'introduction.created'], actor } });
  if (!data) throw new Error('Linkbot did not register the endpoint.');
  return data.secret; // Put it in your secret store now: Linkbot never shows it again.
}`;
