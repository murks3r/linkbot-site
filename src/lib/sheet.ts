/* "Linkbot in one page": the content of the one-page sheet a buyer takes away, in one language. Every word comes from
   the catalogue sections /how-it-works, /for-platforms and /status render, and the status from the truth check's
   table (src/lib/status.ts), so the sheet cannot claim more than the site. The print page ([...lang]/one-page.astro)
   and the PDF (src/lib/sheet-pdf.ts) both draw this one structure. No prices: the catalogues name none. */
import { CONTACT_EMAIL } from './contact.ts';
import { statusColumns } from './status.ts';
import { statusDate } from '../i18n/status-date.ts';
import { pathFor, resolve, type Lang } from '../i18n/index.ts';

/** One piece of a section: a paragraph, a list, or named terms ("Intake: …"). */
export type Block =
  | { kind: 'para'; text: string }
  | { kind: 'list'; items: string[] }
  | { kind: 'terms'; items: { name: string; text: string }[] };

export interface SheetSection { title: string; blocks: Block[] }

export interface Sheet {
  lang: Lang;
  brand: string;
  title: string;
  claim: string;
  date: string;
  dated: string;
  /** In reading order; the page and the PDF flow them through two columns. */
  sections: SheetSection[];
  contact: { label: string; text: string };
  synthetic: string;
  more: { label: string; url: string };
}

/** The address of the sheet's PDF in a language. */
export const sheetPdfPath = (lang: Lang): string => `/linkbot-one-page-${lang}.pdf`;

/** The sheet in a language; `site` is the site's origin, for the address printed at its foot. */
export const sheet = (lang: Lang, site: URL): Sheet => {
  const { t } = resolve(lang);
  const how = t.how;
  const platforms = t.forPlatforms;
  const sections: SheetSection[] = [
    { title: how.blocks.title, blocks: [{ kind: 'para', text: how.blocks.lede }, { kind: 'terms', items: how.blocks.items }] },
    { title: how.rule.title, blocks: how.rule.paras.map(text => ({ kind: 'para', text })) },
    { title: platforms.ways.title, blocks: [
      { kind: 'para', text: platforms.ways.lede },
      { kind: 'terms', items: platforms.ways.items.map(way => ({ name: way.name, text: t.site.status[way.status] })) },
    ] },
    { title: platforms.gets.title, blocks: [{ kind: 'list', items: platforms.gets.items }] },
    { title: platforms.yours.title, blocks: [{ kind: 'list', items: platforms.yours.items }] },
    ...statusColumns(t).map((column): SheetSection => ({ title: column.title, blocks: [{ kind: 'para', text: column.lead }, { kind: 'list', items: column.items }] })),
  ];
  return {
    lang,
    brand: t.site.name,
    title: t.sheet.title,
    claim: t.site.claim,
    date: statusDate(lang),
    dated: t.sheet.dated,
    sections,
    contact: { label: t.site.footer.contact, text: CONTACT_EMAIL ?? t.site.footer.contactPending },
    synthetic: t.site.synthetic,
    more: { label: t.sheet.site, url: new URL(pathFor(lang, '/'), site).toString() },
  };
};
