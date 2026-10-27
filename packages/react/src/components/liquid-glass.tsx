import type { CSSProperties } from "react";
import { useEffect, useRef, useState } from "react";

import { acquireFilter, releaseFilter, returnSlot, tryTakeSlot } from "../lib/glass/filters";
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

type Size = { width: number; height: number };
type Shape = Size & { radius: number };

/** The one custom property this component sets; React's `CSSProperties` has no index signature. */
type RefractStyle = CSSProperties & { "--glass-refract-filter": string };

/** How long a host holds one size before the engine builds a filter for it again. */
const SETTLE_MS = 150;

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
 * or a reader who asked for reduced transparency. Size comes from the shared
 * observers in `lib/glass/observe`, in layout pixels, so a scaled ancestor does
 * not shrink the shape. A host that changes size drops its filter and its slot
 * at once and asks for a new one 150ms after the size settles, which keeps a
 * dragged sidebar from rebuilding a map on every frame without remounting
 * anything. A host that scrolls out of view releases both, and takes them back
 * when it returns.
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
    if (!engineRefracts(env) || isOpaque(host)) return undefined;

    let timer: ReturnType<typeof setTimeout> | undefined;
    let size: Size | null = null;
    let held: Shape | null = null;
    let visible = true;
    let reported = false;

    const release = (): void => {
      if (!held) return;
      releaseFilter(held);
      returnSlot();
      held = null;
      setFilterId(null);
    };

    const acquire = (measured: Size): boolean => {
      if (held) return true;
      if (!visible || measured.width <= 0 || measured.height <= 0) return false;
      const radius = Math.min(
        Number.parseFloat(getComputedStyle(host).borderTopLeftRadius) || 0,
        measured.height / 2,
        measured.width / 2,
      );
      const shape: Shape = { width: measured.width, height: measured.height, radius };
      if (!areaAllowed(shape, env.coarsePointer) || !tryTakeSlot(env.coarsePointer)) return false;
      const id = acquireFilter(shape);
      // Without a 2d context the map comes back empty and the filter would bend
      // nothing, so the host keeps the CSS look and gives the slot back.
      const href = id ? document.getElementById(id)?.querySelector("feImage")?.getAttribute("href") : null;
      if (!id || !href) {
        if (id) releaseFilter(shape);
        returnSlot();
        return false;
      }
      held = shape;
      setFilterId(id);
      return true;
    };

    const clearTimer = (): void => {
      if (timer === undefined) return;
      clearTimeout(timer);
      timer = undefined;
    };

    const unwatch = watchHost(element, {
      onSize: (width, height) => {
        size = { width, height };
        release();
        clearTimer();
        if (!reported && width > 0 && height > 0) {
          reported = true;
          acquire(size);
          return;
        }
        timer = setTimeout(() => {
          timer = undefined;
          if (size) acquire(size);
        }, SETTLE_MS);
      },
      onVisible: (next) => {
        visible = next;
        if (next) {
          if (size) acquire(size);
          return;
        }
        clearTimer();
        release();
      },
    });

    return () => {
      clearTimer();
      release();
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
