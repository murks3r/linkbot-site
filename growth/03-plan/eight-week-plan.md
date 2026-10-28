# Eight-Week Execution Plan

Assumed start: the Monday after owner approval (drafted 2026-10-09; nominal W1 = 2026-10-12). All sends/publishing remain owner-gated — the plan schedules *owner actions*, not agent actions. Numbers are provisional targets `[Hypothesis]` until week 4 data recalibrates them.

## Weekly spine (every week)

- **Founder time budget: 7–9 h/week.** LinkedIn publishing 2–3 h · LinkedIn engagement 1.5 h (15 min/day) · outreach or pilot work 2–3 h · metrics/queue 1 h · overflow buffer 1 h.
- **Standing outputs:** ≥2 LinkedIn posts (1 DE agency/DACH, 1 EN talent/method), daily 15-min commenting, weekly pipeline numbers in the sheet, queue triage.
- **Standing gates:** publish gate (`03-plan/engagement-runbook.md`) for anything external; live Reddit rules re-check before any Reddit action; no asset leaves the folder without owner sign-off.

---

## W1 — Ground truth (nothing goes out)

**Outputs**
1. Reconcile missing inputs (D5): merge the 20-prospect research + 5 letters + packets into `08-outreach/agency-segmentation.md` tracker; note diffs.
2. Founder profile hygiene on LinkedIn (headline, about, featured link with UTM); PH profile created and aged (needed ≥1 week before posting `[Provider claim]`) — create now, use much later.
3. Review + fix drafts from this folder (owner pass): benchmark article (a2), supply field report (a3), LinkedIn weeks 1–2 batch.
4. Set up: pipeline sheet, UTM registry, weekly numbers sheet (manual until D4 is decided).
5. Blog prerequisites confirmed with Agent C (SEO component interface) — no edits to their files.

**Checks:** validate with `node growth/tools/validate-growth.mjs`; D4 analytics decision made.
**Gate G0 (end W1):** supply check — run one honest guest search in the launch segment; if results are unusable, acquisition content pauses until supply/segment issue is understood (a supply problem is not a content problem). `[Hypothesis: current public supply suffices for a demo-intent search; confirm]`

## W2 — First words (owner-sent, after approval)

**Outputs**
1. Publish flagship a2 (DE, benchmark honesty) — after review; it anchors all agency conversations. Distribute: LinkedIn post #4 (DE) + newsletter seed if list exists.
2. Agency outreach batch 1: **5 letters sent by owner** (after legal review per checklist), 2 LinkedIn connection notes (no pitch).
3. Reddit: first 2–3 *comment-only* contributions (no links) per `07-reddit/participation-plan.md` — after live rules re-check.
4. LinkedIn cadence week 1 posts live (posts 1–3 of `04-linkedin/posts-weeks-1-4.md`).

**Metrics:** replies (any), qualified conversations, qualified sessions by UTM, Reddit: any mod feedback (must be zero warnings).
**Stop rule:** first reply is hostile/negative about cold contact → pause batch 2, revisit message + list quality before continuing.

## W3 — Proof & second front

**Outputs**
1. Publish flagship a1 (EN, first-value explainer) + LinkedIn derivatives (EN posts).
2. Outreach batch 2 (next 5) + follow-up #2 on batch 1 (sequence step 2).
3. Book first discovery calls (goal: 2–3 on calendar by end of week).
4. Reddit 2–3 contributions; one contextual method answer referencing (without link) the benchmark lesson if a fitting thread exists.
5. `/talent` copy & route decision (D3) — coordinate with Agents C/D; do not edit their files.

**Gate G1 (end W3):** with ≥10 letters contacted: ≥2 conversations booked? If not, rewrite the opening angle (not the volume) and re-test with 5 more.

## W4 — Pricing decision + pilot scoping

**Outputs**
1. Run 3–5 discovery calls with the pricing probe (`10-validation/first-customer-validation.md`); record verbatim notes.
2. **Decision D1 executed: pick one price** (or a defined two-tier test); freeze offer wording.
3. Scope pilot #1 with the warmest agency: success criteria agreed **in writing** (their definition + ours), data boundary confirmed (their pool, their authority), dates fixed.
4. Content: refresh queue; one small "build-in-public" LinkedIn post about what the calls taught us (no client names).
5. Newsletter issue #1 if ≥25 contacts exist; else wait.

**Metrics:** calls completed (target 3–5), pilot agreements (0–1), reply rate trend.
**Stop rule:** 0 calls from 20 contacts AND no warm paths → escalate to D5 reconciliation (list quality) + ICP revision workshop before more outreach.

## W5 — Pilot #1 delivery (the week everything serves)

**Outputs**
1. Run pilot #1: mandate intake → shortlist walkthrough → recruiter review. Capture their honest reaction (what helped, what didn't, what stayed UNKNOWN).
2. Retro within 48 h; ask the referral question once (if positive) per `02-channels/referral-mechanism.md`.
3. Publish flagship a3 (EN, public supply field report) if W4 review passed; else hold.
4. LinkedIn: continue cadence; one pilot-adjacent lesson post **only if cleared of client-identifying detail**.
5. Reddit: maintain participation.

**Gate G2 (end W5):** pilot delivered with agreed criteria assessed honestly. If delivery revealed a fundamental blocker (can't get a real mandate, data boundary unresolvable), pause pilot #2 and write the friction report for the owner.

## W6 — Evidence & conversion ask

**Outputs**
1. Case-study draft from pilot #1 (permission flow started); numbers verified with the agency before any use.
2. Second-mandate / paid-continuation ask (wording per offer decided in D1; if pilot #1 was free, this is where price first appears in writing).
3. Outreach batch 3 (5 more) with the improved angle + "first pilots are live" (only if true and permitted to say; never name without permission).
4. Newsletter #1 or #2: "what we learned from the first pilot" (anonymized).

**Metrics:** second-mandate conversion (0/1), case approval (yes/no), calls booked (2–4).
**Stop rule:** second mandate refused with "not useful" → stop outreach scale-up; write the value-side retro; revisit offering (H4).

## W7 — Product Hunt gate + scale decisions

**Outputs**
1. Run the PH readiness gate formally (`06-product-hunt/launch-readiness-gate.md`); record red/green per item. Expectation: **red** (public access + EN first-run not ready) → keep cold; log what would flip each item.
2. Decide channel scaling for weeks 9–16: which of LinkedIn/blog/Reddit gets more volume; whether newsletter becomes biweekly again or stays monthly... (monthly; keep).
3. Begin planning pilot #2 (or run it if demand exists — cap 2 active).
4. Content: start next article per queue (topic chosen by best-performing cluster to date).

**Gate G3 (end W7):** by now the system has: ≥1 delivered pilot AND ≥1 published flagship (or documented reason not to publish). If neither: emergency review — something upstream (supply/list/claims) is blocking both engines; fix that one thing first.

## W8 — Review, reset, prepare the next 8

**Outputs**
1. Full metrics review against `09-measurement/dashboards.md`: Talent funnel (visits→guest-start→GV→save→return) and Agency pipeline (outreach→reply→call→pilot→second mandate). Recalibrate all provisional targets.
2. Experiment backlog triage: close/continue per `09-measurement/experiment-backlog.md` gates.
3. Update `01-strategy/decisions.md` (D1 resolved? D2 re-evaluated?) and `assumptions.md` (what became fact / what died).
4. Publish retros: internal honest retro + public-facing "build-in-public month one" post (if material clears review).
5. Plan the next 8 weeks (owner + agent): scale what converted; kill what didn't.

**Definition of done for the 8-week engine:** every channel in `channel-matrix.md` either (a) has measured conversion data, (b) has an explicit stop decision, or (c) is parked with a gate and a date. No zombie channels.

---

## Weekly output summary (at-a-glance)

| Week | Publish/External | Outreach/Pipeline | Content engine | Gate |
|---|---|---|---|---|
| W1 | none (setup) | list reconciled | drafts fixed; profile setup | G0 supply check |
| W2 | a2 (DE blog) + posts 1–3 | batch 1 (5) + 2 notes | Reddit starts (comments) | — |
| W3 | a1 (EN blog) + posts 4–6 | batch 2 (5) + follow-up 1 | Reddit 2–3 | G1: ≥2 calls booked |
| W4 | newsletter #1 (if ≥25) | 3–5 discovery calls; scoping | build-in-public post | **D1 pricing decided** |
| W5 | a3 (EN) if approved | pilot #1 delivered | Reddit; pilot lesson post | G2 pilot truthfulness check |
| W6 | case draft + newsletter #2 | second-mandate ask; batch 3 | derivatives | — |
| W7 | — | pilot #2 planning | next article starts | G3 PH gate (likely red) + system check |
| W8 | build-in-public retro | pipeline review | experiment triage | full review + recalibration |

**Founder budget per week: 7–9 h.** If a week runs hot (pilot week), drop LinkedIn to 2 posts and Reddit to zero — pilot truthfulness beats vanity cadence.
