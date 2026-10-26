/**
 * Raw Horon primitive palette - the single encoded copy of the ramps.
 *
 * Transcribed from the pen.dev canvas `00 Tokens` board
 * (`horon-design.pen`, board `ev2sU`), which stores every step as hex. It is
 * encoded here as OKLCH because the token pipeline (`src/color.ts` ->
 * `oklchToHex`) requires OKLCH input; `test/theme-css.test.ts` pins the
 * round-trip back to the canvas hex for every step.
 *
 * Steps are named exactly as the canvas names them (`sand-100`..`sand-1200`,
 * `gold-100`..`gold-600`, `green`/`red`/`blue` at `200`/`400`/`600`/`800`).
 * The ramps are mode-independent - only the semantic layer in `tokens.ts` is
 * themed.
 */

export type Mode = "light" | "dark";

export const PALETTE = {
  sand: {
    100: "oklch(0.9851 0 90)",
    200: "oklch(0.9702 0 90)",
    300: "oklch(0.9491 0 90)",
    400: "oklch(0.9219 0 90)",
    500: "oklch(0.8699 0 90)",
    600: "oklch(0.7155 0 90)",
    700: "oklch(0.5555 0 90)",
    800: "oklch(0.4386 0 90)",
    900: "oklch(0.3715 0 90)",
    1000: "oklch(0.2686 0 90)",
    1100: "oklch(0.2046 0 90)",
    1200: "oklch(0.1448 0 90)",
  },
  gold: {
    100: "oklch(0.9805 0.0171 84.587)",
    200: "oklch(0.9453 0.0418 82.486)",
    300: "oklch(0.8818 0.0805 83.15)",
    400: "oklch(0.7994 0.1174 82.177)",
    500: "oklch(0.6906 0.1303 76.2)",
    600: "oklch(0.5251 0.1047 72.175)",
  },
  green: {
    200: "oklch(0.9695 0.0099 155.098)",
    400: "oklch(0.8612 0.0511 156.728)",
    600: "oklch(0.5827 0.1124 152.764)",
    800: "oklch(0.4272 0.0831 153.492)",
  },
  red: {
    200: "oklch(0.9607 0.0136 34.299)",
    400: "oklch(0.8468 0.0557 30.789)",
    600: "oklch(0.5587 0.1613 32.742)",
    800: "oklch(0.4087 0.1196 32.365)",
  },
  blue: {
    200: "oklch(0.9624 0.0108 256.695)",
    400: "oklch(0.8509 0.0453 255.643)",
    600: "oklch(0.5374 0.1298 258.371)",
    800: "oklch(0.3785 0.0843 257.372)",
  },
} as const;

export type PaletteName = keyof typeof PALETTE;
export type SandStep = keyof typeof PALETTE.sand;
export type GoldStep = keyof typeof PALETTE.gold;
export type StatusStep = keyof typeof PALETTE.green;

/** Ink = the extreme sand steps: near-black (light) / near-white (dark). */
export const INK = {
  light: PALETTE.sand[1200],
  dark: PALETTE.sand[100],
} as const;

/** Gold accent anchor - the canvas `ring`: gold-500 (light) / gold-400 (dark). */
export const ACCENT = {
  light: PALETTE.gold[500],
  dark: PALETTE.gold[400],
} as const;
