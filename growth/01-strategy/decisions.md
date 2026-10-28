# Decision Log — Open Decisions Before Execution

Each decision: context, options, recommendation, owner, deadline, and what it unblocks. Decisions are cheaper than launches; make them explicitly.

Status of everything else: draft-only. No decision below authorizes sending/publishing — each execution still needs the owner's explicit go.

---

## D1 — Pilot pricing: €149 30-day pilot vs €390 one-mandate Evidence Sprint (DECISION REQUIRED)

**Context.** Two conflicting draft proposals exist in the existing commercial inputs (documents themselves were not accessible in this environment `[Unknown]`):
- a product packet proposing a **€149 / 30-day pilot**, and
- a commercial packet proposing a **€390 / one-mandate "Evidence Sprint"**.

Neither has been sold to anyone. **Neither may be presented as validated pricing.** `[Repo fact: dispatch constraint]`

**Options.**

| Opt | Approach | Pro | Con |
|---|---|---|---|
| A | Pick €149 as the pilot price | Low friction; easy yes | May anchor the review layer as a cheap tool; underprices the evidence work |
| B | Pick €390 (one mandate) | Prices the deliverable, not time | Higher first-ask; may stall cold prospects |
| C | **Discovery first, then decide (recommended)** | Price discovered from 10 interviews; protects against anchoring on an internal guess | Slower; needs discipline to actually decide |

**Recommendation: C.** Run the 10-call validation sequence (`10-validation/first-customer-validation.md`), probe price acceptance with two frames (30-day pilot; single-mandate sprint), then take one price into live offers. Standalone rule for every conversation meanwhile: *"The pilot scope and price are being finalized; the first pilots get an agreed scope at a fixed price, in writing."* Never quote an unvalidated number as if it were a price list.

**Owner:** founder. **Deadline:** end of week 4 (after ≥10 qualified conversations). **Unblocks:** first paid offer; outreach message #1 final wording; case-study template wording.

---

## D2 — Product Hunt: launch the Talent experience, or the agency pilot first?

**Context.** PH features live, immediately usable digital products; waitlisted products may not be featured; services are excluded. The site currently says "Private beta" / "invitation" and the product UI is predominantly German with English listings. An agency pilot is a *service* — poor PH fit. `[Provider claim: PH featuring guidelines [3]; Repo fact: German UI note in m5.2 §2]`

**Options.**
- **A. Agency-first, PH later** — agency revenue path is direct-sales anyway; PH adds little for a DACH B2B service. `[Recommended]`
- **B. Talent-first PH launch now** — max 12k-visitor potential `[Hypothesis — no benchmark of our own]`, but access is invite-gated and the UI is German → high risk of a non-featured, low-value launch that burns the one credible launch moment.
- **C. Launch both** — no; ready-for-neither.

**Recommendation: A**, with a hard readiness gate (`06-product-hunt/launch-readiness-gate.md`). Talent PH launch happens only when: public access without invitation, a non-German first-run path exists, first value is reachable unaided, and analytics + support are live. Until then, prepare the package (drafted in `launch-package.md`) and keep it cold.

**Owner:** founder. **Re-evaluate:** weekly from week 5 against the gate. **Unblocks:** PH package scope; Talent acquisition sequencing.

---

## D3 — Where does the Talent CTA live (site surface)?

**Context.** Today the homepage's only CTA is "Request private access" (mailto form); there is no dedicated Talent page; the agency page exists in open PR #1. Growth copy drafts (`copy/landing-talent-de-en.md`) propose a `/talent` surface with a direct "start a search" CTA.

**Recommendation:** create a dedicated `/talent` route (or homepage section) whose primary CTA leads to the actual guest search (product URL), with the private-access form demoted to secondary. Route/ownership: coordinate with Agents C (SEO) and D (agency conversion); do not merge before PR #1 lands. **Owner:** founder. **Deadline:** week 3.

---

## D4 — Analytics: which instrumentation, whose consent layer?

**Context.** No analytics exists; the product added none deliberately. A privacy-first company cannot bolt on cookie-tracking by default.

**Recommendation:** (a) interim: manual weekly counts + UTM parsing where servers see referrers `[Unknown: what the deployment logs retain — verify with product owner]`; (b) target state: self-hosted, cookieless product analytics (e.g., Plausible/Umami-class) on the marketing site only, after privacy review; product-side events only after a consent/legitimate-interest review. Nothing installed without owner + privacy review. **Owner:** founder with product owner. **Deadline:** decision by week 2; implementation is out of scope of this folder.

---

## D5 — Reconcile the missing commercial inputs (merge, don't reinvent)

**Context.** The 20-prospect research, the 5 letter drafts and both packets were not available here. The system stands alone but must not fork from them.

**Recommendation:** before the first send: diff `08-outreach/agency-segmentation.md` against the original prospect research; replace any tracker rows; align letter drafts with `08-outreach/sequences-email.md`; register both price packets under D1. **Owner:** founder. **Deadline:** before week 2 outreach.

---

## D6 — Talent referral incentives: none (recommendation, confirm)

**Recommendation:** support functional sharing (own result, invite) **without rewards** for the first 8 weeks. Rewarded referrals invite spam behavior and platform-rule risk, and we cannot yet detect abuse. Revisit only with abuse controls. **Owner:** founder. **Confirm by:** week 4.
