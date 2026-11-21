/* /status and the section on /how-it-works are built from the status table in docs/truth-check.md. Here the table and
   the catalogues stay in step: every row has words in every language, no catalogue has words for a row the table
   lacks, and every row was checked on the day the status sentences name (src/i18n/status-date.ts). */
import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { LANGS, catalogues, pathFor } from '../src/i18n/index.ts';
import { STATUS_CHECKED, statusDate } from '../src/i18n/status-date.ts';
import { STATES, loadStatus, parseStatus } from '../src/lib/status.ts';

const rows = loadStatus();
const dist = new URL('../dist/', import.meta.url);
const skip = !existsSync(new URL('index.html', dist)) && 'build the site first';

test('the status table has a row in every state, each key once, each checked on the status day', () => {
  for (const state of STATES) assert.ok(rows.some(row => row.state === state), `no row is ${state}`);
  const keys = rows.map(row => row.key);
  assert.equal(new Set(keys).size, keys.length, 'a key appears twice');
  for (const row of rows) assert.equal(row.checked, STATUS_CHECKED, `${row.key} was checked on ${row.checked}, the status day is ${STATUS_CHECKED}`);
});

test('every language has words for exactly the rows of the table', () => {
  const keys = rows.map(row => row.key).sort();
  for (const lang of LANGS) assert.deepEqual(Object.keys(catalogues[lang].status.items).sort(), keys, `${lang}: status.items differs from docs/truth-check.md`);
});

test('a malformed row stops the build', () => {
  const table = state => `x\n## The status page\n\n| Key | State | Backed by | Checked |\n| -- | -- | -- | -- |\n| form | ${state} | R | 2026-10-25 |\n`;
  assert.deepEqual(parseStatus(table('built')), [{ key: 'form', state: 'built', checked: '2026-10-25' }]);
  assert.throws(() => parseStatus(table('live')), /not one of/);
  assert.throws(() => parseStatus('no table'), /no section/);
});

test('/status shows every row in its column and names the day of the check', { skip }, () => {
  for (const lang of LANGS) {
    const p = pathFor(lang, '/status');
    const html = readFileSync(new URL(`.${p}.html`, dist), 'utf8');
    const t = catalogues[lang].status;
    assert.ok(html.includes(statusDate(lang)), `${lang}: the day of the check`);
    for (const row of rows) assert.ok(html.includes(t.items[row.key]), `${lang}: ${row.key}`);
    const column = id => html.slice(html.indexOf(`id="today-${id}"`)).split('</section>')[0];
    for (const row of rows.filter(r => r.state === 'planned')) assert.ok(column('planned').includes(t.items[row.key]), `${lang}: ${row.key} under planned`);
  }
});
