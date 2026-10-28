# Font licences

Status: **reference register.** This is a licence accounting, not legal advice. Before any
font file is committed to a repository, the corresponding licence text must be committed with
it, and counsel should confirm anything customer-facing that this folder asserts.

---

## 1. Register

| Face | Designer / steward | Licence | Reserved font name | Source of truth | Verified in this task |
| --- | --- | --- | --- | --- | --- |
| **Inter** | Rasmus Andersson / Inter Project Authors | SIL OFL 1.1 | Yes ("Inter") | `github.com/google/fonts/blob/main/ofl/inter/OFL.txt` · `github.com/rsms/inter` | ✓ OFL text retrieved and read |
| **Fraunces** | Undercase Type (Phaedra Charles, Flavia Zimbardi) / Fraunces Project Authors | SIL OFL 1.1 | Yes | `github.com/google/fonts/blob/main/ofl/fraunces/OFL.txt` | ✓ OFL header retrieved |
| **JetBrains Mono** | Philipp Nurullin, Konstantin Bulenkov / JetBrains | SIL OFL 1.1 | Yes | `github.com/JetBrains/JetBrainsMono/blob/master/OFL.txt` | ✓ OFL header retrieved; JetBrains states free commercial use |
| **Space Grotesk** | Florian Karsten (from Space Mono, Colophon Foundry) | SIL OFL 1.1 | Yes | `fonts.google.com/specimen/Space+Grotesk` · `github.com/google/fonts` | ⚠ Google Fonts lists it in the OFL directory; the OFL file itself was **not** opened in this task — **verify before committing files** |
| **Public Sans** | US General Services Administration / Public Sans Authors | SIL OFL 1.1 | Yes | `github.com/google/fonts` (OFL directory) · `github.com/uswds/public-sans` | ⚠ Same — **verify before committing files** |
| **IBM Plex Mono** | Mike Abbink, Bold Monday / IBM | SIL OFL 1.1 | Yes | `github.com/IBM/plex` (`LICENSE.txt`) | ⚠ Same — **verify before committing files** |
| Helvetica Neue / Helvetica | Linotype / Monotype | **Proprietary** | n/a | Foundry licence required | ✓ Secondary sources confirm self-hosting requires a licence |
| Arial | Monotype | **Proprietary** | n/a | Foundry licence required | ✓ Secondary sources confirm |

**Note on the ⚠ rows.** These three faces are in the SIL OFL directory of the Google Fonts
repository and are described as OFL on their specimen pages, but this task did not open each
`OFL.txt`. Open the file at the source URL and commit it with the font before treating the
row as verified. Do not rely on this table alone.

## 2. What SIL OFL 1.1 requires (plain summary)

The obligations that affect how Linkbot ships fonts:

| # | Obligation | What it means for Linkbot |
| --- | --- | --- |
| 1 | The licence text must travel with redistributed font files | Commit `OFL.txt` next to every self-hosted font file; serve it or link it from the licence page |
| 2 | Fonts may not be **sold** by themselves | Irrelevant — Linkbot distributes software, not fonts |
| 3 | Fonts may be bundled, embedded and redistributed with software, including commercially | Self-hosting WOFF2 on linkbot.org is permitted |
| 4 | A **modified** version may not use the reserved font name | If a subset is generated, do **not** name it "Inter" — name it e.g. `Linkbot Sans Subset` and keep the original file for reference |
| 5 | Derivatives must stay under the OFL | A modified subset keeps the licence |
| 6 | The requirement does not extend to documents *created* with the fonts | Logos, OG images and PDFs produced with the fonts are unaffected |
| 7 | Attribution in the UI is **not** required | A licence/colophon page is good practice, not an obligation |

**Point 4 is the one that is easy to get wrong.** Subsetting to Latin + Latin Extended is a
modification. Ship the subset under a neutral name, or ship the unmodified file. The
`font-display` and `@font-face` CSS is outside the licence entirely.

## 3. What must be committed with a font implementation

```
public/fonts/<face>/
    <file>.woff2          the actual file (subset or unmodified)
    OFL.txt               the licence text, unmodified
    README.md             source URL, version, date retrieved, subset ranges used
```

Plus, in the repository:

- A `THIRD-PARTY-LICENCES.md` listing every face, its licence and its source URL.
- A generated file hashing each font file, so a substituted binary is detectable.

## 4. What is **not** covered by this folder

- **Logo and wordmark rights.** The marks and wordmarks in `../04-logo/` are original geometry
  authored in this repository. They are not registered trademarks. A trademark search for
  "Linkbot" and for the mark, in the relevant classes and jurisdictions, is a prerequisite
  before public use — recorded as decision D-07. This folder makes no trademark claim.
- **Imagery licences.** All imagery in `../07-imagery/` is generated geometry, so no
  third-party rights attach. Any future photograph or illustration needs its own register
  entry before it may be used.
- **Icon licences.** All icons in `../08-iconography/icons/` are original path geometry
  authored in this repository. No icon-library licence is relied upon.
- **The incumbent Helvetica stack.** Nothing in this folder grants a right to serve Helvetica
  Neue or Arial as a webfont. The current product reference works only because a viewer's
  operating system may already have the face.

## 5. Cost model summary

| Option | Recurring cost | Per-pageview cost | Self-hostable | Rendering consistency |
| --- | --- | --- | --- | --- |
| OFL faces, self-hosted (all three directions) | €0 | €0 | Yes | Identical on every platform |
| The current setup (Helvetica Neue via OS) | €0 | €0 | **No** | **Differs per OS** |
| The current site (Google Fonts CDN) | €0 | €0, but a third-party request on every visit | Avoidable | Consistent, but leaks a request to a third party from a privacy-positioned site |
| Commercial foundry, self-hosted | One-time licence per family, sometimes per site or per pageview tier | Depends on terms | Yes, per terms | Consistent |

**[Fact]** The first three rows all cost €0. The meaningful difference is therefore
self-hosting control and third-party requests, not money — and the third row is the one that
contradicts the positioning.
