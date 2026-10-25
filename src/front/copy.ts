/* The front's words in every language (the home and /who-sees-what). English is the source (home-copy.ts, a-copy.ts,
   a-match.ts, b-copy.ts, b-pack.ts, c-copy.ts, c-stages.ts); each other language lives in src/front/i18n/ and is typed
   against English, so a translation is complete or does not compile. The pack's labels and the widget's own words are
   the Connect lane's translations, taken as they stand; the page's sentences are the site's. tests/front.test.mjs
   checks every language for forbidden claims and that the pack's structure is English's. */
import { HOME } from './home-copy.ts';
import { A } from './a-copy.ts';
import { ROWS, type Row } from './a-match.ts';
import { B } from './b-copy.ts';
import { CRITERIA, WORDS, type Criterion } from './b-pack.ts';
import { C } from './c-copy.ts';
import { STAGES, type Stage } from './c-stages.ts';
import { de } from './i18n/de.ts';
import { es } from './i18n/es.ts';
import { it } from './i18n/it.ts';
import { fr } from './i18n/fr.ts';
import type { Lang } from '../i18n/locales.ts';

/** English's shape with every string widened, so a translation may say it in its own words. */
type Text<T> = T extends string ? string : T extends readonly (infer U)[] ? readonly Text<U>[] : { readonly [K in keyof T]: Text<T[K]> };

export interface FrontCopy {
  /** The locale numbers are read and written in, and its decimal mark (the form refuses what two conventions read differently). */
  locale: string;
  decimal: '.' | ',';
  home: Text<typeof HOME>;
  a: Text<typeof A>;
  b: Text<typeof B>;
  c: Text<typeof C>;
  words: Text<typeof WORDS>;
  criteria: Criterion[];
  rows: Row[];
  stages: Stage[];
}

export const en: FrontCopy = { locale: 'en-GB', decimal: '.', home: HOME, a: A, b: B, c: C, words: WORDS, criteria: CRITERIA, rows: ROWS, stages: STAGES };

export const FRONT: Record<Lang, FrontCopy> = { en, de, es, it, fr };
