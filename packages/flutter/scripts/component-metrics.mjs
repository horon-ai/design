/**
 * Numbers that the web token scales do not carry, but the Flutter components
 * need as a single source.
 *
 * Two kinds live here:
 *
 * 1. `componentRadius` - the radius a component actually renders, named after
 *    the component it serves. It is NOT `scales.ts`'s `radiusRole`, which is
 *    the web map (control 12, card 14, panel 20, pill 9999). The values here
 *    are the classes the components really use, so `card` is 12 (`rounded-md`,
 *    `card.tsx`) and `panel` is 14 (`rounded-lg`, `dialog.tsx`/`sheet.tsx`).
 *    They match `mobile/lib/src/theme/tokens.dart` `HoronRadiusRole`, which the
 *    Flutter package replaces later; six roles, not four.
 *
 * 2. `componentMetrics` - one-off sizes (button heights, checkbox box, menu
 *    width, sidebar widths). They are not on the 4px space scale, so without a
 *    named home they would be written as literals inside the components.
 *
 * This file is the mapping layer for the generator side only. The token
 * package's `src/*.ts` values stay frozen; nothing here edits them.
 */

/** Radius by the component it serves, in logical pixels. */
export const componentRadius = Object.freeze({
  /** `button.tsx` `rounded-md`. */
  control: 12,
  /** `input.tsx` `rounded-sm`. */
  input: 8,
  /** `card.tsx` `rounded-md`. */
  card: 12,
  /** `dialog.tsx` / `sheet.tsx` `rounded-lg`. */
  panel: 14,
  /** `bubble.tsx` `rounded-lg`; the squared tail corner is the `sm` radius. */
  bubble: 14,
  /** `chip.tsx` `rounded-full`. */
  pill: 9999,
});

/** Per-component sizes in logical pixels, keyed by the component slug. */
export const componentMetrics = Object.freeze({
  button: Object.freeze({
    heightXs: 26,
    heightSm: 32,
    height: 37,
    heightLg: 44,
    heightIcon: 32,
    heightIconXs: 24,
    heightIconSm: 28,
    heightIconLg: 36,
  }),
  checkbox: Object.freeze({ size: 18, radius: 5 }),
  textarea: Object.freeze({ minHeight: 88 }),
  menu: Object.freeze({ width: 200 }),
  sidebar: Object.freeze({ expanded: 256, collapsed: 56 }),
});

/**
 * Android elevation levels for the three web shadow rungs. The CSS box shadows
 * in `scales.ts` describe iOS-style offsets and blur; a Material surface needs
 * the elevation level instead, and the two do not derive from each other.
 */
export const shadowElevation = Object.freeze({ sm: 1, md: 4, lg: 8 });
