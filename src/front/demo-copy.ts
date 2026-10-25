/* The demo page, /demo: a buyer's whole path in six steps, from the request to the introduction, and beside it the
   widget of a test space when the build has one (src/demo/space.ts). Every step restates what the Space API contract
   provides today, and each sentence has a row in docs/truth-check.md. The English source of src/front/copy.ts; no
   forbidden word (tests/front.test.mjs). */
export const DEMO = {
  meta: {
    title: 'Linkbot: the whole path, from a request to an introduction',
    description: 'A buyer’s path through Linkbot in six steps: the request, the confirmed criteria, the possible fits, both sides’ yes, the operator’s approval and the introduction. On a test space with fictional data.',
  },
  hero: {
    eyebrow: 'Demo · a test space with fictional data',
    h1: ['From a request to an introduction,', 'in six steps.'],
    lede: 'What happens between a buyer’s first line and the moment two companies are introduced, one step at a time, and who acts at each step.',
  },
  test: 'This is a test space with fictional data. Every request, offer, company and value here is invented for testing. Please enter nothing real: no company, no person, no address of your own. Its emails go to a test mailbox and reach no one.',
  steps: {
    h2: 'The path, step by step',
    who: 'Who acts',
    items: [
      { name: 'The request', who: 'The buyer', text: 'The buyer describes the need on a platform’s page, in the form the market’s pack generates, or in one line of text that fixed rules read and turn into proposed values. Nothing is pre-selected, and what the buyer did not state stays unknown.' },
      { name: 'The criteria, confirmed', who: 'The buyer', text: 'The buyer checks every value and confirms. Only now is anything stored: the server checks every value against the pack and names each field that fails. The email address is confirmed through a link.' },
      { name: 'The possible fits', who: 'The space', text: 'Matching compares the stored criteria with the other side’s, one by one: a verdict per criterion, meets, partly, conflicts or unknown, never a score. A possible fit shows each side only the verdicts and a notice that people decide.' },
      { name: 'Both say yes', who: 'The buyer and the supplier', text: 'Each side answers the possible fit for its own side. Before both have said yes the other side learns nothing, and a later no revokes a yes.' },
      { name: 'The operator approves', who: 'The platform’s team', text: 'A named operator records the checks the space requires and approves the pair. An approval alone discloses nothing, and every write names who made it.' },
      { name: 'The introduction', who: 'The server', text: 'When the last of the three conditions is met, in any order, the server creates the introduction, and refuses every other way. Each side receives a receipt of who may see which fields. In operator mode the platform’s team then contacts both sides.' },
    ],
  },
  space: {
    h2: 'The test space’s board',
    on: 'Below is the widget itself, served by the test space, in board mode: the open requests and offers whose owners chose to show them, coarsened as the pack declares. Answering one starts at step 1, on the other side.',
    off: 'This build shows no widget: the test space does not allow this site’s address. The path above is in words only.',
    notice: 'A test space with fictional data: enter nothing real. Its emails reach no one.',
  },
} as const;
