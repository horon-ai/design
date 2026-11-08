import { Children, createContext, isValidElement, useCallback, useContext, useMemo, useState, type ReactNode } from "@lynx-js/react";
import type { CSSProperties } from "@lynx-js/types";

import { cn } from "../lib/cn";
import type { ControlSize } from "../lib/size";
import { useActiveIndicator } from "../hooks/use-active-indicator";
import { useHoronTheme } from "../provider";
import { LiquidGlass } from "./liquid-glass";

/** Tab rungs, shared with `ControlSize`: `sm` 26px, `md` 30px and `lg` 36px tab height. */
export type TabsSize = ControlSize;

/** The value of the tab that owns the selection; `undefined` before the first tab is known. */
type TabsSet = {
  /** Rung every tab inside reads so one list stays on one rung. */
  size: ControlSize;
  /** Axis the set runs along: `horizontal` (the default) or the column of a vertical set. */
  orientation: "horizontal" | "vertical";
  /** The selected value: the controlled prop, or the uncontrolled inner state. */
  value: string | undefined;
  /** Selects a value; the root does not own it while controlled. */
  select: (value: string) => void;
};

const TabsSetContext = createContext<TabsSet>({
  size: "md",
  orientation: "horizontal",
  value: undefined,
  select: () => undefined,
});

/**
 * Shape of a tab list: `pill` is the tray of rounded pill tabs, `underline` is a bare
 * text row with a 2px bar that slides under the active tab.
 */
export type TabsListVariant = "pill" | "underline";

/** `TabsList` owns the variant; its `TabsTab`s read it to drop the pill shape on the underline list. */
const TabsVariantContext = createContext<TabsListVariant>("pill");

/** Props of {@link Tabs}: the shared value, the rung, and an optional initial value when uncontrolled. */
export type TabsProps = {
  /** Controlled selection. While set the root reports changes through `onValueChange` and keeps no state of its own. */
  value?: string;
  /** Initial selection when uncontrolled. */
  defaultValue?: string;
  /** Called with the newly selected tab's value. */
  onValueChange?: (value: string) => void;
  /** Rung for this tab set: tab heights of 26px (`sm`), 30px (`md`) or 36px (`lg`). @default "md" */
  size?: TabsSize;
  /**
   * Axis of the set. `horizontal` (the default) lays the list out as a row with the panels under it;
   * `vertical` lays the list out as a column, which is what a side navigation rail wants.
   * @default "horizontal"
   */
  orientation?: "horizontal" | "vertical";
  /** Extra classes on the root column. */
  className?: string;
  /** Inline style, merged onto the root column's own. */
  style?: CSSProperties;
  /** The lists and panels of the set. */
  children?: ReactNode;
};

/**
 * The root of a tab set (Figma `Tabs` example 62:353): it stacks the list and panels in a
 * 16px-gap column, caps at its container, and provides the size rung every `TabsTab` inside
 * reads. It is controlled or uncontrolled like Base UI's tabs (`value`/`defaultValue` plus
 * `onValueChange`), and panels are matched to tabs by `value`.
 *
 * Lynx has no Base UI, so the root owns the selection itself and publishes it through a
 * context; `TabsList` measures the active tab for the sliding indicator and `TabsPanel`
 * renders only while its value is selected.
 *
 * @example
 * ```tsx
 * import { Tabs, TabsList, TabsPanel, TabsTab } from "@horon-ai/lynx";
 *
 * function SettingsTabs() {
 *   return (
 *     <Tabs defaultValue="general">
 *       <TabsList variant="underline">
 *         <TabsTab value="general">General</TabsTab>
 *         <TabsTab value="billing" count={3}>
 *           Billing
 *         </TabsTab>
 *       </TabsList>
 *       <TabsPanel value="general">General settings</TabsPanel>
 *       <TabsPanel value="billing">Three open invoices</TabsPanel>
 *     </Tabs>
 *   );
 * }
 * ```
 */
export function Tabs({
  value,
  defaultValue,
  onValueChange,
  size = "md",
  orientation = "horizontal",
  className,
  style,
  children,
}: TabsProps) {
  const [inner, setInner] = useState<string | undefined>(defaultValue);
  const selected = value ?? inner;
  const select = useCallback(
    (next: string) => {
      setInner(next);
      onValueChange?.(next);
    },
    [onValueChange],
  );
  const set = useMemo(() => ({ size, orientation, value: selected, select }), [size, orientation, selected, select]);
  return (
    <TabsSetContext.Provider value={set}>
      <view className={cn("flex max-w-full min-w-0 flex-col gap-4", className)} style={style}>
        {children}
      </view>
    </TabsSetContext.Provider>
  );
}

/** Track padding per rung, the same as `SegmentedControl` so the two pill trays line up. */
const listClass: Record<TabsSize, string> = {
  sm: "p-[3px]",
  md: "p-[3px]",
  lg: "p-1",
};

/** Props of {@link TabsList}: the shape, the surface and the tabs it measures. */
export type TabsListProps = {
  /** `pill` (default) is the tray of pill tabs; `underline` is a text row with a sliding underline. @default "pill" */
  variant?: TabsListVariant;
  /** `solid` (default) is an opaque surface tray with a default border; `glass` is the regular glass tray. @default "solid" */
  surface?: "solid" | "glass";
  /** Extra classes on the track. */
  className?: string;
  /** Inline style, merged onto the track's own. */
  style?: CSSProperties;
  /** The `TabsTab`s of this list, in display order. */
  children?: ReactNode;
};

/** The value a tab element carries, read without knowing its concrete component. */
const tabValueOf = (child: unknown): string | undefined => {
  if (!isValidElement<{ value?: string }>(child)) return undefined;
  return child.props.value;
};

/**
 * Figma `Tabs example` (62:353): a pill tray, solid or regular glass, with the same rungs as
 * `SegmentedControl` (3/3/4px padding, 2px between tabs). The selection is one indicator that
 * slides to the active tab: 10% ink on solid, the thick glass pill with a soft shadow on glass,
 * as on the segmented control.
 *
 * `variant="underline"` is the document variant: no tray, a full-width 1px default border under
 * the tabs, and a 2px primary bar that slides under the active tab. `surface` does not apply to it.
 *
 * Lynx has no `--active-tab-*` custom properties from Base UI, so each tab is wrapped in a
 * measured `view` and the indicator reads the active one's box from `useActiveIndicator`. The row
 * scrolls inside a `scroll-view` when the tabs are wider than the container.
 *
 * Part of {@link Tabs}; it also provides the variant every `TabsTab` inside reads.
 */
export function TabsList({ variant = "pill", surface = "solid", className, style, children }: TabsListProps) {
  const { size, orientation, value } = useContext(TabsSetContext);
  const vertical = orientation === "vertical";
  const theme = useHoronTheme();
  // The tabs of this list, with the value each one carries so the measured index and the React key
  // both come from data instead of array positions.
  const entries = Children.map(children, (child) => ({ node: child as ReactNode, value: tabValueOf(child) })) ?? [];
  const activeIndex = entries.findIndex((entry) => entry.value === value);
  const { rect, animate, bindTrack, bindItem } = useActiveIndicator(activeIndex);

  /** The measured pill, or nothing until the active tab reports its box. */
  const indicator =
    rect && variant === "pill" ? (
      <view
        className={cn(
          "absolute overflow-hidden rounded-full",
          animate && "motion-indicator",
          surface === "glass" ? "bg-glass-thick shadow-[0_1px_3px_rgba(0,0,0,0.08)]" : "bg-overlay-ink-10",
        )}
        style={{
          left: `${rect.left}px`,
          top: `${rect.top}px`,
          width: `${rect.width}px`,
          height: `${rect.height}px`,
          // React darkens the glass pill one step more in the dark scheme.
          backgroundColor: surface === "glass" && theme.scheme === "dark" ? theme.color("overlay-ink-10") : undefined,
        }}
      >
        {surface === "glass" ? <LiquidGlass /> : null}
      </view>
    ) : null;

  const track = (
    <view
      className={cn(
        "relative flex w-full",
        vertical ? "flex-col items-stretch" : "flex-row items-center",
        variant === "underline" ? "gap-6" : "gap-0.5",
      )}
      bindlayoutchange={bindTrack}
    >
      {indicator}
      {entries.map((entry, index) => (
        <view key={entry.value ?? `tab-${index}`} className="shrink-0" {...bindItem(index)}>
          {entry.node}
        </view>
      ))}
      {rect && variant === "underline" ? (
        vertical ? (
          <view
            className={cn("absolute left-0 w-0.5 bg-text-primary", animate && "motion-indicator")}
            style={{ top: `${rect.top}px`, height: `${rect.height}px` }}
          />
        ) : (
          <view
            className={cn("absolute bottom-0 h-0.5 bg-text-primary", animate && "motion-indicator")}
            style={{ left: `${rect.left}px`, width: `${rect.width}px` }}
          />
        )
      ) : null}
    </view>
  );

  return (
    <TabsVariantContext.Provider value={variant}>
      <view
        className={cn(
          "relative flex w-full max-w-full min-w-0 flex-col overflow-hidden",
          variant === "underline"
            ? cn("rounded-none", vertical ? "border-l border-border-default" : "border-b border-border-default")
            : cn("rounded-full", listClass[size], surface === "glass" ? "bg-glass-regular" : "border border-border-default bg-bg-surface"),
          className,
        )}
        style={style}
      >
        {variant === "pill" && surface === "glass" ? <LiquidGlass /> : null}
        {/* A vertical column keeps its natural height instead of scrolling inside a box that has none. */}
        {vertical ? track : <scroll-view scroll-orientation="horizontal" className="w-full">{track}</scroll-view>}
      </view>
    </TabsVariantContext.Provider>
  );
}

/** One tab per rung: the `SegmentedControl` segment heights and padding (26/30/36px, 10/16/16px). */
const tabClass: Record<TabsSize, string> = {
  sm: "h-[26px] gap-1 px-2.5",
  md: "h-[30px] gap-1.5 px-4",
  lg: "h-9 gap-2 px-4",
};

const tabTextClass: Record<TabsSize, string> = {
  sm: "text-label-sm",
  md: "text-label-md",
  lg: "text-label-lg",
};

const countClass: Record<TabsSize, string> = {
  sm: "h-[18px] px-1.5",
  md: "h-5 px-1.5",
  lg: "h-6 px-2",
};

/** Props of {@link TabsTab}: its value, an optional icon and count, and the disabled state. */
export type TabsTabProps = {
  /** Identifies the tab; compared against the set's `value` and its panels' `value`. */
  value: string;
  /**
   * Leading icon. Lynx cannot size a foreign node through CSS, so the caller sets the glyph's
   * own `size` (14 for `sm`, 16 for `md`, 20 for `lg`) instead of react's `[&_svg]:size-*`.
   */
  icon?: ReactNode;
  /** Count pill after the label; turns solid on the active tab. */
  count?: number;
  /** Blocks selection and dims the tab to 40%. */
  disabled?: boolean;
  /** Extra classes on the tab. */
  className?: string;
  /** Inline style, merged onto the tab's own. */
  style?: CSSProperties;
  /** The tab label. */
  children?: ReactNode;
};

/**
 * Figma `Tabs` (62:335): a pill tab; the list's indicator draws the selection under the active tab.
 *
 * Part of {@link Tabs}. The tab takes its height, text and icon size from the surrounding
 * `Tabs`; on an underline list it drops the pill radius and side padding. The active state
 * moves the label to the primary text color. A disabled tab reports the disabled trait and
 * never selects.
 *
 * @example
 * ```tsx
 * import { Tabs, TabsList, TabsTab } from "@horon-ai/lynx";
 *
 * function Example() {
 *   return (
 *     <Tabs defaultValue="a">
 *       <TabsList>
 *         <TabsTab value="a">Alpha</TabsTab>
 *         <TabsTab value="b" count={2}>Beta</TabsTab>
 *       </TabsList>
 *     </Tabs>
 *   );
 * }
 * ```
 */
export function TabsTab({ value, icon, count, disabled = false, className, style, children }: TabsTabProps) {
  const set = useContext(TabsSetContext);
  const underline = useContext(TabsVariantContext) === "underline";
  const active = set.value === value;
  return (
    <view
      className={cn(
        "relative flex flex-row items-center justify-center whitespace-nowrap",
        underline ? "rounded-xs" : "rounded-full",
        tabClass[set.size],
        underline && "px-0",
        "motion-colors",
        active ? "text-text-primary" : "text-text-secondary",
        disabled && "opacity-40",
        className,
      )}
      style={style}
      bindtap={() => {
        if (!disabled) set.select(value);
      }}
      accessibility-element
      accessibility-traits="button"
      accessibility-role-description="tab"
      accessibility-label={typeof children === "string" ? children : value}
      accessibility-value={active ? "selected" : undefined}
    >
      {icon}
      <text className={cn("text-trim", tabTextClass[set.size], active ? "text-text-primary" : "text-text-secondary")}>{children}</text>
      {count !== undefined ? (
        <view
          className={cn(
            "flex flex-row items-center rounded-full motion-colors",
            active ? "bg-interactive-primary" : "bg-overlay-ink-6",
            countClass[set.size],
          )}
        >
          <text className={cn("text-trim text-label-sm", active ? "text-interactive-on-primary" : "text-text-secondary")}>{count}</text>
        </view>
      ) : null}
    </view>
  );
}

/** The quint-out curve react's `animate-swap-move` runs, written out for an inline animation. */
const EASE_OUT_QUINT = "cubic-bezier(0.22, 1, 0.36, 1)";

/** Props of {@link TabsPanel}: the value it belongs to and whether a hidden panel stays mounted. */
export type TabsPanelProps = {
  /** The `TabsTab` value this panel belongs to. */
  value: string;
  /** Keeps the panel mounted while another tab is active, hidden instead of unmounted. @default false */
  keepMounted?: boolean;
  /** Extra classes on the panel. */
  className?: string;
  /** Inline style, merged onto the panel's own animation. */
  style?: CSSProperties;
  /** The panel content. */
  children?: ReactNode;
};

/**
 * The content region of one tab, matched to a `TabsTab` by `value`. The panel swap slides the
 * content in 4px over the shared 200ms swap move; a change in content height is not animated.
 *
 * Lynx has no Base UI panel, so the panel renders only while its value is selected (`keepMounted`
 * keeps it in the tree as a hidden view instead) and carries the `tabpanel` accessibility role.
 *
 * Part of {@link Tabs}.
 */
export function TabsPanel({ value, keepMounted = false, className, style, children }: TabsPanelProps) {
  const set = useContext(TabsSetContext);
  const active = set.value === value;
  if (!active && !keepMounted) return null;
  return (
    <view
      className={cn("flex flex-col", !active && "hidden", className)}
      style={{
        ...(active
          ? { animationName: "swap-move", animationDuration: "200ms", animationTimingFunction: EASE_OUT_QUINT, animationFillMode: "both" }
          : undefined),
        ...style,
      }}
      accessibility-element
      accessibility-role-description="tabpanel"
    >
      {children}
    </view>
  );
}
