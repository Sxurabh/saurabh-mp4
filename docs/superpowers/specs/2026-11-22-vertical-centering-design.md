# Center the iPod vertically — short design

## Intent
Make the iPod body sit in the true vertical middle of the viewport with generous space above it, instead of being pulled upward by the header/footer stack.

## Goals
- iPod body center matches the viewport center at every tested size.
- Clear space between the header and the top of the iPod, and between the shadow and the footer.
- Header edges remain aligned to the iPod body; icons and links unchanged.
- No scrolling, full shadow visible.

## Non-goals
- Changing the header icons, copy, music library, or simulator.

## Constraints
- `--ipod-scale` on `.device-frame` continues to drive all sizing; no JS measurement added.
- The package's visible shadow extends 880 px below the stage top at scale 1 (measured), so it must be reserved in the layout.

## Approaches
1. **Three-row grid with a relative stage offset (picked):** `main` becomes `grid-template-rows: 1fr auto 1fr`; the header sits at the bottom of row 1, the footer at the bottom of row 3, and the stage is nudged down by `(906/2 - 358) = 95px * scale` so the 692 px body — not the shadow footprint — is centered. Increase the chrome allowance so the shadow clears the footer. Pure CSS, no new dependencies.
2. **Bigger flex gap only:** simple, but because the whole stack is centered it shifts the iPod only halfway and never reaches center. Rejected.
3. **Absolute positioning of every region:** would work but duplicates the fitter's sizing logic in three places and is fragile on safe-area insets. Rejected.

## Design
- `main { display: grid; grid-template-rows: 1fr auto 1fr; justify-items: center; align-items: center; }`; remove the old flex `gap`.
- `.device-frame { display: contents; }` so the header and stage become grid items while still inheriting the fitter's `--ipod-scale`.
- `.topbar { grid-row: 1; align-self: end; }`; `.stage { grid-row: 2; position: relative; top: calc(95px * var(--ipod-scale)); }`; `footer { grid-row: 3; align-self: end; }`.
- `--chrome` becomes 184 px (118 px on short screens) so the scaled footprint plus shadow, header, and footer fit without clipping. The fitter math stays unchanged.
- Tests assert body center within 3 px of viewport center, header gap ≥ 20 px (≥ 14 px short), shadow end above the footer, plus all prior no-scroll/alignment/icon checks.
