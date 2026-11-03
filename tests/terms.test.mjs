/* Linkbot's fixed terms (src/i18n/terms.ts) are the one source of its words: every language names every term once, each
   definition is a claim the copy may make, and no synonym the list refuses appears anywhere in the site's words: the
   catalogues, the front's copy, the FAQ and the terms' own definitions. /faq carries the same words as its questions. */
import test from 'node:test';
import assert from 'node:assert/strict';
import { LANGS, catalogues } from '../src/i18n/index.ts';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { INTERNAL, TERMS, TERM_KEYS } from '../src/i18n/terms.ts';
import { FRONT } from '../src/front/copy.ts';
import { FAQ, faqSchema } from '../src/faq/index.ts';
import { FORBIDDEN, PRIVATE } from './forbidden.mjs';

const strings = (value, at = '') => {
  if (Array.isArray(value)) return value.flatMap((item, index) => strings(item, `${at}[${index}]`));
  if (value && typeof value === 'object') return Object.entries(value).flatMap(([key, item]) => strings(item, `${at}.${key}`));
  return typeof value === 'string' ? [[at, value]] : [];
};
const words = lang => [
  ...strings(catalogues[lang], 'catalogue'),
  ...strings(FRONT[lang], 'front'),
  ...strings(FAQ[lang], 'faq'),
  ...TERM_KEYS.map(key => [`terms.${key}`, TERMS[lang][key].definition]),
];

test('every language names every term once, with one definition that makes no forbidden claim', () => {
  for (const lang of LANGS) {
    assert.deepEqual(Object.keys(TERMS[lang]), [...TERM_KEYS], `${lang}: the terms`);
    const names = TERM_KEYS.map(key => TERMS[lang][key].term.toLowerCase());
    assert.equal(new Set(names).size, names.length, `${lang}: two terms share a name`);
    for (const key of TERM_KEYS) {
      const { term, definition, avoid } = TERMS[lang][key];
      assert.ok(term.trim() && definition.length > 40, `${lang}.${key}: term and definition`);
      assert.ok(avoid.length > 0 && avoid.every(re => re instanceof RegExp), `${lang}.${key}: synonyms to refuse`);
      for (const text of [term, definition]) {
        assert.doesNotMatch(text, FORBIDDEN[lang], `${lang}.${key}: forbidden word in “${text}”`);
        assert.doesNotMatch(text, PRIVATE, `${lang}.${key}: private detail in “${text}”`);
      }
    }
    assert.match(TERMS[lang].checkedHistory.definition, /^(Planned|Geplant|Previsto|Prévu)/, `${lang}: the checked history is planned and says so`);
  }
});

test('no synonym the term list refuses appears in the site’s words', () => {
  for (const lang of LANGS) for (const [at, text] of words(lang)) for (const key of TERM_KEYS) for (const re of TERMS[lang][key].avoid) {
    assert.doesNotMatch(text, re, `${lang} ${at}: “${text.match(re)?.[0]}” is a synonym of “${TERMS[lang][key].term}”`);
  }
});

test('the FAQ has the same six questions in every language, no forbidden claim, and its schema says what the page says', () => {
  for (const lang of LANGS) {
    const faq = FAQ[lang];
    assert.equal(faq.items.length, 6, `${lang}: six questions`);
    for (const [at, text] of strings(faq)) {
      assert.doesNotMatch(text, FORBIDDEN[lang], `${lang} faq${at}: forbidden word in “${text}”`);
      assert.doesNotMatch(text, PRIVATE, `${lang} faq${at}: private detail in “${text}”`);
    }
    const schema = faqSchema(faq);
    assert.deepEqual(schema.mainEntity.map(q => q.name), faq.items.map(item => item.q));
    // The answer to "What is Linkbot?" names all three steps by their terms (every word of each, as German reorders
    // "beide sagen Ja" in a clause).
    const first = new Set(faq.items[0].a.join(' ').toLowerCase().split(/[^\p{L}]+/u));
    for (const key of ['check', 'privateMatch', 'bothSayYes']) for (const word of TERMS[lang][key].term.toLowerCase().split(' ')) assert.ok(first.has(word), `${lang}: the first answer names “${TERMS[lang][key].term}”`);
  }
});

/* The built public pages (the sitemap's: no draft, no 404, no preview) say none of the team's own words, and /developers
   with its docs under /developers/docs alone may (they are a developer's pages). Code and preformatted text are identifiers, not copy. Skipped until the site is built. */
const dist = fileURLToPath(new URL('../dist/', import.meta.url));
const built = existsSync(join(dist, 'index.html'));
const DRAFTS = /(^|\/)(for-intermediaries|developers\/(login-with-linkbot|a-new-vertical|prepare-a-request))\.html$/;
const visible = html => [
  html.match(/<title>([^<]*)<\/title>/)?.[1] ?? '',
  ...[...html.matchAll(/<meta (?:name="description"|property="og:(?:title|description)") content="([^"]*)"/g)].map(m => m[1]),
  html.replace(/<(script|style|code|pre|svg)\b[\s\S]*?<\/\1>/g, ' ').replace(/<head>[\s\S]*?<\/head>/, ' ').replace(/<[^>]+>/g, ' '),
].join(' ').replace(/&#39;|&#x27;/g, "'").replace(/&amp;/g, '&');

test('no public page says pack, watch, Beobachten, staging or Geoprocure (except /developers and its docs)', { skip: !built && 'build the site first' }, () => {
  const pages = readdirSync(dist, { recursive: true }).filter(f => f.endsWith('.html') && !f.startsWith('__preview') && f !== '404.html' && !DRAFTS.test(f) && !/(^|\/)developers(\.html$|\/docs[./])/.test(f));
  assert.ok(pages.length > 100, `only ${pages.length} pages`);
  const hits = pages.flatMap(f => [...visible(readFileSync(join(dist, f), 'utf8')).matchAll(new RegExp(INTERNAL, 'gi'))].map(m => `${f}: “${m[0]}”`));
  assert.deepEqual(hits, []);
});
