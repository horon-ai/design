/**
 * Spacing and corner radius, read from the Horon Figma file (Scale collection)
 * as the Components board `54:81` resolves them. Values are pixels.
 */

export const spacing = {
  "0.5": 2,
  "1": 4,
  "1.5": 6,
  "2": 8,
  "2.5": 10,
  "3": 12,
  "3.5": 14,
  "4": 16,
  "5": 20,
  "6": 24,
  "8": 32,
} as const;

export const radius = {
  none: 0,
  xs: 6,
  sm: 8,
  md: 12,
  lg: 14,
  xl: 20,
  full: 9999,
} as const;

/**
 * Drop shadows read from Figma effects: `popover` on the solid Account and
 * Workspace menus (88:495), `palette` on the Command palette (110:676).
 */
export const shadow = {
  popover: "0 8px 24px 0 rgba(10, 13, 15, 0.1)",
  palette: "0 16px 40px 0 rgba(10, 13, 15, 0.12)",
} as const;
