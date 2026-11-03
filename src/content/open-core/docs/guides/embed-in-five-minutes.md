# Embed in 5 minutes

For the person who runs a site and wants a Linkbot space on one of its pages. Three things: a script tag, your publishable key, and your page's origin on the space's allow list. The [quickstart](quickstart.md) has the details, and the [embed reference](../reference/embed.md) every attribute.

> **True as of 2026-10-25.** Each space's own instance serves the widget at `https://{space_host}/embed/v0/embed.js`. The one instance this page's authors have seen serve it is a pilot's synthetic staging space, with the release `embed-v0.3.0-v1`. The snippet below started the widget there on 2026-10-23.

## 1. Get your publishable key (1 minute)

It starts with `pk_`. The operator console's **Space and snippet** page shows it, with the snippet already filled in. A publishable key only names your space and is meant to sit in a page. A secret key (`sk_…`) never does: the widget refuses to start with one and tells you to rotate it.

## 2. Allow your page's origin (1 minute)

The key works only on the origins on your space's allow list, for example `https://www.example.com`. Scheme, host and port must match exactly: `https://example.com` and `https://www.example.com` are two origins. Each test or preview address is one more.

- Where your instance serves it, the console's **Keys and origins** page sets the list.
- Otherwise whoever provisions your space sets it: send them your origins.

## 3. Paste the snippet (1 minute)

Put it where the form should appear, with your key and your space's host:

<!-- snippet: examples/snippets/embed.html -->
```html
<script src="EMBED_URL" async></script>
<div data-linkbot="pk_…" data-mode="describe" data-side="seeking" data-locale="de"></div>
```

`EMBED_URL` is `https://{space_host}/embed/v0/embed.js`. `data-mode` is `describe`, `board`, `watch` or `mine`; `data-side` is `seeking` or `offer`; leave out `data-locale` to follow the visitor's browser language.

## 4. Check it (2 minutes)

Open the page. The form appears where you put the element, in your page's font.

| You see | What to do |
| --- | --- |
| "This page isn't allowed to show this space." | The page's origin is not on the allow list (step 2) |
| Nothing, and a refused script or request in the browser console | Your site sends a Content Security Policy: add your space's origin to `script-src` and `connect-src` ([quickstart, step 5](quickstart.md#5-if-your-site-sends-a-content-security-policy)) |
| The widget refuses to start and asks you to rotate a key | That was a secret key, and it has been in a page: rotate it, and use the `pk_…` key |

## Before real people use it

- Add your two lines about how you handle requests, in the notice slot ([quickstart, step 3](quickstart.md#3-add-your-data-notice)).
- To pin one release, load its versioned path with Subresource Integrity ([quickstart, step 2](quickstart.md#2-paste-the-snippet)).
