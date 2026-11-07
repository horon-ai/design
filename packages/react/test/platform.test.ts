import { describe, expect, test } from "bun:test";

import {
  detectOs,
  detectRuntime,
  formatShortcut,
  isModKey,
  matchesShortcut,
  type ShortcutEvent,
} from "../src/lib/platform";

const MAC_UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15";
const IPHONE_UA = "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15";
const ANDROID_UA = "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36";
const LINUX_UA = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36";
const WINDOWS_UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36";

const key = (value: string, modifiers: Partial<ShortcutEvent> = {}): ShortcutEvent => ({
  key: value,
  ...modifiers,
});

describe("detectOs", () => {
  test("reads a plain user agent", () => {
    expect(detectOs({ userAgent: WINDOWS_UA })).toBe("windows");
    expect(detectOs({ userAgent: LINUX_UA })).toBe("linux");
    expect(detectOs({ userAgent: ANDROID_UA })).toBe("android");
    expect(detectOs({ userAgent: MAC_UA })).toBe("macos");
    expect(detectOs({ userAgent: IPHONE_UA })).toBe("ios");
  });

  test("treats an iPad dressed as a Mac as iOS", () => {
    expect(detectOs({ platform: "MacIntel", userAgent: MAC_UA, maxTouchPoints: 5 })).toBe("ios");
    expect(detectOs({ platform: "MacIntel", userAgent: MAC_UA, maxTouchPoints: 0 })).toBe("macos");
  });

  test("prefers userAgentData.platform over the older hints", () => {
    expect(detectOs({ uaPlatform: "Windows", platform: "MacIntel", userAgent: MAC_UA })).toBe("windows");
    expect(detectOs({ uaPlatform: "Android", platform: "Linux armv8l", userAgent: ANDROID_UA })).toBe("android");
  });

  test("falls back to unknown for empty or malformed input", () => {
    expect(detectOs({})).toBe("unknown");
    expect(detectOs({ userAgent: "" })).toBe("unknown");
    expect(detectOs({ userAgent: undefined, platform: undefined, uaPlatform: undefined })).toBe("unknown");
    expect(detectOs({ userAgent: "curl/8.7.1" })).toBe("unknown");
  });
});

describe("formatShortcut", () => {
  test("uses the platform modifier", () => {
    expect(formatShortcut("Mod+K", "windows")).toBe("Ctrl+K");
    expect(formatShortcut("Mod+K", "macos")).toBe("⌘K");
    expect(formatShortcut("Mod+Enter", "macos")).toBe("⌘↵");
    expect(formatShortcut("Mod", "linux")).toBe("Ctrl");
    expect(formatShortcut("Escape", "macos")).toBe("esc");
  });

  test("spells the other keys per family", () => {
    expect(formatShortcut("Mod+Shift+ArrowUp", "windows")).toBe("Ctrl+Shift+↑");
    expect(formatShortcut("Mod+Shift+ArrowUp", "ios")).toBe("⌘⇧↑");
    expect(formatShortcut("Mod+Alt+Enter", "linux")).toBe("Ctrl+Alt+Enter");
    expect(formatShortcut("Mod+Escape", "unknown")).toBe("⌘esc");
    expect(formatShortcut("", "macos")).toBe("");
  });
});

describe("matchesShortcut", () => {
  test("maps Mod to the platform key", () => {
    expect(matchesShortcut(key("k", { metaKey: true }), "Mod+K", "macos")).toBe(true);
    expect(matchesShortcut(key("k", { metaKey: true }), "Mod+K", "windows")).toBe(false);
    expect(matchesShortcut(key("k", { ctrlKey: true }), "Mod+K", "windows")).toBe(true);
    expect(matchesShortcut(key("k", { ctrlKey: true }), "Mod+K", "macos")).toBe(false);
    expect(matchesShortcut(key("k", { ctrlKey: true }), "Mod+K", "unknown")).toBe(true);
  });

  test("requires the remaining modifiers to match exactly", () => {
    expect(matchesShortcut(key("Enter", { metaKey: true }), "Mod+Enter", "macos")).toBe(true);
    expect(matchesShortcut(key("Enter", { metaKey: true, shiftKey: true }), "Mod+Enter", "macos")).toBe(false);
    expect(matchesShortcut(key("Escape"), "Escape", "linux")).toBe(true);
    expect(matchesShortcut(key("Escape"), "Esc", "macos")).toBe(true);
    expect(matchesShortcut(key("k"), "Mod+K", "windows")).toBe(false);
  });

  test("isModKey reports only the platform modifier", () => {
    expect(isModKey({ ctrlKey: true }, "windows")).toBe(true);
    expect(isModKey({ metaKey: true }, "windows")).toBe(false);
    expect(isModKey({ metaKey: true }, "macos")).toBe(true);
    expect(isModKey({ ctrlKey: true }, "ios")).toBe(false);
    expect(isModKey({ ctrlKey: true }, "unknown")).toBe(true);
  });
});

describe("detectRuntime", () => {
  test("recognizes the desktop shells", () => {
    expect(detectRuntime(null)).toBe("web");
    expect(detectRuntime({})).toBe("web");
    expect(detectRuntime({ __TAURI_INTERNALS__: {} })).toBe("desktop");
    expect(detectRuntime({ navigator: { userAgent: "Mozilla/5.0 Electron/42.0.0" } })).toBe("desktop");
    expect(detectRuntime({ navigator: { userAgent: WINDOWS_UA } })).toBe("web");
  });
});
