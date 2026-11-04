/**
 * The glass material from `@horon-ai/tokens` `glass.ts`, the same one Flutter's
 * `HoronLiquidGlass` draws: the backdrop blurred and saturated, then a 1px rim
 * that is bright at the top and faint down the sides.
 *
 * Render it as the first child of a `relative` host with a border radius and no
 * border of its own; the rim is the edge. The host keeps its fill (`glass-clear`,
 * `glass-regular`, `glass-thick`), which is equivalent to Flutter painting the
 * fill over the filtered backdrop because saturation is linear and keeps white.
 * Siblings that are `relative` paint above it.
 *
 * Without backdrop-filter support, or with reduced transparency requested, the
 * fill turns to `glass-fill-frost` and the rim stays (see `globals.css`).
 */
export function LiquidGlass() {
  return <span aria-hidden className="liquid-layers" />;
}
