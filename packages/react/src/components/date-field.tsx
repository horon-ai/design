import { Popover } from "@base-ui/react/popover";
import { CalendarBlank } from "@phosphor-icons/react";

import { cn } from "../lib/cn";
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
  /** Marks the trigger `aria-invalid` and turns its border danger red. */
  invalid?: boolean;
  /** Dims the trigger and blocks the popup. */
  disabled?: boolean;
  /** Formats the trigger text; defaults to "Oct 20, 2026" and "Oct 20 – Oct 24, 2026". */
  format?: (value: Date | DateRange) => string;
  /** Extra classes on the trigger button, merged after the field surface and size classes. */
  triggerClassName?: string;
};

function defaultFormat(value: Date | DateRange, locale?: string): string {
  const withYear = new Intl.DateTimeFormat(locale, { month: "short", day: "numeric", year: "numeric" });
  if (value instanceof Date) return withYear.format(value);
  if (!value.start) return "";
  if (!value.end) return withYear.format(value.start);
  const sameYear = value.start.getFullYear() === value.end.getFullYear();
  const start = sameYear
    ? new Intl.DateTimeFormat(locale, { month: "short", day: "numeric" }).format(value.start)
    : withYear.format(value.start);
  return `${start} – ${withYear.format(value.end)}`;
}

/** The calendar fills its parent, and a popover's positioner is auto-width, so the popup names the width it should take, capped at the viewport. */
const popupCalendarWidthClass: Record<DateFieldSize, string> = {
  sm: "w-62.5 max-w-[calc(100vw-2rem)]",
  md: "w-78.5 max-w-[calc(100vw-2rem)]",
  lg: "w-93.5 max-w-[calc(100vw-2rem)]",
};

/**
 * Figma `Date field` (60:244): a 280px field that opens the calendar, in three sizes and two surfaces.
 *
 * A `Popover` trigger, not an input: the button shows the formatted value or the placeholder and opens the
 * calendar in a portal at the trigger's start edge, 4px below. The popup names its own width (250/314/374px
 * by rung, capped to the viewport) because the calendar fills its parent and a positioner is auto-width.
 *
 * @example
 * ```tsx
 * const [date, setDate] = useState<Date | null>(new Date());
 *
 * <DateField
 *   value={date}
 *   onValueChange={setDate}
 *   placeholder="Pick a date"
 * />
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
  return (
    <Popover.Root>
      <Popover.Trigger
        disabled={disabled}
        aria-invalid={invalid || undefined}
        className={cn(
          fieldBoxClass.base,
          fieldBoxClass[surface],
          fieldSizeClass[size],
          "w-full max-w-70 cursor-pointer text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-brand data-disabled:cursor-not-allowed",
          surface !== "glass" && "hover:enabled:not-data-invalid:border-border-strong",
          triggerClassName,
        )}
        data-invalid={invalid ? "" : undefined}
      >
        <span className="relative flex shrink-0 text-text-secondary">
          <CalendarBlank />
        </span>
        <span
          className={cn(
            "relative min-w-0 flex-1 truncate",
            fieldTextClass[size],
            disabled ? "text-text-disabled" : text ? "text-text-primary" : "text-text-placeholder",
          )}
        >
          {text || placeholder}
        </span>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Positioner sideOffset={4} align="start" className="z-50 outline-none">
          <Popover.Popup className="motion-popup">
            <Calendar
              {...calendar}
              size={size}
              surface={surface === "glass" ? "glass" : "solid"}
              className={popupCalendarWidthClass[size]}
            />
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  );
}
