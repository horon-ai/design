import { useEffect, useRef } from "react";

import { matchesShortcut } from "../lib/platform";
import { usePlatform } from "./use-platform";

/** Options of {@link useHotkey}: the only switch is whether the listener is attached. */
export type HotkeyOptions = {
  /** When false the listener is detached and the hotkey does nothing (default true). */
  enabled?: boolean;
};

/**
 * Runs `handler` on a `document` keydown that matches `keys`, such as `Mod+K`,
 * and prevents the browser default. Text inputs keep their focus, so a palette
 * shortcut still fires mid-typing; the check follows the OS modifier key.
 *
 * The listener is attached in an effect, so a server render binds nothing. The handler is held in a ref, so a
 * caller can pass an inline arrow without re-binding on every render; only `keys`, `enabled` and the OS
 * re-subscribe. `Mod` follows {@link usePlatform}: ⌘ on macOS and iOS, Ctrl on Windows, Linux and Android,
 * and either one while the OS is still unknown.
 *
 * @param keys - Shortcut string such as `Mod+K`, `Mod+Shift+Enter` or `Escape`, in the same syntax `Kbd` draws.
 * @param handler - Called with the matching keydown event after `preventDefault()`.
 * @param options - {@link HotkeyOptions}; `enabled` defaults to `true`.
 * @returns Nothing; the listener is cleaned up when the component unmounts or `keys`/`enabled` change.
 *
 * @example
 * ```tsx
 * import { useHotkey } from "@horon-ai/react";
 *
 * function PaletteShortcut({ open }: { open: () => void }) {
 *   useHotkey("Mod+K", open);
 *   return <Kbd keys="Mod+K" />;
 * }
 * ```
 */
export function useHotkey(keys: string, handler: (event: KeyboardEvent) => void, options: HotkeyOptions = {}) {
  const { enabled = true } = options;
  const platform = usePlatform();
  const handlerRef = useRef(handler);

  useEffect(() => {
    handlerRef.current = handler;
  });

  useEffect(() => {
    if (!enabled) return undefined;
    const onKeyDown = (event: KeyboardEvent) => {
      if (!matchesShortcut(event, keys, platform.os)) return;
      event.preventDefault();
      handlerRef.current(event);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [keys, enabled, platform.os]);
}
