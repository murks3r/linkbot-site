# The Space API protocol

A Linkbot space speaks one HTTP API, the Space API. Its contract is an OpenAPI 3.1 document: [`packages/contract/openapi.yaml`](../../packages/contract/openapi.yaml). Every instance serves the same file at `GET /api/space/v0/openapi.json`, and `packages/contract` pins it by sha256 and generates the TypeScript types from it. The [route list](../reference/space-api.md) is generated from it too.

## The three steps

1. **Check.** A space can check each party before its request counts. A space that does says so in its confirm notice, and the party releases its identity for that check when it confirms.
2. **Match out of sight.** A request and an offer are compared without either side seeing the other. A board shows only the criteria the space's form puts at the board stage, coarsened as the form says.
3. **Yes from both sides.** A match is a proposal. Nobody learns who the other side is until both have said yes; then the space creates the introduction. The server enforces this; a client cannot skip it.

## Credentials

| Credential | Who holds it | Where it may be |
| --- | --- | --- |
| Publishable key `pk_…` | The platform | In a page; it works only from the space's allowed origins |
| Guest session, owner token | The person, for their own requests | `sessionStorage` of the page, never `localStorage` or cookies |
| Action token | The person, from a link the space emailed | One-time and single-purpose; not a login |
| Secret key `sk_…` | The platform's server | Never in a page, a test, a fixture or a log |

## Licence

This directory is licensed under CC BY 4.0 ([LICENSE-docs](../../LICENSE-docs)).
