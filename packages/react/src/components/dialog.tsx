import { Dialog as BaseDialog } from "@base-ui/react/dialog";
import { X } from "@phosphor-icons/react";
import type { ComponentProps, ReactNode } from "react";

import { cn } from "../lib/cn";

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
   * `glass` is the veil dialog (`veil-overlay`). `solid` is the Paper workspace modal:
   * opaque default fill, 20px radius, 24px padding and a 0 24 64 shadow, no glass layer.
   * Both surfaces share the 16px block rhythm between title, description and actions.
   */
  surface?: "glass" | "solid";
  className?: string;
};

/**
 * Figma `Dialog on scrim` (63:329): a 40% scrim and a 420px veil dialog,
 * 24px padding, title-md heading with a 32px close target, body-md description.
 */
export function DialogContent({
  title,
  description,
  closeLabel = "Close",
  closeSlot,
  leading,
  surface = "solid",
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
            "relative flex max-h-[calc(100dvh-2rem)] w-105 max-w-[calc(100vw-2rem)] flex-col items-start gap-4 overflow-y-auto overscroll-contain rounded-xl p-6 outline-none",
            solid ? "bg-bg-surface shadow-[0_24px_64px_#0A142433]" : "veil-overlay",
            "motion-popup duration-240 data-starting-style:translate-y-2",
            className,
          )}
          {...props}
        >
          <div className={cn("relative flex w-full items-start", leading ? "gap-3.5" : "gap-2")}>
            {leading}
            <BaseDialog.Title className="min-w-0 flex-1 text-title-md text-text-primary">{title}</BaseDialog.Title>
            {closeLabel !== null && (
              <BaseDialog.Close
                aria-label={closeLabel}
                data-slot={closeSlot}
                className="relative -mt-1 -mr-2 flex size-8 shrink-0 motion-press cursor-pointer items-center justify-center rounded-full text-text-secondary motion-colors hover:bg-overlay-ink-6 hover:text-text-primary focus-visible:outline-2 focus-visible:outline-text-brand [&_svg]:size-4"
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

/**
 * The action row: secondary first, the primary action at the right edge, 8px apart.
 * `w-full` is what right-aligns it — the dialog popup stacks children at their content width.
 */
export function DialogFooter({
  className,
  ...props
}: Omit<ComponentProps<"div">, "className"> & { className?: string }) {
  return <div className={cn("relative flex w-full flex-wrap items-center justify-end gap-2", className)} {...props} />;
}
