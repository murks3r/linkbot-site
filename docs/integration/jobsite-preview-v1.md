# Integration candidate — jobsite + preview + site hardening

**Branch:** `integration/jobsite-preview-v1`
**Base:** `main` @ `59b63ea`
**Candidate head:** the commit that adds this file (see the PR description; the SHA
moves with every push, the base does not).
**Status:** preview candidate. Not merged, no DNS change, no production deploy.

Three accepted draft PRs were built independently against `main` and each passes
its own suite. They contradict each other when combined: they disagree about who
owns the canonical origin, they both emit a robots directive, and one of them adds
a route the other two assume does not exist. Individually passing suites are
therefore *not* evidence of a working combination — this document is the record of
what was actually measured and what was changed.

## 1. Bases, heads and overlap

| PR | Branch | Head SHA | Files changed vs `main` |
| --- | --- | --- | --- |
| #6 site hardening | `parallel/site-hardening-v1` | `8829d3b` | 15 |
| #10 preview infrastructure | `parallel/web-preview-foundation-v1` | `7ee65d7` | 16 |
| #11 public `/jobs` | `parallel/jobsite-web-v1` | `38961cc` | 56 |

Overlapping paths (measured with `git diff --name-only main...<branch>` intersected
across branches — not assumed):

| Pair | Shared paths |
| --- | --- |
| #6 x #10 | *(none)* |
| #6 x #11 | `public/robots.txt` |
| #10 x #11 | `astro.config.mjs`, `package.json`, `README.md` |

Files every PR treats as owned by someone else and none of them edited:
`src/pages/index.astro`, `src/styles/global.css`, `src/components/three/**`,
`public/og.svg`, `public/favicon.svg`. They are byte-identical to `main` in this
candidate (`git diff --name-only main HEAD -- <those paths>` is empty except
`vercel.json`, which PR #10 owns).

## 2. Integration sequence

1. `91d0871` — merge #10 (`--no-ff`). Clean.
2. `8dea23c` — merge #6 (`--no-ff`). Clean.
3. `0f1ec84` — merge #11 (`--no-ff`). Conflicts resolved as a *mechanical union
   only*: `astro.config.mjs` (keep #10's env-driven `site` + `previewGuard()`
   **and** #11's `/jobs` sitemap filter) and `README.md`. Two files auto-merged to
   something semantically wrong and were left wrong on purpose until step 4, so
   the defect is visible in history rather than hidden in a resolution:
   - `public/robots.txt`: #11's `Disallow: /jobs` landed as orphan rules *after*
     the last named group, so under RFC 9309 §2.2.1 they bound to `CCBot` alone;
     and both were unanchored prefix rules.
   - `package.json`: `"test": "node --test 'tests/**/*.test.mjs'"` pulled the
     build-dependent preview-smoke suite into `npm test`, which then failed
     without a build.
4. `55f15c9` — semantic reconciliation of application code (below).
5. `d45055b` — reconciliation of the three test suites (below).

## 3. Per-PR reconciliation record

### PR #10 — configurable origin, lockfile, preview guards

**Preserved as intended:** `src/lib/site-origin.mjs` is the single origin
authority (resolution order preview → `SITE_ORIGIN` → `VERCEL_URL` → localhost,
and `linkbot.org` throws); `previewGuard()` still rewrites `dist/robots.txt` for
non-production builds; `vercel.json` keeps `installCommand: npm ci`, the catch-all
security headers and the host-gated branch-alias rules (regex asserted to match a
real branch alias and to not match production hosts); the real
`package-lock.json`.

**Changed:**

| Change | Why |
| --- | --- |
| `rewriteLegacyOrigins` deleted (its §3.7 follow-up) | It existed only to repair `main`'s hardcoded origin. `SEO.astro` now derives from `Astro.site` and `public/llms.txt` names no host, so the shim is dead code — and a silent domain-repair shim is how a hardcoded domain gets back in unnoticed. |
| The guard now runs on **indexable** builds too, to inject `Sitemap: <origin>/sitemap-index.xml` | The source file cannot carry that line: a literal names one environment's host, and the organisation's former domain may not appear at all. The guard already owned `dist/robots.txt` for non-production, so it owns the environment-dependent line in both directions. A production build is otherwise byte-identical to the source (asserted). |
| `SITE_ORIGIN` documented in `.env.example` (not a `PUBLIC_` variable) | It is a build input, not browser configuration, and PR #11's `PUBLIC_SITE_ORIGIN` was competing with it. |

**Correction to the record:** `docs/preview/domain-migration.md` §4 reports the
simulated post-merge result as *site-hardening 8 fail / preview-smoke 1 fail*.
Measured here on the merged, unreconciled tree it is **10 fail and 2 fail**. The
two extra failures in each suite are the ones that PR #10's overlay could not see,
because it overlaid only PR #6's files:

- `reserved paths use exact anchors so prefix collisions cannot occur` — PR #11's
  unanchored `/jobs` rules.
- `links: every internal reference resolves to a built file` — 104 "undeclared
  external reference" hits from the jobsite's `example.com` fixture links.

The §3.8 helper patch shipped in that document (`process.env.SITE_ORIGIN ??
'https://<final-domain>'`) cannot work as written: `new URL('https://<final-domain>')`
throws a `TypeError` on the forbidden `<` host character, so the suite would fail
at import time with no `SITE_ORIGIN` set. This candidate derives the expectation
from `resolveSite(process.env)` instead, which is the same function the build uses.

### PR #6 — SEO, accessibility, performance hardening

**Preserved as intended:** the whole rewritten `SEO.astro` (single origin, canonical
normalisation, OG/Twitter completeness, the three-node `@graph`), the `robots.txt`
group restructuring (reserved-path rules repeated into every named group,
`/access$` anchored, redundant Googlebot/Bingbot groups removed), `llms.txt`'s
Status/Contact sections, the 44-test suite and the two `todo` tests that encode
gaps this work cannot close.

**Changed:**

| Change | Why |
| --- | --- |
| `SITE_ORIGIN` fallback constant removed; the component throws when `Astro.site` is absent | §3.1 of the migration document, applied. A fallback host is exactly the defect the migration exists to remove. |
| `BaseLayout.astro` passes `robots` to `SEO.astro` instead of emitting its own `<meta name="robots">` | Two contradictory robots directives in one head (PR #10's noindex plus PR #6's index/follow default). Google applies the most restrictive, so indexing was still prevented — but the contradiction is a defect and one of PR #10's own tests failed on it. |
| `public/robots.txt` holds no `Sitemap:` directive, and no host at all | See the guard row above. |
| `public/llms.txt`'s three absolute URLs became root-relative | A static file cannot carry a build-time origin; naming a fixed host would cite a domain nobody owns. `llms-txt.test.mjs` now asserts the file names no host and that no build step rewrites it. |
| One public claim corrected: *"It is not a job board. There are no public listings on this site."* → *"There are no real job listings on this site: the `/jobs` route is a preview of the discovery experience, built on clearly labelled synthetic sample data."* | PR #6 wrote that line when the site had no listing surface; PR #11 added one. Keeping the original wording would have left a false statement on the site, and PR #11's own labelling is the honest version of it. **Flagged for product:** this is a public-claim change, not a cosmetic one. |
| Test assumptions §3.8–§3.11 applied, plus: `https` is now asserted only for an indexable build (`SITE_ORIGIN` set), because a local build is correctly `http://localhost:4321` | The scheme is a property of the environment, not of the component. Asserting `https` unconditionally made the suite unable to describe its own build. |
| `robots.txt` anchoring rule extended to accept a rule that ends at a path separator (`/jobs/`), not only `$` | PR #11's subtree block needs to cover `/jobs/<id>`; `/jobs/` cannot swallow a sibling route, which is what the rule is for. |

### PR #11 — public `/jobs` experience

**Preserved as intended:** the whole `src/jobsite/**` subtree, its own layout and
scoped stylesheet, the fixture-backed adapter seam, fixture labelling in the
rendered UI, `UNKNOWN` as a first-class value, provenance panels, the detail route
generated from the adapter's own search, `/jobs` excluded from the sitemap, every
jobsite route `noindex`, no `JobPosting` structured data, the 57-test unit suite
and all of `docs/jobsite/**`.

**Changed:**

| Change | Why |
| --- | --- |
| `JobsiteSEO.astro` reads `Astro.site`; `getSiteOrigin()`/`PUBLIC_SITE_ORIGIN` removed from `config.ts`, `.env.example` and the test surface | The jobsite was the only place with its own origin variable. Two origin inputs is the widest divergence in this integration: a preview could have emitted a relative canonical from the jobsite while the marketing pages emitted an absolute one. The jobsite keeps the stronger half of its original intent — it still throws rather than inventing a host. |
| `Disallow: /jobs` → `/jobs$` + `/jobs/`, repeated in the wildcard **and** every named group | As auto-merged they bound to `CCBot` alone. The pairing is now asserted by `robots.test.mjs`. |
| `"test": "node --test 'tests/**/*.test.mjs'"` scoped to the jobsite unit suite | It pulled in build-dependent suites, so `npm test` failed on a clean checkout with no build. New `test:site` (build + site-hardening), `smoke` (build + preview-smoke) and `verify` (typecheck + build + all three) make the gate explicit. |
| `README.md` jobsite section notes there is no separate jobsite origin variable | Was otherwise describing a variable that no longer exists. |

## 4. Measured reconciliation state

Every number below was produced on this machine (Node v26.5.0, npm 11.17.0,
macOS) from pristine `git archive` exports of each branch sharing one
`node_modules`; the "combined" rows are the merged-but-unreconciled tree.

| Tree | Suite | tests | pass | fail | todo |
| --- | --- | --- | --- | --- | --- |
| #6 alone | `tests/site-hardening` | 44 | 42 | 0 | 2 |
| #10 alone | `tests/preview-smoke` | 32 | 32 | 0 | 0 |
| #11 alone | `tests/jobsite-*` | 57 | 57 | 0 | 0 |
| #10+#6+#11 merged, unreconciled | `tests/site-hardening` | 44 | 32 | **10** | 2 |
| #10+#6+#11 merged, unreconciled | `tests/preview-smoke` | 32 | 30 | **2** | 0 |
| #10+#6+#11 merged, unreconciled | `tests/jobsite-*` | 57 | 57 | 0 | 0 |
| **this candidate, local build** | `tests/site-hardening` | 48 | 46 | **0** | 2 |
| **this candidate, local build** | `tests/preview-smoke` | 33 | 33 | **0** | 0 |
| **this candidate, local build** | `tests/jobsite-*` | 57 | 57 | **0** | 0 |
| **this candidate, `SITE_ORIGIN=https://careers.example.com`** | all three | 138 | 136 | **0** | 2 |

The two `todo` tests are PR #6's, unchanged and still failing loudly by design:
`og:image` is an SVG (no raster card exists in the repository) and
`ThreeExperience.astro` restates `aria-hidden="false"`. Neither file is in scope
for this integration.

## 5. Robotic guards, as built

Verified from the build output, not from intent:

| Build | `site` line | canonical | robots meta | `dist/robots.txt` | preview notice |
| --- | --- | --- | --- | --- | --- |
| local, no env | `http://localhost:4321` (local) | `http://localhost:4321/` | `noindex, nofollow, noarchive` | `Disallow: /`, no sitemap | shown |
| `VERCEL_ENV=preview` | the deployment's own host | that host | `noindex, nofollow, noarchive` | `Disallow: /`, no sitemap | shown |
| `VERCEL_ENV=production`, no `SITE_ORIGIN` | `https://linkbot-site.vercel.app` (deployment) | that host | `noindex, nofollow, noarchive` | `Disallow: /`, no sitemap | shown |
| `SITE_ORIGIN=https://careers.example.com` | that origin (production, indexable) | that origin | `index, follow, max-image-preview:large…` | policy + `Sitemap: https://careers.example.com/sitemap-index.xml` | absent |

`SITE_ORIGIN=https://linkbot.org`, `linkbot.org` and `http://www.linkbot.org/`
each throw at config load. A preview ignores a configured `SITE_ORIGIN` rather than
emitting canonical URLs for a site it is not.

The only surviving occurrence of the former domain in any built asset is the
contact address (`mailto:hello@linkbot.org` in `index.html`, `hello@linkbot.org`
in `llms.txt`, and the JSON-LD `email`). No build output contains an absolute URL
on it. The address is a contact decision, recorded in
`docs/site-hardening/02-unresolved-and-out-of-scope.md` §1 and
`docs/preview/domain-migration.md` §3.4 — **not** changed here.

## 6. Browser acceptance (`/jobs`, real browser, built output)

Served with `astro preview` on `127.0.0.1:4400` from the local build
(`dist/`, 47 pages), driven over CDP.

| Check | Result |
| --- | --- |
| `/jobs` desktop 1440x1000 | `41 opportunities`, 10 cards, `Showing 1–10 of 41 · page 1`, one `h1`, `lang="en"` |
| Horizontal overflow | desktop `scrollWidth - innerWidth = -15`; mobile 390x844 `= 0` |
| Fixture labelling | "PROPOSED DIRECTION — NOTARIAL (NOT APPROVED)" + "PREVIEW — SAMPLE DATA" + "Every employer, posting and URL here is synthetic (reserved example.com links)" |
| Filter `?wm=unknown` | `1 opportunity matched`; card = *Operations Coordinator (arrangements not stated)* with `Location unknown`, `Work mode unknown` |
| Pagination | Next → `?cursor=fx1.bzoxMA%3D%3D&page=2`, `Showing 11–20 of 41 · page 2` |
| Detail `/jobs/opp-0001` | 200; full provenance (Source, Source kind, Source URL, Observed, Published, Last modified, Canonical id, Local id, Observed via = `fixture-v1 (fixture)`) |
| Unknown detail id | 404 (no homepage fallback) |
| Outbound links | every `target=_blank` anchor on the pages sampled is `rel="noopener noreferrer nofollow"`; 0 external anchors without it |
| Mobile 390x844 | search box 501 px from the top of the 844 px viewport; `Filters` disclosure collapsed (`aria-expanded="false"`, `aria-controls="jobsite-filters"`); no overflow |
| `/jobs/saved` | 200, one `h1`, `noindex, nosnippet` |
| Marketing home | **exactly one** `robots` meta (the duplicate is gone), canonical on the build origin, preview notice present |
| Canonical / robots on every jobsite route | `http://localhost:4321/jobs[...]` + `noindex, nofollow, noarchive, nosnippet` |

## 7. Gates run

```
npm ci                      # 550 packages, 7 s, lockfileVersion 3 (648 entries)
npm run typecheck           # Result (56 files): 0 errors, 0 warnings, 0 hints
npm run build               # 47 pages, exit 0, both guard branches observed in the log
node --test "tests/jobsite-*.test.mjs"            # 57/57
node --test "tests/site-hardening/*.test.mjs"     # 46 pass, 2 todo, 0 fail
node --test "tests/preview-smoke/*.test.mjs"      # 33/33
SITE_ORIGIN=https://careers.example.com npm run build && <all three suites>   # 0 fail
npm run verify              # typecheck + build + all three suites, 0 fail
```

## 8. Decisions this integration did **not** make

Each needs an owner; none was silently chosen.

1. **The public domain.** `SITE_ORIGIN` is deliberately unset everywhere in this
   candidate, which keeps every build non-indexable. Choosing the domain, and
   pointing it at the deployment, is a business decision —
   `docs/preview/domain-migration.md` §5 is the launch gate.
2. **The contact address.** `hello@linkbot.org` is still published, in the page
   form `action="mailto:…" method="post" enctype="text/plain"` (an unreliable
   transport) and in the JSON-LD. The address and the transport should move
   together, and the homepage is another workstream's file.
3. **The jobsite detail route under live supply.** `/jobs/<id>` is statically
   generated, so it only ever serves the built set. Live supply needs an
   on-demand route (SSR or an edge function) — see
   `docs/jobsite/supply-integration-handoff.md` §"Open items" 1. Nothing in this
   candidate connects to a supply endpoint: `PUBLIC_SUPPLY_API_ORIGIN` is unset
   and the fixtures are the only source.
4. **Terms of use for original application links.** The UI presents `applyUrl` as
   the original posting and hands the visitor off. That relationship has to be
   confirmed per source before it is enabled for that source (same document).
5. **The `og:image` raster card and a compliant logo asset** (PR #6's two `todo`
   tests). Both need a binary in `public/` that does not exist yet.
6. **Whether `/jobs` should stay `Disallow`-ed in `robots.txt` once it carries real
   supply.** With fixtures, blocking is the conservative choice (PR #11's intent,
   preserved). With real supply, a crawler must be able to read the `noindex` for
   it to take effect.
7. **Privacy review of the jobsite's client-side state.** The saved list and
   expressed interest live in `localStorage` for the origin and are never sent
   anywhere in this build; that claim is asserted in the UI copy and was not
   independently audited here.

## 9. Known residual gaps (carried, not introduced)

- `docs/preview/domain-migration.md` §4's failure counts are superseded by §4
  above; §3.8's helper patch is superseded by the resolver-based helper.
- Fonts are still loaded from Google Fonts (PR #6 §6 and PR #11's brand note).
- The 3D island remains a single ~822 kB chunk; the performance work is PR #6's
  `02-unresolved` item 6 and is not attempted here.
- Vercel Authentication is untouched: it is a project setting, not a repository
  file, and this candidate adds no `domains`, `alias` or `redirects` to
  `vercel.json`.
