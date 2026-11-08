import { useState } from "@lynx-js/react";
import type { CSSProperties } from "@lynx-js/types";

import type { LayoutChangeLike } from "../hooks";
import { Icon } from "../icons";
import { cn } from "../lib/cn";
import { readViewport } from "../lib/media";
import type { ControlSize } from "../lib/size";
import { Calendar, type CalendarProps, type DateRange } from "./calendar";
import { fieldBoxClass, fieldSizeClass, fieldTextClass, type InputSurface } from "./input";

/** Height and text rung of the trigger and the calendar inside: `sm` 32px, `md` 40px, `lg` 48px. */
export type DateFieldSize = ControlSize;
/** Surface of the trigger: `glass` over imagery and glass panels, `solid` on raised surfaces, `solid-on-page` on the page background. */
export type DateFieldSurface = InputSurface;

type WithoutCalendarSurface<T> = T extends unknown ? Omit<T, "size" | "surface"> : never;

/**
 * Props for {@link DateField}: every `Calendar` prop except its own `size` and `surface`, plus the trigger's
 * placeholder, format and classes. `value` is the calendar's value too, so pass a `Date` in `single` mode and
 * a `DateRange` in `range` mode; the trigger text is drawn from the same value.
 */
export type DateFieldProps = WithoutCalendarSurface<CalendarProps> & {
  /** Rung of the trigger, and of the calendar in the popup. @default "md" */
  size?: DateFieldSize;
  /** `solid` (default) on raised surfaces, `glass` over imagery and glass panels, `solid-on-page` directly on the page background. @default "solid" */
  surface?: DateFieldSurface;
  /** Text while nothing is picked; it also styles as placeholder text. @default "Pick a date" */
  placeholder?: string;
  /** Marks the trigger invalid and turns its border danger red. */
  invalid?: boolean;
  /** Dims the trigger and blocks the popup. */
  disabled?: boolean;
  /** Formats the trigger text; defaults to "Oct 20, 2026" and "Oct 20 – Oct 24, 2026". */
  format?: (value: Date | DateRange) => string;
  /** Extra classes on the trigger, merged after the field surface and size classes. */
  triggerClassName?: string;
};

/** Short month names for engines without `Intl`, so the trigger text has a deterministic fallback. */
const MONTHS_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/**
 * `Nov 20, 2026` (or `Nov 20` without the year) through `Intl` when the engine has it, which Lynx's
 * native JS engine often does not; the fallback writes the same shape so the trigger text never
 * depends on ICU being bundled.
 */
function formatDate(locale: string | undefined, date: Date, withYear = true): string {
  if (typeof Intl !== "undefined" && typeof Intl.DateTimeFormat === "function") {
    const options: Intl.DateTimeFormatOptions = withYear
      ? { month: "short", day: "numeric", year: "numeric" }
      : { month: "short", day: "numeric" };
    return new Intl.DateTimeFormat(locale, options).format(date);
  }
  const base = `${MONTHS_SHORT[date.getMonth()]} ${date.getDate()}`;
  return withYear ? `${base}, ${date.getFullYear()}` : base;
}

/** The default trigger text: one day, an open range, or both ends with the shared year dropped. */
function defaultFormat(value: Date | DateRange, locale?: string): string {
  if (value instanceof Date) return formatDate(locale, value);
  if (!value.start) return "";
  if (!value.end) return formatDate(locale, value.start);
  const sameYear = value.start.getFullYear() === value.end.getFullYear();
  const start = formatDate(locale, value.start, !sameYear);
  return `${start} – ${formatDate(locale, value.end)}`;
}

/** The calendar fills its parent, so the popup names the width of its rung, capped at the viewport. */
const popupCalendarWidthClass: Record<DateFieldSize, string> = {
  sm: "w-[250px] max-w-[calc(100vw-2rem)]",
  md: "w-[314px] max-w-[calc(100vw-2rem)]",
  lg: "w-[374px] max-w-[calc(100vw-2rem)]",
};

/** React sized the trigger's calendar glyph through the text rung; `<Icon>` takes px. */
const iconSize: Record<DateFieldSize, number> = { sm: 16, md: 16, lg: 20 };

/** The trigger's box on the page, measured by `bindlayoutchange`; all values in CSS px. */
type AnchorRect = {
  left: number;
  top: number;
  width: number;
  height: number;
};

/** Reads the box a `layoutchange` event reports, relative to the LynxView viewport. */
const boxOf = (event: LayoutChangeLike): AnchorRect => {
  const box = event.detail ?? event.params ?? {};
  return {
    left: typeof box.left === "number" ? box.left : 0,
    top: typeof box.top === "number" ? box.top : 0,
    width: typeof box.width === "number" ? box.width : 0,
    height: typeof box.height === "number" ? box.height : 0,
  };
};

/** The popup's own box, measured after it paints, so it can be kept inside the viewport. */
type PanelSize = { width: number; height: number };

/**
 * The popup's inline position: 4px under the trigger at its start edge, flipped above when the
 * bottom has no room and slid left when its measured width would cross the viewport.
 *
 * Base UI's positioner did this on React; Lynx has no floating-ui. A zero viewport (a plain render
 * test) keeps the requested side, because no collision can be judged.
 */
function popupPlacement(anchor: AnchorRect, panel: PanelSize): CSSProperties {
  const viewport = readViewport();
  const known = viewport.width > 0 && viewport.height > 0;
  const gap = 4;

  const below = anchor.top + anchor.height + gap;
  const fitsBelow = !known || below + panel.height <= viewport.height;
  const top = fitsBelow ? below : Math.max(8, anchor.top - gap - panel.height);

  let left = anchor.left;
  if (known && panel.width > 0) left = Math.max(8, Math.min(left, viewport.width - panel.width - 8));

  return { top, left };
}

/**
 * Figma `Date field` (60:244): a 280px field that opens the calendar, in three sizes and two surfaces.
 *
 * A trigger, not an input: the field shows the formatted value or the placeholder and opens the
 * calendar 4px under its start edge. React portalled the popup and positioned it with Base UI; Lynx
 * renders a `position: fixed` view in place, anchored to the trigger's `layoutchange` box, and a
 * transparent full-viewport backdrop behind it dismisses the popup on an outside tap. The popup names
 * its own width (250/314/374px by rung, capped to the viewport) because the calendar fills its parent.
 *
 * @example
 * ```tsx
 * import { useState } from "@lynx-js/react";
 * import { DateField } from "@horon-ai/lynx";
 *
 * function Example() {
 *   const [date, setDate] = useState<Date | null>(new Date());
 *   return <DateField value={date} onValueChange={setDate} placeholder="Pick a date" />;
 * }
 * ```
 */
export function DateField({
  size = "md",
  surface = "solid",
  placeholder = "Pick a date",
  invalid,
  disabled,
  format,
  triggerClassName,
  ...calendar
}: DateFieldProps) {
  const value = calendar.value ?? null;
  const text = value ? (format ? format(value) : defaultFormat(value, calendar.locale)) : "";
  const [open, setOpen] = useState(false);
  const [anchor, setAnchor] = useState<AnchorRect | null>(null);
  const [panel, setPanel] = useState<PanelSize>({ width: 0, height: 0 });

  const placement = anchor ? popupPlacement(anchor, panel) : null;

  return (
    <>
      <view
        className={cn(
          fieldBoxClass.base,
          fieldBoxClass[surface],
          fieldSizeClass[size],
          "w-full max-w-[280px]",
          surface !== "glass" && !disabled && "active:border-border-strong",
          // React's field box repainted its fill and border for `data-disabled`; Lynx has no such
          // selector, so the disabled box is chosen here, as in `Input`.
          disabled && (surface === "glass" ? "opacity-60" : "border-border-default bg-bg-subtle"),
          invalid && "border-border-danger",
          "motion-colors",
          triggerClassName,
        )}
        bindtap={() => {
          if (disabled) return;
          setOpen(!open);
        }}
        bindlayoutchange={(event: LayoutChangeLike) => setAnchor(boxOf(event))}
        accessibility-element
        accessibility-traits={disabled ? "disabled" : "button"}
        accessibility-role-description="date field"
        accessibility-value={open ? "expanded" : "collapsed"}
      >
        <view className="relative flex shrink-0 flex-row items-center">
          <Icon name="CalendarBlank" size={iconSize[size]} color={disabled ? "text-disabled" : "text-secondary"} />
        </view>
        {text ? (
          <text
            className={cn(
              "relative min-w-0 flex-1 overflow-hidden",
              fieldTextClass[size],
              disabled ? "text-text-disabled" : "text-text-primary",
            )}
          >
            {text}
          </text>
        ) : (
          <text className={cn("relative min-w-0 flex-1 overflow-hidden", fieldTextClass[size], "text-text-placeholder")}>
            {placeholder}
          </text>
        )}
      </view>

      {open && placement ? (
        <>
          <view
            className="fixed"
            style={{ top: 0, left: 0, right: 0, bottom: 0 }}
            bindtap={() => setOpen(false)}
            accessibility-element={false}
          />
          <view
            className="fixed z-50 motion-popup"
            style={placement}
            bindlayoutchange={(event: LayoutChangeLike) => {
              const box = boxOf(event);
              setPanel((previous) =>
                previous.width === box.width && previous.height === box.height ? previous : { width: box.width, height: box.height },
              );
            }}
          >
            <Calendar
              {...calendar}
              size={size}
              surface={surface === "glass" ? "glass" : "solid"}
              className={popupCalendarWidthClass[size]}
            />
          </view>
        </>
      ) : null}
    </>
  );
}
