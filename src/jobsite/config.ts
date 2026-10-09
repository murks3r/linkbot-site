/**
 * Jobsite configuration.
 *
 * Only *supply* is configured here. The canonical origin is not a jobsite
 * setting: it is resolved once for the whole build in astro.config.mjs
 * (src/lib/site-origin.mjs) and read as `Astro.site`, so the marketing pages,
 * the jobsite, the sitemap and robots.txt cannot disagree. There is no
 * PUBLIC_SITE_ORIGIN.
 *
 *   PUBLIC_SUPPLY_API_ORIGIN when set, the live canonical adapter is used
 *                            instead of fixtures. Unset in the preview.
 *
 * No secret ever belongs in a PUBLIC_ variable: those are inlined into the
 * client bundle by design.
 */

interface EnvLike {
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
