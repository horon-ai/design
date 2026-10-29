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
   * `glass` (default) layers the thick liquid glass. `frost` is the Paper home board card: frost fill,
   * 24px backdrop blur, white inner rim, 3% ink hairline and a 0 8 24 6% drop, without the glass layer.
   */
  surface?: "glass" | "frost";
  className?: string;
};

/** Figma `Card` (63:310): a 320px thick-glass card, 20px padding and radius, Default / Interactive / Selected. */
export function Card({
  title,
  description,
  interactive,
  selected,
  render,
  surface = "glass",
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
        "relative flex flex-col items-start gap-2 overflow-clip rounded-xl bg-glass-thick p-5 text-left motion-colors",
        surface === "frost" &&
          "bg-glass-fill-frost shadow-[inset_0_0_0_1px_#ffffffb3,0_0_0_1px_#00000008,0_8px_24px_#0a14240f] backdrop-blur-[24px]",
        selected && "border border-border-brand",
        interactive &&
          "cursor-pointer transition-[border-color,scale] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-brand active:scale-[0.99]",
        className,
      ),
      children: (
        <>
          {surface === "glass" && <LiquidGlass tier="thick" />}
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
