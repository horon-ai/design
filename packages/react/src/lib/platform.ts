export type Os = "macos" | "windows" | "linux" | "ios" | "android" | "unknown";

export type Runtime = "web" | "desktop";

/** The parts of `navigator` that identify the OS; plain data so detection stays testable. */
export type PlatformInput = {
  userAgent?: string;
  platform?: string;
  uaPlatform?: string;
  maxTouchPoints?: number;
};

/** The parts of `window` that tell a page from the desktop shell; plain data for the same reason. */
export type RuntimeWindow = {
  __TAURI_INTERNALS__?: unknown;
  navigator?: { userAgent?: string };
};

/** The parts of a keyboard event a shortcut reads; `KeyboardEvent` satisfies it as-is. */
export type ShortcutEvent = {
  key?: string;
  metaKey?: boolean;
  ctrlKey?: boolean;
  altKey?: boolean;
  shiftKey?: boolean;
};

/**
 * Reads the platform hints from the live `navigator`. `userAgentData` is not in
 * the DOM typings yet, so the shape is spelled out here instead of cast away.
 */
export function readNavigator(): PlatformInput {
  if (typeof navigator === "undefined") return {};
  const nav = navigator as {
    userAgent?: string;
    platform?: string;
    maxTouchPoints?: number;
    userAgentData?: { platform?: string };
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

/** `desktop` for the Tauri shell and Electron; `web` everywhere else, including the server. */
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

/** True when the platform's `Mod` key is down; the other side's key is not `Mod`. */
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
