import { useEffect, useMemo, useState } from "react";
import { Animated, ScrollView, StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";
import { CaretLeft, CaretRight } from "phosphor-react-native";
import { radius, spacing } from "@horon-ai/tokens";

import { useHoronTheme, type ColorToken, type TextStyleName } from "../provider";
import { GlassSurface } from "../lib/glass-surface";
import { DEFAULT_ICON_WEIGHT } from "../lib/icon";
import { duration, easing } from "../lib/motion";
import { HoronPressable } from "../lib/press";
import { TOUCH_TARGET, touchSlop, type ControlSize } from "../lib/size";
import { HoronText } from "../lib/text";

/**
 * An inclusive date range for {@link Calendar} in `range` mode: both `start` and `end` are selected
 * days, only those two endpoints are stored and the days between them are derived on render. Both
 * ends are `null` before the first tap, and `end` stays `null` while the user is picking the second
 * day.
 */
export type DateRange = {
  /** First selected day, or `null` when the range is empty. */
  start: Date | null;
  /** Last selected day; stays `null` until the second tap completes the range. */
  end: Date | null;
};

/** Day-cell rung of {@link Calendar}; identical to `ControlSize` (`sm` 32pt, `md` 40pt, `lg` 48pt cells). */
export type CalendarSize = ControlSize;

type CommonProps = {
  /** First visible month; defaults to the selected date or today. */
  defaultMonth?: Date;
  /**
   * Controlled visible month. While set, the arrows only report through `onMonthChange` and the
   * component keeps no month state of its own.
   */
  month?: Date;
  /** Fires with the first day of the month the user navigated to. */
  onMonthChange?: (month: Date) => void;
  /** Days for which this returns true render disabled and cannot be selected. */
  isDateDisabled?: (date: Date) => boolean;
  /** BCP 47 locale for the month title, weekdays and day labels. */
  locale?: string;
  /**
   * 0 = Sunday (the Figma calendar), 1 = Monday.
   * @default 0
   */
  weekStartsOn?: 0 | 1;
  /** Outer layout of the frame, appended last. */
  style?: StyleProp<ViewStyle>;
  /** The day drawn as today, with the brand text colour and the live dot; defaults to the real date at mount. */
  today?: Date;
  /**
   * `default` is the day picker calendar (60:245): centered title-sm month. `popover` is the
   * `Calendar popover` (88:495): left label-lg month and round arrow buttons on the right.
   * @default "default"
   */
  variant?: "default" | "popover";
  /**
   * `solid` (default) is an opaque surface with a default border. `glass` puts it on the veil, the
   * material of the `DateField` popup; `flat` keeps the thick glass fill without either.
   * @default "solid"
   */
  surface?: "glass" | "flat" | "solid";
  /** Days drawn as subtle ink circles in the day cell size; selection still draws on top. */
  highlight?: Date[];
  /**
   * Day cell size: `sm` 32pt, `md` 40pt (default, the Figma size), `lg` 48pt. Scales the header,
   * padding, weekday row and day text with the cells.
   * @default "md"
   */
  size?: CalendarSize;
};

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
        /** Fires on every tap during the picking: the first sets `start` and clears `end`, the second sets `end`, and a tap before `start` restarts the range. */
        onValueChange?: (value: DateRange) => void;
      }
  );

/** Frame width and padding per rung, the React Native form of react's `containerSizeClass`. */
const FRAME: Record<CalendarSize, { maxWidth: number; popoverWidth: number; padding: number; gap: number }> = {
  sm: { maxWidth: 250, popoverWidth: 248, padding: spacing["3"], gap: spacing["2"] },
  md: { maxWidth: 314, popoverWidth: 308, padding: spacing["4"], gap: spacing["3"] },
  lg: { maxWidth: 374, popoverWidth: 368, padding: spacing["4"], gap: spacing["3.5"] },
};

const TITLE: Record<CalendarSize, TextStyleName> = {
  sm: "label-lg",
  md: "title-sm",
  lg: "title-md",
};

const POPOVER_TITLE: Record<CalendarSize, TextStyleName> = {
  sm: "label-md",
  md: "label-lg",
  lg: "label-lg",
};

/** Cell ceiling per rung, react's `daySizeClass` (`max-w-8`, `max-w-10`, `max-w-12`). */
const CELL: Record<CalendarSize, number> = { sm: 32, md: 40, lg: 48 };

/** Arrow hit size per rung, react's `arrowSizeClass`. */
const ARROW: Record<CalendarSize, number> = { sm: 22, md: 24, lg: 28 };
const POPOVER_ARROW: Record<CalendarSize, number> = { sm: 24, md: 28, lg: 36 };
const ARROW_ICON: Record<CalendarSize, number> = { sm: 14, md: 16, lg: 18 };
const WEEKDAY_HEIGHT: Record<CalendarSize, number> = { sm: 20, md: 24, lg: 28 };

const DAY_TEXT: Record<CalendarSize, TextStyleName> = {
  sm: "body-sm",
  md: "body-md",
  lg: "body-lg",
};

const DAY_EMPHASIS: Record<CalendarSize, TextStyleName> = {
  sm: "label-md",
  md: "label-lg",
  lg: "label-lg",
};

/** The smallest a cell may become, react's `min-w-7`. */
const CELL_FLOOR = 28;

const startOfDay = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());
const sameDay = (a: Date | null | undefined, b: Date | null | undefined) =>
  !!a && !!b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
const addDays = (date: Date, days: number) => new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);
const firstOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1);
const addMonths = (date: Date, months: number) => new Date(date.getFullYear(), date.getMonth() + months, 1);

/**
 * The seven-column grid a month needs: leading days of the previous month, the month itself and the
 * trailing days that fill the last week.
 *
 * @param month - Any day of the month to lay out.
 * @param weekStartsOn - 0 for Sunday, 1 for Monday.
 * @returns Every day of the grid, in reading order.
 */
function monthGrid(month: Date, weekStartsOn: 0 | 1): Date[] {
  const first = firstOfMonth(month);
  const lead = (first.getDay() - weekStartsOn + 7) % 7;
  const start = addDays(first, -lead);
  const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const weeks = Math.ceil((lead + daysInMonth) / 7);
  return Array.from({ length: weeks * 7 }, (_, index) => addDays(start, index));
}

/**
 * Figma `Day` (60:125) inside the `Calendar` of the day picker example (60:245).
 *
 * A one-month grid with a spoken label on every day: the container is a `grid`, each week a `row`
 * and each weekday a `columnheader`, and a day announces its full date, whether it is selected and
 * whether it is disabled. The month starts from `defaultMonth`, else the selected day, else today,
 * and moves between months with the arrow buttons; `month` makes that controlled. Tapping a day
 * selects it, in `range` mode the first tap starts the range and the second closes it, and
 * `isDateDisabled` keeps a day from being picked. The variant controls the frame (`default` centered
 * header, `popover` left title with round arrows) and `surface` its material.
 *
 * React's arrow-key focus movement, roving `tabIndex` and `onFocus` tracking have no React Native
 * equivalent, so every day is tapped; the month still changes with the arrows, and the grid slides
 * in from the side the arrows moved toward unless the theme asks for reduced motion.
 *
 * @example
 * ```tsx
 * import { useState } from "react";
 * import { Calendar, type DateRange } from "@horon-ai/expo";
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
    style,
    variant = "default",
    surface = "solid",
    highlight,
    size = "md",
  } = props;
  const theme = useHoronTheme();
  const [now] = useState(() => new Date());
  const today = startOfDay(props.today ?? now);
  const single = props.mode === "range" ? null : (props.value ?? null);
  const range = props.mode === "range" ? (props.value ?? { start: null, end: null }) : null;
  const anchor = range ? range.start : single;
  const [monthState, setMonthState] = useState(() => firstOfMonth(defaultMonth ?? anchor ?? today));
  const month = monthProp ? firstOfMonth(monthProp) : monthState;

  const monthKey = month.getTime();
  const [shownKey, setShownKey] = useState(monthKey);
  const [slide, setSlide] = useState<"next" | "prev" | null>(null);
  // The slide direction is read from the month shown on the previous render, the same render-phase
  // adjustment react makes, so the incoming grid enters from the side the arrows moved toward.
  if (monthKey !== shownKey) {
    setSlide(monthKey > shownKey ? "next" : "prev");
    setShownKey(monthKey);
  }

  const [shift] = useState(() => new Animated.Value(0));
  const [fade] = useState(() => new Animated.Value(1));
  useEffect(() => {
    if (!slide) return;
    if (theme.reducedMotion) {
      shift.setValue(0);
      fade.setValue(1);
      return;
    }
    shift.setValue(slide === "next" ? 24 : -24);
    fade.setValue(0);
    Animated.parallel([
      Animated.timing(shift, { toValue: 0, duration: duration.slide, easing: easing.outQuint, useNativeDriver: true }),
      Animated.timing(fade, { toValue: 1, duration: duration.fadeIn, easing: easing.outQuint, useNativeDriver: true }),
    ]).start();
  }, [slide, theme.reducedMotion, shift, fade]);

  const setMonth = (next: Date) => {
    if (!monthProp) setMonthState(next);
    onMonthChange?.(next);
  };

  const days = useMemo(() => monthGrid(month, weekStartsOn), [month, weekStartsOn]);
  const title = new Intl.DateTimeFormat(locale, { month: "long", year: "numeric" }).format(month);
  const weekday = new Intl.DateTimeFormat(locale, { weekday: "narrow" });
  const full = new Intl.DateTimeFormat(locale, { weekday: "long", year: "numeric", month: "long", day: "numeric" });

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

  const frame = FRAME[size];
  const popover = variant === "popover";
  const painted: ColorToken | null = surface === "solid" ? "bg-surface" : surface === "flat" ? "glass-thick" : null;

  const arrow = (label: string, step: number) => {
    const box = popover ? POPOVER_ARROW[size] : ARROW[size];
    const height = theme.touch ? TOUCH_TARGET : box;
    return (
      <HoronPressable
        role="button"
        accessibilityLabel={label}
        hitSlop={touchSlop(theme.touch, height, height)}
        pressScale
        onPress={() => setMonth(addMonths(month, step))}
        style={({ pressed }) => [
          styles.arrow,
          {
            width: Math.max(box, theme.touch ? TOUCH_TARGET : 0),
            height,
            backgroundColor: pressed ? theme.color("overlay-ink-6") : "transparent",
          },
        ]}
      >
        {step < 0 ? (
          <CaretLeft size={ARROW_ICON[size]} color={theme.color("text-secondary")} weight={DEFAULT_ICON_WEIGHT} />
        ) : (
          <CaretRight size={ARROW_ICON[size]} color={theme.color("text-secondary")} weight={DEFAULT_ICON_WEIGHT} />
        )}
      </HoronPressable>
    );
  };

  return (
    <View
      style={[
        styles.frame,
        { gap: frame.gap, padding: frame.padding, maxWidth: popover ? frame.popoverWidth : frame.maxWidth },
        popover && { width: frame.popoverWidth },
        { borderRadius: radius.xl },
        surface === "solid" && { borderWidth: 1, borderColor: theme.color("border-default") },
        painted ? { backgroundColor: theme.color(painted) } : null,
        style,
      ]}
    >
      {surface === "glass" ? <GlassSurface material="veil" radius={radius.xl} style={StyleSheet.absoluteFill} /> : null}
      {popover ? (
        <View style={styles.headerRow}>
          <View style={styles.headerTitle}>
            <Animated.View style={{ opacity: fade }}>
              <HoronText variant={POPOVER_TITLE[size]} numberOfLines={1}>
                {title}
              </HoronText>
            </Animated.View>
          </View>
          {arrow("Previous month", -1)}
          {arrow("Next month", 1)}
        </View>
      ) : (
        <View style={styles.headerRow}>
          {arrow("Previous month", -1)}
          <View style={[styles.headerTitle, styles.headerTitleCenter]}>
            <Animated.View style={{ opacity: fade }}>
              <HoronText variant={TITLE[size]} numberOfLines={1}>
                {title}
              </HoronText>
            </Animated.View>
          </View>
          {arrow("Next month", 1)}
        </View>
      )}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Animated.View style={{ transform: [{ translateX: shift }], opacity: fade }}>
          <View role="grid" accessibilityLabel={title} style={{ gap: 0 }}>
            <View role="row" style={styles.row}>
              {days.slice(0, 7).map((date) => (
                <View
                  key={date.getDay()}
                  role="columnheader"
                  style={[styles.cell, { maxWidth: CELL[size], height: WEEKDAY_HEIGHT[size] }]}
                >
                  <HoronText variant="caption" tone="text-secondary">
                    {weekday.format(date)}
                  </HoronText>
                </View>
              ))}
            </View>
            {Array.from({ length: days.length / 7 }, (_, week) => (
              <View key={week} role="row" style={styles.row}>
                {days.slice(week * 7, week * 7 + 7).map((date) => {
                  const outside = date.getMonth() !== month.getMonth();
                  const disabled = isDateDisabled?.(date) ?? false;
                  const selected = isSelected(date);
                  const between = inRange(date);
                  const isToday = sameDay(date, today);
                  const marked = !selected && !between && (highlight?.some((day) => sameDay(day, date)) ?? false);
                  const tone: ColorToken = between
                    ? "text-primary"
                    : selected
                      ? "text-inverse"
                      : disabled
                        ? "text-disabled"
                        : outside
                          ? "text-placeholder"
                          : isToday
                            ? "text-brand"
                            : "text-primary";
                  return (
                    <HoronPressable
                      key={date.toDateString()}
                      role="button"
                      haptic="selection"
                      disabled={disabled}
                      accessibilityLabel={full.format(date)}
                      accessibilityState={{ selected: selected || between, disabled }}
                      onPress={() => select(date)}
                      style={({ pressed }) => [
                        styles.cell,
                        theme.touch ? styles.cellTouch : { aspectRatio: 1 },
                        {
                          maxWidth: CELL[size],
                          backgroundColor:
                            between || selected || marked
                              ? theme.color(between ? "overlay-ink-8" : selected ? "interactive-primary" : "overlay-ink-6")
                              : pressed && !disabled
                                ? theme.color("overlay-ink-5")
                                : "transparent",
                          borderRadius: between ? radius.none : radius.full,
                        },
                      ]}
                    >
                      <HoronText
                        variant={selected && !between ? DAY_EMPHASIS[size] : DAY_TEXT[size]}
                        tone={tone}
                      >
                        {date.getDate()}
                      </HoronText>
                      {isToday && !selected && !between ? (
                        <View
                          pointerEvents="none"
                          style={[styles.todayDot, { backgroundColor: theme.color("status-live") }]}
                        />
                      ) : null}
                    </HoronPressable>
                  );
                })}
              </View>
            ))}
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  frame: { position: "relative", flexDirection: "column", width: "100%", overflow: "hidden", borderCurve: "continuous" },
  headerRow: { flexDirection: "row", alignItems: "center", width: "100%" },
  headerTitle: { flex: 1, minWidth: 0 },
  headerTitleCenter: { alignItems: "center" },
  arrow: { alignItems: "center", justifyContent: "center", borderRadius: radius.full },
  scrollContent: { flexGrow: 1 },
  row: { flexDirection: "row" },
  cell: {
    flex: 1,
    minWidth: CELL_FLOOR,
    alignItems: "center",
    justifyContent: "center",
  },
  cellTouch: { minHeight: TOUCH_TARGET },
  todayDot: { position: "absolute", bottom: 4, width: 4, height: 4, borderRadius: radius.full, left: "50%", marginLeft: -2 },
});
