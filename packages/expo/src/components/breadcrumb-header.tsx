import { ScrollView, StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";
import type { ReactNode } from "react";
import { CaretRight, DotsThree, MagnifyingGlass } from "phosphor-react-native";
import { radius, spacing } from "@horon-ai/tokens";

import { useHoronTheme } from "../provider";
import { GlassSurface } from "../lib/glass-surface";
import { ACTIVE_ICON_WEIGHT } from "../lib/icon";
import { BreadcrumbItem } from "./breadcrumb";
import { IconButton } from "./icon-button";

/** One crumb of {@link BreadcrumbHeader}; the last crumb in `crumbs` is the current page. */
export type BreadcrumbHeaderCrumb = {
  /** Crumb text; also its key, so crumbs should have distinct labels. */
  label: string;
  /** Makes the crumb a link; ignored for the last (current) crumb, which stays text. */
  href?: string;
  /** Leading 20pt ink tile, such as the workspace initial. */
  tile?: ReactNode;
};

/** Props of {@link BreadcrumbHeader}. React spread the `header` element's props; React Native keeps placement only. */
export type BreadcrumbHeaderProps = {
  /** Crumbs in order; the last one is the current page. */
  crumbs: BreadcrumbHeaderCrumb[];
  /** Adds the search icon button; without it the button is not rendered at all. */
  onSearch?: () => void;
  /** Adds the "more" (three dots) icon button; without it the button is not rendered at all. */
  onMore?: () => void;
  /** Accessible label of the search button. @default "Search" */
  searchLabel?: string;
  /** Accessible label of the more button. @default "More" */
  moreLabel?: string;
  /** `solid` (default) on the page, `glass` over imagery and glass panels. @default "solid" */
  surface?: "solid" | "glass";
  /** Outer layout, merged onto the pill (margins, width). */
  style?: StyleProp<ViewStyle>;
};

/**
 * Paper `Header with breadcrumb`: a 52pt regular-glass pill with a crumb row, search and more buttons.
 *
 * The crumb trail scrolls sideways inside the pill instead of truncating; only the last crumb
 * truncates. The two icon buttons (36pt) are only rendered when their handlers are passed, and the
 * pill is announced as `banner`. On `glass` a regular {@link GlassSurface} sits under the content,
 * so the header must be placed over imagery.
 *
 * @example
 * ```tsx
 * import { BreadcrumbHeader } from "@horon-ai/expo";
 *
 * function Example() {
 *   return (
 *     <BreadcrumbHeader
 *       crumbs={[{ label: "H", tile: "H", href: "/" }, { label: "Projects", href: "/projects" }, { label: "Horon" }]}
 *       onSearch={() => {}}
 *       onMore={() => {}}
 *     />
 *   );
 * }
 * ```
 */
export function BreadcrumbHeader({
  crumbs,
  onSearch,
  onMore,
  searchLabel = "Search",
  moreLabel = "More",
  surface = "solid",
  style,
}: BreadcrumbHeaderProps) {
  const theme = useHoronTheme();
  return (
    <View role="banner" style={[styles.root, surface !== "glass" && styles.clip, style]}>
      {surface === "glass" ? (
        <GlassSurface tier="regular" radius={radius.full} style={StyleSheet.absoluteFill} />
      ) : (
        <View
          style={[
            StyleSheet.absoluteFill,
            {
              borderRadius: radius.full,
              backgroundColor: theme.color("bg-surface"),
              borderColor: theme.color("border-default"),
              borderWidth: 1,
            },
          ]}
        />
      )}
      <View role="navigation" accessibilityLabel="Breadcrumb" style={styles.trail}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          bounces={false}
          style={styles.scroller}
        >
          <View style={[styles.crumbs, { gap: spacing["1.5"] }]}>
            {crumbs.map((crumb, index) => {
              const current = index === crumbs.length - 1;
              return (
                <View key={crumb.label} style={[styles.crumb, { gap: spacing["1.5"] }, current && styles.current]}>
                  {index > 0 ? (
                    <View
                      accessibilityElementsHidden
                      importantForAccessibility="no-hide-descendants"
                      style={styles.caret}
                    >
                      <CaretRight size={14} color={theme.color("text-secondary")} />
                    </View>
                  ) : null}
                  <BreadcrumbItem current={current} tile={crumb.tile} href={crumb.href}>
                    {crumb.label}
                  </BreadcrumbItem>
                </View>
              );
            })}
          </View>
        </ScrollView>
      </View>
      {onSearch ? (
        <IconButton icon={<MagnifyingGlass />} label={searchLabel} onClick={onSearch} size="sm" />
      ) : null}
      {onMore ? <IconButton icon={<DotsThree weight={ACTIVE_ICON_WEIGHT} />} label={moreLabel} onClick={onMore} size="sm" /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flexDirection: "row",
    alignItems: "center",
    height: 52,
    gap: spacing["2"],
    padding: spacing["2"],
    borderRadius: radius.full,
    borderCurve: "continuous",
  },
  clip: { overflow: "hidden" },
  trail: { flex: 1, minWidth: 0 },
  // React Native's ScrollView ships `flexGrow: 1`; inside the 52pt pill it must hug its row.
  scroller: { flexGrow: 0, flexShrink: 0 },
  crumbs: { flexDirection: "row", alignItems: "center" },
  crumb: { flexDirection: "row", alignItems: "center" },
  current: { minWidth: 0, flexShrink: 1 },
  caret: { flexShrink: 0 },
});
