/* The covert yes in the browser: on a posting's page (src/components/front/CovertYes.astro) and as the list on
   /jobs/mine (src/components/front/CovertMine.astro). Both read and change the session only through the stand-in
   (src/jobs/interest-stub.ts), so swapping it for the jobs space's client changes nothing here. No network call. A
   panel shows while its state holds ([data-when]); after a press the keyboard lands on the next panel's first button,
   and the panel's note is read out ([data-live]). */
import { canSay, mine, said, type Session } from '../jobs/interest';
import { interests } from '../jobs/interest-stub';
import type { Posting as CataloguePosting } from '../jobs/catalogue';

type Posting = Pick<CataloguePosting, 'id' | 'party'>;
type Listed = { title: string; employer: string; href: string };
interface MineSource { lang: string; postings: Record<string, Listed>; saidOn: string; withdraw: string; withdrawn: string }

const show = (root: HTMLElement, state: string) => {
  root.querySelectorAll<HTMLElement>('[data-when]').forEach(el => { el.hidden = el.dataset.when !== state; });
  return root.querySelector<HTMLElement>(`[data-when="${state}"]`)!;
};
const land = (panel: HTMLElement, live: HTMLElement, note?: string) => {
  live.textContent = note ?? panel.querySelector('[data-note]')?.textContent?.trim() ?? '';
  panel.querySelector<HTMLElement>('button, a')?.focus();
};

export function mountPosting(root: HTMLElement) {
  const posting = JSON.parse(root.dataset.covert!) as Posting;
  const api = interests();
  const live = root.querySelector<HTMLElement>('[data-live]')!;
  const state = (s: Session) => s.person === null ? 'out' : said(s, posting.id) ? 'said' : canSay(s, posting.id) ? 'ready' : 'out';
  show(root, state(api.read()));
  root.addEventListener('click', event => {
    const act = (event.target as Element).closest<HTMLButtonElement>('button[data-act]')?.dataset.act;
    if (!act) return;
    const s = act === 'sign-in' ? api.signIn() : act === 'say' ? api.say(posting) : act === 'withdraw' ? api.withdraw(posting.id) : api.read();
    land(show(root, state(s)), live, act === 'withdraw' ? root.querySelector('[data-withdrawn]')?.textContent?.trim() : undefined);
  });
}

export function mountMine(root: HTMLElement) {
  const source = JSON.parse(root.querySelector<HTMLElement>('[data-covert-source]')!.textContent!) as MineSource;
  const api = interests();
  const live = root.querySelector<HTMLElement>('[data-live]')!;
  const list = root.querySelector<HTMLElement>('[data-covert-list]')!;
  const day = new Intl.DateTimeFormat(source.lang, { day: 'numeric', month: 'long', year: 'numeric' });
  const render = (s: Session) => {
    const yeses = mine(s).filter(i => source.postings[i.posting_id]);
    list.replaceChildren(...yeses.map(i => {
      const p = source.postings[i.posting_id];
      const item = document.createElement('li');
      const link = Object.assign(document.createElement('a'), { href: p.href, textContent: p.title, className: 'link' });
      const meta = Object.assign(document.createElement('p'), { textContent: `${p.employer} · ${source.saidOn.replace('{date}', day.format(new Date(i.at)))}` });
      const button = Object.assign(document.createElement('button'), { type: 'button', className: 'btn', textContent: source.withdraw });
      button.dataset.act = `withdraw:${i.posting_id}`;
      item.append(link, meta, button);
      return item;
    }));
    return show(root, s.person === null ? 'out' : yeses.length ? 'list' : 'empty');
  };
  render(api.read());
  root.addEventListener('click', event => {
    const act = (event.target as Element).closest<HTMLButtonElement>('button[data-act]')?.dataset.act;
    if (!act) return;
    const [verb, id] = act.split(':');
    const s = verb === 'sign-in' ? api.signIn() : verb === 'withdraw' ? api.withdraw(id) : api.read();
    const panel = render(s);
    land(panel, live, verb === 'withdraw' ? source.withdrawn.replace('{title}', source.postings[id]?.title ?? '') : undefined);
  });
}
