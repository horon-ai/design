/**
 * Displacement maps for the in-house liquid glass engine.
 *
 * One map is drawn per rounded rectangle, at the shape's exact CSS pixel size,
 * and shared by every host whose shape normalizes to the same key. Red and green
 * carry the horizontal and vertical offset to sample from, 128 means "no
 * offset", which is the encoding `feDisplacementMap` reads with
 * `xChannelSelector="R"` and `yChannelSelector="G"`.
 *
 * Pure TypeScript on purpose: no browser API and no global state, so a map can
 * be built in a worker, in a test, and wherever the DOM is unavailable.
 */

export type GlassShape = {
  /** Layout width in CSS pixels. */
  width: number;
  /** Layout height in CSS pixels. */
  height: number;
  /** Corner radius in CSS pixels, clamped to half the shorter side. */
  radius: number;
};

/** A channel value of 128 leaves the sample point where it is. */
const NEUTRAL = 128;
const CHANNEL_RANGE = 127;
const PROFILE_EXPONENT = 4;
const MIN_BEZEL = 6;
const MAX_BEZEL = 24;
const MIN_SCALE = 8;
const MAX_SCALE = 36;
const SCALE_PER_BEZEL = 1.5;
const BEZEL_SHARE = 0.25;
const FULLY_OPAQUE = 255;

const clamp = (value: number, lowest: number, highest: number): number => Math.min(Math.max(value, lowest), highest);

const roundToHalf = (value: number): number => Math.round(value * 2) / 2;

const toPixels = (value: number): number => (Number.isFinite(value) ? Math.max(1, Math.round(value)) : 1);

/**
 * Rounds a shape to whole CSS pixels and pulls its radius onto the 0.5 step
 * inside half of the shorter side, so a host that animates its radius by a
 * fraction of a pixel does not mint a new map.
 *
 * Zero or negative input lands on a 1x1 shape rather than throwing: a host with
 * no area has no edge to bend, and the caller still gets a usable map.
 */
export function normalizeShape(shape: GlassShape): GlassShape {
  const width = toPixels(shape.width);
  const height = toPixels(shape.height);
  const largestRadius = Math.floor(Math.min(width, height) / 2);
  const radius = Number.isFinite(shape.radius) ? clamp(roundToHalf(shape.radius), 0, largestRadius) : 0;
  return { width, height, radius };
}

/** Cache key of the normalized shape, e.g. `120x40r20`. */
export function glassKey(shape: GlassShape): string {
  const { width, height, radius } = normalizeShape(shape);
  return `${width}x${height}r${radius}`;
}

/**
 * Width of the band along the edge where the backdrop bends: a quarter of the
 * shorter side, kept between 6 and 24 px, and never wider than the corner it
 * has to bend around.
 */
export function glassBezel(shape: GlassShape): number {
  const { width, height, radius } = normalizeShape(shape);
  const band = clamp(Math.round(Math.min(width, height) * BEZEL_SHARE), MIN_BEZEL, MAX_BEZEL);
  return Math.min(band, Math.max(radius, MIN_BEZEL));
}

/** Longest displacement in px, the value the filter receives as its `scale`. */
export function glassScale(shape: GlassShape): number {
  return clamp(Math.round(glassBezel(shape) * SCALE_PER_BEZEL), MIN_SCALE, MAX_SCALE);
}

type MapGeometry = {
  radius: number;
  bezel: number;
  halfWidth: number;
  halfHeight: number;
  innerWidth: number;
  innerHeight: number;
};

type Channels = { red: number; green: number };

const NEUTRAL_CHANNELS: Channels = { red: NEUTRAL, green: NEUTRAL };

const geometryOf = ({ width, height, radius }: GlassShape): MapGeometry => {
  const halfWidth = width / 2;
  const halfHeight = height / 2;
  return {
    radius,
    bezel: glassBezel({ width, height, radius }),
    halfWidth,
    halfHeight,
    innerWidth: halfWidth - radius,
    innerHeight: halfHeight - radius,
  };
};

/**
 * Colours one pixel centre.
 *
 * The pixel's distance to the rounded edge, inside positive, is `radius` minus
 * the box distance of the corner centres. Inside the bezel band the magnitude
 * follows the convex squircle profile, 1 at the edge and 0 at the inner end of
 * the band, and the displacement points inward, so an edge pixel samples the
 * backdrop from further inside the shape.
 */
const channelsAt = (column: number, row: number, geometry: MapGeometry): Channels => {
  const dx = column + 0.5 - geometry.halfWidth;
  const dy = row + 0.5 - geometry.halfHeight;
  const qx = Math.abs(dx) - geometry.innerWidth;
  const qy = Math.abs(dy) - geometry.innerHeight;
  const outside = Math.hypot(Math.max(qx, 0), Math.max(qy, 0)) + Math.min(Math.max(qx, qy), 0);
  const depth = geometry.radius - outside;
  if (depth <= 0 || depth >= geometry.bezel) return NEUTRAL_CHANNELS;

  const ratio = depth / geometry.bezel;
  const magnitude = 1 - (1 - (1 - ratio) ** PROFILE_EXPONENT) ** (1 / PROFILE_EXPONENT);
  let normalX = 0;
  let normalY = 0;
  if (qx > 0 && qy > 0) {
    const length = Math.hypot(qx, qy);
    normalX = (Math.sign(dx) * qx) / length;
    normalY = (Math.sign(dy) * qy) / length;
  } else if (qx > qy) {
    normalX = Math.sign(dx);
  } else {
    normalY = Math.sign(dy);
  }

  return {
    red: Math.round(NEUTRAL + CHANNEL_RANGE * -normalX * magnitude),
    green: Math.round(NEUTRAL + CHANNEL_RANGE * -normalY * magnitude),
  };
};

const writePixel = (data: Uint8ClampedArray, index: number, red: number, green: number): void => {
  data[index] = red;
  data[index + 1] = green;
  data[index + 2] = NEUTRAL;
  data[index + 3] = FULLY_OPAQUE;
};

/**
 * RGBA map for the shape, one pixel per CSS px of the normalized shape, ready
 * for `putImageData`. Only the top-left quadrant is measured; the other three
 * mirror it, with red flipped as `256 - red` and green as `256 - green`, so a
 * symmetric shape costs a quarter of the distance work. Both flips stay inside
 * the 0..255 a `Uint8ClampedArray` holds, because a computed channel never
 * leaves 1..255.
 */
export function buildDisplacementMap(shape: GlassShape): { width: number; height: number; data: Uint8ClampedArray } {
  const { width, height, radius } = normalizeShape(shape);
  const data = new Uint8ClampedArray(width * height * 4);
  if (width === 1 && height === 1) {
    writePixel(data, 0, NEUTRAL, NEUTRAL);
    return { width, height, data };
  }

  const geometry = geometryOf({ width, height, radius });
  const lastColumn = Math.floor((width - 1) / 2);
  const lastRow = Math.floor((height - 1) / 2);
  for (let row = 0; row <= lastRow; row += 1) {
    const mirroredRow = height - 1 - row;
    const top = row * width;
    const bottom = mirroredRow * width;
    for (let column = 0; column <= lastColumn; column += 1) {
      const { red, green } = channelsAt(column, row, geometry);
      const mirroredColumn = width - 1 - column;
      const mirroredRed = 256 - red;
      const mirroredGreen = 256 - green;
      writePixel(data, (top + column) * 4, red, green);
      writePixel(data, (bottom + column) * 4, red, mirroredGreen);
      if (mirroredColumn === column) continue;
      writePixel(data, (top + mirroredColumn) * 4, mirroredRed, green);
      writePixel(data, (bottom + mirroredColumn) * 4, mirroredRed, mirroredGreen);
    }
  }
  return { width, height, data };
}
