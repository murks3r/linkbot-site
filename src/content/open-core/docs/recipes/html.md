# Recipe: a plain HTML page

> **Ran against a real space on 2026-10-23**: against staging's Space API, with the released `embed.js` served from a local stand-in. Since then a pilot's synthetic staging space serves the widget release `embed-v0.1.1-m1` at `/embed/v0/embed.js`, with its language files and CORS (since 2026-10-23). The code below is `examples/html/recipe.html` and `recipe.css`. CI serves that page from a site of its own and runs it in Chromium, Firefox and WebKit against the sample build. It checks that the widget starts under the page's strict CSP, shows the notice, takes the theme and passes axe.

For a site you write by hand, or any CMS that lets you edit a page's HTML.

## The script

Load it once per page, in the head or anywhere before the element. With `async`, your page renders without waiting for it:

<!-- snippet: examples/html/recipe.html#script -->
```html
<script src="EMBED_URL" async></script>
```

## The element

Put the element where the form should appear. Your notice goes inside it:

<!-- snippet: examples/html/recipe.html#element -->
```html
<div data-linkbot="pk_…" data-mode="describe" data-side="seeking">
  <p slot="notice">Your two lines, from your own privacy texts.</p>
</div>
```

The widget asks the Space API on the origin `embed.js` came from, which is right when your space's instance serves `embed.js`, as decided. If you host `embed.js` yourself, add `data-api="https://{space_host}/api/space/v0"`.

For a second place on the same page, such as a board of open requests, add another element with `data-mode="board"`. You still need only one script.

## Content Security Policy

If your site sets a CSP, in a header or a meta tag, allow:

- the origin of `embed.js` in `script-src`;
- the Space API's origin in `connect-src`, and the origin of `embed.js` too: the widget fetches its other languages from next to itself.

No `'unsafe-inline'` and no `'unsafe-eval'` are needed. The recipe sets the policy in a meta tag:

<!-- snippet: examples/html/recipe.html#csp -->
```html
<meta
  http-equiv="Content-Security-Policy"
  content="default-src 'self'; script-src 'self' EMBED_ORIGIN; connect-src 'self' API_ORIGIN EMBED_ORIGIN; style-src 'self'"
/>
```

If you send a CSP header as well, the browser applies both, so the meta tag can only narrow it. When your policy uses nonces, put the nonce on the script tag. The widget passes it on to the one `<style>` element it adds in browsers without constructable stylesheets.

## Look, and room before it loads

The widget arrives after your page has rendered, and then grows to its full height. Reserve the room with `min-height`, so the content below it doesn't jump. Theme it in the same rule:

<!-- snippet: examples/html/recipe.css#theme -->
```css
[data-linkbot] {
  --linkbot-accent: #1d4ed8;
  --linkbot-radius: 4px;
  display: block;
  min-height: 36rem; /* room for the form before it loads, so the page below doesn't jump */
}
```

The variables are listed in the [embed reference](../reference/embed.md#design).

## Hosting `embed.js` yourself

Copy `embed.js` together with its `locales/` folder, and keep them side by side. The widget loads a language other than English from `locales/` next to the script, and refuses a file whose sha256 doesn't match the one built into `embed.js`. A tool that bundles, renames or moves scripts would break that, so exclude `embed.js` from it.
