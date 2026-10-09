# Reproducible builds and development previews

Scope: make this Astro repository install and build deterministically, and make
isolated previews work on whatever host Vercel hands out — without a custom
domain, without touching production, and without ever emitting a canonical URL
for `linkbot.org` (a domain the organisation no longer owns).

Everything here is additive. `src/pages/index.astro`, the Agency components, the
Brand OS work, the jobsite agent and the application backend are untouched, and
`src/components/SEO.astro` / `public/robots.txt` remain owned by PR #6 — see
[domain-migration.md](./domain-migration.md) for the reconciliation.

## 1. Prerequisites

| Tool | Version | Notes |
| --- | --- | --- |
| Node | 22 or newer | Verified on Node 26.5.0. Vercel's default runner is Node 22.x. |
| npm | 10 or newer | Verified on npm 11.17.0. The lockfile is `lockfileVersion: 3`. |

No `.nvmrc`, `engines` pin or `.npmrc` is committed on purpose: the Vercel
project's Node version is a project setting, and adding a repo-level pin would
change the runner for production deploys. Pin it in the dashboard if you want it
recorded — see the [release checklist](./release-checklist.md).

## 2. Clean install

```bash
rm -rf node_modules dist .astro
npm ci --no-audit --no-fund
```

`package-lock.json` is a real lockfile (550 packages from the declared ranges).
It records the Linux/macOS/Windows native optional binaries for `rollup`,
`esbuild` and `sharp`, so the same lockfile installs correctly on Vercel's Linux
runners and on a developer's machine.

> `npm ci` fails with `EUSAGE` if `package-lock.json` and `package.json`
> disagree. Regenerate deliberately with `npm install`, and say why in the commit
> message — the whole point of `npm ci` is that the lockfile is the input.

On npm 11 and newer you may see an `allow-scripts` warning for `esbuild` and
`sharp`. It is benign: their platform binaries arrive as optional dependencies,
and the build runs. Vercel's bundled npm 10 does not emit it.

## 3. Local preview workflow

Three commands, in increasing fidelity:

```bash
# A. Iterate. Dev server with HMR. Never indexed, marked non-production.
npm run dev                     # http://localhost:4321

# B. Preview exactly what a deployment serves. Builds, then serves dist/.
npm run preview:local           # http://localhost:4321

# C. Prove it. Build + full smoke suite (routing, metadata, links, guards).
npm run smoke
```

`npm run preview` alone serves an existing `dist/` without rebuilding; use it
after `npm run build`.

### Site origin resolution

`src/lib/site-origin.mjs` is the single source of truth for the origin of every
absolute URL in a build. Resolution order, first match wins:

| # | Condition | Origin used | Indexable |
| --- | --- | --- | --- |
| 1 | `VERCEL_ENV=preview` | `https://$VERCEL_URL` — this deployment's own host | no |
| 2 | `SITE_ORIGIN` set to a public host | that origin | **yes** |
| 3 | `VERCEL_URL` set | `https://$VERCEL_URL` | no |
| 4 | otherwise | `http://localhost:4321` | no |

Consequences worth knowing:

- A **preview never claims a custom domain**, even when one is configured for the
  project: rule 1 ignores `SITE_ORIGIN`. A preview that cited the production
  domain would look like a duplicate of a site it is not.
- A **production deployment without `SITE_ORIGIN` is not indexable**. Falling
  back to the `*.vercel.app` host and calling it canonical is exactly the defect
  this work removes.
- **`linkbot.org` fails the build** in every input position (`SITE_ORIGIN` or
  `VERCEL_URL`). The final domain is undecided, so the refusal is what makes the
  migration mandatory rather than optional.

Emit the decision explicitly when you need to:

```bash
npm run build                                   # [linkbot] site=http://localhost:4321 stage=local indexable=false (from default-local)
SITE_ORIGIN=example.com npm run build           # [linkbot] site=https://example.com stage=production indexable=true (from SITE_ORIGIN)
VERCEL_ENV=preview VERCEL_URL=my-app-git-x-scope.vercel.app npx astro build
```

To inspect a preview-shaped build locally:

```bash
VERCEL_ENV=preview VERCEL_URL=my-app-git-branch-scope.vercel.app npm run build
npm run smoke:dist              # reuses the existing dist/
```

### The non-production guard

A build that is not indexable (rule 1, 3 or 4 above) gets three independent
markers, so a preview can neither be indexed nor be mistaken for the live site:

1. `<meta name="robots" content="noindex, nofollow, noarchive">` in the head.
2. A fixed **"Not production"** banner on every page, naming the origin it is
   served from (`src/components/preview/PreviewNotice.astro`). Required because
   preview content may be placeholder or fixture data.
3. `dist/robots.txt` rewritten to `Disallow: /` and stripped of any `Sitemap:`
   line by the `astro:build:done` hook in `src/lib/preview-guard.mjs`.

An indexable (production) build performs none of the above and leaves
`robots.txt` byte-identical to `public/robots.txt`. The hook logs which branch it
took:

```
[linkbot-preview-guard] preview guard: production build for https://… — robots.txt and SEO output left untouched
[linkbot-preview-guard] preview guard: non-production build (local, from default-local) at http://localhost:4321 — robots.txt disallows all; … [temporary shim, remove with PR #6]
```

`public/robots.txt` itself is never modified by this work — it belongs to PR #6.

## 4. Vercel preview configuration

`vercel.json` changes, all of them preview-scoped or reproducibility-only:

| Key | Change | Effect on production |
| --- | --- | --- |
| `installCommand` | `npm install` → `npm ci` | Next production deploy installs from the lockfile instead of re-resolving. Intended, and the reason the lockfile is committed. |
| `headers[+]` | `X-Robots-Tag: noindex, nofollow, noarchive`, gated on `has: host` matching `^.*-git-.*\.vercel\.app$` | None — a branch alias is by definition not a production host. |
| `rewrites[+]` | `/robots.txt` → `/preview/robots.txt`, same host gate | None, same reason. |

Both preview rules are gated on the **branch alias** host shape
(`<project>-git-<branch>-<scope>.vercel.app`), which cannot match the production
alias (`<project>.vercel.app`), an immutable deployment URL, or a custom domain.
The smoke suite asserts that: it evaluates each host pattern against
`linkbot-site.vercel.app`, `linkbot-m3.vercel.app` and `linkbot.org` and fails if
any match.

There is deliberately **no `domains` key, no `alias`, and no custom-domain
configuration** anywhere in the repository. Attaching a domain is a dashboard
action and must wait for the domain decision.

### How branch previews are produced

The Vercel project is already connected to `murks3r/linkbot-site`: every branch
push creates a Preview deployment automatically, so no CLI login or token is
needed to obtain a preview URL (and none is used here). Find them with:

```bash
gh api "repos/murks3r/linkbot-site/deployments?per_page=10" --jq '.[] | "\(.environment) \(.ref[0:8])"'
gh api "repos/murks3r/linkbot-site/deployments/<id>/statuses" --jq '.[0].environment_url'
```

**Preview deployments for this project are protected by Vercel Authentication.**
An unauthenticated request is answered with `302 → vercel.com/sso-api`, so the
URL is shareable only with Vercel-team members. That protection is an additional
indexing guard and is desirable while previews contain fixture data. If a preview
has to be publicly viewable, the options are a Vercel share link (bypass token)
or disabling Deployment Protection for the Preview environment — decide in the
dashboard, per preview, not in this repository.

## 5. Smoke checks

```bash
npm run smoke            # builds, then runs every check below
npm run smoke:dist       # same checks against an existing dist/
PREVIEW_URL=https://<deployment-host> npm run smoke:dist   # + classify a real deployment
```

32 checks, no new dependency — `node:test` plus a stdlib static server
(`tests/preview-smoke/server.mjs`).

`tests/preview-smoke/config.test.mjs` — no build needed:

- origin resolution for local, preview, production, `VERCEL_URL`-only, loopback
  and malformed inputs; `linkbot.org` rejected in every position;
- `astro.config.mjs` derives its origin and hardcodes none;
- `vercel.json` keeps `npm ci`, the existing security headers, no custom domain;
- every preview rule is host-scoped and provably cannot match a production host;
- the preview `robots.txt` disallows everything, advertises no sitemap, names no
  domain;
- `package-lock.json` is version 3, matches `package.json` exactly, and locks the
  Linux binaries `npm ci` needs;
- no `.npmrc` / `shrinkwrap` / foreign lockfile overrides the install.

`tests/preview-smoke/output.test.mjs` — serves `dist/`:

- **routing**: `/`, `/index.html`, `/favicon.svg`, `/og.svg`, `/llms.txt`,
  `/robots.txt`, `/sitemap-index.xml` all 200 with the right content type; unknown
  paths 404 instead of falling back to the homepage;
- **metadata**: title, description, viewport, theme-color, canonical, `og:url`,
  `og:image`, twitter card; canonical and `og:url` identical and on the build's
  own origin; structured data parses and cites that origin;
- **links**: every `href`/`src` resolves to a built file, every in-page anchor has
  a matching `id`, external references are limited to `fonts.googleapis.com` and
  `fonts.gstatic.com`;
- **no unowned domain**: no built asset contains an `https?://linkbot.org` URL. The
  single tolerated occurrence is the `mailto:` contact address, which is printed
  as a release-checklist item rather than silently accepted;
- **preview guard**: on a non-production build, a single contradictory-free
  `noindex` directive and a visible non-production notice; on an indexable build,
  neither, and `robots.txt` untouched;
- **preview accessibility**: the local preview answers and serves a document; with
  `PREVIEW_URL` set, the deployment is classified as publicly reachable or
  `sso-protected`, and anything else fails.

### Verification record

| Check | Command | Result |
| --- | --- | --- |
| Clean install | `npm ci` after `rm -rf node_modules dist .astro` | 550 packages, exit 0 |
| Types | `npm run typecheck` | 0 errors, 0 warnings, 0 hints (17 files) |
| Build | `npm run build` | 1 page, exit 0 |
| Smoke | `npm run smoke` | 32/32 pass |
| Production-shaped build | `SITE_ORIGIN=<host> npm run build` | indexable, no notice, no `noindex`, `robots.txt` untouched |

## 6. What this does not do

- No merge, no production deployment, no custom domain, no DNS change.
- No change to `src/components/SEO.astro`, `public/robots.txt` or
  `public/llms.txt` (PR #6 owns those). The origin work they still need is
  written out as an exact patch in
  [domain-migration.md](./domain-migration.md).
- No new runtime dependency, no analytics, no third-party script.
- No change to the homepage, the 3D scene, the Agency components, the Brand OS
  work, the jobsite agent or the application backend.
