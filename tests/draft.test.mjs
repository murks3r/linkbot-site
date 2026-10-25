/* The draft for the owner (/for-intermediaries, src/drafts/intermediaries.ts): its words make no forbidden claim, and
   the built page says it is a draft, is never indexed, has no alternates, and is neither linked from another page nor
   listed in the sitemap. A production build leaves it out until the owner approves it. The build checks are skipped
   until the site is built. */
import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { INTERMEDIARIES_IN_PRODUCTION, buildsIntermediaries, intermediaries } from '../src/drafts/intermediaries.ts';
import { FORBIDDEN, PRIVATE } from './forbidden.mjs';

const strings = value => typeof value === 'string' ? [value] : Array.isArray(value) ? value.flatMap(strings) : value && typeof value === 'object' ? Object.values(value).flatMap(strings) : [];
const dist = new URL('../dist/', import.meta.url);
const skip = !existsSync(new URL('index.html', dist)) && 'build the site first';

test('the draft carries no forbidden claim and nothing private', () => {
  for (const text of strings(intermediaries)) {
    assert.doesNotMatch(text, FORBIDDEN.en, `forbidden word in “${text}”`);
    assert.doesNotMatch(text, PRIVATE, `private detail in “${text}”`);
  }
});

test('a production build leaves the draft out, previews and local builds keep it', () => {
  assert.equal(INTERMEDIARIES_IN_PRODUCTION, false, 'the owner has not approved the draft for production');
  assert.equal(buildsIntermediaries({ VERCEL_ENV: 'production' }), false);
  assert.equal(buildsIntermediaries({ VERCEL_ENV: 'preview' }), true);
  assert.equal(buildsIntermediaries({ VERCEL_ENV: 'development' }), true);
  assert.equal(buildsIntermediaries({}), true);
  assert.equal(buildsIntermediaries({ VERCEL_ENV: 'production' }, true), true, 'approved, production carries it');
});

test('the built draft is marked, never indexed, and reached from nowhere', { skip }, () => {
  const html = readFileSync(new URL('for-intermediaries.html', dist), 'utf8');
  assert.ok(html.includes('Draft, not published, for the owner’s review.'), 'the banner');
  assert.match(html, /name="robots" content="noindex, nofollow"/);
  assert.ok(!html.includes('hreflang='), 'a draft has no alternates');
  for (const lang of ['de', 'es', 'it', 'fr']) assert.ok(!existsSync(new URL(`${lang}/for-intermediaries.html`, dist)), `${lang}: English only`);
  const pages = readdirSync(dist, { recursive: true }).filter(f => f.endsWith('.html') && f !== 'for-intermediaries.html');
  for (const page of pages) assert.ok(!readFileSync(new URL(page, dist), 'utf8').includes('/for-intermediaries'), `${page} links the draft`);
  const maps = readdirSync(dist).filter(f => f.startsWith('sitemap') && f.endsWith('.xml'));
  for (const map of maps) assert.ok(!readFileSync(new URL(map, dist), 'utf8').includes('/for-intermediaries'), `${map} lists the draft`);
});
