import { CaretLeft, CaretRight } from "@phosphor-icons/react";
import { useMemo, useRef, useState, type KeyboardEvent } from "react";

import { cn } from "../lib/cn";
import { LiquidGlass } from "./liquid-glass";

export type DateRange = { start: Date | null; end: Date | null };

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
    if (event.key in step) {
      event.preventDefault();
      moveFocus(addDays(focused, step[event.key]));
    }
  };

  const focusInMonth = focused.getMonth() === month.getMonth() ? focused : month;

  return (
    <div
      className={cn(
        "relative flex w-fit flex-col overflow-clip border border-glass-rim-strong bg-glass-thick",
        variant === "popover" ? "gap-2 rounded-[24px] p-3.5" : "gap-3 rounded-xl p-4",
        className,
      )}
    >
      <LiquidGlass tier="thick" />
      {variant === "popover" ? (
        <div className="relative flex w-full items-center gap-1 pb-1 pl-1.5">
          <p aria-live="polite" className="min-w-0 flex-1 text-label-lg text-text-primary">
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
              className="flex size-8 cursor-pointer items-center justify-center rounded-full text-text-secondary hover:bg-overlay-ink-6 [&_svg]:size-4.5"
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
            className="flex size-5 cursor-pointer text-text-secondary [&_svg]:size-5"
            onClick={() => setMonth(addMonths(month, -1))}
          >
            <CaretLeft />
          </button>
          <p aria-live="polite" className="flex-1 text-center text-title-sm text-text-primary">
            {title}
          </p>
          <button
            type="button"
            aria-label="Next month"
            className="flex size-5 cursor-pointer text-text-secondary [&_svg]:size-5"
            onClick={() => setMonth(addMonths(month, 1))}
          >
            <CaretRight />
          </button>
        </div>
      )}
      <div ref={grid} role="grid" aria-label={title} className="relative flex flex-col" onKeyDown={onKeyDown}>
        <div role="row" className="flex">
          {days.slice(0, 7).map((date) => (
            <span
              key={date.getDay()}
              role="columnheader"
              className="flex h-6 w-10 justify-center text-caption text-text-secondary"
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
                    "relative flex size-10 cursor-pointer flex-col items-center justify-center",
                    "focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-text-brand",
                    between
                      ? "bg-overlay-ink-8 text-body-md text-text-primary"
                      : selected
                        ? "rounded-full bg-interactive-primary text-label-lg text-interactive-on-primary"
                        : "rounded-full hover:not-disabled:bg-overlay-ink-5",
                    !between &&
                      !selected &&
                      (disabled
                        ? "cursor-not-allowed text-body-md text-text-disabled"
                        : outside
                          ? "text-body-md text-text-placeholder"
                          : isToday
                            ? "text-label-lg text-text-brand"
                            : "text-body-md text-text-primary"),
                  )}
                >
                  {date.getDate()}
                  {isToday && !selected && !between && (
                    <span aria-hidden className="absolute top-8 left-[18px] size-1 rounded-full bg-status-live" />
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
