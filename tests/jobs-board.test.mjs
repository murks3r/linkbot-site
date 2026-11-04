/* The job board on the draft /jobs and each posting's draft page /jobs/<id> (src/jobs, src/drafts/jobs-board.ts): the
   search keeps live postings only and filters by words, place, work mode and posting date; the query survives the
   page address; salaries and schema.org JobPosting state only what the posting states; the stand-in postings carry
   every field the catalogue names, lead nowhere real and hold no contact person; the words make no forbidden claim.
   Once built, each live posting has its page in English and German (banner, noindex, JobPosting, the link to the
   original, the covert yes disabled), linked from the board only, never from the sitemap; an expired one has none.
   The build checks are skipped until the site is built. */
import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { EMPTY_QUERY, SOURCES, WORK_MODES, isLive, readQuery, search, writeQuery } from '../src/jobs/catalogue.ts';
import { countryNames, jobPostingSchema, salary } from '../src/jobs/format.ts';
import { RECORDED } from '../src/jobs/recorded.ts';
import { jobsBoard } from '../src/drafts/jobs-board.ts';
import { FORBIDDEN, PRIVATE } from './forbidden.mjs';

const TODAY = '2026-11-04';
const ids = list => list.map(p => p.id);
const byId = id => RECORDED.find(p => p.id === id);
const strings = value => typeof value === 'string' ? [value] : Array.isArray(value) ? value.flatMap(strings) : value && typeof value === 'object' ? Object.values(value).flatMap(strings) : [];
const shape = value => Array.isArray(value) ? 'list' : value && typeof value === 'object' ? Object.fromEntries(Object.entries(value).map(([k, v]) => [k, shape(v)])) : typeof value;

test('the board shows live postings only, newest first', () => {
  const all = search(RECORDED, EMPTY_QUERY, TODAY);
  assert.ok(!ids(all).includes('smartrecruiters-wingtip-accounting-7'), 'past its valid-through date');
  assert.equal(all.length, RECORDED.length - 1);
  assert.deepEqual(all.map(p => p.posted_at), [...all.map(p => p.posted_at)].sort().reverse());
  assert.ok(isLive(byId('lever-contoso-logistics-ops-14'), '2026-12-31'), 'shown on its last day');
  assert.ok(!isLive(byId('lever-contoso-logistics-ops-14'), '2027-01-01'), 'gone the day after');
});

test('every word must match; case and accents do not matter', () => {
  assert.deepEqual(ids(search(RECORDED, { ...EMPTY_QUERY, q: 'data ANALYST' }, TODAY)), ['personio-northwind-4711']);
  assert.deepEqual(ids(search(RECORDED, { ...EMPTY_QUERY, q: 'go postgresql' }, TODAY)), ['greenhouse-fabrikam-88213']);
  assert.deepEqual(ids(search(RECORDED, { ...EMPTY_QUERY, q: 'data nurse' }, TODAY)), []);
  assert.deepEqual(ids(search(RECORDED, { ...EMPTY_QUERY, where: 'zurich' }, TODAY)), ['workable-litware-csm-dach']);
});

test('where matches the place or the country in the page language and in English', () => {
  assert.deepEqual(ids(search(RECORDED, { ...EMPTY_QUERY, where: 'Österreich' }, TODAY, countryNames('de'))), ['ashby-tailspin-design-3']);
  assert.deepEqual(ids(search(RECORDED, { ...EMPTY_QUERY, where: 'austria' }, TODAY, countryNames('de'))), ['ashby-tailspin-design-3']);
  assert.equal(search(RECORDED, { ...EMPTY_QUERY, where: 'Germany' }, TODAY, countryNames('en')).length, 5);
});

test('work mode and posting date narrow the list', () => {
  assert.deepEqual(ids(search(RECORDED, { ...EMPTY_QUERY, mode: 'remote' }, TODAY)), ['greenhouse-fabrikam-88213']);
  assert.ok(search(RECORDED, { ...EMPTY_QUERY, mode: 'hybrid' }, TODAY).every(p => p.work_mode === 'hybrid'));
  assert.deepEqual(ids(search(RECORDED, { ...EMPTY_QUERY, since: 7 }, TODAY)),
    ['workable-litware-csm-dach', 'personio-northwind-4711', 'ashby-tailspin-design-3', 'greenhouse-fabrikam-88213']);
  assert.ok(ids(search(RECORDED, { ...EMPTY_QUERY, since: 30 }, TODAY)).includes('recruitee-adventure-works-ws-marketing'));
});

test('the query survives the page address; anything unknown means "any"', () => {
  const query = { q: 'data analyst', where: 'Berlin', mode: 'hybrid', since: 30 };
  assert.deepEqual(readQuery(new URLSearchParams(writeQuery(query))), query);
  assert.equal(writeQuery(EMPTY_QUERY), '');
  assert.deepEqual(readQuery(new URLSearchParams('mode=office&since=5&q=%20x%20')), { ...EMPTY_QUERY, q: 'x' });
});

test('a salary shows only when the posting states one', () => {
  const words = jobsBoard.en.board.salary;
  assert.equal(salary(byId('personio-northwind-4711').salary, 'en', words), '46,000–54,000 EUR a year');
  assert.equal(salary(byId('personio-northwind-4711').salary, 'de', jobsBoard.de.board.salary), '46.000–54.000 EUR im Jahr');
  assert.equal(salary(byId('recruitee-adventure-works-ws-marketing').salary, 'en', words), 'from 15 EUR an hour');
  assert.equal(salary(byId('greenhouse-fabrikam-88213').salary, 'en', words), null);
});

test('JobPosting states what the posting states and points to the original', () => {
  const p = byId('personio-northwind-4711');
  const ld = jobPostingSchema(p, 'https://site.invalid/jobs/x');
  assert.equal(ld['@type'], 'JobPosting');
  assert.equal(ld.title, p.title);
  assert.equal(ld.datePosted, p.posted_at);
  assert.equal(ld.validThrough, p.valid_through);
  assert.equal(ld.hiringOrganization.name, p.employer);
  assert.equal(ld.jobLocation.address.addressCountry, 'DE');
  assert.deepEqual(ld.baseSalary.value, { '@type': 'QuantitativeValue', unitText: 'YEAR', minValue: 46000, maxValue: 54000 });
  assert.equal(ld.sameAs, p.original_url);
  assert.equal(ld.jobLocationType, undefined);
  const remote = jobPostingSchema(byId('greenhouse-fabrikam-88213'), 'https://site.invalid/jobs/y');
  assert.equal(remote.jobLocationType, 'TELECOMMUTE');
  assert.equal(remote.baseSalary, undefined, 'no salary stated, none given');
  assert.equal(remote.validThrough, undefined);
});

test('the stand-in postings carry every field, lead nowhere real and hold no contact person', () => {
  for (const p of RECORDED) {
    for (const key of ['id', 'title', 'employer', 'location', 'work_mode', 'salary', 'source', 'fetched_at', 'original_url', 'posted_at', 'valid_through', 'language', 'description']) assert.ok(key in p, `${p.id}: ${key}`);
    assert.match(p.id, /^[a-z0-9-]+$/);
    assert.notEqual(p.id, 'mine', 'the person’s own page lives at /jobs/mine');
    assert.ok(SOURCES.includes(p.source), p.source);
    assert.ok(p.work_mode === null || WORK_MODES.includes(p.work_mode));
    assert.match(new URL(p.original_url).hostname, /\.example$/, `${p.id}: a made-up posting leads nowhere real`);
    assert.ok(!Number.isNaN(Date.parse(p.fetched_at)));
    for (const text of p.description) assert.doesNotMatch(text, /@|\+?\d[\d /-]{7,}\d|Herr |Frau |Ansprechpartner|contact person/i, `${p.id}: no contact person`);
  }
  assert.equal(new Set(RECORDED.map(p => p.id)).size, RECORDED.length);
});

test('the board’s words make no forbidden claim and match in both languages', () => {
  for (const [lang, words] of Object.entries(jobsBoard)) {
    for (const text of strings(words)) {
      assert.doesNotMatch(text, FORBIDDEN[lang], `${lang}: forbidden word in “${text}”`);
      assert.doesNotMatch(text, PRIVATE, `${lang}: private detail in “${text}”`);
    }
  }
  assert.deepEqual(shape(jobsBoard.de), shape(jobsBoard.en));
  assert.equal(jobsBoard.de.posting.original.button, 'Zur Originalanzeige');
  assert.equal(jobsBoard.de.posting.covert.soon, 'Demnächst');
});

const dist = new URL('../dist/', import.meta.url);
const skip = !existsSync(new URL('index.html', dist)) && 'build the site first';

test('each live posting has its draft page in English and German, linked from the board only', { skip }, () => {
  const built = existsSync(new URL('jobs.html', dist));
  const live = search(RECORDED, EMPTY_QUERY, new Date().toISOString().slice(0, 10));
  const expired = RECORDED.filter(p => !live.includes(p));
  for (const lang of ['en', 'de']) {
    const prefix = lang === 'en' ? '' : 'de/';
    const W = jobsBoard[lang];
    for (const p of live) {
      const file = new URL(`${prefix}jobs/${p.id}.html`, dist);
      assert.equal(existsSync(file), built, `${lang} ${p.id}: built with /jobs`);
      if (!built) continue;
      const html = readFileSync(file, 'utf8');
      assert.ok(html.includes(W.posting.banner), 'the banner');
      assert.match(html, /name="robots" content="noindex, nofollow"/);
      assert.ok(!html.includes('hreflang='), 'no alternates');
      assert.ok(html.includes('"@type":"JobPosting"'), 'schema.org JobPosting');
      assert.ok(html.includes(`href="${p.original_url}"`), 'the link to the original');
      assert.ok(html.includes(W.posting.original.button));
      assert.match(html, /<button[^>]*disabled[^>]*>/, 'the covert yes is disabled');
      assert.ok(html.includes(W.posting.covert.soon));
      assert.ok(readFileSync(new URL(`${prefix}jobs.html`, dist), 'utf8').includes(`href="/${prefix}jobs/${p.id}"`), 'the board links it');
    }
    for (const p of expired) assert.ok(!existsSync(new URL(`${prefix}jobs/${p.id}.html`, dist)), `${p.id}: expired, no page`);
  }
  const posting = /href="(\/[a-z]{2})?\/jobs\/(?!mine["#?])[a-z0-9-]+["#?]/;
  const board = ['jobs.html', 'de/jobs.html'];
  for (const page of readdirSync(dist, { recursive: true }).filter(f => f.endsWith('.html') && !board.includes(f))) {
    assert.doesNotMatch(readFileSync(new URL(page, dist), 'utf8'), posting, `${page} links a posting`);
  }
  for (const map of readdirSync(dist).filter(f => f.startsWith('sitemap') && f.endsWith('.xml'))) {
    assert.ok(!readFileSync(new URL(map, dist), 'utf8').includes('/jobs'), `${map} lists a jobs page`);
  }
});
