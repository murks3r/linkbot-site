/* Linkbot's fixed terms (src/i18n/terms.ts) are the one source of its words: every language names every term once, each
   definition is a claim the copy may make, and no synonym the list refuses appears anywhere in the site's words: the
   catalogues, the home's copy and the terms' own definitions. */
import test from 'node:test';
import assert from 'node:assert/strict';
import { LANGS, catalogues } from '../src/i18n/index.ts';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { INTERNAL, TERMS, TERM_KEYS } from '../src/i18n/terms.ts';
import { FRONT } from '../src/front/copy.ts';
import { FORBIDDEN, PRIVATE } from './forbidden.mjs';

const strings = (value, at = '') => {
  if (Array.isArray(value)) return value.flatMap((item, index) => strings(item, `${at}[${index}]`));
  if (value && typeof value === 'object') return Object.entries(value).flatMap(([key, item]) => strings(item, `${at}.${key}`));
  return typeof value === 'string' ? [[at, value]] : [];
};
const words = lang => [
  ...strings(catalogues[lang], 'catalogue'),
  ...strings(FRONT[lang], 'front'),
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

/* The built public pages (the sitemap's: no draft, no 404, no preview) say none of the team's own words, and /developers
   with its docs under /developers/docs alone may (they are a developer's pages). Code and preformatted text are identifiers, not copy. Skipped until the site is built. */
const dist = fileURLToPath(new URL('../dist/', import.meta.url));
const built = existsSync(join(dist, 'index.html'));
const DRAFTS = /(^|\/)developers\/(login-with-linkbot|a-new-vertical|prepare-a-request)\.html$/;
const visible = html => [
  html.match(/<title>([^<]*)<\/title>/)?.[1] ?? '',
  ...[...html.matchAll(/<meta (?:name="description"|property="og:(?:title|description)") content="([^"]*)"/g)].map(m => m[1]),
  html.replace(/<(script|style|code|pre|svg)\b[\s\S]*?<\/\1>/g, ' ').replace(/<head>[\s\S]*?<\/head>/, ' ').replace(/<[^>]+>/g, ' '),
].join(' ').replace(/&#39;|&#x27;/g, "'").replace(/&amp;/g, '&');

test('no public page says pack, watch, Beobachten, staging or Geoprocure (except /developers and its docs)', { skip: !built && 'build the site first' }, () => {
  const pages = readdirSync(dist, { recursive: true }).filter(f => f.endsWith('.html') && !f.startsWith('__preview') && f !== '404.html' && !DRAFTS.test(f) && !/(^|\/)developers(\.html$|\/docs[./])/.test(f));
  assert.ok(pages.length > 20, `only ${pages.length} pages`);
  const hits = pages.flatMap(f => [...visible(readFileSync(join(dist, f), 'utf8')).matchAll(new RegExp(INTERNAL, 'gi'))].map(m => `${f}: “${m[0]}”`));
  assert.deepEqual(hits, []);
});

/* No public page, /developers and its docs included, and neither llms.txt nor llms-full.txt names the team's own
   working words: a repository owner, a lane or team, an internal host or tool, a ticket id, the engine's team name
   ("Core" on its own; "open core" is the product's word, written lower-case). Trust's grep of 2026-11-03 (T-PUB2), case
   as there; visible text, attributes and JSON-LD, not the page's own code. Skipped until the site is built. */
const TEAM_WORDS = /murks3r|staging|[Pp]ilot|slice [ES]?[0-9]|M[0-9] go|Core posted|Core serves|plan §|Core-Engine|owner.s (go|decision)|owner decision|Geoprocure|GeoProcure|Trust (team|lane)|Connect (team|lane)|ADR [SV][0-9]|lane|Railway|Vercel|Linear|Maestro|DeepSeek|Claude|GEO-[0-9]+|FUND|build\/vision|D-S[0-9]|C-28|Notion|\bCore\b/g;
const copy = html => html.replace(/<style\b[\s\S]*?<\/style>/g, ' ').replace(/<script\b(?![^>]*application\/ld\+json)[^>]*>[\s\S]*?<\/script>/g, ' ');

test('no public page and no llms file names the team’s own words', { skip: !built && 'build the site first' }, () => {
  const pages = readdirSync(dist, { recursive: true }).filter(f => (f.endsWith('.html') && !f.startsWith('__preview') && f !== '404.html' && !DRAFTS.test(f)) || /^llms(-full)?\.txt$/.test(f));
  assert.ok(pages.length > 20, `only ${pages.length} pages`);
  const hits = pages.flatMap(f => [...copy(readFileSync(join(dist, f), 'utf8')).matchAll(TEAM_WORDS)].map(m => `${f}: “${m[0]}”`));
  assert.deepEqual(hits, []);
});
