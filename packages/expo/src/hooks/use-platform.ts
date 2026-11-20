import { useMemo } from "react";
import { Platform as NativePlatform } from "react-native";

import { detectOs, detectRuntime, readNavigator, type Os, type Runtime, type RuntimeWindow } from "../lib/platform";

/** Which physical key carries `Mod` on this OS: `meta` is ⌘, `ctrl` is Ctrl. */
export type ModKey = "meta" | "ctrl";

/** What {@link usePlatform} reports: the OS, the shell the app runs in and the key behind `Mod`. */
export type Platform = {
  /** The detected OS, `unknown` when `Platform.OS` names none. */
  os: Os;
  /** `web` on react-native-web, `desktop` in a native app shell. */
  runtime: Runtime;
  /** The physical key behind `Mod` on this OS, ready for a keydown check. */
  modKey: ModKey;
};

/**
 * The host object `detectRuntime` inspects on react-native-web: the browser's
 * own globals, which carry the Tauri marker and the Electron user agent. Only
 * the optional fields of {@link RuntimeWindow} are read, so `globalThis` itself
 * is the shape; on native the caller skips this and reports `desktop` directly.
 *
 * @returns The host globals as {@link RuntimeWindow}.
 */
function readWebWindow(): RuntimeWindow {
  return globalThis;
}

/**
 * The current OS, app shell or browser, and the key that means `Mod`.
 *
 * React reads `navigator` and `window`; here the OS comes from `Platform.OS`
 * (through {@link readNavigator}) and the runtime is `web` on the
 * react-native-web board and `desktop` on every native one, because the
 * `Runtime` union has no third member. Both are fixed for the life of the app,
 * so the value is computed once and never subscribes to a change.
 *
 * @returns The current {@link Platform}: `os`, `runtime` and `modKey`.
 *
 * @example
 * ```tsx
 * import { isModKey, usePlatform } from "@horon-ai/expo";
 *
 * function Composer({ onStart }: { onStart: () => void }) {
 *   const { os } = usePlatform();
 *   return <Kbd keys="Mod+Enter" onPress={onStart} />;
 * }
 * ```
 */
export function usePlatform(): Platform {
  return useMemo(() => {
    const os = detectOs(readNavigator());
    const modKey: ModKey = os === "windows" || os === "linux" || os === "android" ? "ctrl" : "meta";
    const runtime: Runtime = NativePlatform.OS === "web" ? detectRuntime(readWebWindow()) : "desktop";
    return { os, runtime, modKey };
  }, []);
}
