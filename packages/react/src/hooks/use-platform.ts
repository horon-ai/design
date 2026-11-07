import { useSyncExternalStore } from "react";

import { detectOs, detectRuntime, readNavigator, type Os, type Runtime } from "../lib/platform";

export type ModKey = "meta" | "ctrl";

export type Platform = {
  os: Os;
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

/** The current OS, browser or desktop shell, and the key that means `Mod`. */
export function usePlatform(): Platform {
  return useSyncExternalStore(subscribe, readPlatform, () => SERVER_PLATFORM);
}
