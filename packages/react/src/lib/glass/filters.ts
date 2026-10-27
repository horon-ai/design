/**
 * One `<svg>` of displacement filters, shared by every host of the same shape.
 *
 * The filter bends a host's backdrop at its edges: the map painted from
 * `buildDisplacementMap` moves each sampled pixel by its red and green amount,
 * and the blur underneath keeps the bent result from banding. Maps ship as PNG
 * data URLs rather than as `<feImage href="#map">` fragments, because Gecko
 * never resolved a fragment reference there
 * (https://bugzilla.mozilla.org/show_bug.cgi?id=455986).
 *
 * Two hosts with the same normalized shape share one filter and one refcount,
 * so a row of equal buttons costs one map. The registry lives in the document
 * body: the last release removes its filter, and the `<svg>` goes with the last
 * filter, so a page that unmounts every glass host leaves no nodes behind.
 */

import { buildDisplacementMap, glassKey, glassScale, normalizeShape, type GlassShape } from "./map";
import { MAX_REFRACTING } from "./support";

const SVG_NAMESPACE = "http://www.w3.org/2000/svg";
const FILTER_PREFIX = "horon-glass-";
const REGISTRY_ATTRIBUTE = "data-horon-glass-filters";
const SVG_STYLE = "position:absolute;width:0;height:0;overflow:hidden;pointer-events:none";
const MAP_MEASURE = "horon-glass:map";
const SOURCE_BLUR = "0.4";
const SATURATION = "1.2";

type Entry = { uses: number; element: SVGFilterElement };

const entries = new Map<string, Entry>();
let registry: SVGSVGElement | null = null;
let slotsTaken = 0;

const createSvg = <Name extends keyof SVGElementTagNameMap>(
  name: Name,
  attributes: Record<string, string>,
): SVGElementTagNameMap[Name] => {
  const node = document.createElementNS(SVG_NAMESPACE, name);
  for (const [key, value] of Object.entries(attributes)) node.setAttribute(key, value);
  return node;
};

/** The map as a PNG data URL, timed so a slow or failed paint shows in a profile. */
const mapDataUrl = (shape: GlassShape): string => {
  const { width, height, data } = buildDisplacementMap(shape);
  const startMark = `${MAP_MEASURE}:start`;
  performance.mark(startMark);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (!context) {
    performance.measure(MAP_MEASURE, startMark);
    return "";
  }
  const pixels = new Uint8ClampedArray(data.length);
  pixels.set(data);
  context.putImageData(new ImageData(pixels, width, height), 0, 0);
  const url = canvas.toDataURL("image/png");
  performance.measure(MAP_MEASURE, startMark);
  return url;
};

const registryRoot = (): SVGSVGElement => {
  if (registry?.isConnected) return registry;
  const existing = document.querySelector<SVGSVGElement>(`svg[${REGISTRY_ATTRIBUTE}]`);
  if (existing) {
    registry = existing;
    return existing;
  }
  const svg = createSvg("svg", {
    [REGISTRY_ATTRIBUTE]: "",
    "aria-hidden": "true",
    width: "0",
    height: "0",
    style: SVG_STYLE,
  });
  (document.body ?? document.documentElement).append(svg);
  registry = svg;
  return svg;
};

const buildFilter = (shape: GlassShape, id: string): SVGFilterElement => {
  const { width, height } = normalizeShape(shape);
  const filter = createSvg("filter", {
    id,
    filterUnits: "userSpaceOnUse",
    primitiveUnits: "userSpaceOnUse",
    x: "0",
    y: "0",
    width: String(width),
    height: String(height),
    "color-interpolation-filters": "sRGB",
  });
  filter.append(
    createSvg("feGaussianBlur", { in: "SourceGraphic", stdDeviation: SOURCE_BLUR, result: "soft" }),
    createSvg("feImage", {
      href: mapDataUrl(shape),
      x: "0",
      y: "0",
      width: String(width),
      height: String(height),
      preserveAspectRatio: "none",
      result: "map",
    }),
    createSvg("feDisplacementMap", {
      in: "soft",
      in2: "map",
      scale: String(glassScale(shape)),
      xChannelSelector: "R",
      yChannelSelector: "G",
      result: "bent",
    }),
    createSvg("feColorMatrix", { in: "bent", type: "saturate", values: SATURATION }),
  );
  return filter;
};

/**
 * Returns the id of the filter for this shape, creating it and its map on first
 * use. Every call must be matched by `releaseFilter`, which drops the filter
 * when its last user lets go. Outside a browser there is nothing to build, so
 * the id comes back empty and `releaseFilter` has nothing to match.
 */
export function acquireFilter(shape: GlassShape): string {
  if (typeof document === "undefined") return "";
  const key = glassKey(shape);
  const id = `${FILTER_PREFIX}${key}`;
  const entry = entries.get(key);
  if (entry) {
    entry.uses += 1;
    return id;
  }
  const element = buildFilter(shape, id);
  registryRoot().append(element);
  entries.set(key, { uses: 1, element });
  return id;
}

/**
 * Drops one use of the filter; the last one removes it, and the last filter
 * removes the `<svg>`. A shape this page holds no use of is ignored: slots and
 * filters are separate counts, and the host that holds them hands both back
 * from one place, so a release here never touches a slot.
 */
export function releaseFilter(shape: GlassShape): void {
  if (typeof document === "undefined") return;
  const key = glassKey(shape);
  const entry = entries.get(key);
  if (!entry || entry.uses <= 0) return;
  entry.uses -= 1;
  if (entry.uses > 0) return;
  entries.delete(key);
  entry.element.remove();
  if (entries.size > 0) return;
  registry?.remove();
  registry = null;
}

/**
 * Reserves one of the page's refraction slots, so a page full of glass surfaces
 * does not ask the engine to bend dozens of backdrops at once. Fine pointers
 * allow more than fingers do, because a touch device also moves more.
 */
export function tryTakeSlot(coarsePointer: boolean): boolean {
  const cap = coarsePointer ? MAX_REFRACTING.coarse : MAX_REFRACTING.fine;
  if (slotsTaken >= cap) return false;
  slotsTaken += 1;
  return true;
}

/**
 * Hosts denied a slot, retried when one frees so a visible surface never stays
 * frosted behind the cap. A waiter leaves the set before its callback runs, so
 * one wake calls it at most once, and a callback that subscribes again for its
 * next attempt is not called twice in the same wake.
 */
const slotWaiters = new Set<() => void>();

/**
 * Calls `waiter` each time a slot frees; returns the unsubscribe. The
 * unsubscribe is idempotent, so a host may drop it while a wake is running.
 */
export function onSlotFreed(waiter: () => void): () => void {
  slotWaiters.add(waiter);
  return () => {
    slotWaiters.delete(waiter);
  };
}

/**
 * Wakes the hosts waiting for a slot, over a copy of the set, skipping any host
 * that unsubscribed while the copy was being taken: that host is gone, and a
 * wake must never ask it to take a slot back. A host that subscribes again from
 * inside its callback waits for the next free slot instead of being called
 * twice in this pass.
 */
const wakeWaiters = (): void => {
  for (const waiter of Array.from(slotWaiters)) {
    if (!slotWaiters.delete(waiter)) continue;
    waiter();
  }
};

/** A wake runs in a microtask, so a host that hands its slot back from inside one cannot recurse into the release that woke it. */
let wakeQueued = false;

const queueWake = (): void => {
  if (wakeQueued) return;
  wakeQueued = true;
  queueMicrotask(() => {
    wakeQueued = false;
    wakeWaiters();
  });
};

/** Releases a slot taken by `tryTakeSlot`, then wakes the hosts the cap turned away. */
export function returnSlot(): void {
  if (slotsTaken === 0) return;
  slotsTaken -= 1;
  queueWake();
}

/** Internal: slots in use. Read by the unit tests; the component never calls it. */
export function slotUseCount(): number {
  return slotsTaken;
}

/** Internal: hosts waiting for a slot. Read by the unit tests; the component never calls it. */
export function slotWaiterCount(): number {
  return slotWaiters.size;
}

let paintable: boolean | null = null;

/**
 * Whether this page can paint a displacement map: a canvas with no 2d context
 * hands back an empty filter, which would bend nothing while holding a slot.
 * Asked once per page, before any host takes a slot, because the answer cannot
 * change without a reload.
 */
export function canBuildFilters(): boolean {
  if (typeof document === "undefined") return false;
  paintable ??= (() => {
    const canvas = document.createElement("canvas");
    return canvas.getContext("2d") !== null;
  })();
  return paintable;
}
