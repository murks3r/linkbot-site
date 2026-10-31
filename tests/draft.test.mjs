/* The drafts for the owner (/for-intermediaries, src/drafts/intermediaries.ts; /developers/login-with-linkbot,
   src/drafts/login.ts): their words make no forbidden claim, and each built page says it is a draft, is never indexed,
   has no alternates, and is neither linked from another page nor listed in the sitemap. A production build leaves a
   draft out until the owner approves it; the build checks then assert it is absent, so the artefact that goes live is
   checked too. The build checks are skipped until the site is built. */
import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { INTERMEDIARIES_IN_PRODUCTION, buildsIntermediaries, intermediaries } from '../src/drafts/intermediaries.ts';
import { LOGIN_IN_PRODUCTION, buildsLogin, login } from '../src/drafts/login.ts';
import { FORBIDDEN, PRIVATE } from './forbidden.mjs';

const strings = value => typeof value === 'string' ? [value] : Array.isArray(value) ? value.flatMap(strings) : value && typeof value === 'object' ? Object.values(value).flatMap(strings) : [];
const dist = new URL('../dist/', import.meta.url);
const skip = !existsSync(new URL('index.html', dist)) && 'build the site first';

const drafts = [
  { path: '/for-intermediaries', words: intermediaries, builds: buildsIntermediaries, inProduction: INTERMEDIARIES_IN_PRODUCTION },
  { path: '/developers/login-with-linkbot', words: login, builds: buildsLogin, inProduction: LOGIN_IN_PRODUCTION },
];

for (const { path, words, builds, inProduction } of drafts) {
  const file = `${path.slice(1)}.html`;

  test(`${path}: the draft carries no forbidden claim and nothing private`, () => {
    for (const text of strings(words)) {
      assert.doesNotMatch(text, FORBIDDEN.en, `forbidden word in “${text}”`);
      assert.doesNotMatch(text, PRIVATE, `private detail in “${text}”`);
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

  test(`${path}: where the draft is built it is marked and never indexed; no build links, lists or translates it`, { skip }, () => {
    if (existsSync(new URL(file, dist))) {
      const html = readFileSync(new URL(file, dist), 'utf8');
      assert.ok(html.includes(words.banner), 'the banner');
      assert.match(html, /name="robots" content="noindex, nofollow"/);
      assert.ok(!html.includes('hreflang='), 'a draft has no alternates');
    }
    for (const lang of ['de', 'es', 'it', 'fr']) assert.ok(!existsSync(new URL(`${lang}/${file}`, dist)), `${lang}: English only`);
    const pages = readdirSync(dist, { recursive: true }).filter(f => f.endsWith('.html') && f !== file);
    for (const page of pages) assert.ok(!readFileSync(new URL(page, dist), 'utf8').includes(path), `${page} links the draft`);
    const maps = readdirSync(dist).filter(f => f.startsWith('sitemap') && f.endsWith('.xml'));
    for (const map of maps) assert.ok(!readFileSync(new URL(map, dist), 'utf8').includes(path), `${map} lists the draft`);
  });
}
