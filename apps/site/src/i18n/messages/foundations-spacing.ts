import { defineMessages } from "@/i18n";

/** Copy for `/foundations/spacing`: the spacing scale and the bar-length note. */
export const foundationsSpacingMessages = defineMessages({
  title: { ko: "Spacing", en: "Spacing" },
  description: {
    ko: "Figma Scale 컬렉션의 간격 값입니다. Tailwind의 4px 기본 단위와 같아서 p-3, gap-1.5 같은 클래스가 그대로 맞습니다.",
    en: "Spacing values from the Figma Scale collection. They match the 4px Tailwind base unit, so classes like p-3 and gap-1.5 line up.",
  },
  barNote: {
    ko: "막대 길이는 보기 쉽게 실제 값의 4배로 그렸습니다.",
    en: "Bars are drawn at four times the real value so the small steps stay visible.",
  },
});
