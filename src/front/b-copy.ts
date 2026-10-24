/* Direction B, "Say what you need. See what Linkbot asks back." (front-page preview, GEO-188, 2026-10-24): the English
   words of the home, whose hero it is. Every sentence states what the Space API contract (0.2.7), Connect ADR 0004 and
   the Connect lane's docs provide today, and each has a row in docs/truth-check.md. The questions themselves come from
   src/front/b-pack.ts (the synthetic sample pack); the widget's own lines are quoted as they stand in Connect. English
   only until the home is translated; no forbidden word (tests/front.test.mjs). */
export const B = {
  hero: {
    eyebrow: 'A matching layer any platform can embed',
    h1: ['Say what you need.', 'See what Linkbot asks back.'],
    lede: 'Linkbot never guesses. On a platform’s page it asks the questions of that market’s pack, keeps your words as you wrote them, and stores nothing until you confirm. Try the first part here: one line is enough.',
  },
  ask: {
    label: 'What do you need? One line is enough.',
    placeholder: '25,000 t rock phosphate, CFR Augusta, Q1 2027',
    button: 'Ask me',
    privacy: 'Nothing you type here leaves this page, and nothing is stored: the site has no account and sends nothing anywhere.',
    empty: 'Write one line first.',
    yoursLabel: 'Your line, kept as written',
    yoursNote: 'Nobody and nothing reads it on this page. Here you answer the pack’s questions yourself, in a form drawn from the synthetic sample pack.',
    asksTitle: 'What the pack asks back',
    packNote: 'The questions of the Connect lane’s sample pack for industrial minerals, version 0.2.0: synthetic, written to exercise every control, not a real market’s pack.',
    storedTitle: 'What would be stored, if you confirmed',
    storedEmpty: 'Nothing yet. Each answer appears here with its source and its importance; a question you skip stays unknown.',
    storedSource: 'picked by you',
    storedUnknown: 'unknown',
    storedOther: 'your words',
    storedMin: 'at least',
    storedMax: 'at most',
    end: 'Here it would end with the confirm step and the widget’s line “Nothing is used until you confirm.” Confirming happens on a platform’s page, not here: nothing you entered was stored.',
    reset: 'Clear everything',
  },
  why: {
    h2: 'Why it asks instead of guessing',
    items: [
      { h3: 'Nothing is pre-selected', p: 'The form has no default values: no option, no unit, no basis, no party type. An importance is suggested, marked as such, and the person can change it unless the pack locks it.' },
      { h3: 'Your words are never mapped to the nearest option', p: '“Other / not listed” keeps the words as written. “Don’t know” and “any” are real answers, distinct from skipping; what one side did not state stays unknown, and unknown is never a fit.' },
      { h3: 'A number that two conventions read differently is refused, not guessed', p: 'Numbers are read in the form’s language. “25.000” in an English form could be 25 or 25,000, so the form asks instead of deciding.' },
      { h3: 'Nothing is stored before you confirm', p: 'Describing, answering and validating leave nothing behind. The confirm step is the form itself; the server validates every value against the pack and names each field that fails.' },
    ],
    link: 'How matching works, step by step',
  },
  platforms: {
    h2: 'For platforms: the same questions, on your pages',
    p: 'One script and one element show the form in your page, in your font and colours, with your own data notice above the confirm button. Your page holds a publishable key that works only on your origins; the secret key stays on your server. Your team approves cases in a console that runs on your machine or behind your own login.',
    link: 'What a platform gets',
  },
  verticals: {
    h2: 'For verticals: the questions come from the pack',
    p: 'A pack holds a market’s criteria, options and units, the special answers each allows, the suggested importances, what each criterion discloses at each stage, and the gates the market needs, with labels and questions in the space’s languages. The first is industrial minerals.',
    link: 'What a pack holds',
  },
  state: {
    h2: 'Where it stands',
    p: 'The questions above are drawn from the synthetic sample pack and answered in your browser only; the widget itself runs on a platform’s pages, and this site shows no demo of it until a demo space with synthetic data exists.',
  },
} as const;
