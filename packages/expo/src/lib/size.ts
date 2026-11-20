/**
 * The size scale every sized control shares, the same rungs as
 * `@horon-ai/react` `lib/size.ts`:
 *
 * - control height: sm 32px, md 40px, lg 48px
 * - control text: sm `label-md` / `body-sm`, md `label-lg` / `body-md`, lg `label-lg` / `body-lg`
 * - icon: sm 16px, md 16-20px, lg 20-24px
 * - selection marks (checkbox, radio): sm 16px, md 20px, lg 24px
 */
export type ControlSize = "sm" | "md" | "lg";

/** Control heights per rung, in points. */
export const controlHeight: Record<ControlSize, number> = { sm: 32, md: 40, lg: 48 };

/** The smallest target a fingertip hits reliably (Apple HIG, Material). */
export const TOUCH_TARGET = 44;

/**
 * The `hitSlop` that grows a control of `width` × `height` to the 44pt touch
 * target without changing what it paints. Returns `undefined` when touch is off
 * or the control is already large enough on both axes.
 */
export function touchSlop(touch: boolean, height: number, width = TOUCH_TARGET) {
  if (!touch) return undefined;
  const vertical = Math.max(0, (TOUCH_TARGET - height) / 2);
  const horizontal = Math.max(0, (TOUCH_TARGET - width) / 2);
  if (vertical === 0 && horizontal === 0) return undefined;
  return { top: vertical, bottom: vertical, left: horizontal, right: horizontal };
}

/** The opacity a disabled control paints at, `opacity-40` in react. */
export const DISABLED_OPACITY = 0.4;
