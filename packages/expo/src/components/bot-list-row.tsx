import { StyleSheet, View, type PressableProps, type StyleProp, type ViewStyle } from "react-native";
import type { ReactNode } from "react";
import { radius, spacing } from "@horon-ai/tokens";

import { Avatar } from "./avatar";
import { HoronPressable } from "../lib/press";
import { DISABLED_OPACITY } from "../lib/size";
import { HoronText } from "../lib/text";
import { useHoronTheme } from "../provider";

/** Props for {@link BotListRow}: the bot name, last-activity time and preview, the live and selected states. */
export type BotListRowProps = Omit<PressableProps, "children" | "style"> & {
  /** Bot display name, truncated with an ellipsis when it does not fit. */
  name: ReactNode;
  /** Last activity time, such as "8:41 AM". */
  time?: ReactNode;
  /** One-line preview of the latest activity. */
  preview?: ReactNode;
  /** Running bots show the live dot on the avatar. */
  live?: boolean;
  /** The row for the bot currently open in the panel; paints the 10% ink selected fill and sets `selected`. */
  selected?: boolean;
  /** Outer layout, appended last (margins, width). */
  style?: StyleProp<ViewStyle>;
};

/** True when a node is plain text, which React Native can only draw inside its own `Text`. */
function isText(value: ReactNode): boolean {
  return typeof value === "string" || typeof value === "number";
}

/**
 * Figma `Bot list row` (64:456): a flat 12pt-padded row; press 5% ink,
 * selected 10% ink. The whole row is the button, so its accessible name comes
 * from the name, time and preview it draws.
 *
 * Disabled rows paint at 40% and ignore presses; the selected row also tells
 * assistive technology it is the current one.
 *
 * @example
 * ```tsx
 * <BotListRow name="Researcher" time="8:41 AM" preview="Pulled the Q3 numbers" live selected />
 * ```
 */
export function BotListRow({ name, time, preview, live, selected, disabled, style, ...props }: BotListRowProps) {
  const theme = useHoronTheme();
  return (
    <HoronPressable
      role="button"
      pressScale
      disabled={disabled}
      accessibilityState={{ selected: !!selected, disabled: !!disabled }}
      style={({ pressed }) => [
        styles.root,
        {
          backgroundColor: selected
            ? theme.color("overlay-ink-10")
            : pressed
              ? theme.color("overlay-ink-5")
              : "transparent",
        },
        disabled && { opacity: DISABLED_OPACITY },
        style,
      ]}
      {...props}
    >
      <Avatar type="bot" size="lg" live={live} />
      <View style={styles.body}>
        <View style={styles.titleRow}>
          {isText(name) ? (
            <HoronText variant="label-lg" numberOfLines={1} style={styles.name}>
              {name}
            </HoronText>
          ) : (
            <View style={styles.name}>{name}</View>
          )}
          {time ? (
            isText(time) ? (
              <HoronText variant="caption" tone="text-secondary" numberOfLines={1}>
                {time}
              </HoronText>
            ) : (
              time
            )
          ) : null}
        </View>
        {preview ? (
          isText(preview) ? (
            <HoronText variant="body-sm" tone="text-secondary" numberOfLines={1}>
              {preview}
            </HoronText>
          ) : (
            preview
          )
        ) : null}
      </View>
    </HoronPressable>
  );
}

const styles = StyleSheet.create({
  root: {
    width: "100%",
    minWidth: 0,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing["3"],
    borderRadius: radius.lg,
    borderCurve: "continuous",
    padding: spacing["3"],
  },
  body: { flexGrow: 1, flexShrink: 1, minWidth: 0, flexDirection: "column", gap: spacing["0.5"] },
  titleRow: { flexDirection: "row", alignItems: "center", gap: spacing["2"], minWidth: 0 },
  name: { flexGrow: 1, flexShrink: 1, minWidth: 0 },
});
