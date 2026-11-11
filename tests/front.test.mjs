/* The home's own words (src/front/*, in every language through src/front/copy.ts) are checked like the catalogue's:
   no forbidden claim in the page's language, no empty string, nothing private. The translations must keep English's
   structure: the demo keeps English's steps and its verdicts per criterion; only the words differ. */
import test from 'node:test';
import assert from 'node:assert/strict';
import { FRONT } from '../src/front/copy.ts';
import { FORBIDDEN, PRIVATE } from './forbidden.mjs';

const strings = (value, at = '') => {
  if (Array.isArray(value)) return value.flatMap((item, index) => strings(item, `${at}[${index}]`));
  if (value && typeof value === 'object') return Object.entries(value).flatMap(([key, item]) => strings(item, `${at}.${key}`));
  return typeof value === 'string' ? [[at, value]] : [];
};

test('the home carries no forbidden claim, no empty string and nothing private, in any language', () => {
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
  const shape = copy => [copy.landing.trial.steps.length, copy.landing.trial.match.criteria.map(c => c.verdict)];
  for (const [lang, copy] of Object.entries(FRONT)) {
    assert.deepEqual(shape(copy), shape(en), `${lang}: the structure differs from English`);
    if (lang === 'en') continue;
    for (const at of ['landing.opening.h1', 'landing.opening.sub.today', 'landing.trial.yes.declined', 'landing.embed.p', 'landing.bottom.h2', 'landing.bottom.line']) {
      const read = obj => at.split('.').reduce((o, k) => o[k], obj);
      assert.notEqual(read(copy), read(en), `${lang}: ${at} is still English`);
    }
  }
});
