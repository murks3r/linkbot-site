# Agency acquisition experience

Route: `/for-agencies` · repository: `murks3r/linkbot-site` · branch: `velocity/agency-acquisition`

## Scope

The page positions Linkbot as an evidence and permission layer **alongside** an agency's existing ATS, CRM and candidate relationships. It includes a mandate-to-introduction narrative, a synthetic browser walkthrough and a proposed one-mandate pilot.

The demonstration is a local React island with three prewritten fictional recruiting mandates and candidate records. No candidate names, contact details, ATS credentials, backend requests, analytics or matching API are involved.

Demo journey:
1. Choose an example mandate.
2. See its structured constraints and preferences.
3. Inspect deterministic ranking and evidence for each fictional candidate.
4. See required criteria marked `met`, `unknown` or `unmet`.
5. Build a shortlist. A hard `unmet` requirement blocks the action; an `unknown` requirement is shortlisted **for verification**, never shown as verified.
6. Preview a candidate's interest response; only the `interested` choice exposes a separate permission simulation.
7. Simulate acceptance or refusal of disclosure. All states are session-only; there is no real interest, contact or consent capture.

Changing mandates resets selections, interest and consent. Candidate ordering is derived transparently from hard failures, unresolved requirements and preferred evidence; it is **not a predictive hiring score**.

## Pilot enquiry

The existing website address, `hello@linkbot.org`, is reused through an explicit `mailto:` handoff. The React form validates required fields, composes a user-editable email draft, and clearly states that the visitor must send it in their own mail app. It never displays a server-submitted success message. A plain mailto link is available without JavaScript.

No endpoint or storage is introduced.

## Validation

The project continues to use Astro 5, React 18 islands, Tailwind 3 and static Vercel output. No new production dependencies.

```bash
npm install
npm run typecheck
node --experimental-strip-types --test tests/agency-demo.test.mjs
npm run build
```

The feature-branch GitHub workflow also installs Playwright for CI **only** and executes a Chromium smoke test against `npm run preview`. It covers:
- Page title and primary render
- Hard-requirement exclusion
- Unverified evidence
- Shortlisting and interest/consent simulation
- Reset on mandate switch
- The email draft handoff (no false submission)
- Narrow mobile viewport and basic horizontal overflow

To run that browser script manually after installing Playwright:
```bash
npm run preview -- --host 127.0.0.1 --port 4321
node tests/agency-journey.playwright.mjs
```

## Boundaries and limitations

- This is an acquisition site and demo, **not** an ATS adapter, candidate pool import, production matching engine, secure consent store or messaging service.
- All roles, evidence and profiles are illustrative. The results are not validated model performance.
- The pilot scope is proposed; timing, terms, authorized data sources and safeguards require agreement.
- A configured desktop/mobile email app is needed to complete the email handoff.
- The existing base repository's `package-lock.json` is a placeholder rather than a valid npm lockfile. Vercel's `npm install` recovers, but flags a parse warning. This branch intentionally does not regenerate the unrelated dependency lock.
- The existing landing homepage and deployment configuration are unchanged.
