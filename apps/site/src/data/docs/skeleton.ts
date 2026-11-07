/**
 * Reference doc for `Skeleton` and `SkeletonCard`, written against
 * `packages/react/src/components/skeleton.tsx` and
 * `packages/flutter/lib/src/components/skeleton.dart`.
 */
import type { ComponentDoc } from "@/lib/component-docs";

export const doc: ComponentDoc = {
  slug: "skeleton",
  anatomy: {
    description: {
      ko: "Skeleton은 내용이 오기 전에 자리와 크기를 미리 보여 주는 자리표시자입니다. 낱개 막대는 Skeleton으로 원하는 크기만큼 만들고, 카드 모양이 필요하면 SkeletonCard를 씁니다.",
      en: "A Skeleton holds the shape and size of content before it arrives. Build single bars with Skeleton at the size you need, or use SkeletonCard when the placeholder is a card.",
    },
    parts: [
      {
        name: "Block",
        slot: "Skeleton",
        description: {
          ko: "7% 잉크 바탕의 막대입니다. 크기는 className으로 정하고 aria-hidden이라 읽히지 않습니다.",
          en: "A 7% ink bar. Its size comes from className, and aria-hidden keeps it out of the reading order.",
        },
      },
      {
        name: "Shimmer",
        slot: "Skeleton",
        description: {
          ko: "막대 위를 지나가는 밝은 하이라이트입니다. 1.6초 주기로 반복하고 어두운 테마에서는 밝기를 낮춥니다.",
          en: "A light highlight travelling across the bar on a 1.6s cycle. It dims in the dark theme.",
        },
      },
      {
        name: "Card",
        slot: "SkeletonCard",
        description: {
          ko: "자리표시자 막대를 담는 카드입니다. role status와 Loading 이름을 갖고 solid 또는 glass 표면을 씁니다.",
          en: "The card that holds the placeholder bars. It carries role status and the name Loading, and uses a solid or glass surface.",
        },
      },
      {
        name: "Layout",
        slot: "type",
        description: {
          ko: "카드 안 막대의 배치입니다. row는 아바타와 두 줄, card는 제목과 세 줄과 버튼, text는 세 줄만 그립니다.",
          en: "The arrangement of the bars. row draws an avatar with two lines, card a heading with three lines and a button, and text three lines only.",
        },
      },
    ],
  },
  properties: [
    {
      id: "shape",
      title: { ko: "shape", en: "shape" },
      description: {
        ko: "Skeleton 막대의 모서리입니다. 막대의 폭과 높이는 className으로 정합니다.",
        en: "The corner of a Skeleton bar. Width and height come from className.",
      },
      values: [
        {
          name: "block",
          description: {
            ko: "6px 모서리의 사각 막대입니다. 기본값이며 글줄과 카드 조각에 맞습니다.",
            en: "A 6px-radius block. The default, and right for text lines and card pieces.",
          },
        },
        {
          name: "pill",
          description: {
            ko: "완전히 둥근 막대입니다. 아바타나 버튼 자리에 맞습니다.",
            en: "A fully round bar, for an avatar or a button.",
          },
        },
      ],
      example: "blocks",
    },
    {
      id: "type",
      title: { ko: "type", en: "type" },
      description: {
        ko: "SkeletonCard가 그리는 배치입니다. 불러올 내용의 모양과 맞춰야 자리가 튀지 않습니다.",
        en: "The arrangement SkeletonCard draws. Match it to the content that is coming so nothing jumps when it lands.",
      },
      values: [
        {
          name: "row",
          description: {
            ko: "36px 아바타와 두 줄을 그리는 기본값입니다. 목록 행이나 사람 목록에 맞습니다.",
            en: "A 36px avatar with two lines. The default, and right for list rows and people lists.",
          },
        },
        {
          name: "card",
          description: {
            ko: "제목 한 줄, 본문 세 줄, 버튼 하나를 그립니다. 카드나 상세 패널이 열릴 때 맞습니다.",
            en: "A heading, three body lines and a button, for a card or a detail panel opening.",
          },
        },
        {
          name: "text",
          description: {
            ko: "세 줄만 그립니다. 문단이나 설명 블록이 늦게 올 때 맞습니다.",
            en: "Three lines only, for a paragraph or a description block that arrives late.",
          },
        },
      ],
      example: "cards",
    },
    {
      id: "surface",
      title: { ko: "surface", en: "surface" },
      description: {
        ko: "SkeletonCard의 바탕 재질입니다. 카드가 놓일 자리의 재질과 같게 맞춥니다.",
        en: "The material behind SkeletonCard. Match it to the material the real card will sit on.",
      },
      values: [
        {
          name: "solid",
          description: {
            ko: "불투명 표면에 1px 기본 테두리를 쓰는 기본값입니다.",
            en: "Opaque surface with a 1px default border. The default.",
          },
        },
        {
          name: "glass",
          description: {
            ko: "두꺼운 유리 바탕에 LiquidGlass 레이어를 깝니다. 유리 패널이나 이미지 위에 맞습니다.",
            en: "Thick glass with a LiquidGlass layer, for a glass panel or over imagery.",
          },
        },
      ],
      example: "glass",
    },
    {
      id: "className",
      title: { ko: "className", en: "className" },
      description: {
        ko: "Skeleton 막대의 크기를 정하는 클래스입니다. Skeleton에는 크기가 없으므로 h-3 w-48처럼 높이와 폭을 반드시 넘깁니다. SkeletonCard에서는 카드 폭을 바꿀 때 씁니다.",
        en: "The classes that size a Skeleton bar. Skeleton has no size of its own, so always pass a height and a width such as h-3 w-48. On SkeletonCard it changes the card width.",
      },
      example: "blocks",
    },
  ],
  guidelines: [
    {
      id: "mirror-the-layout",
      title: { ko: "들어올 내용의 모양을 그립니다", en: "Mirror the content that is coming" },
      body: {
        ko: "자리표시자는 실제 내용과 같은 수의 줄과 같은 높이로 그립니다. 모양이 다르면 내용이 도착할 때 화면이 튀고 사용자가 위치를 다시 찾아야 합니다.",
        en: "Draw the same number of lines at the same heights as the content. A different shape makes the screen jump when the content lands and forces the reader to find their place again.",
      },
      do: {
        ko: "두 줄 목록에는 SkeletonCard type row를 씁니다.",
        en: "Use SkeletonCard type row for a two-line list.",
      },
      dont: {
        ko: "카드 자리에 세 줄짜리 text 자리표시자를 쓰지 않습니다.",
        en: "Do not put a three-line text placeholder where a card will land.",
      },
      example: "cards",
    },
    {
      id: "one-status-per-card",
      title: { ko: "알림은 카드가 한 번 합니다", en: "The card announces once" },
      body: {
        ko: "SkeletonCard가 role status와 Loading 이름을 이미 전달하고 개별 막대는 aria-hidden입니다. 같은 영역에 라이브 영역이나 Loading 문구를 겹쳐 붙이지 않고, 로딩이 끝나면 카드를 걷어 냅니다.",
        en: "SkeletonCard already carries role status and the name Loading, and each bar is aria-hidden. Do not stack another live region or Loading message on the same area; remove the card once the content lands.",
      },
      example: "list",
    },
    {
      id: "shape-vs-spinner",
      title: { ko: "구조가 정해졌을 때 씁니다", en: "Use it when the structure is known" },
      body: {
        ko: "Skeleton은 어떤 모양이 올지 알 때 씁니다. 결과의 모양을 모르거나 대기가 짧으면 Spinner 하나로 충분합니다.",
        en: "A Skeleton works when the shape that is coming is known. For an unknown result or a short wait, a single Spinner is enough.",
      },
      example: "blocks",
    },
    {
      id: "glass-surface",
      title: { ko: "표면을 실제 카드와 맞춥니다", en: "Match the real card's surface" },
      body: {
        ko: "유리 패널 안에서 카드가 열리면 SkeletonCard에도 같은 glass 표면을 씁니다. solid 자리표시자 뒤로 유리가 보이면 내용이 도착할 때 바탕이 한 번 바뀝니다.",
        en: "When a card opens inside a glass panel, give SkeletonCard the same glass surface. A solid placeholder over visible glass changes the background once the content lands.",
      },
      example: "glass",
    },
  ],
  specification: [
    {
      id: "skeleton-bar",
      title: { ko: "Skeleton 막대", en: "Skeleton bar" },
      rows: [
        { state: "default", slot: "Block", property: "background", value: "bg-overlay-ink-7" },
        {
          state: "default",
          slot: "Shimmer",
          property: "gradient",
          value: "linear-gradient(90deg, transparent 30%, rgba(255,255,255,0.4) 50%, transparent 70%)",
        },
        {
          state: "dark",
          slot: "Shimmer",
          property: "gradient",
          value: "linear-gradient(90deg, transparent 30%, rgba(255,255,255,0.06) 50%, transparent 70%)",
        },
        { state: "default", slot: "Shimmer", property: "background size", value: "200% 100%" },
        {
          state: "default",
          slot: "Block",
          property: "animation",
          value: "animate-shimmer",
          note: {
            ko: "1.6초 주기로 하이라이트가 지나갑니다.",
            en: "The highlight travels on a 1.6s cycle.",
          },
        },
        { state: "block", slot: "Block", property: "radius", value: "6px" },
        { state: "pill", slot: "Block", property: "radius", value: "9999px" },
        {
          state: "default",
          slot: "Block",
          property: "size",
          value: "className",
          note: {
            ko: "막대 자체에는 크기가 없습니다.",
            en: "The bar carries no size of its own.",
          },
        },
        { state: "default", slot: "Block", property: "accessibility", value: "aria-hidden" },
      ],
    },
    {
      id: "card-layouts",
      title: { ko: "SkeletonCard 배치", en: "SkeletonCard layouts" },
      note: {
        ko: "막대 값은 컴포넌트 클래스의 높이와 폭입니다.",
        en: "Bar values are the heights and widths from the component classes.",
      },
      rows: [
        { state: "row", slot: "Card", property: "width", value: "300px" },
        { state: "row", slot: "Card", property: "layout", value: "flex items-center gap-3" },
        { state: "row", slot: "Avatar bar", property: "size", value: "36px" },
        { state: "row", slot: "Line 1", property: "size", value: "h-2.5 w-35" },
        { state: "row", slot: "Line 2", property: "size", value: "h-2 w-50" },
        { state: "card", slot: "Card", property: "width", value: "280px" },
        { state: "card", slot: "Card", property: "layout", value: "flex flex-col items-start gap-3" },
        { state: "card", slot: "Heading bar", property: "size", value: "h-3 w-30" },
        { state: "card", slot: "Line 1", property: "size", value: "h-2 w-62" },
        { state: "card", slot: "Line 2", property: "size", value: "h-2 w-55" },
        { state: "card", slot: "Line 3", property: "size", value: "h-2 w-40" },
        { state: "card", slot: "Button bar", property: "size", value: "h-7 w-20" },
        { state: "text", slot: "Card", property: "width", value: "280px" },
        { state: "text", slot: "Line 1", property: "size", value: "h-2 w-62" },
        { state: "text", slot: "Line 2", property: "size", value: "h-2 w-59" },
        { state: "text", slot: "Line 3", property: "size", value: "h-2 w-45" },
        {
          state: "mobile",
          slot: "Bar",
          property: "width",
          value: "max-sm:max-w-full",
          note: {
            ko: "좁은 화면에서는 막대가 카드 폭을 넘지 않습니다.",
            en: "On a narrow screen the bars never exceed the card width.",
          },
        },
      ],
    },
    {
      id: "card-surface",
      title: { ko: "SkeletonCard 표면", en: "SkeletonCard surface" },
      rows: [
        { state: "default", slot: "Card", property: "padding", value: "16px" },
        { state: "default", slot: "Card", property: "gap", value: "12px" },
        { state: "default", slot: "Card", property: "radius", value: "20px" },
        { state: "solid", slot: "Card", property: "background", value: "bg-bg-surface" },
        { state: "solid", slot: "Card", property: "border", value: "1px border-border-default" },
        { state: "glass", slot: "Card", property: "background", value: "bg-glass-thick" },
        { state: "glass", slot: "Card", property: "background layer", value: "LiquidGlass" },
        { state: "default", slot: "Card", property: "role", value: "status" },
        { state: "default", slot: "Card", property: "accessible name", value: "Loading" },
      ],
    },
  ],
  examples: [
    {
      id: "blocks",
      title: { ko: "막대", en: "Bars" },
      description: {
        ko: "Skeleton 막대를 block과 pill 두 모양으로 원하는 크기만큼 그립니다.",
        en: "Skeleton bars in both shapes, sized by their classes.",
      },
    },
    {
      id: "cards",
      title: { ko: "카드 배치", en: "Card layouts" },
      description: {
        ko: "row, card, text 세 가지 자리표시자 배치를 나란히 두었습니다.",
        en: "The row, card and text placeholder layouts side by side.",
      },
    },
    {
      id: "glass",
      title: { ko: "유리 표면", en: "Glass surface" },
      description: {
        ko: "유리 패널 위에서 glass 표면을 쓴 자리표시자입니다.",
        en: "A placeholder with the glass surface on a glass panel.",
      },
    },
    {
      id: "list",
      title: { ko: "목록 로딩", en: "Loading a list" },
      description: {
        ko: "세 행을 로딩하는 목록입니다. 각 카드가 Loading을 알리고 막대는 읽히지 않습니다.",
        en: "Three rows loading. Each card announces Loading while its bars stay silent.",
      },
    },
  ],
  accessibility: {
    notes: [
      {
        ko: "낱개 Skeleton 막대는 aria-hidden이라 스크린 리더가 읽지 않습니다. 로딩 상태는 SkeletonCard의 role status와 Loading 이름이 한 번 전달합니다.",
        en: "Each Skeleton bar is aria-hidden and skipped. The loading state is announced once by SkeletonCard's role status and the name Loading.",
      },
      {
        ko: "동작 줄이기를 켜면 shimmer가 한 번만 실행됩니다. 자리표시자가 멈춰 보여도 내용이 아직 오지 않았다는 사실은 카드의 로딩 이름이 전달합니다.",
        en: "With reduced motion the shimmer runs once. The card's loading name still says the content has not arrived, even when the placeholder looks still.",
      },
      {
        ko: "자리표시자를 오래 두지 않습니다. 내용이 도착하면 같은 영역에서 Skeleton을 걷어 내고, 실패했으면 EmptyState나 Banner로 상태를 바꿉니다.",
        en: "Do not leave the placeholder in place. When the content lands, remove the Skeleton from that region; when it fails, replace it with an EmptyState or a Banner.",
      },
    ],
    keyboard: [],
  },
};
