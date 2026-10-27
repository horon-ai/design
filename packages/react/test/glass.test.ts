import { afterEach, describe, expect, test } from "bun:test";

import {
  acquireFilter,
  canBuildFilters,
  onSlotFreed,
  releaseFilter,
  returnSlot,
  slotUseCount,
  slotWaiterCount,
  tryTakeSlot,
} from "../src/lib/glass/filters";
import { createGlassHost, type GlassHostDeps } from "../src/lib/glass/host";
import { buildDisplacementMap, glassBezel, glassKey, glassScale, normalizeShape, type GlassShape } from "../src/lib/glass/map";
import { MAX_REFRACTING, areaAllowed, engineRefracts, type RefractionEnv } from "../src/lib/glass/support";

const MAP_SHAPE = { width: 200, height: 100, radius: 16 };

/** Every test in this file leaves the page-wide slot counter and waiter set empty. */
afterEach(() => {
  expect({ slots: slotUseCount(), waiters: slotWaiterCount() }).toEqual({ slots: 0, waiters: 0 });
});

type Map = { width: number; height: number; data: Uint8ClampedArray };

const pixelAt = (map: Map, column: number, row: number): number[] => {
  const index = (row * map.width + column) * 4;
  return [map.data[index], map.data[index + 1], map.data[index + 2], map.data[index + 3]];
};

const redAt = (map: Map, column: number, row: number): number => map.data[(row * map.width + column) * 4];

const greenAt = (map: Map, column: number, row: number): number => map.data[(row * map.width + column) * 4 + 1];

describe("glass map", () => {
  test("leaves the middle of the shape neutral", () => {
    const map = buildDisplacementMap(MAP_SHAPE);
    expect(map.width).toBe(200);
    expect(map.height).toBe(100);
    expect(pixelAt(map, 100, 50)).toEqual([128, 128, 128, 255]);
  });

  test("pulls the backdrop inward at each straight edge", () => {
    const map = buildDisplacementMap(MAP_SHAPE);
    expect(redAt(map, 1, 50)).toBeGreaterThan(200);
    expect(Math.abs(greenAt(map, 1, 50) - 128)).toBeLessThanOrEqual(2);
    expect(greenAt(map, 100, 1)).toBeGreaterThan(200);
    expect(Math.abs(redAt(map, 100, 1) - 128)).toBeLessThanOrEqual(2);
    expect(redAt(map, 198, 50)).toBeLessThan(56);
    expect(greenAt(map, 100, 98)).toBeLessThan(56);
  });

  test("bends hardest at the edge and fades to neutral by the bezel end", () => {
    const map = buildDisplacementMap(MAP_SHAPE);
    const edge = redAt(map, 0, 50);
    const inside = redAt(map, 1, 50);
    const nearBenzel = redAt(map, 5, 50);
    expect(edge).toBeGreaterThan(inside);
    expect(inside).toBeGreaterThan(nearBenzel);
    expect(nearBenzel).toBeGreaterThan(128);
    expect(redAt(map, glassBezel(MAP_SHAPE), 50)).toBe(128);
  });

  test("bends evenly along the diagonal of a round corner", () => {
    const map = buildDisplacementMap({ width: 100, height: 100, radius: 50 });
    const red = redAt(map, 15, 15);
    const green = greenAt(map, 15, 15);
    expect(red).toBeGreaterThan(150);
    expect(green).toBeGreaterThan(150);
    expect(Math.abs(red - green)).toBeLessThanOrEqual(10);
  });

  test("mirrors the computed quadrant across both axes", () => {
    const map = buildDisplacementMap(MAP_SHAPE);
    for (let row = 0; row < map.height; row += 1) {
      for (let column = 0; column < map.width; column += 1) {
        const mirrored = redAt(map, map.width - 1 - column, row);
        expect(Math.abs(redAt(map, column, row) - (256 - mirrored))).toBeLessThanOrEqual(1);
        const flipped = greenAt(map, column, map.height - 1 - row);
        expect(Math.abs(greenAt(map, column, row) - (256 - flipped))).toBeLessThanOrEqual(1);
      }
    }
  });

  test("normalizes to whole pixels and a radius inside the shorter side", () => {
    expect(normalizeShape({ width: 50.4, height: 30.6, radius: 99 })).toEqual({ width: 50, height: 31, radius: 15 });
    expect(normalizeShape({ width: 120, height: 40, radius: 20.4 })).toEqual({ width: 120, height: 40, radius: 20 });
    expect(normalizeShape({ width: 120, height: 40, radius: 19.4 })).toEqual({ width: 120, height: 40, radius: 19.5 });
    expect(normalizeShape({ width: 120, height: 40, radius: -8 })).toEqual({ width: 120, height: 40, radius: 0 });
    expect(normalizeShape({ width: 0.2, height: -4, radius: 2 })).toEqual({ width: 1, height: 1, radius: 0 });
  });

  test("keys the normalized shape", () => {
    expect(glassKey({ width: 50.4, height: 30.6, radius: 99 })).toBe("50x31r15");
    expect(glassKey({ width: 120, height: 40, radius: 20 })).toBe("120x40r20");
    expect(glassKey({ width: 44, height: 44, radius: 22 })).toBe("44x44r22");
  });

  test("keeps the bezel between 6 and 24 and inside the corner", () => {
    expect(glassBezel({ width: 200, height: 100, radius: 16 })).toBe(16);
    expect(glassBezel({ width: 2000, height: 2000, radius: 1000 })).toBe(24);
    expect(glassBezel({ width: 200, height: 100, radius: 0 })).toBe(6);
    expect(glassBezel({ width: 20, height: 20, radius: 2 })).toBe(6);
  });

  test("keeps the displacement scale between 8 and 36 for every size", () => {
    for (const width of [1, 2, 10, 44, 100, 390, 1440, 2000]) {
      for (const height of [1, 2, 10, 44, 100, 560, 1440, 2000]) {
        for (const radius of [0, Math.min(width, height) / 4, Math.min(width, height) / 2]) {
          const scale = glassScale({ width, height, radius });
          expect(scale).toBeGreaterThanOrEqual(8);
          expect(scale).toBeLessThanOrEqual(36);
        }
      }
    }
  });

  test("returns a neutral map for a shape with no area", () => {
    for (const shape of [
      { width: 0, height: 0, radius: 0 },
      { width: 0, height: -5, radius: -3 },
      { width: -20, height: -20, radius: 4 },
    ]) {
      const map = buildDisplacementMap(shape);
      expect(map.width).toBe(1);
      expect(map.height).toBe(1);
      expect(map.data.length).toBe(4);
      expect(pixelAt(map, 0, 0)).toEqual([128, 128, 128, 255]);
    }
  });

  test("keeps a partly degenerate shape at a usable size", () => {
    const map = buildDisplacementMap({ width: Number.NaN, height: 12, radius: 4 });
    expect(map.width).toBe(1);
    expect(map.height).toBe(12);
    expect(map.data.length).toBe(map.width * map.height * 4);
  });
});

const CHROME_MAC_UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";
const SAFARI_UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0 Safari/605.1.15";
const FIREFOX_UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:133.0) Gecko/20100101 Firefox/133.0";
const CRIOS_UA =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/131.0.6778.73 Mobile/15E148 Safari/604.1";

const env = (overrides: Partial<RefractionEnv>): RefractionEnv => ({
  userAgent: "",
  brands: [],
  reducedTransparency: false,
  coarsePointer: false,
  ...overrides,
});

describe("glass support", () => {
  test("refracts in Chromium, whatever the brand list calls it", () => {
    expect(engineRefracts(env({ userAgent: CHROME_MAC_UA, brands: ["Chromium", "Google Chrome"] }))).toBe(true);
    expect(engineRefracts(env({ brands: ["Chromium", "Microsoft Edge"] }))).toBe(true);
  });

  test("falls back to the user agent only when the browser reports no brands", () => {
    expect(engineRefracts(env({ userAgent: CHROME_MAC_UA }))).toBe(true);
    expect(engineRefracts(env({ userAgent: CHROME_MAC_UA, brands: ["Not?A_Brand"] }))).toBe(false);
  });

  test("keeps frosted glass in every non-Chromium engine", () => {
    expect(engineRefracts(env({ userAgent: SAFARI_UA }))).toBe(false);
    expect(engineRefracts(env({ userAgent: FIREFOX_UA }))).toBe(false);
    expect(engineRefracts(env({ userAgent: CRIOS_UA }))).toBe(false);
    expect(
      engineRefracts(
        env({
          userAgent:
            "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Chrome/131.0.0.0 Mobile/15E148 Safari/604.1",
        }),
      ),
    ).toBe(false);
  });

  test("never refracts when transparency is reduced, even in Chromium", () => {
    expect(engineRefracts(env({ userAgent: CHROME_MAC_UA, brands: ["Chromium"], reducedTransparency: true }))).toBe(
      false,
    );
  });

  test("allows area up to the pointer's budget on the normalized shape", () => {
    expect(areaAllowed({ width: 500, height: 500, radius: 0 }, true)).toBe(true);
    expect(areaAllowed({ width: 600, height: 600, radius: 0 }, true)).toBe(false);
    expect(areaAllowed({ width: 700, height: 800, radius: 0 }, false)).toBe(true);
    expect(areaAllowed({ width: 800, height: 800, radius: 0 }, false)).toBe(false);
    expect(areaAllowed({ width: 500.6, height: 500, radius: 0 }, true)).toBe(false);
    expect(areaAllowed({ width: 500.4, height: 500, radius: 0 }, true)).toBe(true);
  });

  test("caps refraction slots by pointer type", async () => {
    await drainSlots();
    for (const [coarsePointer, cap] of [
      [false, MAX_REFRACTING.fine],
      [true, MAX_REFRACTING.coarse],
    ] as const) {
      let taken = 0;
      while (tryTakeSlot(coarsePointer)) taken += 1;
      expect(taken).toBe(cap);
      expect(slotUseCount()).toBe(cap);
      for (let index = 0; index < taken; index += 1) returnSlot();
      expect(slotUseCount()).toBe(0);
      expect(tryTakeSlot(coarsePointer)).toBe(true);
      returnSlot();
    }
    expect(slotUseCount()).toBe(0);
    await flushWake();
  });

  test("never drives the slot count below zero", async () => {
    await drainSlots();
    for (let index = 0; index < 5; index += 1) returnSlot();
    expect(slotUseCount()).toBe(0);
    let taken = 0;
    while (tryTakeSlot(false)) taken += 1;
    expect(taken).toBe(MAX_REFRACTING.fine);
    expect(slotUseCount()).toBe(MAX_REFRACTING.fine);
    for (let index = 0; index < taken; index += 1) returnSlot();
    for (let index = 0; index < 3; index += 1) returnSlot();
    await flushWake();
    expect(slotUseCount()).toBe(0);
  });
});

/** A wake is one microtask, so one await reaches the pass the release queued. */
const flushWake = async (): Promise<void> => {
  await Promise.resolve();
};

const drainSlots = async (): Promise<void> => {
  for (let index = 0; index < MAX_REFRACTING.fine; index += 1) returnSlot();
  await flushWake();
};

describe("glass slot waiters", () => {
  test("wakes a denied host once when a slot frees and forgets it", async () => {
    await drainSlots();
    let taken = 0;
    while (tryTakeSlot(false)) taken += 1;
    let wakes = 0;
    onSlotFreed(() => {
      wakes += 1;
    });
    expect(slotWaiterCount()).toBe(1);
    returnSlot();
    await flushWake();
    expect(wakes).toBe(1);
    expect(slotWaiterCount()).toBe(0);
    while (taken > 1) {
      returnSlot();
      taken -= 1;
    }
    await flushWake();
    expect(wakes).toBe(1);
    await drainSlots();
  });

  test("calls a waiter that unsubscribes itself inside its callback only once", async () => {
    await drainSlots();
    let calls = 0;
    const off = onSlotFreed(() => {
      calls += 1;
      off();
    });
    tryTakeSlot(false);
    tryTakeSlot(false);
    returnSlot();
    await flushWake();
    expect(calls).toBe(1);
    returnSlot();
    await flushWake();
    expect(calls).toBe(1);
    expect(slotWaiterCount()).toBe(0);
  });

  test("unsubscribing is idempotent and leaves nothing to wake", async () => {
    await drainSlots();
    let calls = 0;
    const off = onSlotFreed(() => {
      calls += 1;
    });
    off();
    off();
    expect(slotWaiterCount()).toBe(0);
    tryTakeSlot(false);
    returnSlot();
    await flushWake();
    expect(calls).toBe(0);
    await drainSlots();
  });

  test("does not wake a waiter that unsubscribed before the queued wake ran", async () => {
    await drainSlots();
    tryTakeSlot(false);
    let calls = 0;
    const off = onSlotFreed(() => {
      calls += 1;
    });
    returnSlot();
    off();
    await flushWake();
    expect(calls).toBe(0);
    expect(slotWaiterCount()).toBe(0);
    await drainSlots();
  });

  test("does not call a waiter that a sibling removed during the same wake", async () => {
    await drainSlots();
    tryTakeSlot(false);
    let sibling = 0;
    let offSibling: (() => void) | null = null;
    onSlotFreed(() => {
      offSibling?.();
    });
    offSibling = onSlotFreed(() => {
      sibling += 1;
    });
    returnSlot();
    await flushWake();
    expect(sibling).toBe(0);
    expect(slotWaiterCount()).toBe(0);
    await drainSlots();
  });

  test("leaves no listener behind after registering and dropping in a loop", async () => {
    await drainSlots();
    for (let index = 0; index < 100; index += 1) onSlotFreed(() => {})();
    expect(slotWaiterCount()).toBe(0);
  });

  test("builds no filter and no slot outside a browser", async () => {
    await drainSlots();
    expect(canBuildFilters()).toBe(false);
    expect(acquireFilter({ width: 10, height: 10, radius: 2 })).toBe("");
    releaseFilter({ width: 10, height: 10, radius: 2 });
    expect(slotUseCount()).toBe(0);
    let taken = 0;
    while (tryTakeSlot(false)) taken += 1;
    expect(taken).toBe(MAX_REFRACTING.fine);
    await drainSlots();
  });
});

function hostHarness() {
  const slots: { taken: number; cap: number } = { taken: 0, cap: MAX_REFRACTING.fine };
  const waiters = new Set<() => void>();
  const changes: (string | null)[] = [];
  const acquired: GlassShape[] = [];
  const released: GlassShape[] = [];
  const timers: (() => void)[] = [];
  let nextFilter = 0;
  const wake = (): void => {
    for (const waiter of Array.from(waiters)) {
      waiters.delete(waiter);
      waiter();
    }
  };
  const deps: GlassHostDeps<number> = {
    takeSlot: () => {
      if (slots.taken >= slots.cap) return false;
      slots.taken += 1;
      return true;
    },
    returnSlot: () => {
      slots.taken = Math.max(0, slots.taken - 1);
      wake();
    },
    acquireFilter: (shape) => {
      nextFilter += 1;
      acquired.push(shape);
      return `f${nextFilter}`;
    },
    releaseFilter: (shape) => {
      released.push(shape);
    },
    waitForSlot: (waiter) => {
      waiters.add(waiter);
      return () => {
        waiters.delete(waiter);
      };
    },
    shapeFor: ({ width, height }) => ({ width, height, radius: 8 }),
    onChange: (filterId) => {
      changes.push(filterId);
    },
    scheduler: {
      after: (_ms, task) => {
        timers.push(task);
        return timers.length - 1;
      },
      cancel: () => {},
    },
  };
  return { deps, slots, waiters, changes, acquired, released, timers, wake };
}

describe("glass host ownership", () => {
  test("deny, wake, unmount leaves no slot, filter or waiter", () => {
    const harness = hostHarness();
    harness.slots.cap = 0;
    const host = createGlassHost(harness.deps);
    host.sizeChanged(160, 44);
    host.visibilityChanged(true);
    host.visibilityChanged(true);
    expect(harness.waiters.size).toBe(1);
    expect(harness.acquired.length).toBe(0);

    harness.slots.cap = MAX_REFRACTING.fine;
    harness.wake();
    expect(harness.waiters.size).toBe(0);
    expect(harness.slots.taken).toBe(1);
    expect(harness.acquired.length).toBe(1);
    expect(harness.changes.at(-1)).toBe("f1");
    expect(host.inspect().held).toEqual({ width: 160, height: 44, radius: 8 });

    host.destroy();
    expect(harness.slots.taken).toBe(0);
    expect(harness.released.length).toBe(1);
    expect(harness.changes.at(-1)).toBeNull();
    expect(harness.waiters.size).toBe(0);
    expect(host.inspect().held).toBeNull();
    expect(host.inspect().alive).toBe(false);
  });

  test("unmounting while denied frees the waiter and nothing else", () => {
    const harness = hostHarness();
    harness.slots.cap = 0;
    const host = createGlassHost(harness.deps);
    host.sizeChanged(160, 44);
    host.visibilityChanged(true);
    expect(harness.waiters.size).toBe(1);
    host.destroy();
    expect(harness.waiters.size).toBe(0);
    expect(harness.acquired.length).toBe(0);
    expect(harness.slots.taken).toBe(0);
    expect(harness.changes.at(-1)).toBeNull();
  });

  test("a wake that reaches a destroyed host takes nothing", () => {
    const harness = hostHarness();
    harness.slots.cap = 0;
    const host = createGlassHost(harness.deps);
    host.sizeChanged(160, 44);
    host.visibilityChanged(true);
    const stale = Array.from(harness.waiters);
    expect(stale.length).toBe(1);

    host.destroy();
    harness.slots.cap = MAX_REFRACTING.fine;
    for (const wake of stale) wake();
    expect(harness.acquired.length).toBe(0);
    expect(harness.slots.taken).toBe(0);
    expect(harness.changes.at(-1)).toBeNull();
  });

  test("a zero size releases the slot and the filter without scheduling", () => {
    const harness = hostHarness();
    const host = createGlassHost(harness.deps);
    host.sizeChanged(160, 44);
    host.visibilityChanged(true);
    expect(host.inspect().held).not.toBeNull();

    host.sizeChanged(0, 0);
    expect(host.inspect().held).toBeNull();
    expect(host.inspect().scheduled).toBe(false);
    expect(harness.slots.taken).toBe(0);
    expect(harness.released.length).toBe(1);
    expect(harness.changes.at(-1)).toBeNull();
    expect(harness.timers.length).toBe(0);
  });

  test("losing visibility releases and stops waiting", () => {
    const harness = hostHarness();
    const host = createGlassHost(harness.deps);
    host.sizeChanged(160, 44);
    host.visibilityChanged(true);
    expect(host.inspect().held).not.toBeNull();
    host.visibilityChanged(false);
    expect(host.inspect().held).toBeNull();
    expect(harness.slots.taken).toBe(0);

    harness.slots.cap = 0;
    host.visibilityChanged(true);
    expect(harness.waiters.size).toBe(1);
    host.visibilityChanged(false);
    expect(harness.waiters.size).toBe(0);
    expect(harness.acquired.length).toBe(1);
  });

  test("a size change settles before it asks for a filter again", () => {
    const harness = hostHarness();
    const host = createGlassHost(harness.deps);
    host.sizeChanged(160, 44);
    host.visibilityChanged(true);
    expect(harness.acquired.length).toBe(1);

    host.sizeChanged(200, 60);
    expect(host.inspect().held).toBeNull();
    expect(harness.slots.taken).toBe(0);
    expect(harness.acquired.length).toBe(1);
    expect(harness.timers.length).toBe(1);

    harness.timers[0]();
    expect(harness.acquired.length).toBe(2);
    expect(harness.acquired.at(-1)).toEqual({ width: 200, height: 60, radius: 8 });
    expect(harness.slots.taken).toBe(1);
  });

  test("acquires once however often visibility is reported", () => {
    const harness = hostHarness();
    const host = createGlassHost(harness.deps);
    host.sizeChanged(160, 44);
    for (let index = 0; index < 5; index += 1) host.visibilityChanged(true);
    expect(harness.acquired.length).toBe(1);
    expect(harness.slots.taken).toBe(1);
    host.destroy();
    expect(harness.slots.taken).toBe(0);
  });

  test("a host outside its area budget keeps no waiter", () => {
    const harness = hostHarness();
    harness.slots.cap = 0;
    const host = createGlassHost({ ...harness.deps, shapeFor: () => null });
    host.sizeChanged(900, 900);
    host.visibilityChanged(true);
    expect(harness.waiters.size).toBe(0);
    expect(harness.acquired.length).toBe(0);
    expect(host.inspect().waiting).toBe(false);
  });
});

describe("glass host against the shared slot registry", () => {
  const noTimers = {
    after: (_ms: number, _task: () => void) => 0,
    cancel: (_handle: number) => {},
  };

  const mountHost = (width: number, height: number, acquired: string[]) => {
    const host = createGlassHost<number>({
      takeSlot: () => tryTakeSlot(false),
      returnSlot,
      acquireFilter: (shape) => {
        const id = `filter-${glassKey(shape)}`;
        acquired.push(id);
        return id;
      },
      releaseFilter: () => {},
      waitForSlot: onSlotFreed,
      shapeFor: ({ width: w, height: h }) => ({ width: w, height: h, radius: 8 }),
      onChange: () => {},
      scheduler: noTimers,
    });
    host.sizeChanged(width, height);
    host.visibilityChanged(true);
    return host;
  };

  test("mounting past the cap and unmounting every host leaves no slot and no waiter", async () => {
    await drainSlots();
    const acquired: string[] = [];
    const hosts = [];
    for (let index = 0; index < MAX_REFRACTING.fine + 4; index += 1) {
      hosts.push(mountHost(120 + index, 44, acquired));
    }
    expect(slotUseCount()).toBe(MAX_REFRACTING.fine);
    expect(slotWaiterCount()).toBe(4);
    expect(acquired.length).toBe(MAX_REFRACTING.fine);

    for (const host of hosts) host.destroy();
    expect(slotUseCount()).toBe(0);
    expect(slotWaiterCount()).toBe(0);
    for (const host of hosts) {
      expect(host.inspect().held).toBeNull();
      expect(host.inspect().alive).toBe(false);
    }

    await flushWake();
    expect(slotUseCount()).toBe(0);
    expect(acquired.length).toBe(MAX_REFRACTING.fine);
  });

  test("a host that unmounts while denied never takes a slot when the wake arrives", async () => {
    await drainSlots();
    let taken = 0;
    while (tryTakeSlot(false)) taken += 1;
    const acquired: string[] = [];
    const host = mountHost(160, 44, acquired);
    expect(slotWaiterCount()).toBe(1);

    host.destroy();
    expect(slotWaiterCount()).toBe(0);
    for (let index = 0; index < taken; index += 1) returnSlot();
    await flushWake();

    expect(slotUseCount()).toBe(0);
    expect(acquired.length).toBe(0);
    expect(host.inspect().held).toBeNull();
  });
});
