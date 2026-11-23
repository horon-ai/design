import { useEffect, useState, type ReactNode } from "react";
import { Animated, StyleSheet, View, type StyleProp, type ViewStyle } from "react-native";
import { Robot } from "phosphor-react-native";
import { lightColors, primitives, radius } from "@horon-ai/tokens";

import { useHoronTheme, type ColorToken, type TextStyleName } from "../provider";
import { DEFAULT_ICON_WEIGHT } from "../lib/icon";
import { duration, easing } from "../lib/motion";
import { HoronText } from "../lib/text";

/** Diameter of the avatar: `sm` 24px, `md` 32px, `lg` 40px, `xl` 56px. */
export type AvatarSize = "sm" | "md" | "lg" | "xl";

/** Props for {@link Avatar}: the avatar type and size, the image source, fallback content and the live dot. */
export type AvatarProps = {
  /** `initials` (default), `bot` (robot on the brand tint) or `image`. @default "initials" */
  type?: "initials" | "bot" | "image";
  /** Diameter token; also scales the initials, the bot icon and the live dot. @default "md" */
  size?: AvatarSize;
  /** Image URL for `type="image"`; initials show while it loads or if it fails. */
  src?: string;
  /** Alternative text for `type="image"`; pass `""` when the name is already shown next to the avatar. @default "" */
  alt?: string;
  /** Initials, or any fallback content. */
  children?: ReactNode;
  /** Shows the live status dot at the bottom right. @default false */
  live?: boolean;
  /** Initials colour: `neutral` (default) or `sky`, the Paper account profile avatar (sky-100 fill, sky-700 text). @default "neutral" */
  tone?: "neutral" | "sky";
  /**
   * Border colour of the live dot, so it matches the surface behind it (glass panels, `bg-subtle`, brand tints).
   * Defaults to `border-bg-surface`. The React class name is read as a colour token:
   * `border-bg-surface` resolves `bg-surface`, and a bare token name is used as given.
   * @default "border-bg-surface"
   */
  liveRingClassName?: string;
  /** Layout of the wrapper (positioning, margins). */
  style?: StyleProp<ViewStyle>;
};

/** The circle diameter per size, in points. */
const circle: Record<AvatarSize, number> = { sm: 24, md: 32, lg: 40, xl: 56 };

/** The initials rung, matching the React size classes. */
const initialsVariant: Record<AvatarSize, TextStyleName> = {
  sm: "label-sm",
  md: "label-md",
  lg: "label-lg",
  xl: "title-sm",
};

/** The bot glyph, the React pixel sizes (13, 18, 22, 31). */
const botSize: Record<AvatarSize, number> = { sm: 13, md: 18, lg: 22, xl: 31 };

/** Live dot outer size: the Figma dot diameter (10, 11, 13, 18) plus its 2pt centred stroke. */
const liveSize: Record<AvatarSize, number> = { sm: 10, md: 11, lg: 13, xl: 18 };

/** Background token per avatar type, the Figma `bg-subtle`, `bg-brand` and `sky-200` fills. */
const typeFill: Record<AvatarProps["type"] & string, ColorToken> = {
  initials: "bg-subtle",
  bot: "bg-brand",
  image: "bg-brand",
};

const typeText: Record<AvatarProps["type"] & string, ColorToken> = {
  initials: "text-secondary",
  bot: "text-brand",
  image: "text-secondary",
};

/** Narrows a token name from a class string to the colour-token union. */
const isColorToken = (value: string): value is ColorToken => Object.hasOwn(lightColors, value);

/**
 * Resolves the live dot's React border class to a colour token, so a call site
 * that passes `border-bg-surface` keeps the same surface colour it named.
 */
function ringToken(value: string): ColorToken {
  const token = value.startsWith("border-") ? value.slice("border-".length) : value;
  return isColorToken(token) ? token : "bg-surface";
}

/** True for text the avatar can set in its own type token; a node keeps its own styling. */
const isPlainText = (value: ReactNode): value is string | number =>
  typeof value === "string" || typeof value === "number";

/**
 * Figma `Avatar` (61:347): Initials, Bot and Image in four sizes, with an optional live dot.
 *
 * React delegated the image/fallback swap to Base UI's avatar primitive; the same behaviour comes
 * from `Image`'s `onLoad`/`onError` here: the initials stay until the picture has loaded, and an
 * image that fails to load leaves them in place instead of a broken box. The 1px inset ring React
 * drew with `inset-ring` is a `boxShadow` inset ring from the `overlay-ink-6` token, and the live
 * dot's pulse — a spreading ring in React — is a scaling, fading halo that keeps running until the
 * dot unmounts. Reduce Motion paints the dot still.
 *
 * @example
 * ```tsx
 * <Avatar type="image" size="lg" src={user.photoUrl} alt="" live>
 *   {initials}
 * </Avatar>
 * ```
 */
export function Avatar({
  type = "initials",
  size = "md",
  src,
  alt = "",
  children,
  live,
  tone = "neutral",
  liveRingClassName = "border-bg-surface",
  style,
}: AvatarProps) {
  const theme = useHoronTheme();
  // The outcome is stored with the source it belongs to, so a new `src` starts a new attempt
  // without an effect that resets state after the render.
  const [outcome, setOutcome] = useState({ src, loaded: false, failed: false });
  const settled = outcome.src === src ? outcome : { src, loaded: false, failed: false };
  const [fade] = useState(() => new Animated.Value(0));
  const [pop] = useState(() => new Animated.Value(0));
  const [pulse] = useState(() => new Animated.Value(0));

  useEffect(() => {
    if (!settled.loaded) {
      fade.setValue(0);
      return;
    }
    if (theme.reducedMotion) {
      fade.setValue(1);
      return;
    }
    Animated.timing(fade, {
      toValue: 1,
      duration: duration.fadeIn,
      easing: easing.outQuint,
      useNativeDriver: true,
    }).start();
  }, [settled.loaded, theme.reducedMotion, fade]);

  useEffect(() => {
    if (!live) return undefined;
    if (theme.reducedMotion) {
      pop.setValue(1);
      pulse.setValue(1);
      return undefined;
    }
    Animated.timing(pop, {
      toValue: 1,
      duration: duration.popIn,
      easing: easing.spring,
      useNativeDriver: true,
    }).start();
    const loop = Animated.loop(
      Animated.timing(pulse, {
        toValue: 1,
        duration: duration.livePulse,
        easing: easing.outQuint,
        useNativeDriver: true,
      }),
    );
    pulse.setValue(0);
    loop.start();
    return () => loop.stop();
  }, [live, theme.reducedMotion, pop, pulse]);

  const hasImage = type === "image" && Boolean(src) && !settled.failed;
  const showFallback = !(hasImage && settled.loaded);
  const skyInitials = type === "initials" && tone === "sky";
  const diameter = circle[size];
  const dot = liveSize[size];
  const tint = typeText[type];
  // The sky account tone is sky-100 on sky-700; the semantic `text-brand` is exactly sky-700,
  // and no semantic token carries sky-100, so that fill (and the image's sky-200 placeholder)
  // come from the primitive steps the Figma file names.
  const sky = { backgroundColor: primitives["sky-100"] };

  return (
    <View style={[styles.root, style]}>
      <View
        style={[
          styles.circle,
          {
            width: diameter,
            height: diameter,
            backgroundColor: skyInitials
              ? sky.backgroundColor
              : type === "image"
                ? primitives["sky-200"]
                : theme.color(typeFill[type]),
            boxShadow: `inset 0 0 0 1px ${theme.color("overlay-ink-6")}`,
          },
        ]}
      >
        {type === "bot" ? (
          <Robot size={botSize[size]} weight={DEFAULT_ICON_WEIGHT} color={theme.color("text-brand")} />
        ) : (
          <>
            {hasImage ? (
              <Animated.Image
                source={{ uri: src }}
                accessible={alt !== ""}
                accessibilityRole={alt === "" ? undefined : "image"}
                accessibilityLabel={alt === "" ? undefined : alt}
                onLoad={() => setOutcome({ src, loaded: true, failed: false })}
                onError={() => setOutcome({ src, loaded: false, failed: true })}
                resizeMode="cover"
                style={[styles.image, { opacity: fade }]}
              />
            ) : null}
            {showFallback ? (
              isPlainText(children) ? (
                <HoronText
                  variant={initialsVariant[size]}
                  tone={skyInitials ? "text-brand" : tint}
                  numberOfLines={1}
                >
                  {children}
                </HoronText>
              ) : (
                children
              )
            ) : null}
          </>
        )}
      </View>
      {live ? (
        <Animated.View
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
          style={[styles.live, { right: -1, bottom: -1, opacity: pop }]}
        >
          {theme.reducedMotion ? null : (
            <Animated.View
              pointerEvents="none"
              style={[
                styles.halo,
                {
                  width: dot,
                  height: dot,
                  backgroundColor: theme.color("status-live"),
                  opacity: pulse.interpolate({ inputRange: [0, 1], outputRange: [0.45, 0] }),
                  transform: [{ scale: pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 1.8] }) }],
                },
              ]}
            />
          )}
          <View
            style={[
              styles.dot,
              {
                width: dot,
                height: dot,
                backgroundColor: theme.color("status-live"),
                borderColor: theme.color(ringToken(liveRingClassName)),
              },
            ]}
          />
        </Animated.View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { alignSelf: "flex-start", flexShrink: 0 },
  circle: {
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    borderRadius: radius.full,
    borderCurve: "continuous",
  },
  image: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0 },
  live: { position: "absolute", alignItems: "center", justifyContent: "center" },
  halo: { position: "absolute", borderRadius: radius.full },
  dot: { borderWidth: 2, borderRadius: radius.full },
});
