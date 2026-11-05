import { defineMessages } from "@/i18n";

/** Copy for `/foundations/color`: the two color layers and the ten token groups. */
export const foundationsColorMessages = defineMessages({
  title: { ko: "Color", en: "Color" },
  description: {
    ko: "잉크와 흰 종이가 기본이고, 하늘색(sky)을 브랜드 액센트로 씁니다. 위험 상태는 채도를 낮춘 붉은색 하나로 표시합니다.",
    en: "Ink and white paper form the backbone, with sky as the brand accent. Danger uses one muted red.",
  },
  intro: {
    ko: "색은 두 층입니다. 프리미티브는 Figma Primitives 컬렉션의 원시 값이고, 시맨틱은 컴포넌트가 실제로 참조하는 변수입니다. 다크 모드에서 바뀌는 것은 시맨틱 층뿐입니다. 견본의 왼쪽 반은 라이트, 오른쪽 반은 다크 값입니다.",
    en: "Color has two layers. Primitives are the raw values in the Figma Primitives collection; semantic tokens are the variables components reference. Dark mode changes only the semantic layer. The left half of each sample is the light value and the right half the dark value.",
  },
  primitivesHeading: { ko: "Primitives", en: "Primitives" },
  primitivesBody: {
    ko: "컴포넌트가 직접 쓰는 프리미티브는 이것뿐입니다. 아바타 타일, 프로젝트 타일, 진행 막대처럼 시맨틱 이름이 없는 자리에 씁니다.",
    en: "These are the only primitives components use directly. They fill places that have no semantic name, such as avatar tiles, project tiles and progress bars.",
  },
  backgroundGroup: { ko: "Background", en: "Background" },
  surfaceGroup: { ko: "Surface", en: "Surface" },
  textGroup: { ko: "Text", en: "Text" },
  borderGroup: { ko: "Border", en: "Border" },
  interactiveGroup: { ko: "Interactive", en: "Interactive" },
  statusGroup: { ko: "Status", en: "Status" },
  glassGroup: { ko: "Glass", en: "Glass" },
  overlayGroup: { ko: "Overlay", en: "Overlay" },
  accentGroup: { ko: "Accent", en: "Accent" },
  syntaxGroup: { ko: "Syntax", en: "Syntax" },
});
