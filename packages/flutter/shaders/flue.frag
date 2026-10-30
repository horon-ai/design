// Flue: 사이드바 뒤에서 타는 연기 그라디언트입니다.
// `packages/react/src/components/flue-background.tsx`의 WebGL2 프래그먼트 셰이더를
// 그대로 옮긴 것입니다. 수식(hash2·snoise·fbm·curl·trail·ramp4·houseGrain·triDither)과
// 상수(OCTAVES 3, TRAIL_TAPS 6)는 원본과 같고, 바뀐 것은 좌표를 얻는 부분뿐입니다.
//
// 유니폼 순서는 `lib/src/glass/glass_shader.dart`의 `horonFlueUniforms`와 같아야 하고,
// 테스트가 두 목록을 대조합니다.

#version 460 core
#include <flutter/runtime_effect.glsl>

uniform vec2 iResolution;
uniform float iTime;
uniform vec2 iMouse;
uniform vec2 iMouseVel;
uniform vec2 iMouseWake;
uniform vec3 uBgColor;
uniform vec3 uColorA;
uniform vec3 uColorB;
uniform vec3 uColorC;
uniform vec3 uColorD;
uniform float uScale;
uniform float uSpeed;
uniform float uFlow;
uniform float uRoughness;
uniform float uLacunarity;
uniform float uSmokeScale;
uniform float uCurl;
uniform float uCurlScale;
uniform float uRise;
uniform float uSlender;
uniform float uWidth;
uniform float uSpread;
uniform float uLean;
uniform float uDensity;
uniform float uContrast;
uniform float uMidpoint;
uniform float uGlow;
uniform float uSink;
uniform float uGrain;
uniform float uDither;
uniform float uVignette;
uniform float uPointerRadius;
uniform float uDraft;
uniform float uPointerStrength;
uniform float uParallax;
uniform float uGrainAnim;

out vec4 fragColor;

#define OCTAVES 3
#define TRAIL_TAPS 6

vec2 hash2(vec2 p) {
  p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
  return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
}

float snoise(vec2 p) {
  const float K1 = 0.366025404;
  const float K2 = 0.211324865;
  vec2 i = floor(p + (p.x + p.y) * K1);
  vec2 a = p - i + (i.x + i.y) * K2;
  float m = step(a.y, a.x);
  vec2 o = vec2(m, 1.0 - m);
  vec2 b = a - o + K2;
  vec2 c = a - 1.0 + 2.0 * K2;
  vec3 h = max(0.5 - vec3(dot(a, a), dot(b, b), dot(c, c)), 0.0);
  vec3 n = h * h * h * h * vec3(dot(a, hash2(i)), dot(b, hash2(i + o)), dot(c, hash2(i + 1.0)));
  return dot(n, vec3(70.0));
}

float fbm(vec2 p) {
  float v = 0.0;
  float amp = 0.5;
  for (int i = 0; i < OCTAVES; i++) {
    v += amp * snoise(p);
    p *= uLacunarity;
    amp *= uRoughness;
  }
  return v;
}

float trail(vec2 uv, float radius) {
  vec2 wob = vec2(snoise(uv * 1.7 + vec2(0.0, iTime * 0.05)), snoise(uv * 1.7 + vec2(4.3, -iTime * 0.04)));
  uv += wob * radius * 0.18;
  float a = 0.0;
  float wsum = 0.0;
  float r2 = max(1e-4, radius * radius);
  for (int i = 0; i < TRAIL_TAPS; i++) {
    float k = float(i) / float(TRAIL_TAPS - 1);
    vec2 c = mix(iMouseWake, iMouse, k);
    vec2 dd = uv - c;
    float w = mix(0.30, 1.0, k);
    a += w * exp(-dot(dd, dd) / r2);
    wsum += w;
  }
  return a / wsum;
}

float potential(vec2 p) {
  return snoise(p) + 0.5 * snoise(p * 2.03 + vec2(3.7, -1.9));
}

vec2 curl(vec2 p, float e) {
  float nx1 = potential(p + vec2(0.0, e));
  float nx2 = potential(p - vec2(0.0, e));
  float ny1 = potential(p + vec2(e, 0.0));
  float ny2 = potential(p - vec2(e, 0.0));
  return vec2(nx1 - nx2, ny2 - ny1) / (2.0 * e);
}

vec3 ramp4(float t) {
  vec3 c = mix(uColorA, uColorB, smoothstep(0.00, 0.36, t));
  c = mix(c, uColorC, smoothstep(0.32, 0.70, t));
  c = mix(c, uColorD, smoothstep(0.66, 1.00, t));
  return c;
}

float triDither(vec2 fc) {
  float a = fract(sin(dot(fc, vec2(12.9898, 78.233))) * 43758.5453);
  float b = fract(sin(dot(fc + 17.0, vec2(12.9898, 78.233))) * 43758.5453);
  return (a + b - 1.0) / 255.0;
}

float houseGrain(vec2 fc) {
  uvec2 q = uvec2(fc) * uvec2(1597334677u, 3812015801u) + uint(floor(iTime * 24.0 * uGrainAnim)) * 2654435769u;
  uint n = q.x ^ q.y;
  n = n * 1664525u + 1013904223u;
  n ^= n >> 16u;
  n *= 2246822519u;
  n ^= n >> 13u;
  float a = float(n & 0xffffu) / 65535.0;
  n *= 3266489917u;
  n ^= n >> 16u;
  float b = float(n & 0xffffu) / 65535.0;
  return a + b - 1.0;
}

void main() {
  // 원본은 gl_FragCoord를 그대로 씁니다. Flutter의 좌표는 위에서 아래로 증가하므로
  // 같은 y-up 픽셀 좌표로 되돌립니다. GLES 백엔드는 y축이 뒤집혀 옵니다.
  vec2 raw = FlutterFragCoord().xy;
#ifdef IMPELLER_TARGET_OPENGLES
  raw.y = iResolution.y - raw.y;
#endif
  vec2 fragCoord = vec2(raw.x, iResolution.y - raw.y);
  vec2 uv = (fragCoord - 0.5 * iResolution) / iResolution.y;
  float t = iTime * uSpeed;
  float tr = trail(uv, uPointerRadius);
  vec2 p = (uv - iMouse * uParallax) * uScale;
  vec2 sp = p + vec2(0.0, -t * uRise);
  vec2 c = curl(sp * uCurlScale + vec2(0.0, t * uFlow), 0.14) * uCurl;
  c += iMouseVel * uDraft * tr;
  vec2 mp = vec2(sp.x, sp.y * uSlender) * uSmokeScale + c;
  float dens = fbm(mp) * 0.5 + 0.5;
  float h = uv.y + 0.55;
  float lean = iMouse.x * uLean * clamp(h, 0.0, 1.6);
  float width = max(0.06, uWidth * (0.45 + uSpread * clamp(h, 0.0, 1.8)));
  float xr = (uv.x - lean) / width;
  float corridor = exp(-xr * xr);
  float cool = smoothstep(-0.65, 0.85, uv.y);
  float smoke = dens * corridor * mix(1.0, 0.30, cool) * uDensity;
  float f = clamp((smoke - uMidpoint) * uContrast + 0.5 + tr * uPointerStrength * 0.30, 0.0, 1.0);
  vec3 col = ramp4(f);
  col += uColorD * uGlow * pow(f, 4.0);
  col = mix(uBgColor, col, smoothstep(0.0, max(0.01, uSink), f) * 0.90 + 0.10);
  col *= 1.0 - uVignette * dot(uv, uv);
  {
    float hgL = clamp(dot(col, vec3(0.299, 0.587, 0.114)), 0.0, 1.0);
    col += houseGrain(fragCoord) * uGrain * mix(1.0, 4.0 * hgL * (1.0 - hgL), 0.6);
  }
  col += triDither(fragCoord) * uDither;
  fragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
}
