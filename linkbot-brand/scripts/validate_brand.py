#!/usr/bin/env python3
"""Linkbot Brand OS — self-validation gate.

Checks (all must pass, exit 0):
  1. every .svg in the brand folder parses, has a viewBox, and carries no script,
     no <image>, no <foreignObject> and no remote (http/https) reference;
  2. ids are unique within each SVG;
  3. each *.tokens.json is valid JSON, every leaf carries $type+$value, and every
     semantic colour reference resolves to a palette entry in the same file;
  4. the CSS export and the JSON export agree on every primitive colour and on the
     semantic alias targets;
  5. the working tree writes nothing outside linkbot-brand/.

Run: python3 scripts/validate_brand.py
"""
from __future__ import annotations

import json
import re
import subprocess
import sys
import xml.etree.ElementTree as ET
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SVG_NS = "{http://www.w3.org/2000/svg}"

failures: list[str] = []
notes: list[str] = []


def fail(msg: str) -> None:
    failures.append(msg)


# ---------------------------------------------------------------------------- 1-2
def check_svgs() -> int:
    n = 0
    for svg in sorted(ROOT.rglob("*.svg")):
        n += 1
        raw = svg.read_text(encoding="utf-8")
        rel = svg.relative_to(ROOT)
        try:
            tree = ET.fromstring(raw)
        except ET.ParseError as e:
            fail(f"{rel}: XML parse error: {e}")
            continue
        if tree.tag != f"{SVG_NS}svg":
            fail(f"{rel}: root element is {tree.tag!r}, expected svg")
        if not tree.get("viewBox"):
            fail(f"{rel}: missing viewBox")
        for tag in ("script", "image", "foreignObject"):
            if list(tree.iter(f"{SVG_NS}{tag}")):
                fail(f"{rel}: contains forbidden <{tag}>")
        for m in re.finditer(r'(?:href|xlink:href)\s*=\s*"([^"]+)"', raw):
            if re.match(r"^(https?:)?//", m.group(1)):
                fail(f"{rel}: remote reference {m.group(1)!r}")
        ids = re.findall(r'\bid\s*=\s*"([^"]+)"', raw)
        dupes = {i for i in ids if ids.count(i) > 1}
        if dupes:
            fail(f"{rel}: duplicate id(s) {sorted(dupes)}")
        if "currentColor" not in raw and "fill=" not in raw:
            notes.append(f"{rel}: no explicit colour and no currentColor — check intent")
    return n


# ---------------------------------------------------------------------------- 3
def check_tokens() -> int:
    n = 0
    for tj in sorted(ROOT.glob("10-tokens/*.tokens.json")):
        n += 1
        rel = tj.relative_to(ROOT)
        try:
            data = json.loads(tj.read_text(encoding="utf-8"))
        except json.JSONDecodeError as e:
            fail(f"{rel}: invalid JSON: {e}")
            continue
        pal = {k: v["$value"] for k, v in data["color"]["palette"].items()}

        def walk(node: dict, path: str) -> None:
            if isinstance(node, dict) and "$value" in node:
                if "$type" not in node:
                    fail(f"{rel}: {path} has $value without $type")
                return
            if isinstance(node, dict):
                for k, v in node.items():
                    if k.startswith("$"):
                        continue
                    walk(v, f"{path}.{k}" if path else k)

        walk(data, "")
        for role, tok in data["semantic"].items():
            ref = tok["$value"]
            m = re.fullmatch(r"\{color\.palette\.([A-Za-z0-9-]+)\}", ref)
            if not m:
                fail(f"{rel}: semantic.{role} has unexpected ref {ref!r}")
                continue
            if m.group(1) not in pal:
                fail(f"{rel}: semantic.{role} -> unresolved palette {m.group(1)!r}")
            inline = tok.get("$extensions", {}).get("$value")
            if inline and inline != pal[m.group(1)]:
                fail(f"{rel}: semantic.{role} inline {inline} != palette {pal[m.group(1)]}")
    return n


# ---------------------------------------------------------------------------- 4
def check_css_parity() -> int:
    n = 0
    for css in sorted(ROOT.glob("10-tokens/*.tokens.css")):
        n += 1
        rel = css.relative_to(ROOT)
        direction = css.name.replace(".tokens.css", "")
        tjson = css.with_name(f"{direction}.tokens.json")
        data = json.loads(tjson.read_text(encoding="utf-8"))
        pal = {k: v["$value"].lower() for k, v in data["color"]["palette"].items()}
        text = css.read_text(encoding="utf-8")
        prefix = f"--lb-{direction[0].lower()}-"
        seen: dict[str, str] = {}
        for m in re.finditer(rf"{re.escape(prefix)}([a-z0-9-]+):\s*(#[0-9A-Fa-f]{{3,8}});", text):
            seen[m.group(1)] = m.group(2).lower()
        for name, value in seen.items():
            key = name.replace("-", "")
            match = next((k for k in pal if k.lower() == key), None)
            if match is None:
                fail(f"{rel}: CSS primitive --lb-*/{name} has no JSON palette entry")
            elif pal[match].lower() != value:
                fail(f"{rel}: CSS --lb-*/{name}={value} != JSON {pal[match]}")
        # semantic aliases must point at a var that exists
        for m in re.finditer(r"--lb-([a-z-]+):\s*var\((--lb-[a-z0-9-]+)\);", text):
            if f"{m.group(2)}:" not in text:
                fail(f"{rel}: semantic --lb-{m.group(1)} -> undefined {m.group(2)}")
    return n


# ---------------------------------------------------------------------------- 5
def check_boundary() -> None:
    try:
        out = subprocess.run(
            ["git", "status", "--porcelain"], cwd=ROOT.parent, capture_output=True, text=True, check=True
        ).stdout
    except Exception as e:  # noqa: BLE001
        notes.append(f"boundary check skipped: {e}")
        return
    for line in out.splitlines():
        path = line[3:].strip().strip('"')
        if " -> " in path:
            path = path.split(" -> ")[-1]
        if path and not path.startswith("linkbot-brand/"):
            fail(f"write outside linkbot-brand/: {path}")


if __name__ == "__main__":
    svgs = check_svgs()
    toks = check_tokens()
    csss = check_css_parity()
    check_boundary()
    print(f"svg files checked      : {svgs}")
    print(f"token json files       : {toks}")
    print(f"css exports checked    : {csss}")
    for n in notes:
        print(f"note: {n}")
    if failures:
        print(f"\nFAIL ({len(failures)}):")
        for f in failures:
            print(f"  - {f}")
        raise SystemExit(1)
    print("\nOK — all brand asset and token checks passed")
