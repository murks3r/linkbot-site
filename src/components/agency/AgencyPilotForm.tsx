import { useRef, useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import {
  ENQUIRY_FOCUS_OPTIONS,
  ENQUIRY_HANDOFF_NOTE,
  ENQUIRY_RECIPIENT,
  ENQUIRY_TRANSMISSION_NOTE,
  buildEnquiryDraft,
  directEnquiryUrl,
  emptyEnquiryFields,
  validateEnquiry,
} from './enquiry';
import type { EnquiryFieldErrors, EnquiryFields } from './enquiry';

type FormStatus =
  | { kind: 'idle' }
  | { kind: 'invalid'; missing: number }
  | { kind: 'prepared'; mailtoUrl: string; body: string }
  | { kind: 'blocked'; mailtoUrl: string; body: string };

type CopyState = 'idle' | 'copied' | 'failed';

const control = 'mt-2 block w-full rounded-lg border border-bone-50/20 bg-ink-900 px-4 py-3 text-sm text-bone-50 placeholder:text-bone-200/35 focus:border-signal-400 focus:outline-none [&[aria-invalid=true]]:border-alarm-400/70';
const labelText = 'text-xs font-medium uppercase tracking-[0.14em] text-bone-200/75';
const errorText = 'mt-2 text-xs leading-5 text-alarm-400';

const fieldOrder: (keyof EnquiryFields)[] = ['name', 'agency', 'email', 'focus', 'context'];

export default function AgencyPilotForm() {
  const [fields, setFields] = useState<EnquiryFields>(emptyEnquiryFields);
  const [errors, setErrors] = useState<EnquiryFieldErrors>({});
  const [status, setStatus] = useState<FormStatus>({ kind: 'idle' });
  const [copyState, setCopyState] = useState<CopyState>('idle');
  const statusRef = useRef<HTMLDivElement | null>(null);
  const draftTextRef = useRef<HTMLTextAreaElement | null>(null);
  const inputs = useRef<Partial<Record<keyof EnquiryFields, HTMLElement | null>>>({});

  function update(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const key = event.target.name as keyof EnquiryFields;
    const value = event.target.value;
    setFields((current) => ({ ...current, [key]: value }));
    setErrors((current) => (current[key] ? { ...current, [key]: undefined } : current));
    setCopyState('idle');
  }

  function register(key: keyof EnquiryFields) {
    return (node: HTMLElement | null) => { inputs.current[key] = node; };
  }

  function prepareDraft(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const fieldErrors = validateEnquiry(fields);
    const missing = fieldOrder.filter((key) => fieldErrors[key]);
    if (missing.length) {
      setErrors(fieldErrors);
      setStatus({ kind: 'invalid', missing: missing.length });
      inputs.current[missing[0]]?.focus();
      return;
    }

    const draft = buildEnquiryDraft(fields);
    setErrors({});
    setCopyState('idle');

    // The handoff is a handoff: an email draft is opened on the visitor's device.
    // Nothing is transmitted to Linkbot and no submission state exists to report.
    try {
      window.location.href = draft.mailtoUrl;
      setStatus({ kind: 'prepared', mailtoUrl: draft.mailtoUrl, body: draft.body });
    } catch {
      setStatus({ kind: 'blocked', mailtoUrl: draft.mailtoUrl, body: draft.body });
    }
    // Move focus to the outcome so keyboard and screen-reader users hear it.
    window.requestAnimationFrame(() => statusRef.current?.focus());
  }

  async function copyDraft(body: string) {
    try {
      if (!navigator.clipboard?.writeText) throw new Error('clipboard unavailable');
      await navigator.clipboard.writeText(body);
      setCopyState('copied');
    } catch {
      setCopyState('failed');
      draftTextRef.current?.focus();
      draftTextRef.current?.select();
    }
  }

  const prepared = status.kind === 'prepared' || status.kind === 'blocked';

  return (
    <form onSubmit={prepareDraft} className="grid gap-5 sm:grid-cols-2" aria-label="Agency pilot email enquiry" noValidate>
      <label className="block">
        <span className={labelText}>Your name *</span>
        <input
          required name="name" autoComplete="name" maxLength={120} className={control} placeholder="Jane Doe"
          value={fields.name} onChange={update} ref={register('name')}
          aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? 'enquiry-name-error' : undefined}
        />
        {errors.name && <span id="enquiry-name-error" role="alert" className={errorText}>{errors.name}</span>}
      </label>
      <label className="block">
        <span className={labelText}>Agency *</span>
        <input
          required name="agency" autoComplete="organization" maxLength={160} className={control} placeholder="Your recruiting firm"
          value={fields.agency} onChange={update} ref={register('agency')}
          aria-invalid={Boolean(errors.agency)} aria-describedby={errors.agency ? 'enquiry-agency-error' : undefined}
        />
        {errors.agency && <span id="enquiry-agency-error" role="alert" className={errorText}>{errors.agency}</span>}
      </label>
      <label className="block">
        <span className={labelText}>Work email *</span>
        <input
          required type="email" name="email" autoComplete="email" maxLength={180} className={control} placeholder="you@agency.com"
          value={fields.email} onChange={update} ref={register('email')}
          aria-invalid={Boolean(errors.email)} aria-describedby={errors.email ? 'enquiry-email-error' : 'enquiry-email-hint'}
        />
        {errors.email
          ? <span id="enquiry-email-error" role="alert" className={errorText}>{errors.email}</span>
          : <span id="enquiry-email-hint" className="mt-2 block text-xs leading-5 text-bone-200/55">Used only to reply to your enquiry, in the draft you send yourself.</span>}
      </label>
      <label className="block">
        <span className={labelText}>Hiring focus *</span>
        <select
          required name="focus" className={control} value={fields.focus} onChange={update} ref={register('focus')}
          aria-invalid={Boolean(errors.focus)} aria-describedby={errors.focus ? 'enquiry-focus-error' : undefined}
        >
          <option value="" disabled>Choose a focus</option>
          {ENQUIRY_FOCUS_OPTIONS.map((option) => <option key={option} value={option}>{option}</option>)}
        </select>
        {errors.focus && <span id="enquiry-focus-error" role="alert" className={errorText}>{errors.focus}</span>}
      </label>
      <label className="block sm:col-span-2">
        <span className={labelText}>What would you like to validate?</span>
        <textarea
          name="context" rows={3} maxLength={1500} className={control}
          placeholder="Mandates, approximate pool size, current systems, and the biggest bottleneck..."
          value={fields.context} onChange={update} ref={register('context')}
        />
        <span className="mt-2 block text-xs leading-5 text-bone-200/55">Optional. Please do not paste candidate CVs, contact details or other personal data into this field.</span>
      </label>
      <div className="sm:col-span-2">
        <button type="submit" className="btn-primary min-h-11">Prepare enquiry in your email app <span aria-hidden="true">↗</span></button>
        <p className="mt-3 max-w-xl text-xs leading-5 text-bone-200/60">{ENQUIRY_HANDOFF_NOTE} {ENQUIRY_TRANSMISSION_NOTE}</p>

        <div ref={statusRef} tabIndex={-1} className="focus:outline-none">
          {status.kind === 'invalid' && (
            <p role="alert" className="mt-4 rounded-lg border border-alarm-400/40 bg-alarm-400/10 p-4 text-sm leading-6 text-bone-50">
              Nothing was prepared: {status.missing === 1 ? 'one field needs' : `${status.missing} fields need`} attention. The highlighted fields are marked above — no email draft was opened and no data left this page.
            </p>
          )}

          {prepared && (
            <div role="status" className="mt-4 rounded-lg border border-signal-400/25 bg-signal-400/10 p-4 text-sm leading-6 text-bone-50">
              {status.kind === 'blocked'
                ? 'Your browser blocked the email handoff, so no draft was opened.'
                : 'An email draft was requested from your device. Linkbot’s website has not received or stored anything, and no enquiry has been submitted.'}
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <a href={status.mailtoUrl} className="min-h-11 inline-flex items-center font-medium text-signal-400 underline underline-offset-4">Open the draft again</a>
                <button
                  type="button" onClick={() => copyDraft(status.body)}
                  className="min-h-11 inline-flex items-center rounded-md border border-bone-50/30 px-3 py-2 text-xs font-medium text-bone-50 hover:border-signal-400"
                >
                  Copy the message text
                </button>
              </div>
              {copyState === 'copied' && <p role="status" className="mt-3 text-xs text-signal-400">Message text copied. Paste it into an email to {ENQUIRY_RECIPIENT} if your mail app did not open.</p>}
              {copyState === 'failed' && <p role="alert" className="mt-3 text-xs text-amber-100">Copying was blocked by your browser. The message text below is selected — copy it manually.</p>}
              <p className="mt-3 text-xs leading-5 text-bone-200/70">
                No email application? Send the same details to <a href={directEnquiryUrl()} className="underline">{ENQUIRY_RECIPIENT}</a> yourself.
              </p>
              <details className="mt-3 text-xs text-bone-200/75">
                <summary className="min-h-11 inline-flex cursor-pointer items-center underline underline-offset-4">Review the exact message text</summary>
                <textarea
                  ref={draftTextRef} readOnly rows={9} value={status.body}
                  aria-label="Prepared enquiry message text"
                  className="mt-3 block w-full rounded-lg border border-bone-50/20 bg-ink-950 px-3 py-3 font-mono text-xs leading-5 text-bone-200"
                />
                <p className="mt-2 text-xs text-bone-200/55">This is the entire draft. Nothing else is included and nothing is sent until you send it.</p>
              </details>
            </div>
          )}
        </div>
      </div>
    </form>
  );
}
