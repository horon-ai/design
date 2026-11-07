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
 * The device class and its primary input, as the layout and key hints need them.
 *
 * The three queries go through {@link useMediaQuery}, so the answers come from
 * `SystemInfo` width and the detected OS rather than a real pointer API: a phone
 * or tablet reports `touch`, a desktop or the browser engine a fine `pointer`
 * with `keyboardHints` on.
 *
 * @returns The current `Device`: `type`, `input` and `keyboardHints`.
 *
 * @example
 * ```tsx
 * import { useDevice } from "@horon-ai/lynx";
 *
 * function ComposeFooter() {
 *   const { type, keyboardHints } = useDevice();
 *   return (
 *     <view className="flex items-center gap-2">
 *       <text className="text-caption text-text-secondary">{type}</text>
 *       {keyboardHints ? <Kbd keys="Mod+Enter" /> : null}
 *     </view>
 *   );
 * }
 * ```
 */
export function useDevice(): Device {
  const mobile = useMediaQuery(MOBILE_QUERY);
  const coarse = useMediaQuery(COARSE_QUERY);
  const keyboardHints = useMediaQuery(HINTS_QUERY, true);
  const type: DeviceType = mobile ? "mobile" : coarse ? "tablet" : "desktop";
  return { type, input: coarse ? "touch" : "pointer", keyboardHints };
}
