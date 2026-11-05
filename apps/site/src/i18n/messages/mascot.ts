import { defineMessages } from "@/i18n";

/** Mascot page copy: intro, site usage cards, palette, group headings, download rules. */
export const mascotMessages = defineMessages({
  pageTitle: { ko: "Mascot", en: "Mascot" },
  description: {
    ko: "Horon의 마스코트는 둥근 매입니다. 이름은 Horus × ON에서 왔고, 26가지 컷을 투명 PNG로 제공합니다.",
    en: "The Horon mascot is a round falcon. The name comes from Horus × ON, and all 26 cuts ship as transparent PNGs.",
  },

  body: {
    ko: "Horus에게서 눈을 받고 ON으로 늘 깨어 있는 둥근 매입니다. 머리는 모서리가 크게 둥근 사각형이고, 그 위에 짧은 깃털 두 가닥이 솟아 있습니다. 얼굴 판은 따뜻한 크림색 타원, 눈은 크고 둥근 검은 눈에 작은 흰 하이라이트가 하나씩 있습니다.",
    en: "A round falcon. Horus gave it the eye, ON keeps it awake. The head is a rectangle with heavily rounded corners and two short feather tufts on top. The face plate is a warm cream oval, and the large round eyes each carry one small white highlight.",
  },

  specCuts: { ko: "Cuts", en: "Cuts" },
  specSize: { ko: "Size", en: "Size" },
  specFormat: { ko: "Format", en: "Format" },

  appliedTitle: { ko: "사이트 적용", en: "Site usage" },
  appliedBody: {
    ko: "이 사이트는 마스코트를 로고와 파비콘, 공유 이미지에 그대로 씁니다.",
    en: "This site uses the mascot as is for the logo, favicons, and share images.",
  },
  lockupTitle: { ko: "Header lockup", en: "Header lockup" },
  designSystem: { ko: "Design System", en: "Design System" },
  logoAlt: { ko: "px 로고", en: "px logo" },
  faviconTitle: { ko: "Favicon · OG", en: "Favicon · OG" },
  faviconAlt: { ko: "파비콘 256px", en: "Favicon 256px" },
  appleIconAlt: { ko: "애플 터치 아이콘", en: "Apple touch icon" },
  ogAlt: { ko: "공유 이미지 미리보기", en: "Share image preview" },

  paletteTitle: { ko: "Brand palette", en: "Brand palette" },

  coreTitle: { ko: "Core poses", en: "Core poses" },
  coreDescription: {
    ko: "캐릭터의 기본 자세 일곱 가지입니다.",
    en: "The seven base poses of the character.",
  },
  stateTitle: { ko: "Product states", en: "Product states" },
  stateDescription: {
    ko: "제품 화면의 상태를 대신 말하는 열아홉 가지 컷입니다.",
    en: "Nineteen cuts that speak for product screen states.",
  },

  mascotAlt: { ko: "Horon 마스코트", en: "Horon mascot" },
  cutSuffix: { ko: "컷", en: "cut" },
  download: { ko: "PNG 내려받기", en: "Download PNG" },

  rulesTitle: { ko: "사용 규칙", en: "Usage rules" },
  rule1: {
    ko: "투명 배경 PNG(1254 × 1254)를 원본으로 쓰고, 이 사이트는 768px WebP로 줄여 제공합니다.",
    en: "Use the transparent 1254 × 1254 PNG as the source; this site serves 768px WebP copies.",
  },
  rule2: {
    ko: "자르지 않고 원본 비율을 유지합니다. 캐릭터 주변 여백은 컷마다 같습니다.",
    en: "Keep the original ratio without cropping. Margin around the character is the same in every cut.",
  },
  rule3: {
    ko: "얼굴 판이 있는 쪽으로 시선을 두고, 캐릭터 위에 텍스트를 얹지 않습니다.",
    en: "Keep the character facing the face plate and never place text over it.",
  },
  rule4: {
    ko: "상태 컷은 화면의 빈 상태·오류·로딩을 대신 말할 때만 씁니다. 장식으로 반복하지 않습니다.",
    en: "Use state cuts only when they replace an empty, error, or loading message. Never repeat them as decoration.",
  },
  rule5: {
    ko: "색은 브랜드 팔레트 세 값만 씁니다. 다른 색으로 다시 칠하지 않습니다.",
    en: "Use only the three brand palette values. Never recolor the mascot.",
  },
});
