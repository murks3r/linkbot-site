/**
 * Glyph definitions, shared by the Astro and React renderers so the two can
 * never drift. One source of truth, two thin wrappers.
 *
 * Evidence vocabulary (brand rule): a state is never colour alone. Every mark
 * in the UI carries a glyph *and* a word. `ring` is the Unknown state and is
 * used for every unstated value.
 *
 * Circles are written as two half-arcs so they render cleanly at 16px.
 */

export interface GlyphDef {
  viewBox: string;
  /** Stroked (outline) geometry — rendered with currentColor stroke. */
  stroke?: readonly string[];
  /** Filled geometry — rendered with currentColor fill. */
  fill?: readonly string[];
  strokeWidth?: number;
}

const CIRCLE_16 = (cx: number, cy: number, r: number): string =>
  `M${cx - r} ${cy} a${r} ${r} 0 1 0 ${r * 2} 0 a${r} ${r} 0 1 0 ${-r * 2} 0`;

export const GLYPHS = {
  /** Notarial mark: octagon impression with an inscribed square and core. */
  mark: {
    viewBox: '0 0 32 32',
    stroke: [
      'M29.30 21.51 L21.51 29.30 L10.49 29.30 L2.70 21.51 L2.70 10.49 L10.49 2.70 L21.51 2.70 L29.30 10.49 Z',
      'M9 9 H23 V23 H9 Z',
    ],
    fill: ['M13.4 16 a2.6 2.6 0 1 0 5.2 0 a2.6 2.6 0 1 0 -5.2 0'],
    strokeWidth: 1.6,
  },
  /** Confirmed / active: a solid square. */
  square: { viewBox: '0 0 16 16', fill: ['M3 3 H13 V13 H3 Z'] },
  /** Unknown: a hollow ring. Never a dash, never blank. */
  ring: { viewBox: '0 0 16 16', stroke: [CIRCLE_16(8, 8, 5.4)], strokeWidth: 1.5 },
  /** Closed (withdrawn / expired): a solid dot. */
  dot: { viewBox: '0 0 16 16', fill: [CIRCLE_16(8, 8, 5)] },
  /** Proposed / open-ended: a triangle. */
  triangle: { viewBox: '0 0 16 16', stroke: ['M8 2.8 L14 13 H2 Z'], strokeWidth: 1.5 },
  external: {
    viewBox: '0 0 16 16',
    stroke: ['M6.5 3.5 H12.5 V9.5', 'M12.5 3.5 L7 9', 'M10 11.5 H4.5 V6'],
    strokeWidth: 1.4,
  },
  bookmark: { viewBox: '0 0 16 16', stroke: ['M4 2.6 H12 V13.6 L8 10.4 L4 13.6 Z'], strokeWidth: 1.4 },
  bookmarkFilled: { viewBox: '0 0 16 16', fill: ['M4 2.6 H12 V13.6 L8 10.4 L4 13.6 Z'] },
  search: {
    viewBox: '0 0 16 16',
    stroke: [CIRCLE_16(7, 7, 4.4), 'M10.4 10.4 L14 14'],
    strokeWidth: 1.5,
  },
  alert: {
    viewBox: '0 0 16 16',
    stroke: ['M8 2.4 L14.4 13.6 H1.6 Z', 'M8 6.4 V9.6'],
    fill: ['M7.1 11.2 a0.9 0.9 0 1 0 1.8 0 a0.9 0.9 0 1 0 -1.8 0'],
    strokeWidth: 1.3,
  },
  error: {
    viewBox: '0 0 16 16',
    stroke: [CIRCLE_16(8, 8, 5.4), 'M5.6 5.6 L10.4 10.4', 'M10.4 5.6 L5.6 10.4'],
    strokeWidth: 1.4,
  },
  ledger: { viewBox: '0 0 16 16', stroke: ['M3 4 H13', 'M3 8 H13', 'M3 12 H13'], strokeWidth: 1.3 },
  chevronLeft: { viewBox: '0 0 16 16', stroke: ['M10 3 L5 8 L10 13'], strokeWidth: 1.5 },
  chevronRight: { viewBox: '0 0 16 16', stroke: ['M6 3 L11 8 L6 13'], strokeWidth: 1.5 },
  arrowRight: { viewBox: '0 0 16 16', stroke: ['M3 8 H13', 'M9 4 L13 8 L9 12'], strokeWidth: 1.5 },
  pin: {
    viewBox: '0 0 16 16',
    stroke: ['M8 14.4 C8 14.4 12.6 9.9 12.6 6.9 a4.6 4.6 0 1 0 -9.2 0 C3.4 9.9 8 14.4 8 14.4 Z'],
    strokeWidth: 1.3,
  },
  clock: {
    viewBox: '0 0 16 16',
    stroke: [CIRCLE_16(8, 8, 5.4), 'M8 5.2 V8.4 L10.4 10'],
    strokeWidth: 1.4,
  },
  receipt: {
    viewBox: '0 0 16 16',
    stroke: ['M3.4 2.6 H12.6 V13.4 L10.6 12 L8 13.4 L5.4 12 L3.4 13.4 Z', 'M6 6 H10', 'M6 8.6 H10'],
    strokeWidth: 1.3,
  },
  shield: {
    viewBox: '0 0 16 16',
    stroke: ['M8 2.4 L13.4 4.4 V8.2 C13.4 11.2 8 13.6 8 13.6 C8 13.6 2.6 11.2 2.6 8.2 V4.4 Z'],
    strokeWidth: 1.3,
  },
  check: { viewBox: '0 0 16 16', stroke: ['M3 8.4 L6.6 12 L13 4.6'], strokeWidth: 1.6 },
} as const satisfies Record<string, GlyphDef>;

export type GlyphName = keyof typeof GLYPHS;
