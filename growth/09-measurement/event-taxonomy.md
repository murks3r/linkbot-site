# Privacy-Safe Event Taxonomy (instrumentation plan)

Status: **PLAN — nothing installed.** The product currently has no analytics; adding any tracking is a product decision requiring owner + privacy review (D4). Until then, the "events" below are measured manually (weekly counts, session notes, pipeline sheet). This taxonomy defines the *target state* and its privacy guardrails so the eventual implementation starts right.

## Principles (non-negotiable)

1. **No personal data in events.** No emails, names, tokens, raw free-text, candidate/profile content, job titles-as-intent, or anything user-identifying. Events describe *interactions*, not people.
2. **Aggregate-first analytics.** Cookieless counting (no cross-site identifiers); page-level counts are enough for the funnel's purpose.
3. **Site vs product boundary.** Marketing-site analytics (page views, referrers) is a different legal basis than product events (session state). If product events must be recorded for measurement, prefer server-side aggregate counters over client tracking; review with privacy first.
4. **Consent/lawful basis review before install.** EU-first: document basis (likely legitimate interest with strict minimization for aggregate ops metrics; consent where anything persists on device). `[Owner + privacy review]`
5. **Retention:** raw counters ≤ 12 months; no per-user timelines beyond what the product itself already stores for the user's benefit.

## Funnel events (Talent)

| Event | Meaning | Properties (minimal) | Notes |
|---|---|---|---|
| `landing_view` | A session reached the site | `page`, `utm_source`(if present), `utm_medium` | Count once per session |
| `cta_click` | A specific CTA clicked | `cta_id` (`try-search`, `pilot-call`, `article-cta`), `page` | |
| `guest_search_started` | Search flow entered (no account) | — | The real top-of-funnel |
| `guest_scope_confirmed` | Truthful constraints confirmed | — | Proxies "real intent", not demo-clicking |
| `guest_value_reached` (GV) | Explained guest result understood as candidate | — | Manual definition from protocol until instrumented; see dashboard tables |
| `account_created` | Optional save initiated | `method=oidc` | Never a gate for value |
| `intent_saved` | Private state persisted | — | |
| `return_session` | Signed-in return to saved state | `day_bucket` (`1-7`,`8-28`,`29+`) | Cohorted by first-save week — **never** a per-user timeline |
| `action_taken` | Meaningful action | `type` (`source_open`,`interest`,`decline`,`native_preview`) | No item/job identifiers beyond necessity |
| `share_action` | A deliberate sharing step | `type` (`own_result_share`,`invite`) | Consent events are product-recorded already; analytics mirror only counts |

## Pipeline events (Agency — mostly manual)

Reddit/LinkedIn/email/PH cannot be instrumented personlessly on their platforms; these live in the **pipeline sheet** (`dashboards.md`), not in analytics:

`outreach_sent`, `reply_received`, `call_booked`, `call_done`, `pilot_agreed`, `pilot_started`, `shortlist_delivered`, `pilot_retro`, `second_mandate`, `case_approved`, `referral_intro`.

PH-specific (manual): `ph_visits`, `ph_comments`, `ph_feedback_themes`.

## Explicitly excluded (even if technically possible)

- Per-user behavioral timelines (beyond the product's own user-facing state).
- Cross-site tracking, pixels, fingerprinting, session replay.
- Scroll depth, keystroke, device-fingerprint fields.
- Any join between analytics and user identity; any join between agency pipeline data and candidate data (cross-tenant isolation is an invariant, not a setting).
- Heatmaps on pages with personal inputs.

## Interim manual procedure (starts now)

1. Weekly: read the site's server-side logs if the owner confirms what they contain `[Unknown — verify]`; otherwise count only what conversations and dashboards give us.
2. Every published link lives in the UTM registry; a weekly `=COUNTIF` vs pipeline sheet is enough at this scale.
3. First-value counting: until instrumentation exists, tally from voluntary user statements in pilots/community + any product-side aggregate the owner approves. **No guessing**. If the count is unknown, the dashboard says `n/a`.
