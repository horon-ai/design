/**
 * Reference doc for `Textarea`, written against
 * `packages/react/src/components/textarea.tsx` and
 * `packages/flutter/lib/src/components/textarea.dart`.
 */
import type { ComponentDoc } from "@/lib/component-docs";

export const doc: ComponentDoc = {
  slug: "textarea",
  anatomy: {
    description: {
      ko: "Textarea는 여러 줄 텍스트를 받는 상자입니다. 테두리와 포커스 링은 상자가 그리고, 안쪽 textarea가 상자를 가득 채웁니다.",
      en: "A Textarea is a box for text across several lines. The box draws the border and the focus ring, and the textarea inside fills it.",
    },
    parts: [
      {
        name: "Box",
        slot: "div",
        description: {
          ko: "최소 높이와 안쪽 여백을 가진 상자입니다. 값이 길어져도 이 높이 아래로 내려가지 않습니다.",
          en: "The box that sets the minimum height and the padding. A short value never shrinks it below that height.",
        },
      },
      {
        name: "Field",
        slot: "textarea",
        description: {
          ko: "값을 받는 네이티브 textarea입니다. 세 줄에서 시작하고 사용자가 크기를 바꿀 수 없습니다.",
          en: "The native textarea that holds the value. It starts at three rows and cannot be resized by the user.",
        },
      },
    ],
  },
  properties: [
    {
      id: "size",
      title: { ko: "size", en: "size" },
      description: {
        ko: "상자의 최소 높이, 안쪽 여백과 글자 단계입니다. 기본값은 md입니다.",
        en: "Minimum box height, padding and text rung. The default is md.",
      },
      values: [
        {
          name: "sm",
          description: {
            ko: "최소 높이 88px에 body-sm 글자, 12px 안쪽 여백입니다.",
            en: "88px minimum height with body-sm text and 12px padding.",
          },
        },
        {
          name: "md",
          description: {
            ko: "최소 높이 112px에 body-md 글자, 14px 안쪽 여백입니다.",
            en: "112px minimum height with body-md text and 14px padding.",
          },
        },
        {
          name: "lg",
          description: {
            ko: "최소 높이 136px에 body-lg 글자, 20px 안쪽 여백입니다.",
            en: "136px minimum height with body-lg text and 20px padding.",
          },
        },
      ],
      example: "sizes",
    },
    {
      id: "surface",
      title: { ko: "surface", en: "surface" },
      description: {
        ko: "상자가 놓인 바탕입니다. Input과 같은 세 가지를 씁니다.",
        en: "What the box sits on. The same three surfaces as Input.",
      },
      values: [
        {
          name: "solid",
          description: {
            ko: "떠 있는 표면 위의 기본 상자입니다. bg-bg-surface로 채웁니다.",
            en: "The default box on a raised surface, filled with bg-bg-surface.",
          },
        },
        {
          name: "solid-on-page",
          description: {
            ko: "페이지 바탕 위에 바로 놓는 상자입니다. bg-bg-default로 채웁니다.",
            en: "The box on the page background, filled with bg-bg-default.",
          },
        },
        {
          name: "glass",
          description: {
            ko: "이미지나 유리 패널 위의 veil 상자입니다. 8px 흐림과 1px 링을 씁니다.",
            en: "The veil box for imagery and glass panels: an 8px blur and a 1px ring.",
          },
        },
      ],
      example: "surfaces",
    },
    {
      id: "invalid",
      title: { ko: "invalid", en: "invalid" },
      description: {
        ko: "참이면 상자에 data-invalid가 붙고 textarea에 aria-invalid가 설정되며 테두리가 danger 색으로 바뀝니다.",
        en: "When true the box gets data-invalid, the textarea gets aria-invalid and the border turns danger red.",
      },
      example: "states",
    },
    {
      id: "rows",
      title: { ko: "rows", en: "rows" },
      description: {
        ko: "처음 보이는 줄 수입니다. 기본값은 3이고, 상자의 최소 높이가 그보다 크면 최소 높이를 따릅니다.",
        en: "How many rows show at first. The default is 3; when the box's minimum height is larger, that height wins.",
      },
    },
    {
      id: "className",
      title: { ko: "className", en: "className" },
      description: {
        ko: "상자에 붙는 클래스입니다. 너비와 높이를 정할 때 여기에 줍니다.",
        en: "Classes for the box. Set width or a fixed height here.",
      },
    },
    {
      id: "textareaClassName",
      title: { ko: "textareaClassName", en: "textareaClassName" },
      description: {
        ko: "네이티브 textarea에 직접 붙는 클래스입니다.",
        en: "Classes applied straight to the native textarea.",
      },
    },
  ],
  guidelines: [
    {
      id: "long-form-only",
      title: { ko: "여러 줄일 때만", en: "Only for text across lines" },
      body: {
        ko: "한 줄이면 Input을 씁니다. Textarea는 답이 길어질 수 있는 자리, 예를 들어 지시문이나 메모에 씁니다.",
        en: "Use Input for a single line. Reach for Textarea where the answer grows, such as instructions or notes.",
      },
      do: {
        ko: "봇 지시문처럼 문장이 여러 개 이어지는 값에 씁니다.",
        en: "Use it for a value that runs to several sentences, such as bot instructions.",
      },
      dont: {
        ko: "이름이나 이메일처럼 한 줄 값에 쓰지 않습니다.",
        en: "Do not use it for a name or an email address.",
      },
      example: "sizes",
    },
    {
      id: "label-with-field",
      title: { ko: "라벨과 글자 수는 TextareaField로", en: "Label and counter come from TextareaField" },
      body: {
        ko: "Textarea에는 라벨, 도움말, 글자 수 자리가 없습니다. 그 셋이 필요한 입력은 TextareaField를 씁니다. Textarea는 라벨을 따로 그리는 레이아웃에서 씁니다.",
        en: "Textarea has no room for a label, help text or a counter. Use TextareaField when you need those, and Textarea where the surrounding layout already draws a label.",
      },
      example: "states",
    },
    {
      id: "fixed-rung",
      title: { ko: "높이는 크기로 정합니다", en: "Set the height with size" },
      body: {
        ko: "textarea는 크기 조절 손잡이를 숨기므로 사용자가 상자 높이를 바꿀 수 없습니다. 높이를 늘리려면 size를 올리거나 className으로 고정 높이를 줍니다.",
        en: "The resize handle is hidden, so the user cannot change the box height. Raise size, or set a fixed height through className.",
      },
    },
  ],
  specification: [
    {
      id: "size-metrics",
      title: { ko: "크기별 값", en: "Sizes" },
      rows: [
        { state: "sm", slot: "Box", property: "min height", value: "88px" },
        { state: "sm", slot: "Box", property: "padding", value: "8px 12px" },
        { state: "sm", slot: "Field", property: "font", value: "text-body-sm" },
        { state: "md", slot: "Box", property: "min height", value: "112px" },
        { state: "md", slot: "Box", property: "padding", value: "12px 14px" },
        { state: "md", slot: "Field", property: "font", value: "text-body-md" },
        { state: "lg", slot: "Box", property: "min height", value: "136px" },
        { state: "lg", slot: "Box", property: "padding", value: "14px 20px" },
        { state: "lg", slot: "Field", property: "font", value: "text-body-lg" },
        { state: "all", slot: "Box", property: "radius", value: "rounded-md" },
        { state: "all", slot: "Box", property: "border", value: "1px border-border-default" },
        { state: "all", slot: "Field", property: "resize", value: "none" },
      ],
    },
    {
      id: "surface-and-states",
      title: { ko: "표면과 상태", en: "Surfaces and states" },
      rows: [
        { state: "Solid", slot: "Box", property: "background", value: "bg-bg-surface" },
        { state: "Solid on page", slot: "Box", property: "background", value: "bg-bg-default" },
        { state: "Glass", slot: "Box", property: "background", value: "veil-field" },
        { state: "Glass", slot: "Box", property: "blur", value: "8px" },
        {
          state: "Solid · disabled",
          slot: "Box",
          property: "background",
          value: "bg-bg-subtle",
        },
        { state: "Glass · disabled", slot: "Box", property: "opacity", value: "60%" },
        { state: "invalid", slot: "Box", property: "border", value: "border-border-danger" },
        { state: "invalid", slot: "Field", property: "aria-invalid", value: "true" },
        { state: "default", slot: "Field", property: "text color", value: "text-text-primary" },
        { state: "default", slot: "Field", property: "placeholder", value: "text-text-placeholder" },
        { state: "disabled", slot: "Field", property: "text color", value: "text-text-disabled" },
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
          note: {
            ko: "textarea가 아니라 상자에 그립니다.",
            en: "Drawn on the box, not on the textarea.",
          },
        },
        { state: "colors", slot: "Box", property: "motion", value: "motion-colors" },
      ],
    },
  ],
  examples: [
    {
      id: "surfaces",
      title: { ko: "표면", en: "Surfaces" },
      description: {
        ko: "solid 상자와 페이지 위 상자, 배경 위 glass 상자를 같은 값으로 비교합니다.",
        en: "The solid box, the on-page box and the glass box over a backdrop, with the same value.",
      },
    },
    {
      id: "sizes",
      title: { ko: "크기", en: "Sizes" },
      description: {
        ko: "88px, 112px, 136px 세 최소 높이를 나란히 두었습니다.",
        en: "The 88px, 112px and 136px minimum heights side by side.",
      },
    },
    {
      id: "states",
      title: { ko: "상태", en: "States" },
      description: {
        ko: "오류와 비활성 상자를 보여 줍니다. 두 상자 모두 높이와 테두리 처리가 같습니다.",
        en: "An invalid and a disabled box. Both keep the same height and border treatment.",
      },
    },
  ],
  accessibility: {
    pattern: { label: "WAI-ARIA Textbox Pattern", href: "https://www.w3.org/WAI/ARIA/apg/patterns/textbox/" },
    notes: [
      {
        ko: "여러 줄 입력에도 이름이 필요합니다. TextareaField의 label을 쓰거나 aria-label을 직접 줍니다.",
        en: "A multi-line field still needs a name: either the label of a TextareaField or an aria-label.",
      },
      {
        ko: "invalid는 aria-invalid와 data-invalid를 함께 설정합니다. 색만 바꾸지 말고 무엇이 잘못됐는지 문구로 함께 알립니다.",
        en: "invalid sets aria-invalid and data-invalid together. Say what is wrong in words as well, not only in color.",
      },
      {
        ko: "사용자가 높이를 바꿀 수 없으므로 긴 값은 상자 안에서 스크롤됩니다. Enter는 줄바꿈이고, 폼 제출은 바깥 버튼이 맡습니다.",
        en: "Because the height is fixed, a long value scrolls inside the box. Enter inserts a newline; a separate button submits the form.",
      },
    ],
    keyboard: [
      {
        keys: ["Enter"],
        action: { ko: "새 줄을 넣습니다.", en: "Inserts a new line." },
      },
      {
        keys: ["Tab"],
        action: { ko: "다음 포커스 가능한 요소로 이동합니다.", en: "Moves focus to the next focusable control." },
      },
    ],
  },
};
