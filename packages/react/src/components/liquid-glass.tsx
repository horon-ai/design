/**
 * The glass material from `@horon-ai/tokens` `glass.ts`, the same one Flutter's
 * `HoronLiquidGlass` draws: the backdrop blurred and saturated, then a 1px rim
 * that is bright at the top and faint down the sides.
 *
 * Render it as the first child of a `relative isolate` host with a border radius
 * and no border of its own; the rim is the edge. `isolate` keeps the layer's
 * `-z-10` inside the host, so it paints under the body while staying above the
 * host's own fill. A host that cannot isolate keeps its body `relative` instead.
 *
 * The host keeps its fill (`glass-clear`, `glass-regular`, `glass-thick`), which
 * is equivalent to Flutter painting the fill over the filtered backdrop because
 * saturation is linear and keeps white. There is deliberately no `tier` prop:
 * the fill is the host's, and a fill on the layer would have to override the
 * `glass-fill-frost` swap that `globals.css` applies for reduced transparency
 * and for engines without `backdrop-filter`, so the layer would lie about the
 * surface it is drawing. Tiers belong on the host, one class, no prop.
 *
 * Without backdrop-filter support, or with reduced transparency requested, the
 * fill turns to `glass-fill-frost` and the rim stays (see `globals.css`).
 *
 * It takes no props and renders a single `aria-hidden` span; every visual
 * decision comes from the host's class list, so the same element serves buttons,
 * headers, cards and sheets.
 *
 * @example
 * ```tsx
 * function GlassCard() {
 *   return (
 *     <div className="relative isolate overflow-clip rounded-xl bg-glass-regular p-4">
 *       <LiquidGlass />
 *       <span className="relative">Floating chrome over the backdrop</span>
 *     </div>
 *   );
 * }
 * ```
 */
export function LiquidGlass() {
  return <span aria-hidden className="liquid-layers" />;
}
