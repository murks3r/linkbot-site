/* The landing page (/), built from the page plan docs/front/landing-plan.md (ST-D1 to ST-D3): six sections in plain
   visitor language, no internal term on the page. The English source of src/front/copy.ts; each sentence has its rows in
   docs/truth-check.md (named per section below). The demo stage's step names and picture descriptions are /demo's own
   (demo-copy.ts), so the two pages cannot tell the path differently. */
export const LANDING = {
  meta: {
    title: 'Linkbot: your platform connects buyers and sellers, Linkbot finds who fits',
    description: 'A widget for platforms that connect buyers and sellers: it asks each side what it needs, shows a verdict per criterion and introduces only after both say yes.',
  },
  /* 1.1 · rows home.lede, home.flow, platforms.embed */
  opening: {
    h1: 'Your platform connects buyers and sellers. Linkbot finds who fits.',
    sub: 'Its widget asks each side what it needs; Linkbot shows a verdict for each criterion and introduces the two sides only after both say yes.',
    /* "Try it" only once /demo holds a widget on a demo space (plan, decision 5). */
    button: 'See it step by step',
  },
  /* 1.2 · rows how.describe (form), how.describe (text), how.confirm, home.rules; how.describe (watch);
     how.approval, how.yes, how.introduction */
  cards: {
    h2: 'What it does for you',
    items: [
      { name: 'Ask in your market’s words', text: 'Each side says what it needs or offers, in one line or in questions that fit its market; nothing is stored until it confirms.', button: 'See the request' },
      { name: 'We keep looking', text: 'If nothing fits yet, Linkbot keeps looking and tells only you when something new fits.', small: 'In the demo its emails go to a test mailbox and reach no one.', button: 'See how it keeps looking' },
      { name: 'Introduced only after two yeses', text: 'Two sides are introduced only after a named person approves and both say yes.', button: 'See the introduction' },
    ],
  },
  /* 1.3 · rows home.flow, how.approval, how.yes, site.synthetic */
  stage: {
    h2: 'One introduction, from both sides',
    p: 'A request and an offer are introduced only after a named person approves and both sides say yes.',
    roles: 'Whose side to show',
    buyer: 'As a buyer',
    supplier: 'As a supplier',
    label: 'Recorded walkthrough · fictional data',
    supplierNote: 'Of the supplier’s side, only its yes is recorded so far; the supplier describes its offer in the same widget.',
    link: 'Walk through all six steps',
  },
  /* 1.4 · rows how.introduction, how.sees, the /who-sees-what rows */
  sees: {
    h2: 'Who sees what, and when',
    p: 'Each step shows only what that step allows; the details for an introduction go out only after both say yes.',
    link: 'Who sees what, step by step',
  },
  /* 1.5 · rows platforms.embed, platforms.keys, how.pack; how.today (now), how.today (later) */
  platforms: {
    h2: 'For platforms',
    p: 'One script and one element on your page; the questions fit your market.',
    snippet: 'The shortest embed',
    later: 'Add it with your own build tools',
    button: 'For platforms',
    developers: 'For developers',
  },
  /* 1.6 · rows verticals.first, verticals.next, site.synthetic, how.today (now); the address: src/lib/contact.ts */
  bottom: {
    h2: 'Not your market yet? Tell us what you connect.',
    button: 'Tell us what you connect',
    prepared: 'The address to write to is being prepared; the page behind the button says how you will reach us.',
    line: 'Everything shown here runs with fictional data; checked on {date}.',
    status: 'The full status',
  },
  /* The two status labels (plan, decision 8): "Live" = runs today on the instance the demo is recorded from, with
     fictional data, and always on a page that says so (bottom.line); "Coming soon" = everything else. The only place the
     word may stand (tests/front.test.mjs exempts this key and no other). */
  labels: { live: 'Live', soon: 'Coming soon' },
} as const;
