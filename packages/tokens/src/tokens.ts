/**
 * Semantic color tokens, expressed in OKLCH (the CSS-native form).
 * `@horon/tokens/native` converts these to hex for React Native.
 *
 * A thin remap over the raw Horon palette in `palette.ts`: sand feeds surfaces/
 * text/borders, ink feeds `primary`, gold feeds `accent`/`ring`, muted status
 * ramps feed success/warning/destructive. Token names are unchanged.
 */

import { ACCENT, INK, solid } from "./palette"

const light = {
  background: solid("sand", 2, "light"),
  foreground: solid("sand", 12, "light"),
  card: solid("sand", 1, "light"),
  "card-foreground": solid("sand", 12, "light"),
  popover: solid("sand", 1, "light"),
  "popover-foreground": solid("sand", 12, "light"),
  primary: INK.light,
  "primary-foreground": solid("sand", 1, "light"),
  secondary: solid("sand", 3, "light"),
  "secondary-foreground": solid("sand", 12, "light"),
  muted: solid("sand", 3, "light"),
  "muted-foreground": solid("sand", 10, "light"),
  accent: solid("gold", 3, "light"),
  "accent-foreground": solid("sand", 12, "light"),
  destructive: solid("danger", 10, "light"),
  "destructive-foreground": solid("sand", 1, "light"),
  success: solid("success", 10, "light"),
  "success-foreground": solid("sand", 1, "light"),
  warning: solid("warning", 9, "light"),
  "warning-foreground": solid("sand", 12, "light"),
  border: solid("sand", 5, "light"),
  input: solid("sand", 5, "light"),
  ring: ACCENT.light,
  "chart-1": solid("gold", 9, "light"),
  "chart-2": solid("gold", 7, "light"),
  "chart-3": solid("sand", 9, "light"),
  "chart-4": solid("success", 10, "light"),
  "chart-5": solid("danger", 10, "light"),
  sidebar: solid("sand", 1, "light"),
  "sidebar-foreground": solid("sand", 12, "light"),
  "sidebar-primary": INK.light,
  "sidebar-primary-foreground": solid("sand", 1, "light"),
  "sidebar-accent": solid("gold", 3, "light"),
  "sidebar-accent-foreground": solid("sand", 12, "light"),
  "sidebar-border": solid("sand", 5, "light"),
  "sidebar-ring": ACCENT.light,
} as const

const dark = {
  background: solid("sand", 1, "dark"),
  foreground: solid("sand", 12, "dark"),
  card: solid("sand", 3, "dark"),
  "card-foreground": solid("sand", 12, "dark"),
  popover: solid("sand", 3, "dark"),
  "popover-foreground": solid("sand", 12, "dark"),
  primary: INK.dark,
  "primary-foreground": solid("sand", 1, "dark"),
  secondary: solid("sand", 4, "dark"),
  "secondary-foreground": solid("sand", 12, "dark"),
  muted: solid("sand", 4, "dark"),
  "muted-foreground": solid("sand", 9, "dark"),
  accent: solid("gold", 4, "dark"),
  "accent-foreground": solid("sand", 12, "dark"),
  destructive: solid("danger", 9, "dark"),
  "destructive-foreground": solid("sand", 12, "dark"),
  success: solid("success", 9, "dark"),
  "success-foreground": solid("sand", 1, "dark"),
  warning: solid("warning", 9, "dark"),
  "warning-foreground": solid("sand", 1, "dark"),
  border: solid("sand", 6, "dark"),
  input: solid("sand", 6, "dark"),
  ring: ACCENT.dark,
  "chart-1": solid("gold", 9, "dark"),
  "chart-2": solid("gold", 7, "dark"),
  "chart-3": solid("sand", 9, "dark"),
  "chart-4": solid("success", 9, "dark"),
  "chart-5": solid("danger", 9, "dark"),
  sidebar: solid("sand", 3, "dark"),
  "sidebar-foreground": solid("sand", 12, "dark"),
  "sidebar-primary": INK.dark,
  "sidebar-primary-foreground": solid("sand", 1, "dark"),
  "sidebar-accent": solid("gold", 4, "dark"),
  "sidebar-accent-foreground": solid("sand", 12, "dark"),
  "sidebar-border": solid("sand", 6, "dark"),
  "sidebar-ring": ACCENT.dark,
} as const satisfies Record<keyof typeof light, string>

export const colorTokens = { light, dark }

export type ColorScheme = "light" | "dark"
export type ColorTokenName = keyof typeof light
export type ColorTokens = typeof light
