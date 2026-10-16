/* Concept A9 · W5 · `puzzle`: when a station moves, and what drives it.

   A station is live only when the visitor allows motion and its stage really fits the screen
   (measured with the live layout in effect: the copy and a figure whose piece is at least 40 px
   must fit under the header). Otherwise it stays its static end state, at normal height. Live,
   the CSS does everything: a scroll timeline on the station's track (`css`), or, in a browser
   without scroll timelines, the same keyframes driven from one number per station, --puzzle-p
   (0 → 1 through the pin), written here from the scroll position (`js`; the role the shared
   stage engine src/scripts/stages.ts plays for A8's scenes, kept separate because its scene
   contract, beats and captions are A8's). The page scrolls natively: no wheel or touch event is
   intercepted, and every state is a pure function of the scroll position, so scrolling back plays
   it backwards and a jump lands on the right state. */
const root = document.querySelector<HTMLElement>('[data-direction="puzzle"]');

if (root) {
  const stations = [...root.querySelectorAll<HTMLElement>('[data-puzzle-st]')];
  const still = matchMedia('(prefers-reduced-motion: reduce)');
  const timelines = typeof CSS !== 'undefined' && CSS.supports('animation-timeline: view()') && CSS.supports('view-timeline-inset: 1px 0px');
  let driven: HTMLElement[] = [];
  let frame = 0;

  const header = () => parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--header')) || 0;

  const drive = () => {
    frame = 0;
    const top = header(), view = innerHeight - top;
    for (const st of driven) {
      const track = st.querySelector<HTMLElement>('.puzzle-track');
      if (!track) continue;
      const r = track.getBoundingClientRect(), span = Math.max(1, r.height - view);
      const p = Math.min(1, Math.max(0, (top - r.top) / span));
      track.style.setProperty('--puzzle-p', p.toFixed(4));
    }
  };
  const queue = () => { if (!frame && driven.length) frame = requestAnimationFrame(drive); };

  const fits = (st: HTMLElement) => {
    const stage = st.querySelector<HTMLElement>('.puzzle-stage'), comp = st.querySelector<HTMLElement>('.puzzle-comp');
    if (!stage || !comp) return false;
    const cw = parseFloat(getComputedStyle(st).getPropertyValue('--cw')) || 1;
    const piece = comp.getBoundingClientRect().width / cw;
    return stage.scrollHeight <= stage.clientHeight + 1 && piece >= 40;
  };

  const decide = () => {
    for (const st of stations) {
      if (still.matches) { st.removeAttribute('data-puzzle-live'); continue; }
      st.setAttribute('data-puzzle-live', timelines ? 'css' : 'js');
      if (!fits(st)) st.removeAttribute('data-puzzle-live');
    }
    driven = timelines ? [] : stations.filter(st => st.hasAttribute('data-puzzle-live'));
    for (const st of stations) if (!driven.includes(st)) st.querySelector<HTMLElement>('.puzzle-track')?.style.removeProperty('--puzzle-p');
    drive();
  };

  let resized = 0;
  const later = () => { cancelAnimationFrame(resized); resized = requestAnimationFrame(decide); };
  decide();
  addEventListener('scroll', queue, { passive: true });
  addEventListener('resize', later);
  addEventListener('pageshow', later);
  still.addEventListener('change', decide);
  document.fonts?.ready.then(later);
}
