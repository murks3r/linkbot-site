/* Direction B: the page asks back. Everything here happens in the browser and stays there: no request, no storage,
   not even for the tab. The form never submits anywhere; "Ask me" shows the pack's questions and echoes the line as
   written; every answer appears in the "stored" panel with its source and importance, as a confirm would store it;
   a number two conventions read differently is refused with the widget's own question (Connect ADR 0004). */
const PHOSPHATES = new Set(['Rock phosphate', 'DAP (diammonium phosphate)', 'MAP (monoammonium phosphate)', 'TSP (triple superphosphate)']);

for (const form of document.querySelectorAll<HTMLFormElement>('[data-ask]')) ask(form);

function ask(form: HTMLFormElement) {
  const line = form.querySelector<HTMLInputElement>('[data-ask-line]')!;
  const yours = form.querySelector<HTMLElement>('[data-yours]')!;
  const yoursText = form.querySelector<HTMLElement>('[data-yours-text]')!;
  const storedList = form.querySelector<HTMLElement>('[data-stored-list]')!;
  const storedEmpty = form.querySelector<HTMLElement>('[data-stored-empty]')!;
  const result = form.querySelector<HTMLElement>('[data-ask-result]')!;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const words = JSON.parse(form.dataset.words ?? '{}') as Record<string, string>;
  form.setAttribute('data-js', '');

  form.addEventListener('submit', event => {
    event.preventDefault();
    const text = line.value.trim();
    if (!text) { form.setAttribute('data-empty', ''); line.focus(); return; }
    form.removeAttribute('data-empty');
    yoursText.textContent = text;
    yours.hidden = false;
    form.setAttribute('data-asked', '');
    result.hidden = false;
    result.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    const first = form.querySelector<HTMLElement>('[data-q]:not([hidden]) input');
    first?.focus({ preventScroll: true });
  });
  line.addEventListener('input', () => form.removeAttribute('data-empty'));

  form.querySelector<HTMLButtonElement>('[data-ask-reset]')?.addEventListener('click', () => {
    form.reset();
    yours.hidden = true; yoursText.textContent = '';
    form.removeAttribute('data-asked');
    for (const err of form.querySelectorAll<HTMLElement>('[data-err]')) { err.hidden = true; err.textContent = ''; }
    for (const field of form.querySelectorAll<HTMLInputElement>('[aria-invalid]')) field.removeAttribute('aria-invalid');
    dependants(); stored();
    line.focus();
  });

  /* A number in the English form: "25,000" is twenty-five thousand; "25.000" could be 25 or 25,000, so it is refused
     with a question, never guessed (Connect ADR 0004; the widget's own line). */
  const ambiguous = (raw: string) => /^\d{1,3}\.\d{3}$/.test(raw.trim());
  const twoWays = (raw: string) => { const [a, b] = raw.trim().split('.'); return { a: `${Number(a)}`, b: `${Number(a + b).toLocaleString('en-GB')}` }; };
  for (const field of form.querySelectorAll<HTMLInputElement>('[data-num]')) {
    const err = field.closest('[data-q]')!.querySelector<HTMLElement>('[data-err]')!;
    const check = () => {
      if (ambiguous(field.value)) {
        const { a, b } = twoWays(field.value);
        err.textContent = (words.ambiguous ?? 'Is this {a} or {b}?').replace('{a}', a).replace('{b}', b);
        err.hidden = false; field.setAttribute('aria-invalid', 'true');
      } else if (field.getAttribute('aria-invalid')) {
        const other = [...field.closest('[data-q]')!.querySelectorAll<HTMLInputElement>('[data-num]')].some(f => f !== field && ambiguous(f.value));
        if (!other) { err.hidden = true; err.textContent = ''; }
        field.removeAttribute('aria-invalid');
      }
    };
    field.addEventListener('input', check);
  }

  /* The pack's show-when: the phosphate criteria appear once a phosphate is chosen (or the answer is "other" or
     "don't know", which keep their dependants visible and optional); sulphur hides them. */
  const product = () => form.querySelector<HTMLInputElement>('input[name="product"]:checked')?.value ?? '';
  const dependants = () => {
    const p = product();
    const show = p !== '' && (PHOSPHATES.has(p) || p === '__other' || p === '__unknown' || p === '__any');
    for (const q of form.querySelectorAll<HTMLElement>('[data-phosphates-only]')) q.hidden = !show;
  };

  /* A special answer clears the ordinary one and the other way round, as one radio group would. */
  form.addEventListener('change', event => {
    const input = event.target as HTMLInputElement;
    const q = input.closest<HTMLElement>('[data-q]');
    if (!q) return;
    if (input.dataset.special) {
      for (const f of q.querySelectorAll<HTMLInputElement>('input:not([data-special])')) { if (f.type === 'checkbox' || f.type === 'radio') f.checked = false; else f.value = ''; }
    } else if (input.type !== 'radio' || !input.dataset.special) {
      for (const s of q.querySelectorAll<HTMLInputElement>('input[data-special]')) if (s !== input) s.checked = false;
    }
    const other = q.querySelector<HTMLElement>('[data-other]');
    if (other) other.hidden = !(q.querySelector<HTMLInputElement>('input[data-special="other"]')?.checked);
    dependants(); stored();
  });
  form.addEventListener('input', event => { if ((event.target as HTMLElement).matches('[data-num], [data-text]')) stored(); });

  /* What a confirm would store: the criterion, its value, its source and its importance; a skipped question is unknown. */
  const stored = () => {
    const rows: string[] = [];
    for (const q of form.querySelectorAll<HTMLElement>('[data-q]:not([hidden])')) {
      const label = q.dataset.label ?? '', importance = q.dataset.importance ?? '', unit = q.dataset.unit ?? '';
      const special = q.querySelector<HTMLInputElement>('input[data-special]:checked');
      let value = '';
      if (special) {
        if (special.dataset.special === 'other') { const text = q.querySelector<HTMLInputElement>('[data-other] input')?.value.trim(); value = text ? `${words.storedOther ?? 'your words'}: “${text}”` : words.other ?? 'Other / not listed'; }
        else value = special.dataset.special === 'unknown' ? (words.storedUnknown ?? 'unknown') : (words.any ?? 'any');
      } else {
        const picked = [...q.querySelectorAll<HTMLInputElement>('input[type="radio"]:checked, input[type="checkbox"]:checked')].filter(i => !i.dataset.special).map(i => i.value);
        const nums = [...q.querySelectorAll<HTMLInputElement>('[data-num]')].map(i => i.value.trim());
        const text = q.querySelector<HTMLInputElement>('[data-text]')?.value.trim();
        if (picked.length) value = picked.join(', ');
        else if (nums.some(Boolean)) value = nums.some(ambiguous) ? '' : `${nums[0] ? `${words.min ?? 'at least'} ${nums[0]}` : ''}${nums[0] && nums[1] ? ', ' : ''}${nums[1] ? `${words.max ?? 'at most'} ${nums[1]}` : ''} ${unit}`.trim();
        else if (text) value = text;
        const basis = q.querySelector<HTMLInputElement>('input[data-basis]:checked')?.value;
        if (value && basis) value += `, ${basis}`;
      }
      if (!value) continue;
      rows.push(`<div><dt>${esc(label)}</dt><dd><b>${esc(value)}</b><small>${esc(words.storedSource ?? 'picked by you')} · ${esc(importance)}</small></dd></div>`);
    }
    storedList.innerHTML = rows.join('');
    storedEmpty.hidden = rows.length > 0;
  };
  const esc = (s: string) => s.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!);
  dependants(); stored();
}
