/* The drafts for the owner (/for-intermediaries, src/drafts/intermediaries.ts; /developers/login-with-linkbot,
   src/drafts/login.ts; /developers/a-new-vertical, src/drafts/new-vertical.ts; /developers/prepare-a-request, in five
   languages, src/drafts/prepare.ts; /jobs, in five languages, src/drafts/jobs-page.ts; /jobs/mine, in English and
   German, src/drafts/jobs-mine.ts): their words make no forbidden claim in their language, and each built page says it is a
   draft, is never indexed, has no alternates, exists only in the languages it has words for, and is neither linked from
   another page (but the drafts it names as linking it) nor listed in the sitemap. A production build leaves a draft out until the owner approves
   it; the build checks then assert it is absent, so the artefact that goes live is checked too. The build checks are
   skipped until the site is built. */
import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { INTERMEDIARIES_IN_PRODUCTION, buildsIntermediaries, intermediaries } from '../src/drafts/intermediaries.ts';
import { LOGIN_IN_PRODUCTION, buildsLogin, login } from '../src/drafts/login.ts';
import { NEW_VERTICAL_IN_PRODUCTION, buildsNewVertical, newVertical } from '../src/drafts/new-vertical.ts';
import { PREPARE_IN_PRODUCTION, buildsPrepare, prepare } from '../src/drafts/prepare.ts';
import { JOBS_MINE_IN_PRODUCTION, buildsJobsMine, jobsMine } from '../src/drafts/jobs-mine.ts';
import { JOBS_PAGE_IN_PRODUCTION, buildsJobsPage, jobsPage } from '../src/drafts/jobs-page.ts';
import { EMPTY_QUERY, search } from '../src/jobs/catalogue.ts';
import { RECORDED } from '../src/jobs/recorded.ts';
import { LANGS } from '../src/i18n/locales.ts';
import { FORBIDDEN, PRIVATE } from './forbidden.mjs';

const strings = value => typeof value === 'string' ? [value] : Array.isArray(value) ? value.flatMap(strings) : value && typeof value === 'object' ? Object.values(value).flatMap(strings) : [];
const dist = new URL('../dist/', import.meta.url);
const skip = !existsSync(new URL('index.html', dist)) && 'build the site first';

/* Each live posting's draft page links back to the board and, through its covert yes, to /jobs/mine, which links the board and
   the postings it lists (tests/jobs-board.test.mjs checks the pages themselves). */
const postings = search(RECORDED, EMPTY_QUERY, new Date().toISOString().slice(0, 10)).map(p => `/jobs/${p.id}`);

const drafts = [
  { path: '/for-intermediaries', words: { en: intermediaries }, builds: buildsIntermediaries, inProduction: INTERMEDIARIES_IN_PRODUCTION },
  { path: '/developers/login-with-linkbot', words: { en: login }, builds: buildsLogin, inProduction: LOGIN_IN_PRODUCTION },
  { path: '/developers/a-new-vertical', words: { en: newVertical }, builds: buildsNewVertical, inProduction: NEW_VERTICAL_IN_PRODUCTION },
  { path: '/developers/prepare-a-request', words: prepare, builds: buildsPrepare, inProduction: PREPARE_IN_PRODUCTION },
  { path: '/jobs', words: jobsPage, builds: buildsJobsPage, inProduction: JOBS_PAGE_IN_PRODUCTION, linkedFrom: [...postings, '/jobs/mine'] },
  { path: '/jobs/mine', words: jobsMine, builds: buildsJobsMine, inProduction: JOBS_MINE_IN_PRODUCTION, linkedFrom: ['/jobs', ...postings] },
];

const fileFor = (path, lang) => `${lang === 'en' ? '' : `${lang}/`}${path.slice(1)}.html`;

for (const { path, words, builds, inProduction, linkedFrom = [] } of drafts) {
  const fileOf = lang => fileFor(path, lang);
  const files = Object.keys(words).map(fileOf);
  const linking = linkedFrom.flatMap(from => LANGS.map(lang => fileFor(from, lang)));
  /* A link to the draft in any language: the path itself, not a longer one that starts with it. */
  const link = new RegExp(`href="(/[a-z]{2})?${path.replace(/[/]/g, '\\/')}["#?]`);

  test(`${path}: the draft carries no forbidden claim and nothing private`, () => {
    for (const [lang, draft] of Object.entries(words)) {
      for (const text of strings(draft)) {
        assert.doesNotMatch(text, FORBIDDEN[lang], `${lang}: forbidden word in “${text}”`);
        assert.doesNotMatch(text, PRIVATE, `${lang}: private detail in “${text}”`);
      }
    }
  });

  test(`${path}: a production build leaves the draft out, previews and local builds keep it`, () => {
    assert.equal(inProduction, false, 'the owner has not approved the draft for production');
    assert.equal(builds({ VERCEL_ENV: 'production' }), false);
    assert.equal(builds({ VERCEL_ENV: 'preview' }), true);
    assert.equal(builds({ VERCEL_ENV: 'development' }), true);
    assert.equal(builds({}), true);
    assert.equal(builds({ VERCEL_ENV: 'production' }, true), true, 'approved, production carries it');
  });

  test(`${path}: where the draft is built it is marked and never indexed; no build links, lists or translates it beyond its words`, { skip }, () => {
    const built = existsSync(new URL(fileOf('en'), dist));
    for (const lang of LANGS) {
      const file = fileOf(lang);
      if (!words[lang]) { assert.ok(!existsSync(new URL(file, dist)), `${lang}: no words, no page`); continue; }
      assert.equal(existsSync(new URL(file, dist)), built, `${lang}: built with the English page`);
      if (!built) continue;
      const html = readFileSync(new URL(file, dist), 'utf8');
      assert.ok(html.includes(words[lang].banner), `${lang}: the banner`);
      assert.match(html, /name="robots" content="noindex, nofollow"/);
      assert.ok(!html.includes('hreflang='), `${lang}: a draft has no alternates`);
    }
    const pages = readdirSync(dist, { recursive: true }).filter(f => f.endsWith('.html') && !files.includes(f) && !linking.includes(f));
    for (const page of pages) assert.doesNotMatch(readFileSync(new URL(page, dist), 'utf8'), link, `${page} links the draft`);
    const maps = readdirSync(dist).filter(f => f.startsWith('sitemap') && f.endsWith('.xml'));
    for (const map of maps) assert.ok(!readFileSync(new URL(map, dist), 'utf8').includes(path), `${map} lists the draft`);
  });
}
