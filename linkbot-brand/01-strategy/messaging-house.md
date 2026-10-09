# Messaging house

Status: **PROPOSED.** Every line is checked against `00-audit/product-truths.md`.

---

## 1. The house

```
                    ┌──────────────────────────────────────────────────┐
                    │  PRIVATE ELIGIBILITY, NOT PUBLIC EXPOSURE        │  ← the position
                    └──────────────────────────────────────────────────┘
       ┌──────────────────────┬──────────────────────┬──────────────────────┐
       │  TALENT              │  EMPLOYER / HR       │  AGENCY              │
       │  You hold the record │ You ask, they decide │ Beside your process  │
       ├──────────────────────┼──────────────────────┼──────────────────────┤
       │ Bounded disclosure   │ Request, not browse  │ One mandate, N       │
       │ Receipt + revocation │ Role-bound access    │  introductions       │
       │ Nothing indexed      │ Recorded reads       │ met / unknown / unmet│
       └──────────────────────┴──────────────────────┴──────────────────────┘
                    ┌──────────────────────────────────────────────────┐
                    │  PROOF LAYER  receipts · versions · expiry ·     │
                    │  authority · UNKNOWN made visible                │
                    └──────────────────────────────────────────────────┘
```

**Master message:** *Your career history is yours. Its disclosure is your decision.*

**Proof, not adjectives:** the brand never argues that it is trustworthy. It shows the
receipt, the policy version, the expiry and the fields that were released.

## 2. Message by audience

### Talent

| Level | Line | Check |
| --- | --- | --- |
| Headline | Your career should not be a public attack surface. | Safe: describes the problem, not a capability. Currently live. |
| Sub | Linkbot replaces public exposure with permissioned, private eligibility. | Safe: "permissioned" and "private" are both implemented. |
| Body | You hold a private, versioned record. An employer asks for one bounded signal — eligible for senior engineering, willing to relocate, available in 90 days. You decide. | Matches the confirmed-field candidates in M5; keeps the example fields to the documented allowlist. |
| Proof | You can see who asked, what they asked for, the policy version, and whether it was automatic or manual. You can stop future access. | Matches the mandated inspectability list. |
| Prohibited | "Anonymous", "encrypted", "invisible", "unfindable", "delete your data everywhere". | C1, T8. |

### Employer / HR

| Level | Line | Check |
| --- | --- | --- |
| Headline | You ask a specific question. A person decides whether to answer. | T2, T10. |
| Sub | No pool, no scraped inventory, no unsolicited outreach. | T5, C4, C5. |
| Body | Your membership is role-bound. You see only what was authorised for that purpose at that policy version, and every read is recorded. | Matches role-bound membership and receipt/read history. |
| Proof | A disclosure is not an application, and an opportunity is not a match. | T1, T3, verbatim. |
| Prohibited | "Access 10,000 vetted candidates", "AI-ranked shortlist", "verified profiles", "instant hire". | C3, C5, C6. |

### Agency

| Level | Line | Check |
| --- | --- | --- |
| Headline | Your process, plus permission. | Positions beside ATS/CRM, not against it. |
| Sub | Take one mandate. Work it with introductions that carry their own evidence. | Matches the one-mandate pilot and the evidence-led journey. |
| Body | Each requirement renders as met, unknown or unmet. A hard unmet requirement blocks the action. An unknown requirement is shortlisted for verification — never shown as verified. | Verbatim from the agency specification. |
| Proof | Ordering comes from hard failures, unresolved requirements and preferred evidence. It is not a predictive hiring score. | Verbatim. |
| Prohibited | "Replace your ATS", "predictive ranking", "guaranteed placements", "shortlist in minutes". | C6, agency boundaries. |

## 3. Claim tiers (what needs what before it may be published)

| Tier | Definition | Approval needed | Examples in this folder |
| --- | --- | --- | --- |
| **A — Structural** | Describes the implemented contract | None beyond product docs | "An opportunity is not a match." "Revocation stops future access." |
| **B — Product capability** | Describes a feature that exists but is gated | Product owner confirms the gate wording | "An API is in private testing." |
| **C — Quantitative / pilot** | Any number about users, scale, results | Founder + evidence | "Groups of roughly 20" — **currently unsupported**, see audit §4.2 |
| **D — Prohibited** | Cannot be made truthfully today | Never | E2EE, anonymity, verified identity, predictive score |

Only tiers A and B may appear in marketing copy without a new approval.

## 4. Vocabulary substitutions (enforced)

| Do not write | Write instead | Why |
| --- | --- | --- |
| Match (for a one-sided result) | Opportunity / candidate / request | T1 |
| Profile | Record (private) or signal (requested) | "Profile" carries the public meaning the product rejects |
| Apply automatically / auto-apply | Request one disclosure for this opportunity | T5 |
| Anonymous / encrypted / private network | Private record, bounded disclosure, explicit authorisation | C1 |
| Verified identity / verified profile | Confirmed by the holder / externally verified *(only where a credential adapter actually returned evidence)* | C3 |
| Deleted / erased / recalled (after revocation) | Future access stopped | T8 |
| Browse candidates / talent pool | Request a signal / shortlist for verification | C5 |
| Score / ranking / fit score | Evidence, requirements met/unknown/unmet, ordered by hard failures | C6 |
| Pending | Proposed *(for a statement)* or Unknown *(for a missing value)* — never one word for both | T4, T12 |
| Saved | Held privately *(until the explicit save actually happens)* | product-hierarchy-correction |

## 5. Message discipline for the three-surface rollout

1. **Site** leads with the problem and the position (Record mode).
2. **Product** leads with the current task and shows state honestly (Workspace mode). No
   marketing copy inside the workspace beyond the surface's own job.
3. **Agency page** leads with the mandate and evidence, and labels every demonstration as
   illustrative.

## 6. What we deliberately do not say about ourselves

- We do not call Linkbot a platform, network, ecosystem or marketplace in customer-facing
  copy unless a specific sentence needs it; "platform" is scaffolding, not a promise.
- We do not compare to named competitors.
- We do not use urgency, countdowns, scarcity or "limited beta spots" framing. The current
  site already says "We open the door in small groups, by invitation" — that register is
  right; a counter would be wrong.
