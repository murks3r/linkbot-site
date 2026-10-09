/**
 * Fixture adapter + adapter-contract tests.
 *
 * These are the executable form of the UNKNOWN semantics documented in
 * src/jobsite/adapter.ts. If someone "simplifies" a filter so that an unknown
 * value is silently dropped — or silently matched — these fail.
 */
import assert from 'node:assert/strict';
import test from 'node:test';

import {
  DEFAULT_PAGE_SIZE,
  clampPageSize,
  normaliseQuery,
} from '../src/jobsite/adapter.ts';
import {
  createFixtureAdapter,
  decodeCursor,
  encodeCursor,
} from '../src/jobsite/fixture-adapter.ts';
import { FIXTURE_SEED_COUNT, buildFixtureOpportunities } from '../src/jobsite/fixtures/opportunities.ts';

const NOW = () => new Date('2026-10-09T12:00:00.000Z');
const NOW_MS = NOW().getTime();

/** Fixture adapter with no artificial latency and a frozen clock. */
const adapter = createFixtureAdapter({ now: NOW, latencyMs: 0 });

/** Ids used as contract fixtures. */
const WITHDRAWN = 'opp-0039';
const EXPIRED = ['opp-0040', 'opp-0041'];
const NO_SALARY = 'opp-0004';
const NO_SALARY_2 = 'opp-0011';
const NO_PUBLISHED_DATE = 'opp-0038';
const CANONICAL_PAIR = ['opp-0001', 'opp-0042'];

const ids = (page) => page.items.map((job) => job.id);

test('the fixture dataset is a labelled, internally consistent fixture set', () => {
  const all = buildFixtureOpportunities(NOW_MS);
  assert.equal(all.length, FIXTURE_SEED_COUNT);
  assert.equal(new Set(all.map((j) => j.id)).size, all.length, 'ids must be unique');

  for (const job of all) {
    assert.equal(job.source.kind, 'fixture', `${job.id} must be labelled as a fixture`);
    assert.match(job.source.name, /^Preview fixture/, `${job.id} must name itself a fixture`);
    assert.ok(job.canonicalId.length > 0, `${job.id} needs a canonical id`);
    if (job.applyUrl) {
      assert.match(job.applyUrl, /^https:\/\/example\.com\//, `${job.id} must use a reserved URL`);
      assert.equal(job.applicationMode, 'external');
    } else {
      assert.equal(job.applicationMode, 'unknown');
    }
    // Unknown is null, never a sentinel.
    if (!job.salary.stated) {
      assert.equal(job.salary.min, null);
      assert.equal(job.salary.max, null);
      assert.equal(job.salary.currency, null);
      assert.equal(job.salary.period, 'unknown');
    }
    // The display string must not repeat a part, e.g. "Berlin, Berlin, Germany".
    for (const loc of job.locations) {
      if (!loc.raw) continue;
      const parts = loc.raw.split(',').map((p) => p.trim().toLowerCase());
      assert.equal(new Set(parts).size, parts.length, `${job.id}: ${loc.raw} repeats a part`);
    }
  }
});

test('two sources of one posting share a canonical id but not a local id', () => {
  const all = buildFixtureOpportunities(NOW_MS);
  const [a, b] = CANONICAL_PAIR.map((id) => all.find((j) => j.id === id));
  assert.ok(a && b, 'both duplicate-fixture records must exist');
  assert.equal(a.canonicalId, b.canonicalId);
  assert.notEqual(a.id, b.id);
});

test('closed postings are excluded by default and included on request', async () => {
  const open = await adapter.search({});
  assert.equal(open.total, FIXTURE_SEED_COUNT - 1 - EXPIRED.length);
  assert.ok(!ids(open).includes(WITHDRAWN));
  for (const id of EXPIRED) assert.ok(!ids(open).includes(id));

  const everything = await adapter.search({ includeClosed: true, limit: 50 });
  assert.equal(everything.total, FIXTURE_SEED_COUNT);
  assert.ok(ids(everything).includes(WITHDRAWN));
});

test('an unknown status is not treated as closed', async () => {
  const open = await adapter.search({ limit: 50 });
  assert.ok(
    ids(open).includes(NO_PUBLISHED_DATE),
    'a posting with no closure signal must remain visible by default',
  );
  const record = await adapter.getById(NO_PUBLISHED_DATE);
  assert.equal(record.status, 'unknown');
});

test('work mode: unset means any (including unknown); unknown is selectable', async () => {
  const allRecords = buildFixtureOpportunities(NOW_MS);
  const unknownCount = allRecords.filter((j) => j.workMode === 'unknown').length;
  const remoteCount = allRecords.filter(
    (j) => j.workMode === 'remote' && j.status !== 'withdrawn' && j.status !== 'expired',
  ).length;

  const unset = await adapter.search({ includeClosed: true, limit: 50 });
  assert.equal(
    unset.items.filter((j) => j.workMode === 'unknown').length,
    unknownCount,
    'no work-mode filter must not drop unknown records',
  );

  const remoteOnly = await adapter.search({ workModes: ['remote'], limit: 50 });
  assert.equal(remoteOnly.total, remoteCount);
  assert.ok(remoteOnly.items.every((j) => j.workMode === 'remote'));

  const unknownOnly = await adapter.search({ workModes: ['unknown'], limit: 50 });
  assert.equal(unknownOnly.total, unknownCount);
  assert.ok(unknownOnly.items.every((j) => j.workMode === 'unknown'));

  const both = await adapter.search({ workModes: ['remote', 'unknown'], limit: 50 });
  assert.equal(both.total, remoteCount + unknownCount);
});

test('employment type follows the same unknown rule', async () => {
  const contract = await adapter.search({ employmentTypes: ['contract'], limit: 50 });
  assert.ok(contract.items.every((j) => j.employmentType === 'contract'));
  const unknown = await adapter.search({ employmentTypes: ['unknown'], limit: 50 });
  assert.ok(unknown.items.every((j) => j.employmentType === 'unknown'));
});

test('country filter honours the explicit unknown token', async () => {
  const de = await adapter.search({ countryCodes: ['DE'], limit: 50 });
  assert.ok(de.total > 0);
  assert.ok(
    de.items.every((job) => job.locations.some((l) => l.countryCode === 'DE')),
    'every result must actually be in DE',
  );

  // One fixture deliberately names no country for this role, so the explicit
  // unknown token must match exactly that record — and not be ignored (which
  // would return every record).
  const unknownCountry = await adapter.search({ countryCodes: ['unknown'], limit: 50 });
  assert.equal(unknownCountry.total, 1);
  assert.equal(unknownCountry.items[0].locations[0].countryCode, null);
  assert.ok(
    !de.items.some((job) => job.locations.some((l) => l.countryCode === null)),
    'a real country filter must not pick up the unstated record',
  );
});

test('a salary filter excludes unstated compensation and foreign currencies', async () => {
  const page = await adapter.search({ salaryMin: 80000, salaryCurrency: 'EUR', limit: 50 });
  assert.ok(page.total > 0);
  for (const job of page.items) {
    assert.equal(job.salary.stated, true);
    assert.equal(job.salary.currency, 'EUR');
    assert.ok((job.salary.max ?? job.salary.min) >= 80000);
  }
  const resultIds = ids(page);
  assert.ok(!resultIds.includes(NO_SALARY), 'unstated compensation cannot satisfy a range');
  assert.ok(!resultIds.includes(NO_SALARY_2), 'unstated compensation cannot satisfy a range');

  // Same amount, different currency: nothing in GBP can clear the EUR bar.
  const gbp = await adapter.search({ salaryMin: 80000, salaryCurrency: 'GBP', limit: 50 });
  assert.ok(gbp.items.every((j) => j.salary.currency === 'GBP'));

  // A day-rate record is compared as posted and cannot clear an annual bar.
  const dayRate = await adapter.search({ salaryMin: 70000, salaryCurrency: 'EUR', limit: 50 });
  assert.ok(dayRate.items.every((j) => j.salary.period !== 'day'));
});

test('a recency filter excludes postings with no publication date', async () => {
  const week = await adapter.search({ postedWithinDays: 7, limit: 50 });
  assert.ok(week.total > 0);
  for (const job of week.items) {
    assert.ok(job.publishedAt, 'a recency filter cannot match a record with no date');
    assert.ok(NOW_MS - Date.parse(job.publishedAt) <= 7 * 24 * 60 * 60 * 1000);
  }
  assert.ok(
    !ids(week).includes(NO_PUBLISHED_DATE),
    'the undated record must be excluded, even though it is active',
  );
});

test('free text matches across title, employer, occupation, skills and location', async () => {
  const page = await adapter.search({ text: 'backend engineer', limit: 50 });
  assert.ok(page.total > 0);
  for (const job of page.items) {
    const hay = [
      job.title,
      job.employer.name,
      job.occupation.label,
      job.skills.join(' '),
      job.summary,
      job.locations.map((l) => l.raw).join(' '),
    ]
      .join(' ')
      .toLowerCase();
    assert.ok(hay.includes('backend'), `${job.id} should mention backend`);
    assert.ok(hay.includes('engineer'), `${job.id} should mention engineer`);
  }

  const byCity = await adapter.search({ text: 'lisbon', limit: 50 });
  assert.ok(byCity.total > 0);
  assert.ok(byCity.items.every((j) => j.locations.some((l) => l.raw.toLowerCase().includes('lisbon'))));

  const nothing = await adapter.search({ text: 'zzzz-no-such-thing' });
  assert.equal(nothing.total, 0);
  assert.deepEqual(nothing.items, []);
});

test('relevance sort ranks a title match above an incidental one', async () => {
  const page = await adapter.search({ text: 'payments', sort: 'relevance', limit: 50 });
  assert.ok(page.total > 0);
  assert.match(page.items[0].title.toLowerCase() + page.items[0].summary.toLowerCase(), /payments/);
});

test('sorting is total and unknown values sort last', async () => {
  const newest = await adapter.search({ sort: 'newest', limit: 50 });
  const dates = newest.items.map((j) => (j.publishedAt ? Date.parse(j.publishedAt) : Number.NEGATIVE_INFINITY));
  for (let i = 1; i < dates.length; i += 1) {
    assert.ok(dates[i] <= dates[i - 1], 'newest first must be descending, undated last');
  }

  const oldest = await adapter.search({ sort: 'oldest', limit: 50 });
  assert.equal(oldest.total, newest.total);

  const rich = await adapter.search({ sort: 'salary_desc', limit: 50 });
  const firstUnknown = rich.items.findIndex((j) => !j.salary.stated);
  if (firstUnknown >= 0) {
    assert.ok(
      rich.items.slice(firstUnknown).every((j) => !j.salary.stated),
      'unstated compensation must sort to the end in both directions',
    );
  }

  const cheap = await adapter.search({ sort: 'salary_asc', limit: 50 });
  assert.equal(cheap.total, rich.total);
});

test('cursor pagination walks the whole result set exactly once', async () => {
  const first = await adapter.search({ sort: 'newest', limit: 10 });
  assert.equal(first.items.length, 10);
  assert.equal(first.total, FIXTURE_SEED_COUNT - 1 - EXPIRED.length);
  assert.ok(first.nextCursor);
  assert.equal(first.prevCursor, null);

  const seen = [...ids(first)];
  let cursor = first.nextCursor;
  let pages = 1;
  let previous = first;
  while (cursor) {
    const page = await adapter.search({ sort: 'newest', limit: 10, cursor });
    pages += 1;
    assert.ok(page.items.length > 0);
    seen.push(...ids(page));
    // The cursor back must reconstruct the previous page.
    if (pages === 2) {
      const back = await adapter.search({ sort: 'newest', limit: 10, cursor: page.prevCursor });
      assert.deepEqual(ids(back), ids(first));
    }
    cursor = page.nextCursor;
    previous = page;
  }

  assert.equal(pages, Math.ceil(first.total / 10));
  assert.equal(new Set(seen).size, first.total, 'no duplicates and no omissions');
  assert.equal(previous.nextCursor, null);
});

test('page size is clamped and defaults are applied', async () => {
  assert.equal(normaliseQuery({}).limit, DEFAULT_PAGE_SIZE);
  assert.equal(normaliseQuery({}).includeClosed, false);
  assert.equal(normaliseQuery({}).sort, 'relevance');
  assert.equal(clampPageSize(0), 1);
  assert.equal(clampPageSize(10_000), 50);
  const page = await adapter.search({ limit: 1000 });
  assert.ok(page.items.length <= 50, 'an absurd page size is clamped, not honoured');
  assert.equal(page.items.length, page.total, 'the whole (small) set still fits on one page');
  assert.equal(page.nextCursor, null);
});

test('cursors are opaque and malformed cursors fail loudly', () => {
  assert.equal(decodeCursor(encodeCursor(20)), 20);
  assert.equal(decodeCursor(null), 0);
  assert.throws(() => decodeCursor('nonsense'), /Unrecognised cursor/);
  assert.throws(() => decodeCursor('fx1.bm90LWEtY3Vyc29y'), /Malformed cursor/);
});

test('getById resolves a local id and a canonical id, and misses cleanly', async () => {
  const byLocal = await adapter.getById('opp-0001');
  assert.equal(byLocal.title.startsWith('Senior Backend Engineer'), true);

  const byCanonical = await adapter.getById('canon-northwind-payments-backend');
  assert.ok(byCanonical, 'a canonical id must resolve');
  assert.equal(byCanonical.canonicalId, 'canon-northwind-payments-backend');

  assert.equal(await adapter.getById('opp-nope'), null);
});

test('the page reports its own provenance and honesty metadata', async () => {
  const page = await adapter.search({});
  assert.equal(page.kind, 'fixture');
  assert.equal(page.adapterId, 'fixture-v1');
  assert.ok(Date.parse(page.fetchedAt) <= NOW_MS);
  assert.ok(page.staleAfterMs > 0);
  assert.match(adapter.notice, /synthetic/);
  assert.equal(adapter.kind, 'fixture');
});

test('a backdated page is detectable as stale by age alone', async () => {
  const stale = createFixtureAdapter({ now: NOW, latencyMs: 0, backdateMs: 10 * 60 * 1000 });
  const page = await stale.search({});
  assert.ok(NOW_MS - Date.parse(page.fetchedAt) > page.staleAfterMs);
});

test('a failing search rejects rather than returning an empty page', async () => {
  const broken = createFixtureAdapter({ now: NOW, latencyMs: 0, failSearches: true });
  await assert.rejects(() => broken.search({}), /fixture adapter set to fail/);
});

test('suggestions require two characters and are de-duplicated', async () => {
  assert.deepEqual(await adapter.suggest('a'), []);
  const suggestions = await adapter.suggest('data');
  assert.ok(suggestions.length > 0);
  assert.ok(suggestions.length <= 8);
  const keys = suggestions.map((s) => `${s.kind}:${s.value}`);
  assert.equal(new Set(keys).size, keys.length);
});
