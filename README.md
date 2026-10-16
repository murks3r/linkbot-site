# Linkbot — public site

The crawlable public pages for Linkbot: what it is, how it works, how privacy works, and hiring.
The product itself (search, interpretation, results, saving, watching, permissions, the agency
and company workspaces) runs in the app, `murks3r/linkbot`, served under `/talent`. The site
explains; the app executes. Concept A6 ("focus") — draft, not published.

## Pages

| Route | What it does |
|---|---|
| `/` | a working first search at the optical centre of a living atmosphere, with three plain promises at its foot; then the story as one pinned scene (your words come into focus, become criteria and a lens, and the openings that fit come into focus with their reasons and a Must); the night, where privacy is two sides of the glass; and a contextual start |
| `/how-it-works` | criteria and levels with recorded readings, how a listing is explained, saving and watching, applying, private matching (in development), what's live today |
| `/privacy` | what happens to what you type, save and share; the five separate decisions; limits; what Linkbot doesn't claim |
| `/hiring` | for recruiting agencies and companies: explanation first, then each path with a working next step |

## How it stays one product with the app

- **Search handoff.** Forms and example links open `/talent#/search?q=<words>`. The words travel in
  the URL fragment (never sent to a server); the app reads them once, removes them from the
  address and runs the search in memory. The site input has no `name`, so without scripts the
  words are not sent anywhere.
- **One palette.** `src/styles/palette.css` is a copy of the app's generated tokens
  (`tools/design/palette.cjs` proves every contrast pair):
  `node scripts/sync-tokens.mjs <app checkout> [--check]`.
- **One interpreter.** The site never interprets anything. `src/data/readings.json` holds
  readings recorded from the app's own interpreter, with the commit that produced them:
  `npx tsx tools/site/readings.ts > <site>/src/data/readings.json` (run in the app).
- **One vocabulary.** Levels, evidence words and reasons come from the app's copy (`src/data/content.ts`).
- **The ground's layers** (Concept A9; `src/components/Air.astro`, tokens in `src/styles/site.css`),
  bottom to top: L0 the paper colour; L1 the atmosphere (home only, `src/scripts/atmosphere.ts`):
  the palette's seven proven pigments, desaturated to `--air-saturation` in linear light around
  each pigment's own luminance, as a slow, domain-warped field of light drawn by WebGL into a small
  canvas (at most 30 frames a second, nothing while the tab is hidden, one still frame under reduced
  motion, still gradients without WebGL or scripts); L2 a wash (`--wash`, `--wash-opacity`) that a
  section thins by carrying `data-air-reveal` (the script raises `--air-reveal` on the atmosphere
  alone); L3 the noise: a paper grain tile (`--noise-tile`, density stages d0–d3 in
  `public/material/`, d2 by default) printed with multiply, one element in the page flow as tall as
  the document, so it scrolls with the content; L4 everything that carries words (main, the footer,
  the header) above it, never printed by it. The tiles are processed derivatives of the founder's
  Resource Boy noise textures (royalty-free, modification and web use allowed, no attribution
  required; the pack files themselves never enter a repository).
- **The scenes** (`src/components/Clarity.astro`, `Glass.astro`) are pinned stages driven by
  `src/scripts/stages.ts`: one number per scene (`--p`) and one eased value per beat (`--b1` …)
  are written on the stage from the scroll position, and CSS derives every illustration, so each
  scene reverses, survives jumps, flings and resizes, and never hijacks scrolling. Each beat's
  statement comes into focus when its beat begins (a short transition, both ways). Without
  scripts, under reduced motion, or on any screen that cannot hold a stage (measured live), a
  scene is its complete final state at normal height. The words are read by the app's
  interpreter (the `story` reading); the openings are illustrations and say so.

## Configuration

| Variable | Default | Meaning |
|---|---|---|
| `SITE_URL` | `https://linkbot.org` | canonical origin (canonical links, Open Graph, sitemap). The launch domain is the owner's decision. |
| `PUBLIC_APP_ORIGIN` | empty (same origin) | where the app runs, if not beside the site |
| `PUBLIC_NOINDEX` | unset | `1` for previews: `noindex` on every page and `Disallow: /` in robots.txt |

## Develop and test

```bash
npm ci
npm run dev
npm run build                 # astro check + static build to ./dist
npm test                      # data integrity: recorded readings, palette copy
LINKBOT_APP_DIR=../linkbot npm run test:browser   # pages, journeys, the app's WCAG audit at 5 widths
node scripts/og.cjs           # re-render public/og.png
```

No cookies, analytics or third-party requests; the typefaces (Archivo for display, Figtree for
text) are self-hosted.

`vercel.json` keeps the draft concept branches out of the production project's Git builds
(`git.deploymentEnabled`); remove those entries before anything merges.
