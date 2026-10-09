/**
 * Adapter selection — the one place that decides between fixtures and live
 * supply. Nothing in the UI imports a concrete adapter, so swapping supply is a
 * configuration change (set `PUBLIC_SUPPLY_API_ORIGIN`) rather than a refactor.
 */

import { DEFAULT_STALE_AFTER_MS, type JobSearchAdapter } from './adapter.ts';
import { createFixtureAdapter } from './fixture-adapter.ts';
import { createHttpAdapter } from './http-adapter.ts';
import { getSupplyApiOrigin } from './config.ts';
import type { ReviewFlags } from './lib/url-state.ts';

export interface SelectAdapterOptions {
  /** Review-only overrides (from URL flags). Never set for a normal visitor. */
  review?: Partial<ReviewFlags>;
  /** Overrides the configured origin. `undefined` reads the environment. */
  supplyApiOrigin?: string | null;
  /** Injectable clock, for deterministic tests. */
  now?: () => Date;
  /** Default simulated latency in fixture mode. */
  latencyMs?: number;
}

export const DEFAULT_FIXTURE_LATENCY_MS = 220;

export function selectJobSearchAdapter(options: SelectAdapterOptions = {}): JobSearchAdapter {
  const review: ReviewFlags = {
    stale: false,
    fail: false,
    forceFixture: false,
    latencyMs: null,
    ...options.review,
  };
  const origin =
    options.supplyApiOrigin === undefined ? getSupplyApiOrigin() : options.supplyApiOrigin;

  if (origin && !review.forceFixture) {
    return createHttpAdapter({ origin });
  }

  return createFixtureAdapter({
    now: options.now,
    latencyMs: review.latencyMs ?? options.latencyMs ?? DEFAULT_FIXTURE_LATENCY_MS,
    // Backdate the page so the stale-data state is exercised in review.
    backdateMs: review.stale ? DEFAULT_STALE_AFTER_MS + 60_000 : 0,
    failSearches: review.fail,
  });
}

/** Whether the current configuration will serve fixtures rather than live data. */
export function willUseFixtures(options: SelectAdapterOptions = {}): boolean {
  const origin =
    options.supplyApiOrigin === undefined ? getSupplyApiOrigin() : options.supplyApiOrigin;
  return !origin || options.review?.forceFixture === true;
}
