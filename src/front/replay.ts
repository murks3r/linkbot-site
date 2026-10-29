/* The demo page's recorded walkthrough (src/components/front/Replay.astro). Without scripts the six steps stand one
   under another; with them the walkthrough shows one step at a time: the step buttons, Previous and Next, and the
   arrow keys, Home and End while focus is inside it. It never advances by itself, so there is nothing to pause, and it
   animates nothing under reduced motion (demo.css). The address keeps the step (#step-3), so a step can be linked. */
export function replay(root: HTMLElement) {
  const steps = [...root.querySelectorAll<HTMLElement>('[data-step]')];
  const tabs = [...root.querySelectorAll<HTMLButtonElement>('[data-goto]')];
  const previous = root.querySelector<HTMLButtonElement>('[data-previous]')!;
  const next = root.querySelector<HTMLButtonElement>('[data-next]')!;
  const status = root.querySelector<HTMLElement>('[data-status]')!;
  const template = root.dataset.position ?? '{n} / {total}';
  const last = steps.length - 1;
  let current = 0;

  const show = (index: number, { announce = true, remember = true } = {}) => {
    current = Math.min(last, Math.max(0, index));
    steps.forEach((step, i) => { step.hidden = i !== current; });
    tabs.forEach((tab, i) => (i === current ? tab.setAttribute('aria-current', 'step') : tab.removeAttribute('aria-current')));
    previous.disabled = current === 0;
    next.disabled = current === last;
    if (announce) status.textContent = template.replace('{n}', String(current + 1)).replace('{total}', String(steps.length));
    if (remember) history.replaceState(null, '', `#${steps[current].id}`);
  };

  tabs.forEach((tab, i) => tab.addEventListener('click', () => show(i)));
  previous.addEventListener('click', () => show(current - 1));
  next.addEventListener('click', () => show(current + 1));
  root.addEventListener('keydown', (event) => {
    const to = { ArrowLeft: current - 1, ArrowRight: current + 1, Home: 0, End: last }[event.key];
    if (to === undefined || event.altKey || event.ctrlKey || event.metaKey) return;
    event.preventDefault();
    show(to);
  });

  const linked = steps.findIndex((step) => `#${step.id}` === location.hash);
  root.dataset.player = '';
  show(linked < 0 ? 0 : linked, { announce: false, remember: false });
}
