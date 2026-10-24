# Linkbot — public site

The crawlable public pages for Linkbot, in five languages: what a space is, how matching works,
for platforms, for verticals, and the privacy notice and imprint as marked placeholders until
their texts are released. The product itself runs on a platform's own pages (the widget, the
console, the Space API); the site explains, it never matches.

This repository is built in BUILD MODE on the integration branch `build/vision` (see
`CLAUDE.md`): pull requests target that branch, the fast check in `.github/workflows/check.yml`
(types, build, unit tests) must be green, previews only, `main` only at milestones with the
owner's go. The design is concept A8 (the design canvas `design/concept-a8`).

## Pages

| Route | What it does |
|---|---|
| `/` | what Linkbot is, the path from a need to an introduction, the four ways to say what you need or offer with where each stands, the rules the server enforces, for platforms, for verticals, where it stands |
| `/who-sees-what` | one synthetic offer through the four disclosure stages, what each shows and withholds, the receipt; why a platform can let Linkbot near its users; the rules; deletion (English for every language until translated) |
| `/how-it-works` | a space, a pack, the four ways to describe, confirming, matching, approval and gates, both yes, the introduction, afterwards, who sees what, five languages, what works today |
| `/platforms` | the embed, keys and origins, the console, the SDK and webhooks, the recipes, and the six integration pages |
| `/platforms/embed`, `/platforms/sdk`, `/platforms/console`, `/platforms/wordpress`, `/platforms/nextjs`, `/platforms/astro` | one page per integration, each with only what the Connect lane's docs show today, rendered from the catalogue by `src/components/Integration.astro` |
| `/verticals` | what a pack holds, the first space, more verticals |
| `/privacy`, `/imprint` | placeholders that say the texts are in preparation; nothing legal is invented |

English is at the root; German, Spanish, Italian and French are under `/de`, `/es`, `/it` and
`/fr`, with the same routes. All five languages have their own catalogue; a language added without
one would show the English page with a notice in the reader's language. There is one `404` for
every missing address.

## Words, and what makes them true

- **One catalogue per language** in `src/i18n/`: `en.ts` is the source and defines the type; the
  others are typed against it, so a translation is complete or does not compile. `index.ts`
  resolves a language to its words or to English with `fallback: true`. `locales.ts` holds the
  five codes, their names, the fallback notices and the address rules.
- **Every sentence is true today** (CLAUDE.md, rule 4). `docs/truth-check.md` lists every claim
  with the fact that backs it (the Space API contract, the Connect lane's docs, a decision) and
  when it was last checked; sentences that depend on another lane's unfinished work are marked
  there. `tests/i18n.test.mjs` refuses the banned words in every language.
- **Product facts come only from** the Space API contract and the Connect lane's docs; the site
  states nothing they do not provide. MCP, the network across spaces and mail providers are not
  on the site until they run on staging (the owner's decisions of 2026-10-23).
- **Adding a language's words:** write `src/i18n/<code>.ts` typed as `Catalogue`, register it in
  `index.ts`, and the pages, the sitemap and the tests pick it up. A translation is reviewed
  before it is merged.

## Design (concept A8)

- **One palette with the app.** `src/styles/palette.css` is a copy of the app's generated tokens
  (`tools/design/palette.cjs` proves every contrast pair):
  `node scripts/sync-tokens.mjs <app checkout> [--check]`.
- **The atmosphere** (`src/components/Air.astro`, `src/scripts/atmosphere.ts`): the palette's
  seven proven pigments as a slow field of light drawn by WebGL into a small canvas behind the
  home page, still gradients without WebGL or scripts, one still frame under reduced motion; and
  the paper, a real texture printed over every page with multiply.
- **Evidence and status** use the app's three squares (`src/components/Mark.astro`): solid = on
  the staging space now, split = in the contract and not on staging yet, dashed = not built yet.
- **For the owner's open design choices:** the brand board at `/__preview/brand` and the variant
  switcher (palette, type pair, field radius, badge line) exist only in preview builds with
  `PUBLIC_PREVIEW_VARIANTS=1`; `tests/build.test.mjs` proves a production build carries none of it.

## Configuration

| Variable | Default | Meaning |
|---|---|---|
| `SITE_URL` | `https://linkbot-site.vercel.app` | canonical origin (canonical links, alternates, Open Graph, sitemap). The default is where production runs today. The launch domain is to be named by the owner (`linkbot-domain-tbd.invalid` until then). |
| `PUBLIC_NOINDEX` | unset | `1`: `noindex` on every page and `Disallow: /` in robots.txt. Vercel's preview deployments do not need it: they are behind Vercel's login and send `X-Robots-Tag: noindex` themselves |
| `PUBLIC_PREVIEW_VARIANTS` | unset | `1` for a preview with the brand board and the variant switcher |

## Develop and test

```bash
npm ci
npm run dev
npm run build                 # astro check + static build to ./dist
npm test                      # the catalogues, the palette copy, the production build
LINKBOT_APP_DIR=../linkbot npm run test:browser   # every page in every language at 5 widths, the app's WCAG audit, the journeys
node scripts/og.cjs           # re-render public/og.png
```

The browser acceptance needs a checkout of the app (murks3r/linkbot) for its accessibility audit,
so it runs at milestones, locally; the fast check in CI runs the rest.

No cookies, analytics or third-party requests; the typefaces (Archivo for display, Figtree for
text) are self-hosted.

`vercel.json` holds the framework preset, the install and build commands and the security headers.
Every branch and pull request gets a preview deployment; production is `main`.
