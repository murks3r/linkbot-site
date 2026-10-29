/* The link preview image of a page (1200 × 630 PNG), drawn at build time from the page's own title and description,
   so a shared link shows exactly what the page says and nothing more. Satori lays out the card, resvg renders it; no
   service is called. The palette is the site's light one (src/styles/site.css). */
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { brandFonts } from './brand-fonts';

export const CARD = { width: 1200, height: 630 } as const;
const C = { paper: '#f4f4f1', ink: '#15171a', ink2: '#4a4f55', line: '#cfd1cb' } as const;

export interface Card { brand: string; title: string; description: string }

/** A page title as headline and soft second line: "How Linkbot works: from …" splits at the colon, "Imprint · Linkbot" drops the brand. */
export const splitTitle = (title: string): [string, string?] => {
  const [head, ...rest] = title.split(/: | · /);
  const soft = rest.join(': ');
  return soft && soft !== 'Linkbot' ? [head, soft] : [head];
};

/** The address of a page's preview image: /og/<lang>/<path>.png, the home as "home". */
export const cardPath = (lang: string, path: string): string => `/og/${lang}${path === '/' ? '/home' : path}.png`;

/** A description cut at a word to fit two lines of the card (about 72 characters a line), with an ellipsis. */
export const clip = (text: string, max = 140): string =>
  text.length <= max ? text : `${text.slice(0, text.lastIndexOf(' ', max - 1)).replace(/[\s,;:.–-]+$/, '')}…`;

const el = (type: string, style: Record<string, unknown>, children?: unknown) => ({ type, props: { style, children } });

/** The PNG of one card. */
export const renderCard = async ({ brand, title, description }: Card): Promise<Uint8Array> => {
  const fonts = await brandFonts();
  const [head, soft] = splitTitle(title);
  const size = head.length + (soft?.length ?? 0) > 64 ? 58 : 68;
  /* Satori sizes boxes without their padding, so the root's size is the card's less its padding. */
  const pad = { x: 80, top: 60, bottom: 52 };
  const inner = CARD.width - 2 * pad.x;
  const tree = el('div', { width: inner, height: CARD.height - pad.top - pad.bottom, display: 'flex', flexDirection: 'column', padding: `${pad.top}px ${pad.x}px ${pad.bottom}px`, background: C.paper, color: C.ink, fontFamily: 'Text' }, [
    el('div', { display: 'flex', width: inner, fontFamily: 'Display', fontSize: 40, letterSpacing: '-0.028em' }, brand.toLowerCase()),
    el('div', { display: 'flex', flexDirection: 'column', justifyContent: 'center', flexGrow: 1, flexShrink: 1, minHeight: 0, width: inner, fontFamily: 'Display', fontSize: size, lineHeight: 1.08, letterSpacing: '-0.03em' }, [
      el('div', { display: 'flex' }, head),
      ...(soft ? [el('div', { display: 'flex', color: C.ink2 }, soft)] : []),
    ]),
    el('div', { display: 'flex', flexShrink: 0, width: inner, paddingTop: 20, borderTop: `2px solid ${C.line}`, fontSize: 26, lineHeight: 1.35, color: C.ink2 }, clip(description)),
  ]);
  const svg = await satori(tree as never, { ...CARD, fonts: [
    { name: 'Display', data: fonts.display, weight: 600, style: 'normal' },
    { name: 'Text', data: fonts.text, weight: 400, style: 'normal' },
  ] });
  return new Resvg(svg, { fitTo: { mode: 'width', value: CARD.width }, font: { loadSystemFonts: false } }).render().asPng();
};
