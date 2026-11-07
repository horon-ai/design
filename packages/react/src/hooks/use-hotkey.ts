import { useEffect, useRef } from "react";

import { matchesShortcut } from "../lib/platform";
import { usePlatform } from "./use-platform";

export type HotkeyOptions = {
  /** When false the listener is detached and the hotkey does nothing (default true). */
  enabled?: boolean;
};

/**
 * Runs `handler` on a `document` keydown that matches `keys`, such as `Mod+K`,
 * and prevents the browser default. Text inputs keep their focus, so a palette
 * shortcut still fires mid-typing; the check follows the OS modifier key.
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
