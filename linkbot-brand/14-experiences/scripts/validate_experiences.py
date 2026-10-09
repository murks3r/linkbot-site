#!/usr/bin/env python3
"""Linkbot Brand Experiences — the gate.

Independent of the generators: it re-reads what was EMITTED and refuses to trust
that the writers agreed. Exits non-zero on any failure.

  A  assets      every .svg parses, has a viewBox, carries no script/image/
                 foreignObject/remote reference, and has no duplicate id
  B  tokens      every token JSON is valid, every leaf has $type + $value, every
                 semantic reference resolves, and the CSS export agrees with the
                 JSON on every primitive and every alias
  C  coherence   the SHARED keys hold byte-identical values in all three experience
                 files; the role-name set is identical; no override invents a key
                 outside the declared override list
  D  contrast    every required pair recomputed from the emitted JSON, both modes
  E  screens     all five specimens exist, reference only files that exist, carry
                 the candidate stamp, and obey two product-truth copy rules
  F  boundary    the working tree contains nothing outside the two owned paths

Run: python3 scripts/validate_experiences.py
"""
from __future__ import annotations

import json
import re
import subprocess
import sys
import xml.etree.ElementTree as ET
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent          # .../14-experiences
BRAND = ROOT.parent                                     # .../linkbot-brand
sys.path.insert(0, str(ROOT / "scripts"))
from gen_experience_tokens import (  # noqa: E402
    OVERRIDES, REQUIRED_PAIRS, ROLE_MAP, ROLES, SHARED, SHARED_KEYS, contrast,
)

SVG_NS = "{http://www.w3.org/2000/svg}"
OWNED = ("linkbot-brand/14-experiences", "linkbot-brand/15-typeface")

failures: list[str] = []
notes: list[str] = []


def fail(msg: str) -> None:
    failures.append(msg)


def kebab(s: str) -> str:
    return "".join("-" + c.lower() if c.isupper() else c for c in s)


def check_assets() -> int:
    n = 0
    for svg in sorted(ROOT.rglob("*.svg")) + sorted((BRAND / "15-typeface").rglob("*.svg")):
        n += 1
        rel = svg.relative_to(BRAND.parent)
        raw = svg.read_text(encoding="utf-8")
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
    return n


def check_tokens() -> tuple[int, int]:
    """Returns (files checked, aliases checked)."""
    files = 0
    aliases = 0

    shared_json = json.loads((ROOT / "00-shared" / "tokens.shared.json").read_text(encoding="utf-8"))
    if set(shared_json["color"]["palette"]) != set(SHARED_KEYS):
        fail("tokens.shared.json: palette keys differ from the generator's SHARED set")
    for k, v in shared_json["color"]["palette"].items():
        if v["$value"] != SHARED[k]:
            fail(f"tokens.shared.json: {k} is {v['$value']}, generator says {SHARED[k]}")
    files += 1

    for exp in OVERRIDES:
        tj = ROOT / "00-shared" / f"experience-{exp}.tokens.json"
        data = json.loads(tj.read_text(encoding="utf-8"))
        files += 1
        pal = {k: v["$value"] for k, v in data["color"]["palette"].items()}

        def walk(node, path=""):
            if isinstance(node, dict) and "$value" in node:
                if "$type" not in node:
                    fail(f"{tj.name}: {path} has $value without $type")
                return
            if isinstance(node, dict):
                for k, v in node.items():
                    if not k.startswith("$"):
                        walk(v, f"{path}.{k}" if path else k)

        walk(data)

        # C — the shared layer must be byte-identical
        for k in SHARED_KEYS:
            if pal.get(k) != SHARED[k]:
                fail(f"{tj.name}: shared key {k} is {pal.get(k)!r}, expected {SHARED[k]!r}")

        # C — an override may not introduce an undeclared key
        declared = set(SHARED_KEYS) | set(OVERRIDES[exp])
        extra = set(pal) - declared
        if extra:
            fail(f"{tj.name}: undeclared palette keys {sorted(extra)}")
        for k, v in OVERRIDES[exp].items():
            if pal.get(k) != v:
                fail(f"{tj.name}: override {k} is {pal.get(k)!r}, expected {v!r}")

        # B — semantic references resolve, and the role set is exact
        sem_keys = set()
        for key, tok in data["semantic"].items():
            mode, role = key.split(".", 1)
            sem_keys.add(role)
            m = re.fullmatch(r"\{color\.palette\.([A-Za-z0-9-]+)\}", tok["$value"])
            if not m:
                fail(f"{tj.name}: semantic.{key} unexpected ref {tok['$value']!r}")
                continue
            aliases += 1
            if m.group(1) not in pal:
                fail(f"{tj.name}: semantic.{key} -> unresolved palette {m.group(1)!r}")
            if tok.get("$extensions", {}).get("$value") != pal[m.group(1)]:
                fail(f"{tj.name}: semantic.{key} inline value != palette value")
        if sem_keys != set(ROLES):
            fail(f"{tj.name}: role set differs — {sorted(sem_keys ^ set(ROLES))}")
        expected = {ROLE_MAP[exp][m][r] for m in ("light", "dark") for r in ROLES}
        if expected - set(pal):
            fail(f"{tj.name}: role map references unknown primitives {sorted(expected - set(pal))}")

        # B — the CSS export must agree with the JSON, primitive by primitive
        css = (ROOT / "00-shared" / f"experience-{exp}.tokens.css").read_text(encoding="utf-8")
        letter = exp[0].lower()
        seen = {
            m.group(1): m.group(2).lower()
            for m in re.finditer(rf"--lb-{letter}-([a-z0-9-]+):\s*(#[0-9A-Fa-f]{{3,8}});", css)
        }
        for k, v in pal.items():
            if seen.get(kebab(k)) != v.lower():
                fail(f"{exp}.tokens.css: --lb-{letter}-{kebab(k)} is {seen.get(kebab(k))!r}, JSON says {v.lower()!r}")
        # aliases: every role in the CSS points at that experience's primitive
        for mode in ("light", "dark"):
            for role in ROLES:
                prim = ROLE_MAP[exp][mode][role]
                if f"--lb-{role}: var(--lb-{letter}-{kebab(prim)});" not in css:
                    fail(f"{exp}.tokens.css: role {role} ({mode}) does not alias {prim}")

    # D — contrast recomputed from the emitted JSON
    for exp in OVERRIDES:
        data = json.loads((ROOT / "00-shared" / f"experience-{exp}.tokens.json").read_text(encoding="utf-8"))
        pal = {k: v["$value"] for k, v in data["color"]["palette"].items()}
        for mode in ("light", "dark"):
            for role, bg_role, target, label in REQUIRED_PAIRS:
                if role == "mint-deep" and mode != "light":
                    continue
                fg = pal["mintDeep"] if role == "mint-deep" else pal[ROLE_MAP[exp][mode][role]]
                bg = pal[ROLE_MAP[exp][mode][bg_role]]
                r = contrast(fg, bg)
                if r < target:
                    fail(f"{exp} {mode}: {role} on {bg_role} is {r:.2f}:1, target {target}:1 ({label})")
    return files, aliases


def check_screens() -> int:
    slugs = ["01-talent-jobsite", "02-private-job-agent", "03-developer-platform",
             "04-employer-dashboard", "05-agency-mandate"]
    n = 0
    for slug in slugs:
        f = ROOT / slug / "index.html"
        if not f.exists():
            fail(f"{slug}/index.html: missing")
            continue
        n += 1
        html = f.read_text(encoding="utf-8")
        if "data-experience" not in html or "data-mode" not in html:
            fail(f"{slug}: missing the experience/mode attributes")
        if "data-lang" not in html:
            fail(f"{slug}: missing the language attribute")
        if "Candidate · not approved" not in html:
            fail(f"{slug}: missing the candidate/non-approved stamp")
        if "data-de>" not in html:
            fail(f"{slug}: no German text present")
        # product-truth copy rules that a specimen must not break
        if re.search(r">\s*Apply now\s*<", html, re.I) or re.search(r"data-apply\b", html):
            fail(f"{slug}: contains an apply affordance (T9: external listings keep their source path)")
        if re.search(r"smart match|perfect match", html, re.I):
            fail(f"{slug}: uses 'match' for a one-sided result (T1)")
        # referenced local files exist
        for m in re.finditer(r'(?:href|src)="(\.\./[^"]+|[0-9][^"]*\.css)"', html):
            target = (f.parent / m.group(1)).resolve()
            if not target.exists():
                fail(f"{slug}: references missing file {m.group(1)}")
    return n


def check_boundary() -> int:
    out = subprocess.run(["git", "-C", str(BRAND.parent), "status", "--porcelain"],
                         capture_output=True, text=True, check=True).stdout
    bad = []
    for line in out.splitlines():
        path = line[3:].strip().strip('"')
        if not path:
            continue
        if not path.startswith(OWNED):
            bad.append(path)
    if bad:
        for p in bad:
            fail(f"boundary: working tree changed {p} (outside {OWNED})")
    return len(out.splitlines())


def main() -> int:
    svgs = check_assets()
    files, aliases = check_tokens()
    screens = check_screens()
    changed = check_boundary()

    rows = [
        ("A assets", f"{svgs} SVG files parsed, no forbidden content, unique ids"),
        ("B tokens", f"{files} token files, {aliases} alias references resolved, CSS/JSON parity"),
        ("C coherence", f"{len(SHARED_KEYS)} shared keys identical across 3 experiences, role set exact"),
        ("D contrast", f"{len(REQUIRED_PAIRS)} pairs x 3 experiences x 2 modes recomputed from the emitted JSON"),
        ("E screens", f"{screens}/5 specimens present, local references exist, copy rules held"),
        ("F boundary", f"{changed} changed paths, all inside {OWNED}"),
    ]
    print("Linkbot Brand Experiences — gate")
    for name, detail in rows:
        print(f"  {name:12s} {detail}")
    print()
    for n in notes:
        print(f"  note: {n}")
    if failures:
        print(f"FAILED — {len(failures)} problem(s):")
        for f in failures:
            print(f"  - {f}")
        return 1
    print("ALL CHECKS PASSED")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
