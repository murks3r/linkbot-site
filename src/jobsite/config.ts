/**
 * Jobsite configuration.
 *
 * Everything here is overridable by environment so the preview never depends on
 * a production domain:
 *
 *   PUBLIC_SITE_ORIGIN       absolute origin used for canonical/og URLs.
 *                            Falls back to the request origin, then to
 *                            Astro's configured site. Never hardcoded.
 *   PUBLIC_SUPPLY_API_ORIGIN when set, the live canonical adapter is used
 *                            instead of fixtures. Unset in the preview.
 *
 * No secret ever belongs in a PUBLIC_ variable: these are inlined into the
 * client bundle by design.
 */

interface EnvLike {
  PUBLIC_SITE_ORIGIN?: string;
  PUBLIC_SUPPLY_API_ORIGIN?: string;
}

function readEnv(): EnvLike {
  const meta = import.meta as unknown as { env?: EnvLike };
  return meta.env ?? {};
}

/** Trimmed value or null (empty strings are treated as unset). */
function orNull(value: string | undefined): string | null {
  const trimmed = value?.trim();
  return trimmed && trimmed.length > 0 ? trimmed : null;
}

/** Absolute origin for canonical links, or null to stay relative. */
export function getSiteOrigin(): string | null {
  const configured = orNull(readEnv().PUBLIC_SITE_ORIGIN);
  if (configured) return configured.replace(/\/+$/, '');
  return null;
}

/** Canonical supply origin, or null while the backend is not wired. */
export function getSupplyApiOrigin(): string | null {
  return orNull(readEnv().PUBLIC_SUPPLY_API_ORIGIN)?.replace(/\/+$/, '') ?? null;
}

/** True while the jobsite is served from fixtures rather than live supply. */
export function isFixtureMode(): boolean {
  return getSupplyApiOrigin() === null;
}

/** Route helpers kept in one place so links cannot drift. */
export const JOBS_ROUTES = {
  index: '/jobs',
  saved: '/jobs/saved',
  detail: (id: string): string => `/jobs/${encodeURIComponent(id)}`,
} as const;
