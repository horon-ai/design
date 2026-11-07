import type { ReactNode } from "@lynx-js/react";
import type { CSSProperties } from "@lynx-js/types";

import { Icon } from "../icons";
import { cn } from "../lib/cn";
import { LiquidGlass } from "./liquid-glass";

/**
 * Props of the React element this port replaces, keyed by React's own tag. Each
 * entry lists only what the Lynx wrapper can honour, so the mapping from a DOM
 * element to its Lynx counterpart is explicit instead of implied.
 */
type PortedElementProps = {
  /** React's `div`; on Lynx every block is a `view`. */
  div: { className?: string; style?: CSSProperties };
};

/** Props of {@link Card}. */
export type CardProps = Omit<PortedElementProps["div"], "className" | "title"> & {
  /** Card heading on the title row, wrapping inside the card instead of truncating; the caret joins this row. */
  title?: ReactNode;
  /** Body line under the title, in body-sm secondary text. */
  description?: ReactNode;
  /** Shows the trailing caret, for cards that open something. */
  interactive?: boolean;
  /** Brand rim for the selected card. */
  selected?: boolean;
  /**
   * Called when the card is tapped. React swapped the root element through a
   * `render` prop (`<button />`, `<a />`); Lynx has no element swapping, so the
   * card stays a `view` and the press handler is passed as a plain callback.
   */
  onTap?: () => void;
  /**
   * `solid` (default) is an opaque surface with a default border. `glass` is the thick glass.
   * `frost` is the Paper home board card: the same glass with the denser frost fill and a 0 8 24 6% drop.
   * @default "solid"
   */
  surface?: "glass" | "frost" | "solid";
  /** Extra classes merged onto the rendered root. */
  className?: string;
  /** Content under the description, in a full-width block. */
  children?: ReactNode;
};

/**
 * Text slots take a string so the component can put the token classes on a `<text>`;
 * Lynx does not inherit colour or type, so a caller's own node keeps its own styling.
 */
const isPlainText = (value: ReactNode): value is string | number => typeof value === "string" || typeof value === "number";

/**
 * Figma `Card` (63:310): a 320px thick-glass card, 20px padding and radius, Default / Interactive / Selected.
 *
 * The glass layer is the card's first child, so it paints behind the title, description and children
 * without needing react's `isolate` and `-z-10` patch; `min-w-0` keeps the grid/flex min-content of the
 * card from widening a narrow parent. `interactive` adds the caret and the press scale, `selected` the
 * brand rim. React's `hover:` rim and `focus-visible:` outline have no touch equivalent and are dropped;
 * the rim tint that react fed to the glass layer through `--glass-edge` is not read by Lynx's
 * `LiquidGlass`, so the selected rim is drawn on the host.
 *
 * @example
 * ```tsx
 * import { Card } from "@horon-ai/lynx";
 *
 * function Example() {
 *   return (
 *     <Card
 *       interactive
 *       surface="frost"
 *       title="Weekly digest"
 *       description="A summary of everything the assistant saved this week."
 *       onTap={() => open()}
 *     />
 *   );
 * }
 * ```
 */
export function Card({
  title,
  description,
  interactive,
  selected,
  onTap,
  surface = "solid",
  className,
  children,
  style,
}: CardProps) {
  return (
    <view
      className={cn(
        // `min-w-0` keeps the grid/flex min-content of the card from widening a
        // narrow parent; the glass layer is the first child and paints in flow
        // order, so nothing needs a stacking-context patch.
        "relative flex min-w-0 flex-col items-start gap-2 overflow-hidden rounded-xl p-5 text-left motion-colors",
        surface === "solid" ? "border border-border-default bg-bg-surface" : "bg-glass-thick",
        surface === "frost" && "bg-glass-fill-frost shadow-[0_8px_24px_#0a14240f]",
        selected && (surface === "solid" ? "border-border-brand" : "border border-border-brand"),
        interactive && "active:scale-[0.99] transition-transform duration-150 ease-out",
        className,
      )}
      style={style}
      bindtap={onTap}
      accessibility-traits={onTap ? "button" : selected ? "selected" : undefined}
    >
      {surface !== "solid" && <LiquidGlass />}
      {title ? (
        <view className="relative flex w-full flex-row items-center gap-2">
          <view className="min-w-0 flex-1">
            {isPlainText(title) ? <text className="text-title-sm text-text-primary">{title}</text> : title}
          </view>
          {interactive ? <Icon name="CaretRight" size={16} color="text-secondary" className="shrink-0" /> : null}
        </view>
      ) : null}
      {interactive && !title ? (
        <view className="absolute right-5 top-5 flex shrink-0">
          <Icon name="CaretRight" size={16} color="text-secondary" />
        </view>
      ) : null}
      {description ? (
        <view className="relative w-full">
          {isPlainText(description) ? (
            <text className="text-body-sm text-text-secondary">{description}</text>
          ) : (
            description
          )}
        </view>
      ) : null}
      {children ? <view className="relative w-full">{children}</view> : null}
    </view>
  );
}
