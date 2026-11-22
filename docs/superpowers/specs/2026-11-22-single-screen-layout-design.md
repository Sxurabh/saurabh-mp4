# Single-screen iPod layout — short design

## Intent
Make the DJ page a single, non-scrollable screen. The `ipod-simulator` widget stays visually identical to the npm package; the surrounding page becomes a slim frame around it. About me / Contact are removed from the side column (adding them inside the simulator is explicitly out of scope).

## Goals
- No vertical or horizontal scrolling at any common phone, tablet, or desktop viewport.
- The whole iPod (body) is visible and centered, scaled down only as much as the viewport requires.
- Smooth on mobile: no scroll listeners, no runtime layout measurement, no new dependencies.
- Keep the booking mailto button and the "Not affiliated with Apple" disclaimer.
- Keep working on all screen sizes including short landscape phones and notches/safe areas.

## Non-goals
- Changing the iPod's internal menu or shipping patched package code.
- Adding About me / Contact screens anywhere.
- Changing how music is discovered or served.

## Constraints
- Next.js 16 App Router, existing `ipod-simulator` npm package, no new dependencies.
- The package renders a fixed 415×692 px body plus a reflection below it; its internal container queries key off the host element's width.
- Keep the `"use client"` boundary in `app/components/IPodPlayer.tsx` unchanged.

## Approaches
1. **CSS transform scale (picked):** give the host its native 415×692 size, scale it with a CSS `min()` factor derived from `100vw`/`100dvh`, and clip the reflection with a fixed-size stage. Pure CSS, no JS, crisp at every size, and the package stays untouched.
2. **Patch the package bundle:** would allow a fluid internal layout, but forks upstream code and breaks future updates. Rejected.
3. **Responsive two-column layout:** cannot guarantee a scroll-free screen on short viewports. Rejected.

## Design
- `main` is a column flex container locked to `100dvh` with `overflow: hidden` on `html`/`body`.
- Compact header: DJ name, role (hidden on very short screens), and a small "Book a show" mailto button.
- Stage: `width: (415 + 24) * scale`, `height: (692 + 190 + 24) * scale`, with 12 px of scaled padding on every side. The package's visible shadow extends 176 px below the body (measured), so 190 px reserves it fully without waste. Nothing is clipped. Host is transformed with `transform-origin: top left`.
- `scale = min(1, (100vw - 24px) / 439, (100dvh - chrome) / 906)`, where `chrome` is roughly 128 px normally and 76 px on short screens. Safe-area insets are included in `chrome`.
- Footer: one-line Apple disclaimer; a conditional "Add your MP3s to public/music/" tip appears only when the library is empty.
- `lib/site.ts` keeps the existing copy fields; only rendering changes.
