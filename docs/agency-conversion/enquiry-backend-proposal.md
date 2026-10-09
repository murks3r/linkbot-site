# Proposed enquiry pipeline — design only

**Status: not implemented. Not authorised by the current task.**

The existing `/for-agencies` enquiry is a `mailto:` handoff: the visitor's mail
client is the transport and Linkbot's website receives nothing. This document
describes what a real enquiry pipeline would have to look like *before* anyone
builds it, so the decision can be reviewed on its own terms.

Nothing in this document exists in the codebase. There is no endpoint, no
storage, no handler and no feature flag.

## Why it is worth considering

A `mailto:` handoff cannot:

- confirm delivery, or notice that the visitor never sent the draft;
- de-duplicate or rate-limit submissions;
- count enquiry starts, so conversion cannot be measured honestly;
- enforce a data-minimisation contract in code.

## Non-negotiables for any implementation

1. **Data minimisation by construction.** Accept only: name, agency,
   work email, hiring focus, free-text context (length-bounded). No CVs, no
   candidate records, no attachments, no phone numbers. The form already tells
   visitors not to paste personal data; a real endpoint must *enforce* that
   (server-side schema, reject unknown fields).
2. **Purpose limitation.** The enquiry may be used to reply about a pilot and
   nothing else: no marketing list, no CRM enrichment, no analytics profiling.
   This must be stated on the form before submission, not only in a policy page.
3. **Lawful basis and residency.** Written determination of the lawful basis for
   processing a business-contact enquiry, plus a chosen storage region. The
   repository suggests an Estonian entity; that decision belongs to whoever owns
   the privacy review, not to this task.
4. **Retention and erasure.** A stated retention window, automatic deletion at
   the end of it, and a working erasure path addressable by email.
5. **No silent third-party fan-out.** No email-marketing vendor, no CRM webhook,
   no ad-platform conversion pixel attached to the submission, unless each is
   named on the form.
6. **Graceful degradation.** If the endpoint is unavailable, the page must fall
   back to the existing `mailto:` draft — never to a false success state.
7. **Abuse resistance.** Because the endpoint would be public: honeypot plus
   rate limiting at the edge, and no CAPTCHA until abuse is actually observed.

## Sketch (for review discussion, not a specification)

```
POST /api/agency-enquiry            (stateless, no cookies, no client IDs)
  body: { name, agency, email, focus, context }   // strict schema, bounded
  200  -> { received: true, reference: <opaque-id> }
  400  -> field errors (mirrors src/components/agency/enquiry.ts rules)
  429  -> rate limited
  5xx  -> UI falls back to the mailto draft, states plainly that nothing was sent
```

- Server-side: reuse the validation rules already unit-tested in
  `src/components/agency/enquiry.ts` so client and server cannot drift.
- Storage: a single table or a hosted form service that satisfies points 1–5.
- Notifications: an internal email to the mailbox already published on the site.
- The client must show a *received* state only after a 2xx response, and that
  state must include what will happen next, retaining the "no automated
  follow-up sequence" promise.

## What would unblock this

1. Privacy review signed off on points 1–4, with a named data controller contact.
2. A decision on where the data lives and who owns the retention schedule.
3. An owner for the mailbox and its first-response target (see BL-3).
4. Then: build the endpoint, extend the browser test to assert a real submission
   path, and keep the `mailto:` fallback for failure cases.

Until (1)–(3) exist, the honest state of the page is what it is today: a draft
composer in the visitor's own mail client, explicitly labelled as such.
