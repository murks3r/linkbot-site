/* A legal page's released text, exactly as counsel delivers it: one file per page (imprint.ts, privacy.ts) holds it or
   holds null. While it is null the page says, in every language, that the text is in preparation, and shows nothing
   else; nothing here is drafted by the site. Pasting the text into that one file is the whole change: the page, its
   description and its heading follow (tests/legal.test.mjs). */
import type { Lang } from '../i18n/locales.ts';

export interface LegalText {
  /** The language the text is written in: every language's page shows it as written and marks it with this. */
  lang: Lang;
  /** The text in order: a section's heading, where it has one, and its paragraphs. */
  sections: { title?: string; paras: string[] }[];
}
