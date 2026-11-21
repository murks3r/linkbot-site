# Quickstart: a Linkbot space on your page

> **What runs today:** a test space with synthetic data serves the widget release `embed-v0.6.1-v1` at `/embed/v0/embed.js`, with its language files and CORS, as each space's instance serves `embed.js` next to its API. The snippet in step 2 has started the widget there, and steps 3 to 5 have run against its Space API. Hosted spaces for other platforms are coming soon. Every code block on this page is a file that CI runs in Chromium, Firefox and WebKit against the sample build (synthetic data), with the placeholders filled in. To try it yourself, see "Try it today" at the end. The target is ten minutes from a blank page to a working space.

## 1. What you need from your space

- **Your publishable key**, starting with `pk_`. The console's **Space and snippet** page shows it, with the snippet already filled in. A publishable key only identifies your space, and it works only on your allowed origins. Never put a secret key (`sk_…`) in a page: the widget refuses to start with one.
- **Your page's origin on the space's allow list**, for example `https://www.example.com`. Scheme, host and port must match exactly. Where your instance serves it, the console's **Keys and origins** page sets the allowed origins; otherwise whoever provisions your space sets them, so give them your origins.

## 2. Paste the snippet

Put it where the form should appear:

<!-- snippet: examples/snippets/embed.html -->
```html
<script src="EMBED_URL" async></script>
<div data-linkbot="pk_…" data-mode="describe" data-side="seeking" data-locale="de"></div>
```

`EMBED_URL` is `https://{space_host}/embed/v0/embed.js`: your space's own instance serves it. `data-mode` picks what the widget does (`describe`, `board`, `watch` or `mine`), `data-side` whether a person describes a need (`seeking`) or an offer (`offer`), and `data-locale` the language. Every attribute is in the [embed reference](../reference/embed.md).

To pin one release with Subresource Integrity, load the versioned path with the `integrity` value from that release's notes, and add `crossorigin="anonymous"`: a browser checks the integrity of a script from another origin only with it, and the instance sends the CORS header it needs. The language files then load from next to that versioned path.

<!-- snippet: examples/snippets/embed-sri.html -->
```html
<script src="https://{space_host}/embed/v0/{version}/embed.js" integrity="sha384-…" crossorigin="anonymous" async></script>
```

## 3. Add your data notice

Put your own two lines about how you handle requests inside the element, with `slot="notice"`. They appear just above the confirm button, and your page's CSS styles them:

<!-- snippet: examples/snippets/notice.html -->
```html
<div data-linkbot="pk_…">
  <p slot="notice">Your two lines, from your own privacy texts.</p>
</div>
```

The widget adds its own fixed lines next to them, such as "Nothing is used until you confirm." What to write in yours: [privacy for integrators](privacy-for-integrators.md).

## 4. Make it look like your site (optional)

The widget takes your page's font and text colour. Set colours and corners with CSS variables on the element:

<!-- snippet: examples/snippets/theme.css -->
```css
[data-linkbot] { --linkbot-accent: #1d4ed8; --linkbot-radius: 4px; }
```

All fifteen variables are in the [embed reference](../reference/embed.md#design).

## 5. If your site sends a Content Security Policy

Add the origin of `embed.js` to `script-src`, and the Space API's origin to `connect-src`, along with the origin of `embed.js` if it differs. No `'unsafe-inline'` is needed. The [HTML recipe](../recipes/html.md) has a complete page with a strict policy, and CI runs it.

## Next

- Your site: recipes for [plain HTML](../recipes/html.md), [Astro](../recipes/astro.md), [Next.js](../recipes/nextjs.md) and [WordPress](../recipes/wordpress.md).
- Your server: [webhooks](webhooks.md), and the [Space API reference](../reference/space-api.md).

## Try it today (sample data)

From a clone of this repository:

```bash
pnpm install && pnpm --filter @linkbot-hq/embed build
```

Then open `examples/html/index.html`. It loads `embed.sample.js`: synthetic data, a visible "Sample data" label, and nothing leaves the page. The sample build runs the real v0 client against a fake Space API inside the page.
