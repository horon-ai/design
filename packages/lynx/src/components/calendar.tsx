import { useState, type ReactNode } from "@lynx-js/react";

import { Icon } from "../icons";
import { cn } from "../lib/cn";
import type { ControlSize } from "../lib/size";

/**
 * An inclusive date range for {@link Calendar} in `range` mode: both `start` and `end` are selected days,
 * only those two endpoints are stored and the days between them are derived on render. Both ends are
 * `null` before the first click, and `end` stays `null` while the user is picking the second day.
 */
export type DateRange = {
  /** First selected day, or `null` when the range is empty. */
  start: Date | null;
  /** Last selected day; stays `null` until the second click completes the range. */
  end: Date | null;
};
/** Day-cell rung of {@link Calendar}; identical to {@link ControlSize} (`sm` 32px, `md` 40px, `lg` 48px cells). */
export type CalendarSize = ControlSize;

type CommonProps = {
  /** First visible month; defaults to the selected date or today. */
  defaultMonth?: Date;
  /**
   * Controlled visible month. While set, the arrows and month changes only report
   * through `onMonthChange` and the component keeps no month state of its own.
   */
  month?: Date;
  /** Fires with the first day of the month the user navigated to. */
  onMonthChange?: (month: Date) => void;
  /** Days for which this returns true render disabled and cannot be selected. */
  isDateDisabled?: (date: Date) => boolean;
  /** BCP 47 locale for the month title, weekdays and day labels. */
  locale?: string;
  /** 0 = Sunday (the Figma calendar), 1 = Monday. @default 0 */
  weekStartsOn?: 0 | 1;
  /** Extra classes merged onto the calendar frame. */
  className?: string;
  /** The day drawn as today, with the brand text color and the live dot; defaults to the real date at mount. */
  today?: Date;
  /**
   * `default` is the day picker calendar (60:245): centered title-sm month.
   * `popover` is the `Calendar popover` (88:495): 24px radius, left label-lg
   * month and 32px round arrow buttons on the right.
   * @default "default"
   */
  variant?: "default" | "popover";
  /**
   * `solid` (default) is an opaque surface with a default border. `glass` puts it on the veil (`veil-overlay`),
   * the material of the `DateField` popup; `flat` keeps the 80% white fill of the old thick glass
   * without it (Paper Schedule mini calendar).
   * @default "solid"
   */
  surface?: "glass" | "flat" | "solid";
  /** Days drawn as subtle ink circles in the day cell size, e.g. the week the schedule shows; selection still draws on top. */
  highlight?: Date[];
  /**
   * Day cell size: `sm` 32px, `md` 40px (default, the Figma size), `lg` 48px.
   * Scales the header, padding, weekday row and day text with the cells.
   * @default "md"
   */
  size?: CalendarSize;
};

const containerSizeClass: Record<
  CalendarSize,
  {
    /** Classes for the `default` variant: fills the parent up to the Figma width. */
    default: string;
    /** Classes for the `popover` variant: fixed Figma width. */
    popover: string;
  }
> = {
  // The default calendar fills its parent up to the Figma width (250/314/374px: seven cells plus padding),
  // so it lands on that size on desktop and folds to the column on a narrow screen. Lynx has no `min-content`
  // sizing, so the grid itself keeps the 7x28px floor (min-w-7 cells) and the frame scrolls sideways below it.
  sm: {
    default: "w-full max-w-[250px] gap-2 p-3",
    popover: "w-[248px] gap-1.5 p-3",
  },
  md: {
    default: "w-full max-w-[314px] gap-3 p-4",
    popover: "w-[308px] gap-2 p-3.5",
  },
  lg: {
    default: "w-full max-w-[374px] gap-3.5 p-4.5",
    popover: "w-[368px] gap-2.5 p-4",
  },
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

/** Arrow hit size per rung; the glyph size is passed to `<Icon>` because Lynx cannot size a foreign `<svg>`. */
const arrowSizeClass: Record<CalendarSize, string> = {
  sm: "h-[22px] w-[22px]",
  md: "h-6 w-6",
  lg: "h-7 w-7",
};

const arrowIconSize: Record<CalendarSize, number> = { sm: 14, md: 16, lg: 18 };

const popoverArrowSizeClass: Record<CalendarSize, string> = {
  sm: "h-6 w-6",
  md: "h-7 w-7",
  lg: "h-9 w-9",
};

const popoverArrowIconSize: Record<CalendarSize, number> = { sm: 14, md: 16, lg: 18 };

const weekdayHeaderSizeClass: Record<CalendarSize, string> = {
  sm: "h-5 max-w-8",
  md: "h-6 max-w-10",
  lg: "h-7 max-w-12",
};

/**
 * Seven cells share one seventh of the calendar each and cap at the Figma size for their rung (32/40/48px),
 * so the grid reads exactly as designed on desktop and narrows instead of overflowing when the calendar is
 * squeezed.
 */
const daySizeClass: Record<CalendarSize, string> = {
  sm: "max-w-8",
  md: "max-w-10",
  lg: "max-w-12",
};

/**
 * A day cell takes an equal share of the row and never drops below 28px, so a phone grid stays tappable
 * while a desktop grid keeps the Figma size from `daySizeClass` as its ceiling.
 */
const cellFluidClass = "min-w-7 flex-1";
const dayShapeClass = "aspect-square";

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

/** The today dot sits 4px above the cell's bottom edge, centred at every rung; centring is inline because Lynx has no `-translate-x-1/2`. */
const TODAY_DOT_STYLE = { left: "50%", bottom: 4, width: 4, height: 4, marginLeft: -2 };

/**
 * Props of {@link Calendar}. `mode` switches the value shape: `single` (the default) works with one
 * `Date`, `range` with a {@link DateRange}; the callback always receives the same shape.
 */
export type CalendarProps = CommonProps &
  (
    | {
        /** Pick one day. @default "single" */
        mode?: "single";
        /** Selected day, or `null` when nothing is selected. */
        value?: Date | null;
        /** Fires when a day is tapped, with the newly selected day. */
        onValueChange?: (value: Date) => void;
      }
    | {
        /** Pick a start and an end day. */
        mode: "range";
        /** Current range; omitted means both ends are empty. */
        value?: DateRange;
        /**
         * Fires on every tap: the first tap sets `start` and clears `end`, the second sets `end`,
         * and a tap before `start` restarts the range at that day.
         */
        onValueChange?: (value: DateRange) => void;
      }
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

/** True when the engine exposes `Intl.DateTimeFormat`; Lynx's native JS engine often does not. */
const hasIntl = (): boolean => typeof Intl !== "undefined" && typeof Intl.DateTimeFormat === "function";

/**
 * Month titles and day labels through `Intl` when the engine has it, with a deterministic English fallback
 * for Lynx engines that ship without ICU. The fallback keeps the same shape (long month + year, narrow
 * weekday letter, "Friday, November 20, 2026" style day label) so a screen reader hears a real date either way.
 */
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const monthTitle = (locale: string | undefined, month: Date): string => {
  if (hasIntl()) return new Intl.DateTimeFormat(locale, { month: "long", year: "numeric" }).format(month);
  return `${MONTHS[month.getMonth()]} ${month.getFullYear()}`;
};

const weekdayNarrow = (locale: string | undefined, date: Date): string => {
  if (hasIntl()) return new Intl.DateTimeFormat(locale, { weekday: "narrow" }).format(date);
  return WEEKDAYS[date.getDay()].slice(0, 1);
};

const fullDayLabel = (locale: string | undefined, date: Date): string => {
  if (hasIntl()) return new Intl.DateTimeFormat(locale, { dateStyle: "full" }).format(date);
  return `${WEEKDAYS[date.getDay()]}, ${MONTHS[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
};

/** The quint-out curve the month slide and the title fade run, written out for an inline animation. */
const EASE_OUT_QUINT = "cubic-bezier(0.22, 1, 0.36, 1)";

/**
 * Figma `Day` (60:125) inside the `Calendar` of the day picker example (60:245).
 *
 * A one-month grid in seven columns with a spoken label on every day. The month starts from
 * `defaultMonth`, else the selected day, else today, and slides between months with the arrow
 * buttons; `month` makes that controlled. The variant controls the frame (`default` centered header,
 * `popover` left title with round arrows) and `surface` its material.
 *
 * Lynx has no keyboard focus model, so react's arrow-key focus movement, roving `tabIndex` and
 * `onFocus` tracking are dropped; every day is tapped instead, and the arrow buttons still navigate
 * months. Disabled days keep react's behaviour and never select.
 *
 * @example
 * ```tsx
 * import { useState } from "@lynx-js/react";
 * import { Calendar, type DateRange } from "@horon-ai/lynx";
 *
 * function Example() {
 *   const [range, setRange] = useState<DateRange>({ start: null, end: null });
 *   return <Calendar mode="range" value={range} onValueChange={setRange} weekStartsOn={1} />;
 * }
 * ```
 */
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
  const days = monthGrid(month, weekStartsOn);
  const title = monthTitle(locale, month);

  // The slide direction is derived from the month that was shown during the previous render, the
  // same render-phase adjustment react makes, so the incoming grid animates from the side the arrows
  // moved toward. `key` restarts the animation.
  const monthKey = month.getTime();
  const [shownMonth, setShownMonth] = useState(monthKey);
  const [slide, setSlide] = useState<"next" | "prev" | null>(null);
  if (monthKey !== shownMonth) {
    setSlide(monthKey > shownMonth ? "next" : "prev");
    setShownMonth(monthKey);
  }

  const setMonth = (next: Date) => {
    if (!monthProp) setMonthState(next);
    onMonthChange?.(next);
  };

  const isSelected = (date: Date) =>
    range ? sameDay(date, range.start) || sameDay(date, range.end) : sameDay(date, single);
  const inRange = (date: Date) =>
    !!range?.start && !!range.end && date > startOfDay(range.start) && date < startOfDay(range.end);

  const select = (date: Date) => {
    if (isDateDisabled?.(date)) return;
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

  const arrows: Array<{ label: string; step: number; icon: ReactNode }> = [
    {
      label: "Previous month",
      step: -1,
      icon: (
        <Icon
          name="CaretLeft"
          size={variant === "popover" ? popoverArrowIconSize[size] : arrowIconSize[size]}
          color="text-secondary"
          weight="bold"
        />
      ),
    },
    {
      label: "Next month",
      step: 1,
      icon: (
        <Icon
          name="CaretRight"
          size={variant === "popover" ? popoverArrowIconSize[size] : arrowIconSize[size]}
          color="text-secondary"
          weight="bold"
        />
      ),
    },
  ];

  /** One round arrow button; Lynx has no `<button>`, so the view reports itself as one. */
  const arrow = (label: string, step: number, icon: ReactNode, boxClass: string) => (
    <view
      className={cn("motion-press flex flex-row items-center justify-center rounded-full", boxClass)}
      bindtap={() => setMonth(addMonths(month, step))}
      accessibility-element
      accessibility-traits="button"
      accessibility-label={label}
    >
      {icon}
    </view>
  );

  return (
    <view
      className={cn(
        "relative flex flex-col",
        // Lynx scrolls through a `<scroll-view>`, so the sideways overflow of react's `overflow-x-auto` is
        // handled by the wrapper below instead of a utility on this frame.
        variant === "popover" ? "overflow-hidden" : "",
        surface === "solid"
          ? "border border-border-default bg-bg-surface"
          : surface === "glass"
            ? "veil-overlay"
            : "bg-glass-thick",
        variant === "popover"
          ? cn("rounded-[24px]", containerSizeClass[size].popover)
          : cn("rounded-xl", containerSizeClass[size].default),
        className,
      )}
    >
      {variant === "popover" ? (
        <view className={cn("relative flex w-full flex-row items-center", popoverHeaderSizeClass[size])}>
          <view className="min-w-0 flex-1" accessibility-label={title}>
            <text
              key={title}
              className={cn("text-text-primary", popoverTitleSizeClass[size])}
              style={{
                animationName: "fade-in",
                animationDuration: "160ms",
                animationTimingFunction: EASE_OUT_QUINT,
                animationFillMode: "both",
              }}
            >
              {title}
            </text>
          </view>
          {arrows.map((entry) => (
            <view key={entry.label}>{arrow(entry.label, entry.step, entry.icon, popoverArrowSizeClass[size])}</view>
          ))}
        </view>
      ) : (
        <view className="relative flex w-full flex-row items-center">
          {arrow("Previous month", -1, arrows[0].icon, arrowSizeClass[size])}
          <view className="flex-1" accessibility-label={title}>
            <text
              key={title}
              className={cn("w-full text-center text-text-primary", titleSizeClass[size])}
              style={{
                animationName: "fade-in",
                animationDuration: "160ms",
                animationTimingFunction: EASE_OUT_QUINT,
                animationFillMode: "both",
              }}
            >
              {title}
            </text>
          </view>
          {arrow("Next month", 1, arrows[1].icon, arrowSizeClass[size])}
        </view>
      )}
      <scroll-view scroll-orientation="horizontal" className="w-full">
        <view
          key={monthKey}
          className="relative flex flex-col"
          style={
            slide
              ? {
                  animationName: slide === "next" ? "slide-shift-next" : "slide-shift-prev",
                  animationDuration: "200ms",
                  animationTimingFunction: EASE_OUT_QUINT,
                  animationFillMode: "both",
                }
              : undefined
          }
          accessibility-label={title}
        >
          <view className="flex flex-row">
            {days.slice(0, 7).map((date) => (
              <view
                key={date.getDay()}
                className={cn("flex flex-row justify-center", cellFluidClass, weekdayHeaderSizeClass[size])}
              >
                <text className="text-caption text-text-secondary">{weekdayNarrow(locale, date)}</text>
              </view>
            ))}
          </view>
          {Array.from({ length: days.length / 7 }, (_, week) => (
            <view key={week} className="flex flex-row">
              {days.slice(week * 7, week * 7 + 7).map((date) => {
                const outside = date.getMonth() !== month.getMonth();
                const disabled = isDateDisabled?.(date) ?? false;
                const selected = isSelected(date);
                const between = inRange(date);
                const isToday = sameDay(date, today);
                const marked = !selected && !between && (highlight?.some((day) => sameDay(day, date)) ?? false);
                return (
                  <view
                    key={date.toDateString()}
                    className={cn(
                      "motion-colors relative flex flex-col items-center justify-center",
                      cellFluidClass,
                      dayShapeClass,
                      daySizeClass[size],
                      between
                        ? "bg-overlay-ink-8"
                        : selected
                          ? "rounded-full bg-interactive-primary"
                          : marked
                            ? "rounded-full bg-overlay-ink-6"
                            : "rounded-full",
                    )}
                    bindtap={() => select(date)}
                    accessibility-element
                    accessibility-label={fullDayLabel(locale, date)}
                    accessibility-value={selected || between ? "selected" : undefined}
                    accessibility-traits={disabled ? "disabled" : "button"}
                  >
                    <text
                      className={cn(
                        between
                          ? "text-text-primary"
                          : selected
                            ? cn("text-text-inverse", dayEmphasisClass[size])
                            : !between &&
                              (disabled
                                ? cn("text-text-disabled", dayTextClass[size])
                                : outside
                                  ? cn("text-text-placeholder", dayTextClass[size])
                                  : isToday
                                    ? cn("text-text-brand", dayEmphasisClass[size])
                                    : cn("text-text-primary", dayTextClass[size])),
                        between && dayTextClass[size],
                      )}
                    >
                      {date.getDate()}
                    </text>
                    {isToday && !selected && !between ? (
                      <view
                        className="absolute rounded-full bg-status-live"
                        style={TODAY_DOT_STYLE}
                        accessibility-elements-hidden
                      />
                    ) : null}
                  </view>
                );
              })}
            </view>
          ))}
        </view>
      </scroll-view>
    </view>
  );
}
