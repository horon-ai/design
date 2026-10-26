import type { LiquidGLLens, LiquidGLOptions } from "./liquid-gl.js";

/**
 * WebGL refraction for the glass surfaces, drawn by liquid-gl.
 *
 * liquid-gl hides its target (opacity 0, no pointer events) and paints the
 * refracted page into one shared canvas appended to <body>. So the lens target is
 * never the interactive host: it is an empty, aria-hidden span inside the
 * `LiquidGlass` layer group. The host is lifted to z-index 1 over that canvas
 * (`[data-liquid="on"]` in globals.css), so its translucent fill, edges and
 * content sit on top of the refraction.
 *
 * The look follows the Figma glass, which was tuned as frosted glass: a strong
 * blur, little refraction and a faint rim. liquid-gl's own `frost` samples 16
 * random points and turns grainy at Figma's blur, so the blur comes from a
 * low-resolution snapshot (0.1, liquid-gl's minimum) sampled bilinearly instead,
 * which is smooth.
 */
const LENS: Omit<LiquidGLOptions, "target"> = {
  snapshot: "body",
  resolution: 0.1,
  zIndex: 1,
  refraction: 0.03,
  aberration: 0.02,
  bevelDepth: 0.12,
  bevelWidth: 0.25,
  frost: 0,
  shadow: false,
  specular: true,
  reveal: "none",
  tint: null,
};

type Entry = { target: HTMLElement; host: HTMLElement; lens?: LiquidGLLens; observer?: MutationObserver };

const entries = new Map<string, Entry>();
let pending = new Set<string>();
let flushQueued = false;
let nextId = 0;
let enabled = true;

function supported(): boolean {
  if (typeof window === "undefined" || !enabled) return false;
  if (window.matchMedia?.("(prefers-reduced-transparency: reduce)").matches) return false;
  return true;
}

/**
 * The shared canvas sits at z-index 0 in the body stacking context. A host that
 * is its own stacking context (dimmed when disabled, transformed, or inside a
 * popup layer) would be painted under that canvas as one unit, so it keeps the
 * CSS-only glass instead.
 */
function eligible(host: HTMLElement): boolean {
  if (getComputedStyle(host).position === "static") return false;
  for (let node: HTMLElement | null = host; node && node !== document.body; node = node.parentElement) {
    const style = getComputedStyle(node);
    if (Number.parseFloat(style.opacity) < 1) return false;
    if (style.transform !== "none" || style.filter !== "none" || style.isolation === "isolate") return false;
    if (style.scale !== "none" || style.rotate !== "none" || style.translate !== "none") return false;
    if (style.position !== "static" && style.zIndex !== "auto" && node !== host) return false;
    if (style.position === "fixed" || style.position === "sticky") return false;
  }
  return true;
}

function setActive(entry: Entry, active: boolean) {
  if (active) entry.host.dataset.liquid = "on";
  else delete entry.host.dataset.liquid;
}

/** Glass must refract what is behind it, not its own fill and text. */
function excludeFromSnapshot(host: HTMLElement) {
  host.setAttribute("data-liquid-ignore", "");
}

function detach(entry: Entry) {
  entry.lens?.destroy();
  entry.lens = undefined;
  setActive(entry, false);
}

async function flush() {
  flushQueued = false;
  const ids = [...pending].filter((id) => {
    const entry = entries.get(id);
    return entry && !entry.lens && eligible(entry.host);
  });
  pending = new Set();
  if (ids.length === 0) return;
  const { default: liquidGL } = await import("./liquid-gl.js");
  if (!liquidGL) return;
  const live = ids.filter((id) => entries.get(id)?.target.isConnected);
  if (live.length === 0) return;
  const result = liquidGL({
    ...LENS,
    target: live.map((id) => `[data-liquid-lens="${id}"]`).join(","),
  });
  const lenses = result === undefined ? [] : Array.isArray(result) ? result : [result];
  for (const lens of lenses) {
    const id = lens.el.dataset.liquidLens;
    const entry = id ? entries.get(id) : undefined;
    if (!entry) {
      lens.destroy();
      continue;
    }
    entry.lens = lens;
    setActive(entry, true);
  }
}

function schedule(id: string) {
  pending.add(id);
  if (flushQueued) return;
  flushQueued = true;
  requestAnimationFrame(() => {
    void flush();
  });
}

/** Registers a lens target; returns the cleanup. Hosts that become ineligible fall back to CSS glass. */
export function attachRefraction(target: HTMLElement): () => void {
  const host = target.parentElement?.parentElement;
  if (!host || !supported()) return () => undefined;
  const id = String(nextId++);
  target.dataset.liquidLens = id;
  const entry: Entry = { target, host };
  excludeFromSnapshot(host);
  entries.set(id, entry);
  entry.observer = new MutationObserver(() => {
    if (eligible(host)) {
      if (!entry.lens) schedule(id);
    } else if (entry.lens) {
      detach(entry);
    }
  });
  entry.observer.observe(host, { attributes: true, attributeFilter: ["class", "style", "disabled", "data-disabled"] });
  schedule(id);
  return () => {
    entry.observer?.disconnect();
    detach(entry);
    entries.delete(id);
    pending.delete(id);
    host.removeAttribute("data-liquid-ignore");
  };
}

/** Turns WebGL refraction on or off for every glass surface, for example from a settings toggle. */
export function setLiquidRefraction(on: boolean) {
  enabled = on;
  for (const [id, entry] of entries) {
    if (on) schedule(id);
    else detach(entry);
  }
}
