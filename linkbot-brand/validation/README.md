# Validation

Everything in this folder that claims to be verified is reproducible from a committed script.
Nothing here is a hand-typed result.

| File | Produced by | What it proves |
| --- | --- | --- |
| `contrast-report.md` | `python3 scripts/gen_tokens.py` | Every required colour pair, light and dark, computed with the WCAG 2.1 relative-luminance formula. Exits non-zero on any failure. |
| `design-md-export.dtcg.json` | `npx -y @google/design.md export --format dtcg 10-tokens/proposed.DESIGN.md` | The recommended direction survives an independent DTCG consumer. |
| `../12-governance/asset-registry.json` | `python3 scripts/gen_registry.py` | Every artifact, its licence, its status and its SHA-256. |
| `validation-log.txt` | `bash scripts/build.sh` | The full build and gate output, including the external `design.md lint` result, captured verbatim. |

## How to reproduce the whole set

```bash
cd linkbot-brand
python3 scripts/gen_logos.py
python3 scripts/gen_assets.py
python3 scripts/gen_tokens.py        # exits 1 if any contrast pair fails
python3 scripts/gen_specimens.py
python3 scripts/gen_registry.py
python3 scripts/validate_brand.py    # exits 1 on any asset, token or boundary failure
npx -y @google/design.md lint 10-tokens/proposed.DESIGN.md
```

Requires Python 3.10+ (standard library only). `npx` is optional and only used for the external
cross-check.

## Results at version 0.1.0

| Check | Result |
| --- | --- |
| SVG asset gate (parse, `viewBox`, no script/image/remote, unique ids) | **57 files, OK** |
| Token JSON validity, `$type`/`$value` presence, reference resolution | **3 files, OK** |
| CSS export ↔ JSON parity (primitives and aliases) | **3 files, OK** |
| WCAG 2.1 contrast pairs (tokens + specimen role palettes) | **116/116 pass, 0 failures** |
| `@google/design.md lint` on the proposed direction | **0 errors, 0 warnings, 1 info** |
| Write boundary (`git status` — nothing outside `linkbot-brand/`) | **OK** |
| Runtime files, other agents' paths, application repositories | **untouched** |

## Manual checks that no script performs

These were done by rendering the artifacts in a browser and looking at them. Recorded so a
reviewer can repeat them:

1. Each mark rendered at 16px in `11-templates/specimens/`. Direction A's frame survives;
   B's arcs merge into a disc; C's gate collapses to a "+". Recorded as a measured weakness in
   each direction's document rather than papered over.
2. Each specimen inspected in light **and** dark. Two defects were found and fixed this way:
   the ink app plate and the monochrome mark were invisible on a dark surface, which produced
   the inverse plate asset and the single-colour usage row.
3. Each specimen checked for overflow inside cards; the intrinsic wordmark width overflowed a
   card until the SVG was constrained. Now verified as zero overflowing cards in all three.
4. Motion inspected with `prefers-reduced-motion` enabled: the deliberate moment becomes a
   visible outline rather than a no-op.
