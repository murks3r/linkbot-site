/* After the build, writes /llms-full.txt: public/llms.txt first, then the text of every public English page, read from
   the built page's <main>, so the file cannot say more or less than the pages. Drafts and the 404 page are left out, as
   in the sitemap (astro.config.mjs); the other languages hold the same pages and are named in llms.txt. */
import type { AstroIntegration } from 'astro';
import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { DOCS_BASE, SECTIONS, itemRoute } from '../lib/open-core-docs.ts';

/** The English pages in reading order: what Linkbot is first, the legal pages last. */
export const LLMS_PAGES = ['/', '/faq', '/how-it-works', '/who-sees-what', '/demo', '/for-platforms', '/developers', '/platforms',
  '/platforms/embed', '/platforms/sdk', '/platforms/console', '/platforms/wordpress', '/platforms/nextjs', '/platforms/astro',
  '/verticals', '/status', '/changelog', '/one-page', '/request-a-demo', '/contact', '/imprint', '/privacy',
  /* The developer docs (English only), in their navigation's order. */
  DOCS_BASE, ...SECTIONS.flatMap(section => section.items.map(itemRoute).filter((route): route is string => route !== null))];

const ENTITIES: Record<string, string> = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' };
const decode = (value: string) => value.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (whole, name: string) =>
  name[0] === '#' ? String.fromCodePoint(Number(name[1] === 'x' || name[1] === 'X' ? `0${name.slice(1)}` : name.slice(1))) : ENTITIES[name] ?? whole);

/** The readable text of a page's <main> without its navigation: headings as Markdown headings, list items as dashes, one block per line, code
    as a fenced block kept line for line, inline code in backticks, and words in separate buttons or labels kept apart. */
export function pageText(html: string): string {
  const main = html.match(/<main[^>]*>([\s\S]*)<\/main>/)?.[1] ?? '';
  const code: string[] = [];
  const fenced = (_: string, body: string) => `\n\u0000${code.push(decode(body.replace(/<[^>]+>/g, '')).trim()) - 1}\u0000\n`;
  return decode(main
    .replace(/<(script|style|svg|template|noscript|nav)\b[\s\S]*?<\/\1>/g, '')
    .replace(/<pre[^>]*>([\s\S]*?)<\/pre>/g, fenced)
    .replace(/<code[^>]*>([\s\S]*?)<\/code>/g, (_, body: string) => `\`${body.replace(/<[^>]+>/g, '')}\``)
    .replace(/<\/button>/g, '\n')
    .replace(/<\/span>/g, ' ')
    .replace(/<h([1-4])[^>]*>/g, (_, level: string) => `\n\n${'#'.repeat(Number(level) + 1)} `)
    .replace(/<li[^>]*>/g, '\n- ')
    .replace(/<\/(p|h[1-6]|li|dt|dd|tr|pre|figcaption|blockquote|div|section)>|<br\s*\/?>/g, '\n')
    .replace(/<\/t[dh]>/g, ' · ')
    .replace(/<[^>]+>/g, ''))
    .split('\n').map(line => line.replace(/\s+/g, ' ').replace(/ ([.,])/g, '$1').trim()).filter(Boolean).join('\n')
    .replace(/\n(#+ )/g, '\n\n$1')
    .replace(/\u0000(\d+)\u0000/g, (_, index: string) => `\`\`\`\n${code[Number(index)]}\n\`\`\``);
}

export const llmsFull = (): AstroIntegration => ({
  name: 'linkbot-llms-full',
  hooks: {
    'astro:build:done': async ({ dir, logger }) => {
      const root = fileURLToPath(dir);
      const parts = [await readFile(join(root, 'llms.txt'), 'utf8')];
      for (const page of LLMS_PAGES) {
        const html = await readFile(join(root, page === '/' ? 'index.html' : `${page.slice(1)}.html`), 'utf8');
        const title = decode(html.match(/<title>([^<]*)<\/title>/)?.[1] ?? page);
        parts.push(`\n---\n\n# ${title}\n\nPage: ${page}\n\n${pageText(html)}\n`);
      }
      await writeFile(join(root, 'llms-full.txt'), parts.join(''));
      logger.info(`llms-full.txt: ${LLMS_PAGES.length} pages`);
    },
  },
});
