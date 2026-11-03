# Reference: the SDK (`@linkbot-hq/sdk`)

For your **server**, with the secret key, and for **your own interface** on the person's side, with the publishable key. The secret key never goes into a browser page: `createSpaceClient` refuses to start in one. The SDK is not published to npm yet (plan §8). Its code is in `packages/sdk`, and the [webhooks guide](../guides/webhooks.md) shows it in use, in code CI runs.

## `createSpaceClient(options)`

A Space API client typed by the contract. Its types are generated from the YAML Core posted (`packages/contract`, pinned by sha256). Paths, parameters, bodies and responses are the contract's own, so a route, field or value the contract doesn't have is a type error. The routes are listed in the [Space API reference](space-api.md).

| Option | |
| --- | --- |
| `baseUrl` | `https://{space_host}/api/space/v0`. Each space is its own instance, so the base URL is the space. Only https is accepted, except http on `localhost` and `127.0.0.1` |
| `secretKey` | the space's secret key, `sk_…`, from your server's secret store. A value that isn't shaped like a secret key is refused |
| `fetch` | optional: your runtime's `fetch`, or one for tests |

It returns an [openapi-fetch](https://openapi-ts.dev/openapi-fetch/) client. Its methods are named after HTTP methods (`GET`, `POST`, `PUT`, `DELETE` and so on), and each one returns `{ data, error, response }`.

## `newIdempotencyKey()`

A fresh `Idempotency-Key` (a uuid). Writes the contract marks need one (see the [Space API reference](space-api.md)). Keep the key with the write, and send the same key when you retry it, so the space does the write once.

## `createGuestClient(options)`

The person's side of the Space API, for a platform that builds its own interface instead of the widget: a guest session, describe, answer, confirm, the matches, yes or no, the introduction, and the person's own requests. It is typed by the same contract, with only the operations a person may call: those whose `security` names the publishable key, a guest session or the owner token. Any other route is a type error, and refused before anything is sent. The [developer quickstart](../guides/developer-quickstart.md) walks through it.

| Option | |
| --- | --- |
| `baseUrl` | `https://{space_host}/api/space/v0`, as for the server client |
| `publishableKey` | the space's publishable key, `pk_…`. It is public, and works only from the space's allowed origins. A secret key is refused |
| `origin` | outside a browser only: the allowed origin to send, since nothing else sends one there. A browser sends its own, so the option is refused there |
| `tokens` | optional: where the guest session token and the owner token live (`session`, `setSession`, `owner`, `setOwner`). Defaults to memory. In a browser keep them in sessionStorage, never in localStorage or a cookie |
| `fetch` | optional: your runtime's `fetch`, or one for tests |

Every request carries `Linkbot-Publishable-Key`, and no cookies. Where an operation takes the owner token and the client holds one, it is the bearer; otherwise the guest session, where the operation takes one. The client keeps the session token from `POST /sessions` and the owner token from `POST /intake/confirm`; `client.tokens` reads and sets both. The owner token is shown once: keep it as long as the person should manage what they confirmed.

## `verifyWebhook(input)`

Checks a webhook delivery exactly as the contract specifies, using Web Crypto with a constant-time comparison. It runs in Node 20+, Deno, Bun and edge runtimes.

| Input | |
| --- | --- |
| `body` | the request body exactly as received, before any JSON parsing |
| `headers` | the request's headers, in any casing |
| `secrets` | the endpoint's signing secret. During a rotation, pass the new one and the previous one; the previous one stays valid for up to 7 days |
| `toleranceSeconds` | optional: how old a delivery may be. Defaults to the contract's 300 |
| `now` | optional: the current time in milliseconds, for tests |

It resolves to `{ ok: true, id, timestamp, event }`, or to `{ ok: false, reason }` with one of these reasons:

| Reason | When |
| --- | --- |
| `missing_headers` | a `Linkbot-Webhook-Id`, `Linkbot-Webhook-Timestamp` or `Linkbot-Signature` header is missing |
| `bad_timestamp` | the timestamp isn't a number of seconds |
| `too_old` | the delivery is older than the tolerance |
| `bad_signature` | no signature matches any of the secrets |
| `no_secret` | no secret was passed |
| `invalid_json` | the signature matches, but the body isn't JSON |

## `signWebhook({ body, secret, timestamp })`

Signs a body the way Linkbot does and returns the `Linkbot-Webhook-Timestamp` and `Linkbot-Signature` headers, for testing your receiver.

## Also exported

`CONTRACT_VERSION` and `CONTRACT_SHA256`, which say which contract the types come from; `OPERATION_SECURITY`, who may call each operation (`'POST /sessions': ['publishableKey']`); `memoryGuestTokens()`; and the types `Schemas` (every schema in the contract), `paths`, `Operation`, `SecurityScheme`, `GuestPaths`, `GuestOperation`, `GuestTokens`, `GuestClient`, `GuestClientOptions`, `WebhookEvent`, `SpaceClient`, `SpaceClientOptions`, `VerifyWebhookInput` and `VerifyWebhookResult`.
