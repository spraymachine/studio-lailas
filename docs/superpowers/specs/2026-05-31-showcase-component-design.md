# Design Showcase Component — Design Spec

**Date:** 2026-05-31
**Project:** Studio Lailas (one-page site, `index.html` / `style.css` / `script.js`)
**Status:** Approved for planning

## Purpose

A showcase section where one styled garment photo (`reference.jpeg`) is the central
highlight, and the visitor cycles through design variants. Each variant is a
full styled photo shot in the **same arch/framing** as `reference.jpeg`. Because
the backdrop is identical across photos, crossfading the whole image reads as
"only the dress changes" — a try-on effect with zero masking.

## Decisions (locked during brainstorm)

- **Mechanism:** center-stage crossfade of full images. **No silhouette masking / tracing.**
- **Reference role:** `reference.jpeg` is the landing view (first slide) and first thumbnail.
- **Fill region:** whole garment (each photo is a complete styled outfit).
- **Assets:** user supplies styled photos (reference-style framing) for each design.
  Component is content-agnostic — it renders whatever image list it is given.
- **Placement:** new section inside `index.html`, after `#works`, before `#gallery`.

## Layout

### Desktop (≥ 800px)
- **Left/center:** arch-topped **stage** showing the active photo (~3:4.5 portrait),
  cream surround, gold hairline border, arch top echoing the reference alcove, soft shadow.
- **Caption** on the stage: mono index `01 / 12` + design name in Fraunces italic.
- **Right:** vertical **thumbnail rail**.
  - `▲ prev` button at top of rail.
  - `▼ next` button at bottom of rail.
  - Thumbnails stack vertically; rail scrolls; active thumb auto-scrolls into view.

### Mobile (< 800px)
- Stage on top (full width).
- Thumbnails become a **horizontal scroll strip below** the stage.
- Arrows flank as `‹` (prev) / `›` (next).

## Interaction

- Click a thumbnail → its photo **crossfades** into the stage (GSAP opacity, ~0.5s).
- Active thumbnail gets a **gold ring** + `aria-current="true"`.
- Arrow buttons step prev/next with **looping** (wrap around ends).
- Keyboard: `←` / `→` step prev/next when the component (or a thumb) has focus.
- `prefers-reduced-motion: reduce` → instant swap, no crossfade.
- No autoplay.

## Data model

Single JS config array in `script.js`:

```js
const showcaseDesigns = [
  { src: "reference.jpeg", name: "Mehfil", note: "Royal purple banarasi" },
  { src: "assets/1.jpeg",  name: "…",      note: "…" },
  // …11 assets; user replaces with styled photos later
];
```

- First entry renders on load.
- Image loading: eager for active + immediate neighbors (prev/next), lazy for the rest.
- `alt` text per image = `name` + `note`.

## Styling (brand alignment)

- Tokens from `:root` in `style.css` (cream, ink, gold, line, Fraunces, Geist, Geist Mono).
- Arch-top stage frame + gold hairline to mirror `reference.jpeg`'s alcove.
- Section header matches existing `.section-head` pattern (index numeral, label, year).
- ScrollTrigger reveal: stage rises/fades in, thumbnails stagger in.
- Interactive elements trigger the existing custom cursor `is-hover` state.
- Respects existing grain/weave overlays.

## Accessibility

- Prev/next arrows and thumbnails are real `<button>` elements with `aria-label`.
- Active thumb: `aria-current="true"`.
- Stage image has descriptive `alt`, updated on swap; announce change via `aria-live="polite"` region (index + name).
- Visible `:focus-visible` rings.
- Full keyboard operability (Tab to controls, arrows to navigate).

## Out of scope (YAGNI)

- Silhouette masking / "fill the dress shape" rendering.
- Autoplay / carousel timer.
- Zoom / lightbox.
- CMS or dynamic image upload — config array is hand-edited.
- Backend.

## Acceptance criteria

1. Section appears after `#works`, styled consistently with the site.
2. Stage loads showing `reference.jpeg` with caption `01 / N — <name>`.
3. Clicking any thumbnail crossfades the stage to that photo; active thumb shows gold ring.
4. Prev/next arrows and `←`/`→` keys cycle with wraparound.
5. Active thumbnail scrolls into view in the rail.
6. Desktop = vertical rail right with ▲/▼; mobile = horizontal strip below with ‹/›.
7. `prefers-reduced-motion` disables crossfade (instant swap).
8. All controls keyboard-operable and labeled; screen reader announces active design.
9. Adding/removing entries in `showcaseDesigns` updates the UI with no other code change.
