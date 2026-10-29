import { Radio as BaseRadio } from "@base-ui/react/radio";
import type { ComponentProps, ReactNode } from "react";

import { cn } from "../lib/cn";
import { LiquidGlass } from "./liquid-glass";

export type ChoiceCardProps = Omit<ComponentProps<typeof BaseRadio.Root>, "className" | "children"> & {
  title: ReactNode;
  description?: ReactNode;
  /** Pill at the end of the title line, e.g. "Recommended": 22px, 8px padding, 18% sky with brand text (Paper Mobile connection). */
  badge?: ReactNode;
  className?: string;
};

/**
 * Paper `Choice card` (1VXM-0 selected, 1VXR-0 default): a 252px glass card, padding 14, radius 16, gap 12.
 * Use inside `RadioGroup`. The 18px radio is a ring: 1.5px grey when off, a 5px ink ring around an 8px core when on.
 */
export function ChoiceCard({ title, description, badge, className, ...props }: ChoiceCardProps) {
  return (
    <BaseRadio.Root
      className={cn(
        "group relative flex w-[252px] cursor-pointer items-start gap-3 overflow-clip rounded-2xl border border-transparent bg-glass-clear p-3.5 text-left motion-colors",
        "data-checked:border-border-brand data-checked:bg-glass-thick",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-brand",
        "data-disabled:cursor-not-allowed data-disabled:opacity-40",
        className,
      )}
      {...props}
    >
      <span aria-hidden className="group-data-checked:hidden">
        <LiquidGlass tier="clear" />
      </span>
      <span aria-hidden className="hidden group-data-checked:block">
        <LiquidGlass tier="thick" />
      </span>
      <span
        aria-hidden
        className="relative mt-px flex size-[18px] shrink-0 items-center justify-center rounded-full border-[1.5px] border-border-dashed motion-colors group-data-checked:border-[5px] group-data-checked:border-interactive-primary"
      >
        <BaseRadio.Indicator className="size-2 animate-pop-in rounded-full bg-interactive-on-primary data-unchecked:hidden" />
      </span>
      <span className="relative flex min-w-0 flex-1 flex-col gap-[3px]">
        <span className="flex items-center gap-2.5">
          <span className="text-sm/5 min-w-0 flex-1 font-semibold text-text-primary">{title}</span>
          {badge && (
            <span className="text-xs/4 inline-flex h-[22px] shrink-0 items-center rounded-full bg-accent-sky-500-18 px-2 font-medium text-text-brand">
              {badge}
            </span>
          )}
        </span>
        {description && <span className="text-xs/4 text-text-secondary">{description}</span>}
      </span>
    </BaseRadio.Root>
  );
}
