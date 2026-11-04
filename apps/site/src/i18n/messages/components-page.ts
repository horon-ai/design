import { defineMessages } from "@/i18n";

/** Copy for `/components/[slug]`: section headings, the missing-preview state and paging. */
export const componentPageMessages = defineMessages({
  breadcrumbComponents: { ko: "Components", en: "Components" },
  previewHeading: { ko: "Preview", en: "Preview" },
  usageHeading: { ko: "Usage", en: "Usage" },
  previewMissingTitle: { ko: "미리보기 없음", en: "No preview" },
  previewMissingBody: {
    ko: "이 컴포넌트는 라이브 프리뷰를 아직 준비하지 않았습니다. Usage의 코드 예시를 참고하세요.",
    en: "This component has no live preview yet. Use the code example under Usage.",
  },
  previous: { ko: "← 이전", en: "← Previous" },
  next: { ko: "다음 →", en: "Next →" },
  /** Accessible name of the previous/next navigation. Static markup uses the Korean string. */
  paging: { ko: "컴포넌트 이동", en: "Component paging" },
});
