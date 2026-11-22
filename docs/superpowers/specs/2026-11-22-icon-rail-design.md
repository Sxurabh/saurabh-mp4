# Header alignment and icon rail — short design

## Intent
Remove the booking button, align the DJ name and role to the left edge of the iPod body, and add Instagram, email, and About me icons at the right edge of the iPod body. The About me behavior is intentionally deferred — only its icon is added now.

## Goals
- Name/role left edge and icon row right edge match the scaled iPod body edges at every viewport.
- Instagram and email icons are functional links using `site.links` and `site.email` from `lib/site.ts`.
- About me icon is visible but inert until the user gives instructions.
- Preserve the single-screen, no-scroll layout and packet-provided iPod design.

## Non-goals
- Changing the simulator's internal menu.
- Defining About me content or behavior.
- Changing music discovery or playback.

## Constraints
- Next.js 16 App Router, existing `ipod-simulator` package, no new dependencies.
- `app/components/IPodPlayer.tsx` is the only client component for the player.
- The fitter owns `--ipod-scale`; layout must derive from it so alignment holds while resizing.

## Approaches
1. **Shared scale variable on a device frame wrapper (picked):** move the scale from the stage to a wrapper that contains both the header and the stage. Header width becomes `415px * scale`, centered inside the `439px * scale` stage footprint; its left and right edges therefore coincide with the iPod body. Icon sizes use `max(min-size, size * scale)` to stay tappable on small screens. Keeps the package untouched and needs no measurement beyond the existing fitter.
2. **Scale the header with the same CSS transform as the iPod:** simpler CSS but makes icons and text unusably tiny on short screens. Rejected.
3. **Absolutely position icons over the device:** would cover the artwork/click wheel and break the clean design. Rejected.

## Design
- `IPodPlayer` accepts the header as `children` and renders `<div className="device-frame">` with the fitter ref; `--ipod-scale` is set there.
- `.topbar` is `width: calc(415px * var(--ipod-scale)); margin: 0 auto; display: flex; justify-content: space-between`, with the name/role block on the left and a three-icon nav on the right.
- Inline SVGs for Instagram, envelope, and person; each in a 26–36 px round target with `aria-label`, visible focus ring, and `rel="noopener noreferrer"` on the external link.
- The About me control is a `<button type="button">` with no handler — a visible placeholder to be wired up later.
- Remove `.book-button` CSS and its short-screen override; shrink icon targets on short screens so the header still fits.
