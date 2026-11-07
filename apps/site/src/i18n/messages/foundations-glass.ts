import { defineMessages } from "@/i18n";

/** Copy for `/foundations/glass`: the one glass material, its three layers and usage. */
export const foundationsGlassMessages = defineMessages({
  title: { ko: "Glass", en: "Glass" },
  description: {
    ko: "web, desktop, iOS, Android가 같은 값으로 그리는 유리 표면입니다.",
    en: "A glass surface that web, desktop, iOS and Android draw from the same values.",
  },
  layersHeading: { ko: "레이어", en: "Layers" },
  layersBody: {
    ko: "아래에서 위로 세 겹입니다. React의 LiquidGlass와 Lynx의 LiquidGlass가 @horon-ai/tokens의 같은 값을 읽습니다. Lynx는 <blur-view>로 배경을 거르고, 이 요소가 채도 값을 받지 않아 흐림만 겁니다. 지원하지 않는 엔진은 glass-fill-frost 채움으로 떨어집니다.",
    en: "Three layers, bottom to top. React's LiquidGlass and Lynx's LiquidGlass read the same values from @horon-ai/tokens. Lynx filters the backdrop with <blur-view>, which takes no saturation value, so it blurs only. Engines without it fall back to the glass-fill-frost fill.",
  },
  backdropItem: {
    ko: "배경: 뒤 내용을 {blur}px 흐리게 하고 채도를 {saturate}%로 올립니다. Lynx의 <blur-view>는 흐림만 겁니다.",
    en: "Backdrop: blurs what is behind by {blur}px and raises saturation to {saturate}%. Lynx's <blur-view> blurs only.",
  },
  fillItem: {
    ko: "채움: glass-clear, glass-regular, glass-thick 중 하나입니다. React와 Lynx 모두 호스트가 칠합니다. Lynx의 HoronProvider는 <blur-view>를 쓸 수 있는 엔진에서 반투명 값으로 바꾸고, 쓸 수 없으면 glass-fill-frost를 유지합니다.",
    en: "Fill: one of glass-clear, glass-regular, or glass-thick. In both React and Lynx the host paints it. Lynx's HoronProvider swaps in the translucent value on engines that can use <blur-view> and keeps glass-fill-frost where it cannot.",
  },
  borderItem: {
    ko: "테두리: 가장자리 안쪽 {width}px 링입니다. 위가 가장 밝고({top}), 가운데에서 옅어졌다가({mid}) 아래에서 조금 다시 밝아집니다({bottom}). 다크 모드는 더 옅습니다.",
    en: "Border: a {width}px ring inside the edge. Brightest at the top ({top}), fading at the middle ({mid}) and brightening a little at the bottom ({bottom}). Darker in dark mode.",
  },
  compatibilityBody: {
    ko: "굴절, 혼합 모드, 높이에 따라 바뀌는 값은 쓰지 않습니다. Safari와 macOS 데스크톱 앱(WKWebView)은 배경을 휘게 할 수 없어서, 모든 플랫폼이 같은 모습이 되도록 모두가 그릴 수 있는 것만 남겼습니다. 그림자도 재질에 넣지 않고, 떠 있는 표면이 shadow 토큰으로 따로 정합니다.",
    en: "No refraction, blend mode, or value that changes with height. Safari and the macOS desktop app (WKWebView) cannot bend the backdrop, so only what every platform can draw remains, which keeps them looking the same. Shadow is not part of the material either: a floating surface sets it separately with the shadow token.",
  },
  hostBorderBody: {
    ko: "호스트에는 자기 테두리를 두지 않습니다. 유리 테두리가 가장자리입니다. 오류 상태(data-invalid)에서는 테두리가 위험 색으로 바뀝니다.",
    en: "The host draws no border of its own; the glass border is the edge. In the invalid state (data-invalid) the border turns to the danger color.",
  },
  fallbackBody: {
    ko: "투명도 줄이기 설정이 켜져 있거나 backdrop-filter를 지원하지 않으면 흐림 대신 glass-fill-frost 채움을 쓰고 테두리는 그대로 둡니다.",
    en: "With reduced transparency enabled, or without backdrop-filter support, the surface uses the glass-fill-frost fill instead of blurring and keeps its border.",
  },
  usageHeading: { ko: "쓰는 법", en: "Usage" },
});
