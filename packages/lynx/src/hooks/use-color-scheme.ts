import { useHoronTheme, type ColorScheme } from "../provider";

/**
 * The active color scheme.
 *
 * Lynx has no `<html>` to watch and no `MutationObserver`, so the source is the
 * {@link HoronProvider} the tree is rendered in — the `scheme` prop, or the
 * host's `globalProps.scheme` when it was `"system"`. That means the hook
 * re-renders with the provider instead of observing a class change, and
 * `prefers-color-scheme` is never consulted (the same deliberate choice react
 * makes: the theme is an explicit switch, not an OS follow).
 *
 * @returns `dark` while the root paints the dark palette, `light` otherwise.
 *
 * @example
 * ```tsx
 * import { useColorScheme } from "@horon-ai/lynx";
 *
 * function ThemeLabel() {
 *   const scheme = useColorScheme();
 *   return <text className="text-label-md text-text-primary">{scheme}</text>;
 * }
 * ```
 */
export function useColorScheme(): ColorScheme {
  return useHoronTheme().scheme;
}
