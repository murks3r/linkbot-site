/* /faq in every language: English is the source (en.ts), each other language is typed against it. The answers are the
   same text on the page and in its schema.org FAQPage (src/components/SEO.astro). */
import type { Lang } from '../i18n/locales.ts';
import { en, type Faq } from './en.ts';
import { de } from './de.ts';
import { es } from './es.ts';
import { it } from './it.ts';
import { fr } from './fr.ts';

export type { Faq } from './en.ts';

export const FAQ: Record<Lang, Faq> = { en, de, es, it, fr };

/** The questions and answers as schema.org Question nodes, the answer's paragraphs joined. */
export const faqSchema = (faq: Faq) => ({
  '@type': 'FAQPage',
  mainEntity: faq.items.map(item => ({ '@type': 'Question', name: item.q, acceptedAnswer: { '@type': 'Answer', text: item.a.join(' ') } })),
});
