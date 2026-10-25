/* The status sentences carry the day they were checked (src/i18n/status-date.ts), so that a reader sees how
   old a status is. Here a status older than 14 days fails, so it is re-checked instead of going stale
   unnoticed: re-read the staging space's /health and the Connect lane's plan §1, then renew the
   sentences, their rows in docs/truth-check.md and STATUS_CHECKED together. */
import test from 'node:test';
import assert from 'node:assert/strict';
import { LANGS } from '../src/i18n/locales.ts';
import { catalogues } from '../src/i18n/index.ts';
import { STATUS_CHECKED, statusDate } from '../src/i18n/status-date.ts';

const MAX_AGE_DAYS = 14;
const DAY = 86_400_000;

test(`the status was checked at most ${MAX_AGE_DAYS} days ago`, () => {
  const age = (Date.now() - Date.parse(`${STATUS_CHECKED}T00:00:00Z`)) / DAY;
  // A day of slack for time zones ahead of UTC.
  assert.ok(age > -1, `STATUS_CHECKED (${STATUS_CHECKED}) lies in the future`);
  assert.ok(
    age <= MAX_AGE_DAYS,
    `the status was checked ${Math.floor(age)} days ago (${STATUS_CHECKED}): re-read the staging space's /health and the Connect lane's plan §1, then renew the status sentences, their truth-check rows and STATUS_CHECKED`,
  );
});

test('every language dates its status sentences', () => {
  for (const lang of LANGS) {
    const c = catalogues[lang];
    const day = statusDate(lang);
    for (const [where, text] of [
      ['home.ways.lede', c.home.ways.lede],
      ['how.describe.lede', c.how.describe.lede],
      ['how.today.lede', c.how.today.lede],
    ]) assert.ok(text.includes(day), `${lang} ${where} does not name the day of the check (${day})`);
  }
});
