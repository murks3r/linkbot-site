/**
 * Pilot-enquiry draft builder for the agency page.
 *
 * This module is deliberately free of React and of any network behaviour: it only
 * composes an email draft that the visitor sends from their own mail application.
 * There is no endpoint, no fetch, no storage and no submission state to report.
 */

export const ENQUIRY_RECIPIENT = 'hello@linkbot.org';

export const ENQUIRY_SUBJECT = 'Linkbot — agency pilot enquiry';

export const ENQUIRY_HANDOFF_NOTE =
  'Nothing is sent by this page. Your email application takes over and you decide whether to send the draft.';

export const ENQUIRY_TRANSMISSION_NOTE =
  'No data from this form is transmitted to or stored by Linkbot’s website. The only outbound step is your own email.';

export const ENQUIRY_FOCUS_OPTIONS = [
  'Engineering and infrastructure',
  'Data and AI',
  'Product and design',
  'Other specialist roles',
] as const;

export interface EnquiryFields {
  name: string;
  agency: string;
  email: string;
  focus: string;
  context: string;
}

export type EnquiryFieldErrors = Partial<Record<keyof EnquiryFields, string>>;

export interface EnquiryDraft {
  ok: boolean;
  recipient: string;
  subject: string;
  body: string;
  mailtoUrl: string;
  fieldErrors: EnquiryFieldErrors;
}

const LIMITS: Record<keyof EnquiryFields, number> = {
  name: 120,
  agency: 160,
  email: 180,
  focus: 60,
  context: 1500,
};

/** Conservative single-address check; the real authority is the visitor's mail client. */
const EMAIL_PATTERN = /^[^\s@,;]+@[^\s@,;]+\.[^\s@,;]+$/;

export function emptyEnquiryFields(): EnquiryFields {
  return { name: '', agency: '', email: '', focus: '', context: '' };
}

function clean(value: unknown, limit: number): string {
  return String(value ?? '').trim().slice(0, limit);
}

/**
 * Validates without inventing a backend. Blank values are rejected rather than
 * silently ignored, so the visitor always sees why nothing happened.
 */
export function validateEnquiry(fields: EnquiryFields): EnquiryFieldErrors {
  const errors: EnquiryFieldErrors = {};
  if (!clean(fields.name, LIMITS.name)) errors.name = 'Enter the name we should reply to.';
  if (!clean(fields.agency, LIMITS.agency)) errors.agency = 'Enter your recruiting firm.';
  const email = clean(fields.email, LIMITS.email);
  if (!email) errors.email = 'Enter a reply email address.';
  else if (!EMAIL_PATTERN.test(email)) errors.email = 'Enter a single valid email address.';
  if (!clean(fields.focus, LIMITS.focus)) errors.focus = 'Choose what your agency recruits for.';
  return errors;
}

export function buildEnquiryBody(fields: EnquiryFields): string {
  const name = clean(fields.name, LIMITS.name);
  const agency = clean(fields.agency, LIMITS.agency);
  const email = clean(fields.email, LIMITS.email);
  const focus = clean(fields.focus, LIMITS.focus);
  const context = clean(fields.context, LIMITS.context);
  return [
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
}

/**
 * Returns a `mailto:` handoff. `ok: false` means the visitor must fix the
 * highlighted fields; no mailto is produced and nothing is reported as sent.
 */
export function buildEnquiryDraft(fields: EnquiryFields, recipient: string = ENQUIRY_RECIPIENT): EnquiryDraft {
  const fieldErrors = validateEnquiry(fields);
  const subject = ENQUIRY_SUBJECT;
  const body = buildEnquiryBody(fields);
  const ok = Object.keys(fieldErrors).length === 0;
  const mailtoUrl = ok
    ? `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    : '';
  return { ok, recipient, subject, body, mailtoUrl, fieldErrors };
}

export function directEnquiryUrl(recipient: string = ENQUIRY_RECIPIENT): string {
  return `mailto:${recipient}?subject=${encodeURIComponent(ENQUIRY_SUBJECT)}`;
}
