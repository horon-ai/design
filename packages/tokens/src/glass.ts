/**
 * Liquid glass layer recipe, read from the Figma Components board (layer group
 * `Liquid layers` on Button 55:339, Icon button 57:167, Input 58:126, Textarea
 * 58:137, Banner 62:318, Toast 62:307 and others).
 *
 * The whole `Glass` group sits under a 50% alpha mask, so every layer is drawn
 * at `layerOpacity`. Figma scales the edge blurs and the inner shade inset with
 * the host height H (px), which these rules reproduce for every host measured
 * on the board (32, 40, 48, 52, 74, 76, 112, 120):
 *
 * - dark edge blur = min(4, 4H / 84)
 * - light edge blur = clamp(0.75, 1.5H / 84, 1.5)
 * - inner shade inset = min(H / 14, 6) vertically, min(H / 14, 5) horizontally
 */

export const glass = {
  layerOpacity: 0.5,
  tint: { color: "rgba(84, 84, 84, 0.1)", blur: 45 },
  innerShade: { color: "rgba(0, 0, 0, 0.1)", blur: 4, insetPerPx: 1 / 14, maxInsetY: 6, maxInsetX: 5 },
  edgeDark: { color: "rgba(0, 0, 0, 0.8)", blurPerPx: 4 / 84, maxBlur: 4 },
  edgeLight: { color: "rgba(255, 255, 255, 0.8)", blurPerPx: 1.5 / 84, minBlur: 0.75, maxBlur: 1.5 },
  edgeLightSoft: { color: "rgba(255, 255, 255, 0.2)" },
} as const;
