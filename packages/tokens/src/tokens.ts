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

  // Glass = the floating-chrome surface variant. It OWNS its foreground (it
  // must not inherit the theme `foreground`): light glass is a translucent
  // white sheet, so its text is the dark ink, not the light-theme foreground.
  // `glass-fill-frost` / `glass-fill-solid` are the degradation-ladder
  // fallbacks for `prefers-reduced-transparency: reduce` and
  // `@supports not (backdrop-filter)`.
  "glass-fill": "oklch(1 0 0 / 0.55)",
  "glass-fill-strong": "oklch(1 0 0 / 0.7)",
  "glass-fill-frost": "oklch(1 0 0 / 0.9)",
  "glass-fill-solid": "oklch(1 0 0)",
  "glass-border": "oklch(1 0 0 / 0.8)",
  "glass-foreground": "oklch(0.2686 0 89.876)",
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

  // Dark glass is a dark, MORE opaque sheet (not an inverted white one), so its
  // owned foreground is the light ink. The default rung must stay >= 4.5:1 even
  // when it floats over LIGHT content: a dark sheet at low alpha lifts its
  // composite toward the backdrop, and light ink over a light-lifted composite
  // loses contrast (0.55 alpha measured 3.66:1 over a light card). The fill
  // opacity is set high enough to clear AA over a pure-white backdrop while
  // staying translucent (measured 5.87:1; see scripts/glass-contrast.ts).
  "glass-fill": "oklch(0.2136 0.032 262.44 / 0.7)",
  "glass-fill-strong": "oklch(0.2136 0.032 262.44 / 0.8)",
  "glass-fill-frost": "oklch(0.2136 0.032 262.44 / 0.9)",
  "glass-fill-solid": "oklch(0.2136 0.032 262.44)",
  "glass-border": "oklch(1 0 0 / 0.12)",
  "glass-foreground": "oklch(0.9642 0 89.876)",
} as const satisfies Record<keyof typeof light, string>

export const colorTokens = { light, dark }

export type ColorScheme = "light" | "dark"
export type ColorTokenName = keyof typeof light
export type ColorTokens = typeof light
