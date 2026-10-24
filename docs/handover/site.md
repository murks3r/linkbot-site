# Site lane handover

Written 2026-10-25 by the Site lane, so that a fresh session can continue without asking anyone.

Read these first, in this order:
1. `CLAUDE.md`, the binding rules.
2. This file.
3. Linear issue GEO-188, the lane's parent issue: the daily report comment, updated in place, and the threads under it.
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

### `build/vision`: the site being built, head `5dcdf8d`

It builds 61 pages: the same 12 in each of five languages, plus the 404 page. English sits at the root, then `/de`, `/es`, `/it` and `/fr`.
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

### The front-page directions: three branches, previews behind the login

All three branch from `cc8fe9b`. Each holds its rationale in `docs/front/*.md`, its own rows in `docs/truth-check.md` and its tests (`tests/front.test.mjs`, `tests/forbidden.mjs`).

| Branch | Head | Direction | The owner's decision |
| -- | -- | -- | -- |
| `vision/front-b-ask` | `c4d9b4e` | B, "Say what you need. See what Linkbot asks back." | the hero |
| `vision/front-a-verdict` | `d010904` | A, "Watch a need meet an offer" (the ledger) | the second section of the home |
| `vision/front-c-stages` | `0e6b0ca` | C, "Who sees what, and when." | its own page, `/who-sees-what` |

### Outside this repository, for the record

On 2026-10-24 a second public Linkbot landing page in the same Vercel team was taken offline on the owner's go. Its project, which is not this repository's, now has no Git link and no domain. The evidence was saved first. The go, the evidence and the checks are on GEO-188, in the thread under the Architect's domain comment.

## 3. Open PRs

| PR | Branch → base | Waits on |
| -- | -- | -- |
| [#28](https://github.com/murks3r/linkbot-site/pull/28) | `claude/main-legal-notice` → `main` | Counsel's view on the legal notice (GEO-150, GEO-154), a mailbox on a domain Linkbot owns, and then the owner's merge. A production build stops while its placeholders are open (see Gotchas). |
| [#30](https://github.com/murks3r/linkbot-site/pull/30) | `claude/main-domain-placeholder` → `main` | The owner's merge only. It replaces `main`'s last two mentions of the old domain, in the README and a config comment. Nothing the site serves changes. |
| #1, #6 to #21 | old design and parallel branches | Nothing. They stay as they are (owner's order). |

## 4. Next three steps

These are the owner's site decisions of 2026-10-24. Build them on `build/vision`, in this order. Nothing goes to production.

### Step 1: the front page is B, then A, and C becomes `/who-sees-what`

- **The work:** on a branch from `build/vision`:
  - Put B's hero (the field, the questions asked back, and the record of what a confirm would store) at the top of the home.
  - Put A's ledger below it, as the second section.
  - Put C's stages on a new route, `/who-sees-what`.
- **How:** port the code by hand. The three branches change the same files: `src/components/front/Front.astro`, `src/front/theme.css`, `src/front/texts.ts`, `src/layouts/Base.astro`, `src/pages/[...lang]/index.astro`, `src/components/HomeA8.astro`, `tests/forbidden.mjs` and `tests/front.test.mjs`. Keep one `theme.css`, and carry over the truth-check rows of what is kept.
- **Watch for the old domain:** the branches were cut before #29 and #31, so `README.md`, `astro.config.mjs` and `src/components/SEO.astro` there still name it. Take `build/vision`'s versions, or `tests/domains.test.mjs` fails.
- **Done when:**
  - `/` in English shows B's hero, then A's section, and `/who-sees-what` exists.
  - Every new sentence has a row in `docs/truth-check.md`.
  - `npm run typecheck`, `npm test` and `npm run build` pass, and `npm run test:browser` is green (see Gotchas for its setting).
  - It is merged into `build/vision` on local evidence, with a GEO-188 comment carrying the preview link.
- **Then:** the four other languages through the delegate (rule 8), reviewed line by line. Until they exist, those languages show the English fallback notice.

### Step 2: light theme, a looping Venn, and the dust layer

- **Light by default.** The front's `src/front/theme.css` follows the system scheme through `light-dark()`, and `Front.astro` has a preview-only `?theme=` switch. Make light the default. Whether a dark scheme stays reachable at all is not decided, so ask the owner before keeping a switch.
- **The Venn loops automatically, with no replay button.**
  - The only animation with a replay control in the front work is A's ledger: `src/components/front/Ledger.astro`, with the `data-replay` button "Play it again".
  - If "the Venn" means that animation, loop it, drop the button, and show the end state without motion under `prefers-reduced-motion`.
  - If it means the open "Venn study", it waits for that study (section 5).
- **The dust layer sits behind all content, is finer, and scrolls with the page.**
  - The layer is `src/components/Air.astro`: a small canvas from `src/scripts/atmosphere.ts`, plus a paper texture of tooth, fibres and specks.
  - Fixed or scrolling is the `noise` variant in `src/lib/variants.ts`, with the values `fixed` and `scroll`. It can be switched in a preview with `?noise=` when `PUBLIC_PREVIEW_VARIANTS` is set.
  - Make `scroll` the default, put the layer under all content, and make the grain finer.
- **Done when:**
  - A system set to dark still gets light.
  - The animation loops without a button and stands still under reduced motion.
  - The dust lies behind the text and scrolls with it.
  - The WCAG audits in `npm run test:browser` are green at 1440 and 390 px, and it is merged.

### Step 3: the language is chosen through a small floating globe button

- **The work:**
  - Remove the language lists from the header (`src/components/Masthead.astro`) and the footer (`src/components/Footer.astro`).
  - Add a small floating button with a globe at the bottom right. It opens the five languages, each named in its own language, and switches to the same path in the chosen language.
  - Keep the `hreflang` alternates in `src/components/SEO.astro`.
  - The 404 page lists the languages in its body, which is neither header nor footer, so leave it unless the owner says otherwise.
- **Requirements:** the button works by keyboard and is announced to screen readers, has a 44 px target, and covers no content at 390 px.
- **Done when:**
  - None of the pages has a language list in its header or footer.
  - The globe switches language and keeps the path.
  - The language journey in `tests/site_browser.cjs` is updated, `npm run test:browser` is green, and it is merged.

**Still open with the owner:** the logo (a wordmark or a quotation mark), the Venn study, and where icon F-I21 goes. None of these is in this repository. Do not decide them; build around them.

## 5. Blockers

| What | Who unblocks it | Linear |
| -- | -- | -- |
| S3, the live demo of the four widget modes (describe, board, watch, mine). There is no demo on the site until then, and a sample build never goes on a public page. | Core-Platform: the `linkbot-demo` space (P1). Geoprocure: the second synthetic pack (G3). | GEO-185, GEO-187 |
| S4, Connect's Astro package | Connect | GEO-186 |
| The privacy notice and the imprint on `build/vision`, which are placeholders saying "in preparation" | Trust's T6 texts, then counsel | GEO-135, GEO-154 |
| PR #28 on `main` | Counsel, plus a domain and mailbox Linkbot owns (owner) | GEO-150, GEO-154 |
| A native reading of the Spanish, Italian and French texts | The M3 gate | GEO-192 |
| A domain for the site. The placeholder stays `linkbot-domain-tbd.invalid`. The owner's facts on the candidate names are on GEO-188 and stay out of this public repository. | The owner | GEO-188 |
| The logo, the Venn study, icon F-I21 | The owner | GEO-188 |
| The hostname history on the old design branches, which can be rewritten only with the owner's go | The owner | GEO-151 |

## 6. Gotchas

- **The repository is public.**
  - No staging host, key, internal URL or person's data goes into it, including PR text.
  - Synthetic data only.
  - Keep Linear IDs out of PR titles and branch names: a parent ID in a PR title closes that issue on merge, as #22 did to GEO-188. Titles read "Lane Site, …" for `build/vision` and "Main: …" for `main`.
- **The domain guard.** `tests/domains.test.mjs` fails, with file and line, when the domain Linkbot does not own appears in any tracked text file, in any letter case.
  - Where a Linkbot address is meant, write `linkbot-domain-tbd.invalid` (`contact@linkbot-domain-tbd.invalid` for mail).
  - The front-page branches still name the old domain (step 1).
- **No URL in a User-Agent.** No crawler, probe or outgoing request identifies itself with a domain Linkbot does not own. Until a domain is registered, a User-Agent carries a product token only (`CLAUDE.md`). The site sets none today.
- **The truth check.** Every claim on a page has a row in `docs/truth-check.md`, with its source and the date checked.
  - `tests/i18n.test.mjs` refuses the forbidden words in every language: "verified", "live", "automated", "anonymous", "real-time", "stays private", "guaranteed" and their translations.
  - A sentence must be true on staging today, not planned.
- **The production build stop (PR #28 only).** `src/pages/imprint.astro` throws when `VERCEL_ENV` is `production` while `CONTACT_EMAIL` is unset or the board line is unsettled. This is on purpose, so a preview builds and production does not.
- **CI.** `check.yml` runs only for `main` and by hand. PRs into `build/vision` trigger nothing.
  - Merge on local evidence: run `npm run typecheck` and `npm test`, paste the commands and results into the PR, then use `gh pr merge <n> --merge --subject "Lane Site: … (#<n>)"`.
  - Browser tests run locally at milestones.
- **Browser tests** need the app's audit module. Set `LINKBOT_APP_DIR` to a checkout of the app repository on its `build/vision` branch (on this Mac: `~/Projects/linkbot-build-vision`).
- **Building `main`.** Its `package-lock.json` is a 20-byte placeholder (GEO-153). Install with `npm install --package-lock=false`, and commit no lockfile there without the owner.
- **Vercel.**
  - The project sets no environment variables. The names the code reads are `SITE_URL`, `PUBLIC_NOINDEX`, `PUBLIC_PREVIEW_VARIANTS` and, in tests, `LINKBOT_APP_DIR`. None holds a secret.
  - `vercel inspect` keeps listing a removed alias, so check public names with `curl`.
  - `vercel api` (beta) reads and changes one project's Git link and domains. Select fields with `jq`, so that no environment values print.
- **Author identity.** Commits carry the account's real email, never a machine hostname (GEO-151).
- **Translations by the DeepSeek delegate** (reasonix, rule 8):
  - Give each run its own worktree and a narrow brief.
  - Have it read the English source in ranges of at most 120 lines, and use `--effort low` for French.
  - Review every line before merging.
- **Lookups that were refused before.** DNS-history lookups and team-wide Vercel listings were refused by the sessions' safety checks. GitHub's deployments API and `vercel inspect <url>` work.
- **The shell.** The sessions' shell is zsh: an unquoted `$var` holding several lines is not split into words, so use `xargs` or arrays.

## 7. Worktrees on this Mac

`~` is the home directory of the account that runs the sessions.

| Path | Branch | State | How to resume |
| -- | -- | -- | -- |
| `~/Projects/linkbot-site` | `build/vision` | The main checkout, shared by sessions. Its local `build/vision` may lag `origin`. | `git -C ~/Projects/linkbot-site pull --ff-only` |
| `~/Projects/linkbot-site/.claude/worktrees/s0-a8-base-c611a3` | `claude/site-handover` (this file; merged) | The lane's worktree, with `node_modules` (Playwright 1.63) | `git fetch origin && git switch -c claude/<next> origin/build/vision` |
| `~/Projects/linkbot-site/.claude/worktrees/recursing-shtern-2e0e50` | `claude/site-refuse-unowned-domain` (PR #32, merged) | Done | Remove with `git -C ~/Projects/linkbot-site worktree remove <path>` |
| `~/Projects/linkbot-build-vision` | the app repository, `build/vision` | Another lane's checkout; read only for this lane | Point `LINKBOT_APP_DIR` at it |

- **No worktree yet:** the front-page branches have none on this Mac. Create one from `origin` for step 1.
- **The Architect's notes folder:** `~/.claude-instances/*/side-session-notes/local_9e6a9e15-01ee-44dc-b034-fce8dd114fd3/` holds the lane's hand-over note `site-lane.md`, and the evidence of 2026-10-24 under `evidence/linkbot-landing-2026-10-24/` (README and SHA256SUMS included).
- **Scratch files** of past sessions lived under `/private/tmp` and are not durable.
