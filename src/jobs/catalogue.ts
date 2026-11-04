/* The job catalogue as the job board reads it: one public posting with the fields the planned read API names (source,
   fetched_at, original_url, employer, location, work mode, employment type and salary if stated, posted and
   valid-through dates), plus the title, the text as the source gives it and its language. The read API's own contract
   (murks3r/linkbot, contracts/jobs-catalogue/openapi.yaml, 0.1.0-draft) nests employer and location differently; the
   board takes its shape once that contract is merged. Postings only, never a person. Until the API exists the
   board reads a stub of the same shape (src/jobs/recorded.ts); search and filters are pure functions here, so the
   browser (src/front/board.ts) and the tests (tests/jobs-board.test.mjs) run the same code. */

export const WORK_MODES = ['on_site', 'hybrid', 'remote'] as const;
export type WorkMode = typeof WORK_MODES[number];

/** The employers' own application systems and the Federal Employment Agency's job search; nothing else is a source. */
export const SOURCES = ['personio', 'greenhouse', 'lever', 'ashby', 'workable', 'smartrecruiters', 'recruitee', 'ba'] as const;
export type Source = typeof SOURCES[number];

/** The employment types the board names in words. The catalogue gives the type as the source writes it, not
    normalised ("FullTime", "full-time", "PART_TIME", "VOLLZEIT"); employmentKind reads the common spellings and leaves the rest. */
export const EMPLOYMENT_KINDS = ['full_time', 'part_time', 'contract', 'temporary', 'internship', 'apprenticeship'] as const;
export type EmploymentKind = typeof EMPLOYMENT_KINDS[number];

const SPELLINGS: Record<string, EmploymentKind> = {
  fulltime: 'full_time', parttime: 'part_time', contract: 'contract', contractor: 'contract', freelance: 'contract',
  temporary: 'temporary', temp: 'temporary', intern: 'internship', internship: 'internship', apprenticeship: 'apprenticeship',
  /* The Federal Employment Agency's own words. */
  vollzeit: 'full_time', teilzeit: 'part_time', befristet: 'temporary', praktikum: 'internship', ausbildung: 'apprenticeship',
};

/** The kind of a source's employment type, or null when the board has no word for it (then the page shows it as written). */
export const employmentKind = (raw: string | null): EmploymentKind | null =>
  raw === null ? null : SPELLINGS[raw.toLowerCase().replace(/[^a-z]/g, '')] ?? null;

export interface Salary { min: number | null; max: number | null; currency: string; period: 'year' | 'month' | 'hour' }

export interface Posting {
  id: string;
  title: string;
  employer: string;
  /** The place as the posting names it, and its country as an ISO 3166 code. */
  location: { place: string; country: string };
  work_mode: WorkMode | null;
  /** As the source writes it, not normalised; null when it states none. */
  employment_type: string | null;
  /** Only when the posting states it. */
  salary: Salary | null;
  source: Source;
  /** When the catalogue fetched the posting (ISO 8601). */
  fetched_at: string;
  original_url: string;
  /** Dates as YYYY-MM-DD, when the posting gives them. */
  posted_at: string | null;
  valid_through: string | null;
  /** The language of the posting's text, as a BCP 47 tag. */
  language: string;
  /** The posting's text as the source gives it, one paragraph each. */
  description: string[];
}

export interface Query { q: string; where: string; mode: WorkMode | ''; since: number }

export const EMPTY_QUERY: Query = { q: '', where: '', mode: '', since: 0 };

/** The query in a page address (?q=&where=&mode=&since=); anything unknown falls back to "any". */
export const readQuery = (params: URLSearchParams): Query => {
  const mode = params.get('mode') ?? '';
  const since = Number(params.get('since'));
  return {
    q: (params.get('q') ?? '').trim(),
    where: (params.get('where') ?? '').trim(),
    mode: (WORK_MODES as readonly string[]).includes(mode) ? mode as WorkMode : '',
    since: [7, 30].includes(since) ? since : 0,
  };
};

/** The query as page address parameters, leaving out what is "any". */
export const writeQuery = (query: Query): string => {
  const params = new URLSearchParams();
  if (query.q) params.set('q', query.q);
  if (query.where) params.set('where', query.where);
  if (query.mode) params.set('mode', query.mode);
  if (query.since) params.set('since', String(query.since));
  return params.toString();
};

const DAY = 86_400_000;
const day = (date: string) => Date.parse(`${date.slice(0, 10)}T00:00:00Z`);
const fold = (text: string) => text.toLocaleLowerCase('de').normalize('NFD').replace(/\p{M}/gu, '');

/** A posting is shown until the day after its valid-through date; the collector also drops it then. */
export const isLive = (posting: Posting, today: string): boolean =>
  posting.valid_through === null || day(posting.valid_through) >= day(today);

/** The live postings that fit the query, newest first. Every word of q must appear in the title, the employer or the
    text; where must appear in the place or the country's name (countryNames, in the page's language and in English). */
export const search = (postings: readonly Posting[], query: Query, today: string, countryNames: (code: string) => string[] = () => []): Posting[] => {
  const words = fold(query.q).split(/\s+/).filter(Boolean);
  const where = fold(query.where);
  return postings
    .filter(p => isLive(p, today))
    .filter(p => {
      const text = fold([p.title, p.employer, ...p.description].join(' '));
      return words.every(w => text.includes(w));
    })
    .filter(p => !where || [p.location.place, p.location.country, ...countryNames(p.location.country)].some(n => fold(n).includes(where)))
    .filter(p => !query.mode || p.work_mode === query.mode)
    .filter(p => !query.since || (p.posted_at !== null && day(today) - day(p.posted_at) <= query.since * DAY))
    .sort((a, b) => (b.posted_at ?? '').localeCompare(a.posted_at ?? '') || a.id.localeCompare(b.id));
};
