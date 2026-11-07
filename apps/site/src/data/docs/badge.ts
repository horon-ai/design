/**
 * Reference doc for `Badge`, written against
 * `packages/react/src/components/badge.tsx` and
 * `packages/flutter/lib/src/components/badge.dart`.
 */
import type { ComponentDoc } from "@/lib/component-docs";

export const doc: ComponentDoc = {
  slug: "badge",
  anatomy: {
    description: {
      ko: "Badge는 짧은 상태나 개수를 알리는 pill입니다. span으로 렌더링하므로 버튼, 목록 행, 제목 안에 넣어도 그 높이를 바꾸지 않습니다.",
      en: "A Badge is a pill that reports a short state or a count. It renders a span, so it can sit inside a button, a list row or a heading without changing that element's height.",
    },
    parts: [
      {
        name: "Pill",
        slot: "span",
        description: {
          ko: "배경과 테두리, 높이, 안쪽 여백이 있는 바깥 요소입니다. tone과 size의 값이 여기에 적용됩니다.",
          en: "The outer element that carries the fill, border, height and padding. The tone and size values land here.",
        },
      },
      {
        name: "Dot",
        slot: "dot",
        description: {
          ko: "dot이 참일 때 라벨 앞에 붙는 상태 점입니다. 4px, 6px, 8px로 size를 따르고 스크린 리더에서는 숨깁니다.",
          en: "A status dot before the label when dot is true. It is 4px, 6px or 8px with the size and hidden from screen readers.",
        },
      },
      {
        name: "Label",
        slot: "children",
        description: {
          ko: "배지의 문구입니다. 한 줄로 유지되고 줄바꿈 없이 잘리지 않으며 cap 높이에 맞춰 광학적으로 가운데 정렬합니다.",
          en: "The badge text. It stays on one line, never wraps, and is centred optically on the cap height.",
        },
      },
    ],
  },
  properties: [
    {
      id: "tone",
      title: { ko: "tone", en: "tone" },
      description: {
        ko: "배지와 점의 색 조합입니다. 문구 자체가 뜻을 전달해야 하며 tone은 그 뜻을 보강합니다.",
        en: "Colour treatment of the pill and its dot. The text still carries the meaning; tone reinforces it.",
      },
      values: [
        {
          name: "neutral",
          description: {
            ko: "6% 잉크 바탕에 보조 텍스트를 쓰는 기본값입니다. 초안, 대기처럼 중립적인 상태에 맞습니다.",
            en: "A 6% ink pill with secondary text, the default. Use it for neutral states such as draft or pending.",
          },
        },
        {
          name: "brand",
          description: {
            ko: "하늘색 바탕에 brand 텍스트를 씁니다. 브랜드와 이어진 개수나 실행 중 상태에 맞습니다.",
            en: "Sky-tinted pill with brand text, for counts and running states tied to the brand.",
          },
        },
        {
          name: "danger",
          description: {
            ko: "붉은 바탕에 danger 텍스트를 씁니다. 실패와 삭제처럼 되돌리기 어려운 상태를 알립니다.",
            en: "Red-tinted pill with danger text, for failures and destructive states.",
          },
        },
        {
          name: "solid",
          description: {
            ko: "브랜드 색으로 채운 배지입니다. 한 영역에서 가장 앞에 두는 표시 하나에만 씁니다.",
            en: "Filled brand pill. Use it for the single strongest marker in a region.",
          },
        },
        {
          name: "surface",
          description: {
            ko: "흰 표면 바탕에 1px 기본 테두리와 기본 텍스트를 씁니다. 카드나 목록 위에서 배지가 배경과 구분되어야 할 때 맞습니다.",
            en: "White surface pill with a 1px default border and primary text, for badges that must read apart from the surface behind them.",
          },
        },
      ],
      example: "tones",
    },
    {
      id: "size",
      title: { ko: "size", en: "size" },
      description: {
        ko: "높이, 안쪽 여백, 글자 단계, 점 크기를 함께 정합니다. 폼 컨트롤과 같은 크기 값을 씁니다.",
        en: "Sets the height, padding, label rung and dot size together from the same scale as the form controls.",
      },
      values: [
        {
          name: "sm",
          description: {
            ko: "높이 20px에 caption 라벨, 4px 점을 씁니다. 밀도가 높은 목록 행에 맞습니다.",
            en: "20px tall with a caption label and a 4px dot, for dense list rows.",
          },
        },
        {
          name: "md",
          description: {
            ko: "높이 22px에 label-sm 라벨, 6px 점을 씁니다. Figma의 기본 배지입니다.",
            en: "22px tall with a label-sm label and a 6px dot. This is the Figma default.",
          },
        },
        {
          name: "lg",
          description: {
            ko: "높이 26px에 label-md 라벨, 8px 점을 씁니다. 넓은 여백이 있는 카드 머리에 맞습니다.",
            en: "26px tall with a label-md label and an 8px dot, for card headers with room to spare.",
          },
        },
      ],
      example: "sizes",
    },
    {
      id: "dot",
      title: { ko: "dot", en: "dot" },
      description: {
        ko: "참이면 라벨 앞에 상태 점을 붙입니다. 점 색은 tone에서 오고 점 자체는 aria-hidden입니다. 실행 중처럼 상태가 바뀌는 표시에는 문구와 함께 쓰고, 고정된 분류에는 생략합니다.",
        en: "When true a status dot is drawn before the label. Its colour comes from tone and the dot itself is aria-hidden. Pair it with wording for states that change, such as running, and leave it out of fixed categories.",
      },
      example: "with-dot",
    },
    {
      id: "className",
      title: { ko: "className", en: "className" },
      description: {
        ko: "배지 바깥 요소에 마지막으로 병합되는 클래스입니다. 여백이나 정렬처럼 배치에만 쓰고 색과 크기는 tone과 size로 정합니다.",
        en: "Classes merged last onto the pill. Use them for placement such as margin or alignment; set colour and size through tone and size.",
      },
    },
  ],
  guidelines: [
    {
      id: "text-carries-meaning",
      title: { ko: "문구가 뜻을 전달합니다", en: "The words carry the meaning" },
      body: {
        ko: "색만으로 상태를 구분하지 않습니다. danger 배지에는 실패나 만료 같은 단어를 함께 넣어 색을 구분하지 못하는 사람도 같은 정보를 얻도록 합니다.",
        en: "Never separate states by colour alone. A danger badge also names the state, such as Failed or Expired, so the information survives for people who cannot tell the colours apart.",
      },
      do: {
        ko: "Failed, Expired처럼 상태를 이름으로 적습니다.",
        en: "Name the state: Failed, Expired.",
      },
      dont: {
        ko: "붉은 점 하나만 두고 문구를 비웁니다.",
        en: "Leave the label empty and rely on a red dot.",
      },
      example: "tones",
    },
    {
      id: "keep-it-short",
      title: { ko: "한두 단어로 유지합니다", en: "Keep it to a word or two" },
      body: {
        ko: "배지는 한 줄로 유지되고 줄바꿈하지 않습니다. 긴 설명이 필요하면 Badge가 아니라 Banner나 본문 문단을 씁니다.",
        en: "A badge stays on one line and never wraps. When a sentence is needed, use a Banner or body copy instead.",
      },
      do: {
        ko: "Running, 3 drafts, Pro처럼 짧게 적습니다.",
        en: "Write short labels: Running, 3 drafts, Pro.",
      },
      dont: {
        ko: "실패 이유를 배지 안에 문장으로 넣지 않습니다.",
        en: "Do not put the reason for a failure into a badge as a sentence.",
      },
      example: "in-context",
    },
    {
      id: "one-solid",
      title: { ko: "solid는 한 영역에 하나", en: "One solid badge per region" },
      body: {
        ko: "solid는 브랜드 색으로 채워져 있어 목록에서 가장 먼저 눈에 들어옵니다. 한 영역에 여러 개를 두면 어느 항목이 강조된 것인지 사라집니다.",
        en: "A solid badge is filled with the brand colour and draws the eye first. Several in one region erase the emphasis they were meant to create.",
      },
      do: {
        ko: "새 항목 하나에만 solid를 씁니다.",
        en: "Mark the one new item solid.",
      },
      dont: {
        ko: "모든 행에 solid 배지를 붙이지 않습니다.",
        en: "Do not put a solid badge on every row.",
      },
      example: "in-context",
    },
    {
      id: "badge-vs-chip",
      title: { ko: "Badge는 읽기 전용입니다", en: "A badge is read-only" },
      body: {
        ko: "Badge는 span이라 눌리지 않습니다. 값을 고르거나 지우는 컨트롤이 필요하면 Chip을 쓰고, 배지는 상태를 보여 주는 자리에만 둡니다.",
        en: "A Badge renders a span and cannot be pressed. When the value has to be chosen or removed, use Chip; keep Badge where a state is only displayed.",
      },
      example: "with-dot",
    },
  ],
  specification: [
    {
      id: "tone-colors",
      title: { ko: "tone별 색", en: "Tone colours" },
      note: {
        ko: "값은 컴포넌트 클래스에 적힌 토큰 유틸 이름입니다.",
        en: "Values are the token utilities written in the component classes.",
      },
      rows: [
        { state: "neutral", slot: "Pill", property: "background", value: "bg-overlay-ink-6" },
        { state: "neutral", slot: "Pill", property: "text color", value: "text-text-secondary" },
        { state: "neutral", slot: "Dot", property: "background", value: "bg-text-secondary" },
        { state: "brand", slot: "Pill", property: "background", value: "bg-accent-sky-500-18" },
        { state: "brand", slot: "Pill", property: "text color", value: "text-text-brand" },
        { state: "brand", slot: "Dot", property: "background", value: "bg-status-live" },
        { state: "danger", slot: "Pill", property: "background", value: "bg-accent-red-500-14" },
        { state: "danger", slot: "Pill", property: "text color", value: "text-text-danger" },
        { state: "danger", slot: "Dot", property: "background", value: "bg-text-danger" },
        { state: "solid", slot: "Pill", property: "background", value: "bg-interactive-primary" },
        { state: "solid", slot: "Pill", property: "text color", value: "text-interactive-on-primary" },
        { state: "solid", slot: "Dot", property: "background", value: "bg-interactive-on-primary" },
        { state: "surface", slot: "Pill", property: "background", value: "bg-bg-surface" },
        { state: "surface", slot: "Pill", property: "border", value: "1px border-border-default" },
        { state: "surface", slot: "Pill", property: "text color", value: "text-text-primary" },
        { state: "surface", slot: "Dot", property: "background", value: "bg-text-primary" },
      ],
    },
    {
      id: "size-metrics",
      title: { ko: "크기별 값", en: "Sizes" },
      rows: [
        { state: "sm", slot: "Pill", property: "height", value: "20px" },
        { state: "sm", slot: "Pill", property: "padding", value: "0 6px" },
        { state: "sm", slot: "Pill", property: "gap", value: "4px" },
        { state: "sm", slot: "Pill", property: "radius", value: "9999px" },
        { state: "sm", slot: "Label", property: "font", value: "text-caption" },
        { state: "sm", slot: "Dot", property: "size", value: "4px" },
        { state: "md", slot: "Pill", property: "height", value: "22px" },
        { state: "md", slot: "Pill", property: "padding", value: "0 8px" },
        { state: "md", slot: "Pill", property: "gap", value: "6px" },
        { state: "md", slot: "Pill", property: "radius", value: "9999px" },
        { state: "md", slot: "Label", property: "font", value: "text-label-sm" },
        { state: "md", slot: "Dot", property: "size", value: "6px" },
        { state: "lg", slot: "Pill", property: "height", value: "26px" },
        { state: "lg", slot: "Pill", property: "padding", value: "0 10px" },
        { state: "lg", slot: "Pill", property: "gap", value: "6px" },
        { state: "lg", slot: "Pill", property: "radius", value: "9999px" },
        { state: "lg", slot: "Label", property: "font", value: "text-label-md" },
        { state: "lg", slot: "Dot", property: "size", value: "8px" },
      ],
    },
    {
      id: "layout",
      title: { ko: "배치", en: "Layout" },
      rows: [
        { state: "default", slot: "Pill", property: "display", value: "inline-flex" },
        { state: "default", slot: "Pill", property: "align", value: "items-center justify-center" },
        { state: "default", slot: "Pill", property: "shrink", value: "shrink-0" },
        { state: "default", slot: "Label", property: "wrap", value: "whitespace-nowrap" },
        {
          state: "default",
          slot: "Label",
          property: "optical centring",
          value: "text-trim",
          note: {
            ko: "cap 높이와 baselines 사이로 줄 상자를 잘라 글자를 광학적으로 가운데에 둡니다.",
            en: "Trims the line box to the cap height and baseline so the glyph sits optically centred.",
          },
        },
        {
          state: "default",
          slot: "Dot",
          property: "accessibility",
          value: "aria-hidden",
          note: {
            ko: "장식이므로 스크린 리더가 읽지 않습니다. 상태는 라벨 문구로 전달합니다.",
            en: "Decorative, so screen readers skip it. The label carries the state.",
          },
        },
      ],
    },
  ],
  examples: [
    {
      id: "tones",
      title: { ko: "tone", en: "Tones" },
      description: {
        ko: "다섯 tone을 같은 문구로 나란히 두었습니다. 색은 상태를 보강하고 문구는 그대로 읽힙니다.",
        en: "All five tones with the same wording. Colour reinforces the state; the words stay readable.",
      },
    },
    {
      id: "sizes",
      title: { ko: "크기", en: "Sizes" },
      description: {
        ko: "sm, md, lg의 높이와 글자, 점 크기를 한 줄로 비교합니다.",
        en: "The sm, md and lg heights with their label and dot sizes side by side.",
      },
    },
    {
      id: "with-dot",
      title: { ko: "상태 점", en: "Status dot" },
      description: {
        ko: "dot을 켜고 끈 배지를 나란히 두어 점이 붙는 자리를 보여 줍니다.",
        en: "The same badge with and without dot, so the dot's place is visible.",
      },
    },
    {
      id: "in-context",
      title: { ko: "목록 안에서", en: "Inside a list" },
      description: {
        ko: "에이전트 목록 행과 카드 제목에 배지를 넣은 모습입니다. 배지가 행 높이를 늘리지 않습니다.",
        en: "Badges inside agent rows and a card title. The badge does not grow the row height.",
      },
    },
  ],
  accessibility: {
    notes: [
      {
        ko: "Badge는 span으로 렌더링되므로 역할과 포커스가 없습니다. 상태 변화를 알려야 하면 Banner의 role이나 라이브 영역을 따로 두고, 배지는 현재 값만 보여 줍니다.",
        en: "A Badge is a span with no role and no focus. When a change has to be announced, put it in a Banner role or a live region; the badge shows only the current value.",
      },
      {
        ko: "tone은 색만 바꾸므로 같은 정보를 문구로도 적습니다. 색을 구분하기 어려운 사람과 흑백 화면에서도 상태를 읽을 수 있어야 합니다.",
        en: "Tone changes colour only, so the same information belongs in the words. The state has to survive for people who cannot separate the colours and on a monochrome screen.",
      },
      {
        ko: "점은 aria-hidden으로 숨깁니다. 점만으로 상태를 전달하지 말고 라벨에 상태 이름을 넣습니다.",
        en: "The dot is hidden with aria-hidden. Never let the dot alone carry the state; name it in the label.",
      },
    ],
    keyboard: [],
  },
};
