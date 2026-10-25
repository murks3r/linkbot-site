# Site lane handover

Written 2026-10-25 by the Site lane, so that a fresh session can continue without asking anyone. It was updated the same day:
- after #34, which made `vision/home-redesign` the source of the front;
- after #35, which merged the front, with the gaps the step-1 session found in this file;
- in #NN, which made the status sentences true again and dated them.

Read these first, in this order:
1. `CLAUDE.md`, the binding rules.
2. This file.
3. Linear issue GEO-188, the lane's parent issue: one report comment per day, and the threads under the comments.
4. `docs/truth-check.md`.

The repository is **public**, and so is this file. It names no preview host, key, internal URL or personal data, and it shows Linear issues by ID only.

## 1. Scope

**Owned:** the whole repository murks3r/linkbot-site, which is the Site lane of the build phase "Linkbot Vision" (GEO-188).
- `build/vision` is the integration branch. Every PR targets it, and the lane merges its own PRs on local evidence (`CLAUDE.md`, BUILD MODE).
- `main` is production. It changes only by the owner's merge, at milestones or on the owner's explicit instruction.
- The Vercel project `linkbot-m3` (team `geoprocure`, production branch `main`) builds this repository.

**Never touched:**
- **Other repositories.** Product facts come from the Connect lane's docs and the Space API contract. The site states nothing they do not provide.
- **Production.** Nothing from `build/vision` goes to `main` without the owner. Previews only.
- **The old design and parallel branches, and their draft PRs** (#1 and #6 to #21). They stay as they are by the owner's order. #1 is not marked draft: never merge it.
- **Other Vercel projects of the team, and any public production name or domain**, unless the owner's go is recorded on GEO-188 first.
- **Secrets and real data:** synthetic data only.

## 2. State (2026-10-25)

### `main`: production, public at https://linkbot-site.vercel.app

Since `551175b` ([#27](https://github.com/murks3r/linkbot-site/pull/27)), production is a holding page:
- one screen of true sentences;
- no form, no cookies, nothing loaded from other sites.

The production deployments on record (GitHub's deployment history, all made by Vercel from pushes to `main`):

| Commit | Live from (UTC) | What |
| -- | -- | -- |
| `59b63ea` | 2026-07-25 19:19 | the old landing page: a mailto form, Google Fonts, claims that are not true today |
| `b4ebb2e` ([#26](https://github.com/murks3r/linkbot-site/pull/26)) | 2026-10-24 13:46 | the same page with the three claims GEO-150 names removed |
| `551175b` ([#27](https://github.com/murks3r/linkbot-site/pull/27)) | 2026-10-24 15:03 | the holding page |

Of the project's three production names, only `linkbot-site.vercel.app` is public. The other two, every deployment's own URL and every preview sit behind Vercel's login and send `X-Robots-Tag: noindex`.

### `build/vision`: the site being built, at the merge of #NN

It builds 66 pages: 13 in each of five languages (the twelve catalogue pages and `/who-sees-what`), plus the 404 page. English sits at the root, then `/de`, `/es`, `/it` and `/fr`.
- **Its preview** is behind Vercel's login. Find it in the Vercel dashboard under project `linkbot-m3`, Deployments, branch `build/vision`.
- **Each PR's own preview link** is in the Vercel bot's comment on that PR.

| What | PR | Merge commit |
| -- | -- | -- |
| S0: concept A8 as the base, squashed, plus the fast CI | [#22](https://github.com/murks3r/linkbot-site/pull/22) | `2a246ef` |
| S1: true copy in English and German, five-language routing, `docs/truth-check.md` | [#23](https://github.com/murks3r/linkbot-site/pull/23) | `e9d023b` |
| S2: six integration pages under `/platforms` from the Connect docs | [#24](https://github.com/murks3r/linkbot-site/pull/24) | `5f41100` |
| Spanish, Italian and French, written by a DeepSeek delegate and reviewed line by line | [#25](https://github.com/murks3r/linkbot-site/pull/25) | `cc8fe9b` |
| The default site address is production's | [#29](https://github.com/murks3r/linkbot-site/pull/29) | `cb3e4f8` |
| The domain placeholder `linkbot-domain-tbd.invalid` replaces the old domain | [#31](https://github.com/murks3r/linkbot-site/pull/31) | `90d4e42` |
| The owner's rules "Domains and identification", added to `CLAUDE.md` by the Architect | direct commit | `dd5d348` |
| `tests/domains.test.mjs`: the domain guard | [#32](https://github.com/murks3r/linkbot-site/pull/32) | `5dcdf8d` |
| This handover, and its first correction | [#33](https://github.com/murks3r/linkbot-site/pull/33), [#34](https://github.com/murks3r/linkbot-site/pull/34) | `f6148ba`, `2dec13a` |
| Step 1: the front is B, then A, and C is `/who-sees-what`. It merges `vision/home-redesign` at `a111f6f`, plus fixes. | [#35](https://github.com/murks3r/linkbot-site/pull/35) | `5688598` |
| The handover, kept current | [#36](https://github.com/murks3r/linkbot-site/pull/36), [#37](https://github.com/murks3r/linkbot-site/pull/37) | `d284ce2`, `66eccbf` |
| The status sentences, true again and dated. Text and the board run on the staging space, the instance serves the widget, and the console's routes exist since 0.2.9; watches, webhooks and outgoing email are not there yet. It adds `src/i18n/status-date.ts` and `tests/status.test.mjs`. | [#NN](https://github.com/murks3r/linkbot-site/pull/NN) | the merge of #NN |

### The front, since #35

This carries out the owner's site decisions of 2026-10-24, recorded on GEO-188.

**The English home:**
- B is the hero, with a 2D Venn of a need and an offer. Study 1, "approach", is the default.
- The Venn loops by itself, with a pause control and no replay button.
- A's verdict sequence is the second section.
- The home's ask form has `method="dialog"`, so nothing typed leaves the page.

**`/who-sees-what`** is direction C, as its own page. It is in English for every language, and de, es, it and fr show the English fallback notice.

**The other four languages' home** is still the older catalogue home (`src/components/HomeA8.astro`), with no fallback notice.

**Site-wide:**
- Light is the default for everyone; dark stays behind `?theme=dark`.
- The dust is the page's background, under all content. It is finer than before and scrolls with the page.
- One floating globe button chooses the language (`src/components/LangSwitch.astro`). There are no language lists in the header or footer.
- The type and icons are the brand lab's, self-hosted. The licences are SIL OFL 1.1, in `public/fonts/*/OFL.txt`.

**Review switches:** `?theme=dark`, `?logo=quote`, `?venn=2`, `?icon=match`, `?arm=pointer`.

**Notes and review files:**
- one note per decision in `docs/front/redesign-2026-10-24.md`;
- the review files (motion studies, frame strips, before-and-after shots) in `~/Desktop/linkbot-design-evidence/vision-front/` (README), also attached to GEO-188.

**Superseded branches:** `vision/home-redesign`, merged in #35. Its predecessors `vision/front-b-ask`, `vision/front-a-verdict` and `vision/front-c-stages` should not be ported, and they still name the unowned domain.

### Outside this repository, for the record

On 2026-10-24 a second public Linkbot landing page in the same Vercel team was taken offline on the owner's go. Its project, which is not this repository's, now has no Git link and no domain. The evidence was saved first. The go, the evidence and the checks are on GEO-188, in the thread under the Architect's domain comment.

## 3. Open PRs

| PR | Branch → base | Waits on |
| -- | -- | -- |
| [#28](https://github.com/murks3r/linkbot-site/pull/28) | `claude/main-legal-notice` → `main` | Counsel's view on the legal notice (GEO-150, GEO-154), a mailbox on a domain Linkbot owns, and then the owner's merge. A production build stops while its placeholders are open (see Gotchas). |
| [#30](https://github.com/murks3r/linkbot-site/pull/30) | `claude/main-domain-placeholder` → `main` | The owner's merge only. It replaces `main`'s last two mentions of the old domain, in the README and a config comment. Nothing the site serves changes. |
| #1, #6 to #21 | old design and parallel branches | Nothing. They stay as they are (owner's order). |

## 4. Next three steps

Nothing goes to production.

### Standing duty: keep the status true

The status sentences name the day of their check: `STATUS_CHECKED` in `src/i18n/status-date.ts`, now 2026-10-25. Each catalogue writes that day into its status sentences. The status as of that day:

| On the staging space | Not on the staging space |
| -- | -- |
| the form; text, read by fixed rules without a model; the board; confirm, matching, gates and approval, introductions, outcomes, deletion; a space's settings, origins, keys and funnel; the widget, served by the instance itself (0.3.0-v1) | watches and their messages; webhooks; email that leaves the instance |

**When to check again:**
- At least every 14 days: `tests/status.test.mjs` fails after that.
- As soon as staging's `/health` reports contract 0.2.13. That version is watches (Core-Engine E4, deployed on the owner's go, GEO-184). Watches then move to the staging column in all five catalogues.

**How to check:**
- **Read the two sources.**
  - Staging's health report, `GET /health` on the staging space's Space API. It needs no key. The host is in Connect's `docs/handover/connect.md`; never write it into this repository. Send a product-token User-Agent such as `Linkbot-Probe/1.0`.
  - The Connect lane's plan: `docs/plan/connect-plan.md` in murks3r/linkbot-connect on `build/vision`, its status line and §1.
- **Supporting sources:** Core-Engine's `docs/handover/core-engine.md` in murks3r/linkbot lists staging's feature flags.
- **Renew everything together:** `STATUS_CHECKED`, the sentences in all five catalogues, and their rows in `docs/truth-check.md`, whose sources are `H` and `P`.

### Step 1: the owner's open choices, then remove what loses

Each of these is open with the owner and sits behind a review switch today:
- **The logo:** the wordmark (the default) or the brand lab's quotation mark (`?logo=quote`).
- **The Venn:** study 1, "approach" (the default), or study 2, "criteria travel" (`?venn=2`).
- **Icon F-I21:** on the menu button, as today, or also on the ask button (`?icon=match`).
- **Section A:** sketch 1, "one Venn, the whole story", or sketch 2, "four glyphs". Neither is built.
- **The reaching arm:** `?arm=pointer`.
- **Dark:** whether it ever follows the system's scheme.

Do not decide any of them.

**Done when:**
- Each decided option is the only one left in the code, and its switch is gone (rule 7: no dead code).
- The gates pass.
- The PR says which decision it carries out.

### Step 2: the new front in the four other languages

**The work:**
- Translate the new home and `/who-sees-what` through the delegate (rule 8), and review every line.
- Replace the older home (`HomeA8.astro`) in de, es, it and fr with the translated front.
- Drop the fallback notice.

**Done when:**
- All five languages show the new home and `/who-sees-what` in their own language, and no page shows the fallback notice.
- `HomeA8.astro` is gone, if nothing uses it any more.
- The tests pass.
- The native reading goes to GEO-192.

### Step 3: clear out concept A8's leftovers (rule 7)

- `type-a8.css` is still imported.
- `palette.css` feeds only the brand board `/__preview/brand`, the variant switcher and the living light.
- The living light (the `living` mode of `Air.astro`, and `src/scripts/atmosphere.ts`) is used by no page.
- `public/material/print.webp` is unreferenced.
- The variant axes `noise` and `palette` change nothing any more.

Ask the owner first whether the brand board is still needed.

## 5. Blockers

| What | Who unblocks it | Linear |
| -- | -- | -- |
| S3, the live demo of the four widget modes (describe, board, watch, mine). There is no demo on the site until then, and a sample build never goes on a public page. | Core-Platform: the `linkbot-demo` space (P1) | GEO-185 |
| S4, the site on Connect's Astro package. `@linkbot-connect/astro` is merged in Connect's C3 (version `0.1.0-v1`, marked private), but Connect publishes nothing (npm, public docs, CDN) before M3 and the owner's go (Connect's plan, decision 4). A live embed also needs the demo space of S3. | Connect, after M3 and the owner's go; Core-Platform for the space | GEO-115, GEO-186, GEO-185 |
| The privacy notice and the imprint on `build/vision`, which are placeholders saying "in preparation" | Trust's T6 texts, then counsel | GEO-135, GEO-154 |
| PR #28 on `main` | Counsel, plus a domain and mailbox Linkbot owns (owner) | GEO-150, GEO-154 |
| A native reading of the Spanish, Italian and French texts | The M3 gate | GEO-192 |
| A domain for the site. The placeholder stays `linkbot-domain-tbd.invalid`. The owner's facts on the candidate names are on GEO-188 and stay out of this public repository. | The owner | GEO-188 |
| The open choices of step 1, and whether the brand board stays | The owner | GEO-188 |
| The hostname history on the old design branches, which can be rewritten only with the owner's go | The owner | GEO-151 |

Two blockers in the first handover are done:
- the second synthetic pack, `bulk_freight@0.1.0-draft`, is registered in the app repository;
- Connect's Astro package is merged, in Connect's C3.

## 6. Gotchas

- **The repository is public.**
  - No staging host, key, internal URL or person's data goes into it, including PR text.
  - Synthetic data only.
  - Keep Linear IDs out of PR titles and branch names: a parent ID in a PR title closes that issue on merge, as #22 did to GEO-188. Titles read "Lane Site, …" for `build/vision` and "Main: …" for `main`.
- **Forbidden words in translation.** Italian "verificato" and French "vérifié" are on the forbidden list even where they only mean "checked". Write "controllato" and "contrôlé".
- **Product facts move.** Before carrying any status sentence, re-read the sources the standing duty in section 4 names. Contracts 0.2.10 and 0.2.11 overtook the copy within a day.
- **The domain guard.** `tests/domains.test.mjs` fails, with file and line, when the domain Linkbot does not own appears in any tracked text file, in any letter case.
  - Where a Linkbot address is meant, write `linkbot-domain-tbd.invalid` (`contact@linkbot-domain-tbd.invalid` for mail).
  - The old `vision/front-*` branches still name the old domain.
- **No URL in a User-Agent.** No crawler, probe or outgoing request identifies itself with a domain Linkbot does not own. Until a domain is registered, a User-Agent carries a product token only (`CLAUDE.md`). The site sets none today.
- **The truth check.** Every claim on a page has a row in `docs/truth-check.md`, with its source and the date checked.
  - `tests/i18n.test.mjs` refuses the forbidden words in every language: "verified", "live", "automated", "anonymous", "real-time", "stays private", "guaranteed" and their translations.
  - A sentence must be true on staging today, not planned.
- **Build before you test.** `tests/build.test.mjs` reads `dist/`. A stale `dist/` from an older build makes it fail, and a missing one makes it skip. Run `npm run build`, then `npm test`.
- **English-only pages.** A page shown in English for other languages must take the English catalogue for everything, its header and footer included. `tests/build.test.mjs` checks this. Open: the SEO alternates (`hreflang`, `og:locale`) still claim the reader's language for those pages.
- **Forms.** On this static site, a `<form>` without `method` sends its named inputs as a query in the URL when scripts don't run. A form that must not send uses `method="dialog"`.
- **The production build stop (PR #28 only).** `src/pages/imprint.astro` throws when `VERCEL_ENV` is `production` while `CONTACT_EMAIL` is unset or the board line is unsettled. This is on purpose, so a preview builds and production does not.
- **CI.** `check.yml` runs only for `main` and by hand. PRs into `build/vision` trigger nothing.
  - Merge on local evidence: run `npm run typecheck`, `npm run build` and `npm test`, paste the commands and results into the PR, then use `gh pr merge <n> --merge --subject "Lane Site: … (#<n>)"`.
  - Browser tests run locally at milestones.
- **Browser tests** need the app's audit module: set `LINKBOT_APP_DIR` to a checkout of the app repository on its `build/vision` branch (on this Mac: `~/Projects/linkbot-build-vision`).
  - Run it twice: `npm run test:browser`, then `SITE_SCHEME=dark npm run test:browser`.
  - Each pass takes about 1.5 minutes. The Playwright browsers are installed on this Mac.
- **Building `main`.** Its `package-lock.json` is a 20-byte placeholder (GEO-153). Install with `npm install --package-lock=false`, and commit no lockfile there without the owner.
- **Vercel.**
  - The project sets no environment variables. The names the code reads are `SITE_URL`, `PUBLIC_NOINDEX`, `PUBLIC_PREVIEW_VARIANTS` and, in tests, `LINKBOT_APP_DIR` and `SITE_SCHEME`. None holds a secret.
  - A preview's address can be had without the dashboard: `gh api repos/murks3r/linkbot-site/deployments`, then `/deployments/<id>/statuses`, then `environment_url`. Every preview answers with a redirect to Vercel's login.
  - `vercel inspect` keeps listing a removed alias, so check public names with `curl`.
  - `vercel api` (beta) reads and changes one project's Git link and domains. Select fields with `jq`, so that no environment values print.
- **Reports.** Post one GEO-188 comment per day: start a new comment each day, and update that day's comment in place.
- **Author identity.** Commits carry the account's real email, never a machine hostname (GEO-151).
- **Translations by the DeepSeek delegate** (reasonix, rule 8):
  - Give each run its own worktree and a narrow brief.
  - Have it read the English source in ranges of at most 120 lines, and use `--effort low` for French.
  - Review every line before merging.
- **Lookups that were refused before.** DNS-history lookups and team-wide Vercel listings were refused by the sessions' safety checks. GitHub's deployments API and `vercel inspect <url>` work.
- **The shell.** The sessions' shell is zsh: an unquoted `$var` holding several lines is not split into words, so use `xargs` or arrays.
- **New branches can appear between reads.** Before writing a plan, list `origin`'s branches and read the newest GEO-188 comments. This handover first missed `vision/home-redesign`, which was pushed the same afternoon.

## 7. Worktrees on this Mac

`~` is the home directory of the account that runs the sessions.

| Path | Branch | State | How to resume |
| -- | -- | -- | -- |
| `~/Projects/linkbot-site` | `build/vision` | The main checkout, shared by sessions. Its local `build/vision` may lag `origin`. | `git -C ~/Projects/linkbot-site pull --ff-only` |
| `~/Projects/linkbot-site/.claude/worktrees/s0-a8-base-c611a3` | the handover's branches (merged) | The lane's worktree, with `node_modules` (Playwright 1.63) | `git fetch origin && git switch -c claude/<next> origin/build/vision` |
| `~/Projects/linkbot-site/.claude/worktrees/zealous-bohr-9a8db0` | `claude/site-home-redesign` (PR #35, merged at `5688598`) | Done | Done; leave for the housekeeping worker (GEO-194). |
| `~/Projects/linkbot-site/.claude/worktrees/recursing-shtern-2e0e50` | `claude/site-refuse-unowned-domain` (PR #32, merged) | Done | Done; leave for the housekeeping worker (GEO-194). |
| `~/Projects/linkbot-build-vision` | the app repository, `build/vision` | Another lane's checkout; read only for this lane | Point `LINKBOT_APP_DIR` at it |

- **Local folders.** Only the housekeeping worker (GEO-194) moves or deletes local folders, worktrees included (owner's rule). A session leaves its finished worktree where it is.
- **Notes folders.** The Architect's notes folder `~/.claude-instances/*/side-session-notes/local_9e6a9e15-01ee-44dc-b034-fce8dd114fd3/` holds:
  - the lane's hand-over note `site-lane.md`;
  - the evidence of 2026-10-24, under `evidence/linkbot-landing-2026-10-24/` (README and SHA256SUMS included).

  The Site lane session's own folder, `.../side-session-notes/local_6c67fc50-6b08-48f5-a779-f4ae1699b953/`, holds the step-1 notes `site-step1-2026-10-25.md`.
- **Scratch files** of past sessions lived under `/private/tmp` and are not durable.
