import { useEffect, useRef } from "react";

import { matchesShortcut, type ShortcutEvent } from "../lib/platform";
import { usePlatform } from "./use-platform";

/** Options of {@link useHotkey}: the only switch is whether the listener is attached. */
export type HotkeyOptions = {
  /** When false the listener is detached and the hotkey does nothing (default true). */
  enabled?: boolean;
};

/** The key event a hotkey handler receives: the shortcut fields plus the DOM's `preventDefault` when there is one. */
export type HotkeyEvent = ShortcutEvent & { preventDefault?: () => void };

/** The part of `window` a hotkey needs; react-native-web's window has it, a native host does not. */
type KeydownWindow = {
  addEventListener: (type: "keydown", listener: (event: HotkeyEvent) => void) => void;
  removeEventListener: (type: "keydown", listener: (event: HotkeyEvent) => void) => void;
};

/**
 * Narrows an unknown host to a {@link KeydownWindow}; the handler is called as
 * `listener(event)` on a real `keydown`, which is the shape {@link HotkeyEvent} describes.
 *
 * @param value - The host to test.
 * @returns True when `addEventListener` and `removeEventListener` are functions.
 */
function isKeydownWindow(value: unknown): value is KeydownWindow {
  if (typeof value !== "object" || value === null) return false;
  const host = value as { addEventListener?: unknown; removeEventListener?: unknown };
  return typeof host.addEventListener === "function" && typeof host.removeEventListener === "function";
}

/**
 * The `window` to attach the listener to, or `undefined` when this host has none.
 *
 * React Native installs a global `window` on native too, but it has no
 * `addEventListener`; react-native-web's is the real browser window.
 *
 * @returns The keydown window, or `undefined` on a host without one.
 */
function keydownWindow(): KeydownWindow | undefined {
  // `window` is not in the DOM-free types this package compiles against, so the property is read by name.
  const host: unknown = Reflect.get(globalThis, "window");
  return isKeydownWindow(host) ? host : undefined;
}

/**
 * Runs `handler` on a `window` keydown that matches `keys`, such as `Mod+K`,
 * and prevents the browser default.
 *
 * A hardware keyboard on native React Native delivers no global key events:
 * key presses arrive at the focused input as text, and there is no document to
 * listen on without a native module. So this hook keeps react's signature and
 * is **inert on native**, where `window.addEventListener` does not exist, and
 * **active on react-native-web**, where the listener behaves like react's. A
 * caller that needs native shortcuts has to bind a `keyDown` handler on the
 * focused input or add a native module.
 *
 * The listener is attached in an effect, so nothing binds before mount. The
 * handler is held in a ref, so an inline arrow does not re-bind on every
 * render; only `keys`, `enabled` and the OS re-subscribe. `Mod` follows
 * {@link usePlatform}: ⌘ on macOS and iOS, Ctrl on Windows, Linux and Android.
 *
 * @param keys - Shortcut string such as `Mod+K`, `Mod+Shift+Enter` or `Escape`, in the same syntax `Kbd` draws.
 * @param handler - Called with the matching keydown event after `preventDefault()`.
 * @param options - {@link HotkeyOptions}; `enabled` defaults to `true`.
 * @returns Nothing; the listener is cleaned up when the component unmounts or `keys`/`enabled` change.
 *
 * @example
 * ```tsx
 * import { useHotkey } from "@horon-ai/expo";
 *
 * function PaletteShortcut({ open }: { open: () => void }) {
 *   useHotkey("Mod+K", open);
 *   return <Kbd keys="Mod+K" />;
 * }
 * ```
 */
export function useHotkey(keys: string, handler: (event: HotkeyEvent) => void, options: HotkeyOptions = {}) {
  const { enabled = true } = options;
  const platform = usePlatform();
  const handlerRef = useRef(handler);

  useEffect(() => {
    handlerRef.current = handler;
  });

  useEffect(() => {
    if (!enabled) return undefined;
    const target = keydownWindow();
    if (!target) return undefined;
    const onKeyDown = (event: HotkeyEvent) => {
      if (!matchesShortcut(event, keys, platform.os)) return;
      event.preventDefault?.();
      handlerRef.current(event);
    };
    target.addEventListener("keydown", onKeyDown);
    return () => target.removeEventListener("keydown", onKeyDown);
  }, [keys, enabled, platform.os]);
}
