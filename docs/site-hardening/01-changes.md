# Changes on this branch

Bounded diff: three authorised files, plus this documentation and the test
suite. No other file in the repository was touched.

```
 src/components/SEO.astro   | rewritten (metadata, robots, OG/Twitter, JSON-LD @graph)
 public/robots.txt          | regrouped (rules now bind to the crawlers they name)
 public/llms.txt            | + Status, + Contact, + one "is not" line
 docs/site-hardening/**     | new: inventory, changes, unresolved items, measurements
 tests/site-hardening/**    | new: 44 regression tests (node --test, zero dependencies)
```

## `src/components/SEO.astro`

1. **Single origin.** `SITE_ORIGIN` is declared once and `Astro.site` is
   resolved once; canonical, `og:url`, `logo`, `image` and every JSON-LD `url`
  /`@id` are derived from it, so they cannot disagree.
2. **Canonical normalisation.** `normalisePath()` accepts a path or an absolute
   URL, strips query/fragment, forces a leading slash and drops the trailing
   slash on non-root routes (matching `vercel.json` `trailingSlash: false`).
   Root stays `https://linkbot.org/`.
3. **Robots directive.** New `<meta name="robots">`, default
   `index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1`,
   overridable per page via a `robots` prop.
4. **Open Graph / Twitter completeness.** Added `og:image:type` (derived from
   the asset extension), `og:image:width`, `og:image:height` (defaults to the
   real 1200×630 of `og.svg`, and only when that default card is used),
   `og:image:alt` and `twitter:image:alt`. The image path, alt text, og type and
   robots value are props with the previous behaviour as defaults, so callers
   are unchanged.
5. **Structured data.** Two unlinked blocks became one `@graph`:
   - `Organization` — `@id`, evidenced description, `email`, `contactPoint`,
     `legalName`, address, `knowsAbout` re-worded to the site's own vocabulary,
     `logo` pointing at the actual brand mark plus `image` for the social card.
   - `WebSite` — `@id`, `inLanguage`, `publisher` → Organization.
   - `WebPage` — new: canonical `url`, `name`, `description`, `inLanguage`,
     `isPartOf`, `about`, `publisher`, `primaryImageOfPage`.

   No capability claim was added; `foundingDate: '2024'` was left exactly as it
   was (see D20 in the inventory) rather than silently deleted or duplicated.

Deliberately **not** done: `og:locale` (the site is `lang="en"` but no
territory is published, and OGP's default is `en_US` — inventing `en_GB` or
`en_US` would be a guess), `twitter:site` (no handle exists in the repository),
and `sameAs` (no verified profile).

## `public/robots.txt`

- Reserved-path rules moved into the groups that must enforce them, and the
  redundant `Googlebot`/`Bingbot` groups (which *exempted* those crawlers from
  the wildcard policy) were removed so both now inherit `*`.
- `/access` became `/access$` to stop prefix-matching sibling routes.
- Answer-engine groups (GPTBot, ClaudeBot, PerplexityBot, CCBot) keep their
  explicit `Allow: /` and now carry the reserved-path rules themselves, because
  a named group never inherits from `*`.
- Policy unchanged: same crawlers allowed, same crawlers named, same sitemap.
  No new bot tokens were introduced and nothing was newly blocked except the
  reserved paths that the file always intended to block.

## `public/llms.txt`

- Added `## Status` (private beta, invitation-led, cohorts of roughly 20, API in
  private testing) — every clause copied from the site's own FAQ/position copy.
- Added `## Contact` (`hello@linkbot.org`, `https://linkbot.org/#access`).
- Added one "what this site is not" line: no API endpoints that bypass the
  consent layer.
- Kept: title, summary blockquote, page list, canonical URL. No new pages were
  invented — `llms.txt` still lists only routes that exist on this branch.

## `tests/site-hardening/**`

44 tests, no new dependencies (`node --test`, Node 22+; run here on Node 26.5.0):

| File | Covers |
| --- | --- |
| `helpers.mjs` | RFC 9309 robots parser, meta/JSON-LD readers, SVG dimension reader, host allowlist |
| `robots.test.mjs` | group binding, named-group inheritance trap, prefix-rule anchoring, no whole-site disallow, sitemap host, source == built copy |
| `llms-txt.test.mjs` | required llms.txt shape, canonical-host-only URLs, status/contact present, no unpublished capability or pricing claim, anchors and mailto cross-checked against the build |
| `canonical-host.test.mjs` | config/component/robots/llms host agreement, and no unexpected external host anywhere in `src/` or `public/` (runs without a build) |
| `seo-head.test.mjs` | one canonical, absolute and exact, `og:url` == canonical, title/description parity across tags, robots directives, image existence + declared-vs-real dimensions + MIME, alt text |
| `structured-data.test.mjs` | parses, `@context`, host correctness, `@id` reference integrity, identity fields, logo/image assets exist, page node matches canonical, no unsupported rich-result types, no superlative claims |
| `accessibility.test.mjs` | lang, zoomable viewport, one `h1` and no level skips, skip link first and resolving, unique ids, aria/fragment references resolve, labelled sections, labels wrap controls, alt text and link names |

Two `todo` tests encode the gaps this task cannot close in scope (D4 raster
card, D14 `aria-hidden="false"`) — they fail loudly for whoever owns those paths
instead of being deleted.
