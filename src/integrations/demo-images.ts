/* After the build, writes a half-size copy beside every picture of the demo's walkthrough (public/material/demo), named
   <shot>-480.webp, so a phone or a narrow column loads a quarter of the pixels (srcset in
   src/components/front/Replay.astro). The recordings stay the only source; nothing generated is committed. */
import type { AstroIntegration } from 'astro';
import { readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

export const SMALL_WIDTH = 480;

export const demoImages = (): AstroIntegration => ({
  name: 'linkbot-demo-images',
  hooks: {
    'astro:build:done': async ({ dir, logger }) => {
      const root = join(fileURLToPath(dir), 'material/demo');
      const shots = (await readdir(root, { recursive: true })).filter(file => file.endsWith('.webp') && !file.endsWith(`-${SMALL_WIDTH}.webp`));
      await Promise.all(shots.map(file => sharp(join(root, file)).resize({ width: SMALL_WIDTH }).webp({ quality: 80 })
        .toFile(join(root, file.replace(/\.webp$/, `-${SMALL_WIDTH}.webp`)))));
      logger.info(`${shots.length} demo pictures at ${SMALL_WIDTH} px`);
    },
  },
});
