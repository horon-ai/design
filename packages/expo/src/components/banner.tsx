import { useEffect, useState, type ReactNode } from "react";
import { Animated, StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";
import { Info, WarningCircle } from "phosphor-react-native";
import { radius, spacing } from "@horon-ai/tokens";

import { useHoronTheme, type ColorToken, type TextStyleName } from "../provider";
import { GlassSurface } from "../lib/glass-surface";
import { duration, easing } from "../lib/motion";
import { TOUCH_TARGET, type ControlSize } from "../lib/size";
import { HoronText } from "../lib/text";

/** Severity of the strip: `info` tints the rim and icon brand, `danger` uses the danger rim and role="alert". */
export type BannerTone = "info" | "danger";
/** Size token shared with the form controls; the rendered heights are documented on {@link Banner}. */
export type BannerSize = ControlSize;
/** `solid` paints the raised surface, `glass` layers the glass material for use over imagery. */
export type BannerSurface = "solid" | "glass";

/** Props for {@link Banner}: the tone, size and surface of the strip plus its optional trailing action. */
export type BannerProps = {
  /** Severity; also picks the icon and the ARIA role. @default "info" */
  tone?: BannerTone;
  /** Trailing underlined action, such as a link or button. */
  action?: ReactNode;
  /** Banner size: `sm` 32px minimum, `md` the Figma 48px strip (default), `lg` 56px; scales icon, text and padding. @default "md" */
  size?: BannerSize;
  /** `solid` (default) on raised surfaces, `glass` over imagery and glass panels. @default "solid" */
  surface?: BannerSurface;
  /** Layout merged onto the strip, for margins or width overrides. */
  style?: StyleProp<ViewStyle>;
  /** The message; it wraps inside the strip. */
  children?: ReactNode;
};

/** Padding and gap per rung: `gap-2 px-3 py-2`, `gap-3 px-4 py-2.5`, `gap-3 px-5 py-3`. */
const frame: Record<BannerSize, ViewStyle> = {
  sm: { gap: spacing["2"], paddingHorizontal: spacing["3"], paddingVertical: spacing["2"] },
  md: { gap: spacing["3"], paddingHorizontal: spacing["4"], paddingVertical: spacing["2.5"] },
  lg: { gap: spacing["3"], paddingHorizontal: spacing["5"], paddingVertical: spacing["3"] },
};

/** React sized the icon through `[&_svg]:size-3.5|4|5`. */
const iconSize: Record<BannerSize, number> = { sm: 14, md: 16, lg: 20 };

const textVariant: Record<BannerSize, TextStyleName> = {
  sm: "body-sm",
  md: "body-md",
  lg: "body-lg",
};

const actionVariant: Record<BannerSize, TextStyleName> = { sm: "label-md", md: "label-lg", lg: "label-lg" };

const toneText: Record<BannerTone, ColorToken> = { info: "text-brand", danger: "text-danger" };
const toneEdge: Record<BannerTone, ColorToken> = { info: "border-brand", danger: "border-danger" };

/** True for text the strip can set in its own type token; a node keeps its own styling. */
const isPlainText = (value: ReactNode): value is string | number =>
  typeof value === "string" || typeof value === "number";

/**
 * Figma `Banner` (62:318): a strip with a tinted rim, 16px icon and an underlined action.
 *
 * The tone sets the announcement: `danger` is announced immediately (`role="alert"`), `info`
 * politely through `accessibilityLiveRegion`, React Native's counterpart of the `role="status"`
 * React renders. The strip rises in over 220ms, `glass` is a `GlassSurface`, and a touch device
 * gives the trailing action the 44pt row React got from `pointer-coarse:`.
 *
 * @example
 * ```tsx
 * <Banner tone="danger" action="Review">
 *   Your API key expired.
 * </Banner>
 * ```
 */
export function Banner({ tone = "info", action, size = "md", surface = "solid", style, children }: BannerProps) {
  const theme = useHoronTheme();
  const [rise] = useState(() => new Animated.Value(0));

  useEffect(() => {
    if (theme.reducedMotion) {
      rise.setValue(1);
      return;
    }
    Animated.timing(rise, {
      toValue: 1,
      duration: duration.popIn,
      easing: easing.outQuint,
      useNativeDriver: true,
    }).start();
  }, [theme.reducedMotion, rise]);

  return (
    <Animated.View
      accessible
      role={tone === "danger" ? "alert" : undefined}
      accessibilityLiveRegion={tone === "danger" ? "assertive" : "polite"}
      style={[
        styles.root,
        frame[size],
        {
          borderColor: theme.color(toneEdge[tone]),
          backgroundColor: surface === "solid" ? theme.color("bg-surface") : undefined,
        },
        style,
        { opacity: rise, transform: [{ translateY: rise.interpolate({ inputRange: [0, 1], outputRange: [4, 0] }) }] },
      ]}
    >
      {surface === "glass" ? <GlassSurface tier="regular" radius={radius.md} style={StyleSheet.absoluteFill} /> : null}
      <View style={styles.icon}>
        {tone === "danger" ? (
          <WarningCircle size={iconSize[size]} color={theme.color(toneText[tone])} />
        ) : (
          <Info size={iconSize[size]} color={theme.color(toneText[tone])} />
        )}
      </View>
      <View style={styles.message}>
        {isPlainText(children) ? (
          <HoronText variant={textVariant[size]} tone="text-primary">
            {children}
          </HoronText>
        ) : (
          children
        )}
      </View>
      {action ? (
        <View style={[styles.action, theme.touch && styles.actionTouch]}>
          {isPlainText(action) ? (
            <HoronText variant={actionVariant[size]} tone="text-primary" style={styles.underline}>
              {action}
            </HoronText>
          ) : (
            action
          )}
        </View>
      ) : null}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: {
    flexDirection: "row",
    alignItems: "center",
    overflow: "hidden",
    borderWidth: 1,
    borderRadius: radius.md,
    borderCurve: "continuous",
  },
  icon: { flexShrink: 0 },
  message: { flex: 1, minWidth: 0 },
  action: { flexShrink: 0 },
  actionTouch: { minHeight: TOUCH_TARGET, justifyContent: "center" },
  underline: { textDecorationLine: "underline" },
});
