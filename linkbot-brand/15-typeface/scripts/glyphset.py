#!/usr/bin/env python3
"""Linkbot Type — original letterforms.

One construction, three roles. Every glyph is authored once as CENTRELINES in
terms of (advance, sidebearing, x-height, stroke widths). Linkbot Display,
Linkbot Sans and Linkbot Mono are the same skeletons evaluated at different
parameters, which is why they read as one family rather than three fonts.

Each glyph is assembled with `union()` from one or more CONNECTED strokes. A
stroke is a path whose prims are listed in traversal order and whose endpoints
coincide; prims that merely touch (a stem crossed by a bar, a bowl meeting a
stem) belong to different strokes. Getting this wrong draws connectors where the
letter should have none — which is the failure this file was rewritten to fix.

The family's design language — all of it deliberate, all of it original:

  1. SINGLE-STOREY a and g. A geometric family, not a neo-grotesque.
  2. SQUARE DOTS on i, j and the punctuation: the mark's inscribed square,
     carried into the type.
  3. FLAT CUT terminals. Butt caps everywhere, no rounded terminals, which is
     what makes the family read as precise rather than friendly.
  4. OCTAGONAL APEXES on the diagonals of A, V, W — the apices carry a short flat
     instead of a point, echoing the mark's octagon.
  5. ONE CONTRAST AXIS divides the roles: Display carries real thick/thin
     contrast, Sans is essentially monoline for UI legibility, Mono sits between.

Stdlib only. Imported by build_sources.py.
"""
from __future__ import annotations

from dataclasses import dataclass

from glyphlib import Arc, Line, Prim, Ring, union, union_closed

UPM = 1000
APEX = 9.0  # half-length of the flat at a diagonal vertex (the octagonal apex)


@dataclass
class Style:
    name: str
    cap: float = 700.0
    xh: float = 500.0
    asc: float = 730.0
    desc: float = -214.0
    ov: float = 11.0
    w_v: float = 88.0
    w_h: float = 84.0
    w_c: float = 88.0
    w_d: float = 86.0
    wf: float = 1.0
    mono: float | None = None
    sb_stem: float = 78.0
    sb_round: float = 60.0


SANS = Style(name="Linkbot Sans", xh=500.0, asc=730.0, desc=-214.0, ov=11.0,
             w_v=88.0, w_h=84.0, w_c=88.0, w_d=86.0, sb_stem=78.0, sb_round=60.0)
SANS_MEDIUM = Style(name="Linkbot Sans Medium", xh=500.0, asc=730.0, desc=-214.0, ov=12.0,
                    w_v=108.0, w_h=103.0, w_c=108.0, w_d=106.0, sb_stem=76.0, sb_round=58.0)
SANS_BOLD = Style(name="Linkbot Sans Bold", xh=502.0, asc=730.0, desc=-216.0, ov=14.0,
                  w_v=142.0, w_h=134.0, w_c=142.0, w_d=138.0, sb_stem=72.0, sb_round=54.0)
MONO = Style(name="Linkbot Mono", xh=520.0, asc=740.0, desc=-214.0, ov=11.0,
             w_v=86.0, w_h=86.0, w_c=86.0, w_d=86.0, mono=600.0, sb_stem=70.0, sb_round=56.0)
MONO_BOLD = Style(name="Linkbot Mono Bold", xh=522.0, asc=740.0, desc=-216.0, ov=13.0,
                  w_v=124.0, w_h=124.0, w_c=124.0, w_d=124.0, mono=600.0,
                  sb_stem=64.0, sb_round=52.0)
DISPLAY = Style(name="Linkbot Display", xh=466.0, asc=726.0, desc=-206.0, ov=13.0,
                w_v=104.0, w_h=62.0, w_c=86.0, w_d=74.0, wf=1.06,
                sb_stem=62.0, sb_round=48.0)
DISPLAY_BOLD = Style(name="Linkbot Display Bold", xh=470.0, asc=726.0, desc=-210.0, ov=15.0,
                     w_v=150.0, w_h=92.0, w_c=124.0, w_d=106.0, wf=1.06,
                     sb_stem=58.0, sb_round=44.0)

ROLES = {
    "LinkbotSans-Regular": SANS,
    "LinkbotSans-Medium": SANS_MEDIUM,
    "LinkbotSans-Bold": SANS_BOLD,
    "LinkbotMono-Regular": MONO,
    "LinkbotMono-Bold": MONO_BOLD,
    "LinkbotDisplay-Regular": DISPLAY,
    "LinkbotDisplay-Bold": DISPLAY_BOLD,
}

Glyph = tuple[list[list], float]


def V(x: float, y0: float, y1: float) -> Line:
    return Line((x, y0), (x, y1))


def H(y: float, x0: float, x1: float) -> Line:
    return Line((x0, y), (x1, y))


# An arc that terminates on a stem is swept PAST the junction by this many
# degrees so its ink overlaps the stem's ink. Without the overlap the butt cap
# leaves a notch exactly where the arc meets the stem — visible on B, D, P, R,
# a, b, d, g, p, q.
OVER = 14.0


def arch(xl: float, xr: float, ytop: float) -> Arc:
    """Upper arch from the left stem, over the top, to the right stem."""
    ro = (xr - xl) / 2.0
    return Arc(((xl + xr) / 2.0, ytop - ro), ro, ro, 180.0 + OVER, 0.0 - OVER)


def trough(xl: float, xr: float, ybot: float) -> Arc:
    """Lower trough from the left stem, under the bottom, to the right stem."""
    ro = (xr - xl) / 2.0
    return Arc(((xl + xr) / 2.0, ybot + ro), ro, ro, 180.0 - OVER, 360.0 + OVER)


def bowl_left(cx: float, cy: float, rx: float, ry: float) -> Arc:
    """Left half bowl, from the top attachment round the left to the bottom."""
    return Arc((cx, cy), rx, ry, 90.0 - OVER, 270.0 + OVER)


def bowl_right(cx: float, cy: float, rx: float, ry: float) -> Arc:
    """Right half bowl, from the top attachment round the right to the bottom."""
    return Arc((cx, cy), rx, ry, 90.0 + OVER, -90.0 - OVER)


def spine(cx: float, rx: float, y_top: float, y_bot: float, depth: float = 0.28) -> list[Prim]:
    """The S spine: an upper sweep, a middle diagonal, a lower sweep, as ONE
    connected path. Two independent bowls cannot make an S — they overlap on the
    same side and read as a C with a bar through it."""
    ry = (y_top - y_bot) * depth
    a1 = Arc((cx, y_top - ry), rx, ry, 12.0, 168.0)
    a3 = Arc((cx, y_bot + ry), rx, ry, 48.0, -180.0)
    return [a1, Line(a1.end(), a3.start()), a3]


# ------------------------------------------------------------------ lowercase


def lower(st: Style) -> dict[str, Glyph]:
    xh, asc, desc, ov = st.xh, st.asc, st.desc, st.ov
    wv, wh, wc, wd = st.w_v, st.w_h, st.w_c, st.w_d
    sbs, sbr = st.sb_stem, st.sb_round
    g: dict[str, Glyph] = {}

    def arch_letter(adv: float, arches: int, tall: bool) -> Glyph:
        """n, h, m — arches over stems. The left stem is one stroke; the arches
        plus the final stem are a second connected stroke; any middle stem hangs
        from its junction as a third."""
        il, ir = sbs, adv - sbs
        span = (ir - il - wv) / arches
        xs = [il + wv / 2.0 + span * i for i in range(arches + 1)]
        ro = span / 2.0
        cy = xh - ro
        groups: list[tuple[list[Prim], list[float]]] = [
            ([V(xs[0], 0.0, asc if tall else cy)], [wv])
        ]
        for i in range(1, arches):
            groups.append(([V(xs[i], cy, 0.0)], [wv]))
        chain: list[Prim] = []
        widths: list[float] = []
        for i in range(arches):
            chain.append(arch(xs[i], xs[i + 1], xh))
            widths.append(wc)
        chain.append(V(xs[arches], cy, 0.0))
        widths.append(wv)
        groups.append((chain, widths))
        return union(*groups), adv

    g["n"] = arch_letter(566.0 * st.wf, 1, False)
    g["h"] = arch_letter(568.0 * st.wf, 1, True)
    g["m"] = arch_letter(836.0 * st.wf, 2, False)

    # u — one connected trough
    adv = 568.0 * st.wf
    il, ir = sbs, adv - sbs
    xs = [il + wv / 2.0, ir - wv / 2.0]
    ro = (xs[1] - xs[0]) / 2.0
    g["u"] = (union(([V(xs[0], xh, ro), trough(xs[0], xs[1], 0.0), V(xs[1], ro, xh)], [wv, wc, wv])), adv)

    # l i j
    ladv = sbs * 2.0 + wv
    lx = sbs + wv / 2.0
    g["l"] = (union(([V(lx, 0.0, asc)], [wv])), ladv)
    dw = wv * 1.12                      # the dot is a square of the stem's order
    dot_y0 = xh + wv * 1.42
    g["i"] = (union(([V(lx, 0.0, xh)], [wv]), ([V(lx, dot_y0, dot_y0 + dw)], [dw])), ladv)
    rh = wc * 0.9
    yd = desc + rh
    g["j"] = (union(([V(lx, xh, yd), Arc((lx - rh, yd), rh, rh, 0.0, -180.0)], [wv, wc]),
                    ([V(lx, dot_y0, dot_y0 + dw)], [dw])), ladv)

    # t f r — stem plus a crossing bar or an arm
    adv = 380.0 * st.wf
    x = sbs + wv / 2.0
    g["t"] = (union(([V(x, desc * 0.06, asc * 0.90)], [wv]),
                    ([H(xh * 0.86, sbs * 0.92, adv - sbs * 0.36)], [wh])), adv)
    adv = 404.0 * st.wf
    x = sbs + wv / 2.0
    hook_r = 150.0 * st.wf
    g["f"] = (union(([V(x, 0.0, asc * 0.94 - hook_r),
                      Arc((x + hook_r, asc * 0.94 - hook_r), hook_r, hook_r, 180.0, 90.0)], [wv, wc]),
                    ([H(xh * 0.86, sbs * 0.92, adv - sbs * 0.34)], [wh])), adv)
    adv = 396.0 * st.wf
    x = sbs + wv / 2.0
    arm_r = (adv - sbr) - x
    g["r"] = (union(([V(x, 0.0, xh - arm_r), Arc((x + arm_r, xh - arm_r), arm_r, arm_r, 180.0, 90.0)],
                     [wv, wc])), adv)

    # c e o
    adv = 560.0 * st.wf
    il, ir = sbr, adv - sbr
    cx = (il + ir) / 2.0
    rx = (ir - il) / 2.0
    ry = xh / 2.0 + ov
    g["c"] = (union(([Arc((cx, xh / 2.0), rx, ry, -32.0, 212.0)], [wc])), adv)
    adv = 570.0 * st.wf
    il, ir = sbr, adv - sbr
    cx = (il + ir) / 2.0
    rx = (ir - il) / 2.0
    ry = xh / 2.0 + ov
    g["e"] = (union_closed(([Arc((cx, xh / 2.0), rx, ry, -18.0, 316.0)], [wc]))
              + union(([H(xh * 0.47, cx - rx * 0.40, ir)], [wh])), adv)
    adv = 596.0 * st.wf
    il, ir = sbr, adv - sbr
    g["o"] = (union(([Ring(((il + ir) / 2.0, xh / 2.0), (ir - il) / 2.0, xh / 2.0 + ov)], [wc])), adv)

    # a b d p q g — one bowl attached to a straight stem
    def bowl_side(adv: float, side: str, tall: bool, deep: bool) -> Glyph:
        il, ir = sbr, adv - sbr
        if side == "left":
            cx = ir - wv
            rx = cx - il
            bowl = bowl_left(cx, xh / 2.0, rx, xh / 2.0 + ov)
            stem_x = ir - wv / 2.0
        else:
            cx = il + wv
            rx = ir - cx
            bowl = bowl_right(cx, xh / 2.0, rx, xh / 2.0 + ov)
            stem_x = il + wv / 2.0
        return (union(([bowl], [wc]), ([V(stem_x, desc if deep else 0.0, asc if tall else xh)], [wv])), adv)

    g["a"] = bowl_side(582.0 * st.wf, "left", False, False)
    g["b"] = bowl_side(592.0 * st.wf, "right", True, False)
    g["d"] = bowl_side(592.0 * st.wf, "left", True, False)
    g["p"] = bowl_side(592.0 * st.wf, "right", False, True)
    g["q"] = bowl_side(592.0 * st.wf, "left", False, True)

    adv = 592.0 * st.wf
    il, ir = sbr, adv - sbr
    cx = ir - wv
    rx = cx - il
    ry = xh / 2.0 + ov
    rh = wc * 0.9
    yd = desc + rh
    stem_x = ir - wv / 2.0
    g["g"] = (union(([bowl_left(cx, xh / 2.0, rx, ry)], [wc]),
                    ([V(stem_x, xh, yd), Arc((stem_x - rh, yd), rh, rh, 0.0, -170.0)], [wv, wc])), adv)

    adv = 528.0 * st.wf
    il, ir = sbr, adv - sbr
    cx = (il + ir) / 2.0
    rx = (ir - il) / 2.0
    ym = xh * 0.50
    g["s"] = (union((spine(cx, rx, xh, 0.0), [wc, wc, wc])), adv)

    adv = 560.0 * st.wf
    il, ir = sbs, adv - sbs
    x = il + wv / 2.0
    yj = xh * 0.46
    jx = x + wv * 0.30
    g["k"] = (union(([V(x, 0.0, asc)], [wv]),
                    ([Line((jx, yj), (ir - wd * 0.30, xh)), Line((jx, yj), (ir, 0.0))], [wd, wd])), adv)

    adv = 532.0 * st.wf
    il, ir = sbs, adv - sbs
    cx = (il + ir) / 2.0
    g["v"] = (union(([Line((il, xh), (cx - APEX, 0.0)), Line((cx - APEX, 0.0), (cx + APEX, 0.0)),
                      Line((cx + APEX, 0.0), (ir, xh))], [wd, wd, wd])), adv)

    adv = 784.0 * st.wf
    il, ir = sbs, adv - sbs
    sp = (ir - il) / 4.0
    g["w"] = (union(([Line((il, xh), (il + sp - APEX, 0.0)),
                      Line((il + sp - APEX, 0.0), (il + sp + APEX, 0.0)),
                      Line((il + sp + APEX, 0.0), (il + 2 * sp, xh * 0.74)),
                      Line((il + 2 * sp, xh * 0.74), (il + 3 * sp - APEX, 0.0)),
                      Line((il + 3 * sp - APEX, 0.0), (il + 3 * sp + APEX, 0.0)),
                      Line((il + 3 * sp + APEX, 0.0), (ir, xh))], [wd] * 6)), adv)

    adv = 532.0 * st.wf
    il, ir = sbs, adv - sbs
    g["x"] = (union(([Line((il, 0.0), (ir, xh))], [wd]), ([Line((il, xh), (ir, 0.0))], [wd])), adv)

    adv = 532.0 * st.wf
    il, ir = sbs, adv - sbs
    jx, jy = (il + ir) / 2.0, xh * 0.44
    g["y"] = (union(([Line((ir, xh), (jx, jy)), Line((jx, jy), (ir - wd * 0.25, desc * 0.60))],
                     [wd, wd]),
                    ([Line((il, xh), (jx, jy))], [wd])), adv)

    adv = 504.0 * st.wf
    il, ir = sbs, adv - sbs
    g["z"] = (union(([H(xh, il, ir), Line((ir, xh), (il, 0.0)), H(0.0, il, ir)], [wh, wd, wh])), adv)
    return g


# ------------------------------------------------------------------ uppercase


def upper(st: Style) -> dict[str, Glyph]:
    cap, ov = st.cap, st.ov
    wv, wh, wc, wd = st.w_v, st.w_h, st.w_c, st.w_d
    sbs, sbr = st.sb_stem, st.sb_round
    g: dict[str, Glyph] = {}

    adv = 676.0 * st.wf
    lx, rx = sbs + wv / 2.0, adv - sbs - wv / 2.0
    g["H"] = (union(([V(lx, 0.0, cap)], [wv]), ([V(rx, 0.0, cap)], [wv]),
                    ([H(cap * 0.55, sbs, adv - sbs)], [wh])), adv)
    adv = 268.0 * st.wf
    g["I"] = (union(([V(adv / 2.0, 0.0, cap)], [wv])), adv)

    adv = 576.0 * st.wf
    il, ir = sbs, adv - sbs
    g["E"] = (union(([V(il + wv / 2.0, 0.0, cap)], [wv]), ([H(cap, il, ir)], [wh]),
                    ([H(cap * 0.53, il, ir - (ir - il) * 0.12)], [wh]),
                    ([H(0.0, il, ir)], [wh])), adv)
    adv = 560.0 * st.wf
    il, ir = sbs, adv - sbs
    g["F"] = (union(([V(il + wv / 2.0, 0.0, cap)], [wv]), ([H(cap, il, ir)], [wh]),
                    ([H(cap * 0.53, il, ir - (ir - il) * 0.18)], [wh])), adv)
    adv = 548.0 * st.wf
    il, ir = sbs, adv - sbs
    g["L"] = (union(([V(il + wv / 2.0, 0.0, cap)], [wv]), ([H(0.0, il, ir)], [wh])), adv)
    adv = 596.0 * st.wf
    il, ir = sbs, adv - sbs
    g["T"] = (union(([H(cap, il, ir)], [wh]), ([V((il + ir) / 2.0, 0.0, cap)], [wv])), adv)

    def ring_letter(adv: float) -> list[list]:
        il, ir = sbr, adv - sbr
        return union(([Ring(((il + ir) / 2.0, cap / 2.0), (ir - il) / 2.0, cap / 2.0 + ov)], [wc]))

    adv = 692.0 * st.wf
    g["O"] = (ring_letter(adv), adv)
    il, ir = sbr, adv - sbr
    cx = (il + ir) / 2.0
    rx = (ir - il) / 2.0
    tail = Line((cx + rx * 0.60, cap * 0.20 - ov), (cx + rx * 1.06, -cap * 0.12))
    g["Q"] = (ring_letter(adv) + union(([tail], [wd])), adv)

    adv = 636.0 * st.wf
    il, ir = sbr, adv - sbr
    cx = (il + ir) / 2.0
    rx = (ir - il) / 2.0
    ry = cap / 2.0 + ov
    g["C"] = (union(([Arc((cx, cap / 2.0), rx, ry, -32.0, 212.0)], [wc])), adv)
    adv = 684.0 * st.wf
    il, ir = sbr, adv - sbr
    cx = (il + ir) / 2.0
    rx = (ir - il) / 2.0
    ry = cap / 2.0 + ov
    g["G"] = (union(([Arc((cx, cap / 2.0), rx, ry, -32.0, 212.0)], [wc]),
                    ([H(cap * 0.47, cx - rx * 0.06, ir)], [wh])), adv)
    adv = 584.0 * st.wf
    il, ir = sbr, adv - sbr
    cx = (il + ir) / 2.0
    rx = (ir - il) / 2.0
    ym = cap * 0.50
    g["S"] = (union((spine(cx, rx, cap, 0.0), [wc, wc, wc])), adv)

    adv = 664.0 * st.wf
    il, ir = sbs, adv - sbr
    stem_x = il + wv / 2.0
    cx = il + wv
    g["D"] = (union(([V(stem_x, 0.0, cap)], [wv]),
                    ([bowl_right(cx, cap / 2.0, ir - cx, cap / 2.0 + ov)], [wc])), adv)
    adv = 620.0 * st.wf
    il, ir = sbs, adv - sbr
    stem_x = il + wv / 2.0
    cx = il + wv
    g["P"] = (union(([V(stem_x, 0.0, cap)], [wv]),
                    ([bowl_right(cx, cap * 0.72, ir - cx, cap * 0.28 + ov)], [wc])), adv)
    adv = 632.0 * st.wf
    il, ir = sbs, adv - sbr
    stem_x = il + wv / 2.0
    cx = il + wv
    br = ir - cx
    g["R"] = (union(([V(stem_x, 0.0, cap)], [wv]),
                    ([bowl_right(cx, cap * 0.74, br, cap * 0.26 + ov)], [wc]),
                    ([Line((cx + br * 0.22, cap * 0.48), (ir, 0.0))], [wd])), adv)
    adv = 632.0 * st.wf
    il, ir = sbs, adv - sbr
    stem_x = il + wv / 2.0
    cx = il + wv
    g["B"] = (union(([V(stem_x, 0.0, cap)], [wv]),
                    ([bowl_right(cx, cap * 0.76, (ir - cx) * 0.94, cap * 0.24 + ov)], [wc]),
                    ([bowl_right(cx, cap * 0.26, ir - cx, cap * 0.26 + ov)], [wc])), adv)
    adv = 684.0 * st.wf
    il, ir = sbs, adv - sbs
    xs = [il + wv / 2.0, ir - wv / 2.0]
    ro = (xs[1] - xs[0]) / 2.0
    g["U"] = (union(([V(xs[0], cap, ro), trough(xs[0], xs[1], 0.0), V(xs[1], ro, cap)], [wv, wc, wv])), adv)
    adv = 520.0 * st.wf
    il, ir = sbs, adv - sbs
    rh = wc * 1.4
    g["J"] = (union(([V(ir - wv / 2.0, cap, rh), Arc((ir - wv / 2.0 - rh, rh), rh, rh, 0.0, -180.0)],
                     [wv, wc])), adv)

    def apex_tri(adv: float, up: bool) -> list[list]:
        il, ir = sbs, adv - sbs
        cx = (il + ir) / 2.0
        if up:
            pts = [(il, 0.0), (cx - APEX, cap), (cx + APEX, cap), (ir, 0.0)]
        else:
            pts = [(il, cap), (cx - APEX, 0.0), (cx + APEX, 0.0), (ir, cap)]
        return union(([Line(pts[0], pts[1]), Line(pts[1], pts[2]), Line(pts[2], pts[3])], [wd, wd, wd]))

    adv = 676.0 * st.wf
    il, ir = sbs, adv - sbs
    g["A"] = (apex_tri(adv, True)
              + union(([H(cap * 0.26, il + (ir - il) * 0.13, ir - (ir - il) * 0.13)], [wh])), adv)
    g["V"] = (apex_tri(656.0 * st.wf, False), 656.0 * st.wf)

    adv = 944.0 * st.wf
    il, ir = sbs, adv - sbs
    sp = (ir - il) / 4.0
    g["W"] = (union(([Line((il, cap), (il + sp - APEX, 0.0)),
                      Line((il + sp - APEX, 0.0), (il + sp + APEX, 0.0)),
                      Line((il + sp + APEX, 0.0), (il + 2 * sp, cap * 0.74)),
                      Line((il + 2 * sp, cap * 0.74), (il + 3 * sp - APEX, 0.0)),
                      Line((il + 3 * sp - APEX, 0.0), (il + 3 * sp + APEX, 0.0)),
                      Line((il + 3 * sp + APEX, 0.0), (ir, cap))], [wd] * 6)), adv)

    adv = 872.0 * st.wf
    il, ir = sbs, adv - sbs
    ax, bx = il + wv / 2.0, ir - wv / 2.0
    g["M"] = (union(([V(ax, 0.0, cap), Line((ax, cap), ((ax + bx) / 2.0, cap * 0.18)),
                      Line(((ax + bx) / 2.0, cap * 0.18), (bx, cap)), V(bx, cap, 0.0)],
                     [wv, wd, wd, wv])), adv)
    adv = 676.0 * st.wf
    il, ir = sbs, adv - sbs
    g["N"] = (union(([V(il + wv / 2.0, 0.0, cap), Line((il + wv / 2.0, cap), (ir - wv / 2.0, 0.0)),
                      V(ir - wv / 2.0, 0.0, cap)], [wv, wd, wv])), adv)
    adv = 640.0 * st.wf
    il, ir = sbs, adv - sbs
    x = il + wv / 2.0
    yj = cap * 0.44
    jx = x + wv * 0.30
    g["K"] = (union(([V(x, 0.0, cap)], [wv]),
                    ([Line((jx, yj), (ir, cap)), Line((jx, yj), (ir, 0.0))], [wd, wd])), adv)
    adv = 648.0 * st.wf
    il, ir = sbs, adv - sbs
    g["X"] = (union(([Line((il, 0.0), (ir, cap))], [wd]), ([Line((il, cap), (ir, 0.0))], [wd])), adv)
    adv = 644.0 * st.wf
    il, ir = sbs, adv - sbs
    jx, jy = (il + ir) / 2.0, cap * 0.40
    g["Y"] = (union(([Line((il, cap), (jx, jy)), Line((jx, jy), (ir, cap))], [wd, wd]),
                    ([V(jx, 0.0, jy)], [wv])), adv)
    adv = 588.0 * st.wf
    il, ir = sbs, adv - sbs
    g["Z"] = (union(([H(cap, il, ir), Line((ir, cap), (il, 0.0)), H(0.0, il, ir)], [wh, wd, wh])), adv)
    return g


# --------------------------------------------------------------------- digits


def digits(st: Style) -> dict[str, Glyph]:
    cap, ov = st.cap, st.ov
    wv, wh, wc, wd = st.w_v, st.w_h, st.w_c, st.w_d
    sbs, sbr = st.sb_stem, st.sb_round
    adv = 600.0 * st.wf
    il, ir = sbr, adv - sbr
    cx = (il + ir) / 2.0
    rx = (ir - il) / 2.0
    ry = cap / 2.0 + ov
    g: dict[str, Glyph] = {}

    g["0"] = (union(([Ring((cx, cap / 2.0), rx, ry)], [wc])), adv)
    x1 = il + (ir - il) * 0.60
    g["1"] = (union(([Line((il + wv * 0.55, cap * 0.78), (x1, cap)), V(x1, cap, 0.0)], [wd, wv])), adv)
    a2 = Arc((cx, cap * 0.72), rx, cap * 0.28 + ov, 200.0, -34.0)
    g["2"] = (union(([a2, Line(a2.end(), (il, 0.0)), H(0.0, il, ir)], [wc, wd, wh])), adv)
    g["3"] = (union(([Arc((cx, cap * 0.76), rx * 0.86, cap * 0.24 + ov, 190.0, -82.0)], [wc]),
                    ([Arc((cx, cap * 0.25), rx * 0.90, cap * 0.25 + ov, 82.0, -190.0)], [wc])), adv)
    g["4"] = (union(([Line((il + (ir - il) * 0.68, cap), (il + wv * 0.25, 0.0))], [wd]),
                    ([H(cap * 0.30, il, ir)], [wh]),
                    ([V(il + (ir - il) * 0.68 - wv * 0.62, 0.0, cap)], [wv])), adv)
    g["5"] = (union(([H(cap, il, ir)], [wh]), ([V(il + wv / 2.0, cap * 0.62, cap)], [wv]),
                    ([Arc((cx, cap * 0.32), rx, cap * 0.32 + ov, 150.0, -140.0)], [wc])), adv)
    g["6"] = (union(([Ring((cx, cap * 0.30), rx, cap * 0.30 + ov)], [wc]),
                    ([Arc((cx + rx * 0.10, cap * 0.62), rx * 0.90, cap * 0.42, 175.0, 78.0)], [wc])), adv)
    g["7"] = (union(([H(cap, il, ir)], [wh]),
                    ([Line((ir - wd * 0.35, cap), (cx - rx * 0.04, 0.0))], [wd])), adv)
    g["8"] = (union(([Ring((cx, cap * 0.74), rx * 0.70, cap * 0.26 + ov)], [wc]),
                    ([Ring((cx, cap * 0.27), rx, cap * 0.27 + ov)], [wc])), adv)
    g["9"] = (union(([Ring((cx, cap * 0.70), rx, cap * 0.30 + ov)], [wc]),
                    ([Arc((cx - rx * 0.10, cap * 0.38), rx * 0.90, cap * 0.42, 5.0, -78.0)], [wc])), adv)
    return g


def glyphs_for(st: Style) -> dict[str, Glyph]:
    """The whole character set for one role/weight.

    Alphabet first, then punctuation and symbols, then the German characters, then
    the accented composites built ON TOP of the base letters already assembled —
    which is why composites are generated rather than hand-drawn per language.
    """
    from glyphset_extra import composites, german, punct

    out: dict[str, Glyph] = {}
    out.update(lower(st))
    out.update(upper(st))
    out.update(digits(st))
    out.update(punct(st))
    out.update(german(st))
    out.update(composites(st, out))
    out["space"] = ([], st.mono if st.mono else 260.0 * st.wf)
    return out
