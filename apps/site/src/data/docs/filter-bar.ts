/**
 * Reference doc for `FilterBar`, written against
 * `packages/react/src/components/filter-bar.tsx` and
 * `packages/flutter/lib/src/components/filter_bar.dart`.
 */
import type { ComponentDoc } from "@/lib/component-docs";

export const doc: ComponentDoc = {
  slug: "filter-bar",
  anatomy: {
    description: {
      ko: "FilterBar는 목록 위에서 보이는 항목을 하나 고르는 알약 트레이입니다. 트랙 안에서 선택 알약이 옮겨 다니고, 각 항목은 개수를 함께 보여 줄 수 있습니다.",
      en: "A FilterBar is a pill tray that picks one visible subset of a list. A pill slides between options inside the track, and each option can show a count.",
    },
    parts: [
      {
        name: "Track",
        slot: "div",
        description: {
          ko: "항목을 담는 radiogroup 컨테이너입니다. 5% 잉크 바탕의 알약이고, 항목이 넘치면 안쪽에서 가로로 스크롤합니다.",
          en: "The radiogroup container holding the options: a 5% ink pill that scrolls sideways inside when the options overflow.",
        },
      },
      {
        name: "Indicator",
        slot: "Indicator",
        description: {
          ko: "선택된 항목 아래에 놓이는 10% 잉크 알약입니다. 장식이라 aria-hidden으로 읽히지 않습니다.",
          en: "The 10% ink pill under the selected option. It is decorative and hidden from assistive tech.",
        },
      },
      {
        name: "Option",
        slot: "items",
        description: {
          ko: "항목 하나입니다. role이 radio인 button으로 렌더링되고 aria-checked로 선택을 알립니다.",
          en: "One option, rendered as a button with role radio and aria-checked for the selection.",
        },
      },
      {
        name: "Label",
        slot: "items.label",
        description: {
          ko: "항목의 문구입니다. All이나 Agents처럼 짧은 명사를 쓰고 옆의 숫자와 함께 읽힙니다.",
          en: "The option's text: a short noun such as All or Agents, read together with the number beside it.",
        },
      },
      {
        name: "Count",
        slot: "items.count",
        description: {
          ko: "문구 뒤의 개수입니다. 값을 넘기지 않으면 자리가 생기지 않습니다.",
          en: "The count after the label. Leave it out and the slot is not reserved.",
        },
      },
    ],
  },
  properties: [
    {
      id: "items",
      title: { ko: "items", en: "items" },
      description: {
        ko: "표시 순서대로 놓이는 항목입니다. 각 항목은 value, label, 선택인 count, 그리고 그 항목만 끄는 disabled를 가집니다.",
        en: "The options in display order. Each carries a value, a label, an optional count, and a disabled flag that turns off that one option.",
      },
      example: "counts",
    },
    {
      id: "value",
      title: { ko: "value", en: "value" },
      description: {
        ko: "선택을 바깥에서 제어할 때 쓰는 값입니다. 넘기면 트랙은 스스로 선택을 바꾸지 않고 onValueChange로만 알립니다.",
        en: "The selection when it is controlled from outside. With it the track never changes its own selection and only reports through onValueChange.",
      },
      example: "controlled",
    },
    {
      id: "defaultValue",
      title: { ko: "defaultValue", en: "defaultValue" },
      description: {
        ko: "제어하지 않을 때의 처음 선택입니다. 넘기지 않으면 첫 항목이 선택되어 목록이 비어 보이지 않습니다.",
        en: "The initial selection when uncontrolled. Without it the first item is selected, so the list never looks unfiltered by accident.",
      },
      example: "disabled",
    },
  ],
  guidelines: [
    {
      id: "one-axis",
      title: { ko: "한 축만 거릅니다", en: "Filter one axis" },
      body: {
        ko: "FilterBar는 상태처럼 한 축의 값을 하나 고릅니다. 축이 여러 개면 바를 나란히 두거나, 각 바에 aria-label을 달아 무엇을 거르는지 구분합니다.",
        en: "A FilterBar picks one value on one axis, such as status. With several axes put the bars side by side and give each an aria-label saying what it filters.",
      },
      do: {
        ko: "상태 축을 거르는 바 하나에 aria-label=\"Status\"를 붙입니다.",
        en: "Give the status bar aria-label=\"Status\".",
      },
      dont: {
        ko: "상태와 기간을 한 바에 섞지 않습니다.",
        en: "Do not mix status and period in one bar.",
      },
      example: "counts",
    },
    {
      id: "counts-that-help",
      title: { ko: "개수는 판단에 도움이 될 때만", en: "Counts only when they inform" },
      body: {
        ko: "count는 항목이 몇 개나 있는지 보고 고를 때 씁니다. 개수가 모두 0이거나 늘 같은 값이면 정보가 되지 않으므로 빼고, 대신 목록의 빈 상태에서 개수를 설명합니다.",
        en: "Use count when the size of each subset helps the choice. When every count is zero or always the same it carries no information, so drop it and explain the numbers in the list's empty state instead.",
      },
      example: "counts",
    },
    {
      id: "disable-with-reason",
      title: { ko: "끌 항목은 이유와 함께", en: "Disable with a reason" },
      body: {
        ko: "항목 하나를 disabled로 두면 40% 불투명도로 흐려지고 눌리지 않습니다. 그 항목이 왜 꺼져 있는지 화면 어딘가에서 읽을 수 있어야 하며, 이유를 말할 수 없다면 목록에서 빼는 편이 낫습니다.",
        en: "A disabled option fades to 40% opacity and stops responding. Somewhere on the screen the reader has to learn why it is off; without an answer, leave the option out of the list.",
      },
      example: "disabled",
    },
    {
      id: "selection-not-navigation",
      title: { ko: "선택이지 이동이 아닙니다", en: "A selection, not a destination" },
      body: {
        ko: "FilterBar는 같은 목록의 보이는 범위를 바꿉니다. 화면을 옮기는 탭이라면 Tabs를, 최상위 목적지 이동이라면 TabBar를 씁니다.",
        en: "A FilterBar changes which part of one list is visible. For tabs that switch screens use Tabs, and for top-level destinations use TabBar.",
      },
      example: "controlled",
    },
  ],
  specification: [
    {
      id: "track",
      title: { ko: "트랙", en: "Track" },
      note: {
        ko: "트랙은 내용 폭만큼 넓어지고, 컨테이너보다 넓어질 때만 스크롤합니다.",
        en: "The track takes its content width and scrolls only when that exceeds its box.",
      },
      rows: [
        { state: "any", slot: "Track", property: "background", value: "bg-overlay-ink-5" },
        { state: "any", slot: "Track", property: "radius", value: "rounded-full" },
        { state: "any", slot: "Track", property: "padding", value: "p-[3px]" },
        { state: "any", slot: "Track", property: "gap", value: "gap-0.5" },
        { state: "any", slot: "Track", property: "overflow", value: "overflow-x-auto" },
        { state: "any", slot: "Indicator", property: "background", value: "bg-overlay-ink-10" },
        { state: "any", slot: "Indicator", property: "motion", value: "motion-indicator" },
      ],
    },
    {
      id: "option",
      title: { ko: "항목", en: "Option" },
      rows: [
        { state: "any", slot: "Option", property: "height", value: "h-7.5" },
        { state: "any", slot: "Option", property: "padding", value: "px-4" },
        { state: "any", slot: "Option", property: "gap", value: "gap-1.5" },
        { state: "any", slot: "Option", property: "radius", value: "rounded-full" },
        { state: "any", slot: "Label", property: "font", value: "text-label-md" },
        { state: "any", slot: "Count", property: "font", value: "text-caption" },
        { state: "any", slot: "Count", property: "text color", value: "text-text-secondary" },
        { state: "default", slot: "Option", property: "text color", value: "text-text-secondary" },
        { state: "hover", slot: "Option", property: "background", value: "bg-overlay-ink-5" },
        { state: "hover", slot: "Option", property: "text color", value: "text-text-primary" },
        { state: "selected", slot: "Option", property: "text color", value: "text-text-primary" },
        { state: "focus-visible", slot: "Option", property: "outline", value: "2px outline-text-brand" },
        { state: "focus-visible", slot: "Option", property: "outline offset", value: "2px" },
        { state: "disabled", slot: "Option", property: "opacity", value: "40%" },
        { state: "any", slot: "Option", property: "motion", value: "motion-colors" },
      ],
    },
  ],
  examples: [
    {
      id: "counts",
      title: { ko: "개수 표시", en: "With counts" },
      description: {
        ko: "다섯 항목에 개수를 붙인 기본 바입니다. 첫 항목이 처음 선택으로 잡힙니다.",
        en: "The base bar with counts on five options. The first option starts selected.",
      },
    },
    {
      id: "disabled",
      title: { ko: "꺼진 항목", en: "A disabled option" },
      description: {
        ko: "Failed 항목 하나를 꺼 두고 Needs review를 선택한 예입니다. 꺼진 항목은 흐려지고 눌리지 않습니다.",
        en: "Failed turned off with Needs review selected. The disabled option fades and stops responding.",
      },
    },
    {
      id: "controlled",
      title: { ko: "제어된 선택", en: "Controlled selection" },
      description: {
        ko: "선택을 상태로 들고 value로 넘기는 예입니다. 고른 값은 onValueChange로 돌아옵니다.",
        en: "The selection lives in state and is passed as value. Picked values come back through onValueChange.",
      },
    },
  ],
  accessibility: {
    notes: [
      {
        ko: "트랙은 role=radiogroup이고 각 항목은 role=radio에 aria-checked를 붙입니다. 한 번에 하나만 선택되는 묶음이라는 뜻이므로 체크박스처럼 여러 개를 켜는 용도로 쓰지 않습니다.",
        en: "The track is a radiogroup and each option is a radio with aria-checked. That says one choice at a time, so never use a FilterBar to turn several options on together.",
      },
      {
        ko: "트랙에는 보이는 이름이 없으므로 aria-label을 넘깁니다. 값이 없으면 Filter가 붙지만, 화면에 바가 둘 이상이면 무엇을 거르는지 구분되지 않습니다.",
        en: "The track has no visible name, so pass aria-label. It falls back to Filter, which does not tell two bars on one screen apart.",
      },
      {
        ko: "모든 항목이 탭 순서에 들어가는 방식이고 로빙 탭 인덱스는 쓰지 않습니다. 항목이 많으면 탭을 여러 번 눌러야 하므로 한 바의 항목은 다섯 개 안팎으로 유지합니다.",
        en: "Every option is a tab stop; there is no roving tab index. Many options mean many Tab presses, so keep a bar to about five.",
      },
      {
        ko: "선택 알약은 인디케이터의 이동으로 나타나고 처음 그릴 때는 애니메이션 없이 자리를 잡습니다. 동작 줄이기를 켜면 이후 이동도 즉시 끝납니다.",
        en: "The selection shows through the indicator's travel, which lands without animating on the first paint. With reduced motion on, later moves finish instantly too.",
      },
    ],
    keyboard: [
      {
        keys: ["Tab"],
        action: {
          ko: "켜진 항목 사이로 포커스를 옮깁니다. 꺼진 항목은 포커스를 받지 않습니다.",
          en: "Moves focus between the enabled options; a disabled option takes no focus.",
        },
      },
      {
        keys: ["Space", "Enter"],
        action: { ko: "포커스한 항목을 선택합니다.", en: "Selects the focused option." },
      },
    ],
  },
};
