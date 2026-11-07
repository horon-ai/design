import { useMediaQuery } from "./use-media-query";

/** The three layout classes: `mobile` under 768px, `tablet` for a coarse pointer above that, `desktop` otherwise. */
export type DeviceType = "mobile" | "tablet" | "desktop";

/** The primary input behind the pointer: `touch` for a coarse pointer, `pointer` for a fine one. */
export type DeviceInput = "touch" | "pointer";

/** What the layout and the key hints need: the device class, the input behind it and whether a key chip can be reached. */
export type Device = {
  /** `mobile` below 768px, `tablet` for a coarse pointer above that, `desktop` otherwise. */
  type: DeviceType;
  /** `touch` when the pointer is coarse, `pointer` when it is fine. */
  input: DeviceInput;
  /** True only for a hovering fine pointer, the input that can actually reach a key chip. */
  keyboardHints: boolean;
};

const MOBILE_QUERY = "(max-width: 767px)";
const COARSE_QUERY = "(pointer: coarse)";
const HINTS_QUERY = "(hover: hover) and (pointer: fine)";

/**
 * `useSyncExternalStore` compares snapshots by reference, so each result is
 * built once and handed out again.
 */
const devices = new Map<string, Device>();

function deviceSnapshot(type: DeviceType, input: DeviceInput, keyboardHints: boolean): Device {
  const key = `${type}:${input}:${keyboardHints}`;
  const cached = devices.get(key);
  if (cached) return cached;
  const next = { type, input, keyboardHints };
  devices.set(key, next);
  return next;
}

/**
 * The device class and its primary input, as the layout and key hints need them.
 *
 * The three queries go through {@link useMediaQuery}, so nothing is read during a server render or the first
 * hydration pass: that pass reports `desktop` / `pointer` with `keyboardHints` on, the value the query hooks
 * were given as their server fallback. The returned object is shared, so a re-render with the same device
 * hands back the same reference.
 *
 * @returns The current `Device`: `type`, `input` and `keyboardHints`.
 *
 * @example
 * ```tsx
 * import { useDevice } from "@horon-ai/react";
 *
 * function ComposeFooter() {
 *   const { type, keyboardHints } = useDevice();
 *   return (
 *     <footer className="flex items-center gap-2">
 *       <span className="text-caption">{type}</span>
 *       {keyboardHints && <Kbd keys="Mod+Enter" />}
 *     </footer>
 *   );
 * }
 * ```
 */
export function useDevice(): Device {
  const mobile = useMediaQuery(MOBILE_QUERY);
  const coarse = useMediaQuery(COARSE_QUERY);
  const keyboardHints = useMediaQuery(HINTS_QUERY, true);
  const type: DeviceType = mobile ? "mobile" : coarse ? "tablet" : "desktop";
  return deviceSnapshot(type, coarse ? "touch" : "pointer", keyboardHints);
}
