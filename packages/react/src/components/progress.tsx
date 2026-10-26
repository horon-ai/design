import { Progress as BaseProgress } from "@base-ui/react/progress";
import type { ComponentProps } from "react";

import { cn } from "../lib/cn";

export type ProgressProps = Omit<ComponentProps<typeof BaseProgress.Root>, "className"> & { className?: string };

/** Figma `Progress bar` (in Loading 109:733): a 6px 8% ink track with an ink fill. */
export function Progress({ className, ...props }: ProgressProps) {
  return (
    <BaseProgress.Root className={cn("w-60", className)} {...props}>
      <BaseProgress.Track className="h-1.5 w-full overflow-clip rounded-full bg-overlay-ink-8">
        <BaseProgress.Indicator className="h-full rounded-full bg-interactive-primary transition-[width] duration-300" />
      </BaseProgress.Track>
    </BaseProgress.Root>
  );
}
