/* The marketing site, sensalio.de (Verticals' products/sensalio, agreed 2026-11-11): what Sensalio is, for readers who
   are not developers. This site is its developer docs on docs.sensalio.de. The marketing pages that lived here redirect
   there (vercel.json, tests/redirects.test.mjs), and the structured data names the organisation only by reference to
   that site's node (src/components/SEO.astro). sensalio.de is in German at the root and in English under /en (Verticals,
   2026-11-11), so a reader of Spanish, Italian or French goes to the English pages. */
import type { Lang } from '../i18n/locales.ts';

export const MARKETING_ORIGIN = 'https://sensalio.de';
export const ORGANIZATION_ID = `${MARKETING_ORIGIN}/#organization`;

/** The marketing site's home for a reader of this language. */
export const marketingHome = (lang: Lang): string => (lang === 'de' ? `${MARKETING_ORIGIN}/` : `${MARKETING_ORIGIN}/en`);
