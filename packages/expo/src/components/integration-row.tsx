import { useState, type ReactNode } from "react";
import { StyleSheet, View, type LayoutChangeEvent, type StyleProp, type ViewProps, type ViewStyle } from "react-native";
import { IconContext, Plug } from "phosphor-react-native";
import { primitives, radius, spacing } from "@horon-ai/tokens";

import { GlassSurface } from "../lib/glass-surface";
import { useIconContext } from "../lib/icon";
import { HoronPressable } from "../lib/press";
import { TOUCH_TARGET } from "../lib/size";
import { HoronText } from "../lib/text";
import { useHoronTheme, type ColorToken } from "../provider";

/**
 * Connection state of an integration:
 *
 * - `connected`: sky tile, a live-dot "Connected" pill and no button.
 * - `reconnect`: dark-sky tile, a red outline on the row, danger text in `detail` and a danger action button.
 * - `not-connected`: subtle tile, secondary text and the primary "Connect" button.
 */
export type IntegrationStatus = "connected" | "reconnect" | "not-connected";

/** Props of {@link IntegrationRow}: the service, its connection state and the one action. */
export type IntegrationRowProps = Omit<ViewProps, "children"> & {
  /** 20pt icon shown in inverse on the 40pt tile. */
  icon: ReactNode;
  /** Service name on the first line, truncated with an ellipsis. */
  name: ReactNode;
  /** Account and scopes, or the reason a reconnect is needed. */
  detail?: ReactNode;
  /** Drives the tile fill, the pill or button on the right and the row's danger border. */
  status: IntegrationStatus;
  /** Called when the button is pressed; connected rows have no button, so it never fires then. */
  onAction?: () => void;
  /** Pill text for `connected`. @default "Connected" */
  connectedLabel?: string;
  /** Button text for `reconnect`. @default "Reconnect" */
  reconnectLabel?: string;
  /** Button text for `not-connected`. @default "Connect" */
  connectLabel?: string;
  /** `solid` (default) is an opaque surface card with a default border; `glass` is the thick glass row. @default "solid" */
  surface?: "solid" | "glass";
  /** Outer layout, appended last (width, margins). */
  style?: StyleProp<ViewStyle>;
};

/** Fill and glyph colour of the 40pt tile, as react paints it for each status. */
function tilePaint(
  status: IntegrationStatus,
  glass: boolean,
  color: (token: ColorToken) => string,
): { fill: string; glyph: string } {
  if (glass && status === "not-connected") {
    return { fill: color("overlay-ink-6"), glyph: color("text-secondary") };
  }
  if (status === "connected") return { fill: primitives["sky-500"], glyph: primitives["neutral-50"] };
  if (status === "reconnect") return { fill: primitives["sky-700"], glyph: primitives["neutral-50"] };
  return { fill: color("bg-subtle"), glyph: color("text-secondary") };
}

/**
 * Width below which the action takes its own line, matching the point where
 * react's `flex-wrap` row runs out of room for it.
 */
const STACK_AT = 400;

/** True when a node is plain text, which React Native can only draw inside its own `Text`. */
function isText(value: ReactNode): boolean {
  return typeof value === "string" || typeof value === "number";
}

/**
 * Figma `Integration row` (Integrations 110:883): 40pt tile, status pill on the
 * right, solid or thick glass.
 *
 * A one-line service row: the nameless tile, a name and an optional detail line
 * that share a column, and one action slot on the right. Only the action the
 * status prescribes is mounted — the pill for a connected service, the button
 * otherwise — so the row never exposes a dead control. `glass` draws
 * `expo-glass-effect`'s thick tier and moves the reconnect outline to the glass
 * edge.
 *
 * @example
 * ```tsx
 * <IntegrationRow
 *   icon={<SlackLogo />}
 *   name="Slack"
 *   detail="horon.slack.com · 4 scopes"
 *   status="reconnect"
 *   onAction={() => reconnect("slack")}
 * />
 * ```
 */
export function IntegrationRow({
  icon,
  name,
  detail,
  status,
  onAction,
  connectedLabel = "Connected",
  reconnectLabel = "Reconnect",
  connectLabel = "Connect",
  surface = "solid",
  style,
  ...props
}: IntegrationRowProps) {
  const theme = useHoronTheme();
  const { fill, glyph } = tilePaint(status, surface === "glass", theme.color);
  const glass = surface === "glass";
  const glyphContext = useIconContext({ color: glyph, size: 20 });
  const [width, setWidth] = useState(0);
  // React wraps the action at this width; React Native cannot rely on Yoga wrapping, so stack it.
  const stacked = width > 0 && width < STACK_AT;

  const content = (
    <>
      <View style={styles.main}>
        <View style={[styles.tile, { backgroundColor: fill }]}>
          <IconContext.Provider value={glyphContext}>{icon}</IconContext.Provider>
        </View>
        <View style={styles.identity}>
        {isText(name) ? (
          <HoronText variant="label-md" numberOfLines={1}>
            {name}
          </HoronText>
        ) : (
          name
        )}
        {detail ? (
          isText(detail) ? (
            <HoronText
              variant="caption"
              tone={status === "reconnect" ? "text-danger" : "text-secondary"}
              numberOfLines={1}
            >
              {detail}
            </HoronText>
          ) : (
            detail
          )
        ) : null}
        </View>
      </View>
      {status === "connected" ? (
        <View
          style={[
            styles.pill,
            stacked ? styles.actionStacked : styles.actionInline,
            { backgroundColor: theme.color("accent-sky-500-18") },
          ]}
        >
          <View style={[styles.dot, { backgroundColor: theme.color("status-live") }]} />
          <HoronText variant="label-sm" numberOfLines={1}>
            {connectedLabel}
          </HoronText>
        </View>
      ) : (
        <HoronPressable
          role="button"
          pressScale
          onPress={onAction}
          style={({ pressed }) => [
            styles.button,
            stacked ? styles.actionStacked : styles.actionInline,
            {
              height: theme.touch ? TOUCH_TARGET : 30,
              backgroundColor:
                status === "reconnect"
                  ? theme.color("accent-red-500-14")
                  : theme.color(pressed ? "interactive-primary-pressed" : "interactive-primary"),
            },
          ]}
        >
          {status === "not-connected" ? <Plug size={14} color={theme.color("text-inverse")} /> : null}
          <HoronText variant="label-sm" tone={status === "reconnect" ? "text-danger" : "text-inverse"}>
            {status === "reconnect" ? reconnectLabel : connectLabel}
          </HoronText>
        </HoronPressable>
      )}
    </>
  );

  if (glass) {
    return (
      <GlassSurface
        tier="thick"
        radius={radius["2xl"]}
        onLayout={(event: LayoutChangeEvent) => setWidth(event.nativeEvent.layout.width)}
        style={[
          styles.root,
          stacked ? styles.rootStacked : styles.rootInline,
          status === "reconnect" && { borderWidth: 1, borderColor: theme.color("border-danger") },
          style,
        ]}
        {...props}
      >
        {content}
      </GlassSurface>
    );
  }

  return (
    <View
      onLayout={(event: LayoutChangeEvent) => setWidth(event.nativeEvent.layout.width)}
      style={[
        styles.root,
        stacked ? styles.rootStacked : styles.rootInline,
        {
          borderWidth: 1,
          borderColor: theme.color(status === "reconnect" ? "border-danger" : "border-default"),
          backgroundColor: theme.color("bg-surface"),
        },
        style,
      ]}
      {...props}
    >
      {content}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    overflow: "hidden",
    borderRadius: radius["2xl"],
    borderCurve: "continuous",
    paddingVertical: spacing["3"],
    paddingLeft: spacing["3"],
    paddingRight: spacing["3.5"],
  },
  rootStacked: { flexDirection: "column", alignItems: "stretch", rowGap: spacing["2"] },
  rootInline: { flexDirection: "row", alignItems: "center", columnGap: spacing["3"] },
  main: {
    minWidth: 0,
    flexGrow: 1,
    flexShrink: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing["3"],
  },
  tile: {
    width: 40,
    height: 40,
    flexShrink: 0,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.md,
    borderCurve: "continuous",
  },
  identity: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 160,
    minWidth: 0,
    flexDirection: "column",
    gap: spacing["0.5"],
  },
  pill: {
    flexShrink: 0,
    height: 30,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing["1.5"],
    borderRadius: radius.full,
    paddingHorizontal: spacing["3"],
  },
  button: {
    flexShrink: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing["1.5"],
    borderRadius: radius.full,
    paddingHorizontal: spacing["3"],
  },
  dot: { width: 6, height: 6, borderRadius: radius.full },
  actionInline: { marginLeft: "auto" },
  actionStacked: { alignSelf: "flex-end" },
});
