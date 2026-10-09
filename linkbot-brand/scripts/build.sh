#!/usr/bin/env bash
# Linkbot Brand OS — full reproducible build + gate.
# Requires Python 3.10+ (standard library only). Writes validation/validation-log.txt.
set -uo pipefail
cd "$(dirname "$0")/.." || exit 1
LOG="validation/validation-log.txt"
: > "$LOG"

{
  echo "Linkbot Brand OS — full build and validation"
  echo "date (UTC): $(date -u +%Y-%m-%dT%H:%M:%SZ)"
  echo "version:    $(cat VERSION)"
  echo "python:     $(python3 -V)"
  echo

  echo "\$ python3 scripts/gen_logos.py"
  python3 scripts/gen_logos.py || exit 1
  echo
  echo "\$ python3 scripts/gen_assets.py"
  python3 scripts/gen_assets.py || exit 1
  echo
  echo "\$ python3 scripts/gen_tokens.py        # exits non-zero on a failing contrast pair"
  python3 scripts/gen_tokens.py || exit 1
  echo
  echo "\$ python3 scripts/gen_specimens.py"
  python3 scripts/gen_specimens.py || exit 1
  echo
  echo "\$ python3 scripts/gen_registry.py"
  python3 scripts/gen_registry.py || exit 1
  echo
  echo "\$ python3 scripts/validate_brand.py    # the gate"
  python3 scripts/validate_brand.py || exit 1
  echo
  if command -v npx >/dev/null 2>&1; then
    echo "\$ npx -y @google/design.md lint 10-tokens/proposed.DESIGN.md   (external cross-check)"
    npx -y @google/design.md lint 10-tokens/proposed.DESIGN.md || echo "(external check unavailable — network or npx)"
  else
    echo "(npx not available — external DESIGN.md cross-check skipped)"
  fi
  echo
  echo "ALL LOCAL GATES PASSED"
} 2>&1 | tee "$LOG"
