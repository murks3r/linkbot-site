import { useState } from 'react';
import type { FormEvent } from 'react';

const recipient = 'hello@linkbot.org';

export default function AgencyPilotForm() {
  const [draftUrl, setDraftUrl] = useState<string | null>(null);

  function prepareDraft(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get('name') ?? '').trim();
    const agency = String(form.get('agency') ?? '').trim();
    const email = String(form.get('email') ?? '').trim();
    const focus = String(form.get('focus') ?? '').trim();
    const context = String(form.get('context') ?? '').trim();
    if (!name || !agency || !email || !focus) return;

    const subject = 'Linkbot — agency pilot enquiry';
    const body = [
      'Agency pilot enquiry',
      '',
      `Name: ${name}`,
      `Agency: ${agency}`,
      `Reply email: ${email}`,
      `Hiring focus: ${focus}`,
      '',
      'Pilot context:',
      context || '(not supplied)',
      '',
      'Please get in touch about the Linkbot agency pilot.',
    ].join('\n');
    const mailtoUrl = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setDraftUrl(mailtoUrl);
    // mailto is a handoff to the visitor's email application, not a site submission.
    window.location.href = mailtoUrl;
  }

  const control = 'mt-2 block w-full rounded-lg border border-bone-50/20 bg-ink-900 px-4 py-3 text-sm text-bone-50 placeholder:text-bone-200/35 focus:border-signal-400 focus:outline-none';

  return (
    <form onSubmit={prepareDraft} className="grid gap-5 sm:grid-cols-2" aria-label="Agency pilot email enquiry">
      <label className="block">
        <span className="text-xs font-medium uppercase tracking-[0.14em] text-bone-200/75">Your name *</span>
        <input required name="name" autoComplete="name" maxLength={120} className={control} placeholder="Jane Doe" />
      </label>
      <label className="block">
        <span className="text-xs font-medium uppercase tracking-[0.14em] text-bone-200/75">Agency *</span>
        <input required name="agency" autoComplete="organization" maxLength={160} className={control} placeholder="Your recruiting firm" />
      </label>
      <label className="block">
        <span className="text-xs font-medium uppercase tracking-[0.14em] text-bone-200/75">Work email *</span>
        <input required type="email" name="email" autoComplete="email" maxLength={180} className={control} placeholder="you@agency.com" />
      </label>
      <label className="block">
        <span className="text-xs font-medium uppercase tracking-[0.14em] text-bone-200/75">Hiring focus *</span>
        <select required name="focus" defaultValue="" className={control}>
          <option value="" disabled>Choose a focus</option>
          <option value="Engineering and infrastructure">Engineering & infrastructure</option>
          <option value="Data and AI">Data & AI</option>
          <option value="Product and design">Product & design</option>
          <option value="Other specialist roles">Other specialist roles</option>
        </select>
      </label>
      <label className="block sm:col-span-2">
        <span className="text-xs font-medium uppercase tracking-[0.14em] text-bone-200/75">What would you like to validate?</span>
        <textarea name="context" rows={3} maxLength={1500} className={control} placeholder="Mandates, approximate pool size, current systems, and the biggest bottleneck..." />
      </label>
      <div className="sm:col-span-2">
        <button type="submit" className="btn-primary">Prepare pilot enquiry <span aria-hidden="true">↗</span></button>
        <p className="mt-3 max-w-xl text-xs leading-5 text-bone-200/60">
          This opens a prepared email in your email app. Review and send it there; this website does not collect or submit the form to a server.
        </p>
        {draftUrl && (
          <div role="status" className="mt-4 rounded-lg border border-signal-400/25 bg-signal-400/10 p-4 text-sm leading-6 text-bone-50">
            An email draft was requested. Nothing has been sent by Linkbot's website.
            <a href={draftUrl} className="ml-2 font-medium text-signal-400 underline underline-offset-4">Open the draft again</a>
            <span className="mt-2 block text-xs text-bone-200/70">If your device has no email app configured, contact <a href={`mailto:${recipient}`} className="underline">{recipient}</a> directly.</span>
          </div>
        )}
      </div>
    </form>
  );
}
