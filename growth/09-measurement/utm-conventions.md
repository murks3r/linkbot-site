# UTM Conventions (one taxonomy, no freelancing)

Status: DRAFT (operating convention). Every external link we control carries UTMs; every UTM follows this table so comparisons stay honest. Lowercase only; hyphens not underscores; no PII ever in URLs; no link shorteners (they break referrers and trust).

## Pattern

```
https://linkbot.org/<path>?utm_source=<source>&utm_medium=<medium>&utm_campaign=<yyyy-mm-topic>&utm_content=<asset-id>
```

- `utm_source`: **the concrete place** (required): `linkedin`, `newsletter`, `reddit`, `producthunt`, `email`, `blog` (internal blog→product links), `referral`.
- `utm_medium`: the class: `organic-social`, `email`, `community`, `launch`, `outreach`, `referral`, `organic-search` (rare; only if we tag something meant for search, e.g. llms.txt contexts — otherwise leave search untagged).
- `utm_campaign`: `yyyy-mm-<topic>` — e.g. `2026-10-benchmark`, `2026-10-first15min`, `2026-10-supply-report`, `2026-10-pilot-round1`.
- `utm_content`: the specific asset: `p1`…`p11` (LinkedIn posts), `n1`… (newsletter items), `r1`… (Reddit, only when links allowed), `blog-a2`, `bio`, `signature`, `ph-maker-comment`.

## Canonical examples

| Where | Link |
|---|---|
| LinkedIn post P4 (benchmark) | `https://linkbot.org/blog/benchmark?utm_source=linkedin&utm_medium=organic-social&utm_campaign=2026-10-benchmark&utm_content=p4` |
| LinkedIn profile featured link | `…?utm_source=linkedin&utm_medium=organic-social&utm_campaign=2026-evergreen&utm_content=bio` |
| Newsletter item N1 | `…?utm_source=newsletter&utm_medium=email&utm_campaign=2026-10-signal-1&utm_content=item-1` |
| Reddit (only when link explicitly allowed) | `…?utm_source=reddit&utm_medium=community&utm_campaign=2026-11-method&utm_content=r3` |
| PH maker comment / profile | `…?utm_source=producthunt&utm_medium=launch&utm_campaign=2026-12-ph&utm_content=maker-comment` |
| Outreach email article link | `…?utm_source=email&utm_medium=outreach&utm_campaign=2026-10-pilot-round1&utm_content=e2` |
| Talent referral share link | `…?utm_source=referral&utm_medium=referral&utm_campaign=2026-evergreen&utm_content=share` |

## Rules

1. **One canonical link per asset.** No re-tagging an asset mid-campaign; a new context = a new `utm_content`.
2. **The PH submission's product URL stays clean** (no UTMs) — tracking belongs to the links *we* share; tracked submission URLs risk platform issues `[Provider claim — third-party]`.
3. **Registry:** every published URL gets a row in the UTM registry sheet (asset, URL, date, owner). The registry is the single source; if it's not there, it wasn't published.
4. **Self-referrals:** never tag links used *within* the site to itself (internal links are untagged).
5. **Privacy:** UTMs describe *content*, never people. No email/name/hash in URLs. If a partner insists on personalization tokens, refuse or hash after legal review.
6. **Attribution limits (say them out loud):** link-tagging can't see dark social (DMs, screenshots, word of mouth). "utm_source=linkedin" means "the click arrived from a LinkedIn link we controlled", not "LinkedIn caused it". Qualitative sources (conversation notes) fill the gap; the dashboards keep a `source?` column for "not attributable".
