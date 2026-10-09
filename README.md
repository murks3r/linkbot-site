# Linkbot — Site

Privacy-first marketing site for Linkbot OÜ. Built
as a single, content-rich landing page with a four-act 3D narrative
embedded in the middle of the scroll.

## Stack

- **Astro 5** — HTML-first static site.
- **React 18** islands — only the 3D scene is interactive.
- **React Three Fiber + Drei** — Three.js wrapper for the persona scene.
- **GSAP + ScrollTrigger** — drives the timeline from scroll position.
- **Lenis** — smooth scrolling (graceful fallback if disabled or unsupported).
- **Tailwind CSS 3** — utility styling with a small custom palette.

## Development

```bash
npm ci               # reproducible install from package-lock.json
npm run dev          # http://localhost:4321
npm run typecheck    # astro check (TS strict)
npm test             # node:test unit suite
npm run build        # static output in ./dist
npm run preview:local # build, then serve ./dist locally
npm run smoke        # build + preview smoke checks (routing, metadata, links, guards)
```

The site origin is resolved from the environment at build time — `SITE_ORIGIN`
for an explicit origin, otherwise the Vercel deployment's own host, otherwise
localhost. `linkbot.org` is refused as a deployment target. Local, preview and
future production origins, the Vercel preview configuration and the smoke
harness are documented in [`docs/preview/`](docs/preview/README.md).

## Jobsite preview (`/jobs`)

A public job-discovery experience lives at `/jobs`, built as an isolated subtree
(`src/jobsite/**`, `src/pages/jobs/**`) with its own layout, stylesheet and
search adapter. It does not alter this marketing page, the agency page,
`global.css` or `SEO.astro`.

It currently runs on clearly labelled local fixtures — never presented as a live
catalogue — behind a typed, replaceable adapter. Setting
`PUBLIC_SUPPLY_API_ORIGIN` switches it to live supply. Every jobsite route is
`noindex` and excluded from the sitemap. Its canonical origin comes from the same
build-time resolver as the rest of the site (`src/lib/site-origin.mjs`) — there
is no separate jobsite origin variable.

See `docs/jobsite/` for the review guide, the typed contract, the Supply
integration handoff and the QA evidence. Configure via `.env.example`.

## Deployment (Vercel)

The repo is wired for Vercel via `vercel.json`, which declares the Astro
framework preset, the install/build commands, and a minimal set of
security headers. Vercel builds production from `main` and an isolated preview
from every other branch; preview hosts are marked `noindex` and must not be
cited as the live site. A production build needs an `SITE_ORIGIN` naming the
real domain — see
[`docs/preview/domain-migration.md`](docs/preview/domain-migration.md).

Before the site is indexed under a real domain, work through
[`docs/preview/release-checklist.md`](docs/preview/release-checklist.md).
