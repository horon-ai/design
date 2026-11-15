import { useHoronTheme } from "../provider";

/**
 * True while pressable controls grow to the 44px touch target; false by default.
 *
 * Lynx evaluates no media queries, so `pointer: coarse` cannot decide this the
 * way it would on the web; the provider's `touch` prop carries the answer from
 * the host that knows it runs on a phone. Library components read this
 * themselves — a host that writes its own pressable row reads it the same way
 * instead of hard-coding 44px next to a control that may already have moved.
 *
 * @returns Whether the root asked for the touch rung.
 *
 * @example
 * ```tsx
 * import { useTouch } from "@horon-ai/lynx";
 *
 * function ThreadRow({ label }: { label: string }) {
 *   const touch = useTouch();
 *   return (
 *     <view className={touch ? "h-11 justify-center" : "h-8 justify-center"} bindtap={() => open()}>
 *       <text className="text-label-lg text-text-primary">{label}</text>
 *     </view>
 *   );
 * }
 * ```
 */
export function useTouch(): boolean {
  return useHoronTheme().touch;
}
