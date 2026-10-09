#!/usr/bin/env python3
"""Linkbot Type — glyph geometry engine.

Original letterform construction. A glyph is a set of CENTRELINES (lines and
elliptical arcs) plus a stroke width per centreline. The engine expands each
centreline into an exact outline:

  * a straight centreline offsets to a quadrilateral;
  * an elliptical-arc centreline offsets to a concentric elliptical arc, which is
    EXACT for arcs (radii grow/shrink by the half-width), unlike the usual
    "move the control points along the normal" approximation;
  * joins and terminals are round by default, which is the family's terminal
    language, and are emitted as real arcs rather than sampled polylines.

Consequences that matter:
  * outlines are curves, not polygons, so nothing facets at display sizes;
  * the topology is a pure function of the centreline structure, so the same
    glyph at 400 and at 700 weights has an identical point count and is
    interpolation-compatible by construction;
  * the whole family is one engine with different parameters, which is what makes
    Display, Sans and Mono read as one typeface rather than three.

Winding: contours produced from an OPEN centreline are single closed contours and
rely on non-zero fill for their interior. A closed centreline (a full ellipse: the
o, O and 0 rings) emits TWO contours with opposite directions, so the counter is a
hole. Ink never deliberately crosses a counter, which is why no boolean-overlap
removal is needed.

Stdlib only. Imported by the generators; not run directly.
"""
from __future__ import annotations

import math
from dataclasses import dataclass

KAPPA = 4.0 / 3.0 * (math.sqrt(2) - 1)  # 0.5522847498; cubic circle constant

Point = tuple[float, float]
Seg = tuple  # ("line", p0, p1) | ("curve", p0, c1, c2, p3)


# --------------------------------------------------------------------------- types


@dataclass(frozen=True)
class Line:
    """Straight centreline segment."""

    p0: Point
    p1: Point

    def point_at(self, t: float) -> Point:
        return (self.p0[0] + (self.p1[0] - self.p0[0]) * t,
                self.p0[1] + (self.p1[1] - self.p0[1]) * t)

    def start(self) -> Point:
        return self.p0

    def end(self) -> Point:
        return self.p1


@dataclass(frozen=True)
class Arc:
    """Elliptical arc centreline. Angles in degrees, counter-clockwise positive,
    0 degrees = +x. ry defaults to rx when None."""

    c: Point
    rx: float
    ry: float | None
    a0: float
    a1: float

    @property
    def radius_y(self) -> float:
        return self.rx if self.ry is None else self.ry

    def point_at(self, t: float) -> Point:
        a = math.radians(self.a0 + (self.a1 - self.a0) * t)
        return (self.c[0] + self.rx * math.cos(a), self.c[1] + self.radius_y * math.sin(a))

    def start(self) -> Point:
        return self.point_at(0.0)

    def end(self) -> Point:
        return self.point_at(1.0)

    def tangent(self, t: float) -> Point:
        a = math.radians(self.a0 + (self.a1 - self.a0) * t)
        sign = 1.0 if self.a1 >= self.a0 else -1.0
        d = (-self.rx * math.sin(a) * sign, self.radius_y * math.cos(a) * sign)
        n = math.hypot(*d)
        return (d[0] / n, d[1] / n) if n else (1.0, 0.0)


@dataclass(frozen=True)
class Ring:
    """A closed elliptical centreline. Strokes to an annulus: two contours with
    opposite directions, which is what gives o / O / 0 their counter."""

    c: Point
    rx: float
    ry: float | None = None

    @property
    def radius_y(self) -> float:
        return self.rx if self.ry is None else self.ry

    def start(self) -> Point:
        return (self.c[0] + self.rx, self.c[1])

    def end(self) -> Point:
        return self.start()


Prim = Line | Arc | Ring


# ----------------------------------------------------------------- segment helpers


def _norm(d: Point) -> Point:
    n = math.hypot(*d)
    return (d[0] / n, d[1] / n) if n else (1.0, 0.0)


def _left_normal(d: Point) -> Point:
    """Unit normal 90 degrees counter-clockwise from d."""
    dx, dy = _norm(d)
    return (-dy, dx)


def _add(p: Point, q: Point) -> Point:
    return (p[0] + q[0], p[1] + q[1])


def _sub(p: Point, q: Point) -> Point:
    return (p[0] - q[0], p[1] - q[1])


def _mul(p: Point, k: float) -> Point:
    return (p[0] * k, p[1] * k)


def _arc_cubics(c: Point, rx: float, ry: float, a0: float, a1: float) -> list[Seg]:
    """An arc as a list of cubic segments, at most 90 degrees each."""
    if abs(a1 - a0) < 1e-9:
        return []
    total = a1 - a0
    steps = max(1, int(math.ceil(abs(total) / 90.0)))
    step = total / steps
    k = 4.0 / 3.0 * math.tan(math.radians(abs(step)) / 4.0)
    segs: list[Seg] = []
    for i in range(steps):
        s0 = a0 + step * i
        s1 = a0 + step * (i + 1)
        r0, r1 = math.radians(s0), math.radians(s1)
        p0 = (c[0] + rx * math.cos(r0), c[1] + ry * math.sin(r0))
        p3 = (c[0] + rx * math.cos(r1), c[1] + ry * math.sin(r1))
        sign = 1.0 if step >= 0 else -1.0
        t0 = (-rx * math.sin(r0) * sign, ry * math.cos(r0) * sign)
        t1 = (-rx * math.sin(r1) * sign, ry * math.cos(r1) * sign)
        c1 = (p0[0] + k * t0[0], p0[1] + k * t0[1])
        c2 = (p3[0] - k * t1[0], p3[1] - k * t1[1])
        segs.append(("curve", p0, c1, c2, p3))
    return segs


def _reverse_segs(segs: list[Seg]) -> list[Seg]:
    out: list[Seg] = []
    for s in reversed(segs):
        if s[0] == "line":
            out.append(("line", s[2], s[1]))
        else:
            out.append(("curve", s[4], s[3], s[2], s[1]))
    return out


def _offset_prims(prim: Prim, h: float, side: int) -> list[Seg]:
    """Offset one centreline by h to the left (side=+1) or right (side=-1).

    For arcs the offset is a concentric arc with both radii moved by h, which is
    exact. For rings the caller asks for the outer (+h) or inner (-h) contour.
    """
    if isinstance(prim, Line):
        t = _norm(_sub(prim.p1, prim.p0))
        n = _mul(_left_normal(t), h * side)
        return [("line", _add(prim.p0, n), _add(prim.p1, n))]
    if isinstance(prim, Arc):
        return _arc_cubics(prim.c, prim.rx + h * side, prim.radius_y + h * side, prim.a0, prim.a1)
    r = Ring(prim.c, prim.rx, prim.radius_y)
    return _arc_cubics(r.c, r.rx + h * side, r.radius_y + h * side, 0.0, 360.0)


def _seg_points(segs: list[Seg]) -> list[Point]:
    pts: list[Point] = []
    for i, s in enumerate(segs):
        if s[0] == "line":
            pts.extend([s[1]] if i == 0 else [])
            pts.append(s[2])
        else:
            pts.extend([s[1], s[2], s[3]] if i == 0 else [s[2], s[3]])
    return pts


def _seg_start(segs: list[Seg]) -> Point:
    return segs[0][1] if segs else (0.0, 0.0)


def _seg_end(segs: list[Seg]) -> Point:
    if not segs:
        return (0.0, 0.0)
    s = segs[-1]
    return s[2] if s[0] == "line" else s[3]


def _same(a: Point, b: Point, tol: float = 0.05) -> bool:
    return abs(a[0] - b[0]) < tol and abs(a[1] - b[1]) < tol


def _join(corner: Point, from_pt: Point, to_pt: Point, h: float, round_join: bool) -> list[Seg]:
    """Connect one offset leg's end to the next leg's start around `corner`."""
    if _same(from_pt, to_pt):
        return []
    if not round_join:
        return [("line", from_pt, to_pt)]
    a0 = math.degrees(math.atan2(from_pt[1] - corner[1], from_pt[0] - corner[0]))
    a1 = math.degrees(math.atan2(to_pt[1] - corner[1], to_pt[0] - corner[0]))
    d = (a1 - a0) % 360.0
    if d > 180.0:
        d -= 360.0
    return _arc_cubics(corner, h, h, a0, a0 + d)


def _cap(at: Point, direction: Point, h: float, kind: str) -> list[Seg]:
    """Cap at the start (direction = path direction) or end (direction reversed)
    of an open stroke. Returns the segments from the left offset point to the
    right offset point."""
    n = _left_normal(direction)
    left = _add(at, _mul(n, h))
    right = _add(at, _mul(n, -h))
    if kind == "butt" or h < 1e-6:
        return [("line", left, right)]
    a0 = math.degrees(math.atan2(left[1] - at[1], left[0] - at[0]))
    a1 = math.degrees(math.atan2(right[1] - at[1], right[0] - at[0]))
    d = (a1 - a0) % 360.0
    if d > 180.0:
        d -= 360.0
    return _arc_cubics(at, h, h, a0, a0 + d)


# ------------------------------------------------------------------------ strokes


def _path_dir(prim: Prim, t: float) -> Point:
    if isinstance(prim, Line):
        return _norm(_sub(prim.p1, prim.p0))
    if isinstance(prim, Arc):
        return prim.tangent(t)
    return (1.0, 0.0)


def _outline(prims: list[Prim], hw: list[float], closed: bool, cap: str,
             round_join: bool) -> list[list[Seg]]:
    left = [_offset_prims(p, h, +1) for p, h in zip(prims, hw)]
    right = [_offset_prims(p, h, -1) for p, h in zip(prims, hw)]

    fwd: list[Seg] = list(left[0])
    for i in range(len(prims) - 1):
        corner = prims[i].end()
        fwd += _join(corner, _seg_end(left[i]), _seg_start(left[i + 1]), hw[i], round_join)
        fwd += left[i + 1]

    back: list[Seg] = _reverse_segs(right[-1])
    for i in range(len(prims) - 2, -1, -1):
        piece = _reverse_segs(right[i])
        corner = prims[i + 1].start()
        back += _join(corner, _seg_end(back), _seg_start(piece), hw[i + 1], round_join)
        back += piece

    if closed:
        return [fwd + back]

    end_cap = _cap(prims[-1].end(), _path_dir(prims[-1], 1.0), hw[-1], cap)
    start_cap = _cap(prims[0].start(), _mul(_path_dir(prims[0], 0.0), -1.0), hw[0], cap)
    return [fwd + end_cap + back + start_cap]


def stroke(prims: list[Prim], width: float | list[float],
           cap: str = "round", join: str = "round") -> list[list[Seg]]:
    """Expand a sequence of centrelines into outlines.

    An OPEN sequence yields exactly one contour. A single RING yields two contours
    (outer first, inner second with the opposite direction), which is what makes
    the o / O / 0 counter a hole under non-zero fill.
    """
    if len(prims) == 1 and isinstance(prims[0], Ring):
        ring = prims[0]
        h = (width if isinstance(width, (int, float)) else width[0]) / 2.0
        outer = _arc_cubics(ring.c, ring.rx + h, ring.radius_y + h, 0.0, 360.0)
        inner = _arc_cubics(ring.c, max(ring.rx - h, 0.0), max(ring.radius_y - h, 0.0), 360.0, 0.0)
        return [outer, inner]
    widths = [width] * len(prims) if isinstance(width, (int, float)) else list(width)
    return _outline(prims, [w / 2.0 for w in widths], False, cap, join == "round")


def stroke_closed(prims: list[Prim], width: float | list[float],
                  cap: str = "round", join: str = "round") -> list[list[Seg]]:
    """Stroke an open sequence whose two ends are meant to meet (the 340 degree
    arc of an 'e', the ring of a 'g'). No caps: the offset ends are joined
    directly, which is what leaves the counter as a hole."""
    widths = [width] * len(prims) if isinstance(width, (int, float)) else list(width)
    return _outline(prims, [w / 2.0 for w in widths], True, cap, join == "round")


# ------------------------------------------------------------------- UFO contours


def contour_points(segs: list[Seg]) -> list[tuple[float, float, str | None, bool]]:
    """Convert segments into (x, y, segmentType, smooth) tuples for a UFO contour."""
    out: list[tuple[float, float, str | None, bool]] = []
    if not segs:
        return out
    first = segs[0]
    start = first[1]
    out.append((round(start[0], 4), round(start[1], 4), "move", False))
    for s in segs:
        if s[0] == "line":
            out.append((round(s[2][0], 4), round(s[2][1], 4), "line", False))
        else:
            out.append((round(s[2][0], 4), round(s[2][1], 4), None, False))
            out.append((round(s[3][0], 4), round(s[3][1], 4), None, False))
            out.append((round(s[4][0], 4), round(s[4][1], 4), "curve", True))
    return out


def segments_bbox(contours: list[list[Seg]]) -> tuple[float, float, float, float]:
    xs: list[float] = []
    ys: list[float] = []
    for c in contours:
        for s in c:
            pts = [s[1], s[2]] if s[0] == "line" else [s[1], s[2], s[3], s[4]]
            for p in pts:
                xs.append(p[0])
                ys.append(p[1])
    if not xs:
        return (0.0, 0.0, 0.0, 0.0)
    return (min(xs), min(ys), max(xs), max(ys))


def signed_area(contours: list[list[Seg]]) -> float:
    """Shoelace area over the on-curve points; sign gives the winding. Positive is
    counter-clockwise."""
    a = 0.0
    for c in contours:
        pts = [p for p in _seg_points(c)]
        if len(pts) < 3:
            continue
        s = 0.0
        for i in range(len(pts)):
            x0, y0 = pts[i]
            x1, y1 = pts[(i + 1) % len(pts)]
            s += x0 * y1 - x1 * y0
        a += s / 2.0
    return a


# --------------------------------------------------------------- glyph assembly


def _force(contour: list[Seg], sign: int) -> list[Seg]:
    """Force a contour's winding. +1 = counter-clockwise (ink), -1 = clockwise
    (a counter)."""
    if signed_area([contour]) * sign < 0:
        return _reverse_segs(contour)
    return contour


def union(*groups, cap: str = "butt", join: str = "round") -> list[list[Seg]]:
    """Assemble a glyph from SEVERAL separate strokes.

    Each group is (prims, widths). Prims inside one group must form a single
    connected path in traversal order — the stroker joins them. Groups are
    stroked independently and then every ink contour is forced counter-clockwise
    while every ring counter is forced clockwise. That is what makes overlapping
    constructions (a stem crossing a bar, a bowl meeting a stem) render as a
    union under non-zero fill instead of punching holes in each other.

    This is the fix for the classic stroked-letterform failure: an H is three
    strokes, not one path, and joining them into one path draws a connector
    where the letter should have none.
    """
    out: list[list[Seg]] = []
    for prims, widths in groups:
        if len(prims) == 1 and isinstance(prims[0], Ring):
            outer, inner = stroke(prims, widths)
            out.append(_force(outer, +1))
            out.append(_force(inner, -1))
        else:
            for c in stroke(prims, widths, cap=cap, join=join):
                out.append(_force(c, +1))
    return out


def union_closed(*groups, cap: str = "butt", join: str = "round") -> list[list[Seg]]:
    """Like union() but for a group whose two ends meet (the e and g rings)."""
    out: list[list[Seg]] = []
    for prims, widths in groups:
        for c in stroke_closed(prims, widths, cap=cap, join=join):
            out.append(_force(c, +1))
    return out
