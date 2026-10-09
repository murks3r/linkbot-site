#!/usr/bin/env python3
"""Linkbot Type — punctuation, symbols, German characters and accented composites.

Everything here is built from the same primitives and the same stroke engine as the
alphabet, so the marks share the family's construction rather than being traced
from another face. Three rules are followed throughout:

  * SQUARE punctuation. The period, comma, colon, exclamation dot, ellipsis and
    diacritic dots are squares, not circles — the mark's inscribed square, carried
    into the type. This is the family's most visible identifying mark.
  * Marks are built from strokes, never from a second font's outlines.
  * Accented letters are COMPOSITES: the base letter's contours plus an independent
    diacritic built above it. Where a diacritic sits over a round letter it is
    raised by the base's overshoot, which is what keeps the spacing even.

Coverage is stated exactly in validation/coverage-report.md; anything not authored
here is listed there as not covered and falls back to a licensed OFL face.

Stdlib only. Imported by build_sources.py.
"""
from __future__ import annotations

from glyphlib import Arc, Line, Prim, Ring, union
from glyphset import Style, V, H, bowl_right, spine, Glyph


# ------------------------------------------------------------------- helpers


def shift(contours: list[list], dx: float = 0.0, dy: float = 0.0) -> list[list]:
    out = []
    for c in contours:
        nc = []
        for s in c:
            if s[0] == "line":
                nc.append(("line", (s[1][0] + dx, s[1][1] + dy), (s[2][0] + dx, s[2][1] + dy)))
            else:
                nc.append(("curve", (s[1][0] + dx, s[1][1] + dy), (s[2][0] + dx, s[2][1] + dy),
                           (s[3][0] + dx, s[3][1] + dy), (s[4][0] + dx, s[4][1] + dy)))
        out.append(nc)
    return out


def sq(x: float, y: float, side: float) -> list[list]:
    """An exact square with its lower-left corner at (x, y)."""
    return union(([V(x + side / 2.0, y, y + side)], [side]))


def bar(x0: float, y0: float, x1: float, y1: float, w: float) -> list[list]:
    return union(([Line((x0, y0), (x1, y1))], [w]))


def combine(*parts) -> list[list]:
    out: list[list] = []
    for p in parts:
        out.extend(p)
    return out


def ring(cx: float, cy: float, r: float, w: float) -> list[list]:
    return union(([Ring((cx, cy), r, r)], [w]))


# ------------------------------------------------------------------ diacritics


def m_dieresis(cx: float, y: float, st: Style) -> list[list]:
    s = st.w_v * 0.92
    gap = st.w_v * 0.50
    return combine(sq(cx - s - gap / 2.0, y, s), sq(cx + gap / 2.0, y, s))


def m_dot(cx: float, y: float, st: Style) -> list[list]:
    s = st.w_v * 0.92
    return sq(cx - s / 2.0, y, s)


def m_macron(cx: float, y: float, st: Style) -> list[list]:
    s = st.w_v * 0.92
    w = s * 3.0
    return union(([H(y + st.w_h * 0.45, cx - w / 2.0, cx + w / 2.0)], [st.w_h * 0.92]))


def m_acute(cx: float, y: float, st: Style) -> list[list]:
    s = st.w_v * 0.92
    return bar(cx - s * 0.55, y, cx + s * 0.55, y + st.cap * 0.20, st.w_v * 0.80)


def m_grave(cx: float, y: float, st: Style) -> list[list]:
    s = st.w_v * 0.92
    return bar(cx + s * 0.55, y, cx - s * 0.55, y + st.cap * 0.20, st.w_v * 0.80)


def m_circumflex(cx: float, y: float, st: Style) -> list[list]:
    half = st.w_v * 1.40
    h = st.cap * 0.17
    return bar(cx - half, y, cx, y + h, st.w_v * 0.78)


def m_caron(cx: float, y: float, st: Style) -> list[list]:
    half = st.w_v * 1.40
    h = st.cap * 0.17
    return bar(cx - half, y + h, cx, y, st.w_v * 0.78)


def m_ring(cx: float, y: float, st: Style) -> list[list]:
    r = st.w_v * 0.86
    return ring(cx, y + r, r, st.w_v * 0.82)


def m_tilde(cx: float, y: float, st: Style) -> list[list]:
    r = st.w_v * 1.35
    h = st.cap * 0.075
    a = Arc((cx - r * 0.75, y + h), r, h, 180.0, 0.0)
    b = Arc((cx + r * 0.75, y - h), r, h, 180.0, 0.0)
    return combine(union(([a], [st.w_v * 0.70])), union(([b], [st.w_v * 0.70])))


def m_cedilla(cx: float, y: float, st: Style) -> list[list]:
    r = st.w_v * 0.80
    tail = Arc((cx, y), r, r, 180.0, 300.0)
    return union(([tail, Line(tail.end(), (cx - r * 0.55, y - r * 1.05))],
                  [st.w_v * 0.74, st.w_v * 0.74]))


def m_ogonek(cx: float, y: float, st: Style) -> list[list]:
    r = st.w_v * 1.05
    return union(([Arc((cx + r * 0.6, y), r, r * 1.2, 150.0, 300.0)], [st.w_v * 0.78]))


# ---------------------------------------------------------------- punctuation


def punct(st: Style) -> dict[str, Glyph]:
    xh, cap = st.xh, st.cap
    wv, wh, wd = st.w_v, st.w_h, st.w_d
    s = wv * 1.05
    g: dict[str, Glyph] = {}

    adv = 268.0 * st.wf
    cx = adv / 2.0
    g["period"] = (sq(cx - s / 2.0, 0.0, s), adv)
    g["comma"] = (combine(sq(cx - s / 2.0, xh * 0.11, s),
                          bar(cx - s * 0.10, xh * 0.11, cx - s * 0.95, -cap * 0.17, wv * 0.74)), adv)
    g["colon"] = (combine(sq(cx - s / 2.0, 0.0, s), sq(cx - s / 2.0, xh * 0.46, s)), adv)
    g["semicolon"] = (combine(sq(cx - s / 2.0, xh * 0.46, s),
                              sq(cx - s / 2.0, xh * 0.11, s),
                              bar(cx - s * 0.10, xh * 0.11, cx - s * 0.95, -cap * 0.17, wv * 0.74)), adv)

    adv = 272.0 * st.wf
    cx = adv / 2.0
    g["exclam"] = (combine(bar(cx, xh * 0.30, cx, cap * 0.79, wv * 0.86), sq(cx - s / 2.0, 0.0, s)), adv)
    g["exclamdown"] = (combine(bar(cx, cap * 0.70, cx, xh * 0.21, wv * 0.86),
                               sq(cx - s / 2.0, cap * 0.70, s)), adv)

    adv = 470.0 * st.wf
    cx = adv / 2.0
    r = adv * 0.26
    qb = Arc((cx, cap * 0.75), r, cap * 0.19, 190.0, -35.0)
    qs = Line(qb.end(), (cx + r * 0.10, xh * 0.36))
    g["question"] = (combine(union(([qb], [wv * 0.92])),
                             union(([qs], [wv * 0.92])),
                             sq(cx + r * 0.10 - s / 2.0, 0.0, s)), adv)
    g["questiondown"] = (combine(ring(cx, cap * 0.28, r * 0.7, wv * 1.2),
                                 union(([Line((cx, cap * 0.46), (cx, cap * 0.16))], [wv * 0.92])),
                                 sq(cx - s / 2.0, cap * 0.80, s)), adv)

    # quotes — flat-cut slanted bars, so they match the family's terminals
    adv = 214.0 * st.wf
    cx = adv / 2.0
    q1 = bar(cx + wv * 0.30, cap * 0.88, cx - wv * 0.30, cap * 0.60, wv * 0.66)
    q2 = bar(cx - wv * 0.34, cap * 0.88, cx - wv * 0.94, cap * 0.60, wv * 0.66)
    g["quotesingle"] = (q1, adv)
    g["quoteright"] = (q1, adv)
    g["quoteleft"] = (q2, adv)
    adv = 372.0 * st.wf
    cx = adv / 2.0
    g["quotedbl"] = (combine(bar(cx - wv * 0.10, cap * 0.88, cx - wv * 0.70, cap * 0.60, wv * 0.66),
                             bar(cx + wv * 0.80, cap * 0.88, cx + wv * 0.20, cap * 0.60, wv * 0.66)), adv)
    g["quotedblright"] = g["quotedbl"]
    g["quotedblleft"] = (combine(bar(cx - wv * 0.70, cap * 0.88, cx - wv * 0.10, cap * 0.60, wv * 0.66),
                                 bar(cx + wv * 0.20, cap * 0.88, cx + wv * 0.80, cap * 0.60, wv * 0.66)), adv)

    # brackets and braces
    adv = 328.0 * st.wf
    x0, x1 = adv * 0.30, adv * 0.76
    g["parenleft"] = (union(([Arc((adv * 0.78, cap * 0.50), adv * 0.62, cap * 0.60, 138.0, 222.0)],
                             [wv * 0.78])), adv)
    g["parenright"] = (union(([Arc((adv * 0.22, cap * 0.50), adv * 0.62, cap * 0.60, 42.0, -42.0)],
                              [wv * 0.78])), adv)
    g["bracketleft"] = (union(([Line((x1, cap * 1.02), (x0, cap * 1.02)), Line((x0, cap * 1.02), (x0, -cap * 0.15)),
                               Line((x0, -cap * 0.15), (x1, -cap * 0.15))], [wv * 0.72] * 3)), adv)
    g["bracketright"] = (union(([Line((x0, cap * 1.02), (x1, cap * 1.02)), Line((x1, cap * 1.02), (x1, -cap * 0.15)),
                                Line((x1, -cap * 0.15), (x0, -cap * 0.15))], [wv * 0.72] * 3)), adv)
    g["braceleft"] = (union(([Line((x1, cap * 1.02), (x0, cap * 0.66)), Line((x0, cap * 0.66), (x0 * 0.62, cap * 0.43)),
                              Line((x0 * 0.62, cap * 0.43), (x0, cap * 0.20)),
                              Line((x0, cap * 0.20), (x1, -cap * 0.15))], [wv * 0.68] * 4)), adv)
    g["braceright"] = (union(([Line((x0, cap * 1.02), (x1, cap * 0.66)), Line((x1, cap * 0.66), (adv - x0 * 0.62, cap * 0.43)),
                              Line((adv - x0 * 0.62, cap * 0.43), (x1, cap * 0.20)),
                              Line((x1, cap * 0.20), (x0, -cap * 0.15))], [wv * 0.68] * 4)), adv)

    # dashes, slash, underscore
    adv = 344.0 * st.wf
    g["hyphen"] = (union(([H(xh * 0.34, adv * 0.14, adv * 0.86)], [wh * 0.86])), adv)
    g["minus"] = (union(([H(xh * 0.34, adv * 0.08, adv * 0.92)], [wh * 0.86])), adv)
    g["endash"] = (union(([H(xh * 0.34, adv * 0.04, adv * 0.96)], [wh * 0.86])), adv)
    g["emdash"] = (union(([H(xh * 0.34, 10.0, 1000.0 * st.wf - 10.0)], [wh * 0.86])), 1000.0 * st.wf)
    adv = 560.0 * st.wf
    g["underscore"] = (union(([H(-cap * 0.16, 0.0, adv)], [wh * 0.86])), adv)
    adv = 470.0 * st.wf
    g["slash"] = (bar(adv * 0.14, -cap * 0.10, adv * 0.86, cap * 1.06, wv * 0.84), adv)
    g["backslash"] = (bar(adv * 0.86, -cap * 0.10, adv * 0.14, cap * 1.06, wv * 0.84), adv)

    # marks that think in maths
    adv = 588.0 * st.wf
    cx, my = adv / 2.0, xh * 0.34
    g["plus"] = (combine(union(([H(my, cx - xh * 0.40, cx + xh * 0.40)], [wh * 0.90])),
                         union(([V(cx, my - xh * 0.40, my + xh * 0.40)], [wv * 0.90]))), adv)
    g["equal"] = (combine(union(([H(my + xh * 0.14, cx - xh * 0.40, cx + xh * 0.40)], [wh * 0.90])),
                          union(([H(my - xh * 0.14, cx - xh * 0.40, cx + xh * 0.40)], [wh * 0.90]))), adv)
    g["plusminus"] = (combine(g["plus"][0],
                              union(([H(my - xh * 0.42, cx - xh * 0.40, cx + xh * 0.40)], [wh * 0.90]))), adv)
    g["multiply"] = (combine(bar(cx - xh * 0.30, my - xh * 0.30, cx + xh * 0.30, my + xh * 0.30, wv * 0.88),
                             bar(cx - xh * 0.30, my + xh * 0.30, cx + xh * 0.30, my - xh * 0.30, wv * 0.88)), adv)
    g["divide"] = (combine(union(([H(my, cx - xh * 0.40, cx + xh * 0.40)], [wh * 0.90])),
                           sq(cx - s / 2.0, my + xh * 0.16, s),
                           sq(cx - s / 2.0, my - xh * 0.16 - s, s)), adv)
    g["less"] = (union(([Line((cx + xh * 0.34, my + xh * 0.34), (cx - xh * 0.34, my)),
                        Line((cx - xh * 0.34, my), (cx + xh * 0.34, my - xh * 0.34))],
                       [wv * 0.90, wv * 0.90])), adv)
    g["greater"] = (union(([Line((cx - xh * 0.34, my + xh * 0.34), (cx + xh * 0.34, my)),
                           Line((cx + xh * 0.34, my), (cx - xh * 0.34, my - xh * 0.34))],
                          [wv * 0.90, wv * 0.90])), adv)
    g["lessequal"] = (combine(g["less"][0], union(([H(my - xh * 0.52, cx - xh * 0.40, cx + xh * 0.40)],
                                                  [wh * 0.88]))), adv)
    g["greaterequal"] = (combine(g["greater"][0], union(([H(my - xh * 0.52, cx - xh * 0.40, cx + xh * 0.40)],
                                                        [wh * 0.88]))), adv)
    g["notequal"] = (combine(g["equal"][0], bar(cx + xh * 0.16, my + xh * 0.36,
                                                cx - xh * 0.16, my - xh * 0.36, wv * 0.86)), adv)
    g["asciitilde"] = (combine(union(([Arc((cx - xh * 0.20, my + xh * 0.075), xh * 0.20, xh * 0.075, 180.0, 0.0)],
                                        [wv * 0.76])),
                               union(([Arc((cx + xh * 0.20, my - xh * 0.075), xh * 0.20, xh * 0.075, 180.0, 0.0)],
                                      [wv * 0.76]))), adv)
    g["approxequal"] = (combine(union(([Arc((cx - xh * 0.20, my + xh * 0.20), xh * 0.20, xh * 0.06, 180.0, 0.0)],
                                        [wv * 0.70])),
                                union(([Arc((cx + xh * 0.20, my + xh * 0.08), xh * 0.20, xh * 0.06, 180.0, 0.0)],
                                       [wv * 0.70])),
                                union(([Arc((cx - xh * 0.20, my - xh * 0.08), xh * 0.20, xh * 0.06, 180.0, 0.0)],
                                       [wv * 0.70])),
                                union(([Arc((cx + xh * 0.20, my - xh * 0.20), xh * 0.20, xh * 0.06, 180.0, 0.0)],
                                       [wv * 0.70]))), adv)

    # asterisk, numbersign, percent — the three that a "claims" list is easy to
    # overstate: the gate caught them missing from the binaries
    adv = 420.0 * st.wf
    cx, cy = adv / 2.0, cap * 0.80
    arm = cap * 0.17
    g["asterisk"] = (combine(union(([Line((cx, cy - arm), (cx, cy + arm))], [wv * 0.68])),
                             bar(cx - arm * 0.90, cy - arm * 0.52, cx + arm * 0.90, cy + arm * 0.52,
                                 wv * 0.68),
                             bar(cx - arm * 0.90, cy + arm * 0.52, cx + arm * 0.90, cy - arm * 0.52,
                                 wv * 0.68)), adv)
    adv = 596.0 * st.wf
    g["numbersign"] = (combine(bar(adv * 0.28, cap * 0.02, adv * 0.22, cap * 0.70, wv * 0.80),
                               bar(adv * 0.66, cap * 0.02, adv * 0.60, cap * 0.70, wv * 0.80),
                               union(([H(cap * 0.26, adv * 0.10, adv * 0.90)], [wh * 0.80])),
                               union(([H(cap * 0.48, adv * 0.10, adv * 0.90)], [wh * 0.80]))), adv)
    adv = 660.0 * st.wf
    cx = adv / 2.0
    rs = adv * 0.13
    g["percent"] = (combine(ring(cx - adv * 0.21, cap * 0.76, rs, wv * 0.86),
                            ring(cx + adv * 0.21, cap * 0.24, rs, wv * 0.86),
                            bar(cx - adv * 0.30, cap * 0.02, cx + adv * 0.30, cap * 0.72,
                                wv * 0.80)), adv)

    # currency, degree, symbols
    adv = 596.0 * st.wf
    cx = adv / 2.0
    g["dollar"] = (combine(union(([Arc((cx, cap * 0.72), adv * 0.24, cap * 0.18, 15.0, 200.0)],
                                  [wv * 0.84])),
                           union(([Arc((cx, cap * 0.28), adv * 0.24, cap * 0.18, 195.0, -20.0)],
                                  [wv * 0.84])),
                           union(([V(cx, cap * 0.04, cap * 0.96)], [wv * 0.58]))), adv)
    g["euro"] = (combine(union(([Arc((cx + adv * 0.05, cap * 0.50), adv * 0.26, cap * 0.34,
                                     -30.0, 210.0)], [wv * 0.90])),
                         union(([H(cap * 0.58, adv * 0.22, adv * 0.70)], [wh * 0.52])),
                         union(([H(cap * 0.38, adv * 0.22, adv * 0.70)], [wh * 0.52]))), adv)
    x = adv * 0.30
    g["sterling"] = (combine(union(([V(x, 0.0, cap * 0.70),
                                     Arc((x + cap * 0.20, cap * 0.70), cap * 0.20, cap * 0.20,
                                         180.0, 95.0)], [wv * 0.88, wv * 0.88])),
                             union(([H(0.0, x - wv / 2.0, adv * 0.88)], [wh * 0.88])),
                             union(([H(cap * 0.42, adv * 0.14, adv * 0.80)], [wh * 0.80]))), adv)
    adv = 396.0 * st.wf
    g["degree"] = (ring(adv / 2.0, cap * 0.80, adv * 0.20, wv * 0.82), adv)
    adv = 348.0 * st.wf
    cx = adv / 2.0
    g["periodcentered"] = (sq(cx - s * 0.42, xh * 0.30, s * 0.84), adv)
    g["middot"] = g["periodcentered"]
    g["bullet"] = (combine(ring(cx, xh * 0.32, wv * 1.10, wv * 2.40)), adv)
    adv = 972.0 * st.wf
    g["ellipsis"] = (combine(sq(adv * 0.10 - s / 2.0, 0.0, s),
                             sq(adv * 0.50 - s / 2.0, 0.0, s),
                             sq(adv * 0.90 - s / 2.0, 0.0, s)), adv)

    # arrows and a check mark (a glyph in a font; never a verified badge in a document)
    def arrow(adv: float, kind: str) -> Glyph:
        cx, cy = adv / 2.0, xh * 0.42
        span = adv * 0.34
        head = span * 0.52
        if kind == "right":
            return (combine(union(([H(cy, cx - span, cx + span)], [wh * 0.88])),
                            union(([Line((cx + span - head, cy + head), (cx + span, cy)),
                                    Line((cx + span, cy), (cx + span - head, cy - head))],
                                   [wv * 0.88, wv * 0.88]))), adv)
        if kind == "left":
            return (combine(union(([H(cy, cx - span, cx + span)], [wh * 0.88])),
                            union(([Line((cx - span + head, cy + head), (cx - span, cy)),
                                    Line((cx - span, cy), (cx - span + head, cy - head))],
                                   [wv * 0.88, wv * 0.88]))), adv)
        if kind == "up":
            return (combine(union(([V(cx, 0.0, xh * 0.84)], [wv * 0.88])),
                            union(([Line((cx - head, xh * 0.84 - head), (cx, xh * 0.84)),
                                    Line((cx, xh * 0.84), (cx + head, xh * 0.84 - head))],
                                   [wh * 0.88, wh * 0.88]))), adv)
        return (combine(union(([V(cx, xh * 0.16, xh * 1.00)], [wv * 0.88])),
                        union(([Line((cx - head, 0.16 * xh + head), (cx, xh * 0.16)),
                                Line((cx, xh * 0.16), (cx + head, 0.16 * xh + head))],
                               [wh * 0.88, wh * 0.88]))), adv)

    g["arrowright"] = arrow(596.0 * st.wf, "right")
    g["arrowleft"] = arrow(596.0 * st.wf, "left")
    g["arrowup"] = arrow(560.0 * st.wf, "up")
    g["arrowdown"] = arrow(560.0 * st.wf, "down")
    adv = 596.0 * st.wf
    g["check"] = (union(([Line((adv * 0.18, xh * 0.50), (adv * 0.42, xh * 0.18)),
                         Line((adv * 0.42, xh * 0.18), (adv * 0.84, xh * 0.86))],
                        [wv * 0.92, wv * 0.92])), adv)

    # ampersand and at — first-pass constructions, flagged as such in the docs
    adv = 640.0 * st.wf
    cx = adv / 2.0
    up = Ring((cx - adv * 0.03, cap * 0.74), cap * 0.15, cap * 0.18)
    lo = Arc((cx + adv * 0.01, cap * 0.28), cap * 0.26, cap * 0.30, 170.0, -55.0)
    leg = Line((cx + adv * 0.20, cap * 0.22), (cx + adv * 0.38, 0.0))
    g["ampersand"] = (combine(union(([up], [wv * 0.92])),
                              union(([lo], [wv * 0.92])),
                              union(([leg], [wv * 0.92]))), adv)
    adv = 700.0 * st.wf
    cx = adv / 2.0
    g["at"] = (combine(union(([Ring((cx, cap * 0.46), adv * 0.34, cap * 0.44)], [wv * 0.86])),
                       union(([Ring((cx, cap * 0.44), adv * 0.13, cap * 0.17)], [wv * 0.82])),
                       union(([Line((cx + adv * 0.13, cap * 0.44), (cx + adv * 0.13, cap * 0.60))],
                              [wv * 0.82]))), adv)
    return g


# --------------------------------------------- German characters and composites


def german(st: Style) -> dict[str, Glyph]:
    xh, cap, asc, ov = st.xh, st.cap, st.asc, st.ov
    wv, wc = st.w_v, st.w_c
    sbr = st.sb_round
    g: dict[str, Glyph] = {}

    # ß — a stem with an upper bowl and a lower bowl that opens at the baseline
    adv = 576.0 * st.wf
    il, ir = sbr, adv - sbr
    stem_x = il + wv / 2.0
    cx = il + wv
    rx = ir - cx
    g["germandbls"] = (union(([bowl_right(cx, xh * 0.74, rx, xh * 0.26 + ov)], [wc]),
                             ([V(stem_x, 0.0, asc * 0.90)], [wv]),
                             ([bowl_right(cx, xh * 0.28, rx * 0.96, xh * 0.28 + ov)], [wc])), adv)
    # ẞ — the capital form: a full-height stem with two bowls
    adv = 632.0 * st.wf
    il, ir = sbr, adv - sbr
    stem_x = il + wv / 2.0
    cx = il + wv
    rx = ir - cx
    g["uni1E9E"] = (union(([V(stem_x, 0.0, cap)], [wv]),
                          ([bowl_right(cx, cap * 0.76, rx * 0.96, cap * 0.24 + ov)], [wc]),
                          ([bowl_right(cx, cap * 0.26, rx, cap * 0.26 + ov)], [wc])), adv)
    return g


# Base glyph -> (advance, list of (diacritic, name, height offset factor))
ACCENTS = [
    ("dieresis", m_dieresis), ("acute", m_acute), ("grave", m_grave),
    ("circumflex", m_circumflex), ("caron", m_caron), ("tilde", m_tilde),
    ("macron", m_macron), ("ring", m_ring), ("dotaccent", m_dot), ("ogonek", m_ogonek),
]

# Lowercase and uppercase additions: (accent, base) -> glyph name
LOWER_COMPOSITES = [
    ("a", "dieresis", "adieresis"), ("o", "dieresis", "odieresis"), ("u", "dieresis", "udieresis"),
    ("e", "dieresis", "edieresis"), ("i", "dieresis", "idieresis"), ("y", "dieresis", "ydieresis"),
    ("a", "acute", "aacute"), ("e", "acute", "eacute"), ("i", "acute", "iacute"),
    ("o", "acute", "oacute"), ("u", "acute", "uacute"), ("y", "acute", "yacute"),
    ("a", "grave", "agrave"), ("e", "grave", "egrave"), ("i", "grave", "igrave"),
    ("o", "grave", "ograve"), ("u", "grave", "ugrave"),
    ("a", "circumflex", "acircumflex"), ("e", "circumflex", "ecircumflex"),
    ("i", "circumflex", "icircumflex"), ("o", "circumflex", "ocircumflex"),
    ("u", "circumflex", "ucircumflex"),
    ("a", "tilde", "atilde"), ("n", "tilde", "ntilde"), ("o", "tilde", "otilde"),
    ("a", "ring", "aring"),
    ("c", "caron", "ccaron"), ("s", "caron", "scaron"), ("z", "caron", "zcaron"),
    ("s", "acute", "sacute"), ("z", "acute", "zacute"), ("c", "acute", "cacute"),
    ("n", "acute", "nacute"), ("e", "caron", "ecaron"), ("r", "caron", "rcaron"),
    ("a", "macron", "amacron"), ("e", "macron", "emacron"), ("o", "macron", "omacron"),
    ("u", "ogonek", "uogonek"), ("a", "ogonek", "aogonek"),
    ("z", "dotaccent", "zdotaccent"),
]
UPPER_COMPOSITES = [
    ("A", "dieresis", "Adieresis"), ("O", "dieresis", "Odieresis"), ("U", "dieresis", "Udieresis"),
    ("E", "dieresis", "Edieresis"), ("I", "dieresis", "Idieresis"),
    ("A", "acute", "Aacute"), ("E", "acute", "Eacute"), ("I", "acute", "Iacute"),
    ("O", "acute", "Oacute"), ("U", "acute", "Uacute"), ("Y", "acute", "Yacute"),
    ("A", "grave", "Agrave"), ("E", "grave", "Egrave"), ("I", "grave", "Igrave"),
    ("O", "grave", "Ograve"), ("U", "grave", "Ugrave"),
    ("A", "circumflex", "Acircumflex"), ("E", "circumflex", "Ecircumflex"),
    ("I", "circumflex", "Icircumflex"), ("O", "circumflex", "Ocircumflex"),
    ("U", "circumflex", "Ucircumflex"),
    ("A", "tilde", "Atilde"), ("N", "tilde", "Ntilde"), ("O", "tilde", "Otilde"),
    ("A", "ring", "Aring"),
    ("C", "caron", "Ccaron"), ("S", "caron", "Scaron"), ("Z", "caron", "Zcaron"),
    ("C", "acute", "Cacute"), ("S", "acute", "Sacute"), ("Z", "acute", "Zacute"),
    ("N", "acute", "Nacute"), ("E", "caron", "Ecaron"), ("R", "caron", "Rcaron"),
    ("A", "macron", "Amacron"), ("E", "macron", "Emacron"), ("O", "macron", "Omacron"),
    ("Z", "dotaccent", "Zdotaccent"),
]


def composites(st: Style, base_glyphs: dict[str, Glyph]) -> dict[str, Glyph]:
    """Build the accented characters as base contours plus an independent mark."""
    marks = dict(ACCENTS)
    out: dict[str, Glyph] = {}
    lower_round = {"a", "o", "u", "e", "c", "s", "z", "n", "r", "y", "i"}
    upper_round = {"A", "O", "U", "E", "C", "S", "Z", "N", "R", "I"}

    for base, acc, name in LOWER_COMPOSITES + UPPER_COMPOSITES:
        if base not in base_glyphs:
            continue
        contours, adv = base_glyphs[base]
        upper = base.isupper()
        top = st.cap if upper else st.xh
        cx = None
        # centre the mark on the base's ink
        xs = [p[0] for c in contours for s in c for p in
              ([s[1], s[2]] if s[0] == "line" else [s[1], s[2], s[3], s[4]])]
        cx = (min(xs) + max(xs)) / 2.0 if xs else adv / 2.0
        overshoot = st.ov if base in (lower_round if not upper else upper_round) else 0.0
        gap = st.cap * 0.09 if upper else st.cap * 0.075
        y = top + overshoot + gap
        if acc in ("ogonek", "cedilla"):
            out[name] = (combine(contours, marks[acc](cx, 0.0, st)), adv)
        else:
            if acc in ("dieresis", "dotaccent"):
                y = top + overshoot + st.cap * 0.055
            out[name] = (combine(contours, marks[acc](cx, y, st)), adv)

    # c cedilla needs the hook below the baseline, not above
    for base, name in (("c", "ccedilla"), ("C", "Ccedilla"), ("s", "scedilla"),
                       ("S", "Scedilla")):
        if base not in base_glyphs:
            continue
        contours, adv = base_glyphs[base]
        xs = [p[0] for c in contours for s in c for p in
              ([s[1], s[2]] if s[0] == "line" else [s[1], s[2], s[3], s[4]])]
        cx = (min(xs) + max(xs)) / 2.0 if xs else adv / 2.0
        out[name] = (combine(contours, m_cedilla(cx, 0.0, st)), adv)

    # O slash family, built as the ring plus a released stroke
    for base, name in (("O", "Oslash"), ("o", "oslash")):
        if base not in base_glyphs:
            continue
        contours, adv = base_glyphs[base]
        lo = -st.cap * 0.06 if base == "O" else -st.cap * 0.10
        hi = st.cap if base == "O" else st.xh
        out[name] = (combine(contours, bar(0.0, lo, adv, hi, st.w_v * 0.86)), adv)
    return out
