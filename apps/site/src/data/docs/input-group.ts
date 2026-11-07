/**
 * Reference doc for `InputGroup`, written against
 * `packages/react/src/components/input-group.tsx` and
 * `packages/flutter/lib/src/components/input_group.dart`.
 */
import type { ComponentDoc } from "@/lib/component-docs";

export const doc: ComponentDoc = {
  slug: "input-group",
  anatomy: {
    description: {
      ko: "InputGroup은 상자 하나 안에 앞 칸, 입력, 뒤 칸을 나란히 넣습니다. 칸 사이는 1px 구분선으로 나누고 테두리와 포커스 링은 상자가 하나만 그립니다.",
      en: "An InputGroup puts a leading segment, the input and a trailing segment inside one box. A 1px hairline separates them, and the box alone draws the border and focus ring.",
    },
    parts: [
      {
        name: "Box",
        slot: "div",
        description: {
          ko: "전체를 감싸는 상자입니다. 크기별 높이와 표면 채움, 포커스 링, 오류 테두리를 맡습니다.",
          en: "The box around everything: height, surface fill, focus ring and the invalid border.",
        },
      },
      {
        name: "Prefix",
        slot: "prefix",
        description: {
          ko: "입력 앞 칸입니다. Select나 Combobox의 segment 변형을 넣거나 InputGroupSegment로 고정 글자를 넣습니다.",
          en: "The segment before the input: a Select or Combobox with the segment variant, or fixed text through InputGroupSegment.",
        },
      },
      {
        name: "Input",
        slot: "input",
        description: {
          ko: "남은 너비를 채우는 네이티브 input입니다. placeholder와 value는 자식이 아니라 prop으로 넘깁니다.",
          en: "The native input that fills the remaining width. Placeholder and value are props, not children.",
        },
      },
      {
        name: "Suffix",
        slot: "suffix",
        description: {
          ko: "입력 뒤 칸입니다. 통화나 단위처럼 값 뒤에 붙는 선택지를 넣습니다.",
          en: "The segment after the input, for a choice such as a currency or a unit.",
        },
      },
      {
        name: "Divider",
        slot: "span",
        description: {
          ko: "칸과 입력 사이의 1px 선입니다. 장식이므로 aria-hidden이고, 오류일 때 danger 색, 비활성일 때 60% 농도로 바뀝니다.",
          en: "The 1px line between a segment and the input. It is decorative and aria-hidden; it turns danger red when invalid and drops to 60% when disabled.",
        },
      },
    ],
  },
  properties: [
    {
      id: "prefix",
      title: { ko: "prefix", en: "prefix" },
      description: {
        ko: "입력 앞에 붙는 칸입니다. 선택 칸이면 Select나 Combobox에 variant=\"segment\"를 주면 그룹의 크기와 비활성 상태를 그대로 따릅니다.",
        en: "The segment before the input. For a choice, give Select or Combobox variant=\"segment\" and it follows the group's size and disabled state.",
      },
      example: "prefix-select",
    },
    {
      id: "suffix",
      title: { ko: "suffix", en: "suffix" },
      description: {
        ko: "입력 뒤에 붙는 칸입니다. 금액 뒤의 통화처럼 값의 단위를 고르는 자리에 씁니다.",
        en: "The segment after the input, for a unit that qualifies the value, such as the currency of an amount.",
      },
      example: "suffix-select",
    },
    {
      id: "size",
      title: { ko: "size", en: "size" },
      description: {
        ko: "상자 높이와 입력, 칸의 글자 단계입니다. 기본값은 md입니다.",
        en: "Box height and the text rung of the input and segments. The default is md.",
      },
      values: [
        {
          name: "sm",
          description: {
            ko: "높이 32px, body-sm 글자, 칸 좌우 여백 12px입니다.",
            en: "32px tall with body-sm text and 12px segment padding.",
          },
        },
        {
          name: "md",
          description: {
            ko: "높이 40px, body-md 글자, 칸 좌우 여백 12px입니다.",
            en: "40px tall with body-md text and 12px segment padding.",
          },
        },
        {
          name: "lg",
          description: {
            ko: "높이 48px, body-lg 글자, 칸 좌우 여백 16px입니다.",
            en: "48px tall with body-lg text and 16px segment padding.",
          },
        },
      ],
      example: "fixed-text",
    },
    {
      id: "surface",
      title: { ko: "surface", en: "surface" },
      description: {
        ko: "상자가 놓인 바탕입니다. solid, solid-on-page, glass 중에서 고릅니다.",
        en: "What the box sits on: solid, solid-on-page or glass.",
      },
      example: "states",
    },
    {
      id: "invalid",
      title: { ko: "invalid", en: "invalid" },
      description: {
        ko: "참이면 상자 테두리와 구분선이 danger 색으로 바뀌고 input에 aria-invalid가 붙습니다.",
        en: "When true the box border and the dividers turn danger red and the input gets aria-invalid.",
      },
      example: "states",
    },
    {
      id: "disabled",
      title: { ko: "disabled", en: "disabled" },
      description: {
        ko: "참이면 input이 비활성되며 칸의 글자도 text-disabled로 내려가고 선택 칸이 열리지 않습니다. 그룹 상태가 칸으로 전달됩니다.",
        en: "When true the input is disabled, segment text drops to text-disabled and the segments no longer open. The group state reaches each segment.",
      },
      example: "states",
    },
    {
      id: "className",
      title: { ko: "className", en: "className" },
      description: {
        ko: "상자에 붙는 클래스입니다. 너비를 정할 때 여기에 줍니다.",
        en: "Classes for the box. Set the width here.",
      },
    },
  ],
  guidelines: [
    {
      id: "short-segments",
      title: { ko: "칸에는 짧은 값만", en: "Keep segments short" },
      body: {
        ko: "칸은 값의 단위나 접두어를 붙이는 자리입니다. 칸이 넓어지면 입력이 좁아져 긴 값을 보기 어려워집니다. 두 단어를 넘는 선택지는 일반 Select로 따로 두고 라벨을 붙입니다.",
        en: "A segment qualifies the value. The wider it grows the less room the input has. For a choice longer than a word or two, use a plain Select with its own label.",
      },
      do: {
        ko: "국가 코드, 통화, https:// 같은 짧은 값을 칸에 넣습니다.",
        en: "Put a country code, a currency or a prefix such as https:// in the segment.",
      },
      dont: {
        ko: "문장이 되는 선택지를 칸에 넣지 않습니다.",
        en: "Do not put a sentence-length choice in a segment.",
      },
      example: "prefix-select",
    },
    {
      id: "props-not-children",
      title: { ko: "입력 값은 prop으로", en: "Pass the value as a prop" },
      body: {
        ko: "InputGroup이 input을 직접 그리므로 placeholder, value, onChange, type은 자식이 아니라 prop으로 넘깁니다. 자식으로 다른 input을 넣으면 상자 안에 input이 둘이 됩니다.",
        en: "The group renders the input itself, so placeholder, value, onChange and type are props. A second input passed as a child leaves two inputs in one box.",
      },
      example: "fixed-text",
    },
    {
      id: "one-unit-each",
      title: { ko: "앞뒤에 하나씩", en: "One segment on each side" },
      body: {
        ko: "칸은 앞과 뒤에 하나씩만 둡니다. 세 칸이 넘으면 무엇이 값이고 무엇이 조건인지 읽기 어렵고, 그때는 필드를 나누는 편이 낫습니다.",
        en: "Keep at most one segment on each side. Past three parts it is no longer clear which piece is the value, and separate fields read better.",
      },
    },
  ],
  specification: [
    {
      id: "size-metrics",
      title: { ko: "크기별 값", en: "Sizes" },
      rows: [
        { state: "sm", slot: "Box", property: "height", value: "32px" },
        { state: "sm", slot: "Input", property: "padding-x", value: "12px" },
        { state: "sm", slot: "Prefix", property: "padding-x", value: "12px" },
        { state: "sm", slot: "Prefix", property: "gap", value: "4px" },
        { state: "sm", slot: "Prefix", property: "font", value: "text-body-sm" },
        { state: "sm", slot: "Prefix", property: "icon size", value: "16px" },
        { state: "md", slot: "Box", property: "height", value: "40px" },
        { state: "md", slot: "Input", property: "padding-x", value: "14px" },
        { state: "md", slot: "Prefix", property: "padding-x", value: "12px" },
        { state: "md", slot: "Prefix", property: "gap", value: "4px" },
        { state: "md", slot: "Prefix", property: "font", value: "text-body-md" },
        { state: "md", slot: "Prefix", property: "icon size", value: "16px" },
        { state: "lg", slot: "Box", property: "height", value: "48px" },
        { state: "lg", slot: "Input", property: "padding-x", value: "20px" },
        { state: "lg", slot: "Prefix", property: "padding-x", value: "16px" },
        { state: "lg", slot: "Prefix", property: "gap", value: "6px" },
        { state: "lg", slot: "Prefix", property: "font", value: "text-body-lg" },
        { state: "lg", slot: "Prefix", property: "icon size", value: "20px" },
        { state: "all", slot: "Box", property: "radius", value: "rounded-md" },
      ],
    },
    {
      id: "surface-and-states",
      title: { ko: "표면과 상태", en: "Surfaces and states" },
      rows: [
        { state: "Solid", slot: "Box", property: "background", value: "bg-bg-surface" },
        { state: "Solid", slot: "Box", property: "border", value: "1px border-border-default" },
        { state: "Solid on page", slot: "Box", property: "background", value: "bg-bg-default" },
        { state: "Glass", slot: "Box", property: "background", value: "veil-field" },
        { state: "Glass", slot: "Box", property: "blur", value: "8px" },
        { state: "all", slot: "Prefix", property: "background", value: "bg-overlay-ink-4" },
        { state: "all", slot: "Prefix", property: "text color", value: "text-text-primary" },
        {
          state: "all",
          slot: "Prefix",
          property: "icon color",
          value: "text-text-secondary",
        },
        { state: "all", slot: "Divider", property: "width", value: "1px" },
        { state: "all", slot: "Divider", property: "background", value: "bg-border-default" },
        {
          state: "invalid",
          slot: "Box",
          property: "border",
          value: "border-border-danger",
        },
        {
          state: "invalid",
          slot: "Divider",
          property: "background",
          value: "group-data-invalid:bg-border-danger",
        },
        {
          state: "disabled",
          slot: "Prefix",
          property: "text color",
          value: "group-data-disabled:text-text-disabled",
        },
        {
          state: "disabled",
          slot: "Divider",
          property: "background",
          value: "group-data-disabled:bg-border-default/60",
        },
        {
          state: "focus-within",
          slot: "Box",
          property: "outline",
          value: "2px outline-text-brand",
        },
        {
          state: "focus-within",
          slot: "Box",
          property: "outline offset",
          value: "2px",
        },
        { state: "colors", slot: "Box", property: "motion", value: "motion-colors" },
      ],
    },
  ],
  examples: [
    {
      id: "prefix-select",
      title: { ko: "앞 선택 칸", en: "Leading select" },
      description: {
        ko: "국가 코드를 고르는 Select를 앞에 두고 전화번호를 입력합니다.",
        en: "A Select for the country code in front of a phone number input.",
      },
    },
    {
      id: "suffix-select",
      title: { ko: "뒤 선택 칸", en: "Trailing select" },
      description: {
        ko: "금액 뒤에 통화를 고르는 Select를 붙였습니다.",
        en: "An amount with a currency Select after it.",
      },
    },
    {
      id: "fixed-text",
      title: { ko: "고정 글자 칸", en: "Fixed text segment" },
      description: {
        ko: "InputGroupSegment로 https:// 같은 고정 접두어를 넣고 세 크기를 비교합니다.",
        en: "A fixed prefix such as https:// through InputGroupSegment, at all three sizes.",
      },
    },
    {
      id: "states",
      title: { ko: "상태", en: "States" },
      description: {
        ko: "오류와 비활성 그룹에서 구분선과 칸 글자가 함께 바뀌는 것을 보여 줍니다.",
        en: "How the dividers and segment text change together in an invalid and a disabled group.",
      },
    },
  ],
  accessibility: {
    pattern: { label: "WAI-ARIA Textbox Pattern", href: "https://www.w3.org/WAI/ARIA/apg/patterns/textbox/" },
    notes: [
      {
        ko: "입력에는 여전히 이름이 필요합니다. Field 안에 넣어 라벨을 붙이거나 aria-label을 줍니다.",
        en: "The input still needs a name: a label through Field, or an aria-label.",
      },
      {
        ko: "구분선은 장식이라 aria-hidden입니다. 칸의 의미는 칸 안의 선택 칸 이름이나 글자로 전달합니다.",
        en: "Dividers are decorative and aria-hidden. What a segment means comes from its own control name or its text.",
      },
      {
        ko: "칸 안의 Select나 Combobox에는 각각 aria-label이 필요합니다. 그룹의 라벨이 칸의 이름을 대신하지 않습니다.",
        en: "A Select or Combobox inside a segment needs its own aria-label; the group's label does not name it.",
      },
    ],
    keyboard: [
      {
        keys: ["Tab"],
        action: {
          ko: "입력에서 앞뒤 칸으로 포커스가 옮겨 갑니다.",
          en: "Moves focus between the input and the segments.",
        },
      },
    ],
  },
};
