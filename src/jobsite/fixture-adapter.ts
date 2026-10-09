/**
 * Fixture search adapter — the preview implementation of `JobSearchAdapter`.
 *
 * It is deliberately a *real* implementation of the contract (filtering,
 * UNKNOWN semantics, sorting, cursor pagination, provenance) so that the UI and
 * its tests exercise the same code paths the live adapter will have to satisfy.
 * It is NOT a jobs database: it holds an in-memory copy of the labelled fixture
 * set and persists nothing.
 */

import {
  DEFAULT_STALE_AFTER_MS,
  clampPageSize,
  normaliseQuery,
  type JobSearchAdapter,
  type JobSearchFacets,
  type JobSearchPage,
  type JobSearchQuery,
  type SearchSort,
  type SearchSuggestion,
} from './adapter.ts';
import type { EmploymentType, JobOpportunity, WorkMode } from './types.ts';
import {
  COUNTRY_NAMES,
  OCCUPATIONS,
  buildFixtureOpportunities,
} from './fixtures/opportunities.ts';

export interface FixtureAdapterOptions {
  /** Injectable clock for deterministic tests. */
  now?: () => Date;
  /** Artificial latency in ms so loading states are exercised. 0 in tests. */
  latencyMs?: number;
  /** Age after which a page is considered stale. */
  staleAfterMs?: number;
  /** Backdate `fetchedAt` by this many ms to exercise the stale state. */
  backdateMs?: number;
  /** Fail every search — used to exercise the error state in review. */
  failSearches?: boolean;
}

const CURSOR_PREFIX = 'fx1.';

export function encodeCursor(offset: number): string {
  return CURSOR_PREFIX + btoa(`o:${Math.max(0, Math.trunc(offset))}`);
}

export function decodeCursor(cursor: string | null | undefined): number {
  if (!cursor) return 0;
  if (!cursor.startsWith(CURSOR_PREFIX)) {
    throw new Error(`Unrecognised cursor: ${cursor.slice(0, 12)}…`);
  }
  const raw = atob(cursor.slice(CURSOR_PREFIX.length));
  const match = /^o:(\d+)$/.exec(raw);
  if (!match) throw new Error('Malformed cursor payload');
  return Number.parseInt(match[1], 10);
}

/** Searchable text for free-text matching, lower-cased once per record. */
function haystack(job: JobOpportunity): string {
  return [
    job.title,
    job.employer.name,
    job.occupation.label,
    job.summary,
    job.skills.join(' '),
    job.locations.map((l) => l.raw).join(' '),
  ]
    .join(' \u0000 ')
    .toLowerCase();
}

/** Relevance score for a set of lower-cased terms; 0 when any term is missing. */
function relevance(job: JobOpportunity, terms: string[]): number {
  if (terms.length === 0) return 0;
  const title = job.title.toLowerCase();
  const occupation = job.occupation.label.toLowerCase();
  const skills = job.skills.join(' ').toLowerCase();
  const employer = job.employer.name.toLowerCase();
  const summary = job.summary.toLowerCase();
  let score = 0;
  for (const term of terms) {
    if (title.includes(term)) score += 6;
    else if (occupation.includes(term)) score += 4;
    else if (skills.includes(term)) score += 3;
    else if (employer.includes(term)) score += 2;
    else if (summary.includes(term)) score += 1;
  }
  return score;
}

function matchesEnum(
  values: readonly string[] | undefined,
  value: string,
  unknownToken: string,
): boolean {
  if (!values || values.length === 0) return true;
  return values.some((v) => (v === unknownToken ? value === unknownToken : v === value));
}

function matchesText(
  job: JobOpportunity,
  text: string | undefined,
  terms: string[],
): boolean {
  if (!text || !text.trim()) return true;
  if (terms.length === 0) return true;
  const hay = haystack(job);
  return terms.every((term) => hay.includes(term));
}

/** Pure predicate: does this record satisfy the query? */
export function matchesQuery(
  job: JobOpportunity,
  query: JobSearchQuery,
  nowMs: number,
): boolean {
  const q = normaliseQuery(query);
  const terms = (q.text ?? '')
    .toLowerCase()
    .split(/\s+/)
    .map((t) => t.trim())
    .filter((t) => t.length > 0);

  if (!matchesText(job, q.text, terms)) return false;

  if (q.occupationIds && q.occupationIds.length > 0) {
    if (!q.occupationIds.includes(job.occupation.id)) return false;
  }

  if (q.workModes && q.workModes.length > 0) {
    if (!matchesEnum(q.workModes, job.workMode, 'unknown')) return false;
  }

  if (q.employmentTypes && q.employmentTypes.length > 0) {
    if (!matchesEnum(q.employmentTypes, job.employmentType, 'unknown')) return false;
  }

  if (q.countryCodes && q.countryCodes.length > 0) {
    const codes = job.locations.map((l) => l.countryCode);
    const ok = q.countryCodes.some((code) =>
      code === 'unknown' ? codes.some((c) => c === null) : codes.includes(code),
    );
    if (!ok) return false;
  }

  if (q.locationText && q.locationText.trim()) {
    const term = q.locationText.trim().toLowerCase();
    const ok = job.locations.some(
      (l) =>
        l.raw.toLowerCase().includes(term) ||
        (l.country ?? '').toLowerCase().includes(term),
    );
    if (!ok) return false;
  }

  if (q.salaryMin != null && Number.isFinite(q.salaryMin)) {
    // Only a *stated* salary in the requested currency can satisfy this filter.
    // The ceiling is compared, so a band that could reach the threshold matches.
    const s = job.salary;
    if (!s.stated || !s.currency) return false;
    if (q.salaryCurrency && s.currency.toUpperCase() !== q.salaryCurrency.toUpperCase()) {
      return false;
    }
    const ceiling = s.max ?? s.min;
    if (ceiling == null || ceiling < q.salaryMin) return false;
  }

  if (q.postedWithinDays != null && Number.isFinite(q.postedWithinDays)) {
    // A record with no publication date cannot prove freshness: excluded.
    if (!job.publishedAt) return false;
    const ageMs = nowMs - Date.parse(job.publishedAt);
    if (!(ageMs <= q.postedWithinDays * 24 * 60 * 60 * 1000)) return false;
  }

  if (!q.includeClosed && (job.status === 'withdrawn' || job.status === 'expired')) {
    return false;
  }

  return true;
}

function compareBySort(
  a: JobOpportunity,
  b: JobOpportunity,
  sort: SearchSort,
  scoreA: number,
  scoreB: number,
): number {
  switch (sort) {
    case 'newest':
      return dateValue(b.publishedAt) - dateValue(a.publishedAt) || a.id.localeCompare(b.id);
    case 'oldest':
      return dateValue(a.publishedAt) - dateValue(b.publishedAt) || a.id.localeCompare(b.id);
    case 'salary_desc':
      return salaryValue(b) - salaryValue(a) || a.id.localeCompare(b.id);
    case 'salary_asc':
      return salaryValue(a) - salaryValue(b) || a.id.localeCompare(b.id);
    case 'relevance':
    default:
      return scoreB - scoreA || dateValue(b.publishedAt) - dateValue(a.publishedAt) || a.id.localeCompare(b.id);
  }
}

/** Unknown dates sort last regardless of direction. */
function dateValue(iso: string | null): number {
  return iso ? Date.parse(iso) : Number.NEGATIVE_INFINITY;
}

/** Unknown salaries sort last regardless of direction. */
function salaryValue(job: JobOpportunity): number {
  if (!job.salary.stated) return Number.NEGATIVE_INFINITY;
  return job.salary.max ?? job.salary.min ?? Number.NEGATIVE_INFINITY;
}

function buildFacets(records: JobOpportunity[]): JobSearchFacets {
  const workMode: Partial<Record<WorkMode, number>> = {};
  const employmentType: Partial<Record<EmploymentType, number>> = {};
  const country: Record<string, number> = {};
  for (const job of records) {
    workMode[job.workMode] = (workMode[job.workMode] ?? 0) + 1;
    employmentType[job.employmentType] = (employmentType[job.employmentType] ?? 0) + 1;
    for (const loc of job.locations) {
      const key = loc.countryCode ?? 'unknown';
      country[key] = (country[key] ?? 0) + 1;
    }
  }
  return { workMode, employmentType, country };
}

export function createFixtureAdapter(options: FixtureAdapterOptions = {}): JobSearchAdapter {
  const now = options.now ?? (() => new Date());
  const latencyMs = options.latencyMs ?? 220;
  const staleAfterMs = options.staleAfterMs ?? DEFAULT_STALE_AFTER_MS;
  const backdateMs = options.backdateMs ?? 0;

  const load = (): JobOpportunity[] => buildFixtureOpportunities(now().getTime());

  const delay = (ms: number): Promise<void> =>
    ms > 0 ? new Promise((resolve) => setTimeout(resolve, ms)) : Promise.resolve();

  return {
    id: 'fixture-v1',
    kind: 'fixture',
    label: 'Preview fixture data',
    notice:
      'Sample data for preview only. Every employer, posting and URL here is synthetic ' +
      '(reserved example.com links), and none of it is a live job catalogue.',

    async search(query: JobSearchQuery): Promise<JobSearchPage> {
      const started = Date.now();
      await delay(latencyMs);
      if (options.failSearches) {
        throw new Error('Preview search failed: fixture adapter set to fail (review control).');
      }
      const q = normaliseQuery(query);
      const nowMs = now().getTime();
      const all = load();

      const matched = all.filter((job) => matchesQuery(job, q, nowMs));
      const terms = (q.text ?? '')
        .toLowerCase()
        .split(/\s+/)
        .map((t) => t.trim())
        .filter((t) => t.length > 0);

      const scored = matched.map((job) => ({ job, score: relevance(job, terms) }));
      scored.sort((a, b) => compareBySort(a.job, b.job, q.sort, a.score, b.score));

      const offset = decodeCursor(q.cursor);
      const limit = clampPageSize(q.limit);
      const page = scored.slice(offset, offset + limit).map((s) => s.job);
      const hasMore = offset + limit < scored.length;

      return {
        items: page,
        total: scored.length,
        nextCursor: hasMore ? encodeCursor(offset + limit) : null,
        prevCursor: offset > 0 ? encodeCursor(Math.max(0, offset - limit)) : null,
        facets: buildFacets(scored.map((s) => s.job)),
        adapterId: 'fixture-v1',
        kind: 'fixture',
        fetchedAt: new Date(nowMs - backdateMs).toISOString(),
        staleAfterMs,
        tookMs: Date.now() - started,
      };
    },

    async getById(id: string): Promise<JobOpportunity | null> {
      await delay(Math.min(latencyMs, 60));
      const all = load();
      return all.find((job) => job.id === id) ?? all.find((job) => job.canonicalId === id) ?? null;
    },

    async suggest(term: string): Promise<SearchSuggestion[]> {
      const needle = term.trim().toLowerCase();
      if (needle.length < 2) return [];
      const out: SearchSuggestion[] = [];
      for (const [value, label] of Object.entries(OCCUPATIONS)) {
        if (label.toLowerCase().includes(needle)) out.push({ kind: 'occupation', value, label });
      }
      for (const [code, name] of Object.entries(COUNTRY_NAMES)) {
        if (name.toLowerCase().includes(needle)) out.push({ kind: 'country', value: code, label: name });
      }
      for (const job of load()) {
        for (const loc of job.locations) {
          if (loc.city && loc.city.toLowerCase().includes(needle)) {
            out.push({ kind: 'location', value: loc.city, label: loc.city });
          }
        }
      }
      const seen = new Set<string>();
      return out
        .filter((s) => (seen.has(`${s.kind}:${s.value}`) ? false : (seen.add(`${s.kind}:${s.value}`), true)))
        .slice(0, 8);
    },
  };
}
