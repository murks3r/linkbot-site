# Reference: the React wrapper (`@linkbot-hq/react`)

`<LinkbotSpace>` renders the same element as the HTML snippet, and loads `embed.js` once per URL. The embed then starts in its own shadow root, which React never touches. It is a client component (`'use client'`), so it works in the Next.js App Router. It adds no global CSS. It is not published to npm yet. The [Next.js recipe](../recipes/nextjs.md) shows it in code CI runs.

| Prop | | Becomes |
| --- | --- | --- |
| `publishableKey` | required: your publishable key, `pk_…`. A secret key (`sk_…`) throws an error | `data-linkbot` |
| `src` | required: the URL of `embed.js`, `https://{space_host}/embed/v0/embed.js` on your space's instance. The wrapper doesn't derive it | the script it loads |
| `mode` | `describe`, `board`, `watch` or `mine` | `data-mode` |
| `side` | `seeking` or `offer` | `data-side` |
| `locale` | `en`, `de`, `es`, `it` or `fr` | `data-locale` |
| `input` | `form`, `text` or `both`; it can only narrow what the space allows | `data-input` |
| `api` | your space's API base, `https://{space_host}/api/space/v0` | `data-api` |
| `notice` | your data notice, shown above the confirm button. Your page styles it | a child with `slot="notice"` |
| `className`, `style` | for the element. Set the theme variables in `style` | |

What each attribute does, and the theme variables, are in the [embed reference](embed.md).

The embed reads its attributes once. When `publishableKey`, `mode`, `side`, `locale`, `input` or `api` changes, the wrapper gives React a new element, which the embed starts afresh.

`loadEmbed(src)` is exported too. It adds the script once per URL and returns a promise, for a page that wants `embed.js` loaded before it renders an element. The wrapper loads the script from an effect, so it never runs during server rendering. Under a nonce-based CSP with `'strict-dynamic'`, a script your trusted code adds is allowed. Without `'strict-dynamic'`, list the origin of `embed.js` in `script-src`.
