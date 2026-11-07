/**
 * Reference doc for `Menu`, written against
 * `packages/react/src/components/menu.tsx` and
 * `packages/flutter/lib/src/components/menu.dart`.
 */
import type { ComponentDoc } from "@/lib/component-docs";

export const doc: ComponentDoc = {
  slug: "menu",
  anatomy: {
    description: {
      ko: "Menu는 동작 목록을 여는 팝업입니다. 트리거, 팝업, 항목, 구분선과 제목이 한 조합을 이루고, 팝업은 포털에 마운트되어 페이지 위에 그려집니다.",
      en: "A Menu is a popup that lists actions. A trigger, popup, items, separators and headings form one set, and the popup is portalled above the page.",
    },
    parts: [
      {
        name: "Menu",
        slot: "Menu",
        description: {
          ko: "열림 상태를 소유하는 루트입니다. open, defaultOpen, onOpenChange, modal을 받습니다.",
          en: "The root that owns the open state. It accepts open, defaultOpen, onOpenChange and modal.",
        },
      },
      {
        name: "MenuTrigger",
        slot: "MenuTrigger",
        description: {
          ko: "메뉴를 여는 요소입니다. aria-haspopup과 펼침 상태를 스스로 붙이고, render로 기존 버튼을 트리거로 씁니다.",
          en: "The element that opens the menu. It adds aria-haspopup and the expanded state itself, and render turns an existing button into the trigger.",
        },
      },
      {
        name: "MenuContent",
        slot: "MenuContent",
        description: {
          ko: "포털에 마운트되는 팝업입니다. surface에 따라 반지름, 바탕, 그림자와 폭이 달라집니다.",
          en: "The portalled popup. Its radius, fill, shadow and width follow surface.",
        },
      },
      {
        name: "MenuLabel",
        slot: "MenuLabel",
        description: {
          ko: "항목 묶음 위의 caption 제목입니다. 계정 이메일이나 Workspaces처럼 묶음의 이름을 붙입니다.",
          en: "A caption heading above a group of items, naming it such as an account email or Workspaces.",
        },
      },
      {
        name: "MenuItem",
        slot: "MenuItem",
        description: {
          ko: "아이콘, 라벨, 설명, 오른쪽 힌트를 담는 한 줄입니다. 누르면 메뉴가 닫힙니다.",
          en: "One row holding an icon, a label, an optional description and a trailing hint. Pressing it closes the menu.",
        },
      },
      {
        name: "MenuSeparator",
        slot: "MenuSeparator",
        description: {
          ko: "항목 묶음 사이의 1px 선입니다. 키보드 탐색에서 빠지고 폭은 surface마다 다릅니다.",
          en: "A 1px rule between groups. It is skipped by keyboard navigation and its inset follows the surface.",
        },
      },
      {
        name: "MenuTile",
        slot: "MenuTile",
        description: {
          ko: "워크스페이스 첫 글자를 담는 28px 타일입니다. MenuItem의 icon으로 넘깁니다.",
          en: "A 28px tile holding a workspace initial, passed as a MenuItem icon.",
        },
      },
    ],
  },
  properties: [
    {
      id: "surface",
      title: { ko: "surface", en: "surface" },
      description: {
        ko: "팝업의 재질입니다. 반지름, 바탕, 그림자, 폭과 항목 높이가 함께 바뀝니다.",
        en: "The popup material. Radius, fill, shadow, width and row height all change with it.",
      },
      values: [
        {
          name: "solid",
          description: {
            ko: "불투명한 유리 바탕에 18px 반지름과 popover 그림자를 쓰고 폭은 256px입니다. 유리 크롬 위에 열리는 계정 메뉴에 맞습니다.",
            en: "An opaque glass fill with an 18px radius, the popover shadow and a 256px width, for account menus opened over glass chrome.",
          },
        },
        {
          name: "glass",
          description: {
            ko: "veil 유리에 20px 반지름을 쓰고 폭은 220px, 행 높이는 40px입니다. Figma의 기본 메뉴입니다.",
            en: "The veil glass with a 20px radius, 220px wide and 40px rows. The Figma default menu.",
          },
        },
        {
          name: "paper",
          description: {
            ko: "기본 바탕에 1px 테두리, 14px 반지름, 0 12 32 그림자를 쓰고 폭은 304px입니다. Paper의 워크스페이스 전환기에 맞습니다.",
            en: "The default fill with a 1px border, a 14px radius and a 0 12 32 shadow, 304px wide, for Paper's workspace switcher.",
          },
        },
      ],
      example: "paper-menu",
    },
    {
      id: "side",
      title: { ko: "side", en: "side" },
      description: {
        ko: "팝업이 열릴 기준 방향입니다. 공간이 모자라면 Base UI가 반대편으로 뒤집습니다.",
        en: "The side the popup opens on. Base UI flips it to the other side when there is no room.",
      },
      values: [
        { name: "top", description: { ko: "트리거 위쪽에 엽니다.", en: "Opens above the trigger." } },
        { name: "bottom", description: { ko: "트리거 아래쪽에 엽니다.", en: "Opens below the trigger." } },
        { name: "left", description: { ko: "트리거 왼쪽에 엽니다.", en: "Opens to the left of the trigger." } },
        { name: "right", description: { ko: "트리거 오른쪽에 엽니다.", en: "Opens to the right of the trigger." } },
      ],
      example: "solid-menu",
    },
    {
      id: "align",
      title: { ko: "align", en: "align" },
      description: {
        ko: "트리거와의 정렬 기준입니다. 기본값은 start이고, 오른쪽 끝 아이콘 버튼에서는 end를 써서 팝업이 화면 안쪽으로 붙게 합니다.",
        en: "Alignment against the trigger. The default is start; use end on a trigger at the right edge so the popup grows inward.",
      },
      values: [
        { name: "start", description: { ko: "트리거의 시작 모서리에 맞춥니다.", en: "Aligns to the trigger's start edge." } },
        { name: "center", description: { ko: "트리거의 가운데에 맞춥니다.", en: "Aligns to the trigger's centre." } },
        { name: "end", description: { ko: "트리거의 끝 모서리에 맞춥니다.", en: "Aligns to the trigger's end edge." } },
      ],
      example: "icon-trigger",
    },
    {
      id: "danger",
      title: { ko: "danger", en: "danger" },
      description: {
        ko: "MenuItem의 라벨과 아이콘을 text-text-danger로 칠합니다. 삭제처럼 되돌리기 어려운 명령에만 씁니다.",
        en: "Paints a MenuItem's label and icon with text-text-danger. Use it only for commands that are hard to undo, such as delete.",
      },
      example: "solid-menu",
    },
    {
      id: "selected",
      title: { ko: "selected", en: "selected" },
      description: {
        ko: "MenuItem을 bg-bg-brand에 칠해 지금 고른 값을 표시합니다. 강조 상태에서도 같은 바탕을 유지합니다.",
        en: "Fills a MenuItem with bg-bg-brand to mark the current choice, keeping that fill even while highlighted.",
      },
      example: "paper-menu",
    },
  ],
  guidelines: [
    {
      id: "surface-follows-chrome",
      title: { ko: "surface는 뒤 면을 따릅니다", en: "Surface follows the backdrop" },
      body: {
        ko: "solid는 유리 크롬 위에 열리는 계정 메뉴처럼 불투명한 바탕이 필요한 자리에, glass는 이미지나 배경 위에, paper는 페이지 본문 위의 워크스페이스 전환기에 씁니다.",
        en: "Use solid where an opaque fill is needed, such as an account menu over glass chrome; glass over imagery and backgrounds; paper for a workspace switcher on the page itself.",
      },
      do: {
        ko: "배경 이미지 위 도구 모음의 메뉴는 glass로 엽니다.",
        en: "Open a menu in a toolbar over a background image as glass.",
      },
      dont: {
        ko: "흰 본문 카드 위에서 glass 메뉴를 쓰지 않습니다.",
        en: "Do not use a glass menu on a white content card.",
      },
      example: "glass-menu",
    },
    {
      id: "danger-last",
      title: { ko: "위험한 명령은 마지막에", en: "Destructive commands go last" },
      body: {
        ko: "되돌리기 어려운 명령은 목록의 마지막에 구분선 뒤로 두고 danger로 칠합니다. 손이 먼저 닿는 자리에 두면 잘못 누르기 쉽습니다.",
        en: "Put a hard-to-undo command at the end of the list behind a separator and paint it danger. Near the top it is too easy to hit by mistake.",
      },
      do: {
        ko: "복사, 재생성, 첨부 다음에 구분선을 두고 삭제를 놓습니다.",
        en: "Place Copy, Regenerate and Attach first, then a separator, then Delete.",
      },
      dont: {
        ko: "삭제를 첫 항목으로 두지 않습니다.",
        en: "Do not put Delete first.",
      },
      example: "solid-menu",
    },
    {
      id: "one-line-labels",
      title: { ko: "라벨은 한 줄로", en: "Keep labels to one line" },
      body: {
        ko: "항목 라벨은 한 줄에서 잘립니다. 조건이 필요한 항목은 description에 짧게 적고, 그만큼 행이 36px에서 48px로 높아집니다.",
        en: "An item label truncates on one line. Qualify it in description instead, which grows the row from 36px to 48px.",
      },
      example: "paper-menu",
    },
    {
      id: "label-the-trigger",
      title: { ko: "아이콘 트리거에는 이름을", en: "Name an icon trigger" },
      body: {
        ko: "아이콘만 있는 트리거는 IconButton의 label로 접근 가능한 이름을 받습니다. 그 이름이 메뉴 버튼의 이름이 되므로 동작을 그대로 적습니다.",
        en: "An icon-only trigger gets its accessible name from IconButton's label, and that name becomes the menu button's name, so write the action.",
      },
      example: "icon-trigger",
    },
  ],
  specification: [
    {
      id: "popup",
      title: { ko: "팝업", en: "Popup" },
      note: {
        ko: "값은 소스 클래스에 쓰인 그대로입니다.",
        en: "Values are written as they appear in the source classes.",
      },
      rows: [
        { state: "all", slot: "Popup", property: "layout", value: "flex flex-col" },
        { state: "all", slot: "Popup", property: "gap", value: "gap-0.5" },
        { state: "all", slot: "Popup", property: "padding", value: "p-1.5" },
        { state: "all", slot: "Popup", property: "overflow", value: "overflow-clip" },
        { state: "all", slot: "Popup", property: "max width", value: "max-w-[calc(100vw-2rem)]" },
        { state: "all", slot: "Popup", property: "motion", value: "motion-popup" },
        { state: "glass", slot: "Popup", property: "background", value: "veil-overlay" },
        { state: "glass", slot: "Popup", property: "radius", value: "rounded-xl" },
        { state: "glass", slot: "Popup", property: "width", value: "w-55" },
        { state: "solid", slot: "Popup", property: "background", value: "bg-glass-fill-solid" },
        { state: "solid", slot: "Popup", property: "radius", value: "rounded-[18px]" },
        { state: "solid", slot: "Popup", property: "shadow", value: "shadow-popover" },
        { state: "solid", slot: "Popup", property: "width", value: "w-64" },
        { state: "paper", slot: "Popup", property: "background", value: "bg-bg-default" },
        { state: "paper", slot: "Popup", property: "border", value: "border border-border-default" },
        { state: "paper", slot: "Popup", property: "radius", value: "rounded-[14px]" },
        { state: "paper", slot: "Popup", property: "shadow", value: "shadow-[0_12px_32px_#0A142424]" },
        { state: "paper", slot: "Popup", property: "width", value: "w-76" },
      ],
    },
    {
      id: "items",
      title: { ko: "항목", en: "Items" },
      rows: [
        { state: "all", slot: "Item", property: "layout", value: "flex items-center" },
        { state: "all", slot: "Item", property: "gap", value: "gap-2.5" },
        { state: "all", slot: "Item", property: "motion", value: "motion-colors" },
        { state: "glass", slot: "Item", property: "height", value: "h-10" },
        { state: "glass", slot: "Item", property: "padding", value: "px-3" },
        { state: "glass", slot: "Item", property: "radius", value: "rounded-md" },
        { state: "solid · paper", slot: "Item", property: "height", value: "h-9" },
        { state: "solid · paper", slot: "Item", property: "padding", value: "px-2.5" },
        { state: "solid · paper", slot: "Item", property: "radius", value: "rounded-[10px]" },
        { state: "with description", slot: "Item", property: "height", value: "h-12" },
        { state: "hover", slot: "Item", property: "background", value: "bg-overlay-ink-6" },
        { state: "selected", slot: "Item", property: "background", value: "bg-bg-brand" },
        { state: "disabled", slot: "Item", property: "opacity", value: "40%" },
        { state: "all", slot: "Icon", property: "size", value: "size-4.5" },
        { state: "glass", slot: "Icon", property: "text color", value: "text-text-secondary" },
        { state: "solid · paper", slot: "Icon", property: "text color", value: "text-text-primary" },
        { state: "danger", slot: "Label", property: "text color", value: "text-text-danger" },
        { state: "default", slot: "Label", property: "text color", value: "text-text-primary" },
        { state: "all", slot: "Label", property: "font", value: "text-label-md" },
        { state: "all", slot: "Description", property: "font", value: "text-caption" },
        { state: "all", slot: "Description", property: "text color", value: "text-text-secondary" },
        { state: "all", slot: "Trailing", property: "font", value: "text-caption" },
        { state: "all", slot: "Trailing icon", property: "size", value: "size-4" },
      ],
    },
    {
      id: "sections",
      title: { ko: "제목과 구분선", en: "Headings and separators" },
      rows: [
        { state: "all", slot: "MenuLabel", property: "padding", value: "px-2.5 pt-2 pb-1" },
        { state: "all", slot: "MenuLabel", property: "font", value: "text-caption" },
        { state: "all", slot: "MenuLabel", property: "text color", value: "text-text-secondary" },
        { state: "all", slot: "MenuSeparator", property: "padding", value: "py-1" },
        { state: "glass", slot: "MenuSeparator", property: "padding-x", value: "px-1.5" },
        { state: "solid · paper", slot: "MenuSeparator", property: "padding-x", value: "px-2.5" },
        { state: "all", slot: "MenuSeparator line", property: "border", value: "h-px bg-overlay-ink-8" },
        { state: "all", slot: "MenuTile", property: "size", value: "size-7" },
        { state: "all", slot: "MenuTile", property: "radius", value: "rounded-sm" },
        { state: "all", slot: "MenuTile", property: "background", value: "bg-interactive-primary" },
        { state: "all", slot: "MenuTile", property: "text color", value: "text-text-inverse" },
        { state: "all", slot: "MenuTile", property: "font", value: "text-label-sm" },
      ],
    },
  ],
  examples: [
    {
      id: "solid-menu",
      title: { ko: "솔리드 메뉴", en: "Solid menu" },
      description: {
        ko: "메시지 동작 네 개를 담은 기본 메뉴입니다. 삭제는 구분선 뒤에 danger로 놓았습니다.",
        en: "The default menu with four message actions. Delete sits behind a separator in danger.",
      },
    },
    {
      id: "glass-menu",
      title: { ko: "유리 메뉴", en: "Glass menu" },
      description: {
        ko: "이미지 위에서 계정 메뉴를 glass로 엽니다. 트리거도 glass 버튼입니다.",
        en: "An account menu in glass over imagery, opened from a glass trigger.",
      },
    },
    {
      id: "paper-menu",
      title: { ko: "Paper 메뉴", en: "Paper menu" },
      description: {
        ko: "paper 표면은 타일, 설명, 체크가 있는 304px 워크스페이스 목록에 맞습니다.",
        en: "The paper surface suits a 304px workspace list with tiles, descriptions and a check.",
      },
    },
    {
      id: "icon-trigger",
      title: { ko: "아이콘 트리거", en: "Icon trigger" },
      description: {
        ko: "더보기 아이콘 버튼을 트리거로 쓰고 팝업을 끝 모서리에 맞췄습니다.",
        en: "A more-actions icon button as the trigger, with the popup aligned to the end edge.",
      },
    },
  ],
  accessibility: {
    pattern: {
      label: "WAI-ARIA Menu and Menubar Pattern",
      href: "https://www.w3.org/WAI/ARIA/apg/patterns/menubar/",
    },
    notes: [
      {
        ko: "트리거에는 aria-haspopup과 펼침 상태가 자동으로 붙습니다. 트리거의 문구는 여는 목록을 그대로 가리켜야 합니다.",
        en: "The trigger receives aria-haspopup and its expanded state automatically. Its text should name the list it opens.",
      },
      {
        ko: "danger 항목도 이름은 그대로 읽힙니다. 색만으로 위험을 알리지 않도록 라벨에 동작을 분명히 적습니다.",
        en: "A danger item keeps its full name in the accessibility tree. Make the label say the action, so colour is not the only warning.",
      },
      {
        ko: "메뉴를 닫으면 포커스가 트리거로 돌아갑니다. 항목을 고른 뒤 다른 곳으로 포커스를 옮겨야 하는 흐름이라면 호출자가 직접 처리합니다.",
        en: "Closing the menu returns focus to the trigger. If focus has to move elsewhere after a choice, the caller moves it.",
      },
      {
        ko: "아이콘만 있는 트리거는 IconButton의 label이 접근 가능한 이름이 됩니다. 이름 없는 더보기 버튼은 목록의 내용을 알려 주지 못합니다.",
        en: "For an icon-only trigger, IconButton's label is the accessible name. An unnamed more button tells nobody what it opens.",
      },
    ],
    keyboard: [
      {
        keys: ["Enter", "Space"],
        action: { ko: "트리거에서 메뉴를 열고, 항목에서 그 명령을 실행합니다.", en: "Opens the menu from the trigger and runs a command from an item." },
      },
      {
        keys: ["ArrowDown"],
        action: { ko: "다음 항목으로 이동합니다. 트리거에서는 첫 항목으로 열립니다.", en: "Moves to the next item; on the trigger it opens at the first item." },
      },
      {
        keys: ["ArrowUp"],
        action: { ko: "이전 항목으로 이동합니다. 트리거에서는 마지막 항목으로 열립니다.", en: "Moves to the previous item; on the trigger it opens at the last item." },
      },
      {
        keys: ["Home"],
        action: { ko: "첫 항목으로 이동합니다.", en: "Moves to the first item." },
      },
      {
        keys: ["End"],
        action: { ko: "마지막 항목으로 이동합니다.", en: "Moves to the last item." },
      },
      {
        keys: ["Escape"],
        action: { ko: "메뉴를 닫고 포커스를 트리거로 돌립니다.", en: "Closes the menu and returns focus to the trigger." },
      },
      {
        keys: ["Tab"],
        action: { ko: "메뉴를 닫고 다음 포커스 가능한 요소로 이동합니다.", en: "Closes the menu and moves to the next focusable element." },
      },
    ],
  },
};
