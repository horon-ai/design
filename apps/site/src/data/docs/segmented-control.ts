/**
 * Reference doc for `SegmentedControl`, written against
 * `packages/react/src/components/segmented-control.tsx` and
 * `packages/flutter/lib/src/components/segmented_control.dart`.
 */
import type { ComponentDoc } from "@/lib/component-docs";

export const doc: ComponentDoc = {
  slug: "segmented-control",
  anatomy: {
    description: {
      ko: "SegmentedControl은 몇 개의 보기 중 하나를 고르는 분할 컨트롤입니다. 둥근 트랙 안에 선택 표시가 되는 알약 하나와 세그먼트들이 놓이고, 선택이 바뀌면 그 알약이 눌린 세그먼트로 미끄러집니다.",
      en: "A SegmentedControl picks one of a few views. Inside a rounded track sit one selection pill and the segments, and the pill slides to the pressed segment when the choice changes.",
    },
    parts: [
      {
        name: "Track",
        slot: "ToggleGroup",
        description: {
          ko: "세그먼트를 담는 둥근 트랙입니다. aria-label을 받고, 세그먼트가 넘치면 가로로 스크롤합니다.",
          en: "The rounded track that holds the segments. It takes the aria-label and scrolls sideways when the segments do not fit.",
        },
      },
      {
        name: "LiquidGlass",
        slot: "LiquidGlass",
        description: {
          ko: "glass surface에서만 트랙 안쪽에 깔리는 유리 레이어입니다. 선택 알약에도 한 겹 더 들어갑니다.",
          en: "A glass layer drawn inside the track, only on the glass surface. The selection pill carries one more.",
        },
      },
      {
        name: "Indicator",
        slot: "Indicator",
        description: {
          ko: "선택을 표시하는 알약입니다. 위치와 크기를 style로 받아 280ms 동안 이동합니다.",
          en: "The pill that marks the selection. It takes its position and size as a style and travels for 280ms.",
        },
      },
      {
        name: "Segment",
        slot: "Toggle",
        description: {
          ko: "값 하나를 가진 실제 버튼입니다. 켜지면 text-primary로 바뀌고, aria-pressed로 선택 상태를 알립니다.",
          en: "The real button behind one value. Pressed turns it to text-primary, and aria-pressed reports the state.",
        },
      },
    ],
  },
  properties: [
    {
      id: "items",
      title: { ko: "items", en: "items" },
      description: {
        ko: "표시 순서대로 놓이는 세그먼트 목록입니다. value는 onValueChange가 돌려주는 값이고 label은 세그먼트에 보이는 문구입니다. 한 항목만 disabled로 두어 그 세그먼트만 고를 수 없게 할 수 있습니다.",
        en: "The segments in display order. value is what onValueChange returns, label is what the segment shows, and a single entry can be disabled on its own.",
      },
      example: "sizes",
    },
    {
      id: "surface",
      title: { ko: "surface", en: "surface" },
      description: {
        ko: "트랙의 재질입니다. 컨트롤이 놓이는 면에 맞춰 고릅니다.",
        en: "Material of the track. Pick it to match the surface the control sits on.",
      },
      values: [
        {
          name: "solid",
          description: {
            ko: "기본값입니다. 불투명한 표면 바탕에 기본 테두리, 10% 잉크 선택 알약을 씁니다. 카드 위에 놓습니다.",
            en: "The default: an opaque surface track with a default border and a 10% ink selection. Sits on a card.",
          },
        },
        {
          name: "glass",
          description: {
            ko: "일반 유리 트랙에 thick glass 알약을 얹습니다. 이미지나 유리 패널 위에 띄울 때 씁니다.",
            en: "A regular glass track with a thick glass pill. For floating over imagery or a glass panel.",
          },
        },
        {
          name: "inset",
          description: {
            ko: "5% 잉크 트랙입니다. 루틴 카드처럼 안쪽에 놓인 면에서 씁니다.",
            en: "A 5% ink track, for use inside a card such as the routine card.",
          },
        },
        {
          name: "inset-faint",
          description: {
            ko: "4% 잉크 트랙입니다. 머리말 필터 줄처럼 배경에 가장 가깝게 붙는 자리에 씁니다.",
            en: "A 4% ink track, for the place that sits closest to the background, such as a header filter row.",
          },
        },
        {
          name: "subtle",
          description: {
            ko: "bg-subtle 트레이에 표면 바탕 알약을 얹습니다. Paper의 페이지 탭처럼 목록을 나누는 자리에 씁니다.",
            en: "A bg-subtle tray with a plain surface pill. For splitting a list, as in Paper's page tabs.",
          },
        },
      ],
      example: "surfaces",
    },
    {
      id: "size",
      title: { ko: "size", en: "size" },
      description: {
        ko: "트랙 높이와 세그먼트 크기입니다. tab은 Paper의 페이지 탭처럼 4px 안쪽 여백과 32px 세그먼트를 쓰는 별도 눈금입니다.",
        en: "Track height and segment size. tab is a separate rung with 4px inner padding and 32px segments, for Paper's page tabs.",
      },
      values: [
        {
          name: "sm",
          description: {
            ko: "32px 트랙에 26px 세그먼트와 10px 좌우 여백을 씁니다.",
            en: "A 32px track with 26px segments and 10px side padding.",
          },
        },
        {
          name: "md",
          description: {
            ko: "36px 트랙에 30px 세그먼트와 16px 좌우 여백을 씁니다. 기본값입니다.",
            en: "A 36px track with 30px segments and 16px side padding. The default.",
          },
        },
        {
          name: "lg",
          description: {
            ko: "44px 트랙에 36px 세그먼트를 씁니다. 굵은 필터 줄에 맞습니다.",
            en: "A 44px track with 36px segments, for a heavier filter row.",
          },
        },
        {
          name: "tab",
          description: {
            ko: "4px 안쪽 여백과 세그먼트 사이 4px 간격, 32px 세그먼트를 씁니다. 높이를 고정하지 않아 내용에 맞춰집니다.",
            en: "4px inner padding, a 4px gap between segments and 32px segments. Its height is not fixed, so it follows the content.",
          },
        },
      ],
      example: "sizes",
    },
    {
      id: "fill",
      title: { ko: "fill", en: "fill" },
      description: {
        ko: "참이면 세그먼트가 라벨 너비에 맞추지 않고 트랙 너비를 똑같이 나눠 가집니다. 기본값은 md에서 참, 다른 크기에서 거짓입니다.",
        en: "When true the segments split the track width equally instead of hugging their labels. It defaults to true on md and false on the other rungs.",
      },
      example: "sizes",
    },
  ],
  guidelines: [
    {
      id: "one-choice",
      title: { ko: "고르는 자리는 하나만", en: "One choice at a time" },
      body: {
        ko: "이 컨트롤은 단일 선택입니다. 여러 개를 동시에 켜야 하는 필터에는 Chip을 쓰고, 목록이 다섯 개를 넘으면 선택지가 한눈에 읽히지 않으므로 Select나 Tabs를 씁니다.",
        en: "The control is single-choice. For filters that allow several at once use Chip, and past about five options the set stops reading at a glance, so use Select or Tabs.",
      },
      do: {
        ko: "Chat과 Work처럼 보기 두세 개를 오갈 때 씁니다.",
        en: "Use it to switch between two or three views such as Chat and Work.",
      },
      dont: {
        ko: "태그를 여러 개 켜 두는 자리에 쓰지 않습니다.",
        en: "Do not use it where several tags stay on at once.",
      },
      example: "controlled",
    },
    {
      id: "surface-follows-host",
      title: { ko: "surface는 놓이는 면을 따릅니다", en: "The surface follows its host" },
      body: {
        ko: "트랙은 스스로를 띄우지 않고 놓인 면에 맞춥니다. 카드 위에는 solid, 카드 안쪽 줄에는 inset, 이미지나 유리 패널 위에는 glass를 씁니다. 불투명한 본문 위에 glass를 쓰면 유리 바탕이 보이지 않아 트랙 경계가 사라집니다.",
        en: "The track does not lift itself; it matches where it sits. Use solid on a card, inset for a row inside a card, and glass over imagery or a glass panel. Glass on an opaque page loses its fill and with it the track edge.",
      },
      do: {
        ko: "배경 이미지 위의 도구 모음에서 glass를 씁니다.",
        en: "Use glass in a toolbar over a background image.",
      },
      dont: {
        ko: "흰 카드 안에서 glass를 쓰지 않습니다.",
        en: "Do not use glass inside a white card.",
      },
      example: "surfaces",
    },
    {
      id: "always-label-the-group",
      title: { ko: "트랙에 이름을 붙입니다", en: "Name the track" },
      body: {
        ko: "트랙에는 보이는 라벨이 없으므로 aria-label로 무엇을 고르는지 알려 줍니다. 라벨이 없는 분할 컨트롤은 스크린 리더에서 이름 없는 그룹으로 읽힙니다.",
        en: "The track has no visible label, so name what it chooses through aria-label. Without it a screen reader announces an unnamed group.",
      },
      example: "sizes",
    },
    {
      id: "keep-labels-short",
      title: { ko: "라벨을 짧게 유지합니다", en: "Keep labels short" },
      body: {
        ko: "세그먼트는 한 줄을 나눠 쓰므로 라벨이 길면 넘치고 트랙이 가로로 스크롤됩니다. 스크롤이 생기면 선택지가 한눈에 보이지 않으므로 두 단어 안으로 줄입니다.",
        en: "Segments share one row, so long labels overflow and make the track scroll sideways. A scrolling track hides options, so keep each label within two words.",
      },
      example: "controlled",
    },
  ],
  specification: [
    {
      id: "surface-colors",
      title: { ko: "surface별 색", en: "Surface colors" },
      note: {
        ko: "값은 컴포넌트 클래스의 토큰 유틸 이름입니다.",
        en: "Values are the token utility names from the component classes.",
      },
      rows: [
        { state: "Solid", slot: "Track", property: "background", value: "bg-bg-surface" },
        { state: "Solid", slot: "Track", property: "border", value: "1px border-border-default" },
        { state: "Solid", slot: "Indicator", property: "background", value: "bg-overlay-ink-10" },
        { state: "Glass", slot: "Track", property: "background", value: "bg-glass-regular" },
        { state: "Glass", slot: "Track", property: "background layer", value: "LiquidGlass" },
        { state: "Glass", slot: "Indicator", property: "background", value: "bg-glass-thick" },
        { state: "Glass", slot: "Indicator", property: "shadow", value: "0 1px 3px rgba(0,0,0,0.08)" },
        { state: "Glass · dark", slot: "Indicator", property: "background", value: "dark:bg-overlay-ink-10" },
        { state: "Inset", slot: "Track", property: "background", value: "bg-overlay-ink-5" },
        { state: "Inset", slot: "Indicator", property: "background", value: "bg-overlay-ink-10" },
        { state: "Inset faint", slot: "Track", property: "background", value: "bg-overlay-ink-4" },
        { state: "Subtle", slot: "Track", property: "background", value: "bg-bg-subtle" },
        { state: "Subtle", slot: "Indicator", property: "background", value: "bg-bg-default" },
        { state: "Subtle · dark", slot: "Indicator", property: "background", value: "dark:bg-overlay-ink-10" },
      ],
    },
    {
      id: "size-metrics",
      title: { ko: "크기별 값", en: "Sizes" },
      rows: [
        { state: "sm", slot: "Track", property: "height", value: "32px" },
        { state: "sm", slot: "Track", property: "padding", value: "p-[3px]" },
        { state: "sm", slot: "Segment", property: "height", value: "h-6.5 (26px)" },
        { state: "sm", slot: "Segment", property: "padding-x", value: "px-2.5" },
        { state: "sm", slot: "Segment", property: "font", value: "text-label-sm" },
        { state: "md", slot: "Track", property: "height", value: "h-9 (36px)" },
        { state: "md", slot: "Track", property: "padding", value: "p-[3px]" },
        { state: "md", slot: "Segment", property: "height", value: "h-7.5 (30px)" },
        { state: "md", slot: "Segment", property: "padding-x", value: "px-4" },
        { state: "md", slot: "Segment", property: "font", value: "text-label-md" },
        { state: "lg", slot: "Track", property: "height", value: "h-11 (44px)" },
        { state: "lg", slot: "Track", property: "padding", value: "p-1" },
        { state: "lg", slot: "Segment", property: "height", value: "h-9 (36px)" },
        { state: "lg", slot: "Segment", property: "padding-x", value: "px-4" },
        { state: "lg", slot: "Segment", property: "font", value: "text-label-lg" },
        { state: "tab", slot: "Track", property: "padding", value: "p-1" },
        { state: "tab", slot: "Track", property: "gap", value: "gap-1" },
        { state: "tab", slot: "Segment", property: "height", value: "h-8 (32px)" },
        { state: "tab", slot: "Segment", property: "padding-x", value: "px-3.5" },
        { state: "tab", slot: "Segment", property: "font", value: "text-label-md" },
        { state: "all", slot: "Track", property: "radius", value: "rounded-full" },
        {
          state: "sm · md · lg",
          slot: "Track",
          property: "gap",
          value: "gap-0.5",
          note: {
            ko: "tab 눈금만 세그먼트 사이 간격을 gap-1로 넓힙니다.",
            en: "The tab rung is the one that widens the segment gap to gap-1.",
          },
        },
      ],
    },
    {
      id: "states",
      title: { ko: "상태", en: "States" },
      rows: [
        { state: "default", slot: "Segment", property: "text color", value: "text-text-secondary" },
        { state: "hover", slot: "Segment", property: "text color", value: "text-text-primary" },
        { state: "selected", slot: "Segment", property: "text color", value: "text-text-primary" },
        {
          state: "selected",
          slot: "Indicator",
          property: "motion",
          value: "motion-indicator",
          note: {
            ko: "선택 표시가 280ms 동안 새 위치로 이동합니다.",
            en: "The selection travels to its new place over 280ms.",
          },
        },
        { state: "focus-visible", slot: "Segment", property: "outline", value: "2px outline-text-brand" },
        { state: "focus-visible", slot: "Segment", property: "outline offset", value: "2px" },
        { state: "disabled", slot: "Segment", property: "opacity", value: "40%" },
        { state: "disabled", slot: "Segment", property: "cursor", value: "not-allowed" },
      ],
    },
  ],
  examples: [
    {
      id: "sizes",
      title: { ko: "크기", en: "Sizes" },
      description: {
        ko: "sm, md, lg 세 높이를 같은 항목으로 놓았습니다. 기본 fill이 md에서만 켜지는 것도 함께 보입니다.",
        en: "The sm, md and lg heights over the same items, which also shows fill defaulting to on for md only.",
      },
    },
    {
      id: "surfaces",
      title: { ko: "surface", en: "Surfaces" },
      description: {
        ko: "solid, inset, inset-faint, subtle, glass 다섯 재질을 한자리에 놓았습니다. glass는 배경 위에서만 트랙이 보입니다.",
        en: "All five materials side by side: solid, inset, inset-faint, subtle and glass. Glass only reads as a track over a backdrop.",
      },
    },
    {
      id: "controlled",
      title: { ko: "제어 선택", en: "Controlled selection" },
      description: {
        ko: "value와 onValueChange로 선택을 바깥에서 들고 지금 보기를 아래에 적습니다.",
        en: "Holding the choice outside through value and onValueChange and writing the current view below.",
      },
    },
    {
      id: "fill",
      title: { ko: "채움", en: "Fill" },
      description: {
        ko: "fill을 끄면 세그먼트가 라벨 너비만큼만 차지하고, 켜면 트랙 너비를 똑같이 나눕니다.",
        en: "With fill off the segments hug their labels; with it on they split the track equally.",
      },
    },
  ],
  accessibility: {
    notes: [
      {
        ko: "트랙은 role=group을 가진 토글 그룹이고 각 세그먼트는 aria-pressed를 가진 버튼입니다. 지금 선택을 색과 알약 위치로 함께 보여 주므로 색만으로 상태를 구분하지 않아도 됩니다.",
        en: "The track is a toggle group with role=group and each segment a button with aria-pressed. The selection shows in both color and the pill's position, so the state does not rest on color alone.",
      },
      {
        ko: "트랙에는 보이는 라벨이 없으므로 aria-label을 반드시 넘깁니다. 라벨이 없으면 스크린 리더가 이름 없는 그룹으로 읽고, 안의 세그먼트만으로는 무엇을 고르는지 알 수 없습니다.",
        en: "Always pass aria-label, because the track has no visible label. Without it a screen reader announces an unnamed group and the segments alone do not say what is being chosen.",
      },
      {
        ko: "포커스는 세그먼트 하나에만 닿고 2px outline을 2px 떨어뜨려 그립니다. 화살표 키로 옮긴 포커스도 같은 표시를 씁니다.",
        en: "Focus reaches one segment at a time with a 2px outline held 2px off it, and focus moved by the arrow keys uses the same ring.",
      },
    ],
    keyboard: [
      {
        keys: ["ArrowLeft", "ArrowRight"],
        action: { ko: "포커스를 이전 또는 다음 세그먼트로 옮깁니다.", en: "Moves focus to the previous or next segment." },
      },
      {
        keys: ["Home", "End"],
        action: { ko: "첫 세그먼트와 마지막 세그먼트로 이동합니다.", en: "Moves to the first or last segment." },
      },
      {
        keys: ["Enter", "Space"],
        action: { ko: "포커스가 놓인 세그먼트를 선택합니다.", en: "Selects the focused segment." },
      },
      {
        keys: ["Tab"],
        action: { ko: "그룹 밖으로 포커스를 옮깁니다.", en: "Moves focus out of the group." },
      },
    ],
  },
};
