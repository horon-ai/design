import { Text as RNText, type TextProps as RNTextProps } from "react-native";
import { useTheme } from "../theme";

export type TextVariant = "display" | "title" | "subtitle" | "body" | "bodySm" | "caption" | "label" | "code";

export type TextTone =
  "default" | "muted" | "primary" | "secondary" | "destructive" | "success" | "warning" | "inherit";

export type TextProps = RNTextProps & {
  variant?: TextVariant;
  tone?: TextTone;
};

export function Text({ variant = "body", tone = "default", style, ...rest }: TextProps) {
  const t = useTheme();

  const variantStyle = {
    display: {
      fontSize: t.fontSize["4xl"],
      lineHeight: t.fontSize["4xl"] * t.lineHeight.tight,
      fontWeight: t.fontWeight.bold,
      letterSpacing: t.letterSpacing.tight,
    },
    title: {
      fontSize: t.fontSize["2xl"],
      lineHeight: t.fontSize["2xl"] * t.lineHeight.tight,
      fontWeight: t.fontWeight.semibold,
      letterSpacing: t.letterSpacing.tight,
    },
    subtitle: {
      fontSize: t.fontSize.xl,
      lineHeight: t.fontSize.xl * t.lineHeight.snug,
      fontWeight: t.fontWeight.semibold,
    },
    body: {
      fontSize: t.fontSize.base,
      lineHeight: t.fontSize.base * t.lineHeight.normal,
      fontWeight: t.fontWeight.regular,
    },
    bodySm: {
      fontSize: t.fontSize.sm,
      lineHeight: t.fontSize.sm * t.lineHeight.normal,
      fontWeight: t.fontWeight.regular,
    },
    caption: {
      fontSize: t.fontSize.xs,
      lineHeight: t.fontSize.xs * t.lineHeight.normal,
      fontWeight: t.fontWeight.regular,
    },
    label: {
      fontSize: t.fontSize.sm,
      lineHeight: t.fontSize.sm * t.lineHeight.tight,
      fontWeight: t.fontWeight.medium,
    },
    code: {
      fontSize: t.fontSize.sm,
      lineHeight: t.fontSize.sm * t.lineHeight.normal,
      fontWeight: t.fontWeight.regular,
      fontFamily: t.fontFamily.native.mono,
    },
  }[variant];

  const color = {
    default: t.colors.foreground,
    muted: t.colors["muted-foreground"],
    primary: t.colors.primary,
    secondary: t.colors["secondary-foreground"],
    destructive: t.colors.destructive,
    success: t.colors.success,
    warning: t.colors.warning,
    inherit: undefined,
  }[tone];

  return (
    <RNText {...rest} style={[{ color, ...variantStyle }, style]} allowFontScaling={rest.allowFontScaling ?? true} />
  );
}
