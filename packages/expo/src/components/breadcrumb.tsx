import { Children, Fragment, type ReactNode } from "react";
import { ScrollView, StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";
import { CaretRight } from "phosphor-react-native";
import { radius, spacing } from "@horon-ai/tokens";

import { useHoronTheme } from "../provider";
import { GlassSurface } from "../lib/glass-surface";
import { HoronPressable } from "../lib/press";
import { HoronText } from "../lib/text";

/** Tray material behind a {@link Breadcrumb} trail: `glass` is the regular glass tray, `solid` the opaque one. */
export type BreadcrumbSurface = "glass" | "solid";

/** Props of {@link Breadcrumb}. */
export type BreadcrumbProps = {
  /** `glass` wraps the crumbs in a regular-glass tray, `solid` in an opaque tray. Omitted keeps them bare. */
  surface?: BreadcrumbSurface;
  /** Spoken name of the trail; React read it from the `nav`'s `aria-label`. @default Breadcrumb */
  "aria-label"?: string;
  /** Outer layout, merged onto the tray. */
  style?: StyleProp<ViewStyle>;
  /** The crumbs, each a {@link BreadcrumbItem}; a caret separator is drawn between entries. */
  children?: ReactNode;
};

/**
 * Figma `Breadcrumb` (110:948): crumbs 6pt apart with 14pt carets; the last crumb is the current page.
 *
 * A `navigation` landmark holding a row of {@link BreadcrumbItem}s with an
 * `aria-hidden` caret between them. The tray is a full-width box so it can shrink
 * below its trail's min-content; an over-wide trail scrolls inside it rather than
 * truncating labels the reader may need to tap.
 *
 * @example
 * ```tsx
 * import { Breadcrumb, BreadcrumbItem } from "@horon-ai/expo";
 *
 * function Example() {
 *   return (
 *     <Breadcrumb surface="solid">
 *       <BreadcrumbItem href="/" tile="H">Home</BreadcrumbItem>
 *       <BreadcrumbItem href="/projects">Projects</BreadcrumbItem>
 *       <BreadcrumbItem current>Horon</BreadcrumbItem>
 *     </Breadcrumb>
 *   );
 * }
 * ```
 */
export function Breadcrumb({
  surface,
  style,
  children,
  "aria-label": ariaLabel = "Breadcrumb",
}: BreadcrumbProps) {
  const theme = useHoronTheme();
  const frame =
    surface === undefined
      ? null
      : [
          styles.tray,
          {
            borderRadius: radius.xl,
            paddingHorizontal: spacing["4"],
            paddingVertical: spacing["3.5"],
            backgroundColor: theme.color(surface === "glass" ? "glass-regular" : "bg-surface"),
            borderColor: theme.color("border-default"),
            borderWidth: surface === "solid" ? 1 : 0,
          },
        ];

  return (
    <View role="navigation" accessibilityLabel={ariaLabel} style={[styles.root, frame, style]}>
      {surface === "glass" ? (
        <GlassSurface tier="regular" radius={radius.xl} style={StyleSheet.absoluteFill} />
      ) : null}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        bounces={false}
        style={styles.scroller}
      >
        <View style={[styles.trail, { gap: spacing["1.5"] }]}>
          {Children.map(children, (item, index) => (
            <Fragment key={index}>
              {index > 0 ? (
                <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants" style={styles.caret}>
                  <CaretRight size={14} color={theme.color("text-secondary")} />
                </View>
              ) : null}
              <View style={styles.slot}>{item}</View>
            </Fragment>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

/** Props of {@link BreadcrumbItem}. */
export type BreadcrumbItemProps = {
  /** Marks the current page: primary text and the selected accessibility state. */
  current?: boolean;
  /** Leading 20pt ink tile, such as the workspace initial. */
  tile?: ReactNode;
  /**
   * Destination of the crumb. React rendered an anchor and let the browser
   * navigate; React Native has none, so the crumb is a link pressable and the
   * host navigates from `onPress`.
   */
  href?: string;
  /** Runs when a crumb that is not the current page is pressed. */
  onPress?: () => void;
  /** The crumb label. */
  children?: ReactNode;
};

/**
 * One crumb of {@link Breadcrumb}: a link pressable when `href` is set and the crumb is not
 * current, otherwise static text. The current crumb renders primary text with the selected
 * accessibility state, matching React's `aria-current="page"`.
 *
 * A crumb is a word in a row, so its height comes from padding; only a pressable one grows to
 * the 44pt floor, since that is the one a thumb has to hit.
 *
 * @example
 * ```tsx
 * <BreadcrumbItem href="/projects" onPress={() => router.push("/projects")}>Projects</BreadcrumbItem>
 * ```
 */
export function BreadcrumbItem({ current, tile, href, onPress, children }: BreadcrumbItemProps) {
  const theme = useHoronTheme();
  const tappable = Boolean(href) && !current;
  const ink = current ? "text-primary" : "text-secondary";

  const content = (
    <>
      {tile !== undefined ? (
        <View style={[styles.tile, { backgroundColor: theme.color("interactive-primary") }]}>
          {typeof tile === "string" || typeof tile === "number" ? (
            <HoronText variant="label-sm" tone="text-inverse">
              {tile}
            </HoronText>
          ) : (
            tile
          )}
        </View>
      ) : null}
      {typeof children === "string" || typeof children === "number" ? (
        <HoronText variant="label-md" tone={ink} numberOfLines={1}>
          {children}
        </HoronText>
      ) : (
        children
      )}
    </>
  );

  if (!tappable)
    return (
      <View
        accessibilityElementsHidden={false}
        accessibilityState={{ selected: current }}
        style={[styles.crumb, { gap: spacing["1.5"] }]}
      >
        {content}
      </View>
    );

  return (
    <HoronPressable
      role="link"
      accessibilityState={{ selected: false }}
      onPress={onPress}
      style={[styles.crumb, { gap: spacing["1.5"], minHeight: theme.touch ? 44 : undefined }]}
    >
      {({ pressed }) => <View style={{ opacity: pressed ? 0.7 : 1, flexDirection: "row", alignItems: "center", gap: spacing["1.5"] }}>{content}</View>}
    </HoronPressable>
  );
}

const styles = StyleSheet.create({
  root: { width: "100%", minWidth: 0, overflow: "hidden", borderCurve: "continuous" },
  tray: { position: "relative" },
  // React Native's ScrollView ships `flexGrow: 1`; in an auto-height column that stretches the tray.
  scroller: { flexGrow: 0, flexShrink: 0 },
  trail: { flexDirection: "row", alignItems: "center", minWidth: 0 },
  caret: { flexShrink: 0 },
  slot: { flexShrink: 0 },
  crumb: { flexDirection: "row", alignItems: "center", borderRadius: radius.sm, paddingVertical: spacing["1"], paddingHorizontal: spacing["1.5"] },
  tile: { width: 20, height: 20, alignItems: "center", justifyContent: "center", borderRadius: radius.xs },
});
