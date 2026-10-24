/* Direction A, "Watch a need meet an offer" (front-page preview, GEO-188, 2026-10-24): the English words of the front.
   Every sentence states what the Space API contract (0.2.7) and the Connect lane's docs provide today, and each has a
   row in docs/truth-check.md ("front A"). The four ways, the status labels and the synthetic-state sentence come from
   the catalogue (src/i18n/en.ts) unchanged. English only until the founder picks a direction; no forbidden word
   (tests/front.test.mjs). */
export const A = {
  meta: {
    title: 'Linkbot: watch a need meet an offer',
    description: 'A matching layer any platform can embed: a verdict per criterion, never a score, and an introduction only after an operator approved and both sides said yes.',
  },
  hero: {
    eyebrow: 'A matching layer any platform can embed',
    h1: ['Watch a need', 'meet an offer.'],
    lede: 'Linkbot compares confirmed criteria one by one and shows a verdict per criterion, never a score. Nobody is introduced until a named operator has approved and both sides have said yes. Below: one synthetic pair, played on this page.',
    primary: 'Put a space on your pages',
    secondary: 'How matching works',
  },
  ledger: {
    label: 'Synthetic · fixed values, written for this page · nothing is matched here',
    space: 'A space for industrial minerals',
    need: 'The need',
    offer: 'The offer',
    columns: { criterion: 'Criterion', need: 'The need states', offer: 'The offer states', verdict: 'Verdict' },
    importance: { must: 'Must', nice_to_have: 'Nice to have' },
    verdicts: { meets: 'Meets', partly: 'Partly', conflicts: 'Conflicts', unknown: 'Unknown' },
    state: 'Every must meets, so this pair can be a fit. The soft criteria only show; they do not decide.',
    stages: [
      { name: 'Gate', text: 'A named operator records the space’s required check as passed. The system never decides a gate.' },
      { name: 'Approval', text: 'A named, active operator approves the case. An approval alone discloses nothing.' },
      { name: 'Both yes', text: 'Each side answers for itself. Before both have said yes, the other side learns nothing.' },
      { name: 'Introduction', text: 'The server creates it when the last of the three conditions is met, in any order, and refuses every other way. Each side receives a receipt.' },
    ],
    notice: 'A possible fit discloses only the verdicts, and a fixed notice that people decide.',
    legend: 'Solid: meets. Split: partly. Crossed: conflicts. Dashed: unknown, which is never a fit.',
  },
  saw: {
    h2: 'What you saw, and why it is built that way',
    items: [
      { h3: 'A verdict per criterion, never a score', p: 'For every criterion the pack lets it compare, matching shows one of four words, meets, partly, conflicts or unknown, with the rule that decided it. Whether a pair can be a fit at all follows from the hard conditions alone, must and never.' },
      { h3: 'Unknown is never a fit', p: '“Don’t know” or “other” on either side is unknown. Nothing is pre-selected, nothing is guessed, and a criterion one side did not state is never counted in its favour.' },
      { h3: 'Nothing is stored before a person confirms', p: 'Describing, answering and validating leave nothing behind. The widget says so above its confirm button: “Nothing is used until you confirm.”' },
      { h3: 'People decide, and the server holds the line', p: 'No introduction without the gates, a named operator’s approval and a yes from both sides. The server creates it then and refuses every other way, and every write names who did it.' },
    ],
    link: 'How matching works, step by step',
  },
  platforms: {
    h2: 'For platforms: one script, one element',
    p: 'The widget shows the form in your page, in your font and colours. Your page holds a publishable key that works only on your origins; the secret key stays on your server. Your team approves cases in a console that runs on your machine or behind your own login, and your server hears about events through signed webhooks, which are in the contract and not sent by the staging space yet.',
    snippet: 'The whole integration',
    link: 'What a platform gets',
  },
  verticals: {
    h2: 'For verticals: a pack per market',
    p: 'A pack describes a market: its criteria, options and units, its labels and questions in the space’s languages, what each criterion discloses at each stage, and the gates the market needs. The first is industrial minerals.',
    link: 'What a pack holds',
  },
  state: {
    h2: 'Where it stands',
    p: 'This site shows no demo of the widget until a demo space with synthetic data exists. The pair above is fixed text, written for this page: the product did not run here.',
  },
} as const;
