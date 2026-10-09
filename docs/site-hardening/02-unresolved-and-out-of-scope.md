# Unresolved items and suggested fixes

Nothing here was changed: each item needs an owner outside this task's
authorised paths, an asset that does not exist, or a decision that is the
project's to make rather than an engineer's.

## 1. `linkbot.org` does not serve this site (release blocker)

**Observed 2026-10-09 from this machine** — reproducible with:

```bash
curl -sSI https://linkbot.org/            # HTTP/2 302 → http://survey-smiles.com
curl -sS  https://linkbot.org/robots.txt  # User-Agent: * / Disallow: /
curl -so/dev/null -w '%{http_code}' https://linkbot.org/og.svg   # 404
whois linkbot.org                         # registrar Dynadot, expires 2027-06-23
```

The apex and `www` host redirect to a monetisation domain, the live
`robots.txt` disallows the whole site, and the OG card 404s. [Fact] The work in
this branch cannot be validated against the real host and cannot take effect
until DNS/domain routing points `linkbot.org` at the Vercel deployment.
[Fact] Absolute canonical URLs were left untouched: all four parallel worktrees
agree on `https://linkbot.org`, so this is a routing problem, not a
string problem. [Hypothesis] A parked/expired-aftermarket configuration with a
stale `A` record is the most likely cause; only the registrar/account holder can
confirm.

**Suggested fix (owner: domain/DNS):** point `linkbot.org` (and `www`) at the
deployment, then verify: `curl -sSI https://linkbot.org/` returns 200 with no
cross-host redirect, `https://linkbot.org/robots.txt` serves the file from
`public/`, and `https://linkbot.org/og.svg` returns 200. Re-check after any
change; nothing in this branch can be confirmed live until then.

## 2. `npm ci` cannot run (release blocker)

`package-lock.json` is a 20-byte placeholder:

```
$ cat package-lock.json
__PLACEHOLDER_LOCK__
$ npm ci
npm error code EUSAGE
npm error The `npm ci` command can only install with an existing package-lock.json ...
```

Not edited here: `package-lock.json` is a dependency file outside this task's
authorised paths, and this task explicitly forbids touching them. Verified
workaround used for this branch: `npm install --no-package-lock` (549 packages,
lockfile unchanged, `git status` clean).

**Suggested fix (owner: repo/dependencies):** run `npm install` once on a
machine with registry access, commit the generated `package-lock.json`
(`lockfileVersion: 3`), and add a CI step running `npm ci && npm run build &&
node --test tests/site-hardening/*.test.mjs`. Until then no build is
reproducible from the repository alone — and because every dependency is
declared with `^`, successive installs resolve different versions.

## 3. Social card needs a raster asset (D4)

`og:image` is an SVG, so Facebook/X/LinkedIn/WhatsApp/Slack render no image at
all. `src/components/SEO.astro` now declares `og:image:type` and takes the image
path, alt text and (optionally) dimensions as props.

**Suggested fix (owner: `public/` + brand):** render `public/og.svg` to a
1200×630 PNG (for example `npx sharp-cli -i public/og.svg -o public/og.png
resize 1200 630`), commit it, then pass `image="/og.png"` from the caller (or
change the default). The test in `seo-head.test.mjs` is written as a `todo`
against `/og.svg` and will pass as soon as a raster card is in place. Keep
`og:image:width`/`height` truthful — the suite fails if the declared dimensions
drift from the asset.

## 4. No compliant brand logo asset (D8)

`Organization.logo` now points at `/favicon.svg` (22×22), which is the brand
mark and is the only mark in the repository. [Provider claim] Google asks for a
square logo of at least 112×112 for logo eligibility.

**Suggested fix (owner: `public/` + brand):** add `public/logo.svg` (or a
512×512 PNG) with transparent padding, then update the `logoUrl` constant in
`SEO.astro`. Do not point `logo` at the 1200×630 social card.

## 5. Accessibility findings that live in out-of-scope files

| Finding | File | Suggested fix |
| --- | --- | --- |
| `aria-hidden="false"` is a redundant no-op that implies intent the markup does not express (D14) | `src/components/three/ThreeExperience.astro:15` | delete the attribute; the container already sits inside the `aria-hidden="true"` island wrapper |
| The four-act narrative is `opacity: 0` until JS runs, and the `<noscript>` block says something different, so the narrative is invisible without JS and to non-executing crawlers (D15) | `src/styles/global.css:33-38`, `ThreeExperience.astro:17-34` | render the list visible by default and let JS *hide* it before animating, or add the narrative copy to the `<noscript>` block |
| `text-bone-200/50` measures 3.51:1 against the page background but is used on 12px uppercase labels (D17) | `src/pages/index.astro` (`text-xs`, `font-mono` labels), `ThreeExperience.astro:19,23,27,31,40` | raise those labels to `text-bone-200/70` (6.0:1) or `/60` (4.6:1) |
| Placeholder text at `placeholder:text-bone-200/30` measures 1.97:1 (D18) | `src/pages/index.astro:142,146,150` | use `/60`; placeholders duplicate the visible labels, so this is polish rather than a barrier |
| Access form posts to `mailto:` with `enctype="text/plain"` (D16) | `src/pages/index.astro:139` | replace with a real endpoint (form action or `fetch`), or drop the form and keep the address as a link |

Suggested-but-not-verified: a screen-reader pass over the pinned scroll section
(`section[data-pinned-scene]`) — the reveal transitions change text opacity on a
scroll timeline, and the automated tests here cannot judge whether that reads
well with assistive technology. No such test was run, so no claim is made.

## 6. Performance findings (measured, not fixed)

- Measured: `ThreeIsland.*.js` is 822,362 B raw / ~221 kB gzip in a **single**
  chunk, and Vite warns at build time that chunks exceed 500 kB. `client:visible`
  defers *when* it loads, not how much.
- Measured on this branch: local `dist/` LCP 40 ms and CLS 0 with 0 console
  errors (see `03-measurements.md` §5). Those numbers describe localhost with no
  network or CPU throttling and must not be quoted as field performance.

**Suggested fix (owner: `astro.config.mjs` / `src/components/three/**`):** split
the island's dependencies with `build.rollupOptions.output.manualChunks`
(`three`, `@react-three/*`, `gsap`), and consider loading the scene through a
dynamic `import()` on first intersection so the poster/grid is painted first.
Re-measure against a real network profile, not localhost.

## 7. Claims and content that only the project can decide

- `foundingDate: '2024'` (D20) — kept, unsourced. Confirm or remove; it is one
  literal duplicated across all four parallel worktrees.
- No `sameAs` profile links (D21) — supply verified social/company URLs if they
  exist; none were invented.
- No `FAQPage` markup (D22) — the FAQ content lives in `src/pages/index.astro`
  (out of scope). If wanted, the FAQ data should move to a shared module that
  both the page and `SEO.astro` read, so the two copies cannot drift.
- `meta description` measures 174 characters; search engines truncate around
  155-160. It comes from the `BaseLayout.astro` default (out of scope). Either
  shorten it there or pass a shorter `description` from the page.
