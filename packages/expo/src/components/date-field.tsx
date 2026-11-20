import { useEffect, useRef, useState, type ComponentRef } from "react";
import {
  Animated,
  Modal,
  StyleSheet,
  useWindowDimensions,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { CalendarBlank } from "phosphor-react-native";
import { radius, shadow, spacing } from "@horon-ai/tokens";

import { useHoronTheme, type ColorToken } from "../provider";
import { GlassSurface } from "../lib/glass-surface";
import { useInsets } from "../lib/insets";
import { duration, easing } from "../lib/motion";
import { HoronPressable } from "../lib/press";
import { controlHeight, DISABLED_OPACITY, touchSlop, type ControlSize } from "../lib/size";
import { HoronText } from "../lib/text";
import { Calendar, type CalendarProps, type DateRange } from "./calendar";
import { fieldSizeClass, fieldTextClass, type InputSurface } from "./input";

/** Height and text rung of the trigger and the calendar inside: `sm` 32pt, `md` 40pt, `lg` 48pt. */
export type DateFieldSize = ControlSize;
/** Surface of the trigger: `glass` over imagery and glass panels, `solid` on raised surfaces, `solid-on-page` on the page background. */
export type DateFieldSurface = InputSurface;

type WithoutCalendarSurface<T> = T extends unknown ? Omit<T, "size" | "surface"> : never;

/**
 * Props for {@link DateField}: every `Calendar` prop except its own `size` and `surface`, plus the
 * trigger's placeholder, format and layout. `value` is the calendar's value too, so pass a `Date` in
 * `single` mode and a `DateRange` in `range` mode; the trigger text is drawn from the same value.
 */
export type DateFieldProps = WithoutCalendarSurface<CalendarProps> & {
  /**
   * Rung of the trigger, and of the calendar in the popup.
   * @default "md"
   */
  size?: DateFieldSize;
  /**
   * `solid` (default) on raised surfaces, `glass` over imagery and glass panels, `solid-on-page`
   * directly on the page background.
   * @default "solid"
   */
  surface?: DateFieldSurface;
  /**
   * Text while nothing is picked; it also styles as placeholder text.
   * @default "Pick a date"
   */
  placeholder?: string;
  /** Marks the trigger invalid and turns its border danger red. */
  invalid?: boolean;
  /** Dims the trigger and blocks the popup. */
  disabled?: boolean;
  /** Formats the trigger text; defaults to "Oct 20, 2026" and "Oct 20 – Oct 24, 2026". */
  format?: (value: Date | DateRange) => string;
  /** Outer layout of the trigger, appended last; the trigger fills its parent up to 280pt. */
  style?: StyleProp<ViewStyle>;
};

/** Short month names for engines without `Intl`, so the trigger text is deterministic. */
const MONTHS_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/**
 * `Nov 20, 2026` (or `Nov 20` without the year) through `Intl` when the engine has it, with a
 * fallback that writes the same shape so the trigger never depends on ICU being bundled.
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

/** The calendar fills its parent, so the popup names the width of its rung, capped at the window. */
const POPUP_WIDTH: Record<DateFieldSize, number> = { sm: 250, md: 314, lg: 374 };

/** The calendar glyph of the trigger, react's `[&_svg]:size-4|5`. */
const ICON: Record<DateFieldSize, number> = { sm: 16, md: 16, lg: 20 };

/** The trigger's box on screen, from `measureInWindow`; all values are points. */
type AnchorRect = { x: number; y: number; width: number; height: number };

/**
 * Figma `Date field` (60:244): a 280pt field that opens the calendar, in three sizes and two surfaces.
 *
 * A trigger, not an input: the field shows the formatted value or the placeholder and opens the
 * calendar 4pt under its start edge. React portalled the popup and positioned it with Base UI;
 * React Native paints it in a `Modal` anchored to the trigger's measured box, with a scrim that
 * dismisses it on an outside tap and the Android back button closing it through `onRequestClose`.
 * The popup names its own width (250/314/374pt by rung, capped to the window) because the calendar
 * fills its parent.
 *
 * @example
 * ```tsx
 * import { useState } from "react";
 * import { DateField } from "@horon-ai/expo";
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
  style,
  ...calendar
}: DateFieldProps) {
  const theme = useHoronTheme();
  const insets = useInsets();
  const window = useWindowDimensions();
  const value = calendar.value ?? null;
  const text = value ? (format ? format(value) : defaultFormat(value, calendar.locale)) : "";
  const [open, setOpen] = useState(false);
  const [anchor, setAnchor] = useState<AnchorRect | null>(null);
  const [panel, setPanel] = useState({ width: 0, height: 0 });
  const frame = useRef<ComponentRef<typeof View>>(null);

  const measure = () => {
    frame.current?.measureInWindow((x, y, width, height) => setAnchor({ x, y, width, height }));
  };

  const [fade] = useState(() => new Animated.Value(0));
  useEffect(() => {
    if (!open) return;
    if (theme.reducedMotion) {
      fade.setValue(1);
      return;
    }
    fade.setValue(0);
    Animated.timing(fade, { toValue: 1, duration: duration.popIn, easing: easing.outQuint, useNativeDriver: true }).start();
  }, [open, theme.reducedMotion, fade]);

  const glass = surface === "glass";
  const painted = glass ? null : surface === "solid" ? "bg-surface" : "bg-default";
  const borderToken: ColorToken = invalid ? "border-danger" : "border-default";
  const calendarWidth = Math.min(POPUP_WIDTH[size], window.width - spacing["8"]);
  const popupHeight = panel.height > 0 ? panel.height : POPUP_WIDTH[size];
  const below = (anchor?.y ?? 0) + (anchor?.height ?? 0) + spacing["1"];
  const fitsBelow = below + popupHeight <= window.height - insets.bottom - spacing["2"];
  const popupTop = anchor
    ? fitsBelow
      ? below
      : Math.max(insets.top + spacing["2"], anchor.y - spacing["1"] - popupHeight)
    : 0;
  const popupLeft = anchor
    ? Math.max(spacing["2"], Math.min(anchor.x, window.width - calendarWidth - spacing["2"]))
    : spacing["4"];

  return (
    <>
      <View ref={frame} collapsable={false} onLayout={measure} style={styles.anchor}>
        <HoronPressable
          role="button"
          accessibilityState={{ disabled, expanded: open }}
          accessibilityLabel={text || placeholder}
          disabled={disabled}
          haptic="selection"
          onPress={() => {
            if (disabled) return;
            measure();
            setOpen((previous) => !previous);
          }}
          hitSlop={touchSlop(theme.touch, controlHeight[size])}
          style={({ pressed }) => [
            styles.trigger,
            fieldSizeClass[size],
            painted ? { backgroundColor: theme.color(disabled ? "bg-subtle" : painted) } : null,
            { borderWidth: 1, borderColor: theme.color(disabled ? "border-default" : borderToken) },
            glass && disabled && { opacity: 0.6 },
            surface !== "glass" && pressed && !disabled && !invalid && { borderColor: theme.color("border-strong") },
            disabled && { opacity: DISABLED_OPACITY },
            style,
          ]}
        >
          {({ pressed }) => (
            <>
              {glass ? (
                <GlassSurface material="veil" radius={radius.md} pressed={pressed} style={StyleSheet.absoluteFill} />
              ) : null}
              <CalendarBlank size={ICON[size]} color={theme.color(disabled ? "text-disabled" : "text-secondary")} />
              <HoronText
                variant={fieldTextClass[size]}
                tone={disabled ? "text-disabled" : text ? "text-primary" : "text-placeholder"}
                numberOfLines={1}
                style={styles.label}
              >
                {text || placeholder}
              </HoronText>
            </>
          )}
        </HoronPressable>
      </View>

      <Modal visible={open} transparent animationType="none" statusBarTranslucent onRequestClose={() => setOpen(false)}>
        <View style={styles.modalRoot}>
          <HoronPressable
            haptic="none"
            style={StyleSheet.absoluteFill}
            accessibilityElementsHidden
            importantForAccessibility="no-hide-descendants"
            onPress={() => setOpen(false)}
          />
          <Animated.View
            accessibilityViewIsModal
            onLayout={(event) => {
              const { width, height } = event.nativeEvent.layout;
              if (width === panel.width && height === panel.height) return;
              setPanel({ width, height });
            }}
            style={[styles.popup, { opacity: fade, left: popupLeft, top: popupTop, width: calendarWidth }]}
          >
            <Calendar
              {...calendar}
              size={size}
              surface={surface === "glass" ? "glass" : "solid"}
              style={{ width: calendarWidth }}
            />
          </Animated.View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  anchor: { alignSelf: "flex-start", width: "100%", maxWidth: 280 },
  trigger: { flexDirection: "row", alignItems: "center", borderRadius: radius.md, borderCurve: "continuous" },
  label: { flex: 1, minWidth: 0 },
  modalRoot: { flex: 1 },
  popup: { position: "absolute", boxShadow: shadow.popover },
});
