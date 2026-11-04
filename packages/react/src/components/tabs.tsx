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

/**
 * Figma `Tabs example` (62:353): a pill tray with 4px padding and 24px between
 * tabs, solid or regular glass. The 10% ink selection is one indicator that slides
 * to the active tab (Base UI `Tabs.Indicator` positions it).
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
  return (
    <BaseTabs.List
      className={cn(
        "relative flex w-fit items-start gap-6 overflow-clip rounded-full p-1",
        surface === "glass" ? "bg-glass-regular" : "border border-border-default bg-bg-surface",
        className,
      )}
      {...props}
    >
      {surface === "glass" && <LiquidGlass />}
      <BaseTabs.Indicator className="absolute top-(--active-tab-top) left-(--active-tab-left) h-(--active-tab-height) w-(--active-tab-width) rounded-full bg-overlay-ink-10 motion-indicator" />
      {children}
    </BaseTabs.List>
  );
}

const tabClass: Record<TabsSize, string> = {
  sm: "py-1.5 text-label-md",
  md: "py-2.5 text-label-lg",
  lg: "py-3.5 text-label-lg",
};

const plainClass: Record<TabsSize, string> = {
  sm: "px-1",
  md: "px-1",
  lg: "px-1.5",
};

const richClass: Record<TabsSize, string> = {
  sm: "inline-flex items-center gap-1 px-2.5 [&_svg]:size-3.5",
  md: "inline-flex items-center gap-1.5 px-3.5 [&_svg]:size-4",
  lg: "inline-flex items-center gap-2 px-4 [&_svg]:size-5",
};

const countClass: Record<TabsSize, string> = {
  sm: "h-5 px-1.5",
  md: "h-5.5 px-2",
  lg: "h-6 px-2 text-label-md",
};

/** Figma `Tabs` (62:335): a pill tab; the list's indicator draws the 10% selection, hover adds 5% (4% over the selection, 14% total). */
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
  const rich = icon !== undefined || count !== undefined;
  return (
    <BaseTabs.Tab
      className={cn(
        "group/tab relative cursor-pointer rounded-full whitespace-nowrap text-text-secondary",
        tabClass[size],
        rich ? richClass[size] : plainClass[size],
        "motion-colors hover:bg-overlay-ink-5 hover:text-text-primary data-active:text-text-primary hover:data-active:bg-overlay-ink-14",
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
