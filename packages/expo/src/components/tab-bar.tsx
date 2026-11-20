import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Animated, ScrollView, StyleSheet, View } from "react-native";
import { IconContext } from "phosphor-react-native";
import { radius, spacing } from "@horon-ai/tokens";

import { useHoronTheme } from "../provider";
import { useActiveIndicator, type IndicatorRect } from "../hooks/use-active-indicator";
import { GlassSurface } from "../lib/glass-surface";
import { useInsets } from "../lib/insets";
import { duration, easing } from "../lib/motion";
import { HoronPressable } from "../lib/press";
import type { ControlSize } from "../lib/size";

/** One destination in a {@link TabBar}: its stable value, the accessible name, and the icon shown in the tab. */
export type TabBarItem = {
  /** Identifies the tab; compared against the bar's `value`. */
  value: string;
  /** Accessible name of the icon-only button. */
  label: string;
  /** The tab icon; sized by the bar (20/22/24pt per rung). */
  icon: ReactNode;
};

/** Tab bar rungs: `sm` 56x40, `md` 64x48 (the Figma size) and `lg` 72x56. */
export type TabBarSize = ControlSize;

/** Props of {@link TabBar}: the destinations, the selected value, and the track rung and surface. */
export type TabBarProps = {
  /** Destinations in display order; each keeps its fixed tap size and scrolls if the row overflows. */
  items: TabBarItem[];
  /** Currently selected item's `value`; the control is fully controlled. */
  value: string;
  /** Called with the clicked item's `value`; the bar itself does not change `value`. */
  onValueChange?: (value: string) => void;
  /** `md` is the 64x48 Figma tab; `sm` is 56x40 and `lg` is 72x56. @default "md" */
  size?: TabBarSize;
  /** `glass` (default) adds the liquid glass layer inside the pill; `flat` keeps the glass fill but omits that layer. @default "glass" */
  surface?: "glass" | "flat";
  /** Accessible name of the navigation landmark. @default "Main" */
  "aria-label"?: string;
};

/** Track padding per rung, react's `p-1`, `p-1.5` and `p-2` on the same scale. */
const TRACK_PADDING: Record<TabBarSize, number> = { sm: spacing["1"], md: spacing["1.5"], lg: spacing["2"] };

/** Fixed tap size per rung: 56x40, 64x48 and 72x56; only the `sm` rung is short of the 44pt floor. */
const TAB_SIZE: Record<TabBarSize, { width: number; height: number }> = {
  sm: { width: 56, height: 40 },
  md: { width: 64, height: 48 },
  lg: { width: 72, height: 56 },
};

/** The glyph size React set through `[&_svg]:size-5|5.5|6`. */
const ICON_SIZE: Record<TabBarSize, number> = { sm: 20, md: 22, lg: 24 };

/**
 * Figma `Tab bar` (63:441): the mobile bottom navigation, a regular-glass pill
 * with icon-only 64x48 tabs and 22pt icons; the current tab is a 10% ink pill
 * that slides to the tab you pick.
 *
 * The bar is controlled: it reports presses through `onValueChange` and marks the
 * matching item `role="tab"` with the selected accessibility state, its label as
 * the accessible name. Tabs keep their fixed tap size, so an over-wide row
 * scrolls horizontally instead of shrinking. The bar is anchored to the bottom
 * edge, so it pads itself by the bottom safe-area inset. The 10% ink pill slides
 * to the active tab over 200ms, and reduced motion applies it in place.
 *
 * @example
 * ```tsx
 * import { useState } from "react";
 * import { House, MagnifyingGlass, User } from "phosphor-react-native";
 * import { TabBar } from "@horon-ai/expo";
 *
 * function MobileNav() {
 *   const [tab, setTab] = useState("home");
 *   return (
 *     <TabBar
 *       aria-label="Sections"
 *       value={tab}
 *       onValueChange={setTab}
 *       items={[
 *         { value: "home", label: "Home", icon: <House /> },
 *         { value: "search", label: "Search", icon: <MagnifyingGlass /> },
 *         { value: "profile", label: "Profile", icon: <User /> },
 *       ]}
 *     />
 *   );
 * }
 * ```
 */
export function TabBar({
  items,
  value,
  onValueChange,
  size = "md",
  surface = "glass",
  "aria-label": ariaLabel = "Main",
}: TabBarProps) {
  const theme = useHoronTheme();
  const insets = useInsets();
  const index = items.findIndex((item) => item.value === value);
  const { rect, animate, bindItem } = useActiveIndicator(index);
  const place = useIndicatorPlacement(rect, animate, theme.reducedMotion);
  const tap = TAB_SIZE[size];
  const icons = useMemo(
    () => ({
      current: { color: theme.color("text-primary"), size: ICON_SIZE[size] },
      rest: { color: theme.color("text-secondary"), size: ICON_SIZE[size] },
    }),
    [theme, size],
  );

  return (
    <View role="tablist" accessibilityLabel={ariaLabel} style={[styles.root, { paddingBottom: insets.bottom }]}>
      <View
        style={[
          styles.pill,
          {
            borderRadius: radius.full,
            // An explicit height, so the pill cannot be stretched by a flex ancestor: it is the rung's
            // tap height plus its own padding.
            height: (theme.touch && tap.height < 44 ? 44 : tap.height) + TRACK_PADDING[size] * 2,
          },
        ]}
      >
        {surface === "glass" ? (
          <GlassSurface tier="regular" radius={radius.full} style={StyleSheet.absoluteFill} />
        ) : (
          <View
            style={[
              StyleSheet.absoluteFill,
              { backgroundColor: theme.color("glass-regular"), borderRadius: radius.full },
            ]}
          />
        )}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          bounces={false}
          style={styles.scroller}
        >
          <View style={[styles.track, { gap: spacing["1"], padding: TRACK_PADDING[size] }]}>
            <Animated.View
              accessibilityElementsHidden
              importantForAccessibility="no-hide-descendants"
              pointerEvents="none"
              style={[
                styles.indicator,
                { backgroundColor: theme.color("overlay-ink-10"), opacity: place.opacity },
                { left: place.left, top: place.top, width: place.width, height: place.height },
              ]}
            />
            {items.map((item, position) => {
              const current = item.value === value;
              return (
                <HoronPressable
                  key={item.value}
                  haptic="selection"
                  pressScale
                  role="tab"
                  accessibilityLabel={item.label}
                  accessibilityState={{ selected: current }}
                  onPress={() => onValueChange?.(item.value)}
                  style={[
                    styles.tab,
                    { width: tap.width, height: theme.touch && tap.height < 44 ? 44 : tap.height },
                  ]}
                  {...bindItem(position)}
                >
                  {({ pressed }) => (
                    <View
                      style={[
                        styles.tabInner,
                        { backgroundColor: pressed && !current ? theme.color("overlay-ink-5") : undefined },
                      ]}
                    >
                      <IconContext.Provider value={current ? icons.current : icons.rest}>
                        {item.icon}
                      </IconContext.Provider>
                    </View>
                  )}
                </HoronPressable>
              );
            })}
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

/** The animated box of the sliding pill; `Animated.View` accepts each value as a style number. */
type Placement = {
  left: Animated.Value;
  top: Animated.Value;
  width: Animated.Value;
  height: Animated.Value;
  opacity: Animated.Value;
};

/**
 * Slides the pill to the measured tab. React let CSS transition the `left` and
 * `width` Base UI wrote; React Native cannot transition layout, so the four box
 * values are animated from the previous box, and reduced motion applies the new
 * box in place. Nothing is placed until the active tab has reported its box.
 */
function useIndicatorPlacement(rect: IndicatorRect | null, animate: boolean, reducedMotion: boolean): Placement {
  const [box] = useState(() => ({
    left: new Animated.Value(0),
    top: new Animated.Value(0),
    width: new Animated.Value(0),
    height: new Animated.Value(0),
    opacity: new Animated.Value(0),
  }));

  useEffect(() => {
    if (!rect) return;
    const targets: [Animated.Value, number][] = [
      [box.left, rect.left],
      [box.top, rect.top],
      [box.width, rect.width],
      [box.height, rect.height],
      [box.opacity, 1],
    ];
    if (!animate || reducedMotion) {
      for (const [value, target] of targets) value.setValue(target);
      return;
    }
    Animated.parallel(
      targets.map(([value, target]) =>
        Animated.timing(value, {
          toValue: target,
          duration: duration.slide,
          easing: easing.outQuint,
          useNativeDriver: false,
        }),
      ),
    ).start();
  }, [rect, animate, reducedMotion, box]);

  return box;
}

const styles = StyleSheet.create({
  root: { alignSelf: "stretch", alignItems: "center" },
  // React Native's ScrollView ships `flexGrow: 1`, which inside an auto-height column makes the
  // glass pill grow to the viewport. The scroller has to hug its row instead.
  scroller: { flexGrow: 0, flexShrink: 0 },
  pill: { borderCurve: "continuous", overflow: "hidden" },
  track: { position: "relative", flexDirection: "row", alignItems: "center" },
  indicator: { position: "absolute", borderRadius: radius.full },
  tab: { alignItems: "center", justifyContent: "center", borderRadius: radius.full },
  tabInner: { flex: 1, width: "100%", alignItems: "center", justifyContent: "center", borderRadius: radius.full },
});
