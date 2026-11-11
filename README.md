# Sensalio — developer site (docs.sensalio.de)

The crawlable developer pages for Sensalio: the start page with the 5-minute quickstart and a demo of "both say yes",
`/developers`, the developer docs under `/developers/docs` (English), the status, the changelog, and the privacy
notice, imprint and contact page as marked placeholders until their texts are released. What Sensalio is, for readers
who are not developers, is the marketing site `sensalio.de` (Verticals' `products/sensalio`, agreed 2026-11-11,
`src/lib/marketing.ts`); the marketing pages that lived here redirect there (`vercel.json`, `tests/redirects.test.mjs`).
The product itself runs on a platform's own pages (the widget, the console, the Space API); the site explains, it
never matches.

This repository is built in BUILD MODE on the integration branch `build/vision` (see
`CLAUDE.md`): pull requests target that branch, the fast check in `.github/workflows/check.yml`
(types, build, unit tests) must be green, previews only, `main` only at milestones with the
owner's go. The structure is concept A8 (the design canvas `design/concept-a8`); the design is the widget design spec v1.

## Pages

| Route | What it does |
|---|---|
| `/` | one headline, the 5-minute quickstart as the one button, the docs beside it, the "both say yes" demo with two fictional businesses (in the browser only), the shortest embed, and a link to `sensalio.de` |
| `/developers` | the shortest embed, an SDK example, the docs by section, and what is not available yet |
| `/developers/docs/…` | Connect's open-core export and the site's own two pages, in English (`src/lib/open-core-docs.ts`) |
| `/status`, `/changelog` | where each part stands, dated; one entry per product step |
| `/privacy`, `/imprint`, `/contact` | placeholders that say the texts are in preparation; nothing legal is invented |
| redirects | `/faq`, `/how-it-works`, `/who-sees-what`, `/demo`, `/request-a-demo`, `/verticals`, `/one-page` and the one-page PDFs go to `sensalio.de` (German at its root, English under `/en`); `/platforms/*` go to their page in the docs, `/platforms`, `/platforms/console` and `/for-platforms` to `/developers` |

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

## Design (the widget design spec v1, since 2026-10-31)

The site wears the widget's design so that both read as one product (`docs/front/landing-plan.md` §3).

- **One token file:** `src/styles/tokens.css` holds the spec's colours, type roles and measures
  under the spec's names (`--lb-ground`, `--lb-ink`, `--lb-accent` …), and sets the widget's own
  variables from them. It is the only place a colour is written (`tests/tokens.test.mjs`). Light
  only; no texture.
- **Type:** Schibsted Grotesk, one variable file per script range, self-hosted
  (`src/styles/fonts.css`, licence in `public/fonts/schibsted-grotesk/OFL.txt`); the Latin file is
  the one Connect's widget serves. Tabular figures only where numbers stand. The share images and
  the one-page sheet still draw with the earlier faces (`src/lib/brand-fonts.ts`).
- **The landing page** (`src/components/front/Landing.astro`): six sections, words in
  `src/front/landing-copy.ts`; the status labels "Live" and "Coming soon" sit on the cards and
  never filter.
- **The language** is one floating button with a globe at the bottom right
  (`src/components/LangSwitch.astro`); the header and the footer list no languages.
- **Evidence and status** use the app's three squares (`src/components/Mark.astro`): solid = on
  the staging space now, split = in the contract and not on staging yet, dashed = not built yet.

## Configuration

| Variable | Default | Meaning |
|---|---|---|
| `SITE_URL` | `https://docs.sensalio.de` | canonical origin (canonical links, alternates, Open Graph, schema.org, robots.txt, sitemap). The default is the developer site's domain (agreed with Verticals, 2026-11-11; the marketing site is `sensalio.de`); a build for another origin sets it. |
| `CONTACT_EMAIL` | unset | the contact address, a mailbox on `sensalio.de` (suggested: `hallo@sensalio.de`, created by the owner); unset, every page says contact details are in preparation |
| `PUBLIC_NOINDEX` | unset | `1`: `noindex` on every page and `Disallow: /` in robots.txt. Vercel's preview deployments do not need it: they are behind Vercel's login and send `X-Robots-Tag: noindex` themselves |

The public name is one constant, `PUBLIC_NAME` in `src/i18n/terms.ts` (`Sensalio`; every page's own copy, `llms.txt`, site name, schema.org); the legal entity is `LEGAL_NAME` beside it (`Linkbot OÜ` until the register entry). The developer docs under `/developers/docs` are Connect's export and keep its wording.
The steps from preview to the public address, with the values the owner names: `docs/ops/publish-checklist.md`.

## Develop and test

```bash
npm ci
npm run dev
npm run build                 # astro check + static build to ./dist; also draws each page's preview image
npm test                      # the catalogues, the tokens, the production build
LINKBOT_APP_DIR=../linkbot npm run test:browser   # every page in every language at 5 widths, the app's WCAG audit, the journeys
```

The browser acceptance needs a checkout of the app (murks3r/linkbot) for its accessibility audit,
so it runs at milestones, locally; the fast check in CI runs the rest.

No cookies, analytics or third-party requests; the typeface (Schibsted Grotesk) is self-hosted.

`vercel.json` holds the framework preset, the install and build commands and the security headers.
Every branch and pull request gets a preview deployment; production is `main`.
