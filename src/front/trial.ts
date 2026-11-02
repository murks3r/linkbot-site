/* The home's "both say yes" demo (src/components/front/Trial.astro): one fictional buyer, one fictional supplier, three
   steps: 1 each side confirms its email address through a link (the one check that runs today), 2 a possible fit with a
   verdict per criterion and no names, 3 each side answers on its own; both yes is an introduction, one no reveals
   nothing. It runs in the visitor's browser only: no network call, nothing stored.
   The page is rendered in its first state; every element that depends on the state carries data-if (conditions, all of
   which must hold) and is shown or hidden from here. Without scripts the page shows the whole path instead (STORY), its
   buttons hidden (src/front/trial.css). */
export type Side = 'buyer' | 'supplier';
export type Answer = 'new' | 'confirmed' | 'yes' | 'no';
export interface State { step: 0 | 1 | 2 | 3; buyer: Answer; supplier: Answer }
export type Action =
  | { type: 'confirm'; side: Side }
  | { type: 'next' }
  | { type: 'answer'; side: Side; yes: boolean }
  | { type: 'reset' };

export const START: State = { step: 1, buyer: 'new', supplier: 'new' };
/** The whole path at once, for a page without scripts: step 0 matches every step's condition. */
export const STORY: State = { step: 0, buyer: 'yes', supplier: 'yes' };

/** introduced once both said yes, declined once one said no, open before. */
export const end = (s: State) => s.buyer === 'no' || s.supplier === 'no' ? 'declined' : s.buyer === 'yes' && s.supplier === 'yes' ? 'introduced' : 'open';
const confirmed = (a: Answer) => a !== 'new';

/** Whether the next step may start: step 1 once both sides are confirmed, step 2 at once. */
export const canAdvance = (s: State) => s.step === 1 ? confirmed(s.buyer) && confirmed(s.supplier) : s.step === 2;

export function reduce(s: State, action: Action): State {
  switch (action.type) {
    case 'confirm': return s.step === 1 && s[action.side] === 'new' ? { ...s, [action.side]: 'confirmed' } : s;
    case 'next': return canAdvance(s) ? { ...s, step: (s.step + 1) as State['step'] } : s;
    case 'answer': return s.step === 3 && s[action.side] === 'confirmed' && end(s) === 'open' ? { ...s, [action.side]: action.yes ? 'yes' : 'no' } : s;
    case 'reset': return START;
  }
}

/** "step:1 buyer:new|confirmed end:open": every condition must hold; values after a colon are alternatives. */
export function holds(conditions: string, s: State): boolean {
  const facts: Record<string, string> = { step: String(s.step), buyer: s.buyer, supplier: s.supplier, end: end(s), next: String(canAdvance(s)) };
  return conditions.split(/\s+/).filter(Boolean).every(condition => {
    const [key, values] = condition.split(':');
    if (key === 'step' && s.step === 0) return true;
    if (key === 'next' && s.step === 0) return false;
    return values.split('|').includes(facts[key]);
  });
}

/** Attaches the demo to its markup: [data-act] buttons (confirm-<side>, next, yes-<side>, no-<side>, reset), [data-if]
    elements, [data-step] progress items and a [data-say] live region that reads out what changed. */
export function mount(root: HTMLElement) {
  let state = START;
  const calm = matchMedia('(prefers-reduced-motion: reduce)');
  const say = root.querySelector<HTMLElement>('[data-say]')!;
  const render = (before: State) => {
    root.querySelectorAll<HTMLElement>('[data-if]').forEach(el => {
      const was = !el.hasAttribute('data-off');
      const on = holds(el.dataset.if!, state);
      el.toggleAttribute('data-off', !on);
      if (on && !was && !calm.matches) el.animate({ opacity: [0, 1], transform: ['translateY(4px)', 'none'] }, { duration: 220, easing: 'ease-out' });
    });
    root.querySelectorAll<HTMLElement>('[data-step]').forEach(el => {
      const n = Number(el.dataset.step);
      el.dataset.state = n < state.step ? 'done' : n === state.step ? 'now' : 'next';
      if (n === state.step) el.setAttribute('aria-current', 'step'); else el.removeAttribute('aria-current');
    });
    root.querySelector<HTMLButtonElement>('button[data-act="next"]')!.disabled = !canAdvance(state);
    root.dataset.end = end(state);
    root.dataset.at = String(state.step);
    // Read out the one text that changed: a new step's title, a side's confirmation or answer, the end.
    const changed = state.step !== before.step ? `[data-title="${state.step}"]`
      : end(state) !== end(before) ? `[data-result="${end(state)}"]`
      : (['buyer', 'supplier'] as const).filter(side => state[side] !== before[side]).map(side => `[data-note="${side}-${state[side]}"]`)[0];
    if (changed) say.textContent = root.querySelector<HTMLElement>(changed)?.textContent?.trim() ?? '';
  };
  root.addEventListener('click', event => {
    const button = (event.target as Element).closest<HTMLButtonElement>('button[data-act]');
    if (!button) return;
    const [act, side] = button.dataset.act!.split('-') as [string, Side | undefined];
    const action: Action = act === 'confirm' ? { type: 'confirm', side: side! }
      : act === 'yes' || act === 'no' ? { type: 'answer', side: side!, yes: act === 'yes' }
      : act === 'next' ? { type: 'next' } : { type: 'reset' };
    const before = state;
    state = reduce(state, action);
    render(before);
    // The pressed button may be gone now: keep the keyboard in the demo, on the next thing to press or the step's title.
    if (button.closest('[data-off]')) {
      const target = [...root.querySelectorAll<HTMLElement>('button[data-act]')].find(b => !b.closest('[data-off]') && b.dataset.act !== button.dataset.act)
        ?? root.querySelector<HTMLElement>(`[data-title="${state.step}"]`);
      target?.focus();
    }
  });
  render(state);
}
