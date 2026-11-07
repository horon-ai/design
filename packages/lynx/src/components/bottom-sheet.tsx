import {
  cloneElement,
  createContext,
  isValidElement,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactElement,
  type ReactNode,
} from "@lynx-js/react";

import { Icon } from "../icons";
import { cn } from "../lib/cn";

/** The open state {@link BottomSheet} publishes to the parts below it. */
type SheetSet = {
  /** Whether the sheet is mounted. */
  open: boolean;
  /** Asks the root to show or hide the sheet; a controlled root reports it instead of moving. */
  setOpen: (next: boolean) => void;
};

const SheetContext = createContext<SheetSet>({ open: false, setOpen: () => undefined });

/** Props of {@link BottomSheet}: the controlled or uncontrolled open state plus the parts it wraps. */
export type BottomSheetProps = {
  /** Controlled state. While set the root reports changes through `onOpenChange` and keeps no state of its own. */
  open?: boolean;
  /** State at first render when uncontrolled. @default false */
  defaultOpen?: boolean;
  /** Called with the requested state on a trigger, a close control, the scrim or a downward drag. */
  onOpenChange?: (open: boolean) => void;
  /** The trigger and content that make up the sheet. */
  children?: ReactNode;
};

/**
 * Root of the bottom sheet: owns the open state and the drag dismissal. Wrap a
 * {@link BottomSheetTrigger} and a {@link BottomSheetContent}; the sheet is only mounted while open.
 *
 * Lynx has no Base UI Drawer, so the root keeps the state and the drag gesture lives on the sheet's
 * grabber ({@link BottomSheetContent}), which reports a downward drag through the same `setOpen`.
 */
export function BottomSheet({ open: openProp, defaultOpen = false, onOpenChange, children }: BottomSheetProps) {
  const [innerOpen, setInnerOpen] = useState(defaultOpen);
  const controlled = openProp !== undefined;
  const open = controlled ? openProp : innerOpen;

  const setOpen = useCallback(
    (next: boolean) => {
      if (!controlled) setInnerOpen(next);
      onOpenChange?.(next);
    },
    [controlled, onOpenChange],
  );

  const value = useMemo(() => ({ open, setOpen }), [open, setOpen]);

  return <SheetContext.Provider value={value}>{children}</SheetContext.Provider>;
}

/** Props shared by {@link BottomSheetTrigger} and {@link BottomSheetClose}. */
type SheetPressProps = {
  /**
   * An element to carry the press behaviour (react's `render` prop). Lynx cannot swap elements, so the
   * element is cloned with the `bindtap` handler instead of being replaced.
   */
  render?: ReactElement;
  /** Content of the built-in pressable surface, used when `render` is absent. */
  children?: ReactNode;
  /** Extra classes on the built-in pressable surface. */
  className?: string;
};

/** Clones a caller's element with the press handler, or wraps the children in a bare pressable view. */
function SheetPress({ render, children, className, onTap }: SheetPressProps & { onTap: () => void }) {
  if (render && isValidElement(render)) {
    // React's `render` prop kept the trigger's children on the rendered element;
    // cloneElement does the same here, so `<Trigger render={<Button />}>Save</Trigger>`
    // still paints "Save" inside the caller's button. A host element takes the Lynx
    // event (`bindtap`); a Horon component takes `onClick` and routes it itself.
    const press = typeof render.type === "string" ? { bindtap: onTap } : { onClick: onTap };
    const merged = children === undefined ? press : { ...press, children };
    return cloneElement(render, merged);
  }
  return (
    <view className={className} bindtap={onTap} accessibility-element accessibility-traits="button">
      {children}
    </view>
  );
}

/** The element that opens the sheet, with the press behaviour put on `render` when one is given. */
export function BottomSheetTrigger({ render, children, className }: SheetPressProps) {
  const { setOpen } = useContext(SheetContext);
  return (
    <SheetPress render={render} className={className} onTap={() => setOpen(true)}>
      {children}
    </SheetPress>
  );
}

/** A close control for the sheet body; it also dismisses on the scrim and on a downward drag. */
export function BottomSheetClose({ render, children, className }: SheetPressProps) {
  const { setOpen } = useContext(SheetContext);
  return (
    <SheetPress render={render} className={className} onTap={() => setOpen(false)}>
      {children}
    </SheetPress>
  );
}

/**
 * The React elements this port replaces: React took Base UI's drawer popup or a
 * native `button`, Lynx has neither, so the surfaces are `view`s with `bindtap`.
 * These aliases name the mapping explicitly instead of leaving it implied.
 */
type PortedPopupProps = { className?: string; title?: ReactNode; children?: ReactNode };

/** The `button` members the wrapper can honour; Lynx turns them into `bindtap` and `opacity`. */
type PortedButtonProps<Tag extends string> = {
  children?: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  /** Keeps the tag parameter referenced so the React call sites read the same. */
  tag?: Tag;
};

/** Props of {@link BottomSheetContent}. */
export type BottomSheetContentProps = Omit<PortedPopupProps, "className" | "title"> & {
  /** Sheet title, rendered in the sheet's title slot above the children. */
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
  /** The sheet body under the title. */
  children?: ReactNode;
};

/** Text slots take a string so the component can put the token classes on a `<text>`. */
const isPlainText = (value: ReactNode): value is string | number => typeof value === "string" || typeof value === "number";

/** How far down the grabber must travel before the sheet dismisses, in px. */
const DRAG_DISMISS_THRESHOLD = 72;

/**
 * Figma `Bottom sheet` (Panels 88:808): the veil with 32px top corners, a 36x5 grabber and a
 * label-lg title. There is no close button: the sheet closes on the scrim, on a downward drag of the
 * grabber, or through the caller's own bottom action row.
 *
 * Lynx has no portal and no drawer primitive, so the sheet and its scrim are `position: fixed` views
 * rendered in place. The drag Base UI owned is implemented on the grabber: a downward drag past 72px
 * closes the sheet, a shorter one does nothing. The scrim keeps react's 32% ink alpha as a separate
 * fill view, because a token colour is a CSS variable and Tailwind's `/<alpha>` modifier cannot split
 * it. The sheet is capped at the viewport minus 2rem and scrolls its own body.
 *
 * @example
 * ```tsx
 * import { BottomSheet, BottomSheetAction, BottomSheetActions, BottomSheetContent, BottomSheetTrigger } from "@horon-ai/lynx";
 *
 * function Example() {
 *   return (
 *     <BottomSheet>
 *       <BottomSheetTrigger>Open sheet</BottomSheetTrigger>
 *       <BottomSheetContent title="Reminder" floating>
 *         <text className="text-body-sm text-text-secondary">Every weekday at 9:00</text>
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
}: BottomSheetContentProps) {
  const { open, setOpen } = useContext(SheetContext);
  const [dragStartY, setDragStartY] = useState<number | null>(null);

  if (!open) return null;

  const detail = variant === "detail";
  const solid = surface === "solid";
  const gapClass = detail ? "gap-[18px]" : floating ? "gap-3" : "gap-1";

  const handleTouchStart = (event: { touches?: { pageY: number }[] }) => {
    const touch = event.touches?.[0];
    if (touch) setDragStartY(touch.pageY);
  };

  const handleTouchEnd = (event: { changedTouches?: { pageY: number }[] }) => {
    const touch = event.changedTouches?.[0];
    const start = dragStartY;
    setDragStartY(null);
    if (touch && start !== null && touch.pageY - start >= DRAG_DISMISS_THRESHOLD) setOpen(false);
  };

  return (
    <view className="fixed inset-0 z-50 flex flex-col justify-end">
      {backdrop ? (
        <view
          className="absolute inset-0 bg-bg-scrim opacity-[0.32]"
          bindtap={() => setOpen(false)}
          accessibility-element={false}
        />
      ) : null}
      <view className={cn("relative flex w-full flex-row justify-center", floating ? "px-4 pb-4" : "pb-0")}>
        <view
          className={cn(
            "relative flex max-h-[calc(100vh-2rem)] w-full flex-col items-stretch overflow-hidden px-4 pt-2 motion-rise",
            solid ? "rounded-t-xl bg-bg-surface pb-6" : "veil-overlay rounded-t-[32px] pb-5",
            detail ? "gap-[18px]" : floating ? "gap-3" : "max-w-[374px] gap-1",
            className,
          )}
          catchtap={() => undefined}
        >
          <view
            className="relative mx-auto h-[5px] w-9 rounded-[3px] bg-overlay-ink-20"
            bindtouchstart={handleTouchStart}
            bindtouchend={handleTouchEnd}
            accessibility-element={false}
          />
          {/* The body scrolls on its own; the flex sizing lives on the wrapper because
           * Lynx's `<scroll-view>` is a linear layout of its own. */}
          <view className={cn("relative flex min-h-0 flex-1 flex-col", gapClass)}>
            <scroll-view
              scroll-orientation="vertical"
              scroll-bar-enable={false}
              style={{ flex: "1 1 0%", minHeight: "0px", width: "100%" }}
            >
              <view className={cn("flex flex-row gap-2", detail ? "items-start" : "items-center pt-2.5 pb-2 pl-2")}>
                <view className="min-w-0 flex-1">
                  {isPlainText(title) ? (
                    <text
                      // The detail variant leaves the title's type to the caller-built header,
                      // exactly as react's `Drawer.Title` did; only `panel` sets label-lg.
                      className={detail ? "text-text-primary" : "text-label-lg text-text-primary"}
                      accessibility-traits="header"
                    >
                      {title}
                    </text>
                  ) : (
                    title
                  )}
                </view>
              </view>
              {children}
            </scroll-view>
          </view>
        </view>
      </view>
    </view>
  );
}

/** Props of {@link BottomSheetRow}. */
export type BottomSheetRowProps = Omit<PortedButtonProps<"button">, "className"> & {
  /** Leading icon rendered at 20px in secondary text color. */
  icon?: ReactNode;
  /** Current value on the right, such as "On" or "Weekdays". */
  value?: ReactNode;
  /** Extra classes merged onto the row button. */
  className?: string;
};

/** A 48px settings row: 20px icon, label, value and a 16px caret. Part of {@link BottomSheetContent}. */
export function BottomSheetRow({ icon, value, onClick, disabled = false, className, children }: BottomSheetRowProps) {
  return (
    <view
      className={cn(
        "flex h-12 w-full flex-row items-center gap-3 rounded-lg px-2 motion-press active:bg-overlay-ink-4",
        disabled && "opacity-50",
        className,
      )}
      bindtap={disabled ? undefined : onClick}
      accessibility-element
      accessibility-traits="button"
    >
      {icon ? <view className="flex shrink-0">{icon}</view> : null}
      <view className="min-w-0 flex-1">
        {isPlainText(children) ? (
          <text className="text-label-md text-text-primary overflow-hidden">{children}</text>
        ) : (
          children
        )}
      </view>
      {value ? (
        <view className="shrink-0">
          {isPlainText(value) ? <text className="text-body-sm text-text-secondary">{value}</text> : value}
        </view>
      ) : null}
      <Icon name="CaretRight" size={16} color="text-secondary" className="shrink-0" />
    </view>
  );
}

/** Props of {@link BottomSheetActions}. */
export type BottomSheetActionsProps = {
  /** Extra classes merged onto the action row. */
  className?: string;
  /** The action pills. */
  children?: ReactNode;
};

/** The action row: secondary first, the primary action at the right edge, 8px apart. Wraps onto a second line when the sheet is too narrow. Part of {@link BottomSheetContent}. */
export function BottomSheetActions({ className, children }: BottomSheetActionsProps) {
  return (
    <view className={cn("relative flex w-full flex-row flex-wrap items-center justify-end gap-2 pt-3", className)}>
      {children}
    </view>
  );
}

/** Props of {@link BottomSheetAction}. */
export type BottomSheetActionProps = Omit<PortedButtonProps<"button">, "className"> & {
  /**
   * `primary` is the filled brand pill, `secondary` the 6% ink pill.
   * @default "secondary"
   */
  variant?: "primary" | "secondary";
  /** Extra classes merged onto the action button. */
  className?: string;
};

/** The sheet's 44px pill actions: `secondary` is 6% ink, `primary` is ink. Part of {@link BottomSheetActions}. */
export function BottomSheetAction({
  variant = "secondary",
  onClick,
  disabled = false,
  className,
  children,
}: BottomSheetActionProps) {
  return (
    <view
      className={cn(
        "flex h-11 min-w-[100px] flex-row items-center justify-center rounded-full px-4 motion-press",
        variant === "primary" ? "bg-interactive-primary" : "bg-overlay-ink-6",
        disabled && "opacity-50",
        className,
      )}
      bindtap={disabled ? undefined : onClick}
      accessibility-element
      accessibility-traits="button"
    >
      <text
        className={cn("text-label-md", variant === "primary" ? "text-text-inverse" : "text-text-primary")}
      >
        {children}
      </text>
    </view>
  );
}
