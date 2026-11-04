import { defineMessages } from "@/i18n";

/** 404 page copy. */
export const notFoundMessages = defineMessages({
  title: { ko: "페이지를 찾을 수 없습니다", en: "Page not found" },
  description: { ko: "요청한 문서가 없습니다.", en: "That page does not exist." },
  body: {
    ko: "주소가 바뀌었거나 아직 없는 문서입니다. 아래에서 원하는 항목을 다시 찾아보세요.",
    en: "The address changed or the page does not exist yet. Find what you need below.",
  },
  lostAlt: { ko: "길을 잃은 Horon 마스코트", en: "Horon mascot lost" },
  home: { ko: "홈으로", en: "Home" },
  components: { ko: "컴포넌트 목록", en: "Component list" },
});
