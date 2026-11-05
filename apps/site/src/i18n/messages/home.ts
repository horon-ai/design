import { defineMessages } from "@/i18n";

/** Landing page copy: hero, stats, principles, component index teaser, mascot teaser, entry cards. */
export const homeMessages = defineMessages({
  eyebrow: { ko: "Horon Design System", en: "Horon Design System" },

  tagline: { ko: "AI that turns ideas into action.", en: "AI that turns ideas into action." },
  origin: { ko: "Horus × ON", en: "Horus × ON" },
  promise: { ko: "The vision of Horus. The power to act.", en: "The vision of Horus. The power to act." },

  body: {
    ko: "Horon은 데이터를 이해하는 데서 멈추지 않고 실행과 결과까지 이어 갑니다. 이 디자인 시스템은 Horon 화면을 이루는 토큰과 컴포넌트를 한 기준으로 정합니다.",
    en: "Horon carries data past understanding into execution and results. This design system defines, on one basis, the tokens and components that make up every Horon screen.",
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
    ko: "Horon 화면은 잉크와 흰 종이에 하늘색 액센트 하나만 씁니다. 떠 있는 표면은 유리로 만들고, 계층과 상태는 글자와 여백으로 나눕니다.",
    en: "Horon screens use ink and white paper with a single sky accent. Floating surfaces are glass; hierarchy and state come from type and whitespace.",
  },
  principleInkTitle: { ko: "Ink and paper", en: "Ink and paper" },
  principleInkBody: {
    ko: "표면은 흰 종이, 글자와 버튼은 잉크입니다. 색을 더하기 전에 글자와 여백으로 계층을 나눕니다.",
    en: "Surfaces are white paper; text and buttons are ink. Type and whitespace set the hierarchy before color does.",
  },
  principleGlassTitle: { ko: "Liquid glass", en: "Liquid glass" },
  principleGlassBody: {
    ko: "떠 있는 표면은 유리입니다. 웹, 데스크톱, iOS, Android가 같은 흐림, 채움, 테두리 값으로 그립니다.",
    en: "Floating surfaces are glass. Web, desktop, iOS and Android draw them with the same blur, fill and rim values.",
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
    ko: "Horus × ON에서 이름을 딴 매입니다. 빈 상태, 오류, 로딩처럼 화면이 상황을 알려야 할 때 한 컷씩 나옵니다. 모든 컷은 1254 × 1254 투명 PNG로 내려받을 수 있습니다.",
    en: "A falcon named after Horus × ON. One cut appears when a screen has to tell you something: empty states, errors, loading. Every cut downloads as a 1254 × 1254 transparent PNG.",
  },
  viewMascot: { ko: "마스코트 보기", en: "View mascot" },

  foundationsTitle: { ko: "Foundations", en: "Foundations" },
  foundationsBody: {
    ko: "색, 글자, 간격, 반경, 유리 표면의 값과 규칙.",
    en: "Values and rules for color, type, spacing, radius, and glass.",
  },
  getStartedTitle: { ko: "Get Started", en: "Get Started" },
  getStartedBody: {
    ko: "설치부터 첫 화면까지 필요한 최소 절차.",
    en: "The minimum steps from install to a first screen.",
  },
  componentsTitle: { ko: "Components", en: "Components" },
  componentsBody: {
    ko: "컴포넌트 목록과 라이브 프리뷰, 코드 예시.",
    en: "The component list with live previews and code examples.",
  },
  openCard: { ko: "열기", en: "Open" },
});
