/**
 * The replaceable search adapter contract.
 *
 * This is the *only* seam between the jobsite UI and supply. Swapping the
 * fixture adapter for the canonical Universal Supply API is a one-line change
 * in `create-adapter.ts` plus an origin in the environment; no UI file imports
 * a concrete adapter.
 *
 * Any implementation must honour the rules in `docs/jobsite/api-contract.md`,
 * in particular the UNKNOWN semantics documented on `JobSearchQuery`.
 */

import type {
  EmploymentType,
  JobOpportunity,
  WorkMode,
} from './types.ts';

/** Ordering of a result page. */
export type SearchSort =
  | 'relevance'
  | 'newest'
  | 'oldest'
  | 'salary_desc'
  | 'salary_asc';

export const SORT_LABELS: Record<SearchSort, string> = {
  relevance: 'Most relevant',
  newest: 'Newest first',
  oldest: 'Oldest first',
  salary_desc: 'Compensation: high to low',
  salary_asc: 'Compensation: low to high',
};

/**
 * A search request.
 *
 * UNKNOWN semantics — the rules every adapter must implement identically:
 *
 *  - An empty array / null / false means "no constraint": the filter matches
 *    every record, *including* records whose value is `unknown`.
 *  - `unknown` is a first-class value: passing `workModes: ['unknown']` returns
 *    exactly the records whose work mode is unknown, and `['remote','unknown']`
 *    returns both. A record is never silently dropped for being unknown.
 *  - Ranged/derived filters cannot match a record that lacks the field, because
 *    the predicate cannot be evaluated. Those filters therefore *exclude*
 *    unknown records, and the UI must say so next to the control:
 *      * `salaryMin`  — only records with a *stated* salary in `salaryCurrency`
 *        can match. Unstated salaries and other currencies are excluded.
 *      * `postedWithinDays` — only records with a `publishedAt` can match.
 *        Records with an unknown publication date are excluded.
 *  - `includeClosed: false` (the default) excludes `withdrawn` and `expired`
 *    records. `status: 'unknown'` is *not* closed and is included by default,
 *    because absence of a closure signal is not evidence of closure.
 */
export interface JobSearchQuery {
  /** Free text: title, employer, occupation, skills, summary. */
  text?: string;
  /** Canonical occupation ids; empty/omitted = any. */
  occupationIds?: string[];
  /** Free-text location match against city / region / country / raw. */
  locationText?: string;
  /** ISO-3166-1 alpha-2 codes, uppercase; empty/omitted = any. */
  countryCodes?: string[];
  /** Empty/omitted = any (including unknown). */
  workModes?: WorkMode[];
  /** Empty/omitted = any (including unknown). */
  employmentTypes?: EmploymentType[];
  /** Minimum stated annualised-comparable amount, in `salaryCurrency`. */
  salaryMin?: number | null;
  /** ISO-4217; required to give `salaryMin` meaning. */
  salaryCurrency?: string | null;
  /** Recency window in days. Excludes records with no `publishedAt`. */
  postedWithinDays?: number | null;
  /** Include `withdrawn` / `expired` records. Default false. */
  includeClosed?: boolean;
  sort?: SearchSort;
  /** Opaque pagination cursor from a previous page. `null` = first page. */
  cursor?: string | null;
  /** Page size. Adapters may clamp. */
  limit?: number;
}

/** Optional counts used to annotate filter controls. */
export interface JobSearchFacets {
  workMode?: Partial<Record<WorkMode, number>>;
  employmentType?: Partial<Record<EmploymentType, number>>;
  country?: Record<string, number>;
}

export interface JobSearchPage {
  items: JobOpportunity[];
  /**
   * Total matching records when the supply can count them, else `null`.
   * A `null` total must be rendered as "count unavailable", never as 0.
   */
  total: number | null;
  /** Cursor for the following page, or `null` at the end. */
  nextCursor: string | null;
  /** Cursor for the preceding page when the supply provides one. */
  prevCursor: string | null;
  facets?: JobSearchFacets;
  /** Adapter identity and honesty metadata, surfaced in the UI. */
  adapterId: string;
  kind: 'fixture' | 'live';
  /** When this page was produced (ISO, UTC). Drives the stale-data state. */
  fetchedAt: string;
  /** Milliseconds after which the page should be considered stale. */
  staleAfterMs: number;
  /** Server/query duration in ms, when measurable. */
  tookMs?: number;
}

/** A suggested occupation or location for typeahead/autocomplete. */
export interface SearchSuggestion {
  kind: 'occupation' | 'location' | 'country';
  value: string;
  label: string;
}

export interface JobSearchAdapter {
  /** Stable id, e.g. "fixture-v1" or "supply-api-v1". */
  readonly id: string;
  /** `fixture` drives the un-missable sample-data notice in the UI. */
  readonly kind: 'fixture' | 'live';
  /** Human label for the provenance strip, e.g. "Preview fixture data". */
  readonly label: string;
  /** Long-form honesty string rendered in the notice bar. */
  readonly notice: string;

  search(query: JobSearchQuery): Promise<JobSearchPage>;
  /** Resolve one opportunity by stable id. `null` when not found. */
  getById(id: string): Promise<JobOpportunity | null>;
  /** Optional typeahead. Adapters may omit it. */
  suggest?(term: string): Promise<SearchSuggestion[]>;
}

export const DEFAULT_PAGE_SIZE = 10;
/** Pages older than this (by `fetchedAt`) are shown as possibly stale. */
export const DEFAULT_STALE_AFTER_MS = 5 * 60 * 1000;

/** Apply contract defaults so every adapter sees the same normalised query. */
export function normaliseQuery(query: JobSearchQuery): Required<
  Pick<JobSearchQuery, 'limit' | 'includeClosed' | 'sort'>
> & JobSearchQuery {
  return {
    ...query,
    limit: clampPageSize(query.limit ?? DEFAULT_PAGE_SIZE),
    includeClosed: query.includeClosed ?? false,
    sort: query.sort ?? 'relevance',
  };
}

export function clampPageSize(limit: number): number {
  if (!Number.isFinite(limit)) return DEFAULT_PAGE_SIZE;
  return Math.min(50, Math.max(1, Math.trunc(limit)));
}
