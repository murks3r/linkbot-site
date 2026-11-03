# Webhooks: receiving Linkbot's events on your server

> **What runs today:** the Space API serves webhooks since contract 0.2.14, and a test space with synthetic data runs 0.2.18. The receiver below is tested in CI against signed sample deliveries (`examples/webhooks`).

Linkbot tells your server when something happens in your space: a match was proposed, a gate was recorded, an introduction was created. Each delivery is thin. It carries ids and states only, never contact data. Fetch details with your secret key when you need them.

## 1. Register an endpoint

Call `POST /webhooks` with your secret key and an `actor`, an active operator of your space. The URL must be `https`, on a host your instance lists (`409 webhook_host_not_allowed`); a space has at most ten endpoints, and `features.webhooks` must be on. An endpoint gets only the events recorded after it was registered. The response contains the signing secret, **shown once**. Store it in your server's secret store, never in code. The SDK's client is typed by the contract, so a route, field or value the contract doesn't have is a type error:

<!-- snippet: examples/webhooks/register.ts -->
```ts
// Run once, from your server: registers your receiver and returns the signing secret, shown only this once.
import { createSpaceClient } from '@linkbot-hq/sdk';

export async function registerWebhook(url: string): Promise<string> {
  const linkbot = createSpaceClient({ baseUrl: process.env.LINKBOT_API_BASE!, secretKey: process.env.LINKBOT_SECRET_KEY! });
  // The acting operator: an active one in your space's register (GET /operators).
  const actor = { operator_id: process.env.LINKBOT_OPERATOR_ID! };
  const { data } = await linkbot.POST('/webhooks', { body: { url, events: ['match.proposed', 'introduction.created'], actor } });
  if (!data) throw new Error('Linkbot did not register the endpoint.');
  return data.secret; // Put it in your secret store now: Linkbot never shows it again.
}
```

## 2. Verify every delivery

Each delivery carries three headers:

| Header | What it holds |
| --- | --- |
| `Linkbot-Webhook-Id` | A uuid. The same delivery keeps its id when it is retried. |
| `Linkbot-Webhook-Timestamp` | Unix seconds. |
| `Linkbot-Signature` | `v1=` followed by the hex HMAC-SHA256 of timestamp, `.` and the raw body, keyed with your signing secret. During a rotation it carries one `v1=` signature per valid secret, comma-separated. |

Refuse a delivery that is older than 5 minutes or whose signature doesn't match. `verifyWebhook` does both. It compares in constant time with Web Crypto, so it runs in Node 20+, Deno, Bun and edge runtimes.

This receiver is a Next.js App Router route. Its test runs in CI:

<!-- snippet: examples/webhooks/route.ts -->
```ts
// app/linkbot/webhooks/route.ts: a Next.js App Router route. The same handler runs in Deno and Bun.
import { verifyWebhook } from '@linkbot-hq/sdk/webhooks';

// Deliveries are retried for 24 hours, so the same delivery can arrive more than once.
// Keep the ids you have handled in your database; a Set only lasts as long as the process.
const handled = new Set<string>();

export async function POST(request: Request): Promise<Response> {
  // The current secret, and during a rotation the previous one (valid for up to 7 days).
  const secrets = [process.env.LINKBOT_WEBHOOK_SECRET, process.env.LINKBOT_WEBHOOK_SECRET_PREVIOUS].filter((s): s is string => Boolean(s));
  // Verify the raw body, before parsing it.
  const result = await verifyWebhook({ body: await request.text(), headers: request.headers, secrets });
  if (!result.ok) return new Response(null, { status: 400 });
  if (handled.has(result.id)) return new Response(null, { status: 200 });
  handled.add(result.id);
  // The payload carries ids and states only. Fetch details with your secret key when you need them.
  console.log(`Linkbot ${result.event.type}: ${result.event.object.type} ${result.event.object.id}`);
  return new Response(null, { status: 204 });
}
```

Points to keep:

- **Verify the raw body.** Parse JSON only after `verifyWebhook` says `ok`. In Express, use `express.raw({ type: 'application/json' })` for this route; `verifyWebhook` takes the resulting buffer.
- **Answer 2xx quickly.** Any other status is retried, with exponential backoff, for 24 hours. After that the delivery is marked `dead`. A redirect is never followed.
- **Handle each id once.** Delivery is at least once: a retry, and a redelivery, carry the same `Linkbot-Webhook-Id`.
- **Never log the secret or the signature.**

## 3. Rotate the secret

Call `POST /webhooks/{endpoint_id}/rotate-secret` with an `actor`. You get the new secret (again shown once) and `previous_secret_valid_until`. The old secret stays valid for 7 days, and each delivery meanwhile carries both signatures. Pass both to `verifyWebhook` until then; the receiver above reads the old one from `LINKBOT_WEBHOOK_SECRET_PREVIOUS`.

## 4. Event types

`intent.confirmed`, `intent.revised`, `intent.status_changed`, `match.proposed`, `match.updated`, `match.evaluated`, `match.held`, `gate.recorded`, `approval.recorded`, `answer.recorded`, `clarification.requested`, `review.recorded`, `introduction.created`, `introduction.read`, `outcome.recorded`, `watch.created`, `watch.replaced`, `watch.status_changed`, `watch.delivered`, `channel.verified`, `channel.suppressed`, `intent.board_listed`, `intent.board_unlisted`, `deletion.requested`, `deletion.refused`, `deletion.completed`, `key.created`, `key.rotated`, `key.revoked`, `space.settings_changed`, `space.origins_changed`, `party.exported`, `operator.created`, `operator.status_changed`, `mail.queued`, `mail.sent`, `mail.failed`, `mail.uncertain_send`.

Every event has `id`, `type`, `space_id`, `occurred_at`, `api_version` and `object` (`type`, `id`, and `state` where there is one). For `watch.delivered` of an organisation's watch with the `webhook` channel, `object.items` lists the fits' match ids; such a watch gets no mail.

## 5. Check deliveries

`GET /webhooks/{endpoint_id}/deliveries` lists each delivery's status, attempts and a hash of the body. It never returns the body itself. `POST …/deliveries/{delivery_id}/redeliver` (with an `actor`) sends one again, with the same `Linkbot-Webhook-Id` and a fresh 24 hours. Removing an endpoint (`DELETE /webhooks/{endpoint_id}?operator_id=…`) marks what it has not received `dead`.
