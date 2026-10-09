# Font evaluation

Status: **PROPOSED.** Evaluated against Linkbot's actual requirements, not a generic taste
brief. A face is admissible only if it clears all four hard gates.

---

## 1. Hard gates

| Gate | Requirement | Why |
| --- | --- | --- |
| **G1 Licence** | SIL OFL 1.1 or equivalent permissive licence that permits self-hosting, commercial use and modification | The product cannot depend on a licence per seat or per pageview, and a privacy-claiming page should not make a third-party font request |
| **G2 Script coverage** | Full Latin, Latin Extended-A/B, German (`ä ö ü ß`, capital `ẞ`), plus French, Spanish, Italian, Polish, Czech, Dutch | DE and EN are both launch languages; EU customer bases bring the rest |
| **G3 Screen legibility** | Tall x-height, open apertures, unambiguous `1 l I`, `0 O`, `rn m`, tabular figures available | Receipts, versions, dates and codes are core content |
| **G4 Variable or wide weight range** | At least 300–700, ideally a variable axis | One file, one page load, and enough range to build hierarchy without a second face |

## 2. The shortlist, evaluated

| Face | G1 | G2 | G3 | G4 | Role it would take | Verdict |
| --- | --- | --- | --- | --- | --- | --- |
| **Fraunces** | OFL 1.1 ✓ | Latin, Latin Ext, DE ✓ | Display-only by design; low x-height at small sizes | Variable, incl. optical size 9–144 | Display (A) | **Adopt for A**, display only, ≥24px |
| **Inter** | OFL 1.1 ✓ | Very wide, incl. Cyrillic/Greek | Excellent; disambiguated `1 l I`, tabular figures, `ss01` alternates | Variable 100–900 | Text/UI (A, B) | **Adopt** |
| **JetBrains Mono** | OFL 1.1 ✓ | Latin, Latin Ext, incl. DE | Purpose-built for screen code; tall x-height, disambiguated glyphs, tabular by default | Variable | Utility, figures, states (A, B) | **Adopt** |
| **Space Grotesk** | OFL 1.1 ✓ | Latin, Latin Ext, incl. DE | Fine at display sizes; poor for long text | Variable 300–700 | Display (B) | **Adopt for B**, display only |
| **Public Sans** | OFL 1.1 ✓ | Wide, incl. DE | Designed for government legibility; clear at small sizes | Variable 100–900 | Display + text (C) | **Adopt for C** |
| **IBM Plex Mono** | OFL 1.1 ✓ | Very wide, incl. DE | Strong at all sizes; excellent tabular figures; pairs with a neutral sans | Static weights 100–700 | Utility (C) | **Adopt for C** |
| Newsreader | OFL 1.1 ✓ | Latin, Latin Ext | Editorial, high contrast; needs large sizes | Variable | Alternative display (A) | Rejected: Fraunces has the optical-size axis |
| Instrument Sans | OFL 1.1 ✓ | Latin, Latin Ext | Good, neutral | Variable | Alternative display (C) | Rejected: Public Sans has the institutional register |
| IBM Plex Sans | OFL 1.1 ✓ | Very wide | Strong | Variable | Alternative text (all) | Rejected: Inter's figures and hinting are better for dense UI |
| Source Sans 3 | OFL 1.1 ✓ | Very wide | Strong | Variable | Alternative text | Rejected: less distinctive than Inter at UI sizes |
| **Helvetica Neue / Helvetica** | ❌ **Proprietary** | — | Excellent | Static, OS-dependent | Current product display + body | **Reject**: cannot be self-hosted; renders differently per OS; licence required for webfont delivery |
| **Arial** | ❌ **Proprietary** (Monotype) | — | Adequate | Static, OS-dependent | Current product fallback | **Reject** for brand specification; acceptable only as an unmodified system fallback |
| SF Pro / SF Mono | ❌ Apple platform licence | — | Excellent | — | — | **Reject**: platform-locked, no web licence |
| Segoe UI / Consolas | ❌ Microsoft platform licence | — | — | — | — | **Reject**: platform-locked |
| Neue Haas Grotesk, GT Sectra, Söhne, Suisse Int'l | ❌ Commercial | ✓ | Excellent | varies | — | **Not evaluated for adoption**: a commercial foundry licence is a legitimate future choice, but it cannot be recommended in this folder because the cost, the seat terms and the webfont terms are unknown. Recorded as decision D-08. |

## 3. Substitution risk

| Risk | Mitigation |
| --- | --- |
| A display face renders differently in a rasteriser (OG card, PDF export) than in the browser | The OG templates declare an explicit fallback stack (`Georgia, "Times New Roman", serif` for A). Verify each template after rendering, and prefer outlined wordmark assets over live text in exports. |
| Inter is used for so much of the web that it reads as generic | Accepted for body text; the *display* face carries the identity in A and B. C accepts the trade deliberately. |
| A variable font renders differently on an older rasteriser | Ship a static fallback weight for the two or three weights actually used. |
| A future maintainer substitutes a proprietary system face "because it looks the same" | The token file names the face; a change to `--f-display` is a versioned brand change (`../12-governance/GOVERNANCE.md`). |

## 4. Recommendation

| Direction | Families | Total files (WOFF2, variable where available) | Page weight at first load |
| --- | --- | --- | --- |
| A | Fraunces · Inter · JetBrains Mono | 3 (all variable) | 3 requests, self-hosted, subset to Latin + Latin Ext |
| B | Space Grotesk · Inter · JetBrains Mono | 3 (all variable) | 3 requests |
| C | Public Sans · IBM Plex Mono | 2 (Public Sans variable, Plex Mono static ×2) | 2–3 requests |

Subset to **Latin + Latin Extended** plus the punctuation and figure ranges the UI actually
uses. Do not subset per-language at build time; ship one file that covers DE and EN.

**Decision required:** whether to accept OFL faces (recommended, free, self-hostable) or to
budget for a commercial foundry licence (D-08).
