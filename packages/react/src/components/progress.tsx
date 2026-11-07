import { Progress as BaseProgress } from "@base-ui/react/progress";
import type { ComponentProps } from "react";

import { cn } from "../lib/cn";

/**
 * Props for {@link Progress}. The remaining Base UI `Progress.Root` props (`min`, `max`, `format`,
 * `locale`, `getAriaValueText`, `aria-valuetext`) pass through; the label is a separate
 * `Progress.Label` part, which this wrapper does not render.
 */
export type ProgressProps = Omit<ComponentProps<typeof BaseProgress.Root>, "className" | "value"> & {
  /** Classes merged onto the 240px root. */
  className?: string;
  /**
   * Determinate progress in percent (0-100). Omit it (or pass `null`) for the indeterminate bar,
   * which animates a third-width sweep inside the track.
   * @default null
   */
  value?: number | null;
};

/**
 * Figma `Progress bar` (in Loading 109:733): a 6px 8% ink track with an ink fill.
 *
 * The width animates on a 400ms quint curve when `value` changes, so a value fed from state reads
 * as movement rather than a jump. Base UI supplies the `progressbar` role and the `aria-valuenow`
 * wiring.
 *
 * @example
 * ```tsx
 * import { Progress } from "@horon-ai/react";
 *
 * function Example() {
 *   return (
 *     <div>
 *       <Progress value={64} aria-label="Upload" />
 *       <Progress aria-label="Loading" />
 *     </div>
 *   );
 * }
 * ```
 */
export function Progress({ className, value = null, ...props }: ProgressProps) {
  return (
    <BaseProgress.Root value={value} className={cn("w-60", className)} {...props}>
      <BaseProgress.Track className="h-1.5 w-full overflow-clip rounded-full bg-overlay-ink-8">
        <BaseProgress.Indicator className="h-full rounded-full bg-interactive-primary transition-[width] duration-400 ease-out-quint data-indeterminate:w-1/3 data-indeterminate:animate-sweep" />
      </BaseProgress.Track>
    </BaseProgress.Root>
  );
}
