/* The way into Search Jobs (Concept A9, W1 parts 2–3; founder A5: "ein Übergang, der sich wie ein
   Produkt anfühlt"). Site and app opt in to cross-document view transitions (site.css, the app's
   search.css), share the ground and the header, and name the search field on both sides: the field
   travels into place while the page, header included, swaps at once (a crossfade of two equal grounds
   only halves both grains). The field travels only from where it can be seen: a hero that has
   scrolled away is not named, so the field does not fly in from above the view. Only a navigation
   from the site into the app (/talent) is a transition; between the site's own pages the swap stays
   instant, as before. Under reduced motion there is none (the opt-in is inside
   prefers-reduced-motion: no-preference). */
type PageSwap = Event & { viewTransition?: { skipTransition(): void } | null; activation?: { entry?: { url?: string } | null } | null };
addEventListener('pageswap', event => {
  const { viewTransition, activation } = event as PageSwap;
  if (!viewTransition) return;
  const to = activation?.entry?.url ? new URL(activation.entry.url) : null;
  if (!to || to.origin !== location.origin || !to.pathname.startsWith('/talent')) { viewTransition.skipTransition(); return; }
  for (const field of document.querySelectorAll<HTMLElement>('.hero-search .search-box')) {
    const box = field.getBoundingClientRect();
    field.style.viewTransitionName = box.bottom <= 0 || box.top >= innerHeight ? 'none' : '';
  }
});
