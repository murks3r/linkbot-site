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
| `/` | in English: write a need in one line and see the questions the synthetic sample pack asks back and what a confirm would store (in the browser only), beside the Venn of one synthetic pair; the same pair verdict by verdict and the four steps before an introduction; why it asks instead of guessing; who sees what; for platforms, for verticals; where it stands. The four other languages keep the catalogue's home (what Linkbot is, the path from a need to an introduction, the four ways with where each stands, the rules, for whom, where it stands) until the front is translated |
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

## Design (concept A8, redesigned on 2026-10-24)

The owner's decisions of 2026-10-24 and the reasons for each are in `docs/front/redesign-2026-10-24.md`.

- **Tokens, light by default.** One palette for light and dark, defined once with `light-dark()` in
  `src/styles/site.css`. The page does not follow the system's scheme; the dark palette shows only
  with `?theme=dark`.
- **Type:** the brand lab's pairing, self-hosted and subset for the five languages
  (`src/styles/fonts.css`): "LB Display Sans" (IBM Plex Sans SemiBold, renamed as its licence
  requires) for display, Atkinson Hyperlegible Next for text. Both are under the SIL Open Font
  License 1.1, with the licence beside the files (`public/fonts/*/OFL.txt`).
- **The dust:** a tile of single-device-pixel grains on the page's own background, under all
  content, scrolling with the page (`public/material/dust-*.png`, written by `node scripts/dust.mjs`).
- **The Venn** (`src/components/front/Venn.astro`): the home's figure, one synthetic pair as nine
  verdicts in the lens. It loops by itself, pauses off-screen and on its control, and stands still
  under reduced motion or without scripts.
- **The language** is one floating button with a globe at the bottom right
  (`src/components/LangSwitch.astro`); the header and the footer list no languages.
- **Review switches for the owner's open choices,** per page and combinable: `?logo=quote` (the
  wordmark is the default), `?venn=2` (the second motion study), `?icon=match` (icon F-I21 on the
  ask button), `?arm=pointer` (the arm that follows the pointer), `?theme=dark`.
- **Evidence and status** use the app's three squares (`src/components/Mark.astro`): solid = on
  the staging space now, split = in the contract and not on staging yet, dashed = not built yet.
- **Concept A8's preview tools:** the brand board at `/__preview/brand` and the variant switcher
  exist only in preview builds with `PUBLIC_PREVIEW_VARIANTS=1`; `tests/build.test.mjs` proves a
  production build carries none of it. `src/styles/palette.css`, a copy of the app's generated
  tokens (`node scripts/sync-tokens.mjs <app checkout> [--check]`), feeds only the brand board,
  which imports it.

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
SITE_SCHEME=dark LINKBOT_APP_DIR=../linkbot npm run test:browser   # the same in the dark palette (?theme=dark)
node scripts/og.cjs           # re-render public/og.png
```

The browser acceptance needs a checkout of the app (murks3r/linkbot) for its accessibility audit,
so it runs at milestones, locally; the fast check in CI runs the rest.

No cookies, analytics or third-party requests; the typefaces (LB Display Sans for display,
Atkinson Hyperlegible Next for text) are self-hosted.

`vercel.json` holds the framework preset, the install and build commands and the security headers.
Every branch and pull request gets a preview deployment; production is `main`.
