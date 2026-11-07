import { Drawer } from "@base-ui/react/drawer";
import { CaretRight } from "@phosphor-icons/react";
import type { ComponentProps, ReactNode } from "react";

import { cn } from "../lib/cn";

/**
 * Root of the bottom sheet: owns the open state and the drag/Escape dismissal. Wrap a
 * {@link BottomSheetTrigger} and a {@link BottomSheetContent}; the sheet is only mounted while open.
 */
export const BottomSheet = Drawer.Root;
/** The element that opens the sheet, forwarded to Base UI's trigger unchanged. */
export const BottomSheetTrigger = Drawer.Trigger;
/** A close control for the sheet body; it also dismisses on scrim, Escape and a downward drag. */
export const BottomSheetClose = Drawer.Close;

/** Props of {@link BottomSheetContent}. */
export type BottomSheetContentProps = Omit<ComponentProps<typeof Drawer.Popup>, "className" | "title"> & {
  /** Sheet title, rendered in the drawer's title slot above the children. */
  title: ReactNode;
  /**
   * `panel` is the Figma panel sheet (374px max, label-lg title). `detail` is the Paper detail sheet:
   * full width, 18px rhythm, a caller-built header (tile, title, description) set flush left.
   * @default "panel"
   */
  variant?: "panel" | "detail";
  /**
   * `glass` is the veil sheet (`veil-overlay`); `solid` is the Paper workspace sheet: opaque default fill, 20px top corners, 8/24/16 padding.
   * @default "solid"
   */
  surface?: "glass" | "solid";
  /**
   * Draws the dimmed, blurred scrim behind the sheet. Paper's floating panel sheet has none.
   * @default true
   */
  backdrop?: boolean;
  /**
   * Insets the sheet 16px from the sides and bottom edge (Paper's 358px panel sheet) instead of docking it full width.
   * @default false
   */
  floating?: boolean;
  /** Extra classes merged onto the sheet popup. */
  className?: string;
};

/**
 * Figma `Bottom sheet` (Panels 88:808): the veil with 32px top corners, a 36x5 grabber and a
 * label-lg title. There is no close button: the sheet closes on the scrim, on Escape, on a
 * downward drag of the grabber, or through the caller's own bottom action row.
 *
 * Portal-mounted above the page (z-50). The popup slides up on open and down on close; the body
 * scrolls on its own with `overscroll-contain`, and the sheet is capped at `100dvh` minus 2rem.
 *
 * @example
 * ```tsx
 * import { BottomSheet, BottomSheetAction, BottomSheetActions, BottomSheetContent, BottomSheetTrigger } from "@horon-ai/react";
 *
 * function Example() {
 *   return (
 *     <BottomSheet>
 *       <BottomSheetTrigger>Open sheet</BottomSheetTrigger>
 *       <BottomSheetContent title="Reminder" floating>
 *         <p className="text-body-sm text-text-secondary">Every weekday at 9:00</p>
 *         <BottomSheetActions>
 *           <BottomSheetAction>Cancel</BottomSheetAction>
 *           <BottomSheetAction variant="primary">Save</BottomSheetAction>
 *         </BottomSheetActions>
 *       </BottomSheetContent>
 *     </BottomSheet>
 *   );
 * }
 * ```
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

/** Props of {@link BottomSheetRow}. */
export type BottomSheetRowProps = Omit<ComponentProps<"button">, "className"> & {
  /** Leading icon rendered at 20px in secondary text color. */
  icon?: ReactNode;
  /** Current value on the right, such as "On" or "Weekdays". */
  value?: ReactNode;
  /** Extra classes merged onto the row button. */
  className?: string;
};

/** A 48px settings row: 20px icon, label, value and a 16px caret. Part of {@link BottomSheetContent}. */
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

/** The action row: secondary first, the primary action at the right edge, 8px apart. Wraps onto a second line when the sheet is too narrow. Part of {@link BottomSheetContent}. */
export function BottomSheetActions({
  className,
  ...props
}: Omit<ComponentProps<"div">, "className"> & {
  /** Extra classes merged onto the action row. */
  className?: string;
}) {
  return (
    <div className={cn("relative flex w-full flex-wrap items-center justify-end gap-2 pt-3", className)} {...props} />
  );
}

/** Props of {@link BottomSheetAction}. */
export type BottomSheetActionProps = Omit<ComponentProps<"button">, "className"> & {
  /**
   * `primary` is the filled brand pill, `secondary` the 6% ink pill.
   * @default "secondary"
   */
  variant?: "primary" | "secondary";
  /** Extra classes merged onto the action button. */
  className?: string;
};

/** The sheet's 44px pill actions: `secondary` is 6% ink, `primary` is ink. Part of {@link BottomSheetActions}. */
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
