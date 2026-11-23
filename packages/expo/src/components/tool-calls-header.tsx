import { Children, useEffect, useState, type ReactNode } from "react";
import { Animated, StyleSheet, View } from "react-native";
import { CaretDown, IconContext } from "phosphor-react-native";
import { radius, spacing } from "@horon-ai/tokens";

import { useHoronTheme } from "../provider";
import { useIconContext } from "../lib/icon";
import { duration, easing } from "../lib/motion";
import { HoronPressable } from "../lib/press";
import { TOUCH_TARGET } from "../lib/size";
import { HoronText } from "../lib/text";

/**
 * Props for {@link ToolCallsHeader}.
 */
export type ToolCallsHeaderProps = {
  /** Up to three 14pt tool icons, drawn as overlapping 28pt chips. */
  icons?: ReactNode;
  /** Header text; defaults to "Using tools…". @default "Using tools…" */
  title?: ReactNode;
  /** Elapsed time, such as "4.0s". */
  elapsed?: ReactNode;
  /** `ToolCall` cards, stacked 8pt apart under the header. */
  children?: ReactNode;
  /** Starts with the cards shown; the group manages its own open state afterwards. @default true */
  defaultOpen?: boolean;
  /** Controlled open state; pass `onOpenChange` too when set. */
  open?: boolean;
  /** Called with the next open state whenever the trigger is pressed. */
  onOpenChange?: (open: boolean) => void;

};

/**
 * Figma `Tool-calls header` (Agents N11): overlapping tool chips, "Using tools…" and a caret that fold the ToolCall cards below.
 *
 * Only the first three icons are drawn, each as a 28pt chip with the surface ring
 * that separates the overlap. The trigger is a `button` that announces
 * `expanded`/`collapsed` and rotates its caret over 200ms, or jumps under Reduce
 * Motion. Pass `open` and `onOpenChange` to control it, or leave them out and
 * start from `defaultOpen`.
 *
 * @example
 * ```tsx
 * import { Globe, Terminal } from "phosphor-react-native";
 * import { ToolCall, ToolCallsHeader } from "@horon-ai/expo";
 *
 * function Example() {
 *   return (
 *     <ToolCallsHeader icons={[<Globe key="globe" />, <Terminal key="terminal" />]} elapsed="4.0s">
 *       <ToolCall status="done" tool={{ icon: <Globe />, name: "Web search" }} summary="Searched the docs" />
 *     </ToolCallsHeader>
 *   );
 * }
 * ```
 */
export function ToolCallsHeader({
  icons,
  title = "Using tools…",
  elapsed,
  children,
  defaultOpen = true,
  open: openProp,
  onOpenChange,
}: ToolCallsHeaderProps) {
  const theme = useHoronTheme();
  const chips = Children.toArray(icons)
    .slice(0, 3)
    .map((chip, position) => ({ chip, id: `chip-${position}` }));
  const [innerOpen, setInnerOpen] = useState(defaultOpen);
  const open = openProp ?? innerOpen;
  const [rotation] = useState(() => new Animated.Value(defaultOpen ? 1 : 0));
  const icon = useIconContext({ size: 14, color: theme.color("text-secondary") });

  useEffect(() => {
    if (theme.reducedMotion) {
      rotation.setValue(open ? 1 : 0);
      return undefined;
    }
    const turn = Animated.timing(rotation, {
      toValue: open ? 1 : 0,
      duration: duration.slide,
      easing: easing.outQuint,
      useNativeDriver: true,
    });
    turn.start();
    return () => turn.stop();
  }, [open, rotation, theme.reducedMotion]);

  const toggle = () => {
    if (openProp === undefined) setInnerOpen(!open);
    onOpenChange?.(!open);
  };

  return (
    <View
      style={[
        styles.card,
        { borderColor: theme.color("border-default"), backgroundColor: theme.color("bg-surface") },
      ]}
    >
      <HoronPressable
        role="button"
        accessibilityState={{ expanded: open }}
        onPress={toggle}
        style={[styles.trigger, theme.touch && { minHeight: TOUCH_TARGET }]}
      >
        {chips.length > 0 && (
          <View style={styles.chips}>
            <IconContext.Provider value={icon}>
              {chips.map((chip, position) => (
                <View
                  key={chip.id}
                  style={[
                    styles.chip,
                    {
                      marginLeft: position === 0 ? 0 : -spacing["2"],
                      backgroundColor: theme.color("bg-subtle"),
                      borderColor: theme.color("bg-surface"),
                    },
                  ]}
                >
                  {chip.chip}
                </View>
              ))}
            </IconContext.Provider>
          </View>
        )}
        <HoronText variant="label-md" numberOfLines={1} style={styles.title}>
          {title}
        </HoronText>
        {elapsed && (
          <HoronText variant="label-md" tone="text-secondary" numberOfLines={1}>
            · {elapsed}
          </HoronText>
        )}
        <Animated.View style={[styles.caret, { transform: [{ rotate: rotation.interpolate({ inputRange: [0, 1], outputRange: ["0deg", "180deg"] }) }] }]}>
          <CaretDown size={16} color={theme.color("text-secondary")} />
        </Animated.View>
      </HoronPressable>
      {open && <View style={styles.panel}>{children}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
    minWidth: 0,
    borderWidth: 1,
    borderRadius: radius.xl,
    borderCurve: "continuous",
    padding: spacing["3"],
  },
  trigger: { flexDirection: "row", alignItems: "center", gap: spacing["2.5"], paddingBottom: spacing["1"] },
  chips: { flexShrink: 0, flexDirection: "row", alignItems: "center" },
  chip: {
    width: 28,
    height: 28,
    flexShrink: 0,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.md,
    borderCurve: "continuous",
    borderWidth: 2,
  },
  title: { minWidth: 0, flexShrink: 1 },
  caret: { marginLeft: "auto", flexShrink: 0 },
  panel: { minWidth: 0, flexDirection: "column", gap: spacing["2"], paddingTop: spacing["1"] },
});
