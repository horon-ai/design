/**
 * Reference doc for `TextareaField`, written against
 * `packages/react/src/components/textarea-field.tsx` and
 * `packages/flutter/lib/src/components/textarea_field.dart`.
 */
import type { ComponentDoc } from "@/lib/component-docs";

export const doc: ComponentDoc = {
  slug: "textarea-field",
  anatomy: {
    description: {
      ko: "TextareaField는 라벨 줄, 여러 줄 입력 상자, 아래 문구 줄을 한 번에 그리는 필드입니다. 문구 줄에는 도움말이나 오류, 글자 수가 들어갑니다.",
      en: "A TextareaField draws the label row, the multi-line box and the footer in one piece. The footer carries help text or an error, plus a character count.",
    },
    parts: [
      {
        name: "Label row",
        slot: "label",
        description: {
          ko: "왼쪽 라벨과 오른쪽 hint를 한 줄에 놓습니다. hint는 Optional처럼 라벨 옆에 붙는 짧은 표시입니다.",
          en: "The label on the left with an optional hint on the right, for a short note such as Optional.",
        },
      },
      {
        name: "Box",
        slot: "div",
        description: {
          ko: "테두리와 표면을 가진 상자입니다. size에 따라 88/112/136px 높이를 쓰고 포커스 링을 그립니다.",
          en: "The bordered box. Its height is 88/112/136px from size, and it draws the focus ring.",
        },
      },
      {
        name: "Field",
        slot: "textarea",
        description: {
          ko: "값을 받는 네이티브 textarea입니다. 상자 높이 안에서만 스크롤되고 사용자가 크기를 바꿀 수 없습니다.",
          en: "The native textarea. It scrolls inside the box height and cannot be resized by the user.",
        },
      },
      {
        name: "Footer",
        slot: "footer",
        description: {
          ko: "description, error, maxLength 중 하나라도 있으면 나타납니다. 설명과 오류 중 하나를 보여 주고 오른쪽에 글자 수를 붙입니다.",
          en: "Appears when description, error or maxLength is set: it shows either the help or the error, with the count on the right.",
        },
      },
    ],
  },
  properties: [
    {
      id: "label",
      title: { ko: "label", en: "label" },
      description: {
        ko: "필드의 라벨입니다. Base UI가 입력과 연결하므로 별도 id나 htmlFor를 주지 않습니다.",
        en: "The field's label. Base UI links it to the textarea, so no id or htmlFor is needed.",
      },
      example: "basic",
    },
    {
      id: "hint",
      title: { ko: "hint", en: "hint" },
      description: {
        ko: "라벨 줄 오른쪽에 붙는 짧은 표시입니다. \"Optional\"이나 \"Required\"처럼 라벨을 보완하는 말만 넣고 문장은 description에 씁니다.",
        en: "A short note at the right of the label row. Keep it to a word such as Optional; sentences belong in description.",
      },
      example: "basic",
    },
    {
      id: "description",
      title: { ko: "description", en: "description" },
      description: {
        ko: "입력 아래의 도움말입니다. error가 있으면 자리를 내줍니다.",
        en: "Help text under the box. It gives way to error when one is set.",
      },
      example: "basic",
    },
    {
      id: "error",
      title: { ko: "error", en: "error" },
      description: {
        ko: "검증 실패 문구입니다. 설정하면 필드가 오류 상태가 되고 테두리와 문구가 danger 색으로 바뀌며 description 대신 이 문구가 나타납니다.",
        en: "The validation message. Setting it marks the field invalid, paints the border and footer danger red, and shows this text instead of description.",
      },
      example: "error",
    },
    {
      id: "maxLength",
      title: { ko: "maxLength", en: "maxLength" },
      description: {
        ko: "값을 주면 문구 줄 오른쪽에 \"현재 글자 수 / 최대 글자 수\"를 보여 줍니다. 제어 값이 바뀌어도 함께 갱신됩니다.",
        en: "When set, the footer shows the live length against the limit. It follows a controlled value even when that changes without typing.",
      },
      example: "counter",
    },
    {
      id: "size",
      title: { ko: "size", en: "size" },
      description: {
        ko: "상자 높이와 라벨, 문구 글자 단계입니다. 기본값은 md입니다.",
        en: "Box height and the label and footer type rungs. The default is md.",
      },
      values: [
        {
          name: "sm",
          description: {
            ko: "높이 88px, label-sm 라벨, caption 문구입니다.",
            en: "88px tall with a label-sm label and caption footer.",
          },
        },
        {
          name: "md",
          description: {
            ko: "높이 112px, label-md 라벨, caption 문구입니다.",
            en: "112px tall with a label-md label and caption footer.",
          },
        },
        {
          name: "lg",
          description: {
            ko: "높이 136px, label-lg 라벨, body-sm 문구입니다.",
            en: "136px tall with a label-lg label and body-sm footer.",
          },
        },
      ],
      example: "sizes",
    },
    {
      id: "surface",
      title: { ko: "surface", en: "surface" },
      description: {
        ko: "상자가 놓인 바탕입니다. Input과 같은 solid, solid-on-page, glass를 씁니다.",
        en: "What the box sits on: the same solid, solid-on-page and glass as Input.",
      },
      example: "glass",
    },
    {
      id: "className",
      title: { ko: "className", en: "className" },
      description: {
        ko: "필드 루트에 붙는 클래스입니다. 루트는 기본으로 360px에서 멈추므로 더 넓히려면 여기서 너비를 줍니다.",
        en: "Classes for the field root. It stops at 360px by default, so set a width here to go wider.",
      },
    },
  ],
  guidelines: [
    {
      id: "counter-near-limit",
      title: { ko: "글자 수는 여유가 있을 때만", en: "Count only near the limit" },
      body: {
        ko: "maxLength는 값이 한도를 의식해야 하는 자리에서만 줍니다. 짧은 메모에도 숫자를 붙이면 사용자가 필요 없는 압박을 받습니다.",
        en: "Set maxLength only where the limit matters. A number on every short note adds pressure that changes nothing.",
      },
      do: {
        ko: "봇 지시문처럼 280자 한도가 있는 자리에만 카운터를 붙입니다.",
        en: "Show the counter where a 280-character limit applies, such as bot instructions.",
      },
      dont: {
        ko: "한도가 없는 자유 메모에 숫자를 붙이지 않습니다.",
        en: "Do not add a count to free-form notes with no limit.",
      },
      example: "counter",
    },
    {
      id: "error-replaces-help",
      title: { ko: "오류는 도움말 자리를 씁니다", en: "The error takes the help text's place" },
      body: {
        ko: "error를 주면 description은 나타나지 않습니다. 두 문구가 겹치지 않게 오류가 풀릴 때만 도움말이 돌아오도록 상태를 관리합니다.",
        en: "Setting error hides description. Keep them from overlapping by letting the help return only once the error clears.",
      },
      example: "error",
    },
    {
      id: "field-not-textarea",
      title: { ko: "문구가 필요하면 이 컴포넌트", en: "Use this when the text matters" },
      body: {
        ko: "라벨, 도움말, 글자 수가 필요하면 Textarea를 조립하지 말고 TextareaField를 씁니다. 네 조각이 같은 간격과 글자 단계를 공유하므로 손으로 맞출 때 생기는 어긋남이 없습니다.",
        en: "When you need a label, help and a count, use TextareaField instead of assembling a Textarea. The four pieces already share one set of gaps and text rungs.",
      },
      example: "basic",
    },
  ],
  specification: [
    {
      id: "size-metrics",
      title: { ko: "크기별 값", en: "Sizes" },
      rows: [
        { state: "sm", slot: "Field", property: "gap", value: "6px" },
        { state: "sm", slot: "Box", property: "height", value: "88px" },
        { state: "sm", slot: "Box", property: "padding", value: "8px 12px" },
        { state: "sm", slot: "Label row", property: "font", value: "text-label-sm" },
        { state: "sm", slot: "Footer", property: "font", value: "text-caption" },
        { state: "md", slot: "Field", property: "gap", value: "8px" },
        { state: "md", slot: "Box", property: "height", value: "112px" },
        { state: "md", slot: "Box", property: "padding", value: "12px 14px" },
        { state: "md", slot: "Label row", property: "font", value: "text-label-md" },
        { state: "md", slot: "Footer", property: "font", value: "text-caption" },
        { state: "lg", slot: "Field", property: "gap", value: "10px" },
        { state: "lg", slot: "Box", property: "height", value: "136px" },
        { state: "lg", slot: "Box", property: "padding", value: "14px 20px" },
        { state: "lg", slot: "Label row", property: "font", value: "text-label-lg" },
        { state: "lg", slot: "Footer", property: "font", value: "text-body-sm" },
        { state: "all", slot: "Field", property: "max width", value: "360px" },
        { state: "all", slot: "Box", property: "radius", value: "rounded-md" },
      ],
    },
    {
      id: "states",
      title: { ko: "상태", en: "States" },
      rows: [
        { state: "Solid", slot: "Box", property: "background", value: "bg-bg-surface" },
        { state: "Solid", slot: "Box", property: "border", value: "1px border-border-default" },
        { state: "Glass", slot: "Box", property: "background", value: "veil-field" },
        { state: "Glass", slot: "Box", property: "blur", value: "8px" },
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
        { state: "invalid", slot: "Box", property: "border", value: "border-border-danger" },
        { state: "invalid", slot: "Footer", property: "text color", value: "text-text-danger" },
        {
          state: "invalid",
          slot: "Footer",
          property: "motion",
          value: "tab-panel-in 160ms ease-out-quint",
          note: {
            ko: "오류 문구가 나타나며 문구 줄 안에서만 움직입니다.",
            en: "The message fades and lifts in place, inside the footer row.",
          },
        },
        { state: "disabled", slot: "Field", property: "opacity", value: "60%" },
        { state: "disabled", slot: "Box", property: "background", value: "bg-bg-subtle" },
        {
          state: "default",
          slot: "Box",
          property: "placeholder",
          value: "text-text-placeholder",
        },
        { state: "default", slot: "Label row", property: "label color", value: "text-text-primary" },
        {
          state: "default",
          slot: "Label row",
          property: "hint color",
          value: "text-text-secondary",
        },
        {
          state: "default",
          slot: "Footer",
          property: "count color",
          value: "text-text-secondary",
        },
      ],
    },
  ],
  examples: [
    {
      id: "basic",
      title: { ko: "기본", en: "Basic" },
      description: {
        ko: "라벨, hint, 설명을 함께 둔 필드입니다. hint는 라벨 줄 오른쪽에 붙습니다.",
        en: "A field with a label, a hint and help text; the hint sits at the right of the label row.",
      },
    },
    {
      id: "counter",
      title: { ko: "글자 수", en: "Character count" },
      description: {
        ko: "maxLength를 주면 문구 줄 오른쪽에서 현재 길이를 보여 줍니다. 입력해 확인합니다.",
        en: "maxLength adds the live length at the right of the footer. Type to see it move.",
      },
    },
    {
      id: "error",
      title: { ko: "오류", en: "Error" },
      description: {
        ko: "오류가 있으면 설명 대신 문구가 나타나고 테두리와 문구가 danger 색으로 바뀝니다.",
        en: "An error replaces the help text and turns both the border and the footer danger red.",
      },
    },
    {
      id: "sizes",
      title: { ko: "크기", en: "Sizes" },
      description: {
        ko: "88px, 112px, 136px 세 높이와 라벨, 문구 글자를 함께 비교합니다.",
        en: "The 88px, 112px and 136px heights with their label and footer type.",
      },
    },
    {
      id: "glass",
      title: { ko: "유리 표면", en: "Glass surface" },
      description: {
        ko: "배경 위에서 veil 상자로 그린 같은 필드입니다.",
        en: "The same field drawn with the veil box over a backdrop.",
      },
    },
  ],
  accessibility: {
    notes: [
      {
        ko: "label은 Base UI가 textarea와 연결하므로 필드마다 라벨이 하나씩 필요합니다. 라벨 없이 placeholder만 두지 않습니다.",
        en: "Base UI links label to the textarea, so every field needs one. Do not rely on a placeholder instead.",
      },
      {
        ko: "error를 주면 필드가 invalid가 되고 입력에 aria-invalid가 붙습니다. 오류 문구 자체가 무엇이 잘못됐는지 말해야 합니다.",
        en: "Setting error marks the field invalid and sets aria-invalid on the textarea. The message itself has to say what is wrong.",
      },
      {
        ko: "글자 수는 문구 줄 안의 텍스트라 화면 낭독기가 그대로 읽습니다. 한도에 가까워졌다는 사실을 색으로만 알리지 않습니다.",
        en: "The count is plain text in the footer, so it is read as written. Do not signal proximity to the limit by color alone.",
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
