/* The job board on the draft /jobs and each posting's draft page /jobs/<id> (src/jobs, src/drafts/jobs-board.ts): the
   search keeps live postings only and filters by words, place, work mode and posting date; the query survives the
   page address; salaries, employment types and schema.org JobPosting state only what the posting states, and the
   board is a schema.org ItemList; the stand-in postings carry every field the catalogue names, lead nowhere real and
   hold no contact person; the words make no forbidden claim, in five languages of the same shape. Once built, each
   live posting has its page in the five languages (banner, noindex, JobPosting, the link to the original, the covert
   yes against its stand-in), linked from the boards only, never from the sitemap; an expired one has none. llms.txt carries the
   jobs section exactly when the build carries the jobs pages. The build checks are skipped until the site is built. */
import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { EMPTY_QUERY, SOURCES, WORK_MODES, isLive, readQuery, search, writeQuery } from '../src/jobs/catalogue.ts';
import { boardSchema, countryNames, employment, jobPostingSchema, salary } from '../src/jobs/format.ts';
import { employmentKind } from '../src/jobs/catalogue.ts';
import { llmsText as compose } from '../src/llms/compose.ts';
import { LANGS } from '../src/i18n/locales.ts';
import { RECORDED } from '../src/jobs/recorded.ts';
import { jobsBoard } from '../src/drafts/jobs-board.ts';
import { FORBIDDEN, PRIVATE } from './forbidden.mjs';

const TODAY = '2026-11-04';
const llmsPart = name => readFileSync(new URL(`../src/llms/${name}.txt`, import.meta.url), 'utf8');
const llmsText = withJobs => compose(llmsPart('llms'), llmsPart('jobs'), withJobs);
/* The hosts each allowed source serves its postings from (the address forms of J2-FIX-D). */
const SOURCE_HOST = { personio: /\.jobs\.personio\.de$/, greenhouse: /^(boards|job-boards)\.greenhouse\.io$/, lever: /^jobs\.lever\.co$/, ashby: /^jobs\.ashbyhq\.com$/, workable: /^apply\.workable\.com$/, recruitee: /\.recruitee\.com$/ };
const ids = list => list.map(p => p.id);
const byId = id => RECORDED.find(p => p.id === id);
const strings = value => typeof value === 'string' ? [value] : Array.isArray(value) ? value.flatMap(strings) : value && typeof value === 'object' ? Object.values(value).flatMap(strings) : [];
const shape = value => Array.isArray(value) ? 'list' : value && typeof value === 'object' ? Object.fromEntries(Object.entries(value).map(([k, v]) => [k, shape(v)])) : typeof value;

test('the board shows live postings only, newest first', () => {
  const all = search(RECORDED, EMPTY_QUERY, TODAY);
  assert.ok(!ids(all).includes('recruitee-wingtip-accounting-7'), 'past its valid-through date');
  assert.equal(all.length, RECORDED.length - 1);
  assert.deepEqual(all.map(p => p.posted_at), [...all.map(p => p.posted_at)].sort().reverse());
  assert.ok(isLive(byId('recruitee-adventure-works-ws-marketing'), '2026-12-31'), 'shown on its last day');
  assert.ok(!isLive(byId('recruitee-adventure-works-ws-marketing'), '2027-01-01'), 'gone the day after');
  assert.ok(isLive(byId('lever-contoso-logistics-ops-14'), '2030-01-01'), 'no closing date stated, none derived');
});

test('every word must match; case and accents do not matter', () => {
  assert.deepEqual(ids(search(RECORDED, { ...EMPTY_QUERY, q: 'data ANALYST' }, TODAY)), ['personio-northwind-4711']);
  assert.deepEqual(ids(search(RECORDED, { ...EMPTY_QUERY, q: 'backend FABRIKAM' }, TODAY)), ['greenhouse-fabrikam-88213'], 'the title and the employer');
  assert.deepEqual(ids(search(RECORDED, { ...EMPTY_QUERY, q: 'postgresql' }, TODAY)), [], 'no posting text here; the read API searches it');
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
  assert.equal(ld.validThrough, undefined, 'Personio states no closing date');
  assert.equal(jobPostingSchema(byId('recruitee-adventure-works-ws-marketing'), 'x').validThrough, '2026-12-31');
  assert.equal(ld.hiringOrganization.name, p.employer);
  assert.equal(ld.jobLocation.address.addressCountry, 'DE');
  assert.deepEqual(ld.baseSalary.value, { '@type': 'QuantitativeValue', unitText: 'YEAR', minValue: 46000, maxValue: 54000 });
  assert.equal(ld.url, p.original_url, 'url is the original posting');
  assert.equal(ld.mainEntityOfPage, 'https://site.invalid/jobs/x');
  assert.equal(ld.employmentType, 'FULL_TIME');
  assert.equal(ld.jobLocationType, undefined);
  const remote = jobPostingSchema(byId('greenhouse-fabrikam-88213'), 'https://site.invalid/jobs/y');
  assert.equal(remote.jobLocationType, 'TELECOMMUTE');
  assert.equal(remote.baseSalary, undefined, 'no salary stated, none given');
  assert.equal(remote.validThrough, undefined);
  assert.equal(jobPostingSchema(byId('personio-musterwerk-1203'), 'x').employmentType, 'FULL_TIME', 'VOLLZEIT');
  assert.ok(!('employmentType' in jobPostingSchema(byId('recruitee-adventure-works-ws-marketing'), 'x')), 'a type the board cannot read is left out');
  assert.ok(!('employmentType' in jobPostingSchema(byId('recruitee-wingtip-accounting-7'), 'x')), 'none stated, none given');
  for (const p of RECORDED) {
    const node = jobPostingSchema(p, 'x');
    assert.ok(!('description' in node) && !('inLanguage' in node), `${p.id}: no posting text`);
    assert.equal('validThrough' in node, p.valid_through !== null, `${p.id}: validThrough only when the source states it`);
  }
});

test('an employment type reads as the board’s word, else as the source writes it', () => {
  for (const raw of ['FullTime', 'FULL_TIME', 'full-time', 'full time', 'VOLLZEIT']) assert.equal(employmentKind(raw), 'full_time', raw);
  assert.equal(employmentKind('Werkstudent'), null);
  assert.equal(employmentKind(null), null);
  assert.equal(employment('PartTime', jobsBoard.de.board.employment), 'Teilzeit');
  assert.equal(employment('Werkstudent', jobsBoard.fr.board.employment), 'Werkstudent');
  assert.equal(employment(null, jobsBoard.en.board.employment), null);
});

test('the board is an ItemList of its postings in order, each with its own page', () => {
  const live = search(RECORDED, EMPTY_QUERY, TODAY);
  const ld = boardSchema(live, 'Search the postings', p => `https://site.invalid/jobs/${p.id}`);
  assert.equal(ld['@type'], 'ItemList');
  assert.equal(ld.numberOfItems, live.length);
  assert.deepEqual(ld.itemListElement.map(i => i.position), live.map((_, i) => i + 1));
  assert.deepEqual(ld.itemListElement.map(i => i.url), live.map(p => `https://site.invalid/jobs/${p.id}`));
});

test('llms.txt carries the jobs section only where the jobs pages are built', () => {
  assert.match(llmsText(true), /\n## Jobs \(a draft, planned, not built\)\n/);
  assert.ok(!llmsText(false).includes('/jobs'), 'production: no jobs section');
  assert.ok(llmsText(true).startsWith(llmsText(false)));
  const section = llmsText(true).slice(llmsText(false).length);
  for (const term of ['check', 'private match', 'verdict per criterion', 'both say yes', 'introduction']) assert.ok(section.includes(term), `the glossary’s “${term}”`);
  assert.doesNotMatch(section, FORBIDDEN.en);
});

test('the stand-in postings come from allowed sources, carry every field, keep no text and use their source’s address form', () => {
  for (const p of RECORDED) {
    for (const key of ['id', 'title', 'employer', 'location', 'work_mode', 'employment_type', 'salary', 'source', 'fetched_at', 'original_url', 'posted_at', 'valid_through']) assert.ok(key in p, `${p.id}: ${key}`);
    assert.ok(!('description' in p) && !('language' in p), `${p.id}: no posting text`);
    assert.match(p.id, /^[a-z0-9-]+$/);
    assert.notEqual(p.id, 'mine', 'the person’s own page lives at /jobs/mine');
    assert.ok(SOURCES.includes(p.source), p.source);
    assert.ok(p.work_mode === null || WORK_MODES.includes(p.work_mode));
    assert.match(new URL(p.original_url).hostname, SOURCE_HOST[p.source], `${p.id}: the address form of ${p.source}`);
    assert.match(p.original_url, /example/, `${p.id}: a made-up employer slug`);
    if (p.source !== 'recruitee') assert.equal(p.valid_through, null, `${p.id}: only Recruitee states a closing date`);
    assert.ok(!Number.isNaN(Date.parse(p.fetched_at)));
  }
  assert.equal(new Set(RECORDED.map(p => p.id)).size, RECORDED.length);
  assert.deepEqual([...SOURCES].sort(), Object.keys(SOURCE_HOST).sort(), 'the sources: no Federal Employment Agency, no SmartRecruiters');
  for (const lang of LANGS) assert.deepEqual(Object.keys(jobsBoard[lang].board.sources).sort(), [...SOURCES].sort(), `${lang}: a label for each source, no other`);
});

test('the board’s words make no forbidden claim and match in the five languages', () => {
  assert.deepEqual(Object.keys(jobsBoard), [...LANGS]);
  for (const [lang, words] of Object.entries(jobsBoard)) {
    for (const text of strings(words)) {
      assert.doesNotMatch(text, FORBIDDEN[lang], `${lang}: forbidden word in “${text}”`);
      assert.doesNotMatch(text, PRIVATE, `${lang}: private detail in “${text}”`);
    }
  }
  for (const lang of LANGS) assert.deepEqual(shape(jobsBoard[lang]), shape(jobsBoard.en), lang);
  assert.equal(jobsBoard.de.posting.original.button, 'Zur Originalanzeige');
  assert.equal(jobsBoard.de.posting.covert.button, 'Verdeckt Ja');
});

const dist = new URL('../dist/', import.meta.url);
const skip = !existsSync(new URL('index.html', dist)) && 'build the site first';

test('each live posting has its draft page in the five languages, linked from the boards only', { skip }, () => {
  const built = existsSync(new URL('jobs.html', dist));
  const live = search(RECORDED, EMPTY_QUERY, new Date().toISOString().slice(0, 10));
  const expired = RECORDED.filter(p => !live.includes(p));
  for (const lang of LANGS) {
    const prefix = lang === 'en' ? '' : `${lang}/`;
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
      assert.ok(html.includes(`"url":"${p.original_url}"`), 'its url is the original');
      assert.ok(html.includes(`href="${p.original_url}"`), 'the link to the original');
      assert.ok(html.includes(W.posting.original.button));
      assert.ok(html.includes(`data-covert="`), 'the covert yes');
      assert.ok(html.includes(W.posting.covert.signIn.button), 'signed out, the sign-in prompt');
      const board = readFileSync(new URL(`${prefix}jobs.html`, dist), 'utf8');
      assert.ok(board.includes(`href="/${prefix}jobs/${p.id}"`), 'the board links it');
      assert.ok(board.includes(`/${prefix}jobs/${p.id}","name":`), 'the board’s ItemList names it');
    }
    for (const p of expired) assert.ok(!existsSync(new URL(`${prefix}jobs/${p.id}.html`, dist)), `${p.id}: expired, no page`);
  }
  const posting = /href="(\/[a-z]{2})?\/jobs\/(?!mine["#?])[a-z0-9-]+["#?]/;
  const board = LANGS.map(lang => `${lang === 'en' ? '' : `${lang}/`}jobs.html`);
  for (const page of readdirSync(dist, { recursive: true }).filter(f => f.endsWith('.html') && !board.includes(f))) {
    assert.doesNotMatch(readFileSync(new URL(page, dist), 'utf8'), posting, `${page} links a posting`);
  }
  for (const map of readdirSync(dist).filter(f => f.startsWith('sitemap') && f.endsWith('.xml'))) {
    assert.ok(!readFileSync(new URL(map, dist), 'utf8').includes('/jobs'), `${map} lists a jobs page`);
  }
  const llms = readFileSync(new URL('llms.txt', dist), 'utf8');
  assert.equal(llms, llmsText(built), 'llms.txt: the jobs section exactly when the jobs pages are built');
  assert.equal(readFileSync(new URL('llms-full.txt', dist), 'utf8').includes('\nPage: /jobs\n'), built, 'llms-full.txt: the board exactly when built');
});
