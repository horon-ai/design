import { Tabs as BaseTabs } from "@base-ui/react/tabs";
import { type ComponentProps, createContext, type ReactNode, useContext } from "react";

import { cn } from "../lib/cn";
import type { ControlSize } from "../lib/size";
import { LiquidGlass } from "./liquid-glass";

export type TabsSize = ControlSize;

/** `Tabs` owns the size; every `TabsTab` inside reads it so one list stays on one rung. */
const TabsSizeContext = createContext<ControlSize>("md");

type WithClass<T> = Omit<T, "className"> & { className?: string };

export function Tabs({
  size = "md",
  className,
  ...props
}: WithClass<ComponentProps<typeof BaseTabs.Root>> & { size?: TabsSize }) {
  return (
    <TabsSizeContext.Provider value={size}>
      <BaseTabs.Root className={cn("flex flex-col gap-4", className)} {...props} />
    </TabsSizeContext.Provider>
  );
}

/** Track padding per rung, the same as `SegmentedControl` so the two pill trays line up. */
const listClass: Record<TabsSize, string> = {
  sm: "p-[3px]",
  md: "p-[3px]",
  lg: "p-1",
};

/**
 * Figma `Tabs example` (62:353): a pill tray, solid or regular glass, with the same rungs as
 * `SegmentedControl` (3/3/4px padding, 2px between tabs). The selection is one indicator that
 * slides to the active tab (Base UI `Tabs.Indicator` positions it): 10% ink on solid, the thick
 * glass pill with a soft shadow on glass, as on the segmented control.
 */
export function TabsList({
  surface = "solid",
  className,
  children,
  ...props
}: WithClass<ComponentProps<typeof BaseTabs.List>> & {
  /** `solid` (default) is an opaque surface tray with a default border; `glass` is the regular glass tray. */
  surface?: "solid" | "glass";
}) {
  const size = useContext(TabsSizeContext);
  return (
    <BaseTabs.List
      className={cn(
        "relative flex w-fit items-center gap-0.5 overflow-clip rounded-full",
        listClass[size],
        surface === "glass" ? "bg-glass-regular" : "border border-border-default bg-bg-surface",
        className,
      )}
      {...props}
    >
      {surface === "glass" && <LiquidGlass />}
      <BaseTabs.Indicator
        className={cn(
          "absolute top-(--active-tab-top) left-(--active-tab-left) h-(--active-tab-height) w-(--active-tab-width) overflow-clip rounded-full motion-indicator",
          surface === "glass"
            ? "bg-glass-thick shadow-[0_1px_3px_rgba(0,0,0,0.08)] dark:bg-overlay-ink-10"
            : "bg-overlay-ink-10",
        )}
      >
        {surface === "glass" && <LiquidGlass />}
      </BaseTabs.Indicator>
      {children}
    </BaseTabs.List>
  );
}

/** One tab per rung: the `SegmentedControl` segment heights and padding (26/30/36px, 10/16/16px). */
const tabClass: Record<TabsSize, string> = {
  sm: "h-6.5 gap-1 px-2.5 text-label-sm [&_svg]:size-3.5",
  md: "h-7.5 gap-1.5 px-4 text-label-md [&_svg]:size-4",
  lg: "h-9 gap-2 px-4 text-label-lg [&_svg]:size-5",
};

const countClass: Record<TabsSize, string> = {
  sm: "h-4.5 px-1.5",
  md: "h-5 px-1.5",
  lg: "h-6 px-2",
};

/** Figma `Tabs` (62:335): a pill tab; the list's indicator draws the selection under the active tab. */
export function TabsTab({
  className,
  icon,
  count,
  children,
  ...props
}: WithClass<ComponentProps<typeof BaseTabs.Tab>> & {
  /** Leading icon, 14px (sm), 16px (md) or 20px (lg) (Settings `Tabs with count`). */
  icon?: ReactNode;
  /** Count pill after the label; turns solid on the active tab. */
  count?: number;
}) {
  const size = useContext(TabsSizeContext);
  return (
    <BaseTabs.Tab
      className={cn(
        "group/tab relative inline-flex cursor-pointer items-center justify-center rounded-full whitespace-nowrap text-text-secondary",
        tabClass[size],
        "motion-colors hover:text-text-primary data-active:text-text-primary",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-brand data-disabled:cursor-not-allowed data-disabled:opacity-40",
        className,
      )}
      {...props}
    >
      {icon}
      {children}
      {count !== undefined && (
        <span
          className={cn(
            "inline-flex items-center rounded-full bg-overlay-ink-6 text-label-sm text-text-secondary motion-colors group-data-active/tab:bg-interactive-primary group-data-active/tab:text-interactive-on-primary",
            countClass[size],
          )}
        >
          {count}
        </span>
      )}
    </BaseTabs.Tab>
  );
}

export function TabsPanel({ className, ...props }: WithClass<ComponentProps<typeof BaseTabs.Panel>>) {
  return (
    <BaseTabs.Panel
      className={cn("animate-[tab-panel-in_200ms_var(--ease-out-quint)] outline-none", className)}
      {...props}
    />
  );
}
