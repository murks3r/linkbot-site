# Recipe: Astro

> **Not yet run against a real space:** a pilot's synthetic staging space serves a widget release at `/embed/v0/embed.js`, with its language files and CORS, but this recipe has not run against it. The code below is `examples/astro`, with `@linkbot-hq/astro` (`packages/astro`, version 0.1.0-v1; each version is a tag of this repository, and nothing goes to npm before the M3 go). CI builds it with Astro 7.3.5 and runs the built pages in Chromium, Firefox and WebKit against a local stand-in for an instance: this build's `embed.js` and the sample Space API (synthetic data). It checks that Astro's own Content Security Policy lets `embed.js` in, that the policy refuses nothing, that the widget starts with the notice and the theme, that Astro left the script tag alone, that every mode starts on its own page, and that the server reads "mine" through the SDK. [`packages/astro/README.md`](../../packages/astro/README.md) runs it from zero.

## 1. Add the integration

In `astro.config.mjs`, add `linkbot()`:

<!-- snippet: examples/astro/astro.config.mjs#config -->
```js
security: { csp: true },
integrations: [linkbot()],
```

`linkbot()` takes your space from the build's environment: `PUBLIC_LINKBOT_EMBED_URL` (`https://{space_host}/embed/v0/embed.js`, served by your space's instance), `PUBLIC_LINKBOT_KEY` (your `pk_…`) and, only if `embed.js` comes from another origin, `PUBLIC_LINKBOT_API`. You can pass them as options instead: `linkbot({ embedUrl, publishableKey, api })`. They are public by design: the key only identifies your space and works only on your allowed origins.

The integration checks them when you build: a secret key (`sk_…`), a missing key or an address that isn't https fails the build, with a message that says why.

**Content Security Policy.** With `security: { csp: true }`, Astro writes a policy into every page, and `linkbot()` adds the origin of `embed.js` to `script-src` and a `connect-src` with the Space API's and `embed.js`'s origins. If your policy has its own `connect-src`, the integration leaves it alone and says at build time which origins to add. Without `security.csp`, the integration adds nothing.

## 2. Put it on a page

<!-- snippet: examples/astro/src/pages/index.astro#usage -->
```astro
<LinkbotSpace mode="describe" side="seeking" locale="en" class="quote-form">
  <p slot="notice">Your two lines, from your own privacy texts.</p>
</LinkbotSpace>
```

Import it with `import LinkbotSpace from '@linkbot-hq/astro/LinkbotSpace.astro'`. `mode`, `side`, `locale` and `input` are the element's attributes (see the [embed reference](../reference/embed.md)); one you leave out is the widget's default. `class` goes on the element: this example sets the theme there.

Two things the component does for you:

- **`is:inline`** keeps Astro from processing the script. `embed.js` must load from where it is served, because it fetches its other languages from next to itself and checks each one against a sha256 it carries.
- **The notice goes through a wrapper.** Astro uses `slot="notice"` on a child for its own slots and drops the attribute. So the component puts your notice in a `<div slot="notice">`, which the widget picks up.

The page needs no server: the widget is a script and an element, so a static Astro build works. The example adds the Node adapter only for `/mine`, which reads "mine" on the server. If you use the component twice on one page, the script tag appears twice; the second load does nothing.

This example builds and runs with `node run.mjs`, which hands `examples/astro/.env.example` (the local stand-in for an instance, which `start` and `dev` start first) to Astro. Your site sets the variables in its build's environment, or in a `.env` file you don't commit.
