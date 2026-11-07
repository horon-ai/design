import { useEffect, useRef } from "@lynx-js/react";

import { matchesShortcut, type ShortcutEvent } from "../lib/platform";
import { usePlatform } from "./use-platform";

/** Options of {@link useHotkey}: the only switch is whether the listener is attached. */
export type HotkeyOptions = {
  /** When false the listener is detached and the hotkey does nothing (default true). */
  enabled?: boolean;
};

/** The key event a Lynx node reports through `bindkeydown`; shaped like `ShortcutEvent` plus the node's own type. */
export type HotkeyEvent = ShortcutEvent & { preventDefault?: () => void };

/**
 * Runs `handler` when a keydown matching `keys` reaches the node that spreads
 * the returned props, such as `Mod+K`.
 *
 * Lynx has no document-level keyboard API: `keydown` exists only on the Web and
 * Clay (macOS/Windows) engines, and it is delivered to a focused node. So the
 * hook returns the binding instead of attaching a global listener — spread it on
 * the node that should hear the shortcut (`<view {...useHotkey("Mod+K", open)}>`)
 * — and on touch engines, which never report a key, the binding is inert. This is
 * the deliberate difference from react's `document.addEventListener`; the
 * signature is the one callers already know.
 *
 * `preventDefault` is called only when the engine exposes it, because the Lynx
 * event object has no default action to cancel on native.
 *
 * @param keys - Shortcut string such as `Mod+K`, `Mod+Shift+Enter` or `Escape`.
 * @param handler - Called with the matching event.
 * @param options - {@link HotkeyOptions}; `enabled` defaults to `true`.
 * @returns The `bindkeydown` handler to spread on a node.
 *
 * @example
 * ```tsx
 * import { useState } from "@lynx-js/react";
 * import { useHotkey } from "@horon-ai/lynx";
 *
 * function Palette() {
 *   const [open, setOpen] = useState(false);
 *   const hotkey = useHotkey("Mod+K", () => setOpen(true));
 *   return <view {...hotkey}>{open ? <PaletteBody /> : null}</view>;
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

  return {
    bindkeydown: (event: HotkeyEvent) => {
      if (!enabled) return;
      if (!matchesShortcut(event, keys, platform.os)) return;
      event.preventDefault?.();
      handlerRef.current(event);
    },
  };
}
