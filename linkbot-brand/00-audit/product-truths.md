# Product truths the brand may not break

These are constraints extracted from the normative product documents, not brand opinions.
Every claim, specimen and template in this folder is checked against this list. If a future
brand change needs to violate one of them, the change is wrong — not the constraint.

Sources: `docs/launch-mvp/m5-product-contract.md`, `docs/contracts/private-state-v1.md`,
`docs/adr/011-private-intent-foundation.md`, `docs/launch-mvp/coherent-product-design.md`,
`docs/launch-mvp/product-hierarchy-correction.md`,
`docs/launch-mvp/talent-visual-system.md` in `murks3r/linkbot`; and `docs/agency-acquisition.md`
on the agency branch of `murks3r/linkbot-site`.

---

## 1. Semantic non-negotiables (verbatim intent)

| # | Rule | Brand consequence |
| --- | --- | --- |
| T1 | Opportunity ≠ bilateral Match | Never use "match" for a one-sided result. Use "opportunity", "candidate", "request". |
| T2 | Talent interest ≠ employer interest, disclosure or contact permission | Never imply that interest opens contact. |
| T3 | Disclosure ≠ Application; Application ≠ employer interest or bilateral Match | Three separate words, three separate states. |
| T4 | Unknown ≠ fulfilled | UNKNOWN is a first-class rendered state, never blank, never green. |
| T5 | No automatic or batch application; no automatic contact | No copy implying bulk apply or bulk outreach. |
| T6 | Disclosure requires explicit per-action authorisation or an explicit bounded, versioned standing mandate | The word "automatic" is only permissible next to a named, inspectable, revocable policy version. |
| T7 | A standing mandate authorises disclosure only | It never means application, employer interest, contact permission or a Match. |
| T8 | Revocation stops future access; it must not claim delivered copies were erased | Never write "deleted", "erased", "recalled" for a revocation. |
| T9 | External listings remain at their original source; Linkbot does not control the recipient or application path | Never show a native apply button for an external listing. |
| T10 | Matching alone never grants disclosure authority | A result is not a permission. |
| T11 | Unknown versions/purposes/evaluators/domains are denied — fail closed | UI must be able to render "refused", not only "empty". |
| T12 | Absent is unspecified; null is unknown; false is false; zero is zero; denied skills are explicit negatives | Do not collapse absent and unknown into one visual state. |

## 2. Claim prohibitions

| # | Prohibited | Source |
| --- | --- | --- |
| C1 | End-to-end encryption, anonymity, zero-knowledge matching | ADR 011: "Do not claim E2EE, anonymous or zero-knowledge matching." The current release computes plaintext on the server. |
| C2 | Blockchain, token, DID registry, wallet, seed phrase, custom cryptography | ADR 011 §Deliberately deferred — deliberately absent. |
| C3 | "Externally verified identity" as a blanket claim | ADR 011: no `CredentialAdapter` is configured; confirmed records are `user_attestation`, "not externally verified". State the specific verification, or state none. |
| C4 | Aggregating, indexing or reselling public profile data | ADR 011: no party-enumeration route exists. |
| C5 | Full-profile browsing by employers | Employer access is role-bound; the shared payload excludes email, phone, raw CV, provider claims and inferred qualification (`m5-product-contract.md`). |
| C6 | A predictive hiring score | `docs/agency-acquisition.md`: ordering "is **not** a predictive hiring score". |
| C7 | Pilot scale, conversion or commercial results that are not recorded | The documented pilot is 3–5 Talents and 1–2 employers with zero participants. |
| C8 | Non-recruiting verticals as live | "Recruiting remains the launch wedge and the only enabled production vertical" (ADR 011). |

## 3. What the product genuinely is (safe to say)

- A permissioned matching layer for recruiting, operated by Linkbot OÜ, Tallinn, Estonia.
- The holder owns a private, versioned record; the employer requests a specific bounded
  signal; the holder decides; the disclosure is receipted and revocable for future use.
- Employer access is membership- and role-bound, with its own workspace and receipts.
- Results distinguish confirmed, proposed and unresolved statements; rejected statements are
  omitted and unresolved ones are never upgraded.
- A portable owner export of private state exists (`GET /me/private-state/export`), and it
  is explicitly **not** a complete server backup and **not** an encrypted vault.
- An API exists in private testing and will not expose endpoints that bypass the consent layer.

## 4. Agency-specific truths (from the agency branch)

- Linkbot sits **alongside** an agency's existing ATS and CRM; it is not an ATS adapter, a
  pool import, a matching engine replacement or a messaging service.
- One mandate → several bounded introductions.
- Requirements render as **met / unknown / unmet**. A hard `unmet` blocks the action; an
  `unknown` is shortlisted **for verification**, never displayed as verified.
- The pilot scope is proposed and requires agreement; timings, terms and authorised data
  sources are not settled.
- Demonstration content is illustrative and must be labelled as such.

## 5. Employer / HR truths

- You request; the person decides. There is no pool to browse and no unsolicited contact.
- The workspace shows only what was authorised for that membership, for that purpose, at
  that policy version.
- Every authorised read is recorded in that side's history.

## 6. Talent truths

- Nothing is published, scraped or quietly indexed. There is no public profile URL.
- Context entry is optional and skippable; a proposed interpretation is not a confirmed
  fact, and confirming context does not publish a profile, authenticate a guest or create
  sharing authority.
- Submitting an application is a separate, explicit act from sharing a signal.

## 7. Brand consequences that follow (design decisions, not product decisions)

1. **Four states need four visual carriers**, not four colours: confirmed, proposed,
   unresolved/unknown, denied. Colour alone is insufficient (WCAG 1.4.1) and the product
   requires the distinctions to survive greyscale and colour blindness.
2. **A "refused" state must be renderable** in the same family as "empty" (T11).
3. **No decorative trust iconography.** Shields, padlocks, verified badges and star ratings
   would assert verification the product does not perform (C3) and were explicitly rejected
   in `coherent-product-design.md` ("Rejected generic score cards, fabricated counters,
   green trust badges and dashboard tiles").
4. **Receipts, versions and expiry are brand-level objects**, not back-office details. They
   are the evidence that makes the positioning true, so they deserve deliberate typography.
5. **The word "private" is load-bearing and must stay specific.** "Private" describes where
   the record lives and who decides; it must not drift into "anonymous", "encrypted" or
   "invisible" (C1).
