import { useEffect, useRef, useState, type ComponentRef, type ReactNode } from "react";
import {
  Animated,
  Dimensions,
  Modal,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { CalendarBlank, CaretDown, Check, Clock, Repeat } from "phosphor-react-native";
import { radius, shadow, spacing } from "@horon-ai/tokens";

import { useHoronTheme, type TextStyleName } from "../provider";
import { GlassSurface } from "../lib/glass-surface";
import { duration, easing } from "../lib/motion";
import { HoronPressable } from "../lib/press";
import { controlHeight, TOUCH_TARGET, touchSlop, type ControlSize } from "../lib/size";
import { HoronText } from "../lib/text";

/**
 * Field size of a picker, on the shared control scale: `sm` 32px, `md` 40px, `lg` 48px.
 */
export type PickerFieldSize = ControlSize;

/** Props for {@link PickerField}: the choices, the selection and the field's look. */
export type PickerFieldProps = {
  /** Choices in the popup; `value` is what `onValueChange` returns, `label` is what the row and trigger show. */
  items: {
    /** Value reported when the item is picked. */
    value: string;
    /** Text shown on the trigger and in the popup row. */
    label: ReactNode;
  }[];
  /** Selected value in controlled mode. */
  value?: string;
  /** Starting value in uncontrolled mode. */
  defaultValue?: string;
  /** Fires with the newly selected value, or `null` when the choice is cleared, after a pick. */
  onValueChange?: (value: string | null) => void;
  /** Leading icon, 16px on `sm` and `md` and 20px on `lg`; the Time field uses a clock. */
  icon?: ReactNode;
  /**
   * `solid` (default) is the opaque surface field with a default border, `glass` the veil field,
   * `inset` the 4% ink field inside the schedule card.
   * @default "solid"
   */
  surface?: "solid" | "glass" | "inset";
  /**
   * Field size: `sm` 32px, `md` 40px (default), `lg` 48px; scales width, icon and menu rows.
   * @default "md"
   */
  size?: PickerFieldSize;
  /** Accessible name of the trigger when no visible label is associated with it. */
  "aria-label"?: string;
  /** Layout merged onto the trigger (margins). */
  style?: StyleProp<ViewStyle>;
};

const triggerWidth: Record<PickerFieldSize, number> = { sm: 144, md: 160, lg: 176 };
const triggerPadding: Record<PickerFieldSize, number> = { sm: spacing["3"], md: spacing["3.5"], lg: spacing["5"] };
const triggerGap: Record<PickerFieldSize, number> = { sm: spacing["1.5"], md: spacing["2"], lg: spacing["2.5"] };
const triggerIcon: Record<PickerFieldSize, number> = { sm: 16, md: 16, lg: 20 };
const caretIcon: Record<PickerFieldSize, number> = { sm: 16, md: 16, lg: 20 };
const valueVariant: Record<PickerFieldSize, TextStyleName> = {
  sm: "body-sm",
  md: "body-md",
  lg: "body-lg",
};
const popupPadding: Record<PickerFieldSize, number> = { sm: spacing["1"], md: spacing["1.5"], lg: spacing["2"] };
const itemVariant: Record<PickerFieldSize, TextStyleName> = { sm: "label-sm", md: "label-md", lg: "label-lg" };
const itemRow: Record<PickerFieldSize, ViewStyle> = {
  sm: { height: controlHeight.sm, gap: spacing["2"], paddingHorizontal: spacing["2.5"] },
  md: { height: controlHeight.md, gap: spacing["2.5"], paddingHorizontal: spacing["3"] },
  lg: { height: controlHeight.lg, gap: spacing["3"], paddingHorizontal: spacing["4"] },
};
const itemIndicator: Record<PickerFieldSize, number> = { sm: 16, md: 16, lg: 20 };
const itemGap = spacing["0.5"];
const POPUP_MAX_HEIGHT = 288;
const POPUP_OFFSET = 8;

/** True for text the field can set in its own type token; a node keeps its own styling. */
const isPlainText = (value: ReactNode): value is string | number =>
  typeof value === "string" || typeof value === "number";

/** The trigger's box in window points, from `measureInWindow`. */
type Anchor = { x: number; y: number; width: number; height: number };

/**
 * Figma `Time field` (Routine schedule 110:765): a 160px picker on the same 32/40/48px and 14/16/18 text rungs as `Input`.
 *
 * React portalled the popup to the body and let Base UI position it; React Native has no portal, so
 * the popup is a transparent `Modal` anchored to the trigger's measured box, 8pt under it, at least
 * as wide as the trigger, flipped above when the bottom of the window has no room and capped at
 * 288pt. The caret turns while the list is open. A tap anywhere outside the list closes it, as the
 * outside press did in React, and Android back does too.
 *
 * @example
 * ```tsx
 * import { useState } from "react";
 * import { PickerField } from "@horon-ai/expo";
 *
 * function Example() {
 *   const [time, setTime] = useState("09:00");
 *   return (
 *     <PickerField
 *       aria-label="Start time"
 *       value={time}
 *       onValueChange={(next) => setTime(next ?? time)}
 *       items={[
 *         { value: "09:00", label: "9:00 AM" },
 *         { value: "10:00", label: "10:00 AM" },
 *       ]}
 *     />
 *   );
 * }
 * ```
 */
export function PickerField({
  items,
  icon,
  surface = "solid",
  size = "md",
  "aria-label": ariaLabel,
  value: controlledValue,
  defaultValue,
  onValueChange,
  style,
}: PickerFieldProps) {
  const theme = useHoronTheme();
  const [internalValue, setInternalValue] = useState<string | undefined>(defaultValue);
  const [open, setOpen] = useState(false);
  const [anchor, setAnchor] = useState<Anchor | null>(null);
  const trigger = useRef<ComponentRef<typeof View>>(null);
  const [turn] = useState(() => new Animated.Value(0));

  const value = controlledValue === undefined ? internalValue : controlledValue;
  const current = items.find((item) => item.value === value);
  const height = theme.touch ? TOUCH_TARGET : controlHeight[size];

  useEffect(() => {
    if (theme.reducedMotion) {
      turn.setValue(open ? 1 : 0);
      return;
    }
    Animated.timing(turn, {
      toValue: open ? 1 : 0,
      duration: duration.slide,
      easing: easing.outQuint,
      useNativeDriver: true,
    }).start();
  }, [open, theme.reducedMotion, turn]);

  const openList = () => {
    setOpen(true);
    trigger.current?.measureInWindow((x, y, width, measuredHeight) => {
      setAnchor({ x, y, width, height: measuredHeight });
    });
  };

  const choose = (next: string) => {
    if (controlledValue === undefined) setInternalValue(next);
    onValueChange?.(next);
    setOpen(false);
  };

  const rowHeight = theme.touch ? Math.max(TOUCH_TARGET, controlHeight[size]) : controlHeight[size];
  const listHeight = Math.min(POPUP_MAX_HEIGHT, items.length * (rowHeight + itemGap) + popupPadding[size] * 2);
  const screen = Dimensions.get("window");
  const below = anchor === null ? POPUP_OFFSET : anchor.y + anchor.height + POPUP_OFFSET;
  // Flip above the trigger when the list would run off the bottom and there is room on top.
  const flip = anchor !== null && below + listHeight > screen.height && anchor.y - POPUP_OFFSET - listHeight > 0;
  const top = anchor === null ? 0 : flip ? anchor.y - POPUP_OFFSET - listHeight : below;
  const left =
    anchor === null ? 0 : Math.max(spacing["2"], Math.min(anchor.x, screen.width - anchor.width - spacing["2"]));

  return (
    <>
      <View ref={trigger} collapsable={false} style={styles.triggerHost}>
        <HoronPressable
          role="combobox"
          accessibilityLabel={ariaLabel}
          accessibilityState={{ expanded: open }}
          accessibilityValue={{ text: isPlainText(current?.label) ? String(current.label) : undefined }}
          onPress={openList}
          style={({ pressed }) => [
            styles.trigger,
            {
              width: triggerWidth[size],
              height,
              paddingHorizontal: triggerPadding[size],
              gap: triggerGap[size],
              borderWidth: surface === "solid" ? 1 : 0,
              borderColor: surface === "solid" ? theme.color("border-default") : "transparent",
              backgroundColor:
                surface === "solid"
                  ? theme.color("bg-surface")
                  : surface === "inset"
                    ? theme.color("overlay-ink-4")
                    : undefined,
            },
            pressed && surface === "solid" && { borderColor: theme.color("border-strong") },
            style,
          ]}
        >
          {({ pressed }) => (
            <>
              {surface === "glass" ? (
                <GlassSurface material="veil" radius={radius.md} pressed={pressed} style={StyleSheet.absoluteFill} />
              ) : null}
              <View style={styles.triggerIcon}>
                {icon ?? <Clock size={triggerIcon[size]} color={theme.color("text-secondary")} />}
              </View>
              <View style={styles.triggerValue}>
                {isPlainText(current?.label) ? (
                  <HoronText variant={valueVariant[size]} tone="text-primary" numberOfLines={1}>
                    {current?.label}
                  </HoronText>
                ) : (
                  (current?.label ?? null)
                )}
              </View>
              <Animated.View
                style={{
                  transform: [{ rotate: turn.interpolate({ inputRange: [0, 1], outputRange: ["0deg", "180deg"] }) }],
                }}
              >
                <CaretDown size={caretIcon[size]} color={theme.color("text-secondary")} />
              </Animated.View>
            </>
          )}
        </HoronPressable>
      </View>
      <Modal visible={open} transparent animationType="none" statusBarTranslucent onRequestClose={() => setOpen(false)}>
        <HoronPressable haptic="none" style={styles.scrim} accessibilityLabel="Close" onPress={() => setOpen(false)} />
        <View
          accessibilityViewIsModal
          role="menu"
          style={[
            styles.popup,
            {
              top,
              left,
              minWidth: anchor?.width ?? triggerWidth[size],
              maxHeight: POPUP_MAX_HEIGHT,
              padding: popupPadding[size],
            },
          ]}
        >
          {surface === "solid" ? (
            <View
              style={[
                StyleSheet.absoluteFill,
                styles.popupSolid,
                {
                  borderColor: theme.color("border-default"),
                  backgroundColor: theme.color("bg-surface"),
                  boxShadow: shadow.popover,
                },
              ]}
            />
          ) : (
            <GlassSurface material="veil" radius={radius.xl} style={StyleSheet.absoluteFill} />
          )}
          {items.map((item) => {
            const selected = item.value === value;
            return (
              <HoronPressable
                key={item.value}
                role="menuitem"
                haptic="selection"
                accessibilityLabel={isPlainText(item.label) ? String(item.label) : item.value}
                accessibilityState={{ selected }}
                onPress={() => choose(item.value)}
                style={({ pressed }) => [
                  styles.item,
                  itemRow[size],
                  { height: rowHeight },
                  (pressed || selected) && { backgroundColor: theme.color("overlay-ink-6") },
                ]}
              >
                <View style={styles.itemLabel}>
                  {isPlainText(item.label) ? (
                    <HoronText variant={itemVariant[size]} numberOfLines={1}>
                      {item.label}
                    </HoronText>
                  ) : (
                    item.label
                  )}
                </View>
                {selected ? (
                  <Check size={itemIndicator[size]} color={theme.color("text-primary")} />
                ) : null}
              </HoronPressable>
            );
          })}
        </View>
      </Modal>
    </>
  );
}

/**
 * Day circle size: `sm` 32px, `md` 36px, `lg` 44px.
 */
export type WeekdayPickerSize = ControlSize;

/** Props for {@link WeekdayPicker}. It is a multiple-selection toggle group, so `value` and `onValueChange` carry an array of day values. */
export type WeekdayPickerProps = {
  /** One entry per day, in display order. */
  days: {
    /** Value that goes into `value` and `onValueChange`. */
    value: string;
    /** Short text on the circle, such as "M". */
    label: string;
    /** Accessible name of the toggle, such as "Monday". */
    name: string;
  }[];
  /** Selected day values in controlled mode. */
  value?: string[];
  /** Selected day values at first render in uncontrolled mode. */
  defaultValue?: string[];
  /** Fires with the complete next selection whenever a day is toggled on or off. */
  onValueChange?: (value: string[]) => void;
  /**
   * Day circle size: `sm` 32px, `md` 36px (default), `lg` 44px.
   * @default "md"
   */
  size?: WeekdayPickerSize;
  /** Accessible name of the group. */
  "aria-label"?: string;
  /** Layout merged onto the wrapping row (margins). */
  style?: StyleProp<ViewStyle>;
};

const weekdayCircle: Record<WeekdayPickerSize, number> = { sm: 32, md: 36, lg: 44 };
const weekdayGap: Record<WeekdayPickerSize, number> = { sm: spacing["1"], md: spacing["1.5"], lg: spacing["2"] };
const weekdayVariant: Record<WeekdayPickerSize, TextStyleName> = {
  sm: "label-sm",
  md: "label-md",
  lg: "label-lg",
};

/**
 * Figma `Weekday picker` (110:765): 36px round toggles, ink when on and 6% ink when off.
 *
 * Toggling one day does not close the group; each press reports the whole next selection. The row
 * wraps instead of shrinking its circles, and a touch device grows the two smaller rungs to the 44pt
 * target React got from `pointer-coarse:`.
 *
 * @example
 * ```tsx
 * import { WeekdayPicker } from "@horon-ai/expo";
 *
 * function Example() {
 *   return (
 *     <WeekdayPicker
 *       aria-label="Repeat on"
 *       defaultValue={["mon", "wed", "fri"]}
 *       days={[
 *         { value: "mon", label: "M", name: "Monday" },
 *         { value: "tue", label: "T", name: "Tuesday" },
 *         { value: "wed", label: "W", name: "Wednesday" },
 *       ]}
 *     />
 *   );
 * }
 * ```
 */
export function WeekdayPicker({
  days,
  value: controlledValue,
  defaultValue,
  onValueChange,
  size = "md",
  "aria-label": ariaLabel,
  style,
}: WeekdayPickerProps) {
  const theme = useHoronTheme();
  const [internal, setInternal] = useState<string[]>(defaultValue ?? []);
  const selected = controlledValue ?? internal;
  const circle = theme.touch ? Math.max(TOUCH_TARGET, weekdayCircle[size]) : weekdayCircle[size];

  const toggle = (day: string) => {
    const next = selected.includes(day) ? selected.filter((entry) => entry !== day) : [...selected, day];
    if (controlledValue === undefined) setInternal(next);
    onValueChange?.(next);
  };

  return (
    <View role="toolbar" accessibilityLabel={ariaLabel ?? "Days"} style={[styles.weekdayRow, { gap: weekdayGap[size] }, style]}>
      {days.map((day) => {
        const on = selected.includes(day.value);
        return (
          <HoronPressable
            key={day.value}
            role="button"
            haptic="selection"
            pressScale
            accessibilityLabel={day.name}
            accessibilityState={{ selected: on }}
            hitSlop={touchSlop(theme.touch, circle, circle)}
            onPress={() => toggle(day.value)}
            style={[
              styles.weekday,
              {
                width: circle,
                height: circle,
                backgroundColor: theme.color(on ? "interactive-primary" : "overlay-ink-6"),
              },
            ]}
          >
            <HoronText variant={weekdayVariant[size]} tone={on ? "interactive-on-primary" : "text-secondary"}>
              {day.label}
            </HoronText>
          </HoronPressable>
        );
      })}
    </View>
  );
}

/** Props for {@link ScheduleCard}. The card is a plain section: it lays out what you pass and draws the frame, header and next-run strip around it. */
export type ScheduleCardProps = {
  /** Header title next to the repeat icon. */
  title: ReactNode;
  /** The "Next run" line at the bottom; without it the strip is not rendered. */
  nextRun?: ReactNode;
  /** Body of the card, usually a stack of `ScheduleSection` blocks and pickers. */
  children: ReactNode;
  /**
   * Card size: `sm` 340px, `md` 380px (default), `lg` 420px; scales padding, gaps and text.
   * @default "md"
   */
  size?: ControlSize;
  /**
   * `solid` (default) is an opaque surface card with a default border; `glass` is the thick glass card.
   * @default "solid"
   */
  surface?: "solid" | "glass";
  /** Layout merged onto the card (margins). */
  style?: StyleProp<ViewStyle>;
};

/** The Figma card widths (340/380/420px) are the maximum: a narrow column folds the card to its width. */
const cardFrame: Record<ControlSize, ViewStyle> = {
  sm: { maxWidth: 340, gap: spacing["3"], padding: spacing["4"] },
  md: { maxWidth: 380, gap: spacing["4"], padding: spacing["5"] },
  lg: { maxWidth: 420, gap: spacing["4"], padding: spacing["5"] },
};
const cardHeaderGap: Record<ControlSize, number> = { sm: spacing["2"], md: spacing["2.5"], lg: spacing["3"] };
const cardIcon: Record<ControlSize, number> = { sm: 16, md: 16, lg: 20 };
const cardTitleVariant: Record<ControlSize, TextStyleName> = { sm: "label-md", md: "label-lg", lg: "label-lg" };
const nextRunFrame: Record<ControlSize, ViewStyle> = {
  sm: { gap: spacing["1.5"], paddingHorizontal: spacing["2.5"], paddingVertical: spacing["2"] },
  md: { gap: spacing["2"], paddingHorizontal: spacing["3"], paddingVertical: spacing["2"] },
  lg: { gap: spacing["2.5"], paddingHorizontal: spacing["3.5"], paddingVertical: spacing["3"] },
};
const nextRunVariant: Record<ControlSize, TextStyleName> = { sm: "label-md", md: "label-md", lg: "label-lg" };
const nextRunIcon: Record<ControlSize, number> = { sm: 14, md: 16, lg: 20 };

/**
 * Figma `Routine schedule card` (110:765): a 380px card, 20px padding, 16px gaps, solid or thick glass.
 *
 * Compose it from `ScheduleSection` blocks holding `WeekdayPicker`, `PickerField` or `Input`
 * controls. On a narrow column the card folds to the available width instead of overflowing, and
 * `glass` is a `GlassSurface`.
 *
 * @example
 * ```tsx
 * import { PickerField, ScheduleCard, ScheduleSection, WeekdayPicker } from "@horon-ai/expo";
 *
 * function Example() {
 *   return (
 *     <ScheduleCard title="Morning digest" nextRun="Next run tomorrow at 9:00 AM">
 *       <ScheduleSection label="Repeat">
 *         <PickerField
 *           aria-label="Repeat"
 *           surface="inset"
 *           items={[
 *             { value: "daily", label: "Daily" },
 *             { value: "weekly", label: "Weekly" },
 *           ]}
 *         />
 *       </ScheduleSection>
 *       <ScheduleSection label="Days">
 *         <WeekdayPicker days={[{ value: "mon", label: "M", name: "Monday" }]} />
 *       </ScheduleSection>
 *     </ScheduleCard>
 *   );
 * }
 * ```
 */
export function ScheduleCard({ title, nextRun, children, size = "md", surface = "solid", style }: ScheduleCardProps) {
  const theme = useHoronTheme();

  return (
    <View
      style={[
        styles.card,
        cardFrame[size],
        surface === "glass"
          ? { borderRadius: radius.xl, overflow: "hidden" }
          : {
              borderRadius: radius.xl,
              borderCurve: "continuous",
              borderWidth: 1,
              borderColor: theme.color("border-default"),
              backgroundColor: theme.color("bg-surface"),
            },
        style,
      ]}
    >
      {surface === "glass" ? (
        <GlassSurface tier="thick" radius={radius.xl} style={StyleSheet.absoluteFill} />
      ) : null}
      <View style={[styles.cardHeader, { gap: cardHeaderGap[size] }]}>
        <Repeat size={cardIcon[size]} color={theme.color("text-primary")} />
        <View style={styles.cardTitle}>
          {isPlainText(title) ? (
            <HoronText variant={cardTitleVariant[size]}>{title}</HoronText>
          ) : (
            title
          )}
        </View>
      </View>
      {children}
      {nextRun ? (
        <View
          style={[
            styles.nextRun,
            nextRunFrame[size],
            { backgroundColor: theme.color("accent-sky-500-16"), borderCurve: "continuous" },
          ]}
        >
          <CalendarBlank size={nextRunIcon[size]} color={theme.color("text-primary")} />
          <View style={styles.nextRunText}>
            {isPlainText(nextRun) ? (
              <HoronText variant={nextRunVariant[size]}>{nextRun}</HoronText>
            ) : (
              nextRun
            )}
          </View>
        </View>
      ) : null}
    </View>
  );
}

const sectionGap: Record<ControlSize, number> = { sm: spacing["1"], md: spacing["2"], lg: spacing["2"] };
const sectionLabelVariant: Record<ControlSize, TextStyleName> = {
  sm: "caption",
  md: "caption",
  lg: "label-sm",
};

/**
 * A captioned block inside the schedule card, such as "Repeat" or "Days".
 *
 * Part of {@link ScheduleCard}. It sets the caption in secondary text above its children, so a card
 * body reads as a stack of labelled controls.
 */
export function ScheduleSection({
  label,
  children,
  size = "md",
  style,
}: {
  /** Caption above the control, in secondary text. */
  label: ReactNode;
  /** The control the caption belongs to. */
  children: ReactNode;
  /**
   * Matches the size of the controls inside the section; scales the caption rung and the caption gap.
   * @default "md"
   */
  size?: ControlSize;
  /** Layout merged onto the block (margins). */
  style?: StyleProp<ViewStyle>;
}) {
  return (
    <View style={[styles.section, { gap: sectionGap[size] }, style]}>
      {isPlainText(label) ? (
        <HoronText variant={sectionLabelVariant[size]} tone="text-secondary">
          {label}
        </HoronText>
      ) : (
        label
      )}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  triggerHost: { alignSelf: "flex-start", maxWidth: "100%" },
  trigger: {
    flexDirection: "row",
    alignItems: "center",
    maxWidth: "100%",
    minWidth: 0,
    borderRadius: radius.md,
    borderCurve: "continuous",
    overflow: "hidden",
  },
  triggerIcon: { flexShrink: 0 },
  triggerValue: { flex: 1, minWidth: 0 },
  scrim: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0 },
  popup: {
    position: "absolute",
    borderRadius: radius.xl,
    borderCurve: "continuous",
    overflow: "hidden",
  },
  popupSolid: { borderRadius: radius.xl, borderCurve: "continuous", borderWidth: 1 },
  item: { flexDirection: "row", alignItems: "center", borderRadius: radius.md, borderCurve: "continuous" },
  itemLabel: { flex: 1, minWidth: 0 },
  weekdayRow: { flexDirection: "row", flexWrap: "wrap", alignItems: "center" },
  weekday: { alignItems: "center", justifyContent: "center", borderRadius: radius.full },
  card: { width: "100%", alignItems: "stretch", borderCurve: "continuous" },
  cardHeader: { flexDirection: "row", alignItems: "center" },
  cardTitle: { flex: 1, minWidth: 0 },
  nextRun: { flexDirection: "row", alignItems: "center", borderRadius: radius.md },
  nextRunText: { flex: 1, minWidth: 0 },
  section: { flexDirection: "column", minWidth: 0 },
});
