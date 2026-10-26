export type LiquidGlassProps = {
  /** `thick` hosts drop the dark edge, as the Figma thick-glass components do. */
  tier?: "clear" | "regular" | "thick";
};

/**
 * The Figma `Liquid layers` group: tint, inner shade and three edges, each at
 * half strength, scaled to the host height. Render it as the first child of a
 * `relative` host with a border radius; the host keeps its own fill and rim.
 */
export function LiquidGlass({ tier = "clear" }: LiquidGlassProps) {
  return (
    <span aria-hidden className="liquid-layers" data-tier={tier}>
      <span data-layer="tint" />
      <span data-layer="inner-shade" />
      <span data-layer="edge-dark" />
      <span data-layer="edge-light" />
      <span data-layer="edge-light-soft" />
    </span>
  );
}
