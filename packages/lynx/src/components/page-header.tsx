import type { ReactNode } from "@lynx-js/react";

import { Icon } from "../icons";
import { cn } from "../lib/cn";
import { IconButton } from "./icon-button";
import { LiquidGlass } from "./liquid-glass";

/** Props for {@link PageHeader}: the title row, an optional back button, trailing actions and a filter row. */
export type PageHeaderProps = {
  /** Page title, truncated with an ellipsis when it does not fit. Text is wrapped in a `<text>`; a node is rendered as given. */
  title: ReactNode;
  /** Renders a leading 40px back `IconButton` when set; the header drops the title's left padding in exchange. */
  onBack?: () => void;
  /** Accessible label of the back button; the button shows no visible text.
   * @default "Back" */
  backLabel?: string;
  /** Trailing 40px icon buttons, such as search. */
  actions?: ReactNode;
  /** Content under the top row, such as a `SegmentedControl` filter. Animates in with `motion-rise` when it appears. */
  children?: ReactNode;
  /** `solid` (default) is an opaque surface header with a default border; `glass` is the regular glass header. @default "solid" */
  surface?: "solid" | "glass";
  /** Extra classes on the header element, merged after the built-in ones. */
  className?: string;
};

/**
 * Figma `Header with filter` (Segmented filters 88:723): a 28px-radius header, 8px padding, solid or regular glass.
 *
 * A single row of back button, title and actions, plus an optional filter row
 * below it. React drew the title as an `h1`; Lynx has no heading element, so it is a
 * `<text>` with the `header` accessibility trait, truncated to one line. The `glass`
 * surface paints a `LiquidGlass` layer behind the content and keeps the header
 * transparent, and the host clips the layer with `overflow-hidden`.
 *
 * @example
 * ```tsx
 * import { Icon, IconButton, PageHeader, SegmentedControl } from "@horon-ai/lynx";
 *
 * function Example() {
 *   return (
 *     <PageHeader
 *       title="Sources"
 *       onBack={() => {}}
 *       actions={<IconButton label="Search" icon={<Icon name="MagnifyingGlass" />} />}
 *     >
 *       <SegmentedControl value="all" onValueChange={() => {}} items={[{ value: "all", label: "All" }]} />
 *     </PageHeader>
 *   );
 * }
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
    <view
      className={cn(
        "relative flex min-w-0 max-w-full flex-col gap-1.5 overflow-hidden rounded-[28px] p-2",
        surface === "glass" ? "bg-glass-regular" : "border border-border-default bg-bg-surface",
        className,
      )}
    >
      {surface === "glass" ? <LiquidGlass /> : null}
      <view className="relative flex h-10 min-w-0 flex-row items-center gap-2">
        {onBack ? (
          <IconButton
            icon={<Icon name="CaretLeft" size={20} color="text-primary" />}
            label={backLabel}
            onClick={onBack}
          />
        ) : null}
        {typeof title === "string" || typeof title === "number" ? (
          <text
            className={cn("min-w-0 flex-1 truncate text-label-lg text-text-primary", !onBack && "pl-2")}
            accessibility-traits="header"
          >
            {title}
          </text>
        ) : (
          <view className={cn("min-w-0 flex-1", !onBack && "pl-2")}>{title}</view>
        )}
        {actions}
      </view>
      {children ? <view className="motion-rise relative">{children}</view> : null}
    </view>
  );
}
