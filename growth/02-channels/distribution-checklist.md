# Distribution Checklist (pre-flight / per-channel)

Use before anything goes out. "Owner" = founder unless delegated in writing. Nothing in this folder is authorized to publish itself.

## 1. Universal pre-flight (every asset, every channel)

- [ ] **Status line present**: "DRAFT — not sent/published" removed only after owner approval.
- [ ] **Proof labels audited**: every number is `[Repo fact]`/`[Fact]`/`[Provider claim]`/`[Hypothesis]`. No invented traction, no comparative superiority.
- [ ] **Claims review**: privacy/consent wording matches the shipped product reality (no "nothing reaches a server", no "no identity data exists", no "E2E encryption").
- [ ] **Link hygiene**: one canonical URL per asset; UTM per `09-measurement/utm-conventions.md`; no PII in URLs; no shorteners.
- [ ] **Asset rights**: images/screenshots are ours or licensed; synthetic demos labelled "Interaktive Demo mit fiktiven Daten / interactive example, synthetic data"; no provider job-text republishing.
- [ ] **Names/people**: no real candidate, client or employee named without written permission; anonymize by default.
- [ ] **DE/EN check**: correct language per audience (Agency→DE default, Talent→EN default); machine-translated text reviewed by a human.
- [ ] **Mobile check**: rendered on a 375px viewport before publishing.
- [ ] **Owner sign-off recorded** (date + initials in the log at the end of this file).

## 2. Channel-specific gates

### LinkedIn (founder/company)
- [ ] Personal account (company accounts can't do everything a person can; posting as a person is the norm). `[Provider claim]`
- [ ] No automation tools connected; no scheduled connector posts that bypass review; no engagement pods.
- [ ] For any demo screenshot: synthetic-data label visible in the image itself.
- [ ] Comment plan for first 2 h after posting (who to reply to; how).
- [ ] UTM applied; measure qualified visits, not likes.

### Blog (site)
- [ ] Editorial gate passed (`05-blog/editorial-architecture.md` § QA): ≥1 primary measurement or ≥3 attributable sources; Sources block rendered; date + retrieval dates correct.
- [ ] Schema/canonical/OG fields handed to Agent C's component (interface, not edit).
- [ ] Internal links resolve; CTA link points at the intended product action.
- [ ] Refresh date set (quarterly) in the article footer metadata.

### Reddit
- [ ] **Live rules re-check done today** for that exact subreddit (sidebar + pinned posts) — archived snapshots in `07-reddit/community-research.md` are not sufficient on their own.
- [ ] Post/comment genuinely helps standalone; can it stand with the product link removed? If not, rewrite.
- [ ] Affiliation disclosed if product is mentioned ("I work on Linkbot, a …").
- [ ] Link allowed? (rules text quoted; if unsure → no link).
- [ ] No cross-post blasts; no vote requests; no DM follow-ups to thread participants.

### Newsletter
- [ ] Double opt-in flow verified working; unsubscribe visible; sender identity (Linkbot OÜ, Tallinn) in footer.
- [ ] Personal data processing referenced per privacy policy; no bought/imported lists.
- [ ] One clear action; UTM applied.

### Product Hunt (when gate green)
- [ ] `launch-readiness-gate.md` fully green, dated.
- [ ] Personal maker profile aged ≥1 week `[Provider claim]`; co-makers added before launch day.
- [ ] Gallery assets final; first comment drafted; FAQ ready; support person scheduled for the full day.
- [ ] Distribution message says "visit and comment", never "upvote". Share list built from people who genuinely opted in.
- [ ] UTM `utm_source=producthunt`; measurement plan set (visits, signups, first-value, feedback themes).

### Agency outreach (email/LinkedIn)
- [ ] Legal review completed for the specific message set + jurisdiction (UWG §7 sensitivity in DE). `[Owner task — do not send before]`
- [ ] Recipient qualifies under the reconciled segmentation (agency, DACH, plausible fit); no private/scraped contact data — sources noted per row.
- [ ] Message personalized with a real, specific observation; opt-out line present; sender identified.
- [ ] Recorded in the tracker (don't double-contact; capture replies for the pipeline dashboard).

## 3. Post-send discipline (all channels)

- [ ] Reply window staffed: LinkedIn 2 h; email 48 h; Reddit next 24 h; PH full launch day.
- [ ] Log the send in `09-measurement/dashboards.md` pipeline sheet (date, channel, asset, UTM, owner).
- [ ] Any hostile/negative response: no defensiveness; single factual reply, then stop. Escalate privacy concerns immediately (stop the channel).

## Sign-off log

| Date | Asset | Channel | Approved by | Notes |
|---|---|---|---|---|
| — | (none yet) | — | — | — |
