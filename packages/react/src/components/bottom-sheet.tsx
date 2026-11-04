import { Drawer } from "@base-ui/react/drawer";
import { CaretRight } from "@phosphor-icons/react";
import type { ComponentProps, ReactNode } from "react";

import { cn } from "../lib/cn";

export const BottomSheet = Drawer.Root;
export const BottomSheetTrigger = Drawer.Trigger;
export const BottomSheetClose = Drawer.Close;

export type BottomSheetContentProps = Omit<ComponentProps<typeof Drawer.Popup>, "className" | "title"> & {
  title: ReactNode;
  /**
   * `panel` is the Figma panel sheet (374px max, label-lg title). `detail` is the Paper detail sheet:
   * full width, 18px rhythm, a caller-built header (tile, title, description) set flush left.
   */
  variant?: "panel" | "detail";
  /** `glass` is the veil sheet (`veil-overlay`); `solid` is the Paper workspace sheet: opaque default fill, 20px top corners, 8/24/16 padding. */
  surface?: "glass" | "solid";
  /** Draws the dimmed, blurred scrim behind the sheet. Paper's floating panel sheet has none. */
  backdrop?: boolean;
  /** Insets the sheet 16px from the sides and bottom edge (Paper's 358px panel sheet) instead of docking it full width. */
  floating?: boolean;
  className?: string;
};

/**
 * Figma `Bottom sheet` (Panels 88:808): the veil with 32px top corners, a 36x5 grabber and a
 * label-lg title. There is no close button: the sheet closes on the scrim, on Escape, on a
 * downward drag of the grabber, or through the caller's own bottom action row.
 */
export function BottomSheetContent({
  title,
  variant = "panel",
  surface = "solid",
  backdrop = true,
  floating = false,
  className,
  children,
  ...props
}: BottomSheetContentProps) {
  const detail = variant === "detail";
  const solid = surface === "solid";
  return (
    <Drawer.Portal>
      {backdrop ? (
        <Drawer.Backdrop className="fixed inset-0 z-50 bg-bg-scrim/32 motion-fade backdrop-blur-[6px]" />
      ) : null}
      <Drawer.Viewport
        className={cn("fixed z-50 flex justify-center", floating ? "inset-x-4 bottom-4" : "inset-x-0 bottom-0")}
      >
        <Drawer.Popup
          className={cn(
            "relative flex max-h-[calc(100dvh-2rem)] w-full flex-col items-stretch overflow-clip px-4 pt-2 outline-none",
            solid ? "rounded-t-xl bg-bg-surface pb-6" : "veil-overlay rounded-t-[32px] pb-5",
            "transition-[translate] duration-320 ease-out-quint data-ending-style:translate-y-full data-ending-style:duration-220 data-ending-style:ease-in data-starting-style:translate-y-full",
            detail ? "gap-4.5" : floating ? "gap-3" : "max-w-93.5 gap-1",
            className,
          )}
          {...props}
        >
          <span
            aria-hidden
            className="relative mx-auto h-[5px] w-9 cursor-grab touch-none rounded-[3px] bg-overlay-ink-20 active:cursor-grabbing"
          />
          <Drawer.Content
            className={cn(
              "relative flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain",
              detail ? "gap-4.5" : floating ? "gap-3" : "gap-1",
            )}
          >
            <div className={cn("flex gap-2", detail ? "items-start" : "items-center pt-2.5 pb-2 pl-2")}>
              <Drawer.Title className={cn("min-w-0 flex-1 text-text-primary", detail ? "flex" : "text-label-lg")}>
                {title}
              </Drawer.Title>
            </div>
            {children}
          </Drawer.Content>
        </Drawer.Popup>
      </Drawer.Viewport>
    </Drawer.Portal>
  );
}

export type BottomSheetRowProps = Omit<ComponentProps<"button">, "className"> & {
  icon?: ReactNode;
  /** Current value on the right, such as "On" or "Weekdays". */
  value?: ReactNode;
  className?: string;
};

/** A 48px settings row: 20px icon, label, value and a 16px caret. */
export function BottomSheetRow({ icon, value, className, children, ...props }: BottomSheetRowProps) {
  return (
    <button
      type="button"
      className={cn(
        "flex h-12 w-full motion-press cursor-pointer items-center gap-3 rounded-lg px-2 text-left hover:bg-overlay-ink-4 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-text-brand",
        className,
      )}
      {...props}
    >
      {icon && <span className="flex shrink-0 text-text-secondary [&>svg]:size-5">{icon}</span>}
      <span className="min-w-0 flex-1 truncate text-label-md text-text-primary">{children}</span>
      {value && <span className="shrink-0 text-body-sm text-text-secondary">{value}</span>}
      <CaretRight aria-hidden className="size-4 shrink-0 text-text-secondary" />
    </button>
  );
}

/** The action row: secondary first, the primary action at the right edge, 8px apart. */
export function BottomSheetActions({
  className,
  ...props
}: Omit<ComponentProps<"div">, "className"> & { className?: string }) {
  return (
    <div className={cn("relative flex w-full flex-wrap items-center justify-end gap-2 pt-3", className)} {...props} />
  );
}

export type BottomSheetActionProps = Omit<ComponentProps<"button">, "className"> & {
  variant?: "primary" | "secondary";
  className?: string;
};

/** The sheet's 44px pill actions: `secondary` is 6% ink, `primary` is ink. */
export function BottomSheetAction({ variant = "secondary", className, ...props }: BottomSheetActionProps) {
  return (
    <button
      type="button"
      className={cn(
        "flex h-11 min-w-25 motion-press cursor-pointer items-center justify-center rounded-full px-4 text-label-md whitespace-nowrap",
        variant === "primary" ? "bg-interactive-primary text-text-inverse" : "bg-overlay-ink-6 text-text-primary",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-brand",
        className,
      )}
      {...props}
    />
  );
}
