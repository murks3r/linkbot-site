# Fonts — temporary stand-ins for three typography roles

The prototype never names a typeface in a component. It uses three **roles**
(`--font-display`, `--font-sans`, `--font-mono` in `src/css/tokens.css`), which
`src/css/fonts.css` maps to the files in this folder.

| Role | CSS family | Stand-in file(s) | Source font | Licence |
| --- | --- | --- | --- | --- |
| Display | `Role Display` | `display-500.woff`, `display-600.woff` | Inter Display 4.0 | SIL OFL 1.1 |
| Sans (reading) | `Role Sans` | `sans-400.woff`, `sans-500.woff`, `sans-600.woff` | Inter 4.0 | SIL OFL 1.1 |
| Mono (facts, provenance, ids) | `Role Mono` | `mono-400.woff`, `mono-700.woff` | DejaVu Sans Mono 2.37 | Bitstream Vera licence (DejaVu changes public domain) |

These are **not Linkbot fonts** and are deliberately not labelled as such. The
original Linkbot Display, Sans and Mono are being developed by the separate Brand
workstream; this prototype does not duplicate that work.

## Provenance of the files

Taken from the Debian packages `fonts-inter` and `fonts-dejavu-mono` in the build
environment, subset to Latin / Latin-1 + common punctuation, arrows and `€ £ × ·`
with `pyftsubset --flavor=woff` (all OpenType layout features kept, including
`tnum`, `case`, `cv11`, `ss03`). The licence texts, as shipped by those packages,
are in `licenses/`. Inter declares no Reserved Font Name; DejaVu's licence only
restricts the words "Bitstream" and "Vera" in renamed derivatives. Liberation Mono
was evaluated and **not** shipped: its OFL reserves the name "Liberation", which a
subsetted file could not keep.

## Swapping in the final fonts

1. Put the final files here (WOFF2 preferred).
2. Edit the `src:` lines in `src/css/fonts.css`. Keep the three family names.
3. Keep the weights the CSS uses: Display 500 + 600, Sans 400 + 500 + 600, Mono 400 + 700.
4. Revisit `font-feature-settings` in `base.css` (`cv11`, `ss03` are Inter features) and
   the Display tracking (`-0.045em` at the largest size), which were tuned to Inter Display.

Nothing else references a font file.
