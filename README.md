# Linkbot — Site

Privacy-first marketing site for [Linkbot OÜ](https://linkbot.org). Built
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
npm install
npm run dev          # http://localhost:4321
npm run typecheck    # astro check (TS strict)
npm test             # node:test unit suite
npm run build        # static output in ./dist
npm run preview      # serve the built output locally
```

## Jobsite preview (`/jobs`)

A public job-discovery experience lives at `/jobs`, built as an isolated subtree
(`src/jobsite/**`, `src/pages/jobs/**`) with its own layout, stylesheet and
search adapter. It does not alter this marketing page, the agency page,
`global.css` or `SEO.astro`.

It currently runs on clearly labelled local fixtures — never presented as a live
catalogue — behind a typed, replaceable adapter. Setting
`PUBLIC_SUPPLY_API_ORIGIN` switches it to live supply. Every jobsite route is
`noindex` and excluded from the sitemap.

See `docs/jobsite/` for the review guide, the typed contract, the Supply
integration handoff and the QA evidence. Configure via `.env.example`.

## Deployment (Vercel)

The repo is wired for Vercel via `vercel.json`, which declares the Astro
framework preset, the install/build commands, and a minimal set of
security headers. Once connected, every push to `main` triggers a
production deploy.
