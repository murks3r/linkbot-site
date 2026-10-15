/* The scroll engine behind every pinned scene (Concept A5, kept in A6).

   A scene is a tall track with a sticky stage inside it. As the page scrolls through the track,
   the engine writes one number to the stage, --p (0 → 1), and one eased value per beat,
   --b1 … --bN, from the scene's declared beat ranges. CSS derives every visual state from those
   numbers, so a scene is a pure function of scroll position: it plays forward, reverses, and is
   correct after a jump, a fling or a resize. Nothing is triggered once, so nothing resets, and
   the page keeps its native scrolling: no wheel or touch event is intercepted.

   A scene goes live only when the visitor allows motion and the stage fits the viewport (measured).
   Otherwise it keeps its complete, static final state at normal height, which is also what a
   browser without scripts shows. */
type Beat = [number, number];
type Scene = { root: HTMLElement; stage: HTMLElement; beats: Beat[]; captions: HTMLElement[]; live: boolean; start: number; span: number; beat: number; last: number };

const smooth = (t: number) => { const x = Math.min(1, Math.max(0, t)); return x * x * (3 - 2 * x); };
const still = matchMedia('(prefers-reduced-motion: reduce)');
const scenes: Scene[] = [...document.querySelectorAll<HTMLElement>('[data-scene]')].flatMap(root => {
  const stage = root.querySelector<HTMLElement>('[data-scene-stage]');
  if (!stage) return [];
  const beats = (root.dataset.beats ?? '').split(',').filter(Boolean).map(b => b.split(':').map(Number) as Beat);
  return [{ root, stage, beats, captions: [...root.querySelectorAll<HTMLElement>('[data-caption]')], live: false, start: 0, span: 1, beat: -1, last: -1 }];
});
let frame = 0;

function header(stage: HTMLElement) { return parseFloat(getComputedStyle(stage).top) || 0; }

function measure(scene: Scene) {
  scene.start = scene.root.getBoundingClientRect().top + scrollY - header(scene.stage);
  scene.span = Math.max(1, scene.root.offsetHeight - scene.stage.offsetHeight);
}

function paint(scene: Scene, p: number) {
  if (p === scene.last) return;  // far scenes stay at 0 or 1 and are painted once
  scene.last = p;
  const s = scene.stage.style;
  s.setProperty('--p', p.toFixed(4));
  let at = -1;
  scene.beats.forEach(([from, to], i) => {
    s.setProperty(`--b${i + 1}`, smooth((p - from) / Math.max(.0001, to - from)).toFixed(4));
    // A beat begins a hair later than its range when coming from the one before, and ends a hair
    // later going back, so a reader resting on a boundary never sees the statement flicker.
    const edge = i === 0 ? from : i === scene.beat + 1 ? from + .004 : i === scene.beat ? from - .004 : from;
    if (p >= edge) at = i;
  });
  if (at !== scene.beat) {
    scene.beat = at;
    scene.root.dataset.beat = String(at + 1);
    scene.captions.forEach((c, i) => i === at ? c.setAttribute('aria-current', 'step') : c.removeAttribute('aria-current'));
  }
}

function render() {
  frame = 0;
  const y = scrollY;
  for (const scene of scenes) if (scene.live) paint(scene, Math.min(1, Math.max(0, (y - scene.start) / scene.span)));
}

function queue() { if (!frame) frame = requestAnimationFrame(render); }

/* A scene is live when motion is allowed and its stage really fits the viewport (its content
   measured live, so nothing can be cut off). */
function fits(scene: Scene) {
  const inner = scene.stage.firstElementChild as HTMLElement | null;
  // The inner box fills the stage; what matters is whether its content overflows it.
  return !!inner && inner.scrollHeight <= scene.stage.clientHeight + 1 && scene.stage.scrollHeight <= scene.stage.clientHeight + 1;
}

function mode() {
  for (const scene of scenes) {
    let want = !still.matches && innerHeight >= 540;
    if (want) { scene.root.classList.add('is-live'); want = fits(scene); }
    scene.root.classList.toggle('is-live', want);
    if (!want) {
      ['--p', ...scene.beats.map((_, i) => `--b${i + 1}`)].forEach(name => scene.stage.style.removeProperty(name));
      scene.captions.forEach(c => c.removeAttribute('aria-current'));
      delete scene.root.dataset.beat;
      scene.beat = -1; scene.last = -1;
    }
    scene.live = want;
    if (want) measure(scene);
  }
  render();
  // Scenes that measure their own geometry (where a phrase lands, how far a lens lifts) do it now.
  dispatchEvent(new Event('scenes:mode'));
}

if (scenes.length) {
  mode();
  addEventListener('scroll', queue, { passive: true });
  addEventListener('resize', mode);
  addEventListener('pageshow', mode);
  still.addEventListener('change', mode);
  document.fonts?.ready.then(mode);
  if ('ResizeObserver' in window) new ResizeObserver(() => { scenes.forEach(s => s.live && measure(s)); queue(); }).observe(document.body);
}
