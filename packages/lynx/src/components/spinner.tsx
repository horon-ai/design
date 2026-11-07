import { useMemo } from "@lynx-js/react";

import { useHoronTheme } from "../provider";
import { cn } from "../lib/cn";

/**
 * Named spinner rungs, in 14/16/24/32px (`xs`, `sm`, `md`, `lg`); a raw number is also
 * accepted for one-off sizes.
 */
export type SpinnerSize = "xs" | "sm" | "md" | "lg";

/** Props of {@link Spinner}: a rung or pixel size, the accessible label, and extra classes. */
export type SpinnerProps = {
  /** Named size, or a pixel size for the one-off spinners in agent rows (12, 15, 20). @default "sm" */
  size?: SpinnerSize | number;
  /** Accessible name announced while spinning (`role="status"`). @default "Loading" */
  label?: string;
  /** Extra classes on the glyph; `animate-spin` and `shrink-0` are always applied. */
  className?: string;
};

/** React sized the ring through `size-3.5|4|6|8`; the Lynx glyph takes px instead. */
const sizePx: Record<SpinnerSize, number> = { xs: 14, sm: 16, md: 24, lg: 32 };

/**
 * Figma `Spinner` (Loading 109:733): a 10% ink ring with a quarter ink arc, 11% stroke.
 *
 * Lynx paints SVG from a string (`<svg content>`) and that string cannot read CSS
 * variables, so the two strokes are substituted with the active scheme's hex from
 * {@link useHoronTheme} instead of the `stroke-*` classes React used. Sizes are
 * fixed pixel rungs (`xs` 14px, `sm` 16px, `md` 24px, `lg` 32px) or a raw number;
 * it never shrinks, spins for as long as it is mounted, and announces `label`
 * through `accessibility-role-description="progressbar"`, the closest Lynx role to
 * React's `role="status"`.
 *
 * @example
 * ```tsx
 * import { Spinner } from "@horon-ai/lynx";
 *
 * function Saving() {
 *   return (
 *     <view className="flex flex-row items-center gap-2">
 *       <Spinner size="sm" label="Saving" />
 *       <text className="text-text-secondary">Saving</text>
 *     </view>
 *   );
 * }
 * ```
 */
export function Spinner({ size = "sm", label = "Loading", className }: SpinnerProps) {
  const theme = useHoronTheme();
  const px = typeof size === "number" ? size : sizePx[size];

  const content = useMemo(() => {
    const track = theme.color("overlay-ink-10");
    const arc = theme.color("interactive-primary");
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="${px}" height="${px}"><circle cx="50" cy="50" r="44.5" fill="none" stroke="${track}" stroke-width="11"/><path d="M50 5.5A44.5 44.5 0 0 1 94.5 50" fill="none" stroke="${arc}" stroke-width="11"/></svg>`;
  }, [px, theme]);

  return (
    <view className={cn("shrink-0 animate-spin", className)} style={{ width: `${px}px`, height: `${px}px` }}>
      <svg
        content={content}
        style={{ width: `${px}px`, height: `${px}px` }}
        accessibility-element
        accessibility-label={label}
        accessibility-role-description="progressbar"
      />
    </view>
  );
}
