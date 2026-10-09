# Experiment Backlog (with decision gates)

Cheap experiments first; each has a hypothesis, a method, a success gate, a stop rule, and a decision it informs. Nothing here is running until the owner starts it; several depend on product/site changes owned elsewhere (flagged). Revisit weekly; close aggressively.

Priority order = the sequence in this file. E-IDs are stable references.

---

**E1 — Outreach angle A/B (subject + opening)** · Channel: C7 · Stage: W2–W5
- H: A specific, low-ego subject ("Ein Mandat, ein Test…") outperforms a benefit-first subject (≥15 % vs unknown reply rate `[Hypothesis]`).
- Method: alternate angles across batches 1–2 (5 each); same body. Log replies.
- Gate: any angle <5 % reply after 10 sends → retire it; winner continues.
- Decision: finalize E1 message set for W6+ scaling.
- Note: keep both angles legally reviewed as one set.

**E2 — LinkedIn hook formats on the same idea** · C1 · W2–W6
- H: The "we lost to keyword search" hook outperforms "private-first" abstract hooks for agency engagement (replies/DMs per post) `[Hypothesis]`.
- Method: 6 posts, 2 hook types × 3 topics; count profile visits + conversations (not likes).
- Gate: after 3 posts per type, kill the weaker type.
- Decision: hook library for months 2–3.

**E3 — Pilot pricing frames in discovery calls** · C7/D1 · W4–W6
- H: At least one of {30-day pilot @ €149-class, one-mandate sprint @ €390-class} is acceptable to ≥30 % of qualified agencies; the two frames produce materially different objections `[Hypothesis]`.
- Method: script probes in every call ("If the first mandate ran as a fixed one-off, what feels fair for a scoped test? What would make the higher number justified?"); record verbatim reactions; do not quote either as price.
- Gate: after 10 qualified calls: choose one frame; if both rejected → position as free foundational pilots with case-study value only until more value is proven.
- Decision: D1 final price + offer copy.

**E4 — Blog article performance by cluster** · C3 · W3–W8
- H: The benchmark article (a2, DE) drives more qualified agency conversations than the supply field report (a3, EN) drives qualified Talent sessions — i.e., different clusters need different distribution, and we can tell which is working by "qualified" actions `[Hypothesis]`.
- Method: UTM'd CTAs per block; weekly qualified session + conversation attribution.
- Gate: if a cluster produces zero qualified actions across 3 articles → pause that cluster and re-allocate to the other.
- Decision: months 2–3 editorial queue.

**E5 — Guest-first vs private-access CTA on the Talent page** · D3 (site interface) · after W3 copy decision
- H: "Start a search (guest)" converts to a *search started* at ≥2× the rate of "Request private access" converting to an email `[Hypothesis]`.
- Method: after the /talent surface exists, one-funnel sequential comparison (2 weeks each, not simultaneous A/B without analytics infra); count starts, not pageviews.
- Gate: if guest CTA underperforms on *starts per session*, revert to the newsletter-access hybrid.
- Decision: homepage/talent CTA (owner + Agents C/D).
- Blocked until: route + copy approved.

**E6 — Reddit participation depth** · C6 · W2–W8
- H: Comment-only participation in r/recruiting yields more useful qualitative insight (and zero mod friction) than any post-based approach would in the same period `[Hypothesis]`.
- Method: log insights/thread types; track mod actions (target: zero).
- Gate: any warning/removal → stop that sub and reassess; if 6 weeks yield no insights, reduce cadence to listening only.
- Decision: whether Reddit earns a continued weekly slot.

**E7 — Newsletter reply-as-metric** · C4 · W4–W8
- H: At <200 subscribers, reply rate (not opens) is the actionable signal; a question-driven issue doubles replies vs an announcement-style issue `[Hypothesis]`.
- Method: N1 vs N2 formats; count substantive replies.
- Gate: if 3 issues produce <5 total replies → fold newsletter into blog distribution (no separate send) until list ≥200.
- Decision: newsletter cadence for Q1.

**E8 — Agency referral loop** · C8 · W5+ (needs a delivered pilot)
- H: ≥1 of the first 2 delivered pilots leads to a peer-agency introduction when asked once, at the right moment `[Hypothesis — deliberately conservative]`.
- Method: ask once post-retro; count intros (not asks).
- Gate: 0 intros from 4 asks → drop the loop (H5 falsified).
- Decision: whether referrals get a formal slot in months 2–3.

**E9 — PH launch viability for a privacy-first European product** · C5 · W7+ (gate-dependent)
- H: If/when PH gates go green, PH traffic converts to first-value sessions at ≥ the newsletter's rate `[Hypothesis]`.
- Method: gate first (never launch to test the gate); then PH-attributed funnel.
- Gate: gate red = experiment doesn't run; record as "not tested, deliberately".
- Decision: launch or permanent skip for this product stage.

**E10 — One-mandate test as the *sales demo*** · C7 · W4+
- H: Running a live, anonymized mandate in the call (vs. showing the synthetic demo) increases call→pilot agreement `[Hypothesis]`.
- Method: run as the default once 2 calls confirm feasibility; compare agreement rates before/after (small n acknowledged).
- Gate: if live-run adds >30 min prep per call with no agreement lift → revert to demo-first.
- Decision: standard call format.

**E11 — DE vs EN landing copy for agencies** · copy files + Agent D interface · after PR#1 merge
- H: The DE-first agency copy yields higher demo-CTA click-through for DACH visitors than the existing EN-leaning page `[Hypothesis]`.
- Method: agree variant with Agent D's conversion work; sequential test post-merge; measure CTA clicks per session.
- Gate: no measurable difference after 2 weeks × sufficient traffic → keep the simpler page (fewer words wins ties).
- Decision: merged page copy.

**E12 — "First 5 letters" personalization depth** · C7 · W1–W3
- H: Letters containing one specific, verifiable observation about the agency get ≥2× the reply rate of letters with generic niche references `[Hypothesis]`.
- Method: batches 1 (high specificity, n=5) vs a control batch (n=5) if list allows; else compare to historical replies from the founder's network (imperfect — note it).
- Gate: if specificity shows no lift, the problem isn't personalization — it's the offer; escalate to D5/ICP review.
- Decision: whether outreach scales at all.

---

## Backlog hygiene

- Max 3 experiments active at once; W1–W2 allowed to run E12/E2/E6 only (capacity).
- Every experiment closure writes one line: result, decision, date. Experiments that can't name their decision get deleted, not run.
- Dependencies flagged (site/product changes) are the owner's call; nothing here authorizes changes to site runtime or product code.
