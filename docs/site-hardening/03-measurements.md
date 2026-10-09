# Measurements

All numbers below were produced by the commands shown, on this branch, on
2026-10-09. Nothing here is estimated.

## 1. Build gates

```bash
$ npm install --no-package-lock --no-audit --no-fund
added 549 packages in 3m
npm warn deprecated three-mesh-bvh@0.7.8: Deprecated due to three.js version incompatibility.
$ wc -c package-lock.json   → 20          # unchanged: the placeholder was not overwritten
$ git status --porcelain    → (empty)

$ npm run build             # astro check && astro build
[build] 1 page(s) built in 2.31s
[build] Complete!
[WARN] (!) Some chunks are larger than 500 kB after minification.   # pre-existing
```

`astro check` (TypeScript strict) passes: no diagnostics.

`npm ci` cannot run — see `02-unresolved-and-out-of-scope.md` §2.

## 2. Payload before / after

| Artefact | Before (`main` @ `59b63ea`) | After | Delta |
| --- | --- | --- | --- |
| `dist/index.html` | 23,555 B | 25,202 B | +1,647 B (+7.0 %) |
| Head section bytes | 2,707 B | 4,346 B | +1,639 B |
| `<meta>` tag count | 15 | 21 | +6 |
| JSON-LD `<script>` blocks | 2 (unlinked) | 1 (`@graph`, 3 nodes) | −1 block, +3 nodes |
| Total `dist/` bytes | 1,144,101 B | 1,146,792 B | +2,691 B (docs only in source; runtime assets unchanged) |
| All JS + CSS bytes | 1,117,070 B | 1,117,070 B | **0** |

Reproduce the payload figures:

```bash
wc -c dist/index.html
find dist -type f -exec wc -c {} + | sort -k2
find dist -type f \( -name '*.js' -o -name '*.css' \) -exec wc -c {} + | tail -1
```

Largest assets (unchanged by this work): `ThreeIsland.*.js` 822,362 B /
221 kB gzip, `client.*.js` 136,510 B / 44 kB gzip, `index.*.css` 15,893 B.

## 3. `robots.txt` group binding, before and after

```bash
git show HEAD:public/robots.txt > /tmp/robots.before.txt
node --input-type=module -e "
import { readFileSync } from 'node:fs';
const { parseRobots } = await import('./tests/site-hardening/helpers.mjs');
for (const p of ['/tmp/robots.before.txt','public/robots.txt']) {
  console.log(p);
  for (const g of parseRobots(readFileSync(p,'utf8'))) console.log('  agents=[' + g.agents + '] rules=' + JSON.stringify(g.rules));
}"
```

Before:

```
agents=[*]                 rules=[{allow /}]
agents=[googlebot]         rules=[{allow /}]
agents=[bingbot]           rules=[{allow /}]
agents=[gptbot]            rules=[{allow /}]
agents=[claudebot]         rules=[{allow /}]
agents=[perplexitybot]     rules=[{allow /}]
agents=[ccbot]             rules=[{allow /}]
agents=[]                  rules=[{disallow /api/},{disallow /access}]   ← binds to no crawler
wildcard blocks /api/ : false
googlebot blocks /api/: false
```

After:

```
agents=[*]                                   rules=[{allow /},{disallow /api/},{disallow /access$}]
agents=[gptbot,claudebot,perplexitybot,ccbot] rules=[{allow /},{disallow /api/},{disallow /access$}]
wildcard blocks /api/ : true
googlebot blocks /api/: true (inherits the wildcard group)
```

The same parsers are what `tests/site-hardening/robots.test.mjs` asserts
against, so the regression is locked: reintroducing an agent-less group or a
self-exempting named group fails the suite.

## 4. Contrast measurements (WCAG 2.1 relative luminance)

Token values from `tailwind.config.mjs`; page background `#05060a` (body top of
the gradient in `src/styles/global.css`) and `#07090f` (gradient mid); input
background is `bg-ink-900/60` composited over the page. Alpha compositing is
done before measuring. Ratio = (L_light + 0.05) / (L_dark + 0.05).

| Class | Background | Ratio | WCAG AA (normal 4.5 / large 3.0) |
| --- | --- | --- | --- |
| `text-bone-50` | body top | 18.39 | pass |
| `text-signal-400` | body top | 12.60 | pass |
| `text-bone-200` | body top | 11.70 | pass |
| `text-bone-200/85` | body top | 8.51 | pass |
| `text-bone-200/80` | body top | 7.63 | pass |
| `text-bone-200/75` | body top | 6.74 | pass |
| `text-bone-200/70` | body top | 6.01 | pass |
| `text-bone-200/60` | body top | 4.63 | pass |
| **`text-bone-200/50`** | body top | **3.51** | **fails normal text**, passes large only |
| `text-ink-950` on `bg-signal-500` (button hover) | — | 9.12 | pass |
| **`placeholder:text-bone-200/30`** | input bg `#080a0f` | **1.97** | **fails** (labels exist, so low impact) |

`text-bone-200/50` is used on 12 px uppercase `font-mono` labels in
`src/pages/index.astro` and on the pinned-section labels in
`src/components/three/ThreeExperience.astro`. Both files are outside this
task's authorised paths, so the finding is documented (D17) rather than fixed;
`/70` would give 6.01:1.

## 5. Real-browser verification of the built output

Served the build with `python3 -m http.server 4399 --bind 127.0.0.1` from
`dist/`, then loaded `http://127.0.0.1:4399/` in a real browser and read the
live DOM, performance entries and console.

Observed:

| Check | Result |
| --- | --- |
| `link[rel=canonical]` resolved by the browser | `https://linkbot.org/` (absolute, unchanged by the local host) |
| `og:url` | `https://linkbot.org/` — equal to canonical |
| `og:image` / `twitter:image` | `https://linkbot.org/og.svg`, `og:image:type=image/svg+xml`, `width=1200`, `height=630`, alt text present on both tags |
| `<meta name="robots">` | `index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1` |
| JSON-LD | 1 block, parses in-browser, `@graph` with 3 nodes (`Organization`, `WebSite`, `WebPage`) |
| `<html lang>` | `en` |
| `h1` count | 1 |
| Console errors / unhandled rejections | 0 |
| `canvas` after scrolling into the pinned section | 1 (the `client:visible` island hydrates) |
| `fetch('/robots.txt')` / `fetch('/og.svg')` | 200 / 200 — groups as shown in §3 |
| Navigation timing (local) | DOMContentLoaded 11-352 ms, load 353 ms |
| Largest Contentful Paint (local) | 40 ms |
| Cumulative Layout Shift (local) | 0 |

Caveats, stated plainly: this is localhost with no network latency and no CPU
throttling, served by `python3 -m http.server`, which does not apply the Vercel
headers from `vercel.json` (so no `Cache-Control`/`Content-Encoding` behaviour
was exercised). These figures are a smoke check that the metadata and the island
work in a real engine — **not** field performance, and no performance
improvement is claimed from this branch. No Lighthouse/CrUX run was performed.

One artefact worth recording so nobody chases it: `document.title` in the
automation browser was prefixed with an emoji (`🐴 Linkbot — …`) while the bytes
served by the static server and `dist/index.html` contain
`<title>Linkbot — Private eligibility, not public exposure</title>`. The emoji
is injected by the automation environment, not by the site.

## 6. Test suite

```bash
$ node --test tests/site-hardening/*.test.mjs
ℹ tests 44
ℹ pass 42
ℹ fail 0
ℹ skipped 0
ℹ todo 2
```

The two `todo` tests are the knowingly unresolved gaps (raster social card D4,
redundant `aria-hidden="false"` D14). They are reported, never counted as
passes. `node --test tests/site-hardening/` (directory form) is not used —
Node 26 treats a bare directory argument as a module path; pass the glob.

Skipped counts are zero **because `dist/` was built first**. If the suite is run
without a build, the page-level tests skip with the message
`dist/index.html missing — run \`npm run build\` first` and the source-level
coherence tests still run. Do not treat a no-build run as a pass.
