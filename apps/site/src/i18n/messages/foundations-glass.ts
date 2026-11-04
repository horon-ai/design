import { defineMessages } from "@/i18n";

/** Copy for `/foundations/glass`: layer recipe, refraction support and usage. */
export const foundationsGlassMessages = defineMessages({
  title: { ko: "Glass", en: "Glass" },
  description: {
    ko: "Figma의 Liquid layers를 그대로 옮긴 유리 표면입니다. 흐림과 경계선이 표면 높이에 비례합니다.",
    en: "A glass surface that copies Figma's Liquid layers. Blur and border scale with the surface height.",
  },
  layersHeading: { ko: "레이어", en: "Layers" },
  layersBody: {
    ko: "유리는 채움색(glass-clear, glass-regular, glass-thick) 위에 세 장의 레이어를 겹친 것입니다. Figma는 이 묶음 전체를 {opacity}% 마스크로 덮어서, 모든 레이어가 {opacity}% 세기로 그려집니다. 칩은 Paper의 Texture층을 하나 더 얹고, 배경을 휘게 하는 엔진에서는 refraction층이, 그렇지 않은 엔진에서는 rim sheen이 표면 가장자리를 대신합니다.",
    en: "Glass stacks three layers over a fill (glass-clear, glass-regular, glass-thick). Figma covers the whole group with a {opacity}% mask, so every layer is drawn at {opacity}% strength. A chip adds Paper's Texture layer; engines that can bend the backdrop use the refraction layer, and the others use a rim sheen at the surface edge instead.",
  },
  tintItem: {
    ko: "Tint: {color}, 배경 흐림 {blur}px",
    en: "Tint: {color}, {blur}px backdrop blur",
  },
  innerShadeItem: {
    ko: "Inner shade: {color}, 흐림 {blur}px, 여백은 높이의 1/14 (위아래 최대 {maxY}px, 좌우 최대 {maxX}px)",
    en: "Inner shade: {color}, {blur}px blur, inset at 1/14 of the height (up to {maxY}px vertically and {maxX}px horizontally)",
  },
  edgeItem: {
    ko: "Soft light edge: {color}, 테두리 1px, 흐림 clamp(0.75, 1.5H/84, 1.5)px",
    en: "Soft light edge: {color}, 1px border, clamp(0.75, 1.5H/84, 1.5)px blur",
  },
  textureItem: {
    ko: "Texture(칩만): 흰색 3% 바탕을 위아래 -9px, 좌우 -8px로 넓히고 2px 흐림을 겁니다",
    en: "Texture (chips only): a white 3% fill extended by -9px vertically and -8px horizontally, blurred by 2px",
  },
  heightNote: {
    ko: "H는 표면 높이입니다. 레이어 묶음을 CSS 크기 컨테이너로 만들어 100cqh로 높이를 읽기 때문에, 32px 칩부터 큰 카드까지 Figma와 같은 비율로 흐려집니다.",
    en: "H is the surface height. The layer group is a CSS size container, so 100cqh reads that height: a 32px chip and a large card blur at the same ratio as in Figma.",
  },
  refractionHeading: { ko: "굴절", en: "Refraction" },
  refractionBody: {
    ko: "Chromium 계열 브라우저(Chrome, Edge, Arc, Android Chrome, Windows 데스크톱 앱)에서는 패키지가 직접 만든 SVG 변위 필터가 뒤 배경을 표면 가장자리에서 휘게 합니다. 칩이나 버튼처럼 작은 표면뿐 아니라 카드, 시트처럼 큰 사각형도 같은 방식으로 휘고, 같은 크기의 표면은 필터 하나를 나눠 씁니다.",
    en: "In Chromium browsers (Chrome, Edge, Arc, Android Chrome and the Windows desktop app) an SVG displacement filter built by the package bends the backdrop at the surface edge. Small surfaces such as chips and buttons bend the same way as large rectangles like cards and sheets, and surfaces of the same size share one filter.",
  },
  refractionFallbackLead: {
    ko: "Safari, iOS의 모든 브라우저, Firefox, macOS 데스크톱 앱은 배경에 SVG 필터를 걸지 못합니다 (",
    en: "Safari, every iOS browser, Firefox and the macOS desktop app cannot filter the backdrop (",
  },
  refractionFallbackTail: {
    ko: "). 이 엔진에서는 위의 CSS 레이어에 rim sheen(밝은 테두리)을 더한 흐린 유리로 그립니다.",
    en: "). On these engines the CSS layers above plus a rim sheen (a light border) draw the blurred glass.",
  },
  ruleLimit: {
    ko: "한 번에 굴절하는 표면은 16개까지이고, 터치 기기에서는 6개까지입니다.",
    en: "Up to 16 surfaces refract at once, and up to 6 on touch devices.",
  },
  ruleOffscreen: {
    ko: "화면 밖 표면과 터치 기기에서 너무 큰 표면은 굴절하지 않습니다.",
    en: "Surfaces outside the viewport, and surfaces that are too large on touch devices, do not refract.",
  },
  ruleReducedTransparency: {
    ko: "투명도 줄이기 설정이 켜져 있거나 backdrop-filter를 지원하지 않으면 불투명한 흐린 표면이 됩니다.",
    en: "With reduced transparency enabled, or without backdrop-filter support, the surface becomes an opaque frost.",
  },
  ruleRefractOff: {
    ko: "<LiquidGlass refract={false} />처럼 refract를 끄면 굴절만 사라집니다.",
    en: "Turning refract off, as in <LiquidGlass refract={false} />, removes only the bending.",
  },
  usageHeading: { ko: "쓰는 법", en: "Usage" },
});
