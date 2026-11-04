import { Progress as BaseProgress } from "@base-ui/react/progress";
import type { ComponentProps } from "react";

import { cn } from "../lib/cn";

export type ProgressProps = Omit<ComponentProps<typeof BaseProgress.Root>, "className" | "value"> & {
  className?: string;
  /** 0-100. Omit it (or pass `null`) for the indeterminate bar. */
  value?: number | null;
};

/** Figma `Progress bar` (in Loading 109:733): a 6px 8% ink track with an ink fill. */
export function Progress({ className, value = null, ...props }: ProgressProps) {
  return (
    <BaseProgress.Root value={value} className={cn("w-60", className)} {...props}>
      <BaseProgress.Track className="h-1.5 w-full overflow-clip rounded-full bg-overlay-ink-8">
        <BaseProgress.Indicator className="h-full rounded-full bg-interactive-primary transition-[width] duration-400 ease-out-quint data-indeterminate:w-1/3 data-indeterminate:animate-sweep" />
      </BaseProgress.Track>
    </BaseProgress.Root>
  );
}
