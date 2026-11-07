/**
 * Reference doc for `RadioGroup` and `Radio`, written against
 * `packages/react/src/components/radio-group.tsx` and
 * `packages/flutter/lib/src/components/radio_group.dart`.
 */
import type { ComponentDoc } from "@/lib/component-docs";

export const doc: ComponentDoc = {
  slug: "radio-group",
  anatomy: {
    description: {
      ko: "RadioGroup은 선택지 중 하나만 고르게 하는 묶음입니다. 그룹이 선택 상태와 마크 크기를 함께 들고, Radio가 그 값을 이어받습니다.",
      en: "A RadioGroup lets exactly one option be chosen. The group holds the selection and the mark size, and each Radio takes both from it.",
    },
    parts: [
      {
        name: "Group",
        slot: "RadioGroup",
        description: {
          ko: "Radio를 12px 간격으로 세로로 쌓는 열입니다. 화살표 키 이동과 선택 상태를 맡습니다.",
          en: "The column that stacks the radios 12px apart; it owns arrow-key movement and the selection.",
        },
      },
      {
        name: "Radio",
        slot: "Radio",
        description: {
          ko: "선택지 하나입니다. 원형 마크와 라벨이 하나의 label 안에 있습니다.",
          en: "One option: a circular mark and its label inside one label element.",
        },
      },
      {
        name: "Mark",
        slot: "Indicator",
        description: {
          ko: "테두리 원과 가운데 점입니다. 선택되면 원이 브랜드 색으로 채워지고 점이 튀어나옵니다.",
          en: "The ring and its center dot. Once checked the ring fills with the brand color and the dot pops in.",
        },
      },
    ],
  },
  properties: [
    {
      id: "size",
      title: { ko: "size", en: "size" },
      description: {
        ko: "그룹의 마크 크기와 라벨 글자입니다. Radio에 직접 주면 그 하나만 다른 크기를 쓸 수 있습니다.",
        en: "The group's mark size and label rung. A single Radio can override it with its own size.",
      },
      values: [
        {
          name: "sm",
          description: {
            ko: "원 16px에 6px 점, body-sm 라벨입니다.",
            en: "A 16px circle with a 6px dot and a body-sm label.",
          },
        },
        {
          name: "md",
          description: {
            ko: "원 20px에 8px 점, body-md 라벨입니다. 기본값입니다.",
            en: "A 20px circle with an 8px dot and a body-md label. The default.",
          },
        },
        {
          name: "lg",
          description: {
            ko: "원 24px에 10px 점, body-lg 라벨입니다.",
            en: "A 24px circle with a 10px dot and a body-lg label.",
          },
        },
      ],
      example: "sizes",
    },
    {
      id: "label",
      title: { ko: "label", en: "label" },
      description: {
        ko: "선택지의 글자입니다. 마크와 같은 label 안에 있어서 글자를 눌러도 선택됩니다.",
        en: "The option's text. It shares the label with the mark, so clicking the text selects it.",
      },
      example: "basic",
    },
    {
      id: "disabled",
      title: { ko: "disabled", en: "disabled" },
      description: {
        ko: "Radio나 그룹에 주면 해당 선택지가 40%로 흐려지고 골라지지 않습니다. 그룹 전체를 막으면 화살표 키도 그 선택지를 건너뜁니다.",
        en: "On a Radio or the group, the option fades to 40% and cannot be chosen; a disabled group also makes the arrow keys skip it.",
      },
      example: "disabled",
    },
    {
      id: "value",
      title: { ko: "value", en: "value" },
      description: {
        ko: "Radio마다 다른 값을 주고, 그룹은 value나 defaultValue로 그중 하나를 선택 상태로 잡습니다.",
        en: "Each Radio carries its own value, and the group picks one of them as selected through value or defaultValue.",
      },
      example: "basic",
    },
  ],
  guidelines: [
    {
      id: "few-visible-options",
      title: { ko: "몇 개만, 모두 보이게", en: "A few options, all visible" },
      body: {
        ko: "선택지를 처음부터 모두 보여 줄 수 있을 때 RadioGroup을 씁니다. 항목이 많거나 자리가 좁으면 Select로 바꿉니다.",
        en: "Use a RadioGroup when every option can be shown from the start. When the list is long or the room is short, switch to a Select.",
      },
      do: {
        ko: "보고 채널 세 개 중 하나를 고르는 자리에 씁니다.",
        en: "Use it to choose one of three report channels.",
      },
      dont: {
        ko: "국가 목록 스무 개를 라디오로 늘어놓지 않습니다.",
        en: "Do not spread twenty countries down a radio list.",
      },
      example: "basic",
    },
    {
      id: "not-for-toggle",
      title: { ko: "켜고 끄는 값에는 쓰지 않습니다", en: "Not for on and off" },
      body: {
        ko: "라디오는 여러 값 중 하나를 고르는 컨트롤입니다. 참과 거짓 두 값만 있으면 Switch를, 서로 독립적인 항목이면 Checkbox를 씁니다.",
        en: "A radio picks one of several values. For a true-or-false setting use a Switch; for independent items, Checkboxes.",
      },
      example: "disabled",
    },
    {
      id: "group-label",
      title: { ko: "그룹에도 이름이 필요합니다", en: "Name the group" },
      body: {
        ko: "그룹의 이름은 선택지들이 무엇에 대한 것인지 말합니다. 화면에 보이는 제목이 있으면 그 id를 aria-labelledby로 연결하고, 없으면 aria-label을 붙입니다. Field는 컨트롤 하나를 감싸므로 라디오 여러 개를 Field 안에 넣지 않습니다.",
        en: "The group's name says what the options are about. Point aria-labelledby at a visible heading, or set aria-label when there is none. Field wraps a single control, so do not put several radios inside one Field.",
      },
      example: "basic",
    },
  ],
  specification: [
    {
      id: "size-metrics",
      title: { ko: "크기별 값", en: "Sizes" },
      rows: [
        { state: "sm", slot: "Mark", property: "size", value: "16px" },
        { state: "sm", slot: "Mark", property: "dot size", value: "6px" },
        { state: "sm", slot: "Radio", property: "gap", value: "8px" },
        { state: "sm", slot: "Radio", property: "font", value: "text-body-sm" },
        { state: "md", slot: "Mark", property: "size", value: "20px" },
        { state: "md", slot: "Mark", property: "dot size", value: "8px" },
        { state: "md", slot: "Radio", property: "gap", value: "10px" },
        { state: "md", slot: "Radio", property: "font", value: "text-body-md" },
        { state: "lg", slot: "Mark", property: "size", value: "24px" },
        { state: "lg", slot: "Mark", property: "dot size", value: "10px" },
        { state: "lg", slot: "Radio", property: "gap", value: "12px" },
        { state: "lg", slot: "Radio", property: "font", value: "text-body-lg" },
        { state: "all", slot: "Group", property: "gap", value: "12px" },
        { state: "all", slot: "Mark", property: "radius", value: "9999px" },
        { state: "all", slot: "Mark", property: "border", value: "1.5px border-border-strong" },
      ],
    },
    {
      id: "states",
      title: { ko: "상태", en: "States" },
      rows: [
        { state: "unchecked", slot: "Mark", property: "background", value: "bg-bg-surface" },
        {
          state: "unchecked · hover",
          slot: "Mark",
          property: "border",
          value: "border-text-secondary",
        },
        { state: "checked", slot: "Mark", property: "background", value: "bg-interactive-primary" },
        { state: "checked", slot: "Mark", property: "border", value: "border-interactive-primary" },
        { state: "checked", slot: "Mark", property: "dot color", value: "bg-interactive-on-primary" },
        {
          state: "checked · hover",
          slot: "Mark",
          property: "background",
          value: "bg-interactive-primary-hover",
        },
        { state: "all", slot: "Radio", property: "text color", value: "text-text-primary" },
        {
          state: "focus-visible",
          slot: "Mark",
          property: "outline",
          value: "2px outline-text-brand",
        },
        { state: "focus-visible", slot: "Mark", property: "outline offset", value: "2px" },
        { state: "disabled", slot: "Radio", property: "opacity", value: "40%" },
        { state: "disabled", slot: "Radio", property: "cursor", value: "not-allowed" },
        {
          state: "checked · enter",
          slot: "Indicator",
          property: "motion",
          value: "animate-pop-in",
        },
        { state: "checked · exit", slot: "Indicator", property: "motion", value: "animate-scale-out" },
        { state: "all", slot: "Mark", property: "motion", value: "motion-colors" },
      ],
    },
  ],
  examples: [
    {
      id: "basic",
      title: { ko: "기본", en: "Basic" },
      description: {
        ko: "보고 채널 하나를 고르는 그룹입니다. 처음부터 하나가 선택되어 있습니다.",
        en: "A group for choosing one report channel, with one option already selected.",
      },
    },
    {
      id: "sizes",
      title: { ko: "크기", en: "Sizes" },
      description: {
        ko: "sm, md, lg 세 마크와 라벨 크기를 나란히 비교합니다.",
        en: "The sm, md and lg marks and labels side by side.",
      },
    },
    {
      id: "disabled",
      title: { ko: "비활성", en: "Disabled" },
      description: {
        ko: "선택할 수 없는 선택지 하나와, 전체가 비활성인 그룹을 보여 줍니다.",
        en: "One unavailable option, plus a group that is disabled entirely.",
      },
    },
  ],
  accessibility: {
    pattern: {
      label: "WAI-ARIA Radio Group Pattern",
      href: "https://www.w3.org/WAI/ARIA/apg/patterns/radiogroup/",
    },
    notes: [
      {
        ko: "그룹에는 aria-label이나 연결된 라벨이 필요합니다. 없으면 화면 낭독기가 선택지가 무엇에 대한 것인지 읽지 못합니다.",
        en: "The group needs an aria-label or a connected label, or a screen reader cannot say what the options are about.",
      },
      {
        ko: "그룹 전체가 Tab 정지점 하나입니다. Tab으로 들어가면 선택된 라디오에 포커스가 가고, 화살표 키로 옮기면 그 자리에서 선택도 바뀝니다.",
        en: "The whole group is one tab stop. Tab lands on the selected radio, and moving with the arrow keys selects as it goes.",
      },
      {
        ko: "선택 상태는 가운데 점으로 보입니다. 점의 대비가 낮아 보이는 테마에서도 알아볼 수 있도록 테마 토큰을 임의로 바꾸지 않습니다.",
        en: "The choice shows as the center dot. Do not repaint the theme tokens; the dot keeps its contrast in both themes.",
      },
    ],
    keyboard: [
      {
        keys: ["ArrowDown", "ArrowRight"],
        action: { ko: "다음 라디오로 옮기고 그 자리에서 선택합니다.", en: "Moves to the next radio and selects it." },
      },
      {
        keys: ["ArrowUp", "ArrowLeft"],
        action: { ko: "이전 라디오로 옮기고 선택합니다.", en: "Moves to the previous radio and selects it." },
      },
      {
        keys: ["Space"],
        action: { ko: "포커스가 있는 라디오를 선택합니다.", en: "Selects the focused radio." },
      },
      {
        keys: ["Tab"],
        action: { ko: "그룹에 들어가거나 그룹을 빠져나갑니다.", en: "Enters the group or leaves it." },
      },
    ],
  },
};
