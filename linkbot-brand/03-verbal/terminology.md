# Terminology contract

Status: **PROPOSED.** This table is normative for both languages. Where a term conflicts with
a loose usage in existing copy, the table wins.

The source of the English semantics is the product documentation, not this folder. The
column "Constraint" cites `../00-audit/product-truths.md`.

---

## 1. Core objects

| Term | Definition | Constraint | Do not confuse with |
| --- | --- | --- | --- |
| **Private record** | The holder-owned, versioned set of confirmed statements, evidence, intents, authorities and receipts | T12 | "profile" (public), "CV" (a document) |
| **Claim** | One typed statement with an explicit authority level | T12 | "fact" — a claim is not automatically verified |
| **Evidence** | Provenance for a claim: source extraction, user attestation or a credential reference | C3 | "proof" |
| **Intent** | The declared direction a person has confirmed, with a version and lifecycle | T12 | "preferences" (domain criteria inside an intent) |
| **Authority** | The bounded permission to disclose a specific field set to a specific recipient for a specific purpose at a specific version | T6, T7, T10 | "permission in general" |
| **Disclosure** | One bounded release of fields under an authority | T3, T6 | "application", "share" (ambiguous) |
| **Receipt** | The immutable record that a disclosure happened, and what it contained | T8 | "notification" |
| **Revocation** | An act that stops *future* access | T8 | "deletion" |
| **Opportunity** | A one-sided result: something a person may be interested in | T1 | "match" |
| **Bilateral match** | Both sides have explicitly confirmed | T1 | "opportunity", "interest" |
| **Application** | A separately authorised submission to a role | T3, T5 | "disclosure" |
| **Mandate** (agency) | The bounded brief an agency works against | agency spec | "job posting" |
| **Introduction** (agency) | One evidenced candidate presentation under a mandate | agency spec | "submission", "placement" |

## 2. The four states — never interchangeable

| State | Means | English UI | Deutsch | Glyph |
| --- | --- | --- | --- | --- |
| **Confirmed** | The holder explicitly reviewed or edited it | confirmed | bestätigt | closed square, solid |
| **Proposed** | A machine or system produced it; the holder has not confirmed | proposed | vorgeschlagen | triangle |
| **Unknown** | The value is genuinely absent or unresolved | unknown | unbekannt | hollow ring |
| **Denied** | An explicit negative or exclusion | denied | abgelehnt | solid dot |

**Rules**

1. `unknown` is never rendered as blank, dash, zero or success (T4).
2. `absent` (never asked) and `unknown` (asked, no answer) are distinguishable in product
   surfaces. Marketing copy may merge them but must not call either "confirmed".
3. `null` is unknown; `false` is false; `0` is zero; a denied skill is an explicit negative
   (T12). A visual language that renders all four the same way is a defect.
4. A "pending" state exists only for a *request in flight*. It is never a synonym for
   proposed or unknown.
5. German: use exactly `bestätigt`, `vorgeschlagen`, `unbekannt`, `abgelehnt`.

## 3. Roles

| Audience | English | Deutsch | Notes |
| --- | --- | --- | --- |
| Person | Talent | Talent | The product's own term; use it, do not say "user" |
| Organisation | Employer / HR | Arbeitgeber | "HR" is acceptable in EN marketing; DE uses "Arbeitgeber" |
| Intermediary | Agency | Agentur (Personalberatung) | DE parenthetical on first use |
| Platform | Linkbot | Linkbot | Always one word, capital L |
| Legal entity | Linkbot OÜ | Linkbot OÜ | Never "Linkbot OU", never "Linkbot GmbH" |

## 4. Words with a single permitted meaning

| Word | Permitted meaning only |
| --- | --- |
| private | The record's location and who decides. **Not** anonymous, encrypted or invisible. |
| permissioned | A named authority exists and was exercised. **Not** "consented to in general". |
| verified | An external credential adapter returned evidence for that specific claim. Otherwise write "confirmed by the person". |
| bounded | Limited by recipient, fields, purpose, condition and version — all named. |
| automatic | Only with a named standing policy version, and only about disclosure. |
| held | Stored privately by the holder. |
| matched | Both sides confirmed. |

## 5. Do-not-translate list

Keep in English in both languages because they are product identifiers, route names, schema
values or brand assets:

`Linkbot` · `Linkbot OÜ` · field and state identifiers quoted from a payload
(`status='active'`, `purpose=recruiting_opportunity_evaluation`) · product route names
(`/talent`, `#/privacy`) · token names (`--ink`, `--ocean`) · file and licence names
(`SIL OFL 1.1`) · technical protocol names.

## 6. Prohibited in both languages

Aggregator · pool · database of candidates · scraped · ranked shortlist · fit score ·
predictive score · verified identity · anonymous matching · end-to-end encrypted ·
zero-knowledge · delete your data everywhere · automatically apply · bulk approach.

## 7. Naming conventions for artifacts in this folder

| Artifact | Convention | Example |
| --- | --- | --- |
| Mark | `mark.svg`, `mark-construction.svg`, `mark-monochrome.svg` | `04-logo/A-notarial/mark.svg` |
| Lockup | `lockup-horizontal.svg`, `lockup-stacked.svg` | |
| Wordmark | `wordmark-monoline.svg` | |
| Small surfaces | `favicon.svg`, `app-icon.svg`, `app-icon-inverse.svg`, `social-avatar.svg` | |
| Token file | `<direction>.tokens.json`, `<direction>.tokens.css` | `10-tokens/A-notarial.tokens.json` |
| Specimen | `specimen-<direction>.html` | `11-templates/specimens/specimen-A-notarial.html` |
| Icon | `<semantic-name>.svg`, kebab-case, no `icon-` prefix | `08-iconography/icons/authority-grant.svg` |
