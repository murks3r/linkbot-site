# Migrating canonical URLs off `linkbot.org`

Status: **blocked** on two decisions outside this workstream — the final public
domain, and merging PR #6 (`parallel/site-hardening-v1`), which owns
`src/components/SEO.astro`, `public/robots.txt` and `public/llms.txt`.

This document is the handover: what already moves with the environment, what is
still hardcoded, the exact patch for each remaining site, and the measured
post-merge failure list the patches close.

> Nothing in this file has been applied to PR #6's files. The origin work they
> contain is described as a diff so a coordinated integration can land it, per the
> isolation rules.

## 1. The problem

`linkbot.org` currently resolves to a domain-parking page
(`http://ww19.linkbot.org/`, HTTP 200), and the live site is
`https://linkbot-site.vercel.app/`, which serves
`<link rel="canonical" href="https://linkbot.org/">`. Every canonical signal on
the production site therefore points at a host the organisation does not control.
Anyone who registers the domain inherits that authority.

Evidence, recorded at the time of writing:

| Check | Result |
| --- | --- |
| `curl -sIL https://linkbot.org` | `200`, `location: http://ww19.linkbot.org/` — parking host, not the site |
| `curl -sI https://linkbot-site.vercel.app/` | `200`, body contains `canonical ... href="https://linkbot.org/"` |
| `gh api repos/murks3r/linkbot-site/deployments` | 1 Production deployment (`main` @ `59b63ea`), Preview deployments per branch |

## 2. What now moves with the environment

`src/lib/site-origin.mjs` resolves the origin from `SITE_ORIGIN` / `VERCEL_ENV` /
`VERCEL_URL` (see [README.md](./README.md) §3) and `astro.config.mjs` feeds it to
`site`. Everything downstream picks it up automatically:

| Surface | Source | Now follows the environment |
| --- | --- | --- |
| `astro.config.mjs` `site` | resolver | yes — was hardcoded `https://linkbot.org` |
| `<link rel="canonical">` | `Astro.site` in `SEO.astro` | yes |
| `og:url`, `og:image` | `Astro.site` in `SEO.astro` | yes |
| `sitemap-index.xml`, `sitemap-0.xml` | `@astrojs/sitemap` from `site` | yes |
| JSON-LD `url`, `@id` (on `main`) | hardcoded in `SEO.astro` | no — see §3.1 |
| JSON-LD `url`, `@id` (with PR #6) | `${origin}` from `Astro.site` | yes |
| `robots.txt` `Sitemap:` line | `public/robots.txt`, literal | no — see §3.2 |
| `llms.txt` canonical URL | `public/llms.txt`, literal | no — see §3.3 |
| Structured data contact email | `SEO.astro`, literal | no — see §3.4 |
| Homepage `mailto:` | `index.astro`, literal | no — see §3.5 |

Residual hardcoded occurrences on `main` (each blocks a truthful production
build):

```
astro.config.mjs:8        site: 'https://linkbot.org'          FIXED (this branch)
src/components/SEO.astro  fallback origin + JSON-LD url, logo  PR #6 owns the file
public/robots.txt:21      Sitemap: https://linkbot.org/...      PR #6 owns the file
public/llms.txt:20,25     canonical URL and home link           PR #6 touches the file
README.md:3               link to linkbot.org                   docs only
src/pages/index.astro     mailto:hello@linkbot.org (x2)         homepage, another workstream
```

## 3. Exact remaining changes

### 3.1 `src/components/SEO.astro` (PR #6) — remove the literal origin, take the `robots` prop

PR #6 already derives every absolute URL and the whole `@graph` from `origin`, so
only the fallback constant has to go:

```diff
-/** Single source of truth for the canonical host; must match astro.config.mjs `site`. */
-const SITE_ORIGIN = 'https://linkbot.org';
-const site = Astro.site ?? new URL(SITE_ORIGIN);
-const origin = site.origin;
+/** astro.config.mjs resolves `site` from SITE_ORIGIN / VERCEL_ENV / VERCEL_URL. */
+const site = Astro.site;
+if (!site) {
+  throw new Error('astro.config.mjs resolved no site origin — see docs/preview/README.md');
+}
+const origin = site.origin;
```

This is what closes the `indexable` branch of the smoke suite
(`metadata: structured data parses and cites only this build origin`), which
currently fails for any production-origin build because of the hardcoded
`https://linkbot.org` / `https://linkbot.org/og.svg` in the JSON-LD.

The same file must also stop emitting a second `robots` meta when the preview
guard is active. `BaseLayout.astro` currently emits its own. The coordinated
patch moves the decision into the component PR #6 already parameterised:

```diff
  <!-- src/layouts/BaseLayout.astro -->
-    <SEO title={title} description={description} canonicalPath={canonicalPath} />
-
-    {noindex && <meta name="robots" content="noindex, nofollow, noarchive" />}
+    <SEO
+      title={title}
+      description={description}
+      canonicalPath={canonicalPath}
+      robots={noindex ? 'noindex, nofollow, noarchive' : undefined}
+    />
```

until that lands, a preview build emits `index, follow, max-image-preview:large…`
(PR #6's default) *and* `noindex, nofollow, noarchive` in the same head. Google
applies the most restrictive, so indexing is still prevented, but the contradiction
is a defect — and `tests/preview-smoke/output.test.mjs` fails on it by design.

### 3.2 `public/robots.txt` (PR #6) — the sitemap line

```diff
-# robots.txt — https://linkbot.org
-# Canonical host matches astro.config.mjs `site`. See docs/site-hardening/.
+# robots.txt — canonical host is resolved at build time from astro.config.mjs `site`.
+# See docs/preview/README.md and docs/site-hardening/.
@@
-Sitemap: https://linkbot.org/sitemap-index.xml
+Sitemap: https://<final-domain>/sitemap-index.xml
```

A literal is unavoidable here — `robots.txt` is served as a static file and
cannot be templated without moving it into a route. The preview guard already
replaces it with `Disallow: /` for every non-production build, so the literal only
ever reaches a production host.

### 3.3 `public/llms.txt` (PR #6) — the canonical URL and access link

```diff
-- [Home / Overview](https://linkbot.org/): the problem, the position, and
+- [Home / Overview](https://<final-domain>/): the problem, the position, and
@@
-- https://linkbot.org/
+- https://<final-domain>/
@@
-- Access request form: https://linkbot.org/#access
+- Access request form: https://<final-domain>/#access
```

PR #6's `llms-txt.test.mjs` asserts every URL in the file is on the canonical
host, so this follows from the domain decision, not from a preference.

### 3.4 `src/components/SEO.astro` (PR #6) — the contact address

```diff
-      email: 'hello@linkbot.org',
+      email: '<real contact address>',
@@
-          email: 'hello@linkbot.org',
+          email: '<real contact address>',
```

### 3.5 `src/pages/index.astro` — homepage contact form and footer

Owned by another workstream, so recorded, not edited:

```diff
-<form class="mt-12 grid gap-4 sm:grid-cols-2" action="mailto:hello@linkbot.org" method="post" enctype="text/plain">
+<form class="..." action="mailto:<real contact address>" method="post" enctype="text/plain">
...
-<a href="mailto:hello@linkbot.org" class="hover:text-bone-50">hello@linkbot.org</a>
+<a href="mailto:<real contact address>" class="hover:text-bone-50"><real contact address></a>
```

Note the larger item behind this: a `mailto:` form with
`method="post" enctype="text/plain"` is unreliable across browsers and cannot
carry an acknowledgement. See the [release checklist](./release-checklist.md)
§1 — the address and the transport should be decided together.

### 3.6 `README.md` — the documentation link

```diff
-Privacy-first marketing site for [Linkbot OÜ](https://linkbot.org). Built
+Privacy-first marketing site for Linkbot OÜ. Built
```

### 3.7 Delete the temporary shim (this branch)

`src/lib/preview-guard.mjs` contains `rewriteLegacyOrigins`, which rewrites
`https://linkbot.org` to the build's own origin in non-production output. It
exists only because `main`'s `SEO.astro` (and `public/llms.txt`) hardcode the
legacy origin. Once §3.1 and §3.3 land, delete the function, its call site and
its import:

```diff
-        const rewritten = await rewriteLegacyOrigins(outDir, site.origin);
         logger.info(
-          `preview guard: non-production build (${site.stage}, from ${site.source}) ` +
-            `at ${site.origin} — robots.txt disallows all; rewritten legacy origin in ` +
-            `${rewritten.length} output file(s) [temporary shim, remove with PR #6]`,
+          `preview guard: non-production build (${site.stage}, from ${site.source}) ` +
+            `at ${site.origin} — robots.txt disallows all`,
         );
```

Keep the `robots.txt` rewrite; it is not a shim, it is the guard.

### 3.8 `tests/site-hardening/helpers.mjs` (PR #6) — derive the canonical origin

`configuredSiteOrigin()` scrapes `astro.config.mjs` with
`/site:\s*['"]([^'"]+)['"]/`, which cannot parse `site: site.origin`. Point the
helper at the same resolver the build uses:

```diff
+import { resolveSite } from '../../src/lib/site-origin.mjs';
+
-/** The canonical host this site claims. Everything absolute must agree with it. */
-export const CANONICAL_HOST = 'linkbot.org';
-export const CANONICAL_ORIGIN = `https://${CANONICAL_HOST}`;
+/**
+ * The canonical host this site claims, from the same resolver the build uses.
+ * Set SITE_ORIGIN to a production origin to assert against it. See
+ * docs/preview/README.md §3.
+ */
+export const CANONICAL_ORIGIN = (
+  process.env.SITE_ORIGIN ?? 'https://<final-domain>'
+).replace(/\/+$/, '');
+export const CANONICAL_HOST = new URL(CANONICAL_ORIGIN).host;
@@
 export function configuredSiteOrigin() {
-  const config = readText('astro.config.mjs');
-  const match = config.match(/site:\s*['"]([^'"]+)['"]/);
-  if (!match) throw new Error('astro.config.mjs declares no `site`');
-  return new URL(match[1]).origin;
+  return resolveSite(process.env).origin;
 }
```

`ALLOWED_EXTERNAL_HOSTS` already keys off `CANONICAL_HOST`, so dropping
`linkbot.org` there happens automatically. This branch's `src/` and `public/`
files introduce no new external host — verified against PR #6's own walker.

### 3.9 `tests/site-hardening/canonical-host.test.mjs` (PR #6) — two assertions

```diff
-test('astro.config.mjs declares the canonical host', () => {
-  assert.equal(configuredSiteOrigin(), CANONICAL_ORIGIN);
+test('astro.config.mjs derives the canonical host from the environment', () => {
+  assert.match(readText('astro.config.mjs'), /site:\s*site\.origin/);
+  assert.equal(configuredSiteOrigin(), resolveSite(process.env).origin);
 });
 
-test('SEO.astro fallback origin matches the configured site', () => {
+test('SEO.astro derives absolute URLs from Astro.site and keeps no domain fallback', () => {
   const seo = readText('src/components/SEO.astro');
-  const fallback = seo.match(/SITE_ORIGIN\s*=\s*['"]([^'"]+)['"]/);
-  assert.ok(fallback, 'SEO.astro must keep a single SITE_ORIGIN fallback constant');
-  assert.equal(new URL(fallback[1]).origin, configuredSiteOrigin());
+  assert.doesNotMatch(seo, /linkbot\.org/);
+  assert.match(seo, /Astro\.site/);
 });
```

### 3.10 `tests/site-hardening/robots.test.mjs` (PR #6) — one assertion

`the built robots.txt is byte-identical to the source file` fails against a
non-production build, because the guard replaces `dist/robots.txt` with
`Disallow: /` by design. Scope the byte-identity claim to production:

```diff
 test('the built robots.txt is byte-identical to the source file', async (t) => {
   const built = loadBuiltFile('dist/robots.txt');
   if (!built.ok) return t.skip(built.reason);
+  if (!resolveSite(process.env).indexable) {
+    // A non-production build intentionally replaces dist/robots.txt with a
+    // Disallow-all preview guard — see src/lib/preview-guard.mjs.
+    assert.match(built.text, /^Disallow: \/$/m);
+    return;
+  }
   assert.equal(built.text, robots, 'astro build copies public/ verbatim; divergence means a stale build');
 });
```

(`sitemap directive is absolute, on the canonical host and matches the configured
site` needs no edit once §3.2 and §3.8 land.)

### 3.11 `seo-head.test.mjs` / `structured-data.test.mjs` (PR #6) — https follows the origin

Both files assert `url.protocol === 'https:'`, which a local build correctly
violates: a localhost origin is `http://localhost:4321`. Two options, in order of
preference:

1. Run the suite against the decided domain:
   `SITE_ORIGIN=https://<final-domain> npm run build && node --test "tests/site-hardening/*.test.mjs"`.
   Then `https:` is implied by §3.8 and nothing further changes.
2. If it must also pass for a local build, assert the origin instead of the
   scheme/protocol pair:

```diff
-  assert.equal(url.protocol, 'https:');
-  assert.equal(url.host, CANONICAL_HOST);
+  assert.equal(url.origin, configuredSiteOrigin());
```

`structured-data.test.mjs` also hardcodes the canonical host in one expectation:

```diff
-  assert.equal(logo ?? image, `${CANONICAL_ORIGIN}/favicon.svg`, 'logo must be the brand mark, not the social card');
+  assert.equal(logo ?? image, `${configuredSiteOrigin()}/favicon.svg`, 'logo must be the brand mark, not the social card');
```

## 4. Measured reconciliation state

PR #6's suite was run on a scratch tree containing **PR #6's files overlaid on
this branch** (`SEO.astro`, `robots.txt`, `llms.txt`, `tests/site-hardening/`),
built locally with no `SITE_ORIGIN`:

| Tree | Suite | Result |
| --- | --- | --- |
| PR #6 alone (`origin/parallel/site-hardening-v1`) | `tests/site-hardening` | 44 tests, 42 pass, **0 fail** |
| This branch alone (`parallel/web-preview-foundation-v1`) | `tests/preview-smoke` | 32 tests, **32 pass** |
| Simulated post-merge | `tests/site-hardening` | 44 tests, 34 pass, **8 fail** |
| Simulated post-merge | `tests/preview-smoke` | 32 tests, 31 pass, **1 fail** |

The nine failures, each with the patch that closes it:

| Failing test | Cause | Patch |
| --- | --- | --- |
| `astro.config.mjs declares the canonical host` | helper regex cannot parse `site: site.origin` | §3.8 |
| `SEO.astro fallback origin matches the configured site` | same, plus the constant must go | §3.8, §3.9 |
| `sitemap directive … matches the configured site` | same helper | §3.2, §3.8 |
| `every absolute URL in source and public assets points at an approved host` | `linkbot.org` in the allowlist is now the wrong host | §3.8 |
| `the built robots.txt is byte-identical to the source file` | preview guard replaces the built file | §3.10 |
| `canonical URL is absolute, https and on the canonical host` | local build is `http://localhost:4321` | §3.11 |
| `og:image and twitter:image are the same absolute https asset that exists` | same | §3.11 |
| `every absolute URL and @id in the graph is https on the canonical host` | same | §3.11 |
| `Organization logo and image point at assets that exist` | hardcoded `https://linkbot.org/favicon.svg` | §3.11 |
| `non-production guard: previews are noindex, production is not` (this branch) | two contradictory robots metas in one head | §3.1 |

## 5. Launch gate

A build may be pointed at the real domain only when all of the following hold.
Until then, `SITE_ORIGIN` stays unset in production, which keeps production
non-indexable by design (`stage=deployment`, `indexable=false`).

- [ ] Final domain decided and owned, DNS controlled by the organisation.
- [ ] PR #6 merged **and** §3.1–§3.3, §3.5, §3.8–§3.11 applied.
- [ ] `SITE_ORIGIN=https://<final-domain> npm run build` passes
      `npm run smoke:dist` with **no** failures — including the two assertions
      that are currently gated on `indexable`.
- [ ] `npm run smoke:dist` once more with `PREVIEW_URL` set to the deployed
      production URL.
- [ ] `SITE_ORIGIN` set in Vercel for the **Production** environment only, then
      one production deploy, then `curl -sI https://<final-domain>/` confirms the
      canonical, the `Sitemap:` line and the JSON-LD all agree.
- [ ] The temporary shim (§3.7) deleted in the same change.
- [ ] `linkbot.org` re-checked once more before launch — the guard fails the build
      if it reappears anywhere in the origin chain.
