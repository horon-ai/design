import { CaretLeft, CaretRight } from "@phosphor-icons/react";
import { useMemo, useRef, useState, type KeyboardEvent } from "react";

import { cn } from "../lib/cn";
import type { ControlSize } from "../lib/size";

export type DateRange = { start: Date | null; end: Date | null };
export type CalendarSize = ControlSize;

type CommonProps = {
  /** First visible month; defaults to the selected date or today. */
  defaultMonth?: Date;
  month?: Date;
  onMonthChange?: (month: Date) => void;
  isDateDisabled?: (date: Date) => boolean;
  /** BCP 47 locale for the month title, weekdays and day labels. */
  locale?: string;
  /** 0 = Sunday (the Figma calendar), 1 = Monday. */
  weekStartsOn?: 0 | 1;
  className?: string;
  today?: Date;
  /**
   * `default` is the day picker calendar (60:245): centered title-sm month.
   * `popover` is the `Calendar popover` (88:495): 24px radius, left label-lg
   * month and 32px round arrow buttons on the right.
   */
  variant?: "default" | "popover";
  /**
   * `solid` (default) is an opaque surface with a default border. `glass` puts it on the veil (`veil-overlay`),
   * the material of the `DateField` popup; `flat` keeps the 80% white fill of the old thick glass
   * without it (Paper Schedule mini calendar).
   */
  surface?: "glass" | "flat" | "solid";
  /** Days drawn as subtle ink circles in the day cell size, e.g. the week the schedule shows; selection still draws on top. */
  highlight?: Date[];
  /**
   * Day cell size: `sm` 32px, `md` 40px (default, the Figma size), `lg` 48px.
   * Scales the header, padding, weekday row and day text with the cells.
   */
  size?: CalendarSize;
};

const containerSizeClass: Record<CalendarSize, { default: string; popover: string }> = {
  sm: { default: "gap-2 p-3", popover: "w-62 gap-1.5 p-3" },
  md: { default: "gap-3 p-4", popover: "w-77 gap-2 p-3.5" },
  lg: { default: "gap-3.5 p-4.5", popover: "w-92 gap-2.5 p-4" },
};

const titleSizeClass: Record<CalendarSize, string> = {
  sm: "text-label-lg",
  md: "text-title-sm",
  lg: "text-title-md",
};

const popoverTitleSizeClass: Record<CalendarSize, string> = {
  sm: "text-label-md",
  md: "text-label-lg",
  lg: "text-label-lg",
};

const popoverHeaderSizeClass: Record<CalendarSize, string> = {
  sm: "gap-0.5 pb-0.5 pl-1",
  md: "gap-1 pb-1 pl-1.5",
  lg: "gap-1.5 pb-1.5 pl-2",
};

const arrowSizeClass: Record<CalendarSize, string> = {
  sm: "size-4 [&_svg]:size-4",
  md: "size-5 [&_svg]:size-5",
  lg: "size-6 [&_svg]:size-6",
};

const popoverArrowSizeClass: Record<CalendarSize, string> = {
  sm: "size-7 [&_svg]:size-4",
  md: "size-8 [&_svg]:size-4.5",
  lg: "size-10 [&_svg]:size-5",
};

const weekdayHeaderSizeClass: Record<CalendarSize, string> = {
  sm: "h-5 w-8",
  md: "h-6 w-10",
  lg: "h-7 w-12",
};

const daySizeClass: Record<CalendarSize, string> = {
  sm: "size-8",
  md: "size-10",
  lg: "size-12",
};

const dayTextClass: Record<CalendarSize, string> = {
  sm: "text-body-sm",
  md: "text-body-md",
  lg: "text-body-lg",
};

const dayEmphasisClass: Record<CalendarSize, string> = {
  sm: "text-label-md",
  md: "text-label-lg",
  lg: "text-label-lg",
};

const todayDotSizeClass: Record<CalendarSize, string> = {
  sm: "top-6 left-3.5",
  md: "top-8 left-[18px]",
  lg: "top-10 left-[22px]",
};

const popoverDayTextClass: Record<CalendarSize, string> = {
  sm: "[&_[role=gridcell]]:text-label-sm",
  md: "[&_[role=gridcell]]:text-label-md",
  lg: "[&_[role=gridcell]]:text-label-lg",
};

export type CalendarProps = CommonProps &
  (
    | { mode?: "single"; value?: Date | null; onValueChange?: (value: Date) => void }
    | { mode: "range"; value?: DateRange; onValueChange?: (value: DateRange) => void }
  );

const startOfDay = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());
const sameDay = (a: Date | null | undefined, b: Date | null | undefined) =>
  !!a && !!b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
const addDays = (date: Date, days: number) => new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);
const firstOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1);
const addMonths = (date: Date, months: number) => new Date(date.getFullYear(), date.getMonth() + months, 1);

function monthGrid(month: Date, weekStartsOn: 0 | 1): Date[] {
  const first = firstOfMonth(month);
  const lead = (first.getDay() - weekStartsOn + 7) % 7;
  const start = addDays(first, -lead);
  const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const weeks = Math.ceil((lead + daysInMonth) / 7);
  return Array.from({ length: weeks * 7 }, (_, index) => addDays(start, index));
}

/** Figma `Day` (60:125) inside the `Calendar` of the day picker example (60:245). */
export function Calendar(props: CalendarProps) {
  const {
    defaultMonth,
    month: monthProp,
    onMonthChange,
    isDateDisabled,
    locale,
    weekStartsOn = 0,
    className,
    variant = "default",
    surface = "solid",
    highlight,
    size = "md",
  } = props;
  const [now] = useState(() => new Date());
  const today = startOfDay(props.today ?? now);
  const single = props.mode === "range" ? null : (props.value ?? null);
  const range = props.mode === "range" ? (props.value ?? { start: null, end: null }) : null;
  const anchor = range ? range.start : single;
  const [monthState, setMonthState] = useState(() => firstOfMonth(defaultMonth ?? anchor ?? today));
  const month = monthProp ? firstOfMonth(monthProp) : monthState;
  const [focused, setFocused] = useState<Date>(() => anchor ?? today);
  const grid = useRef<HTMLDivElement>(null);
  const [shownMonth, setShownMonth] = useState(month);
  const [slide, setSlide] = useState<"next" | "prev" | null>(null);
  if (month.getTime() !== shownMonth.getTime()) {
    setSlide(month > shownMonth ? "next" : "prev");
    setShownMonth(month);
  }

  const setMonth = (next: Date) => {
    if (!monthProp) setMonthState(next);
    onMonthChange?.(next);
  };

  const days = useMemo(() => monthGrid(month, weekStartsOn), [month, weekStartsOn]);
  const title = new Intl.DateTimeFormat(locale, { month: "long", year: "numeric" }).format(month);
  const weekday = new Intl.DateTimeFormat(locale, { weekday: "narrow" });
  const full = new Intl.DateTimeFormat(locale, { dateStyle: "full" });

  const isSelected = (date: Date) =>
    range ? sameDay(date, range.start) || sameDay(date, range.end) : sameDay(date, single);
  const inRange = (date: Date) =>
    !!range?.start && !!range.end && date > startOfDay(range.start) && date < startOfDay(range.end);

  const select = (date: Date) => {
    if (props.mode === "range") {
      const current = props.value ?? { start: null, end: null };
      const next =
        !current.start || current.end || date < current.start
          ? { start: date, end: null }
          : { start: current.start, end: date };
      props.onValueChange?.(next);
    } else {
      props.onValueChange?.(date);
    }
  };

  const moveFocus = (next: Date) => {
    setFocused(next);
    if (next.getMonth() !== month.getMonth() || next.getFullYear() !== month.getFullYear())
      setMonth(firstOfMonth(next));
    requestAnimationFrame(() => {
      grid.current?.querySelector<HTMLButtonElement>(`[data-date="${next.toDateString()}"]`)?.focus();
    });
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const step: Record<string, number> = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 };
    const offset = step[event.key];
    if (typeof offset === "number") {
      event.preventDefault();
      moveFocus(addDays(focused, offset));
    }
  };

  const focusInMonth = focused.getMonth() === month.getMonth() ? focused : month;

  return (
    <div
      className={cn(
        "relative flex flex-col overflow-clip",
        surface === "solid"
          ? "border border-border-default bg-bg-surface"
          : surface === "glass"
            ? "veil-overlay"
            : "bg-glass-thick",
        variant === "popover"
          ? cn("rounded-[24px]", containerSizeClass[size].popover)
          : cn("w-fit rounded-xl", containerSizeClass[size].default),
        // Paper renders every popover day on the label scale; the default calendar mixes body and label.
        variant === "popover" && popoverDayTextClass[size],
        className,
      )}
    >
      {variant === "popover" ? (
        <div className={cn("relative flex w-full items-center", popoverHeaderSizeClass[size])}>
          <p aria-live="polite" className={cn("min-w-0 flex-1 text-text-primary", popoverTitleSizeClass[size])}>
            {title}
          </p>
          {(
            [
              ["Previous month", -1, <CaretLeft key="prev" />],
              ["Next month", 1, <CaretRight key="next" />],
            ] as const
          ).map(([label, step, icon]) => (
            <button
              key={label}
              type="button"
              aria-label={label}
              className={cn(
                "flex motion-press cursor-pointer items-center justify-center rounded-full text-text-secondary hover:bg-overlay-ink-6",
                popoverArrowSizeClass[size],
              )}
              onClick={() => setMonth(addMonths(month, step))}
            >
              {icon}
            </button>
          ))}
        </div>
      ) : (
        <div className="relative flex w-full items-center">
          <button
            type="button"
            aria-label="Previous month"
            className={cn("flex motion-press cursor-pointer text-text-secondary", arrowSizeClass[size])}
            onClick={() => setMonth(addMonths(month, -1))}
          >
            <CaretLeft />
          </button>
          <p aria-live="polite" className={cn("flex-1 text-center text-text-primary", titleSizeClass[size])}>
            {title}
          </p>
          <button
            type="button"
            aria-label="Next month"
            className={cn("flex motion-press cursor-pointer text-text-secondary", arrowSizeClass[size])}
            onClick={() => setMonth(addMonths(month, 1))}
          >
            <CaretRight />
          </button>
        </div>
      )}
      <div
        key={month.getTime()}
        ref={grid}
        role="grid"
        aria-label={title}
        className={cn(
          "relative flex flex-col",
          slide === "next" && "animate-slide-next",
          slide === "prev" && "animate-slide-prev",
        )}
        onKeyDown={onKeyDown}
      >
        <div role="row" className="flex">
          {days.slice(0, 7).map((date) => (
            <span
              key={date.getDay()}
              role="columnheader"
              className={cn("flex justify-center text-caption text-text-secondary", weekdayHeaderSizeClass[size])}
            >
              {weekday.format(date)}
            </span>
          ))}
        </div>
        {Array.from({ length: days.length / 7 }, (_, week) => (
          <div key={week} role="row" className="flex">
            {days.slice(week * 7, week * 7 + 7).map((date) => {
              const outside = date.getMonth() !== month.getMonth();
              const disabled = isDateDisabled?.(date) ?? false;
              const selected = isSelected(date);
              const between = inRange(date);
              const isToday = sameDay(date, today);
              const marked = !selected && !between && (highlight?.some((day) => sameDay(day, date)) ?? false);
              return (
                <button
                  key={date.toDateString()}
                  type="button"
                  role="gridcell"
                  data-date={date.toDateString()}
                  aria-selected={selected || between}
                  aria-label={full.format(date)}
                  aria-current={isToday ? "date" : undefined}
                  disabled={disabled}
                  tabIndex={sameDay(date, focusInMonth) ? 0 : -1}
                  onClick={() => select(date)}
                  onFocus={() => setFocused(date)}
                  className={cn(
                    "relative flex cursor-pointer flex-col items-center justify-center motion-colors",
                    daySizeClass[size],
                    "focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-text-brand",
                    between
                      ? cn("bg-overlay-ink-8 text-text-primary", dayTextClass[size])
                      : selected
                        ? cn("rounded-full bg-interactive-primary text-text-inverse", dayEmphasisClass[size])
                        : marked
                          ? "rounded-full bg-overlay-ink-6"
                          : "rounded-full hover:not-disabled:bg-overlay-ink-5",
                    !between &&
                      !selected &&
                      (disabled
                        ? cn("cursor-not-allowed text-text-disabled", dayTextClass[size])
                        : outside
                          ? cn("text-text-disabled", dayTextClass[size])
                          : isToday
                            ? cn("text-text-brand", dayEmphasisClass[size])
                            : cn("text-text-primary", dayTextClass[size])),
                  )}
                >
                  {date.getDate()}
                  {isToday && !selected && !between && (
                    <span
                      aria-hidden
                      className={cn("absolute size-1 rounded-full bg-status-live", todayDotSizeClass[size])}
                    />
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
