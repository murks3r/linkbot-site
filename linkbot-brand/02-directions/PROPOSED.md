# RECOMMENDATION — **PROPOSED, NOT APPROVED**

> ## Direction A — **Notarial**
>
> **Status: PROPOSED.** This is a recommendation for the founder to accept, reject or amend.
> It is **not** an approved identity. No runtime file may consume it, nothing here may be
> published as Linkbot's brand, and no asset in this folder is a production master.
>
> Acceptance is recorded in `../13-approval/approval-checklist.md`. The open questions are
> `../13-approval/founder-decision-sheet.md`.

---

## 1. What exactly is being proposed

Three separable proposals. The founder may accept some and reject others; they are listed
this way on purpose. Only **P1** is the identity recommendation.

| # | Proposal | Scope of the change if accepted |
| --- | --- | --- |
| **P1** | Adopt **Notarial** as the identity: paper-led editorial Record mode for marketing, the shipped monochrome discipline retained as Workspace mode for product | A future implementation task, not this branch. Requires new fonts, a restyle of the marketing surface, and a mark in the product header |
| **P2** | Adopt the **mark + monoline wordmark** as the canonical logo assets, and adopt the four-state evidence vocabulary | Can be done independently of P1. Fills a real gap: **no canonical logo file exists today** |
| **P3** | Adopt the **OFL type system** and the **DTCG token file** as the single source for colour, type, spacing and motion | Independent of P1 and P2. Removes the remote-font dependency and the Helvetica stack, and gives one place to change brand values |

## 2. Why A, on the evidence

1. **Distinctiveness is the brief's first criterion, and it is the one A wins outright.** The
   audit found the competitive set is covered by friendly-SaaS gradients, dark security neon,
   and job-board blue. A recruiting brand that presents as a *record* is unclaimed territory,
   and the product's own rejected list (score cards, trust badges, simulated activity) rules
   out most of the conventional alternatives anyway.

2. **The identity is derived from the differentiator, not applied to it.** Linkbot's product
   advantage is that decisions are bounded, versioned, receipted and revocable. Notarial makes
   those artefacts the visual centre: ruled structure, tabular figures, an impression as the
   mark, receipts as first-class typography. A competitor could copy the palette; copying the
   palette would not mean anything without the same product behaviour.

3. **It keeps the product's discipline instead of fighting it.** The Workspace mode of A is
   explicitly the shipped product's language — monochrome, dashed 1px rules, no radii,
   uppercase utility labels. A is therefore a *superset* of what already exists, which is why
   it is realistic to adopt. The serif is confined to the surfaces where distinctiveness pays.

4. **It closes the audit's accessibility defect by construction.** A's muted text token is
   computed at 6.01:1 (vs the incumbent 3.51:1 at 50% opacity), all 16 required pairs are
   verified, and both colour modes exist. The defect cannot reappear accidentally because the
   value is a token, not an opacity applied at the call site.

5. **It is the strongest licensing position.** Three OFL faces, self-hostable, no pageview
   cost, no per-seat dependency, full German coverage — and it removes the proprietary
   Helvetica stack from any surface that needs to be served as a webfont.

6. **It gives UNKNOWN an honest, quiet home.** Of the four states, Unknown is rendered in the
   dimmest, least assertive treatment. That is a *brand* decision that encodes T4.

## 3. Why not B or C — stated plainly

**Not B (Protocol).** B is a well-built system and its mandate-table application is genuinely
the best of the three. It is set aside for one strategic reason: a near-black surface with a
phosphor accent is the category's default for security and privacy tooling. Adopting it would
put Linkbot in a visual family whose members routinely claim scanning, verification and
encryption — the exact claims the product cannot make (C1, C3). B also measures worst on the
small-size mark and carries a two-value accent.

**Not C (Commons).** C is the most accessible, cheapest to maintain and closest to the shipped
product — and it scores within one point of A overall. It is set aside on distinctiveness
alone: the brief's first optimisation target is distinctiveness, and C's honest weakness is
that a competitor could occupy the same visual space without anyone noticing. **If the founder
weights adoption safety and maintainability above distinctiveness, C is the correct choice and
this recommendation should be overturned** — that is a legitimate trade, not a mistake.

**The C-inside-A compromise is already part of the proposal.** A's Workspace mode *is* C's
principles: light-first, open-ruled, minimal radii, no decoration. C is not discarded so much
as confined to product surfaces, where it is the right answer.

## 4. The brand architecture being proposed

```
LINKBOT — one master brand, one mark, one wordmark, one type system
│
├─ RECORD MODE      marketing · long-form · social · documents · founder comms
│                   paper ground, Fraunces display, seal accent
│
└─ WORKSPACE MODE   talent onboarding · employer workspace · agency mandate
                    monochrome ground, dashed rules, no radii, Inter + mono
                    seal accent reserved for an authority/granted state
```

The wordmark and mark are identical in both modes. Only the register changes.

**Evidence-vocabulary layer** (applies in both modes): four states, each with a colour, a
distinct glyph, and a mandatory text label.

## 5. What acceptance would and would not mean

**Would mean:** a direction exists to design against; the mark, wordmark, tokens and type
system are the reference; future site/product work builds on these artifacts.

**Would not mean:** permission to restyle the live site or product in this branch; that the
assets are production masters; that any new public claim is approved (see the audit §4 claims
still need decisions D-01 to D-04); that the choice is irreversible.

## 6. Confidence and what would change it

**Confidence: moderate-to-good** on the strategic reasoning, **low** on real-world adoption
without a visual prototype in the actual product.

What would change the recommendation:

- A product-side constraint that makes a serif on marketing surfaces unacceptable while the
  workspace stays monochrome → then **C**.
- The founder weighting distinctiveness below integration cost → then **C**.
- Evidence that the audience is predominantly non-technical agency buyers who read serif
  editorial as "legal/compliance" and therefore as slow → then **C**, with B's mandate table.
- A decision to unify site and product into one surface → then the two-mode architecture
  collapses and **C** becomes clearly correct.

## 7. Next steps if accepted (a separate task, not this branch)

1. Founder decisions D-01 … D-09 in `../13-approval/founder-decision-sheet.md`.
2. Trademark search on the mark and wordmark before any public use.
3. Commission or outline the production wordmark master; retire the concept file to
   `superseded/`.
4. Implement the token file in the product stylesheet as a first, reversible step
   (`--ink: #000000` → token-driven monochrome), proving the token layer with no visual change.
5. Restyle the marketing surface to Record mode; keep the product in Workspace mode.
6. Publish a licence bundle with the self-hosted fonts and the OFL texts.

Nothing in steps 1–6 is performed by this branch.
