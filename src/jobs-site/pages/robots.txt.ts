import type { APIRoute } from 'astro';
import { PUBLISHED } from '../data';
/* Until the owner's publication go (JOBS_PUBLISHED) no crawler is let in; after it, every crawler, with the sitemap. */
export const GET: APIRoute = ({ site }) => new Response(
  PUBLISHED ? `User-agent: *\nAllow: /\n\nSitemap: ${new URL('/sitemap-index.xml', site)}\n` : 'User-agent: *\nDisallow: /\n',
  { headers: { 'Content-Type': 'text/plain; charset=utf-8' } },
);
