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
  className,
  children,
  ...props
}: DialogContentProps) {
  return (
    <BaseDialog.Portal>
      <BaseDialog.Backdrop className="fixed inset-0 bg-bg-scrim opacity-40 transition-opacity duration-150 data-ending-style:opacity-0 data-starting-style:opacity-0" />
      <BaseDialog.Popup
        className={cn(
          "fixed top-1/2 left-1/2 flex w-105 max-w-[calc(100vw-2rem)] -translate-x-1/2 -translate-y-1/2 flex-col items-start gap-2 overflow-clip rounded-xl border border-glass-rim-strong bg-glass-thick p-6",
          "transition-[scale,opacity] duration-150 data-ending-style:scale-95 data-ending-style:opacity-0 data-starting-style:scale-95 data-starting-style:opacity-0",
          className,
        )}
        {...props}
      >
        <LiquidGlass tier="thick" />
        <div className="relative flex w-full items-start gap-2">
          <BaseDialog.Title className="min-w-0 flex-1 text-title-md text-text-primary">{title}</BaseDialog.Title>
          {closeLabel !== null && (
            <BaseDialog.Close
              aria-label={closeLabel}
              className="flex shrink-0 cursor-pointer text-text-secondary [&_svg]:size-5"
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
