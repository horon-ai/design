/**
 * OS and runtime detection for Lynx.
 *
 * The same helpers, type names and shortcut syntax as `@horon-ai/react`'s
 * `lib/platform`, but the hints come from Lynx instead of a browser:
 * `SystemInfo.platform` names the engine's OS (`iOS`, `Android`, `macOS`,
 * `windows`, `Harmony`) and `lynx.__globalProps` carries what a host chose to
 * pass through (the gallery passes its own `platform` and `runtime`). There is
 * no `navigator`, so `readNavigator` keeps its react name but reads those two
 * sources.
 *
 * `Runtime` keeps react's `"web" | "desktop"` literals so a ported call site
 * type-checks unchanged: on Lynx `web` is the `@lynx-js/web-core` engine running
 * in a browser and `desktop` is any native shell (LynxExplorer, Lynxtron). A
 * mobile native shell reports `desktop` too, because the union has no third
 * member; use {@link detectOs} when the platform itself matters.
 */

/** The operating systems the shortcut helpers know; `unknown` is what an empty hint reports. */
export type Os = "macos" | "windows" | "linux" | "ios" | "android" | "unknown";

/** Where the code runs: `web` in the browser engine, `desktop` in a native shell. */
export type Runtime = "web" | "desktop";

/** The hints that identify the OS; plain data so detection stays testable. */
export type PlatformInput = {
  /** `SystemInfo.platform`: `Android`, `iOS`, `Harmony`, `macOS`, `windows`, `pc` or `web`. */
  platform?: string;
  /** `lynx.__globalProps.platform`, when a host passes a more specific OS name. */
  hostPlatform?: string;
  /** `lynx.__globalProps.os`, an explicit override for hosts that know better. */
  hostOs?: string;
  /** `lynx.__globalProps.runtime`: `lynx-web` for the browser engine, anything else native. */
  runtime?: string;
  /** `SystemInfo.pixelWidth`, kept so a caller can hand the whole payload in. */
  pixelWidth?: number;
};

/** The parts of the host a runtime check reads; plain data for the same reason. */
export type RuntimeWindow = {
  /** `SystemInfo.platform`. */
  platform?: string;
  /** `lynx.__globalProps.runtime`. */
  runtime?: string;
};

/** The parts of a keyboard event a shortcut reads. */
export type ShortcutEvent = {
  /** The key value, for example `k`, `Enter` or `ArrowUp`. */
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

const globalProps = () => (typeof lynx === "undefined" ? {} : (lynx.__globalProps ?? {}));

const systemPlatform = (): string | undefined => {
  if (typeof SystemInfo === "undefined") return undefined;
  return SystemInfo.platform;
};

/**
 * Reads the platform hints from Lynx. A missing `SystemInfo` (a plain Bun test)
 * yields an empty object, so {@link detectOs} falls through to `unknown` instead
 * of throwing.
 *
 * @returns The hints as {@link PlatformInput}; fields the host does not expose stay `undefined`.
 */
export function readNavigator(): PlatformInput {
  const props = globalProps();
  const platform = systemPlatform();
  return {
    platform,
    hostPlatform: props.platform,
    hostOs: props.os,
    runtime: props.runtime,
    pixelWidth: typeof SystemInfo === "undefined" ? undefined : SystemInfo.pixelWidth,
  };
}

const OS_HINTS = ["hostOs", "hostPlatform", "platform"] as const;

/** Classifies one hint string; `undefined` when the hint names no OS we know. */
const osFromHint = (hint: string): Os | undefined => {
  if (hint.includes("android")) return "android";
  if (hint.includes("iphone") || hint.includes("ipad") || hint.includes("ipod") || hint.includes("ios")) return "ios";
  if (hint.includes("mac")) return "macos";
  if (hint.includes("win")) return "windows";
  if (hint.includes("linux") || hint.includes("x11") || hint.includes("cros") || hint.includes("bsd")) return "linux";
  // HarmonyOS is neither Android nor any OS in this union; report unknown rather
  // than guess, so a shortcut draws the neutral labels.
  return undefined;
};

/**
 * Finds the OS from the first hint that names one: an explicit
 * `__globalProps.os`, then `__globalProps.platform`, then `SystemInfo.platform`.
 * Empty input is `unknown`, which the shortcuts treat as the macOS/⌘ rendering.
 *
 * @param input - The hints to read, usually from {@link readNavigator}; omitted means empty. @default {}
 * @returns The first `Os` a hint names, or `unknown` when none does.
 */
export function detectOs(input: PlatformInput = {}): Os {
  for (const field of OS_HINTS) {
    const hint = (input[field] ?? "").trim().toLowerCase();
    if (!hint) continue;
    const os = osFromHint(hint);
    if (os) return os;
  }
  return "unknown";
}

/**
 * `web` in the `@lynx-js/web-core` browser engine, `desktop` in any native shell.
 *
 * The explicit `runtime` hint wins, then `SystemInfo.platform === "web"`, which
 * is what web-core reports. A native host that names neither is `desktop`,
 * because a Lynx bundle that is not running in the browser engine is embedded in
 * an app.
 *
 * @param win - The hints to inspect, usually {@link readNavigator}; `null` or omitted reports `web`. @default null
 * @returns `web` for the browser engine, `desktop` otherwise.
 */
export function detectRuntime(win: RuntimeWindow | null = null): Runtime {
  if (!win) return "web";
  const runtime = (win.runtime ?? "").trim().toLowerCase();
  if (runtime) return runtime === "lynx-web" || runtime === "web" ? "web" : "desktop";
  return (win.platform ?? "").trim().toLowerCase() === "web" ? "web" : "desktop";
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
 * @param keys - Shortcut string such as `Mod+Shift+Enter`.
 * @param os - The OS to draw for; `unknown` draws the Mac symbols, the neutral default.
 * @returns The label to render, for example `⌘⇧↵` or `Ctrl+Shift+Enter`.
 */
export function formatShortcut(keys: string, os: Os): string {
  const parts = keys
    .split("+")
    .map((part) => part.trim())
    .filter(Boolean);
  if (parts.length === 0) return "";
  const mac = os === "macos" || os === "ios" || os === "unknown";
  const labels = mac ? MAC_LABELS : OTHER_LABELS;
  return parts.map((part) => labels[part.toLowerCase()] ?? part).join(mac ? "" : "+");
}

/** Which physical key carries `Mod` for an OS; `either` is the unknown case. */
const modifierSlot = (os: Os): "meta" | "ctrl" | "either" => {
  if (os === "macos" || os === "ios") return "meta";
  if (os === "windows" || os === "linux" || os === "android") return "ctrl";
  return "either";
};

/**
 * True when the platform's `Mod` key is down; the other side's key is not `Mod`.
 *
 * @param event - The keyboard event or anything shaped like {@link ShortcutEvent}.
 * @param os - The OS whose `Mod` to test, usually from {@link detectOs}.
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

const canonicalKey = (value: string): string => {
  const lower = value.trim().toLowerCase();
  return KEY_ALIASES[lower] ?? lower;
};

/**
 * Tests a keyboard event against a shortcut string such as `Mod+K` or
 * `Mod+Shift+Enter`. `Mod` is the platform key (⌘ on macOS/iOS, Ctrl elsewhere,
 * either one when the OS is unknown).
 *
 * @param event - The keydown event or anything shaped like {@link ShortcutEvent}.
 * @param keys - Shortcut string, with `mod` standing for the platform key.
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
