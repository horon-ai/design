import { defineMessages } from "@/i18n";

/** Updates page copy: one title and its notes per release, newest first. */
export const updatesMessages = defineMessages({
  title: { ko: "Updates", en: "Updates" },
  description: {
    ko: "디자인 시스템이 바뀐 기록입니다. 값이 바뀌었는지, 어떤 컴포넌트가 늘었는지 시간순으로 남깁니다.",
    en: "A record of changes to the design system, newest first: which values changed and which components are new.",
  },

  figmaTitle: { ko: "Figma 기준으로 처음부터 다시 만듦", en: "Rebuilt from scratch on the Figma baseline" },
  figmaItem1: {
    ko: "토큰을 Figma Horon 파일의 변수에서 다시 읽었습니다. 라이트·다크 색, 13개 글자 스타일의 Web·Desktop·Mobile 크기, 반경, 그림자가 바뀌었습니다.",
    en: "Read the tokens from the Figma Horon file again. Light and dark colors, Web, Desktop, and Mobile sizes for 13 text styles, radii, and shadows changed.",
  },
  figmaItem2: {
    ko: "shadcn/ui를 걷어내고 Base UI만으로 컴포넌트 55개를 새로 만들었습니다. 대화와 에이전트 블록이 새 그룹으로 들어왔습니다.",
    en: "Removed shadcn/ui and rebuilt 55 components on Base UI alone. Conversation and agent blocks arrived as new groups.",
  },
  figmaItem3: {
    ko: "유리 표면이 Figma의 Liquid layers를 그대로 따르며, 흐림이 표면 높이에 비례합니다.",
    en: "Glass surfaces follow the Figma Liquid layers exactly; blur scales with surface height.",
  },
  figmaItem4: {
    ko: "아이콘을 Lucide에서 Phosphor로 바꿨습니다.",
    en: "Icons moved from Lucide to Phosphor.",
  },

  publicTitle: { ko: "design.horon.ai 공개", en: "design.horon.ai goes public" },
  publicItem1: {
    ko: "Astro + React로 만든 문서 사이트를 새로 열었습니다.",
    en: "Opened a new docs site built with Astro and React.",
  },
  publicItem2: {
    ko: "컴포넌트 75개를 5개 그룹으로 정리하고, 40개에 라이브 프리뷰를 붙였습니다.",
    en: "Grouped 75 components into five groups and added live previews to 40 of them.",
  },
  publicItem3: {
    ko: "Foundations 8개 문서가 토큰 패키지에서 값을 직접 읽어 그립니다.",
    en: "Eight Foundations pages draw their values directly from the token package.",
  },

  parityTitle: { ko: "컴포넌트 패리티 완료", en: "Component parity complete" },
  parityItem1: {
    ko: "@horon-ai/react에 빠져 있던 49개 컴포넌트를 추가해 총 75개가 됐습니다.",
    en: "Added the 49 components missing from @horon-ai/react, bringing the total to 75.",
  },
  parityItem2: {
    ko: "모든 렌더 노드에 data-slot을 붙여 스타일·테스트가 노드를 찾을 수 있게 했습니다.",
    en: "Added data-slot to every rendered node so styles and tests can find nodes.",
  },
  parityItem3: {
    ko: "chart, data-table, resizable 같은 무거운 컴포넌트도 포함했습니다.",
    en: "Included heavy components such as chart, data-table, and resizable.",
  },

  canvasTitle: { ko: "캔버스 → 코드 이관", en: "Canvas to code migration" },
  canvasItem1: {
    ko: "토큰 값을 pen 캔버스 00 Tokens 보드에 맞춰 전면 재작성했습니다.",
    en: "Rewrote every token value against the 00 Tokens board on the pen canvas.",
  },
  canvasItem2: {
    ko: "컴포넌트 22개를 캔버스 마스터에 맞춰 재스타일하고 Spinner·Menu·Glass Surface를 추가했습니다.",
    en: "Restyled 22 components to the canvas masters and added Spinner, Menu, and Glass Surface.",
  },
  canvasItem3: {
    ko: "LiquidGlass를 baalda 헤더 레시피로 추가했습니다.",
    en: "Added LiquidGlass as the baalda header recipe.",
  },
});
