import { useEffect, useState, type ReactNode } from "react";
import { Animated, ScrollView, StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";
import { radius, spacing } from "@horon-ai/tokens";

import { useHoronTheme } from "../provider";
import { HoronPressable } from "../lib/press";
import { useActiveIndicator } from "../hooks/use-active-indicator";
import { easing } from "../lib/motion";
import { DISABLED_OPACITY } from "../lib/size";
import { HoronText } from "../lib/text";

/** One option in a `FilterBar`. */
export type FilterBarItem = {
  /** Stable value reported through `onValueChange` and compared with `value`. */
  value: string;
  /** Visible chip text; normally a short noun such as `All` or `Agents`. */
  label: ReactNode;
  /** Count shown after the label, such as 4. Omit to hide the slot. */
  count?: number;
  /** Disables just this option: 40% opacity, not pressable. */
  disabled?: boolean;
};

/** Props of {@link FilterBar}: the options and the selection, controlled or uncontrolled. */
export type FilterBarProps = {
  /** Options in display order; the first one is the initial selection when `defaultValue` is omitted. */
  items: FilterBarItem[];
  /** Controlled selection. Pass `onValueChange` to hear about presses. */
  value?: string;
  /** Initial selection when uncontrolled. @default items[0].value */
  defaultValue?: string;
  /** Called with the pressed option's `value`; presses on the already-selected option still fire. */
  onValueChange?: (value: string) => void;
  /** Accessible name of the group. @default "Filter" */
  "aria-label"?: string;
  /** Accessible name in React Native's own spelling; the same name as `aria-label`. */
  accessibilityLabel?: string;
  /** Outer layout, merged onto the scrolling track. */
  style?: StyleProp<ViewStyle>;
};

/** The 280ms emphasised travel of the selection pill between options, react's `motion-indicator`. */
const TRAVEL = 280;

/**
 * Paper `Filter bar` (Agents N2): a 5% ink pill track with 30pt options; the
 * selected option sits on a sliding 10% ink pill. The pills never wrap, so a
 * screen too narrow for all of them scrolls the track sideways instead of
 * widening the page.
 *
 * Selection is controlled through `value` or uncontrolled from `defaultValue`,
 * which falls back to the first item. The group announces `radiogroup` with its
 * name (`Filter` when omitted) and every option a `radio` with its checked
 * state, so assistive technology reads it as a single-choice list. The pill is
 * placed from the measured box of the selected option and lands without sliding
 * on the first paint; Reduce Motion moves it without the travel.
 *
 * @example
 * ```tsx
 * import { useState } from "react";
 * import { FilterBar } from "@horon-ai/expo";
 *
 * function Scope() {
 *   const [scope, setScope] = useState("all");
 *   return (
 *     <FilterBar
 *       aria-label="Scope"
 *       value={scope}
 *       onValueChange={setScope}
 *       items={[
 *         { value: "all", label: "All", count: 12 },
 *         { value: "agents", label: "Agents", count: 4 },
 *         { value: "archived", label: "Archived", disabled: true },
 *       ]}
 *     />
 *   );
 * }
 * ```
 */
export function FilterBar({
  items,
  value,
  defaultValue,
  onValueChange,
  "aria-label": ariaLabel = "Filter",
  accessibilityLabel,
  style,
}: FilterBarProps) {
  const theme = useHoronTheme();
  const [own, setOwn] = useState(defaultValue ?? items[0]?.value);
  const selected = value ?? own;
  const activeIndex = items.findIndex((item) => item.value === selected);
  const { rect, animate, bindItem } = useActiveIndicator(activeIndex);
  const [left] = useState(() => new Animated.Value(0));
  const [top] = useState(() => new Animated.Value(0));
  const [width] = useState(() => new Animated.Value(0));
  const [height] = useState(() => new Animated.Value(0));

  useEffect(() => {
    if (!rect) return undefined;
    const targets: [Animated.Value, number][] = [
      [left, rect.left],
      [top, rect.top],
      [width, rect.width],
      [height, rect.height],
    ];
    if (!animate || theme.reducedMotion) {
      for (const [target, goal] of targets) target.setValue(goal);
      return undefined;
    }
    const slide = Animated.parallel(
      targets.map(([target, goal]) =>
        Animated.timing(target, { toValue: goal, duration: TRAVEL, easing: easing.emphasized, useNativeDriver: false }),
      ),
    );
    slide.start();
    return () => {
      slide.stop();
    };
  }, [animate, height, left, rect, theme.reducedMotion, top, width]);

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scrolled}
      style={[styles.scroll, style]}
    >
      <View
        role="radiogroup"
        accessibilityLabel={accessibilityLabel ?? ariaLabel}
        style={[styles.track, { backgroundColor: theme.color("overlay-ink-5") }]}
      >
        {activeIndex < 0 || !rect ? null : (
          <Animated.View
            style={[
              styles.pill,
              {
                left,
                top,
                width,
                height,
                backgroundColor: theme.color("overlay-ink-10"),
              },
            ]}
          />
        )}
        {items.map((item, index) => {
          const active = item.value === selected;
          return (
            <HoronPressable
              key={item.value}
              haptic="selection"
              role="radio"
              accessibilityState={{ checked: active, disabled: item.disabled }}
              disabled={item.disabled}
              onPress={() => {
                setOwn(item.value);
                onValueChange?.(item.value);
              }}
              {...bindItem(index)}
              style={({ pressed }) => [
                styles.option,
                {
                  minHeight: theme.touch ? 44 : 30,
                  backgroundColor: pressed && !active ? theme.color("overlay-ink-5") : undefined,
                },
                item.disabled && { opacity: DISABLED_OPACITY },
              ]}
            >
              <HoronText variant="label-md" tone={active ? "text-primary" : "text-secondary"} numberOfLines={1}>
                {item.label}
              </HoronText>
              {item.count === undefined ? null : (
                <HoronText variant="caption" tone="text-secondary" numberOfLines={1}>
                  {item.count}
                </HoronText>
              )}
            </HoronPressable>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { maxWidth: "100%", flexGrow: 0, alignSelf: "flex-start" },
  scrolled: { flexDirection: "row" },
  track: {
    position: "relative",
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    padding: 3,
    overflow: "hidden",
    borderRadius: radius.full,
    borderCurve: "continuous",
  },
  pill: { position: "absolute", borderRadius: radius.full },
  option: {
    flexShrink: 0,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing["1.5"],
    paddingHorizontal: spacing["4"],
    borderRadius: radius.full,
  },
});
