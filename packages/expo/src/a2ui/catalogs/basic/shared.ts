import { spacing } from "@horon-ai/tokens";
import { createContext } from "react";
import type { ViewStyle } from "react-native";

import type { ColorToken, TextStyleName } from "../../../provider";

/**
 * Type and colour a control hands the content it labels: a `Text` or `Icon` inside a `Button` takes
 * the button's label token instead of its own body style.
 */
export type ContentTone = { variant: TextStyleName; tone: ColorToken };

export const ContentToneContext = createContext<ContentTone | undefined>(undefined);

/** A resolved string prop, or `fallback` when it is missing or not text. */
export function text(value: unknown, fallback = ""): string {
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  return fallback;
}

/** A resolved finite number prop, or `fallback`. */
export function finite(value: unknown, fallback: number): number {
  const number = typeof value === "number" ? value : Number(value);
  return Number.isFinite(number) ? number : fallback;
}

/** The gap between the children of a Row, Column or List (the reference renderer's 8px). */
export const LAYOUT_GAP = spacing["2"];

export const JUSTIFY: Record<string, ViewStyle["justifyContent"]> = {
  start: "flex-start",
  center: "center",
  end: "flex-end",
  spaceBetween: "space-between",
  spaceAround: "space-around",
  spaceEvenly: "space-evenly",
  // `stretch` grows every child along the main axis; children take it through `flexGrow`.
  stretch: "flex-start",
};

export const ALIGN: Record<string, ViewStyle["alignItems"]> = {
  start: "flex-start",
  center: "center",
  end: "flex-end",
  stretch: "stretch",
};
