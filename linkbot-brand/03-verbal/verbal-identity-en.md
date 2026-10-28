# Verbal identity — English

Status: **PROPOSED.** Speaker: Linkbot as the platform, speaking *to* a person. Never
first-person plural for a claim the product cannot make.

---

## 1. Voice

| Trait | Do | Don't |
| --- | --- | --- |
| **Exact** | "Eligible for a senior role, willing to relocate, available in 90 days" | "top candidates", "great fit" |
| **Calm** | Short declaratives. One idea per sentence. | Exclamation marks, "finally", "revolutionary" |
| **Adult** | Assume the reader understands consent and hiring | Explain what a CV is |
| **Candid about limits** | "Unknown until you confirm it." | Silence where there is uncertainty |
| **Non-coercive** | "We open the door in small groups, by invitation." | Countdowns, "3 spots left", urgency |
| **Specific over emphatic** | "Revoking stops future access." | "Full control over your data." |

**One rule above all:** *say what the product does, and name what it does not.* The audit
found three live claims that overreach (audit §4). The verbal system exists to stop that
class of error, not just to sound consistent.

## 2. Sentence rhythm

- Headline: ≤ 9 words. If it needs a comma, it is probably two headlines.
- Sub: ≤ 30 words, one clause of mechanism.
- Body: 2–3 sentences, then a list of what is inspectable.
- Lists: 2–4 items. Each item is a fact, not a benefit adjective.

## 3. The position lines

| Use | Line |
| --- | --- |
| Master | Your career history is yours. Its disclosure is your decision. |
| Problem | A public profile is not a page. It is a continuously readable dataset. |
| Position | From public exposure to private eligibility. |
| Mechanism | You hold the record. An employer asks for one bounded signal. You decide. |
| Proof | Who asked, what they asked for, which policy version, and whether it was automatic. |
| Limit (kept deliberately) | Unknown stays unknown until you confirm it. |

The problem line is a revision of the incumbent "public attack surface" metaphor. The metaphor
is effective in English and it is retained for the master problem statement, **but it must not
be translated literally into German** — see `verbal-identity-de.md` §2.

## 4. Audience openings

**Talent**
> Your record is yours. When someone asks to see part of it, you see who is asking, what they
> asked for, and how long it lasts. You answer yes, no, or not now.

**Employer / HR**
> You describe the signal you need. The person decides whether to release it. You cannot browse
> a pool and you cannot contact anyone who has not answered.

**Agency**
> Run Linkbot beside the ATS and CRM you already use. Take one mandate. Work it with
> introductions that carry their own evidence.

## 5. Microcopy standards

| Context | Standard | Example |
| --- | --- | --- |
| Primary action | Verb + object. No "Submit", no "Get started". | "Request one signal" |
| Secondary | What it reveals, not what it does | "See the request" |
| Refusal | Plain, no guilt | "Not now" |
| Field label | The noun the person recognises | "Signal requested" |
| Helper text under a consequential control | The consequence, not the reassurance | "Revoking stops future access. It does not recall copies already delivered." |
| Empty state | Name the state, then the next action | "No direction set yet. Set one to see opportunities." |
| Unknown state | The word "Unknown", never a blank | "Work authorisation: unknown — needs verification" |
| Error | What happened, what to do | "We could not reach the server. Nothing was saved. Try again." |
| Success | What is now true, and what is not | "Shared. The employer can read these fields until 12 Oct. This is not an application." |
| Receipt | Recipient, fields, purpose, policy version, time, revocability | see the specimen receipt component |

## 6. Banned words and constructions

- **Never:** leverage, seamless, effortless, revolutionary, supercharge, unlock, empower,
  game-changing, cutting-edge, world-class, best-in-class, robust, scalable (as a boast),
  trusted by, leading.
- **Never for a one-sided result:** match, matching (as a noun for a result).
- **Never for a revocation:** deleted, erased, recalled, wiped.
- **Never about the person:** "assets", "talent pool", "headcount", "resources".
- **Never a manufactured number:** percentages, counts and totals that are not recorded
  somewhere Linkbot can point to.

## 7. Capitalisation and formatting

- Sentence case for headings and buttons. The wordmark is a separate, locked asset.
- Serial commas: no.
- Numbers: figures for 10 and above, words below, except in tables and receipts, which are
  always tabular figures.
- Time: ISO 8601 in product surfaces, "12 Oct 2026" in marketing copy.
- Product states always lowercase in a sentence ("confirmed", "proposed", "unknown",
  "denied") and never used as a synonym for another state.

## 8. Trust and evidence language

The brand earns trust by showing artefacts, not by asserting trustworthiness. Preferred
constructions:

- "The disclosed fields were: seniority, employment country, availability." (a list, not a claim)
- "Policy version 3, condition: native employer job." (a reference, not a promise)
- "This is not an application." (an explicit boundary)
- "We do not aggregate" is only used where the product route genuinely does not exist.

Avoid: "Your data is safe", "we take privacy seriously", "bank-level security", "fully
compliant" — all unfalsifiable, and the last one is a compliance claim no one in this
repository is authorised to make.
