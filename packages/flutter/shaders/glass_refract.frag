// 리퀴드 글래스의 굴절입니다. `ui.ImageFilter.shader`가 백드롭을 입력 텍스처로 묶고
// 이 셰이더가 둥근 사각형 가장자리에서 그 텍스처를 안쪽으로 당깁니다.
//
// React 쪽 엔진(`packages/react/src/lib/glass/map.ts`, `filters.ts`)의 이식입니다.
// 변위 세기는 가장자리에서 안쪽으로 (1 - x)^2로 줄어들고, 세기는 반경이 정합니다
// (`glassScale` = 띠 너비 × 1.5, 8~36px). 샘플한 색은 CSS `feColorMatrix saturate`
// 1.2로 채도를 올립니다.
//
// 유니폼 계약(엔진이 채우는 것):
//   uSize      — `ImageFilter.shader`가 요구하는 첫 vec2. 입력 텍스처 크기(px)입니다.
//   uBackdrop  — 첫 sampler2D. 필터 입력입니다.
// 나머지 넷은 호출자가 채우고, 전부 "호스트 높이로 나눈 값"입니다. 그래야 텍스처가
// 논리 픽셀이든 기기 픽셀이든 같은 모양이 나옵니다.

#version 460 core
#include <flutter/runtime_effect.glsl>

uniform vec2 uSize;
uniform sampler2D uBackdrop;
uniform float uRadius;
uniform float uBezel;
uniform float uScale;
uniform float uSaturation;

out vec4 fragColor;

void main() {
  vec2 uv = FlutterFragCoord().xy / uSize;
#ifdef IMPELLER_TARGET_OPENGLES
  uv.y = 1.0 - uv.y;
#endif

  float aspect = uSize.x / uSize.y;
  // uv는 축마다 0~1이라 폭이 넓은 도형에서는 x가 눌린 채 비교됩니다. x만 aspect로
  // 늘려 정사각형 좌표계로 옮겨야 오른쪽 가장자리도 같은 거리로 판정됩니다.
  vec2 point = vec2(uv.x * aspect, uv.y);
  vec2 halfSize = vec2(0.5 * aspect, 0.5);
  vec2 p = point - halfSize;
  // 모서리 중심에서 잰 상자 거리입니다. 음수는 도형 안쪽입니다.
  vec2 d = abs(p) - (halfSize - vec2(uRadius));
  float outside = length(max(d, vec2(0.0))) + min(max(d.x, d.y), 0.0);
  float depth = uRadius - outside;

  vec2 offset = vec2(0.0);
  if (depth > 0.0 && depth < uBezel) {
    float ratio = depth / uBezel;
    float magnitude = (1.0 - ratio) * (1.0 - ratio);
    vec2 normal;
    if (d.x > 0.0 && d.y > 0.0) {
      normal = normalize(sign(p) * d);
    } else if (d.x > d.y) {
      normal = vec2(sign(p.x), 0.0);
    } else {
      normal = vec2(0.0, sign(p.y));
    }
    // 가장자리 픽셀이 도형 더 안쪽의 배경을 읽도록 안쪽으로 당깁니다.
    offset = -normal * magnitude * uScale;
  }

  vec4 color = texture(uBackdrop, uv + offset / vec2(aspect, 1.0));
  float luma = dot(color.rgb, vec3(0.2126, 0.7152, 0.0722));
  fragColor = vec4(mix(vec3(luma), color.rgb, uSaturation), color.a);
}
