/* Where each part of the product stands, read at build time from the table "The status page" in docs/truth-check.md:
   the one source for /status and for the section on /how-it-works, so a page cannot say more than the truth check.
   The words for each row are in the catalogues (status.items); tests/status-page.test.mjs keeps both in step. */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

export const STATES = ['on staging', 'built', 'planned'] as const;
export type State = (typeof STATES)[number];
export interface StatusRow { key: string; state: State; checked: string }

const HEADING = '## The status page';
const isState = (value: string): value is State => (STATES as readonly string[]).includes(value);

/** The rows of the status table in a truth check; throws on a malformed row, so a bad edit stops the build. */
export const parseStatus = (markdown: string): StatusRow[] => {
  const start = markdown.indexOf(`\n${HEADING}`);
  if (start < 0) throw new Error(`docs/truth-check.md has no section “${HEADING}”`);
  const section = markdown.slice(start + 1).split(/\n## /)[0];
  const rows = section.split('\n').filter(line => line.startsWith('| ')).slice(2);
  return rows.map(line => {
    const [key, state, , checked] = line.split('|').slice(1, -1).map(cell => cell.trim());
    if (!/^[a-z][a-zA-Z]*$/.test(key ?? '')) throw new Error(`status: a malformed key in “${line}”`);
    if (!isState(state)) throw new Error(`status: ${key} has the state “${state}”, not one of ${STATES.join(', ')}`);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(checked ?? '')) throw new Error(`status: ${key} has no date checked`);
    return { key, state, checked };
  });
};

/** The status table of this repository's truth check. Run from the repository's root, as the build and the tests are. */
export const loadStatus = (): StatusRow[] => parseStatus(readFileSync(join(process.cwd(), 'docs/truth-check.md'), 'utf8'));
