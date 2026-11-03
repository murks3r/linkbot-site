/* Direction C, "Who sees what, and when." (front-page preview, GEO-188, 2026-10-24): the English words of its own page,
   /who-sees-what. Every sentence states what the Space API contract (0.2.7) and the Connect lane's docs provide today,
   and each has a row in docs/truth-check.md. The stages themselves are src/front/c-stages.ts; the rules and the
   deletion paragraph are the catalogue's own strings (src/i18n/en.ts). The English source of src/front/copy.ts; no
   forbidden word (tests/front.test.mjs). */
export const C = {
  meta: {
    title: 'Linkbot: who sees what, and when',
    description: 'A matching layer any platform can embed, built around one question: who sees what, and when. One synthetic offer, stage by stage, and the receipt.',
  },
  hero: {
    eyebrow: 'A matching layer any platform can embed',
    h1: ['Who sees what,', 'and when.'],
    lede: 'A pack gives every criterion a stage, and a stage is the furthest a value travels: the board, a possible fit, the introduction, or the platform’s team alone. Below: one synthetic offer, stage by stage, and the receipt that bounds every read.',
    primary: 'What a platform gets',
    secondary: 'Who sees what, in full',
  },
  stages: {
    label: 'Synthetic · one offer, written for this page · nobody is matched or introduced here',
    sees: 'Who sees it',
    shows: 'What it shows',
    not: 'Not at this stage',
    receipt: {
      h3: 'The receipt',
      lines: [
        'Who may see which fields, and from when.',
        'Every read of an introduction, with its time.',
        'Field keys and times, never values.',
        'What is not in the receipt is never revealed later.',
      ],
    },
  },
  why: {
    h2: 'Why a platform can let Linkbot near its users',
    items: [
      { h3: 'One space per market, on its own instance', p: 'A space is one market on one platform, with its own application, database, keys and deletion log. Matching runs inside it; no need, no offer and no fit is shared with another space.' },
      { h3: 'Your pages, your keys, your team', p: 'The widget runs in your pages under your own data notice. Your page holds a publishable key that works only on your origins; the secret key stays on your server; your team approves cases in a console behind your own login, and there is no Linkbot login for operators.' },
      { h3: 'A named person, never the system', p: 'Gates are recorded by a named operator, with a reference and without personal data, and a named operator approves. An approval alone discloses nothing; every write names who did it and appears in the audit log.' },
      { h3: 'People decide, each for themselves', p: 'Each side answers a possible fit for its own side. Before both have said yes the other side learns nothing, and a later no revokes a yes. The server creates the introduction when the last condition is met, and refuses every other way.' },
    ],
  },
  deletion: { h2: 'Deletion: what goes, and what stays' },
  platforms: { h2: 'For platforms', p: 'One script and one element put a space on your page; the console for your team runs on your machine or behind your own login; your server hears about events through signed webhooks, which are in the contract and not sent by the staging space yet.', link: 'What a platform gets' },
  verticals: { h2: 'For verticals', p: 'A pack describes a market: its criteria, options and units, its labels and questions in the space’s languages, what each criterion discloses at each stage, and the gates the market needs. The first is industrial minerals.', link: 'What a pack holds' },
  state: {
    h2: 'Where it stands',
    p: 'The offer above is fixed text, written for this page in the vocabulary of a synthetic pack; the product did not run here. The demo page walks through the whole path, step by step.',
  },
} as const;
