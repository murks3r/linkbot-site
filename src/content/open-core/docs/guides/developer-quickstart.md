# Developer quickstart: the person's path through the API

For a platform that builds its own interface instead of the widget. A person describes a need, confirms it, sees the matches, says yes, and finds the introduction under their own requests: the same calls the widget makes, through the SDK's `createGuestClient`, typed by the Space API contract (0.2.18).

> **What this page has run against:** only the local sample Space API in this repository (synthetic data, no hosted space, nothing leaves your machine). Every code block is a region of `examples/sdk-quickstart/quickstart.ts`; its test runs each step there in `pnpm check`. None of it has run against a real space yet.

## 1. Install

The SDK is **not on npm yet**. Use it from a clone of this repository (Node 22.12 or later, pnpm):

```bash
git clone OPEN_CORE_REPO_URL
cd linkbot-connect
pnpm install --frozen-lockfile
```

Then run every step of this page against the local sample Space API, once in each introduction mode:

```bash
pnpm --filter @linkbot-hq/example-sdk-quickstart start
```

It prints what each step returned. The package is `@linkbot-hq/sdk` (`packages/sdk`); in your own workspace, depend on it as `workspace:*` until it is published.

## 2. What you need from your space

- **The base URL**, `https://{space_host}/api/space/v0`. Each space is its own instance.
- **Your publishable key**, `pk_…`. It is public, and it works only from the space's allowed origins. A browser sends its own `Origin`; from a server or a script, pass one of the allowed origins as `origin`. The secret key (`sk_…`) never belongs on this path, and the client refuses it.

## 3. The client

<!-- snippet: examples/sdk-quickstart/quickstart.ts#client -->
```ts
const client = createGuestClient({ baseUrl, publishableKey, origin });
```

It types only the operations a person may call. A route that takes the secret key, such as the approval, is a type error and is refused before anything is sent. It keeps the guest session token and the owner token in memory; in a browser, pass `tokens` that keep them in sessionStorage, never in localStorage or a cookie. The [SDK reference](../reference/sdk.md#createguestclientoptions) has every option.

## 4. A session

<!-- snippet: examples/sdk-quickstart/quickstart.ts#session -->
```ts
const space = await client.GET('/space');
if (!space.data) throw new Error(`GET /space: ${space.error?.error}`);
// A guest session: the client keeps its token and sends it where the contract takes one.
const session = await client.POST('/sessions');
if (!session.data) throw new Error(`POST /sessions: ${session.error?.error}`);
```

A session stores no personal data and lasts 24 hours. `space.data` tells you the space's languages, its modes (`form`, `text`), its `introduction_mode` and its terms version.

## 5. Describe

<!-- snippet: examples/sdk-quickstart/quickstart.ts#describe -->
```ts
const described = await client.POST('/intake/describe', {
  body: {
    kind: 'seeking',
    language: 'en',
    text: 'We need 25,000 t of rock phosphate, cadmium below 20 mg/kg, CFR Augusta, payment by letter of credit.',
    // Values the person picked in your form win over the text.
    form: [
      { key: 'p2o5', value: { type: 'range', min: 30, unit: { code: 'percent' } }, importance: 'must', importance_source: 'suggested', source: { kind: 'person_picked' } },
      { key: 'window', value: { type: 'date_window', from: '2027-01-01', to: '2027-02-28', granularity: 'day' }, importance: 'must', importance_source: 'suggested', source: { kind: 'person_picked' } },
    ],
  },
});
if (!described.data) throw new Error(`POST /intake/describe: ${described.error?.error}`);
let reading = described.data;
```

Nothing is stored. The reading proposes criteria, each with its source: the quote it came from, or the person's pick. The criteria and their options come from the space's pack (`GET /form-schema`). The text path works only where the space's modes include `text`; otherwise send the form part alone.

## 6. Answer what the reader asks

<!-- snippet: examples/sdk-quickstart/quickstart.ts#answer -->
```ts
// Nothing is guessed: the reader asks what it cannot know. Show each question to the person and send their answer.
const basis = reading.questions.find((q) => q.kind === 'ambiguous_basis' && q.criterion_key === 'cadmium');
if (basis) {
  const answered = await client.POST('/intake/answer', {
    body: { reading_token: reading.reading_token, answers: [{ question_id: basis.id, value: { type: 'range', max: 20, unit: { code: 'mg_per_kg', basis: 'per_kg_p2o5' } } }] },
  });
  if (!answered.data) throw new Error(`POST /intake/answer: ${answered.error?.error}`);
  reading = answered.data;
}
```

`{ type: 'unknown' }` is a real answer too. A question is never answered for the person.

## 7. Confirm

<!-- snippet: examples/sdk-quickstart/quickstart.ts#confirm -->
```ts
// The confirm is the first write: show the person every value first. It returns the owner token, once.
const confirmed = await client.POST('/intake/confirm', {
  params: { header: { 'Idempotency-Key': newIdempotencyKey() } },
  body: {
    kind: 'seeking',
    language: 'en',
    pack: reading.pack,
    reading_token: reading.reading_token,
    criteria: reading.criteria,
    party: { type: 'organisation', display_name: 'Synthetic Buyer Ltd (fictional)' },
    consents: { ...(space.data.legal.terms_version ? { terms_version: space.data.legal.terms_version } : {}) },
  },
});
if (!confirmed.data) throw new Error(`POST /intake/confirm: ${confirmed.error?.error} ${confirmed.error?.field ?? ''}`);
const intentId = confirmed.data.intent.id;
```

The space checks every value again and answers `400 invalid_submission` with `details.fields`, or `409 required_question_open`. Where its form schema carries a confirm notice, the person's identity release goes in `consents.identity_release`; without it the space answers `409 identity_release_missing`. Retry a write with the same `Idempotency-Key`.

## 8. The matches

<!-- snippet: examples/sdk-quickstart/quickstart.ts#matches -->
```ts
// The proposed matches, each with a verdict per criterion. Matching discloses nothing and contacts nobody.
const matches = await client.GET('/intents/{intent_id}/matches', { params: { path: { intent_id: intentId } } });
if (!matches.data) throw new Error(`GET matches: ${matches.error?.error}`);
const match = matches.data.items.find((m) => m.state === 'suggested');
```

On a real space, matching runs after the confirm, so the first look can be empty: look again later (`intent.matching` says where it stands).

## 9. Yes or no

<!-- snippet: examples/sdk-quickstart/quickstart.ts#yes -->
```ts
// Only the person decides: send their yes, no or not_now. An introduction needs a yes from both sides.
const answer = await client.POST('/matches/{match_id}/answers', {
  params: { path: { match_id: match.id }, header: { 'Idempotency-Key': newIdempotencyKey() } },
  body: { answer: 'yes' },
});
if (!answer.data) throw new Error(`POST answers: ${answer.error?.error}`);
```

A yes is not disclosure. The introduction comes only with a yes from both sides and the space team's approval, which the space enforces. In the sample, the space team's seeded offers stand for that team's yes and approval, so the introduction follows at once.

## 10. The introduction, under the person's own requests

<!-- snippet: examples/sdk-quickstart/quickstart.ts#introduction -->
```ts
// "Mine": the person's introductions. The list reveals nothing and records no read.
const introductions = await client.GET('/introductions');
if (!introductions.data) throw new Error(`GET /introductions: ${introductions.error?.error}`);
const [first] = introductions.data.items;
if (!first) return undefined;
// In mode operator the space's team makes the contact, and the person reads no details.
if (space.introduction_mode !== 'direct') return { id: first.id, mode: first.mode, parties: undefined };
// In mode direct one read shows what the other side shares. Every read is receipted: read on the person's press only.
const read = await client.GET('/introductions/{introduction_id}', { params: { path: { introduction_id: first.id } } });
if (!read.data) throw new Error(`GET introduction: ${read.error?.error}`);
```

`GET /intents` lists the person's own requests, and `GET /parties/me/export` everything the space stores about them.

## Next

- Your server: the [SDK reference](../reference/sdk.md) (`createSpaceClient` with the secret key) and [webhooks](webhooks.md).
- Every route: the [Space API reference](../reference/space-api.md).
- No interface of your own: [embed the widget](quickstart.md).
