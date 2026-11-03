# Privacy for integrators: what the embed does in your page

> **Draft by the Connect team, technical facts only.** The legal text (processing roles, legal basis, retention, rights) comes from the Trust team and is not written here. Statements about Core cite Space API contract 0.2.11 (2026-10-24). They describe the contract. a pilot's synthetic staging space has run the contract since 2026-10-23 (0.2.11 since its build `0e84b73` on 2026-10-24), with synthetic data only.

## What the embed does in the browser

- **Storage.** The embed keeps three things in `sessionStorage`, and they disappear when the tab closes:
  - a draft not yet confirmed, under a key starting `linkbot:draft:`: the text the person typed, their choices (with their own words under "Other"), their name and email address, and the reading of their text, which quotes it. It is deleted when the person confirms, when they withdraw a request or ask to delete one in "mine", and the next time the embed reads it after three hours untouched;
  - a guest session token (`linkbot:session:1:…`, valid for 24 hours on the server);
  - after confirm, an owner token (`linkbot:owner:1:…`). With it, this tab can show "mine", answer possible fits and change the watch. Core ends it 60 days after it was last used, and never later than seven days after the party's last request expires (contract 0.2.7 on). The tab forgets it once the person has asked to delete every request "mine" shows.

  The embed uses no `localStorage`, IndexedDB or cookies. Where the owner token is kept is an open owner decision; Connect ADR 0006 describes the default.
- **Your page can read these.** `sessionStorage` belongs to your page's origin, so any script you run on that page can read the draft and the tokens. Don't run scripts you don't trust on pages that carry the embed.
- **Network.** The embed talks to your space's Space API, without cookies (`credentials: 'omit'`). For a language other than English it also fetches one file from next to `embed.js` (`locales/de.json` and so on), and refuses it if the sha256 doesn't match. It loads no fonts, analytics or third-party scripts. The guest session starts at the person's first edit, not when the page loads. The sample build sends nothing over the network: it answers every call inside the page, and an end-to-end test checks this.
- **One global.** It defines `window.Linkbot` and nothing else. Its styles live in a shadow root and do not affect your page.
- **Keys.** Your page holds only the publishable key, which works only on your allowed origins. The embed refuses to start with a secret key.

## What Core keeps, according to contract v0

- **Before confirm, nothing personal.** Invariant 2 makes `describe` and `answer` stateless. The widget's line "Nothing is used until you confirm." relies on this.
- **At confirm,** Core stores each criterion with its source, disclosure stage and confirmation time. It also stores the party (person or organisation, with an optional display name) and an optional email address. The address is held at stage `introduction`, and the person confirms it through an emailed link.
- **Who sees what** follows the disclosure stages:
  - the board (contract 0.2.11) shows only entries whose owner chose to list them: a box at confirm that starts unticked, or the owner's own switch under "mine", which also takes an entry off at any time. Each listing gets a new random id, never the request's id. An entry shows only the fields at stage `board`, coarsened by the pack's rule (an amount in whole bands, a place as its country, a date by month), each with its importance and the kind of its source only: no quote, no span, no name, no operator, and never the person's own words (an "other" answer or free text). A search compares its filters coarsened the same way and leaves an entry out only on a conflict, so it learns nothing beyond the coarsened entries. An answer to an entry creates a request on the other side that refers to the entry's id, never to the other request;
  - a possible fit shows only verdicts on fields at stage `match` or lower;
  - name and contact are at stage `introduction`.
- **Introductions.** No introduction happens without the required gates, an operator's approval and a yes from both sides (invariant 4). In mode `operator`, only the operator sees the contact fields; in mode `direct`, both parties do. Every read is recorded.
- **Watches** notify only their owner, and never disclose anything beyond board stage (invariant 8).
- **Text reading** (contract 0.2.10). A space may read a person's text with fixed rules over its pack (the deterministic reader), which needs no model. Nothing is stored before the person confirms in the form. The reading token carries the reading for one hour, and with it the words each value was read from as quotes, though never the whole text; neither the text nor a quote reaches the audit log or the request log.
- **Open:** retention periods, where data is stored, and the model and data-handling policy for a model reader (Trust). Until the owner approves that policy, no model reads text. Two owner decisions may change who sees identity fields and when: (introduction mode) and (identity before the KYC check).

## What people see in the widget

- When the space reads text with fixed rules: "Fixed rules read your text, not AI. Nothing is used until you confirm."
- When a model reads it (slice E7, once the model policy is approved): "Linkbot uses AI to read your text. Nothing is used until you confirm."
- Every value that came from their text, shown next to the words it came from.
- At the party step, who receives their name and email, and when (it depends on the introduction mode).
- "No one is introduced unless both sides say yes." The server's fixed notice appears on every possible fit.
- On the board: that it doesn't show who posted an entry, which values it shows less exactly, and at each filter how it is compared.
