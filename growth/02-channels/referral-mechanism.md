# Safe Referral Mechanism

Two referral loops: Agency→Agency (primary, revenue-relevant) and Talent→Talent (later, opt-in only). Both obey one rule: **the person whose data it is makes every disclosure decision, explicitly, in writing where the law or the platform requires it.**

## 1. Agency → Agency referral (primary)

**When to ask:** only after a delivered pilot with a positive outcome that the agency itself rates as positive — never during sales.

**Mechanic (manual, no automation):**
1. After the pilot retro, founder asks once: *"If this was useful, is there another agency you respect who fights the same shortlist-evidence problem? An introduction from you is worth more than any cold message from me."* `[Hypothesis: intro willingness after a positive pilot]`
2. If they agree, the **pilot agency sends the intro themselves** (template below). Linkbot never receives their contact lists, never names the relationship publicly, never touches their data to find "similar" agencies.
3. Track only: intro received (yes/no), source agency (with permission to record internally), intro → call conversion.

**Intro template (agency sends; provided as a courtesy draft):**

> Betreff: Kurzer Kontakt — Linkbot Evidence-Test für Mandate
>
> Hi [Name], ich habe letzte Woche ein Mandat mit Linkbot als Evidenz-Layer getestet — [ein Satz, was für dich/uns funktioniert hat, z. B. „die Shortlist kam mit nachvollziehbarer Begründung statt nur Treffer"]. Der Gründer [Octavio] sucht 2–3 weitere Agenturen für kleine, klar begrenzte Piloten. Ich dachte an dich wegen [echter, konkreter Bezug]. Soll ich euch vorstellen? Kein Vertrieb, nur eine kurze Vorstellung — du entscheidest dann selbst.

**What we never do:** ask for ("give me 5 names") lists, mine consenting agencies' networks programmatically, use pilot data to infer "similar" agencies, or present the referral as an endorsement we wrote.

## 2. Talent → Talent referral (later; opt-in only)

**Design (starts only after D7 return evidence exists; confirm D6):**

- **Share your own result (functional):** the Talent can share *their own* search result page or a snapshot *they choose* — nothing shares automatically, nothing is public by default. Reader-side = a generic link (e.g., a search-start link), never the sharer's intent or data.
- **Invite a friend (double consent):** the Talent enters the friend's email only in a flow where **the friend receives an invitation they must accept before anything about the sender is attached** — no sender name revealed until the friend acts, no "X asked you" pressure pattern. `[Hypothesis: legality/wording needs privacy review before build; not yet built]`
- **No rewards** in the first 8 weeks (D6): no credits, no cash, no unlocks. Reward-driven referral in a privacy product is a contradiction (it pressures disclosure) and invites abuse.
- **Never:** contact imports, address-book access, auto-invites, refer-a-friend retargeting, or any listing of "people you might know".

**Consent artifact (per referral, if built):** timestamp, referrer ID (internal), invitee email hash only until acceptance, what was shared before/after acceptance, withdrawal path. Retention flagged for privacy review. `[Owner + privacy review required — nothing here authorizes implementation]`

## 3. Case-study permission flow (the third "referral" surface)

Reuse is a disclosure. Flow before any case asset ships:
1. Draft (anonymized by default).
2. Agency reviews; checks boxes: `use anonymized only` / `may name agency` / `may quote a person (named role only)` / `may share metrics (listed)`. The list of metrics is explicit — never "and other details".
3. Written approval (email is fine) archived with the case folder.
4. If any candidate-level detail ever appears: **no** — candidates are never identifiable in marketing, consented or not; aggregate/paraphrase only.

## 4. Measurement (consent-safe)

| Event | Definition | Where tracked |
|---|---|---|
| `agency_referral_ask` | Asked after positive retro | Pipeline sheet (manual) |
| `agency_referral_intro` | Intro email received | Pipeline sheet |
| `agency_referral_call` | Intro → discovery call | Pipeline sheet |
| `talent_referral_invite_sent` | Invite accepted by friend (double opt-in complete) | Only after design approved; never counts "sent but unaccepted" as referral |
| `case_study_approved` | Approval artifact archived | Case folder |

No referral loop is a channel in the 8-week plan's targets — it is a bonus with explicit stop conditions (no intros after 2 asks → drop; abuse in Talent loop → drop).
