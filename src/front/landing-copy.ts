/* The home (/), version 3 (owner's plan of 2026-11-02): one headline with the problem and the promise, directly under it
   the "both say yes" demo (src/components/front/Trial.astro), then for platforms and the bottom. Plain visitor language,
   no internal term on the page. The English source of src/front/copy.ts; each sentence has its rows in
   docs/truth-check.md (named per section below) and its line in the claim table of docs/front/home-v3.md. */
export const LANDING = {
  meta: {
    title: 'Linkbot: trust before you meet',
    description: 'Linkbot confirms each side, matches in private and introduces two businesses only when both say yes. Try it with two fictional businesses.',
  },
  /* 1 · rows how.confirm, home.rules, how.yes. sub.today is true now; sub.full only once company checks run on the space
     (src/front/hero.ts picks one; tests/home.test.mjs keeps full off the built page). */
  opening: {
    h1: 'Trust before you meet.',
    sub: {
      today: 'Linkbot confirms each side, matches in private and introduces two businesses only when both say yes.',
      full: 'Linkbot checks who is real, matches in private and introduces two businesses only when both say yes.',
    },
    /* The link to /demo under the demo: "Try it" only once /demo holds a widget on a demo space (plan, decision 5;
       src/demo/space.ts); /demo's own section for the widget takes it as its heading. */
    button: 'See it step by step',
    try: 'Try it',
  },
  /* 2 · The demo. rows how.confirm (the email address confirmed through a link; nothing stored before confirm),
     home.lede (a verdict per criterion), how.sees and the /who-sees-what match stage (no name, no contact), how.approval
     (a named person approves; approval discloses nothing), how.yes (each side answers alone; nothing before both yes),
     how.introduction (direct or through the platform's team), site.synthetic (fictional data). */
  trial: {
    h2: 'Try it: one buyer, one supplier',
    label: 'Fictional businesses · runs in your browser, nothing is sent',
    steps: ['Check', 'Private match', 'Both say yes'],
    progress: 'Steps',
    buyer: { role: 'Buyer', name: 'Northfield Fittings', wants: 'Needs', text: 'Aluminium housings, 5,000 a year, ISO 9001, delivered within the EU' },
    supplier: { role: 'Supplier', name: 'Lakeside Castings', wants: 'Offers', text: 'Die-cast aluminium parts from 1,000 pieces, ISO 9001, shipped across the EU' },
    hidden: 'Name hidden',
    email: 'Email address',
    check: {
      title: 'Each side confirms its contact',
      p: 'Each side confirms what it asked for and opens a link sent to its email address. Nothing is stored before it confirms.',
      pending: 'Not confirmed yet',
      done: 'Confirmed through a link',
      button: 'Confirm',
      next: 'Look for a fit',
    },
    match: {
      title: 'A possible fit, without names',
      p: 'Linkbot compares the two on each criterion. Each side sees the verdicts, never the other’s name or contact.',
      card: 'Possible fit',
      criteria: [
        { label: 'Material', value: 'Aluminium', verdict: 'meets' },
        { label: 'Quantity', value: '5,000 a year; from 1,000 pieces', verdict: 'meets' },
        { label: 'Certificate', value: 'ISO 9001', verdict: 'meets' },
        { label: 'Delivery', value: 'Within the EU', verdict: 'meets' },
        { label: 'Process', value: 'Die-cast; the request does not say', verdict: 'unknown' },
      ],
      verdicts: { meets: 'Fits', partly: 'Partly fits', conflicts: 'Conflicts', unknown: 'Unknown' },
      approved: 'A named person at the platform approved this possible fit. The approval reveals nothing.',
      next: 'Ask both sides',
    },
    yes: {
      title: 'Both say yes, or nobody learns anything',
      p: 'Each side answers on its own. Until both say yes, neither learns who the other is.',
      ask: { buyer: 'Be introduced to this supplier?', supplier: 'Be introduced to this buyer?' },
      yes: 'Yes',
      no: 'No',
      waiting: 'Yes. Waiting for the other side, which does not see this answer.',
      said: 'No.',
      introduced: 'Introduced. Both said yes, so only now do the names and email addresses go out.',
      mode: 'Shown here as a direct introduction; a platform can also make the introduction through its own team.',
      declined: 'No introduction. One side said no, so neither learns who the other is.',
      reset: 'Start again',
    },
    more: 'Who sees what, step by step',
  },
  /* /demo's role switch and its note on the supplier's side (src/components/front/Demo.astro). */
  stage: {
    roles: 'Whose side to show',
    buyer: 'As a buyer',
    supplier: 'As a supplier',
    supplierNote: 'Of the supplier’s side, only its yes is recorded so far; the supplier describes its offer in the same widget.',
  },
  /* 3 · rows platforms.embed, platforms.keys, how.pack; how.today (now), how.today (later) */
  platforms: {
    h2: 'For platforms',
    p: 'One script and one element on your page; the questions fit your market.',
    snippet: 'The shortest embed',
    later: 'Add it with your own build tools',
    button: 'For platforms',
    developers: 'For developers',
  },
  /* 4 · rows verticals.first, verticals.next, site.synthetic, how.today (now); the address: src/lib/contact.ts */
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
