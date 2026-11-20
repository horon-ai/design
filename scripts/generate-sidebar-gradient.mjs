/**
 * `sidebar-photo.jpg` 자리를 대신하는 브랜드 그라디언트를 만듭니다.
 *
 * 사진의 출처와 라이선스가 확인되지 않아 사진 대신 토큰 램프만으로 결정적인 이미지를
 * 만듭니다. 이 스크립트는 `packages/tokens/src/color.ts`의 프리미티브 값만 입력으로 받고
 * 픽셀 계산과 PNG 인코딩을 직접 하므로, 같은 토큰이면 어느 기기에서든 같은 그림이 나옵니다.
 *
 * 결과 PNG는 저장소에 커밋합니다. `@horon-ai/react`·`@horon-ai/lynx`는 `src/`를 그대로
 * 배포하므로 소비자 앱이 빌드 때 이미지를 만들 수 없고, CSS는 정적 URL만 참조합니다.
 * 다시 만들려면 design/에서 `bun run assets`, 커밋본이 같은 그림인지 확인하려면
 * `bun run assets:check`를 실행합니다.
 *
 * 검사는 압축 바이트가 아니라 **픽셀**을 비교합니다. deflate 출력은 zlib 구현과 CPU에
 * 따라 달라질 수 있지만(로컬 macOS·CI Linux), 압축을 푼 픽셀은 같기 때문입니다.
 *
 * 세로 램프인 이유는 사진이 하단 고정 `cover`로 잘려도 위에서 아래로 어두워지는 방향이
 * 유지되고, 사이드바가 화면 높이만큼 길어져 이미지 전체가 보일 때도 자연스럽기 때문입니다.
 * 램프 계단이 띠로 보이지 않도록 1 LSB 진폭의 Bayer 8×8 디더를 넣습니다.
 */

import { writeFile } from "node:fs/promises";

import { deflateSync, inflateSync } from "node:zlib";

import { primitives } from "../packages/tokens/src/color.ts";

/** Paper 사이드바 이미지의 원래 크기입니다. CSS의 `cover`·`50% 100%`와 함께 씁니다. */
const WIDTH = 280;
const HEIGHT = 760;

/**
 * 램프의 정지점입니다. 값은 전부 토큰 프리미티브이고 여기에 직접 색을 적지 않습니다.
 *
 * 280×384 열에서는 이미지의 아래 절반만 보이므로(`cover`, 하단 고정) 0.5 지점이 화면에
 * 보이는 맨 위 행입니다. 그 자리를 `sky-300`에 두면 55% 흰 막을 씌운 뒤 값이 이전 사진의
 * 밝은 상단과 거의 같고, 맨 아래 `sky-700`도 이전 사진의 어두운 하단과 거의 같습니다.
 * 두 끝을 맞춰 두면 글자 대비와 열의 시각 무게가 회귀하지 않습니다.
 */
const STOPS = [
  [0, "sky-100"],
  [0.5, "sky-300"],
  [0.66, "sky-400"],
  [0.78, "sky-500"],
  [0.9, "sky-600"],
  [1, "sky-700"],
];

/** 생성물 경로입니다. 두 패키지가 같은 바이트를 들고 있어야 합니다. */
export const OUTPUTS = [
  "packages/react/src/assets/sidebar-gradient.png",
  "packages/lynx/src/assets/sidebar-gradient.png",
];

const REPO = new URL("../", import.meta.url);

/** `#rrggbb`를 0~255 세 채널로 풉니다. */
function hexToRgb(hex) {
  const value = Number.parseInt(hex.slice(1), 16);
  return [(value >> 16) & 0xff, (value >> 8) & 0xff, value & 0xff];
}

/** 정지점을 RGB 램프로 바꿉니다. 토큰 이름이 없으면 여기서 바로 실패합니다. */
function buildRamp() {
  return STOPS.map(([at, name]) => {
    const hex = primitives[name];
    if (hex === undefined) throw new Error(`unknown token primitive: ${name}`);
    return { at, rgb: hexToRgb(hex) };
  });
}

/** 1 LSB 진폭의 Bayer 8×8 행렬입니다. 램프 계단을 섞어 띠를 없앱니다. */
const BAYER = [
  [0, 32, 8, 40, 2, 34, 10, 42],
  [48, 16, 56, 24, 50, 18, 58, 26],
  [12, 44, 4, 36, 14, 46, 6, 38],
  [60, 28, 52, 20, 62, 30, 54, 22],
  [3, 35, 11, 43, 1, 33, 9, 41],
  [51, 19, 59, 27, 49, 17, 57, 25],
  [15, 47, 7, 39, 13, 45, 5, 37],
  [63, 31, 55, 23, 61, 29, 53, 21],
];

/** 행 하나가 놓인 정지점 구간과 보간 비율입니다. */
function rampAt(row) {
  const t = row / (HEIGHT - 1);
  let index = 0;
  while (index < STOPS.length - 2 && t > STOPS[index + 1][0]) index += 1;
  const start = STOPS[index][0];
  const end = STOPS[index + 1][0];
  return { index, mix: (t - start) / (end - start) };
}

/** 280×760 RGB 픽셀입니다. */
export function renderPixels() {
  const ramp = buildRamp();
  const pixels = Buffer.alloc(WIDTH * HEIGHT * 3);
  for (let y = 0; y < HEIGHT; y += 1) {
    const { index, mix } = rampAt(y);
    const from = ramp[index].rgb;
    const to = ramp[index + 1].rgb;
    for (let x = 0; x < WIDTH; x += 1) {
      const dither = (BAYER[y % 8][x % 8] + 0.5) / 64 - 0.5;
      const offset = (y * WIDTH + x) * 3;
      for (let channel = 0; channel < 3; channel += 1) {
        const value = from[channel] + (to[channel] - from[channel]) * mix + dither;
        pixels[offset + channel] = Math.max(0, Math.min(255, Math.round(value)));
      }
    }
  }
  return pixels;
}

/** PNG 청크 하나입니다. 길이·타입·데이터·CRC 순서입니다. */
function chunk(type, data) {
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type, "latin1"), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(Bun.hash.crc32(body) >>> 0);
  return Buffer.concat([length, body, crc]);
}

/** 필터 0(없음)으로 각 행을 그대로 넣습니다. 행 안이 거의 일정해 필터가 이득이 없습니다. */
function encodePng(pixels) {
  const header = Buffer.alloc(13);
  header.writeUInt32BE(WIDTH, 0);
  header.writeUInt32BE(HEIGHT, 4);
  header[8] = 8; // bit depth
  header[9] = 2; // color type: truecolor RGB
  header[10] = 0; // compression
  header[11] = 0; // filter
  header[12] = 0; // interlace

  const stride = WIDTH * 3;
  const raw = Buffer.alloc((stride + 1) * HEIGHT);
  for (let y = 0; y < HEIGHT; y += 1) {
    raw[y * (stride + 1)] = 0;
    pixels.copy(raw, y * (stride + 1) + 1, y * stride, (y + 1) * stride);
  }

  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk("IHDR", header),
    chunk("IDAT", deflateSync(raw, { level: 9 })),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

/** 8비트 트루컬러 PNG 하나를 풀어 RGB 픽셀로 돌려줍니다. */
export function decodePng(buffer) {
  const signature = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
  for (let i = 0; i < signature.length; i += 1) {
    if (buffer[i] !== signature[i]) throw new Error("not a PNG");
  }

  let offset = 8;
  let width = 0;
  let height = 0;
  const idat = [];
  while (offset < buffer.length) {
    const length = buffer.readUInt32BE(offset);
    const type = buffer.toString("latin1", offset + 4, offset + 8);
    const data = buffer.subarray(offset + 8, offset + 8 + length);
    offset += length + 12;
    if (type === "IHDR") {
      width = data.readUInt32BE(0);
      height = data.readUInt32BE(4);
      if (data[8] !== 8 || data[9] !== 2 || data[12] !== 0) {
        throw new Error("expected an 8-bit non-interlaced RGB PNG");
      }
    } else if (type === "IDAT") {
      idat.push(data);
    } else if (type === "IEND") {
      break;
    }
  }

  const raw = inflateSync(Buffer.concat(idat));
  const stride = width * 3;
  const pixels = Buffer.alloc(stride * height);
  for (let y = 0; y < height; y += 1) {
    const filter = raw[y * (stride + 1)];
    const line = raw.subarray(y * (stride + 1) + 1, (y + 1) * (stride + 1));
    const out = pixels.subarray(y * stride, (y + 1) * stride);
    const prior = y === 0 ? undefined : pixels.subarray((y - 1) * stride, y * stride);
    for (let x = 0; x < stride; x += 1) {
      const left = x >= 3 ? out[x - 3] : 0;
      const up = prior === undefined ? 0 : prior[x];
      const upLeft = prior === undefined || x < 3 ? 0 : prior[x - 3];
      let value = line[x];
      if (filter === 1) value += left;
      else if (filter === 2) value += up;
      else if (filter === 3) value += (left + up) >> 1;
      else if (filter === 4) {
        const p = left + up - upLeft;
        const pa = Math.abs(p - left);
        const pb = Math.abs(p - up);
        const pc = Math.abs(p - upLeft);
        value += pa <= pb && pa <= pc ? left : pb <= pc ? up : upLeft;
      } else if (filter !== 0) throw new Error(`unknown PNG filter ${filter}`);
      out[x] = value & 0xff;
    }
  }

  return { width, height, pixels };
}

/** 이 스크립트가 만드는 PNG 바이트입니다. */
export function buildSidebarGradient() {
  return encodePng(renderPixels());
}

if (import.meta.main) {
  const check = process.argv.includes("--check");
  const png = buildSidebarGradient();
  const expected = renderPixels();
  const problems = [];

  for (const relative of OUTPUTS) {
    const url = new URL(relative, REPO);
    if (!check) {
      await writeFile(url, png);
      console.log(`wrote ${relative} (${png.length} bytes)`);
      continue;
    }

    const committed = Buffer.from(await Bun.file(url).arrayBuffer()).subarray();
    let decoded;
    try {
      decoded = decodePng(committed);
    } catch (error) {
      problems.push(`${relative}: ${error.message}`);
      continue;
    }
    if (decoded.width !== WIDTH || decoded.height !== HEIGHT) {
      problems.push(`${relative}: ${decoded.width}×${decoded.height}, expected ${WIDTH}×${HEIGHT}`);
      continue;
    }
    if (!decoded.pixels.equals(expected)) {
      const first = decoded.pixels.findIndex((value, index) => value !== expected[index]);
      problems.push(`${relative}: pixel ${first} differs from the generator output`);
    }
  }

  if (problems.length > 0) {
    console.error(`sidebar gradient is stale\n${problems.join("\n")}\nrun \`bun run assets\``);
    process.exit(1);
  }
  if (check) console.log("sidebar gradient matches the generator");
}
