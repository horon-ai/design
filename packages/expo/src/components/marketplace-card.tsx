import type { ReactNode } from "react";
import { StyleSheet, View, type StyleProp, type ViewProps, type ViewStyle } from "react-native";
import { Star } from "phosphor-react-native";
import { primitives, radius, spacing } from "@horon-ai/tokens";

import { GlassSurface } from "../lib/glass-surface";
import { HoronText } from "../lib/text";
import { useHoronTheme } from "../provider";
import { Button } from "./button";

/** Props for {@link MarketplaceCard}: identity, copy, capability chips and the install action. */
export type MarketplaceCardProps = Omit<ViewProps, "children"> & {
  /** Two-letter initials shown on the 40pt ink tile. */
  initials: string;
  /** Card title on the row beside the tile; truncated in one line. */
  name: ReactNode;
  /** Publisher line under the name, in caption colour. */
  author?: ReactNode;
  /** Body copy under the header; any length, wrapped by the paragraph. */
  description?: ReactNode;
  /** Capability chips, each with an optional leading glyph sized at 12pt. */
  chips?: {
    /** Stable key for this chip; also its React key. */
    id: string;
    /** Chip text. */
    label: ReactNode;
    /** Optional leading glyph; size it at 12pt to match react's `[&_svg]:size-3`. */
    icon?: ReactNode;
  }[];
  /** Rating value shown after a filled star, such as "4.8". Hides the star when unset. */
  score?: ReactNode;
  /** Install-count caption, separated from the score by a middle dot when both are set. */
  installs?: ReactNode;
  /** Renders the Install button in the footer when set. */
  onInstall?: () => void;
  /** Text of the Install button.
   * @default "Install" */
  installLabel?: string;
  /** `solid` (default) is an opaque surface card with a default border; `glass` is the thick glass card. @default "solid" */
  surface?: "solid" | "glass";
  /** Outer layout, appended last (width, margins). */
  style?: StyleProp<ViewStyle>;
};

/** True when a node is plain text, which React Native can only draw inside its own `Text`. */
function isText(value: ReactNode): boolean {
  return typeof value === "string" || typeof value === "number";
}

/**
 * Paper `Marketplace card` (Settings 1VMY-0): solid or thick glass column with
 * tile header, description, chips and a footer with rating and Install.
 *
 * With `surface="glass"` the whole card is `expo-glass-effect`'s thick tier
 * through {@link GlassSurface}, so it belongs over imagery only; the solid
 * surface is a bordered `bg-surface` card. The chip glyphs are passed as nodes,
 * so size them at 12pt where react resized the `svg` for you.
 *
 * @example
 * ```tsx
 * <MarketplaceCard
 *   initials="GH"
 *   name="GitHub"
 *   author="by Horon"
 *   description="Read repositories and open pull requests."
 *   chips={[{ id: "official", label: "Official" }]}
 *   score="4.8"
 *   installs="12k installs"
 *   onInstall={() => install("github")}
 * />
 * ```
 */
export function MarketplaceCard({
  initials,
  name,
  author,
  description,
  chips,
  score,
  installs,
  onInstall,
  installLabel = "Install",
  surface = "solid",
  style,
  ...props
}: MarketplaceCardProps) {
  const theme = useHoronTheme();
  const content = (
    <>
      <View style={styles.header}>
        <View style={[styles.tile, { backgroundColor: primitives["neutral-900"] }]}>
          <HoronText variant="label-md" style={styles.tileLabel}>
            {initials}
          </HoronText>
        </View>
        <View style={styles.identity}>
          {isText(name) ? (
            <HoronText variant="label-md" numberOfLines={1}>
              {name}
            </HoronText>
          ) : (
            name
          )}
          {author ? (
            isText(author) ? (
              <HoronText variant="caption" tone="text-secondary" numberOfLines={1}>
                {author}
              </HoronText>
            ) : (
              author
            )
          ) : null}
        </View>
      </View>
      {description ? (
        isText(description) ? (
          <HoronText variant="body-sm" tone="text-secondary">
            {description}
          </HoronText>
        ) : (
          description
        )
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
      <View style={[styles.footer, { borderTopColor: theme.color("border-default") }]}>
        {score ? (
          <>
            <Star size={14} weight="fill" color={primitives["mascot-gold"]} />
            {isText(score) ? (
              <HoronText variant="label-sm">{score}</HoronText>
            ) : (
              score
            )}
          </>
        ) : null}
        {score && installs ? (
          <HoronText variant="caption" tone="text-placeholder">
            ·
          </HoronText>
        ) : null}
        {installs ? (
          isText(installs) ? (
            <HoronText variant="caption" tone="text-secondary">
              {installs}
            </HoronText>
          ) : (
            installs
          )
        ) : null}
        <View style={styles.spacer} />
        {onInstall ? (
          <Button variant="solid" size="sm" onPress={onInstall}>
            {installLabel}
          </Button>
        ) : null}
      </View>
    </>
  );

  if (surface === "glass") {
    return (
      <GlassSurface tier="thick" radius={radius.xl} style={[styles.root, style]} {...props}>
        {content}
      </GlassSurface>
    );
  }

  return (
    <View
      style={[
        styles.root,
        styles.solid,
        { borderColor: theme.color("border-default"), backgroundColor: theme.color("bg-surface") },
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
    flexDirection: "column",
    gap: spacing["3"],
    overflow: "hidden",
    borderRadius: radius.xl,
    borderCurve: "continuous",
    padding: spacing["4"],
  },
  solid: { borderWidth: 1 },
  header: { flexDirection: "row", alignItems: "center", gap: spacing["3"] },
  tile: {
    width: 40,
    height: 40,
    flexShrink: 0,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.md,
    borderCurve: "continuous",
  },
  identity: { flexShrink: 1, minWidth: 0, flexDirection: "column", gap: spacing["0.5"] },
  tileLabel: { color: primitives["neutral-50"] },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: spacing["1.5"] },
  chip: {
    height: 22,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing["1"],
    borderRadius: radius.full,
    paddingHorizontal: spacing["2"],
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing["1.5"],
    borderTopWidth: 1,
    paddingTop: spacing["3"],
  },
  spacer: { flexGrow: 1, flexShrink: 1, minWidth: 0 },
});
