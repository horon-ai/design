import { useEffect, useState, type ReactNode } from "react";
import { Animated, ScrollView, StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";
import { radius } from "@horon-ai/tokens";

import { useHoronTheme } from "../provider";
import { HoronPressable } from "../lib/press";
import { useActiveIndicator } from "../hooks/use-active-indicator";
import { GlassSurface } from "../lib/glass-surface";
import { easing } from "../lib/motion";
import { DISABLED_OPACITY, type ControlSize } from "../lib/size";
import { HoronText } from "../lib/text";

/** `tab` keeps Paper's page-tab rung beside the three control sizes. */
export type SegmentedControlSize = ControlSize | "tab";

/**
 * Track treatment of a segmented control.
 *
 * - `solid` — opaque surface track with a default border and a 10% ink selection.
 * - `glass` — regular glass; the selection is a thick glass pill over it.
 * - `inset` — 5% ink track, for use inside a routine card.
 * - `inset-faint` — 4% ink track, for the header filter row.
 * - `subtle` — `bg-subtle` page-tab tray whose selection is a plain surface pill.
 */
export type SegmentedControlSurface = "solid" | "glass" | "inset" | "inset-faint" | "subtle";

/** Props for {@link SegmentedControl}. The control is single-choice: only one item value is selected. */
export type SegmentedControlProps = {
  /** Segments in display order; `value` is what `onValueChange` returns and `disabled` dims one segment. */
  items: {
    /** Value reported when this segment is chosen. */
    value: string;
    /** Text on the segment. */
    label: ReactNode;
    /** Disables only this segment; it cannot be selected. */
    disabled?: boolean;
  }[];
  /** Selected value in controlled mode. */
  value?: string;
  /** Selected value at first render in uncontrolled mode. */
  defaultValue?: string;
  /** Fires with the chosen value when the selection changes. */
  onValueChange?: (value: string) => void;
  /**
   * `md`: Segmented control (62:379), 36pt track, 30pt segments, 16pt padding.
   * `sm`: one rung down, a 32pt track with 26pt segments and 10pt padding.
   * `lg`: Segmented filter (88:723), 44pt track, 36pt segments.
   * `tab`: Paper page tabs (Projects Active/Archived), 4pt track padding and gap, 32pt segments with 14pt padding.
   * @default "md"
   */
  size?: SegmentedControlSize;
  /**
   * `solid` (default) is the opaque surface track with a default border and a 10%
   * ink selection. `glass` is regular glass. `inset` is the 5% ink track inside
   * the routine card, `inset-faint` the 4% ink track inside the header filter.
   * `subtle` is the bg-subtle page-tab tray whose selection is a plain surface pill.
   * @default "solid"
   */
  surface?: SegmentedControlSurface;
  /**
   * Segments share the width equally instead of hugging their labels.
   * @default size === "md"
   */
  fill?: boolean;
  /** Accessible name of the segment group. */
  "aria-label"?: string;
  /** Accessible name in React Native's own spelling; the same name as `aria-label`. */
  accessibilityLabel?: string;
  /** Outer layout, merged onto the track. */
  style?: StyleProp<ViewStyle>;
};

type Rung = { track: number; segment: number; padding: number; inset: number; gap: number; text: "label-sm" | "label-md" | "label-lg" };

const RUNGS: Record<SegmentedControlSize, Rung> = {
  sm: { track: 26, segment: 26, padding: 3, inset: 10, gap: 2, text: "label-sm" },
  md: { track: 30, segment: 30, padding: 3, inset: 16, gap: 2, text: "label-md" },
  lg: { track: 36, segment: 36, padding: 4, inset: 16, gap: 2, text: "label-lg" },
  tab: { track: 32, segment: 32, padding: 4, inset: 14, gap: 4, text: "label-md" },
};

/** The 280ms emphasised travel of an indicator between items, react's `motion-indicator`. */
const TRAVEL = 280;

/**
 * Figma segmented control (62:379) in one file for every rung and track: a
 * rounded track holding equal-height segments, with one selection pill that
 * slides to the chosen segment.
 *
 * The pill is placed from the measured box of the selected segment, so it
 * travels the real distance between two different label widths instead of a
 * guessed percentage. A control with no selected value draws no pill at all.
 * Only the selected segment paints primary text; the rest are secondary until
 * pressed. Segments share the width when `fill` is on (the `md` default) and
 * otherwise keep their own padding inside a horizontally scrolling track, so a
 * long label set never spills. Every rung grows to a 44pt target while touch is
 * on, and Reduce Motion moves the pill without the slide.
 *
 * @example
 * ```tsx
 * import { useState } from "react";
 * import { SegmentedControl } from "@horon-ai/expo";
 *
 * function Projects() {
 *   const [view, setView] = useState("active");
 *   return (
 *     <SegmentedControl
 *       aria-label="Projects"
 *       value={view}
 *       onValueChange={setView}
 *       items={[
 *         { value: "active", label: "Active" },
 *         { value: "archived", label: "Archived" },
 *       ]}
 *     />
 *   );
 * }
 * ```
 */
export function SegmentedControl({
  items,
  value,
  defaultValue,
  onValueChange,
  size = "md",
  surface = "solid",
  fill = size === "md",
  "aria-label": ariaLabel,
  accessibilityLabel,
  style,
}: SegmentedControlProps) {
  const theme = useHoronTheme();
  const rung = RUNGS[size];
  const [own, setOwn] = useState<string | undefined>(defaultValue);
  const selected = value === undefined ? own : value;
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

  const pick = (next: string, unavailable: boolean | undefined) => {
    if (unavailable || next === selected) return;
    if (value === undefined) setOwn(next);
    onValueChange?.(next);
  };

  const pill =
    activeIndex < 0 || !rect ? null : (
      <Animated.View
        style={{
          position: "absolute",
          left,
          top,
          width,
          height,
          borderRadius: radius.full,
          overflow: "hidden",
          backgroundColor:
            surface === "glass"
              ? theme.glass === "native"
                ? undefined
                : theme.color(theme.scheme === "dark" ? "overlay-ink-10" : "glass-thick")
              : theme.color(surface === "subtle" && theme.scheme === "light" ? "bg-default" : "overlay-ink-10"),
          boxShadow: surface === "glass" ? `0 1px 3px 0 ${theme.color("overlay-ink-8")}` : undefined,
        }}
      >
        {surface === "glass" && theme.glass === "native" ? (
          <GlassSurface tier="thick" radius={radius.full} style={StyleSheet.absoluteFill} />
        ) : null}
      </Animated.View>
    );

  const row = (
    <View style={[styles.row, { gap: rung.gap, width: fill ? "100%" : undefined }]}>
      {pill}
      {items.map((item, index) => {
        const active = item.value === selected;
        return (
          <HoronPressable
            key={item.value}
            haptic="selection"
            role="tab"
            accessibilityState={{ selected: active, disabled: item.disabled }}
            disabled={item.disabled}
            onPress={() => pick(item.value, item.disabled)}
            {...bindItem(index)}
            style={[
              styles.segment,
              {
                minHeight: theme.touch ? 44 : rung.segment,
                paddingHorizontal: rung.inset,
                flexGrow: fill ? 1 : 0,
                flexShrink: fill ? 1 : 0,
                flexBasis: fill ? 0 : "auto",
              },
              item.disabled && { opacity: DISABLED_OPACITY },
            ]}
          >
            {({ pressed }) => (
              <HoronText
                variant={rung.text}
                tone={active || pressed ? "text-primary" : "text-secondary"}
                numberOfLines={1}
                style={styles.label}
              >
                {item.label}
              </HoronText>
            )}
          </HoronPressable>
        );
      })}
    </View>
  );

  return (
    <View
      role="tablist"
      accessibilityLabel={accessibilityLabel ?? ariaLabel}
      style={[
        styles.track,
        {
          padding: rung.padding,
          minHeight: (theme.touch ? 44 : rung.track) + rung.padding * 2,
          backgroundColor: theme.color(
            surface === "solid"
              ? "bg-surface"
              : surface === "inset"
                ? "overlay-ink-5"
                : surface === "inset-faint"
                  ? "overlay-ink-4"
                  : surface === "subtle"
                    ? "bg-subtle"
                    : "glass-regular",
          ),
          borderWidth: surface === "solid" ? 1 : 0,
          borderColor: surface === "solid" ? theme.color("border-default") : undefined,
        },
        style,
      ]}
    >
      {surface === "glass" && theme.glass === "native" ? (
        <GlassSurface tier="regular" radius={radius.full} style={StyleSheet.absoluteFill} />
      ) : null}
      {fill ? (
        row
      ) : (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrolled}>
          {row}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    position: "relative",
    minWidth: 0,
    maxWidth: "100%",
    flexDirection: "row",
    alignItems: "center",
    overflow: "hidden",
    borderRadius: radius.full,
    borderCurve: "continuous",
  },
  scrolled: { flexGrow: 1, flexDirection: "row" },
  row: { position: "relative", flexDirection: "row", alignItems: "center" },
  segment: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.full,
  },
  label: { flexShrink: 1 },
});
