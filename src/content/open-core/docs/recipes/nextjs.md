# Recipe: Next.js (App Router)

> **Not yet run against a real space:** a pilot's synthetic staging space serves a widget release at `/embed/v0/embed.js`, with its language files and CORS, but this recipe has not run against it. The code below is `examples/nextjs`, with `@linkbot-hq/nextjs` (`packages/nextjs`, version 0.1.0-v1; each version is a tag of this repository, and nothing goes to npm before the M3 go). CI builds it with Next.js 16.3.8 and React 19.3, which typechecks it, then starts it and runs its pages in Chromium, Firefox and WebKit against a local stand-in for an instance: this build's `embed.js` and the sample Space API (synthetic data). It checks that the page sends a strict nonce-based Content Security Policy, that `embed.js` loads once and carries the request's nonce, that the widget starts with the notice and the theme, that the policy refuses nothing, that the console shows no errors, that every mode starts on its own page, and that the server reads "mine" through the SDK. [`packages/nextjs/README.md`](../../packages/nextjs/README.md) runs it from zero.

## 1. Put it on a page

`<LinkbotSpace>` from `@linkbot-hq/nextjs` is a server component: the page arrives with the element and its script, and needs no client-side code to show them. In `app/page.tsx`:

<!-- snippet: examples/nextjs/app/page.tsx#usage -->
```tsx
<LinkbotSpace
  src={process.env.NEXT_PUBLIC_LINKBOT_EMBED_URL!}
  publishableKey={process.env.NEXT_PUBLIC_LINKBOT_KEY!}
  mode="describe"
  side="seeking"
  locale="en"
  nonce={nonce}
  notice={<p>Your two lines, from your own privacy texts.</p>}
  className="quote-form"
/>
```

- `src` and `publishableKey` are required. They are public by design: the key only identifies your space and works only on your allowed origins. `NEXT_PUBLIC_` variables are fixed at build time. A secret key (`sk_…`) throws before anything reaches the page.
- `mode`, `side`, `locale`, `input` and `api` are the element's attributes; see the [embed reference](../reference/embed.md). `notice` is your data notice, shown above the confirm button.
- `nonce` is this request's nonce, from `await getNonce()`, for a nonce-based policy (step 2). Without such a policy, leave it out, and the page can render statically.
- React renders the script once per page, in the head, however many elements the page has.
- `className` and `style` go on the element. This example sets the theme in `app/globals.css`, because its policy allows no inline styles.

## 2. A strict Content Security Policy

`proxy.ts` (Next.js 16's name for middleware) gives every request a fresh nonce and a policy that lets `embed.js` in. `linkbotCsp()` returns the sources the widget needs:

<!-- snippet: examples/nextjs/proxy.ts#policy -->
```ts
const linkbot = linkbotCsp({ embedUrl: process.env.NEXT_PUBLIC_LINKBOT_EMBED_URL! });
const policy = [
  "default-src 'self'",
  `script-src 'self' 'nonce-${nonce}' 'strict-dynamic' ${linkbot['script-src'].join(' ')}`,
  `connect-src 'self' ${linkbot['connect-src'].join(' ')}`,
  "style-src 'self'",
  "img-src 'self' data:",
  "base-uri 'none'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join('; ');
```

The proxy puts the policy and the nonce (`x-nonce`) on the request, where Next.js reads the nonce for its own scripts and `getNonce()` reads it for the widget's, and the policy on the response. The widget needs no `'unsafe-inline'`: it styles itself with a constructable stylesheet. Pass `api` to `linkbotCsp()` only when the Space API is not on the origin of `embed.js`. Import it from `@linkbot-hq/nextjs/csp` in a proxy: that module has no other dependencies.

## 3. From a client component

An element that a client component renders, for example after a click, uses `LinkbotSpaceClient` from `@linkbot-hq/nextjs/client`, with the same props except `nonce`. A client component can't import the main entry, because `getNonce()` reads request headers, which only the server can. `LinkbotSpaceClient` loads `embed.js` from the browser, once per URL. Under a nonce-based policy with `'strict-dynamic'`, that script is allowed because trusted code adds it. Every prop is in the [React wrapper reference](../reference/react.md).

This example builds with `node run.mjs build`, which reads `examples/nextjs/.env.example` (the local stand-in for an instance, which `start` and `dev` start first) and turns Next's telemetry off. Your app runs `next build` with its own environment. The example's `next.config.ts` lists the packages in `transpilePackages` only because, inside this repository, they are TypeScript source.

## Your server side

Webhooks arrive at a route handler; the [webhooks guide](../guides/webhooks.md) shows one for the App Router, in code CI runs. The secret key stays on the server: never put it in a `NEXT_PUBLIC_` variable.
