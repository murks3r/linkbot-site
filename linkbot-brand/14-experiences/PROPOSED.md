# PROPOSED — Brand Experiences v0.1.0 · **NOT APPROVED**

> Three experience themes inside one master identity. This is a recommendation for the
> owner to accept, amend or reject. **No theme and no identity here is approved.** No
> runtime file may consume it, and no asset in this folder is a production master.
>
> Consistent with Brand OS v0.1.0: this folder **does not re-open the direction choice.**
> Direction A (Notarial) is taken as the owner's chosen direction and its mark geometry is
> carried over unchanged. What is new here is the *architecture* that lets one identity
> serve three audiences without becoming three companies.

---

## 1. What is being proposed

| # | Proposal | Scope if accepted |
| --- | --- | --- |
| **E1** | Adopt the **shared/override split** as the contract: 27 shared primitives + exact role names + one type system + one spacing/radius/motion set, with per-experience overrides limited to ground, accent and density | A future implementation task. Enforced today by `scripts/validate_experiences.py` |
| **E2** | Adopt the **five experience screens** as the reference layout set | Requires the typeface from `15-typeface/` and a real product surface to implement |
| **E3** | Admit **`#ABABA1`** as `border-decorative-strong` and **`#ABEBA1`** as `marker`, both shared-layer | Independent of E1/E2. Both are decorative; neither carries meaning alone |
| **E4** | Keep **one shared logo system** and forbid per-experience logo variants | Independent. Closes the "three companies" risk structurally |
| **E5** | **Do not** replace Experience B's phosphor accent with `#ABEBA1` yet | The evidence is recorded; the swap is the owner's call, not this branch's |

## 2. Why one master identity, three experiences — on the evidence

1. **The audit's real gap was structural, not cosmetic.** Brand OS v0.1.0 found two
   unrelated identities and no canonical logo. Three *separate* brands would reproduce
   that gap three times. [Fact] The shared layer is what prevents it, and it is now a
   checked invariant rather than a style guide paragraph.

2. **A/B/C map onto genuine differences in the audience, not in the company.** [Fact] The
   product truths describe one product with one authority model; Talent, Developer and
   Employer/Agency are three *views* of it. A different ground and a different accent
   express register; a different logo or type system would express a different company.

3. **The distinctness the owner asked for is real but bounded.** The developer experience
   opens on ink with the phosphor register, the Talent experience on warm paper, the
   employer/agency experience on neutral light. That is a visible difference on first
   paint — and it costs nothing in coherence because nothing else moves.

4. **Accessibility is closed by construction, not by review.** [Fact] Every required pair
   is recomputed from the emitted JSON: 17 pairs × 3 experiences × 2 modes, plus the
   suggested-colour matrix. The derivation caught a real defect during the build — a
   control border reused from a decorative rule measured 2.44:1 on the porcelain surface.
   It is now a **derived** token (`#8B8B8B`) that clears 3:1 on every light surface.

5. **One neutral ink and one dark-ground family across all three.** [Fact] A, B and C all
   use `#14161A` for text on light and the same midnight family for dark. That single
   decision does more for "one company" than any amount of shared spacing.

## 3. What acceptance would and would not mean

**Would mean:** a working contract for three experiences, a checked shared layer, a
reference layout set, and two new colours with their permitted roles fixed.

**Would not mean:** permission to restyle the live site or the product in this branch;
that any asset is a production master; that `#ABEBA1` replaces phosphor; that the German
copy is reviewed; or that any claim in the screens is approved product copy.

## 4. Confidence, and what would change it

**Confidence: good** on the token architecture and the accessibility result — both are
computed. **Low** on the layout set as production-ready, because no real product surface
has been restyled.

What would change the proposal:

- The owner wants the three experiences to look *more* different → move the accent
  **and** the type register per experience, accepting three font builds. Not recommended:
  it re-creates the original two-identity defect.
- The employer and agency audiences turn out to need different grounds → split C into
  C1/C2 as two overrides of one theme, not two identities.
- A product-side constraint forbids a dark-first experience B → B opens light and the
  Protocol register moves into the docs typography alone.

## 5. Decisions this leaves open (owner)

| ID | Decision | Recommendation |
| --- | --- | --- |
| **X-01** | Accept the shared/override split (E1) | Accept; it is already enforced |
| **X-02** | Accept `#ABABA1` / `#ABEBA1` in their decorative roles (E3) | Accept; evidence in the contrast report |
| **X-03** | Swap Experience B's phosphor for `#ABEBA1`, or keep phosphor (E5) | **Keep phosphor** for now; `#ABEBA1` is recorded as the lower-neon alternative |
| **X-04** | Approve the five screens as the reference layout set (E2) | Approve the *structure*, not the copy |
| **X-05** | Commission the German review and the trademark search (carried from Brand OS D-07/C7) | Both still open |
