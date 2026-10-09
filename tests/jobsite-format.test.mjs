/**
 * Formatting tests: unknown values must be reported as null (so the component
 * can render the explicit Unknown state), never as "", "—" or a zero.
 */
import assert from 'node:assert/strict';
import test from 'node:test';

import {
  compactNumber,
  formatDate,
  formatDateTime,
  formatSalary,
  freshness,
  hostOf,
  primaryLocation,
  relativeFromNow,
} from '../src/jobsite/lib/format.ts';
import { buildFixtureOpportunities } from '../src/jobsite/fixtures/opportunities.ts';

const NOW_MS = Date.parse('2026-10-09T12:00:00.000Z');

test('dates format deterministically in UTC', () => {
  assert.equal(formatDate('2026-08-31T09:00:00.000Z'), '31 Aug 2026');
  assert.equal(formatDateTime('2026-08-31T09:05:00.000Z'), '31 Aug 2026, 09:05 UTC');
  assert.equal(formatDate(null), null);
  assert.equal(formatDate('not-a-date'), null);
});

test('relative phrases read naturally and never go negative', () => {
  assert.equal(relativeFromNow('2026-10-09T06:00:00.000Z', NOW_MS), 'today');
  assert.equal(relativeFromNow('2026-10-08T12:00:00.000Z', NOW_MS), '1 day ago');
  assert.equal(relativeFromNow('2026-10-02T12:00:00.000Z', NOW_MS), '7 days ago');
  assert.equal(relativeFromNow('2026-09-04T12:00:00.000Z', NOW_MS), '1 month ago');
  assert.equal(relativeFromNow('2026-10-20T12:00:00.000Z', NOW_MS), 'in the future');
  assert.equal(relativeFromNow(null, NOW_MS), null);
});

test('freshness buckets are stable at the boundaries', () => {
  assert.equal(freshness('2026-10-05T12:00:00.000Z', NOW_MS).bucket, 'fresh');
  assert.equal(freshness('2026-10-01T12:00:00.000Z', NOW_MS).bucket, 'recent');
  assert.equal(freshness('2026-08-01T12:00:00.000Z', NOW_MS).bucket, 'older');
  const unknown = freshness(null, NOW_MS);
  assert.equal(unknown.bucket, 'unknown');
  assert.equal(unknown.date, null);
  assert.equal(unknown.relative, null);
});

test('a stated salary formats as a band, in the stated period', () => {
  const text = formatSalary({
    stated: true,
    min: 85000,
    max: 105000,
    currency: 'EUR',
    period: 'year',
    note: 'plus equity',
  });
  assert.equal(text, '€85,000–105,000 per year');
});

test('an unstated salary is null, not a placeholder', () => {
  assert.equal(
    formatSalary({ stated: false, min: null, max: null, currency: null, period: 'unknown', note: null }),
    null,
  );
});

test('a non-annual amount is labelled as posted, not converted', () => {
  const text = formatSalary({
    stated: true,
    min: 320,
    max: null,
    currency: 'EUR',
    period: 'day',
    note: null,
  });
  assert.equal(text, '€320 per day (as posted)');
});

test('hosts are reported only when the URL is parseable', () => {
  assert.equal(hostOf('https://example.com/apply/opp-0001'), 'example.com');
  assert.equal(hostOf('not a url'), null);
  assert.equal(hostOf(null), null);
});

test('compensation counts render deterministically', () => {
  assert.equal(compactNumber(1234), '1,234');
  assert.equal(compactNumber(null), 'unavailable');
});

test('primary location degrades from city+country to the raw source string', () => {
  const all = buildFixtureOpportunities(NOW_MS);
  const berlin = all.find((j) => j.id === 'opp-0001');
  assert.equal(primaryLocation(berlin), 'Berlin, Germany');

  const remote = all.find((j) => j.id === 'opp-0003');
  assert.equal(primaryLocation(remote), 'United Kingdom');

  const none = all.find((j) => j.id === 'opp-0042');
  assert.equal(primaryLocation(none), 'Berlin, Germany');
});
