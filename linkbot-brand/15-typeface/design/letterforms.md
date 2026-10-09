# Letterforms — every design decision, glyph by glyph

Status: **PROPOSED.** This is the record of what was drawn and why. It includes what is
wrong, because a design record that only lists strengths is marketing.

---

## 1. The five family decisions

### 1.1 Single-storey `a` and `g`

The family is geometric, not neo-grotesque. `a` is a bowl attached to a straight stem;
`g` is a bowl with a straight descender and a flat hook. This is the decision that puts
the family in the same lineage as the geometric sans tradition rather than the grotesque
one, and it is visible in every word.

### 1.2 Square dots

The dot of `i` and `j`, and the period, comma, colon, semicolon, exclamation mark,
ellipsis and every diacritic dot are **squares**, not circles. The square is the mark's
inscribed square; carrying it into the type is what ties the typeface to the logo without
drawing the logo into the font.

The dot is a square of 1.12 × the stem width at the x-height plus 1.42 × the stem width.
It is built as a single stroke of length equal to its width, with a butt cap, so it is an
exact square rather than a rounded rectangle that only looks square at one size.

### 1.3 Flat-cut terminals

Every stroke ends in a butt cap. There are no rounded terminals anywhere in the family.
Where an end is visible — `c`, `e`, `s`, `a`, `f`, `r`, `t`, `y`, `j`, `C`, `G`, `S`,
`J`, `2`, `3`, `5`, `6`, `9` — the cut angle was chosen per glyph rather than inherited
from the stroke, which is why the apertures read consistently across the family.

### 1.4 Octagonal apexes

`A`, `V` and `W` do not come to a point. Each vertex carries a short flat — an 18-unit
horizontal segment at cap height or at the baseline — so the apex is a truncation rather
than a spike. That flat echoes the octagon of the mark, and it is also a practical
decision: a truncated apex holds its weight at 12 px where a point disappears.

### 1.5 One contrast axis

Horizontal-to-vertical stroke ratio: 0.60 (Display), 0.95 (Sans), 1.00 (Mono). See
`type-system.md` §2.

## 2. Constructions worth recording

**The arch.** `n`, `h`, `m` and the shoulders of `b`, `d`, `p`, `q` all use one
construction: a circular arch whose radius is exactly half the distance between the two
stem centrelines, so the arch's endpoints land on the stem centrelines and its tangents
are vertical where it meets them. The arch is swept 14° past each junction so its ink
overlaps the stem.

**The trough.** `u` and `U` use the same construction mirrored, so the two letters are
geometrically related rather than separately drawn.

**The bowls.** `a`, `b`, `d`, `g`, `p`, `q`, `D`, `P`, `R`, `B`, `U`, `ß` and `ẞ` attach
an open half-bowl to a stem. The bowl's endpoints land exactly on the stem's edge, so the
counter is formed by the union of the strokes and no counter ever crosses other ink.
That is why this family needs no boolean overlap removal: the geometry is arranged so
the problem cannot arise. The only true counters are the rings of `o`, `O`, `0`, `6`,
`8` and `9`, and those are rings with their inner contour wound the other way.

**The S spine.** `S` and `s` are one connected path — an upper sweep, a diagonal, a lower
sweep — not two bowls. Two independent bowls both open on the same side and read as a `C`
with a bar through it, which is exactly what the first build produced.

**The dollar.** `$` reuses the S spine with a bar through it, so the currency sign belongs
to the same family as the letter.

## 3. Glyphs that are approximations, and are flagged as such

| Glyph | State | Note |
| --- | --- | --- |
| `&` ampersand | **First-pass approximation** | An upper loop, a lower bowl and a leg. Recognizable in context, not a proper ampersand drawing. |
| `@` at | **First-pass approximation** | Two concentric rings and a bar. Reads as an at sign at text sizes; crude at display sizes. |

Neither is hidden. They are isolated glyphs; commissioning two drawings is cheaper than
commissioning the family again.

## 4. Glyphs the family deliberately does not draw

A check mark exists as a glyph (`✓`, U+2713) because a font needs one for tables and
lists. **It must not be used as a verified badge**, as a trust mark, or as an
affirmation of an employer, a candidate or a record. The product's four states are
carried by four distinct silhouettes — a closed square, a triangle, a ring and a filled
dot — plus the state word, never by a check. See
`../../00-audit/product-truths.md` C3.

## 5. Kerning

39 pairs, authored rather than derived, compiled to GPOS. The set covers the pairs this
family specifically needs: the diagonals interacting with each other and with flat-sided
letters (`AV`, `AW`, `AT`, `AY`, `VA`, `WA`, `TA`, `YA`, `LT`, `LY`, `PA`, `FA`), the
diagonals against round letters (`Ta`, `Te`, `To`, `Ya`, `Yo`), the flat-cut `r`, `v`,
`w` and `y` against punctuation (`r.`, `r,`, `v.`, `w.`, `y.`), and the bowled letters
against diagonals (`ov`, `ow`, `bv`, `hv`, `nv`, `fo`, `ta`).

The monospaced faces carry no kerning, deliberately: kerning a fixed advance breaks the
grid that makes a code face a code face.

## 6. Why the wordmark is drawn by the typeface

`wordmark/` contains `Linkbot` and `LINKBOT` as outlines extracted from Linkbot Display
Bold, spaced with the font's own kerning data. Two reasons:

1. The wordmark and the type are the same drawing, so they cannot drift apart.
2. The Brand OS could only ever offer monoline geometry as a concept, because there was
   nothing to outline from. Outlining from a face this project owns makes the wordmark a
   master rather than a concept.

The lockups match the mark's final stroke to the wordmark's stem after both scale
factors: Display Bold's stem is 150 units, the wordmark scale is 0.142857, and the mark
scale is 3.4722, giving a mark stroke of 6.171 in lockup units.
