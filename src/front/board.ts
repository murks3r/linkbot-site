/* The job board's search in the browser (src/components/front/Board.astro): reads the query from the address, filters
   the page's postings with the same function the build uses (src/jobs/catalogue.ts, search), shows the cards that fit
   in its order, says how many, and keeps the query in the address so a search can be shared. No network call. */
import { readQuery, search, writeQuery, type Posting, type Query } from '../jobs/catalogue';
import { countryNames } from '../jobs/format';

interface Source { postings: Posting[]; count: { none: string; one: string; other: string } }

export const mount = (root: HTMLElement) => {
  const { postings, count } = JSON.parse(root.querySelector('[data-board-source]')!.textContent!) as Source;
  const names = countryNames(root.dataset.lang === 'de' ? 'de' : 'en');
  const form = root.querySelector<HTMLFormElement>('[data-board-form]')!;
  const list = root.querySelector<HTMLElement>('[data-board-list]')!;
  const status = root.querySelector<HTMLElement>('[data-board-count]')!;
  const cards = new Map([...list.querySelectorAll<HTMLElement>('[data-posting]')].map(card => [card.dataset.posting!, card]));
  const field = (name: string) => form.elements.namedItem(name) as HTMLInputElement | HTMLSelectElement;

  const read = (): Query => readQuery(new URLSearchParams([...new FormData(form)].map(([k, v]) => [k, String(v)])));
  const fill = (query: Query) => {
    field('q').value = query.q;
    field('where').value = query.where;
    field('mode').value = query.mode;
    field('since').value = query.since ? String(query.since) : '';
  };
  const show = (query: Query) => {
    const found = search(postings, query, new Date().toISOString().slice(0, 10), names);
    for (const card of cards.values()) card.hidden = true;
    for (const p of found) {
      const card = cards.get(p.id);
      if (card) { card.hidden = false; list.append(card); }
    }
    status.textContent = found.length === 0 ? count.none : found.length === 1 ? count.one : count.other.replace('{n}', String(found.length));
    const params = writeQuery(query);
    history.replaceState(history.state, '', `${location.pathname}${params ? `?${params}` : ''}${location.hash}`);
  };

  fill(readQuery(new URLSearchParams(location.search)));
  show(read());
  form.addEventListener('input', () => show(read()));
  form.addEventListener('submit', event => { event.preventDefault(); show(read()); });
  form.addEventListener('reset', () => setTimeout(() => show(read())));
};
