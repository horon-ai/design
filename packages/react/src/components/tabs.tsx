import { Tabs as BaseTabs } from "@base-ui/react/tabs";
import type { ComponentProps } from "react";

import { cn } from "../lib/cn";
import { LiquidGlass } from "./liquid-glass";

type WithClass<T> = Omit<T, "className"> & { className?: string };

export function Tabs({ className, ...props }: WithClass<ComponentProps<typeof BaseTabs.Root>>) {
  return <BaseTabs.Root className={cn("flex flex-col gap-4", className)} {...props} />;
}

/** Figma `Tabs example` (62:353): a regular-glass pill tray, 4px padding, 24px between tabs. */
export function TabsList({ className, children, ...props }: WithClass<ComponentProps<typeof BaseTabs.List>>) {
  return (
    <BaseTabs.List
      className={cn(
        "relative flex w-fit items-start gap-6 overflow-clip rounded-full border border-glass-rim-strong bg-glass-regular p-1",
        className,
      )}
      {...props}
    >
      <LiquidGlass tier="regular" />
      {children}
    </BaseTabs.List>
  );
}

/** Figma `Tabs` (62:335): a pill tab; selected is 10% ink, hover adds 5% (14% when selected). */
export function TabsTab({ className, ...props }: WithClass<ComponentProps<typeof BaseTabs.Tab>>) {
  return (
    <BaseTabs.Tab
      className={cn(
        "relative cursor-pointer rounded-full px-1 py-2.5 text-label-lg whitespace-nowrap text-text-secondary",
        "hover:bg-overlay-ink-5 hover:text-text-primary data-active:bg-overlay-ink-10 data-active:text-text-primary hover:data-active:bg-overlay-ink-14",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-brand data-disabled:cursor-not-allowed data-disabled:opacity-40",
        className,
      )}
      {...props}
    />
  );
}

export function TabsPanel({ className, ...props }: WithClass<ComponentProps<typeof BaseTabs.Panel>>) {
  return <BaseTabs.Panel className={cn("outline-none", className)} {...props} />;
}
