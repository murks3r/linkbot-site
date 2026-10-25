/* The loop clock shared by the front's figures (third pass, GEO-188): motion runs by itself and loops. One clock per
   figure advances only while the figure is on screen, the tab is visible and nobody has paused it; the frame is a pure
   function of the time within the round, so pausing and resuming never jumps. A loop longer than five seconds must be
   stoppable (WCAG 2.2.2, level A): the control pauses on the round's final frame (`restAt`) and starts nothing. Under
   reduced motion, before or during the visit, the final frame stands and the control is hidden. */
export const easeOutQuint = (t: number) => 1 - Math.pow(1 - t, 5);
export const easeInOutCubic = (t: number) => (t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
export const easeOutBack = (t: number) => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2); };
export const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

interface Loop { figure: HTMLElement; toggle: HTMLButtonElement; round: number; restAt: number; frame: (ms: number) => void }

export function loop({ figure, toggle, round, restAt, frame }: Loop) {
  let elapsed = 0, last = 0, raf = 0, onScreen = false, paused = false;
  const still = matchMedia('(prefers-reduced-motion: reduce)');
  const running = () => onScreen && !paused && !document.hidden && !still.matches;
  const tick = (now: number) => { elapsed += Math.min(now - last, 100); last = now; frame(elapsed % round); raf = requestAnimationFrame(tick); };
  const sync = () => {
    if (running() && !raf) { last = performance.now(); raf = requestAnimationFrame(tick); }
    else if (!running() && raf) { cancelAnimationFrame(raf); raf = 0; }
  };
  // Paused (by the control or by reduced motion): the round's final frame, and the loop resumes from there.
  const settle = () => { elapsed = Math.floor(elapsed / round) * round + restAt; frame(restAt); };
  toggle.hidden = false;
  toggle.addEventListener('click', () => { paused = !paused; toggle.setAttribute('aria-pressed', String(paused)); figure.toggleAttribute('data-paused', paused); if (paused) settle(); sync(); });
  still.addEventListener('change', () => { if (still.matches) { settle(); toggle.hidden = true; } else toggle.hidden = false; sync(); });
  new IntersectionObserver(entries => { onScreen = entries.some(e => e.isIntersecting); sync(); }).observe(figure);
  document.addEventListener('visibilitychange', sync);
  frame(0);
}
