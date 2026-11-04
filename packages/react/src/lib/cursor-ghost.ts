/**
 * Cursor Ghost: copies of the arrow trail behind the real one as a motion smear.
 *
 * The native cursor is never hidden or replaced. The ghosts live in one fixed,
 * `pointer-events: none`, `aria-hidden` layer on top of the page, so they never
 * take clicks, hovers or focus. The effect only mounts on a fine hover pointer
 * without `prefers-reduced-motion: reduce`, and re-checks both on change.
 *
 * Importing `@horon-ai/react` (or `@horon-ai/react/cursor-ghost`) mounts it once
 * per page. Put `data-horon-cursor="off"` on `<html>` before that import to opt
 * out, then call `mountCursorGhost()` yourself for custom options.
 */

export type CursorGhostOptions = {
  /** Number of arrow copies. */
  ghosts?: number;
  /** Arrow height in CSS px. */
  size?: number;
  /** Lerp factor of the first copy toward the pointer, per frame. */
  headFollow?: number;
  /** Blur spread of the last copy in CSS px. */
  smear?: number;
  /** Arrow fill. Blended with `difference`, so white reads dark on light pages. */
  color?: string;
};

const DEFAULTS: Required<CursorGhostOptions> = { ghosts: 5, size: 26, headFollow: 0.16, smear: 14, color: "#FFFFFF" };

const ENABLE_QUERY = "(hover: hover) and (pointer: fine)";
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
const INTERACTIVE = "a, button, input";
const OPT_OUT_ATTRIBUTE = "data-horon-cursor";
const AUTO_MOUNT_KEY = Symbol.for("horon.cursorGhost");

/** Arrow drawn in a 24-unit box; its tip sits at (3, 2). */
const ARROW_PATH = "M3 2v18.2l5-4.7 3.4 7.6 3.2-1.4-3.3-7.5H18Z";
const ARROW_TIP = { x: 3, y: 2 };
const ARROW_BOX = 24;

/** Each copy follows the one ahead of it more loosely than the last. */
const FOLLOW_DECAY = 0.78;
const HEAD_OPACITY = 0.55;
/** Trail strength while the pointer is over `a, button, input`. */
const INTERACTIVE_INTENSITY = 0.5;
const SETTLE_EPSILON = 0.05;

const SVG_NS = "http://www.w3.org/2000/svg";

function startEffect({ ghosts, size, headFollow, smear, color }: Required<CursorGhostOptions>): () => void {
  const count = Math.max(1, Math.round(ghosts));
  const scale = size / ARROW_BOX;
  const tipX = ARROW_TIP.x * scale;
  const tipY = ARROW_TIP.y * scale;
  const fadeDistance = size * 0.5;

  const layer = document.createElement("div");
  layer.setAttribute("aria-hidden", "true");
  layer.setAttribute("data-horon-cursor-ghost", "");
  Object.assign(layer.style, {
    position: "fixed",
    inset: "0",
    pointerEvents: "none",
    zIndex: "2147483647",
    overflow: "hidden",
    mixBlendMode: "difference",
    contain: "strict",
    visibility: "hidden",
  });

  const nodes: SVGSVGElement[] = [];
  const follow = new Float32Array(count);
  const baseOpacity = new Float32Array(count);
  const xs = new Float32Array(count);
  const ys = new Float32Array(count);

  for (let i = 0; i < count; i += 1) {
    const progress = (i + 1) / count;
    follow[i] = headFollow * FOLLOW_DECAY ** i;
    baseOpacity[i] = HEAD_OPACITY * (1 - i / count);

    const svg = document.createElementNS(SVG_NS, "svg");
    svg.setAttribute("viewBox", `0 0 ${ARROW_BOX} ${ARROW_BOX}`);
    svg.setAttribute("width", String(size));
    svg.setAttribute("height", String(size));
    const path = document.createElementNS(SVG_NS, "path");
    path.setAttribute("d", ARROW_PATH);
    path.setAttribute("fill", color);
    svg.append(path);
    Object.assign(svg.style, {
      position: "absolute",
      left: "0",
      top: "0",
      overflow: "visible",
      opacity: "0",
      // CSS blur takes a standard deviation; half the smear spreads it about `smear` px.
      filter: `blur(${((smear * progress) / 2).toFixed(2)}px)`,
      willChange: "transform, opacity",
    });
    nodes.push(svg);
  }
  // Paint the most blurred copy first so the sharpest one sits on top.
  layer.append(...nodes.toReversed());
  document.body.append(layer);

  let pointerX = 0;
  let pointerY = 0;
  let present = false;
  let intensity = 1;
  let targetIntensity = 1;
  let frame = 0;

  const tick = () => {
    frame = 0;
    intensity += (targetIntensity - intensity) * 0.2;
    let leaderX = pointerX;
    let leaderY = pointerY;
    let moving = Math.abs(targetIntensity - intensity) > 0.01;

    for (let i = 0; i < count; i += 1) {
      const dx = leaderX - xs[i];
      const dy = leaderY - ys[i];
      if (Math.abs(dx) > SETTLE_EPSILON || Math.abs(dy) > SETTLE_EPSILON) {
        xs[i] += dx * follow[i];
        ys[i] += dy * follow[i];
        moving = true;
      } else {
        xs[i] = leaderX;
        ys[i] = leaderY;
      }
      const distance = Math.hypot(pointerX - xs[i], pointerY - ys[i]);
      const node = nodes[i];
      node.style.transform = `translate3d(${(xs[i] - tipX).toFixed(2)}px, ${(ys[i] - tipY).toFixed(2)}px, 0)`;
      node.style.opacity = (baseOpacity[i] * Math.min(1, distance / fadeDistance) * intensity).toFixed(3);
      leaderX = xs[i];
      leaderY = ys[i];
    }

    if (moving) frame = requestAnimationFrame(tick);
  };

  const wake = () => {
    if (!frame) frame = requestAnimationFrame(tick);
  };

  const onPointerMove = (event: PointerEvent) => {
    if (event.pointerType === "touch") return;
    pointerX = event.clientX;
    pointerY = event.clientY;
    if (!present) {
      // Start every copy at the pointer instead of sweeping in from the corner.
      xs.fill(pointerX);
      ys.fill(pointerY);
      present = true;
      layer.style.visibility = "visible";
    }
    const target = event.target;
    targetIntensity = target instanceof Element && target.closest(INTERACTIVE) ? INTERACTIVE_INTENSITY : 1;
    wake();
  };

  const onPointerOut = (event: PointerEvent) => {
    if (event.relatedTarget) return;
    present = false;
    layer.style.visibility = "hidden";
  };

  const onBlur = () => {
    present = false;
    layer.style.visibility = "hidden";
  };

  window.addEventListener("pointermove", onPointerMove, { passive: true });
  document.addEventListener("pointerout", onPointerOut, { passive: true });
  window.addEventListener("blur", onBlur);

  return () => {
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
    window.removeEventListener("pointermove", onPointerMove);
    document.removeEventListener("pointerout", onPointerOut);
    window.removeEventListener("blur", onBlur);
    layer.remove();
  };
}

/**
 * Mounts the Cursor Ghost trail and returns its teardown. The trail appears and
 * disappears on its own as the pointer type or the reduced-motion setting changes.
 */
export function mountCursorGhost(options: CursorGhostOptions = {}): () => void {
  if (typeof window === "undefined" || typeof document === "undefined" || !window.matchMedia) return () => {};
  const config = { ...DEFAULTS, ...options };
  const enable = window.matchMedia(ENABLE_QUERY);
  const reducedMotion = window.matchMedia(REDUCED_MOTION_QUERY);
  let stop: (() => void) | null = null;

  const sync = () => {
    const wanted = enable.matches && !reducedMotion.matches;
    if (wanted && !stop) stop = startEffect(config);
    else if (!wanted && stop) {
      stop();
      stop = null;
    }
  };

  let started = false;
  const begin = () => {
    started = true;
    sync();
    enable.addEventListener("change", sync);
    reducedMotion.addEventListener("change", sync);
  };
  if (document.body) begin();
  else document.addEventListener("DOMContentLoaded", begin, { once: true });

  return () => {
    document.removeEventListener("DOMContentLoaded", begin);
    if (!started) return;
    enable.removeEventListener("change", sync);
    reducedMotion.removeEventListener("change", sync);
    stop?.();
    stop = null;
  };
}

function autoMount() {
  if (typeof window === "undefined" || typeof document === "undefined") return;
  const registry = globalThis as typeof globalThis & { [AUTO_MOUNT_KEY]?: true };
  if (registry[AUTO_MOUNT_KEY]) return;
  if (document.documentElement.getAttribute(OPT_OUT_ATTRIBUTE) === "off") return;
  registry[AUTO_MOUNT_KEY] = true;
  mountCursorGhost();
}

autoMount();
