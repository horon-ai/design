import { useMediaQuery } from "./use-media-query";

export type DeviceType = "mobile" | "tablet" | "desktop";

export type DeviceInput = "touch" | "pointer";

export type Device = {
  /** `mobile` below 768px, `tablet` for a coarse pointer above that, `desktop` otherwise. */
  type: DeviceType;
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

/** The device class and its primary input, as the layout and key hints need them. */
export function useDevice(): Device {
  const mobile = useMediaQuery(MOBILE_QUERY);
  const coarse = useMediaQuery(COARSE_QUERY);
  const keyboardHints = useMediaQuery(HINTS_QUERY, true);
  const type: DeviceType = mobile ? "mobile" : coarse ? "tablet" : "desktop";
  return deviceSnapshot(type, coarse ? "touch" : "pointer", keyboardHints);
}
