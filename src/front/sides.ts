/* The role switch, "As a buyer" / "As a supplier": one side at a time (spec §9), on the landing page's demo stage and
   on /demo. Markup: a root with [data-sides], a hidden [data-switch] group of buttons with data-show="<side>", and one
   [data-panel="<side>"] per side. Without scripts the switch stays hidden and the sides stand one below the other. */
export function sides(root: HTMLElement) {
  const buttons = [...root.querySelectorAll<HTMLButtonElement>('button[data-show]')];
  const panels = [...root.querySelectorAll<HTMLElement>('[data-panel]')];
  const show = (side: string) => {
    for (const button of buttons) button.setAttribute('aria-pressed', String(button.dataset.show === side));
    for (const panel of panels) panel.hidden = panel.dataset.panel !== side;
  };
  for (const button of buttons) button.addEventListener('click', () => show(button.dataset.show!));
  root.querySelector<HTMLElement>('[data-switch]')!.hidden = false;
  root.toggleAttribute('data-one', true);
  show(buttons[0].dataset.show!);
}
