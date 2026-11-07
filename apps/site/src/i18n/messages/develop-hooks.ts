import { defineMessages } from "@/i18n";

/** Copy for `/develop/react/hooks/[slug]`: section headings and the parameter table. */
export const hookPageMessages = defineMessages({
  usage: { ko: "사용법", en: "Usage" },
  signature: { ko: "시그니처", en: "Signature" },
  parameters: { ko: "매개변수", en: "Parameters" },
  returns: { ko: "반환값", en: "Returns" },
  notes: { ko: "동작과 주의", en: "Behavior notes" },
  noParams: {
    ko: "매개변수가 없습니다.",
    en: "Takes no parameters.",
  },
  columnName: { ko: "이름", en: "Name" },
  columnType: { ko: "타입", en: "Type" },
  columnDefault: { ko: "기본값", en: "Default" },
  columnDescription: { ko: "설명", en: "Description" },
});
