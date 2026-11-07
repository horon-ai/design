import { useMemo } from "@lynx-js/react";

import { detectOs, detectRuntime, readNavigator, type Os, type Runtime } from "../lib/platform";

/** Which physical key carries `Mod` on this OS: `meta` is ⌘, `ctrl` is Ctrl. */
export type ModKey = "meta" | "ctrl";

/** What {@link usePlatform} reports: the OS, the shell the bundle runs in and the key behind `Mod`. */
export type Platform = {
  /** The detected OS, `unknown` when no hint names one. */
  os: Os;
  /** `web` in the browser engine, `desktop` in a native shell. */
  runtime: Runtime;
  /** The physical key behind `Mod` on this OS, ready for a keydown check. */
  modKey: ModKey;
};

/**
 * The current OS, browser engine or native shell, and the key that means `Mod`.
 *
 * Unlike react, nothing is read from `navigator` or `window`: the OS comes from
 * `SystemInfo.platform` and the runtime from `SystemInfo.platform === "web"` or
 * the host's `__globalProps.runtime`. Both are fixed for the life of the page, so
 * the value is computed once per render from a memo and never subscribes to a
 * change.
 *
 * @returns The current {@link Platform}: `os`, `runtime` and `modKey`.
 *
 * @example
 * ```tsx
 * import { isModKey, usePlatform } from "@horon-ai/lynx";
 *
 * function Composer({ onStart }: { onStart: () => void }) {
 *   const { os } = usePlatform();
 *   return <Kbd keys="Mod+Enter" onTap={onStart} />;
 * }
 * ```
 */
export function usePlatform(): Platform {
  return useMemo(() => {
    const hints = readNavigator();
    const os = detectOs(hints);
    const modKey: ModKey = os === "windows" || os === "linux" || os === "android" ? "ctrl" : "meta";
    return { os, runtime: detectRuntime(hints), modKey };
  }, []);
}
