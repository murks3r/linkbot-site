/* The home after the redesign pass (GEO-188, 2026-10-24): B as the hero, A's verdict sequence as the second section,
   C as its own page. Most words come from the three directions' modules unchanged (b-copy.ts, a-copy.ts, c-copy.ts);
   this module holds only what the composition adds. Every sentence has a row in docs/truth-check.md. */
export const HOME = {
  meta: {
    title: 'Linkbot: say what you need, see what it asks back',
    description: 'A matching layer any platform can embed. Write a need in one line and see the questions a pack asks back; then watch a synthetic pair meet, verdict by verdict.',
  },
  venn: {
    label: 'Two intents, one lens: a verdict per criterion',
    need: 'The need',
    offer: 'The offer',
    caption: 'Synthetic · nine criteria of one fixed pair · nothing is matched on this page',
    replay: 'Play again',
  },
  ledger: {
    eyebrow: 'What happens after confirm',
    h2: 'Watch a need meet an offer',
    lede: 'Matching compares the stored criteria one by one and shows a verdict per criterion, never a score. Nobody is introduced until a named operator has approved and both sides have said yes. Below: the same synthetic pair, played in full.',
  },
  sees: {
    eyebrow: 'Who sees what',
    h2: 'Who sees what, and when.',
    p: 'A pack gives every criterion a stage, and a stage is the furthest a value travels: the board, a possible fit, the introduction, or the platform’s team alone. One synthetic offer, stage by stage, and the receipt that bounds every read.',
    link: 'Stage by stage',
  },
} as const;
