import { createContext, useContext, type ReactNode } from "react";
import { useColorScheme } from "react-native";
import {
  breakpoint,
  colors,
  fontFamily,
  fontSize,
  fontWeight,
  letterSpacing,
  lineHeight,
  radius,
  radiusRem,
  shadow,
  space,
  zIndex,
  type ColorScheme,
  type ThemeColors,
} from "@horon-ai/tokens/native";

export type Theme = {
  scheme: ColorScheme;
  colors: ThemeColors;
  space: typeof space;
  radius: typeof radius;
  fontSize: typeof fontSize;
  fontWeight: typeof fontWeight;
  lineHeight: typeof lineHeight;
  letterSpacing: typeof letterSpacing;
  fontFamily: typeof fontFamily;
  shadow: typeof shadow;
};

/**
 * Lets a host (e.g. Storybook, or a web app with its own theme switch) pin the
 * color scheme. Without it the components follow the OS preference.
 */
const ThemeContext = createContext<ColorScheme | null>(null);

export function ThemeProvider({ scheme, children }: { scheme?: ColorScheme; children: ReactNode }) {
  return <ThemeContext.Provider value={scheme ?? null}>{children}</ThemeContext.Provider>;
}

export function useTheme(): Theme {
  const override = useContext(ThemeContext);
  const system = useColorScheme() ?? "light";
  const scheme = override ?? system;

  return {
    scheme,
    colors: colors[scheme],
    space,
    radius,
    fontSize,
    fontWeight,
    lineHeight,
    letterSpacing,
    fontFamily,
    shadow,
  };
}

export {
  breakpoint,
  colors,
  fontFamily,
  fontSize,
  fontWeight,
  letterSpacing,
  lineHeight,
  radius,
  radiusRem,
  shadow,
  space,
  zIndex,
};
export type { ColorScheme, ThemeColors };
