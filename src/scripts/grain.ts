/* The plates' grain follows the page's (Concept A9, W1 part 2; evidence header.md).

   A plate that copies the ground (the header's, and on narrow subpages the "On this page" bar's)
   carries the same noise tile as the page. The page's noise lies in the page flow and moves with the
   content; a sticky plate does not. So the plate's grain is shifted by -(scrollY mod tile), and its
   texels line up with the page's texels at every scroll position: the eye sees one sheet.

   Where scroll-driven animations exist (and motion is welcome), the shift runs on the compositor in
   step with the scroll itself: a linear animation on the root scroll timeline with one turn per tile
   height over a range of whole tiles (--grain-turns, --grain-range), written here when the page's
   height or the view changes, never while scrolling. Elsewhere, and
   under reduced motion (where no animation may run), the shift is written on scroll. Nothing is ever
   written on <html> or <body>. */
const hosts = new Set<HTMLElement>();
const scrollDriven = typeof CSS !== 'undefined' && CSS.supports('animation-timeline: scroll()');
const still = matchMedia('(prefers-reduced-motion: reduce)');
let tile = 1024, raf = 0, started = false;

const onCompositor = () => scrollDriven && !still.matches;
const grains = () => [...hosts].flatMap(host => [...host.querySelectorAll<HTMLElement>('[data-grain]')]);

function measure() {
  const first = grains()[0];
  const size = first ? parseFloat(getComputedStyle(first).backgroundSize) : NaN;
  tile = Number.isFinite(size) && size > 0 ? size : 1024;
  // The timeline's range is set in whole tiles, in pixels, past the page's end (animation-range), so
  // the shift is exactly -(scrollY mod tile) whatever the compositor's own idea of the page's scroll
  // range (in the app a fractional height once misaligned the grain by a fraction of a pixel).
  const root = document.documentElement, turns = Math.ceil(Math.max(1, root.scrollHeight - root.clientHeight) / tile) + 1;
  for (const host of hosts) { host.style.setProperty('--grain-turns', String(turns)); host.style.setProperty('--grain-range', `${turns * tile}px`); }
  shift();
}

function shift() {
  raf = 0;
  if (onCompositor()) return;
  const y = -(scrollY % tile);
  for (const grain of grains()) grain.style.transform = `translateY(${y}px)`;
}

const queue = () => { if (!raf && !onCompositor()) raf = requestAnimationFrame(shift); };

/** Register a plate's host: its [data-grain] children follow the page's grain. */
export function followGrain(host: HTMLElement) {
  hosts.add(host);
  if (!started) {
    started = true;
    if ('ResizeObserver' in window) new ResizeObserver(measure).observe(document.documentElement);
    addEventListener('resize', measure, { passive: true });
    addEventListener('scroll', queue, { passive: true });
    still.addEventListener('change', () => { for (const grain of grains()) grain.style.removeProperty('transform'); measure(); });
  }
  measure();
}
