#!/usr/bin/env bash
# Linkbot Brand Experiences — full reproducible build + gate.
# Requires Python 3.10+ (standard library only). Writes validation/build-log.txt.
set -uo pipefail
cd "$(dirname "$0")/.." || exit 1
LOG="validation/build-log.txt"
: > "$LOG"

{
  echo "Linkbot Brand Experiences — build and validation"
  echo "date (UTC): $(date -u +%Y-%m-%dT%H:%M:%SZ)"
  echo "python:     $(python3 -V)"
  echo

  echo "\$ python3 scripts/gen_experience_tokens.py   # exits non-zero on a failing pair"
  python3 scripts/gen_experience_tokens.py || exit 1
  echo
  echo "\$ python3 scripts/gen_logo.py"
  python3 scripts/gen_logo.py || exit 1
  echo
  echo "\$ python3 scripts/gen_screens.py"
  python3 scripts/gen_screens.py || exit 1
  echo
  echo "\$ python3 scripts/validate_experiences.py    # the gate"
  python3 scripts/validate_experiences.py || exit 1
  echo
  echo "ALL LOCAL CHECKS PASSED"
} 2>&1 | tee "$LOG"
