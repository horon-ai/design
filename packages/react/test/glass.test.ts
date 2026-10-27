import { describe, expect, test } from "bun:test";

import { tryTakeSlot, returnSlot } from "../src/lib/glass/filters";
import { buildDisplacementMap, glassBezel, glassKey, glassScale, normalizeShape } from "../src/lib/glass/map";
import { MAX_REFRACTING, areaAllowed, engineRefracts, type RefractionEnv } from "../src/lib/glass/support";

const MAP_SHAPE = { width: 200, height: 100, radius: 16 };

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

  test("caps refraction slots by pointer type", () => {
    for (const [coarsePointer, cap] of [
      [false, MAX_REFRACTING.fine],
      [true, MAX_REFRACTING.coarse],
    ] as const) {
      let taken = 0;
      while (tryTakeSlot(coarsePointer)) taken += 1;
      expect(taken).toBe(cap);
      for (let index = 0; index < taken; index += 1) returnSlot();
      expect(tryTakeSlot(coarsePointer)).toBe(true);
      returnSlot();
    }
  });

  test("keeps the slot count at zero when it is returned more often than taken", () => {
    returnSlot();
    returnSlot();
    let taken = 0;
    while (tryTakeSlot(false)) taken += 1;
    expect(taken).toBe(MAX_REFRACTING.fine);
    for (let index = 0; index < taken; index += 1) returnSlot();
  });
});
