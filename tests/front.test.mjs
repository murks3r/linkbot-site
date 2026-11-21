/* The front pages' own words (src/front/*: the landing page, /who-sees-what and /demo, in every language through
   src/front/copy.ts) are checked like the catalogue's: no forbidden claim in the page's language, no empty string,
   nothing private. The translations must keep English's structure: the same cards, the same stages, the same steps;
   only the words differ. */
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
      // The status label "Live" is the one exemption (docs/front/landing-plan.md, decision 8): this key, no other.
      if (!/^[a-z0-9_.-]+$/.test(text) && at !== '.landing.labels.live') assert.doesNotMatch(text, FORBIDDEN[lang], `${lang}${at}: forbidden word in “${text}”`);
      assert.doesNotMatch(text, PRIVATE, `${lang}${at}: private detail in “${text}”`);
    }
  }
});

test('every translation keeps English’s structure and is its own', () => {
  const { en } = FRONT;
  const shape = copy => ({
    stages: copy.stages.map(s => [s.key, s.eyes, s.open, s.fields.map(f => f.verdict ?? null), s.not.length]),
    lists: [copy.landing.cards.items.length, copy.landing.cards.items.map(card => 'small' in card), copy.c.why.items.length, copy.c.stages.receipt.lines.length, copy.a.ledger.stages.length, copy.demo.steps.items.length],
  });
  for (const [lang, copy] of Object.entries(FRONT)) {
    assert.deepEqual(shape(copy), shape(en), `${lang}: the structure differs from English`);
    if (lang === 'en') continue;
    for (const at of ['landing.opening.sub', 'landing.bottom.line', 'c.hero.lede', 'a.ledger.state', 'demo.test']) {
      const read = obj => at.split('.').reduce((o, k) => o[k], obj);
      assert.notEqual(read(copy), read(en), `${lang}: ${at} is still English`);
    }
  }
});
