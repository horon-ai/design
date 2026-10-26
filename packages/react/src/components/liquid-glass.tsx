import LiquidGlassReact from "liquid-glass-react";
import { useEffect, useRef, useState } from "react";

export type LiquidGlassProps = {
  /** `thick` hosts drop the dark edge, as the Figma thick-glass components do. */
  tier?: "clear" | "regular" | "thick";
  /** Refraction through liquid-glass-react. Off keeps the CSS-only glass. */
  refract?: boolean;
};

type Shape = { width: number; height: number; radius: number };

/** Chromium is the only engine that runs an SVG filter over a backdrop. iOS browsers are WebKit and send `CriOS`/`EdgiOS`, not `Chrome/`. */
function supportsBackdropDisplacement(): boolean {
  return /Chrome\//.test(navigator.userAgent);
}

/**
 * The Figma `Liquid layers` group: tint, inner shade and three edges, each at
 * half strength, scaled to the host height. Render it as the first child of a
 * `relative` host with a border radius; the host keeps its own fill and rim.
 *
 * In Chromium it also mounts liquid-glass-react underneath, sized to the host:
 * its SVG displacement filter bends the backdrop at the edges and its rims catch
 * the light. Safari and Firefox cannot apply an SVG filter to a backdrop (in
 * WebKit the library's layer loses its blur as well), so they keep the CSS glass. The library is a
 * free-standing widget, so it is pinned to the host here: centred with its own
 * top/left 50% and translate, rigid (`elasticity` 0) and without pointer events,
 * so the host keeps its layout and interaction. It measures its size only on
 * mount, so it is remounted when the host is resized.
 */
export function LiquidGlass({ tier = "clear", refract = true }: LiquidGlassProps) {
  const group = useRef<HTMLSpanElement>(null);
  const [shape, setShape] = useState<Shape | null>(null);

  useEffect(() => {
    const element = group.current;
    const host = element?.parentElement;
    if (!refract || !element || !host) return undefined;
    if (!supportsBackdropDisplacement()) return undefined;
    if (window.matchMedia("(prefers-reduced-transparency: reduce)").matches) return undefined;
    const measure = () => {
      const { width, height } = element.getBoundingClientRect();
      if (width === 0 || height === 0) return;
      const radius = Math.min(Number.parseFloat(getComputedStyle(host).borderTopLeftRadius) || 0, height / 2);
      setShape({ width: Math.round(width), height: Math.round(height), radius });
    };
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => {
      observer.disconnect();
      setShape(null);
    };
  }, [refract]);

  return (
    <span ref={group} aria-hidden className="liquid-layers" data-tier={tier} data-refract={shape ? "on" : undefined}>
      {shape && (
        <LiquidGlassReact
          key={`${shape.width}x${shape.height}`}
          cornerRadius={shape.radius}
          displacementScale={Math.min(70, Math.max(16, shape.height * 0.6))}
          blurAmount={0.2}
          saturation={120}
          aberrationIntensity={1}
          elasticity={0}
          padding="0"
          style={{ position: "absolute", top: "50%", left: "50%", width: "100%", height: "100%" }}
        >
          <span />
        </LiquidGlassReact>
      )}
      <span data-layer="tint" />
      <span data-layer="inner-shade" />
      <span data-layer="edge-dark" />
      <span data-layer="edge-light" />
      <span data-layer="edge-light-soft" />
    </span>
  );
}
