/* The preview's variant axes (Concepts A8–A9). Each axis is a `data-v-<axis>` attribute on <html>, set
   from the address's query (?density=d3&radius=10…) before the first paint, so a link carries an
   exact combination. The first value of each axis is the recommendation and the default. The
   stylesheet keys its alternatives on these attributes; without the preview's switcher no
   attribute is ever set, so production shows the defaults and ships none of this. */
export const AXES: { id: string; label: string; values: [string, string][] }[] = [
  /* A9 (founder A1, A3): the noise always scrolls with the page, behind the content; the fixed
     layer of A8 is gone. What remains open is its density (the tiles in public/material). */
  { id: 'density', label: 'Noise density', values: [['d2', 'd2 · medium (A9)'], ['d1', 'd1 · light'], ['d3', 'd3 · dense'], ['d0', 'd0 · A7 paper']] },
  { id: 'radius', label: 'Search field', values: [['16', 'Rounded 16 px'], ['10', 'Rounded 10 px'], ['20', 'Rounded 20 px'], ['pill', 'Pill (A7)']] },
  { id: 'controls', label: 'Buttons and chips', values: [['keep', 'Stay pills'], ['follow', 'Follow the field']] },
  { id: 'palette', label: 'Palette', values: [['a7', 'A7, refined'], ['moss', 'Moss and blush'], ['ink', 'Ink and coral']] },
  { id: 'type', label: 'Type', values: [['archivo', 'Archivo + Figtree (A7)'], ['pair-b', 'Audex + Figtree'], ['pair-c', 'Arcticons Sans + Figtree']] },
  { id: 'badge', label: 'Badge text', values: [['yours', 'Your words. Your data. Your call.'], ['sees', 'Nobody sees you unless you say yes'], ['fit', 'A fit tells no one (under counsel review)']] },
];
export const DEFAULTS = Object.fromEntries(AXES.map(a => [a.id, a.values[0][0]]));
