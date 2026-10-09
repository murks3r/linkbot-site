# Defect inventory

Every entry is grounded in a command output or a file in this repository.
Conclusions carry the usual tags: **[Fact]** verified here, **[Provider
claim]** documented by a vendor/specification, **[Hypothesis]** unverified.

Severity is impact × reachability on a search/social/a11y surface:
**High** = wrong behaviour on every crawl, share or assistive-technology pass;
**Medium** = wrong or missing data in some consumers; **Low** = cosmetic or
redundant markup.

## Confirmed defects

### D1 — Reserved-path rules in `robots.txt` applied to no crawler at all · High · **Fixed**

**[Fact]** `public/robots.txt` (before) ended with:

```
User-agent: CCBot
Allow: /

Disallow: /api/
Disallow: /access
```

A blank line terminates a group ([Provider claim] RFC 9309 §2.2.1), so the two
`Disallow` lines formed a second, *agent-less* block. Parsed:

```
agents=[*]                      rules=[{allow /}]
agents=[googlebot]              rules=[{allow /}]
agents=[bingbot]                rules=[{allow /}]
agents=[gptbot]                 rules=[{allow /}]
agents=[claudebot]              rules=[{allow /}]
agents=[perplexitybot]          rules=[{allow /}]
agents=[ccbot]                  rules=[{allow /}]
agents=[]                       rules=[{disallow /api/}, {disallow /access}]   ← binds to nothing
```

The intent of the file — keep `/api/` and `/access` out of the index — was
never expressed to any crawler. Reproduce with the snippet in
`03-measurements.md` §3.

### D2 — Named crawler groups suppressed the wildcard rules · High · **Fixed**

**[Fact]** `Googlebot` and `Bingbot` had their own groups containing only
`Allow: /`. A crawler uses its matching group **or** `*`, never both
([Provider claim] RFC 9309 §2.2.1), so even after D1 is fixed, those groups
would have exempted both major crawlers from every wildcard `Disallow`. This is
a general trap: any named group added later silently opts out of the wildcard
policy.

### D3 — `Disallow: /access` was an unanchored prefix rule · Medium · **Fixed**

**[Fact]** Prefix matching means `/access` also blocks `/accessibility`,
`/access-request`, and any future route sharing the prefix. On a site where an
accessibility statement is a plausible next route, that is a latent indexing
bug. Now `Disallow: /access$` — exact match on Google/Bing/Yandex, and a
no-op literal on parsers that ignore `$`, i.e. it fails safe.

### D4 — Social card is an SVG, so link previews have no image · High · **Documented (needs an asset)**

**[Fact]** `og:image` and `twitter:image` both pointed at
`https://linkbot.org/og.svg`, a 1200×630 SVG. **[Provider claim / Fact]**
Facebook, X/Twitter, LinkedIn, WhatsApp, Slack and Discord do not render SVG
for link previews; they require JPEG/PNG (WebP partially). Sources:
[previewog.com/og-image-guide](https://previewog.com/og-image-guide/),
[ctrl.blog on OGP image formats](https://www.ctrl.blog/entry/webp-ogp.html),
[linkpreview.eu](https://linkpreview.eu/en/blog/og-image-not-showing-facebook).

Result: every share of the site is text-only. The fix is a raster asset in
`public/`, which is outside this task's authorised paths — tracked in
`02-unresolved-and-out-of-scope.md`. The component now takes the image path as
a prop and declares `og:image:type`, so the swap is a one-line change.

### D5 — Open Graph / Twitter metadata incomplete and unverifiable · Medium · **Fixed**

**[Fact]** The head had no `og:image:type`, `og:image:width`,
`og:image:height`, `og:image:alt` or `twitter:image:alt`. Platforms then fetch
the image to discover its size and have no alt text for the card, which is both
a preview-quality and an accessibility problem. Declared dimensions must match
the asset; that is now asserted by a test that re-reads `public/og.svg`.

### D6 — No robots meta directive on the page · Medium · **Fixed**

**[Fact]** The page emitted no `<meta name="robots">`, leaving snippet and
preview limits at crawler defaults and giving no page-level signal for large
image previews. Now `index, follow, max-image-preview:large, max-snippet:-1,
max-video-preview:-1`. Deliberately **not** `noindex`: the marketing page should
rank, and robots.txt says `Allow: /`.

### D7 — Canonical URL construction was unguarded and duplicated · Medium · **Fixed**

**[Fact]** `new URL(canonicalPath, Astro.site ?? 'https://linkbot.org')`
appeared three times, and the fallback origin was written inline in two more
places (`/og.svg`, the JSON-LD `url`s). Consequences: a page could pass a
canonical containing a query string or fragment, a path without a leading
slash resolved to an unintended URL, and any change to one of the four
hardcoded origins would silently desynchronise canonical, `og:url` and the
structured data. All absolute URLs are now derived from a single resolved
origin, and paths are normalised (query/fragment stripped, leading slash
forced, trailing slash dropped to match `vercel.json` `trailingSlash: false`).

### D8 — `Organization.logo` declared the promotional card as the logo · Medium · **Partially fixed**

**[Fact]** `logo: 'https://linkbot.org/og.svg'` is a 1200×630 marketing card
containing the H1; it is not a logo, and it was the only image on the
Organization node. Now `logo` is the brand mark that actually exists
(`/favicon.svg`, the 22×22 diamond used in the header) and the card is declared
separately as `image` with its true dimensions. **[Provider claim]** Google's
logo guidance asks for a square logo of at least 112×112, so a proper logo
asset is still required — tracked in `02-unresolved-and-out-of-scope.md`.

### D9 — Organisation description and `knowsAbout` used unpublished wording · Medium · **Fixed**

**[Fact]** Structured data asserted *"Private eligibility infrastructure for the
labour market. We replace public exposure with permissioned matching."* and
`knowsAbout: ['Privacy engineering', 'Identity and access management', 'Labour
market matching', 'Eligibility protocols']`. The words "infrastructure",
"Identity and access management" and "Eligibility protocols" appear nowhere on
the site or in `llms.txt`. The description is now assembled from wording this
repository already publishes (page copy + `llms.txt`), and `knowsAbout` uses the
site's own vocabulary (identity verification, permissioned matching, consent,
labour market). No capability was added; unsupported phrasing was removed.

### D10 — JSON-LD had no graph, no page node and no reference integrity · Medium · **Fixed**

**[Fact]** Two unlinked top-level `Organization` and `WebSite` blocks: no
`@id`s, no `publisher` link, no page-level node carrying the per-page title,
description, canonical URL or social image. Now a single `@graph` with stable
`@id`s (`#organization`, `#website`, `<canonical>#webpage`) and cross-references
that a test resolves. Tests also assert that no rich-result type is asserted
that this site cannot support (`JobPosting`, `Review`, `AggregateRating`,
`Offer`, `Product`, `Event` — none present).

### D11 — `llms.txt` omitted contact, status and the API limit · Medium · **Fixed**

**[Fact]** `llms.txt` listed core pages and canonical URL but no contact
address, no statement of beta status or cohort onboarding, and no mention that
the API is in private testing. All three are published on the page (FAQ +
`#access` form). Added a `## Status` and `## Contact` section and one more
"what this site is not" item, all traceable to existing page copy.

### D12 — Live canonical host does not serve this site · **Blocker, unresolved**

**[Fact]** From this machine, 2026-10-09:

```
$ curl -sSI https://linkbot.org/      → HTTP/2 302, location: http://survey-smiles.com
$ curl -sS  https://linkbot.org/robots.txt → User-Agent: * / Disallow: /
$ curl -so/dev/null -w '%{http_code}' https://linkbot.org/og.svg → 404
$ dscacheutil -q host -a name linkbot.org → 212.92.104.122
```

[Fact] The apex and `www` host redirect to a monetisation domain and the live
`robots.txt` disallows the entire site; `og.svg` returns 404. `whois`: registrar
Dynadot, created 2022-06-23, expiry 2027-06-23, status `clientTransferProhibited`.

Consequence: none of the metadata, robots or structured-data work can take
effect in production until DNS/domain routing points `linkbot.org` at this
deployment. The absolute canonical URLs were therefore **not** changed — every
worktree in this parallel batch (brand-os, growth, agency-conversion) also uses
`https://linkbot.org`, so the host string is consistent; the routing is not.

### D13 — `npm ci` is blocked by a placeholder lockfile · **Blocker, unresolved**

**[Fact]**

```
$ npm ci
npm error code EUSAGE
npm error The `npm ci` command can only install with an existing package-lock.json or
npm error npm-shrinkwrap.json with lockfileVersion >= 1.
```

`package-lock.json` is a 20-byte placeholder containing `__PLACEHOLDER_LOCK__`.
`npm ci` cannot run and CI has no reproducible dependency graph. Regenerating
the lockfile means writing `package-lock.json`, which is not an authorised path
for this task, so it was left untouched. `npm install --no-package-lock` was used
instead (549 packages installed, lockfile still 20 bytes, `git status` clean).

## Documented, out of scope (needs another owner)

| ID | Defect | Evidence | Severity |
| --- | --- | --- | --- |
| D14 | `aria-hidden="false"` on the pinned narrative container — a no-op attribute that suggests an intent the markup does not express | `src/components/three/ThreeExperience.astro:15` | Low |
| D15 | Reveal copy is `opacity: 0` until JS runs; the `<noscript>` fallback covers a *different* message, so the four-act narrative is invisible without JS and to crawlers that do not execute it | `src/styles/global.css:33-38`, `ThreeExperience.astro:17-34` | Medium |
| D16 | Access form posts to `action="mailto:…"`, which is unreliable (depends on a mail client, no server-side confirmation) and exposes the address to scrapers; `enctype="text/plain"` makes the payload unvalidatable | `src/pages/index.astro:139` | Medium |
| D17 | Small text at `text-bone-200/50` measures **3.51:1** against the page background — below WCAG 2.1 AA 4.5:1 for normal-size text (it is used on 12px uppercase labels) | computed, `03-measurements.md` §4 | Medium |
| D18 | Placeholder text at `placeholder:text-bone-200/30` measures **1.97:1** against the input background | computed, `03-measurements.md` §4 | Low (labels exist) |
| D19 | 3D island ships 822 kB raw / 221 kB gzip in a single chunk (Vite warns >500 kB); `client:visible` limits when it loads, not how much | build log, `03-measurements.md` §2 | Medium |
| D20 | `foundingDate: '2024'` is asserted in structured data but appears nowhere else in the repository; the same literal exists in all four parallel worktrees, so it is one unsourced value copied four times | `git grep foundingDate` across `linkbot-parallel-20261009` | Low |
| D21 | No `sameAs` (social/company profiles) on the Organization node — nothing in the repository identifies an official profile, and inventing one would be a fabricated claim | n/a | Low |
| D22 | No `FAQPage` structured data even though the page carries a five-question FAQ; the content lives in `src/pages/index.astro`, which is out of scope for this task (duplicating it in `SEO.astro` would create a drift-prone second copy) | `src/pages/index.astro:164-180` | Low |
