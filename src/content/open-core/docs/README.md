# Linkbot Connect docs

How a platform puts a Linkbot space on its site and connects its server. Every code block in these pages is a file that the checks typecheck or run, against the sample build with synthetic data.

These pages are in English. The widget speaks English, German, Spanish, Italian and French.

## Start here

- [Embed in 5 minutes](guides/embed-in-five-minutes.md): a script tag, your publishable key, your origin.
- [Quickstart](guides/quickstart.md): a space on your page in five steps.
- [Developer quickstart](guides/developer-quickstart.md): your own interface on the API, from a session to the introduction, run against the local sample Space API.

## Your site

- [Plain HTML](recipes/html.md), including a strict Content Security Policy
- [Astro](recipes/astro.md) (an integration and a component, with Astro's own Content Security Policy)
- [Next.js](recipes/nextjs.md) (App Router: a server component, with a strict nonce-based policy)
- [WordPress](recipes/wordpress.md) (a plugin: Settings → Linkbot, a block and a shortcode)

## Your server

- [Webhooks](guides/webhooks.md): register an endpoint, and verify every delivery.

## Reference

- [The protocol](protocol/README.md): the Space API contract and the rules it keeps.
- [The embed](reference/embed.md): attributes, the notice slot, theme variables, CSP, `window.Linkbot`.
- [The React wrapper](reference/react.md).
- [The SDK](reference/sdk.md): the typed clients, for your server and for the person's side, and the webhook check.
- [The Space API](reference/space-api.md): every route, generated from the contract.

## Privacy

- [What the embed does in your page](guides/privacy-for-integrators.md), as technical facts.

## For contributors

The [architecture decisions](adr/).
