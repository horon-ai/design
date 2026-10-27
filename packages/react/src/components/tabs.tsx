import { Tabs as BaseTabs } from "@base-ui/react/tabs";
import type { ComponentProps, ReactNode } from "react";

import { cn } from "../lib/cn";
import { LiquidGlass } from "./liquid-glass";

type WithClass<T> = Omit<T, "className"> & { className?: string };

export function Tabs({ className, ...props }: WithClass<ComponentProps<typeof BaseTabs.Root>>) {
  return <BaseTabs.Root className={cn("flex flex-col gap-4", className)} {...props} />;
}

/**
 * Figma `Tabs example` (62:353): a regular-glass pill tray, 4px padding, 24px
 * between tabs. The 10% ink selection is one indicator that slides to the
 * active tab (Base UI `Tabs.Indicator` positions it).
 */
export function TabsList({ className, children, ...props }: WithClass<ComponentProps<typeof BaseTabs.List>>) {
  return (
    <BaseTabs.List
      className={cn(
        "relative flex w-fit items-start gap-6 overflow-clip rounded-full bg-glass-regular p-1",
        className,
      )}
      {...props}
    >
      <LiquidGlass tier="regular" />
      <BaseTabs.Indicator className="absolute top-(--active-tab-top) left-(--active-tab-left) h-(--active-tab-height) w-(--active-tab-width) rounded-full bg-overlay-ink-10 motion-indicator" />
      {children}
    </BaseTabs.List>
  );
}

/** Figma `Tabs` (62:335): a pill tab; the list's indicator draws the 10% selection, hover adds 5% (4% over the selection, 14% total). */
export function TabsTab({
  className,
  icon,
  count,
  children,
  ...props
}: WithClass<ComponentProps<typeof BaseTabs.Tab>> & {
  /** Leading 16px icon (Settings `Tabs with count`). */
  icon?: ReactNode;
  /** Count pill after the label; turns solid on the active tab. */
  count?: number;
}) {
  const rich = icon !== undefined || count !== undefined;
  return (
    <BaseTabs.Tab
      className={cn(
        "group/tab relative cursor-pointer rounded-full text-label-lg whitespace-nowrap text-text-secondary",
        rich ? "inline-flex items-center gap-1.5 px-3.5 py-2.5 [&_svg]:size-4" : "px-1 py-2.5",
        "motion-colors hover:bg-overlay-ink-5 hover:text-text-primary data-active:text-text-primary hover:data-active:bg-overlay-ink-14",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-brand data-disabled:cursor-not-allowed data-disabled:opacity-40",
        className,
      )}
      {...props}
    >
      {icon}
      {children}
      {count !== undefined && (
        <span className="inline-flex h-5.5 items-center rounded-full bg-overlay-ink-6 px-2 text-label-sm text-text-secondary motion-colors group-data-active/tab:bg-interactive-primary group-data-active/tab:text-interactive-on-primary">
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
