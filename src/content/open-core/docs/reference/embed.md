# Reference: the embed (`embed.js`)

The widget is one script and one element per place it appears. This page lists everything a page can set. `packages/embed/test/reference.test.ts` compares the tables below with the code, so a table that drifts from what the embed reads fails CI.

## The element

<!-- snippet: examples/snippets/embed.html -->
```html
<script src="EMBED_URL" async></script>
<div data-linkbot="pk_…" data-mode="describe" data-side="seeking" data-locale="de"></div>
```

| Attribute | Values | Default |
| --- | --- | --- |
| `data-linkbot` | your publishable key (`pk_…`). The widget refuses to start with a secret key (`sk_…`) and tells you to rotate it | required |
| `data-mode` | `describe` (say what you need or offer), `board` (browse and answer listings), `watch` (set up a watch first: the essentials, how often, what about, an email address), `mine` (my requests, watches and possible fits) | `describe` |
| `data-side` | `seeking` (a need) or `offer` | `seeking` |
| `data-locale` | `en`, `de`, `es`, `it`, `fr` | the visitor's browser language, then the space default |
| `data-input` | `form`, `text` or `both`. It can only narrow what the space allows | the space's setting |
| `data-api` | your space's API base, `https://{space_host}/api/space/v0`. Only https is accepted, except http on `localhost` | the origin `embed.js` was loaded from, plus `/api/space/v0` |
| `data-ui` | `current` or `v1`. The second gives the describe mode design v1 (one question per screen) from `embed.v1.js`, which `embed.js` loads from next to itself and checks against the hash it was built with; the other modes keep the current design. For review only until Trust's go | `current` |

A value the widget doesn't know falls back to the default, with a warning in the browser console. You can put several elements on one page; each one is its own widget. Elements added later, as single-page apps do, start on their own.

If you ask for a language the space doesn't offer, the widget falls back and says so on screen, for example: "Polish isn't available yet, so this form is in English."

`data-mode="board"` lists the entries whose owners chose to show them, 20 at a time, as the space's pack coarsens them (for example an amount in bands of 5,000 t, a port as its country, a date by month), and says which values are less exact. The filters are the form's own controls, compared the same way. Answering an entry starts a description on the other side, with the entry shown for reference; if its owner has taken it off meanwhile, the widget says so and sends nothing. On a space without a board the widget says so. A person who listed a request can take it off again under `mine`, or right after confirming.

`data-mode="watch"` is for people who want to be told when something fits: it asks for the criteria the pack requires for a match and nothing more, then how often, what about and an email address, and confirms all of it once. The request it creates then shows what may fit, as after `describe`. On a space without watches the widget says so and offers the describe form instead. Under "Email options" a person may also set at most how many go into one email, and a day before which none is sent (contract 0.2.11; Core serves them with its watch slice E4). Both stay unset unless the person sets them, and then the space's own setting applies.

## Your data notice

A child with `slot="notice"` appears just above the confirm button. Your page's CSS styles it. The widget adds its own fixed lines next to it, such as "Nothing is used until you confirm."

## Design

The widget takes your page's font and text colour. Everything else is set by these variables on the element:

| Variable | What it sets | Default |
| --- | --- | --- |
| `--linkbot-accent` | primary button, selected choices, focus rings | `#0f5c4d`; `#2B4FA3` (cobalt) in design v1 |
| `--linkbot-accent-hover` | primary button on hover | the accent |
| `--linkbot-radius` | corner radius | `8px` |
| `--linkbot-text` | text colour | your page's |
| `--linkbot-muted` | secondary text | the text colour at 74 % |
| `--linkbot-heading` | heading colour | your page's |
| `--linkbot-heading-font` | heading font | your page's |
| `--linkbot-label-font` | font of field labels | your page's |
| `--linkbot-line` | card borders and dividers | the text colour at 28 % |
| `--linkbot-input-border` | field borders | the text colour at 55 % |
| `--linkbot-card` | card background | transparent |
| `--linkbot-surface` | background of fields and lists | transparent (fields), `Canvas` (open lists) |
| `--linkbot-surface-text` | text in open lists | `CanvasText` |
| `--linkbot-error` | error text and borders | `#b3261e` |
| `--linkbot-error-bg` | error background | transparent |

The widget picks black or white text for the accent, whichever contrasts more. If your page is dark, also set `color-scheme: dark` on the element. Your page's other styles don't reach inside the widget (it renders in a shadow root), and the widget's styles don't reach your page.

## Content Security Policy

- `script-src`: the origin of `embed.js`.
- `connect-src`: the Space API's origin, and the origin of `embed.js` if it differs. The widget loads a language other than English from next to itself (`locales/de.json` and so on) and checks it against a sha256 built into `embed.js`.
- Styles need no `'unsafe-inline'`: the widget uses a constructable stylesheet. In browsers without one, it adds a single `<style>` element that carries the nonce of its own script tag, so put your nonce on the script tag if your CSP uses nonces.

If you host `embed.js` yourself, copy its `locales/` folder with it.

## Subresource Integrity

To pin one release, load the versioned path `/embed/v0/{version}/embed.js` with the `integrity` value from that release's notes, and add `crossorigin="anonymous"`: a browser checks the integrity of a script from another origin only with it. The instance sends the CORS header this needs on `embed.js` and its language files, and the language files load from next to the versioned path.

<!-- snippet: examples/snippets/embed-sri.html -->
```html
<script src="https://{space_host}/embed/v0/{version}/embed.js" integrity="sha384-…" crossorigin="anonymous" async></script>
```

## The page's global

`embed.js` defines one global, `window.Linkbot`, and nothing else:

| Member | What it does |
| --- | --- |
| `version` | the embed's version |
| `sample` | `true` in the sample build (synthetic data) |
| `mount(element)` | starts a widget on an element the scan can't see, for example inside your own shadow root; returns whether it started |
| `unmount(element)` | removes that element's widget |

## What the widget keeps, and what it sends

- Its guest session and owner tokens sit in `sessionStorage`, per tab and per space (Connect ADR 0006). It uses no cookies and no `localStorage`.
- Requests go to the Space API only, with `credentials: 'omit'`. There are no analytics.
- The sample build (`embed.sample.js`) sends nothing over the network.
