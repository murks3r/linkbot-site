import type { APIRoute } from 'astro';
/* Previews (PUBLIC_NOINDEX=1) are never crawled. The real site lets every crawler in, names the AI crawlers so none of
   them reads a silence as a refusal, and points them at the sitemap and at llms.txt. */
const AI_CRAWLERS = ['GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'ClaudeBot', 'Claude-User', 'Claude-SearchBot', 'anthropic-ai', 'PerplexityBot', 'Perplexity-User', 'Google-Extended', 'Applebot-Extended', 'CCBot', 'Meta-ExternalAgent', 'Amazonbot', 'DuckAssistBot', 'MistralAI-User'];

export const GET: APIRoute = ({ site }) => {
  const noindex = import.meta.env.PUBLIC_NOINDEX === '1';
  const at = (path: string) => new URL(path, site).toString();
  const body = noindex ? 'User-agent: *\nDisallow: /\n'
    : [...AI_CRAWLERS, '*'].map(agent => `User-agent: ${agent}\nAllow: /\n`).join('\n')
      + `\n# A plain-text summary for language models: ${at('/llms.txt')} (all page text: ${at('/llms-full.txt')})\nSitemap: ${at('/sitemap-index.xml')}\n`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
