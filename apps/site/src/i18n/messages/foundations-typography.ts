import { defineMessages } from "@/i18n";

/** Copy for `/foundations/typography`: typeface, weights, the style table and the rules. */
export const foundationsTypographyMessages = defineMessages({
  title: { ko: "Typography", en: "Typography" },
  description: {
    ko: "Pretendard 하나와 코드용 Geist Mono를 씁니다. 글자 스타일은 13개이고, 같은 이름이 플랫폼마다 다른 크기를 가집니다.",
    en: "Pretendard for text and Geist Mono for code. There are 13 text styles, and one style name carries a different size per platform.",
  },
  fontHeading: { ko: "서체와 굵기", en: "Typeface and weights" },
  fontBody: {
    ko: "본문 서체는 {sans}, 코드는 {mono}입니다. 굵기는 {weights} 네 가지만 씁니다.",
    en: "Body text uses {sans}; code uses {mono}. Four weights ship: {weights}.",
  },
  stylesHeading: { ko: "글자 스타일", en: "Text styles" },
  stylesBody: {
    ko: '크기와 줄 높이는 Figma Typography 보드(26:2)의 표를 그대로 옮겼습니다. 웹은 기본값이 Web이고, 데스크톱 앱은 data-platform="desktop", 모바일 웹은 data-platform="mobile"을 상위 요소에 둡니다. 자간은 em 단위라 크기가 바뀌어도 비율이 유지됩니다.',
    en: 'Sizes and line heights come straight from the Figma Typography board (26:2). Web is the default; a desktop app sets data-platform="desktop" and mobile web sets data-platform="mobile" on an ancestor element. Tracking is in em, so the ratio survives a size change.',
  },
  headStyle: { ko: "스타일", en: "Style" },
  headWeight: { ko: "굵기 · 자간", en: "Weight · tracking" },
  rulesHeading: { ko: "규칙", en: "Rules" },
  ruleStyles: {
    ko: "13개 스타일만 씁니다. 없는 크기가 필요하면 세 플랫폼 값을 함께 토큰으로 추가합니다.",
    en: "Use only the 13 styles. When a size is missing, add it as a token for all three platforms at once.",
  },
  ruleParagraph: {
    ko: "본문 문단 뒤에는 빈 줄 대신 0.75em을 띄웁니다.",
    en: "Body paragraphs get 0.75em of space after them instead of an empty line.",
  },
  ruleWrap: {
    ko: "한국어는 단어 단위로 줄을 바꿉니다(word-break: keep-all).",
    en: "Korean wraps between words (word-break: keep-all).",
  },
});
