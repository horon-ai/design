import { Children, type ReactNode } from "react";
import { StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";
import { radius, spacing } from "@horon-ai/tokens";

import { useHoronTheme } from "../provider";
import { GlassSurface } from "../lib/glass-surface";
import { HoronText, wrapTextChildren } from "../lib/text";
import { Switch, type SwitchProps } from "./switch";

/** Props for {@link SettingsList}. React spread the card's `div` props; React Native keeps the surface and layout. */
export type SettingsListProps = {
  /**
   * `solid` (default) is an opaque surface card with a default border; `glass` is the thick glass card.
   * @default "solid"
   */
  surface?: "solid" | "glass";
  /** Outer layout, merged onto the card (width, margins). */
  style?: StyleProp<ViewStyle>;
  /** The rows; the card draws the 1pt rule between them. */
  children?: ReactNode;
};

/** True for text the card can set in its own type token; a node keeps its own styling. */
const isPlainText = (value: ReactNode): value is string | number =>
  typeof value === "string" || typeof value === "number";

/**
 * Paper `Settings list` (1VD8-0): a 16pt-radius card of divided rows, 20pt inline padding, solid or thick glass.
 *
 * Put only `SettingsRow` children inside: the card draws the 1pt rule between rows and clips the
 * corners, so grouping rows here is enough to get the divided list. React put that rule on each
 * row and removed the last one with `last:border-b-0`; React Native cannot select the last child,
 * so the card draws the rule itself between its rows and the last row simply has none. Glass keeps
 * the rows above the liquid layer because the card clips and each row is painted after it.
 *
 * @example
 * ```tsx
 * import { SettingsList, SettingsRow, SettingsSwitch } from "@horon-ai/expo";
 *
 * function Example() {
 *   return (
 *     <SettingsList>
 *       <SettingsRow title="Sync on Wi-Fi" description="Only use Wi-Fi for uploads" control={<SettingsSwitch defaultChecked />} />
 *       <SettingsRow title="Version" control="2.4.1" />
 *     </SettingsList>
 *   );
 * }
 * ```
 */
export function SettingsList({ surface = "solid", style, children }: SettingsListProps) {
  const theme = useHoronTheme();
  // The rule belongs between rows, because react put it on each row and removed the last one with
  // `last:border-b-0`; a wrapper around every row but the last draws the same divided list.
  const total = Children.count(children);
  const rows = Children.map(children, (child, index) =>
    index === total - 1 ? (
      child
    ) : (
      <View style={{ borderBottomWidth: 1, borderColor: theme.color("border-default") }}>{child}</View>
    ),
  );

  return (
    <View style={[styles.card, style]}>
      {surface === "glass" ? (
        <GlassSurface tier="thick" radius={radius["2xl"]} style={StyleSheet.absoluteFill} />
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
      {rows}
    </View>
  );
}

/** Props for {@link SettingsRow}. React spread the row's `div` props; React Native keeps the slots and layout. */
export type SettingsRowProps = {
  /** Primary line of the row. */
  title: ReactNode;
  /** Secondary line under the title, in secondary text. */
  description?: ReactNode;
  /** Leading slot before the title, usually a `SettingsRowIcon`; the row tightens to 12pt gap and 13pt block padding. */
  leading?: ReactNode;
  /** Trailing control slot: a `SettingsSwitch`, a `SettingsKeys` pair, a button. */
  control?: ReactNode;
  /** Outer layout, merged onto the row. */
  style?: StyleProp<ViewStyle>;
};

/**
 * One row: title and subtitle on the left, control on the right, with the card's 1pt rule under it.
 *
 * React dropped the rule of the last row with `last:border-b-0`; the card draws the rules here,
 * so the last row simply has none. A leading slot tightens the gap and block padding, matching
 * the icon-tile rows of the settings board.
 *
 * Part of {@link SettingsList}.
 */
export function SettingsRow({ title, description, leading, control, style }: SettingsRowProps) {
  return (
    <View
      style={[
        styles.row,
        {
          gap: spacing["4"],
          paddingVertical: leading ? 13 : spacing["4"],
          paddingLeft: leading ? spacing["3"] : 0,
        },
        style,
      ]}
    >
      {leading}
      <View style={styles.copy}>
        {isPlainText(title) ? (
          <HoronText variant="label-md" tone="text-primary">
            {title}
          </HoronText>
        ) : (
          title
        )}
        {description ? (
          isPlainText(description) ? (
            <HoronText variant="body-sm" tone="text-secondary">
              {description}
            </HoronText>
          ) : (
            description
          )
        ) : null}
      </View>
      {control ? (
        <View style={styles.control}>{wrapTextChildren(control, { variant: "body-md", tone: "text-secondary" })}</View>
      ) : null}
    </View>
  );
}

/**
 * Paper settings row icon tile (32pt, 9pt radius, subtle fill, 16pt glyph centred). Decorative,
 * so it is hidden from assistive technology; the row title carries the meaning.
 *
 * Part of {@link SettingsList}.
 */
export function SettingsRowIcon({
  children,
  style,
}: {
  /** The 16pt glyph. */
  children?: ReactNode;
  /** Layout merged onto the tile. */
  style?: StyleProp<ViewStyle>;
}) {
  const theme = useHoronTheme();
  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[styles.iconTile, { backgroundColor: theme.color("bg-subtle"), borderRadius: radius.sm }, style]}
    >
      {children}
    </View>
  );
}

/**
 * A `Switch` pre-wired for a row's control slot (md, 44x26).
 *
 * Part of {@link SettingsList}.
 */
export function SettingsSwitch({ size = "md", ...props }: SwitchProps) {
  return <Switch size={size} {...props} />;
}

/**
 * One keycap: 26pt high, 6pt radius, subtle fill with a 1pt hairline (replaces `Kbd` in settings rows).
 * It is announced as keyboard input rather than body text.
 *
 * Part of {@link SettingsList}.
 */
export function SettingsKey({
  children,
  style,
}: {
  /** The key the cap shows. */
  children?: ReactNode;
  /** Layout merged onto the cap. */
  style?: StyleProp<ViewStyle>;
}) {
  const theme = useHoronTheme();
  return (
    <View
      accessible
      accessibilityRole="text"
      accessibilityLabel={typeof children === "string" ? `Keyboard key ${children}` : undefined}
      style={[
        styles.key,
        {
          backgroundColor: theme.color("bg-subtle"),
          borderColor: theme.color("border-default"),
          borderRadius: radius.xs,
        },
        style,
      ]}
    >
      {isPlainText(children) ? (
        <HoronText variant="label-sm" tone="text-primary">
          {children}
        </HoronText>
      ) : (
        children
      )}
    </View>
  );
}

/**
 * A keycap pair or chord, 4pt apart; a plain row wrapper, so it takes its children as-is.
 *
 * Part of {@link SettingsList}.
 */
export function SettingsKeys({
  children,
  style,
}: {
  /** The keycaps. */
  children?: ReactNode;
  /** Layout merged onto the row. */
  style?: StyleProp<ViewStyle>;
}) {
  return <View style={[styles.keys, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "column",
    minWidth: 0,
    overflow: "hidden",
    borderRadius: radius["2xl"],
    borderCurve: "continuous",
    paddingHorizontal: spacing["5"],
  },
  row: { flexDirection: "row", flexWrap: "wrap", alignItems: "center", minWidth: 0 },
  copy: { flex: 1, minWidth: 0, flexDirection: "column", gap: spacing["0.5"] },
  control: { flexShrink: 0, flexDirection: "row", alignItems: "center" },
  iconTile: {
    width: 32,
    height: 32,
    flexShrink: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  key: {
    flexDirection: "row",
    alignItems: "center",
    height: 26,
    paddingHorizontal: spacing["2"],
    borderWidth: 1,
  },
  keys: { flexDirection: "row", alignItems: "center", gap: spacing["1"] },
});
