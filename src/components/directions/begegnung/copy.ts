/* Begegnung (encounter): the words of the five stations (Concept A9, W4).

   Every line is a "Page may say" line of fundament-v0/claims.md (or says less), cited by row.
   A part that is TESTED, IN DEVELOPMENT or NOT BUILT carries its label next to it, in the scene's
   own text (claims.md rule 2), and again inside the picture where the picture shows it.
   Never here: "match" for S2 (rule 3), "anonymous", "nobody/no one", "secure", "encrypted",
   "on your device", "delete" as a fact, a fit as permission or contact, "Handshake" as a word (S3.7). */

export type Status = 'live' | 'tested' | 'dev' | 'open';
/** The site's existing status words (claims.md, the status table). */
export const STATUS: Record<Exclude<Status, 'live'>, string> = {
  tested: 'Built, tested in staging; not yet live with employers',
  dev: 'In development, not live',
  open: 'Open question',
};
export interface Plate { status: Exclude<Status, 'live'>; text: string; sub?: string; claim: string }
export interface Station {
  n: 1 | 2 | 3 | 4 | 5;
  /** a status line set above the title, when the title itself speaks of something not live */
  over?: Exclude<Status, 'live'>;
  title: string; claimTitle: string;
  body?: string; claimBody?: string;
  /** S2: the lanterns' meaning in words (marks are the app's squares; never colour alone) */
  legend?: { mark: 'solid' | 'dashed'; text: string }[];
  plates: Plate[];
  /** the picture's text alternative; it always says it is an illustration (review change 4) */
  alt: string;
}

export const STATIONS: Station[] = [
  {
    n: 1,
    title: 'Private by default. Shared only when you decide.', claimTitle: 'S1 station line (privacy.astro:18)',
    body: 'Search without an account. Nothing is stored. Employers aren’t told you’re looking.', claimBody: 'S1.1, S1.4',
    plates: [{ status: 'open', text: 'Could your data stay only on your side?', sub: 'Not yet: what you keep lives in your Linkbot account.', claim: 'S1.7 (NOT BUILT, only as an open question)' }],
    alt: 'Illustration: a person stands inside a veil of white paint, in their own place. The veil stands for this: employers aren’t told you’re looking. Their folded things rest on a stool beside them, and three paper lanterns with their words stand unlit at their feet. The other side of the picture is empty.',
  },
  {
    n: 2,
    title: 'Compared with your words, not with you.', claimTitle: 'S2.1',
    body: 'Employers aren’t told you’re looking. A fit is not a disclosure, and not a sign of anyone’s interest.', claimBody: 'S1.4, S2.2 (LIVE for fits in a search; no watched-search arrival and no standing rule drawn here)',
    legend: [
      { mark: 'solid', text: 'Remote: stated, fits' },
      { mark: 'solid', text: 'Research: stated, fits' },
      { mark: 'dashed', text: 'No on-call: not stated, stays open' },
    ],
    plates: [],
    alt: 'Illustration: an empty chair appears on the other side, for a role, with no face and no name. Two lanterns light up, Remote and Research: the listing states them, and they fit. The third, No on-call, stays unlit and dashed, with a question mark: the listing does not say. The person stays inside the veil.',
  },
  {
    n: 3,
    title: 'A fit is not permission to contact you.', claimTitle: 'S3.1',
    body: 'Linkbot never applies for you, and sends no messages on your behalf.', claimBody: 'S3.2',
    plates: [
      // Review change 1: nowhere imply that every share needs a fresh yes. Today's sharing (TESTED)
      // is said as it is: once, or by a standing rule you set (the S3 station line's TESTED half).
      { status: 'tested', text: 'Sharing is a separate decision you confirm: once, or by a standing rule you set.', claim: 'S3 station line, its TESTED half (S3.3, S3.4)' },
      { status: 'dev', text: 'If a company’s role fits you, only you are asked. Nothing reaches the company until you say yes. Then it answers.', claim: 'S3.5 (IN DEVELOPMENT), the row’s page line verbatim' },
    ],
    alt: 'Illustration: an open hand in a green sleeve, with its cuff, waits at the chair on the other side; it does not reach out. The person’s own hand comes out of the veil and takes it. Only then does the other hand move, a little. Where the hands meet, pink paint blooms. Labelled: in development, not live.',
  },
  {
    n: 4,
    over: 'dev',
    title: 'Then it gets personal, if you want it to.', claimTitle: 'S4.2, set under its label (a paraphrase bounded by the row)',
    body: 'You decide whether to add your name, and how the company can reach you.', claimBody: 'S4.2 (IN DEVELOPMENT), verbatim after its label',
    plates: [{ status: 'open', text: 'Where does the conversation continue after both sides say yes?', claim: 'S4.3 (NOT BUILT inside Linkbot, only as an open question)' }],
    alt: 'Illustration: the person lifts the veil with their own hand and holds it like a cloth. Only then does their face appear, painted, not a photo, and colour blooms on what they chose to wear: a green coat and a pink scarf. A sweater stays folded on the stool, labelled not shared. On the other side, the hand turns palm up and holds only a small pink bloom: what the person handed over. A second chair, a dashed outline with a question mark, stands open. Labelled: in development, not live.',
  },
  {
    n: 5,
    title: 'Change your mind: pause, remove or revoke.', claimTitle: 'S5 station line (revoke carries its label right below)',
    body: 'Pause, edit or close a watched search any time. Remove a saved job.', claimBody: 'S5.1, S5.2 ("any time" only here, S5.7)',
    plates: [
      { status: 'tested', text: 'Revoke a rule or access you gave. It stops access from that moment on. Copies already received aren’t recalled.', claim: 'S5.3 (TESTED), verbatim' },
      { status: 'open', text: 'When can I delete everything Linkbot holds about me?', sub: 'Not built yet.', claim: 'S5.6 (NOT BUILT, as an open question)' },
    ],
    alt: 'Illustration: the person draws the veil back over themselves with their own hand. The other hand has gone. The small pink bloom it was given stays on the chair and does not come back, labelled: copies already received aren’t recalled. The lanterns stand unlit again.',
  },
];
