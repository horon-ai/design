import { lightColors, primitives, radius, shadow, textStyles } from "@horon-ai/tokens";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * One class-name argument accepted by {@link cn}: a class string, or a falsy value that is skipped.
 * `false`, `null` and `undefined` are common when a class is applied conditionally.
 */
export type ClassValue = string | false | null | undefined;

const textNames = Object.keys(textStyles);

/**
 * tailwind-merge that knows the Horon theme, so `text-label-md` (font size) and
 * `text-text-primary` (color) are not mistaken for each other, and a caller's
 * `w-full` or `rounded-full` replaces the component default instead of fighting it.
 *
 * tailwind-merge v2 keys font sizes under the `font-size` class group rather than
 * a `text` theme scale (v3 introduced the `text` scale), so the sizes go through
 * `classGroups`; colours, radii and shadows stay on the theme maps.
 */
const merge = extendTailwindMerge({
  extend: {
    theme: {
      colors: [...Object.keys(lightColors), ...Object.keys(primitives)],
      borderRadius: Object.keys(radius),
    },
    classGroups: {
      "font-size": [{ text: textNames }],
      shadow: [{ shadow: Object.keys(shadow) }],
    },
  },
});

/**
 * Joins class names, skipping empty values; later classes win over conflicting earlier ones.
 *
 * Use it in every component so a caller's class overrides the component default instead of
 * duplicating it; the merge is extended with the Horon token names.
 *
 * @param values - Any number of class strings or falsy values, applied left to right.
 * @returns One space-separated class string with conflicting utilities collapsed.
 */
export function cn(...values: ClassValue[]): string {
  return merge(values.filter(Boolean).join(" "));
}
