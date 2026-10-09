/**
 * URL-state tests. The URL is the source of truth for a search, so parsing has
 * to be total (junk in, defaults out) and serialisation has to drop defaults.
 */
import assert from 'node:assert/strict';
import test from 'node:test';

import {
  countActiveFilters,
  parseReviewFlags,
  parseSearchQuery,
  toSearchParams,
  toggleValue,
} from '../src/jobsite/lib/url-state.ts';

const parse = (query) => parseSearchQuery(new URLSearchParams(query));

test('an empty query parses to an empty, well-defaulted search', () => {
  const query = parse('');
  assert.equal(query.text, undefined);
  assert.deepEqual(query.workModes, []);
  assert.deepEqual(query.employmentTypes, []);
  assert.equal(query.salaryMin, null);
  assert.equal(query.postedWithinDays, null);
  assert.equal(query.includeClosed, false);
  assert.equal(query.sort, 'relevance');
  assert.equal(countActiveFilters(query), 0);
});

test('a full query round-trips through the URL unchanged', () => {
  const original = parse(
    'q=senior+backend&occ=backend-engineer&loc=berlin&country=DE&wm=remote,unknown' +
      '&et=full_time&sal=80000&cur=eur&since=7&closed=1&sort=newest&cursor=fx1.bzEw',
  );
  const round = parse(toSearchParams(original).toString());
  assert.deepEqual(round, original);
  assert.equal(countActiveFilters(original), 9);
});

test('defaults are omitted so links stay short and diffable', () => {
  const params = toSearchParams({ sort: 'relevance', includeClosed: false, workModes: [] });
  assert.equal(params.toString(), '');
});

test('unrecognised enum values are dropped, never coerced to a real value', () => {
  const query = parse('wm=remote,banana&et=perm&sort=cheapest');
  assert.deepEqual(query.workModes, ['remote']);
  assert.deepEqual(query.employmentTypes, []);
  assert.equal(query.sort, 'relevance');
});

test('malformed numbers become null rather than NaN', () => {
  const query = parse('sal=abc&since=soon');
  assert.equal(query.salaryMin, null);
  assert.equal(query.postedWithinDays, null);
});

test('country codes are normalised to uppercase', () => {
  assert.deepEqual(parse('country=de,nl').countryCodes, ['DE', 'NL']);
});

test('the unknown token survives the round trip for work mode', () => {
  const query = parse('wm=unknown');
  assert.deepEqual(query.workModes, ['unknown']);
  assert.equal(toSearchParams(query).get('wm'), 'unknown');
});

test('whitespace-only text is treated as absent', () => {
  assert.equal(parse('q=+++').text, undefined);
  assert.equal(countActiveFilters(parse('q=+++')), 0);
});

test('review flags are off unless explicitly switched on', () => {
  assert.deepEqual(parseReviewFlags(new URLSearchParams('')), {
    stale: false,
    fail: false,
    forceFixture: false,
    latencyMs: null,
  });
  const flags = parseReviewFlags(new URLSearchParams('review_stale=1&review_fail=1&review_fixture=1&review_latency=0'));
  assert.deepEqual(flags, { stale: true, fail: true, forceFixture: true, latencyMs: 0 });
});

test('toggleValue adds, removes and never mutates the input', () => {
  const start = ['remote'];
  const added = toggleValue(start, 'hybrid');
  assert.deepEqual(added, ['remote', 'hybrid']);
  assert.deepEqual(start, ['remote'], 'the input array must not be mutated');
  assert.deepEqual(toggleValue(added, 'remote'), ['hybrid']);
  assert.deepEqual(toggleValue(undefined, 'remote'), ['remote']);
});
