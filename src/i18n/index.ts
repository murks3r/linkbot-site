/* The catalogues, one per language, typed against English so a translation is complete or does not
   compile. A language whose catalogue is not written yet falls back to English, and the page says
   so in the reader's language (FALLBACK_NOTICE); tests/i18n.test.mjs checks the fallback and that
   no catalogue carries a forbidden claim. */
import { en, type Catalogue } from './en.ts';
import { de } from './de.ts';
import { es } from './es.ts';
import { it } from './it.ts';
import { DEFAULT_LANG, type Lang } from './locales.ts';

export type { Catalogue } from './en.ts';
export * from './locales.ts';

export const catalogues: Partial<Record<Lang, Catalogue>> = { en, de, es, it };

/** The words of a page in a language, and whether they are English standing in for it. */
export const resolve = (lang: Lang): { t: Catalogue; fallback: boolean } => {
  const own = catalogues[lang];
  return own ? { t: own, fallback: false } : { t: en, fallback: lang !== DEFAULT_LANG };
};
