#!/usr/bin/env python3
"""Linkbot Type — asset registry.

Writes validation/asset-registry.json: every file in this folder with its category,
status, size and SHA-256. A content hash is what makes a substituted binary
detectable — if a hash changes and its generator did not, the file was edited by hand,
which is a governance violation rather than a curiosity.

UFO sources are directories, so each is hashed over its whole file tree and the
individual digests are recorded in order.

Run: python3 scripts/gen_registry.py
"""
from __future__ import annotations

import hashlib
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
VERSION = "0.1.0"

CATEGORIES = {
    "scripts": ("generator", "PROPOSED"),
    "design": ("documentation", "PROPOSED"),
    "fonts/ttf": ("compiled font", "PROPOSED"),
    "fonts/woff2": ("compiled font", "PROPOSED"),
    "sources/ufo": ("editable source", "PROPOSED"),
    "wordmark": ("brand asset", "PROPOSED"),
    "specimen": ("specimen", "PROPOSED"),
    "validation": ("evidence", "PROPOSED"),
}


def sha256(path: Path) -> str:
    h = hashlib.sha256()
    with path.open("rb") as fh:
        for chunk in iter(lambda: fh.read(1 << 16), b""):
            h.update(chunk)
    return h.hexdigest()


def ufo_digest(path: Path) -> tuple[str, int]:
    """A directory digest: hash the sorted relative paths then each file's bytes."""
    h = hashlib.sha256()
    total = 0
    files = sorted(p for p in path.rglob("*") if p.is_file())
    for f in files:
        h.update(str(f.relative_to(path)).encode("utf-8"))
        h.update(f.read_bytes())
        total += f.stat().st_size
    return h.hexdigest(), total


def main() -> int:
    entries: list[dict] = []
    for top, (category, status) in CATEGORIES.items():
        base = ROOT / top
        if not base.exists():
            continue
        for item in sorted(base.iterdir()):
            if item.name.startswith(".") or item.name.endswith(".pyc"):
                continue
            if item.is_dir():
                digest, size = ufo_digest(item)
                entries.append({
                    "path": f"{top}/{item.name}",
                    "category": category,
                    "status": status,
                    "kind": "directory",
                    "bytes": size,
                    "sha256": digest,
                })
            else:
                entries.append({
                    "path": f"{top}/{item.name}",
                    "category": category,
                    "status": status,
                    "kind": "file",
                    "bytes": item.stat().st_size,
                    "sha256": sha256(item),
                })
    for name in ("README.md", "PROPOSED.md", "CHANGELOG.md"):
        f = ROOT / name
        if f.exists():
            entries.append({
                "path": name, "category": "documentation", "status": "PROPOSED",
                "kind": "file", "bytes": f.stat().st_size, "sha256": sha256(f),
            })

    out = {
        "$description": (
            f"Linkbot Type {VERSION} — asset registry. Every artifact is PROPOSED and NOT "
            "APPROVED. One master family: Display, Sans, Mono, plus the wordmark outlined "
            "from the typeface. Original work authored in this repository."
        ),
        "version": VERSION,
        "count": len(entries),
        "total_bytes": sum(e["bytes"] for e in entries),
        "files": entries,
    }
    dest = ROOT / "validation" / "asset-registry.json"
    dest.parent.mkdir(parents=True, exist_ok=True)
    dest.write_text(json.dumps(out, indent=2) + "\n", encoding="utf-8")
    print(f"  registry: {len(entries)} entries, {out['total_bytes']} bytes total")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
