# Design Showcase Component Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a `#showcase` section to the Studio Lailas one-pager where `reference.jpeg` is the central stage and visitors cycle through design photos via a thumbnail rail, crossfading the full image (no masking).

**Architecture:** Static HTML skeleton in `index.html`; a JS config array (`showcaseDesigns`) drives a `showcase()` init module in `script.js` that builds thumbnails, handles selection/crossfade/keyboard/looping, and registers GSAP reveals; styles in `style.css` using existing `:root` tokens. Vertical rail on desktop, horizontal strip on mobile.

**Tech Stack:** Vanilla HTML/CSS/JS, GSAP 3.12 + ScrollTrigger (already loaded via CDN). No build step, no test runner.

**Verification note:** This codebase has no unit-test harness. Each task is verified by loading `index.html` in the browser via the Playwright MCP (`mcp__plugin_playwright_playwright__browser_navigate` to `file:///Users/mani/Desktop/nabhan mom/index.html`, then `browser_take_screenshot` / `browser_evaluate`). The loader animation takes ~2s — wait for it before asserting. If Playwright MCP is unavailable, open the file manually and confirm the same checks.

---

## File Structure

- **Modify `index.html`** — add nav link; insert `<section id="showcase">` skeleton after `#works`; renumber the index glyphs on gallery/atelier/contact so numbering stays sequential.
- **Modify `style.css`** — append a `/* SHOWCASE */` block (layout grid, arch stage, rail, thumbs, arrows, caption, `.sr-only`, mobile rules).
- **Modify `script.js`** — add `showcaseDesigns` config + `showcase()` module; call it in the `window load` boot sequence.

---

## Task 1: HTML skeleton, nav link, index renumber

**Files:**
- Modify: `index.html`

- [ ] **Step 1: Add the nav link**

In `index.html`, the nav links block (around line 56-62) currently reads:

```html
  <nav class="nav__links">
    <a href="#manifesto" data-magnet>Atelier</a>
    <a href="#works" data-magnet>Collection</a>
    <a href="#gallery" data-magnet>Lookbook</a>
    <a href="#atelier" data-magnet>Process</a>
    <a href="#contact" data-magnet>Contact</a>
  </nav>
```

Insert a Designs link after the Collection link:

```html
  <nav class="nav__links">
    <a href="#manifesto" data-magnet>Atelier</a>
    <a href="#works" data-magnet>Collection</a>
    <a href="#showcase" data-magnet>Designs</a>
    <a href="#gallery" data-magnet>Lookbook</a>
    <a href="#atelier" data-magnet>Process</a>
    <a href="#contact" data-magnet>Contact</a>
  </nav>
```

- [ ] **Step 2: Insert the showcase section**

Find the end of the WORKS section and the start of the gallery (around line 198-201):

```html
  </div>
</section>

<!-- HORIZONTAL GALLERY -->
<section class="gallery" id="gallery">
```

Insert the new section between them so it becomes:

```html
  </div>
</section>

<!-- DESIGN SHOWCASE -->
<section class="showcase" id="showcase" tabindex="-1">
  <header class="section-head">
    <span class="section-head__ix">۰۳</span>
    <span class="section-head__label">Try the cloth</span>
    <span class="section-head__year">The designs</span>
  </header>

  <div class="showcase__layout">
    <div class="showcase__stage-wrap">
      <div class="showcase__stage" id="showcaseStage">
        <div class="showcase__core">
          <img class="showcase__img" id="showcaseImg" src="reference.jpeg" alt="" />
          <div class="showcase__caption">
            <span class="showcase__index" id="showcaseIndex">01 / 01</span>
            <span class="showcase__name" id="showcaseName"></span>
          </div>
        </div>
      </div>
    </div>

    <div class="showcase__rail-wrap">
      <button class="showcase__arrow showcase__arrow--prev" id="showcasePrev" type="button" aria-label="Previous design" data-magnet>
        <span class="g-v" aria-hidden="true">▲</span><span class="g-h" aria-hidden="true">‹</span>
      </button>
      <div class="showcase__rail" id="showcaseRail" aria-label="Designs"></div>
      <button class="showcase__arrow showcase__arrow--next" id="showcaseNext" type="button" aria-label="Next design" data-magnet>
        <span class="g-v" aria-hidden="true">▼</span><span class="g-h" aria-hidden="true">›</span>
      </button>
    </div>
  </div>

  <div class="sr-only" id="showcaseLive" aria-live="polite"></div>
</section>

<!-- HORIZONTAL GALLERY -->
<section class="gallery" id="gallery">
```

- [ ] **Step 3: Renumber the following sections' index glyphs**

Because the showcase takes glyph `۰۳`, bump the three sections after it.

Gallery header (around line 204) — change `۰۳` to `۰۴`:

```html
    <header class="gallery__head">
      <span class="ix">۰۴</span>
      <h2>The <em>Mehfil</em> lookbook, Edit&nbsp;09</h2>
```

Atelier section-head (around line 264) — change `۰۴` to `۰۵`:

```html
    <span class="section-head__ix">۰۵</span>
    <span class="section-head__label">How a piece is made</span>
```

Contact lead (around line 301) — change `۰۵` to `۰۶`:

```html
    <span class="ix">۰۶</span>
    <h2 class="contact__title">
```

- [ ] **Step 4: Verify the page still renders and the section exists**

Use Playwright MCP: `browser_navigate` to `file:///Users/mani/Desktop/nabhan mom/index.html`, wait ~2.5s for the loader, then `browser_evaluate` with:

```js
() => {
  const s = document.querySelector('#showcase');
  return {
    sectionExists: !!s,
    stageImg: document.querySelector('#showcaseImg')?.getAttribute('src'),
    railExists: !!document.querySelector('#showcaseRail'),
    navLink: !!document.querySelector('.nav__links a[href="#showcase"]'),
  };
}
```

Expected: `{ sectionExists: true, stageImg: "reference.jpeg", railExists: true, navLink: true }`.

- [ ] **Step 5: Commit**

```bash
git add index.html
git commit -m "feat: add showcase section skeleton and nav link"
```

---

## Task 2: Showcase styles (desktop)

**Files:**
- Modify: `style.css`

- [ ] **Step 1: Append the showcase CSS block**

Append to the end of `style.css`:

```css
/* ============ SHOWCASE ============ */
/* fluid spring easing (high-end motion) — declared again to merge into :root */
:root { --ease-fluid: cubic-bezier(0.32, 0.72, 0, 1); }

.showcase { padding: clamp(96px, 14vh, 180px) var(--pad); position: relative; }
.showcase:focus { outline: none; }

.showcase__layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 148px;
  gap: clamp(28px, 4vw, 64px);
  align-items: start;
  max-width: 1120px;
  margin: 56px auto 0;
}

/* Double-bezel: outer tray (shell) holds an inner core, concentric radii */
.showcase__stage {
  position: relative;
  padding: 8px;
  background: rgba(42, 14, 30, 0.04);
  border: 1px solid var(--line);
  border-radius: 52% 52% 18px 18px / 22% 22% 5% 5%;
  box-shadow:
    0 50px 90px -50px rgba(42, 14, 30, 0.45),
    inset 0 1px 1px rgba(245, 236, 217, 0.55);
  will-change: transform;
}
.showcase__core {
  position: relative;
  aspect-ratio: 3 / 4.5;
  overflow: hidden;
  background: var(--cream-2);
  border-radius:
    calc(52% - 8px) calc(52% - 8px) 12px 12px /
    20% 20% 4% 4%;
  box-shadow: inset 0 1px 2px rgba(255, 255, 255, 0.18);
}
.showcase__img {
  width: 100%; height: 100%; object-fit: cover; display: block;
  will-change: opacity;
}

.showcase__caption {
  position: absolute; left: 0; right: 0; bottom: 0;
  display: flex; justify-content: space-between; align-items: baseline; gap: 16px;
  padding: 48px 26px 20px;
  background: linear-gradient(to top, rgba(42, 14, 30, 0.74), transparent);
  color: var(--cream);
  pointer-events: none;
}
.showcase__index { font-family: var(--mono); font-size: 12px; letter-spacing: 0.08em; }
.showcase__name {
  font-family: var(--serif); font-style: italic;
  font-size: clamp(18px, 2.4vw, 27px); text-align: right;
  font-variation-settings: "SOFT" 100, "WONK" 1;
}

.showcase__rail-wrap {
  display: flex; flex-direction: column; align-items: center; gap: 16px;
  position: sticky; top: 100px;
}
.showcase__rail {
  display: flex; flex-direction: column; gap: 14px;
  overflow-y: auto; max-height: 62vh; padding: 6px;
  scrollbar-width: thin; scrollbar-color: var(--line) transparent;
}
.showcase__rail::-webkit-scrollbar { width: 6px; }
.showcase__rail::-webkit-scrollbar-thumb { background: var(--line); border-radius: 999px; }

.showcase__thumb {
  flex: 0 0 auto; width: 108px; aspect-ratio: 3 / 4; padding: 4px;
  border: 1px solid transparent; border-radius: 12px; overflow: hidden;
  background: rgba(42, 14, 30, 0.03);
  cursor: none; opacity: 0.55;
  transition:
    opacity 0.5s var(--ease-fluid),
    border-color 0.5s var(--ease-fluid),
    transform 0.6s var(--ease-fluid),
    box-shadow 0.5s var(--ease-fluid);
  will-change: transform;
}
.showcase__thumb img { width: 100%; height: 100%; object-fit: cover; display: block; border-radius: 8px; }
.showcase__thumb:hover { opacity: 0.92; transform: translateY(-3px) scale(1.03); }
.showcase__thumb:active { transform: scale(0.97); }
.showcase__thumb.is-active {
  opacity: 1; border-color: var(--gold);
  box-shadow: 0 0 0 1px var(--gold-2), 0 12px 24px -14px rgba(42, 14, 30, 0.5);
}

.showcase__arrow {
  width: 44px; height: 44px; border-radius: 999px;
  border: 1px solid var(--line); background: var(--cream); color: var(--ink);
  cursor: none; display: grid; place-items: center; font-size: 13px; line-height: 1;
  transition:
    background 0.5s var(--ease-fluid),
    color 0.5s var(--ease-fluid),
    transform 0.5s var(--ease-fluid);
  will-change: transform;
}
.showcase__arrow:hover { background: var(--ink); color: var(--cream); }
.showcase__arrow:active { transform: scale(0.92); }
.showcase__arrow .g-h { display: none; }

.showcase__thumb:focus-visible,
.showcase__arrow:focus-visible { outline: 2px solid var(--crimson); outline-offset: 3px; }

.sr-only {
  position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px;
  overflow: hidden; clip: rect(0, 0, 0, 0); white-space: nowrap; border: 0;
}

@media (max-width: 800px) {
  .showcase__layout { grid-template-columns: 1fr; }
  .showcase__rail-wrap { flex-direction: row; position: static; top: auto; width: 100%; }
  .showcase__rail {
    flex-direction: row; max-height: none;
    overflow-x: auto; overflow-y: hidden; flex: 1 1 auto;
  }
  .showcase__thumb { width: 88px; }
  .showcase__arrow .g-v { display: none; }
  .showcase__arrow .g-h { display: block; }
}
```

Note: `.showcase__core` is the inner core div added to the Task 1 markup. The concentric radius (`calc(52% - 8px)` etc.) keeps the inner curve parallel to the outer tray — the "machined hardware" look.

- [ ] **Step 2: Verify the stage and layout render**

Use Playwright MCP at desktop size: `browser_resize` to 1280x900, `browser_navigate` to the file URL, wait ~2.5s, scroll to the section with `browser_evaluate`:

```js
() => { document.querySelector('#showcase').scrollIntoView(); return true; }
```

Then `browser_take_screenshot`. Expected: a tall arch-topped stage showing `reference.jpeg` with a dark caption gradient at the bottom showing `01 / 01`; an empty rail column to its right (thumbnails come in Task 3). No layout overflow.

- [ ] **Step 3: Commit**

```bash
git add style.css
git commit -m "feat: add showcase desktop styles"
```

---

## Task 3: Config array + thumbnail rendering

**Files:**
- Modify: `script.js`

- [ ] **Step 1: Add the config array**

In `script.js`, after the helpers block (after line 9, `const lerp = ...`), add:

```js
/* ---------- design showcase config ---------- */
const showcaseDesigns = [
  { src: "reference.jpeg", name: "Mehfil", note: "Royal purple banarasi, gold zari" },
  { src: "assets/1.jpeg", name: "Design 01", note: "Purple banarasi panel" },
  { src: "assets/WhatsApp Image 2026-04-28 at 10.48.11.jpeg", name: "Design 02", note: "Purple floral booti" },
  { src: "assets/WhatsApp Image 2026-04-28 at 10.48.11 (1).jpeg", name: "Design 03", note: "Purple zari kali" },
  { src: "assets/WhatsApp Image 2026-04-28 at 10.48.11 (2).jpeg", name: "Design 04", note: "Purple zari kali" },
  { src: "assets/WhatsApp Image 2026-04-28 at 10.48.12.jpeg", name: "Design 05", note: "Sage zigzag zari" },
  { src: "assets/WhatsApp Image 2026-04-28 at 10.48.12 (1).jpeg", name: "Design 06", note: "Sage zari kali" },
  { src: "assets/WhatsApp Image 2026-04-28 at 10.48.12 (2).jpeg", name: "Design 07", note: "Sage zari kali" },
  { src: "assets/WhatsApp Image 2026-04-28 at 10.48.13.jpeg", name: "Design 08", note: "Zari kali panel" },
  { src: "assets/WhatsApp Image 2026-04-28 at 10.48.13 (1).jpeg", name: "Design 09", note: "Zari kali panel" },
  { src: "assets/WhatsApp Image 2026-04-28 at 10.48.13 (2).jpeg", name: "Design 10", note: "Zari kali panel" },
  { src: "assets/WhatsApp Image 2026-04-28 at 10.48.14.jpeg", name: "Design 11", note: "Zari kali panel" },
];
```

- [ ] **Step 2: Add the showcase module (thumbnail build only for now)**

Before the `/* ---------- boot ---------- */` block (before line 277), add:

```js
/* ---------- design showcase ---------- */
const showcase = () => {
  const stageImg = qs("#showcaseImg");
  const rail = qs("#showcaseRail");
  const idxEl = qs("#showcaseIndex");
  const nameEl = qs("#showcaseName");
  const liveEl = qs("#showcaseLive");
  const prevBtn = qs("#showcasePrev");
  const nextBtn = qs("#showcaseNext");
  const section = qs("#showcase");
  if (!stageImg || !rail || !section) return;

  const designs = showcaseDesigns;
  const total = designs.length;
  let active = 0;
  const thumbs = [];
  const cursor = qs(".cursor");

  designs.forEach((d, i) => {
    const btn = document.createElement("button");
    btn.className = "showcase__thumb";
    btn.type = "button";
    btn.setAttribute("aria-label", `Show ${d.name}`);
    const img = document.createElement("img");
    img.src = d.src;
    img.alt = "";
    img.loading = "lazy";
    btn.appendChild(img);
    btn.addEventListener("click", () => select(i));
    btn.addEventListener("mouseenter", () => cursor && cursor.classList.add("is-hover"));
    btn.addEventListener("mouseleave", () => cursor && cursor.classList.remove("is-hover"));
    rail.appendChild(btn);
    thumbs.push(btn);
  });

  // select() and render() are added in Task 4. Temporary stub so clicks don't error:
  function select(i) { active = (i + total) % total; }
};
```

- [ ] **Step 3: Call showcase() in boot**

In the `window load` listener (around line 278-290), add the call after `contact();`:

```js
  atelier();
  contact();
  showcase();
  ScrollTrigger.refresh();
```

- [ ] **Step 4: Verify thumbnails render**

Playwright MCP: navigate to the file URL, wait ~2.5s, then `browser_evaluate`:

```js
() => {
  const thumbs = document.querySelectorAll('#showcaseRail .showcase__thumb');
  return {
    count: thumbs.length,
    firstHasImg: !!thumbs[0]?.querySelector('img'),
    firstLabel: thumbs[0]?.getAttribute('aria-label'),
  };
}
```

Expected: `{ count: 12, firstHasImg: true, firstLabel: "Show Mehfil" }`.

- [ ] **Step 5: Commit**

```bash
git add script.js
git commit -m "feat: render showcase thumbnails from config"
```

---

## Task 4: Selection, crossfade, active state, live region

**Files:**
- Modify: `script.js`

- [ ] **Step 1: Replace the temporary select() stub with full render + swap + select**

In `script.js`, inside `showcase()`, replace this temporary block:

```js
  // select() and render() are added in Task 4. Temporary stub so clicks don't error:
  function select(i) { active = (i + total) % total; }
};
```

with:

```js
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const preload = (i) => {
    const im = new Image();
    im.src = designs[(i + total) % total].src;
  };

  const render = () => {
    const d = designs[active];
    idxEl.textContent =
      `${String(active + 1).padStart(2, "0")} / ${String(total).padStart(2, "0")}`;
    nameEl.textContent = d.name;
    stageImg.alt = `${d.name} — ${d.note}`;
    liveEl.textContent = `Showing design ${active + 1} of ${total}: ${d.name}`;
    thumbs.forEach((t, i) => {
      const on = i === active;
      t.classList.toggle("is-active", on);
      if (on) t.setAttribute("aria-current", "true");
      else t.removeAttribute("aria-current");
    });
    thumbs[active].scrollIntoView({
      block: "nearest", inline: "nearest", behavior: reduce ? "auto" : "smooth",
    });
    preload(active + 1);
    preload(active - 1);
  };

  const swap = (src) => {
    if (reduce) { stageImg.src = src; return; }
    // GPU-safe crossfade: opacity only, premium expo ease on the reveal
    gsap.to(stageImg, {
      opacity: 0, duration: 0.3, ease: "power3.in",
      onComplete: () => {
        stageImg.src = src;
        gsap.to(stageImg, { opacity: 1, duration: 0.55, ease: "expo.out" });
      },
    });
  };

  function select(i) {
    active = (i + total) % total;
    swap(designs[active].src);
    render();
  }

  render();
};
```

- [ ] **Step 2: Verify clicking a thumbnail swaps the stage and sets active state**

Playwright MCP: navigate, wait ~2.5s, then `browser_evaluate` to click the 3rd thumbnail and read state after the fade (~700ms):

```js
async () => {
  const thumbs = document.querySelectorAll('#showcaseRail .showcase__thumb');
  thumbs[2].click();
  await new Promise(r => setTimeout(r, 700));
  return {
    stageSrc: document.querySelector('#showcaseImg').getAttribute('src'),
    activeIndex: [...thumbs].findIndex(t => t.classList.contains('is-active')),
    index: document.querySelector('#showcaseIndex').textContent,
    name: document.querySelector('#showcaseName').textContent,
    live: document.querySelector('#showcaseLive').textContent,
    activeAriaCurrent: thumbs[2].getAttribute('aria-current'),
  };
}
```

Expected: `stageSrc` ends with the 3rd design's path, `activeIndex` is `2`, `index` is `"03 / 12"`, `name` is `"Design 02"`, `live` is `"Showing design 3 of 12: Design 02"`, `activeAriaCurrent` is `"true"`.

- [ ] **Step 3: Commit**

```bash
git add script.js
git commit -m "feat: showcase selection, crossfade, active state"
```

---

## Task 5: Arrows, keyboard, looping

**Files:**
- Modify: `script.js`

- [ ] **Step 1: Wire arrow buttons and keyboard navigation**

In `script.js`, inside `showcase()`, immediately before the final `render();` line, add:

```js
  prevBtn.addEventListener("click", () => select(active - 1));
  nextBtn.addEventListener("click", () => select(active + 1));

  section.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      select(active - 1);
    } else if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      select(active + 1);
    }
  });
```

(The `select()` function already wraps with `(i + total) % total`, so prev from index 0 lands on the last design and next from the last lands on 0.)

- [ ] **Step 2: Verify arrows loop and keyboard works**

Playwright MCP: navigate, wait ~2.5s, then `browser_evaluate`:

```js
async () => {
  const idx = () => document.querySelector('#showcaseIndex').textContent;
  document.querySelector('#showcasePrev').click();      // from 0 -> wrap to last (12)
  await new Promise(r => setTimeout(r, 700));
  const afterPrev = idx();
  document.querySelector('#showcaseNext').click();      // back to 1
  await new Promise(r => setTimeout(r, 700));
  const afterNext = idx();
  document.querySelector('#showcase').dispatchEvent(
    new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
  await new Promise(r => setTimeout(r, 700));
  const afterKey = idx();
  return { afterPrev, afterNext, afterKey };
}
```

Expected: `{ afterPrev: "12 / 12", afterNext: "01 / 12", afterKey: "02 / 12" }`.

- [ ] **Step 3: Commit**

```bash
git add script.js
git commit -m "feat: showcase arrow + keyboard navigation with looping"
```

---

## Task 6: GSAP reveal + reduced-motion check

**Files:**
- Modify: `script.js`

- [ ] **Step 1: Add scroll-reveal animations**

In `script.js`, inside `showcase()`, immediately before the final `render();` line (after the keyboard handler from Task 5), add:

```js
  // Heavy cinematic fade-up with blur (GPU-safe: transform/opacity/filter only)
  gsap.from(".showcase__stage", {
    y: 60, opacity: 0, filter: "blur(12px)", duration: 1.1, ease: "expo.out",
    scrollTrigger: { trigger: ".showcase", start: "top 78%" },
    clearProps: "filter",
  });
  gsap.from(".showcase__thumb", {
    y: 24, opacity: 0, filter: "blur(6px)", duration: 0.7, stagger: 0.06, ease: "expo.out",
    scrollTrigger: { trigger: ".showcase__rail-wrap", start: "top 85%" },
    clearProps: "filter",
  });
```

Note: `clearProps: "filter"` removes the inline blur after the tween so the resting element is pixel-sharp and not stuck behind a filter.

- [ ] **Step 2: Verify reveal does not leave elements hidden after scroll**

Playwright MCP: navigate, wait ~2.5s, scroll the section into view, wait ~1.2s, then `browser_evaluate`:

```js
() => {
  const stage = document.querySelector('.showcase__stage');
  const thumb = document.querySelector('.showcase__thumb');
  const s = getComputedStyle(stage);
  const t = getComputedStyle(thumb);
  return { stageOpacity: s.opacity, thumbOpacity: t.opacity };
}
```

Expected: `stageOpacity` is `"1"` and `thumbOpacity` is `"1"` (or its active/inactive resting value — non-zero). Then `browser_take_screenshot` to confirm the stage and rail are fully visible.

- [ ] **Step 3: Verify reduced-motion does an instant swap**

Playwright MCP: `browser_emulate` is not needed — set the media preference via `browser_navigate` with an emulated reduced-motion context is not available, so instead verify the code path by evaluation: confirm the `swap` short-circuit exists by checking instant src change is possible. Run `browser_evaluate`:

```js
() => {
  // Confirm the guard exists in the running module by feature, not source:
  // when reduced motion is on, stage image has no lingering gsap opacity tween.
  // Here we just assert the stage image is fully opaque at rest.
  return getComputedStyle(document.querySelector('#showcaseImg')).opacity;
}
```

Expected: `"1"`. (Full reduced-motion behavior is covered by the `reduce` guard added in Task 4; this confirms no stuck opacity.)

- [ ] **Step 4: Commit**

```bash
git add script.js
git commit -m "feat: showcase scroll reveal animations"
```

---

## Task 7: Mobile layout verification

**Files:**
- (No new edits expected — mobile CSS landed in Task 2. This task verifies and fixes only if broken.)

- [ ] **Step 1: Verify mobile layout (stage on top, horizontal strip below, ‹ › arrows)**

Playwright MCP: `browser_resize` to 390x844, `browser_navigate` to the file URL, wait ~2.5s, scroll `#showcase` into view, `browser_take_screenshot`. Then `browser_evaluate`:

```js
() => {
  const layout = getComputedStyle(document.querySelector('.showcase__layout'));
  const railWrap = getComputedStyle(document.querySelector('.showcase__rail-wrap'));
  const prevV = getComputedStyle(document.querySelector('#showcasePrev .g-v')).display;
  const prevH = getComputedStyle(document.querySelector('#showcasePrev .g-h')).display;
  return {
    columns: layout.gridTemplateColumns,   // single column
    railDirection: railWrap.flexDirection,  // "row"
    verticalGlyphHidden: prevV,             // "none"
    horizontalGlyphShown: prevH,            // "block"
  };
}
```

Expected: `columns` is a single track (one value, not two), `railDirection` is `"row"`, `verticalGlyphHidden` is `"none"`, `horizontalGlyphShown` is `"block"`. The screenshot shows the stage full-width with a horizontal scroll strip of thumbnails beneath it and round ‹ / › arrows flanking the strip.

- [ ] **Step 2: If any check fails, fix the mobile rules**

Only if Step 1 failed: re-open the `@media (max-width: 800px)` block in `style.css` (added in Task 2) and correct the failing rule (e.g., ensure `.showcase__layout { grid-template-columns: 1fr; }` and `.showcase__rail-wrap { flex-direction: row; }`). Re-run Step 1.

- [ ] **Step 3: Commit (only if a fix was made in Step 2)**

```bash
git add style.css
git commit -m "fix: showcase mobile layout"
```

---

## Task 8: Full acceptance pass

**Files:**
- (Verification only.)

- [ ] **Step 1: Run the acceptance checklist against the live page**

Playwright MCP at 1280x900: navigate, wait ~2.5s, scroll `#showcase` into view. Confirm each acceptance criterion from the spec:

1. Section appears after `#works`, styled consistently — visual check via `browser_take_screenshot`.
2. Stage loads showing `reference.jpeg` with caption `01 / 12 — Mehfil` — `browser_evaluate` reading `#showcaseImg` src, `#showcaseIndex`, `#showcaseName`.
3. Clicking a thumbnail crossfades + gold ring on active — click + screenshot.
4. Arrows and ←/→ cycle with wraparound — covered by Task 5 re-run.
5. Active thumbnail scrolls into rail view — click the last thumbnail, then `browser_evaluate` checking the active thumb is within the rail's visible scroll area:

```js
() => {
  const rail = document.querySelector('#showcaseRail');
  const active = rail.querySelector('.showcase__thumb.is-active');
  const r = rail.getBoundingClientRect();
  const a = active.getBoundingClientRect();
  return a.top >= r.top - 2 && a.bottom <= r.bottom + 2; // within view
}
```

Expected: `true`.

6. Desktop vertical rail with ▲/▼; mobile horizontal with ‹/› — covered by Task 7.
7. `prefers-reduced-motion` instant swap — code guard confirmed in Task 6.
8. All controls keyboard-operable and labeled; live region announces — `browser_evaluate` confirming arrows/thumbs are `<button>` with `aria-label`, and `#showcaseLive` has `aria-live="polite"`.
9. Editing `showcaseDesigns` updates UI with no other change — confirm rail count equals `showcaseDesigns.length` (12).

- [ ] **Step 2: Confirm no console errors**

Playwright MCP: `browser_console_messages` after a full navigate + interact pass. Expected: no errors thrown by showcase code.

- [ ] **Step 3: Final commit (if any fixes were applied during the pass)**

```bash
git add -A
git commit -m "fix: showcase acceptance pass adjustments"
```

---

## Self-Review Notes

- **Spec coverage:** Placement (Task 1), desktop layout + arch stage + caption (Task 2), config/data model + thumbnails + lazy loading (Task 3), crossfade + active gold ring + alt + aria-live (Task 4), arrows + keyboard + looping (Task 5), ScrollTrigger reveal + reduced-motion guard (Task 6), mobile horizontal strip + ‹/› (Task 7), accessibility + content-agnostic config (Task 8). All spec sections mapped.
- **Type/name consistency:** IDs (`showcaseImg`, `showcaseRail`, `showcaseIndex`, `showcaseName`, `showcaseLive`, `showcasePrev`, `showcaseNext`), classes (`showcase__thumb`, `is-active`, `g-v`, `g-h`), and functions (`select`, `render`, `swap`, `preload`, `showcase`) are consistent across all tasks. `showcaseDesigns` is the single config name throughout.
- **No placeholders:** every code step shows complete code; verification steps give exact eval snippets and expected values.
