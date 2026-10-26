import { lightColors, primitives, radius, shadow, textStyles } from "@horon-ai/tokens";
import { extendTailwindMerge } from "tailwind-merge";

export type ClassValue = string | false | null | undefined;

/**
 * tailwind-merge that knows the Horon theme, so `text-label-md` (font size) and
 * `text-text-primary` (color) are not mistaken for each other, and a caller's
 * `w-full` or `rounded-full` replaces the component default instead of fighting it.
 */
const merge = extendTailwindMerge({
  extend: {
    theme: {
      color: [...Object.keys(lightColors), ...Object.keys(primitives)],
      text: Object.keys(textStyles),
      radius: Object.keys(radius),
      shadow: Object.keys(shadow),
    },
  },
});

/** Joins class names, skipping empty values; later classes win over conflicting earlier ones. */
export function cn(...values: ClassValue[]): string {
  return merge(values.filter(Boolean).join(" "));
}
