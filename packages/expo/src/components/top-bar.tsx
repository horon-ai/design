import { useEffect, useState, type ReactNode } from "react";
import { Animated, StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";
import { CaretLeft, DotsThree } from "phosphor-react-native";
import { radius, spacing } from "@horon-ai/tokens";

import { useHoronTheme } from "../provider";
import { GlassSurface } from "../lib/glass-surface";
import { ACTIVE_ICON_WEIGHT } from "../lib/icon";
import { useInsets } from "../lib/insets";
import { duration, easing } from "../lib/motion";
import { HoronText } from "../lib/text";
import { Avatar } from "./avatar";
import { IconButton } from "./icon-button";

/**
 * Props for {@link TopBar}. React spread the `header` element's props here;
 * React Native has no `header`, so the bar takes only what it paints plus a
 * `style` for placement.
 */
export type TopBarProps = {
  /** Bar title; truncates to one line and re-runs the fade-in when the text changes. */
  title: ReactNode;
  /** Second line under the title, muted and truncated. */
  subtitle?: ReactNode;
  /** Shows the live status dot on the avatar. */
  live?: boolean;
  /** Renders the back IconButton on the left and calls this on press; hidden when omitted. */
  onBack?: () => void;
  /** Renders the overflow IconButton on the right and calls this on press; hidden when omitted. */
  onMore?: () => void;
  /** Accessible label of the back button. @default "Back" */
  backLabel?: string;
  /** Accessible label of the overflow button. @default "More" */
  moreLabel?: string;
  /** `solid` (default) is an opaque surface bar with a default border; `glass` is the regular glass bar. @default "solid" */
  surface?: "solid" | "glass";
  /** Outer layout, merged onto the bar (margins, width). */
  style?: StyleProp<ViewStyle>;
};

/** True for text the bar can set in its own type token; a node keeps its own styling. */
const isPlainText = (value: ReactNode): value is string | number =>
  typeof value === "string" || typeof value === "number";

/**
 * Paper `Top bar`: back button, bot avatar with a flush live dot, title and subtitle, on solid surface or regular glass.
 *
 * A rounded bar announced as `banner`, padded by the top safe-area inset because it
 * sits against the status bar. The glass variant is a regular {@link GlassSurface},
 * so iOS 26 paints Liquid Glass and every other device the frost fallback. Back and
 * overflow buttons only appear when `onBack` / `onMore` are passed, which keeps the
 * bare title layout for read-only screens; the title column fades in again whenever
 * the title or subtitle text changes.
 *
 * @example
 * ```tsx
 * import { TopBar } from "@horon-ai/expo";
 *
 * function Example() {
 *   return (
 *     <TopBar
 *       title="Research bot"
 *       subtitle="12 tasks today"
 *       live
 *       onBack={() => goBack()}
 *       onMore={() => setMenuOpen(true)}
 *     />
 *   );
 * }
 * ```
 */
export function TopBar({
  title,
  subtitle,
  live,
  onBack,
  onMore,
  backLabel = "Back",
  moreLabel = "More",
  surface = "solid",
  style,
}: TopBarProps) {
  const theme = useHoronTheme();
  const insets = useInsets();
  // React re-keyed the title column on its text, so a changed title or subtitle re-ran the CSS
  // fade-in. The column is a component of its own here, keyed the same way, for the same replay.
  const brief = typeof title === "string" ? `${title}|${typeof subtitle === "string" ? subtitle : ""}` : undefined;

  const content = (
    <>
      {onBack ? <IconButton icon={<CaretLeft />} label={backLabel} onClick={onBack} /> : null}
      <Avatar type="bot" size="md" live={live} />
      <Fade key={brief} style={styles.title}>
        {isPlainText(title) ? (
          <HoronText variant="label-lg" tone="text-primary" numberOfLines={1}>
            {title}
          </HoronText>
        ) : (
          title
        )}
        {subtitle ? (
          isPlainText(subtitle) ? (
            <HoronText variant="caption" tone="text-secondary" numberOfLines={1}>
              {subtitle}
            </HoronText>
          ) : (
            subtitle
          )
        ) : null}
      </Fade>
      {onMore ? <IconButton icon={<DotsThree weight={ACTIVE_ICON_WEIGHT} />} label={moreLabel} onClick={onMore} /> : null}
    </>
  );

  return (
    <View role="banner" style={[styles.root, { paddingTop: insets.top }, style]}>
      {surface === "glass" ? (
        <GlassSurface tier="regular" radius={radius.full} style={styles.pill}>
          {content}
        </GlassSurface>
      ) : (
        <View
          style={[
            styles.pill,
            styles.clip,
            { backgroundColor: theme.color("bg-surface"), borderColor: theme.color("border-default"), borderWidth: 1 },
          ]}
        >
          {content}
        </View>
      )}
    </View>
  );
}

/**
 * The title column: it fades in over 160ms without moving, which is react's `animate-fade-in`.
 * Mounting it again (a new `key`) replays the fade, which is what a changed title asks for.
 */
function Fade({ style, children }: { style: StyleProp<ViewStyle>; children: ReactNode }) {
  const theme = useHoronTheme();
  const [opacity] = useState(() => new Animated.Value(0));

  useEffect(() => {
    if (theme.reducedMotion) {
      opacity.setValue(1);
      return;
    }
    opacity.setValue(0);
    Animated.timing(opacity, {
      toValue: 1,
      duration: duration.fadeIn,
      easing: easing.outQuint,
      useNativeDriver: true,
    }).start();
  }, [theme.reducedMotion, opacity]);

  return <Animated.View style={[style, { opacity }]}>{children}</Animated.View>;
}

const styles = StyleSheet.create({
  root: { alignSelf: "stretch", flexShrink: 0 },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing["2"],
    padding: spacing["2"],
    borderRadius: radius.full,
    borderCurve: "continuous",
  },
  clip: { overflow: "hidden" },
  title: { flex: 1, minWidth: 0, flexDirection: "column" },
});
