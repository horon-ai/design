import { Dialog as BaseDialog } from "@base-ui/react/dialog";
import { X } from "@phosphor-icons/react";
import type { ComponentProps, ReactNode } from "react";

import { cn } from "../lib/cn";

export const Modal = BaseDialog.Root;
export const ModalTrigger = BaseDialog.Trigger;
export const ModalClose = BaseDialog.Close;

export type ModalSize = "sm" | "md" | "lg";
export type ModalSurface = "solid" | "glass";

type DivProps = Omit<ComponentProps<"div">, "className"> & { className?: string };

export type ModalContentProps = Omit<ComponentProps<typeof BaseDialog.Popup>, "className" | "title"> & {
  title: ReactNode;
  description?: ReactNode;
  /** Width: `sm` 400px, `md` 560px (default), `lg` 720px. Never wider than the viewport minus 32px. */
  size?: ModalSize;
  /** `solid` (default) is the opaque page fill with a 0 24 64 shadow; `glass` is the veil (`veil-overlay`). */
  surface?: ModalSurface;
  /** Tile or icon before the title. */
  leading?: ReactNode;
  /** Label for the close button; hides it when `null`. */
  closeLabel?: string | null;
  /** `ModalFooter`, kept below the scrolling body. */
  footer?: ReactNode;
  className?: string;
};

const widthClass: Record<ModalSize, string> = {
  sm: "w-full max-w-100",
  md: "w-full max-w-140",
  lg: "w-full max-w-180",
};

/**
 * A modal for work that needs a form or a longer read, where `Dialog` is a short confirmation. It has three
 * fixed parts: a header (title, description and close), a body that scrolls on its own once the modal reaches
 * the viewport height, and a footer whose actions sit at the right. 24px padding, 20px radius, 32% scrim.
 */
export function ModalContent({
  title,
  description,
  size = "md",
  surface = "solid",
  leading,
  closeLabel = "Close",
  footer,
  className,
  children,
  ...props
}: ModalContentProps) {
  return (
    <BaseDialog.Portal>
      <BaseDialog.Backdrop className="fixed inset-0 z-50 bg-bg-scrim/32 motion-fade backdrop-blur-[6px]" />
      <BaseDialog.Viewport className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <BaseDialog.Popup
          className={cn(
            // The 16px viewport padding caps `w-full`, so the popup never exceeds
            // the screen even on the narrowest phone.
            "relative flex max-h-[calc(100dvh-2rem)] flex-col overflow-clip rounded-xl outline-none",
            widthClass[size],
            surface === "solid" ? "bg-bg-surface shadow-[0_24px_64px_#0A142433]" : "veil-overlay",
            "motion-popup duration-240 data-starting-style:translate-y-2",
            className,
          )}
          {...props}
        >
          <header className={cn("flex shrink-0 items-start px-6 pt-6 pb-4", leading ? "gap-3.5" : "gap-2")}>
            {leading}
            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <BaseDialog.Title className="text-title-md text-text-primary">{title}</BaseDialog.Title>
              {description && (
                <BaseDialog.Description className="text-body-md text-text-secondary">
                  {description}
                </BaseDialog.Description>
              )}
            </div>
            {closeLabel !== null && (
              <BaseDialog.Close
                aria-label={closeLabel}
                className="-mt-1 -mr-2 flex size-8 shrink-0 motion-press cursor-pointer items-center justify-center rounded-full text-text-secondary motion-colors hover:bg-overlay-ink-6 hover:text-text-primary focus-visible:outline-2 focus-visible:outline-text-brand [&_svg]:size-4"
              >
                <X />
              </BaseDialog.Close>
            )}
          </header>
          <div
            className={cn(
              "min-h-0 flex-1 overflow-y-auto overscroll-contain px-6 text-body-md text-text-primary",
              footer ? "pb-2" : "pb-6",
            )}
          >
            {children}
          </div>
          {footer}
        </BaseDialog.Popup>
      </BaseDialog.Viewport>
    </BaseDialog.Portal>
  );
}

/** The modal's action row: actions at the right, secondary first and primary last, 8px apart, 24px padding. */
export function ModalFooter({ className, ...props }: DivProps) {
  return <div className={cn("flex shrink-0 items-center justify-end gap-2 px-6 pt-4 pb-6", className)} {...props} />;
}
