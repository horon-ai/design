/**
 * Raw Horon primitive palette - the single encoded copy of the ramps.
 *
 * Every value is an OKLCH string because the token pipeline
 * (`packages/tokens/src/color.ts` -> `oklchToHex`) throws on non-OKLCH input.
 * The ramps were derived from their hex sources and encoded here as OKLCH:
 *  - sand  : the neutral monochrome backbone, read from
 *            `core/packages/tokens/src/palette.ts` (the `gray` hue, 12 solid + 6 alpha).
 *  - gold  : the single Horon accent, anchored on `#e0921f`
 *            (from `web/src/app/globals.css`), step 9 of the ramp.
 *  - status: success / warning / danger / info, muted tone.
 *
 * Ramps are 1-based when consumed through `solid`/`alpha`, exactly like the core
 * palette helpers. Do not hand-edit consumers; remap semantics in `tokens.ts`.
 */

export type Mode = "light" | "dark"

export interface Ramp {
  readonly solid: readonly string[]
  readonly alpha: readonly string[]
}

export interface PaletteRamp {
  readonly light: Ramp
  readonly dark: Ramp
}

export const PALETTE = {
  sand: {
    light: {
      solid: [
        "oklch(0.9851 0 89.876)",
        "oklch(0.9761 0 89.876)",
        "oklch(0.9642 0 89.876)",
        "oklch(0.9491 0 89.876)",
        "oklch(0.931 0 89.876)",
        "oklch(0.873 0 89.876)",
        "oklch(0.7794 0 89.876)",
        "oklch(0.6698 0 89.876)",
        "oklch(0.5693 0 89.876)",
        "oklch(0.4676 0 89.876)",
        "oklch(0.36 0 89.876)",
        "oklch(0.2686 0 89.876)",
      ],
      alpha: [
        "oklch(0.5693 0 89.876 / 0.039)",
        "oklch(0.5693 0 89.876 / 0.063)",
        "oklch(0.5693 0 89.876 / 0.09)",
        "oklch(0.5693 0 89.876 / 0.129)",
        "oklch(0.5693 0 89.876 / 0.169)",
        "oklch(0.5693 0 89.876 / 0.31)",
      ],
    },
    dark: {
      solid: [
        "oklch(0.1286 0 89.876)",
        "oklch(0.1776 0 89.876)",
        "oklch(0.1957 0 89.876)",
        "oklch(0.209 0 89.876)",
        "oklch(0.2686 0 89.876)",
        "oklch(0.3052 0 89.876)",
        "oklch(0.36 0 89.876)",
        "oklch(0.4676 0 89.876)",
        "oklch(0.5693 0 89.876)",
        "oklch(0.6698 0 89.876)",
        "oklch(0.7794 0 89.876)",
        "oklch(0.9642 0 89.876)",
      ],
      alpha: [
        "oklch(0.5693 0 89.876 / 0.059)",
        "oklch(0.5693 0 89.876 / 0.141)",
        "oklch(0.5693 0 89.876 / 0.173)",
        "oklch(0.5693 0 89.876 / 0.2)",
        "oklch(0.5693 0 89.876 / 0.322)",
        "oklch(0.5693 0 89.876 / 0.396)",
      ],
    },
  },
  gold: {
    light: {
      solid: [
        "oklch(0.986 0.006 69.638)",
        "oklch(0.976 0.012 69.638)",
        "oklch(0.967 0.018 69.638)",
        "oklch(0.953 0.027 69.638)",
        "oklch(0.939 0.038 69.638)",
        "oklch(0.89 0.07 69.638)",
        "oklch(0.82 0.115 69.638)",
        "oklch(0.772 0.145 69.638)",
        "oklch(0.7225 0.1488 69.638)",
        "oklch(0.585 0.13 69.638)",
        "oklch(0.44 0.098 69.638)",
        "oklch(0.32 0.068 69.638)",
      ],
      alpha: [
        "oklch(0.7225 0.1488 69.638 / 0.039)",
        "oklch(0.7225 0.1488 69.638 / 0.063)",
        "oklch(0.7225 0.1488 69.638 / 0.09)",
        "oklch(0.7225 0.1488 69.638 / 0.129)",
        "oklch(0.7225 0.1488 69.638 / 0.169)",
        "oklch(0.7225 0.1488 69.638 / 0.31)",
      ],
    },
    dark: {
      solid: [
        "oklch(0.14 0.03 69.638)",
        "oklch(0.2 0.048 69.638)",
        "oklch(0.222 0.055 69.638)",
        "oklch(0.24 0.06 69.638)",
        "oklch(0.32 0.098 69.638)",
        "oklch(0.37 0.112 69.638)",
        "oklch(0.44 0.13 69.638)",
        "oklch(0.585 0.13 69.638)",
        "oklch(0.7225 0.1488 69.638)",
        "oklch(0.772 0.145 69.638)",
        "oklch(0.82 0.115 69.638)",
        "oklch(0.967 0.02 69.638)",
      ],
      alpha: [
        "oklch(0.7225 0.1488 69.638 / 0.039)",
        "oklch(0.7225 0.1488 69.638 / 0.063)",
        "oklch(0.7225 0.1488 69.638 / 0.09)",
        "oklch(0.7225 0.1488 69.638 / 0.129)",
        "oklch(0.7225 0.1488 69.638 / 0.169)",
        "oklch(0.7225 0.1488 69.638 / 0.31)",
      ],
    },
  },
  success: {
    light: {
      solid: [
        "oklch(0.986 0.005 154.495)",
        "oklch(0.976 0.01 154.495)",
        "oklch(0.967 0.015 154.495)",
        "oklch(0.953 0.022 154.495)",
        "oklch(0.939 0.03 154.495)",
        "oklch(0.89 0.055 154.495)",
        "oklch(0.818 0.092 154.495)",
        "oklch(0.746 0.13 154.495)",
        "oklch(0.7 0.15 154.495)",
        "oklch(0.575 0.13 154.495)",
        "oklch(0.435 0.095 154.495)",
        "oklch(0.318 0.065 154.495)",
      ],
      alpha: [
        "oklch(0.7 0.15 154.495 / 0.039)",
        "oklch(0.7 0.15 154.495 / 0.063)",
        "oklch(0.7 0.15 154.495 / 0.09)",
        "oklch(0.7 0.15 154.495 / 0.129)",
        "oklch(0.7 0.15 154.495 / 0.169)",
        "oklch(0.7 0.15 154.495 / 0.31)",
      ],
    },
    dark: {
      solid: [
        "oklch(0.134 0.026 154.495)",
        "oklch(0.194 0.042 154.495)",
        "oklch(0.217 0.048 154.495)",
        "oklch(0.236 0.053 154.495)",
        "oklch(0.314 0.075 154.495)",
        "oklch(0.361 0.09 154.495)",
        "oklch(0.429 0.11 154.495)",
        "oklch(0.575 0.13 154.495)",
        "oklch(0.7 0.15 154.495)",
        "oklch(0.746 0.13 154.495)",
        "oklch(0.818 0.092 154.495)",
        "oklch(0.967 0.016 154.495)",
      ],
      alpha: [
        "oklch(0.7 0.15 154.495 / 0.039)",
        "oklch(0.7 0.15 154.495 / 0.063)",
        "oklch(0.7 0.15 154.495 / 0.09)",
        "oklch(0.7 0.15 154.495 / 0.129)",
        "oklch(0.7 0.15 154.495 / 0.169)",
        "oklch(0.7 0.15 154.495 / 0.31)",
      ],
    },
  },
  warning: {
    light: {
      solid: [
        "oklch(0.986 0.006 69.638)",
        "oklch(0.976 0.012 69.638)",
        "oklch(0.967 0.018 69.638)",
        "oklch(0.953 0.026 69.638)",
        "oklch(0.939 0.036 69.638)",
        "oklch(0.89 0.062 69.638)",
        "oklch(0.818 0.104 69.638)",
        "oklch(0.746 0.14 69.638)",
        "oklch(0.7 0.155 69.638)",
        "oklch(0.575 0.135 69.638)",
        "oklch(0.435 0.098 69.638)",
        "oklch(0.318 0.068 69.638)",
      ],
      alpha: [
        "oklch(0.7 0.155 69.638 / 0.039)",
        "oklch(0.7 0.155 69.638 / 0.063)",
        "oklch(0.7 0.155 69.638 / 0.09)",
        "oklch(0.7 0.155 69.638 / 0.129)",
        "oklch(0.7 0.155 69.638 / 0.169)",
        "oklch(0.7 0.155 69.638 / 0.31)",
      ],
    },
    dark: {
      solid: [
        "oklch(0.134 0.028 69.638)",
        "oklch(0.194 0.046 69.638)",
        "oklch(0.217 0.052 69.638)",
        "oklch(0.236 0.058 69.638)",
        "oklch(0.314 0.082 69.638)",
        "oklch(0.361 0.098 69.638)",
        "oklch(0.429 0.118 69.638)",
        "oklch(0.575 0.135 69.638)",
        "oklch(0.7 0.155 69.638)",
        "oklch(0.746 0.138 69.638)",
        "oklch(0.818 0.098 69.638)",
        "oklch(0.967 0.018 69.638)",
      ],
      alpha: [
        "oklch(0.7 0.155 69.638 / 0.039)",
        "oklch(0.7 0.155 69.638 / 0.063)",
        "oklch(0.7 0.155 69.638 / 0.09)",
        "oklch(0.7 0.155 69.638 / 0.129)",
        "oklch(0.7 0.155 69.638 / 0.169)",
        "oklch(0.7 0.155 69.638 / 0.31)",
      ],
    },
  },
  danger: {
    light: {
      solid: [
        "oklch(0.986 0.006 23.677)",
        "oklch(0.976 0.012 23.677)",
        "oklch(0.967 0.018 23.677)",
        "oklch(0.953 0.028 23.677)",
        "oklch(0.939 0.038 23.677)",
        "oklch(0.89 0.07 23.677)",
        "oklch(0.818 0.118 23.677)",
        "oklch(0.746 0.165 23.677)",
        "oklch(0.7 0.195 23.677)",
        "oklch(0.575 0.17 23.677)",
        "oklch(0.435 0.122 23.677)",
        "oklch(0.318 0.085 23.677)",
      ],
      alpha: [
        "oklch(0.7 0.195 23.677 / 0.039)",
        "oklch(0.7 0.195 23.677 / 0.063)",
        "oklch(0.7 0.195 23.677 / 0.09)",
        "oklch(0.7 0.195 23.677 / 0.129)",
        "oklch(0.7 0.195 23.677 / 0.169)",
        "oklch(0.7 0.195 23.677 / 0.31)",
      ],
    },
    dark: {
      solid: [
        "oklch(0.134 0.032 23.677)",
        "oklch(0.194 0.052 23.677)",
        "oklch(0.217 0.06 23.677)",
        "oklch(0.236 0.066 23.677)",
        "oklch(0.314 0.094 23.677)",
        "oklch(0.361 0.112 23.677)",
        "oklch(0.429 0.135 23.677)",
        "oklch(0.575 0.17 23.677)",
        "oklch(0.7 0.195 23.677)",
        "oklch(0.746 0.168 23.677)",
        "oklch(0.818 0.12 23.677)",
        "oklch(0.967 0.02 23.677)",
      ],
      alpha: [
        "oklch(0.7 0.195 23.677 / 0.039)",
        "oklch(0.7 0.195 23.677 / 0.063)",
        "oklch(0.7 0.195 23.677 / 0.09)",
        "oklch(0.7 0.195 23.677 / 0.129)",
        "oklch(0.7 0.195 23.677 / 0.169)",
        "oklch(0.7 0.195 23.677 / 0.31)",
      ],
    },
  },
  info: {
    light: {
      solid: [
        "oklch(0.986 0.006 255.604)",
        "oklch(0.976 0.011 255.604)",
        "oklch(0.967 0.017 255.604)",
        "oklch(0.953 0.025 255.604)",
        "oklch(0.939 0.034 255.604)",
        "oklch(0.89 0.062 255.604)",
        "oklch(0.818 0.105 255.604)",
        "oklch(0.746 0.148 255.604)",
        "oklch(0.7 0.172 255.604)",
        "oklch(0.575 0.15 255.604)",
        "oklch(0.435 0.108 255.604)",
        "oklch(0.318 0.075 255.604)",
      ],
      alpha: [
        "oklch(0.7 0.172 255.604 / 0.039)",
        "oklch(0.7 0.172 255.604 / 0.063)",
        "oklch(0.7 0.172 255.604 / 0.09)",
        "oklch(0.7 0.172 255.604 / 0.129)",
        "oklch(0.7 0.172 255.604 / 0.169)",
        "oklch(0.7 0.172 255.604 / 0.31)",
      ],
    },
    dark: {
      solid: [
        "oklch(0.134 0.028 255.604)",
        "oklch(0.194 0.046 255.604)",
        "oklch(0.217 0.052 255.604)",
        "oklch(0.236 0.058 255.604)",
        "oklch(0.314 0.082 255.604)",
        "oklch(0.361 0.098 255.604)",
        "oklch(0.429 0.118 255.604)",
        "oklch(0.575 0.15 255.604)",
        "oklch(0.7 0.172 255.604)",
        "oklch(0.746 0.148 255.604)",
        "oklch(0.818 0.106 255.604)",
        "oklch(0.967 0.018 255.604)",
      ],
      alpha: [
        "oklch(0.7 0.172 255.604 / 0.039)",
        "oklch(0.7 0.172 255.604 / 0.063)",
        "oklch(0.7 0.172 255.604 / 0.09)",
        "oklch(0.7 0.172 255.604 / 0.129)",
        "oklch(0.7 0.172 255.604 / 0.169)",
        "oklch(0.7 0.172 255.604 / 0.31)",
      ],
    },
  },
} as const satisfies Record<string, PaletteRamp>

export type PaletteName = keyof typeof PALETTE

/** 1-based lookup, mirroring `core/packages/tokens/src/palette.ts`. */
export const step = (scale: readonly string[], n: number): string =>
  scale[n - 1] ?? scale[0] ?? ""

export const solid = (ramp: PaletteName, n: number, mode: Mode): string =>
  step(PALETTE[ramp][mode].solid, n)

export const alpha = (ramp: PaletteName, n: number, mode: Mode): string =>
  step(PALETTE[ramp][mode].alpha, n)

/** Ink = the extreme end of the sand ramp: near-black (light) / near-white (dark). */
export const INK = {
  light: PALETTE.sand.light.solid[11],
  dark: PALETTE.sand.dark.solid[11],
} as const

/** Gold accent anchor (`#e0921f`): step 9 of the gold ramp. */
export const ACCENT = {
  light: PALETTE.gold.light.solid[8],
  dark: PALETTE.gold.dark.solid[8],
} as const
