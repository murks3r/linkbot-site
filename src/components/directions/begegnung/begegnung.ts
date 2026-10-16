/* Begegnung (encounter): the home story's script (Concept A9, W4). Small on purpose; the motion
   itself is CSS (scene.ts generates the keyframes) and runs on the compositor.

   1. Layout: pins the stage on wide screens when motion is allowed and every caption fits one
      screen (data-mode="pin" on the section); otherwise the stations stay in the flow.
   2. Images: the painted layers load after the page's load event and its largest paint (on the
      first scroll, or 3 s after load), and only when the story is about a screen away, so they never
      compete with the first paint; dense wide screens get the 1.5×
      set, everything else (every phone) the 1× set. A station shown as its finished picture
      (reduced motion, no scroll timelines) loads only the layers that picture shows.
   3. Fallback: where CSS scroll timelines are missing, an IntersectionObserver steps the pinned
      stage to the station whose caption crosses the middle of the screen (data-s); CSS transitions
      move between the finished pictures, both ways.
   4. Colour: the story raises W1's --air-reveal by writing its own data-air-reveal (the atmosphere's
      hook re-reads it), from the same story axis the pictures use. Only while the story is on
      screen; one attribute on this section, nothing on <html> or <body>.
   No timers, no loop at rest; nothing intercepts scrolling. */
import { PIN, REVEAL, at } from './scene';

const root = document.querySelector<HTMLElement>('[data-direction="begegnung"]');
if (root) story(root);

function story(root: HTMLElement) {
  const track = root.querySelector<HTMLElement>('.begegnung-track')!;
  const pin = root.querySelector<HTMLElement>('.begegnung-pin')!;
  const stations = [...root.querySelectorAll<HTMLElement>('.begegnung-station')];
  const frames = stations.map(s => s.querySelector<HTMLElement>('.begegnung-frame')!);
  const wide = matchMedia('(min-width: 64rem) and (min-height: 700px)');
  const still = matchMedia('(prefers-reduced-motion: reduce)');
  const timelines = typeof CSS !== 'undefined' && CSS.supports('animation-timeline: view()');
  let pinned = false, ready = false;

  // 1. Layout
  const header = () => parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header')) || 72;
  function fits() {
    const room = innerHeight - header();
    return stations.every(s => s.querySelector<HTMLElement>('.begegnung-words')!.offsetHeight <= room - 32);
  }
  function mode() {
    let want = wide.matches && !still.matches;
    if (want) { root!.dataset.mode = 'pin'; want = fits(); }
    pinned = want;
    if (pinned) root!.dataset.mode = 'pin'; else delete root!.dataset.mode;
    if (pinned && !timelines) { root!.dataset.stepped = ''; step.observe(); } else { delete root!.dataset.stepped; step.stop(); }
    load();
    queue();
  }

  // 2. Images
  const dense = () => devicePixelRatio >= 1.25 && matchMedia('(min-width: 64rem)').matches;
  const near = new IntersectionObserver(entries => entries.forEach(e => { if (e.isIntersecting) { fill(e.target as HTMLElement); near.unobserve(e.target); } }), { rootMargin: '100% 0px' });
  function fill(box: HTMLElement) {
    const finished = box !== pin && (still.matches || !timelines);
    for (const img of box.querySelectorAll<HTMLImageElement>('img[data-src]:not([src])')) {
      if (finished && img.dataset.end === '0') continue;
      img.src = (dense() && img.dataset.src2) || img.dataset.src!;
    }
  }
  function load() {
    if (!ready) return;
    for (const box of pinned ? [pin] : frames) if (box.querySelector('img[data-src]:not([src])')) near.observe(box);
  }

  // 3. Fallback without scroll timelines: the caption crossing the middle names the station.
  const step = (() => {
    let io: IntersectionObserver | null = null;
    return {
      observe() {
        if (io) return;
        io = new IntersectionObserver(entries => entries.forEach(e => { if (e.isIntersecting) pin.dataset.s = (e.target as HTMLElement).dataset.station!; }), { rootMargin: '-50% 0px -50% 0px' });
        stations.forEach(s => io!.observe(s));
      },
      stop() { io?.disconnect(); io = null; },
    };
  })();

  // 4. Colour, from the story axis u (0 … 5) the pictures use.
  function u() {
    const vh = innerHeight;
    if (pinned) {
      const r = track.getBoundingClientRect(), p = (vh - r.top) / (r.height + vh - header()) * 100;
      let v = 0;
      for (const [u0, u1, p0, p1] of PIN) { if (p >= p1) v = u1; else if (p > p0) { v = u0 + (u1 - u0) * (p - p0) / (p1 - p0); break; } else break; }
      return v;
    }
    let v = 0;
    frames.forEach((f, i) => {
      const r = f.getBoundingClientRect(), h = r.height, progress = (vh - .6 * h - r.top) / Math.max(1, .45 * vh - .15 * h);
      if (progress >= 0) v = i + Math.min(1, progress);
    });
    return v;
  }
  let frame = 0, seen = false;
  function paint() {
    frame = 0;
    const r = Math.round(at(REVEAL, u(), 'o') * 100) / 100;
    const next = String(r);
    if (root!.dataset.airReveal !== next) root!.dataset.airReveal = next;
  }
  function queue() { if (seen && !frame) frame = requestAnimationFrame(paint); }
  new IntersectionObserver(([e]) => { seen = e.isIntersecting; queue(); }).observe(root);
  addEventListener('scroll', queue, { passive: true });

  mode();
  wide.addEventListener('change', mode);
  still.addEventListener('change', mode);
  addEventListener('resize', () => { if (wide.matches && !still.matches) mode(); }, { passive: true });
  document.fonts?.ready.then(mode);
  // After the largest paint: the browser stops looking for it at the first scroll, so the layers
  // start loading on the first scroll after the load event, or 3 s after it for a reader who doesn't
  // scroll (review change 5: the painterly layers load lazily after LCP).
  const start = () => { if (ready) return; ready = true; removeEventListener('scroll', start); load(); };
  const loaded = () => { addEventListener('scroll', start, { passive: true, once: true }); setTimeout(start, 3000); };
  if (document.readyState === 'complete') loaded(); else addEventListener('load', loaded, { once: true });
}
