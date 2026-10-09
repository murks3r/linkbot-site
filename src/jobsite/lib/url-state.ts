/**
 * URL state.
 *
 * The URL is the source of truth for a search, so any result set is
 * shareable and the back button works. Parsing is total: unknown or malformed
 * values are ignored rather than throwing, and never silently become a filter
 * that changes meaning (e.g. "wm=banana" is dropped, not treated as remote).
 */

import { SORT_LABELS, type JobSearchQuery, type SearchSort } from '../adapter.ts';
import {
  EMPLOYMENT_TYPES,
  WORK_MODES,
  type EmploymentType,
  type WorkMode,
} from '../types.ts';

const SORTS = Object.keys(SORT_LABELS) as SearchSort[];

/** Review-only switches. They never appear in a normal visitor flow. */
export interface ReviewFlags {
  /** Backdate `fetchedAt` so the stale-data state renders. */
  stale: boolean;
  /** Force the search to fail so the error state renders. */
  fail: boolean;
  /** Use fixtures even when a supply origin is configured. */
  forceFixture: boolean;
  /** Override simulated latency (ms). */
  latencyMs: number | null;
}

export const EMPTY_REVIEW_FLAGS: ReviewFlags = {
  stale: false,
  fail: false,
  forceFixture: false,
  latencyMs: null,
};

function splitList(value: string | null): string[] {
  if (!value) return [];
  return value
    .split(',')
    .map((v) => v.trim())
    .filter((v) => v.length > 0);
}

function onlyAllowed<T extends string>(values: string[], allowed: readonly T[]): T[] {
  const set = new Set<string>(allowed);
  return values.filter((v): v is T => set.has(v));
}

function intOrNull(value: string | null): number | null {
  if (value === null || value.trim() === '') return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? Math.trunc(parsed) : null;
}

function floatOrNull(value: string | null): number | null {
  if (value === null || value.trim() === '') return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

export function parseReviewFlags(params: URLSearchParams): ReviewFlags {
  return {
    stale: params.get('review_stale') === '1',
    fail: params.get('review_fail') === '1',
    forceFixture: params.get('review_fixture') === '1',
    latencyMs: intOrNull(params.get('review_latency')),
  };
}

/** Parse a search query from URL parameters. Never throws. */
export function parseSearchQuery(params: URLSearchParams): JobSearchQuery {
  const sortParam = params.get('sort');
  const sort = SORTS.includes(sortParam as SearchSort) ? (sortParam as SearchSort) : 'relevance';

  const workModes = onlyAllowed(splitList(params.get('wm')), WORK_MODES) as WorkMode[];
  const employmentTypes = onlyAllowed(
    splitList(params.get('et')),
    EMPLOYMENT_TYPES,
  ) as EmploymentType[];
  const countryCodes = splitList(params.get('country')).map((c) => c.toUpperCase());

  return {
    text: params.get('q')?.trim() || undefined,
    occupationIds: splitList(params.get('occ')),
    locationText: params.get('loc')?.trim() || undefined,
    countryCodes,
    workModes,
    employmentTypes,
    salaryMin: floatOrNull(params.get('sal')),
    salaryCurrency: params.get('cur')?.trim().toUpperCase() || null,
    postedWithinDays: intOrNull(params.get('since')),
    includeClosed: params.get('closed') === '1',
    sort,
    cursor: params.get('cursor'),
  };
}

/**
 * Serialise a query back into URL parameters, omitting everything that is at
 * its default so links stay short and diffable.
 */
export function toSearchParams(query: JobSearchQuery): URLSearchParams {
  const params = new URLSearchParams();
  if (query.text?.trim()) params.set('q', query.text.trim());
  if (query.occupationIds?.length) params.set('occ', query.occupationIds.join(','));
  if (query.locationText?.trim()) params.set('loc', query.locationText.trim());
  if (query.countryCodes?.length) params.set('country', query.countryCodes.join(','));
  if (query.workModes?.length) params.set('wm', query.workModes.join(','));
  if (query.employmentTypes?.length) params.set('et', query.employmentTypes.join(','));
  if (query.salaryMin != null) params.set('sal', String(query.salaryMin));
  if (query.salaryCurrency) params.set('cur', query.salaryCurrency.toUpperCase());
  if (query.postedWithinDays != null) params.set('since', String(query.postedWithinDays));
  if (query.includeClosed) params.set('closed', '1');
  if (query.sort && query.sort !== 'relevance') params.set('sort', query.sort);
  if (query.cursor) params.set('cursor', query.cursor);
  return params;
}

/** Number of user-visible filters in effect; drives the "clear (N)" affordance. */
export function countActiveFilters(query: JobSearchQuery): number {
  let n = 0;
  if (query.text?.trim()) n += 1;
  if (query.occupationIds?.length) n += 1;
  if (query.locationText?.trim()) n += 1;
  if (query.countryCodes?.length) n += 1;
  if (query.workModes?.length) n += 1;
  if (query.employmentTypes?.length) n += 1;
  if (query.salaryMin != null) n += 1;
  if (query.postedWithinDays != null) n += 1;
  if (query.includeClosed) n += 1;
  return n;
}

/** Toggle a value in a multi-select list, returning a new array. */
export function toggleValue<T extends string>(list: readonly T[] | undefined, value: T): T[] {
  const current = list ? [...list] : [];
  const index = current.indexOf(value);
  if (index >= 0) current.splice(index, 1);
  else current.push(value);
  return current;
}
