import type { APIRoute } from 'astro';
/* Previews (PUBLIC_NOINDEX=1) are never crawled; the real site points crawlers at its sitemap. */
export const GET: APIRoute = ({ site }) => {
  const noindex = import.meta.env.PUBLIC_NOINDEX === '1';
  const body = noindex ? 'User-agent: *\nDisallow: /\n' : `User-agent: *\nAllow: /\n\nSitemap: ${new URL('/sitemap-index.xml', site).toString()}\n`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
