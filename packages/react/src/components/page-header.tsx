import { CaretLeft } from "@phosphor-icons/react";
import type { ReactNode } from "react";

import { cn } from "../lib/cn";
import { IconButton } from "./icon-button";
import { LiquidGlass } from "./liquid-glass";

/** Props for {@link PageHeader}: the title row, an optional back button, trailing actions and a filter row. */
export type PageHeaderProps = {
  /** Page title, rendered as the `h1`; truncated with an ellipsis when it does not fit. */
  title: ReactNode;
  /** Renders a leading 40px back `IconButton` when set; the header drops the title's left padding in exchange. */
  onBack?: () => void;
  /** Accessible label of the back button; `IconButton` sets it as `aria-label` and shows no visible tooltip.
   * @default "Back" */
  backLabel?: string;
  /** Trailing 40px icon buttons, such as search. */
  actions?: ReactNode;
  /** Content under the top row, such as a `SegmentedControl` filter. Animates in with `swap-move` when it appears. */
  children?: ReactNode;
  /** `solid` (default) is an opaque surface header with a default border; `glass` is the regular glass header. @default "solid" */
  surface?: "solid" | "glass";
  /** Extra classes on the `header` element, merged after the built-in ones. */
  className?: string;
};

/**
 * Figma `Header with filter` (Segmented filters 88:723): a 28px-radius header, 8px padding, solid or regular glass.
 *
 * A single row of back button, title and actions, plus an optional filter row
 * below it. The `glass` surface paints a `LiquidGlass` layer behind the content
 * and keeps the header transparent.
 *
 * @example
 * ```tsx
 * <PageHeader
 *   title="Sources"
 *   onBack={() => history.back()}
 *   actions={<IconButton label="Search" icon={<MagnifyingGlass />} />}
 * >
 *   <SegmentedControl value="all" onValueChange={() => {}} items={[{ value: "all", label: "All" }]} />
 * </PageHeader>
 * ```
 */
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
        "relative flex max-w-full min-w-0 flex-col gap-1.5 overflow-clip rounded-xl p-2",
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
