/* The front page's own words (src/front/*, English only until a direction is picked) are checked like the
   catalogue's: no forbidden claim, no empty string, nothing private. The texts register themselves in
   src/front/texts.ts, so a new module is scanned the moment it is added there. */
import test from 'node:test';
import assert from 'node:assert/strict';
import { TEXTS } from '../src/front/texts.ts';
import { FORBIDDEN, PRIVATE } from './forbidden.mjs';

const strings = (value, at = '') => {
  if (Array.isArray(value)) return value.flatMap((item, index) => strings(item, `${at}[${index}]`));
  if (value && typeof value === 'object') return Object.entries(value).flatMap(([key, item]) => strings(item, `${at}.${key}`));
  return typeof value === 'string' ? [[at, value]] : [];
};

test('the front page carries no forbidden claim, no empty string and nothing private', () => {
  assert.ok(Object.keys(TEXTS).length > 0, 'no front texts registered');
  for (const [name, texts] of Object.entries(TEXTS)) {
    for (const [at, text] of strings(texts)) {
      assert.ok(text.trim().length > 0, `${name}${at}: empty`);
      if (!/^[a-z0-9_.-]+$/.test(text)) assert.doesNotMatch(text, FORBIDDEN.en, `${name}${at}: forbidden word in “${text}”`);
      assert.doesNotMatch(text, PRIVATE, `${name}${at}: private detail in “${text}”`);
    }
  }
});
