/* The front's words in every language (the landing page, /who-sees-what and /demo). English is the source
   (landing-copy.ts, a-copy.ts, c-copy.ts, c-stages.ts, demo-copy.ts); each other language lives in src/front/i18n/ and is
   typed against English, so a translation is complete or does not compile. The page's sentences are the site's.
   tests/front.test.mjs checks every language for forbidden claims and that the structure is English's. */
import { LANDING } from './landing-copy.ts';
import { A } from './a-copy.ts';
import { C } from './c-copy.ts';
import { DEMO } from './demo-copy.ts';
import { STAGES, type Stage } from './c-stages.ts';
import { de } from './i18n/de.ts';
import { es } from './i18n/es.ts';
import { it } from './i18n/it.ts';
import { fr } from './i18n/fr.ts';
import type { Lang } from '../i18n/locales.ts';

/** English's shape with every string widened, so a translation may say it in its own words. */
type Text<T> = T extends string ? string : T extends readonly (infer U)[] ? readonly Text<U>[] : { readonly [K in keyof T]: Text<T[K]> };

export interface FrontCopy {
  landing: Text<typeof LANDING>;
  a: Text<typeof A>;
  c: Text<typeof C>;
  demo: Text<typeof DEMO>;
  stages: Stage[];
}

export const en: FrontCopy = { landing: LANDING, a: A, c: C, demo: DEMO, stages: STAGES };

export const FRONT: Record<Lang, FrontCopy> = { en, de, es, it, fr };
