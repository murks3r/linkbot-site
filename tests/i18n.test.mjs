/* The words of the site are evidence, so they are checked: every language has exactly English's
   keys (the types say so too; this runs without a compiler), no catalogue carries a claim BUILD
   MODE bans or anything that belongs to no public page, a language without a catalogue falls
   back to English and says so, and every address is built the same way. */
import test from 'node:test';
import assert from 'node:assert/strict';
import { en } from '../src/i18n/en.ts';
import { DEFAULT_LANG, FALLBACK_NOTICE, LANGS, NAMES, catalogues, langPaths, pathFor, resolve } from '../src/i18n/index.ts';

/** Every key path of a catalogue, arrays included, so a missing item or a reordered list shows. */
const shape = (value, at = '') => {
  if (Array.isArray(value)) return value.flatMap((item, index) => shape(item, `${at}[${index}]`));
  if (value && typeof value === 'object') return Object.entries(value).flatMap(([key, item]) => shape(item, `${at}.${key}`));
  return [`${at}:${typeof value}`];
};
/** Every string of a catalogue with where it sits. */
const strings = (value, at = '') => {
  if (Array.isArray(value)) return value.flatMap((item, index) => strings(item, `${at}[${index}]`));
  if (value && typeof value === 'object') return Object.entries(value).flatMap(([key, item]) => strings(item, `${at}.${key}`));
  return typeof value === 'string' ? [[at, value]] : [];
};

import { FORBIDDEN, PRIVATE } from './forbidden.mjs';

test('every language the site offers has a name and a fallback notice', () => {
  assert.deepEqual([...LANGS], ['en', 'de', 'es', 'it', 'fr']);
  for (const lang of LANGS) { assert.ok(NAMES[lang], `${lang}: name`); assert.ok(FALLBACK_NOTICE[lang].length > 10, `${lang}: fallback notice`); }
});

test('every catalogue has exactly the keys and list lengths of English', () => {
  assert.ok(catalogues.en === en);
  for (const [lang, catalogue] of Object.entries(catalogues)) assert.deepEqual(shape(catalogue), shape(en), `${lang}: shape differs from English`);
});

test('no catalogue carries a forbidden claim, an empty string or anything private', () => {
  for (const [lang, catalogue] of Object.entries(catalogues)) {
    for (const [at, text] of strings(catalogue)) {
      assert.ok(text.trim().length > 0, `${lang}${at}: empty`);
      if (!/^[a-z0-9_.-]+$/.test(text)) assert.doesNotMatch(text, FORBIDDEN[lang], `${lang}${at}: forbidden word in “${text}”`);
      assert.doesNotMatch(text, PRIVATE, `${lang}${at}: private detail in “${text}”`);
    }
  }
});

/** The values no language may change: anchors (toc and section ids), status values, and what a
    section sets in code (event types, attribute names). A changed one breaks a link or states
    something false. */
const identifiers = catalogue => [
  ...['how', 'platforms', 'verticals'].flatMap(page => catalogue[page].toc.map(([id]) => `${page}.toc:${id}`)),
  ...catalogue.home.ways.items.map(way => `home.ways:${way.status}`),
  ...catalogue.how.describe.items.map(way => `how.describe:${way.status}`),
  ...catalogue.how.today.columns.map(column => `how.today:${column.status}`),
  ...Object.entries(catalogue.integrations.pages).flatMap(([key, page]) => page.sections.flatMap(section => [
    `${key}.section:${section.id}`,
    ...(section.code ? [...(section.items ?? []), ...(section.rows ?? []).map(row => row.name)].map(value => `${key}.${section.id}.code:${value}`) : []),
  ])),
];

test('identifiers are the same in every language', () => {
  for (const [lang, catalogue] of Object.entries(catalogues)) assert.deepEqual(identifiers(catalogue), identifiers(en), `${lang}: an identifier differs from English`);
});

test('every page has a title and a description of a sensible length', () => {
  for (const [lang, catalogue] of Object.entries(catalogues)) {
    const pages = [...['home', 'how', 'platforms', 'verticals', 'privacy', 'imprint', 'notFound'].map(key => [key, catalogue[key]]), ...Object.entries(catalogue.integrations.pages).map(([key, page]) => [`integrations.${key}`, page])];
    for (const [key, page] of pages) {
      assert.ok(page.title.length >= 10 && page.title.length <= 80, `${lang}.${key}.title: ${page.title.length} characters`);
      assert.ok(page.description.length >= 50 && page.description.length <= 160, `${lang}.${key}.description: ${page.description.length} characters`);
    }
  }
});

test('a language without a catalogue falls back to English and says so; one with a catalogue does not', () => {
  for (const lang of LANGS) {
    const { t, fallback } = resolve(lang);
    if (catalogues[lang]) { assert.equal(t, catalogues[lang], `${lang}: its own words`); assert.equal(fallback, false); }
    else { assert.equal(t, en, `${lang}: English stands in`); assert.equal(fallback, true); assert.notEqual(lang, DEFAULT_LANG); }
  }
});

test('addresses: English at the root, every other language under its prefix', () => {
  assert.equal(pathFor('en', '/'), '/');
  assert.equal(pathFor('en', '/how-it-works'), '/how-it-works');
  assert.equal(pathFor('de', '/'), '/de');
  assert.equal(pathFor('de', '/how-it-works'), '/de/how-it-works');
  assert.deepEqual(langPaths().map(p => p.params.lang), [undefined, 'de', 'es', 'it', 'fr']);
  assert.deepEqual(langPaths().map(p => p.props.lang), [...LANGS]);
});
