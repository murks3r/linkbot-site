/* The site's two typefaces as TrueType, for what the build draws itself (the share images, the one-page sheet): the
   same self-hosted WOFF2 files the pages load (src/styles/fonts.css), decompressed at build time, so no font is copied
   or fetched. Display: LB Display Sans SemiBold (IBM Plex, renamed as its licence requires); text: Atkinson
   Hyperlegible Next, at its default instance. */
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { decompress } from 'wawoff2';

export interface BrandFonts { display: Buffer; text: Buffer }

const FILES = {
  display: 'public/fonts/lb-display-sans/lb-display-sans-600.woff2',
  text: 'public/fonts/atkinson-hyperlegible-next/atkinson-hyperlegible-next-vf.woff2',
} as const;

let loaded: Promise<BrandFonts> | undefined;

const ttf = async (file: string): Promise<Buffer> => Buffer.from(await decompress(await readFile(join(process.cwd(), file))));

/** Both faces, decompressed once per build. Run from the repository's root, as the build and the tests are. */
export const brandFonts = (): Promise<BrandFonts> =>
  (loaded ??= Promise.all([ttf(FILES.display), ttf(FILES.text)]).then(([display, text]) => ({ display, text })));
