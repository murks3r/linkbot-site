/**
 * Canonical (Universal Supply API) adapter.
 *
 * This is the production path. It is written now, against the contract in
 * `docs/jobsite/api-contract.md`, so that wiring the real backend is a
 * configuration change rather than a UI change. It is inert until
 * `PUBLIC_SUPPLY_API_ORIGIN` is set.
 *
 * Mapping rules, all of which are tested:
 *  - A missing or unrecognised enum value maps to `'unknown'`, never to a
 *    plausible guess. Enum values are matched case-insensitively, but a
 *    free-text description ("fully remote", "remote_only") is never promoted
 *    into an enum value.
 *  - A missing numeric value maps to `null`, never to `0`.
 *  - Only ISO-8601 strings that `Date.parse` accepts survive; anything else
 *    becomes `null` rather than an Invalid Date.
 *  - `compensation.stated` is taken from the payload. If it is absent, the
 *    record is treated as unstated unless both a currency and an amount exist.
 */

import {
  DEFAULT_STALE_AFTER_MS,
  clampPageSize,
  normaliseQuery,
  type JobSearchAdapter,
  type JobSearchPage,
  type JobSearchQuery,
  type SearchSuggestion,
} from './adapter.ts';
import {
  EMPLOYMENT_TYPES,
  WORK_MODES,
  type ApplicationMode,
  type EmploymentType,
  type JobLocation,
  type JobOpportunity,
  type OpportunityStatus,
  type SalaryInfo,
  type SalaryPeriod,
  type SourceKind,
  type WorkMode,
} from './types.ts';

const STATUSES: readonly OpportunityStatus[] = ['active', 'withdrawn', 'expired', 'unknown'];
const SALARY_PERIODS: readonly SalaryPeriod[] = ['year', 'month', 'week', 'day', 'hour', 'unknown'];
const SOURCE_KINDS: readonly SourceKind[] = ['ats', 'job_board', 'employer_site', 'aggregator', 'fixture'];
const APPLICATION_MODES: readonly ApplicationMode[] = ['external', 'unknown'];

type Wire = Record<string, unknown>;

function asRecord(value: unknown): Wire | null {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
    ? (value as Wire)
    : null;
}

function asString(value: unknown): string | null {
  return typeof value === 'string' && value.trim().length > 0 ? value : null;
}

function asNumber(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return null;
}

function asIsoDate(value: unknown): string | null {
  const raw = asString(value);
  if (!raw) return null;
  const ms = Date.parse(raw);
  if (!Number.isFinite(ms)) return null;
  return new Date(ms).toISOString();
}

function asEnum<T extends string>(value: unknown, allowed: readonly T[]): T | 'unknown' {
  const raw = asString(value)?.toLowerCase().replace(/[\s-]+/g, '_');
  if (!raw) return 'unknown';
  return (allowed as readonly string[]).includes(raw) ? (raw as T) : 'unknown';
}

export function mapWireLocation(value: unknown): JobLocation {
  const wire = asRecord(value) ?? {};
  const city = asString(wire.city);
  const region = asString(wire.region);
  const country = asString(wire.country);
  const countryCode = asString(wire.country_code)?.toUpperCase() ?? null;
  const raw = asString(wire.raw) ?? [city, region, country].filter(Boolean).join(', ');
  return { city, region, country, countryCode, raw };
}

export function mapWireSalary(value: unknown): SalaryInfo {
  const wire = asRecord(value);
  const currency = asString(wire?.currency)?.toUpperCase() ?? null;
  const min = asNumber(wire?.min ?? wire?.minimum);
  const max = asNumber(wire?.max ?? wire?.maximum);
  const statedFlag = typeof wire?.stated === 'boolean' ? wire.stated : null;
  const period = asEnum(wire?.period, SALARY_PERIODS);
  // If the payload does not declare `stated`, the record counts as stated only
  // when there is a currency and at least one amount to show.
  const stated = statedFlag ?? Boolean(currency && (min !== null || max !== null));
  if (!stated) {
    return { stated: false, min: null, max: null, currency: null, period: 'unknown', note: null };
  }
  return {
    stated: true,
    min,
    max,
    currency,
    period: period === 'unknown' ? 'unknown' : period,
    note: asString(wire?.note),
  };
}

/** Map one canonical payload record into the domain model. */
export function mapWireOpportunity(value: unknown): JobOpportunity | null {
  const wire = asRecord(value);
  if (!wire) return null;
  const id = asString(wire.id);
  const title = asString(wire.title);
  if (!id || !title) return null; // identity and title are non-negotiable

  const occupationWire = asRecord(wire.occupation) ?? {};
  const employerWire = asRecord(wire.employer) ?? {};
  const sourceWire = asRecord(wire.source) ?? {};

  const locationsRaw = Array.isArray(wire.locations) ? wire.locations : [];
  const locations = locationsRaw.map(mapWireLocation);

  const applyUrl = asString(wire.apply_url);

  return {
    id,
    canonicalId: asString(wire.canonical_id) ?? id,
    title,
    occupation: {
      id: asString(occupationWire.id) ?? 'unknown',
      label: asString(occupationWire.label) ?? 'Unknown occupation',
    },
    employer: {
      id: asString(employerWire.id),
      name: asString(employerWire.name) ?? 'Unknown employer',
      url: asString(employerWire.url),
    },
    locations,
    workMode: asEnum(wire.work_mode, WORK_MODES) as WorkMode,
    employmentType: asEnum(wire.employment_type, EMPLOYMENT_TYPES) as EmploymentType,
    salary: mapWireSalary(wire.compensation ?? wire.salary),
    summary: asString(wire.summary) ?? '',
    description: asString(wire.description) ?? '',
    skills: Array.isArray(wire.skills)
      ? wire.skills.map(asString).filter((s): s is string => s !== null)
      : [],
    source: {
      id: asString(sourceWire.id) ?? 'unknown',
      name: asString(sourceWire.name) ?? 'Unknown source',
      url: asString(sourceWire.url),
      kind: asEnum(sourceWire.kind, SOURCE_KINDS) as SourceKind,
      retrievedAt: asIsoDate(sourceWire.retrieved_at) ?? new Date(0).toISOString(),
    },
    publishedAt: asIsoDate(wire.published_at),
    modifiedAt: asIsoDate(wire.modified_at),
    validThrough: asIsoDate(wire.valid_through),
    status: asEnum(wire.status, STATUSES) as OpportunityStatus,
    applyUrl,
    applicationMode: applyUrl
      ? (asEnum(wire.application_mode, APPLICATION_MODES) as ApplicationMode)
      : 'unknown',
    language: asString(wire.language),
  };
}

/** Serialise a query into the canonical query string. */
export function buildSearchParams(query: JobSearchQuery): URLSearchParams {
  const q = normaliseQuery(query);
  const params = new URLSearchParams();
  if (q.text?.trim()) params.set('q', q.text.trim());
  if (q.occupationIds?.length) params.set('occupation', q.occupationIds.join(','));
  if (q.locationText?.trim()) params.set('location', q.locationText.trim());
  if (q.countryCodes?.length) params.set('country', q.countryCodes.join(','));
  if (q.workModes?.length) params.set('work_mode', q.workModes.join(','));
  if (q.employmentTypes?.length) params.set('employment_type', q.employmentTypes.join(','));
  if (q.salaryMin != null) params.set('salary_min', String(q.salaryMin));
  if (q.salaryCurrency) params.set('salary_currency', q.salaryCurrency.toUpperCase());
  if (q.postedWithinDays != null) params.set('posted_within_days', String(q.postedWithinDays));
  if (q.includeClosed) params.set('include_closed', 'true');
  params.set('sort', q.sort);
  params.set('limit', String(clampPageSize(q.limit)));
  if (q.cursor) params.set('cursor', q.cursor);
  return params;
}

export interface HttpAdapterOptions {
  origin: string;
  /** Injected for tests. */
  fetchImpl?: typeof fetch;
  staleAfterMs?: number;
  /** Optional bearer token; never logged, never persisted. */
  token?: string;
}

export function createHttpAdapter(options: HttpAdapterOptions): JobSearchAdapter {
  const origin = options.origin.replace(/\/+$/, '');
  const doFetch = options.fetchImpl ?? fetch;
  const staleAfterMs = options.staleAfterMs ?? DEFAULT_STALE_AFTER_MS;

  const headers = (): HeadersInit => {
    const h: Record<string, string> = { Accept: 'application/json' };
    if (options.token) h.Authorization = `Bearer ${options.token}`;
    return h;
  };

  return {
    id: 'supply-api-v1',
    kind: 'live',
    label: 'Universal Supply API',
    notice: 'Live supply. Provenance and validity reflect what the source reported.',

    async search(query: JobSearchQuery): Promise<JobSearchPage> {
      const url = `${origin}/v1/opportunities?${buildSearchParams(query).toString()}`;
      const response = await doFetch(url, { headers: headers() });
      if (!response.ok) {
        throw new Error(`Supply API responded ${response.status} ${response.statusText}`);
      }
      const body = asRecord(await response.json());
      const data = Array.isArray(body?.data) ? body.data : [];
      const page = asRecord(body?.page) ?? {};
      const meta = asRecord(body?.meta) ?? {};
      const items = data
        .map(mapWireOpportunity)
        .filter((job): job is JobOpportunity => job !== null);
      const total = asNumber(page.total);
      return {
        items,
        total,
        nextCursor: asString(page.next_cursor),
        prevCursor: asString(page.prev_cursor),
        adapterId: 'supply-api-v1',
        kind: 'live',
        fetchedAt: asIsoDate(meta.generated_at) ?? new Date().toISOString(),
        staleAfterMs,
      };
    },

    async getById(id: string): Promise<JobOpportunity | null> {
      const url = `${origin}/v1/opportunities/${encodeURIComponent(id)}`;
      const response = await doFetch(url, { headers: headers() });
      if (response.status === 404) return null;
      if (!response.ok) {
        throw new Error(`Supply API responded ${response.status} ${response.statusText}`);
      }
      const body = asRecord(await response.json());
      return mapWireOpportunity(body?.data ?? body);
    },

    async suggest(term: string): Promise<SearchSuggestion[]> {
      if (term.trim().length < 2) return [];
      const url = `${origin}/v1/suggest?q=${encodeURIComponent(term.trim())}`;
      const response = await doFetch(url, { headers: headers() });
      if (!response.ok) return [];
      const body = asRecord(await response.json());
      const data = Array.isArray(body?.data) ? body.data : [];
      return data
        .map(asRecord)
        .filter((r): r is Wire => r !== null)
        .map((r) => ({
          kind: (asEnum(r.kind, ['occupation', 'location', 'country'] as const) === 'unknown'
            ? 'occupation'
            : (r.kind as SearchSuggestion['kind'])),
          value: asString(r.value) ?? '',
          label: asString(r.label) ?? asString(r.value) ?? '',
        }))
        .filter((s) => s.value.length > 0);
    },
  };
}
