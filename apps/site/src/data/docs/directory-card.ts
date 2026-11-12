/**
 * Reference doc for `DirectoryCard`, written against
 * `packages/react/src/components/directory-card.tsx` and
 * `packages/flutter/lib/src/components/directory_card.dart`.
 */
import type { ComponentDoc } from "@/lib/component-docs";

export const doc: ComponentDoc = {
  slug: "directory-card",
  anatomy: {
    description: {
      ko: "DirectoryCard는 디렉터리 항목 하나를 소개하는 카드입니다. 40px 타일과 이름, 한 줄 설명이 왼쪽에 놓이고 오른쪽에 추가 버튼이 붙습니다.",
      en: "A DirectoryCard introduces one directory entry: a 40px tile, name and one-line description on the left, and an add button on the right.",
    },
    parts: [
      {
        name: "Card",
        slot: "div",
        description: {
          ko: "16px 모서리의 카드입니다. 안쪽 여백이 12px이고 모서리에서 내용을 자릅니다.",
          en: "The card with 16px corners, 12px padding, and content clipped at the corners.",
        },
      },
      {
        name: "LiquidGlass",
        slot: "LiquidGlass",
        description: {
          ko: "surface가 glass일 때 카드 안쪽에 깔리는 유리 레이어입니다.",
          en: "A glass layer inside the card when surface is glass.",
        },
      },
      {
        name: "Tile",
        slot: "icon",
        description: {
          ko: "아이콘을 담는 40px 타일입니다. 모서리 12px이고 안쪽 아이콘은 20px이며 하늘색 바탕에 흰 아이콘을 씁니다.",
          en: "A 40px tile holding the icon: 10px corners, a 20px icon, a sky fill and a light glyph.",
        },
      },
      {
        name: "Name",
        slot: "name",
        description: {
          ko: "항목 이름입니다. 한 줄로 자르고 넘치면 말줄임표를 붙입니다.",
          en: "The entry name. It stays on one line and ends with an ellipsis.",
        },
      },
      {
        name: "Description",
        slot: "description",
        description: {
          ko: "이름 아래 한 줄 설명입니다. 긴 문장은 한 줄에서 잘립니다.",
          en: "A one-line description under the name. Longer text is clamped.",
        },
      },
      {
        name: "Add button",
        slot: "onAdd",
        description: {
          ko: "onAdd를 넘길 때만 나타나는 더하기 아이콘 버튼입니다. 카드와 같은 재질을 씁니다.",
          en: "The plus icon button, shown only when onAdd is passed. It takes the card's material.",
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
            ko: "본문처럼 불투명한 면 위에 놓을 때 씁니다. 기본값입니다.",
            en: "For opaque pages. The default.",
          },
        },
        {
          name: "glass",
          description: {
            ko: "이미지나 유리 패널 위에 떠 있는 카드에 씁니다. 추가 버튼도 같은 유리를 써서 두 재질이 맞습니다.",
            en: "For a card floating over imagery or a glass panel. The add button takes the same glass so both materials match.",
          },
        },
      ],
      example: "glass",
    },
    {
      id: "onAdd",
      title: { ko: "onAdd", en: "onAdd" },
      description: {
        ko: "추가 버튼을 그리는 조건입니다. 넘기면 버튼이 나타나고 넘기지 않으면 카드에 버튼이 없습니다.",
        en: "What makes the add button exist: pass it and the button appears, leave it out and the card has none.",
      },
      example: "add",
    },
    {
      id: "addLabel",
      title: { ko: "addLabel", en: "addLabel" },
      description: {
        ko: "더하기 버튼의 접근 가능한 이름입니다. 버튼에 아이콘만 보이므로 이 값이 aria-label이 되고 기본값은 Add입니다.",
        en: "The add button's accessible name. The button shows only an icon, so this becomes its aria-label. The default is Add.",
      },
      example: "add",
    },
    {
      id: "description",
      title: { ko: "description", en: "description" },
      description: {
        ko: "이름 아래 한 줄입니다. 무엇을 할 수 있는 폴더인지 짧게 적고, 길면 한 줄에서 잘립니다.",
        en: "One line under the name. Say briefly what the folder offers; longer text is cut at one line.",
      },
      example: "add",
    },
  ],
  guidelines: [
    {
      id: "action-optional",
      title: { ko: "동작이 없으면 버튼도 없습니다", en: "No action, no button" },
      body: {
        ko: "추가 버튼은 onAdd가 있을 때만 그려집니다. 연결할 대상이 없는 항목에 빈 버튼을 남기지 말고 onAdd를 넘기지 않습니다.",
        en: "The add button exists only with onAdd. For an entry with nothing to connect, leave onAdd out rather than shipping a dead button.",
      },
      do: {
        ko: "연결 동작이 있는 카드에만 onAdd를 넘깁니다.",
        en: "Pass onAdd only where there is a connect action.",
      },
      dont: {
        ko: "onAdd={() => undefined}로 버튼만 얹지 않습니다.",
        en: "Do not add onAdd={() => undefined} just to show the button.",
      },
      example: "no-action",
    },
    {
      id: "name-the-plus",
      title: { ko: "더하기에 이름을 붙입니다", en: "Name the plus" },
      body: {
        ko: "버튼에는 더하기 아이콘만 보이므로 addLabel이 유일한 이름입니다. Connect folder처럼 무엇을 추가하는지 적습니다.",
        en: "The button shows only a plus, so addLabel is its only name. Write what gets added, such as Connect folder.",
      },
      do: {
        ko: "addLabel=\"Connect folder\"로 대상을 밝힙니다.",
        en: "Say the target with addLabel=\"Connect folder\".",
      },
      dont: {
        ko: "기본값 Add를 그대로 두고 무엇을 추가하는지 숨기지 않습니다.",
        en: "Do not hide the target behind the default Add.",
      },
      example: "add",
    },
    {
      id: "one-line",
      title: { ko: "설명은 한 줄", en: "One line of description" },
      body: {
        ko: "설명은 한 줄에서 잘리므로 문장을 짧게 끊습니다. 긴 소개가 필요하면 카드를 늘리지 말고 항목 화면으로 옮깁니다.",
        en: "The description is clamped at one line, so keep the sentence short. When a longer introduction is needed, move it to the entry's own screen instead of growing the card.",
      },
      example: "add",
    },
    {
      id: "vs-marketplace",
      title: { ko: "설치 카드와 구분합니다", en: "Not an install card" },
      body: {
        ko: "DirectoryCard는 폴더나 소스처럼 추가해서 쓰는 항목을 소개합니다. 평점과 설치 수를 함께 보여 주고 설치를 유도하려면 MarketplaceCard를 씁니다.",
        en: "A DirectoryCard introduces something you add and then use, such as a folder or a source. To show a rating, install count and an install action, use MarketplaceCard.",
      },
      example: "add",
    },
  ],
  specification: [
    {
      id: "card",
      title: { ko: "카드", en: "Card" },
      rows: [
        { state: "solid", slot: "Card", property: "radius", value: "rounded-2xl" },
        { state: "solid", slot: "Card", property: "padding", value: "12px" },
        { state: "solid", slot: "Card", property: "gap", value: "12px" },
        { state: "solid", slot: "Card", property: "background", value: "bg-bg-surface" },
        { state: "solid", slot: "Card", property: "border", value: "1px border-border-default" },
        { state: "glass", slot: "Card", property: "background", value: "bg-glass-thick" },
        { state: "glass", slot: "Card", property: "background layer", value: "LiquidGlass" },
        { state: "all", slot: "Card", property: "overflow", value: "overflow-clip" },
      ],
    },
    {
      id: "content",
      title: { ko: "내용", en: "Content" },
      rows: [
        { state: "all", slot: "Tile", property: "size", value: "40px" },
        { state: "all", slot: "Tile", property: "radius", value: "rounded-md" },
        { state: "all", slot: "Tile", property: "background", value: "bg-sky-500" },
        { state: "all", slot: "Tile", property: "text color", value: "text-neutral-50" },
        { state: "all", slot: "Tile", property: "icon size", value: "20px" },
        { state: "all", slot: "Name", property: "font", value: "text-label-md" },
        { state: "all", slot: "Name", property: "text color", value: "text-text-primary" },
        { state: "all", slot: "Description", property: "font", value: "text-caption" },
        { state: "all", slot: "Description", property: "text color", value: "text-text-secondary" },
        { state: "all", slot: "Description", property: "lines", value: "1" },
      ],
    },
    {
      id: "action",
      title: { ko: "추가 버튼", en: "Add button" },
      rows: [
        { state: "solid", slot: "Add button", property: "variant", value: "solid" },
        { state: "glass", slot: "Add button", property: "variant", value: "glass" },
        { state: "all", slot: "Add button", property: "size", value: "sm" },
        { state: "all", slot: "Add button", property: "icon", value: "Plus" },
        { state: "all", slot: "Add button", property: "accessible name", value: "addLabel (\"Add\")" },
      ],
    },
  ],
  examples: [
    {
      id: "add",
      title: { ko: "추가 버튼이 있는 카드", en: "Cards with an add button" },
      description: {
        ko: "onAdd와 addLabel을 준 카드 세 개입니다. 버튼의 이름이 무엇을 추가하는지 말합니다.",
        en: "Three cards with onAdd and addLabel. The button's name says what gets added.",
      },
    },
    {
      id: "no-action",
      title: { ko: "동작이 없는 카드", en: "Cards without an action" },
      description: {
        ko: "onAdd를 넘기지 않으면 카드에 버튼이 없습니다. 읽기만 하는 항목에 씁니다.",
        en: "Without onAdd there is no button. Use it for entries that are only read.",
      },
    },
    {
      id: "glass",
      title: { ko: "유리 위의 카드", en: "Glass cards" },
      description: {
        ko: "배경 위에 두꺼운 유리로 그린 카드입니다. 추가 버튼도 같은 유리를 씁니다.",
        en: "Thick glass cards over a backdrop. The add button takes the same glass.",
      },
    },
  ],
  accessibility: {
    notes: [
      {
        ko: "타일은 장식이고, 카드에는 링크나 버튼 역할이 없습니다. 카드를 누를 수 있게 만들려면 안에 실제 버튼이나 링크를 넣습니다.",
        en: "The tile is decoration and the card has no link or button role. To make the card pressable, put a real button or link inside it.",
      },
      {
        ko: "더하기 버튼은 아이콘만 보이므로 addLabel이 유일한 이름입니다. 기본값 Add보다 무엇을 추가하는지 적은 이름이 낫습니다.",
        en: "The add button shows an icon only, so addLabel is its only name. Naming the target beats the default Add.",
      },
      {
        ko: "glass에서는 글자가 흐린 배경 위에 놓입니다. 카드 안 텍스트는 토큰 색을 유지하고 배경 이미지의 밝기를 함께 확인합니다.",
        en: "On glass the text sits over a blurred backdrop. Keep card text on token colors and check the brightness of the image behind it.",
      },
    ],
    keyboard: [
      {
        keys: ["Tab"],
        action: { ko: "추가 버튼으로 포커스를 옮깁니다. onAdd가 없으면 건너뜁니다.", en: "Moves focus to the add button, skipped when there is no onAdd." },
      },
      {
        keys: ["Enter", "Space"],
        action: { ko: "추가 동작을 실행합니다.", en: "Runs the add action." },
      },
    ],
  },
};
