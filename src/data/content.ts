/* Shared words for the site's demonstrations, in the app's own vocabulary (murks3r/linkbot
   frontend/src/i18n/en.ts: levels, evidence words, reasons), so the site never describes the
   product differently from how the product describes itself. Nothing here interprets anything:
   readings come from the app's interpreter, recorded at a commit (readings.json). */
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

/** The homepage story (Concept A4): many openings → your priorities → the openings that fit →
    your decision. The words and how they are read are the app's interpreter's own (the "story"
    reading); the openings and the one listing are an illustration, and the page says so. Four of
    the openings fit the reading and come forward; the rest step back, softened but still legible
    (never below 3:1 at their size). */
export const STORY = {
  words: 'story',
  /* Twelve show on phones, more on larger screens: the four that fit are all within the first
     twelve, so every size tells the same story. */
  openings: [
    { title: 'Data engineer' }, { title: 'Account executive' },
    { title: 'Senior product designer, health app', fit: true, open: true }, { title: 'UX writer' },
    { title: 'Backend engineer' }, { title: 'Product designer, research team', fit: true }, { title: 'Growth marketer' },
    { title: 'Product designer, agency' }, { title: 'Product designer, public transport', fit: true },
    { title: 'Site reliability engineer' }, { title: 'Brand designer' }, { title: 'Product designer, climate data', fit: true },
    { title: 'Customer success lead' }, { title: 'Frontend developer' }, { title: 'Content designer' },
    { title: 'Marketing manager' }, { title: 'Solutions architect' }, { title: 'Data analyst' }, { title: 'Recruiter' },
    { title: 'QA engineer' }, { title: 'iOS developer' }, { title: 'Motion designer' }, { title: 'Service designer' },
    { title: 'Copywriter' }, { title: 'Platform engineer' }, { title: 'Finance analyst' }, { title: 'Operations manager' },
    { title: 'Illustrator' }, { title: 'Community manager' }, { title: 'Engineering manager' }, { title: 'Graphic designer' },
    { title: 'Product marketing manager' }, { title: 'DevOps engineer' }, { title: 'Technical writer' },
    { title: 'Product manager' }, { title: 'Visual designer' }, { title: 'Data scientist' }, { title: 'Office manager' },
  ] as { title: string; fit?: boolean; open?: boolean }[],
  /** The opened listing, read against the four criteria in the app's evidence words. */
  listing: {
    title: 'Senior product designer, health app',
    facts: 'Lisbon · Full-time · Checked today',
    rows: [
      { ask: 'Product designer', tone: 'fit' as const, says: 'Mentioned', where: 'in the title' },
      { ask: 'Hybrid', tone: 'fit' as const, says: 'Hybrid', where: '“three days a week in the studio”' },
      { ask: 'more research', tone: 'fit' as const, says: 'Mentioned', where: '“you’ll run your own research”' },
      { ask: 'agency work', tone: 'unknown' as const, says: 'Not stated', where: 'Linkbot doesn’t guess' },
    ],
  },
};
