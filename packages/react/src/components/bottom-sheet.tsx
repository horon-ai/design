import { Drawer } from "@base-ui/react/drawer";
import { CaretRight } from "@phosphor-icons/react";
import type { ComponentProps, CSSProperties, ReactNode } from "react";

import { cn } from "../lib/cn";

/** Default maximum width on wider viewports, matching {@link Modal}'s `md` reading width while staying wider than every portrait phone. */
const DEFAULT_MAX_WIDTH = 560;

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
   * `panel` is the docked panel sheet (label-lg title, 4px rhythm). `detail` is the detail sheet:
   * 18px rhythm with a caller-built header (tile, title, description) set flush left.
   * @default "panel"
   */
  variant?: "panel" | "detail";
  /**
   * `glass` is the veil sheet (`veil-overlay`); `solid` is the opaque surface fill. Both dock flush
   * to the bottom edge with 20px top corners and pad their bottom content by `env(safe-area-inset-bottom)`.
   * @default "solid"
   */
  surface?: "glass" | "solid";
  /**
   * Draws the dimmed, blurred scrim behind the sheet. Turn it off to keep the page visible behind the
   * docked sheet.
   * @default true
   */
  backdrop?: boolean;
  /**
   * Maximum sheet width on wider screens (tablets, landscape phones, desktop). When the viewport is
   * wider than `maxWidth`, the sheet stays horizontally centred and docked to the bottom edge; when
   * narrower, it fills 100% width flush to the left and right edges. Pass `"none"` to span full width
   * at every viewport size.
   * @default 560
   */
  maxWidth?: number | "none";
  /** Extra classes merged onto the sheet popup. */
  className?: string;
};

/**
 * Bottom-docked sheet: on viewports narrower than `maxWidth` (default 560px) it sits flush against
 * the left, right and bottom edges; on wider viewports it centres horizontally at `maxWidth` while
 * staying anchored to the bottom edge. Top corners are 20px, bottom corners are square, and there is
 * no close button: the sheet closes on the scrim, on Escape, on a downward drag of the grabber, or
 * through the caller's own bottom action row.
 *
 * Portal-mounted above the page (z-50). The popup slides up on open and down on close; its surface
 * extends to the bottom edge while the scrollable body pads its bottom by `env(safe-area-inset-bottom)`
 * with `overscroll-contain`, and the sheet is capped below the top safe-area inset.
 *
 * @example
 * ```tsx
 * import { BottomSheet, BottomSheetAction, BottomSheetActions, BottomSheetContent, BottomSheetTrigger } from "@horon-ai/react";
 *
 * function Example() {
 *   return (
 *     <BottomSheet>
 *       <BottomSheetTrigger>Open sheet</BottomSheetTrigger>
 *       <BottomSheetContent title="Reminder">
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
  maxWidth = DEFAULT_MAX_WIDTH,
  className,
  style,
  children,
  ...props
}: BottomSheetContentProps) {
  const detail = variant === "detail";
  const solid = surface === "solid";
  const widthStyle: CSSProperties | undefined =
    maxWidth === "none" ? undefined : { maxWidth: Math.max(0, maxWidth) };
  const mergedStyle: BottomSheetContentProps["style"] =
    typeof style === "function"
      ? (state) => ({ ...widthStyle, ...style(state) })
      : widthStyle || style
        ? { ...widthStyle, ...style }
        : undefined;

  return (
    <Drawer.Portal>
      {backdrop ? (
        <Drawer.Backdrop className="fixed inset-0 z-50 bg-bg-scrim/32 motion-fade backdrop-blur-[6px]" />
      ) : null}
      <Drawer.Viewport className="fixed inset-x-0 bottom-0 z-50 flex items-end justify-center">
        <Drawer.Popup
          style={mergedStyle}
          className={cn(
            "relative mx-auto mb-0 flex max-h-[calc(100dvh-max(2rem,env(safe-area-inset-top)+1rem))] w-full flex-col items-stretch overflow-clip rounded-t-xl rounded-b-none pt-2 pb-0 break-keep [overflow-wrap:anywhere] outline-none focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-text-brand",
            solid
              ? "bg-bg-surface shadow-[0_0_0_1px_var(--color-border-default),0_-8px_32px_0_var(--veil-overlay-shadow)]"
              : "veil-overlay shadow-[0_0_0_var(--veil-ring-width)_var(--veil-ring),0_-8px_32px_0_var(--veil-overlay-shadow)]",
            "[transform:translateY(var(--drawer-swipe-movement-y))] transition-transform duration-240 ease-out-quint data-ending-style:translate-y-full data-ending-style:duration-200 data-ending-style:ease-in data-starting-style:translate-y-full data-swiping:select-none",
            detail ? "gap-4.5" : "gap-1",
            className,
          )}
          {...props}
        >
          <span
            aria-hidden
            className="relative mx-auto h-[5px] w-9 cursor-grab touch-none rounded-full bg-overlay-ink-20 active:cursor-grabbing"
          />
          <Drawer.Content
            className={cn(
              "relative flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-contain pr-[calc(1rem+env(safe-area-inset-right))] pl-[calc(1rem+env(safe-area-inset-left))]",
              solid
                ? "pb-[calc(1.5rem+env(safe-area-inset-bottom))]"
                : "pb-[calc(1.25rem+env(safe-area-inset-bottom))]",
              detail ? "gap-4.5" : "gap-1",
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
        "flex h-12 w-full motion-press cursor-pointer items-center gap-3 rounded-sm px-2 text-left hover:not-disabled:bg-overlay-ink-4 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-text-brand disabled:cursor-not-allowed disabled:opacity-40",
        className,
      )}
      {...props}
    >
      {icon && <span className="flex shrink-0 text-text-secondary [&>svg]:size-5">{icon}</span>}
      <span className="min-w-0 flex-1 truncate text-label-md text-text-primary">{children}</span>
      {value !== undefined && value !== null && <span className="shrink-0 text-body-sm text-text-secondary">{value}</span>}
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
        "flex h-11 min-w-25 motion-press cursor-pointer items-center justify-center rounded-full px-4 text-label-md whitespace-nowrap disabled:cursor-not-allowed disabled:opacity-40",
        variant === "primary"
          ? "bg-interactive-primary text-interactive-on-primary hover:not-disabled:bg-interactive-primary-hover active:not-disabled:bg-interactive-primary-pressed"
          : "bg-overlay-ink-6 text-text-primary hover:not-disabled:bg-overlay-ink-10",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-brand",
        className,
      )}
      {...props}
    />
  );
}
