# Site hardening — SEO, indexing, structured data, accessibility

Branch: `parallel/site-hardening-v1` (based on `main` @ `59b63ea`).
Task: GitHub issue [#4](https://github.com/murks3r/linkbot-site/issues/4).

## Authorised write scope

Only these paths were written:

- `src/components/SEO.astro`
- `public/robots.txt`
- `public/llms.txt`
- `docs/site-hardening/**` (this directory)
- `tests/site-hardening/**`

Nothing else in the repository was modified — not `src/pages/index.astro`,
`src/layouts/BaseLayout.astro`, `src/styles/global.css`, `tailwind.config.mjs`,
`astro.config.mjs`, `vercel.json`, `package.json`, `package-lock.json`,
`src/components/three/**`, or the application repository. No redesign, no brand
or product-claim changes.

## Documents

| File | Contents |
| --- | --- |
| `00-defect-inventory.md` | Every defect found, with evidence and disposition |
| `01-changes.md` | What was changed, and why, per file |
| `02-unresolved-and-out-of-scope.md` | Defects that need another owner, with concrete fixes |
| `03-measurements.md` | Before/after measurements and how to reproduce them |

## Running the checks

```bash
npm install --no-package-lock     # npm ci is blocked, see 02-unresolved-and-out-of-scope.md
npm run build                     # astro check && astro build
node --test tests/site-hardening/*.test.mjs
```

`npm run build` must run first: the page-level tests assert against
`dist/index.html`. Without a build those tests report as *skipped with a
reason*, never as silently passing, and the source-level coherence tests
(`canonical-host.test.mjs`) still run.

Two tests are deliberately reported as **todo** — they encode known gaps that
cannot be closed inside the authorised paths (raster social card, redundant
`aria-hidden="false"`). A todo is not a pass; see
`02-unresolved-and-out-of-scope.md`.

## Result on this branch

```
$ npm run build                                   # astro check + astro build: clean
$ node --test tests/site-hardening/*.test.mjs
ℹ tests 44
ℹ pass 42
ℹ fail 0
ℹ skipped 0
ℹ todo 2
```
