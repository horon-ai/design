import type { CSSProperties } from "react";
import { useEffect, useRef, useState } from "react";

import {
  acquireFilter,
  canBuildFilters,
  onSlotFreed,
  releaseFilter,
  returnSlot,
  tryTakeSlot,
} from "../lib/glass/filters";
import { createGlassHost, type GlassHostScheduler, type HostSize } from "../lib/glass/host";
import type { GlassShape } from "../lib/glass/map";
import { watchHost } from "../lib/glass/observe";
import { areaAllowed, engineRefracts, readEnv } from "../lib/glass/support";

export type LiquidGlassProps = {
  /** `thick` hosts drop the dark edge, as the Figma thick-glass components do. */
  tier?: "clear" | "regular" | "thick";
  /**
   * Bends the host's backdrop at its edges through the in-house engine. Off, or
   * on an engine that cannot filter a backdrop, keeps the CSS-only glass.
   */
  refract?: boolean;
};

/** The one custom property this component sets; React's `CSSProperties` has no index signature. */
type RefractStyle = CSSProperties & { "--glass-refract-filter": string };

const SCHEDULER: GlassHostScheduler<ReturnType<typeof setTimeout>> = {
  after: (ms, task) => setTimeout(task, ms),
  cancel: (handle) => {
    clearTimeout(handle);
  },
};

/** Opaque hosts (solid menus, fields) show nothing through them, so bending their backdrop only drags in what sits beside them. */
function isOpaque(host: HTMLElement): boolean {
  const color = getComputedStyle(host).backgroundColor;
  const alpha = /rgba?\([^)]*?,\s*([\d.]+)\s*\)$/.exec(color)?.[1] ?? /\/\s*([\d.]+%?)\s*\)$/.exec(color)?.[1];
  if (alpha === undefined) return color.startsWith("rgb(");
  return alpha.endsWith("%") ? Number.parseFloat(alpha) >= 95 : Number.parseFloat(alpha) >= 0.95;
}

/**
 * The Figma `Liquid layers` group: tint, inner shade and three edges, each at
 * half strength, scaled to the host height. Render it as the first child of a
 * `relative` host with a border radius; the host keeps its own fill and rim.
 *
 * On Chromium it also bends the host's backdrop at the edges. One displacement
 * filter is built per rounded-rectangle shape and shared by every host that
 * normalizes to the same size, so a row of equal buttons paints one map: the
 * filter blurs the backdrop, displaces it by the map's red and green channels
 * and lifts its saturation, which reads as the rim of a glass body. The layer
 * that carries it is a zero-content span filling the host, and the filter
 * reaches it as `--glass-refract-filter`.
 *
 * The engine is budgeted rather than free: a page holds at most 16 refracting
 * surfaces with a precise pointer and 6 with a finger, a host larger than
 * 600000px² (250000px² on touch) keeps the CSS look, and so does an opaque host
 * or a reader who asked for reduced transparency. Only an intersecting host
 * asks for a slot, and a host the cap turns away waits for one to free
 * instead of staying frosted. Size comes from the shared
 * observers in `lib/glass/observe`, in layout pixels, so a scaled ancestor does
 * not shrink the shape. A host that changes size drops its filter and its slot
 * at once and asks for a new one 150ms after the size settles, which keeps a
 * dragged sidebar from rebuilding a map on every frame without remounting
 * anything. A host that scrolls out of view releases both, and takes them back
 * when it returns. The slot and the filter are one pair taken and handed back
 * through `lib/glass/host`, so a host that unmounts, loses its size or is
 * removed from the document leaves neither a slot nor a filter behind.
 *
 * Safari, every iOS browser and Firefox cannot apply an SVG filter to a
 * backdrop (WebKit drops the blur with it), so they keep the CSS glass and the
 * engine never runs there. When the browser cannot paint a displacement map at
 * all, the host also keeps the CSS look. `sheen`, a gradient rim, is rendered
 * for every host and hidden by CSS whenever refraction is on.
 */
export function LiquidGlass({ tier = "clear", refract = true }: LiquidGlassProps) {
  const group = useRef<HTMLSpanElement>(null);
  const [filterId, setFilterId] = useState<string | null>(null);

  useEffect(() => {
    const element = group.current;
    const host = element?.parentElement;
    if (!refract || !element || !host) return undefined;
    const env = readEnv();
    if (!engineRefracts(env) || isOpaque(host) || !canBuildFilters()) return undefined;

    const shapeFor = ({ width, height }: HostSize): GlassShape | null => {
      const radius = Math.min(
        Number.parseFloat(getComputedStyle(host).borderTopLeftRadius) || 0,
        height / 2,
        width / 2,
      );
      const shape = { width, height, radius };
      return areaAllowed(shape, env.coarsePointer) ? shape : null;
    };

    const glass = createGlassHost({
      takeSlot: () => tryTakeSlot(env.coarsePointer),
      returnSlot,
      acquireFilter,
      releaseFilter,
      waitForSlot: onSlotFreed,
      shapeFor,
      onChange: setFilterId,
      scheduler: SCHEDULER,
    });

    const unwatch = watchHost(element, {
      onSize: glass.sizeChanged,
      onVisible: glass.visibilityChanged,
    });

    return () => {
      glass.destroy();
      unwatch();
    };
  }, [refract]);

  const refractStyle: RefractStyle | undefined = filterId
    ? { "--glass-refract-filter": `url(#${filterId})` }
    : undefined;

  return (
    <span
      ref={group}
      aria-hidden
      className="liquid-layers"
      data-tier={tier}
      data-refract={filterId ? "on" : undefined}
      style={refractStyle}
    >
      {filterId && <span data-layer="refraction" />}
      <span data-layer="tint" />
      <span data-layer="inner-shade" />
      <span data-layer="edge-dark" />
      <span data-layer="edge-light" />
      <span data-layer="edge-light-soft" />
      <span data-layer="sheen" />
    </span>
  );
}
