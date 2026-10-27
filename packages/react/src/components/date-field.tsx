import { Popover } from "@base-ui/react/popover";
import { CalendarBlank } from "@phosphor-icons/react";

import { cn } from "../lib/cn";
import { Calendar, type CalendarProps, type DateRange } from "./calendar";
import { fieldBoxClass } from "./input";
import { LiquidGlass } from "./liquid-glass";

export type DateFieldProps = CalendarProps & {
  placeholder?: string;
  invalid?: boolean;
  disabled?: boolean;
  /** Formats the trigger text; defaults to "Oct 20, 2026" and "Oct 20 – Oct 24, 2026". */
  format?: (value: Date | DateRange) => string;
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

/** Figma `Date field` (60:244): a 280px glass field that opens the calendar. */
export function DateField({
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
          fieldBoxClass.glass,
          "h-10 w-70 cursor-pointer text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-brand data-disabled:cursor-not-allowed",
          triggerClassName,
        )}
        data-invalid={invalid ? "" : undefined}
      >
        <LiquidGlass tier="regular" />
        <span className="relative flex shrink-0 text-text-secondary [&_svg]:size-4">
          <CalendarBlank />
        </span>
        <span
          className={cn(
            "relative min-w-0 flex-1 truncate text-body-md",
            disabled ? "text-text-disabled" : text ? "text-text-primary" : "text-text-placeholder",
          )}
        >
          {text || placeholder}
        </span>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Positioner sideOffset={8} align="start">
          <Popover.Popup className="motion-popup">
            <Calendar {...calendar} />
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  );
}
