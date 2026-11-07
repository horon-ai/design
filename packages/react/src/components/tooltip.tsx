import { Tooltip as BaseTooltip } from "@base-ui/react/tooltip";
import type { ReactElement, ReactNode } from "react";

/**
 * Props for {@link Tooltip}.
 */
export type TooltipProps = {
  /** The element that shows the tooltip on hover and focus. */
  children: ReactElement;
  /** Bubble content; keep it to a short phrase because the bubble caps at 256px. */
  label: ReactNode;
  /** Preferred side of the trigger; Base UI flips it when there is no room. @default "top" */
  side?: "top" | "bottom" | "left" | "right";
  /** Hover delay in milliseconds before the bubble opens; Base UI's default when omitted. */
  delay?: number;
};

/**
 * Figma `Tooltip` (62:282): an ink bubble, 10/6px padding, 8px radius, with a 10x6 arrow.
 *
 * The trigger is the child element itself (Base UI `render`), so no wrapper node is added. The popup
 * is portaled to the body at `z-50`, 6px from the trigger with an arrow that follows the chosen side,
 * and it opens on hover and on keyboard focus.
 *
 * @example
 * ```tsx
 * import { Tooltip } from "@horon-ai/react";
 * import { Copy } from "@phosphor-icons/react";
 *
 * function Example() {
 *   return (
 *     <Tooltip label="Copy link" side="top">
 *       <button type="button" aria-label="Copy link">
 *         <Copy />
 *       </button>
 *     </Tooltip>
 *   );
 * }
 * ```
 */
export function Tooltip({ children, label, side = "top", delay }: TooltipProps) {
  return (
    <BaseTooltip.Root>
      <BaseTooltip.Trigger delay={delay} render={children} />
      <BaseTooltip.Portal>
        <BaseTooltip.Positioner side={side} sideOffset={6} className="z-50">
          <BaseTooltip.Popup className="flex max-w-64 motion-popup rounded-sm bg-interactive-primary px-2.5 py-1.5 text-label-sm text-balance text-interactive-on-primary duration-150">
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

/**
 * Base UI tooltip provider, re-exported unchanged. Wrap a group of tooltips in it to share hover
 * timing, so moving between adjacent triggers does not restart each delay.
 */
export const TooltipProvider = BaseTooltip.Provider;
