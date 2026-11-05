import { defineMessages } from "@/i18n";

/** Landing page copy: hero, stats, principles, component index teaser, mascot teaser, entry cards. */
export const homeMessages = defineMessages({
  eyebrow: { ko: "Horon Design System", en: "Horon Design System" },

  tagline: { ko: "AI that turns ideas into action.", en: "AI that turns ideas into action." },
  origin: { ko: "Horus × ON", en: "Horus × ON" },
  promise: { ko: "The vision of Horus. The power to act.", en: "The vision of Horus. The power to act." },

  body: {
    ko: "데이터를 이해하는 것에서 끝나지 않고 실행과 결과까지 연결하는 시스템. 그 시스템을 지탱하는 토큰과 컴포넌트를 하나의 기준으로 정의합니다. 디자인과 코드가 같은 값을 바라봅니다.",
    en: "A system that connects understanding data to execution and results. It defines the tokens and components that hold that system together on one basis, so design and code read the same values.",
  },

  start: { ko: "시작하기", en: "Get started" },
  browseComponents: { ko: "컴포넌트 둘러보기", en: "Browse components" },

  mascotAlt: { ko: "Horon 마스코트", en: "Horon mascot" },
  cutSuffix: { ko: "컷", en: "cut" },

  statComponents: { ko: "Components", en: "Components" },
  statPreviews: { ko: "Live previews", en: "Live previews" },
  statCuts: { ko: "Mascot cuts", en: "Mascot cuts" },
  statPlatforms: { ko: "Platforms", en: "Platforms" },
  platformValue: { ko: "Web · Native", en: "Web · Native" },

  principlesEyebrow: { ko: "Principles", en: "Principles" },
  principlesTitle: { ko: "세 가지 원칙", en: "Three principles" },
  principlesBody: {
    ko: "Horon의 UI는 잉크와 종이 위에 하늘색 액센트 하나만 얹습니다. 떠 있는 표면은 유리로, 계층과 상태는 글자와 여백으로 드러냅니다.",
    en: "Horon UI puts a single sky accent on ink and paper. Floating surfaces are glass; hierarchy and state show through type and whitespace.",
  },
  principleInkTitle: { ko: "Ink and paper", en: "Ink and paper" },
  principleInkBody: {
    ko: "표면은 흰 종이, 글자와 버튼은 잉크입니다. 계층은 색보다 글자와 여백으로 드러냅니다.",
    en: "Surfaces are white paper; text and buttons are ink. Hierarchy comes from type and whitespace before color.",
  },
  principleGlassTitle: { ko: "Liquid glass", en: "Liquid glass" },
  principleGlassBody: {
    ko: "떠 있는 표면은 유리입니다. 흐림과 경계선이 표면 높이에 비례해 Figma와 같은 질감을 냅니다.",
    en: "Floating surfaces are glass. Blur and edges scale with surface height, matching the Figma texture.",
  },
  principleSourceTitle: { ko: "Same source", en: "Same source" },
  principleSourceBody: {
    ko: "값은 Figma 변수에서 읽어 토큰 한 곳에 둡니다. 디자인과 코드가 같은 이름, 같은 값을 씁니다.",
    en: "Values are read from Figma variables and kept in one token source. Design and code use the same names and the same values.",
  },

  componentsEyebrow: { ko: "Components", en: "Components" },
  componentsUnit: { ko: "개 컴포넌트", en: " components" },
  groupsUnit: { ko: "개 그룹", en: " groups" },
  allComponents: { ko: "전체 목록 →", en: "All components →" },
  groupCountUnit: { ko: " components", en: " components" },
  openGroup: { ko: "보기", en: "Open" },

  mascotEyebrow: { ko: "Mascot", en: "Mascot" },
  mascotTitleLead: { ko: "둥근 매, ", en: "A round falcon, " },
  mascotTitleTail: { ko: "가지 표정", en: " expressions" },
  mascotBody: {
    ko: "Horus × ON에서 온 마스코트입니다. 빈 상태, 오류, 로딩처럼 화면이 말을 걸어야 할 때 대신 표정을 짓습니다. 1254 × 1254 투명 PNG로 모든 컷을 내려받을 수 있습니다.",
    en: "A mascot from Horus × ON. It holds the expression when a screen needs to say something: empty states, errors, loading. Every cut downloads as a 1254 × 1254 transparent PNG.",
  },
  viewMascot: { ko: "마스코트 보기", en: "View mascot" },

  foundationsTitle: { ko: "Foundations", en: "Foundations" },
  foundationsBody: {
    ko: "색, 글자, 간격, 반경, 유리 표면까지 모든 시각 결정의 값과 규칙.",
    en: "Values and rules for every visual decision, from color, type, spacing, and radius to glass surfaces.",
  },
  getStartedTitle: { ko: "Get Started", en: "Get Started" },
  getStartedBody: {
    ko: "설치하고 첫 화면을 만드는 데 필요한 최소 절차.",
    en: "The minimum steps from install to a first screen.",
  },
  componentsTitle: { ko: "Components", en: "Components" },
  componentsBody: {
    ko: "컴포넌트 목록과 라이브 프리뷰, 코드 예시.",
    en: "The component list with live previews and code examples.",
  },
  openCard: { ko: "열기", en: "Open" },
});
