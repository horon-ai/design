import { useState, type ReactNode } from "react";
import { StyleSheet, View, type LayoutChangeEvent, type StyleProp, type ViewProps, type ViewStyle } from "react-native";
import { DotsThree, GearSix } from "phosphor-react-native";
import { primitives, radius, spacing } from "@horon-ai/tokens";

import { HoronText } from "../lib/text";
import { useHoronTheme, type ColorToken } from "../provider";
import { Button } from "./button";
import { IconButton } from "./icon-button";
import { Menu, MenuContent, MenuTrigger } from "./menu";

/**
 * Colour of an MCP server's status pill.
 *
 * - `connected` — muted pill with a live dot, the healthy default.
 * - `warning` — danger-tinted pill with a danger dot, for a server that needs attention.
 * - `neutral` — muted pill with a placeholder-coloured dot, for an idle or unknown state.
 */
export type McpServerStatusTone = "connected" | "warning" | "neutral";

const STATUS_PAINT: Record<McpServerStatusTone, { pill: ColorToken; label: ColorToken; dot: ColorToken }> = {
  connected: { pill: "overlay-ink-6", label: "text-primary", dot: "status-live" },
  warning: { pill: "accent-red-500-14", label: "text-danger", dot: "text-danger" },
  neutral: { pill: "overlay-ink-6", label: "text-secondary", dot: "text-placeholder" },
};

/**
 * Width below which the trailing controls take their own line, matching the
 * point where react's `flex-wrap` row runs out of room for them.
 */
const STACK_AT = 500;

/** Suffixes repeated values with their occurrence so duplicate tags never share a key. */
function withKeys(values: string[] | undefined): { value: string; key: string }[] {
  const seen = new Map<string, number>();
  return (values ?? []).map((value) => {
    const count = seen.get(value) ?? 0;
    seen.set(value, count + 1);
    return { value, key: count === 0 ? value : `${value}#${count}` };
  });
}

/** Props for {@link McpServerRow}: the server identity, its tags and status, and the two actions. */
export type McpServerRowProps = Omit<ViewProps, "children"> & {
  /** Server name; its first two letters fill the 40pt tile unless `initials` is set. */
  name: string;
  /** Overrides the two-letter tile text derived from `name`; up to two characters read best. */
  initials?: string;
  /** Tags next to the name, such as "Official". */
  tags?: string[];
  /** Tags tinted brand, such as "All devices". */
  brandTags?: string[];
  /** Body line under the tags, in body-sm secondary colour. */
  description?: ReactNode;
  /** Meta line, joined by "·". */
  meta?: string[];
  /** Text inside the status pill.
   * @default "Connected" */
  statusLabel?: ReactNode;
  /** Colour of the status pill: a live dot by default, a danger tint for a warning, a muted dot for a neutral state.
   * @default "connected" */
  statusTone?: McpServerStatusTone;
  /** Text of the Configure button.
   * @default "Configure" */
  configureLabel?: ReactNode;
  /** Fires when the Configure button is pressed; the button always renders, so pass this to make it do anything. */
  onConfigure?: () => void;
  /** Overflow menu items (`MenuItem`). Hides the overflow button when absent. */
  menu?: ReactNode;
  /** Accessible label of the overflow button.
   * @default "More" */
  menuLabel?: string;
  /** Outer layout, appended last (width, margins; `borderBottomWidth: 0` on the last row of a list). */
  style?: StyleProp<ViewStyle>;
};

/**
 * Paper `MCP server row` (1VHS-0): a divided row with a 40pt tile, tags, a
 * status pill and two actions.
 *
 * A row of a settings list rather than a card: it draws only a bottom border.
 * React drops that border on the last child; React Native has no `:last-child`,
 * so the last row of a list passes `style={{ borderBottomWidth: 0 }}`. The main
 * cluster wraps so the row stays usable in a narrow column, and the overflow
 * menu is the package `Menu`.
 *
 * @example
 * ```tsx
 * <McpServerRow
 *   name="Linear"
 *   tags={["Official"]}
 *   description="Read issues and projects."
 *   meta={["12 tools", "OAuth"]}
 *   onConfigure={() => openConfig("linear")}
 *   menu={<MenuItem>Reconnect</MenuItem>}
 * />
 * ```
 */
export function McpServerRow({
  name,
  initials,
  tags,
  brandTags,
  description,
  meta,
  statusLabel = "Connected",
  statusTone = "connected",
  configureLabel = "Configure",
  onConfigure,
  menu,
  menuLabel = "More",
  style,
  ...props
}: McpServerRowProps) {
  const theme = useHoronTheme();
  const paint = STATUS_PAINT[statusTone];
  const tagPill = { backgroundColor: theme.color("overlay-ink-6") };
  const brandPill = { backgroundColor: theme.color("accent-sky-500-18") };
  const [width, setWidth] = useState(0);
  // React wraps the trailing controls at this width; React Native cannot rely on Yoga wrapping, so stack them.
  const stacked = width > 0 && width < STACK_AT;

  return (
    <View
      onLayout={(event: LayoutChangeEvent) => setWidth(event.nativeEvent.layout.width)}
      style={[
        styles.root,
        stacked ? styles.rootStacked : styles.rootInline,
        { borderBottomColor: theme.color("border-default") },
        style,
      ]}
      {...props}
    >
      <View style={styles.main}>
        <View style={[styles.tile, { backgroundColor: primitives["sky-500"] }]}>
          <HoronText variant="label-md" style={styles.tileLabel}>
            {initials ?? name.slice(0, 2).toUpperCase()}
          </HoronText>
        </View>
        <View style={styles.body}>
          <View style={styles.titleRow}>
            <HoronText variant="label-md" numberOfLines={1} style={styles.name}>
              {name}
          </HoronText>
          {withKeys(tags).map(({ value, key }) => (
            <View key={key} style={[styles.tag, tagPill]}>
              <HoronText variant="label-sm" tone="text-secondary">
                {value}
              </HoronText>
            </View>
          ))}
          {withKeys(brandTags).map(({ value, key }) => (
            <View key={key} style={[styles.tag, brandPill]}>
              <HoronText variant="label-sm" tone="text-brand">
                {value}
              </HoronText>
            </View>
          ))}
        </View>
        {description ? (
          typeof description === "string" || typeof description === "number" ? (
            <HoronText variant="body-sm" tone="text-secondary">
              {description}
            </HoronText>
          ) : (
            description
          )
        ) : null}
        {meta && meta.length > 0 ? (
          <View style={styles.meta}>
            {withKeys(meta).map(({ value, key }, index) => (
              <View key={key} style={styles.metaItem}>
                {index > 0 ? (
                  <HoronText variant="label-sm" tone="text-secondary">
                    ·
                  </HoronText>
                ) : null}
                <HoronText variant="label-sm" tone="text-secondary">
                  {value}
                </HoronText>
              </View>
            ))}
          </View>
        ) : null}
        </View>
      </View>
      <View style={[styles.actions, stacked ? styles.actionsStacked : styles.actionsInline]}>
        <View style={[styles.status, { backgroundColor: theme.color(paint.pill) }]}>
          <View style={[styles.statusDot, { backgroundColor: theme.color(paint.dot) }]} />
          {typeof statusLabel === "string" || typeof statusLabel === "number" ? (
            <HoronText variant="label-sm" tone={paint.label}>
              {statusLabel}
            </HoronText>
          ) : (
            statusLabel
          )}
        </View>
        <Button variant="solid" size="sm" icon={<GearSix size={14} />} onPress={onConfigure}>
          {configureLabel}
        </Button>
        {menu ? (
          <Menu>
            <MenuTrigger>
              <IconButton
                label={menuLabel}
                variant="ghost"
                size="sm"
                icon={<DotsThree size={16} />}
              />
            </MenuTrigger>
            <MenuContent align="end">{menu}</MenuContent>
          </Menu>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { minWidth: 0, borderBottomWidth: 1, paddingVertical: spacing["4"] },
  rootStacked: { flexDirection: "column", alignItems: "stretch", rowGap: spacing["3"] },
  rootInline: { flexDirection: "row", alignItems: "center", columnGap: spacing["3.5"] },
  main: {
    minWidth: 0,
    flexGrow: 1,
    flexShrink: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing["3.5"],
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
  tileLabel: { color: primitives["neutral-50"] },
  body: { flexGrow: 1, flexShrink: 1, flexBasis: 160, minWidth: 0, flexDirection: "column", gap: spacing["1"] },
  titleRow: { flexDirection: "row", flexWrap: "wrap", alignItems: "center", gap: spacing["2"], minWidth: 0 },
  name: { flexShrink: 1, minWidth: 0, maxWidth: "100%" },
  tag: {
    height: 22,
    flexShrink: 0,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.full,
    paddingHorizontal: spacing["2"],
  },
  meta: { flexDirection: "row", flexWrap: "wrap", alignItems: "center", gap: spacing["1.5"] },
  metaItem: { flexDirection: "row", alignItems: "center", gap: spacing["1.5"] },
  status: {
    flexShrink: 0,
    height: 22,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing["1.5"],
    borderRadius: radius.full,
    paddingHorizontal: spacing["2"],
  },
  statusDot: { width: 6, height: 6, borderRadius: radius.full },
  actions: { flexShrink: 0, flexDirection: "row", flexWrap: "wrap", alignItems: "center", gap: spacing["2"] },
  actionsInline: { marginLeft: "auto" },
  actionsStacked: { alignSelf: "flex-end" },
});
