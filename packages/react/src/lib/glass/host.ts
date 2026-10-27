/**
 * One glass host's ownership of its refraction slot and its filter.
 *
 * The slot and the filter are one life, not two: a host takes both at the same
 * moment and hands both back from one place, so no path can return a slot
 * without its filter, keep a filter the page no longer holds, or leave a
 * `--glass-refract-filter` pointing at a removed element. Every way a host can
 * stop refracting runs the same release — unmount, a size change, a scroll out
 * of view, or removal from the document, which the observers report as a zero
 * size.
 *
 * The machine holds no DOM: size, visibility and the shape arrive as calls, and
 * the slot, filter, waiter and timer come in as dependencies. The whole
 * lifecycle is therefore driven in a test without a document or a clock.
 */

import type { GlassShape } from "./map";

/** How long a host waits with one size before it asks for a filter again, so a dragged edge does not rebuild a map per frame. */
const SETTLE_MS = 150;

export type HostSize = { width: number; height: number };

/** Timers, injected so a test runs the settle without waiting; the handle stays opaque to the machine. */
export type GlassHostScheduler<Handle> = {
  /** Runs `task` after `ms`, and hands back the handle `cancel` takes. */
  after: (ms: number, task: () => void) => Handle;
  cancel: (handle: Handle) => void;
};

export type GlassHostDeps<Handle> = {
  /** Reserves one page slot; false when the cap turned this host away. */
  takeSlot: () => boolean;
  /** Hands the slot this host holds back. */
  returnSlot: () => void;
  /** Takes one use of the filter for `shape`; empty when the engine cannot build one. */
  acquireFilter: (shape: GlassShape) => string;
  /** Drops the one use `acquireFilter` granted. */
  releaseFilter: (shape: GlassShape) => void;
  /** Subscribes to "a slot freed"; returns the unsubscribe the host calls when it stops waiting. */
  waitForSlot: (wake: () => void) => () => void;
  /** The shape to refract with, or null when this host may not (area cap, no area). */
  shapeFor: (size: HostSize) => GlassShape | null;
  /** Reports the filter this host now renders with, or null when it refracts nothing. */
  onChange: (filterId: string | null) => void;
  scheduler: GlassHostScheduler<Handle>;
  settleMs?: number;
};

/** What the machine holds right now; for diagnostics and tests. */
export type GlassHostState = {
  alive: boolean;
  visible: boolean;
  size: HostSize | null;
  held: GlassShape | null;
  waiting: boolean;
  scheduled: boolean;
};

export type GlassHost = {
  /** The host reported a new layout size. */
  sizeChanged: (width: number, height: number) => void;
  /** The host entered or left the viewport. */
  visibilityChanged: (visible: boolean) => void;
  /** The host is gone: no slot, filter or waiter is left behind. */
  destroy: () => void;
  /** Diagnostics and tests only. */
  inspect: () => GlassHostState;
};

export function createGlassHost<Handle>(deps: GlassHostDeps<Handle>): GlassHost {
  const settleMs = deps.settleMs ?? SETTLE_MS;
  let alive = true;
  let visible = false;
  let size: HostSize | null = null;
  let held: { shape: GlassShape; filterId: string } | null = null;
  let waiterOff: (() => void) | null = null;
  let timer: Handle | null = null;
  let reported = false;

  /** Drops the waiter first, so a wake that is already running cannot reach a host that stopped waiting. */
  const stopWaiting = (): void => {
    const off = waiterOff;
    waiterOff = null;
    off?.();
  };

  const clearTimer = (): void => {
    if (timer === null) return;
    const handle = timer;
    timer = null;
    deps.scheduler.cancel(handle);
  };

  /**
   * The one release path. Whatever the host holds goes back exactly once, the
   * waiter is dropped, the settle timer is cancelled, and the rendered filter id
   * is cleared even when nothing was held, so a stale `url(#…)` cannot survive.
   */
  const releaseAll = (): void => {
    clearTimer();
    stopWaiting();
    if (held) {
      const { shape } = held;
      held = null;
      deps.releaseFilter(shape);
      deps.returnSlot();
    }
    deps.onChange(null);
  };

  /**
   * Exactly one waiter, whose callback leaves the waiting state before it
   * retries. The registry drops the subscription before it wakes the waiter, so
   * clearing `waiterOff` here never rewinds the host into a half-subscribed
   * state.
   */
  const startWaiting = (): void => {
    if (waiterOff) return;
    waiterOff = deps.waitForSlot(() => {
      waiterOff = null;
      tryAcquire();
    });
  };

  /** The only way in: everything this host renders goes through here, and only while it is alive, visible, sized and under the cap. */
  function tryAcquire(): void {
    if (!alive || held || !visible || !size) return;
    const { width, height } = size;
    if (width <= 0 || height <= 0) return;
    const shape = deps.shapeFor(size);
    if (!shape) {
      stopWaiting();
      return;
    }
    if (!deps.takeSlot()) {
      startWaiting();
      return;
    }
    clearTimer();
    stopWaiting();
    const filterId = deps.acquireFilter(shape);
    if (!filterId) {
      deps.returnSlot();
      return;
    }
    held = { shape, filterId };
    deps.onChange(filterId);
  }

  const sizeChanged = (width: number, height: number): void => {
    if (!alive) return;
    size = { width, height };
    releaseAll();
    if (width <= 0 || height <= 0) return;
    if (!reported) {
      reported = true;
      tryAcquire();
      return;
    }
    timer = deps.scheduler.after(settleMs, () => {
      timer = null;
      tryAcquire();
    });
  };

  const visibilityChanged = (next: boolean): void => {
    if (!alive) return;
    visible = next;
    if (!next) {
      releaseAll();
      return;
    }
    tryAcquire();
  };

  return {
    sizeChanged,
    visibilityChanged,
    destroy: () => {
      if (!alive) return;
      alive = false;
      visible = false;
      size = null;
      reported = false;
      releaseAll();
    },
    inspect: () => ({
      alive,
      visible,
      size,
      held: held?.shape ?? null,
      waiting: waiterOff !== null,
      scheduled: timer !== null,
    }),
  };
}
