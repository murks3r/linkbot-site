/* The porcelain objects of the `puzzle` direction (Concept A9, W5), drawn at build time.

   Bisque and glaze: every object is unglazed porcelain ("bisque"), matte white on the white-grey
   ground, modelled only by one light from the top left and its own soft shadows, never by an
   outline. Colour arrives as glaze, a change of material, and only on what the person turns over.

   Everything here runs at build time (export.ts writes one standalone SVG file per object into
   public/directions/puzzle/), so no drawing code reaches the browser. Units: one
   piece body is 100 × 100; the CSS sizes each object in multiples of the station's piece size --S.
   No meaning is carried by SVG text (there is none): every word in the story is HTML. */

type Edges = [number, number, number, number]; // top, right, bottom, left: 1 tab, -1 notch, 0 flat
const S = 100;
const f = (n: number) => Math.round(n * 100) / 100;

/** The person's piece: tabs left and right, notches top and bottom (symmetric, so it still fits
    after it is turned over). The role's opening in the board has the same shape. */
export const YOURS: Edges = [-1, 1, -1, 1];
/** The company's own open place (its answer, never given in the story): top and right on the
    board's frame, so flat; a tab below, a notch to the left. */
const ANSWER: Edges = [0, 0, 1, -1];

// One knob along an edge from u = 0 to u = 1, w outwards (units of the edge length).
const KNOB: [string, ...number[]][] = [['L', .34, 0], ['C', .40, 0, .425, .03, .405, .085], ['C', .375, .16, .33, .285, .5, .285], ['C', .67, .285, .625, .16, .595, .085], ['C', .575, .03, .60, 0, .66, 0]];
const RC = .06;

function mapper(size: number, edges: Edges, ox: number, oy: number) {
  const corners = [[0, 0], [size, 0], [size, size], [0, size]], dirs = [[1, 0], [0, 1], [-1, 0], [0, -1]];
  return (e: number, u: number, w: number): [number, number] => {
    const [x0, y0] = corners[e], [dx, dy] = dirs[e], s = edges[e] || 0;
    return [ox + x0 + u * size * dx + w * size * dy * s, oy + y0 + u * size * dy - w * size * dx * s];
  };
}
function edgeCmds(P: ReturnType<typeof mapper>, e: number, edges: Edges) {
  let d = '';
  if (edges[e]) for (const k of KNOB) {
    if (k[0] === 'L') { const p = P(e, k[1], k[2]); d += `L${f(p[0])} ${f(p[1])}`; }
    else { const a = P(e, k[1], k[2]), b = P(e, k[3], k[4]), c = P(e, k[5], k[6]); d += `C${f(a[0])} ${f(a[1])} ${f(b[0])} ${f(b[1])} ${f(c[0])} ${f(c[1])}`; }
  }
  const end = P(e, 1 - RC, 0);
  return d + `L${f(end[0])} ${f(end[1])}`;
}
export function piecePath(size: number, edges: Edges, ox = 0, oy = 0) {
  const P = mapper(size, edges, ox, oy), ends = [[ox + size, oy], [ox + size, oy + size], [ox, oy + size], [ox, oy]];
  const s = P(0, RC, 0);
  let d = `M${f(s[0])} ${f(s[1])}`;
  for (let e = 0; e < 4; e++) { d += edgeCmds(P, e, edges); const c = ends[e], n = P((e + 1) % 4, RC, 0); d += `Q${f(c[0])} ${f(c[1])} ${f(n[0])} ${f(n[1])}`; }
  return d + 'Z';
}
function edgePath(size: number, edges: Edges, e: number, ox = 0, oy = 0) {
  const P = mapper(size, edges, ox, oy), s = P(e, RC, 0);
  return `M${f(s[0])} ${f(s[1])}` + edgeCmds(P, e, edges);
}
function seam(ax: number, ay: number, bx: number, by: number, s: number) {
  const L = Math.hypot(bx - ax, by - ay), dx = (bx - ax) / L, dy = (by - ay) / L;
  const P = (u: number, w: number) => [ax + u * L * dx + w * L * dy * s, ay + u * L * dy - w * L * dx * s];
  let d = `M${f(ax)} ${f(ay)}`;
  for (const k of KNOB) {
    if (k[0] === 'L') { const p = P(k[1], k[2]); d += `L${f(p[0])} ${f(p[1])}`; }
    else { const a = P(k[1], k[2]), b = P(k[3], k[4]), c = P(k[5], k[6]); d += `C${f(a[0])} ${f(a[1])} ${f(b[0])} ${f(b[1])} ${f(c[0])} ${f(c[1])}`; }
  }
  return d + `L${f(bx)} ${f(by)}`;
}
const rrect = (x: number, y: number, w: number, h: number, r: number) =>
  `M${f(x + r)} ${f(y)}H${f(x + w - r)}A${f(r)} ${f(r)} 0 0 1 ${f(x + w)} ${f(y + r)}V${f(y + h - r)}A${f(r)} ${f(r)} 0 0 1 ${f(x + w - r)} ${f(y + h)}H${f(x + r)}A${f(r)} ${f(r)} 0 0 1 ${f(x)} ${f(y + h - r)}V${f(y + r)}A${f(r)} ${f(r)} 0 0 1 ${f(x + r)} ${f(y)}Z`;
/** A hand-thrown rim: a rounded rectangle whose sides bow a little, unevenly (the charm of a made
    thing, never a perfect vector box). */
function thrown(x: number, y: number, w: number, h: number, r: number, wob: number[]) {
  const [a, b, c, d] = wob;
  return `M${f(x + r)} ${f(y)}Q${f(x + w / 2)} ${f(y - a)} ${f(x + w - r)} ${f(y)}A${f(r)} ${f(r)} 0 0 1 ${f(x + w)} ${f(y + r)}Q${f(x + w + b)} ${f(y + h / 2)} ${f(x + w)} ${f(y + h - r)}A${f(r)} ${f(r)} 0 0 1 ${f(x + w - r)} ${f(y + h)}Q${f(x + w / 2)} ${f(y + h + c)} ${f(x + r)} ${f(y + h)}A${f(r)} ${f(r)} 0 0 1 ${f(x)} ${f(y + h - r)}Q${f(x - d)} ${f(y + h / 2)} ${f(x)} ${f(y + r)}A${f(r)} ${f(r)} 0 0 1 ${f(x + r)} ${f(y)}Z`;
}
const mix = (a: string, b: string, t: number) => {
  const p = (h: string) => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
  const A = p(a), B = p(b);
  return '#' + A.map((v, i) => Math.round(v + (B[i] - v) * t).toString(16).padStart(2, '0')).join('');
};
const blur = (id: string, s: number) => `<filter id="${id}" x="-60%" y="-60%" width="220%" height="220%" color-interpolation-filters="sRGB"><feGaussianBlur stdDeviation="${s}"/></filter>`;
const big = (x: number, y: number, w: number, h: number) => `M${x - 400} ${y - 400}h${w + 800}v${h + 800}h${-(w + 800)}Z`;

const C = { ink: '#123a2c', pink: '#ff9dbb', sun: '#fed371', sky: '#aecef8', leaf: '#9cdcb8' };

/** The matte top of any porcelain shape, lit from the top left: a soft inner shade on the far
    side, a highlight on the near rim, a fine dark lip. ids must be unique per symbol. */
function bisqueTop(id: string, d: string, box: [number, number, number, number], evenodd = false) {
  const [x, y, w, h] = box, rule = evenodd ? 'fill-rule="evenodd"' : '', clip = evenodd ? 'clip-rule="evenodd"' : '';
  return `<defs><radialGradient id="${id}-g" gradientUnits="userSpaceOnUse" cx="${f(x + w * .3)}" cy="${f(y + h * .22)}" r="${f(Math.max(w, h) * .95)}"><stop offset="0" stop-color="#fffefb"/><stop offset=".5" stop-color="#fbf8f2"/><stop offset="1" stop-color="#eee9df"/></radialGradient>
    <clipPath id="${id}-c"><path d="${d}" ${clip}/></clipPath></defs>
    <path d="${d}" fill="url(#${id}-g)" ${rule}/>
    <g clip-path="url(#${id}-c)">
      <path d="${big(x, y, w, h)}${d}" fill-rule="evenodd" fill="#bdb3a0" opacity=".26" transform="translate(-3.4 -4.2)" filter="url(#puzzle-b32)"/>
      <path d="${d}" fill="none" stroke="#fff" stroke-width="3.2" opacity=".95" transform="translate(1.5 1.7)" filter="url(#puzzle-b07)"/>
      <path d="${d}" fill="none" stroke="#bfb5a2" stroke-width="2.2" opacity=".55" transform="translate(-1.2 -1.5)" filter="url(#puzzle-b09)"/>
    </g>`;
}
/** The visible side of a shape of thickness t, darker towards the foot: three steps are enough at
    the sizes drawn (and keep the sprite light). */
function extrude(d: string, t: number, from = '#ebe6dc', to = '#d4ccbc') {
  let s = '';
  for (const k of [1, .66, .33]) s += `<path d="${d}" transform="translate(0 ${f(t * k)})" fill="${mix(from, to, k)}"/>`;
  return s;
}

const T = 7.5; // a piece's thickness
const PIECE = piecePath(S, YOURS);
/** viewBox of every piece-sized symbol (body 0..100, tabs ±28.5, thickness and shadow below). */
export const PIECE_BOX = { x: -40, y: -40, w: 180, h: 190 };
const pieceVB = `${PIECE_BOX.x} ${PIECE_BOX.y} ${PIECE_BOX.w} ${PIECE_BOX.h}`;

/** Face down: bisque back, its glazed side below; only a thin coloured line shows at the foot of
    its edge (its colour is underneath, and it is yours). */
function pieceBack(id: string, d = PIECE) {
  return `<defs><linearGradient id="${id}-r" x1="0" x2="1"><stop offset="0" stop-color="${C.pink}"/><stop offset=".45" stop-color="#ffc2a0"/><stop offset=".7" stop-color="${C.sun}"/><stop offset="1" stop-color="${C.pink}"/></linearGradient></defs>
    <path d="${d}" transform="translate(0 ${T + 1.2})" fill="#e98aa9"/><path d="${d}" transform="translate(0 ${T})" fill="url(#${id}-r)"/>
    ${extrude(d, T - 2.2)}${bisqueTop(id, d, [0, 0, S, S])}`;
}
/** Face up: the glazed side. Abstract glaze only (founder A6 picture, review M3): a dip that covers
    part of the piece (the rest stays raw bisque: only what was chosen), two bands and a scatter of
    dots, set off-centre. No disc over a band, no name, nothing that reads as a head, a badge or a
    photo. */
function pieceGlaze(id: string) {
  const dip = `M-40 -40H96C90 14 84 40 78 62S70 104 66 160H-40Z`;
  return `${extrude(PIECE, T)}${bisqueTop(id, PIECE, [0, 0, S, S])}
    <defs><clipPath id="${id}-c2"><path d="${PIECE}"/></clipPath><clipPath id="${id}-c3"><path d="${dip}"/></clipPath>
      <radialGradient id="${id}-p" gradientUnits="userSpaceOnUse" cx="28" cy="20" r="115"><stop offset="0" stop-color="#ffd6e2"/><stop offset=".45" stop-color="#ffb0c8"/><stop offset="1" stop-color="#f597b6"/></radialGradient></defs>
    <g clip-path="url(#${id}-c2)">
      <path d="${dip}" fill="url(#${id}-p)"/>
      <g clip-path="url(#${id}-c3)" fill="none" stroke-linecap="round">
        <path d="M-30 70C10 60 40 64 96 44" stroke="${C.sun}" stroke-width="7" opacity=".95"/>
        <path d="M-30 84C14 74 40 78 96 60" stroke="${C.leaf}" stroke-width="4.5" opacity=".95"/>
      </g>
      <circle cx="58" cy="24" r="3.4" fill="${C.sky}"/><circle cx="68" cy="34" r="2.2" fill="${C.sky}"/><circle cx="48" cy="34" r="1.8" fill="#fff" opacity=".85"/>
      <path d="${dip}" fill="none" stroke="#e77ea3" stroke-width="2.2" opacity=".7"/>
      <path d="${dip}" fill="none" stroke="#fff" stroke-width="1.4" opacity=".7" transform="translate(1.6 0)"/>
      <path d="${PIECE}" fill="none" stroke="#d96b91" stroke-width="5" opacity=".16" filter="url(#puzzle-b16)"/>
      <ellipse cx="26" cy="15" rx="28" ry="5.5" transform="rotate(-14 26 15)" fill="#fff" opacity=".55" filter="url(#puzzle-b5)"/>
    </g>`;
}
/** The glint that crosses the glaze once it is up (a slow shine: charm, review m9). */
function pieceGlint(id: string) {
  return `<defs><clipPath id="${id}-c"><path d="${PIECE}"/></clipPath></defs><g clip-path="url(#${id}-c)">
    <path d="M10 -20L34 -20L-6 120L-30 120Z" fill="#fff" opacity=".55" filter="url(#puzzle-b5)"/></g>`;
}
/** Matte again (S5): a veil of bisque that hides the glaze from now on. It is not quite opaque, so
    a faint print of what was already seen stays visible: nothing comes back. */
function pieceMatte(id: string) {
  return `<defs><radialGradient id="${id}-g" gradientUnits="userSpaceOnUse" cx="30" cy="22" r="95"><stop offset="0" stop-color="#fdfbf6"/><stop offset="1" stop-color="#ece6da"/></radialGradient></defs>
    <path d="${PIECE}" fill="url(#${id}-g)"/>`;
}
/** The blank before any word (S1): flat edges, the same thickness. */
function blank(id: string) {
  const d = piecePath(S, [0, 0, 0, 0]);
  return `${extrude(d, T)}${bisqueTop(id, d, [0, 0, S, S])}`;
}
/** A piece's shadows: a soft one (lifted) and a contact one (resting); separate symbols, so
    motion only fades or moves them. */
function shadowSoft() { return `<path d="${PIECE}" fill="${C.ink}" opacity=".16" transform="translate(12 ${T + 24})" filter="url(#puzzle-b16x)"/>`; }
function shadowContact() {
  return `<path d="${PIECE}" fill="${C.ink}" opacity=".16" transform="translate(3 ${T + 4})" filter="url(#puzzle-b5)"/>
    <path d="${PIECE}" fill="#4b3f2a" opacity=".34" transform="translate(.6 ${T + .8})" filter="url(#puzzle-b18)"/>`;
}
/** Outlines with no surface: the shapes being compared (S2). Yours: all four edges, from your four
    words. The opening's: three edges the listing states, the fourth (on-call) dashed: not stated. */
function outline(openRight: boolean) {
  let s = `<path d="${PIECE}" fill="${C.ink}" opacity=".035"/>`;
  for (let e = 0; e < 4; e++) {
    const open = openRight && e === 1;
    s += `<path d="${edgePath(S, YOURS, e)}" fill="none" stroke="${C.ink}" stroke-width="${open ? 2 : 2.6}" ${open ? 'stroke-dasharray="6 7"' : ''} stroke-linecap="round" stroke-linejoin="round"/>`;
  }
  return s;
}
/** An unmade piece: blank bisque with a debossed question mark drawn as a shape (the words of
    every open question are HTML beside it). */
function unmade(id: string) {
  const d = piecePath(S, [1, -1, 0, 1]);
  const q = 'M38 38C38 26 46 20 52 20C60 20 66 26 66 34C66 42 60 45 56 48C53 50 52 53 52 58M52 70V71';
  return `${extrude(d, T)}${bisqueTop(id, d, [0, 0, S, S])}
    <path d="${q}" fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round" transform="translate(1 1.4)" opacity=".9"/>
    <path d="${q}" fill="none" stroke="#a89d88" stroke-width="7" stroke-linecap="round" opacity=".8"/>`;
}
/** An unmade dish (S1's open question): only its dashed outline, an object that does not exist. */
function unmadeDish() {
  const o = thrown(0, 0, 300, 210, 46, [2, 1.5, 2.5, 1]);
  return `<path d="${o}" fill="${C.ink}" opacity=".025"/><path d="${o}" fill="none" stroke="${C.ink}" stroke-width="2.4" stroke-dasharray="9 9" stroke-linecap="round" opacity=".62"/>`;
}

/** viewBox and size (in piece units) of the dish and the board. */
export const DISH_SMALL = { w: 3.4, h: 2.5, vb: '-60 -60 460 370' };
function dish(id: string, W: number, H: number) {
  const r = Math.min(W, H) * .2, rim = Math.min(W, H) * .085, t = 7;
  const outer = thrown(0, 0, W, H, r, [2.4, 1.6, 3, 1.2]), inner = thrown(rim, rim, W - 2 * rim, H - 2 * rim, r - rim * .7, [1.6, 1.1, 2, .8]);
  // Throwing rings in the floor: the trace of a hand at the wheel (faint, concentric).
  let rings = '';
  for (let i = 1; i <= 4; i++) rings += `<ellipse cx="${f(W * .5)}" cy="${f(H * .52)}" rx="${f(W * (.08 + i * .085))}" ry="${f(H * (.06 + i * .07))}" fill="none" stroke="#d9d1c2" stroke-width="1" opacity="${f(.5 - i * .07)}"/>`;
  return `<defs><clipPath id="${id}-ci"><path d="${inner}"/></clipPath>
      <radialGradient id="${id}-fl" gradientUnits="userSpaceOnUse" cx="${f(W * .45)}" cy="${f(H * .4)}" r="${f(W * .7)}"><stop offset="0" stop-color="#f7f4ec"/><stop offset="1" stop-color="#ebe6db"/></radialGradient></defs>
    <path d="${outer}" fill="${C.ink}" opacity=".15" transform="translate(6 ${t + 12})" filter="url(#puzzle-b16x)"/>
    <path d="${outer}" fill="#4b3f2a" opacity=".28" transform="translate(.5 ${t + .6})" filter="url(#puzzle-b10)"/>
    ${extrude(outer, t)}${bisqueTop(id, outer, [0, 0, W, H])}
    <path d="${inner}" fill="url(#${id}-fl)"/>
    <g clip-path="url(#${id}-ci)">${rings}
      <path d="${big(0, 0, W, H)}${inner}" fill-rule="evenodd" fill="#8f836c" opacity=".36" transform="translate(4 6)" filter="url(#puzzle-b4)"/>
      <path d="${big(0, 0, W, H)}${inner}" fill-rule="evenodd" fill="#fff" opacity=".9" transform="translate(-1.6 -2)" filter="url(#puzzle-b10)"/></g>`;
}

export const BOARD = { m: 42, w: 3.84, vb: '-70 -70 524 534' };
/** The company's board: a slab of engraved pieces with the opening of the role in the middle. The
    edge the listing doesn't state (on-call, the opening's right edge) is dashed, never cut.
    role = true adds the company's own open place (its answer), which the story never fills. */
function board(id: string, role: boolean) {
  const m = BOARD.m, W = 3 * S + 2 * m, H = W, ox = m + S, oy = m + S, r = 14, t = 7;
  const outer = rrect(0, 0, W, H, r), hole = piecePath(S, YOURS, ox, oy);
  const answer = role ? piecePath(S, ANSWER, m + 2 * S, m) : '';
  const holes = hole + answer;
  const seams: string[] = [];
  const sign = [1, -1, -1, 1, 1, -1, 1, -1, -1, 1, -1, 1];
  let k = 0;
  for (let row = 0; row < 3; row++) for (let col = 1; col < 3; col++) {
    const touchesHole = row === 1 || (role && row === 0 && col === 2);
    if (touchesHole) { k++; continue; }
    seams.push(seam(m + col * S, m + row * S, m + col * S, m + (row + 1) * S, sign[k++ % 12]));
  }
  for (let row = 1; row < 3; row++) for (let col = 0; col < 3; col++) {
    const touchesHole = col === 1 || (role && row === 1 && col === 2);
    if (touchesHole) { k++; continue; }
    seams.push(seam(m + col * S, m + row * S, m + (col + 1) * S, m + row * S, sign[k++ % 12]));
  }
  const frame = rrect(m, m, 3 * S, 3 * S, 4);
  const groove = (p: string) => `<path d="${p}" fill="none" stroke="#fff" stroke-width="1.6" opacity=".95" transform="translate(.9 1)"/><path d="${p}" fill="none" stroke="#b9ae9a" stroke-width="1.25" opacity=".85"/>`;
  const walls = (p: string, cid: string) => `<g clip-path="url(#${cid})">
      <path d="${big(0, 0, W, H)}${p}" fill-rule="evenodd" fill="#7f735c" opacity=".42" transform="translate(4.5 6)" filter="url(#puzzle-b36)"/>
      <path d="${big(0, 0, W, H)}${p}" fill-rule="evenodd" fill="#fff" opacity=".85" transform="translate(-1.8 -2.2)" filter="url(#puzzle-b10)"/></g>`;
  const P = mapper(S, YOURS, ox, oy);
  const right = `M${f(P(1, RC, 0)[0])} ${f(P(1, RC, 0)[1])}` + edgeCmds(P, 1, YOURS);
  return `<defs><clipPath id="${id}-h"><path d="${hole}"/></clipPath>${role ? `<clipPath id="${id}-a"><path d="${answer}"/></clipPath>` : ''}
      <radialGradient id="${id}-fl" gradientUnits="userSpaceOnUse" cx="${ox + 50}" cy="${oy + 50}" r="90"><stop offset="0" stop-color="#f3efe6"/><stop offset="1" stop-color="#e6e0d3"/></radialGradient></defs>
    <path d="${outer}" fill="${C.ink}" opacity=".16" transform="translate(8 ${t + 16})" filter="url(#puzzle-b16x)"/>
    <path d="${outer}" fill="#4b3f2a" opacity=".28" transform="translate(.5 ${t + .6})" filter="url(#puzzle-b10)"/>
    ${extrude(outer, t)}
    <path d="${holes}" fill="url(#${id}-fl)"/>
    ${bisqueTop(id, outer + holes, [0, 0, W, H], true)}
    ${groove(seams.join('') + frame)}
    ${walls(hole, `${id}-h`)}${role ? walls(answer, `${id}-a`) : ''}
    <path d="${right}" fill="none" stroke="${C.ink}" stroke-width="2" stroke-dasharray="5 6" stroke-linecap="round" opacity=".75"/>`;
}

/** Every object as a standalone SVG file (public/directions/puzzle/<name>.svg, written by
    export.ts). The stations draw them with <img>: one paint item each, rasterized once and cached,
    so the page's living atmosphere (which repaints the view about 30 times a second) never has to
    re-layerize the drawings' many filters and clips (measured: inline <use> symbols cost about
    twice A8's idle main-thread time inside the story; checks/perf/). */
const FILTERS = [['b07', .7], ['b09', .9], ['b10', 1], ['b16', 1.6], ['b18', 1.8], ['b32', 3.2], ['b36', 3.6], ['b4', 4], ['b5', 5], ['b16x', 14]] as const;
export const VIEWBOX: Record<string, string> = {
  back: pieceVB, glaze: pieceVB, glint: pieceVB, matte: pieceVB, blank: pieceVB, 'shadow-soft': pieceVB, 'shadow-contact': pieceVB,
  'outline-yours': pieceVB, 'outline-open': pieceVB, unmade: pieceVB, 'unmade-dish': '-20 -20 340 250',
  'dish-small': DISH_SMALL.vb, 'board-listing': BOARD.vb, 'board-role': BOARD.vb,
};
export function files(): Record<string, string> {
  const bodies: Record<string, string> = {
    back: pieceBack('pb'), glaze: pieceGlaze('pg'), glint: pieceGlint('pgl'), matte: pieceMatte('pm'), blank: blank('bl'),
    'shadow-soft': shadowSoft(), 'shadow-contact': shadowContact(), 'outline-yours': outline(false), 'outline-open': outline(true),
    unmade: unmade('um'), 'unmade-dish': unmadeDish(), 'dish-small': dish('ds', DISH_SMALL.w * S, DISH_SMALL.h * S),
    'board-listing': board('bd', false), 'board-role': board('br', true),
  };
  const out: Record<string, string> = {};
  for (const [name, body] of Object.entries(bodies)) {
    const used = FILTERS.filter(([n]) => body.includes(`#puzzle-${n})`));
    const [, , w, h] = VIEWBOX[name].split(' ');
    out[name] = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${VIEWBOX[name]}" width="${w}" height="${h}">`
      + (used.length ? `<defs>${used.map(([n, sd]) => blur(`puzzle-${n}`, sd)).join('')}</defs>` : '') + body.replace(/\s*\n\s*/g, '') + '</svg>\n';
  }
  return out;
}
