/**
 * Initialises a single global Lenis instance, only when:
 *  - the user has not requested reduced motion, and
 *  - the browser exposes requestIdleCallback (capability check).
 */
export function initSmoothScroll(): void {
  if (typeof window === 'undefined') return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;

  let cleanup: (() => void) | null = null;

  const start = async () => {
    const { default: Lenis } = await import('lenis');
    const lenis = new Lenis({
      duration: 1.05,
      smoothWheel: true,
      syncTouch: false,
      wheelMultiplier: 1,
      touchMultiplier: 1.4,
    });
    let rafId = 0;
    const raf = (time: number) => { lenis.raf(time); rafId = requestAnimationFrame(raf); };
    rafId = requestAnimationFrame(raf);
    document.documentElement.classList.add('lenis');
    cleanup = () => { cancelAnimationFrame(rafId); lenis.destroy(); document.documentElement.classList.remove('lenis'); };
  };

  const ric = (window as unknown as { requestIdleCallback?: (cb: () => void) => void }).requestIdleCallback;
  if (typeof ric === 'function') {
    ric(() => { start().catch((err) => console.error('[lenis] init failed', err)); });
  } else {
    setTimeout(() => { start().catch((err) => console.error('[lenis] init failed', err)); }, 0);
  }

  (window as unknown as { __lenisCleanup?: () => void }).__lenisCleanup = () => { cleanup?.(); };
}
