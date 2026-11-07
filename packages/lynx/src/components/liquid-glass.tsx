/**
 * The glass rim from `@horon-ai/tokens` `glass.ts`, adapted to Lynx: Lynx has no
 * `backdrop-filter` and no `::after`, so what react's single `.liquid-layers`
 * span did with a masked pseudo-element is split across two views here.
 *
 * The host keeps its tier fill (`glass-clear`, `glass-regular`, `glass-thick`),
 * which on Lynx is already the frost-safe `glass-fill-frost` value that react
 * swaps in when a backdrop cannot be filtered or reduced transparency is
 * requested. Render `<LiquidGlass />` as the first child of a `relative` host
 * with a border radius and no border of its own: the outer view paints the
 * top-bright rim gradient, and its child covers everything inside the rim with
 * the frost fill, so only the 1px ring shows.
 *
 * There is deliberately no `tier` prop, exactly as in react: the fill belongs to
 * the host, so the layer cannot lie about the surface it is drawing. Lynx needs
 * no `isolate` because the layer is painted as the host's first child and the
 * body simply follows it in flow order.
 *
 * It takes no props and renders two `accessibility-hidden`-equivalent views with
 * no text, so it is invisible to a screen reader.
 *
 * @example
 * ```tsx
 * import { LiquidGlass } from "@horon-ai/lynx";
 *
 * function GlassCard() {
 *   return (
 *     <view className="relative flex overflow-hidden rounded-xl bg-glass-regular p-4">
 *       <LiquidGlass />
 *       <text className="relative text-label-md text-text-primary">Floating chrome</text>
 *     </view>
 *   );
 * }
 * ```
 */
export function LiquidGlass() {
  return (
    <view className="liquid-layers" accessibility-element={false}>
      <view className="liquid-layers-inner" accessibility-element={false} />
    </view>
  );
}
