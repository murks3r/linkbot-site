/* The demo page, /demo: a buyer's whole path in six steps, from the request to the introduction, and beside it the
   widget of a test space when the build has one (src/demo/space.ts). Every step restates what the Space API contract
   provides today, and each sentence has a row in docs/truth-check.md. The English source of src/front/copy.ts; no
   forbidden word (tests/front.test.mjs). */
export const DEMO = {
  meta: {
    title: 'Linkbot: the whole path, from a request to an introduction',
    description: 'A buyer’s path through Linkbot in six steps, from the request to both sides’ yes and the introduction. On a test space with fictional data.',
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
      { name: 'The introduction', who: 'The server', text: 'When the last of the three conditions is met, in any order, the server creates the introduction, and refuses every other way. Each side receives a receipt of who may see which fields. In direct mode, the one recorded here, each side can then open the fields the other shares at this stage. A platform can choose operator mode instead: then only its team sees both sides, and it contacts them.' },
    ],
  },
  replay: {
    label: 'Recorded walkthrough · fictional data',
    lede: 'Pictures of the widget and the operator console at each step, recorded on one computer. Every party, company and value in them is fictional.',
    note: 'Recorded on 25 October 2026 on Linkbot Connect’s demo stage, which runs the widget and the operator console against a sample Space API on one computer. Nothing in these pictures reached a space or a person. The recording introduces in mode direct: after the operator’s approval each side can open what the other shares.',
    steps: 'The six steps',
    position: 'Step {n} of {total}',
    previous: 'Previous step',
    next: 'Next step',
    screens: [
      ['The buyer’s widget: the form the sample pack generates, with rock phosphate chosen and a P₂O₅ minimum of 30 %. The importance “Must” is marked as suggested, and nothing else is chosen.'],
      ['The buyer’s widget after confirming: the request is active, with each criterion and its importance. No offers to show yet.'],
      ['The buyer’s widget: an offer that may fit, with a tick per criterion, the question “Do you want an introduction?” and the notice that people decide.'],
      ['The buyer’s widget after the yes: “Your yes is recorded. Sample space reviews it first.”', 'The supplier’s widget: the same possible fit, seen from the offer’s side as a request with a tick per criterion, after the supplier’s own yes, with the same words.'],
      ['The operator console’s case: each side’s check and the case’s KYC and sanctions check recorded as passed by the sample operator, then “Approved by your team.”'],
      ['The buyer’s widget under “My requests and offers”: both sides said yes, the request is introduced, and a button shows what the other side shares.', 'The operator console’s introductions: one introduction, in mode direct, listed without contact details.'],
    ],
  },
  watch: {
    name: 'If nothing fits yet: a watch',
    who: 'The buyer',
    text: 'After confirming, the buyer can keep the request open and watch it: how often, weekly or daily; what to hear about; and, in the email options, at most how many per email and no email before a chosen day. A watch tells only its owner when something new fits, and starts once the email address is confirmed. It runs for 90 days and can be paused, resumed or ended at any time, also from a link in its emails.',
    screens: ['The buyer’s widget after confirming, with no offers to show yet: a watch set to weekly, on everything that meets the musts, at most 5 per email.', 'The same widget after “Start watching”: the watch waits for the email address to be confirmed, at most 5 per email, until 23 January 2027. The recording sent no email, and the fictional address never resolves.'],
  },
  space: {
    h2: 'The test space’s board',
    on: 'Below is the widget itself, served by the test space, in board mode: the open requests and offers whose owners chose to show them, coarsened as the pack declares. Answering one starts at step 1, on the other side.',
    off: 'This build shows no widget: the test space does not allow this site’s address. The path above is in words only.',
    notice: 'A test space with fictional data: enter nothing real. Its emails reach no one.',
  },
} as const;
