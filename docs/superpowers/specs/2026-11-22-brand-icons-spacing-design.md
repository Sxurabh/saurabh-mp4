# Brand icons and header spacing — short design

## Intent
Give the header more breathing room above the iPod, replace the two outline icons with real colored brand glyphs (Instagram, iCloud Mail), remove the About me placeholder, and remove the circular outline around each icon.

## Goals
- Visible vertical space between the name/role/icon row and the top of the iPod at all viewports.
- Instagram icon uses the brand gradient; iCloud email icon uses Apple Mail blue.
- Only two icons remain, with no outer circle, border, or background.
- Preserve single-screen no-scroll behavior and exact left/right alignment with the iPod body.

## Non-goals
- About me behavior (button removed entirely).
- Changes to the simulator, music library, or footer.

## Constraints
- Next.js 16 App Router, no new dependencies, inline SVG only.
- Shared `--ipod-scale` on `.device-frame` continues to drive header width and alignment.
- Short landscape screens must keep everything inside the viewport.

## Approaches
1. **Increase the frame's flex gap and swap inline SVGs (picked):** one CSS gap change plus two SVG replacements; no new layout system, package, or remote assets.
2. **Add margin-top to the stage:** equivalent visually but breaks the shared-frame layout symmetry and needs extra overrides on short screens. Rejected.
3. **Use an icon font or external images:** adds dependencies/network requests and loses crisp scaling. Rejected.

## Design
- `.device-frame` gap becomes `clamp(14px, 2.5dvh, 26px)`; `@media (max-height: 560px)` reduces it to 10px.
- `.icon-button` drops border, border-radius, and background; hover changes opacity only. Icon size stays scale-derived with a 26 px minimum (22 px on short screens).
- Instagram: gradient rounded square with white camera outline and dot. iCloud Mail: blue gradient rounded square with white envelope. Both inline SVG with `aria-hidden` and `aria-label` on the link.
- Remove the About me `<button>` from `app/page.tsx`.
