/**
 * Reference doc for `Field`, written against
 * `packages/react/src/components/field.tsx` and
 * `packages/flutter/lib/src/components/field.dart`.
 */
import type { ComponentDoc } from "@/lib/component-docs";

export const doc: ComponentDoc = {
  slug: "field",
  anatomy: {
    description: {
      ko: "Field는 라벨, 컨트롤, 도움말과 오류 문구를 세로로 묶는 상자입니다. 간격과 글자 단계는 Field의 size가 정하고, 안쪽 부품이 그 값을 이어받습니다.",
      en: "A Field stacks a label, a control, help text and an error message. Field's size sets the gaps and text rungs, and the parts inside inherit it.",
    },
    parts: [
      {
        name: "Field",
        slot: "Field",
        description: {
          ko: "왼쪽 정렬 세로 열입니다. size에 따라 6/8/10px 간격을 쓰고 너비는 부모를 넘지 않습니다.",
          en: "A left-aligned column with a 6/8/10px gap from size, never wider than its parent.",
        },
      },
      {
        name: "FieldLabel",
        slot: "FieldLabel",
        description: {
          ko: "컨트롤 위의 라벨입니다. htmlFor가 컨트롤의 id와 맞으면 라벨을 눌러도 컨트롤에 포커스가 갑니다.",
          en: "The label above the control. When htmlFor matches the control's id, clicking the text focuses the control.",
        },
      },
      {
        name: "Control",
        slot: "children",
        description: {
          ko: "Input, Textarea, Select 같은 실제 입력입니다. Field가 오류 상태이면 컨트롤의 상자가 danger 테두리를 그립니다.",
          en: "The actual input, such as Input, Textarea or Select. When the field is invalid the control's box paints the danger border.",
        },
      },
      {
        name: "FieldDescription",
        slot: "FieldDescription",
        description: {
          ko: "컨트롤 아래의 도움말입니다. secondary 색이고 Base UI가 컨트롤의 설명으로 연결합니다.",
          en: "Help text under the control, in the secondary color, wired to the control as its description.",
        },
      },
      {
        name: "FieldError",
        slot: "FieldError",
        description: {
          ko: "검증 실패 문구입니다. 나타날 때 아래 부품이 튀지 않고 밀려 내려가도록 행 높이가 함께 열립니다.",
          en: "The validation message. Its row opens as the text fades in, so the parts below glide down instead of jumping.",
        },
      },
    ],
  },
  properties: [
    {
      id: "size",
      title: { ko: "size", en: "size" },
      description: {
        ko: "안쪽 간격과 라벨, 도움말의 글자 단계입니다. 부품마다 크기를 다시 주지 않아도 되도록 컨텍스트로 전달됩니다.",
        en: "The gap and the text rungs of the label and meta lines. Passed by context so each part does not repeat it.",
      },
      values: [
        {
          name: "sm",
          description: {
            ko: "간격 6px, label-sm 라벨, caption 도움말입니다.",
            en: "A 6px gap with a label-sm label and caption meta text.",
          },
        },
        {
          name: "md",
          description: {
            ko: "간격 8px, label-md 라벨, caption 도움말입니다. 기본값입니다.",
            en: "An 8px gap with a label-md label and caption meta text. The default.",
          },
        },
        {
          name: "lg",
          description: {
            ko: "간격 10px, label-lg 라벨, body-sm 도움말입니다.",
            en: "A 10px gap with a label-lg label and body-sm meta text.",
          },
        },
      ],
      example: "sizes",
    },
    {
      id: "invalid",
      title: { ko: "invalid", en: "invalid" },
      description: {
        ko: "참이면 이 필드의 컨트롤이 오류 상태가 되고, 컨트롤의 상자가 danger 테두리를 그립니다. Base UI 검증이 스스로 정할 때도 같은 상태가 됩니다.",
        en: "When true the control inside is marked invalid and its box paints the danger border. Base UI's own validation sets the same state.",
      },
      example: "validation",
    },
    {
      id: "disabled",
      title: { ko: "disabled", en: "disabled" },
      description: {
        ko: "참이면 필드가 비활성 상태가 되고 라벨이 text-disabled로 내려갑니다.",
        en: "When true the field is disabled and its label drops to text-disabled.",
      },
    },
    {
      id: "className",
      title: { ko: "className", en: "className" },
      description: {
        ko: "필드 열에 붙는 클래스입니다. 너비를 정할 때 여기에 줍니다.",
        en: "Classes for the field column. Set the width here.",
      },
    },
  ],
  guidelines: [
    {
      id: "label-for",
      title: { ko: "라벨은 htmlFor로 연결합니다", en: "Connect the label with htmlFor" },
      body: {
        ko: "FieldLabel에 컨트롤의 id와 같은 htmlFor를 주면 라벨 클릭이 컨트롤로 이어지고 화면 낭독기가 이름을 함께 읽습니다. 이 연결이 있으면 컨트롤에 aria-label을 겹쳐 주지 않습니다.",
        en: "Give FieldLabel an htmlFor that matches the control's id: clicking the label then focuses the control and a screen reader reads the name with it. Once it is connected, do not also put an aria-label on the control.",
      },
      do: {
        ko: "FieldLabel htmlFor=\"bot-name\"과 Input id=\"bot-name\"을 맞춥니다.",
        en: "Match FieldLabel htmlFor=\"bot-name\" with Input id=\"bot-name\".",
      },
      dont: {
        ko: "연결 없이 라벨과 입력을 나란히만 두지 않습니다.",
        en: "Do not place a label and an input next to each other without the link.",
      },
      example: "basic",
    },
    {
      id: "error-not-description",
      title: { ko: "오류는 도움말을 대신합니다", en: "An error replaces the help text" },
      body: {
        ko: "FieldError는 도움말 아래에 쌓지 말고 도움말과 같은 자리에 둡니다. 오류가 뜨면 도움말을 감추고 대신 문구를 보여 주어야 사용자가 어느 쪽을 읽어야 할지 헷갈리지 않습니다.",
        en: "Keep the error in the help text's slot rather than stacking it underneath. When the error shows, hide the help and show the message so the reader has one thing to act on.",
      },
      do: {
        ko: "오류가 있을 때만 FieldError를 보여 주고, 그때 도움말은 감춥니다.",
        en: "Render FieldError only while invalid, and hide the help text then.",
      },
      dont: {
        ko: "도움말과 오류를 동시에 쌓지 않습니다.",
        en: "Do not show both the help text and the error at once.",
      },
      example: "validation",
    },
    {
      id: "one-control",
      title: { ko: "필드 하나에 컨트롤 하나", en: "One control per field" },
      body: {
        ko: "Field는 컨트롤 하나의 라벨과 문구를 묶습니다. 값이 여럿이면 Field를 여러 개 두거나 Fieldset을 씁니다. 그래야 오류와 설명이 어느 입력의 것인지 분명해집니다.",
        en: "A Field labels one control. For several values, use several fields, or a Fieldset. That keeps every error and description attached to the right input.",
      },
    },
  ],
  specification: [
    {
      id: "spacing",
      title: { ko: "크기별 간격과 글자", en: "Gaps and type per size" },
      rows: [
        { state: "sm", slot: "Field", property: "gap", value: "6px" },
        { state: "sm", slot: "FieldLabel", property: "font", value: "text-label-sm" },
        { state: "sm", slot: "FieldDescription", property: "font", value: "text-caption" },
        { state: "sm", slot: "FieldError", property: "font", value: "text-caption" },
        { state: "md", slot: "Field", property: "gap", value: "8px" },
        { state: "md", slot: "FieldLabel", property: "font", value: "text-label-md" },
        { state: "md", slot: "FieldDescription", property: "font", value: "text-caption" },
        { state: "md", slot: "FieldError", property: "font", value: "text-caption" },
        { state: "lg", slot: "Field", property: "gap", value: "10px" },
        { state: "lg", slot: "FieldLabel", property: "font", value: "text-label-lg" },
        { state: "lg", slot: "FieldDescription", property: "font", value: "text-body-sm" },
        { state: "lg", slot: "FieldError", property: "font", value: "text-body-sm" },
      ],
    },
    {
      id: "colors-and-motion",
      title: { ko: "색과 움직임", en: "Colors and motion" },
      rows: [
        { state: "default", slot: "FieldLabel", property: "text color", value: "text-text-primary" },
        {
          state: "disabled",
          slot: "FieldLabel",
          property: "text color",
          value: "text-text-disabled",
        },
        { state: "default", slot: "FieldDescription", property: "text color", value: "text-text-secondary" },
        { state: "default", slot: "FieldDescription", property: "width", value: "100%" },
        { state: "invalid", slot: "FieldError", property: "text color", value: "text-text-danger" },
        {
          state: "enter",
          slot: "FieldError",
          property: "motion",
          value: "motion-reveal",
          note: {
            ko: "행이 0fr에서 1fr로 열리며 200ms, 투명도는 150ms입니다.",
            en: "The row opens from 0fr to 1fr over 200ms, with opacity over 150ms.",
          },
        },
        {
          state: "enter",
          slot: "FieldError",
          property: "starting rows",
          value: "0fr",
          note: {
            ko: "data-starting-style과 data-ending-style에서 행이 닫혀 있습니다.",
            en: "The row is closed in data-starting-style and data-ending-style.",
          },
        },
        { state: "layout", slot: "Field", property: "alignment", value: "flex-col items-start" },
        { state: "layout", slot: "Field", property: "max width", value: "100%" },
      ],
    },
  ],
  examples: [
    {
      id: "basic",
      title: { ko: "기본", en: "Basic" },
      description: {
        ko: "라벨, 입력, 도움말을 묶은 가장 단순한 필드입니다.",
        en: "The simplest field: a label, an input and help text.",
      },
    },
    {
      id: "validation",
      title: { ko: "검증", en: "Validation" },
      description: {
        ko: "세 글자보다 짧으면 오류가 나타나고 아래 필드가 밀려 내려갑니다. 두 글자를 입력해 확인합니다.",
        en: "Under three characters the error appears and the field below makes room for it. Type two characters to see it.",
      },
    },
    {
      id: "sizes",
      title: { ko: "크기", en: "Sizes" },
      description: {
        ko: "sm, md, lg 세 간격과 글자 단계를 같은 내용으로 비교합니다.",
        en: "The sm, md and lg gaps and type rungs with the same content.",
      },
    },
  ],
  accessibility: {
    notes: [
      {
        ko: "FieldLabel의 htmlFor와 컨트롤의 id가 같아야 라벨이 컨트롤의 이름이 됩니다. 이 연결이 없으면 화면 낭독기가 입력의 목적을 읽지 못합니다.",
        en: "FieldLabel's htmlFor has to match the control's id for the label to name it. Without that link a screen reader cannot say what the input is for.",
      },
      {
        ko: "FieldDescription은 Base UI가 컨트롤의 설명으로 연결합니다. 별도 aria-describedby를 덧붙이지 않습니다.",
        en: "Base UI wires FieldDescription to the control as its description, so do not add a second aria-describedby.",
      },
      {
        ko: "오류 문구는 색만으로 알리지 않습니다. invalid와 함께 문장을 남겨 색을 구분하지 못하는 사용자도 이유를 알 수 있게 합니다.",
        en: "Do not signal an error by color alone. Keep the sentence next to invalid so someone who cannot separate the colors still learns why.",
      },
    ],
    keyboard: [],
  },
};
