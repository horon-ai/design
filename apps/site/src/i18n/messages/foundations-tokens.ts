import { defineMessages } from "@/i18n";

/** Copy for `/foundations/tokens`: the token file table, naming rule and rebuild step. */
export const foundationsTokensMessages = defineMessages({
  title: { ko: "Design Token", en: "Design Token" },
  description: {
    ko: "토큰은 Figma 변수를 그대로 옮긴 TypeScript 값입니다. 여기서 웹용 theme.css가 생성됩니다.",
    en: "Tokens are TypeScript values copied from Figma variables. The web theme.css is generated from them.",
  },
  filesHeading: { ko: "파일 구성", en: "Files" },
  headFile: { ko: "파일", en: "File" },
  headBody: { ko: "내용", en: "Contents" },
  headCount: { ko: "개수", en: "Count" },
  headSource: { ko: "Figma 출처", en: "Figma source" },
  colorBody: {
    ko: "시맨틱 색 라이트·다크, sky·red 프리미티브",
    en: "Semantic colors for light and dark, plus the sky and red primitives.",
  },
  colorCount: { ko: "{semantic}개 + {primitive}개", en: "{semantic} + {primitive}" },
  colorSource: {
    ko: "Components 54:81, Components / Dark 166:1107",
    en: "Components 54:81, Components / Dark 166:1107",
  },
  typographyBody: {
    ko: "글꼴, 굵기 4종, 글자 스타일의 플랫폼별 크기",
    en: "Typeface, four weights and per-platform sizes for the text styles.",
  },
  typographyCount: { ko: "{styles}개 스타일 × 3 플랫폼", en: "{styles} styles × 3 platforms" },
  typographySource: { ko: "Typography 26:2", en: "Typography 26:2" },
  scaleBody: { ko: "간격, 반경, 그림자", en: "Spacing, radius and shadow." },
  scaleCount: {
    ko: "{spacing} · {radius} · {shadow}",
    en: "{spacing} · {radius} · {shadow}",
  },
  scaleSource: { ko: "Scale 컬렉션, Menus 88:495", en: "Scale collection, Menus 88:495" },
  glassBody: {
    ko: "유리 레이어 값",
    en: "Glass layer values.",
  },
  glassCount: { ko: "레이어 5장", en: "5 layers" },
  glassSource: { ko: "Button 55:339 외", en: "Button 55:339 and others" },
  namingHeading: { ko: "이름 규칙", en: "Naming" },
  namingBody: {
    ko: "CSS 변수 이름은 Figma 변수의 WEB 코드 문법과 같습니다. Tailwind에서는 앞의 --color-, --text-, --radius-를 떼고 씁니다. Tailwind 기본 팔레트, 글자 크기, 반경은 비웠기 때문에 text-sm이나 bg-zinc-100은 동작하지 않습니다. 이름이 없는 값이 필요하면 토큰을 먼저 추가합니다.",
    en: "A CSS variable name uses the same grammar as the WEB code of the Figma variable. In Tailwind, drop the --color-, --text- and --radius- prefix. The default palette, text sizes and radii are cleared, so text-sm and bg-zinc-100 do nothing. When a value has no name, add a token first.",
  },
  rebuildHeading: { ko: "재생성", en: "Rebuild" },
  rebuildBody: {
    ko: "theme.css는 손으로 고치지 않습니다. 값을 바꾼 뒤 아래 명령으로 다시 만듭니다.",
    en: "Do not edit theme.css by hand. Change the value, then rebuild it with the command below.",
  },
});
