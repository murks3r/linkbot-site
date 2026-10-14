/* Shared words for the site's demonstrations, in the app's own vocabulary (murks3r/linkbot
   frontend/src/i18n/en.ts: levels, evidence words, reasons), so the site never describes the
   product differently from how the product describes itself. */
import record from './readings.json';

export const readings = record.readings;
export const readingCommit = record.commit.slice(0, 7);
export const reading = (id: string) => {
  const found = record.readings.find(r => r.id === id);
  if (!found) throw Error(`no recorded reading ${id}`);
  return found;
};

export const LEVEL: Record<string, string> = { must: 'Must', prefer: 'Prefer', open_to: 'Open to', avoid: 'Avoid', never: 'Never' };
export const KIND: Record<string, string> = { role_direction: 'Role', work_mode: 'Work mode', task: 'Work', location: 'Place' };
export const REASON: Record<string, string> = {
  unsupported: 'Linkbot can’t check this yet',
  ambiguous: 'Too open to read reliably',
  needs_preferences: 'Set this with a level instead',
};
export const LEVEL_HINT = {
  must: 'Hides listings that state otherwise. Listings that don’t say stay, marked.',
  prefer: 'Shown higher when the listing states it.',
  avoid: 'Shown lower when the listing states it.',
};

/** One illustrative listing, read the way the app reads every listing. It is an example, and the
    page says so wherever it appears. */
export const LISTING = {
  title: 'Senior Backend Engineer',
  org: 'Example Systems',
  place: 'Berlin',
  hours: 'Full-time',
  posted: 'Posted 2 days ago',
  checked: 'Checked today',
  source: 'the employer’s own careers page',
  also: 'Also listed on one job board: merged into this one listing.',
  rows: [
    { id: 'role', ask: 'Senior backend engineer', level: 'Prefer', tone: 'fit' as const, says: 'Mentioned', where: 'in the title' },
    { id: 'mode', ask: 'Remote', level: 'Prefer', tone: 'tradeoff' as const, says: 'Hybrid, not remote', where: 'from the listing’s work-mode field' },
    { id: 'manage', ask: 'management', level: 'Avoid', tone: 'unknown' as const, says: 'Not mentioned', where: 'Nothing in the listing mentions it. Linkbot doesn’t guess what that means.' },
  ],
};
