# Founder decision sheet

**Ten decisions. Nothing in this folder ships until at least D-01 is answered.**
Recommendations are offered; none has been taken on your behalf.

---

## The one decision that matters

| | |
| --- | --- |
| **D-01 — Adopt a direction?** | **A (Notarial) is PROPOSED.** A = editorial authority, paper ground, seal accent. C (Commons) = plain public utility, light-first, closest to what already ships. B (Protocol) = infrastructure/terminal register. |
| Why you | It changes how the company is perceived, and it is not reversible without cost. |
| Recommendation | **A**, on distinctiveness; **C** if you weight integration cost and accessibility above distinctiveness. The reasoning and the honest case against A are in `../02-directions/PROPOSED.md`. |
| If you do nothing | No direction is adopted. The audit's gap — two unrelated identities and no canonical logo — stays as it is. |
| Proof | `../02-directions/comparison.md` (scored), the three specimens, `../validation/contrast-report.md`. |

## Claims and compliance — answer these before any rebrand ships

| # | Decision | Why it is yours | Recommendation | Risk if left open |
| --- | --- | --- | --- | --- |
| **D-02** | The site asserts "**Identity is verified**". The product has no configured credential adapter and confirmed records are user attestations, explicitly not externally verified. Keep, reword, or remove? | It is a public factual claim about verification you cannot currently perform | **Remove or reword** to "Identity is confirmed by the person". Record the adapter as a separate product task. | A verifiable overstatement in the first sentence of your brand |
| **D-03** | The FAQ says you onboard "**in groups of roughly 20**". The documented pilot is 3–5 Talents and 1–2 employers, with zero participants recorded. | Only you know the real intake plan | **Restate as the real number**, or as "in small, invited groups" with no figure | A published number with no source |
| **D-04** | `foundingDate: '2024'` in the structured data matches nothing in the repositories. | Registry fact | **Confirm or correct.** | Structured data that search engines and AI crawlers read |
| **D-05** | `og:image` points at an **SVG**, which Facebook, LinkedIn and X do not render. | Implementation ownership | **Fix regardless of direction**: rasterise to PNG/JPEG and update the meta tag | Every shared link looks broken today |

## Assets, rights and cost

| # | Decision | Why it is yours | Recommendation | Risk if left open |
| --- | --- | --- | --- | --- |
| **D-06** | Move the marketing surface to **warm paper** (`#F4F1EA`) or keep a cool/near-white ground? | A taste call with a real brand consequence | Only relevant if you choose A. Warm paper is a large part of A's distinctiveness. | A becomes a serif on a generic white page — the least interesting version of A |
| **D-07** | Commission a **trademark search** on the mark and the wordmark, and check `Linkbot` in the relevant classes? | Legal exposure is not a design decision | **Do it before any public use**, and before paying to outline a wordmark master | Publishing a mark you cannot own |
| **D-08** | Accept **OFL fonts** (free, self-hostable, replaces the Helvetica stack) or budget for a commercial foundry licence? | Budget and future differentiation | **OFL.** It removes the proprietary Helvetica dependency for any self-hosted surface at zero cost, and the register we need is available in OFL. | Continuing to serve a face that renders differently per OS, or paying for a licence we did not need |

## Implementation and scope

| # | Decision | Why it is yours | Recommendation | Risk if left open |
| --- | --- | --- | --- | --- |
| **D-09** | Who derives **component tokens**, and from which surface — the product first, or a marketing page first? | It freezes layout assumptions into the system | **The product first.** Deriving them from a marketing specimen bakes a marketing layout into the design system. | Component tokens that fight the product for the next two years |
| **D-10** | Does the **scroll-linked 3D narrative** on the current landing page survive a rebrand? | Marketing and effort trade-off | Not a brand-token question. If it survives, it must sit outside the form flow and honour reduced motion with the static fallback that already exists. | Deciding it implicitly while restyling |

## How to answer

Reply with the decision IDs and your choices, for example:

```
D-01 C   D-02 remove   D-03 no figure   D-04 confirm 2024
D-05 fix   D-06 n/a   D-07 authorised   D-08 OFL   D-09 product-first   D-10 keep, outside flow
```

Recorded answers go into `approval-checklist.md`. Anything you answer becomes the approved
position for future brand work; everything unanswered stays PROPOSED.
