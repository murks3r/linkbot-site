# Reddit Participation Plan (contribution-first)

Status: **DRAFT — nothing posted.** Every action requires: live rules re-check done (`community-research.md` gate) + owner approval. No bots, no astroturfing, no vote manipulation, no unsolicited DMs, no cross-post blasts, no treating members as leads. Those aren't tactics we're avoiding — they're behaviors that would end the account and, worse, testify against everything the product says it believes.

## Principles

1. **Answer-first.** A contribution must be useful if every Linkbot-related word were deleted. If it isn't, it's an ad — delete it ourselves first.
2. **Disclose whenever adjacent.** If a comment touches matching/recruiting-tool territory, include: *"Disclosure: I work on Linkbot, a private-first recruiting tool — so take that bias into account."* No exceptions, even when no link is involved.
3. **Links are the exception, not the format.** Only when (a) directly answers the question, (b) rules explicitly allow it, (c) owner has approved that specific link. Default: no links.
4. **Small numbers, long presence.** 2–3 contributions per week max; consistency for months beats bursts. One community at a time.
5. **Listen for product truth.** The most valuable output of Reddit participation is unfiltered problems (what people hate about recruiters/tools), feeding content topics and the product backlog — recorded as anonymized notes, never scraped or stored with usernames.

## Contribution drafts (tailored; edit before use)

### R1 — r/recruiting · comment on a shortlist/sourcing-quality thread (first contribution)
*Target:* a real thread about shortlist quality, sourcing or "why candidates fail interviews".
> The thing that keeps biting teams: treating "no data" as "data". If a requirement isn't confirmed anywhere, it shouldn't become a ranked position — it should become a question. We started marking every shortlist line as confirmed / inferred / unknown before it goes to a client, and the first thing that changed wasn't the ranking quality, it was that we stopped defending entries we couldn't source. Painful but fewer awkward client calls.
> (Disclosure: I work on Linkbot, a recruiting tool with this exact bias, so discount accordingly.)
> Genuine question for the room: does anyone here have a workable way to keep those unknowns visible after the shortlist leaves your desk?

Standalone: yes (method + question; the tool isn't pitched). Link: none.

### R2 — r/recruiting · discussion post (only after R1 lands well and rules re-check passes)
**Title:** *How do you record "unknown" in candidate evidence without slowing the process down?*
> We've been arguing internally about this and I'd rather steal better ideas than invent worse ones. In our review flow, every requirement against a candidate is one of: confirmed (source attached), inferred (method stated), unknown (gap made visible). Hard requirements that are unknown block the shortlist — or rather, they route it to verification instead of a yes.
> Practical problems we hit: (1) people read "unknown" as "no" when it's just "not checked"; (2) clients push to drop the column; (3) it takes discipline to keep it current.
> How do you all handle gaps in evidence at shortlist stage — ignore them, flag them, verify them? What actually survives contact with a busy week?
> *(Disclosure: I build tooling in this space — the workflow above is mine, the problem is everyone's. No links, happy to dm examples if asked.)*

Standalone: yes. Link: none (if mods approve an edit adding one later, that's their call).

### R3 — r/humanresources · comment (only after live rules pass)
*Target:* a thread on screening consistency / structured hiring. Contribute a concrete practice, no product mention:
> One cheap change that helps more than most: separate "requirements we verify" from "requirements we assume" before interviews start, then only calibrate interviewers on the verified set. Half of the "inconsistent interviews" complaints trace back to interviewers ranking against different unstated must-haves. Writing them down (even badly) makes the disagreement visible in week one instead of month three.
> (Disclosure: I work on recruiting tooling — bias noted.)

### R4 — r/jobs · comment, knowledge only, zero product angle (rules: no self-promo of any kind)
*Target:* job seekers asking how to vet listings/ghost jobs.
> A few signals I'd weight, from having looked at this problem a lot: (1) reposted-for-months listings with slightly changed titles are often pipelines, not openings — check the posting date vs. "posted 30+ days ago" UI text; (2) if salary/location/start are all missing, treat the listing as unverified, not as flexible; (3) the application that gets a human read (referred, targeted, direct on the employer site) beats the tenth easy-apply of the day every time.
> Practical version: pick 5 postings a week you actually want, verify them (company careers page, recent company news, a human if reachable), and spend your effort there instead of the feed. It's slower and much less depressing.

No product mention (rule: any "services/ads" mention can trip it). This is presence + goodwill, not a funnel.

### R5 — r/recruitinghell · do NOT post about the product — the mildest possible participation if at all
*Decision default: no action beyond reading.* If a thread explicitly asks for consumer-rights information (e.g., "can recruiters just do X?"), a strictly factual, zero-product answer is acceptable:
> Not legal advice, but: consent for sharing candidate data between agencies/clients has to be specific — "we share with partners" in fine print generally isn't it. If something's shared without your OK, you can ask (in writing) what was shared, with whom, and request deletion; you also have a right to a copy of what's held about you. In the EU this is basic GDPR territory; escalate to your local DPA if ignored.

No Linkbot, no links, no "we're fixing this" (that's an addicle; one-strike sub).

### R6 — gated community question (planned for r/arbeitsleben or r/cscareerquestions, only after clean live rules)
Draft the *question*, hold until verification:
> DE: Frage an Jobsuchende hier: Wenn eine Suche nur nach Ort/Titel läuft, bekommt man hundert irrelevante Treffer. Was wäre euch lieber — weniger Treffer mit klarer Begründung („deshalb passt das") oder mehr Treffer zum selbst Filtern? Und welcher Teil (Gehalt? Startdatum? Arbeitsmodell?) darf dabei auf keinen Fall fehlen?

No product, no links, pure community research with value back to the thread.

## When a product mention IS allowed (all five must hold)

1. Live rules check done today, and the sub's rules explicitly allow the specific form (comment vs post, link vs no link).
2. Someone directly asks for tools/solutions *and* the answer is more useful with the mention than without.
3. Disclosure included, plainly worded, not buried.
4. The specific asset was review-gated (`02-channels/distribution-checklist.md` Reddit block) and the owner approved that exact link.
5. We have not posted a link to the same destination in that community before (ever, not just recently).

Otherwise: no mention. Silence is a compliant, and often more persuasive, strategy.

## Measurement (consent-safe, no scraping)

| Signal | How tracked | Use |
|---|---|---|
| Helpful contributions | Manual log: sub, date, contribution type, any replies | Consistency + learning |
| Qualitative insights | Anonymized notes → product/content notes (no usernames) | Feed content topics & roadmap evidence |
| Declared referral traffic | Only where a link was allowed: UTM `utm_source=reddit&utm_medium=community&utm_campaign=<thread-topic>` | Caveated because traffic is small and mixed |
| Mod feedback | Any warning/removal = immediate stop + log | Compliance canary |

Success after 8 weeks looks like: zero mod actions, a handful of real conversations, insights we wouldn't have gotten otherwise. It never looks like a traffic spike.
