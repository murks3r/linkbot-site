# Typed API contract — job discovery

Two layers, one seam:

1. **Domain contract** (`src/jobsite/types.ts`) — what the UI knows about an
   opportunity. Never shaped like any single upstream schema.
2. **Adapter contract** (`src/jobsite/adapter.ts`) — the only interface the UI
   calls. `FixtureSearchAdapter` and the canonical `HttpSearchAdapter` both
   implement it; nothing in the UI imports either.

Replacing fixtures with live supply is one configuration value plus a mapping
that already exists: `create-adapter.ts` picks `HttpSearchAdapter` when
`PUBLIC_SUPPLY_API_ORIGIN` is set.

## 1. Domain model

```ts
interface JobOpportunity {
  id: string;              // stable local id, used for routing. Never reused.
  canonicalId: string;     // canonical posting identity across sources (dedupe).
  title: string;
  occupation: { id: string; label: string };
  employer: { id: string | null; name: string; url: string | null };
  locations: JobLocation[];
  workMode: 'remote' | 'hybrid' | 'onsite' | 'unknown';
  employmentType: 'full_time' | 'part_time' | 'contract' | 'internship' | 'temporary' | 'unknown';
  salary: SalaryInfo;
  summary: string;         // one line, for a card
  description: string;     // longer plain text, for the detail view
  skills: string[];
  source: JobSource;       // provenance, mandatory
  publishedAt: string | null;   // ISO-8601 UTC, as stated by the source
  modifiedAt: string | null;    // ISO-8601 UTC, as stated by the source
  validThrough: string | null;  // ISO-8601 UTC; null = open-ended or unstated
  status: 'active' | 'withdrawn' | 'expired' | 'unknown';
  applyUrl: string | null;      // the ORIGINAL posting URL
  applicationMode: 'external' | 'unknown';
  language: string | null;      // BCP-47
}

interface JobLocation {
  city: string | null; region: string | null; country: string | null;
  countryCode: string | null;   // ISO-3166-1 alpha-2, uppercase
  raw: string;                  // the source string, verbatim
}

interface SalaryInfo {
  stated: boolean;              // if false, every other field is null
  min: number | null; max: number | null;
  currency: string | null;      // ISO-4217, uppercase
  period: 'year' | 'month' | 'week' | 'day' | 'hour' | 'unknown';
  note: string | null;          // "plus equity", "on-target earnings", …
}

interface JobSource {
  id: string; name: string; url: string | null;
  kind: 'ats' | 'job_board' | 'employer_site' | 'aggregator' | 'fixture';
  retrievedAt: string;          // when WE observed it. Always present, never null.
}
```

### Rules the UI depends on

- **Unknown is `null`.** Never `""`, `0`, `false`, "N/A" or a dash. A renderer
  that shows a placeholder instead of the Unknown state is a defect, because
  `null` (asked, no answer), `false` (an explicit negative) and `0` (a real zero)
  must stay distinguishable.
- **`stated: false` implies all compensation fields are `null`.** No partial
  bands.
- **Dates are ISO-8601 UTC strings** or `null`. Anything the parser cannot read
  becomes `null`, never an `Invalid Date`.
- **Provenance is mandatory.** Every record names the source it was observed
  from and when we observed it. `retrievedAt` is required; `url` may be null
  when the source exposes none — and then the UI says so rather than guessing
  a URL.
- **Identity is two-layered.** `id` is stable for routing. `canonicalId` is what
  survives re-publication: two records that are the same posting seen through
  two feeds share `canonicalId`. Deduplication must use `canonicalId`.
- **`applyUrl` is the original posting URL.** Linkbot never proxies an
  application in this codebase; `applicationMode: 'external'` is the only
  supported value, and a missing `applyUrl` forces `'unknown'`.

## 2. Search request

```ts
interface JobSearchQuery {
  text?: string;
  occupationIds?: string[];        // canonical occupation ids
  locationText?: string;           // free text against city/region/country/raw
  countryCodes?: string[];         // ISO-3166-1 alpha-2, uppercase
  workModes?: WorkMode[];
  employmentTypes?: EmploymentType[];
  salaryMin?: number | null;       // requires salaryCurrency to mean anything
  salaryCurrency?: string | null;  // ISO-4217
  postedWithinDays?: number | null;
  includeClosed?: boolean;         // default false
  sort?: 'relevance' | 'newest' | 'oldest' | 'salary_desc' | 'salary_asc';
  cursor?: string | null;          // opaque; null = first page
  limit?: number;                  // clamped to 1…50, default 10
}
```

### UNKNOWN semantics — the part every adapter must implement identically

| Filter state | Behaviour |
| --- | --- |
| Empty array / null / false | No constraint: matches everything, **including** records whose value is unknown. |
| `workModes: ['unknown']` | Matches exactly the records whose work mode is unknown. |
| `workModes: ['remote', 'unknown']` | Matches both. Unknown is never silently dropped. |
| `countryCodes: ['unknown']` | Matches records with no country code. |
| `salaryMin` set | **Excludes** records with unstated compensation, and records in a different currency. The record's stated ceiling is compared, so a band that could reach the threshold matches. Amounts are compared **exactly as posted**: periods are not converted (a €320/day contract cannot clear an €80,000 annual bar). |
| `postedWithinDays` set | **Excludes** records with no `publishedAt`: the predicate cannot be evaluated, so the record is dropped and the control says so. |
| `includeClosed: false` | Excludes `withdrawn` and `expired`. `status: 'unknown'` is **not** closed and stays visible — absence of a closure signal is not evidence of closure. |

The rule behind the table: a record is never dropped merely for being unknown.
It is dropped only when the *requested predicate cannot be evaluated for it* —
and in those two cases the UI states the consequence next to the control.

## 3. Search response

```ts
interface JobSearchPage {
  items: JobOpportunity[];
  total: number | null;        // null = the supply cannot count. Render as "unavailable", never 0.
  nextCursor: string | null;   // null at the end
  prevCursor: string | null;
  facets?: JobSearchFacets;    // optional; the fixture adapter supplies counts
  adapterId: string;           // e.g. "fixture-v1", "supply-api-v1"
  kind: 'fixture' | 'live';    // drives the sample-data notice. Must not lie.
  fetchedAt: string;           // ISO UTC; drives the stale-data state
  staleAfterMs: number;        // age at which the UI offers a refresh
  tookMs?: number;
}
```

## 4. Adapter interface

```ts
interface JobSearchAdapter {
  readonly id: string;
  readonly kind: 'fixture' | 'live';
  readonly label: string;    // shown in the notice bar
  readonly notice: string;   // long-form honesty string

  search(query: JobSearchQuery): Promise<JobSearchPage>;
  getById(id: string): Promise<JobOpportunity | null>;   // by local OR canonical id
  suggest?(term: string): Promise<SearchSuggestion[]>;   // optional typeahead
}
```

Failures **reject**. An adapter must never signal an error by resolving with an
empty page — the UI has distinct empty and error states and depends on the
difference.

## 5. Canonical (Universal Supply API) wire format

`HttpSearchAdapter` (written, unit-tested, not yet pointed at a live origin)
expects:

```
GET {PUBLIC_SUPPLY_API_ORIGIN}/v1/opportunities?<query>
GET {PUBLIC_SUPPLY_API_ORIGIN}/v1/opportunities/{id}
GET {PUBLIC_SUPPLY_API_ORIGIN}/v1/suggest?q=<term>
Accept: application/json
```

Request parameters (snake_case):

```
q, occupation, location, country, work_mode, employment_type,
salary_min, salary_currency, posted_within_days, include_closed,
sort, limit, cursor
```

Multi-value parameters are comma-joined. Defaults are omitted, except
`sort` and `limit`, which are always sent.

Response envelope:

```json
{
  "data": [ { "id": "...", "canonical_id": "...", "title": "...", "…": "…" } ],
  "page": { "next_cursor": "…", "prev_cursor": null, "total": 1234 },
  "meta": { "generated_at": "2026-10-09T10:00:00Z", "schema_version": "1.0" }
}
```

Single-record responses may wrap the record in `data` or return it at the top
level; both are accepted. `404` means "no such opportunity" (`getById` → `null`);
any other non-2xx throws.

### Mapping rules (all covered by `tests/jobsite-http-adapter.test.mjs`)

| Wire | Domain | Rule |
| --- | --- | --- |
| `work_mode`, `employment_type`, `status`, `source.kind` | same | Enum, matched case-insensitively with `-`/space → `_`. **Anything unrecognised becomes `'unknown'`** — a free-text field is never promoted into an enum value. |
| `compensation.min` / `.max` | `salary.min` / `.max` | Numbers or numeric strings. Missing → `null`, never `0`. |
| `compensation.stated` | `salary.stated` | Taken from the payload. If absent, inferred only when a currency **and** an amount exist. |
| `compensation.currency` | `salary.currency` | Uppercased. |
| `published_at`, `modified_at`, `valid_through`, `source.retrieved_at` | same | MUST parse as ISO-8601. Anything else → `null` (`retrieved_at` falls back to the epoch rather than pretending to be "now"). |
| `locations[].country_code` | `locations[].countryCode` | Uppercased. |
| `id`, `title` | same | **Required.** A record without either is dropped, not repaired. |
| `apply_url` | `applyUrl` | Absent → `applicationMode: 'unknown'`. |

## 6. What this contract does not cover yet

- **Personalisation and eligibility.** Discovery here is public and one-sided.
  Nothing in this contract exposes a candidate record, and the UI never claims
  a "match".
- **Live detail routes.** `/jobs/<id>` is statically generated from the adapter
  at build time, which only works for a bounded fixture set. With live supply it
  must become on-demand (SSR/edge) or fetch the record client-side by
  `canonicalId`.
- **Saved state and search watches** are browser-local in this preview. The
  product behaviour (a watch being evaluated by the private job agent, interest
  becoming a bounded disclosure) is described in the UI and unimplemented by
  design.
