import { Dialog as BaseDialog } from "@base-ui/react/dialog";
import { X } from "@phosphor-icons/react";
import type { ComponentProps, ReactNode } from "react";

import { cn } from "../lib/cn";
import { LiquidGlass } from "./liquid-glass";

export const Dialog = BaseDialog.Root;
export const DialogTrigger = BaseDialog.Trigger;
export const DialogClose = BaseDialog.Close;

export type DialogContentProps = Omit<ComponentProps<typeof BaseDialog.Popup>, "className" | "title"> & {
  title: ReactNode;
  description?: ReactNode;
  /** Label for the close button; hides it when `null`. */
  closeLabel?: string | null;
  /** Slot marker on the close control, for a surface its own app selects the control by. */
  closeSlot?: string;
  /** Tile or icon set before the title (Paper settings modals). */
  leading?: ReactNode;
  /**
   * `glass` is the Figma frost dialog. `solid` is the Paper workspace modal: opaque default fill,
   * 20px radius, 24px padding, 20px gap and a 0 24 64 shadow, no glass layer.
   */
  surface?: "glass" | "solid";
  className?: string;
};

/**
 * Figma `Dialog on scrim` (63:329): a 40% scrim and a 420px thick-glass dialog,
 * 24px padding, title-md heading with a 20px close icon, body-md description.
 */
export function DialogContent({
  title,
  description,
  closeLabel = "Close",
  closeSlot,
  leading,
  surface = "glass",
  className,
  children,
  ...props
}: DialogContentProps) {
  const solid = surface === "solid";
  return (
    <BaseDialog.Portal>
      <BaseDialog.Backdrop className="fixed inset-0 z-50 bg-bg-scrim/32 motion-fade backdrop-blur-[6px]" />
      <BaseDialog.Viewport className="fixed inset-0 z-50 flex items-center justify-center px-4">
        <BaseDialog.Popup
          className={cn(
            "relative flex w-105 max-w-[calc(100vw-2rem)] flex-col items-start overflow-clip p-6 outline-none",
            solid
              ? "gap-5 rounded-[20px] bg-bg-default shadow-[0_24px_64px_#0A142433]"
              : cn(
                  "gap-2 rounded-xl bg-glass-fill-frost backdrop-blur-[24px]",
                  "shadow-[inset_0_0_0_1px_var(--color-glass-rim-frost),0_0_0_1px_var(--color-overlay-ink-3)]",
                  "dark:bg-glass-thick dark:shadow-none dark:backdrop-blur-none",
                ),
            "motion-popup duration-240 data-starting-style:translate-y-2",
            className,
          )}
          {...props}
        >
          {solid ? null : <LiquidGlass tier="thick" />}
          <div className={cn("relative flex w-full items-start", leading ? "gap-3.5" : "gap-2")}>
            {leading}
            <BaseDialog.Title className="min-w-0 flex-1 text-title-md text-text-primary">{title}</BaseDialog.Title>
            {closeLabel !== null && (
              <BaseDialog.Close
                aria-label={closeLabel}
                data-slot={closeSlot}
                className="flex shrink-0 motion-press cursor-pointer text-text-secondary [&_svg]:size-5"
              >
                <X />
              </BaseDialog.Close>
            )}
          </div>
          {description && (
            <BaseDialog.Description className="relative text-body-md text-text-secondary">
              {description}
            </BaseDialog.Description>
          )}
          {children}
        </BaseDialog.Popup>
      </BaseDialog.Viewport>
    </BaseDialog.Portal>
  );
}

/** The right-aligned action row, 16px below the description. */
export function DialogFooter({
  className,
  ...props
}: Omit<ComponentProps<"div">, "className"> & { className?: string }) {
  return <div className={cn("relative mt-4 flex justify-end gap-2", className)} {...props} />;
}
