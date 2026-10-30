import { Tooltip as BaseTooltip } from "@base-ui/react/tooltip";
import type { ReactElement, ReactNode } from "react";

export type TooltipProps = {
  /** The element that shows the tooltip on hover and focus. */
  children: ReactElement;
  label: ReactNode;
  side?: "top" | "bottom" | "left" | "right";
  delay?: number;
};

/** Figma `Tooltip` (62:282): an ink bubble, 10/6px padding, 8px radius, with a 10x6 arrow. */
export function Tooltip({ children, label, side = "top", delay }: TooltipProps) {
  return (
    <BaseTooltip.Root>
      <BaseTooltip.Trigger delay={delay} render={children} />
      <BaseTooltip.Portal>
        <BaseTooltip.Positioner side={side} sideOffset={6}>
          <BaseTooltip.Popup className="flex motion-popup rounded-sm bg-interactive-primary px-2.5 py-1.5 text-label-sm text-interactive-on-primary duration-150">
            {label}
            <BaseTooltip.Arrow className="flex data-[side=bottom]:-top-1.5 data-[side=bottom]:rotate-180 data-[side=left]:-right-2 data-[side=left]:-rotate-90 data-[side=right]:-left-2 data-[side=right]:rotate-90 data-[side=top]:-bottom-1.5">
              <svg width="10" height="6" viewBox="0 0 10 6" aria-hidden className="fill-interactive-primary">
                <path d="M0.67 1.5h8.66L5 6z" />
              </svg>
            </BaseTooltip.Arrow>
          </BaseTooltip.Popup>
        </BaseTooltip.Positioner>
      </BaseTooltip.Portal>
    </BaseTooltip.Root>
  );
}

export const TooltipProvider = BaseTooltip.Provider;
