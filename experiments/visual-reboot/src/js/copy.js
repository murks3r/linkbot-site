// @ts-nocheck
/**
 * Words that flex per register. Everything else (type, grid, controls, seal) is
 * shared: three registers of ONE brand, not three brands.
 */
export const REGISTERS = {
  talent: { id: 'talent', name: 'Talent', direction: 'A · Notarial', blurb: 'For people looking for work. Calm, plain, and on your side.' },
  developers: { id: 'developers', name: 'Developers', direction: 'B · Protocol', blurb: 'For people who build with the record. Fields, nulls and provenance as data.' },
  employers: { id: 'employers', name: 'Employers', direction: 'C · Commons', blurb: 'For employers and agencies. Be found with your record straight.' },
};

export const COPY = {
  talent: {
    eyebrow: 'Free · public · no account',
    h1: 'Every job, on the record.',
    lead: 'Search every listing we can attribute — free, without signing up. Each one shows who published it, when we last saw it, and what nobody has told us yet.',
    what: 'Role, skill or employer',
    cta: (n) => `Search ${n} jobs`,
    agent: 'Job Agent',
    specimenKicker: 'Specimen record',
  },
  developers: {
    eyebrow: 'Open record · structured provenance',
    h1: 'Every job, as structured data.',
    lead: 'The same free, public record, read as an object: every field nullable on purpose, every listing carrying its source, its observation history and its seal. No key, no account.',
    what: 'engineer, remote, go …',
    cta: (n) => `Query ${n} records`,
    agent: 'Job Agent',
    specimenKicker: 'Record · JSON',
  },
  employers: {
    eyebrow: 'For employers & agencies',
    h1: 'Be found, with your record straight.',
    lead: 'Every listing carries your name, your dates and your own apply link — read at your page, not a copy of a copy. Candidates see what you stated, and what you did not.',
    what: 'Your company name',
    cta: () => 'Check how we appear',
    agent: 'Job Agent',
    specimenKicker: 'How a listing appears',
  },
};

export const QUICK_SEARCHES = [
  { label: 'Remote', q: 'remote' },
  { label: 'Backend', q: 'backend' },
  { label: 'Data', q: 'data' },
  { label: 'Design', q: 'designer' },
  { label: 'Berlin', q: 'berlin' },
  { label: 'Nursing', q: 'nurse' },
];
