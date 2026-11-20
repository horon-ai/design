import { useColorScheme as useSystemColorScheme } from "react-native";

import type { ColorScheme } from "../provider";

export type { ColorScheme };

/**
 * The active color scheme, read from React Native's `useColorScheme()`.
 *
 * React Native reports the OS appearance (`Appearance`), which is the only
 * source a native app has: there is no `<html>` class to watch. A host that
 * wants an explicit switch passes the `scheme` prop to `HoronProvider`; that
 * shows in `useHoronTheme().scheme`, while this hook keeps reporting the OS
 * appearance, the same split react draws between the class and the provider.
 *
 * `null` and `undefined` (no reported appearance, or a web host before the
 * browser answers) report `light`, react's server default.
 *
 * @returns `dark` while the OS paints the dark palette, `light` otherwise.
 *
 * @example
 * ```tsx
 * import { useColorScheme } from "@horon-ai/expo";
 *
 * function ThemeLabel() {
 *   return <HoronText>{useColorScheme()}</HoronText>;
 * }
 * ```
 */
export function useColorScheme(): ColorScheme {
  return useSystemColorScheme() === "dark" ? "dark" : "light";
}
