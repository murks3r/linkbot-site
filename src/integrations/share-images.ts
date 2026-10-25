/* After the build, draws the preview image every page names in its og:image (src/components/SEO.astro), from that
   page's own og:title and og:description (src/lib/share-card.ts). A page is the only source of its card, so the two
   cannot drift; a page whose image cannot be drawn stops the build. */
import type { AstroIntegration } from 'astro';
import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { renderCard } from '../lib/share-card';

const ENTITIES: Record<string, string> = { amp: '&', lt: '<', gt: '>', quot: '"', '#39': "'", '#x27': "'" };
const decode = (value: string) => value.replace(/&(amp|lt|gt|quot|#39|#x27);/g, (_, name: string) => ENTITIES[name]);
const meta = (html: string, property: string) => {
  const match = html.match(new RegExp(`<meta property="${property}" content="([^"]*)"`));
  return match ? decode(match[1]) : undefined;
};

const pages = async (dir: string): Promise<string[]> => (await readdir(dir, { recursive: true }))
  .filter(file => file.endsWith('.html')).map(file => join(dir, file));

export const shareImages = (): AstroIntegration => ({
  name: 'linkbot-share-images',
  hooks: {
    'astro:build:done': async ({ dir, logger }) => {
      const root = fileURLToPath(dir);
      const drawn = new Set<string>();
      for (const file of await pages(root)) {
        const html = await readFile(file, 'utf8');
        const image = meta(html, 'og:image');
        if (!image) continue;
        const target = join(root, new URL(image).pathname);
        if (drawn.has(target)) continue;
        const [title, description, brand] = ['og:title', 'og:description', 'og:site_name'].map(p => meta(html, p));
        if (!title || !description || !brand) throw new Error(`share image: ${file} lacks og:title, og:description or og:site_name`);
        await mkdir(dirname(target), { recursive: true });
        await writeFile(target, await renderCard({ brand, title, description }));
        drawn.add(target);
      }
      logger.info(`${drawn.size} share images`);
    },
  },
});
