/**
 * Reference doc for `SettingsList` and its rows, written against
 * `packages/react/src/components/settings-list.tsx` and
 * `packages/flutter/lib/src/components/settings_list.dart`.
 */
import type { ComponentDoc } from "@/lib/component-docs";

export const doc: ComponentDoc = {
  slug: "settings-list",
  anatomy: {
    description: {
      ko: "SettingsList는 설정 항목을 구분선으로 나눠 담는 카드입니다. 행마다 제목과 설명이 왼쪽에, 스위치나 단축키 같은 컨트롤이 오른쪽에 놓입니다.",
      en: "SettingsList is a card that separates settings into divided rows. Each row puts a title and description on the left and a switch or shortcut on the right.",
    },
    parts: [
      {
        name: "Card",
        slot: "SettingsList",
        description: {
          ko: "16px 모서리의 카드입니다. 안쪽 좌우 여백이 20px이고 모서리에서 내용을 자릅니다.",
          en: "A card with 16px corners, 20px inline padding, and content clipped at the corners.",
        },
      },
      {
        name: "LiquidGlass",
        slot: "LiquidGlass",
        description: {
          ko: "surface가 glass일 때 카드 안쪽에 깔리는 유리 레이어입니다. 행은 그 위에 놓입니다.",
          en: "A glass layer inside the card when surface is glass. The rows sit above it.",
        },
      },
      {
        name: "Row",
        slot: "SettingsRow",
        description: {
          ko: "제목과 설명, 컨트롤을 한 줄에 담습니다. 마지막 행을 뺀 모든 행이 아래에 1px 구분선을 그립니다.",
          en: "One row holding the title, description and control. Every row but the last draws a 1px bottom divider.",
        },
      },
      {
        name: "Row icon",
        slot: "SettingsRowIcon",
        description: {
          ko: "행 앞에 붙는 32px 타일입니다. 장식이라 aria-hidden이고 의미는 행 제목이 전달합니다.",
          en: "A 32px tile before the row content. It is decorative and aria-hidden; the row title carries the meaning.",
        },
      },
      {
        name: "Switch",
        slot: "SettingsSwitch",
        description: {
          ko: "행의 컨트롤 자리에 맞춘 스위치입니다. 크기는 md이고 트랙은 44x26입니다.",
          en: "A Switch pre-wired for the control slot: md size with a 44x26 track.",
        },
      },
      {
        name: "Keycaps",
        slot: "SettingsKey",
        description: {
          ko: "단축키를 보여 주는 키캡입니다. kbd 요소로 렌더링되어 낭독기가 키보드 입력으로 읽습니다.",
          en: "A keycap for a shortcut. It renders a kbd element, so it is read as keyboard input.",
        },
      },
    ],
  },
  properties: [
    {
      id: "surface",
      title: { ko: "surface", en: "surface" },
      description: {
        ko: "카드의 바탕 재질입니다. solid는 불투명한 표면에 기본 테두리를 쓰고, glass는 두꺼운 유리로 그립니다.",
        en: "The card's material. Solid is an opaque surface with a default border; glass draws the thick glass.",
      },
      values: [
        {
          name: "solid",
          description: {
            ko: "설정 화면의 본문처럼 불투명한 면에 놓을 때 씁니다. 기본값입니다.",
            en: "For an opaque page such as a settings screen. The default.",
          },
        },
        {
          name: "glass",
          description: {
            ko: "이미지나 유리 패널 위에 떠 있는 설정 카드에 씁니다.",
            en: "For a settings card floating over imagery or a glass panel.",
          },
        },
      ],
      example: "glass",
    },
    {
      id: "title",
      title: { ko: "title", en: "title" },
      description: {
        ko: "행의 첫 줄입니다. label-md 크기의 주요 텍스트로 그려지고 길면 다음 줄로 접힙니다.",
        en: "The row's first line, drawn in primary text at label-md. Long titles wrap to the next line.",
      },
      example: "switches",
    },
    {
      id: "description",
      title: { ko: "description", en: "description" },
      description: {
        ko: "제목 아래 보조 줄입니다. body-sm 보조 색으로 그려지며 제목이 말하지 못한 조건을 한 줄로 보탭니다.",
        en: "The secondary line under the title, drawn in body-sm secondary color. It adds the condition the title cannot carry.",
      },
      example: "switches",
    },
    {
      id: "leading",
      title: { ko: "leading", en: "leading" },
      description: {
        ko: "제목 앞에 붙는 슬롯입니다. 보통 SettingsRowIcon을 넣고, 넣으면 행 간격이 12px, 위아래 여백이 13px로 조여집니다.",
        en: "The slot before the title, usually a SettingsRowIcon. Adding it tightens the gap to 12px and the block padding to 13px.",
      },
      example: "leading",
    },
    {
      id: "control",
      title: { ko: "control", en: "control" },
      description: {
        ko: "오른쪽 끝의 컨트롤 슬롯입니다. SettingsSwitch, SettingsKeys, 버튼 가운데 하나를 넣습니다. 넣지 않으면 행은 제목과 설명만 남습니다.",
        en: "The control slot at the right edge: a SettingsSwitch, a SettingsKeys pair or a button. Without it the row keeps only its text.",
      },
      example: "keys",
    },
  ],
  guidelines: [
    {
      id: "rows-only",
      title: { ko: "행만 넣습니다", en: "Rows only" },
      body: {
        ko: "카드 안에는 SettingsRow만 넣습니다. 행이 스스로 아래 구분선을 그리고 카드가 모서리를 자르므로, 묶어 두기만 하면 구분선 목록이 완성됩니다.",
        en: "Put only SettingsRow children in the card. Each row draws its own divider and the card clips the corners, so grouping them is all the divided list needs.",
      },
      do: {
        ko: "SettingsRow 다섯 개를 그대로 쌓습니다.",
        en: "Stack five SettingsRow children as they are.",
      },
      dont: {
        ko: "행 사이에 임의의 div나 제목을 끼우지 않습니다.",
        en: "Do not insert stray divs or headings between rows.",
      },
      example: "switches",
    },
    {
      id: "switch-label",
      title: { ko: "스위치에 이름을 줍니다", en: "Name every switch" },
      body: {
        ko: "행 제목과 스위치는 형제라서 제목이 스위치의 이름이 되지 않습니다. SettingsSwitch에는 aria-label을 붙여 무엇을 켜고 끄는지 알립니다.",
        en: "The row title is a sibling of the switch, so it does not become the switch's name. Give SettingsSwitch an aria-label saying what it controls.",
      },
      do: {
        ko: "aria-label=\"Keep working\"을 붙입니다.",
        en: "Pass aria-label=\"Keep working\".",
      },
      dont: {
        ko: "이름 없이 스위치만 두지 않습니다.",
        en: "Do not leave a bare switch with no name.",
      },
      example: "switches",
    },
    {
      id: "keys-not-kbd",
      title: { ko: "행의 단축키는 SettingsKey", en: "SettingsKey inside a row" },
      body: {
        ko: "설정 행의 단축키에는 Kbd 대신 SettingsKey를 씁니다. 행의 높이와 간격에 맞춘 키캡이고, 키 두 개를 붙일 때는 SettingsKeys로 4px 간격을 맞춥니다.",
        en: "Use SettingsKey rather than Kbd for a shortcut inside a settings row: it is sized for the row, and SettingsKeys holds two keys 4px apart.",
      },
      example: "keys",
    },
    {
      id: "glass-for-floating",
      title: { ko: "glass는 떠 있는 설정에만", en: "Glass for floating settings" },
      body: {
        ko: "glass는 이미지나 유리 패널 위에 뜬 설정 카드에만 씁니다. 불투명한 설정 화면 안에서는 유리 바탕이 보이지 않아 solid와 같아집니다.",
        en: "Use glass only for a settings card floating over imagery or a glass panel. On an opaque settings screen the fill disappears and it reads as solid.",
      },
      example: "glass",
    },
  ],
  specification: [
    {
      id: "card",
      title: { ko: "카드", en: "Card" },
      rows: [
        { state: "solid", slot: "Card", property: "radius", value: "16px" },
        { state: "solid", slot: "Card", property: "padding", value: "0 20px" },
        { state: "solid", slot: "Card", property: "background", value: "bg-bg-surface" },
        { state: "solid", slot: "Card", property: "border", value: "1px border-border-default" },
        { state: "glass", slot: "Card", property: "background", value: "bg-glass-thick" },
        { state: "glass", slot: "Card", property: "background layer", value: "LiquidGlass" },
        { state: "all", slot: "Card", property: "overflow", value: "overflow-clip" },
        {
          state: "all",
          slot: "Card",
          property: "row stacking",
          value: "[&>:not(.liquid-layers)]:relative",
        },
      ],
    },
    {
      id: "row",
      title: { ko: "행", en: "Row" },
      rows: [
        { state: "default", slot: "Row", property: "divider", value: "1px border-border-default" },
        { state: "last", slot: "Row", property: "divider", value: "none" },
        { state: "default", slot: "Row", property: "padding", value: "16px 0" },
        { state: "default", slot: "Row", property: "gap", value: "16px / 8px" },
        {
          state: "with leading",
          slot: "Row",
          property: "padding",
          value: "13px 0",
          note: {
            ko: "앞에 아이콘 타일이 있으면 위아래 여백과 가로 간격이 줄어듭니다.",
            en: "An icon tile in front pulls the block padding and the horizontal gap in.",
          },
        },
        { state: "with leading", slot: "Row", property: "gap", value: "12px / 8px" },
        { state: "default", slot: "Title", property: "font", value: "text-label-md" },
        { state: "default", slot: "Title", property: "text color", value: "text-text-primary" },
        { state: "default", slot: "Description", property: "font", value: "text-body-sm" },
        { state: "default", slot: "Description", property: "text color", value: "text-text-secondary" },
        { state: "default", slot: "Title column", property: "gap", value: "2px" },
      ],
    },
    {
      id: "parts",
      title: { ko: "부품", en: "Parts" },
      rows: [
        { state: "icon tile", slot: "SettingsRowIcon", property: "size", value: "32px" },
        { state: "icon tile", slot: "SettingsRowIcon", property: "radius", value: "9px" },
        { state: "icon tile", slot: "SettingsRowIcon", property: "background", value: "bg-bg-subtle" },
        { state: "icon tile", slot: "SettingsRowIcon", property: "glyph size", value: "16px" },
        { state: "switch", slot: "SettingsSwitch", property: "size", value: "md" },
        { state: "switch", slot: "SettingsSwitch", property: "track", value: "44x26px" },
        { state: "keycap", slot: "SettingsKey", property: "height", value: "26px" },
        { state: "keycap", slot: "SettingsKey", property: "radius", value: "6px" },
        { state: "keycap", slot: "SettingsKey", property: "padding", value: "0 8px" },
        { state: "keycap", slot: "SettingsKey", property: "background", value: "bg-bg-subtle" },
        { state: "keycap", slot: "SettingsKey", property: "border", value: "1px border-border-default" },
        { state: "keycap", slot: "SettingsKey", property: "font", value: "text-label-sm" },
        { state: "keys", slot: "SettingsKeys", property: "gap", value: "4px" },
      ],
    },
  ],
  examples: [
    {
      id: "switches",
      title: { ko: "스위치 행", en: "Switch rows" },
      description: {
        ko: "제목과 설명, 스위치로 이루어진 기본 목록입니다. 마지막 행에는 구분선이 없습니다.",
        en: "The base list of title, description and switch. The last row has no divider.",
      },
    },
    {
      id: "keys",
      title: { ko: "단축키 행", en: "Shortcut row" },
      description: {
        ko: "컨트롤 자리에 SettingsKeys를 넣어 두 키를 4px 간격으로 보여 줍니다.",
        en: "SettingsKeys in the control slot shows two keys 4px apart.",
      },
    },
    {
      id: "leading",
      title: { ko: "아이콘 행", en: "Row with an icon" },
      description: {
        ko: "앞에 SettingsRowIcon을 붙이면 위아래 여백과 가로 간격이 조여집니다.",
        en: "A SettingsRowIcon in front tightens the block padding and the horizontal gap.",
      },
    },
    {
      id: "glass",
      title: { ko: "유리 카드", en: "Glass card" },
      description: {
        ko: "같은 행을 배경 위 두꺼운 유리 카드로 그렸습니다.",
        en: "The same rows as a thick glass card over a backdrop.",
      },
    },
  ],
  accessibility: {
    notes: [
      {
        ko: "행은 div이고 제목도 span입니다. 목록 구조가 필요하면 카드에 role=\"group\"과 aria-label을 붙여 어떤 설정 묶음인지 알립니다.",
        en: "The row is a div and the title a span. When the list needs structure, give the card role=\"group\" with an aria-label naming the settings group.",
      },
      {
        ko: "행 제목은 스위치의 이름이 되지 않습니다. SettingsSwitch마다 aria-label로 무엇을 켜는지 적습니다.",
        en: "A row title does not name its switch. Give every SettingsSwitch an aria-label saying what it turns on.",
      },
      {
        ko: "SettingsKey는 kbd로 렌더링되어 키보드 입력으로 읽히고, SettingsRowIcon은 장식이라 aria-hidden입니다.",
        en: "SettingsKey renders a kbd, so it is read as keyboard input, and SettingsRowIcon is decorative and aria-hidden.",
      },
      {
        ko: "비활성 스위치는 자리를 지킨 채 흐려지고 눌리지 않습니다. 왜 못 바꾸는지는 description이 설명합니다.",
        en: "A disabled switch stays in place, fades and stops responding. The description says why it cannot be changed.",
      },
    ],
    keyboard: [
      {
        keys: ["Tab"],
        action: { ko: "행의 컨트롤로 포커스를 옮깁니다.", en: "Moves focus to the row's control." },
      },
      {
        keys: ["Space"],
        action: { ko: "스위치를 켜거나 끕니다.", en: "Turns the switch on or off." },
      },
    ],
  },
};
