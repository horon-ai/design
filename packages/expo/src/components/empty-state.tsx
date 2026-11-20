import { useEffect, useState, type ReactNode } from "react";
import { Animated, StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";
import { spacing } from "@horon-ai/tokens";

import { useHoronTheme } from "../provider";
import { duration, easing } from "../lib/motion";
import { HoronText } from "../lib/text";

/** Props for {@link EmptyState}: an optional illustration, the copy and one action. */
export type EmptyStateProps = {
  /** 140px illustration, such as a mascot pose. The slot is square and the child is stretched to fill it. */
  illustration?: ReactNode;
  /** Heading, rendered as a `title-md` paragraph. */
  title: ReactNode;
  /** Supporting copy under the heading, `body-md` secondary text across the full column width. */
  description?: ReactNode;
  /** Action under the text, usually a `Button`. */
  action?: ReactNode;
  /** Layout merged onto the column (width, margins). */
  style?: StyleProp<ViewStyle>;
};

/** True for text the column can set in its own type token; a node keeps its own styling. */
const isPlainText = (value: ReactNode): value is string | number =>
  typeof value === "string" || typeof value === "number";

/**
 * Figma `Empty state` (64:485): centered 140px mascot, title-md heading, body-md text, action.
 *
 * A 360px-max column that rises in and draws no border or fill, so it drops into a card, a panel
 * body or an empty table area without a surface of its own.
 *
 * @example
 * ```tsx
 * <EmptyState
 *   illustration={<Image source={require("./mascot.webp")} style={{ flex: 1 }} />}
 *   title="Meet your first bot"
 *   description="Give it a role and a task. It keeps working after you close the laptop."
 *   action={<Button>Create a bot</Button>}
 * />
 * ```
 */
export function EmptyState({ illustration, title, description, action, style }: EmptyStateProps) {
  const theme = useHoronTheme();
  const [rise] = useState(() => new Animated.Value(0));

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

  return (
    <Animated.View
      style={[
        styles.root,
        style,
        { opacity: rise, transform: [{ translateY: rise.interpolate({ inputRange: [0, 1], outputRange: [4, 0] }) }] },
      ]}
    >
      {illustration ? <View style={styles.illustration}>{illustration}</View> : null}
      {isPlainText(title) ? (
        <HoronText variant="title-md" style={styles.center}>
          {title}
        </HoronText>
      ) : (
        title
      )}
      {description ? (
        isPlainText(description) ? (
          <HoronText variant="body-md" tone="text-secondary" style={[styles.stretch, styles.center]}>
            {description}
          </HoronText>
        ) : (
          description
        )
      ) : null}
      {action ? <View style={styles.action}>{action}</View> : null}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: {
    width: "100%",
    maxWidth: 360,
    alignItems: "center",
    gap: spacing["3"],
    paddingHorizontal: spacing["6"],
    paddingVertical: spacing["8"],
  },
  illustration: { width: 140, height: 140, alignItems: "center", justifyContent: "center", flexShrink: 0 },
  stretch: { alignSelf: "stretch" },
  center: { textAlign: "center" },
  action: { marginTop: spacing["4"] },
});
