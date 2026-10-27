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
  className?: string;
};

/** Figma `Header with filter` (Segmented filters 88:723): a regular-glass header, 28px radius, 8px padding. */
export function PageHeader({ title, onBack, backLabel = "Back", actions, children, className }: PageHeaderProps) {
  return (
    <header
      className={cn(
        "relative flex flex-col gap-1.5 overflow-clip rounded-[28px] bg-glass-regular p-2",
        className,
      )}
    >
      <LiquidGlass tier="regular" />
      <div className="relative flex h-10 items-center gap-2">
        {onBack && <IconButton icon={<CaretLeft />} label={backLabel} onClick={onBack} />}
        <h1 className={cn("min-w-0 flex-1 truncate text-label-lg text-text-primary", !onBack && "pl-2")}>{title}</h1>
        {actions}
      </div>
      {children && <div className="relative">{children}</div>}
    </header>
  );
}
