/* Draws a highlighter pass when its element comes into view (adds .is-in once). The marks mean
   something (what was read, what is stated), so they never depend on scrolling: without
   IntersectionObserver, or under reduced motion, they are simply there. */
const targets = [...document.querySelectorAll<HTMLElement>('[data-draw]')];
const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
if (still || !('IntersectionObserver' in window)) targets.forEach(el => el.classList.add('is-in'));
else {
  const seen = new IntersectionObserver(entries => {
    for (const entry of entries) if (entry.isIntersecting) { entry.target.classList.add('is-in'); seen.unobserve(entry.target); }
  }, { rootMargin: '0px 0px -12% 0px', threshold: .2 });
  targets.forEach(el => seen.observe(el));
}
