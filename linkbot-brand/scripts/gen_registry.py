#!/usr/bin/env python3
"""Linkbot Brand OS — asset registry with content hashes.

Walks the brand folder and writes 12-governance/asset-registry.json: one entry per artifact
with its category, status, licence and SHA-256. Regenerate after any change; a changed hash on
a file whose generator did not change is a sign the file was hand-edited.

Run: python3 scripts/gen_registry.py
"""
from __future__ import annotations

import hashlib
import json
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "12-governance" / "asset-registry.json"
VERSION = (ROOT / "VERSION").read_text(encoding="utf-8").strip()

# directory -> (category, status, licence, generated_by)
RULES: list[tuple[str, tuple[str, str, str, str]]] = [
    ("00-audit/", ("documentation", "FACT", "Linkbot OÜ", "hand-authored")),
    ("01-strategy/", ("documentation", "PROPOSED", "Linkbot OÜ", "hand-authored")),
    ("02-directions/", ("documentation", "PROPOSED", "Linkbot OÜ", "hand-authored")),
    ("03-verbal/", ("documentation", "PROPOSED", "Linkbot OÜ", "hand-authored")),
    ("04-logo/", ("logo", "CANDIDATE", "Linkbot OÜ (original work)", "scripts/gen_logos.py")),
    ("05-colour/", ("documentation", "PROPOSED", "Linkbot OÜ", "hand-authored")),
    ("06-typography/", ("documentation", "PROPOSED", "Linkbot OÜ", "hand-authored")),
    ("07-imagery/", ("imagery", "PROPOSED", "Linkbot OÜ (generated geometry)", "scripts/gen_assets.py")),
    ("08-iconography/", ("iconography", "PROPOSED", "Linkbot OÜ (original geometry)", "scripts/gen_assets.py")),
    ("09-motion/", ("motion", "PROPOSED", "Linkbot OÜ", "hand-authored")),
    ("10-tokens/", ("tokens", "PROPOSED", "Linkbot OÜ", "scripts/gen_tokens.py")),
    ("11-templates/", ("template", "PROPOSED", "Linkbot OÜ", "scripts/gen_specimens.py / gen_assets.py")),
    ("12-governance/", ("documentation", "PROPOSED", "Linkbot OÜ", "hand-authored")),
    ("13-approval/", ("documentation", "PROPOSED", "Linkbot OÜ", "hand-authored")),
    ("validation/", ("evidence", "FACT", "Linkbot OÜ", "scripts/gen_tokens.py / design.md CLI")),
    ("scripts/", ("source", "FACT", "Linkbot OÜ", "hand-authored")),
]

SKIP_SUFFIX = {".pyc"}
SKIP_PARTS = {"__pycache__", ".DS_Store"}


def classify(rel: Path) -> tuple[str, str, str, str]:
    key = rel.as_posix()
    for prefix, meta in RULES:
        if key.startswith(prefix):
            return meta
    if key in {"README.md", "CHANGELOG.md", "VERSION", ".gitignore"}:
        return ("documentation", "FACT", "Linkbot OÜ", "hand-authored")
    return ("uncategorised", "FACT", "Linkbot OÜ", "unknown")


def main() -> None:
    entries = []
    for path in sorted(ROOT.rglob("*")):
        if not path.is_file():
            continue
        rel = path.relative_to(ROOT)
        if any(part in SKIP_PARTS for part in rel.parts):
            continue
        if path.suffix in SKIP_SUFFIX:
            continue
        if rel.as_posix() == "12-governance/asset-registry.json":
            continue
        cat, status, lic, gen = classify(rel)
        data = path.read_bytes()
        entries.append(
            {
                "path": rel.as_posix(),
                "category": cat,
                "status": status,
                "licence": lic,
                "generated_by": gen,
                "bytes": len(data),
                "sha256": hashlib.sha256(data).hexdigest(),
            }
        )

    by_cat: dict[str, int] = {}
    for e in entries:
        by_cat[e["category"]] = by_cat.get(e["category"], 0) + 1

    doc = {
        "brand_os_version": VERSION,
        "generated_at": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
        "note": (
            "Statuses describe the approval state of the artifact, not the approval state of an "
            "identity. No identity in this folder is APPROVED."
        ),
        "totals": {"files": len(entries), "by_category": by_cat},
        "assets": entries,
    }
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(doc, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(f"registry: {len(entries)} files -> {OUT.relative_to(ROOT)}")
    for k, v in sorted(by_cat.items()):
        print(f"  {k:16s} {v}")


if __name__ == "__main__":
    main()
