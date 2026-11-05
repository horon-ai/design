import { defineMessages } from "@/i18n";

/** Copy for `/foundations/radius`: the radius steps and the two shadow tokens. */
export const foundationsRadiusMessages = defineMessages({
  title: { ko: "Radius", en: "Radius" },
  description: {
    ko: "반경 7단과 떠 있는 표면에 쓰는 그림자 2종입니다.",
    en: "Seven radius steps and the two shadows used on raised surfaces.",
  },
  radiusHeading: { ko: "Radius", en: "Radius" },
  radiusNote: {
    ko: "버튼·칩·탭은 full, 입력과 메뉴 항목은 md, 카드와 다이얼로그는 xl을 씁니다.",
    en: "Buttons, chips and tabs use full; inputs and menu items use md; cards and dialogs use xl.",
  },
  shadowHeading: { ko: "Shadow", en: "Shadow" },
  shadowBody: {
    ko: "유리 표면은 그림자 대신 경계선과 흐림으로 떠 보입니다. 그림자는 유리 위에 다시 뜨는 불투명 표면에만 씁니다. popover 그림자는 계정·워크스페이스 메뉴에, palette 그림자는 커맨드 팔레트에 씁니다.",
    en: "A glass surface floats on its border and blur, not on a shadow. Shadows are reserved for an opaque surface that sits on top of glass: popover for the account and workspace menus, palette for the command palette.",
  },
});
