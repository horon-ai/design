import { useMemo, type ReactNode } from "react";
import { StyleSheet, View, type PressableProps, type StyleProp, type ViewStyle } from "react-native";
import { IconContext } from "phosphor-react-native";
import { radius, spacing } from "@horon-ai/tokens";

import { useHoronTheme, type ColorToken } from "../provider";
import { GlassSurface } from "../lib/glass-surface";
import { controlHeight, DISABLED_OPACITY, TOUCH_TARGET, touchSlop } from "../lib/size";
import { HoronPressable } from "../lib/press";
import { wrapTextChildren } from "../lib/text";

/**
 * Visual treatment of {@link Button}.
 *
 * - `primary` — filled brand button, for the single main action of a screen or dialog.
 * - `glass` — clear glass from `expo-glass-effect`, for chrome floating over imagery.
 * - `solid` — bordered surface button, for secondary actions on a page.
 * - `danger` — filled destructive action, such as delete.
 * - `link` — size-independent text-only button; `aria-current` colours it like primary text,
 *   which is how an active navigation link is marked.
 */
export type ButtonVariant = "primary" | "glass" | "solid" | "danger" | "link";
/**
 * Height and text rung of a non-`link` {@link Button}, identical to `ControlSize`:
 * `sm` 32pt `label-md`, `md` 40pt `label-lg`, `lg` 48pt `label-lg`.
 */
export type ButtonSize = "sm" | "md" | "lg";

export type ButtonProps = Omit<PressableProps, "children" | "style"> & {
  /**
   * Visual treatment; `link` ignores the size rungs.
   * @default "primary"
   */
  variant?: ButtonVariant;
  /**
   * Height and label rung of the control; `link` stays text-only.
   * @default "md"
   */
  size?: ButtonSize;
  /** Leading icon; sized 16pt (sm, md) or 20pt (lg) and coloured like the label. */
  icon?: ReactNode;
  /** Marks the current item of a navigation set; a `link` paints it as primary text. */
  "aria-current"?: boolean | "page" | "step" | "location" | "date" | "time" | "true" | "false";
  /** The label. A string is set in the button's type token; elements sit in a row at the button's gap. */
  children?: ReactNode;
  /** Outer layout, appended last (width, margins). */
  style?: StyleProp<ViewStyle>;
};

type Paint = { fill?: ColorToken; pressed?: ColorToken; label: ColorToken; border?: ColorToken };

const PAINT: Record<Exclude<ButtonVariant, "glass" | "link">, Paint> = {
  primary: { fill: "interactive-primary", pressed: "interactive-primary-pressed", label: "interactive-on-primary" },
  solid: {
    fill: "bg-surface",
    pressed: "interactive-secondary-hover",
    label: "text-primary",
    border: "border-default",
  },
  danger: { fill: "interactive-danger", pressed: "interactive-danger-hover", label: "interactive-on-danger" },
};

const PADDING = { sm: spacing["3"], md: spacing["4"], lg: spacing["5"] } as const;
const GAP = { sm: spacing["1.5"], md: spacing["2"], lg: spacing["2"] } as const;
const ICON = { sm: 16, md: 16, lg: 20 } as const;

/**
 * Figma `Button` (55:339): Primary, Glass, Solid and Danger in three sizes, plus a text-only `link`
 * variant (size-independent), drawn with a React Native `Pressable`.
 *
 * - Announces itself as a `button` (`link` for the link variant) with `disabled` and, for a current
 *   link, `selected` in its accessibility state; the label is the accessible name.
 * - Pressing paints the variant's pressed fill; disabled paints at 40% and ignores presses.
 * - With `touch` on (the default), sizes below 44pt keep a 44pt hit target through `hitSlop`.
 * - `glass` is an `expo-glass-effect` `GlassView` on iOS 26+, and the frost fallback elsewhere.
 *
 * @example
 * ```tsx
 * <Button onPress={save}>Save changes</Button>
 * <Button variant="solid" size="sm">Cancel</Button>
 * ```
 */
export function Button({
  variant = "primary",
  size = "md",
  icon,
  children,
  disabled,
  style,
  "aria-current": current,
  ...props
}: ButtonProps) {
  const theme = useHoronTheme();
  const isLink = variant === "link";
  const isCurrent = current !== undefined && current !== false && current !== "false";
  const height = isLink ? undefined : controlHeight[size];
  const label: ColorToken = isLink
    ? isCurrent
      ? "text-primary"
      : "text-secondary"
    : variant === "glass"
      ? "text-primary"
      : PAINT[variant].label;
  const labelColor = theme.color(label);
  const iconSize = isLink ? 14 : ICON[size];
  const iconDefaults = useMemo(() => ({ color: labelColor, size: iconSize }), [labelColor, iconSize]);

  const content = (
    <IconContext.Provider value={iconDefaults}>
      {icon ? <View style={styles.icon}>{icon}</View> : null}
      <View style={[styles.row, { gap: isLink ? spacing["1.5"] : GAP[size] }]}>
        {wrapTextChildren(children, {
          variant: isLink ? "label-sm" : size === "sm" ? "label-md" : "label-lg",
          tone: label,
          numberOfLines: 1,
        })}
      </View>
    </IconContext.Provider>
  );

  const frame: ViewStyle = isLink
    ? {
        gap: spacing["1.5"],
        paddingHorizontal: spacing["1"],
        borderRadius: radius.sm,
        minHeight: theme.touch ? TOUCH_TARGET : undefined,
      }
    : { height, gap: GAP[size], paddingHorizontal: PADDING[size], borderRadius: radius.full };

  return (
    <HoronPressable
      pressScale={!isLink}
      role={isLink ? "link" : "button"}
      accessibilityState={{ disabled: !!disabled, selected: isLink ? isCurrent : undefined }}
      disabled={disabled}
      hitSlop={isLink || height === undefined ? undefined : touchSlop(theme.touch, height)}
      style={[styles.root, disabled && { opacity: DISABLED_OPACITY }, style]}
      {...props}
    >
      {({ pressed }) => {
        if (variant === "glass") {
          return (
            <GlassSurface
              tier="clear"
              radius={radius.full}
              interactive={!disabled}
              pressed={pressed}
              style={[styles.inner, frame]}
            >
              {content}
            </GlassSurface>
          );
        }
        const paint = isLink ? undefined : PAINT[variant];
        return (
          <View
            style={[
              styles.inner,
              frame,
              paint?.fill && { backgroundColor: theme.color(pressed && paint.pressed ? paint.pressed : paint.fill) },
              paint?.border && { borderWidth: 1, borderColor: theme.color(paint.border) },
              isLink && pressed && { opacity: 0.7 },
            ]}
          >
            {content}
          </View>
        );
      }}
    </HoronPressable>
  );
}

const styles = StyleSheet.create({
  root: { alignSelf: "flex-start", flexShrink: 0 },
  inner: { flexDirection: "row", alignItems: "center", justifyContent: "center", borderCurve: "continuous" },
  icon: { flexShrink: 0 },
  row: { flexDirection: "row", alignItems: "center" },
});
