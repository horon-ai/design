import { defineMessages } from "@/i18n";

/** Copy feedback and empty previews used by the docs content blocks. */
export const blockMessages = defineMessages({
  copy: { ko: "복사", en: "Copy" },
  copied: { ko: "복사됨", en: "Copied" },
  copyFailed: { ko: "실패", en: "Copy failed" },
  previewUnavailable: { ko: "미리보기 없음", en: "No preview" },
  demoUnavailable: { ko: "데모를 불러오지 못했습니다.", en: "Could not load this demo." },
});
