/* The recorded walkthrough's pictures (public/material/demo/{lang}/, 640 × 880 CSS pixels each, recorded with
   tools/record-demo.cjs), shared by /demo (Replay.astro) and the landing page's demo stage (Landing.astro). */
import type { Lang } from '../i18n/locales.ts';

/** The pictures of each of the six steps, in order. */
export const SHOTS = [['1-request'], ['2-confirmed'], ['3-fits'], ['4-yes', '4-supplier-yes'], ['5-approved'], ['6-introduced', '6-console']] as const;
/** The watch a buyer can set when nothing fits yet. */
export const WATCH = ['7-watch', '7-watching'] as const;

/** A picture at 480 and 960 px (the half-size copy: src/integrations/demo-images.ts); one picture fills the column up to
    400 px, two share it. */
export const picture = (lang: Lang, shot: string, count: number) => ({
  src: `/material/demo/${lang}/${shot}.webp`,
  srcset: `/material/demo/${lang}/${shot}-480.webp 480w, /material/demo/${lang}/${shot}.webp 960w`,
  sizes: count === 1 ? '(max-width: 760px) 92vw, 400px' : '(max-width: 560px) 92vw, (max-width: 960px) 46vw, 310px',
});
