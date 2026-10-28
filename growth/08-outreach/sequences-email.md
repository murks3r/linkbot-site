# Agency Outreach — Email Sequences (draft-only)

Status: **DRAFT — none of these have been sent.** "All outreach letters are drafts; none sent" is the inherited state and stays true until the owner sends, after the checks below.

## Compliance box (read before sending — DE)

- **DACH cold email is legally sensitive.** German law (UWG §7) restricts advertising emails without prior consent; "presumed consent" arguments are narrow and fact-dependent. This document makes **no legal conclusions** — it provides conservative variants. Before any send: **owner obtains a qualified legal review for the specific message set and recipient categories.** `[Owner task]`
- Conservative defaults in these drafts: one-to-one, manually sent, concrete business relevance stated, no tracking pixels in email?, no bulk tooling, plain opt-out sentence, honest sender identification (Linkbot OÜ, Tallinn).
- If legal review says "too risky for cold email": fall back to LinkedIn (C2/C7) and warm-intro paths only (`02-channels/referral-mechanism.md`). Warm intro > cold email in every scenario.
- No candidate/private data anywhere; prospect data comes from the public-source tracker (`agency-segmentation.md`) with its source column filled.

## Sequence overview

| Step | Day | Purpose | Tone |
|---|---|---|---|
| E1 | 0 | Short, specific, ask for a conversation — not a demo, not a sale | Peer-to-peer |
| E2 | +4 days | One concrete, verifiable proof point + repeat the ask | Substantive |
| E3 | +11 days | Change angle: ask *them* a question about their workflow | Curious |
| E4 | +18 days | Polite close-out; leave the door open | Respectful |

Stop rules: any reply → sequence halts and a human answers. Opt-out or silence after E4 → never contact again (list them in a suppression sheet). **Never** start a second sequence while one is running.

---

## E1 — Erstkontakt (DE, primary)

**Subject options** (pick one; no fake "Re:"):
- `Kurze Frage zu {{agency}}-Mandaten` 
- `Evidenz statt Trefferliste — 20 Minuten?`
- `Ein Mandat, ein Test: hätten Sie Interesse?`

**Body:**

> Hallo {{first_name}},
>
> {{personalized_observation — eine echte, konkrete Beobachtung zu ihrer Agentur, z. B. „Sie besetzen aktuell mehrere Data-Platform-Rollen" oder „Ihr Fokus auf {{niche}} ist selten in der Region"}}.
>
> Kurz zu meinem Anliegen: Wir bauen an einer Ebene, die Mandats-Briefs in prüfbare Kriterien übersetzt und Kandidaten aus **Ihrem eigenen Pool** mit nachvollziehbarer Begründung bewertet — was belegt ist, was abgeleitet, was offen bleibt. Kein ATS-Umzug, kein Kandidaten-Download, keine Netzwerk-Daten.
>
> Wir suchen 2–3 Agenturen, die das an genau einem Mandat ehrlich testen — Ihre Kriterien, Ihre Entscheidung, unser Aufwand. Wäre ein kurzes Gespräch von 20 Minuten interessant, um zu sehen, ob das für Sie überhaupt passt?
>
> Viele Grüße
> Octavio · Linkbot OÜ (Tallinn) · linkbot.org
> Wenn Sie keinen Kontakt wünschen, antworten Sie einfach mit „Bitte nicht kontaktieren" — dann schreibe ich Ihnen nicht wieder und Sie werden aus meiner Liste entfernt.

**Variables:** `{{first_name}}`, `{{agency}}`, `{{niche}}`, `{{personalized_observation}}`. The observation must be real and specific; if you don't have one, don't send — pick another prospect this week.

## E2 — Follow-up 1 (DE, +4 Tage, only if no reply)

> Hallo {{first_name}},
>
> ergänzend zu meiner letzten Nachricht ein konkretes Beispiel, warum wir das bauen: In unserem letzten Benchmark war unsere Bewertung **schlechter** bei der rohen Trefferquote als eine einfache Stichwortsuche — aber jede einzelne Zeile hatte eine Begründung (Erklärungsabdeckung 100 % vs. 0 %). Genau daran scheitern die meisten Tools im Kundengespräch: die Reihenfolge kann man nicht verteidigen.
>
> Die Methode und die Zahlen veröffentlichen wir: [Artikel-Link mit UTM]
>
> Falls Sie 20 Minuten erübrigen können, zeige ich Ihnen den Ablauf an einem echten Beispiel. Wenn nicht — auch in Ordnung, dann lasse ich es damit bewusst gut sein.
>
> Viele Grüße
> Octavio

**Rule:** use the article link only after it is actually published; until then replace with "Die Methode erkläre ich im Gespräch in 5 Minuten."

## E3 — Follow-up 2 (DE, +11 Tage) — question, not pitch

> Hallo {{first_name}},
>
> eine Frage ohne Verkaufsabsicht: Wie prüfen Sie heute, ob eine Shortlist vollständig begründbar ist, wenn ein Kunde nachfragt („warum diese drei, warum nicht die anderen?")? Das ist die Frage, an der wir gerade am meisten lernen wollen.
>
> Falls Sie ein paar Sätze dazu schreiben mögen — ich würde mich ernsthaft freuen, auch unabhängig von einem Gespräch.
>
> Viele Grüße
> Octavio

## E4 — Breakup (DE, +18 Tage)

> Hallo {{first_name}},
>
> ich will Ihre Zeit nicht weiter belegen — ich schließe die Sequenz hier bewusst. Falls das Thema Evidenz-Fragen bei Shortlists später mal relevant wird: Sie wissen, wo Sie mich finden.
>
> Erfolgreiche Mandate und viel Glück mit {{konkrete_referenz}}.
>
> Viele Grüße
> Octavio

---

## EN variant (for DACH agencies working in English, or non-DACH cautiously in scope)

**E1 (EN, subject: "One mandate, one honest test — 20 minutes?")**
> Hi {{first_name}},
>
> {{personalized_observation}}.
>
> Quick context: we're building an evidence layer for recruiting — it turns a mandate brief into checkable criteria and reviews candidates from **your own pool** with traceable reasoning: what's confirmed, what's inferred, what stays unknown. No ATS migration, no candidate downloads, no network data.
>
> We're looking for 2–3 agencies to test it on exactly one mandate — your criteria, your call, our work. Worth a 20-minute conversation to see whether it even fits?
>
> Best,
> Octavio · Linkbot OÜ · linkbot.org
> (If you'd rather not hear from me again, one word back and that's respected.)

## Sending kit

- Send from the founder's real address (hello@linkbot.org or personal), plain text, no tracking pixel, no calendar-spam cadence.
- Log every send in the pipeline sheet: date, agency, step, personalization used, outcome.
- Batching: max 5 new E1s per week (quality of the observation > volume); follow-ups land in the same weekly slot as the runbook's pipeline hour.
- Reply handling: any reply within 48 h; call within 5 working days if they say yes; if they say no — thank them, no rebuttal, no re-approach within 6 months.

## Cold-email anti-patterns (hard "no"s)

Bulk-merge blasts · fake "Re:"/"following up" on no prior thread · multi-tool sequencing · "quick call?" with no substance · attaching decks to first contact · quoting the €149/€390 proposals as final prices · anything promising results, speed, or "better matches".
