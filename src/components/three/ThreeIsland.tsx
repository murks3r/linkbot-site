import { useEffect, useRef } from 'react';
import ThreeExperience from './ThreeExperience';

export default function ThreeIsland() {
  const progressRef = useRef(0);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      progressRef.current = 1;
      document.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el) => el.classList.add('is-visible'));
      return;
    }

    let scrollTriggerInstance: { kill: () => void } | null = null;
    let cancelled = false;

    (async () => {
      const gsapMod = await import('gsap');
      const stMod = await import('gsap/ScrollTrigger');
      if (cancelled) return;
      const gsap = gsapMod.default;
      const ScrollTrigger = stMod.ScrollTrigger;
      gsap.registerPlugin(ScrollTrigger);

      const lenis = (window as unknown as { __lenis?: { raf: (t: number) => void } }).__lenis;
      if (lenis) {
        gsap.ticker.lagSmoothing(0);
        gsap.ticker.add((time: number) => lenis.raf(time * 1000));
      }

      const section = document.querySelector<HTMLElement>('[data-pinned-scene]');
      if (!section) return;

      scrollTriggerInstance = ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.6,
        onUpdate: (self) => {
          const t = self.progress;
          progressRef.current = t;
          const items = document.querySelectorAll<HTMLElement>('[data-reveal]');
          items.forEach((el) => {
            const at = parseFloat(el.dataset.at ?? '0');
            if (Number.isFinite(at) && t >= at) el.classList.add('is-visible');
          });
        },
      });
    })().catch((err) => { console.error('[scene] ScrollTrigger init failed', err); });

    return () => {
      cancelled = true;
      scrollTriggerInstance?.kill();
    };
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0" aria-hidden="true" data-three-island>
      <ThreeExperience progressRef={progressRef} />
    </div>
  );
}
