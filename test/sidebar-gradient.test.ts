/**
 * Sidebar gradient guard. The image is generated from token primitives, so a token
 * change must not silently leave the committed file behind, and both packages must
 * ship the same picture. CI runs `bun test`, so this is the gate; `bun run assets`
 * rewrites the files after a token change.
 *
 * The comparison is on decoded pixels, not on file bytes: deflate output differs
 * between zlib builds (macOS here, Linux in CI) while the picture stays identical.
 */
import { describe, expect, test } from "bun:test";

import { buildSidebarGradient, decodePng, OUTPUTS, renderPixels } from "../scripts/generate-sidebar-gradient.mjs";

const repo = `${import.meta.dir}/..`;
const expected = renderPixels();

describe("sidebar gradient", () => {
  test("the generated PNG is a 280×760 8-bit RGB image", () => {
    const { width, height, pixels } = decodePng(buildSidebarGradient());
    expect(width).toBe(280);
    expect(height).toBe(760);
    expect(pixels).toEqual(expected);
  });

  test("the ramp never gets lighter from top to bottom", () => {
    // Row mean, not one pixel: the ±0.5 LSB dither moves single pixels either way.
    const luma = (row: number) => {
      let total = 0;
      for (let x = 0; x < 280; x += 1) {
        const offset = (row * 280 + x) * 3;
        total += 0.2126 * expected[offset] + 0.7152 * expected[offset + 1] + 0.0722 * expected[offset + 2];
      }
      return total / 280;
    };
    // The dither adds up to 1 LSB of row-to-row wobble on top of the ramp, so the
    // direction is asserted with that tolerance rather than exactly.
    let smallestStep = Number.POSITIVE_INFINITY;
    for (let row = 0; row < 759; row += 1) {
      smallestStep = Math.min(smallestStep, luma(row) - luma(row + 1));
    }
    expect(smallestStep).toBeGreaterThanOrEqual(-1);
  });

  for (const relative of OUTPUTS) {
    test(`${relative} matches the generator`, async () => {
      const committed = Buffer.from(await Bun.file(`${repo}/${relative}`).arrayBuffer());
      const { width, height, pixels } = decodePng(committed);
      expect({ width, height }).toEqual({ width: 280, height: 760 });
      expect(pixels).toEqual(expected);
    });
  }
});
