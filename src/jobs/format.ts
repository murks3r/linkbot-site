/* How the job board shows a posting's facts in the page's language: the place with its country, the salary when the
   posting states one, a date, the posting as schema.org JobPosting for its detail page and the board as an ItemList.
   Pure, so the pages and tests/jobs-board.test.mjs use the same code. Words: src/drafts/jobs-board.ts. */
import { employmentKind, type EmploymentKind, type Posting, type Salary } from './catalogue.ts';
import type { Lang } from '../i18n/locales.ts';

const LOCALE: Record<Lang, string> = { en: 'en-GB', de: 'de-DE', es: 'es-ES', it: 'it-IT', fr: 'fr-FR' };

/** The country's name in the page's language and in English, for the "where" filter and the place line. */
export const countryNames = (lang: Lang) => (code: string): string[] =>
  [...new Set(([lang, 'en'] as const).map(l => new Intl.DisplayNames([LOCALE[l]], { type: 'region' }).of(code) ?? code))];

export const place = (p: Posting, lang: Lang): string => `${p.location.place}, ${countryNames(lang)(p.location.country)[0]}`;

export const date = (iso: string, lang: Lang): string =>
  new Intl.DateTimeFormat(LOCALE[lang], { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'UTC' }).format(new Date(iso.length === 10 ? `${iso}T00:00:00Z` : iso));

/** "46,000–54,000 EUR a year", "from 15 EUR an hour"; null when the posting states no salary. */
export const salary = (s: Salary | null, lang: Lang, words: { per: Record<Salary['period'], string>; from: string; upTo: string }): string | null => {
  if (!s || (s.min === null && s.max === null)) return null;
  const n = (v: number) => new Intl.NumberFormat(LOCALE[lang], { maximumFractionDigits: 2 }).format(v);
  const amount = s.min !== null && s.max !== null ? `${n(s.min)}–${n(s.max)}`
    : s.min !== null ? `${words.from} ${n(s.min)}` : `${words.upTo} ${n(s.max as number)}`;
  return `${amount} ${s.currency} ${words.per[s.period]}`;
};

/** The employment type in the page's language: the board's word when it has one, else as the source writes it. */
export const employment = (raw: string | null, words: Record<EmploymentKind, string>): string | null => {
  const kind = employmentKind(raw);
  return kind ? words[kind] : raw;
};

const UNIT: Record<Salary['period'], string> = { year: 'YEAR', month: 'MONTH', hour: 'HOUR' };

/** schema.org's employment types; an apprenticeship and any type the board cannot read have none and are left out. */
const EMPLOYMENT_TYPE: Partial<Record<EmploymentKind, string>> = { full_time: 'FULL_TIME', part_time: 'PART_TIME', contract: 'CONTRACTOR', temporary: 'TEMPORARY', internship: 'INTERN' };

/** The posting as schema.org JobPosting: what the source states, nothing added. Its url is the original posting (the
    page a person applies on); the draft page that shows it is mainEntityOfPage. */
export const jobPostingSchema = (p: Posting, pageUrl: string): Record<string, unknown> => {
  const kind = employmentKind(p.employment_type);
  const employmentType = kind && EMPLOYMENT_TYPE[kind];
  return {
    '@type': 'JobPosting',
    title: p.title,
    description: p.description.join('\n\n'),
    inLanguage: p.language,
    datePosted: p.posted_at ?? p.fetched_at.slice(0, 10),
    ...(employmentType && { employmentType }),
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
    url: p.original_url,
    mainEntityOfPage: pageUrl,
    directApply: false,
  };
};

/** The board as schema.org ItemList: the live postings in the board's order, each with its page and title. */
export const boardSchema = (postings: readonly Posting[], name: string, urlOf: (p: Posting) => string): Record<string, unknown> => ({
  '@type': 'ItemList',
  name,
  itemListOrder: 'https://schema.org/ItemListOrderDescending',
  numberOfItems: postings.length,
  itemListElement: postings.map((p, index) => ({ '@type': 'ListItem', position: index + 1, url: urlOf(p), name: `${p.title}, ${p.employer}` })),
});
