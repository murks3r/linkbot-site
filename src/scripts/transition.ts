/* The way into Search Jobs (Concept A9, W1 part 2; founder A5: "ein Übergang, der sich wie ein
   Produkt anfühlt"). Site and app opt in to cross-document view transitions (site.css, the app's
   search.css), share the ground, and name the header and the search field on both sides, so the
   header stays where it is and the field travels into place. Only a navigation from the site into
   the app (/talent) is a transition; between the site's own pages the swap stays instant, as before.
   Under reduced motion there is none (the opt-in is inside prefers-reduced-motion: no-preference). */
type PageSwap = Event & { viewTransition?: { skipTransition(): void } | null; activation?: { entry?: { url?: string } | null } | null };
addEventListener('pageswap', event => {
  const { viewTransition, activation } = event as PageSwap;
  if (!viewTransition) return;
  const to = activation?.entry?.url ? new URL(activation.entry.url) : null;
  if (!to || to.origin !== location.origin || !to.pathname.startsWith('/talent')) viewTransition.skipTransition();
});
