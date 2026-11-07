/**
 * Reference doc for `Chip`, written against
 * `packages/react/src/components/chip.tsx` and
 * `packages/flutter/lib/src/components/chip.dart`.
 */
import type { ComponentDoc } from "@/lib/component-docs";

export const doc: ComponentDoc = {
  slug: "chip",
  anatomy: {
    description: {
      ko: "Chip은 눌러서 켜고 끄는 알약 모양 토글입니다. 테두리와 바탕을 가진 컨테이너 안에 체크 아이콘이 들어갈 자리와 라벨이 차례로 놓이고, 선택되면 그 자리가 열리면서 체크가 나타납니다.",
      en: "A Chip is a pill-shaped toggle you press on and off. A bordered container holds a slot for a check icon and then the label; on selection the slot opens and the check appears.",
    },
    parts: [
      {
        name: "Container",
        slot: "button",
        description: {
          ko: "실제 button 요소입니다. aria-pressed로 켜짐과 꺼짐을 알리고, 0.97 눌림과 40% 비활성 흐림을 이 요소가 받습니다.",
          en: "The real button element. It reports on and off through aria-pressed, and carries the 0.97 press scale and the 40% disabled fade.",
        },
      },
      {
        name: "Check slot",
        slot: "Check",
        description: {
          ko: "라벨 앞의 체크 자리입니다. 선택 전에는 너비 0이라 자리를 차지하지 않고, 선택되면 아이콘 크기와 라벨 간격만큼 열립니다.",
          en: "The check slot before the label. It is 0px wide until the chip is selected, then opens to the icon width plus the label gap.",
        },
      },
      {
        name: "Label",
        slot: "children",
        description: {
          ko: "칩의 문구입니다. 엘리먼트 자식을 주면 같은 간격으로 한 줄에 배치합니다.",
          en: "The chip's text. Element children are laid out in one row at the same gap.",
        },
      },
    ],
  },
  properties: [
    {
      id: "size",
      title: { ko: "size", en: "size" },
      description: {
        ko: "칩의 높이와 라벨 단계입니다. 같은 줄에 놓는 칩은 같은 크기를 씁니다.",
        en: "Height and label rung of the chip. Chips in one row share the same size.",
      },
      values: [
        {
          name: "sm",
          description: {
            ko: "높이 28px에 label-sm 라벨을 씁니다. 좁은 필터 줄에 맞습니다.",
            en: "28px tall with a label-sm label, for a dense filter row.",
          },
        },
        {
          name: "md",
          description: {
            ko: "높이 32px에 label-md 라벨을 씁니다. 기본값입니다.",
            en: "32px tall with a label-md label. The default.",
          },
        },
        {
          name: "lg",
          description: {
            ko: "높이 36px에 label-lg 라벨을 씁니다. 손가락이 주 입력인 화면에 맞습니다.",
            en: "36px tall with a label-lg label, for touch-first screens.",
          },
        },
      ],
      example: "sizes",
    },
    {
      id: "pressed",
      title: { ko: "pressed", en: "pressed" },
      description: {
        ko: "선택 여부를 바깥에서 들고 있을 때 쓰는 제어 값입니다. 값을 주면 제어 모드가 되고, 주지 않으면 칩이 스스로 상태를 들고 onPressedChange로 알립니다.",
        en: "The controlled selection value. Passing it makes the chip controlled; leaving it out lets the chip hold its own state and report through onPressedChange.",
      },
      example: "controlled",
    },
    {
      id: "defaultPressed",
      title: { ko: "defaultPressed", en: "defaultPressed" },
      description: {
        ko: "처음 그려질 때의 선택 상태입니다. 이미 적용된 필터를 보여 줄 때 씁니다. 체크 슬롯은 첫 토글 뒤에만 애니메이션하므로, 선택된 채로 마운트된 칩은 체크가 번쩍이지 않습니다.",
        en: "The selection state at first render, for showing filters that already apply. The check slot only animates after the first toggle, so a chip mounted pressed does not flash its check.",
      },
      example: "filter-row",
    },
    {
      id: "disabled",
      title: { ko: "disabled", en: "disabled" },
      description: {
        ko: "참이면 칩이 40% 불투명도로 흐려지고 커서가 not-allowed로 바뀌며 눌리지 않습니다. 지금 고를 수 없는 필터를 자리에서 지우지 않고 이 상태로 남깁니다.",
        en: "When true the chip fades to 40% opacity, the cursor becomes not-allowed, and it stops responding. Keep a filter that cannot be chosen right now in place this way.",
      },
      example: "filter-row",
    },
  ],
  guidelines: [
    {
      id: "chip-vs-segmented",
      title: { ko: "여러 개를 동시에 켤 때는 Chip, 하나만 고를 때는 SegmentedControl", en: "Chip for many at once, SegmentedControl for one" },
      body: {
        ko: "Chip은 서로 독립입니다. 태그나 필터처럼 여러 개를 함께 켜 둘 수 있는 목록에 씁니다. 목록에서 정확히 하나만 고르는 자리라면 선택 표시가 이동하는 SegmentedControl을 씁니다.",
        en: "Chips are independent of each other, so use them for tags and filters where several can be on at once. When exactly one choice is allowed, use SegmentedControl whose selection pill moves.",
      },
      do: {
        ko: "받은 편지함, 초안, 보관함을 동시에 켜는 필터 줄에 Chip을 씁니다.",
        en: "Use chips in a filter row where Inbox, Drafts and Archive can all be on.",
      },
      dont: {
        ko: "보기 세 가지 중 하나를 고르는 자리에 Chip을 나란히 두지 않습니다.",
        en: "Do not line up chips where one of three views must be chosen.",
      },
      example: "filter-row",
    },
    {
      id: "short-labels",
      title: { ko: "라벨은 한두 단어로", en: "Keep labels to a word or two" },
      body: {
        ko: "칩은 한 줄을 나란히 나눠 쓰는 컨트롤입니다. 라벨이 길어지면 줄이 넘치고 어떤 칩이 켜졌는지 한눈에 읽히지 않습니다. 라벨이 두 단어를 넘으면 칩 대신 목록 항목이나 체크박스를 씁니다.",
        en: "Chips share one row, so a long label pushes the row over and the on states stop reading at a glance. Past two words, use a list row or a checkbox instead.",
      },
      example: "sizes",
    },
    {
      id: "solid-only",
      title: { ko: "유리 대신 불투명 바탕", en: "Opaque fill, not glass" },
      body: {
        ko: "Chip은 불투명한 바탕과 테두리로 그려집니다. 카드나 페이지 위에 놓고, 이미지 위에 띄우는 크롬에는 쓰지 않습니다. 떠 있는 면 위의 선택은 glass surface를 가진 SegmentedControl이 맡습니다.",
        en: "A chip is drawn with an opaque fill and a border, meant for cards and pages rather than chrome floating over imagery. For a selection on a floating surface, use a SegmentedControl with its glass surface.",
      },
    },
  ],
  specification: [
    {
      id: "size-metrics",
      title: { ko: "크기별 값", en: "Sizes" },
      note: {
        ko: "값은 컴포넌트 클래스의 토큰 유틸 이름이고, 크기는 해당 유틸이 만드는 픽셀 값입니다.",
        en: "Values are the token utility names from the component classes; sizes are the pixels those utilities produce.",
      },
      rows: [
        { state: "sm", slot: "Container", property: "height", value: "h-7 (28px)" },
        { state: "sm", slot: "Container", property: "padding-x", value: "px-2.5" },
        { state: "sm", slot: "Label", property: "font", value: "text-label-sm" },
        { state: "sm", slot: "Check", property: "size", value: "size-3" },
        { state: "sm", slot: "Check slot", property: "open width", value: "18px" },
        { state: "md", slot: "Container", property: "height", value: "h-8 (32px)" },
        { state: "md", slot: "Container", property: "padding-x", value: "px-3" },
        { state: "md", slot: "Label", property: "font", value: "text-label-md" },
        { state: "md", slot: "Check", property: "size", value: "size-3.5" },
        { state: "md", slot: "Check slot", property: "open width", value: "22px" },
        { state: "lg", slot: "Container", property: "height", value: "h-9 (36px)" },
        { state: "lg", slot: "Container", property: "padding-x", value: "px-3.5" },
        { state: "lg", slot: "Label", property: "font", value: "text-label-lg" },
        { state: "lg", slot: "Check", property: "size", value: "size-4" },
        { state: "lg", slot: "Check slot", property: "open width", value: "26px" },
        { state: "default", slot: "Container", property: "radius", value: "rounded-full" },
        {
          state: "element child",
          slot: "Label",
          property: "gap",
          value: "gap-1.5",
          note: {
            ko: "문구가 아니라 엘리먼트 자식을 넣었을 때만 라벨 안쪽에서 아이콘과 글자 사이에 붙습니다.",
            en: "Applied inside the label, between an icon and text, only when an element child is passed instead of a string.",
          },
        },
      ],
    },
    {
      id: "states",
      title: { ko: "상태", en: "States" },
      rows: [
        { state: "default", slot: "Container", property: "background", value: "bg-bg-surface" },
        { state: "default", slot: "Container", property: "border", value: "1px border-border-default" },
        { state: "default", slot: "Label", property: "text color", value: "text-text-primary" },
        { state: "hover", slot: "Container", property: "background", value: "bg-bg-subtle" },
        { state: "selected", slot: "Container", property: "border", value: "border-border-brand" },
        { state: "selected", slot: "Label", property: "text color", value: "text-text-brand" },
        {
          state: "selected",
          slot: "Check",
          property: "opacity",
          value: "0 → 1",
          note: {
            ko: "선택될 때만 체크가 보입니다.",
            en: "The check shows only while selected.",
          },
        },
        { state: "focus-visible", slot: "Container", property: "outline", value: "2px outline-text-brand" },
        {
          state: "focus-visible",
          slot: "Container",
          property: "outline offset",
          value: "2px",
          note: {
            ko: "키보드로 포커스가 닿았을 때만 그립니다.",
            en: "Drawn only when focus arrives from the keyboard.",
          },
        },
        { state: "disabled", slot: "Container", property: "opacity", value: "40%" },
        { state: "disabled", slot: "Container", property: "cursor", value: "not-allowed" },
      ],
    },
    {
      id: "motion",
      title: { ko: "모션", en: "Motion" },
      rows: [
        { state: "press", slot: "Container", property: "motion", value: "motion-press" },
        { state: "press", slot: "Container", property: "scale", value: "0.97" },
        { state: "select", slot: "Check slot", property: "transition", value: "transition-[width] duration-150 ease-out" },
        { state: "select", slot: "Check", property: "motion", value: "animate-pop-in / animate-pop-out" },
      ],
    },
  ],
  examples: [
    {
      id: "sizes",
      title: { ko: "크기", en: "Sizes" },
      description: {
        ko: "세 높이를 선택된 상태로 놓았습니다. 체크 슬롯이 열린 모양을 나란히 비교할 수 있습니다.",
        en: "The three heights, all selected, so the opened check slot can be compared side by side.",
      },
    },
    {
      id: "filter-row",
      title: { ko: "필터 줄", en: "Filter row" },
      description: {
        ko: "여러 개를 함께 켜 두는 필터 줄입니다. 지금 고를 수 없는 칩은 disabled로 남겨 둡니다.",
        en: "A filter row where several chips stay on at once, with the one that cannot be picked left disabled.",
      },
    },
    {
      id: "controlled",
      title: { ko: "제어 선택", en: "Controlled selection" },
      description: {
        ko: "pressed와 onPressedChange로 선택을 바깥에서 들고, 켜진 태그를 아래에 요약합니다.",
        en: "Holding the selection outside through pressed and onPressedChange and summarising the chosen tags below.",
      },
    },
  ],
  accessibility: {
    notes: [
      {
        ko: "칩은 aria-pressed를 가진 토글 버튼이라 스크린 리더가 켜짐과 꺼짐을 읽습니다. 칩의 문구가 곧 접근 가능한 이름이므로, 이름 없이 아이콘만 넣지 않습니다.",
        en: "A chip is a toggle button with aria-pressed, so a screen reader reads on and off. Its text is the accessible name, so never ship one that is only an icon.",
      },
      {
        ko: "선택 표시를 색과 체크에 함께 두어 색만으로 상태를 구분하지 않아도 됩니다. 테두리와 글자색이 함께 brand로 바뀌고 체크가 붙습니다.",
        en: "Selection shows in both color and a check, so the state does not depend on color alone: the border and label turn brand and a check appears.",
      },
      {
        ko: "포커스 표시는 2px outline을 2px 떨어뜨려 그립니다. 칩을 감싸는 쪽에서 outline을 지우지 않습니다.",
        en: "The focus ring is a 2px outline held 2px off the chip. Do not remove it from a wrapping element.",
      },
    ],
    keyboard: [
      {
        keys: ["Enter"],
        action: { ko: "칩의 선택을 뒤집습니다.", en: "Flips the chip's pressed state." },
      },
      {
        keys: ["Space"],
        action: { ko: "칩의 선택을 뒤집습니다.", en: "Flips the chip's pressed state." },
      },
      {
        keys: ["Tab"],
        action: { ko: "다음 포커스 가능한 요소로 이동합니다.", en: "Moves focus to the next focusable control." },
      },
    ],
  },
};
