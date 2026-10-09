/**
 * Presentation helpers. Pure and clock-injectable so they are unit-testable.
 *
 * Rule: an unknown value is rendered as an explicit Unknown *state* by the UI
 * component, never by these helpers returning "" or "—". These functions return
 * `null` for unknown, and the component decides how to show it.
 */

import {
  EMPLOYMENT_TYPE_LABELS,
  SALARY_PERIOD_LABELS,
  WORK_MODE_LABELS,
  type EmploymentType,
  type JobOpportunity,
  type SalaryInfo,
  type WorkMode,
} from '../types.ts';

export type FreshnessBucket = 'fresh' | 'recent' | 'older' | 'unknown';

export interface Freshness {
  bucket: FreshnessBucket;
  /** Short absolute date for the card, e.g. "31 Aug 2026". null when unknown. */
  date: string | null;
  /** Relative phrase, e.g. "3 days ago". null when unknown. */
  relative: string | null;
}

const DAY_MS = 24 * 60 * 60 * 1000;

const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

/** Deterministic absolute date (UTC), e.g. "31 Aug 2026". */
export function formatDate(iso: string | null | undefined): string | null {
  if (!iso) return null;
  const ms = Date.parse(iso);
  if (!Number.isFinite(ms)) return null;
  const d = new Date(ms);
  return `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

/** Deterministic date + time (UTC), e.g. "31 Aug 2026, 09:00 UTC". */
export function formatDateTime(iso: string | null | undefined): string | null {
  if (!iso) return null;
  const ms = Date.parse(iso);
  if (!Number.isFinite(ms)) return null;
  const d = new Date(ms);
  const hh = String(d.getUTCHours()).padStart(2, '0');
  const mm = String(d.getUTCMinutes()).padStart(2, '0');
  return `${formatDate(iso)}, ${hh}:${mm} UTC`;
}

/** Relative phrase from a past instant. Future instants read as "in the future". */
export function relativeFromNow(iso: string | null | undefined, nowMs: number): string | null {
  if (!iso) return null;
  const ms = Date.parse(iso);
  if (!Number.isFinite(ms)) return null;
  const diff = nowMs - ms;
  if (diff < 0) return 'in the future';
  const days = Math.floor(diff / DAY_MS);
  if (days <= 0) return 'today';
  if (days === 1) return '1 day ago';
  if (days < 30) return `${days} days ago`;
  const months = Math.floor(days / 30);
  if (months === 1) return '1 month ago';
  if (months < 12) return `${months} months ago`;
  const years = Math.floor(days / 365);
  return years <= 1 ? '1 year ago' : `${years} years ago`;
}

/** Freshness of a posting, from its publication date. */
export function freshness(publishedAt: string | null, nowMs: number): Freshness {
  const date = formatDate(publishedAt);
  const relative = relativeFromNow(publishedAt, nowMs);
  if (!publishedAt || !date) return { bucket: 'unknown', date: null, relative: null };
  const ms = Date.parse(publishedAt);
  const ageDays = (nowMs - ms) / DAY_MS;
  if (ageDays <= 7) return { bucket: 'fresh', date, relative };
  if (ageDays <= 30) return { bucket: 'recent', date, relative };
  return { bucket: 'older', date, relative };
}

export const FRESHNESS_LABELS: Record<FreshnessBucket, string> = {
  fresh: 'New',
  recent: 'Recent',
  older: 'Older',
  unknown: 'Freshness unknown',
};

const CURRENCY_SYMBOLS: Record<string, string> = {
  EUR: '€', USD: '$', GBP: '£', CHF: 'CHF ', PLN: 'PLN ', SEK: 'SEK ',
};

function group(n: number): string {
  return n.toLocaleString('en-US');
}

/**
 * Format a stated salary. Returns `null` when unstated: the caller must render
 * the Unknown state rather than a placeholder.
 */
export function formatSalary(salary: SalaryInfo): string | null {
  if (!salary.stated) return null;
  const symbol = salary.currency ? CURRENCY_SYMBOLS[salary.currency] ?? `${salary.currency} ` : '';
  const period = SALARY_PERIOD_LABELS[salary.period] ?? 'period unknown';
  const min = salary.min;
  const max = salary.max;
  let amount: string;
  if (min != null && max != null && max !== min) {
    amount = `${symbol}${group(min)}–${group(max)}`;
  } else if (min != null) {
    amount = `${symbol}${group(min)}`;
  } else if (max != null) {
    amount = `up to ${symbol}${group(max)}`;
  } else {
    amount = 'amount not stated';
  }
  const annualisedComparable = salary.period === 'year' ? '' : ' (as posted)';
  return `${amount} ${period}${annualisedComparable}`;
}

export function workModeLabel(mode: WorkMode): string {
  return WORK_MODE_LABELS[mode] ?? 'Unknown';
}

export function employmentTypeLabel(type: EmploymentType): string {
  return EMPLOYMENT_TYPE_LABELS[type] ?? 'Unknown';
}

/** One-line location for a card: city, region, country or the raw string. */
export function primaryLocation(job: JobOpportunity): string | null {
  const first = job.locations[0];
  if (!first) return null;
  const parts = [first.city, first.country].filter((p): p is string => Boolean(p));
  if (parts.length > 0) return parts.join(', ');
  return first.raw.length > 0 ? first.raw : null;
}

/** Hostname of an external URL, for link labels. null when unparseable. */
export function hostOf(url: string | null | undefined): string | null {
  if (!url) return null;
  try {
    return new URL(url).host;
  } catch {
    return null;
  }
}

export function compactNumber(value: number | null): string {
  if (value === null || !Number.isFinite(value)) return 'unavailable';
  return group(value);
}
