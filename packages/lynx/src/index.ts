/**
 * Horon Design System for ReactLynx.
 *
 * The same 84 components as `@horon-ai/react`, with the same slugs, the same
 * export names, the same variant literals and the same `@horon-ai/tokens`
 * values, re-implemented with Lynx elements instead of DOM elements. Design
 * tokens arrive as the Tailwind v3 class names react uses (`text-label-md`,
 * `bg-glass-regular`, `rounded-xl`), so a ported component keeps its class list.
 *
 * Import everything from the barrel, or one component from its subpath:
 *
 * - `import { Button, Card, Input } from "@horon-ai/lynx"` re-exports every component.
 * - `import { Button } from "@horon-ai/lynx/components/button"` resolves through the
 *   `./components/*` export map, which keeps a bundle to the components it uses.
 * - `import "@horon-ai/lynx/globals.css"` brings in the tokens and the motion, glass and
 *   veil utilities; `src/styles/tokens.css` alone is the variable layer.
 * - `import preset from "@horon-ai/lynx/tailwind-preset"` adds the token utilities to a
 *   Tailwind v3 config, beside `@lynx-js/tailwind-preset`.
 *
 * Wrap the tree in `HoronProvider` for the palette and the platform type board, then
 * read `useHoronTheme()` anywhere below it.
 *
 * @packageDocumentation
 */
export * from "./components/liquid-glass";
export * from "./hooks";
export { HoronProvider, useHoronTheme, type ColorScheme, type ColorToken, type HoronProviderProps, type HoronTheme, type ThemePlatform } from "./provider";
export { Icon, PHOSPHOR, iconNames, useIconColor, type IconColor, type IconName, type IconProps, type IconWeight } from "./icons";
export { cn, type ClassValue } from "./lib/cn";
export { evaluateMediaQuery, readViewport, type MediaSnapshot } from "./lib/media";
export {
  detectOs,
  detectRuntime,
  formatShortcut,
  isModKey,
  matchesShortcut,
  readNavigator,
  type Os,
  type PlatformInput,
  type Runtime,
  type RuntimeWindow,
  type ShortcutEvent,
} from "./lib/platform";
export type { ControlSize } from "./lib/size";
