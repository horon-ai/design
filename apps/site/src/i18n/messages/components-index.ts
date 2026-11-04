import { defineMessages } from "@/i18n";

/** Copy for `/components`: the catalog intro and the three counts. */
export const componentsIndexMessages = defineMessages({
  title: { ko: "{count}개의 컴포넌트", en: "{count} components" },
  description: {
    ko: "HORON 디자인 시스템의 컴포넌트. 입력, 표시, 내비게이션, 오버레이, 대화, 에이전트로 나눠 정리했습니다.",
    en: "HORON design system components, grouped as inputs, display, navigation, overlays, conversation and agents.",
  },
  lead: {
    ko: "@horon-ai/react가 제공하는 컴포넌트 전부입니다. Figma Components 보드를 Base UI로 옮겼고, 카드의 프리뷰는 실제 컴포넌트입니다. 화면을 덮는 오버레이는 상세 페이지에서 열어 볼 수 있습니다.",
    en: "Every component @horon-ai/react provides. The Figma Components board is rebuilt on Base UI, and each card preview is the real component. Overlays that cover the screen open from the detail page.",
  },
  statTotal: { ko: "Total", en: "Total" },
  statPreviews: { ko: "Live previews", en: "Live previews" },
  statGroups: { ko: "Groups", en: "Groups" },
});
