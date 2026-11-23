/**
 * Icon stroke tokens on a 24px design grid.
 *
 * Line icons draw at 1.3px at rest and 1.8px when active or selected (~26%
 * lighter than the legacy 1.75 / 2.4 pair). Phosphor icons ship filled outlines
 * at fixed weights instead of dynamic strokes: `light` (12/256 ≈ 1.125/24, -25%
 * from `regular`) matches the resting stroke, and `regular` (16/256 = 1.5/24)
 * matches the active emphasis. Both maintain >= 3:1 non-text contrast at 16,
 * 20 and 24px across light and dark schemes.
 */
export const icon = {
  grid: 24,
  strokeWidth: {
    default: 1.3,
    active: 1.8,
  },
  phosphorWeight: {
    default: "light",
    active: "regular",
  },
} as const;
