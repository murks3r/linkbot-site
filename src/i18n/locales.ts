/* The five languages of the site (de, en, es, it, fr), English first and the fallback. A page's
   language comes from its address: English at the root, the others under /de, /es, /it and /fr.
   Nothing is stored and nothing is guessed from the browser; the footer offers the switch. */
export const LANGS = ['en', 'de', 'es', 'it', 'fr'] as const;
export type Lang = (typeof LANGS)[number];
export const DEFAULT_LANG: Lang = 'en';

/** Each language's own name, for the switch. */
export const NAMES: Record<Lang, string> = { en: 'English', de: 'Deutsch', es: 'Español', it: 'Italiano', fr: 'Français' };

/** Said at the top of a page whose translation does not exist yet, in the reader's language. */
export const FALLBACK_NOTICE: Record<Lang, string> = {
  en: 'This page is shown in English.',
  de: 'Diese Seite gibt es noch nicht auf Deutsch, deshalb wird sie auf Englisch gezeigt.',
  es: 'Esta página aún no está disponible en español, por eso se muestra en inglés.',
  it: 'Questa pagina non è ancora disponibile in italiano, quindi è mostrata in inglese.',
  fr: 'Cette page n’est pas encore disponible en français, elle est donc affichée en anglais.',
};

export const isLang = (value: unknown): value is Lang => typeof value === 'string' && (LANGS as readonly string[]).includes(value);

/** The address of a page in a language: `/how-it-works` in English, `/de/how-it-works` in German. */
export const pathFor = (lang: Lang, path: string): string => {
  const clean = path === '/' ? '' : path;
  return lang === DEFAULT_LANG ? clean || '/' : `/${lang}${clean}`;
};

/** The static paths of a page in every language: the root for English, a prefix for the others. */
export const langPaths = () => LANGS.map(lang => ({ params: { lang: lang === DEFAULT_LANG ? undefined : lang }, props: { lang } }));
