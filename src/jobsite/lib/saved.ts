/**
 * Saved jobs and search watches.
 *
 * Both live in the visitor's own browser only — there is no server-side list,
 * no account, and nothing leaves the device. That is a deliberate product
 * boundary for the preview: saving is a *local* bookmark, and "watching a
 * search" is a local note of an intent (see docs/jobsite/api-contract.md).
 *
 * The store is injectable so it can be unit-tested without a DOM.
 */

import type { JobOpportunity } from '../types.ts';
import { EMPLOYMENT_TYPE_LABELS, WORK_MODE_LABELS } from '../types.ts';
import type { JobSearchQuery } from '../adapter.ts';
import { toSearchParams } from './url-state.ts';

export const SAVED_STORAGE_KEY = 'linkbot.jobsite.saved.v1';

export interface SavedJob {
  id: string;
  canonicalId: string;
  title: string;
  employer: string;
  savedAt: string;
}

export interface SearchWatch {
  /** Serialised query string — the same shape the URL uses. */
  query: string;
  label: string;
  createdAt: string;
}

/**
 * A locally recorded expressed interest. In the product this becomes a bounded
 * disclosure request carried by the private job agent; in the preview it is a
 * marker in this browser only, and the UI says so.
 */
export interface ExpressedInterest {
  id: string;
  title: string;
  employer: string;
  expressedAt: string;
}

export interface SavedState {
  jobs: SavedJob[];
  watches: SearchWatch[];
  interests: ExpressedInterest[];
}

export interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

export const EMPTY_SAVED: SavedState = { jobs: [], watches: [], interests: [] };

function isSavedJob(value: unknown): value is SavedJob {
  const v = value as Partial<SavedJob> | null;
  return Boolean(v && typeof v.id === 'string' && typeof v.title === 'string');
}

function isWatch(value: unknown): value is SearchWatch {
  const v = value as Partial<SearchWatch> | null;
  return Boolean(v && typeof v.query === 'string' && typeof v.label === 'string');
}

function isInterest(value: unknown): value is ExpressedInterest {
  const v = value as Partial<ExpressedInterest> | null;
  return Boolean(v && typeof v.id === 'string' && typeof v.title === 'string');
}

/** Read persisted state defensively: corrupt storage yields an empty state. */
export function loadSaved(storage: StorageLike | null): SavedState {
  if (!storage) return EMPTY_SAVED;
  try {
    const raw = storage.getItem(SAVED_STORAGE_KEY);
    if (!raw) return EMPTY_SAVED;
    const parsed = JSON.parse(raw) as Partial<SavedState>;
    return {
      jobs: Array.isArray(parsed.jobs) ? parsed.jobs.filter(isSavedJob) : [],
      watches: Array.isArray(parsed.watches) ? parsed.watches.filter(isWatch) : [],
      interests: Array.isArray(parsed.interests) ? parsed.interests.filter(isInterest) : [],
    };
  } catch {
    return EMPTY_SAVED;
  }
}

export function persistSaved(storage: StorageLike | null, state: SavedState): void {
  if (!storage) return;
  try {
    storage.setItem(SAVED_STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* storage full or unavailable: saving is best-effort */
  }
}

export function isJobSaved(state: SavedState, id: string): boolean {
  return state.jobs.some((job) => job.id === id);
}

export function toggleSavedJob(state: SavedState, job: JobOpportunity, nowIso: string): SavedState {
  const exists = isJobSaved(state, job.id);
  const jobs = exists
    ? state.jobs.filter((j) => j.id !== job.id)
    : [
        ...state.jobs,
        {
          id: job.id,
          canonicalId: job.canonicalId,
          title: job.title,
          employer: job.employer.name,
          savedAt: nowIso,
        },
      ];
  return { ...state, jobs };
}

export function toggleSavedSearch(state: SavedState, query: JobSearchQuery, nowIso: string): SavedState {
  const queryString = toSearchParams(query).toString();
  const exists = state.watches.some((w) => w.query === queryString);
  const watches = exists
    ? state.watches.filter((w) => w.query !== queryString)
    : [...state.watches, { query: queryString, label: describeQuery(query), createdAt: nowIso }];
  return { ...state, watches };
}

export function isSearchWatched(state: SavedState, query: JobSearchQuery): boolean {
  const queryString = toSearchParams(query).toString();
  return state.watches.some((w) => w.query === queryString);
}

export function isInterestExpressed(state: SavedState, id: string): boolean {
  return state.interests.some((i) => i.id === id);
}

/**
 * Record (or withdraw) a locally expressed interest. One-sided by nature: it
 * creates no match, no application and no disclosure.
 */
export function toggleInterest(
  state: SavedState,
  job: JobOpportunity,
  nowIso: string,
): SavedState {
  const exists = isInterestExpressed(state, job.id);
  const interests = exists
    ? state.interests.filter((i) => i.id !== job.id)
    : [
        ...state.interests,
        {
          id: job.id,
          title: job.title,
          employer: job.employer.name,
          expressedAt: nowIso,
        },
      ];
  return { ...state, interests };
}

/** Human label for a watch, e.g. "senior backend · Remote · Germany". */
export function describeQuery(query: JobSearchQuery): string {
  const parts: string[] = [];
  if (query.text?.trim()) parts.push(query.text.trim());
  if (query.occupationIds?.length) parts.push(query.occupationIds.length === 1 ? '1 occupation' : `${query.occupationIds.length} occupations`);
  if (query.workModes?.length) {
    parts.push(query.workModes.map((m) => WORK_MODE_LABELS[m] ?? 'Unknown').join(' / '));
  }
  if (query.employmentTypes?.length) {
    parts.push(query.employmentTypes.map((t) => EMPLOYMENT_TYPE_LABELS[t] ?? 'Unknown').join(' / '));
  }
  if (query.countryCodes?.length) parts.push(query.countryCodes.join(', '));
  if (query.locationText?.trim()) parts.push(query.locationText.trim());
  if (query.salaryMin != null) parts.push(`≥ ${query.salaryMin} ${query.salaryCurrency ?? ''}`.trim());
  if (query.postedWithinDays != null) parts.push(`last ${query.postedWithinDays} days`);
  if (query.includeClosed) parts.push('incl. closed');
  return parts.length > 0 ? parts.join(' · ') : 'All opportunities';
}

/* --------------------------------------------------------------- *
 * Reactive store, so several components can share one saved state.
 * --------------------------------------------------------------- */

export interface SavedStore {
  getState(): SavedState;
  subscribe(listener: (state: SavedState) => void): () => void;
  toggleJob(job: JobOpportunity): void;
  removeJob(id: string): void;
  toggleSearch(query: JobSearchQuery): void;
  /** Remove by the serialised query string (a watch's identity). */
  removeWatch(queryString: string): void;
  toggleInterest(job: JobOpportunity): void;
  removeInterest(id: string): void;
  clear(): void;
}

function defaultStorage(): StorageLike | null {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return null;
    return window.localStorage;
  } catch {
    return null;
  }
}

export function createSavedStore(
  storage: StorageLike | null = defaultStorage(),
  now: () => Date = () => new Date(),
): SavedStore {
  let state = loadSaved(storage);
  const listeners = new Set<(s: SavedState) => void>();

  const commit = (next: SavedState): void => {
    state = next;
    persistSaved(storage, state);
    for (const listener of listeners) listener(state);
  };

  return {
    getState: () => state,
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    toggleJob(job) {
      commit(toggleSavedJob(state, job, now().toISOString()));
    },
    removeJob(id) {
      commit({ ...state, jobs: state.jobs.filter((j) => j.id !== id) });
    },
    toggleSearch(query) {
      commit(toggleSavedSearch(state, query, now().toISOString()));
    },
    removeWatch(queryString) {
      commit({ ...state, watches: state.watches.filter((w) => w.query !== queryString) });
    },
    toggleInterest(job) {
      commit(toggleInterest(state, job, now().toISOString()));
    },
    removeInterest(id) {
      commit({ ...state, interests: state.interests.filter((i) => i.id !== id) });
    },
    clear() {
      commit({ jobs: [], watches: [], interests: [] });
    },
  };
}
