/* The front pages' own words (src/front/*: the home and /who-sees-what, in every language through src/front/copy.ts)
   are checked like the catalogue's: no forbidden claim in the page's language, no empty string, nothing private. The
   translations must keep English's structure: the same criteria with the same controls, options and answers, the same
   pair with the same verdicts, the same stages; only the words differ. */
import test from 'node:test';
import assert from 'node:assert/strict';
import { FRONT } from '../src/front/copy.ts';
import { FORBIDDEN, PRIVATE } from './forbidden.mjs';

const strings = (value, at = '') => {
  if (Array.isArray(value)) return value.flatMap((item, index) => strings(item, `${at}[${index}]`));
  if (value && typeof value === 'object') return Object.entries(value).flatMap(([key, item]) => strings(item, `${at}.${key}`));
  return typeof value === 'string' ? [[at, value]] : [];
};

test('the front pages carry no forbidden claim, no empty string and nothing private, in any language', () => {
  for (const [lang, copy] of Object.entries(FRONT)) {
    for (const [at, text] of strings(copy)) {
      assert.ok(text.trim().length > 0, `${lang}${at}: empty`);
      if (!/^[a-z0-9_.-]+$/.test(text)) assert.doesNotMatch(text, FORBIDDEN[lang], `${lang}${at}: forbidden word in “${text}”`);
      assert.doesNotMatch(text, PRIVATE, `${lang}${at}: private detail in “${text}”`);
    }
  }
});

test('every translation keeps English’s structure and is its own', () => {
  const { en } = FRONT;
  const shape = copy => ({
    criteria: copy.criteria.map(c => [c.key, c.control, c.specials, c.required, c.importance, !!c.phosphatesOnly, c.options?.length, c.bases?.length, c.quick, c.unit, c.hides ? c.options.indexOf(c.hides) : -1]),
    rows: copy.rows.map(r => [r.key, r.importance, r.verdict]),
    stages: copy.stages.map(s => [s.key, s.eyes, s.open, s.fields.map(f => f.verdict ?? null), s.not.length]),
    lists: [copy.b.hero.h1.length, copy.b.why.items.length, copy.c.why.items.length, copy.c.stages.receipt.lines.length, copy.a.ledger.stages.length, copy.home.story.steps.length],
  });
  for (const [lang, copy] of Object.entries(FRONT)) {
    assert.deepEqual(shape(copy), shape(en), `${lang}: the structure differs from English`);
    if (lang === 'en') continue;
    for (const at of ['b.hero.lede', 'c.hero.lede', 'home.story.note', 'a.ledger.state']) {
      const read = obj => at.split('.').reduce((o, k) => o[k], obj);
      assert.notEqual(read(copy), read(en), `${lang}: ${at} is still English`);
    }
  }
});
