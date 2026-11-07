import type { CSSProperties } from "@lynx-js/types";

import { cn } from "../lib/cn";
import { useHoronTheme } from "../provider";
import { LiquidGlass } from "./liquid-glass";

/**
 * Props of the React elements this port replaces, keyed by React's own tag. Each entry lists only what
 * the Lynx wrapper can honour, so the mapping from a DOM element to its Lynx counterpart is explicit
 * instead of implied.
 */
type PortedElementProps = {
  /** React's `div`; on Lynx every block is a `view`. */
  div: { className?: string; style?: CSSProperties };
};

/**
 * Props for {@link Skeleton}. React omitted `className` from the `div` props and declared it itself;
 * Lynx has no DOM, so the same omission applies to {@link PortedElementProps} and `style` is the one
 * remaining element prop that carries meaning. Data attributes have no Lynx equivalent.
 */
export type SkeletonProps = Omit<PortedElementProps["div"], "className"> & {
  /**
   * `block` has the Figma 6px radius, `pill` is fully round (avatars, buttons).
   * @default "block"
   */
  shape?: "block" | "pill";
  /** Classes that give the placeholder its size, such as `h-2 w-40`. */
  className?: string;
};

/**
 * The sweep highlight: a 200%-wide gradient whose 50% stop is the only moving part, as React's
 * `bg-[linear-gradient(…)]` class drew it.
 */
const shimmerGradient = (highlight: string): string => `linear-gradient(90deg, transparent 30%, ${highlight} 50%, transparent 70%)`;

/**
 * A 7% ink placeholder; size it with classes.
 *
 * The block is hidden from assistive tech and shimmers with a translucent highlight, so it shows
 * layout while content loads without being read out. React expressed the sweep as a `bg-[linear-gradient(…)]`
 * class with a `dark:` variant; Lynx has no variant engine here and its `<svg>`-style theme classes cannot
 * build an arbitrary gradient, so the gradient is an inline style whose highlight alpha comes from the
 * active scheme, and the `shimmer` keyframe runs through Lynx's longhand animation properties.
 *
 * @example
 * ```tsx
 * import { Skeleton } from "@horon-ai/lynx";
 *
 * function Example() {
 *   return (
 *     <view className="flex flex-row items-center gap-3">
 *       <Skeleton shape="pill" className="size-9" />
 *       <Skeleton className="h-3 w-48" />
 *     </view>
 *   );
 * }
 * ```
 */
export function Skeleton({ shape = "block", className, style }: SkeletonProps) {
  const theme = useHoronTheme();
  const highlight = theme.scheme === "dark" ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.4)";

  return (
    <view
      accessibility-elements-hidden
      className={cn("bg-overlay-ink-7", shape === "pill" ? "rounded-full" : "rounded-xs", className)}
      style={{
        backgroundImage: shimmerGradient(highlight),
        backgroundSize: "200% 100%",
        backgroundRepeat: "no-repeat",
        animationName: "shimmer",
        animationDuration: "1.6s",
        animationTimingFunction: "linear",
        animationIterationCount: "infinite",
        ...style,
      }}
    />
  );
}

/**
 * Props for {@link SkeletonCard}.
 */
export type SkeletonCardProps = {
  /**
   * Placeholder arrangement: `row` an avatar with two lines, `card` a heading, three lines and a
   * button, `text` three lines only.
   * @default "row"
   */
  type?: "row" | "card" | "text";
  /**
   * `solid` (default) is an opaque surface card with a default border; `glass` is the thick glass card.
   * @default "solid"
   */
  surface?: "solid" | "glass";
  /** Classes merged onto the card. */
  className?: string;
};

/** The two lines beside the avatar in a `row` placeholder. */
const ROW_LINES = ["h-2.5 w-[140px]", "h-2 w-[200px]"];

/** A `card` placeholder: a heading, three body lines and a button-sized pill. */
const CARD_BARS = ["h-3 w-[120px]", "h-2 w-[248px]", "h-2 w-[220px]", "h-2 w-[160px]", "h-7 w-[80px]"];

/** A `text` placeholder: three lines that fill most of the card. */
const TEXT_LINES = ["h-2 w-[248px]", "h-2 w-[236px]", "h-2 w-[180px]"];

/**
 * Figma `Skeleton` (in Loading 109:733): Row, Card and Text placeholders on a solid or thick-glass card.
 *
 * Use it while a list, a detail card or a paragraph loads. The card announces itself once with the
 * accessible name "Loading"; the individual bars stay hidden from assistive tech. React sized the bars
 * with Tailwind v4's spacing multiples (`w-75`, `w-62`); the Tailwind v3 preset behind Lynx has no such
 * steps, so the same pixel widths are written as arbitrary values.
 *
 * @example
 * ```tsx
 * import { SkeletonCard } from "@horon-ai/lynx";
 *
 * function Example() {
 *   return (
 *     <view className="flex flex-col gap-3">
 *       <SkeletonCard />
 *       <SkeletonCard type="text" />
 *     </view>
 *   );
 * }
 * ```
 */
export function SkeletonCard({ type = "row", surface = "solid", className }: SkeletonCardProps) {
  return (
    <view
      accessibility-element
      accessibility-role-description="status"
      accessibility-label="Loading"
      className={cn(
        "relative flex gap-3 overflow-hidden rounded-xl p-4",
        surface === "glass" ? "bg-glass-thick" : "border border-border-default bg-bg-surface",
        type === "row" ? "w-[300px] max-w-full flex-row items-center" : "w-[280px] max-w-full flex-col items-start",
        className,
      )}
    >
      {surface === "glass" ? <LiquidGlass /> : null}
      {type === "row" ? <Skeleton shape="pill" className="relative size-9 shrink-0" /> : null}
      {type === "row" ? (
        <view className="relative flex min-w-0 flex-1 flex-col gap-2">
          {ROW_LINES.map((line) => (
            <Skeleton key={line} className={line} />
          ))}
        </view>
      ) : null}
      {type === "card" ? CARD_BARS.map((bar) => <Skeleton key={bar} className={cn("relative", bar)} />) : null}
      {type === "text" ? TEXT_LINES.map((line) => <Skeleton key={line} className={cn("relative", line)} />) : null}
    </view>
  );
}
