import { CaretLeft } from "@phosphor-icons/react";
import type { ReactNode } from "react";

import { cn } from "../lib/cn";
import { IconButton } from "./icon-button";
import { LiquidGlass } from "./liquid-glass";

export type PageHeaderProps = {
  title: ReactNode;
  onBack?: () => void;
  backLabel?: string;
  /** Trailing 40px icon buttons, such as search. */
  actions?: ReactNode;
  /** Content under the top row, such as a `SegmentedControl` filter. */
  children?: ReactNode;
  /** `solid` (default) is an opaque surface header with a default border; `glass` is the regular glass header. */
  surface?: "solid" | "glass";
  className?: string;
};

/** Figma `Header with filter` (Segmented filters 88:723): a 28px-radius header, 8px padding, solid or regular glass. */
export function PageHeader({
  title,
  onBack,
  backLabel = "Back",
  actions,
  children,
  surface = "solid",
  className,
}: PageHeaderProps) {
  return (
    <header
      className={cn(
        "relative flex max-w-full min-w-0 flex-col gap-1.5 overflow-clip rounded-[28px] p-2",
        surface === "glass" ? "bg-glass-regular" : "border border-border-default bg-bg-surface",
        className,
      )}
    >
      {surface === "glass" && <LiquidGlass />}
      <div className="relative flex h-10 min-w-0 items-center gap-2">
        {onBack && <IconButton icon={<CaretLeft />} label={backLabel} onClick={onBack} />}
        <h1 className={cn("min-w-0 flex-1 truncate text-label-lg text-text-primary", !onBack && "pl-2")}>{title}</h1>
        {actions}
      </div>
      {children && <div className="relative animate-swap-move">{children}</div>}
    </header>
  );
}
