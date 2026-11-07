/**
 * Reference doc for `Input`, written against
 * `packages/react/src/components/input.tsx` and
 * `packages/flutter/lib/src/components/input.dart`.
 */
import type { ComponentDoc } from "@/lib/component-docs";

export const doc: ComponentDoc = {
  slug: "input",
  anatomy: {
    description: {
      ko: "Input은 한 줄 텍스트를 받는 상자입니다. 테두리와 포커스 표시는 상자가 그리고, 안쪽의 input 요소는 남은 너비를 채웁니다.",
      en: "An Input is a box that takes one line of text. The box draws the border and the focus ring, and the input element inside fills the remaining width.",
    },
    parts: [
      {
        name: "Box",
        slot: "div",
        description: {
          ko: "테두리, 모서리, 표면 채움을 가진 상자입니다. 포커스를 받으면 상자에 2px 링이 그려집니다.",
          en: "The box that carries the border, radius and surface fill. When the field takes focus the 2px ring is drawn on this box.",
        },
      },
      {
        name: "Icon",
        slot: "icon",
        description: {
          ko: "앞에 붙는 선택 아이콘입니다. sm과 md에서 16px, lg에서 20px이고 secondary 색을 씁니다.",
          en: "Optional leading icon. 16px at sm and md, 20px at lg, in the secondary text color.",
        },
      },
      {
        name: "Field",
        slot: "input",
        description: {
          ko: "실제 값을 받는 네이티브 input입니다. 배경이 투명해서 상자의 표면이 그대로 보입니다.",
          en: "The native input that holds the value. It is transparent so the box's surface shows through.",
        },
      },
    ],
  },
  properties: [
    {
      id: "surface",
      title: { ko: "surface", en: "surface" },
      description: {
        ko: "상자가 놓인 바탕입니다. 바탕에 따라 채움과 테두리 처리 방식이 달라집니다.",
        en: "What the box sits on. The fill and the way the border is drawn follow it.",
      },
      values: [
        {
          name: "solid",
          description: {
            ko: "떠 있는 표면 위에 놓는 기본 상자입니다. bg-bg-surface로 채우고 1px 테두리를 그립니다.",
            en: "The default box on a raised surface: filled with bg-bg-surface and outlined with a 1px border.",
          },
        },
        {
          name: "solid-on-page",
          description: {
            ko: "페이지 바탕에 바로 놓는 상자입니다. bg-bg-default로 채워 바탕과 구분됩니다.",
            en: "The box placed directly on the page background, filled with bg-bg-default so it still reads against it.",
          },
        },
        {
          name: "glass",
          description: {
            ko: "이미지나 유리 패널 위에 놓는 veil 상자입니다. 8px 흐림과 160% 채도, 안쪽 1px 링과 부드러운 그림자를 씁니다.",
            en: "The veil box for imagery and glass panels: an 8px blur, 160% saturation, a 1px inner ring and a soft drop shadow.",
          },
        },
      ],
      example: "surfaces",
    },
    {
      id: "size",
      title: { ko: "size", en: "size" },
      description: {
        ko: "상자 높이와 글자 단계입니다. 기본값은 md입니다.",
        en: "Box height and text rung. The default is md.",
      },
      values: [
        {
          name: "sm",
          description: {
            ko: "높이 32px에 body-sm 글자, 12px 좌우 여백입니다. 촘촘한 목록과 도구 모음에 맞습니다.",
            en: "32px tall with body-sm text and 12px side padding, for dense lists and toolbars.",
          },
        },
        {
          name: "md",
          description: {
            ko: "높이 40px에 body-md 글자, 14px 좌우 여백입니다.",
            en: "40px tall with body-md text and 14px side padding.",
          },
        },
        {
          name: "lg",
          description: {
            ko: "높이 48px에 body-lg 글자, 20px 좌우 여백입니다. 화면의 주 입력에 맞습니다.",
            en: "48px tall with body-lg text and 20px side padding, for the main input of a screen.",
          },
        },
      ],
      example: "sizes",
    },
    {
      id: "icon",
      title: { ko: "icon", en: "icon" },
      description: {
        ko: "입력 앞에 붙는 아이콘입니다. 크기와 아이콘 사이 간격은 size가 정하므로 아이콘에 직접 크기를 주지 않습니다.",
        en: "An icon before the text. Size sets both its size and the gap, so do not size the icon by hand.",
      },
      example: "with-icon",
    },
    {
      id: "invalid",
      title: { ko: "invalid", en: "invalid" },
      description: {
        ko: "참이면 상자에 data-invalid가 붙고 input에 aria-invalid가 설정되며 테두리가 danger 색으로 바뀝니다. Field 안에 두면 Field가 대신 표시합니다.",
        en: "When true the box gets data-invalid, the input gets aria-invalid and the border turns danger red. Inside a Field, the field can do this instead.",
      },
      example: "states",
    },
    {
      id: "className",
      title: { ko: "className", en: "className" },
      description: {
        ko: "상자에 붙는 클래스입니다. 너비를 정할 때는 input이 아니라 상자에 주어야 합니다.",
        en: "Classes for the box. Set the width here rather than on the input.",
      },
    },
    {
      id: "inputClassName",
      title: { ko: "inputClassName", en: "inputClassName" },
      description: {
        ko: "네이티브 input에 직접 붙는 클래스입니다. 글자 정렬처럼 input 안쪽에만 걸리는 값을 여기에 줍니다.",
        en: "Classes applied straight to the native input, for things that only concern its own text such as alignment.",
      },
    },
  ],
  guidelines: [
    {
      id: "label-outside",
      title: { ko: "라벨은 Field로 붙입니다", en: "Pair it with a label" },
      body: {
        ko: "Input에는 라벨과 설명 자리가 없습니다. 이름이 필요한 입력은 Field 안에 넣어 FieldLabel과 FieldDescription을 함께 두고, 그 자리에서만 aria-label을 생략합니다.",
        en: "Input has no room for a label or a description. Put a named field inside Field with a FieldLabel and FieldDescription, and drop aria-label once you have done that.",
      },
      do: {
        ko: "Field 안에 Input을 넣고 FieldLabel의 htmlFor를 input의 id와 맞춥니다.",
        en: "Place the Input inside a Field and match FieldLabel's htmlFor to the input's id.",
      },
      dont: {
        ko: "라벨 없이 placeholder만 두지 않습니다.",
        en: "Do not leave a field alone with only a placeholder.",
      },
      example: "states",
    },
    {
      id: "glass-on-imagery",
      title: { ko: "glass는 이미지 위에서만", en: "Glass for imagery only" },
      body: {
        ko: "veil 표면은 뒤가 비치는 자리에서만 씁니다. 불투명한 카드 안에서는 흐림이 보이지 않아 solid와 구분되지 않고 테두리만 남지 않습니다.",
        en: "The veil surface belongs where something shows through. Inside an opaque card the blur has nothing to work with, so use solid there.",
      },
      do: {
        ko: "배경 이미지 위에 놓인 검색 상자에 glass를 씁니다.",
        en: "Use glass for a search box that floats over a background image.",
      },
      dont: {
        ko: "일반 폼 카드 안에서 glass를 쓰지 않습니다.",
        en: "Do not use glass inside a plain form card.",
      },
      example: "surfaces",
    },
    {
      id: "one-input-per-field",
      title: { ko: "한 필드에 입력 하나", en: "One input per field" },
      body: {
        ko: "입력 하나에는 값 하나만 받습니다. 앞뒤에 단위나 선택 칸이 붙는 입력은 Input을 이어 붙이지 말고 InputGroup을 씁니다. 그래야 테두리 하나에 구분선이 정리됩니다.",
        en: "One input takes one value. When a unit or a choice sits before or after it, use InputGroup instead of joining inputs: it keeps one border and clean dividers.",
      },
      example: "surfaces",
    },
  ],
  specification: [
    {
      id: "surface-colors",
      title: { ko: "표면별 색", en: "Surface colors" },
      note: {
        ko: "값은 토큰 유틸 이름이고, veil 행의 값은 globals.css의 veil-field 정의에서 옮겼습니다.",
        en: "Values are token utility names; the veil rows come from the veil-field definition in globals.css.",
      },
      rows: [
        { state: "Solid", slot: "Box", property: "background", value: "bg-bg-surface" },
        { state: "Solid", slot: "Box", property: "border", value: "1px border-border-default" },
        {
          state: "Solid · disabled",
          slot: "Box",
          property: "background",
          value: "bg-bg-subtle",
          note: { ko: "input이 disabled이면 상자도 회색으로 내려갑니다.", en: "A disabled input pulls the box down to the subtle fill." },
        },
        {
          state: "Solid · invalid",
          slot: "Box",
          property: "border",
          value: "border-border-danger",
        },
        { state: "Solid on page", slot: "Box", property: "background", value: "bg-bg-default" },
        { state: "Solid on page", slot: "Box", property: "border", value: "1px border-border-default" },
        {
          state: "Solid on page · disabled",
          slot: "Box",
          property: "background",
          value: "bg-bg-subtle",
        },
        { state: "Glass", slot: "Box", property: "background", value: "veil-field" },
        {
          state: "Glass",
          slot: "Box",
          property: "blur",
          value: "8px",
          note: { ko: "채도는 1.6입니다.", en: "Saturation is 1.6." },
        },
        {
          state: "Glass",
          slot: "Box",
          property: "border",
          value: "1px transparent",
          note: {
            ko: "테두리 대신 1px 링을 그림자로 그립니다.",
            en: "The 1px ring is drawn as a shadow instead of a border.",
          },
        },
        { state: "Glass", slot: "Box", property: "shadow", value: "0 2px 10px" },
        {
          state: "Glass · focus",
          slot: "Box",
          property: "background",
          value: "veil-field-focus",
        },
        { state: "Glass · disabled", slot: "Box", property: "opacity", value: "60%" },
        {
          state: "Glass · invalid",
          slot: "Box",
          property: "ring",
          value: "1px border-border-danger",
        },
      ],
    },
    {
      id: "size-metrics",
      title: { ko: "크기별 값", en: "Sizes" },
      rows: [
        { state: "sm", slot: "Box", property: "height", value: "32px" },
        { state: "sm", slot: "Box", property: "padding-x", value: "12px" },
        { state: "sm", slot: "Box", property: "gap", value: "6px" },
        { state: "sm", slot: "Box", property: "radius", value: "rounded-md" },
        { state: "sm", slot: "Field", property: "font", value: "text-body-sm" },
        { state: "sm", slot: "Icon", property: "size", value: "16px" },
        { state: "md", slot: "Box", property: "height", value: "40px" },
        { state: "md", slot: "Box", property: "padding-x", value: "14px" },
        { state: "md", slot: "Box", property: "gap", value: "8px" },
        { state: "md", slot: "Box", property: "radius", value: "rounded-md" },
        { state: "md", slot: "Field", property: "font", value: "text-body-md" },
        { state: "md", slot: "Icon", property: "size", value: "16px" },
        { state: "lg", slot: "Box", property: "height", value: "48px" },
        { state: "lg", slot: "Box", property: "padding-x", value: "20px" },
        { state: "lg", slot: "Box", property: "gap", value: "10px" },
        { state: "lg", slot: "Box", property: "radius", value: "rounded-md" },
        { state: "lg", slot: "Field", property: "font", value: "text-body-lg" },
        { state: "lg", slot: "Icon", property: "size", value: "20px" },
      ],
    },
    {
      id: "text-and-focus",
      title: { ko: "글자와 포커스", en: "Text and focus" },
      rows: [
        { state: "default", slot: "Field", property: "text color", value: "text-text-primary" },
        {
          state: "default",
          slot: "Field",
          property: "placeholder",
          value: "text-text-placeholder",
        },
        { state: "default", slot: "Field", property: "background", value: "bg-transparent" },
        { state: "default", slot: "Icon", property: "text color", value: "text-text-secondary" },
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
            ko: "input이 아니라 상자에 그려서 링이 필드에서 떨어지지 않습니다.",
            en: "Drawn on the box rather than the input, so the ring never detaches from the field.",
          },
        },
        {
          state: "disabled",
          slot: "Field",
          property: "text color",
          value: "text-text-disabled",
        },
        {
          state: "disabled",
          slot: "Field",
          property: "cursor",
          value: "not-allowed",
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
        ko: "solid, solid-on-page, glass 세 표면을 같은 값으로 놓았습니다. glass는 배경 위에서 흐림이 보입니다.",
        en: "The solid, solid-on-page and glass surfaces side by side with the same value. Glass shows its blur over a backdrop.",
      },
    },
    {
      id: "sizes",
      title: { ko: "크기", en: "Sizes" },
      description: {
        ko: "sm, md, lg 세 높이와 그에 맞는 글자 단계를 보여 줍니다.",
        en: "The sm, md and lg heights with the text rung each one sets.",
      },
    },
    {
      id: "with-icon",
      title: { ko: "아이콘 포함", en: "With an icon" },
      description: {
        ko: "검색 아이콘을 앞에 두면 크기와 색을 Input이 정합니다.",
        en: "A leading search icon takes its size and color from the Input.",
      },
    },
    {
      id: "states",
      title: { ko: "상태", en: "States" },
      description: {
        ko: "오류, 비활성, 읽기 전용 입력을 한자리에 놓았습니다.",
        en: "An invalid, a disabled and a read-only input together.",
      },
    },
  ],
  accessibility: {
    pattern: { label: "WAI-ARIA Textbox Pattern", href: "https://www.w3.org/WAI/ARIA/apg/patterns/textbox/" },
    notes: [
      {
        ko: "입력에는 이름이 있어야 합니다. Field 안에 두고 FieldLabel을 붙이거나, 그렇지 않으면 aria-label을 직접 줍니다.",
        en: "Every input needs a name: either a FieldLabel inside a Field, or an aria-label on the input itself.",
      },
      {
        ko: "invalid는 input의 aria-invalid와 상자의 data-invalid를 함께 설정합니다. 색만 바꾸지 말고 오류 문구도 FieldError나 FieldDescription으로 함께 남깁니다.",
        en: "invalid sets aria-invalid on the input and data-invalid on the box. Pair the color change with a message through FieldError or FieldDescription.",
      },
      {
        ko: "포커스 링은 상자에 그리며 outline offset 2px만큼 떨어뜨립니다. 대비가 유지되도록 임의로 지우지 않습니다.",
        en: "The focus ring is drawn on the box, held 2px off it. Do not remove it; it keeps contrast on every surface.",
      },
    ],
    keyboard: [
      {
        keys: ["Tab"],
        action: { ko: "입력에 포커스를 주거나 다음 요소로 이동합니다.", en: "Focuses the input, or moves on to the next control." },
      },
      {
        keys: ["Home", "End"],
        action: {
          ko: "커서를 입력한 글자의 처음이나 끝으로 옮깁니다.",
          en: "Moves the caret to the start or the end of the typed text.",
        },
      },
    ],
  },
};
