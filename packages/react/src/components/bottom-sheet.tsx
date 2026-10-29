import { Drawer } from "@base-ui/react/drawer";
import { CaretRight, X } from "@phosphor-icons/react";
import type { ComponentProps, ReactNode } from "react";

import { cn } from "../lib/cn";
import { LiquidGlass } from "./liquid-glass";

export const BottomSheet = Drawer.Root;
export const BottomSheetTrigger = Drawer.Trigger;
export const BottomSheetClose = Drawer.Close;

export type BottomSheetContentProps = Omit<ComponentProps<typeof Drawer.Popup>, "className" | "title"> & {
  title: ReactNode;
  /** Label for the close button; hides it when `null` (Paper workspace sheets have none). */
  closeLabel?: string | null;
  /**
   * `panel` is the Figma panel sheet (374px max, label-lg title, 6% ink close). `detail` is the Paper
   * detail sheet: full width, 18px rhythm, a caller-built header (tile, title, description) set flush
   * left and a transparent 32px close with an 18px glyph.
   */
  variant?: "panel" | "detail";
  /** `glass` is the frost sheet; `solid` is the Paper workspace sheet: opaque default fill, 20px top corners, 8/24/16 padding. */
  surface?: "glass" | "solid";
  className?: string;
};

/**
 * Figma `Bottom sheet` (Panels 88:808): frost glass (light) or thick glass (dark) with 32px top corners, a
 * 36x5 grabber, a label-lg title and a 32px 6% ink close button.
 */
export function BottomSheetContent({
  title,
  closeLabel = "Close",
  variant = "panel",
  surface = "glass",
  className,
  children,
  ...props
}: BottomSheetContentProps) {
  const detail = variant === "detail";
  const solid = surface === "solid";
  return (
    <Drawer.Portal>
      <Drawer.Backdrop className="fixed inset-0 bg-bg-scrim/32 motion-fade backdrop-blur-[6px]" />
      <Drawer.Viewport className="fixed inset-x-0 bottom-0 flex justify-center">
        <Drawer.Popup
          className={cn(
            "relative flex w-full flex-col items-stretch overflow-clip px-4 pt-2 outline-none",
            solid
              ? "rounded-t-[20px] bg-bg-default pb-6"
              : "rounded-t-[32px] bg-glass-fill-frost pb-5 shadow-[inset_0_0_0_1px_var(--color-glass-rim-frost),0_0_0_1px_var(--color-overlay-ink-3)] backdrop-blur-[24px] dark:bg-glass-thick dark:shadow-none dark:backdrop-blur-none",
            "transition-[translate] duration-320 ease-out-quint data-ending-style:translate-y-full data-ending-style:duration-220 data-ending-style:ease-in data-starting-style:translate-y-full",
            detail ? "gap-4.5" : "max-w-93.5 gap-1",
            className,
          )}
          {...props}
        >
          {solid ? null : <LiquidGlass tier="thick" />}
          <span aria-hidden className="relative mx-auto h-[5px] w-9 rounded-[3px] bg-overlay-ink-20" />
          <Drawer.Content className={cn("relative flex flex-col", detail ? "gap-4.5" : "gap-1")}>
            <div className={cn("flex gap-2", detail ? "items-start" : "items-center pt-2.5 pb-2 pl-1")}>
              <Drawer.Title className={cn("min-w-0 flex-1 text-text-primary", detail ? "flex" : "text-label-lg")}>
                {title}
              </Drawer.Title>
              {closeLabel === null ? null : (
                <Drawer.Close
                  aria-label={closeLabel}
                  className={cn(
                    "flex size-8 shrink-0 motion-press cursor-pointer items-center justify-center rounded-full text-text-secondary focus-visible:outline-2 focus-visible:outline-text-brand",
                    detail ? "bg-transparent" : "bg-overlay-ink-6",
                  )}
                >
                  <X aria-hidden className={detail ? "size-[18px]" : "size-4"} />
                </Drawer.Close>
              )}
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
        "flex h-12 w-full motion-press cursor-pointer items-center gap-3 rounded-lg px-2 text-left focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-text-brand",
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

export function BottomSheetActions({
  className,
  ...props
}: Omit<ComponentProps<"div">, "className"> & { className?: string }) {
  return <div className={cn("flex items-center gap-2 pt-3", className)} {...props} />;
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
