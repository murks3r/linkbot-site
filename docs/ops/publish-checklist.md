---
type: reference
title: Publication checklist for the site (nothing published)
created: 2026-11-03
tags:
  - site
  - publication
  - domain
  - claims
related:
  - '[[truth-check]]'
  - '[[home-v3]]'
  - '[[site]]'
---

# Publication checklist

The steps that take this site from protected previews to its public address. **Nothing here is done yet and nothing is
published.** The name, the domain, the money for it and the go are the owner's; the Trust lane's publication gate comes
before the go. Everything else is prepared on this branch, so each owner value goes into one place.

Who acts: **O** the owner, **S** the Site lane, **T** the Trust lane. "Checked 2026-11-03" means it was tried on that day
on this branch, with the command named.

## 0. What the owner decides

| Value | Goes into | Today |
| -- | -- | -- |
| The public name | `PUBLIC_NAME` in `src/i18n/terms.ts` (one line, §2) | `Linkbot` (inside it stays Linkbot) |
| The domain, e.g. `example.com` (registering it costs money) | the Vercel project's domains (§3.2), DNS at the registrar (§3.3), `SITE_URL` (§3.4) | `sensalio.de` (owner, 2026-11-11), the default of `SITE_URL` |
| A mailbox on that domain (suggested `hallo@sensalio.de`) | `CONTACT_EMAIL` in the production environment (§3.5) | unset; footer and `/contact` say "in preparation" |
| Imprint and privacy text from counsel | `src/legal/imprint.ts`, `src/legal/privacy.ts` | "in preparation" |
| The licence of the open-core repository and its publication | `OPEN_CORE_REPO_URL`, the docs' "Not published yet" note (§7) | private, licence not chosen |
| The go | merge to `main`; the production deploy | after the Trust gate |

## 1. Merge order (S, then O)

1. **`build/vision` is in this line.** Its status renewal (#83, `41c9fb5`: widget `0.6.1-v1`, `STATUS_CHECKED`
   2026-11-03) was merged into `next/publish-ready` on 2026-11-03 in the line's words ("test space", "test instance",
   no "staging" or "Geoprocure" on a public page; Trust T-PUB finding 1). If `build/vision` moves again, merge it in
   again before the publication.
2. **The `next/*` line in order:** landing v2 → site demo → home v3 → readable for AI → developer docs → this branch
   (each PR is based on the one before). The developer-docs PR already holds the docs drafts (login, a new vertical,
   prepare a request). The access, intermediaries and fund-fix PRs go into `build/vision` on their own. The rehearsal
   of this order is `docs/ops/merge-order-after-v1.md` on `next/integration-rehearsal`.
3. **Status within 14 days.** `tests/status.test.mjs` fails once `STATUS_CHECKED` is older than 14 days. On the day of
   publication, read the test space's health report again and renew the status sentences (`docs/truth-check.md`,
   pre-merge step 1 of the `build/vision` → `main` PR); the day itself is one line, `STATUS_CHECKED` in
   `src/i18n/status-date.ts`. The changelog's states too (`docs/changelog.yml`, row `changelog.states`).
4. `npm run typecheck`, `npm run build`, `npm test`; then the CI run on the final head of the PR into `main`
   (`CLAUDE.md`: CI only at a milestone).

## 2. The public name: one line (S, once O names it)

- `PUBLIC_NAME` in `src/i18n/terms.ts` is read by: the home (title, description, sub-line, demo), the FAQ (questions,
  answers, schema.org FAQPage), the terms and their DefinedTermSet, `llms.txt` (built from `src/llms/llms.txt`, `{name}`
  put in by `src/pages/llms.txt.ts`) and so the head of `llms-full.txt`, the site name in header, footer, `og:site_name`,
  the share images and schema.org (Organization, WebSite, SoftwareApplication, BreadcrumbList), the footer's "… in one
  page" link and the contact note. `tests/name.test.mjs` fails where one of those sources writes the name out.
- **Checked 2026-11-03:** a build with `PUBLIC_NAME = 'Probename'` showed the old name nowhere in the visible text of
  `/`, `/de`, `/faq`, `/fr/faq`; `llms.txt` opened with `# Probename`; the FAQ's schema.org questions read "Für wen ist
  Probename?". The constant was set back to `Linkbot`; the built `llms.txt` is byte for byte the old file.
- **Done 2026-11-11 (Sensalio, owner 2026-11-10):** `PUBLIC_NAME = 'Sensalio'`; every page's own copy reads the
  constant (catalogues, front copy, drafts, the site's Markdown and the changelog via `{name}`), and `tests/name.test.mjs`
  now reads every source and every built page and `llms-full.txt`. Left as written: code identifiers (`window.Linkbot`,
  the `Linkbot-*` headers, package names), Connect's code samples, the legal entity (`LEGAL_NAME = 'Linkbot OÜ'`, schema.org
  `legalName`, until the register entry) and the developer docs under `/developers/docs`, which are Connect's export:
  they rename when that export does.
- Code identifiers, repository and package names stay Linkbot (owner, 2026-11-03).

## 3. Domain switch (O, then S)

| # | Step | Value | Who |
| -- | -- | -- | -- |
| 3.1 | Register the domain | `<domain>` | O |
| 3.2 | Vercel, project of this repository → Settings → Domains: add `<domain>` and `www.<domain>`; set `www.<domain>` to redirect (308) to `<domain>` | `<domain>`, `www.<domain>` | O |
| 3.3 | DNS at the registrar: the records Vercel shows in step 3.2. Vercel's documented defaults are an `A` record for the apex to `76.76.21.21` and a `CNAME` for `www` to `cname.vercel-dns.com`; use the values the dashboard shows for this project | as shown | O |
| 3.4 | Vercel → Settings → Environment Variables, **Production only**: `SITE_URL=https://<domain>` (no trailing slash). Not on Preview: previews keep the default and Vercel's login | `https://<domain>` | O |
| 3.5 | Vercel → Environment Variables, Production only: `CONTACT_EMAIL` (read by `src/lib/contact.ts`); then reword the contact rows of `docs/truth-check.md` (done in code on 2026-11-11: no placeholder domain is left) | `contact@<domain>` or as named | S |
| 3.6 | Redirect from `linkbot-site.vercel.app` (§4), in the same PR as 3.5 | snippet below | S |
| 3.7 | After the deploy: `curl -sI https://<domain>/` → 200; `curl -s https://<domain>/ \| grep canonical` → `https://<domain>/`; `curl -s https://<domain>/robots.txt` names `https://<domain>/sitemap-index.xml`; `curl -sI https://linkbot-site.vercel.app/faq` → 308 to `https://<domain>/faq` | | S |

**`SITE_URL` from the environment: done.** `astro.config.mjs` reads `SITE_URL`; the canonical links, the language
alternates, `og:url`, `og:image`, schema.org, the sitemap and `robots.txt` derive from it; `llms.txt` links relatively.
Without it the origin is `https://sensalio.de` (owner, 2026-11-11); setting `SITE_URL=https://sensalio.de` in
Production anyway keeps the origin explicit. A preview keeps the same canonical links, which is right: it is behind
Vercel's login and not indexed.
**Checked 2026-11-03:** `SITE_URL=https://linkbot-domain-tbd.invalid npx astro build` → 136 pages; no file in `dist/`
names `linkbot-site.vercel.app`; `dist/de/faq.html` has `canonical` and `og:image` on the env origin; 140 sitemap
entries on it; `robots.txt` points at its sitemap and `llms.txt`.

## 4. Redirect from linkbot-site.vercel.app (S, with 3.5)

`linkbot-site.vercel.app` is the public production name of the same Vercel project (`docs/handover/site.md` §2). Once
`<domain>` serves production, add to `vercel.json` (not before: today it would send every visitor to an address that
does not exist):

```json
"redirects": [
  {
    "source": "/:path*",
    "has": [{ "type": "host", "value": "linkbot-site.vercel.app" }],
    "destination": "https://<domain>/:path*",
    "permanent": true
  }
]
```

Previews have other host names and are not redirected. Checked 2026-11-03: `linkbot-site.vercel.app` answers 200 (the
holding page of `main`).

## 5. Share images, 404, 500 (done)

- **Share images per language: done.** Every page in every language names its own `og:image` (`/og/<lang>/<page>.png`,
  1200 × 630), drawn after the build from that page's `og:title`, `og:description` and `og:site_name`
  (`src/integrations/share-images.ts`, `src/lib/share-card.ts`); a page whose card cannot be drawn stops the build.
  Checked 2026-11-03: 136 images for 136 pages. They follow `SITE_URL` and `PUBLIC_NAME` with the next build.
- **404: done.** `src/pages/404.astro` → `dist/404.html`, in English, with a link to each language's home; Vercel serves
  it for every missing address.
- **500: not built, on purpose.** The site is fully static (`output: 'static'`, no route renders on demand, no
  function), so no code of this site can answer 500; a platform failure shows Vercel's own page, and a `500.html` would
  never be served. Revisit only if a server route is added.

## 6. Final Lighthouse and axe run (S, on publication day)

1. **The preview is protected.** `curl -s -o /dev/null -w '%{http_code} %{redirect_url}\n' <preview-url>/` must answer
   `401` or a redirect to Vercel's login, and `curl -sI <preview-url>/` must carry `x-robots-tag: noindex`.
   **Checked 2026-11-03** on this line's preview (developer docs): `302` to Vercel's SSO login, `x-robots-tag: noindex`.
   The preview's address is in the Vercel bot's comment on the PR (`docs/handover/site.md`, Vercel).
2. **Access for the run.** The owner creates a "Protection Bypass for Automation" secret in the Vercel project
   (a credential: the owner's; kept in the shell's environment as `VERCEL_BYPASS`, never in the repo or a chat).
3. **Lighthouse, mobile (its default), on the preview:**
   `npx lighthouse <preview-url>/ --only-categories=performance,accessibility,best-practices --extra-headers="{\"x-vercel-protection-bypass\":\"$VERCEL_BYPASS\"}" --output=html --output-path=./lh-home.html`
   for `/`, `/de`, `/faq`, `/developers`, `/developers/docs`. **SEO on the production build instead**
   (`SITE_URL=https://<domain> npm run build && npm run preview`), because the preview's `noindex` lowers the SEO
   score by design. Budgets (owner's plan): performance ≥ 95, accessibility 100, best practices 100, SEO 100,
   LCP < 1.8 s, CLS < 0.02, home JS ≤ 90 KB gzip. Last measured: `docs/front/home-v3.md` (2026-11-03, local).
4. **axe** on the same pages: `npx @axe-core/cli "<preview-url>/?x-vercel-protection-bypass=$VERCEL_BYPASS&x-vercel-set-bypass-cookie=true" --exit`
   (zero violations), and the repo's own WCAG audit on `dist/`: `npm run test:browser` and
   `SITE_SCHEME=dark npm run test:browser` (`docs/handover/site.md`, browser tests).
5. Reports go to the PR into `main`, not into the repo.

## 7. Final claim table

Every sentence that states a fact has a source. On publication day each row is read again against the product of that
day (`docs/truth-check.md`, owner 2026-10-23); a row that is no longer true changes its sentence before the merge.

| Pages | Where the claims and their sources are listed | Last checked | Re-read on publication day |
| -- | -- | -- | -- |
| Catalogue pages (how it works, who sees what, for platforms, integrations, verticals, developers, status, changelog, one page, request a demo, contact, imprint, privacy), five languages | `docs/truth-check.md` (one row per catalogue key) | 2026-11-03 on `build/vision`; 2026-10-26 on the `next/*` line (§1.1) | every row with a status sentence: the health report's contract, widget release, mail adapter |
| Home `/` (v3), five languages | `docs/front/home-v3.md`, claim table | 2026-11-03 | sub-line stays TODAY until company checks run (`src/front/hero.ts`); the owner switches FULL |
| `/faq`, five languages | the table below | 2026-11-03 | the open-source and hosted answers; the first space |
| `/developers/docs` (English) | `src/content/open-core/SOURCE.json` (Connect's export, commit named there), `tools/sync-open-core-docs.mjs` | 2026-11-03 | sync again from the export's newest commit; remove "Not published yet" only when the repository is public |
| `llms.txt`, `llms-full.txt` | the sentences above; `llms-full.txt` is the built pages' own text | 2026-11-03 | follow from the pages |
| schema.org | `src/components/SEO.astro`: name, address and the definition from `src/i18n/terms.ts` only; no legal name, founding date, address, logo or price | 2026-11-03 | add those only with the owner's confirmed values |

**The FAQ's claims** (English source `src/faq/en.ts`; every language says the same):

| Question | Claim | Backed by (rows in `docs/truth-check.md`) |
| -- | -- | -- |
| What is it? | Three steps: a check of each side, a private match, an introduction only when both say yes; a platform embeds it, one space per market | how.confirm, how.matching, how.yes; home.pillars[0] |
| What problem does it solve? | Being seen costs something in B2B trade; it confirms each side and shows only criteria and verdicts, never name or contact, until both say yes | how.confirm, how.sees, how.yes |
| How does "both say yes" work? | Board card without names; a named person approves and the approval reveals nothing; each side answers alone; names and email addresses only after both yes; a no reveals nothing; the server refuses every other way | how.describe (board), how.approval, how.yes, how.introduction |
| What does it check? | Today only the email address, confirmed by link; nothing stored before confirm; company checks planned, not built | how.confirm; the owner's note of 2026-11-02 |
| What is open source and what is hosted? | Nothing published as of the status date; the repository is private, the SDK not on npm; the plan; licence not chosen; hosted access for others coming soon | developers.lede, how.today (later) |
| Who is it for? | Platforms and their buyers and suppliers; one script and one element; the first space is industrial minerals, a test instance with synthetic data, no real person or organisation yet | site.synthetic, platforms.embed, verticals.first |

## 8. Not in this package

No DNS, no domain, no Vercel setting, no environment variable and no deploy were changed for it; no page was published.
