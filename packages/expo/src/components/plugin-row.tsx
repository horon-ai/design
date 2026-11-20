import { useState, type ReactNode } from "react";
import { StyleSheet, View, type LayoutChangeEvent, type StyleProp, type ViewProps, type ViewStyle } from "react-native";
import { ArrowUp, Check, DotsThree } from "phosphor-react-native";
import { primitives, radius, spacing } from "@horon-ai/tokens";

import { HoronText } from "../lib/text";
import { useHoronTheme } from "../provider";
import { Button } from "./button";
import { IconButton } from "./icon-button";
import { Menu, MenuContent, MenuTrigger } from "./menu";
import { Switch } from "./switch";

/** Props for {@link PluginRow}: identity, version and update state, capability chips, and the three actions. */
export type PluginRowProps = Omit<ViewProps, "children"> & {
  /** Two-letter initials shown on the 40pt tile. */
  initials: string;
  /** Plugin name; truncated when the row gets narrow. */
  name: ReactNode;
  /** Version string drawn in mono next to the name. */
  version?: ReactNode;
  /** Text of the update pill next to the version; omit when up to date. */
  updateBadge?: ReactNode;
  /** Author line under the name. */
  author?: ReactNode;
  /** Adds the sky "Verified" check after the author; only shown when `author` is set. */
  verified?: boolean;
  /** Capability chips, each with an optional leading glyph sized at 11pt. */
  chips?: {
    /** Stable key for the chip. */
    id: string;
    /** Chip text. */
    label: ReactNode;
    /** Optional leading glyph; size it at 11pt to match react's `[&_svg]:size-2.75`. */
    icon?: ReactNode;
  }[];
  /** Switch state for the plugin. Pass it with `onEnabledChange` to control the toggle. */
  enabled?: boolean;
  /** Fires with the next switch state when the plugin is enabled or disabled. */
  onEnabledChange?: (enabled: boolean) => void;
  /** Shows the Update button when set; without it the button is not rendered. */
  onUpdate?: () => void;
  /**
   * Label of the Update button.
   * @default "Update"
   */
  updateLabel?: string;
  /**
   * Accessible name of the enable/disable switch.
   * @default "Enabled"
   */
  toggleLabel?: string;
  /**
   * Accessible name of the overflow menu button.
   * @default "More"
   */
  overflowLabel?: string;
  /** Items of the overflow menu; the menu button is hidden without them. */
  menu?: ReactNode;
  /** Outer layout, appended last (width, margins; `borderBottomWidth: 0` on the last row of a list). */
  style?: StyleProp<ViewStyle>;
};

/**
 * Width below which the trailing controls take their own line, matching the
 * point where react's `flex-wrap` row runs out of room for them.
 */
const STACK_AT = 460;

/** True when a node is plain text, which React Native can only draw inside its own `Text`. */
function isText(value: ReactNode): boolean {
  return typeof value === "string" || typeof value === "number";
}

/**
 * Paper `Plugin row` (Settings 1VKS-0): tile, name with version and update
 * pill, verified author, chips, and Update, Switch and overflow actions.
 *
 * Rows stack directly in a list: each one draws its own bottom divider. React
 * drops that divider on the last child; React Native has no `:last-child`, so
 * the last row passes `style={{ borderBottomWidth: 0 }}`. The Update button is
 * only mounted when `onUpdate` is passed, and the overflow menu only when
 * `menu` has content.
 *
 * @example
 * ```tsx
 * import { MenuItem, PluginRow } from "@horon-ai/expo";
 *
 * <PluginRow
 *   initials="ST"
 *   name="Stripe"
 *   version="2.4.1"
 *   updateBadge="Update ready"
 *   author="Stripe"
 *   verified
 *   chips={[{ id: "payments", label: "Payments" }]}
 *   enabled
 *   onEnabledChange={() => {}}
 *   onUpdate={() => {}}
 *   menu={<MenuItem>Uninstall</MenuItem>}
 * />
 * ```
 */
export function PluginRow({
  initials,
  name,
  version,
  updateBadge,
  author,
  verified,
  chips,
  enabled,
  onEnabledChange,
  onUpdate,
  updateLabel = "Update",
  toggleLabel = "Enabled",
  overflowLabel = "More",
  menu,
  style,
  ...props
}: PluginRowProps) {
  const theme = useHoronTheme();
  const mono = [theme.text("label-sm"), { fontFamily: theme.fonts.mono }];
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
        <View
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
          style={[styles.tile, { backgroundColor: primitives["sky-500"] }]}
        >
          <HoronText variant="label-md" style={styles.tileLabel}>
            {initials}
          </HoronText>
        </View>
        <View style={styles.body}>
        <View style={styles.titleRow}>
          {isText(name) ? (
            <HoronText variant="label-md" numberOfLines={1} style={styles.name}>
              {name}
            </HoronText>
          ) : (
            <View style={styles.name}>{name}</View>
          )}
          {version ? (
            isText(version) ? (
              <HoronText tone="text-secondary" style={mono} numberOfLines={1}>
                {version}
              </HoronText>
            ) : (
              version
            )
          ) : null}
          {updateBadge ? (
            isText(updateBadge) ? (
              <View style={[styles.badge, { backgroundColor: theme.color("accent-sky-500-18") }]}>
                <HoronText variant="label-sm" tone="text-brand" numberOfLines={1}>
                  {updateBadge}
                </HoronText>
              </View>
            ) : (
              updateBadge
            )
          ) : null}
        </View>
        {author ? (
          <View style={styles.author}>
            {isText(author) ? (
              <HoronText variant="label-sm" tone="text-secondary">
                {author}
              </HoronText>
            ) : (
              author
            )}
            {verified ? (
              <View role="img" accessibilityLabel="Verified" style={styles.verified}>
                <Check size={8} weight="bold" color={primitives["neutral-50"]} />
              </View>
            ) : null}
          </View>
        ) : null}
        {chips && chips.length > 0 ? (
          <View style={styles.chips}>
            {chips.map((chip) => (
              <View key={chip.id} style={[styles.chip, { backgroundColor: theme.color("overlay-ink-6") }]}>
                {chip.icon}
                {isText(chip.label) ? (
                  <HoronText variant="label-sm" tone="text-secondary" numberOfLines={1}>
                    {chip.label}
                  </HoronText>
                ) : (
                  chip.label
                )}
              </View>
            ))}
          </View>
        ) : null}
        </View>
      </View>
      <View style={[styles.actions, stacked ? styles.actionsStacked : styles.actionsInline]}>
        {onUpdate ? (
          <Button variant="solid" size="sm" icon={<ArrowUp size={14} />} onPress={onUpdate}>
            {updateLabel}
          </Button>
        ) : null}
        <Switch aria-label={toggleLabel} checked={enabled} onCheckedChange={onEnabledChange} />
        {menu ? (
          <Menu>
            <MenuTrigger>
              <IconButton
                label={overflowLabel}
                variant="ghost"
                size="sm"
                icon={<DotsThree size={16} weight="bold" />}
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
  root: { borderBottomWidth: 1, paddingVertical: spacing["4"] },
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
  body: { flexGrow: 1, flexShrink: 1, flexBasis: 160, minWidth: 0, flexDirection: "column", gap: spacing["1.5"] },
  titleRow: { flexDirection: "row", flexWrap: "wrap", alignItems: "center", gap: spacing["2"] },
  name: { flexShrink: 1, minWidth: 0 },
  badge: {
    height: 22,
    flexShrink: 0,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.full,
    paddingHorizontal: spacing["2"],
  },
  author: { flexDirection: "row", alignItems: "center", gap: spacing["1"] },
  verified: {
    width: 14,
    height: 14,
    flexShrink: 0,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.full,
    backgroundColor: primitives["sky-500"],
  },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: spacing["1.5"] },
  chip: {
    height: 22,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing["1"],
    borderRadius: radius.full,
    paddingHorizontal: spacing["2"],
  },
  actions: { flexShrink: 0, flexDirection: "row", flexWrap: "wrap", alignItems: "center", gap: spacing["2"] },
  actionsInline: { marginLeft: "auto" },
  actionsStacked: { alignSelf: "flex-end" },
});
