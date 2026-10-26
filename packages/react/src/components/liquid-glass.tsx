import { useEffect, useRef } from "react";

import { attachRefraction } from "../lib/liquid-refraction";

export type LiquidGlassProps = {
  /** `thick` hosts drop the dark edge, as the Figma thick-glass components do. */
  tier?: "clear" | "regular" | "thick";
  /** WebGL refraction through liquid-gl. Off keeps the CSS-only glass. */
  refract?: boolean;
};

/**
 * The Figma `Liquid layers` group: tint, inner shade and three edges, each at
 * half strength, scaled to the host height, plus WebGL refraction of the page
 * behind it (see `lib/liquid-refraction.ts`). Render it as the first child of a
 * `relative` host with a border radius; the host keeps its own fill and rim.
 */
export function LiquidGlass({ tier = "clear", refract = true }: LiquidGlassProps) {
  const lens = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (!refract || !lens.current) return undefined;
    return attachRefraction(lens.current);
  }, [refract]);
  return (
    <span aria-hidden className="liquid-layers" data-tier={tier}>
      <span ref={lens} data-layer="lens" />
      <span data-layer="tint" />
      <span data-layer="inner-shade" />
      <span data-layer="edge-dark" />
      <span data-layer="edge-light" />
      <span data-layer="edge-light-soft" />
    </span>
  );
}
