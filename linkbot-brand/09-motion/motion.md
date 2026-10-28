# Motion

Status: **PROPOSED.** Tokens live in `../10-tokens/`. A runnable stylesheet:
`motion.css`. A live demo: the "Motion" section of each specimen.

---

## 1. Principle

**Motion communicates a boundary being crossed, never activity.** Linkbot has no processing
spinner in the brand language, no ambient loop, no pulsing "live" indicator and no simulated
work. The product's own design documents rejected "simulated activity" and "invented
processing indicators", and the reason is that a fake progress bar is a small lie — the same
class of lie as an overstated claim.

What motion may express:

| Meaning | Motion |
| --- | --- |
| Something settled into place | A short scale-and-settle (the one expressive moment) |
| A boundary was crossed | A directional shift, 160ms |
| A state changed | A cross-fade of colour and glyph, 160ms, no movement |
| Something is genuinely in flight | The only permitted indeterminate indicator, and it must be labelled |

## 2. Tokens

| Token | Value | Use |
| --- | --- | --- |
| `duration.instant` | 80ms | Hover, press |
| `duration.fast` | **160ms** | Focus, state change, local feedback — the default |
| `duration.base` | 240ms | A transition the user asked for |
| `duration.slow` | 400ms | A gate opening (Commons) |
| `duration.deliberate` | 640ms | The single brand moment; at most once per page |
| `ease.standard` | `cubic-bezier(0.2, 0.7, 0.2, 1)` | Default |
| `ease.entrance` | `cubic-bezier(0.16, 1, 0.3, 1)` | Something arriving |
| `ease.exit` | `cubic-bezier(0.4, 0, 1, 1)` | Something leaving; exits are faster and less eager than entrances |
| `ease.linear` | `linear` | Only in the Protocol direction, for a machine-like state step |

## 3. The one brand moment

Each direction is allowed exactly one deliberate motion, and it is the mark's idea:

| Direction | Moment | Feel |
| --- | --- | --- |
| A — Notarial | The impression: a 240ms scale-and-settle with `ease.entrance` | Something being struck and taking hold |
| B — Protocol | A state line stepping from one value to the next, 160ms `linear` | A readout changing |
| C — Commons | A gate opening: 400ms `ease.entrance`, once per page | A permission being granted |

**Budget: one per page.** If a page animates two things, neither reads as meaningful.

## 4. Reduced motion — non-negotiable

`prefers-reduced-motion: reduce` sets **every** duration token to `0ms` and replaces movement
with a **visible** state change. It never removes feedback.

```css
@media (prefers-reduced-motion: reduce) {
  :root { --lb-duration-instant: 0ms; --lb-duration-fast: 0ms; --lb-duration-base: 0ms;
          --lb-duration-slow: 0ms; --lb-duration-deliberate: 0ms; }
}
```

The rule that matters: a reduced-motion user must still be able to tell that something
happened. In the specimens the "trigger the transition" button does **not** become a no-op —
it swaps its lift-and-shadow for a focus outline.

## 5. Rules

1. **No animation of a consequential control's meaning.** Do not animate a status colour into
   existence; the states are too important to be a transition.
2. **No motion that delays the task.** Never gate an action behind an animation.
3. **Never animate in response to scroll beyond a single reveal.** No parallax, no pinned
   narrative inside a form flow.
4. **No infinite loops** except a genuine, labelled in-flight indicator.
5. **Transform and opacity only** for anything per-frame. Never animate `width`, `height`,
   `top` or `left`.
6. **Motion must not be the only signal.** If a state change is communicated by movement, it
   must also change text or colour.
7. **Vestibular safety:** no large-area zoom, no fast rotation, no full-viewport translation.

## 6. What was intentionally left out

- No loading skeletons in the brand language — the product surfaces own their own loading
  representation, and a skeleton is a layout claim the brand should not freeze.
- No scroll-linked storytelling in the token system. The incumbent marketing site uses a
  four-act 3D narrative driven by GSAP and scroll position; whether that survives a rebrand is
  a product-marketing decision (D-10), not a brand-token decision. If it survives, it must sit
  outside the form flow and honour reduced motion by falling back to a static composition — a
  fallback the current implementation already has.
