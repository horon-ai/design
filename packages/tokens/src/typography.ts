/**
 * Type tokens from the Figma Typography board (`26:2`, Type collection with
 * Web / Desktop / Mobile modes). Sizes and line heights are pixels per
 * platform; tracking and paragraph spacing are em, as the board states them
 * ("Bigger text, tighter tracking"; body paragraphs get 0.75em after them).
 */

export const fontFamily = {
  sans: ["Pretendard Variable", "Pretendard", "system-ui", "sans-serif"],
  mono: ["Geist Mono Variable", "Geist Mono", "ui-monospace", "monospace"],
} as const;

/** The four product weights: "Regular, Medium, SemiBold, Bold. No Thin or Light in the product." */
export const fontWeight = {
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
} as const;

export const platforms = ["web", "desktop", "mobile"] as const;
export type Platform = (typeof platforms)[number];

export type TextStyle = {
  family: keyof typeof fontFamily;
  weight: keyof typeof fontWeight;
  /** Letter spacing in em. */
  tracking: number;
  /** Space after a paragraph in em, body styles only. */
  paragraph?: number;
  size: Record<Platform, number>;
  lineHeight: Record<Platform, number>;
};

/** The thirteen styles. "No one-off sizes. If a size is missing, add a token for every platform at once." */
export const textStyles = {
  "display-lg": {
    family: "sans",
    weight: "bold",
    tracking: -0.03,
    size: { web: 56, desktop: 48, mobile: 36 },
    lineHeight: { web: 68, desktop: 58, mobile: 44 },
  },
  "display-md": {
    family: "sans",
    weight: "bold",
    tracking: -0.025,
    size: { web: 44, desktop: 40, mobile: 30 },
    lineHeight: { web: 52, desktop: 48, mobile: 36 },
  },
  "title-lg": {
    family: "sans",
    weight: "semibold",
    tracking: -0.02,
    size: { web: 32, desktop: 28, mobile: 24 },
    lineHeight: { web: 40, desktop: 36, mobile: 32 },
  },
  "title-md": {
    family: "sans",
    weight: "semibold",
    tracking: -0.015,
    size: { web: 24, desktop: 22, mobile: 20 },
    lineHeight: { web: 32, desktop: 28, mobile: 28 },
  },
  "title-sm": {
    family: "sans",
    weight: "semibold",
    tracking: -0.01,
    size: { web: 20, desktop: 18, mobile: 18 },
    lineHeight: { web: 28, desktop: 26, mobile: 26 },
  },
  "body-lg": {
    family: "sans",
    weight: "regular",
    tracking: -0.008,
    paragraph: 0.75,
    size: { web: 18, desktop: 16, mobile: 17 },
    lineHeight: { web: 30, desktop: 26, mobile: 28 },
  },
  "body-md": {
    family: "sans",
    weight: "regular",
    tracking: -0.005,
    paragraph: 0.75,
    size: { web: 16, desktop: 14, mobile: 16 },
    lineHeight: { web: 26, desktop: 22, mobile: 26 },
  },
  "body-sm": {
    family: "sans",
    weight: "regular",
    tracking: -0.002,
    paragraph: 0.75,
    size: { web: 14, desktop: 13, mobile: 14 },
    lineHeight: { web: 22, desktop: 20, mobile: 22 },
  },
  "label-lg": {
    family: "sans",
    weight: "medium",
    tracking: -0.005,
    size: { web: 16, desktop: 14, mobile: 16 },
    lineHeight: { web: 22, desktop: 20, mobile: 22 },
  },
  "label-md": {
    family: "sans",
    weight: "medium",
    tracking: -0.003,
    size: { web: 14, desktop: 13, mobile: 14 },
    lineHeight: { web: 20, desktop: 18, mobile: 20 },
  },
  "label-sm": {
    family: "sans",
    weight: "medium",
    tracking: 0.0,
    size: { web: 12, desktop: 11, mobile: 12 },
    lineHeight: { web: 16, desktop: 16, mobile: 16 },
  },
  caption: {
    family: "sans",
    weight: "regular",
    tracking: 0.005,
    size: { web: 12, desktop: 11, mobile: 12 },
    lineHeight: { web: 18, desktop: 18, mobile: 18 },
  },
  code: {
    family: "mono",
    weight: "regular",
    tracking: 0.0,
    size: { web: 14, desktop: 13, mobile: 13 },
    lineHeight: { web: 22, desktop: 20, mobile: 20 },
  },
} as const satisfies Record<string, TextStyle>;
