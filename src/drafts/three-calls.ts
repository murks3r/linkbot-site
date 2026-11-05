/* The draft page /developers/three-calls, in English only: the three calls a vertical is to use (create_profile,
   find_matches, confirm_interest), what each does, that who someone is comes only after both say yes, and a request and
   a response for each, from the draft contract 0.1.0-draft with made-up data. No instance serves the calls, so the page
   is a draft for the owner's review: linked from nowhere, never indexed, out of the sitemap, and left out of production
   builds. Every sentence has its row in docs/truth-check.md (section "/developers/three-calls"). */
import { buildsDraft, type Draft } from './draft.ts';

/** Whether a production build carries the draft. Set it to true once the calls are served and the owner approves the page. */
export const THREE_CALLS_IN_PRODUCTION = false;

/** Whether a build carries the draft (src/drafts/draft.ts). */
export const buildsThreeCalls = (env: { VERCEL_ENV?: string }, inProduction = THREE_CALLS_IN_PRODUCTION): boolean =>
  buildsDraft(env, inProduction);

const createRequest = `POST /api/kern/v0/profiles
Authorization: Bearer <guest session>
Idempotency-Key: example-create-profile-0001
Content-Type: application/json

{
  "pack": { "id": "example-company-sale", "version": "0.1.0" },
  "side": "seeking",
  "language": "en",
  "party": { "type": "person", "display_name": "Buyer A (made-up)" },
  "contact": { "email": "<the person's email address>" },
  "criteria": [
    {
      "key": "sector",
      "value": { "type": "single_choice", "code": "printing" },
      "importance": "must",
      "importance_source": "suggested",
      "source": { "kind": "person_picked" }
    },
    {
      "key": "price_band",
      "value": { "type": "range", "min": 200000, "max": 400000, "unit": { "code": "EUR" } },
      "importance": "nice_to_have",
      "importance_source": "person",
      "source": { "kind": "person_picked" }
    }
  ],
  "consents": { "terms_version": "terms-1", "board_listing": false }
}`;

const createResponse = `201 Created

{
  "profile_id": "1042",
  "intent_id": "2087",
  "owner_token": "<shown once>",
  "owner_token_expires_at": "2027-02-05T10:00:00Z",
  "channel_status": "unverified",
  "checks_requested": ["sanctions"]
}`;

const findRequest = `GET /api/kern/v0/profiles/me/matches
Authorization: Bearer <owner token>`;

const findResponse = `200 OK

{
  "items": [
    {
      "match_id": "3311",
      "intent_id": "2087",
      "state": "suggested",
      "fits": [
        {
          "criterion_key": "sector",
          "importance": "must",
          "verdict": "meets",
          "other_side_value": { "type": "single_choice", "code": "printing" }
        },
        {
          "criterion_key": "price_band",
          "importance": "nice_to_have",
          "verdict": "partly",
          "other_side_value": { "type": "range", "min": 350000, "max": 500000, "unit": { "code": "EUR" } }
        }
      ],
      "checks_passed": ["contact_channel", "eu_vat_vies"],
      "my_answer": "pending",
      "fixed_notice": "<the space's fixed notice>",
      "proposed_at": "2026-11-05T10:05:00Z"
    }
  ]
}`;

const answerRequest = `POST /api/kern/v0/matches/3311/interest
Authorization: Bearer <owner token>
Idempotency-Key: example-confirm-interest-0001
Content-Type: application/json

{ "answer": "yes" }`;

const answerWaiting = `200 OK

{ "match_id": "3311", "my_answer": "yes", "status": "waiting" }`;

const answerIntroduced = `200 OK

{ "match_id": "3311", "my_answer": "yes", "status": "introduced", "introduction_id": "5120" }`;

export const threeCalls: Draft = {
  banner: 'Draft, not published: planned, not served anywhere.',
  bannerNote: 'This page is linked from nowhere on the site, is never indexed and exists in English only. The three calls are a draft contract (version 0.1.0-draft) for after the first release; no instance serves them, and every example below holds made-up data.',
  title: 'Three calls for a vertical (planned, draft)',
  description: 'Draft: create_profile, find_matches and confirm_interest, three calls for a vertical; who someone is only after both say yes. Planned, not served.',
  eyebrow: 'Developers · planned · draft',
  h1: ['Three calls for a vertical:', 'profile, matches, yes.'],
  lede: 'A vertical, a product for one kind of deal, keeps its own pages, words, fields and rules. Who a party is, what it consented to, the private match, what is disclosed and when, and the record of each step are to come from Linkbot, through three calls. The page names no date and no customer.',
  sections: [
    {
      id: 'what',
      title: 'What the three calls are',
      paragraphs: [
        'A vertical is a space with its own pack: its fields, its rules and the stage at which each field may leave its owner. The three calls are a thin layer over the Space API of that space: no second engine, no second store, no second matching. Each call combines operations of the Space API, some of them drafts themselves, and runs them in one transaction.',
        'They are to run on the vertical’s own instance under /api/kern/v0, with the Space API’s credentials: a guest session for the first call from a browser, then the owner token that call returns. The operator’s side, the gates, the approval and the outcomes, stays on the Space API; the three calls have no operator call.',
        'The Space API stays at version 0.2.18 until the first release; nothing here changes it.',
      ],
    },
    {
      id: 'create-profile',
      title: 'create_profile: a profile, its consents, its checks',
      paragraphs: [
        'The confirm step of the vertical’s form. The vertical sends its pack and version, the side (seeking or offer), the party’s type (person or organisation) and display name, a contact address, the criteria as the person confirmed them, and the consents.',
        'Linkbot checks every value against the pinned pack and refuses what does not fit, field by field; nothing is guessed, and “unknown” and “any” are answers. It creates the party with its first intent, the contact channel (unconfirmed until the person follows a one-time link) and the owner token, records the consents, requests every check the space enables for the party’s type, and runs the private match for the new intent. A second search of the same profile is a second call with the owner token.',
        'Nothing personal is stored before this call.',
      ],
      examples: [
        { label: 'Request', code: createRequest },
        { label: 'Response', code: createResponse },
      ],
    },
    {
      id: 'find-matches',
      title: 'find_matches: what a side sees before anyone says yes',
      paragraphs: [
        'The proposed matches of the caller’s active intents, or of one. For each: a verdict per criterion (in the contract meets, partly, conflicts or unknown) with a stable reason code and an explanation that cites only fields allowed at that stage, the other side’s value where its pack lets it go that far, the names of the checks the other side passed that the space shows before a yes, and the caller’s own latest answer.',
        'Never a name, an address, the other side’s ids or its answer, nor when a check of it ran or that one failed. No score: the matches come unordered unless the space allows an order, and then with its explanation. Each match carries the space’s fixed notice: a decision aid; people decide.',
        'The one addition to the engine: each match this call returns is recorded as read (who, which match, when), so the record of who saw what covers the proposal as well.',
      ],
      examples: [
        { label: 'Request', code: findRequest },
        { label: 'Response', code: findResponse },
      ],
    },
    {
      id: 'confirm-interest',
      title: 'confirm_interest: yes, no or not now',
      paragraphs: [
        'The caller’s side answers a match. The latest answer counts and can be changed until the introduction exists. A yes is the party’s own act, not a disclosure.',
        'The introduction exists only when both say yes, every gate the space requires has been passed by a named operator, and an operator approved. Then Linkbot creates it in the same transaction and sends the receipts; the disclosed fields are read through the Space API, every read with a receipt.',
        'Until then the answer is “waiting”, whatever the other side did: the other side’s answer, a gate still open and an approval still missing look the same.',
      ],
      examples: [
        { label: 'Request', code: answerRequest },
        { label: 'Response while there is no introduction', code: answerWaiting },
        { label: 'Response once the introduction exists', code: answerIntroduced },
      ],
    },
    {
      id: 'identity',
      title: 'Who someone is comes only after both say yes',
      paragraphs: [
        'Before the introduction nothing that identifies a party leaves it: not its name, not its contact, not its ids. Then, in a space that introduces directly, each side sees the other’s fields marked for the introduction; in a space that introduces through its team, the operator sees them and connects the two.',
        'A no ends the pair: the engine keeps one match per pair, so a no stays that pair’s last word until the side itself changes it.',
      ],
    },
    {
      id: 'record',
      title: 'Consent and the record',
      paragraphs: [
        'At create_profile the party accepts the space’s terms, the notice that its identity will be released where the space has a gate for it, and whether its intent may appear on the board (off unless chosen). It withdraws by closing the intent or by asking for its deletion.',
        'Every write is a row of the space’s event log: who acted, what, on which object and when. Every read of an introduction has a receipt.',
        'Planned, not built: the checked history. A passed check, an introduction and a deal both sides confirmed are to land on the party’s record there; the three calls write nothing to it themselves.',
      ],
    },
  ],
  open: {
    title: 'What is open',
    items: [
      'The contract is a draft (0.1.0-draft): names and fields may change before any instance serves it, which comes after the first release, in an order not decided yet.',
      'Two people who seek each other, where each one’s wishes must fit the other: the engine matches a seeking intent against an offer, and a match in both directions is a proposal for after the first release.',
      'Special categories of personal data and their own consent: no place in the Space API yet; proposed as a flag on a field with a consent of its own, with counsel before any real data.',
      'Register and identity checks: the checks the draft names are the contact channel, control of a domain, the EU VAT number, the LEI and sanctions (for a person, the contact channel and sanctions); checks of a company are planned, and register and identity checks are not among them yet.',
      'A third person at the introduction: a vertical’s own feature, not part of the three calls.',
      'This page exists in English only.',
    ],
  },
};
