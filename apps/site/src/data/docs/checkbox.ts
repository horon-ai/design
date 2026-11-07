/**
 * Reference doc for `Checkbox`, written against
 * `packages/react/src/components/checkbox.tsx` and
 * `packages/flutter/lib/src/components/checkbox.dart`.
 */
import type { ComponentDoc } from "@/lib/component-docs";

export const doc: ComponentDoc = {
  slug: "checkbox",
  anatomy: {
    description: {
      ko: "Checkbox는 항목 하나를 켜고 끄는 상자입니다. 상자와 라벨이 하나의 label 안에 있어서 라벨 글자를 눌러도 함께 바뀝니다.",
      en: "A Checkbox turns one item on or off. The box and its label sit in one label element, so clicking the text toggles it too.",
    },
    parts: [
      {
        name: "Label wrapper",
        slot: "label",
        description: {
          ko: "상자와 라벨 글자를 감싸는 label입니다. 클릭 영역 전체가 하나의 컨트롤이 됩니다.",
          en: "The label that wraps the box and the text, making the whole row one control.",
        },
      },
      {
        name: "Box",
        slot: "Root",
        description: {
          ko: "1.5px 테두리를 가진 상자입니다. 선택되면 브랜드 색으로 채워집니다.",
          en: "The 1.5px bordered box, filled with the brand color once checked.",
        },
      },
      {
        name: "Indicator",
        slot: "Indicator",
        description: {
          ko: "선택 상태에 따라 체크나 가로줄을 그립니다. 나타날 때 살짝 튀어오르고 사라질 때 줄어듭니다.",
          en: "Draws a check, or a dash when indeterminate. It pops in on appear and scales out on exit.",
        },
      },
    ],
  },
  properties: [
    {
      id: "size",
      title: { ko: "size", en: "size" },
      description: {
        ko: "상자 크기와 라벨 글자 단계입니다. 기본값은 md입니다.",
        en: "Box size and label text rung. The default is md.",
      },
      values: [
        {
          name: "sm",
          description: {
            ko: "상자 18px에 body-sm 라벨입니다. Data table처럼 빽빽한 목록에 맞습니다.",
            en: "An 18px box with a body-sm label, for dense lists such as a data table.",
          },
        },
        {
          name: "md",
          description: {
            ko: "상자 20px에 body-md 라벨입니다. 기본값입니다.",
            en: "A 20px box with a body-md label. The default.",
          },
        },
        {
          name: "lg",
          description: {
            ko: "상자 24px에 body-lg 라벨입니다.",
            en: "A 24px box with a body-lg label.",
          },
        },
      ],
      example: "sizes",
    },
    {
      id: "label",
      title: { ko: "label", en: "label" },
      description: {
        ko: "상자 뒤에 붙는 라벨입니다. label 안에 함께 들어가므로 글자를 눌러도 상자가 바뀌고, 화면 낭독기의 이름도 이 글자입니다.",
        en: "The text after the box. It lives inside the label, so clicking it toggles the box and it becomes the accessible name.",
      },
      example: "list",
    },
    {
      id: "indeterminate",
      title: { ko: "indeterminate", en: "indeterminate" },
      description: {
        ko: "참이면 체크 대신 가로줄을 그리고 상자를 브랜드 색으로 채웁니다. 아래 항목 일부만 선택된 묶음의 머리 체크박스에 씁니다.",
        en: "When true the box fills with the brand color and shows a dash instead of a check, for the head of a group where only some items are selected.",
      },
      example: "states",
    },
    {
      id: "checked",
      title: { ko: "checked", en: "checked" },
      description: {
        ko: "값을 주면 제어 상태가 되고, 주지 않으면 defaultChecked에서 시작해 스스로 상태를 유지합니다. 바뀐 값은 onCheckedChange로 받습니다.",
        en: "Passing a value makes the box controlled; without it the box starts at defaultChecked and keeps its own state, reporting changes through onCheckedChange.",
      },
    },
    {
      id: "disabled",
      title: { ko: "disabled", en: "disabled" },
      description: {
        ko: "참이면 상자와 라벨이 40%로 흐려지고 커서가 not-allowed로 바뀌며 상태가 바뀌지 않습니다.",
        en: "When true the box and label fade to 40%, the cursor becomes not-allowed and the state stops changing.",
      },
      example: "states",
    },
  ],
  guidelines: [
    {
      id: "checkbox-vs-switch",
      title: { ko: "즉시 적용은 Switch", en: "Immediate effect is a Switch" },
      body: {
        ko: "저장을 눌러야 반영되는 값이면 Checkbox를 씁니다. 누르는 순간 설정이 적용되고 되돌리기 쉬운 값이면 Switch가 맞습니다.",
        en: "Use a Checkbox for a value that is applied on save. When the setting takes effect the moment it is pressed and is easy to reverse, a Switch fits better.",
      },
      do: {
        ko: "가입 단계의 약관 동의에 Checkbox를 씁니다.",
        en: "Use a Checkbox for agreeing to terms during sign-up.",
      },
      dont: {
        ko: "알림을 즉시 끄고 켜는 자리에 Checkbox를 쓰지 않습니다.",
        en: "Do not use a Checkbox for turning notifications on and off right away.",
      },
      example: "list",
    },
    {
      id: "checkbox-vs-radio",
      title: { ko: "여러 개는 Checkbox, 하나는 Radio", en: "Several means Checkbox, one means Radio" },
      body: {
        ko: "같은 묶음에서 여러 개를 동시에 고를 수 있으면 Checkbox를 나란히 두고, 하나만 고를 수 있으면 RadioGroup을 씁니다. 둘을 한 묶음에 섞지 않습니다.",
        en: "Where several options can hold at once, line up Checkboxes; where only one can, use a RadioGroup. Do not mix the two in one group.",
      },
      example: "list",
    },
    {
      id: "indeterminate-parent",
      title: { ko: "부분 선택은 가로줄로", en: "Show partial selection with a dash" },
      body: {
        ko: "하위 항목 일부만 선택된 묶음의 머리에는 indeterminate를 씁니다. 머리를 누르면 전체를 켜고, 다시 누르면 전체를 끄는 식으로 하위 항목과 상태를 맞춥니다.",
        en: "Use indeterminate on the head of a group where some children are chosen. Pressing it should turn everything on, then everything off, keeping the children in step.",
      },
      example: "states",
    },
  ],
  specification: [
    {
      id: "size-metrics",
      title: { ko: "크기별 값", en: "Sizes" },
      rows: [
        { state: "sm", slot: "Box", property: "size", value: "18px" },
        { state: "sm", slot: "Box", property: "radius", value: "rounded-xs" },
        { state: "sm", slot: "Indicator", property: "icon size", value: "12px" },
        { state: "sm", slot: "Label wrapper", property: "gap", value: "8px" },
        { state: "sm", slot: "Label wrapper", property: "font", value: "text-body-sm" },
        { state: "md", slot: "Box", property: "size", value: "20px" },
        { state: "md", slot: "Box", property: "radius", value: "rounded-xs" },
        { state: "md", slot: "Indicator", property: "icon size", value: "14px" },
        { state: "md", slot: "Label wrapper", property: "gap", value: "10px" },
        { state: "md", slot: "Label wrapper", property: "font", value: "text-body-md" },
        { state: "lg", slot: "Box", property: "size", value: "24px" },
        { state: "lg", slot: "Box", property: "radius", value: "rounded-xs" },
        { state: "lg", slot: "Indicator", property: "icon size", value: "16px" },
        { state: "lg", slot: "Label wrapper", property: "gap", value: "12px" },
        { state: "lg", slot: "Label wrapper", property: "font", value: "text-body-lg" },
      ],
    },
    {
      id: "states",
      title: { ko: "상태", en: "States" },
      rows: [
        { state: "unchecked", slot: "Box", property: "background", value: "bg-bg-surface" },
        { state: "unchecked", slot: "Box", property: "border", value: "1.5px border-border-strong" },
        {
          state: "unchecked · hover",
          slot: "Box",
          property: "border",
          value: "border-text-secondary",
        },
        {
          state: "checked",
          slot: "Box",
          property: "background",
          value: "bg-interactive-primary",
        },
        { state: "checked", slot: "Box", property: "border", value: "border-interactive-primary" },
        { state: "checked", slot: "Indicator", property: "text color", value: "text-interactive-on-primary" },
        {
          state: "checked · hover",
          slot: "Box",
          property: "background",
          value: "bg-interactive-primary-hover",
        },
        {
          state: "indeterminate",
          slot: "Box",
          property: "background",
          value: "bg-interactive-primary",
        },
        {
          state: "indeterminate",
          slot: "Indicator",
          property: "glyph",
          value: "Minus",
        },
        { state: "all", slot: "Label wrapper", property: "text color", value: "text-text-primary" },
        {
          state: "focus-visible",
          slot: "Box",
          property: "outline",
          value: "2px outline-text-brand",
        },
        {
          state: "focus-visible",
          slot: "Box",
          property: "outline offset",
          value: "2px",
        },
        { state: "disabled", slot: "Label wrapper", property: "opacity", value: "40%" },
        {
          state: "disabled",
          slot: "Label wrapper",
          property: "cursor",
          value: "not-allowed",
        },
        {
          state: "checked · enter",
          slot: "Indicator",
          property: "motion",
          value: "animate-pop-in",
          note: { ko: "220ms ease-spring입니다.", en: "220ms on ease-spring." },
        },
        {
          state: "checked · exit",
          slot: "Indicator",
          property: "motion",
          value: "animate-scale-out",
        },
        { state: "all", slot: "Box", property: "motion", value: "motion-colors" },
      ],
    },
  ],
  examples: [
    {
      id: "sizes",
      title: { ko: "크기", en: "Sizes" },
      description: {
        ko: "18px, 20px, 24px 세 상자와 그에 맞는 라벨 글자를 비교합니다.",
        en: "The 18px, 20px and 24px boxes with the label type each one sets.",
      },
    },
    {
      id: "states",
      title: { ko: "상태", en: "States" },
      description: {
        ko: "꺼짐, 켜짐, 부분 선택, 비활성 상자를 한자리에 놓았습니다.",
        en: "Off, on, indeterminate and disabled boxes together.",
      },
    },
    {
      id: "list",
      title: { ko: "목록", en: "List" },
      description: {
        ko: "여러 항목을 독립적으로 켜고 끄는 설정 목록입니다.",
        en: "A settings list where each item toggles independently.",
      },
    },
  ],
  accessibility: {
    notes: [
      {
        ko: "label을 주면 상자와 글자가 한 label 안에 들어가 이름이 자동으로 붙습니다. label 없이 상자만 둘 때는 aria-label을 꼭 줍니다.",
        en: "With label the box and its text sit in one label, which names the control. A box without a label needs an aria-label.",
      },
      {
        ko: "indeterminate는 세 번째 상태입니다. 참과 거짓 사이의 값을 색이나 가로줄로만 알리므로, 묶음 머리에는 \"일부 선택됨\"을 문구로도 함께 안내합니다.",
        en: "indeterminate is a third state. Since it shows only through color and a dash, say in words that some items are selected.",
      },
      {
        ko: "Space가 상자를 바꾸고 Enter는 바꾸지 않습니다. 폼 안에서 Enter가 제출로 이어지도록 남겨 둔 동작입니다.",
        en: "Space toggles the box and Enter does not, which leaves Enter to submit the form it sits in.",
      },
    ],
    keyboard: [
      {
        keys: ["Space"],
        action: { ko: "선택 상태를 바꿉니다.", en: "Toggles the checked state." },
      },
      {
        keys: ["Tab"],
        action: { ko: "다음 포커스 가능한 요소로 이동합니다.", en: "Moves focus to the next focusable control." },
      },
    ],
  },
};
