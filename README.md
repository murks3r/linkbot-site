# Linkbot — public site

The crawlable public pages for Linkbot: what it is, how it works, how privacy works, and hiring.
The product itself (search, interpretation, results, saving, watching, permissions, the agency
and company workspaces) runs in the app, `murks3r/linkbot`, served under `/talent`. The site
explains; the app executes. Concept A4 ("two inks on warm paper") — draft, not published.

## Pages

| Route | What it does |
|---|---|
| `/` | a working first search, one scroll-linked story (many openings → your priorities → the ones that fit → your decision), trust, and a contextual start |
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
- **The homepage story** (`src/components/Clarity.astro`) is a sticky stage whose every state is a
  function of scroll position (one number, `--p`), so it reverses, survives jumps and resizes, and
  never hijacks scrolling. Without scripts, with reduced motion or on a short screen it is its
  complete final state at normal height. The words are read by the app's interpreter (the `story`
  reading); the openings and the listing are an illustration and say so.

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
