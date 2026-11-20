import { useEffect, useState, type ReactNode } from "react";
import { Animated, StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";
import { CaretLeft } from "phosphor-react-native";
import { radius, spacing } from "@horon-ai/tokens";

import { useHoronTheme } from "../provider";
import { GlassSurface } from "../lib/glass-surface";
import { duration, easing } from "../lib/motion";
import { HoronText } from "../lib/text";
import { IconButton } from "./icon-button";

/** Props for {@link PageHeader}: the title row, an optional back button, trailing actions and a filter row. */
export type PageHeaderProps = {
  /** Page title, announced as the header; truncated with an ellipsis when it does not fit. */
  title: ReactNode;
  /** Renders a leading 40pt back `IconButton` when set; the header drops the title's left padding in exchange. */
  onBack?: () => void;
  /** Accessible label of the back button; the button shows no visible text.
   * @default "Back" */
  backLabel?: string;
  /** Trailing 40pt icon buttons, such as search. */
  actions?: ReactNode;
  /** Content under the top row, such as a `SegmentedControl` filter. Rises in when it appears. */
  children?: ReactNode;
  /** `solid` (default) is an opaque surface header with a default border; `glass` is the regular glass header. @default "solid" */
  surface?: "solid" | "glass";
  /** Outer layout, merged onto the header (margins, width). */
  style?: StyleProp<ViewStyle>;
};

/** True for text the header can set in its own type token; a node keeps its own styling. */
const isPlainText = (value: ReactNode): value is string | number =>
  typeof value === "string" || typeof value === "number";

/**
 * Figma `Header with filter` (Segmented filters 88:723): a 28pt-radius header, 8pt padding, solid or regular glass.
 *
 * A single row of back button, title and actions, plus an optional filter row below it. The
 * title is announced with the `header` role, the `glass` surface is a regular {@link GlassSurface}
 * behind the content, and a filter row that appears rises in over 220ms (in place under reduced motion).
 *
 * @example
 * ```tsx
 * import { MagnifyingGlass } from "phosphor-react-native";
 * import { IconButton, PageHeader } from "@horon-ai/expo";
 *
 * function Example() {
 *   return (
 *     <PageHeader
 *       title="Sources"
 *       onBack={() => goBack()}
 *       actions={<IconButton label="Search" icon={<MagnifyingGlass />} />}
 *     >
 *       <SegmentedControl value="all" onValueChange={() => {}} items={[{ value: "all", label: "All" }]} />
 *     </PageHeader>
 *   );
 * }
 * ```
 */
export function PageHeader({
  title,
  onBack,
  backLabel = "Back",
  actions,
  children,
  surface = "solid",
  style,
}: PageHeaderProps) {
  const theme = useHoronTheme();
  const [rise] = useState(() => new Animated.Value(0));
  const [filter] = useState(() => new Animated.Value(children ? 1 : 0));

  useEffect(() => {
    if (theme.reducedMotion) {
      rise.setValue(1);
      return;
    }
    Animated.timing(rise, {
      toValue: 1,
      duration: duration.popIn,
      easing: easing.outQuint,
      useNativeDriver: true,
    }).start();
  }, [theme.reducedMotion, rise]);

  useEffect(() => {
    if (!children) return;
    if (theme.reducedMotion) {
      filter.setValue(1);
      return;
    }
    filter.setValue(0);
    Animated.timing(filter, {
      toValue: 1,
      duration: duration.popIn,
      easing: easing.outQuint,
      useNativeDriver: true,
    }).start();
  }, [children, theme.reducedMotion, filter]);

  return (
    <View style={[styles.root, { borderRadius: radius["2xl"] }, style]}>
      {surface === "glass" ? (
        <GlassSurface tier="regular" radius={radius["2xl"]} style={StyleSheet.absoluteFill} />
      ) : (
        <View
          style={[
            StyleSheet.absoluteFill,
            {
              borderRadius: radius["2xl"],
              backgroundColor: theme.color("bg-surface"),
              borderColor: theme.color("border-default"),
              borderWidth: 1,
            },
          ]}
        />
      )}
      <View style={[styles.row, { gap: spacing["2"] }]}>
        {onBack ? <IconButton icon={<CaretLeft />} label={backLabel} onClick={onBack} /> : null}
        {isPlainText(title) ? (
          <HoronText
            role="heading"
            variant="label-lg"
            tone="text-primary"
            numberOfLines={1}
            style={[styles.title, !onBack && { paddingLeft: spacing["2"] }]}
          >
            {title}
          </HoronText>
        ) : (
          <View style={[styles.title, !onBack && { paddingLeft: spacing["2"] }]}>{title}</View>
        )}
        {actions}
      </View>
      {children ? (
        <Animated.View
          style={{
            opacity: filter,
            transform: [{ translateY: filter.interpolate({ inputRange: [0, 1], outputRange: [4, 0] }) }],
          }}
        >
          {children}
        </Animated.View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flexDirection: "column",
    gap: spacing["1.5"],
    padding: spacing["2"],
    overflow: "hidden",
    borderCurve: "continuous",
    maxWidth: "100%",
    minWidth: 0,
  },
  row: { flexDirection: "row", alignItems: "center", height: 40, minWidth: 0 },
  title: { flex: 1, minWidth: 0 },
});
