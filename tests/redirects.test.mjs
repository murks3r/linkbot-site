/* The marketing pages moved to sensalio.de (src/lib/marketing.ts); their old addresses here redirect (vercel.json). Every
   old address, in every language, has exactly one rule; a rule to sensalio.de goes to that site's home in the reader's
   language or to its matching section (Verticals' map, 2026-11-11: German at the root, English under /en, which also
   takes Spanish, Italian and French); the integration pages go to their page in the docs here. A rule names no
   parameter, so Vercel appends nothing to its destination. The build checks, skipped until the site is built: no page
   is built where a rule would hide it, and every rule inside this site leads to a built page. */
import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { LANGS, pathFor } from '../src/i18n/index.ts';
import { MARKETING_ORIGIN } from '../src/lib/marketing.ts';

const { redirects } = JSON.parse(readFileSync(new URL('../vercel.json', import.meta.url), 'utf8'));
const dist = new URL('../dist/', import.meta.url);
const skip = !existsSync(new URL('index.html', dist)) && 'build the site first';
const built = path => existsSync(new URL(`.${path === '/' ? '/index' : path}.html`, dist));

/** Each old page and where it goes: [English and the other languages, German] on sensalio.de, or a path here. */
const MOVED = {
  '/faq': ['/en#faq', '/#faq'],
  '/how-it-works': ['/en#how', '/#how'],
  '/who-sees-what': ['/en#demo', '/#demo'],
  '/demo': ['/en#demo', '/#demo'],
  '/request-a-demo': ['/en#demo', '/#demo'],
  '/verticals': ['/en/in-use', '/im-einsatz'],
  '/one-page': ['/en', '/'],
};
const DOCS = { embed: 'reference/embed', sdk: 'reference/sdk', astro: 'recipes/astro', nextjs: 'recipes/nextjs', wordpress: 'recipes/wordpress' };

const expected = LANGS.flatMap(lang => [
  ...Object.entries(MOVED).map(([page, [other, de]]) => [pathFor(lang, page), MARKETING_ORIGIN + (lang === 'de' ? de : other)]),
  [`/linkbot-one-page-${lang}.pdf`, MARKETING_ORIGIN + (lang === 'de' ? '/' : '/en')],
  ...Object.entries(DOCS).map(([page, doc]) => [pathFor(lang, `/platforms/${page}`), `/developers/docs/${doc}`]),
  ...['/for-platforms', '/platforms', '/platforms/console'].map(page => [pathFor(lang, page), pathFor(lang, '/developers')]),
]);

test('every old address has exactly one redirect, to the page the map names, without parameters', () => {
  const sources = redirects.map(rule => rule.source);
  assert.equal(new Set(sources).size, sources.length, 'a source twice');
  const pairs = rules => rules.map(([source, destination]) => `${source} → ${destination}`).sort();
  assert.deepEqual(pairs(redirects.map(rule => [rule.source, rule.destination])), pairs(expected));
  for (const rule of redirects) {
    assert.doesNotMatch(rule.source, /[:()*?]/, `${rule.source}: a parameter`);
    assert.equal(rule.permanent, !rule.destination.startsWith('https://'), `${rule.source}: permanent only inside this site`);
  }
});

test('no built page hides behind a redirect, and every redirect inside this site leads to a built page', { skip }, () => {
  for (const { source, destination } of redirects) {
    assert.ok(!built(source) && !existsSync(new URL(`.${source}`, dist)), `${source} is built and a redirect hides it`);
    if (destination.startsWith('/')) assert.ok(built(destination), `${source} → ${destination}: no such page`);
  }
});
