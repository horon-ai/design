/**
 * Reference doc for `TabBar`, written against
 * `packages/react/src/components/tab-bar.tsx` and
 * `packages/flutter/lib/src/components/tab_bar.dart`.
 */
import type { ComponentDoc } from "@/lib/component-docs";

export const doc: ComponentDoc = {
  slug: "tab-bar",
  anatomy: {
    description: {
      ko: "TabBar는 모바일 화면 아래에 놓는 아이콘 탭 막대입니다. 유리 알약 트레이 안에 탭이 고정 크기로 놓이고, 선택된 탭 자리로 잉크 알약이 움직입니다.",
      en: "A TabBar is the icon tab bar at the bottom of a mobile screen. Fixed-size tabs sit inside a glass pill tray, and an ink pill slides to the selected tab.",
    },
    parts: [
      {
        name: "Track",
        slot: "nav",
        description: {
          ko: "탭을 담는 nav 랜드마크입니다. 알약 모양의 유리 트레이이고, 탭이 넘치면 안쪽에서 가로로 스크롤합니다.",
          en: "The nav landmark holding the tabs. A pill-shaped glass tray that scrolls sideways inside when the tabs overflow.",
        },
      },
      {
        name: "LiquidGlass",
        slot: "LiquidGlass",
        description: {
          ko: "surface가 glass일 때 트레이 안쪽에 깔리는 유리 레이어입니다. flat에서는 그려지지 않습니다.",
          en: "The glass layer inside the tray when surface is glass. It is not drawn for flat.",
        },
      },
      {
        name: "Indicator",
        slot: "Indicator",
        description: {
          ko: "선택된 탭으로 움직이는 10% 잉크 알약입니다. 장식이라 aria-hidden으로 읽히지 않습니다.",
          en: "The 10% ink pill that slides to the selected tab. It is decorative and hidden from assistive tech.",
        },
      },
      {
        name: "Tab",
        slot: "items",
        description: {
          ko: "아이콘만 있는 탭 버튼입니다. items 배열의 label이 접근 가능한 이름이 되고 아이콘은 표시만 됩니다.",
          en: "An icon-only tab button. Each item's label becomes the accessible name and the icon is visual only.",
        },
      },
    ],
  },
  properties: [
    {
      id: "surface",
      title: { ko: "surface", en: "surface" },
      description: {
        ko: "트레이의 재질입니다. 두 값 모두 glass-regular 바탕을 쓰고, 유리 레이어를 한 겹 더 그리는지만 다릅니다.",
        en: "The tray material. Both values use the glass-regular fill and differ only in whether the glass layer is drawn on top of it.",
      },
      values: [
        {
          name: "glass",
          description: {
            ko: "LiquidGlass 레이어를 트레이 안쪽에 그립니다. 기본값이고, 이미지나 떠 있는 크롬 위에 놓을 때 씁니다.",
            en: "Draws the LiquidGlass layer inside the tray. The default, for placement over imagery or floating chrome.",
          },
        },
        {
          name: "flat",
          description: {
            ko: "유리 레이어를 생략하고 glass-regular 바탕만 남깁니다. 이미 유리 면 안에 놓여 레이어를 겹치고 싶지 않을 때 씁니다.",
            en: "Skips the glass layer and keeps only the glass-regular fill, for a bar already sitting on a glass surface where a second layer would stack.",
          },
        },
      ],
      example: "surfaces",
    },
    {
      id: "size",
      title: { ko: "size", en: "size" },
      description: {
        ko: "탭 한 칸의 가로와 세로 크기, 그리고 아이콘 크기입니다. 트레이 안쪽 여백도 함께 바뀝니다.",
        en: "The width, height and icon size of one tab. The tray padding moves with it.",
      },
      values: [
        {
          name: "sm",
          description: {
            ko: "탭 56x40px에 20px 아이콘을 씁니다. 좁은 화면에 맞습니다.",
            en: "56x40px tabs with 20px icons, for narrow screens.",
          },
        },
        {
          name: "md",
          description: {
            ko: "탭 64x48px에 22px 아이콘을 씁니다. 기본값이고 Figma 크기입니다.",
            en: "64x48px tabs with 22px icons. The default and the Figma size.",
          },
        },
        {
          name: "lg",
          description: {
            ko: "탭 72x56px에 24px 아이콘을 씁니다. 큰 손가락과 넓은 화면에 맞습니다.",
            en: "72x56px tabs with 24px icons, for large targets and wide screens.",
          },
        },
      ],
      example: "sizes",
    },
    {
      id: "value",
      title: { ko: "value", en: "value" },
      description: {
        ko: "지금 선택된 항목의 value입니다. 막대는 완전히 제어되는 컴포넌트라 스스로 값을 바꾸지 않고, 선택이 바뀌면 aria-current가 page인 탭이 따라 움직입니다.",
        en: "The value of the selected item. The bar is fully controlled and never changes the value itself; the tab with aria-current=\"page\" is where the pill lands.",
      },
      example: "controlled",
    },
    {
      id: "items",
      title: { ko: "items", en: "items" },
      description: {
        ko: "표시 순서대로 놓이는 목적지 목록입니다. 각 항목은 value, 접근 가능한 이름인 label, 그리고 아이콘을 가집니다.",
        en: "The destinations in display order. Each item carries a value, the accessible name in label, and the icon.",
      },
      example: "controlled",
    },
  ],
  guidelines: [
    {
      id: "top-level-only",
      title: { ko: "최상위 목적지만", en: "Top-level destinations only" },
      body: {
        ko: "TabBar는 앱의 최상위 목적지를 담습니다. 세 개에서 다섯 개가 적당하고, 같은 화면의 내용을 나눌 때는 Tabs를 씁니다. 항목이 여섯 개를 넘으면 어느 것이 주요 목적지인지 읽히지 않습니다.",
        en: "A TabBar holds the app's top-level destinations: three to five is the working range. Use Tabs to divide one screen's content. Past six items, which one is a main destination stops reading.",
      },
      do: {
        ko: "Home, Inbox, Artifacts, Me 네 목적지를 담습니다.",
        en: "Hold four destinations: Home, Inbox, Artifacts, Me.",
      },
      dont: {
        ko: "설정 화면 안의 하위 탭을 TabBar로 만들지 않습니다.",
        en: "Do not turn a settings screen's sub-tabs into a TabBar.",
      },
      example: "controlled",
    },
    {
      id: "label-is-the-name",
      title: { ko: "라벨이 이름입니다", en: "The label is the name" },
      body: {
        ko: "탭은 아이콘만 보이므로 label이 유일한 접근 가능한 이름입니다. 화면에 보이는 단어와 같은 말로 적고, 아이콘 모양만 보고 짐작하게 두지 않습니다.",
        en: "Tabs show only an icon, so label is the only accessible name. Use the word the screen uses and do not leave the icon to carry the meaning alone.",
      },
      do: {
        ko: "label: \"Inbox\"로 적습니다.",
        en: "Use label: \"Inbox\".",
      },
      dont: {
        ko: "label: \"Tab 2\"처럼 위치로 이름 짓지 않습니다.",
        en: "Do not name a tab by position, as in label: \"Tab 2\".",
      },
      example: "sizes",
    },
    {
      id: "fixed-taps",
      title: { ko: "탭은 줄이지 않고 스크롤합니다", en: "Tabs scroll instead of shrinking" },
      body: {
        ko: "탭은 정해진 탭 크기를 유지하고, 줄이 넘치면 트레이가 가로로 스크롤합니다. 항목을 늘리면서 크기를 줄이면 손가락으로 누를 수 있는 영역이 함께 줄어듭니다.",
        en: "Tabs keep their fixed tap size and the track scrolls sideways when the row overflows. Adding items and shrinking them shrinks the area a finger can hit.",
      },
      example: "sizes",
    },
  ],
  specification: [
    {
      id: "track-metrics",
      title: { ko: "트레이", en: "Track" },
      rows: [
        { state: "any", slot: "Track", property: "background", value: "bg-glass-regular" },
        { state: "any", slot: "Track", property: "radius", value: "rounded-full" },
        { state: "any", slot: "Track", property: "gap", value: "gap-1" },
        { state: "any", slot: "Track", property: "overflow", value: "overflow-x-auto" },
        { state: "sm", slot: "Track", property: "padding", value: "p-1" },
        { state: "md", slot: "Track", property: "padding", value: "p-1.5" },
        { state: "lg", slot: "Track", property: "padding", value: "p-2" },
        { state: "surface=glass", slot: "Track", property: "background layer", value: "LiquidGlass" },
        { state: "any", slot: "Indicator", property: "background", value: "bg-overlay-ink-10" },
        { state: "any", slot: "Indicator", property: "motion", value: "motion-indicator" },
      ],
    },
    {
      id: "tab-metrics",
      title: { ko: "탭", en: "Tab" },
      rows: [
        { state: "sm", slot: "Tab", property: "size", value: "h-10 w-14" },
        { state: "sm", slot: "Icon", property: "size", value: "size-5" },
        { state: "md", slot: "Tab", property: "size", value: "h-12 w-16" },
        { state: "md", slot: "Icon", property: "size", value: "size-5.5" },
        { state: "lg", slot: "Tab", property: "size", value: "h-14 w-18" },
        { state: "lg", slot: "Icon", property: "size", value: "size-6" },
        { state: "any", slot: "Tab", property: "radius", value: "rounded-full" },
        { state: "current", slot: "Tab", property: "text color", value: "text-text-primary" },
        { state: "default", slot: "Tab", property: "text color", value: "text-text-secondary" },
        { state: "hover", slot: "Tab", property: "background", value: "bg-overlay-ink-5" },
        { state: "focus-visible", slot: "Tab", property: "outline", value: "2px outline-text-brand" },
        { state: "focus-visible", slot: "Tab", property: "outline offset", value: "2px" },
        { state: "pressed", slot: "Tab", property: "motion", value: "motion-press" },
      ],
    },
  ],
  examples: [
    {
      id: "sizes",
      title: { ko: "크기", en: "Sizes" },
      description: {
        ko: "같은 네 목적지를 sm, md, lg로 놓았습니다. 탭 크기와 아이콘 크기가 함께 바뀝니다.",
        en: "The same four destinations at sm, md and lg, with tab and icon size moving together.",
      },
    },
    {
      id: "surfaces",
      title: { ko: "표면", en: "Surfaces" },
      description: {
        ko: "유리 레이어를 그리는 glass와 그것을 생략한 flat을 나란히 놓았습니다. 바탕 색은 같습니다.",
        en: "Glass, which draws the layer, next to flat, which skips it. The fill is the same on both.",
      },
    },
    {
      id: "controlled",
      title: { ko: "제어된 선택", en: "Controlled selection" },
      description: {
        ko: "선택을 상태로 들고 막대에는 value만 넘기는 예입니다. 누른 값은 onValueChange로 돌아옵니다.",
        en: "The selection lives in state and only value is passed to the bar. Pressed values come back through onValueChange.",
      },
    },
  ],
  accessibility: {
    notes: [
      {
        ko: "막대는 nav 랜드마크이고 aria-label로 이름을 가집니다. 값이 없으면 Main이 붙으므로 화면에 맞는 이름을 넘깁니다.",
        en: "The bar is a nav landmark named by aria-label, which falls back to Main, so pass a name that fits the screen.",
      },
      {
        ko: "현재 탭에만 aria-current가 page로 붙고 나머지 탭에는 붙지 않습니다. 이 값이 이동한 위치를 알려 주는 유일한 표시이므로, 선택 표시를 색으로만 대신하지 않습니다.",
        en: "Only the current tab carries aria-current=\"page\"; the others carry none. That attribute is what tells assistive tech where the reader is, so do not replace it with color alone.",
      },
      {
        ko: "탭에는 아이콘만 보이므로 items의 label을 반드시 채웁니다. label은 버튼의 aria-label이 되고 화면에는 그려지지 않습니다.",
        en: "Tabs show icons only, so every item needs a label. It becomes the button's aria-label and is never painted.",
      },
      {
        ko: "선택 표시가 인디케이터의 이동으로만 나타나므로 동작 줄이기를 켜면 이동이 사라지고 알약이 즉시 옮겨집니다.",
        en: "The selection shows through the indicator's travel, so reduced motion removes the travel and the pill jumps instead.",
      },
    ],
    keyboard: [
      {
        keys: ["Tab"],
        action: {
          ko: "탭 막대의 첫 탭으로 포커스를 옮깁니다. 탭마다 포커스를 받습니다.",
          en: "Moves focus to the first tab of the bar; every tab takes focus in turn.",
        },
      },
      {
        keys: ["Enter", "Space"],
        action: {
          ko: "포커스한 탭을 누르고 onValueChange로 그 값을 넘깁니다.",
          en: "Presses the focused tab and reports its value through onValueChange.",
        },
      },
    ],
  },
};
