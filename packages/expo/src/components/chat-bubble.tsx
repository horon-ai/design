import { Children, useEffect, useState, type ReactNode } from "react";
import { Animated, StyleSheet, View, type StyleProp, type ViewProps, type ViewStyle } from "react-native";
import { radius, spacing } from "@horon-ai/tokens";

import { useHoronTheme } from "../provider";
import { duration, easing } from "../lib/motion";
import type { ControlSize } from "../lib/size";
import { HoronText } from "../lib/text";

/** Padding and text rung of {@link ChatBubble}; identical to {@link ControlSize}. */
export type ChatBubbleSize = ControlSize;

/** Props of {@link ChatBubble}: the author, the size rung and the message. */
export type ChatBubbleProps = Omit<ViewProps, "children" | "style"> & {
  /**
   * `me` is the ink bubble, `bot` the flat subtle bubble. Neither uses glass.
   * @default "me"
   */
  from?: "me" | "bot";
  /**
   * Bubble size: `sm` 12/8pt padding with body-sm, `md` 16/12pt with body-md (default), `lg` 20/14pt with body-lg.
   * @default "md"
   */
  size?: ChatBubbleSize;

  /** The message. Plain text rides the bubble's type token; elements sit in a wrapping row. */
  children?: ReactNode;
  /** Outer layout, merged onto the bubble. */
  style?: StyleProp<ViewStyle>;
};

/** Box padding per rung, the same 12/8, 16/12 and 20/14 steps as react. */
const PADDING = {
  sm: { paddingHorizontal: spacing["3"], paddingVertical: spacing["2"] },
  md: { paddingHorizontal: spacing["4"], paddingVertical: spacing["3"] },
  lg: { paddingHorizontal: spacing["5"], paddingVertical: spacing["3.5"] },
} as const;

/** Text rung per size, so the words follow the bubble's own scale. */
const TEXT = { sm: "body-sm", md: "body-md", lg: "body-lg" } as const;

/**
 * Figma `Chat bubble` (64:359): 16/12pt padding, 20pt radius, body-md text.
 *
 * `me` bubbles hug the right edge with the ink fill and the inverse label,
 * `bot` bubbles stay left on the subtle fill with primary text; both cap at
 * 560pt or the parent's width, wrap long words, and rise in with `motion-rise`
 * (a 220ms fade and 4pt lift, parked under Reduce Motion). Elements go into a
 * wrapping row at the 6pt control gap, because a React Native `Text` cannot host
 * a view.
 *
 * @example
 * ```tsx
 * import { View } from "react-native";
 * import { ChatBubble } from "@horon-ai/expo";
 *
 * function Example() {
 *   return (
 *     <View style={{ gap: 8 }}>
 *       <ChatBubble from="bot">What should I look up?</ChatBubble>
 *       <ChatBubble from="me">The Q3 usage report, please.</ChatBubble>
 *     </View>
 *   );
 * }
 * ```
 */
export function ChatBubble({ from = "me", size = "md", children, style, ...props }: ChatBubbleProps) {
  const theme = useHoronTheme();
  const mine = from === "me";
  // `motion-rise`: the fade and 4pt lift every bubble enters with, parked under Reduce Motion.
  const [rise] = useState(() => new Animated.Value(0));

  useEffect(() => {
    if (theme.reducedMotion) {
      rise.setValue(1);
      return undefined;
    }
    const step = Animated.timing(rise, {
      toValue: 1,
      duration: duration.popIn,
      easing: easing.outQuint,
      useNativeDriver: true,
    });
    step.start();
    return () => step.stop();
  }, [rise, theme.reducedMotion]);

  return (
    <Animated.View
      {...props}
      style={[
        styles.root,
        PADDING[size],
        {
          borderRadius: radius.xl,
          backgroundColor: theme.color(mine ? "interactive-primary" : "bg-subtle"),
          opacity: rise,
          transform: [{ translateY: rise.interpolate({ inputRange: [0, 1], outputRange: [4, 0] }) }],
        },
        mine ? styles.me : styles.bot,
        style,
      ]}
    >
      {Children.toArray(children).every((child) => typeof child === "string" || typeof child === "number") ? (
        <HoronText variant={TEXT[size]} tone={mine ? "interactive-on-primary" : "text-primary"}>
          {children}
        </HoronText>
      ) : (
        <View style={styles.row}>{children}</View>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: { maxWidth: 560, minWidth: 0, flexShrink: 1 },
  me: { alignSelf: "flex-end" },
  bot: { alignSelf: "flex-start" },
  row: { flexDirection: "row", flexWrap: "wrap", alignItems: "center", gap: spacing["1.5"] },
});
