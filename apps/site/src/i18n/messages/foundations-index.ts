import { defineMessages } from "@/i18n";

/** Copy for `/foundations`: the section intro and the six foundation cards. */
export const foundationsIndexMessages = defineMessages({
  title: { ko: "Foundations", en: "Foundations" },
  description: {
    ko: "Horon의 화면을 이루는 가장 아래 층입니다. 색, 글자, 간격, 반경, 유리 표면의 값과 그 값을 언제 쓰는지 정리했습니다.",
    en: "The bottom layer of every Horon screen: values for color, type, spacing, radius and liquid glass, and when to use each one.",
  },
  intro: {
    ko: "모든 값은 Figma Horon 파일의 변수에서 읽어 @horon-ai/tokens에 한 번만 적었습니다. 이 문서의 수치와 견본도 그 패키지에서 읽어 그리므로, 문서와 라이브러리가 서로 다른 값을 보여줄 수 없습니다.",
    en: "Every value is read from the Figma Horon file and written once in @horon-ai/tokens. This page draws its numbers and samples from the same package, so the docs and the library cannot show different values.",
  },
  designTokenTitle: { ko: "Design Token", en: "Design Token" },
  designTokenBody: {
    ko: "Figma 변수에서 읽은 값을 하나의 패키지에서 웹 CSS로 냅니다.",
    en: "Values read from Figma variables, shipped as web CSS from one package.",
  },
  colorTitle: { ko: "Color", en: "Color" },
  colorBody: {
    ko: "라이트·다크 시맨틱 색과 sky·red 프리미티브.",
    en: "Light and dark semantic colors, plus the sky and red primitives.",
  },
  typographyTitle: { ko: "Typography", en: "Typography" },
  typographyBody: {
    ko: "13개 글자 스타일의 Web·Desktop·Mobile 크기와 자간.",
    en: "Web, Desktop and Mobile sizes and tracking for 13 text styles.",
  },
  spacingTitle: { ko: "Spacing", en: "Spacing" },
  spacingBody: {
    ko: "2px부터 32px까지의 간격 스케일.",
    en: "A spacing scale from 2px to 32px.",
  },
  radiusTitle: { ko: "Radius", en: "Radius" },
  radiusBody: {
    ko: "반경 7단과 떠 있는 표면의 그림자 2종.",
    en: "Seven radius steps and two shadows for raised surfaces.",
  },
  glassTitle: { ko: "Glass", en: "Glass" },
  glassBody: {
    ko: "높이에 비례해 흐려지는 리퀴드 글래스 레이어.",
    en: "Liquid glass layers that blur in proportion to surface height.",
  },
  flowHeading: { ko: "값의 흐름", en: "How values flow" },
  flowBody: {
    ko: "Figma 변수(Primitives → Semantic, Type, Scale) → @horon-ai/tokens의 TypeScript 값 → 생성된 theme.css → 컴포넌트의 Tailwind 클래스 순서로 흐릅니다. 변수 이름은 Figma Dev Mode의 WEB 코드와 같아서 var(--color-text-primary)가 양쪽에서 같은 값입니다. 다크 모드는 시맨틱 층의 값만 바뀝니다.",
    en: "Values flow from Figma variables (Primitives → Semantic, Type, Scale) to TypeScript values in @horon-ai/tokens, then to the generated theme.css, then to component Tailwind classes. A variable name matches the WEB code in Figma Dev Mode, so var(--color-text-primary) holds the same value in both places. Dark mode changes only the semantic layer.",
  },
  count: {
    ko: "사이드바의 항목이 Foundations의 전체 목록입니다. 항목 수는 {count}개입니다.",
    en: "The sidebar lists every Foundations page. {count} entries.",
  },
});
