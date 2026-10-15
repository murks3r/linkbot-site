/* The preview's variant axes (Concept A8). Each axis is a `data-v-<axis>` attribute on <html>, set
   from the address's query (?noise=fixed&radius=14…) before the first paint, so a link carries an
   exact combination. The first value of each axis is the recommendation and the default. The
   stylesheet keys its alternatives on these attributes; without the preview's switcher no
   attribute is ever set, so production shows the defaults and ships none of this. */
export const AXES: { id: string; label: string; values: [string, string][] }[] = [
  { id: 'noise', label: 'Noise', values: [['fixed', 'Fixed over the page'], ['scroll', 'Scrolls with the page (A7)']] },
  { id: 'radius', label: 'Search field', values: [['14', 'Rounded 14 px'], ['10', 'Rounded 10 px'], ['20', 'Rounded 20 px'], ['pill', 'Pill (A7)']] },
  { id: 'controls', label: 'Buttons and chips', values: [['keep', 'Stay pills'], ['follow', 'Follow the field']] },
  { id: 'palette', label: 'Palette', values: [['a7', 'A7, refined'], ['moss', 'Moss and blush'], ['ink', 'Ink and coral']] },
  { id: 'type', label: 'Type', values: [['archivo', 'Archivo + Figtree (A7)'], ['pair-b', 'Pair B'], ['pair-c', 'Pair C']] },
  { id: 'badge', label: 'Badge text', values: [['yours', 'Your words. Your data. Your call.'], ['sees', 'Nobody sees you unless you say yes'], ['fit', 'A fit tells no one (under counsel review)']] },
];
export const DEFAULTS = Object.fromEntries(AXES.map(a => [a.id, a.values[0][0]]));
