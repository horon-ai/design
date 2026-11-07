import { useSyncExternalStore } from "react";

import { detectOs, detectRuntime, readNavigator, type Os, type Runtime } from "../lib/platform";

/** Which physical key carries `Mod` on this OS: `meta` is ⌘, `ctrl` is Ctrl. */
export type ModKey = "meta" | "ctrl";

/** What {@link usePlatform} reports: the OS, the shell the page runs in and the key behind `Mod`. */
export type Platform = {
  /** The detected OS, `unknown` on the server and when no hint names one. */
  os: Os;
  /** `desktop` inside the Tauri shell or Electron, `web` everywhere else including the server. */
  runtime: Runtime;
  /** The physical key behind `Mod` on this OS, ready for a keydown check. */
  modKey: ModKey;
};

const noop = () => {};

/** What a server render and the first hydration pass assume. */
const SERVER_PLATFORM: Platform = { os: "unknown", runtime: "web", modKey: "meta" };

/**
 * The OS and shell do not change while a tab is open, so the platform is read
 * once and every later render reuses the same object.
 */
let clientPlatform: Platform | null = null;

function readPlatform(): Platform {
  if (typeof window === "undefined") return SERVER_PLATFORM;
  if (clientPlatform) return clientPlatform;
  const os = detectOs(readNavigator());
  const modKey: ModKey = os === "windows" || os === "linux" || os === "android" ? "ctrl" : "meta";
  clientPlatform = { os, runtime: detectRuntime(window), modKey };
  return clientPlatform;
}

const subscribe = (_onChange: () => void) => noop;

/**
 * The current OS, browser or desktop shell, and the key that means `Mod`.
 *
 * The value is read from `navigator` and `window` and cached for the life of the page: there is no store to
 * subscribe to, so the hook never re-renders on its own. A server render and the first hydration pass get
 * `{ os: "unknown", runtime: "web", modKey: "meta" }`, which draws the Mac keys; on the client the first render
 * already reports the detected platform.
 *
 * @returns The current {@link Platform}: `os`, `runtime` and `modKey`.
 *
 * @example
 * ```tsx
 * import { isModKey, usePlatform } from "@horon-ai/react";
 *
 * function Composer({ onStart }: { onStart: () => void }) {
 *   const { os } = usePlatform();
 *   return (
 *     <textarea
 *       onKeyDown={(event) => {
 *         if (event.key === "Enter" && isModKey(event, os)) onStart();
 *       }}
 *     />
 *   );
 * }
 * ```
 */
export function usePlatform(): Platform {
  return useSyncExternalStore(subscribe, readPlatform, () => SERVER_PLATFORM);
}
