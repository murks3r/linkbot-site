/* How the job board shows a posting's facts in the page's language: the place with its country, the salary when the
   posting states one, a date, and the posting as schema.org JobPosting for its detail page. Pure, so the pages and
   tests/jobs-board.test.mjs use the same code. Words: src/drafts/jobs-board.ts. */
import type { Posting, Salary } from './catalogue.ts';

type Locale = 'en' | 'de';
const LOCALE: Record<Locale, string> = { en: 'en-GB', de: 'de-DE' };

/** The country's name in the page's language and in English, for the "where" filter and the place line. */
export const countryNames = (lang: Locale) => (code: string): string[] =>
  [...new Set([lang, 'en'].map(l => new Intl.DisplayNames([LOCALE[l as Locale]], { type: 'region' }).of(code) ?? code))];

export const place = (p: Posting, lang: Locale): string => `${p.location.place}, ${countryNames(lang)(p.location.country)[0]}`;

export const date = (iso: string, lang: Locale): string =>
  new Intl.DateTimeFormat(LOCALE[lang], { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' }).format(new Date(iso.length === 10 ? `${iso}T00:00:00Z` : iso));

/** "46,000–54,000 EUR a year", "from 15 EUR an hour"; null when the posting states no salary. */
export const salary = (s: Salary | null, lang: Locale, words: { per: Record<Salary['period'], string>; from: string; upTo: string }): string | null => {
  if (!s || (s.min === null && s.max === null)) return null;
  const n = (v: number) => new Intl.NumberFormat(LOCALE[lang], { maximumFractionDigits: 2 }).format(v);
  const amount = s.min !== null && s.max !== null ? `${n(s.min)}–${n(s.max)}`
    : s.min !== null ? `${words.from} ${n(s.min)}` : `${words.upTo} ${n(s.max as number)}`;
  return `${amount} ${s.currency} ${words.per[s.period]}`;
};

const UNIT: Record<Salary['period'], string> = { year: 'YEAR', month: 'MONTH', hour: 'HOUR' };

/** The posting as schema.org JobPosting: what the source states, nothing added; the original is its sameAs. */
export const jobPostingSchema = (p: Posting, pageUrl: string): Record<string, unknown> => ({
  '@type': 'JobPosting',
  title: p.title,
  description: p.description.join('\n\n'),
  inLanguage: p.language,
  datePosted: p.posted_at ?? p.fetched_at.slice(0, 10),
  ...(p.valid_through && { validThrough: p.valid_through }),
  hiringOrganization: { '@type': 'Organization', name: p.employer },
  jobLocation: { '@type': 'Place', address: { '@type': 'PostalAddress', addressLocality: p.location.place, addressCountry: p.location.country } },
  ...(p.work_mode === 'remote' && { jobLocationType: 'TELECOMMUTE', applicantLocationRequirements: { '@type': 'Country', name: p.location.country } }),
  ...(p.salary && (p.salary.min !== null || p.salary.max !== null) && {
    baseSalary: {
      '@type': 'MonetaryAmount',
      currency: p.salary.currency,
      value: { '@type': 'QuantitativeValue', unitText: UNIT[p.salary.period], ...(p.salary.min !== null && { minValue: p.salary.min }), ...(p.salary.max !== null && { maxValue: p.salary.max }) },
    },
  }),
  identifier: { '@type': 'PropertyValue', name: p.source, value: p.id },
  url: pageUrl,
  sameAs: p.original_url,
  directApply: false,
});
