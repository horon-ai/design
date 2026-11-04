import { useRender } from "@base-ui/react/use-render";
import { CaretRight } from "@phosphor-icons/react";
import type { ComponentProps, ReactElement, ReactNode } from "react";

import { cn } from "../lib/cn";
import { LiquidGlass } from "./liquid-glass";

export type CardProps = Omit<ComponentProps<"div">, "className" | "title"> & {
  title?: ReactNode;
  description?: ReactNode;
  /** Shows the trailing caret, for cards that open something. */
  interactive?: boolean;
  /** Brand rim for the selected card. */
  selected?: boolean;
  /** Render as another element, such as `<button />` or `<a />`. */
  render?: ReactElement;
  /**
   * `solid` (default) is an opaque surface with a default border. `glass` is the thick glass.
   * `frost` is the Paper home board card: the same glass with the denser frost fill and a 0 8 24 6% drop.
   */
  surface?: "glass" | "frost" | "solid";
  className?: string;
};

/** Figma `Card` (63:310): a 320px thick-glass card, 20px padding and radius, Default / Interactive / Selected. */
export function Card({
  title,
  description,
  interactive,
  selected,
  render,
  surface = "solid",
  className,
  children,
  ...props
}: CardProps) {
  return useRender({
    render: render ?? <div />,
    props: {
      ...props,
      "data-selected": selected ? "" : undefined,
      className: cn(
        "relative flex flex-col items-start gap-2 overflow-clip rounded-xl p-5 text-left motion-colors",
        surface === "solid" ? "border border-border-default bg-bg-surface" : "bg-glass-thick",
        surface === "frost" && "bg-glass-fill-frost shadow-[0_8px_24px_#0a14240f]",
        selected && (surface === "solid" ? "border-border-brand" : "[--glass-edge:var(--color-border-brand)]"),
        interactive &&
          "cursor-pointer transition-[border-color,scale] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-brand active:scale-[0.99]",
        className,
      ),
      children: (
        <>
          {surface !== "solid" && <LiquidGlass />}
          {(title || interactive) && (
            <div className="relative flex w-full items-center gap-2">
              <span className="min-w-0 flex-1 text-title-sm text-text-primary">{title}</span>
              {interactive && <CaretRight aria-hidden className="size-4 shrink-0 text-text-secondary" />}
            </div>
          )}
          {description && <p className="relative text-body-sm text-text-secondary">{description}</p>}
          {children && <div className="relative w-full">{children}</div>}
        </>
      ),
    },
  });
}
