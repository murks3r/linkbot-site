# QA evidence

All commands run on the branch head, on Node 26.5.0 / npm 11.17.0 (macOS),
against the built static output. CI re-runs the same commands on Node 22 via
`.github/workflows/agency-acquisition.yml` (unchanged by this branch).

## Commands and results

| Command | Result |
| --- | --- |
| `npm install --no-audit --no-fund` | 549 packages installed. `npm ci` is **not** possible on the repository baseline — see BL-5. |
| `npm run typecheck` (`astro check`) | 0 errors, 0 warnings, 0 hints across 18 files. |
| `node --experimental-strip-types --test tests/agency-demo.test.mjs` | 15 tests, 15 pass, 0 fail. |
| `npm run build` | 2 static pages built (`/` and `/for-agencies`); `/for-agencies/index.html` emitted with the island server-rendered. |
| `npm run preview` + `node tests/agency-journey.playwright.mjs` | PASS (Chromium, 1280×840 desktop then 375×812 mobile). |

## What the unit tests now prove (15 tests)

Fixture contract and honesty:

1. Four example mandates, each with required **and** preferred criteria, unique
   ids, and an assessment for every criterion of every profile.
2. The fixture set contains no email-like string, no URL and no phone-like
   string; identifiers are opaque pool codes (`P-014`, `S-002`, …); every profile
   reports `availability: 'Not confirmed'`.
3. An explicit per-mandate eligibility contract:
   `platform/design/data = 1 ready, 1 needs verification, 1 excluded`;
   `security = 0 ready, 0 needs verification, 2 excluded`.

Eligibility and ranking:

4. Ranking is deterministic, never places a hard failure above a qualifying
   profile, orders by hard failures → unresolved criteria → preferred evidence,
   and matches the review summary's leading profile.
5. A required criterion with no evidence is `Needs verification` and remains
   shortlistable — unknown never becomes verified.
6. A known failed hard requirement blocks shortlisting even when preferred
   evidence is complete.
7. A profile with *both* an unknown and an unmet required criterion is excluded,
   not routed to verification (unknown must not rescue a failure).
8. A thin pool yields zero eligible profiles and zero shortlistable profiles —
   the bar is not relaxed to produce a list.
9. Summarising an arbitrary subset agrees with per-candidate eligibility.
10. Ranking and summarising never mutate fixture order.

Enquiry draft (`src/components/agency/enquiry.ts`):

11. Blank, whitespace-only, malformed and multi-address emails are rejected with
    field-specific messages; the optional context field stays optional.
12. An invalid enquiry produces **no** `mailto:` URL at all.
13. A valid enquiry produces an editable `mailto:` draft whose subject and body
    round-trip through URL encoding, contains every supplied field, and contains
    no submission wording (`submitted`, `successfully sent`, `we have received`)
    and no URL.
14. Values are trimmed and bounded to the same limits as the form controls
    (name 120, email 180, context 1500).
15. The `<noscript>` fallback addresses the same mailbox as the React form.

## What the browser journey now proves

One run covers the whole page and asserts the following, in order:

- **Claims discipline.** A banned-phrase list — `Live demo`, `Better shortlists`,
  `AI-powered`, `time saved`, `hours saved`, `guaranteed`, `% faster`,
  `placement rate`, `success rate`, `best candidates` — is absent from the
  rendered page text, while `demonstration only` and `fictional|synthetic` are
  present.
- **CTA hierarchy.** The hero's `.btn-primary` targets `#pilot`, the hero's ghost
  button targets `#demo`, the navigation offers "Interactive example", and the
  pilot CTA appears at least three times (nav, hero, after the example).
- **Synthetic labelling.** The workspace badge reads "Interactive example ·
  synthetic data", the banner states that no data leaves the browser, and each
  profile is labelled `SYNTHETIC PROFILE`.
- **Keyboard.** Mandate selection is a radiogroup with exactly one `tabindex="0"`;
  `ArrowRight` moves selection *and* focus, `End`/`Home` jump to the last/first
  mandate. A keyboard-only loop then reaches a shortlist control with `Tab` and
  toggles it with `Enter`, with no mouse input anywhere in that step.
- **Fail-closed review.** The profile that fails a hard requirement has a
  disabled shortlist button, a visible reason naming the unmet requirement, and
  `aria-describedby` pointing at that reason element. The review panel reports
  `Required criteria met (1)`, `Needs verification first (1)`, `Not eligible (1)`
  with the reason text.
- **Live-region announcements.** Shortlisting updates a polite `role="status"`
  region ("P-031 added to the shortlist…").
- **Focus management.** Opening the candidate-side preview moves focus into the
  region; closing it returns focus to the trigger button.
- **Thin pool.** Switching to the thin mandate shows the "no profile meets every
  hard requirement" explanation, `Not eligible (2)`, `Required criteria met (0)`,
  both shortlist buttons disabled, and the interest-preview button disabled.
- **Reset.** "Reset demonstration" returns the mandate and clears the shortlist.
- **Enquiry honesty.** Submitting with a whitespace-only name produces a visible
  "Nothing was prepared…" alert, marks and focuses the field, shows the field
  message, and offers **no** draft link. A valid submission states that the draft
  was requested and that nothing was received or submitted, exposes a
  `mailto:hello@linkbot.org` handoff, and shows the exact draft text, which
  contains no submission wording.
- **No transmission.** Across the entire run every request is a `GET` to the
  preview origin or the font hosts, **except exactly one** `mailto:` handoff —
  proving the invalid submission produced no handoff and that nothing is posted
  anywhere. No uncaught page errors.
- **Mobile.** At 375×812 there is zero horizontal overflow, every button and link
  inside the workspace is at least 40px tall, the post-example primary CTA, the
  navigation pilot CTA and the submit button are at least 44px tall, and the
  workspace still switches mandates without overflow.

## Manual visual verification

Screenshots reviewed for: the hero and navigation, the five-step workflow and
"Who does what" block, the demo workspace with the recruiter-review stage, the
thin-pool state, the enquiry form's invalid and prepared states, and the mobile
layouts of the demo and the form. No clipping, overlap or horizontal scroll was
observed at 1280px or 375px.

## Not verified here

- No third-party accessibility audit (no axe-core run, no screen-reader
  walkthrough) — BL-8.
- No real mail-client handoff: the tests assert the `mailto:` URL and the honesty
  of the surrounding copy, not that a visitor's mail application opens. Testing
  that requires a configured desktop mail client and is environment-dependent.
- No usability sessions with agency recruiters — BL-4.
- No deployment verification from this branch: Vercel preview belongs to PR #1's
  branch, and no deployment was performed for this work.
