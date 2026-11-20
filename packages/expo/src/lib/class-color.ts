import { primitives } from "@horon-ai/tokens";

import type { ColorToken, HoronTheme } from "../provider";

/** True when the class suffix names a semantic colour token of the active scheme. */
const isColorToken = (name: string, colors: HoronTheme["colors"]): name is ColorToken => name in colors;

/** True when the class suffix names a raw ramp primitive. */
const isPrimitive = (name: string): name is keyof typeof primitives => name in primitives;

/**
 * Resolves a react background class such as `bg-sky-500` or `bg-interactive-primary`
 * against the token palette, so a `tileClassName` or `dotClassName` written for
 * the web keeps its colour in React Native. Anything else falls back to
 * `fallback`.
 */
export function fillFromClass(theme: HoronTheme, backgroundClass: string | undefined, fallback: ColorToken): string {
  const match = backgroundClass ? /^bg-([a-z0-9-]+)$/.exec(backgroundClass.trim()) : null;
  if (match) {
    if (isColorToken(match[1], theme.colors)) return theme.color(match[1]);
    if (isPrimitive(match[1])) return primitives[match[1]];
  }
  return theme.color(fallback);
}
