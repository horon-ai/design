/**
 * Semantic color tokens, expressed in OKLCH.
 *
 * Transcribed from the pen.dev canvas `00 Tokens` board
 * (`horon-design.pen`, board `ev2sU`). Token names follow the shadcn contract.
 *
 * Primitives come from `palette.ts`. A few surfaces (card, popover, muted,
 * secondary, accent, sidebar) are bespoke neutrals that are not on the sand
 * ramp, so they are written out directly - the canvas defines them that way.
 * Borders and inputs are the ink at 12% alpha, not a solid sand step.
 */

import { ACCENT, INK, PALETTE } from "./palette";

const light = {
  background: PALETTE.sand[100],
  foreground: PALETTE.sand[1200],
  card: "oklch(1 0 90)",
  "card-foreground": PALETTE.sand[1200],
  popover: "oklch(1 0 90)",
  "popover-foreground": PALETTE.sand[1200],
  primary: INK.light,
  "primary-foreground": PALETTE.sand[100],
  secondary: PALETTE.sand[200],
  "secondary-foreground": PALETTE.sand[1200],
  muted: PALETTE.sand[200],
  "muted-foreground": PALETTE.sand[700],
  accent: PALETTE.sand[200],
  "accent-foreground": PALETTE.sand[1200],
  destructive: PALETTE.red[600],
  "destructive-foreground": "oklch(1 0 90)",
  success: PALETTE.green[600],
  "success-foreground": "oklch(1 0 90)",
  warning: PALETTE.gold[500],
  "warning-foreground": "oklch(0.1889 0.026 77.499)",
  info: PALETTE.blue[600],
  "info-foreground": "oklch(1 0 90)",
  border: "oklch(0.1448 0 90 / 0.122)",
  input: "oklch(0.1448 0 90 / 0.122)",
  ring: ACCENT.light,
  "chart-1": PALETTE.sand[1200],
  "chart-2": PALETTE.sand[700],
  "chart-3": PALETTE.gold[500],
  "chart-4": PALETTE.green[600],
  "chart-5": PALETTE.blue[600],
  sidebar: PALETTE.sand[200],
  "sidebar-foreground": PALETTE.sand[1200],
  "sidebar-primary": INK.light,
  "sidebar-primary-foreground": PALETTE.sand[100],
  "sidebar-accent": PALETTE.sand[400],
  "sidebar-accent-foreground": PALETTE.sand[1200],
  "sidebar-border": "oklch(0.1448 0 90 / 0.122)",
  "sidebar-ring": ACCENT.light,

  // Glass = the floating-chrome surface. It OWNS its foreground (it must not
  // inherit the theme `foreground`). The fill/strong/border values are the
  // canvas glass; `glass-fill-frost` / `glass-fill-solid` are the
  // degradation-ladder rungs for `prefers-reduced-transparency: reduce` and
  // `@supports not (backdrop-filter)`.
  "glass-fill": "oklch(1 0 90 / 0.451)",
  "glass-fill-strong": "oklch(1 0 90 / 0.651)",
  "glass-fill-frost": "oklch(1 0 90 / 0.9)",
  "glass-fill-solid": "oklch(1 0 90)",
  "glass-border": "oklch(1 0 90 / 0.949)",
  "glass-tint": "oklch(0.1448 0 90 / 0.039)",
  "glass-foreground": PALETTE.sand[1200],
} as const;

const dark = {
  background: PALETTE.sand[1200],
  foreground: PALETTE.sand[100],
  card: "oklch(0.1913 0 90)",
  "card-foreground": PALETTE.sand[100],
  popover: "oklch(0.2046 0 90)",
  "popover-foreground": PALETTE.sand[100],
  primary: INK.dark,
  "primary-foreground": PALETTE.sand[1200],
  secondary: "oklch(0.2393 0 90)",
  "secondary-foreground": PALETTE.sand[100],
  muted: "oklch(0.2393 0 90)",
  "muted-foreground": PALETTE.sand[600],
  accent: "oklch(0.2393 0 90)",
  "accent-foreground": PALETTE.sand[100],
  destructive: PALETTE.red[400],
  "destructive-foreground": "oklch(0.1796 0.0217 34.633)",
  success: PALETTE.green[400],
  "success-foreground": "oklch(0.2066 0.0257 153.463)",
  warning: PALETTE.gold[400],
  "warning-foreground": "oklch(0.2321 0.026 79.078)",
  info: PALETTE.blue[400],
  "info-foreground": "oklch(0.1961 0.0376 260.503)",
  border: "oklch(0.9851 0 90 / 0.122)",
  input: "oklch(0.9851 0 90 / 0.122)",
  ring: ACCENT.dark,
  "chart-1": PALETTE.sand[100],
  "chart-2": PALETTE.sand[600],
  "chart-3": PALETTE.gold[400],
  "chart-4": PALETTE.green[400],
  "chart-5": PALETTE.blue[400],
  sidebar: "oklch(0.1684 0 90)",
  "sidebar-foreground": PALETTE.sand[100],
  "sidebar-primary": INK.dark,
  "sidebar-primary-foreground": PALETTE.sand[1200],
  "sidebar-accent": "oklch(0.2393 0 90)",
  "sidebar-accent-foreground": PALETTE.sand[100],
  "sidebar-border": "oklch(0.9851 0 90 / 0.122)",
  "sidebar-ring": ACCENT.dark,

  // Dark glass is a dark, MORE opaque sheet rather than the canvas's 10% white
  // veil: a translucent veil over LIGHT content lifts its composite toward the
  // backdrop, and no single self-owned foreground can then hold 4.5:1 over
  // both light and dark backdrops (see scripts/glass-contrast.ts). The border
  // and tint are the canvas values.
  "glass-fill": "oklch(0.2136 0.032 262.44 / 0.7)",
  "glass-fill-strong": "oklch(0.2136 0.032 262.44 / 0.8)",
  "glass-fill-frost": "oklch(0.2136 0.032 262.44 / 0.9)",
  "glass-fill-solid": "oklch(0.2136 0.032 262.44)",
  "glass-border": "oklch(1 0 90 / 0.239)",
  "glass-tint": "oklch(1 0 90 / 0.059)",
  "glass-foreground": PALETTE.sand[100],
} as const satisfies Record<keyof typeof light, string>;

export const colorTokens = { light, dark };

export type ColorScheme = "light" | "dark";
export type ColorTokenName = keyof typeof light;
export type ColorTokens = typeof light;
