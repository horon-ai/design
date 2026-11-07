import { glass } from "@horon-ai/tokens";

import { supportsBackdropBlur } from "../lib/glass";

/**
 * The glass material from `@horon-ai/tokens` `glass.ts`, the same one Flutter's
 * `HoronLiquidGlass` draws.
 *
 * Lynx 4.0 ships `<blur-view>`, so this is the real material on every engine
 * that can filter a backdrop: iOS renders Liquid Glass through
 * `blur-effect="glass"`, Android and HarmonyOS blur the captured backdrop, and
 * the web engine turns it into a CSS `backdrop-filter`. A rim gradient is drawn
 * over it, bright at the top and faint down the sides, exactly as react's
 * `.liquid-layers` ring does.
 *
 * Render it as the first child of a `relative overflow-hidden` host with a
 * border radius and no border of its own; the rim is the edge. The host keeps
 * its tier fill (`glass-clear`, `glass-regular`, `glass-thick`), which
 * `HoronProvider` re-points at the real translucent values when
 * {@link supportsBackdropBlur} is true and leaves at the frost-safe
 * `glass-fill-frost` where it is not, so the desktop shells still show a frosted
 * surface rather than a hole.
 *
 * It takes no props and renders one layer plus its rim; every visual decision
 * comes from the host's class list, so the same element serves buttons, headers,
 * cards and sheets.
 *
 * @example
 * ```tsx
 * function GlassCard() {
 *   return (
 *     <view className="relative isolate overflow-hidden rounded-xl bg-glass-regular p-4">
 *       <LiquidGlass />
 *       <text className="relative text-label-md text-text-primary">Floating chrome</text>
 *     </view>
 *   );
 * }
 * ```
 */
export function LiquidGlass() {
  const radius = `${glass.blur}px`;

  return (
    <view className="liquid-layers" accessibility-element={false}>
      {supportsBackdropBlur() ? (
        <blur-view
          className="liquid-layers-inner"
          blur-radius={radius}
          blur-effect="glass"
          glass-style="regular"
          glass-interactive
        />
      ) : (
        <view className="liquid-layers-inner" accessibility-element={false} />
      )}
    </view>
  );
}
