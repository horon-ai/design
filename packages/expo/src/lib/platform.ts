/**
 * OS and runtime detection for React Native.
 *
 * The same helpers, type names and shortcut syntax as `@horon-ai/react`'s
 * `lib/platform`, with the same pure functions, but the hints come from React
 * Native instead of the browser: {@link readNavigator} reads `Platform.OS`
 * (`ios`, `android`, `macos`, `windows`) and, on react-native-web, the real
 * `navigator` when it carries a user agent. Native React Native installs a
 * `navigator` of its own that names no OS, so the `Platform.OS` hint is what a
 * phone or tablet reports.
 *
 * `Runtime` keeps react's `"web" | "desktop"` literals so a ported call site
 * type-checks unchanged: `web` is react-native-web and `desktop` is the app
 * shell on any native platform.
 */
import { Platform } from "react-native";

/** The operating systems the shortcut helpers know; `unknown` is what an empty hint reports. */
export type Os = "macos" | "windows" | "linux" | "ios" | "android" | "unknown";

/** Where the code runs: `web` for react-native-web, `desktop` for a native app shell. */
export type Runtime = "web" | "desktop";

/** The parts of `navigator` that identify the OS; plain data so detection stays testable. */
export type PlatformInput = {
  /** Full user agent string, the last and coarsest hint. */
  userAgent?: string;
  /** `navigator.platform`, or the hint derived from `Platform.OS` on native. */
  platform?: string;
  /** `navigator.userAgentData.platform`, the first hint when the browser exposes it. */
  uaPlatform?: string;
  /** Touch points, which is what separates iPadOS (a Mac hint) from a Mac in a browser. */
  maxTouchPoints?: number;
};

/** The parts of `window` that tell a page from the desktop shell; plain data for the same reason. */
export type RuntimeWindow = {
  /** Set by Tauri in the desktop shell. */
  __TAURI_INTERNALS__?: unknown;
  /** `window.navigator`, read for the Electron fragment in its user agent. */
  navigator?: {
    /** User agent string, tested for `electron`. */
    userAgent?: string;
  };
};

/** The parts of a keyboard event a shortcut reads; the DOM event and a React Native key event both satisfy it. */
export type ShortcutEvent = {
  /** `KeyboardEvent.key`, for example `k`, `Enter` or `ArrowUp`. */
  key?: string;
  /** ⌘ on macOS and iOS. */
  metaKey?: boolean;
  /** Ctrl on Windows, Linux and Android. */
  ctrlKey?: boolean;
  /** ⌥ or Alt. */
  altKey?: boolean;
  /** ⇧ or Shift. */
  shiftKey?: boolean;
};

/** The OS hint `Platform.OS` names; `web` is left out because the browser hints are read first there. */
const NATIVE_HINTS: Record<string, string | undefined> = {
  ios: "ios",
  android: "android",
  macos: "macos",
  windows: "windows",
};

/**
 * Reads the browser hints when a real browser `navigator` is present.
 *
 * React Native installs a `navigator` global of its own (`product:
 * "ReactNative"`) that carries no user agent, so the absence of `userAgent` is
 * what separates a browser, including react-native-web, from a native app.
 *
 * @returns The four hints as {@link PlatformInput}, or `undefined` when no browser navigator exists.
 */
function readBrowserHints(): PlatformInput | undefined {
  if (typeof navigator === "undefined") return undefined;
  const nav = navigator as {
    /** Full user agent string. */
    userAgent?: string;
    /** `navigator.platform`, such as `MacIntel`. */
    platform?: string;
    /** Number of touch points, which tells iPadOS from a Mac in a browser. */
    maxTouchPoints?: number;
    /** Chromium's hint object, absent in Safari and Firefox. */
    userAgentData?: {
      /** The OS hint, such as `macOS` or `Windows`. */
      platform?: string;
    };
  };
  if (!nav.userAgent) return undefined;
  return {
    userAgent: nav.userAgent,
    platform: nav.platform,
    uaPlatform: nav.userAgentData?.platform,
    maxTouchPoints: nav.maxTouchPoints,
  };
}

/**
 * Reads the platform hints from the host. On react-native-web the real
 * `navigator` is copied out exactly as react does; on every native board
 * `Platform.OS` becomes the `platform` hint (`ios`, `android`, `macos`,
 * `windows`).
 *
 * A hintless host yields an empty object, so {@link detectOs} falls through to
 * `unknown` instead of throwing.
 *
 * @returns The hints as {@link PlatformInput}; fields the host does not expose stay `undefined`.
 */
export function readNavigator(): PlatformInput {
  // The web board has a real browser navigator, whose hints are more precise than `"web"` alone
  // (Linux, ChromeOS, iPadOS touch points). Every native board is named by `Platform.OS`, because
  // React Native installs a `navigator` without a user agent of its own.
  if (Platform.OS === "web") return readBrowserHints() ?? {};
  const hint = NATIVE_HINTS[Platform.OS];
  return hint === undefined ? {} : { platform: hint };
}

const OS_HINTS = ["uaPlatform", "platform", "userAgent"] as const;

/** Classifies one hint string; `undefined` when the hint names no OS we know. */
function osFromHint(hint: string, maxTouchPoints: number): Os | undefined {
  if (hint.includes("android")) return "android";
  if (hint.includes("iphone") || hint.includes("ipad") || hint.includes("ipod") || hint.includes("ios")) return "ios";
  // iPadOS reports a Mac platform and user agent, so touch points are what separate it from a Mac.
  if (hint.includes("mac")) return maxTouchPoints > 1 ? "ios" : "macos";
  if (hint.includes("win")) return "windows";
  if (hint.includes("linux") || hint.includes("x11") || hint.includes("cros") || hint.includes("bsd")) return "linux";
  return undefined;
}

/**
 * Finds the OS from the first hint that names one: `userAgentData.platform`,
 * then `navigator.platform`, then the user agent string. Empty input is
 * `unknown`, which the shortcuts treat as the macOS/⌘ rendering.
 *
 * A hint containing `mac` is `ios` when `maxTouchPoints` is above 1, since iPadOS reports a Mac platform and
 * user agent. A hint that matches nothing is skipped, so a browser that names no known OS still reports
 * `unknown` rather than a wrong guess.
 *
 * @param input - The hints to read, usually from {@link readNavigator}; omitted means empty. @default {}
 * @returns The first `Os` a hint names, or `unknown` when none does.
 */
export function detectOs(input: PlatformInput = {}): Os {
  const maxTouchPoints = input.maxTouchPoints ?? 0;
  for (const field of OS_HINTS) {
    const hint = (input[field] ?? "").trim().toLowerCase();
    if (!hint) continue;
    const os = osFromHint(hint, maxTouchPoints);
    if (os) return os;
  }
  return "unknown";
}

/**
 * `desktop` for the Tauri shell and Electron; `web` everywhere else, including a
 * host that passes no window at all.
 *
 * The Tauri test wins over the user agent, so a shell that also advertises Electron still reports `desktop`.
 * On native React Native there is no typed `window` to pass, so the runtime is decided by the caller:
 * `usePlatform` reports `desktop` off the web board.
 *
 * @param win - The window to inspect, usually react-native-web's `window`; `null` or omitted reports `web`. @default null
 * @returns `desktop` inside either shell, `web` otherwise.
 */
export function detectRuntime(win: RuntimeWindow | null = null): Runtime {
  if (!win) return "web";
  if ("__TAURI_INTERNALS__" in win) return "desktop";
  return /electron/i.test(win.navigator?.userAgent ?? "") ? "desktop" : "web";
}

const MAC_LABELS: Record<string, string> = {
  mod: "⌘",
  shift: "⇧",
  alt: "⌥",
  enter: "↵",
  escape: "esc",
  esc: "esc",
  arrowup: "↑",
  arrowdown: "↓",
  arrowleft: "←",
  arrowright: "→",
};

const OTHER_LABELS: Record<string, string> = {
  mod: "Ctrl",
  shift: "Shift",
  alt: "Alt",
  enter: "Enter",
  escape: "Esc",
  esc: "Esc",
  arrowup: "↑",
  arrowdown: "↓",
  arrowleft: "←",
  arrowright: "→",
};

/**
 * Draws a `+`-joined shortcut for one OS: `Mod+K` is `⌘K` on macOS and iOS,
 * `Ctrl+K` on Windows and Linux. Mac families glue the parts, the rest keep `+`.
 *
 * `mod`, `shift`, `alt`, `enter`, `escape`/`esc` and the four arrows have labels; any other part is kept as
 * written, so a bare `K` stays `K`. An empty string, or one made only of `+` and spaces, returns `""`.
 *
 * @param keys - Shortcut in the same syntax `Kbd` and {@link matchesShortcut} take, such as `Mod+Shift+Enter`.
 * @param os - The OS to draw for; `unknown` draws the Mac symbols, the default when no hint names an OS.
 * @returns The label to render, for example `⌘⇧↵` or `Ctrl+Shift+Enter`.
 */
export function formatShortcut(keys: string, os: Os): string {
  const parts = keys
    .split("+")
    .map((part) => part.trim())
    .filter(Boolean);
  if (parts.length === 0) return "";
  // macOS, iOS and the unknown default draw Mac symbols; everyone else spells them out.
  const mac = os === "macos" || os === "ios" || os === "unknown";
  const labels = mac ? MAC_LABELS : OTHER_LABELS;
  return parts.map((part) => labels[part.toLowerCase()] ?? part).join(mac ? "" : "+");
}

/** Which physical key carries `Mod` for an OS; `either` is the unknown case. */
function modifierSlot(os: Os): "meta" | "ctrl" | "either" {
  if (os === "macos" || os === "ios") return "meta";
  if (os === "windows" || os === "linux" || os === "android") return "ctrl";
  return "either";
}

/**
 * True when the platform's `Mod` key is down; the other side's key is not `Mod`.
 *
 * On macOS and iOS that means `metaKey` without `ctrlKey`; on Windows, Linux and Android `ctrlKey` without
 * `metaKey`, so Ctrl+⌘ on a Mac is not `Mod`. With an `unknown` OS either key counts.
 *
 * @param event - The keyboard event or anything shaped like {@link ShortcutEvent}.
 * @param os - The OS whose `Mod` to test, usually from {@link detectOs} or `usePlatform().os`.
 * @returns Whether this event carries the platform's modifier.
 */
export function isModKey(event: ShortcutEvent, os: Os): boolean {
  const slot = modifierSlot(os);
  const meta = event.metaKey === true;
  const ctrl = event.ctrlKey === true;
  if (slot === "meta") return meta && !ctrl;
  if (slot === "ctrl") return ctrl && !meta;
  return meta || ctrl;
}

/** Modifier names that are never the final key of a shortcut. */
const MODIFIERS: Record<string, true> = { mod: true, shift: true, alt: true, ctrl: true, meta: true };

const KEY_ALIASES: Record<string, string> = { esc: "escape" };

/** Folds one key name to its comparison form; `esc` and `escape` are the same key. */
function canonicalKey(value: string): string {
  const lower = value.trim().toLowerCase();
  return KEY_ALIASES[lower] ?? lower;
}

/**
 * Tests a keyboard event against a shortcut string such as `Mod+K` or
 * `Mod+Shift+Enter`. `Mod` is the platform key (⌘ on macOS/iOS, Ctrl
 * elsewhere, either one when the OS is unknown).
 *
 * Matching is exact on the modifier set: Alt and Shift must be present or absent exactly as the shortcut says,
 * and a missing base key (a string of modifiers only) never matches. `esc` and `escape` are the same key, and
 * the comparison is case-insensitive.
 *
 * @param event - The keydown event or anything shaped like {@link ShortcutEvent}.
 * @param keys - Shortcut string, with `mod` standing for the platform key, such as `Mod+K`.
 * @param os - The OS whose `Mod` to test.
 * @returns Whether the event is exactly this shortcut on this OS.
 */
export function matchesShortcut(event: ShortcutEvent, keys: string, os: Os): boolean {
  const parts = keys
    .split("+")
    .map((part) => part.trim().toLowerCase())
    .filter(Boolean);
  const base = parts.find((part) => !MODIFIERS[part]);
  if (!base) return false;
  if ((event.altKey === true) !== parts.includes("alt")) return false;
  if ((event.shiftKey === true) !== parts.includes("shift")) return false;
  if (isModKey(event, os) !== parts.includes("mod")) return false;
  return canonicalKey(event.key ?? "") === canonicalKey(base);
}
