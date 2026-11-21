/* The person's own page in Jobs, as a demo on fictional data (src/components/front/Mine.astro, the draft /jobs/mine):
   sign in, the confirmed criteria, the verdicts each company sees, an answer per role, the block list, pause, export
   and delete. It runs in the visitor's browser only: no network call, nothing stored; the export is a file made here.
   The page is rendered signed out for scripts; every element that depends on the state carries data-if (conditions,
   all of which must hold) and is shown or hidden from here. Without scripts the page shows the signed-in page instead
   (STORY), its buttons hidden (src/front/mine.css). */
export type Answer = 'open' | 'interested' | 'declined' | 'later';
export interface State {
  signedIn: boolean;
  paused: boolean;
  deletion: 'none' | 'asked' | 'done';
  answers: Record<string, Answer>;
  blocked: Record<string, boolean>;
}
export type Action =
  | { type: 'sign-in' } | { type: 'sign-out' }
  | { type: 'pause' } | { type: 'resume' }
  | { type: 'answer'; role: string; answer: Answer }
  | { type: 'block'; company: string; on: boolean }
  | { type: 'delete' } | { type: 'keep' } | { type: 'confirm-delete' }
  | { type: 'reset' };

/** The first state: signed out, every role unanswered, the companies blocked that the person listed (the current employer). */
export const start = (roles: string[], blocked: string[], companies: string[]): State => ({
  signedIn: false,
  paused: false,
  deletion: 'none',
  answers: Object.fromEntries(roles.map(role => [role, 'open'])),
  blocked: Object.fromEntries(companies.map(company => [company, blocked.includes(company)])),
});

/** The signed-in page at once, for a page without scripts. */
export const story = (s: State): State => ({ ...s, signedIn: true });

/** A change counts only while signed in and not deleted; an answer also not while paused; a role answered must be reopened first. */
export function reduce(s: State, action: Action, first: State): State {
  if (action.type === 'reset') return first;
  if (action.type === 'sign-in') return s.deletion === 'done' ? s : { ...s, signedIn: true };
  if (!s.signedIn || s.deletion === 'done') return s;
  switch (action.type) {
    case 'sign-out': return { ...s, signedIn: false, deletion: 'none' };
    case 'pause': return { ...s, paused: true };
    case 'resume': return { ...s, paused: false };
    case 'answer': {
      const now = s.answers[action.role];
      if (now === undefined || s.paused) return s;
      const allowed = action.answer === 'open' ? now !== 'open' : now === 'open' || now === 'later';
      return allowed ? { ...s, answers: { ...s.answers, [action.role]: action.answer } } : s;
    }
    case 'block': return action.company in s.blocked ? { ...s, blocked: { ...s.blocked, [action.company]: action.on } } : s;
    case 'delete': return { ...s, deletion: 'asked' };
    case 'keep': return { ...s, deletion: 'none' };
    case 'confirm-delete': return s.deletion === 'asked' ? { ...s, deletion: 'done' } : s;
  }
}

/** The facts the markup's conditions name: signed:in|out, paused:yes|no, deletion:none|asked|done, role-<id>:<answer>,
    block-<id>:on|off. */
export function facts(s: State): Record<string, string> {
  return {
    signed: s.signedIn ? 'in' : 'out',
    paused: s.paused ? 'yes' : 'no',
    deletion: s.deletion,
    ...Object.fromEntries(Object.entries(s.answers).map(([role, answer]) => [`role-${role}`, answer])),
    ...Object.fromEntries(Object.entries(s.blocked).map(([company, on]) => [`block-${company}`, on ? 'on' : 'off'])),
  };
}

/** "signed:in role-a:open|later": every condition must hold; values after a colon are alternatives. */
export const holds = (conditions: string, s: State): boolean => {
  const known = facts(s);
  return conditions.split(/\s+/).filter(Boolean).every(condition => {
    const [key, values] = condition.split(':');
    return values.split('|').includes(known[key]);
  });
};

/** What the export holds: the person's own criteria, answers, block list and history, nothing of a company's. */
export interface ExportSource {
  note: string;
  criteria: { criterion: string; value: string; importance: string }[];
  roles: { id: string; title: string }[];
  companies: { id: string; domain: string }[];
  history: string[];
}

export function exportOf(s: State, source: ExportSource) {
  return {
    note: source.note,
    paused: s.paused,
    criteria: source.criteria,
    answers: source.roles.map(role => ({ role: role.title, answer: s.answers[role.id] })).filter(a => a.answer !== 'open' && a.answer !== 'later'),
    blockList: source.companies.filter(c => s.blocked[c.id]).map(c => c.domain),
    history: source.history,
  };
}

/** Attaches the demo to its markup: [data-act] buttons (name and an optional argument after a colon), [data-if]
    elements, a [data-say] live region and the export's words in a JSON script ([data-mine-source]). */
export function mount(root: HTMLElement) {
  const source = JSON.parse(root.querySelector<HTMLElement>('[data-mine-source]')!.textContent!) as ExportSource & { file: string; blocked: string[] };
  const first = start(source.roles.map(r => r.id), source.blocked, source.companies.map(c => c.id));
  let state = first;
  const calm = matchMedia('(prefers-reduced-motion: reduce)');
  const say = root.querySelector<HTMLElement>('[data-say]')!;
  const render = () => {
    const appeared: HTMLElement[] = [];
    root.querySelectorAll<HTMLElement>('[data-if]').forEach(el => {
      const was = !el.hasAttribute('data-off');
      const on = holds(el.dataset.if!, state);
      el.toggleAttribute('data-off', !on);
      if (on && !was) appeared.push(el);
      if (on && !was && !calm.matches) el.animate({ opacity: [0, 1], transform: ['translateY(4px)', 'none'] }, { duration: 200, easing: 'ease-out' });
    });
    // Read out the note that just appeared: an element marked data-note, or the first such note inside it.
    const note = appeared.map(el => el.matches('[data-note]') ? el : el.querySelector<HTMLElement>('[data-note]'))
      .filter((el): el is HTMLElement => !!el && !el.closest('[data-off]')).pop();
    if (note) say.textContent = note.textContent?.trim() ?? '';
  };
  const download = () => {
    const blob = new Blob([JSON.stringify(exportOf(state, source), null, 2)], { type: 'application/json' });
    const link = Object.assign(document.createElement('a'), { href: URL.createObjectURL(blob), download: source.file });
    link.click();
    setTimeout(() => URL.revokeObjectURL(link.href), 0);
  };
  root.addEventListener('click', event => {
    const button = (event.target as Element).closest<HTMLButtonElement>('button[data-act]');
    if (!button) return;
    const [act, arg] = button.dataset.act!.split(':');
    if (act === 'export') { download(); return; }
    const action: Action = act === 'answer' ? { type: 'answer', role: arg.split('=')[0], answer: arg.split('=')[1] as Answer }
      : act === 'block' || act === 'unblock' ? { type: 'block', company: arg, on: act === 'block' }
      : { type: act } as Action;
    state = reduce(state, action, first);
    render();
    // The pressed button may be gone now: keep the keyboard in the demo, on the next visible button of its group, else
    // the first visible one.
    if (button.closest('[data-off]')) {
      const visible = (within: Element | null) => [...(within?.querySelectorAll<HTMLElement>('button[data-act]') ?? [])].find(b => !b.closest('[data-off]'));
      (visible(button.closest('[data-group]')) ?? visible(root))?.focus();
    }
  });
  render();
}
