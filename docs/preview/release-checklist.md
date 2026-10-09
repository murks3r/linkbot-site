# Release checklist — before this site is pointed at a public domain

Technical readiness is not launch readiness. This is the list of things the
repository cannot answer by itself; each item is written so it can be verified or
refused, not just discussed.

Legend: **[Fact]** observed in the repository or the live deployment at the time of
writing · **[Hypothesis]** asserted but not verified · **[Blocker]** must be
resolved before the site is indexed under a real domain.

## 1. Real contact handling [Blocker]

**[Fact]** The only contact route is `mailto:hello@linkbot.org`, in two places in
`src/pages/index.astro` (:139 the access form's `action`, :194 the footer link).
**[Fact]** `hello@linkbot.org` is on a domain the organisation does not own —
`linkbot.org` currently serves a domain-parking page. **[Fact]** The form is
`method="post" enctype="text/plain"`, i.e. it hands the visitor's content to
whatever mail client they have configured.

Checklist:

- [ ] Decide the receiving mailbox on a domain the organisation controls. Fill in
      §3.4 and §3.5 of [domain-migration.md](./domain-migration.md).
- [ ] **[Blocker]** Do not publish an address on an unowned domain. Until
      `linkbot.org` is either owned or abandoned, every access request containing
      a name, an email address and a career intent is addressed to a mailbox that
      either bounces or — if someone else registers the domain — is delivered to a
      third party. That is a personal-data disclosure, not a broken link.
- [ ] Decide whether `mailto:` is the real transport. It does not work for
      webmail-only visitors, it silently fails on mobile in several browsers, and
      it cannot acknowledge receipt or record consent. The page promises "We
      reply personally within a few days" and "no marketing list, no automated
      drip" — a real endpoint (form service, ticket inbox, or the application's
      own API once available) is the only way to keep that promise verifiable.
      Whatever is chosen: the destination must be under the same
      consent/privacy rules as the product.
- [ ] Verify end to end: submit the form from a clean browser profile, confirm the
      message arrives, and confirm the sender receives no reply-to address on the
      unowned domain.
- [ ] Confirm the copy stays true after the change — "Replies come from a real
      human at Linkbot OÜ" must remain accurate.

## 2. Social raster assets [Blocker for link previews]

**[Fact]** `public/og.svg` is a 1200×630 SVG and is the only social card.
**[Fact]** PR #6's own suite records the raster requirement as a known gap: its
test `the social card is served in a format link-preview crawlers render` is
marked `todo` with the note that SVG is not rendered by Facebook/X/LinkedIn/
WhatsApp. **[Fact]** `public/` contains exactly one image asset pair:
`favicon.svg` and `og.svg`. There is no `.ico`, no `apple-touch-icon`, and no
square logo ≥112×112 — PR #6 also tracks the logo requirement.

Checklist:

- [ ] Export `og.png` (1200×630, PNG or WebP) from the existing `og.svg` artwork
      and point `SEO.astro`'s default `image` at it, keeping the declared
      `og:image:width`/`height`/`type` in step with the asset.
- [ ] Add the square logo asset (≥112×112, PNG) and use it for the JSON-LD
      `logo`, keeping the 1200×630 card as the page `image`.
- [ ] Add `apple-touch-icon` (180×180 PNG) and a favicon fallback for browsers
      without SVG favicon support.
- [ ] Re-render and re-verify: `npm run smoke` asserts the declared dimensions
      match the asset and that the referenced path exists; PR #6's suite asserts
      the declared MIME type matches the format.
- [ ] Check the card renders in the actual unfurlers once deployed — at minimum
      X, LinkedIn and WhatsApp, on a preview URL, before changing production.

## 3. Domain ownership [Blocker]

**[Fact]** `linkbot.org` resolves to `http://ww19.linkbot.org/`, a parking page —
not owned. **[Fact]** The production deployment (`linkbot-site.vercel.app`, one
Production deployment from `main`) advertises
`<link rel="canonical" href="https://linkbot.org/">`. **[Fact]** `vercel.json`
attaches no domain, and the final public domain is undecided.

Checklist:

- [ ] Choose the domain, register it, and confirm registrar + DNS control are held
      by the organisation (not an agency, not a contractor's personal account).
- [ ] Decide explicitly what happens to `linkbot.org`: it must not be re-acquired
      as a deployment target by accident, and it must not be cited as canonical
      anywhere (the build refuses it — `resolveSite` throws).
- [ ] Enable renewal protection and registrar lock on the chosen domain; add an
      owner and a renewal calendar entry. A lapsed primary domain is the same
      failure as never owning it.
- [ ] Set `SITE_ORIGIN` in Vercel for the **Production** environment only, after
      the merge list in [domain-migration.md](./domain-migration.md) §5 is done.
- [ ] Before the first indexed production build: `SITE_ORIGIN=https://<domain>
      npm run build && npm run smoke:dist` must pass with zero failures.
- [ ] After the deploy, verify the canonical, the `Sitemap:` line and the JSON-LD
      all name the new domain, and confirm the old `*.vercel.app` deployment URL
      serves `X-Robots-Tag: noindex` (a branch-alias rule already does; check the
      production alias deliberately and decide whether it should too).

## 4. Truthful claims [Blocker]

**[Fact]** The site makes specific identity and capability claims. Each needs an
owner who can confirm it is true as published:

| Claim | Location | Verified? |
| --- | --- | --- |
| `legalName: 'Linkbot OÜ'`, registered in Tallinn, Estonia | `SEO.astro` JSON-LD, `index.astro` FAQ + footer | **No** — confirm the registry entry and the exact legal name |
| `foundingDate: '2024'` | `SEO.astro` | **No** |
| "Identity is verified" / "Eligibility is private" / "Matching is permissioned" | hero footer triple | **No** — these are product claims; confirm the shipped behaviour matches |
| "Private beta", invitation-led, "small first cohort", "groups of roughly 20" | `index.astro` §access + FAQ, `llms.txt` §Status | **No** — a cohort size is a factual claim |
| "An API is in private testing" / "We will not expose endpoints that could bypass the consent layer" | FAQ, `llms.txt` | **No** — and it is a constraint the application must actually enforce |
| "We reply personally within a few days" / "no automated drip" | §access | **No** — an operational commitment |
| "Operated by a small team across Europe and Africa" | FAQ, `llms.txt` | **No** |
| "A profile is no longer a page. It is a continuously mined dataset." and the exposure/scraping claims | §problem | Argument, not a factual claim — no action |
| `© 2026 Linkbot OÜ · Tallinn, Estonia` | footer | Confirm the entity is active and the year is current |

- [ ] One named owner signs off each row, or the copy changes.
- [ ] Anything unverifiable at publication comes out. A privacy-first position
      loses all of its value the first time a claim does not hold.
- [ ] Re-check after the merge: PR #6 rewrites the structured data, so identity
      fields and the contact block must be re-confirmed in the new form.

## 5. Privacy [Blocker]

**[Fact]** The site collects name, email and a free-text intent through the access
form, and states "We do not share your information."
**[Fact]** There is no privacy notice, no terms, and no cookie notice anywhere in
the repository — `src/pages/` contains only `index.astro`.
**[Fact]** The only third-party runtime request is Google Fonts
(`fonts.googleapis.com` / `fonts.gstatic.com`, preconnected and stylesheet-linked
in `src/layouts/BaseLayout.astro`). **[Fact]** No analytics, tag manager or other
third-party script exists. **[Fact]** The site sets no cookies of its own.
**[Hypothesis]** Serving fonts from Google's CDN transmits each visitor's IP
address and user agent to Google; for a site whose entire proposition is
"privacy-first", that is a contradiction regardless of the legal reading.

Checklist:

- [ ] Publish a privacy notice and link it from the footer. GDPR Art 13 requires
      it **at the point of collection** — i.e. next to the access form — for an
      EU-established controller (`Linkbot OÜ`, Estonia).
- [ ] The notice must name: controller and contact, what is collected (name,
      email, stated intent), purpose, lawful basis, retention period, processors
      involved (mail provider, hosting, any form service), and the data-subject
      rights and how to exercise them. "We do not share your information" is a
      promise, not a notice.
- [ ] Decide the routing question in §1 before writing retention into the notice —
      where access requests land determines who the processors are.
- [ ] Self-host the fonts (or use a system-font stack). It removes the only
      third-party request on the page, makes the "nothing is indexed / nothing is
      shared" positioning consistent, and needs no cookie banner. `BaseLayout`
      already preconnects them; removing the preconnects and the stylesheet is the
      whole change.
- [ ] If any cookie or identifier is introduced later, add a consent mechanism
      before it ships — the site currently has none and no place to put one.
- [ ] Confirm the product-side claims in §4 ("Nothing is indexed", "you decide for
      how long") are true in the application, not only in the copy. A marketing
      site cannot be compliant with a claim the backend contradicts.
- [ ] Note that Vercel sets `_vercel_sso_nonce` when Deployment Protection is
      active. That is Vercel's own cookie on protected deployments, not a site
      cookie; it must be reflected in the notice if previews are shared publicly.

## 6. Basic analytics [Blocker for the choice, not for launch]

**[Fact]** There is no analytics of any kind in the repository, and no consent
banner. **[Hypothesis]** The first analytics choice will be made by whoever wants
funnel numbers — decide it now, against the privacy position, rather than
retro-fitting consent later.

Checklist:

- [ ] Choose an approach that is consistent with the privacy notice:
      cookieless, EU-hosted, no cross-site identifiers, no session replay of form
      input. Vercel Web Analytics is the lowest-friction option because hosting is
      already there — check its processing location and data-transfer position
      before adopting it, and record the decision either way.
- [ ] Instrument only what is needed for the launch question: page views and the
      access-request conversion (form submit / mailto click). Nothing on this site
      currently reports a conversion, so "did the site work" is unanswerable
      today.
- [ ] **Gate it on the environment.** Non-production builds must not report into a
      production dataset — a preview firing events doubles counts and leaks
      fixture traffic. Use the resolver's existing flag, available in any layout:
      `resolveSite(process.env).indexable` is `true` only for a real production
      build, and the same value already drives the `noindex` guard and the
      non-production banner.
- [ ] Add the analytics host to the smoke suite's external allowlist in
      `tests/preview-smoke/output.test.mjs`, and to PR #6's
      `ALLOWED_EXTERNAL_HOSTS` in `tests/site-hardening/helpers.mjs` — both fail
      closed on an undeclared external reference, on purpose.
- [ ] If a consent banner is needed after all, it must not block the page behind
      the 3D scene, and its copy must match the notice in §5.
