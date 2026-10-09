/**
 * Jobsite domain model.
 *
 * These types are the boundary between the public job-discovery UI and whatever
 * supply the data comes from. They are deliberately *not* shaped like any single
 * upstream schema: adapters (fixture or HTTP) are responsible for mapping into
 * this model, so the UI never learns where an opportunity came from.
 *
 * Contract rules encoded here (see docs/jobsite/api-contract.md):
 *  - Every unknown/absent value is `null`, never a sentinel string, `0` or "".
 *  - Dates are ISO-8601 strings in UTC ("2026-08-31T09:00:00.000Z") or `null`.
 *  - Identity is two-layered: a stable local `id` (routing) and a
 *    `canonicalId` that survives source re-publication (deduplication).
 *  - Provenance is mandatory: every opportunity names where it was observed.
 */

/** How the work is performed. `unknown` is a real, selectable state. */
export type WorkMode = 'remote' | 'hybrid' | 'onsite' | 'unknown';

/** Contractual form of the engagement. `unknown` is a real state. */
export type EmploymentType =
  | 'full_time'
  | 'part_time'
  | 'contract'
  | 'internship'
  | 'temporary'
  | 'unknown';

/**
 * Validity of the posting. `active` means "not observed to be closed";
 * `withdrawn` / `expired` are observed closures; `unknown` means the source
 * did not state (or we did not observe) a validity signal.
 */
export type OpportunityStatus = 'active' | 'withdrawn' | 'expired' | 'unknown';

/** Pay period for a stated salary. `unknown` when stated but period is not. */
export type SalaryPeriod = 'year' | 'month' | 'week' | 'day' | 'hour' | 'unknown';

/** Where a source sits in the supply chain. `fixture` is preview-only. */
export type SourceKind =
  | 'ats'
  | 'job_board'
  | 'employer_site'
  | 'aggregator'
  | 'fixture';

/** How an application is completed. Only `external` links are permitted here. */
export type ApplicationMode = 'external' | 'unknown';

/**
 * A structured place. Every part may be unknown; `raw` keeps the source string
 * so the UI can show exactly what the source said when parsing is incomplete.
 */
export interface JobLocation {
  city: string | null;
  region: string | null;
  /** Display country name, e.g. "Germany". */
  country: string | null;
  /** ISO-3166-1 alpha-2, uppercase, e.g. "DE". */
  countryCode: string | null;
  /** The unparsed location string from the source, verbatim. */
  raw: string;
}

/**
 * Compensation. When `stated` is false every other field is `null` and the UI
 * must render the Unknown state — never a dash, a zero or an empty gap.
 */
export interface SalaryInfo {
  stated: boolean;
  min: number | null;
  max: number | null;
  /** ISO-4217, uppercase, e.g. "EUR". `null` when unstated. */
  currency: string | null;
  period: SalaryPeriod;
  /** Free-text qualifier from the source ("plus equity", "DOE"), or null. */
  note: string | null;
}

export interface JobEmployer {
  /** Stable employer id when the supply knows it; `null` otherwise. */
  id: string | null;
  name: string;
  /** Employer site. `null` when unknown — never a guessed URL. */
  url: string | null;
}

/** Provenance for one observation of an opportunity. */
export interface JobSource {
  id: string;
  name: string;
  /** URL of the observed posting on the source. `null` when unavailable. */
  url: string | null;
  kind: SourceKind;
  /** When *we* retrieved this record (ISO, UTC). Always present. */
  retrievedAt: string;
}

export interface JobOpportunity {
  /** Stable id used for routing. Must never change for the same record. */
  id: string;
  /**
   * Canonical posting identity. Two records that are the same posting seen
   * through different sources share this value, which is what makes
   * deduplication and re-publication tracking possible.
   */
  canonicalId: string;
  title: string;
  /** Canonical occupation, so filters do not depend on free-text titles. */
  occupation: { id: string; label: string };
  employer: JobEmployer;
  locations: JobLocation[];
  workMode: WorkMode;
  employmentType: EmploymentType;
  salary: SalaryInfo;
  /** Short plain-text summary suitable for a card. */
  summary: string;
  /** Longer plain-text description for the detail view. */
  description: string;
  /** Skills/keywords used for text search and matching. */
  skills: string[];
  source: JobSource;
  /** When the source says the posting was published. `null` when unstated. */
  publishedAt: string | null;
  /** When the source last changed it, if stated. */
  modifiedAt: string | null;
  /**
   * When the posting stops being valid, if the source states it. `null` means
   * open-ended or unstated — the two are distinguished by `status`.
   */
  validThrough: string | null;
  status: OpportunityStatus;
  /** The original posting URL a person applies through. `null` when unknown. */
  applyUrl: string | null;
  applicationMode: ApplicationMode;
  /** BCP-47 tag of the posting text. `null` when unstated. */
  language: string | null;
}

/* ------------------------------------------------------------------ *
 * Enumerations exposed to the UI (labels + glyph + state word).
 * Never render colour alone: colour + glyph + word, per brand rule.
 * ------------------------------------------------------------------ */

export const WORK_MODES: readonly WorkMode[] = [
  'remote',
  'hybrid',
  'onsite',
  'unknown',
];

export const EMPLOYMENT_TYPES: readonly EmploymentType[] = [
  'full_time',
  'part_time',
  'contract',
  'internship',
  'temporary',
  'unknown',
];

export const WORK_MODE_LABELS: Record<WorkMode, string> = {
  remote: 'Remote',
  hybrid: 'Hybrid',
  onsite: 'Onsite',
  unknown: 'Unknown',
};

export const EMPLOYMENT_TYPE_LABELS: Record<EmploymentType, string> = {
  full_time: 'Full-time',
  part_time: 'Part-time',
  contract: 'Contract',
  internship: 'Internship',
  temporary: 'Temporary',
  unknown: 'Unknown',
};

export const OPPORTUNITY_STATUS_LABELS: Record<OpportunityStatus, string> = {
  active: 'Active',
  withdrawn: 'Withdrawn',
  expired: 'Expired',
  unknown: 'Unknown',
};

export const SALARY_PERIOD_LABELS: Record<SalaryPeriod, string> = {
  year: 'per year',
  month: 'per month',
  week: 'per week',
  day: 'per day',
  hour: 'per hour',
  unknown: 'period unknown',
};
