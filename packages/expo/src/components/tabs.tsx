import {
  Children,
  createContext,
  isValidElement,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { Animated, ScrollView, StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";
import { IconContext } from "phosphor-react-native";
import { radius, spacing } from "@horon-ai/tokens";

import { useHoronTheme, type ColorToken, type TextStyleName } from "../provider";
import { useActiveIndicator, type IndicatorRect } from "../hooks/use-active-indicator";
import { GlassSurface } from "../lib/glass-surface";
import { ACTIVE_ICON_WEIGHT, useIconWeight } from "../lib/icon";
import { duration, easing } from "../lib/motion";
import { HoronPressable } from "../lib/press";
import { DISABLED_OPACITY, type ControlSize } from "../lib/size";
import { HoronText } from "../lib/text";

/** Tab rungs, shared with `ControlSize`: `sm` 26pt, `md` 30pt and `lg` 36pt tab height. */
export type TabsSize = ControlSize;

/**
 * Shape of a tab list: `pill` is the tray of rounded pill tabs, `underline` is a bare
 * text row with a 2pt bar that slides under the active tab.
 */
export type TabsListVariant = "pill" | "underline";

/** What every part of a tab set reads: the rung, the axis, the selection and the way it changes. */
type TabsSet = {
  /** Rung every tab inside reads, so one list stays on one rung. */
  size: ControlSize;
  /** Axis the set runs along: a row with the panels under it, or a side rail. */
  orientation: "horizontal" | "vertical";
  /** The selected value: the controlled prop, or the uncontrolled inner state. */
  value: string | undefined;
  /** Selects a value; the root keeps no state of its own while controlled. */
  select: (value: string) => void;
};

/** `Tabs` owns the selection; every tab and panel inside reads it from here. */
const TabsSetContext = createContext<TabsSet>({
  size: "md",
  orientation: "horizontal",
  value: undefined,
  select: () => undefined,
});

/** `TabsList` owns the variant; its `TabsTab`s read it to drop the pill shape on the underline list. */
const TabsVariantContext = createContext<TabsListVariant>("pill");

/** Props of {@link Tabs}: the shared value, the rung and the initial value when uncontrolled. */
export type TabsProps = {
  /** Controlled selection. While set the root reports changes through `onValueChange` and keeps no state of its own. */
  value?: string;
  /** Initial selection when uncontrolled. @default 0 */
  defaultValue?: string;
  /** Called with the newly selected tab's value. */
  onValueChange?: (value: string) => void;
  /** Rung for this tab set: tab heights of 26pt (`sm`), 30pt (`md`) or 36pt (`lg`). @default "md" */
  size?: TabsSize;
  /**
   * Layout flow direction: `horizontal` (the default) stacks the panels under a row of tabs,
   * `vertical` puts the tabs in a side rail beside the panels.
   * @default "horizontal"
   */
  orientation?: "horizontal" | "vertical";
  /** Inline layout of the root column, merged after its own 16pt gap. */
  style?: StyleProp<ViewStyle>;
  /** The lists and panels of the set. */
  children?: ReactNode;
};

/**
 * The root of a tab set (Figma `Tabs` example 62:353): it stacks the list and panels in a
 * 16pt-gap column, caps at its container, and provides the size rung every `TabsTab` inside
 * reads. It is controlled or uncontrolled like Base UI's tabs (`value`/`defaultValue` plus
 * `onValueChange`), and panels are matched to tabs by `value`.
 *
 * Base UI owned the selection through `Tabs.Root`; React Native has no such primitive, so the
 * root owns it here and publishes it through context. Panels render only while their value is
 * selected, which is Base UI's behaviour without `keepMounted`.
 *
 * @example
 * ```tsx
 * import { Tabs, TabsList, TabsPanel, TabsTab } from "@horon-ai/expo";
 *
 * function SettingsTabs() {
 *   return (
 *     <Tabs defaultValue="general">
 *       <TabsList variant="underline">
 *         <TabsTab value="general">General</TabsTab>
 *         <TabsTab value="billing" count={3}>
 *           Billing
 *         </TabsTab>
 *       </TabsList>
 *       <TabsPanel value="general">General settings</TabsPanel>
 *       <TabsPanel value="billing">Three open invoices</TabsPanel>
 *     </Tabs>
 *   );
 * }
 * ```
 */
export function Tabs({
  value,
  defaultValue,
  onValueChange,
  size = "md",
  orientation = "horizontal",
  style,
  children,
}: TabsProps) {
  const [inner, setInner] = useState<string | undefined>(defaultValue);
  const selected = value ?? inner;
  const select = useCallback(
    (next: string) => {
      setInner(next);
      onValueChange?.(next);
    },
    [onValueChange],
  );
  const set = useMemo<TabsSet>(
    () => ({ size, orientation, value: selected, select }),
    [size, orientation, selected, select],
  );
  return (
    <TabsSetContext.Provider value={set}>
      <View style={[styles.root, orientation === "vertical" && styles.rootVertical, style]}>{children}</View>
    </TabsSetContext.Provider>
  );
}

/** Track padding per rung, the same as `SegmentedControl` so the two pill trays line up. */
const LIST_PADDING: Record<TabsSize, number> = { sm: 3, md: 3, lg: spacing["1"] };

/** Props of {@link TabsList}: the shape, the surface and the tabs it measures. */
export type TabsListProps = {
  /** `pill` (default) is the tray of pill tabs; `underline` is a text row with a sliding underline. @default "pill" */
  variant?: TabsListVariant;
  /** `solid` (default) is an opaque surface tray with a default border; `glass` is the regular glass tray. @default "solid" */
  surface?: "solid" | "glass";
  /**
   * Accepted for call-site parity with `@horon-ai/react`; it let the arrow keys move the selection,
   * and a touch screen has no keyboard focus traversal. @default false
   */
  activateOnFocus?: boolean;
  /** Inline layout of the track, merged after its own. */
  style?: StyleProp<ViewStyle>;
  /** The `TabsTab`s of this list, in display order. */
  children?: ReactNode;
};

/**
 * Figma `Tabs example` (62:353): a pill tray, solid or regular glass, with the same rungs as
 * `SegmentedControl` (3/3/4pt padding, 2pt between tabs). The selection is one indicator that
 * slides to the active tab: 10% ink on solid, the thick glass pill with a soft shadow on glass.
 *
 * `variant="underline"` is the document variant: no tray, a full-width 1pt default border under
 * the tabs, and a 2pt primary bar that slides under the active tab. `surface` does not apply to it.
 *
 * Base UI wrote the active tab's box into CSS variables; a phone has no such variables, so every
 * tab reports its own `onLayout` box and the indicator animates there, in place under reduced motion.
 *
 * Part of {@link Tabs}; it also provides the variant every `TabsTab` inside reads.
 */
export function TabsList({ variant = "pill", surface = "solid", style, children }: TabsListProps) {
  const theme = useHoronTheme();
  const set = useContext(TabsSetContext);
  const entries = useMemo(() => tabEntries(children), [children]);
  const activeIndex = entries.findIndex((entry) => entry.value === set.value);
  const { rect, animate, bindItem } = useActiveIndicator(activeIndex);
  const place = useIndicatorPlacement(rect, animate, theme.reducedMotion);
  const underline = variant === "underline";

  const vertical = set.orientation === "vertical";
  const track = (
    <View style={[styles.track, vertical && styles.trackVertical, { gap: underline ? spacing["6"] : spacing["0.5"] }]}>
      {!underline && rect ? (
        <Animated.View
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
          pointerEvents="none"
          style={[
            styles.indicator,
            { opacity: place.opacity },
            { left: place.left, top: place.top, width: place.width, height: place.height },
          ]}
        >
          {surface === "glass" ? (
            <>
              <View
                style={[StyleSheet.absoluteFill, { backgroundColor: theme.color("glass-thick") }, styles.indicator]}
              />
              <GlassSurface tier="thick" radius={radius.full} style={StyleSheet.absoluteFill} />
            </>
          ) : (
            <View
              style={[
                StyleSheet.absoluteFill,
                { backgroundColor: theme.color("overlay-ink-10") },
                styles.indicator,
              ]}
            />
          )}
        </Animated.View>
      ) : null}
      {entries.map((entry, index) => (
        <View key={entry.key} style={styles.slot} {...bindItem(index)}>
          {entry.node}
        </View>
      ))}
      {underline && rect ? (
        <Animated.View
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
          pointerEvents="none"
          style={[
            vertical ? styles.underlineVertical : styles.underlineHorizontal,
            { backgroundColor: theme.color("text-primary"), opacity: place.opacity },
            vertical ? { top: place.top, height: place.height } : { left: place.left, width: place.width },
          ]}
        />
      ) : null}
    </View>
  );

  return (
    <TabsVariantContext.Provider value={variant}>
      {underline ? (
        <View
          style={[
            styles.listUnderline,
            vertical ? styles.underlineRail : styles.underlineRow,
            { borderColor: theme.color("border-default") },
            style,
          ]}
        >
          {track}
        </View>
      ) : (
        <View
          style={[
            styles.listPill,
            {
              padding: LIST_PADDING[set.size],
              // An explicit tray height, so a flex ancestor cannot stretch the pill tray; under the
              // touch rung it follows the tabs, which grow to the 44pt floor.
              height:
                (theme.touch ? Math.max(TAB_HUB[set.size].height, 44) : TAB_HUB[set.size].height) +
                LIST_PADDING[set.size] * 2,
              alignSelf: "flex-start",
            },
            style,
          ]}
        >
          {surface === "glass" ? (
            <>
              <View
                style={[
                  StyleSheet.absoluteFill,
                  { backgroundColor: theme.color("glass-regular"), borderRadius: radius.full },
                ]}
              />
              <GlassSurface tier="regular" radius={radius.full} style={StyleSheet.absoluteFill} />
            </>
          ) : (
            <View
              style={[
                StyleSheet.absoluteFill,
                {
                  backgroundColor: theme.color("bg-surface"),
                  borderColor: theme.color("border-default"),
                  borderWidth: 1,
                  borderRadius: radius.full,
                },
              ]}
            />
          )}
          {vertical ? (
            track
          ) : (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              bounces={false}
              style={styles.scroller}
            >
              {track}
            </ScrollView>
          )}
        </View>
      )}
    </TabsVariantContext.Provider>
  );
}

/** One tab per rung: the `SegmentedControl` segment heights and padding (26/30/36pt, 10/16/16pt). */
const TAB_HUB: Record<TabsSize, { height: number; paddingHorizontal: number; gap: number }> = {
  sm: { height: 26, paddingHorizontal: 10, gap: spacing["1"] },
  md: { height: 30, paddingHorizontal: 16, gap: spacing["1.5"] },
  lg: { height: 36, paddingHorizontal: 16, gap: spacing["2"] },
};

/** Text rung per tab rung, react's `text-label-sm|md|lg`. */
const TAB_TEXT: Record<TabsSize, TextStyleName> = { sm: "label-sm", md: "label-md", lg: "label-lg" };

/** Glyph size per rung, react's `[&_svg]:size-3.5|4|5`. */
const TAB_ICON: Record<TabsSize, number> = { sm: 14, md: 16, lg: 20 };

/** Count pill per rung, react's `h-4.5|h-5|h-6` with `px-1.5|px-2`. */
const COUNT_HUB: Record<TabsSize, { height: number; paddingHorizontal: number }> = {
  sm: { height: 18, paddingHorizontal: spacing["1.5"] },
  md: { height: 20, paddingHorizontal: spacing["1.5"] },
  lg: { height: 24, paddingHorizontal: spacing["2"] },
};

/** Props of {@link TabsTab}: its value, an optional icon and count, and its enabled state. */
export type TabsTabProps = {
  /** Identifies the tab; compared against the set's `value` and its panels' `value`. */
  value: string;
  /** Leading icon, 14pt (`sm`), 16pt (`md`) or 20pt (`lg`). */
  icon?: ReactNode;
  /** Count pill after the label; turns solid on the active tab. */
  count?: number;
  /** Blocks selection and dims the tab to 40%. */
  disabled?: boolean;
  /** Inline layout of the tab, merged after its own. */
  style?: StyleProp<ViewStyle>;
  /** The tab label. */
  children?: ReactNode;
};

/**
 * Figma `Tabs` (62:335): a pill tab; the list's indicator draws the selection under the active tab.
 *
 * Part of {@link Tabs}. The tab takes its height, text and icon size from the surrounding
 * `Tabs`; on an underline list it drops the pill radius and side padding. Base UI marked it
 * `role="tab"` with `aria-selected`; here the role carries the selected accessibility state,
 * and a disabled tab is announced as disabled and never selects. Under the touch rung every
 * pill rung grows to the 44pt floor.
 *
 * @example
 * ```tsx
 * <TabsTab value="billing" count={3}>
 *   Billing
 * </TabsTab>
 * ```
 */
export function TabsTab({ value, icon, count, disabled = false, style, children }: TabsTabProps) {
  const theme = useHoronTheme();
  const set = useContext(TabsSetContext);
  const underline = useContext(TabsVariantContext) === "underline";
  const active = set.value === value;
  const hub = TAB_HUB[set.size];
  const height = theme.touch && !underline ? Math.max(hub.height, 44) : hub.height;
  const label: ColorToken = active ? "text-primary" : "text-secondary";
  const iconWeight = useIconWeight();
  const glyph = useMemo(
    () => ({ color: theme.color(label), size: TAB_ICON[set.size], weight: active ? ACTIVE_ICON_WEIGHT : iconWeight }),
    [theme, label, set.size, active, iconWeight],
  );

  return (
    <HoronPressable
      haptic="selection"
      role="tab"
      disabled={disabled}
      accessibilityState={{ selected: active, disabled }}
      onPress={() => {
        if (!disabled) set.select(value);
      }}
      style={[
        styles.tab,
        {
          height,
          gap: hub.gap,
          paddingHorizontal: underline ? 0 : hub.paddingHorizontal,
          borderRadius: underline ? radius.xs : radius.full,
          opacity: disabled ? DISABLED_OPACITY : 1,
        },
        style,
      ]}
    >
      {({ pressed }) => (
        <View
          style={[
            styles.tabRow,
            { gap: hub.gap },
            pressed && !active && { backgroundColor: theme.color("overlay-ink-5") },
          ]}
        >
          {icon ? (
            <IconContext.Provider value={glyph}>
              {icon}
            </IconContext.Provider>
          ) : null}
          {typeof children === "string" || typeof children === "number" ? (
            <HoronText variant={TAB_TEXT[set.size]} tone={label} numberOfLines={1}>
              {children}
            </HoronText>
          ) : (
            children
          )}
          {count !== undefined ? (
            <View
              style={[
                styles.count,
                {
                  height: COUNT_HUB[set.size].height,
                  paddingHorizontal: COUNT_HUB[set.size].paddingHorizontal,
                  backgroundColor: theme.color(active ? "interactive-primary" : "overlay-ink-6"),
                },
              ]}
            >
              <HoronText variant="label-sm" tone={active ? "interactive-on-primary" : "text-secondary"}>
                {count}
              </HoronText>
            </View>
          ) : null}
        </View>
      )}
    </HoronPressable>
  );
}

/** Props of {@link TabsPanel}: the value it belongs to and whether a hidden panel stays mounted. */
export type TabsPanelProps = {
  /** The `TabsTab` value this panel belongs to; it paints while that tab is selected. */
  value: string;
  /** Keeps the panel mounted while another tab is active, hidden instead of unmounted. @default false */
  keepMounted?: boolean;
  /** Inline layout of the panel, merged after its own. */
  style?: StyleProp<ViewStyle>;
  /** The panel content. */
  children?: ReactNode;
};

/**
 * The content region of one tab, matched to a `TabsTab` by `value`. It carries `role="tabpanel"`
 * and a panel swap slides the content in 4pt over the shared 200ms swap move; a change in content
 * height is not animated, and reduced motion paints the swap in place.
 *
 * Part of {@link Tabs}. Base UI unmounted a hidden panel unless `keepMounted` was set, which is
 * what this port does too: a kept panel stays mounted and hidden from assistive technology.
 */
export function TabsPanel({ value, keepMounted = false, style, children }: TabsPanelProps) {
  const theme = useHoronTheme();
  const set = useContext(TabsSetContext);
  const active = set.value === value;
  const [slide] = useState(() => new Animated.Value(1));

  useEffect(() => {
    if (!active) return;
    if (theme.reducedMotion) {
      slide.setValue(1);
      return;
    }
    slide.setValue(0);
    Animated.timing(slide, {
      toValue: 1,
      duration: duration.slide,
      easing: easing.outQuint,
      useNativeDriver: true,
    }).start();
  }, [active, theme.reducedMotion, slide]);

  if (!active && !keepMounted) return null;
  // A panel holds nodes, but a string is the common case, and React Native refuses a bare string
  // outside a Text, so plain text is set in the body rung.
  const body =
    typeof children === "string" || typeof children === "number" ? (
      <HoronText variant="body-md" tone="text-primary">
        {children}
      </HoronText>
    ) : (
      children
    );
  return (
    <Animated.View
      role="tabpanel"
      accessibilityElementsHidden={!active}
      importantForAccessibility={active ? "auto" : "no-hide-descendants"}
      style={[
        styles.panel,
        style,
        active
          ? {
              opacity: slide,
              transform: [{ translateY: slide.interpolate({ inputRange: [0, 1], outputRange: [4, 0] }) }],
            }
          : styles.hidden,
      ]}
    >
      {body}
    </Animated.View>
  );
}

/** One entry of a measured tab list: the value it carries and the node to paint. */
type TabEntry = { key: string; value?: string; node: ReactNode };

/**
 * The tabs of a list in display order, each with the `value` it carries. Base UI matched a
 * tab to its panel through context; a measured list has to know the values up front, so they
 * are read from the children. A child without a `value` still keeps its slot.
 */
function tabEntries(children: ReactNode): TabEntry[] {
  const entries: TabEntry[] = [];
  Children.forEach(children, (child, index) => {
    entries.push({ key: tabValue(child) ?? `tab-${index}`, value: tabValue(child), node: child });
  });
  return entries;
}

/** The `value` a tab child carries, read through React's own element check. */
function tabValue(node: ReactNode): string | undefined {
  if (!isValidElement<{ value?: unknown }>(node)) return undefined;
  const value = node.props.value;
  return typeof value === "string" ? value : undefined;
}

/** The animated box of the sliding indicator; `Animated.View` accepts each value as a style number. */
type Placement = {
  left: Animated.Value;
  top: Animated.Value;
  width: Animated.Value;
  height: Animated.Value;
  opacity: Animated.Value;
};

/**
 * Slides the indicator to the measured tab. React let CSS transition the box Base UI wrote
 * into the `--active-tab-*` variables; React Native cannot transition layout, so the four box
 * values are animated from the previous box, and reduced motion applies the new box in place.
 * Nothing is placed until the active tab has reported its own box.
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
  root: { flexDirection: "column", gap: spacing["4"], maxWidth: "100%", minWidth: 0 },
  rootVertical: { flexDirection: "row", alignItems: "flex-start" },
  listPill: { position: "relative", flexDirection: "column", borderRadius: radius.full, borderCurve: "continuous" },
  listUnderline: { position: "relative", flexDirection: "column" },
  underlineRow: { borderBottomWidth: 1 },
  underlineRail: { borderLeftWidth: 1 },
  // React Native's ScrollView ships `flexGrow: 1`; in an auto-height column that stretches the tray.
  scroller: { flexGrow: 0, flexShrink: 0 },
  track: { position: "relative", flexDirection: "row", alignItems: "center" },
  trackVertical: { flexDirection: "column", alignItems: "stretch" },
  slot: { flexShrink: 0 },
  indicator: { position: "absolute", borderRadius: radius.full, overflow: "hidden" },
  underlineHorizontal: { position: "absolute", bottom: 0, height: 2 },
  underlineVertical: { position: "absolute", left: 0, width: 2 },
  tab: { alignItems: "center", justifyContent: "center" },
  tabRow: { flexDirection: "row", alignItems: "center", borderRadius: radius.full },
  count: { alignItems: "center", justifyContent: "center", borderRadius: radius.full },
  panel: { flexDirection: "column" },
  hidden: { opacity: 0, height: 0, overflow: "hidden" },
});
