import { Platform, useWindowDimensions } from "react-native";

/** The three layout classes: `mobile` under 768pt, `tablet` for a touch screen above that, `desktop` otherwise. */
export type DeviceType = "mobile" | "tablet" | "desktop";

/** The primary input behind the pointer: `touch` for a touch screen, `pointer` for a fine one. */
export type DeviceInput = "touch" | "pointer";

/** What the layout and the key hints need: the device class, the input behind it and whether a key chip can be reached. */
export type Device = {
  /** `mobile` below 768pt, `tablet` for a touch screen above that, `desktop` otherwise. */
  type: DeviceType;
  /** `touch` on iOS and Android, `pointer` everywhere else. */
  input: DeviceInput;
  /** True only for a platform with a hovering fine pointer, the input that can actually reach a key chip. */
  keyboardHints: boolean;
};

/** The `pointer: coarse` query that {@link useDevice} reports as `touch`; exported so a component can match the same breakpoint. */
export const COARSE_QUERY = "(pointer: coarse)";

/** Width at which a touch screen stops being a phone, matching react's 768px breakpoint. */
const MOBILE_BREAKPOINT = 768;

/**
 * `useSyncExternalStore` compares snapshots by reference in react, so each result
 * is built once and handed out again; the same cache keeps the reference stable
 * across a re-render here.
 */
const devices = new Map<string, Device>();

/**
 * Builds or reuses the device object; the cache key is the three answers.
 *
 * @param type - The layout class.
 * @param input - The primary input.
 * @param keyboardHints - Whether a key chip is reachable.
 * @returns The shared {@link Device} for that combination.
 */
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
 * React answers this from three media queries; React Native has neither
 * `matchMedia` nor a pointer API, so the width comes from
 * `useWindowDimensions()`, a touch screen is `Platform.OS` being `ios` or
 * `android`, and `Platform.isPad` keeps an iPad a tablet even in a narrow split
 * view. A touch screen above the 768pt breakpoint is a tablet, below it a
 * phone, and every other platform is a desktop with keyboard hints on.
 *
 * The returned object is shared, so a re-render with the same device hands back
 * the same reference.
 *
 * @returns The current `Device`: `type`, `input` and `keyboardHints`.
 *
 * @example
 * ```tsx
 * import { useDevice } from "@horon-ai/expo";
 *
 * function ComposeFooter() {
 *   const { type, keyboardHints } = useDevice();
 *   return (
 *     <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
 *       <HoronText>{type}</HoronText>
 *       {keyboardHints ? <Kbd keys="Mod+Enter" /> : null}
 *     </View>
 *   );
 * }
 * ```
 */
export function useDevice(): Device {
  const { width } = useWindowDimensions();
  const touch = Platform.OS === "ios" || Platform.OS === "android";
  const ipad = Platform.OS === "ios" ? Platform.isPad : false;
  const type: DeviceType = width < MOBILE_BREAKPOINT && !ipad ? "mobile" : touch ? "tablet" : "desktop";
  return deviceSnapshot(type, touch ? "touch" : "pointer", !touch);
}
