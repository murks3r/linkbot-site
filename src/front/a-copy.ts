/* Direction A, "Watch a need meet an offer" (front-page preview, GEO-188, 2026-10-24): the English words of its ledger,
   which the home shows as its second section (src/components/front/Ledger.astro). Every sentence states what the Space
   API contract (0.2.7) provides today, and each has a row in docs/truth-check.md. English only until the home is
   translated; no forbidden word (tests/front.test.mjs). */
export const A = {
  ledger: {
    label: 'Synthetic · fixed values, written for this page · nothing is matched here',
    space: 'A space for industrial minerals',
    need: 'The need',
    offer: 'The offer',
    table: 'The pair, criterion by criterion',
    columns: { criterion: 'Criterion', need: 'The need states', offer: 'The offer states', verdict: 'Verdict' },
    importance: { must: 'Must', nice_to_have: 'Nice to have' },
    verdicts: { meets: 'Meets', partly: 'Partly', conflicts: 'Conflicts', unknown: 'Unknown' },
    state: 'Every must meets, so this pair can be a fit. The soft criteria only show; they do not decide.',
    before: 'Before anyone is introduced',
    stages: [
      { name: 'Gate', text: 'A named operator records the space’s required check as passed. The system never decides a gate.' },
      { name: 'Approval', text: 'A named, active operator approves the case. An approval alone discloses nothing.' },
      { name: 'Both yes', text: 'Each side answers for itself. Before both have said yes, the other side learns nothing.' },
      { name: 'Introduction', text: 'The server creates it when the last of the three conditions is met, in any order, and refuses every other way. Each side receives a receipt.' },
    ],
    notice: 'A possible fit discloses only the verdicts, and a fixed notice that people decide.',
    legend: 'Solid: meets. Split: partly. Crossed: conflicts. Dashed: unknown, which is never a fit.',
  },
} as const;
