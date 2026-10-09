/**
 * Canonical (Universal Supply API) adapter tests: request serialisation and the
 * wire → domain mapping. The mapping is where an UNKNOWN contract is most
 * easily broken, so most of these tests are about refusing to guess.
 */
import assert from 'node:assert/strict';
import test from 'node:test';

import {
  buildSearchParams,
  createHttpAdapter,
  mapWireOpportunity,
  mapWireSalary,
} from '../src/jobsite/http-adapter.ts';

const WIRE = {
  id: 'sup-1',
  canonical_id: 'canon-9',
  title: 'Staff Data Engineer',
  occupation: { id: 'data-engineer', label: 'Data Engineer' },
  employer: { id: 'emp-1', name: 'Example Co', url: 'https://example.com/careers' },
  locations: [{ city: 'Berlin', region: 'Berlin', country: 'Germany', country_code: 'de' }],
  work_mode: 'remote',
  employment_type: 'full_time',
  compensation: { stated: true, min: 90000, max: 110000, currency: 'eur', period: 'year', note: 'plus equity' },
  summary: 'Own the warehouse.',
  description: 'Long form.',
  skills: ['dbt', null, 'SQL'],
  source: {
    id: 'src-1',
    name: 'Example ATS',
    url: 'https://example.com/posting/1',
    kind: 'ats',
    retrieved_at: '2026-10-08T04:00:00Z',
  },
  published_at: '2026-10-01T00:00:00Z',
  modified_at: 'not a date',
  valid_through: null,
  status: 'active',
  apply_url: 'https://example.com/apply/1',
  application_mode: 'external',
  language: 'en',
};

test('a well-formed payload maps to the domain model with normalised casing', () => {
  const job = mapWireOpportunity(WIRE);
  assert.ok(job);
  assert.equal(job.id, 'sup-1');
  assert.equal(job.canonicalId, 'canon-9');
  assert.equal(job.workMode, 'remote');
  assert.equal(job.employmentType, 'full_time');
  assert.equal(job.locations[0].countryCode, 'DE', 'country codes are uppercased');
  assert.equal(job.salary.currency, 'EUR', 'currency codes are uppercased');
  assert.deepEqual(job.skills, ['dbt', 'SQL'], 'null skills are dropped, not stringified');
  assert.equal(job.publishedAt, '2026-10-01T00:00:00.000Z', 'dates are normalised to ISO UTC');
  assert.equal(job.modifiedAt, null, 'an unparseable date becomes null, never an Invalid Date');
  assert.equal(job.validThrough, null);
  assert.equal(job.applicationMode, 'external');
});

test('an unrecognised enum maps to unknown — it is never guessed', () => {
  const job = mapWireOpportunity({ ...WIRE, work_mode: 'remote only', employment_type: 'perm', status: 'open' });
  assert.equal(job.workMode, 'unknown');
  assert.equal(job.employmentType, 'unknown');
  assert.equal(job.status, 'unknown');
  assert.equal(mapWireOpportunity({ ...WIRE, work_mode: 'remote_only' }).workMode, 'unknown');

  // Enum values are matched case-insensitively, but a free-text description is
  // never promoted into an enum value.
  assert.equal(mapWireOpportunity({ ...WIRE, work_mode: 'Remote' }).workMode, 'remote');
  assert.equal(mapWireOpportunity({ ...WIRE, work_mode: 'Fully remote' }).workMode, 'unknown');
});

test('missing numbers become null rather than zero', () => {
  const salary = mapWireSalary({ currency: 'EUR', period: 'year' });
  assert.equal(salary.stated, false);
  assert.equal(salary.min, null);
  assert.equal(salary.max, null);
  assert.equal(salary.currency, null, 'an unstated salary exposes no amount at all');
  assert.equal(salary.period, 'unknown');
});

test('stated is inferred only when there is a currency and an amount', () => {
  assert.equal(mapWireSalary({ min: 1000, currency: 'EUR', period: 'month' }).stated, true);
  assert.equal(mapWireSalary({ min: 1000, period: 'month' }).stated, false);
  assert.equal(mapWireSalary({ currency: 'EUR', period: 'month' }).stated, false);
  assert.equal(mapWireSalary({ stated: true, min: 1000, currency: 'eur', period: 'month' }).stated, true);
});

test('a payload without identity or title is rejected outright', () => {
  assert.equal(mapWireOpportunity({ title: 'No id' }), null);
  assert.equal(mapWireOpportunity({ id: 'no-title' }), null);
  assert.equal(mapWireOpportunity(null), null);
  assert.equal(mapWireOpportunity('a string'), null);
});

test('a missing apply url forces applicationMode to unknown', () => {
  const job = mapWireOpportunity({ ...WIRE, apply_url: null, application_mode: 'external' });
  assert.equal(job.applyUrl, null);
  assert.equal(job.applicationMode, 'unknown');
});

test('the outbound query string carries every filter, in snake_case', () => {
  const params = buildSearchParams({
    text: ' data engineer ',
    occupationIds: ['data-engineer'],
    locationText: 'Berlin',
    countryCodes: ['de'],
    workModes: ['remote', 'unknown'],
    employmentTypes: ['contract'],
    salaryMin: 70000,
    salaryCurrency: 'eur',
    postedWithinDays: 7,
    includeClosed: true,
    sort: 'salary_desc',
    cursor: 'abc',
    limit: 25,
  });
  assert.equal(params.get('q'), 'data engineer');
  assert.equal(params.get('occupation'), 'data-engineer');
  assert.equal(params.get('location'), 'Berlin');
  assert.equal(params.get('country'), 'de');
  assert.equal(params.get('work_mode'), 'remote,unknown');
  assert.equal(params.get('employment_type'), 'contract');
  assert.equal(params.get('salary_min'), '70000');
  assert.equal(params.get('salary_currency'), 'EUR');
  assert.equal(params.get('posted_within_days'), '7');
  assert.equal(params.get('include_closed'), 'true');
  assert.equal(params.get('sort'), 'salary_desc');
  assert.equal(params.get('cursor'), 'abc');
  assert.equal(params.get('limit'), '25');
});

test('defaults are not sent, but a page size always is', () => {
  const params = buildSearchParams({});
  assert.equal(params.get('q'), null);
  assert.equal(params.get('include_closed'), null);
  assert.equal(params.get('sort'), 'relevance');
  assert.equal(params.get('limit'), '10');
});

test('search() maps the canonical envelope and surfaces pagination', async () => {
  const calls = [];
  const fetchImpl = async (url, init) => {
    calls.push({ url, init });
    return new Response(
      JSON.stringify({
        data: [WIRE, { id: 'broken' }],
        page: { next_cursor: 'next-1', prev_cursor: null, total: 128 },
        meta: { generated_at: '2026-10-09T10:00:00Z' },
      }),
      { status: 200, headers: { 'content-type': 'application/json' } },
    );
  };
  const adapter = createHttpAdapter({ origin: 'https://supply.example.com/', fetchImpl });
  const page = await adapter.search({ text: 'data' });

  assert.equal(adapter.kind, 'live');
  assert.equal(page.kind, 'live');
  assert.equal(page.adapterId, 'supply-api-v1');
  assert.equal(page.total, 128);
  assert.equal(page.nextCursor, 'next-1');
  assert.equal(page.prevCursor, null);
  assert.equal(page.fetchedAt, '2026-10-09T10:00:00.000Z');
  assert.equal(page.items.length, 1, 'an unusable record is dropped, not faked');
  assert.match(calls[0].url, /^https:\/\/supply\.example\.com\/v1\/opportunities\?/);
  assert.equal(calls[0].init.headers.Accept, 'application/json');
});

test('a non-2xx response throws so the UI can show the error state', async () => {
  const adapter = createHttpAdapter({
    origin: 'https://supply.example.com',
    fetchImpl: async () => new Response('nope', { status: 503, statusText: 'Service Unavailable' }),
  });
  await assert.rejects(() => adapter.search({}), /503 Service Unavailable/);
});

test('getById returns null on 404 and a record otherwise', async () => {
  const missing = createHttpAdapter({
    origin: 'https://supply.example.com',
    fetchImpl: async () => new Response('{}', { status: 404 }),
  });
  assert.equal(await missing.getById('nope'), null);

  const found = createHttpAdapter({
    origin: 'https://supply.example.com',
    fetchImpl: async () => new Response(JSON.stringify({ data: WIRE }), { status: 200 }),
  });
  const job = await found.getById('sup-1');
  assert.equal(job.title, 'Staff Data Engineer');
});
