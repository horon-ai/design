/** The operating systems the shortcut helpers know; `unknown` is what a server render and an empty hint report. */
export type Os = "macos" | "windows" | "linux" | "ios" | "android" | "unknown";

/** Where the page runs: `desktop` inside the Tauri shell or Electron, `web` everywhere else including the server. */
export type Runtime = "web" | "desktop";

/** The parts of `navigator` that identify the OS; plain data so detection stays testable. */
export type PlatformInput = {
  /** Full user agent string, the last and coarsest hint. */
  userAgent?: string;
  /** `navigator.platform`, still the most reliable hint in Safari and Firefox. */
  platform?: string;
  /** `navigator.userAgentData.platform`, the first hint when the browser exposes it. */
  uaPlatform?: string;
  /** Touch points, which is what separates iPadOS (a Mac hint) from a Mac. */
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

/** The parts of a keyboard event a shortcut reads; `KeyboardEvent` satisfies it as-is. */
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

/**
 * Reads the platform hints from the live `navigator`. `userAgentData` is not in
 * the DOM typings yet, so the shape is spelled out here instead of cast away.
 *
 * Every field is copied out, and a missing `navigator` (a server render) yields an empty object, so
 * {@link detectOs} falls through to `unknown` instead of throwing.
 *
 * @returns The four hints as {@link PlatformInput}; fields the browser does not expose stay `undefined`.
 */
export function readNavigator(): PlatformInput {
  if (typeof navigator === "undefined") return {};
  const nav = navigator as {
    /** Full user agent string. */
    userAgent?: string;
    /** `navigator.platform`, such as `MacIntel`. */
    platform?: string;
    /** Number of touch points, which tells iPadOS from a Mac. */
    maxTouchPoints?: number;
    /** Chromium's hint object, absent in Safari and Firefox. */
    userAgentData?: {
      /** The OS hint, such as `macOS` or `Windows`. */
      platform?: string;
    };
  };
  return {
    userAgent: nav.userAgent,
    platform: nav.platform,
    uaPlatform: nav.userAgentData?.platform,
    maxTouchPoints: nav.maxTouchPoints,
  };
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
 * `desktop` for the Tauri shell and Electron; `web` everywhere else, including the server.
 *
 * The Tauri test wins over the user agent, so a shell that also advertises Electron still reports `desktop`.
 *
 * @param win - The window to inspect, usually `window`; `null` or omitted reports `web`. @default null
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
 * @param os - The OS to draw for; `unknown` draws the Mac symbols, the server default.
 * @returns The label to render, for example `⌘⇧↵` or `Ctrl+Shift+Enter`.
 */
export function formatShortcut(keys: string, os: Os): string {
  const parts = keys
    .split("+")
    .map((part) => part.trim())
    .filter(Boolean);
  if (parts.length === 0) return "";
  // macOS, iOS and the unknown server default draw Mac symbols; everyone else spells them out.
  const mac = os === "macos" || os === "ios" || os === "unknown";
  const labels = mac ? MAC_LABELS : OTHER_LABELS;
  return parts.map((part) => labels[part.toLowerCase()] ?? part).join(mac ? "" : "+");
}

/** Which physical key carries `Mod` for an OS; `either` is the server/unknown case. */
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
