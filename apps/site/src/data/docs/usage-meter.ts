/**
 * Reference doc for `UsageMeter`, written against
 * `packages/react/src/components/usage-meter.tsx` and the current Flutter loading set.
 */
import type { ComponentDoc } from "@/lib/component-docs";

export const doc: ComponentDoc = {
  slug: "usage-meter",
  anatomy: {
    description: {
      ko: "UsageMeter는 할당량을 카드 하나로 보여 줍니다. 라벨과 퍼센트, 진행 막대, 그리고 아래 두 캡션으로 이루어집니다. Base UI의 Meter를 쓰므로 퍼센트가 보조 기술에 전달됩니다.",
      en: "A UsageMeter shows an allowance in one card: a label and percentage, a bar, and two captions underneath. It uses Base UI's Meter, so the percentage reaches assistive technology.",
    },
    parts: [
      {
        name: "Root",
        slot: "Root",
        description: {
          ko: "카드의 바탕과 테두리, 안쪽 여백을 갖는 요소입니다. 최대 폭 300px이고 남는 폭을 채웁니다.",
          en: "The element that carries the card fill, border and padding. It caps at 300px and fills the width it is given.",
        },
      },
      {
        name: "Header",
        slot: "label",
        description: {
          ko: "라벨과 퍼센트가 한 줄에 놓이는 행입니다. 라벨이 왼쪽에서 남는 폭을 쓰고 퍼센트가 오른쪽에 붙습니다.",
          en: "The row with the label and the percentage. The label takes the free width on the left and the percentage pins right.",
        },
      },
      {
        name: "Track",
        slot: "Track",
        description: {
          ko: "높이 6px의 둥근 트랙입니다. 8% 잉크 바탕 위에 사용량만큼 하늘색으로 찹니다.",
          en: "The 6px rounded track. A sky fill covers the used share over an 8% ink track.",
        },
      },
      {
        name: "Captions",
        slot: "detail",
        description: {
          ko: "트랙 아래 캡션 행입니다. detail이 왼쪽에서 남는 폭을 쓰고 note가 오른쪽에 붙습니다. 둘 다 없으면 행 자체를 그리지 않습니다.",
          en: "The caption row under the track. detail takes the free width on the left and note pins right. With neither, the row is not drawn.",
        },
      },
    ],
  },
  properties: [
    {
      id: "surface",
      title: { ko: "surface", en: "surface" },
      description: {
        ko: "카드의 바탕 재질입니다. 유리 패널 안에서는 glass를 써서 뒤 재질과 이어지게 합니다.",
        en: "The material behind the card. Inside a glass panel use glass so the card continues that material.",
      },
      values: [
        {
          name: "solid",
          description: {
            ko: "불투명 표면에 1px 기본 테두리를 쓰는 기본값입니다. 설정 화면이나 본문 카드 안에 맞습니다.",
            en: "Opaque surface with a 1px default border. The default, and right inside a settings screen or a content card.",
          },
        },
        {
          name: "glass",
          description: {
            ko: "두꺼운 유리 바탕에 LiquidGlass 레이어를 깝니다. 유리 패널이나 이미지 위에 놓는 미터에 맞습니다.",
            en: "Thick glass with a LiquidGlass layer, for a meter on a glass panel or over imagery.",
          },
        },
      ],
      example: "surfaces",
    },
    {
      id: "value",
      title: { ko: "value", en: "value" },
      description: {
        ko: "0에서 100 사이의 사용률입니다. 막대 폭과 오른쪽 퍼센트가 같은 값에서 나오므로 두 표시가 어긋나지 않습니다.",
        en: "Usage from 0 to 100. The bar width and the percentage on the right come from the same number, so the two never disagree.",
      },
      example: "usage",
    },
    {
      id: "label",
      title: { ko: "label", en: "label" },
      description: {
        ko: "무엇을 재는지 적는 문구입니다. Tasks used나 Storage처럼 짧은 명사구로 쓰고 퍼센트와 같은 줄에 둡니다.",
        en: "What the meter measures. Keep it a short noun phrase such as Tasks used or Storage, on the same row as the percentage.",
      },
      example: "usage",
    },
    {
      id: "detail",
      title: { ko: "detail", en: "detail" },
      description: {
        ko: "왼쪽 캡션입니다. 6,420 of 10,000 tasks처럼 절대 수치를 적어 퍼센트만으로는 알 수 없는 규모를 보여 줍니다.",
        en: "The left caption. Put the absolute figure here, such as 6,420 of 10,000 tasks, so the scale is not left to the percentage alone.",
      },
      example: "usage",
    },
    {
      id: "note",
      title: { ko: "note", en: "note" },
      description: {
        ko: "오른쪽 캡션입니다. Resets Nov 1처럼 다음 초기화 시점을 적고 줄바꿈하지 않습니다. 이 날짜가 있으면 사용자가 직접 계산하지 않아도 됩니다.",
        en: "The right caption. Put the next reset here, such as Resets Nov 1; it never wraps. A date beside the number saves the reader from working it out.",
      },
      example: "usage",
    },
    {
      id: "className",
      title: { ko: "className", en: "className" },
      description: {
        ko: "루트에 병합되는 클래스입니다. 최대 폭 300px을 줄이거나 카드 안에서 폭을 맞출 때 씁니다.",
        en: "Classes merged onto the root, used to narrow the 300px cap or fit the card to its column.",
      },
      example: "surfaces",
    },
  ],
  guidelines: [
    {
      id: "one-meter-one-quota",
      title: { ko: "할당량 하나에 미터 하나", en: "One meter per allowance" },
      body: {
        ko: "미터는 할당량 하나를 보여 줍니다. Tasks와 Storage처럼 단위가 다른 값을 한 카드에 겹쳐 넣으면 막대가 무엇을 재는지 흐려집니다. 값마다 카드를 나눠 놓습니다.",
        en: "A meter represents one allowance. Stacking Tasks and Storage, which count different things, into one card blurs what the bar measures. Give each its own card.",
      },
      do: {
        ko: "Tasks used 카드와 Storage 카드를 따로 둡니다.",
        en: "Keep a Tasks used card and a Storage card apart.",
      },
      dont: {
        ko: "한 카드에 두 값을 번갈아 표시하지 않습니다.",
        en: "Do not switch one card between two values.",
      },
      example: "usage",
    },
    {
      id: "label-with-detail",
      title: { ko: "절대 수치를 detail에 적습니다", en: "Put the absolute figure in detail" },
      body: {
        ko: "퍼센트는 비율만 알려 주고 규모는 알려 주지 않습니다. detail에 6,420 of 10,000 tasks처럼 적어 사용자가 남은 양을 바로 알게 합니다.",
        en: "A percentage gives the ratio, not the scale. Put 6,420 of 10,000 tasks in detail so the reader sees what is left at once.",
      },
      do: {
        ko: "detail=\"6,420 of 10,000 tasks\"를 넘깁니다.",
        en: "Pass detail=\"6,420 of 10,000 tasks\".",
      },
      dont: {
        ko: "퍼센트만 두고 수치를 숨기지 않습니다.",
        en: "Do not hide the count behind the percentage alone.",
      },
      example: "usage",
    },
    {
      id: "near-limit",
      title: { ko: "한계에 가까우면 note로 알립니다", en: "Warn near the limit in note" },
      body: {
        ko: "미터의 채움은 언제나 하늘색 하나입니다. 한계에 가까워졌다는 사실은 색을 바꾸지 않고 note와 카드 바깥 문구로 알립니다.",
        en: "The fill is always the single sky accent. A value near the limit is told through note and text outside the card, not by changing the fill colour.",
      },
      do: {
        ko: "note에 Resets Nov 1을 두고 카드 위에서 한도를 설명합니다.",
        en: "Keep Resets Nov 1 in note and explain the limit above the card.",
      },
      dont: {
        ko: "80%를 넘었다고 막대를 빨갛게 바꾸지 않습니다.",
        en: "Do not turn the bar red past 80%.",
      },
      example: "near-limit",
    },
    {
      id: "not-task-progress",
      title: { ko: "작업 진행에는 Progress를 씁니다", en: "Task progress uses Progress" },
      body: {
        ko: "UsageMeter는 기간 동안 쌓인 사용량을 보여 줍니다. 한 번의 업로드나 생성이 얼마나 남았는지는 Progress가 맞고, 끝나는 시점을 모르면 불확정 막대를 씁니다.",
        en: "A UsageMeter reports usage accumulated over a period. One upload or one generation in flight belongs to Progress, with the indeterminate bar when the end is unknown.",
      },
      example: "usage",
    },
  ],
  specification: [
    {
      id: "surface-colors",
      title: { ko: "surface별 색", en: "Surface colours" },
      rows: [
        { state: "solid", slot: "Root", property: "background", value: "bg-bg-surface" },
        { state: "solid", slot: "Root", property: "border", value: "1px border-border-default" },
        { state: "glass", slot: "Root", property: "background", value: "bg-glass-thick" },
        { state: "glass", slot: "Root", property: "background layer", value: "LiquidGlass" },
        { state: "default", slot: "Track", property: "background", value: "bg-overlay-ink-8" },
        { state: "default", slot: "Indicator", property: "background", value: "bg-sky-500" },
        { state: "default", slot: "Label", property: "text color", value: "text-text-primary" },
        { state: "default", slot: "Value", property: "text color", value: "text-text-secondary" },
        { state: "default", slot: "Captions", property: "text color", value: "text-text-secondary" },
      ],
    },
    {
      id: "metrics",
      title: { ko: "치수", en: "Metrics" },
      rows: [
        { state: "default", slot: "Root", property: "max width", value: "300px" },
        { state: "default", slot: "Root", property: "padding", value: "16px" },
        { state: "default", slot: "Root", property: "gap", value: "8px" },
        { state: "default", slot: "Root", property: "radius", value: "20px" },
        { state: "default", slot: "Header", property: "font", value: "text-label-md" },
        { state: "default", slot: "Value", property: "numerals", value: "tabular-nums" },
        { state: "default", slot: "Track", property: "height", value: "6px" },
        { state: "default", slot: "Track", property: "radius", value: "9999px" },
        { state: "default", slot: "Captions", property: "font", value: "text-caption" },
        { state: "default", slot: "Note", property: "wrap", value: "whitespace-nowrap" },
        {
          state: "no captions",
          slot: "Captions",
          property: "visibility",
          value: "생략",
          note: {
            ko: "detail과 note가 모두 없으면 캡션 행을 그리지 않습니다.",
            en: "With neither detail nor note the caption row is not rendered.",
          },
        },
      ],
    },
    {
      id: "motion",
      title: { ko: "움직임", en: "Motion" },
      rows: [
        {
          state: "value change",
          slot: "Indicator",
          property: "transition",
          value: "transition-[width] duration-400 ease-out-quint",
          note: {
            ko: "사용량이 바뀌면 막대가 400ms 동안 새 위치로 이동합니다.",
            en: "A new value moves the bar to its place over 400ms.",
          },
        },
        {
          state: "reduced motion",
          slot: "Indicator",
          property: "transition",
          value: "0.01ms",
          note: {
            ko: "동작 줄이기를 켜면 폭이 즉시 바뀝니다.",
            en: "With reduced motion the width changes at once.",
          },
        },
        { state: "default", slot: "Root", property: "overflow", value: "overflow-clip" },
      ],
    },
  ],
  examples: [
    {
      id: "usage",
      title: { ko: "사용량", en: "Usage" },
      description: {
        ko: "라벨, 퍼센트, 절대 수치, 초기화 날짜를 모두 갖춘 기본 미터입니다.",
        en: "The default meter with a label, a percentage, the absolute count and the reset date.",
      },
    },
    {
      id: "surfaces",
      title: { ko: "surface", en: "Surfaces" },
      description: {
        ko: "solid 미터와 유리 패널 위의 glass 미터를 비교합니다.",
        en: "A solid meter next to a glass meter on a glass panel.",
      },
    },
    {
      id: "near-limit",
      title: { ko: "한계 근처", en: "Near the limit" },
      description: {
        ko: "92%를 쓴 상태를 note와 바깥 문구로 알립니다. 채움 색은 그대로입니다.",
        en: "92% used is announced in note and in the text outside; the fill colour stays the same.",
      },
    },
    {
      id: "without-captions",
      title: { ko: "캡션 없이", en: "Without captions" },
      description: {
        ko: "detail과 note를 비우면 라벨과 퍼센트, 막대만 남습니다.",
        en: "Without detail and note only the label, percentage and bar remain.",
      },
    },
  ],
  accessibility: {
    notes: [
      {
        ko: "Base UI Meter가 측정값과 퍼센트를 보조 기술에 전달합니다. label은 화면의 문구이자 미터의 이름이므로 무엇을 재는지 그대로 적습니다.",
        en: "Base UI Meter exposes the value and percentage to assistive technology. label is both the on-screen text and the meter's name, so name exactly what it measures.",
      },
      {
        ko: "퍼센트는 tabular-nums로 그려져 값이 바뀌어도 폭이 흔들리지 않습니다. 숫자와 캡션을 함께 읽어 사용자가 남은 양과 초기화 시점을 한 번에 알 수 있게 합니다.",
        en: "The percentage is drawn with tabular-nums, so its width holds as the value changes. Read together, the number and the captions give the remaining amount and the reset date at once.",
      },
      {
        ko: "채움은 언제나 하늘색 하나입니다. 한계에 가깝다는 경고를 색으로만 전달하지 말고 문구로 함께 적습니다.",
        en: "The fill is always the single sky accent. Never signal a near limit by colour alone; say it in text as well.",
      },
    ],
    keyboard: [],
  },
};
