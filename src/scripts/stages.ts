/* The scroll engine behind every pinned scene (Concept A5, kept in A6).

   A scene is a tall track with a sticky stage inside it. As the page scrolls through the track,
   the engine writes one number to the stage, --p (0 → 1), and one eased value per beat,
   --b1 … --bN, from the scene's declared beat ranges. CSS derives every visual state from those
   numbers, so a scene is a pure function of scroll position: it plays forward, reverses, and is
   correct after a jump, a fling or a resize. Nothing is triggered once, so nothing resets, and
   the page keeps its native scrolling: no wheel or touch event is intercepted.

   The numbers are written on the stage, or on the element inside it marked data-scene-vars (A7):
   custom properties are inherited, so every element beneath the one they are written on is styled
   again on every frame; a scene keeps heavy decoration outside that element and, if it asks
   (data-scene-paint), is handed the beat values after each paint (the scene:paint event) to move
   it directly.

   A scene goes live only when the visitor allows motion and the stage fits the viewport (measured).
   Otherwise it keeps its complete, static final state at normal height, which is also what a
   browser without scripts shows. */
type Beat = [number, number];
type Scene = { root: HTMLElement; stage: HTMLElement; vars: HTMLElement; paints: boolean; beats: Beat[]; captions: HTMLElement[]; live: boolean; start: number; span: number; beat: number; last: number };

const smooth = (t: number) => { const x = Math.min(1, Math.max(0, t)); return x * x * (3 - 2 * x); };
const still = matchMedia('(prefers-reduced-motion: reduce)');
const scenes: Scene[] = [...document.querySelectorAll<HTMLElement>('[data-scene]')].flatMap(root => {
  const stage = root.querySelector<HTMLElement>('[data-scene-stage]');
  if (!stage) return [];
  const beats = (root.dataset.beats ?? '').split(',').filter(Boolean).map(b => b.split(':').map(Number) as Beat);
  const vars = root.querySelector<HTMLElement>('[data-scene-vars]') ?? stage;
  return [{ root, stage, vars, paints: root.hasAttribute('data-scene-paint'), beats, captions: [...root.querySelectorAll<HTMLElement>('[data-caption]')], live: false, start: 0, span: 1, beat: -1, last: -1 }];
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
  const s = scene.vars.style, values: number[] = [];
  s.setProperty('--p', p.toFixed(4));
  let at = -1;
  scene.beats.forEach(([from, to], i) => {
    values.push(smooth((p - from) / Math.max(.0001, to - from)));
    s.setProperty(`--b${i + 1}`, values[i].toFixed(4));
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
  if (scene.paints) scene.root.dispatchEvent(new CustomEvent('scene:paint', { detail: values }));
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
  const inner = scene.stage.querySelector<HTMLElement>(':scope > .scene-inner');
  // The inner box fills the stage; what matters is whether its content overflows it.
  if (!inner || inner.scrollHeight > scene.stage.clientHeight + 1 || scene.stage.scrollHeight > scene.stage.clientHeight + 1) return false;
  // A scene whose finished state is laid out differently (rows that travel home, a card that turns)
  // is asked too, while its live layout is in effect, whether that state fits.
  const ask = new CustomEvent('scene:fits', { detail: { ok: true } });
  scene.root.dispatchEvent(ask);
  return ask.detail.ok;
}

/* The caption zone is as tall as the tallest statement, measured live, so no statement ever runs
   under the figure below it. */
function captions(scene: Scene) {
  const zone = scene.captions[0]?.parentElement;
  if (zone) zone.style.setProperty('--cap-h', `${Math.ceil(Math.max(...scene.captions.map(c => c.offsetHeight)))}px`);
}

function mode() {
  for (const scene of scenes) {
    let want = !still.matches && innerHeight >= 540;
    if (want) { scene.root.classList.add('is-live'); captions(scene); want = fits(scene); }
    scene.root.classList.toggle('is-live', want);
    if (!want) {
      ['--p', ...scene.beats.map((_, i) => `--b${i + 1}`)].forEach(name => scene.vars.style.removeProperty(name));
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
  // Whether any of a scene's track is on screen: a scene's own decorative loops run only then
  // (data-on, written only when it changes).
  if ('IntersectionObserver' in window) {
    const seen = new IntersectionObserver(entries => entries.forEach(e => e.target.toggleAttribute('data-on', e.isIntersecting)), { rootMargin: '0px 0px -2px 0px' });
    scenes.forEach(s => seen.observe(s.root));
  }
}
