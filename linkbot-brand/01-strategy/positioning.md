# Positioning and brand architecture

Status: **analysis + PROPOSED direction framing.** No identity is approved. Tags as in
`00-audit/brand-audit.md`.

---

## 1. The one-sentence position

> **Linkbot is the permissioned layer between a private career record and the employers who
> ask to see a specific part of it.**

[Fact] Every clause is supported: "private eligibility", "permissioned matching", the
disclosure/receipt/revocation contract, and the absence of any party-enumeration route.

**What it is not** (and should never drift into): a recruiter database, a job board, a public
profile host, an ATS, a pool, a scoring engine, a verified-identity service.

## 2. Why the category position is genuinely open

The recruiting-software category is visually saturated. Three conventions cover almost all
of it:

| Convention | Who occupies it | Consequence for Linkbot |
| --- | --- | --- |
| Friendly SaaS gradient (blue/purple, rounded cards, illustration) | Job boards, ATS vendors | Signals "another hiring tool" and cheapens the consent claim |
| Dark cyber-security (near-black, neon accent, shield/lock iconography) | Privacy and security tooling | **[Hypothesis]** Implies threat defence and verified identity the product cannot claim (C1, C3); the strongest temptation and the most dangerous |
| Editorial/official (serif, dense rules, document-like) | Legal, public-sector, standards bodies | Almost unused in recruiting — and it is the register the product actually behaves in |

[Fact] The incumbent marketing site currently takes the second convention (dark, neon
`signal` green, grid texture). [Hypothesis] That choice contradicts the product's own
documented rejection of trust badges and simulated activity, and it puts Linkbot's
communication in the same visual family as products that promise security scanning.

## 3. Brand architecture: one platform, three experiences

The product is one platform with three role-bound experiences. The brand has to make that
legible without inventing three sub-brands.

```
                    LINKBOT  (master brand — one identity, one mark, one type system)
                        │
      ┌─────────────────┼─────────────────┐
      │                 │                 │
   TALENT           EMPLOYER / HR        AGENCY
   the holder       the requester        the mandate
      │                 │                 │
   Your record      Bounded requests    Introductions
   is yours         with receipts       with evidence
```

**Rule:** one identity, three *message* profiles — never three logos, never three palettes.
A Talent and an employer compare notes; if the two surfaces look like different companies,
the consent story collapses.

### 3.1 The two application modes inside one identity (PROPOSED)

The audit found that the shipped product is pure monochrome with no radii and dashed rules,
while the marketing site is dark, colourful and rounded. Any direction that ignores this will
be silently rejected by engineering. The PROPOSED framing therefore defines two modes of one
identity — not two identities:

| Mode | Where it applies | Behaviour |
| --- | --- | --- |
| **Record** | Marketing, long-form, social, documents, founder communication | Editorial voice: display serif, paper ground, the brand accent used freely and confidently |
| **Workspace** | Talent onboarding, employer workspace, agency mandate view, any product surface | Product discipline preserved: monochrome ground, dashed 1px structural rules, no radii, uppercase utility labels; the accent appears only for an authority/granted state |

The wordmark is identical in both modes. The mark is identical. Only the register changes.

## 4. Audience jobs and brand promises

| Audience | The job they arrive with | The promise the brand must make credible | Never promise |
| --- | --- | --- | --- |
| **Talent** | "Is my career being read by people I did not choose?" | Your record is yours; every disclosure is bounded, receipted and revocable for the future | Anonymity, encryption, invisibility |
| **Employer / HR** | "Can I reach the right person without buying a database?" | You may request a specific bounded signal from someone who declared it; every read is recorded | A browsable pool, a ranked shortlist, a verified profile |
| **Agency** | "Does this replace my process or sit beside it?" | It sits beside your ATS and CRM; one mandate, several evidenced introductions | An ATS adapter, a pool import, a predictive score |

## 5. Brand personality

| Dimension | Linkbot is | Linkbot is not |
| --- | --- | --- |
| Tone | Precise, calm, adult | Chatty, enthusiastic, salesy |
| Certainty | Says what it knows, names what it does not | Confident where it should be uncertain |
| Humour | Dry at most; rare | Meme-led, pun-driven |
| Imagery | Structure, rules, records, gates | People-as-data, padlocks, shields, robots |
| Enemies | Exposure without consent; aggregation | Named competitors |
| Proof | Receipts, versions, expiry, audit | Badges, counters, testimonials with numbers |

**[Hypothesis]** The single most defensible personality move available is *refusing to
over-claim*. Every competitor's copy inflates; Linkbot's can visibly not. That is a
distinctive asset and it is free.

## 6. What success looks like for the brand system

1. **Distinctiveness** — a Linkbot page is identifiable with the logo removed, and it does
   not look like job-board blue or security-tool neon.
2. **Coherence** — the marketing surface and the workspace read as one company while keeping
   their different registers.
3. **Accessibility** — every text and control pair passes WCAG 2.1 AA by computation, and no
   meaning depends on colour alone.
4. **Maintainability** — one token file drives web, product and marketing; a change is a
   version bump, not a hunt through stylesheets.
5. **Reuse** — one mark, one wordmark, one type system produce the favicon, the app plate,
   the OG card, the slide and the workspace header from the same sources.

## 7. Explicitly out of scope

- No new vertical, no non-recruiting proposition, no second product line (C8).
- No repositioning of Linkbot as a security, identity-verification or compliance vendor (C1, C3).
- No commercial numbers, pilot results or market-size claims.
- No naming or renaming of product surfaces; navigation wording belongs to the product.
