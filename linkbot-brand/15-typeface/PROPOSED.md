# PROPOSED — Linkbot Type v0.1.0 · **NOT APPROVED**

> Original type designs for Linkbot: Display, Sans and Mono. This is a recommendation
> for the owner to accept, amend or reject. **No face here is approved**, no font is a
> production master, and no runtime file consumes them.

---

## 1. What is being proposed

| # | Proposal | Scope if accepted |
| --- | --- | --- |
| **T1** | Adopt **Linkbot Sans** (Regular/Medium/Bold) for product UI, job content and filters | A restyle task on the product, not this branch |
| **T2** | Adopt **Linkbot Display** (Regular/Bold) for marketing and editorial headings | Marketing surface; replaces the licensed display face |
| **T3** | Adopt **Linkbot Mono** (Regular/Bold) for code, receipts, versions and structured evidence | Developer documentation and receipt components |
| **T4** | Adopt the **type-derived wordmark** and retire the interim monoline concept | Replaces `14-experiences/logo/wordmark.svg`; needs a trademark re-check |
| **T5** | Keep the OFL stack behind every face as the declared fallback | Independent of T1–T4; already implemented |

## 2. Why an original typeface, on the evidence

1. **The Brand OS could not finish the identity without it.** [Fact] Its wordmark was
   monoline geometry precisely because no typeface existed to outline from, and its
   licence gap was that the product served a proprietary Helvetica stack that renders
   differently on every operating system. An owned face closes both.

2. **The family is one construction, not three fonts.** [Fact] All three roles are the
   same centrelines — the same arches, bowls and diagonals — evaluated at different
   x-heights, widths and stroke widths. That is mechanical, not stylistic: it is why
   they cohere, and it is verifiable in `scripts/glyphset.py`.

3. **It is genuinely original and it is checkable.** [Fact] Letterforms are generated
   from primitives by a stroker authored here; there is no source face, no outline
   import, no subset of someone else's drawing. The evidence and the method are in
   `design/licensing-and-originality.md`.

4. **It gives the product a typeface that behaves.** [Fact] Figures share one width
   everywhere, so receipts and versions align without a `tnum` feature; the monospaced
   face has a single 600-unit advance; ambiguous shapes (`1 l I`, `0 O`) and the German
   set are covered by the gate rather than by hope.

5. **It survives the product truths.** [Fact] No glyph asserts verification: the check
   mark is a glyph in a font, and the design notes state plainly that it must not be
   used as a verified badge (C3). Square dots and flat-cut terminals carry the identity
   without borrowing the trust iconography the product forbids.

## 3. What acceptance would and would not mean

**Would mean:** a usable, owned type system with three roles and a wordmark derived from
it, a reproducible build, and a fallback path that is already wired.

**Would not mean:** that the fonts are finished. They are a **validated prototype**:
not hinted, not reviewed by a type designer, not print-proofed, with two glyphs flagged
as approximations and a documented list of uncovered characters. Acceptance of T1–T4
implies a schedule for that work, not that it is done.

## 4. Confidence, and what would change it

**Confidence: good** that the family coheres and that the build is reproducible — both
are computed and re-checked by the gate. **Low** that the design is finished enough to
ship: that judgement belongs to a type designer who has not yet seen it.

What would change the proposal:

- A type designer finds the Display contrast too shallow at heading sizes → the
  contrast axis is one parameter (`w_h/w_v`), so it can be pushed without redrawing.
- The square dots read as a gimmick in UI text → the dot shape is one helper
  (`sq()`), so it can be changed family-wide in one place.
- Ampersand and at are judged unacceptable → they are isolated glyphs; commissioning
  two drawings is cheaper than commissioning a family.
- A commercial face is preferred after all → the token system is unaffected: it names a
  family, and the family is one line in `14-experiences/00-shared/fonts.css`.

## 5. Decisions this leaves open (owner)

| ID | Decision | Recommendation |
| --- | --- | --- |
| **Y-01** | Accept Linkbot Sans as the product UI face (T1) | Accept in principle; schedule the prototype work first |
| **Y-02** | Accept Linkbot Display for marketing (T2) | Accept; it is the strongest of the three |
| **Y-03** | Accept Linkbot Mono for code and receipts (T3) | Accept |
| **Y-04** | Adopt the type-derived wordmark (T4) | Adopt after a **fresh trademark search** — the mark geometry is unchanged but the wordmark is a new drawing |
| **Y-05** | Commission a type designer to take the family to production | **Recommended before any external use** |
| **Y-06** | Decide whether ampersand and at are drawn properly or replaced | Draw them; they are two glyphs |
