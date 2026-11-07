/**
 * Reference doc for `Tabs`, written against
 * `packages/react/src/components/tabs.tsx` and
 * `packages/flutter/lib/src/components/tabs.dart`.
 */
import type { ComponentDoc } from "@/lib/component-docs";

export const doc: ComponentDoc = {
  slug: "tabs",
  anatomy: {
    description: {
      ko: "Tabs는 한 맥락의 화면을 여러 탭으로 나눕니다. 탭 목록과 패널을 16px 간격의 세로 열로 쌓고, 선택 표시는 목록 안의 인디케이터 하나가 움직여 그립니다.",
      en: "Tabs splits screens in one context into tabs. The list and the panels stack in a 16px column, and one indicator inside the list slides to draw the selection.",
    },
    parts: [
      {
        name: "Root",
        slot: "Tabs",
        description: {
          ko: "탭 집합의 뿌리입니다. 목록과 패널을 16px 간격으로 쌓고, 안쪽 TabsTab이 읽을 크기를 정합니다.",
          en: "The root of a tab set. It stacks the list and panels at a 16px gap and provides the size its TabsTabs read.",
        },
      },
      {
        name: "List",
        slot: "TabsList",
        description: {
          ko: "탭이 놓이는 트레이입니다. 알약 트레이이거나 밑줄만 있는 행이고, 선택 표시를 위한 인디케이터를 함께 그립니다.",
          en: "The tray the tabs sit in. It is either a pill tray or a bare underlined row, and it draws the indicator for the selection.",
        },
      },
      {
        name: "LiquidGlass",
        slot: "LiquidGlass",
        description: {
          ko: "surface가 glass일 때 트레이와 인디케이터 안쪽에 깔리는 유리 레이어입니다.",
          en: "The glass layer drawn inside the tray and the indicator when surface is glass.",
        },
      },
      {
        name: "Indicator",
        slot: "Indicator",
        description: {
          ko: "선택된 탭 자리로 움직이는 표시입니다. 알약 목록에서는 10% 잉크 알약, 밑줄 목록에서는 2px 밑줄입니다.",
          en: "The mark that slides to the selected tab: a 10% ink pill on a pill list, a 2px bar on an underline list.",
        },
      },
      {
        name: "Tab",
        slot: "TabsTab",
        description: {
          ko: "탭 하나입니다. 아이콘, 라벨, 개수 알약 순서로 놓이고 height와 글자 단계는 감싼 Tabs의 size를 따릅니다.",
          en: "One tab. It lays out an icon, the label and a count pill in that order, taking its height and type from the enclosing Tabs size.",
        },
      },
      {
        name: "Panel",
        slot: "TabsPanel",
        description: {
          ko: "탭 하나의 내용 영역입니다. value로 탭과 연결되고, 탭을 바꾸면 내용이 4px 밀려 들어옵니다.",
          en: "The content region of one tab, matched to it by value. A swap slides the content in 4px.",
        },
      },
    ],
  },
  properties: [
    {
      id: "size",
      title: { ko: "size", en: "size" },
      description: {
        ko: "탭 한 칸의 높이와 글자 단계입니다. Tabs에 한 번 정하면 안쪽 TabsTab이 모두 그 값을 읽으므로 한 목록은 한 단계를 유지합니다.",
        en: "Height and type rung of a tab. Set it once on Tabs and every TabsTab inside reads it, so one list stays on one rung.",
      },
      values: [
        {
          name: "sm",
          description: {
            ko: "높이 26px에 label-sm 탭을 씁니다. 좁은 패널이나 밀도 높은 도구 모음에 맞습니다.",
            en: "26px tall with a label-sm tab, for narrow panels and dense toolbars.",
          },
        },
        {
          name: "md",
          description: {
            ko: "높이 30px에 label-md 탭을 씁니다. 기본값입니다.",
            en: "30px tall with a label-md tab. The default.",
          },
        },
        {
          name: "lg",
          description: {
            ko: "높이 36px에 label-lg 탭을 씁니다. 화면 상단의 주 탭에 맞습니다.",
            en: "36px tall with a label-lg tab, for the main tabs at the top of a screen.",
          },
        },
      ],
      example: "sizes",
    },
    {
      id: "variant",
      title: { ko: "variant", en: "variant" },
      description: {
        ko: "탭 목록의 모양입니다. TabsList에 정하고 안쪽 TabsTab이 알약 모양과 좌우 여백을 여기에 맞춰 바꿉니다.",
        en: "The shape of the tab list. Set it on TabsList; the TabsTabs inside drop the pill shape and side padding to match.",
      },
      values: [
        {
          name: "pill",
          description: {
            ko: "각도가 둥근 알약 트레이 안에 탭을 담습니다. 기본값이고, 화면 안의 설정 묶음에 맞습니다.",
            en: "Tabs sit inside a rounded pill tray. The default, and what in-screen setting groups use.",
          },
        },
        {
          name: "underline",
          description: {
            ko: "트레이 없이 탭 아래에 1px 테두리와 2px 밑줄만 둡니다. 문서 본문의 최상위 탭에 맞습니다.",
            en: "No tray: a 1px border under the row and a 2px bar on the active tab, for top-level tabs on a document.",
          },
        },
      ],
      example: "variants",
    },
    {
      id: "surface",
      title: { ko: "surface", en: "surface" },
      description: {
        ko: "알약 트레이의 바탕입니다. 밑줄 목록에는 적용되지 않습니다.",
        en: "The fill of the pill tray. It does not apply to the underline variant.",
      },
      values: [
        {
          name: "solid",
          description: {
            ko: "불투명한 표면 트레이에 기본 테두리를 두릅니다. 기본값이고 본문 위에 놓습니다.",
            en: "An opaque surface tray with a default border. The default, for placement on a content surface.",
          },
        },
        {
          name: "glass",
          description: {
            ko: "regular glass 트레이를 씁니다. 이미지나 떠 있는 크롬 위에 놓을 때만 씁니다.",
            en: "A regular glass tray, only for placement over imagery or floating chrome.",
          },
        },
      ],
      example: "variants",
    },
    {
      id: "count",
      title: { ko: "count", en: "count" },
      description: {
        ko: "라벨 뒤에 붙는 개수 알약입니다. 값을 넘기지 않으면 자리가 생기지 않고, 선택된 탭에서는 알약이 primary 채움으로 바뀝니다.",
        en: "A count pill after the label. Leave it out and the slot disappears; on the active tab the pill turns to the primary fill.",
      },
      example: "counts",
    },
    {
      id: "icon",
      title: { ko: "icon", en: "icon" },
      description: {
        ko: "라벨 앞의 아이콘입니다. 크기는 size가 정하고 색은 라벨을 따르므로, 선택과 hover에서 아이콘도 함께 바뀝니다.",
        en: "A leading icon. Its size comes from size and its color from the label, so it moves with selection and hover.",
      },
      example: "counts",
    },
  ],
  guidelines: [
    {
      id: "tabs-not-tab-bar",
      title: { ko: "탭은 같은 화면 안에서만", en: "Tabs stay inside one screen" },
      body: {
        ko: "Tabs는 한 화면의 내용을 나눌 때 쓰고, 앱의 최상위 이동에는 TabBar를 씁니다. 이동마다 화면 전체가 바뀌는 자리에 Tabs를 두면 탭이 곧 내비게이션이 되어 어느 쪽이 현재 위치인지 흐려집니다.",
        en: "Use Tabs to divide the content of one screen and TabBar for top-level app navigation. Tabs in a place where the whole screen changes become navigation and blur where the reader is.",
      },
      do: {
        ko: "봇 상세 화면 안에서 Activity, Routines, Tools를 나눕니다.",
        en: "Divide a bot screen into Activity, Routines and Tools.",
      },
      dont: {
        ko: "홈, 검색, 설정 이동을 Tabs로 만들지 않습니다.",
        en: "Do not build Home, Search and Settings navigation out of Tabs.",
      },
      example: "variants",
    },
    {
      id: "rung-per-list",
      title: { ko: "목록마다 한 단계", en: "One rung per list" },
      body: {
        ko: "size는 Tabs에 한 번만 정합니다. 한 목록 안에서 탭마다 다른 크기를 주면 인디케이터 높이가 어긋나 표시가 탭 위에 걸칩니다.",
        en: "Set size once on Tabs. Mixed tab heights inside one list put the indicator at the wrong height so the mark hangs off the tab.",
      },
      example: "sizes",
    },
    {
      id: "underline-docs",
      title: { ko: "밑줄은 문서에", en: "Underline is for documents" },
      body: {
        ko: "밑줄 목록은 트레이가 없어 본문과 이어져 보입니다. 문서나 긴 설명 화면의 최상위 탭에 쓰고, 카드나 설정 묶음 안에서는 알약 목록을 씁니다.",
        en: "The underline list has no tray, so it reads as part of the page. Use it for top-level tabs on documents and long reads, and the pill list inside cards and setting groups.",
      },
      do: {
        ko: "명령과 수동 설치를 나누는 문서 탭에 밑줄을 씁니다.",
        en: "Use the underline for Command and Manual on a document.",
      },
      dont: {
        ko: "설정 카드 안에서 밑줄 목록을 쓰지 않습니다.",
        en: "Do not use the underline list inside a settings card.",
      },
      example: "variants",
    },
    {
      id: "glass-on-imagery",
      title: { ko: "glass는 이미지 위에서만", en: "Glass only over imagery" },
      body: {
        ko: "glass 트레이는 뒤가 비치는 면을 전제로 만든 표면입니다. 불투명한 본문 위에 두면 유리 바탕이 배경색과 섞여 트레이 경계가 사라집니다.",
        en: "The glass tray assumes a surface behind it. On an opaque page its fill mixes with the background and the tray edge disappears.",
      },
      example: "variants",
    },
  ],
  specification: [
    {
      id: "list-metrics",
      title: { ko: "목록과 인디케이터", en: "List and indicator" },
      rows: [
        { state: "pill", slot: "List", property: "background", value: "bg-bg-surface" },
        { state: "pill", slot: "List", property: "border", value: "1px border-border-default" },
        { state: "pill", slot: "List", property: "radius", value: "rounded-full" },
        { state: "pill", slot: "List", property: "padding", value: "p-[3px]" },
        { state: "pill · lg", slot: "List", property: "padding", value: "p-1" },
        { state: "pill", slot: "List", property: "gap", value: "gap-0.5" },
        { state: "pill · glass", slot: "List", property: "background", value: "bg-glass-regular" },
        { state: "pill · glass", slot: "List", property: "background layer", value: "LiquidGlass" },
        { state: "pill", slot: "Indicator", property: "background", value: "bg-overlay-ink-10" },
        { state: "pill · glass", slot: "Indicator", property: "background", value: "bg-glass-thick" },
        {
          state: "pill · glass",
          slot: "Indicator",
          property: "shadow",
          value: "shadow-[0_1px_3px_rgba(0,0,0,0.08)]",
        },
        { state: "underline", slot: "List", property: "border", value: "1px border-b border-border-default" },
        { state: "underline", slot: "List", property: "gap", value: "gap-6" },
        { state: "underline", slot: "Indicator", property: "height", value: "h-0.5" },
        { state: "underline", slot: "Indicator", property: "background", value: "bg-text-primary" },
        { state: "any", slot: "Indicator", property: "motion", value: "motion-indicator" },
      ],
    },
    {
      id: "tab-metrics",
      title: { ko: "탭 값", en: "Tab values" },
      note: {
        ko: "밑줄 목록의 탭은 같은 높이와 글자를 유지하고 좌우 여백만 0이 됩니다.",
        en: "Tabs on an underline list keep their height and type and drop the side padding to zero.",
      },
      rows: [
        { state: "sm", slot: "Tab", property: "height", value: "h-6.5" },
        { state: "sm", slot: "Tab", property: "padding", value: "px-2.5" },
        { state: "sm", slot: "Tab", property: "gap", value: "gap-1" },
        { state: "sm", slot: "Tab", property: "font", value: "text-label-sm" },
        { state: "sm", slot: "Icon", property: "size", value: "size-3.5" },
        { state: "sm", slot: "Count", property: "height", value: "h-4.5" },
        { state: "md", slot: "Tab", property: "height", value: "h-7.5" },
        { state: "md", slot: "Tab", property: "padding", value: "px-4" },
        { state: "md", slot: "Tab", property: "gap", value: "gap-1.5" },
        { state: "md", slot: "Tab", property: "font", value: "text-label-md" },
        { state: "md", slot: "Icon", property: "size", value: "size-4" },
        { state: "md", slot: "Count", property: "height", value: "h-5" },
        { state: "lg", slot: "Tab", property: "height", value: "h-9" },
        { state: "lg", slot: "Tab", property: "padding", value: "px-4" },
        { state: "lg", slot: "Tab", property: "gap", value: "gap-2" },
        { state: "lg", slot: "Tab", property: "font", value: "text-label-lg" },
        { state: "lg", slot: "Icon", property: "size", value: "size-5" },
        { state: "lg", slot: "Count", property: "height", value: "h-6" },
      ],
    },
    {
      id: "tab-states",
      title: { ko: "탭 상태", en: "Tab states" },
      rows: [
        { state: "default", slot: "Tab", property: "text color", value: "text-text-secondary" },
        { state: "hover", slot: "Tab", property: "text color", value: "text-text-primary" },
        { state: "selected", slot: "Tab", property: "text color", value: "text-text-primary" },
        { state: "selected", slot: "Count", property: "background", value: "bg-interactive-primary" },
        { state: "selected", slot: "Count", property: "text color", value: "text-interactive-on-primary" },
        { state: "focus-visible", slot: "Tab", property: "outline", value: "2px outline-text-brand" },
        { state: "focus-visible", slot: "Tab", property: "outline offset", value: "2px" },
        { state: "disabled", slot: "Tab", property: "opacity", value: "40%" },
        { state: "any", slot: "Tab", property: "motion", value: "motion-colors" },
        { state: "any", slot: "Panel", property: "motion", value: "animate-swap-move" },
      ],
    },
  ],
  examples: [
    {
      id: "variants",
      title: { ko: "목록 변형", en: "List variants" },
      description: {
        ko: "solid 알약, glass 알약, 밑줄 목록을 차례로 놓았습니다. glass는 배경 위에서만 트레이가 보입니다.",
        en: "A solid pill tray, a glass pill tray and an underline list. The glass tray only shows its fill over a backdrop.",
      },
    },
    {
      id: "sizes",
      title: { ko: "크기", en: "Sizes" },
      description: {
        ko: "같은 탭 묶음을 sm, md, lg 세 단계로 놓았습니다. 높이와 글자, 아이콘 크기가 함께 바뀝니다.",
        en: "The same tab set at sm, md and lg. Height, type and icon size move together.",
      },
    },
    {
      id: "counts",
      title: { ko: "개수와 아이콘", en: "Counts and icons" },
      description: {
        ko: "개수 알약과 아이콘을 붙인 탭입니다. 선택된 탭에서 알약이 primary 채움으로 바뀝니다.",
        en: "Tabs with count pills and icons. The pill on the active tab turns to the primary fill.",
      },
    },
    {
      id: "panels",
      title: { ko: "패널 연결", en: "Panels" },
      description: {
        ko: "value로 탭과 패널을 연결하고 선택을 상태로 들고 있는 예입니다. 탭을 바꾸면 패널 내용이 밀려 들어옵니다.",
        en: "Tabs and panels matched by value with the selection held in state. Switching slides the panel content in.",
      },
    },
  ],
  accessibility: {
    pattern: { label: "WAI-ARIA Tabs Pattern", href: "https://www.w3.org/WAI/ARIA/apg/patterns/tabs/" },
    notes: [
      {
        ko: "Base UI가 탭에 role=\"tab\"과 aria-selected를, 목록에 role=\"tablist\", 패널에 role=\"tabpanel\"을 붙입니다. 탭과 패널은 value로 연결되므로 두 값이 같아야 합니다.",
        en: "Base UI puts role=\"tab\" and aria-selected on each tab, role=\"tablist\" on the list, and role=\"tabpanel\" on each panel. Tabs and panels are matched by value, so the two have to agree.",
      },
      {
        ko: "패널에는 탭 라벨이 이름으로 붙지만, 내용이 아이콘이나 짧은 단어뿐인 탭은 라벨만으로 의미가 서지 않습니다. 탭 라벨은 무엇이 나오는지 말하는 명사로 적습니다.",
        en: "Each panel takes its tab's label as its name, so a tab labeled with an icon or a bare word leaves the panel weakly named. Label tabs with the noun the panel contains.",
      },
      {
        ko: "선택 표시는 인디케이터의 이동으로만 나타나므로 동작 줄이기를 켜면 이동이 사라지고 색과 글자색 변화만 남습니다.",
        en: "The selection shows through the indicator's travel alone, so reduced motion removes the travel and leaves only the color changes.",
      },
    ],
    keyboard: [
      {
        keys: ["Tab"],
        action: {
          ko: "탭 목록으로 포커스를 옮깁니다. 목록 안에서는 선택된 탭 하나만 탭 순서에 들어갑니다.",
          en: "Moves focus into the tab list, where only the selected tab is in the tab order.",
        },
      },
      {
        keys: ["ArrowRight", "ArrowLeft"],
        action: {
          ko: "다음이나 이전 탭으로 포커스를 옮깁니다. 선택은 바뀌지 않고, 끝에서 다음 탭으로 넘어가면 처음으로 돌아옵니다.",
          en: "Moves focus to the next or previous tab without changing the selection, wrapping around at the end.",
        },
      },
      {
        keys: ["Home", "End"],
        action: { ko: "첫 탭이나 마지막 탭으로 포커스를 옮깁니다.", en: "Moves focus to the first or the last tab." },
      },
      {
        keys: ["Enter", "Space"],
        action: {
          ko: "포커스한 탭을 선택하고 그 패널을 엽니다.",
          en: "Selects the focused tab and opens its panel.",
        },
      },
    ],
  },
};
