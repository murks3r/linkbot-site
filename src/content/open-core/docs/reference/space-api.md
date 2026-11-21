# Reference: the Space API (contract 0.2.18)

> Generated from `packages/contract/openapi.yaml`, contract 0.2.18 (sha256 `4c4964f3c14b…`), the published contract 0.2.18 with its descriptions edited for this repository (the schema is identical). The descriptions here are quoted from it. Do not edit this page: run `pnpm --filter @linkbot-hq/contract generate`. CI fails when this page and the contract differ.

Base URL: `https://{space_host}/api/space/v0`. Each space is its own instance with its own host. 75 routes.

From a browser, the [embed](embed.md) makes these calls for you, with the publishable key. From your server, the [SDK](sdk.md)'s client is typed by this contract, so a route, field or value it doesn't have is a type error.

## Credentials

| Credential | Header | What it is |
| --- | --- | --- |
| publishable key | `Linkbot-Publishable-Key: …` | pk_live_… or pk_test_…; valid only with an allowed Origin header. pk_test_… keys are valid only on instances in data mode synthetic. `*_test_*` keys work only on instances in data mode synthetic and live keys are refused there (`403 key_environment_mismatch`). |
| guest session | `Authorization: Bearer …` | Guest session token (gs_…), minted by POST /sessions. |
| owner token | `Authorization: Bearer …` | Owner token (ot_…), issued at confirm; manages what it created. 60 days from last use, revocable by the holder and the platform, reissued through an action link (0.2.1). |
| secret key | `Authorization: Bearer …` | sk_live_… or sk_test_…; server-to-server only; operator actions carry actor.operator_id. `*_test_*` keys work only on instances in data mode synthetic and live keys are refused there (`403 key_environment_mismatch`). |
| action token | `Authorization: Bearer …` | One-time action token (at_…) from an emailed link; one purpose, one use. |

A route that lists several credentials accepts any one of them.

## Routes

### space

Public space configuration, form schema and option lookup (pack-driven).

| Route | What it does | Credential | `Idempotency-Key` |
| --- | --- | --- | --- |
| `GET /openapi.json` | This contract as served by the instance (the version the instance implements) | publishable key or secret key |  |
| `GET /space` | Public configuration of this space | publishable key or secret key |  |
| `PATCH /space` | Change the space's settings (secret key with actor) | secret key |  |
| `GET /space/origins` | The allowed origins of the space's publishable keys | secret key |  |
| `PUT /space/origins` | Replace the allowed origins of every active publishable key (normalised, audited) | secret key |  |
| `GET /form-schema` | The form generated from the pinned pack version (form path and confirm step) | publishable key or secret key |  |
| `GET /options/{criterion_key}` | Search the option list of a criterion (long lists such as UN/LOCODE ports are not inlined in the form schema) | publishable key, guest session, owner token or secret key |  |
| `GET /options/{criterion_key}/{code}` | Label and status of one option code (also for codes that arrive in a Reading, Intent, BoardItem or verdict) | publishable key, guest session, owner token or secret key |  |
| `GET /health` | Health report of this instance (no authentication) | none |  |

### sessions

Guest sessions and owner tokens.

| Route | What it does | Credential | `Idempotency-Key` |
| --- | --- | --- | --- |
| `POST /sessions` | Mint a guest session (publishable key, origin-locked) | publishable key |  |
| `DELETE /owner-token` | Revoke the presented owner token (the holder's own revocation; audited) | owner token |  |
| `POST /owner-token/reissue-requests` | Ask for a new owner token by email (one-time action link to a channel verified before the request) | publishable key or guest session |  |

### intake

Describe (text and/or form), validate, answer, confirm. Stateless before confirm.

| Route | What it does | Credential | `Idempotency-Key` |
| --- | --- | --- | --- |
| `POST /intake/describe` | Describe a need or offer in own words, by form, or both; get a Reading back | guest session, owner token or secret key |  |
| `POST /intake/validate` | Validate criteria against the pack without storing anything (the widget may call it while the person fills the form) | guest session, owner token or secret key |  |
| `POST /intake/answer` | Answer open questions of a Reading; get the updated Reading | guest session, owner token or secret key |  |
| `POST /intake/confirm` | Confirm the criteria as shown in the form; creates the Intent (first write) | guest session, owner token or secret key | required |

### intents

Needs (kind seeking) and offers (kind offer) owned by a party.

| Route | What it does | Credential | `Idempotency-Key` |
| --- | --- | --- | --- |
| `GET /intents` | List the caller's own intents (owner token) or every intent of the space (secret key, stage-limited) | owner token or secret key |  |
| `POST /intents` | Seed an intent on behalf of a party (operator path, source operator_set) | secret key | required |
| `GET /intents/{intent_id}` | Read one intent (owner sees everything; secret key sees stage ≤ match plus operator fields) | owner token or secret key |  |
| `GET /intents/{intent_id}/reads` | Who read this intent's operator-stage fields, and when | owner token or secret key |  |
| `POST /intents/{intent_id}/revisions` | Change criteria (new revision through the same confirm form); re-runs matching | owner token or action token | required |
| `POST /intents/{intent_id}/confirmations` | Four-eyes confirmation of operator-seeded values for the platform's own organisation | secret key | required |
| `POST /intents/{intent_id}/reviews` | Record how an "other / not listed" value is handled (never mapped to the nearest option) | secret key | required |
| `POST /intents/{intent_id}/status` | Pause, resume or close an intent | owner token or secret key |  |
| `PUT /intents/{intent_id}/board-listing` | Opt the intent in to or out of the anonymised board (owner only; default off) | owner token |  |

### matches

Deterministic fit per criterion; answers yes/no; nothing disclosed here.

| Route | What it does | Credential | `Idempotency-Key` |
| --- | --- | --- | --- |
| `GET /intents/{intent_id}/matches` | Matches of an intent with the fit per criterion | owner token or secret key |  |
| `GET /matches` | Operator view of matches in the space, filterable by state and approval status | secret key |  |
| `GET /matches/{match_id}` | One match. Field values of the other side appear only at disclosure stage ≤ match. | owner token or secret key |  |
| `POST /matches/{match_id}/answers` | A side answers yes, no or not now | owner token, secret key or action token | required |
| `POST /matches/{match_id}/clarification-requests` | Ask one side for a missing or ambiguous value without learning who they are | secret key | required |

### approval

Team approval per case with gate records (operator, secret key).

| Route | What it does | Credential | `Idempotency-Key` |
| --- | --- | --- | --- |
| `POST /intents/{intent_id}/party-gates` | Record a party-level gate outcome (active while space.features.party_gates is on) | secret key | required |
| `GET /matches/{match_id}/gates` | Gate definitions of the space and the records for this match | secret key |  |
| `POST /matches/{match_id}/gates` | Record a gate outcome (never decided by the system) | secret key | required |
| `POST /matches/{match_id}/approval` | Approve or decline the case (named operator); both sides receive a receipt once the introduction exists | secret key | required |

### introductions

Disclosure with receipt after both yes and approval; outcomes.

| Route | What it does | Credential | `Idempotency-Key` |
| --- | --- | --- | --- |
| `GET /introductions` | Introductions of the space (secret key) or of the caller (owner token) | owner token or secret key |  |
| `GET /introductions/{introduction_id}` | One introduction; contact fields appear only for the recipients the mode allows, and every read is audited | owner token or secret key |  |
| `GET /introductions/{introduction_id}/outcomes` | Outcomes recorded so far | owner token or secret key |  |
| `POST /introductions/{introduction_id}/outcomes` | Record an outcome (asked of both sides after 30, 60 and 90 days; the operator may record too) | owner token, secret key or action token | required |

### watches

The subscription type; email and webhook channels; owner only.

| Route | What it does | Credential | `Idempotency-Key` |
| --- | --- | --- | --- |
| `GET /intents/{intent_id}/watch` | Read the watch | owner token |  |
| `PUT /intents/{intent_id}/watch` | Create or replace the watch on an intent (the subscription type) | owner token |  |
| `DELETE /intents/{intent_id}/watch` | Remove the watch (one-click unsubscribe also works through an action token) | owner token or action token |  |
| `POST /intents/{intent_id}/watch/pause` | Pause or resume the watch | owner token or action token |  |

### board

Anonymised, opted-in items; answering creates a linked intent.

| Route | What it does | Credential | `Idempotency-Key` |
| --- | --- | --- | --- |
| `POST /board/search` | Search the anonymised board with the pack's own controls (same vocabulary as the form) | guest session, owner token or secret key |  |
| `GET /board/items/{board_item_id}` | One anonymised board item | guest session, owner token or secret key |  |
| `POST /board/items/{board_item_id}/answers` | Answer a board item with an offer or a need; creates a linked intent on the other side | guest session or owner token | required |

### channels

Contact channels (email) verified by emailed link.

| Route | What it does | Credential | `Idempotency-Key` |
| --- | --- | --- | --- |
| `GET /channels` | The caller's channels and their verification status | owner token |  |
| `POST /channels` | Add an email channel to the caller's party; sends a verification link (opaque action token) | owner token | required |
| `POST /mail/feedback` | Bounces and complaints from the instance's mail provider (served since 0.2.14) | none |  |

### actions

One-time emailed actions (verify, yes/no, unsubscribe, delete, clarify).

| Route | What it does | Credential | `Idempotency-Key` |
| --- | --- | --- | --- |
| `GET /actions/{token}` | What this link does (shown before anything happens; no side effects, safe for mail-scanner prefetch) | none |  |
| `POST /actions/{token}` | Perform the single action the token allows (verify channel, answer yes/no, pause or stop a watch, confirm deletion, clarify) | none |  |

### deletion

Deletion requests, deletion log event.

| Route | What it does | Credential | `Idempotency-Key` |
| --- | --- | --- | --- |
| `POST /deletion-requests` | Request deletion of the caller's party and intents (or, with a secret key, on behalf with a reference) | owner token, secret key or action token | required |
| `GET /deletion-requests/{request_id}` | State of a deletion request | owner token or secret key |  |

### operators

Operator register (asserted by the platform).

| Route | What it does | Credential | `Idempotency-Key` |
| --- | --- | --- | --- |
| `POST /parties/{party_id}/owner-tokens/revoke` | Revoke every owner token of a party (incident path; audited) | secret key |  |
| `GET /operators` | The operator register | secret key |  |
| `POST /operators` | Add an operator (asserted by the platform) | secret key |  |
| `POST /operators/{operator_id}/status` | Deactivate or reactivate an operator | secret key |  |

### keys

The space's API keys: list, create, revoke, rotate with an overlap.

| Route | What it does | Credential | `Idempotency-Key` |
| --- | --- | --- | --- |
| `GET /keys` | The keys of the space (prefix, kind, status, origins; never the material) | secret key |  |
| `POST /keys` | Create a key; the material is shown once | secret key |  |
| `POST /keys/{key_id}/revoke` | Revoke a key at once (audited as key.revoked; revoking a revoked key changes nothing) | secret key |  |
| `POST /keys/{key_id}/rotate` | Rotate a key | secret key |  |

### funnel

Content-free counts along the funnel.

| Route | What it does | Credential | `Idempotency-Key` |
| --- | --- | --- | --- |
| `GET /funnel` | Content-free counts along the funnel, from the space's events | secret key |  |

### parties

A party's own data: its export.

| Route | What it does | Credential | `Idempotency-Key` |
| --- | --- | --- | --- |
| `GET /parties/me/export` | Everything the space stores about the party that holds the owner token | owner token |  |
| `POST /parties/export-requests` | Ask for a one-time export link (action kind export_data) to a verified channel; never says whether the address is known | publishable key or guest session |  |
| `POST /parties/{party_id}/exports` | The same export for a request the platform received (secret key with actor and reference; audited) | secret key |  |

### webhooks

Signed webhooks with thin payloads.

| Route | What it does | Credential | `Idempotency-Key` |
| --- | --- | --- | --- |
| `GET /webhooks` | Registered endpoints (never a secret) | secret key |  |
| `POST /webhooks` | Register an endpoint (https only, on a host the instance lists); the signing secret is returned once | secret key |  |
| `DELETE /webhooks/{endpoint_id}` | Remove an endpoint; what it has not received is dead | secret key |  |
| `POST /webhooks/{endpoint_id}/rotate-secret` | Rotate the signing secret; the old one stays valid for 7 days, and deliveries carry both signatures | secret key |  |
| `GET /webhooks/{endpoint_id}/deliveries` | Delivery log, newest first (the latest attempt of each delivery; status, attempts, body hash; never the body) | secret key |  |
| `POST /webhooks/{endpoint_id}/deliveries/{delivery_id}/redeliver` | Redeliver one event (a new delivery with the same Linkbot-Webhook-Id and a fresh 24 hours) | secret key |  |

### audit

Append-only space events.

| Route | What it does | Credential | `Idempotency-Key` |
| --- | --- | --- | --- |
| `GET /audit` | Append-only space events for an object (operator view; content-free metadata) | secret key |  |

### embed

The embed script served by the instance itself, outside the API base.

| Route | What it does | Credential | `Idempotency-Key` |
| --- | --- | --- | --- |
| `GET /embed/v0/embed.js` | The embed script of this instance, channel path | none |  |
| `GET /embed/v0/{version}/embed.js` | The embed script of one pinned version (immutable) | none |  |
| `GET /embed/v0/locales/{lang}.json` | A language file of the pinned embed release, channel path | none |  |
| `GET /embed/v0/{version}/locales/{lang}.json` | A language file of one pinned version (immutable) | none |  |
