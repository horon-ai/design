import { Children, type ReactNode } from "react";
import { Text, type TextProps } from "react-native";

import { useHoronTheme, type ColorToken, type TextStyleName } from "../provider";

/** Props of {@link HoronText}. */
export type HoronTextProps = TextProps & {
  /**
   * The type token, one of the thirteen styles in `@horon-ai/tokens`.
   * @default "body-md"
   */
  variant?: TextStyleName;
  /**
   * The colour token of the text.
   * @default "text-primary"
   */
  tone?: ColorToken;
};

/**
 * Text set in one of the type tokens on the active board and coloured by one
 * colour token. Every component draws its words through it.
 *
 * Dynamic Type stays on: React Native scales `fontSize` and `lineHeight` by the
 * OS text size. `maxFontSizeMultiplier` defaults to 2 so a control label at the
 * largest accessibility size still fits a row; pass `undefined` to lift it.
 */
export function HoronText({
  variant = "body-md",
  tone = "text-primary",
  maxFontSizeMultiplier = 2,
  style,
  ...rest
}: HoronTextProps) {
  const theme = useHoronTheme();
  return (
    <Text
      maxFontSizeMultiplier={maxFontSizeMultiplier}
      {...rest}
      style={[theme.text(variant), { color: theme.color(tone) }, style]}
    />
  );
}

/**
 * Children for a row that mixes elements and words, such as `<Chip><FileText /> Files</Chip>`.
 * React Native throws when a string sits directly in a `View`, so every string or number child is
 * set in a {@link HoronText} with `props`, and whitespace-only strings (the gap between an icon and
 * a word in JSX) are dropped because the row's own `gap` spaces them.
 */
export function wrapTextChildren(children: ReactNode, props: HoronTextProps): ReactNode {
  return Children.map(children, (child) => {
    if (typeof child === "number") return <HoronText {...props}>{child}</HoronText>;
    if (typeof child !== "string") return child;
    const words = child.trim();
    return words ? <HoronText {...props}>{words}</HoronText> : null;
  });
}
