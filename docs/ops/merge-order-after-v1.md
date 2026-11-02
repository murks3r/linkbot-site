---
type: report
title: Merge order of the linkbot-site drafts after V1 (rehearsal)
created: 2026-11-02
tags:
  - merge-order
  - drafts
  - after-v1
---

# Merge order of the linkbot-site drafts after V1

A rehearsal, nothing merged. Branch `next/integration-rehearsal` from `origin/build/vision` at `fd50b82`, every open
draft with a `next/*` head merged one by one with `git merge --no-ff`, in the order below. A conflict was recorded and
the merge aborted, not resolved. As of 2026-11-02 01:50 UTC.

## The drafts

| # | Order | PR | Head | Base of the PR | Stacked on | Merge into the rehearsal |
| - | ----- | -- | ---- | -------------- | ---------- | ------------------------ |
| 1 | intermediaries | #75 | `next/site-intermediaries` `9a0126b` | `build/vision` | none | clean |
| 2 | four ways in | #76 | `next/site-access` `a25aef7` | `build/vision` | none | clean |
| 3 | login draft | #73 | `next/docs-login` `0007384` | `build/vision` | none | clean |
| 4 | a new vertical | #78 | `next/docs-new-vertical` `f051b0b` | `next/docs-login` | #73 | clean |
| 5 | prepare a request | #79 | `next/docs-prepare` `40bf3a1` | `next/docs-new-vertical` | #78, #73 | clean |
| 6 | landing page | #74 | `next/landing-v2` `92cbe35` | `build/vision` | none | **conflict**, aborted |
| 7 | `/demo` | #77 | `next/site-demo` `2f91c56` | `next/landing-v2` | #74 | **conflict** (the same, via #74), aborted |

`next/pack-guide` is not a branch of this repository: it is murks3r/linkbot draft #333 (`4127d4f`, the pack guide
NX-PKDOC), which #78 depends on (see below). Not part of this rehearsal.

The rehearsal branch holds merges 1 to 5 (`b41b5db`); #74 and #77 are not in it.

## The conflict

`src/pages/[intermediaries].astro`, between #73 (and so #78, #79) and #74:

- #73 moves the page body and its `<style>` into the shared `src/components/DraftPage.astro`; the page becomes one
  line `<DraftPage d={intermediaries} path="/for-intermediaries" />`.
- #74 changes one line of that `<style>`: the draft banner's colours `var(--ink)` / `var(--sand)` become
  `var(--lb-ink)` / `var(--lb-line-quiet)`, because #74 replaces the A8 brand tokens with `src/styles/tokens.css`.

Not resolved here. What a resolution has to cover, found in a local trial that was thrown away (not pushed): taking the
one-line page from #73 leaves `src/components/DraftPage.astro:40` on `var(--ink)` and `var(--sand)`, which #74 no
longer defines. The build and tests stay green, but the draft banner on every draft page loses its border and
background. So the same token change belongs in `DraftPage.astro`. In that trial #77 then merged without a further
conflict, and #80 (`site/fund-fixes`, V1) merged on top without a conflict.

## Check result

On the rehearsal branch (merges 1 to 5, `b41b5db`), the repository's fast check (it has no `npm run check`; build,
test and typecheck are its fast check):

- `npm run build`: 0 errors, 114 pages
- `npm test`: 52/52
- `npm run typecheck`: 0 errors, 123 files

In the thrown-away trial with all seven drafts and the conflict resolved as above: `npm run build` 0 errors, 114
pages; `npm test` 54/54.

## What each draft waits on

GEO-120 (decided 2026-10-20, option A): Spaces are a second product line with vertical packs; **recruiting stays the
launch product**; the site says nothing of a "matching layer for every market" before M3. A draft "waits on GEO-120"
when it makes Spaces the main product of the site.

| Order | PR | Waits on GEO-120 | Waits on an engine or widget draft | Other condition in the PR |
| ----- | -- | ---------------- | ---------------------------------- | ------------------------- |
| 1 | #75 intermediaries | no (draft page, absent from production; names the recruiting pack as a draft) | no: `packs/jobs` 0.0.1-draft is on murks3r/linkbot `build/vision` | after V1 |
| 2 | #76 four ways in | no (the platforms page already describes Spaces) | yes: murks3r/linkbot branch `vision/mcp-read` `fe885f3` (MCP read prototype; no PR) | after V1 |
| 3 | #73 login draft | no | no | the sign-in planned further (owner) |
| 4 | #78 a new vertical | no (draft page, marked planned) | yes: murks3r/linkbot draft #333 (`next/pack-guide`) | owner's review |
| 5 | #79 prepare a request | no (draft page, marked planned) | yes: murks3r/linkbot draft #334 and murks3r/linkbot-connect draft #92. #334 has moved from `02cfdd1` (the page's source) to `ac5f4d5`: re-read before the merge | after the first release |
| 6 | #74 landing page | **yes**: the home becomes a landing page for buyers and suppliers in a market, while GEO-120 keeps recruiting as the launch product; needs the owner's word that the home may lead with Spaces | no engine draft; its status step names widget 0.6.0-v1, staging serves 0.6.1-v1 since #80 | not before 2026-11-11 |
| 7 | #77 `/demo` | **yes**, through #74 (buyer/supplier role switch) | no draft; its live-widget switch needs a synthetic demo space on staging, which does not exist | after V1 |

## Suggested order

1. #80 (V1, before the merge of #56): no conflict with any draft.
2. #75, #76, #73, #78, #79 as above: clean among themselves; #76, #78 and #79 only once their engine or widget drafts
   are merged, or with their sentences still "planned / on a development branch".
3. #74 with the conflict resolved (the token change moved into `DraftPage.astro`), then #77; both only after the owner's
   word on GEO-120 for the home.
