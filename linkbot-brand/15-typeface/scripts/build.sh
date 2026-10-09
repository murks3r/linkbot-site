#!/usr/bin/env bash
# Linkbot Type — full reproducible build + gates.
#
# Needs fontTools, ufoLib2, ufo2ft and brotli. The repository keeps them in a sibling
# virtualenv so the brand folder itself stays dependency-free:
#   python3 -m venv ../../../.venv-type
#   ../../../.venv-type/bin/pip install fonttools ufoLib2 ufo2ft brotli typing_extensions
#
# Writes validation/build-log.txt. Set PY to override the interpreter.
set -uo pipefail
cd "$(dirname "$0")/.." || exit 1
PY="${PY:-../../../.venv-type/bin/python}"
LOG="validation/build-log.txt"
: > "$LOG"

{
  echo "Linkbot Type — build and validation"
  echo "date (UTC): $(date -u +%Y-%m-%dT%H:%M:%SZ)"
  echo "python:     $("$PY" -V)"
  echo

  echo "\$ $PY scripts/build_sources.py      # glyphs -> 7 editable UFO sources"
  "$PY" scripts/build_sources.py || exit 1
  echo
  echo "\$ $PY scripts/build_fonts.py        # UFO -> TTF + WOFF2"
  "$PY" scripts/build_fonts.py || exit 1
  echo
  echo "\$ $PY scripts/validate_type.py      # the font gate; reads the binaries"
  "$PY" scripts/validate_type.py || exit 1
  echo
  echo "\$ $PY scripts/build_wordmark.py     # the wordmark, outlined from Display"
  "$PY" scripts/build_wordmark.py || exit 1
  echo
  echo "\$ $PY scripts/audit_binaries.py    # independent audit; rebuilds to check reproducibility"
  "$PY" scripts/audit_binaries.py || exit 1
  echo
  echo "\$ $PY scripts/build_specimen.py"
  "$PY" scripts/build_specimen.py || exit 1
  echo
  echo "\$ $PY scripts/build_review.py      # the review gallery + the round-dot alternative"
  "$PY" scripts/build_review.py || exit 1
  echo
  echo "\$ python3 scripts/gen_registry.py   # stdlib only"
  python3 scripts/gen_registry.py || exit 1
  echo
  echo "ALL TYPE CHECKS PASSED"
} 2>&1 | tee "$LOG"
