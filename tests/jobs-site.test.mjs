/* The jobs site (SITE_TARGET=jobs, src/jobs-site): the board's source rules (src/jobs/feed.ts) on made-up data, and,
   once `npm run build:jobs` has run, what the build serves: only the jobs routes, noindex everywhere, no sitemap and a
   robots.txt that refuses crawlers until the owner's publication go, the name in the header and "Powered by Linkbot" in
   the footer. */
import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import { chooseBoard, fromCatalogue, labelOf, parseSnapshot } from '../src/jobs/feed.ts';

const item = (over = {}) => ({
  id: '42', source: 'greenhouse', fetched_at: '2026-11-20T06:00:00Z', original_url: 'https://boards.greenhouse.io/acmeexample/jobs/42',
  title: 'Made-up role', employer: { name: 'Acme Example', board: 'acmeexample', domain: 'acme.example' }, location: { text: 'Berlin', country: 'DE' },
  work_mode: 'remote', employment_type: 'FullTime', salary: null, posted_at: '2026-11-19', valid_through: null, party: 'greenhouse:acmeexample', ...over,
});

test('a catalogue item becomes a posting only when the board can show it as it is', () => {
  const p = fromCatalogue(item());
  assert.equal(p.employer, 'Acme Example');
  assert.equal(p.employer_domain, 'acme.example');
  assert.equal(p.party, 'greenhouse:acmeexample');
  assert.equal(fromCatalogue(item({ source: 'ba' })), null, 'a source the board does not allow');
  assert.equal(fromCatalogue(item({ source: 'smartrecruiters' })), null);
  assert.equal(fromCatalogue(item({ title: null })), null);
  assert.equal(fromCatalogue(item({ employer: { name: null, board: null } })), null);
  assert.equal(fromCatalogue(item({ original_url: 'http://boards.greenhouse.io/x' })), null, 'only https originals');
  assert.equal(fromCatalogue(item({ work_mode: 'unknown' })).work_mode, null, 'unknown is no work mode');
  assert.equal(fromCatalogue(item({ location: { text: null, country: 'AT' } })).location.place, '', 'no place is filled in');
  assert.equal(fromCatalogue(item({ salary: { min: 50000, max: null, currency: null, period: 'year' } })).salary, null, 'no salary without its currency');
  assert.equal(fromCatalogue(item({ employer: { name: 'Acme Example', board: 'acme' } })).employer_domain, null);
});

const posting = (over = {}) => fromCatalogue(item(over));
const snap = (taken_at, postings) => ({ taken_at, postings });

test('the board is never empty and never invented', () => {
  const today = '2026-11-21';
  const fresh = snap('2026-11-21T05:00:00Z', [posting()]);
  const old = snap('2026-11-18T05:00:00Z', [posting({ id: '7' })]);
  assert.deepEqual(chooseBoard(fresh, old, today), { kind: 'listings', postings: fresh.postings, asOf: fresh.taken_at, from: 'catalogue' });
  assert.deepEqual(chooseBoard(null, old, today), { kind: 'listings', postings: old.postings, asOf: old.taken_at, from: 'snapshot' }, 'a failed read shows the last snapshot with its date');
  assert.equal(chooseBoard(snap(fresh.taken_at, []), old, today).from, 'snapshot', 'an empty read counts as none');
  assert.deepEqual(chooseBoard(null, null, today), { kind: 'refreshing' });
  assert.deepEqual(chooseBoard(null, snap(old.taken_at, [posting({ valid_through: '2026-11-01' })]), today), { kind: 'refreshing' }, 'only expired listings count as none');
});

test('a stored snapshot is read only when it is one', () => {
  assert.equal(parseSnapshot(null), null);
  assert.equal(parseSnapshot('not json'), null);
  assert.equal(parseSnapshot('{"postings":[]}'), null, 'without its date');
  assert.deepEqual(parseSnapshot('{"taken_at":"2026-11-20T00:00:00Z","postings":[]}'), { taken_at: '2026-11-20T00:00:00Z', postings: [] });
});

test('a listing is sourced unless its employer takes part', () => {
  assert.equal(labelOf(posting(), new Set()), 'sourced');
  assert.equal(labelOf(posting(), new Set(['greenhouse:acmeexample'])), 'participating');
  assert.equal(labelOf(posting({ party: null }), new Set(['greenhouse:acmeexample'])), 'sourced');
});

const dist = fileURLToPath(new URL('../dist-jobs/', import.meta.url));
const skip = !existsSync(join(dist, 'index.html')) && 'run npm run build:jobs first';
const ROUTE = /^(de\/)?(index|companies|how-it-works|sources|imprint|privacy|jobs\/mine|jobs\/[1-9][0-9]*)\.html$|^de\.html$/;

test('the jobs build serves only the jobs routes, unindexed until the publication go', { skip }, () => {
  const pages = readdirSync(dist, { recursive: true }).filter(f => f.endsWith('.html'));
  assert.deepEqual(pages.filter(f => !ROUTE.test(f)), [], 'a page that is not a jobs route');
  for (const route of ['index.html', 'de.html', 'companies.html', 'how-it-works.html', 'sources.html', 'imprint.html', 'privacy.html', 'jobs/mine.html', 'de/jobs/mine.html']) assert.ok(pages.includes(route), `${route} is missing`);
  assert.ok(!existsSync(join(dist, 'sitemap-index.xml')), 'no sitemap before the go');
  assert.match(readFileSync(join(dist, 'robots.txt'), 'utf8'), /Disallow: \//);
  for (const page of pages) {
    const html = readFileSync(join(dist, page), 'utf8');
    assert.match(html, /<meta name="robots" content="noindex, nofollow"/, `${page} is indexable`);
    assert.match(html, /Powered by Linkbot/, `${page}: the footer line`);
    assert.doesNotMatch(html, /href="[^"]*\/developers/, `${page} links the developer docs`);
  }
  const home = readFileSync(join(dist, 'index.html'), 'utf8');
  assert.ok(home.includes('data-board-refreshing') !== home.includes('data-board-list'), 'the home shows the board or the refreshing state, never both');
  if (home.includes('data-board-refreshing')) assert.doesNotMatch(home, /data-board-form/, 'no search without listings');
});
