import { describe, expect, test } from "bun:test";

import { buildDisplacementMap, glassBezel, glassKey, glassScale, normalizeShape } from "../src/lib/glass/map";

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
    expect(redAt(map, 1, 50)).toBeGreaterThan(150);
    expect(Math.abs(greenAt(map, 1, 50) - 128)).toBeLessThanOrEqual(2);
    expect(greenAt(map, 100, 1)).toBeGreaterThan(150);
    expect(Math.abs(redAt(map, 100, 1) - 128)).toBeLessThanOrEqual(2);
    expect(redAt(map, 198, 50)).toBeLessThan(106);
    expect(greenAt(map, 100, 98)).toBeLessThan(106);
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
