/* Begegnung (encounter): the choreography of the home story's illustration (Concept A9, W4).

   One drawing (art/scene.svg), baked into layers (art/bake.mjs → public/directions/begegnung/ and
   art/layers.json). Every layer is driven by keys on one story axis u, 0 … 5:
     u 0 → 1  the first station arrives (S1)        u 3 → 4  S4
     u 1 → 2  S2                                     u 4 → 5  S5
     u 2 → 3  S3 (the hand waits, then your hand)
   A station's finished picture is the state at u = its number. The same keys produce
   - the pinned stage on wide screens: one keyframe set per layer on the story's view timeline (CSS
     scroll-driven animation), each station's transition placed in a window of that timeline;
   - the vignettes (phones, short screens): each vignette plays its own station's transition on its
     own view timeline, from the previous station's state to its own;
   - the static end states (reduced motion, browsers without scroll timelines, no scripts);
   - the fallback without scroll timelines on wide screens: the IntersectionObserver in
     begegnung.ts sets data-s on the stage, CSS steps between the end states.
   Only opacity and transform are ever animated (guardrail E). Values are linear in u between keys
   with a smoothstep ease, sampled into keyframes, so parts that belong together (an arm and its
   hand) share the same keys and stay together. */

export type Channel = 'o' | 'x' | 'y' | 'r' | 's';
/** u → value. x, y in drawing units (900 × 760 canvas), r in degrees, s a scale factor. */
export type Keys = [number, number][];
export interface Part {
  /** layer id (an image of art/scene.svg's data-layer) or a tag id (words in the picture) */
  id: string;
  o: Keys;
  x?: Keys; y?: Keys; r?: Keys; s?: Keys;
  /** the point a rotation or scale turns about, in drawing units */
  origin?: [number, number];
}

export const CANVAS = { w: 900, h: 760 };
/** The part of the drawing a frame shows: the stage on wide screens, the vignette on phones. */
export const CROPS = { wide: [0, 100, 900, 640], narrow: [48, 84, 812, 640] } as const;
const SHOULDER: [number, number] = [308, 292];

/** The rotation of your reaching arm, shared by the arm and its hand so they never part. */
const REACH: Keys = [[2.3, 0], [2.88, -44], [3.05, -44], [3.32, 0]];
const fadeIn = (a: number, b: number): Keys => [[a, 0], [b, 1]];
/** The company's sleeve and both of its hands move as one: in from the right edge of its place (S3),
    a little towards the clasp once your hand has arrived, back and palm up (S4), away (S5). */
const SLEEVE_X: Keys = [[2, 16], [2.25, 0], [2.88, 0], [3, -44], [3.05, -44], [3.2, 4], [4.15, 4], [4.5, 224]];
const SLEEVE_Y: Keys = [[2.88, 0], [3, 6], [3.05, 6], [3.2, -15]];

/** The layers, bottom to top (the drawing's own order). */
export const LAYERS: Part[] = [
  { id: 'halo', o: [[3.5, 0], [3.95, 1], [4.1, 1], [4.6, .22]], s: [[3.5, .8], [3.95, 1]], origin: [262, 400] },
  { id: 'ground', o: fadeIn(0, .5) },
  { id: 'stool', o: fadeIn(.2, .7), y: [[.2, 16], [.7, 0]] },
  { id: 'fold-coat', o: [[.3, 0], [.8, 1], [3.45, 1], [3.62, 0]], y: [[.3, 16], [.8, 0]] },
  { id: 'fold-scarf', o: [[.35, 0], [.85, 1], [3.55, 1], [3.72, 0]], y: [[.35, 16], [.85, 0]] },
  // S2: the role arrives as an empty chair. No face, no name, no number.
  { id: 'chair', o: fadeIn(1, 1.4), x: [[1, 40], [1.4, 0]] },
  // S4: where the conversation continues is an open question (a dashed chair).
  { id: 'chair2', o: [[3.7, 0], [3.95, 1], [4, 1], [4.25, 0]] },
  // Your words. Two light where the listing states them and they fit; the third stays open.
  { id: 'lantern12', o: [[.55, 0], [.9, 1], [3.05, 1], [3.3, 0], [4.65, 0], [4.95, 1]], y: [[.55, 8], [.9, 0]] },
  { id: 'lantern-glow', o: [[1.35, 0], [1.75, 1], [3.05, 1], [3.3, 0]] },
  { id: 'lantern12-lit', o: [[1.35, 0], [1.75, 1], [3.05, 1], [3.3, 0]] },
  { id: 'lantern3', o: [[.65, 0], [1, 1], [1.6, 1], [1.9, 0], [4.7, 0], [5, 1]], y: [[.65, 8], [1, 0]] },
  { id: 'lantern3-open', o: [[1.6, 0], [1.9, 1], [3.05, 1], [3.3, 0]] },
  // S3: pink blooms where the hands meet; it goes as the hands part.
  { id: 'clasp-bloom', o: [[2.9, 0], [3, 1], [3.05, 1], [3.25, 0]], s: [[2.9, .3], [3, 1]], origin: [510, 428] },
  // You, unpainted, until you lift the veil yourself (S4).
  { id: 'sketch', o: [[.15, 0], [.6, 1], [3.4, 1], [3.56, 0]] },
  { id: 'arm-rest', o: [[.15, 0], [.6, 1], [2.3, 1], [2.33, 0]] },
  { id: 'arm-reach', o: [[2.3, 0], [2.33, 1], [3.32, 1], [3.45, 0]], r: REACH, origin: SHOULDER },
  { id: 'arm-reach-mitt', o: [[2.3, 0], [2.33, 1], [2.88, 1], [2.95, 0], [3.0, 0], [3.08, 1], [3.32, 1], [3.45, 0]], r: REACH, origin: SHOULDER },
  { id: 'clasp', o: [[2.88, 0], [2.95, 1], [3.02, 1], [3.12, 0]] },
  // You, painted: the coat, the scarf, then your face (only after the veil is lifted, u 3.12 → 3.4).
  { id: 'paint-coat', o: fadeIn(3.4, 3.6), s: [[3.4, .97], [3.6, 1]], origin: [262, 600] },
  { id: 'paint-face', o: fadeIn(3.6, 3.8), s: [[3.6, .94], [3.8, 1]], origin: [263, 205] },
  { id: 'paint-scarf', o: fadeIn(3.55, 3.72), s: [[3.55, .9], [3.72, 1]], origin: [264, 262] },
  { id: 'arms4', o: [[3.4, 0], [3.6, 1], [4, 1], [4.15, 0]] },
  { id: 'arms5', o: fadeIn(4, 4.2) },
  // The veil: settles over you (S1), lifted by your own hand (S4), drawn back by it (S5).
  { id: 'veil', o: [[0, 0], [.4, 1], [3.12, 1], [3.4, 0], [4, 0], [4.3, 1]], y: [[0, 24], [.4, 0], [3.12, 0], [3.4, -40], [4, -40], [4.3, 0]] },
  { id: 'veil-held', o: [[3.18, 0], [3.4, 1], [4, 1], [4.15, 0]], y: [[3.18, -20], [3.4, 0]] },
  { id: 'veil-hand', o: [[3.12, 0], [3.22, 1], [4, 1], [4.12, 0]] },
  { id: 'veil-head', o: fadeIn(4.05, 4.3), y: [[4.05, -24], [4.3, 0]] },
  { id: 'pinch', o: fadeIn(4, 4.2) },
  // The company: its sleeve and open hand wait at the role (S3) and come into view where they are;
  // they move only once your hand has arrived (u 2.88), and only a little. In S4 the same sleeve
  // draws back a little and turns its hand palm up; in S5 it leaves.
  { id: 'co-sleeve-tail', o: [[2, 0], [2.25, 1], [4.15, 1], [4.5, 0]], x: SLEEVE_X, y: SLEEVE_Y },
  { id: 'co-sleeve', o: [[2, 0], [2.25, 1], [4.15, 1], [4.5, 0]], x: SLEEVE_X, y: SLEEVE_Y },
  { id: 'co-mitt', o: [[2, 0], [2.25, 1], [2.88, 1], [2.95, 0]], x: SLEEVE_X, y: SLEEVE_Y },
  // S4: palm up, holding only what you handed over; S5: gone, the bloom left on the chair.
  { id: 'co-palm-hand', o: [[3.05, 0], [3.2, 1], [4.15, 1], [4.5, 0]], x: SLEEVE_X, y: SLEEVE_Y },
  { id: 'bloom', o: [[3.15, 0], [3.35, 1]], x: [[3.15, -186], [4.15, -186], [4.5, 0]], y: [[3.15, -176], [4.15, -176], [4.5, 0]], s: [[3.15, .5], [3.35, 1]], origin: [752, 560] },
];

/** Words inside the picture (rule 2 of claims.md: a status carries its label in the scene itself).
    They repeat words of the station's own text, so they are aria-hidden. Positions in drawing
    units; `at` wide, `atNarrow` on phones; `align` which edge sits on the point. */
export interface Tag extends Part { text: string; status?: 'dev' | 'tested'; sub?: string; at: [number, number]; atNarrow?: [number, number]; align?: 'center' | 'left' | 'right' }
export const TAGS: Tag[] = [
  { id: 'tag-hand', text: 'In development, not live', status: 'dev', at: [600, 334], atNarrow: [600, 330], align: 'center', o: [[2.1, 0], [2.3, 1], [3.1, 1], [3.25, 0]] },
  { id: 'tag-you', text: 'In development, not live', status: 'dev', at: [366, 168], atNarrow: [362, 156], align: 'left', o: [[3.6, 0], [3.8, 1], [4, 1], [4.2, 0]] },
  { id: 'tag-kept', text: 'Not shared', at: [108, 494], atNarrow: [150, 520], align: 'center', o: [[3.65, 0], [3.85, 1], [4, 1], [4.2, 0]] },
  { id: 'tag-open', text: '?', at: [578, 538], align: 'center', o: [[3.75, 0], [3.95, 1], [4, 1], [4.25, 0]] },
  { id: 'tag-copies', text: 'Copies already received aren’t recalled.', status: 'tested', sub: 'Built, tested in staging; not yet live with employers', at: [700, 430], atNarrow: [630, 410], align: 'center', o: fadeIn(4.5, 4.8) },
];

/** The colour the atmosphere may show (W1's --air-reveal hook), along u. Capped at .55 (contrast). */
export const REVEAL: Keys = [[0, 0], [1, 0], [2, .12], [2.5, .2], [3, .3], [4, .55], [5, .2]];

/** Where each station's transition lies on the pinned story's view timeline (cover range, in %).
    The story track holds five captions of one screen each (A = the view below the header), so it
    spans 6 A of cover; caption k is centred at k/6. Each transition ends just before its caption
    reaches the centre, so every finished picture is on screen while its words are read. */
export const PIN: [number, number, number, number][] = [
  // [u from, u to, timeline % from, timeline % to]
  [0, 1, 6, 15.5],
  [1, 2, 24.2, 32],
  [2, 2.5, 40, 44],
  [2.5, 3, 44, 49.5],
  [3, 4, 57.5, 65.8],
  [4, 5, 74.2, 82.5],
];
/** A vignette's own range on its own view timeline (it settles below the middle of the screen). */
export const VIGNETTE_RANGE = 'entry 60% cover 45%';

const smooth = (t: number) => { const x = Math.min(1, Math.max(0, t)); return x * x * (3 - 2 * x); };
const DEFAULTS: Record<Channel, number> = { o: 0, x: 0, y: 0, r: 0, s: 1 };
export function at(keys: Keys | undefined, u: number, channel: Channel): number {
  if (!keys || !keys.length) return DEFAULTS[channel];
  if (u <= keys[0][0]) return keys[0][1];
  for (let i = 1; i < keys.length; i++) {
    const [u1, v1] = keys[i], [u0, v0] = keys[i - 1];
    if (u <= u1) return u1 === u0 ? v1 : v0 + (v1 - v0) * smooth((u - u0) / (u1 - u0));
  }
  return keys[keys.length - 1][1];
}
export interface Value { o: number; x: number; y: number; r: number; s: number }
export const value = (p: Part, u: number): Value => ({ o: at(p.o, u, 'o'), x: at(p.x, u, 'x'), y: at(p.y, u, 'y'), r: at(p.r, u, 'r'), s: at(p.s, u, 's') });
const keysOf = (p: Part) => [p.o, p.x, p.y, p.r, p.s].flatMap(k => (k ?? []).map(([u]) => u));
/** Whether a part shows at all while u runs from a to b (sampled). */
export function shows(p: Part, a: number, b: number) {
  const us = [a, b, ...keysOf(p).filter(u => u > a && u < b)];
  for (let i = 0; i <= 20; i++) us.push(a + (b - a) * i / 20);
  return us.some(u => value(p, u).o > .001);
}

/** A layer's box (from the bake) in drawing units. */
export interface Box { x: number; y: number; w: number; h: number }
const n = (v: number, d: number) => String(+v.toFixed(d));
const moves = (p: Part) => !!(p.x || p.y || p.r || p.s);
const isTag = (p: Part) => p.id.startsWith('tag-');
/** One state as CSS: opacity always; a transform only for parts that ever move (translate in % of
    the element's own box, so it scales with the stage). Tags only ever fade. */
function css(p: Part, u: number, box: Box | undefined) {
  const v = value(p, u);
  if (isTag(p) || !moves(p)) return `opacity:${n(v.o, 3)}`;
  const w = box?.w ?? 100, h = box?.h ?? 100, t: string[] = [];
  if (p.x || p.y) t.push(`translate(${n(v.x / w * 100, 2)}%,${n(v.y / h * 100, 2)}%)`);
  if (p.r) t.push(`rotate(${n(v.r, 1)}deg)`);
  if (p.s) t.push(`scale(${n(v.s, 3)})`);
  return `opacity:${n(v.o, 3)};transform:${t.join(' ')}`;
}

/** The sample points of a part's keyframes between u a and b: every key, and, for parts that move,
    two eased points per segment (so a turning arm and its hand follow the same eased curve). */
function samples(p: Part, a: number, b: number) {
  const keys = [...new Set([a, b, ...keysOf(p)])].filter(u => u >= a && u <= b).sort((m, k) => m - k);
  const out = new Set<number>(keys);
  if (moves(p)) for (let i = 1; i < keys.length; i++) {
    const [a0, b0] = [value(p, keys[i - 1]), value(p, keys[i])];
    if (a0.x === b0.x && a0.y === b0.y && a0.r === b0.r && a0.s === b0.s) continue; // nothing moves in this segment
    for (const f of [1 / 3, 2 / 3]) out.add(keys[i - 1] + (keys[i] - keys[i - 1]) * f);
  }
  return [...out].sort((m, k) => m - k);
}
function pinPercent(u: number) {
  for (const [u0, u1, p0, p1] of PIN) if (u >= u0 && u <= u1) return p0 + (p1 - p0) * (u - u0) / (u1 - u0);
  return u < 0 ? 0 : 100;
}

export const STATIONS = [1, 2, 3, 4, 5] as const;
/** The parts a station's vignette holds: whatever shows while its transition runs. */
export const partsOf = <T extends Part>(k: number, parts: T[]): T[] => parts.filter(p => shows(p, k - 1, k));

/** All of the story's generated CSS: geometry, static end states, the fallback's stepped states,
    and (under motion and scroll-timeline support only) the scroll-driven keyframes. A part is
    hidden unless a rule shows it. */
export function storyCss(boxes: Record<string, Box>) {
  const out: string[] = ['.begegnung-canvas>.begegnung-l,.begegnung-canvas>.begegnung-tag{opacity:0}'];
  const cls = (id: string) => `.begegnung-l--${id}`;
  for (const p of LAYERS) {
    const b = boxes[p.id]; if (!b) continue;
    const o = p.origin ? `transform-origin:${n((p.origin[0] - b.x) / b.w * 100, 2)}% ${n((p.origin[1] - b.y) / b.h * 100, 2)}%;` : '';
    out.push(`${cls(p.id)}{left:${n(b.x / CANVAS.w * 100, 3)}%;top:${n(b.y / CANVAS.h * 100, 3)}%;width:${n(b.w / CANVAS.w * 100, 3)}%;height:${n(b.h / CANVAS.h * 100, 3)}%;${o}}`);
  }
  for (const t of TAGS) {
    const [x, y] = t.at, [nx, ny] = t.atNarrow ?? t.at;
    out.push(`${cls(t.id)}{--x:${n(x / CANVAS.w * 100, 2)}%;--y:${n(y / CANVAS.h * 100, 2)}%;--nx:${n(nx / CANVAS.w * 100, 2)}%;--ny:${n(ny / CANVAS.h * 100, 2)}%}`);
  }
  const all: Part[] = [...LAYERS, ...TAGS];
  const shown = (p: Part, u: number) => value(p, u).o > .001;
  // Static end states: each vignette shows its station's finished picture.
  for (const k of STATIONS) for (const p of partsOf(k, all)) if (shown(p, k)) out.push(`.begegnung-v${k} ${cls(p.id)}{${css(p, k, boxes[p.id])}}`);
  // The wide stage's stepped states (the fallback; also the state before scripts decide).
  for (const k of STATIONS) for (const p of all) if (shown(p, k)) out.push(`.begegnung-pin[data-s='${k}'] ${cls(p.id)}{${css(p, k, boxes[p.id])}}`);
  // Scroll-driven: the wide stage on the story's timeline, each vignette on its own.
  const motion: string[] = [];
  for (const p of all) {
    const name = `begegnung-p-${p.id}`;
    const frames = samples(p, 0, 5).map(u => `${n(pinPercent(u), 2)}%{${css(p, u, boxes[p.id])}}`);
    motion.push(`@keyframes ${name}{0%{${css(p, 0, boxes[p.id])}}${frames.join('')}100%{${css(p, 5, boxes[p.id])}}}`);
    motion.push(`.begegnung-pin ${cls(p.id)}{animation-name:${name}}`);
  }
  for (const k of STATIONS) for (const p of partsOf(k, all)) {
    const name = `begegnung-v${k}-${p.id}`;
    const frames = samples(p, k - 1, k).map(u => [n((u - (k - 1)) * 100, 2), css(p, u, boxes[p.id])]);
    if (new Set(frames.map(f => f[1])).size < 2) continue; // nothing changes: the static state holds
    motion.push(`@keyframes ${name}{${frames.map(([at, v]) => `${at}%{${v}}`).join('')}}`);
    motion.push(`.begegnung-v${k} ${cls(p.id)}{animation-name:${name}}`);
  }
  // Shared longhands (the shorthand would reset animation-timeline); each part names its keyframes.
  const common = 'animation-duration:auto;animation-timing-function:linear;animation-fill-mode:both';
  motion.unshift(`.begegnung[data-mode='pin'] .begegnung-pin .begegnung-canvas>*{${common};animation-timeline:--begegnung-story;animation-range:cover 0% cover 100%}`,
    `.begegnung-station .begegnung-canvas>*{${common};animation-timeline:--begegnung-v;animation-range:${VIGNETTE_RANGE}}`,
    `.begegnung:not([data-mode='pin']) .begegnung-pin *{animation-name:none}`);
  out.push(`@media (prefers-reduced-motion:no-preference){@supports (animation-timeline:view()){${motion.join('')}}}`);
  return out.join('\n');
}
