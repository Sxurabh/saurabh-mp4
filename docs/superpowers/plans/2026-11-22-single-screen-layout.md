# Single-screen iPod layout Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the DJ site a single scroll-free screen with the unmodified iPod scaled to fit any viewport and the side About/Contact column removed.

**Architecture:** Pure CSS viewport-locked column layout. A stage element reserves the scaled iPod footprint plus its measured 190 px shadow/reflection allowance and 12 px padding on each side; the host keeps its native 415×692 size and is transformed by a CSS `min()` scale factor. The server page renders only header, stage, and disclaimer.

**Tech Stack:** Next.js 16 App Router, TypeScript, plain CSS, `ipod-simulator` npm package.

**Spec:** `docs/superpowers/specs/2026-11-22-single-screen-layout-design.md`

## Global Constraints
- Do not modify `node_modules/ipod-simulator` or add dependencies.
- Keep `app/components/IPodPlayer.tsx` as the only `"use client"` component for the player.
- Keep the Apple non-affiliation disclaimer visible.
- No JavaScript measurement or scroll listeners; scaling is CSS-only.

## Review Focus
- Short landscape phones: iPod must shrink enough that no scrollbar appears.
- Safe-area insets / mobile browser chrome: `100dvh` and `env(safe-area-inset-*)` must not cause overflow.
- Reflection below the iPod must be clipped, not create scroll height.
- Scaled touch targets must stay usable; header must not steal too much height.
- Empty library must still show a helpful tip without breaking the single-screen rule.

---

### Task 1: Replace two-column page with viewport-locked single screen

**Files:**
- Modify: `app/page.tsx`
- Modify: `app/globals.css`

**Interfaces:**
- Consumes: `IPodPlayer` props `{ songs: Song[]; playlists: Playlist[]; artists: Artist[] }` from `@/app/components/IPodPlayer`; `readLibrary()` from `@/lib/music`; `site` from `@/lib/site`.
- Produces: a page whose document scroll height never exceeds the viewport height at the tested sizes.

- [ ] **Step 1: Rewrite `app/page.tsx`**

Render exactly three regions inside `<main>`:
1. `<header className="topbar">` with `<h1>` = `{site.name}` + `<span className="accent">.</span>`, `<p className="role">{site.role}</p>`, and `<a className="book-button" href={`mailto:${site.email}`}>Book a show</a>`.
2. `<section className="stage" aria-label="Interactive iPod music player">` containing `<IPodPlayer songs={songs} playlists={playlists} artists={artists} />`.
3. `<footer>` with the Apple non-affiliation disclaimer and, only when `songs.length === 0`, a short "Add your MP3s to `public/music/`" tip.

Remove the entire intro hero, the `.info` column, the About/Shows/Contact sections, the two action buttons, and the `next`/`ipod-simulator` credit link. Keep the `metadata` in `app/layout.tsx` untouched.

- [ ] **Step 2: Rewrite `app/globals.css`**

Implement:
- `html, body { height: 100%; overflow: hidden; }`, `body { min-height: 100dvh; }`.
- `:root` custom properties: `--ipod-w: 415px`, `--ipod-h: 692px`, `--chrome: 104px`, `--scale: min(1, calc((100vw - 24px) / 415), calc((100dvh - var(--chrome)) / 692))`.
- `main { height: 100dvh; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: clamp(6px, 1.5dvh, 14px); padding: calc(6px + env(safe-area-inset-top, 0px)) 12px calc(6px + env(safe-area-inset-bottom, 0px)); }`.
- `.topbar { width: min(100%, 415px); display: flex; align-items: center; justify-content: space-between; gap: 12px; flex: none; }`; `h1` font-size `clamp(22px, 5vw, 34px)`, `.role` `clamp(11px, 2.6vw, 15px)`, `.book-button` pill with min-height 36px.
- `.stage { width: calc(439px * var(--ipod-scale)); height: calc(906px * var(--ipod-scale)); flex: none; position: relative; }` (no clipping: 415 body + 24 padding wide, 692 body + 190 measured shadow + 24 padding tall).
- `ipod-simulator { position: absolute; top: calc(12px * var(--ipod-scale)); left: calc(12px * var(--ipod-scale)); display: block; width: 415px; height: 692px; transform: scale(var(--ipod-scale)); transform-origin: top left; }`.
- `footer { flex: none; text-align: center; color: #86868b; font-size: clamp(9px, 2.2vw, 11px); line-height: 1.4; }`.
- `@media (max-height: 560px)` sets `--chrome: 56px`, hides `.role`, and reduces the header/footer footprint.
- Keep `:focus-visible` outlines and a `prefers-reduced-motion: reduce` transition override.

- [ ] **Step 3: Verify build and lint**

Run: `npm run lint && npm run build`
Expected: both exit 0 with no TypeScript errors.

- [ ] **Step 4: Verify in a real browser at seven viewports**

Run the existing Playwright-core check from `/private/var/folders/mr/dtghysds5xv1lqp70zy2hfvh0000gn/T/opencode/pw/` against `http://localhost:3000/` at 320×568, 375×667, 390×844, 430×932, 768×1024, 1280×800, and 667×375. For each assert:
- `document.documentElement.scrollHeight <= window.innerHeight + 1`
- `document.documentElement.scrollWidth <= window.innerWidth + 1`
- `ipod-simulator` has a non-empty bounding rect fully inside the viewport
- `.book-button` and `footer` are visible
- zero page errors and zero console errors

Expected: all assertions pass.

- [ ] **Step 5: Commit**

```bash
git add app/page.tsx app/globals.css docs/superpowers/specs/2026-11-22-single-screen-layout-design.md docs/superpowers/plans/2026-11-22-single-screen-layout.md
git commit -m "feat: fit iPod site into one scroll-free responsive screen"
```
