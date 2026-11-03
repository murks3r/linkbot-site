/* /changelog is built from docs/changelog.yml. Here every entry has a source, a state and a true sentence in every
   language, a malformed entry stops the build, and the built page shows every entry with its source. */
import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { LANGS, pathFor } from '../src/i18n/index.ts';
import { longDay } from '../src/i18n/status-date.ts';
import { loadChangelog, parseChangelog } from '../src/lib/changelog.ts';
import { FORBIDDEN, PRIVATE } from './forbidden.mjs';

const entries = loadChangelog();
const dist = new URL('../dist/', import.meta.url);
const skip = !existsSync(new URL('index.html', dist)) && 'build the site first';

test('every entry is dated no later than today and its sentences carry no forbidden claim or private detail', () => {
  const today = new Date().toISOString().slice(0, 10);
  for (const entry of entries) {
    assert.ok(entry.date <= today, `${entry.date} lies in the future`);
    for (const lang of LANGS) {
      assert.doesNotMatch(entry.text[lang], FORBIDDEN[lang], `${entry.date} ${lang}: forbidden word in “${entry.text[lang]}”`);
      assert.doesNotMatch(entry.text[lang], PRIVATE, `${entry.date} ${lang}: private detail in “${entry.text[lang]}”`);
    }
  }
});

test('an entry without a source, a state or a language stops the build', () => {
  const yml = (sources, state = 'built', text = 'en: a\n      de: a\n      es: a\n      it: a\n      fr: a') =>
    `entries:\n  - date: "2026-10-25"\n    state: ${state}\n    ${sources}\n    text:\n      ${text}\n`;
  assert.equal(parseChangelog(yml('sources: [{ repo: murks3r/linkbot, pr: 1 }]')).length, 1);
  assert.throws(() => parseChangelog(yml('sources: []')), /no source/);
  assert.throws(() => parseChangelog(yml('other: 1')), /no source/);
  assert.throws(() => parseChangelog(yml('sources: [{ repo: murks3r/linkbot }]')), /PR number/);
  assert.throws(() => parseChangelog(yml('sources: [{ repo: someone/else, pr: 1 }]')), /repository/);
  assert.throws(() => parseChangelog(yml('sources: [{ repo: murks3r/linkbot, pr: 1 }]', 'live')), /not one of/);
  assert.throws(() => parseChangelog(yml('sources: [{ repo: murks3r/linkbot, pr: 1 }]', 'built', 'en: a')), /no text in de/);
});

test('/changelog shows every entry with its day and sources, in every language', { skip }, () => {
  for (const lang of LANGS) {
    const html = readFileSync(new URL(`.${pathFor(lang, '/changelog')}.html`, dist), 'utf8');
    for (const entry of entries) {
      assert.ok(html.includes(longDay(lang, entry.date)), `${lang}: the day ${entry.date}`);
      for (const { repo, pr } of entry.sources) assert.ok(html.includes(`${repo} #${pr}`), `${lang}: ${repo} #${pr}`);
    }
    assert.equal((html.match(/class="entry"/g) ?? []).length, entries.length, `${lang}: one item per entry`);
  }
});
