/**
 * Reference doc for `WorkspaceMenu`, written against
 * `packages/react/src/components/workspace-menu.tsx` and
 * `packages/flutter/lib/src/components/workspace_menu.dart`.
 */
import type { ComponentDoc } from "@/lib/component-docs";

export const doc: ComponentDoc = {
  slug: "workspace-menu",
  anatomy: {
    description: {
      ko: "WorkspaceMenu는 워크스페이스를 고르는 솔리드 메뉴입니다. 트리거 아래로 열리고, 현재 워크스페이스에 체크가 붙고, 아래에 새 워크스페이스와 설정 행이 이어집니다.",
      en: "A WorkspaceMenu is a solid menu for picking a workspace. It opens below the trigger, marks the current workspace with a check, and ends with rows for a new workspace and its settings.",
    },
    parts: [
      {
        name: "WorkspaceMenu",
        slot: "WorkspaceMenu",
        description: {
          ko: "Menu를 솔리드 표면으로 감싼 컴포넌트입니다. 트리거와 팝업을 함께 그립니다.",
          en: "The component that wraps Menu in a solid surface and renders the trigger with the popup.",
        },
      },
      {
        name: "Trigger",
        slot: "trigger",
        description: {
          ko: "메뉴를 여는 요소입니다. 보통 지금 워크스페이스 이름을 보여 주는 사이드바 버튼을 넘깁니다.",
          en: "The element that opens the menu, usually the sidebar button showing the current workspace name.",
        },
      },
      {
        name: "Label",
        slot: "label",
        description: {
          ko: "목록 위의 caption 제목입니다. 기본값은 Workspaces입니다.",
          en: "The caption heading above the list. It defaults to Workspaces.",
        },
      },
      {
        name: "Workspace row",
        slot: "MenuItem",
        description: {
          ko: "28px 타일, 이름, 인원 설명과 오른쪽 체크로 이루어진 행입니다. 지금 워크스페이스는 브랜드 바탕으로도 칠해집니다.",
          en: "A row with a 28px tile, the name, a member count and a trailing check. The current workspace is also filled with the brand tint.",
        },
      },
      {
        name: "Action rows",
        slot: "MenuItem",
        description: {
          ko: "구분선 아래의 New workspace와 Workspace settings 행입니다. 핸들러를 주지 않아도 자리는 남습니다.",
          en: "The New workspace and Workspace settings rows below the separator. They stay in place even without a handler.",
        },
      },
    ],
  },
  properties: [
    {
      id: "value",
      title: { ko: "value", en: "value" },
      description: {
        ko: "지금 선택한 워크스페이스의 id입니다. 이 값과 같은 행에 체크가 붙고 브랜드 바탕이 칠해집니다.",
        en: "The id of the current workspace. The row with this id gets the check and the brand fill.",
      },
      example: "basic",
    },
    {
      id: "onCreate",
      title: { ko: "onCreate", en: "onCreate" },
      description: {
        ko: "New workspace 행을 눌렀을 때 호출됩니다. 값을 주지 않아도 행은 보이므로, 메뉴를 실제로 제공할 때는 핸들러를 함께 넘깁니다.",
        en: "Called when the New workspace row is pressed. The row stays visible without it, so pass a handler whenever the menu is real.",
      },
      example: "with-actions",
    },
    {
      id: "onSettings",
      title: { ko: "onSettings", en: "onSettings" },
      description: {
        ko: "Workspace settings 행을 눌렀을 때 호출됩니다. onCreate와 마찬가지로 값이 없어도 행은 남습니다.",
        en: "Called when the Workspace settings row is pressed. As with onCreate, the row remains without it.",
      },
      example: "with-actions",
    },
    {
      id: "label",
      title: { ko: "label", en: "label" },
      description: {
        ko: "목록 위의 제목입니다. 기본값은 Workspaces이고, 메뉴의 목적이 다르면 Switch workspace처럼 바꿔 적습니다.",
        en: "The heading above the list. It defaults to Workspaces; change it to something like Switch workspace when the menu serves another purpose.",
      },
      example: "with-actions",
    },
  ],
  guidelines: [
    {
      id: "trigger-shows-current",
      title: { ko: "트리거에 현재 이름을", en: "Show the current name in the trigger" },
      body: {
        ko: "트리거는 지금 워크스페이스의 이름을 보여 주는 자리입니다. 이름이 없으면 메뉴를 열기 전에 어디에 있는지 알 수 없습니다.",
        en: "The trigger shows the current workspace name. Without it, nothing says where the user is until the menu opens.",
      },
      do: {
        ko: "버튼 문구를 지금 워크스페이스 이름으로 두고, 고르면 그 이름으로 바뀌게 합니다.",
        en: "Label the button with the current workspace name and swap it when another is picked.",
      },
      dont: {
        ko: "아이콘만 있는 트리거에 이름을 붙이지 않는 경우를 만들지 않습니다.",
        en: "Do not leave an icon-only trigger without a name.",
      },
      example: "basic",
    },
    {
      id: "meta-for-difference",
      title: { ko: "설명은 구분에 필요한 만큼만", en: "Meta only as far as it distinguishes" },
      body: {
        ko: "행의 설명은 인원수처럼 워크스페이스를 가르는 값에 씁니다. 설명이 붙으면 행이 36px에서 48px로 높아지므로 이름만으로 구분되면 생략합니다.",
        en: "Use the row description for what separates the workspaces, such as member count. A description grows the row from 36px to 48px, so skip it when names are enough.",
      },
      example: "basic",
    },
    {
      id: "wire-both-actions",
      title: { ko: "두 동작 행을 실제로 연결합니다", en: "Wire both action rows" },
      body: {
        ko: "핸들러가 없어도 두 행은 그대로 보입니다. 메뉴를 화면에 넣을 때 onCreate와 onSettings를 함께 넘겨 눌러도 아무 일이 없는 행을 남기지 않습니다.",
        en: "Both rows appear without handlers. When the menu ships, pass onCreate and onSettings so no row presses into nothing.",
      },
      example: "with-actions",
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
        { state: "all", slot: "Popup", property: "surface", value: "solid" },
        { state: "all", slot: "Popup", property: "background", value: "bg-glass-fill-solid" },
        { state: "all", slot: "Popup", property: "radius", value: "rounded-xl" },
        { state: "all", slot: "Popup", property: "shadow", value: "shadow-popover" },
        { state: "all", slot: "Popup", property: "width", value: "w-64" },
        { state: "all", slot: "Popup", property: "padding", value: "p-1.5" },
        { state: "all", slot: "Popup", property: "gap", value: "gap-0.5" },
        { state: "all", slot: "Popup", property: "placement", value: "side=bottom align=start" },
        { state: "all", slot: "Popup", property: "offset", value: "7px" },
        { state: "all", slot: "MenuLabel", property: "padding", value: "px-2.5 pt-2 pb-1" },
        { state: "all", slot: "MenuLabel", property: "font", value: "text-caption" },
        { state: "all", slot: "MenuLabel", property: "text color", value: "text-text-secondary" },
      ],
    },
    {
      id: "rows",
      title: { ko: "행", en: "Rows" },
      rows: [
        { state: "default", slot: "Item", property: "height", value: "h-9" },
        { state: "with meta", slot: "Item", property: "height", value: "h-12" },
        { state: "default", slot: "Item", property: "padding", value: "px-2.5" },
        { state: "default", slot: "Item", property: "radius", value: "rounded-md" },
        { state: "selected", slot: "Item", property: "background", value: "bg-bg-brand" },
        { state: "hover", slot: "Item", property: "background", value: "bg-overlay-ink-6" },
        { state: "all", slot: "Tile", property: "size", value: "size-7" },
        { state: "all", slot: "Tile", property: "radius", value: "rounded-sm" },
        { state: "all", slot: "Tile", property: "background", value: "bg-interactive-primary" },
        { state: "all", slot: "Tile", property: "text color", value: "text-text-inverse" },
        { state: "all", slot: "Name", property: "font", value: "text-label-md" },
        { state: "all", slot: "Meta", property: "font", value: "text-caption" },
        { state: "all", slot: "Meta", property: "text color", value: "text-text-secondary" },
        { state: "current", slot: "Check", property: "opacity", value: "opacity-100" },
        { state: "other", slot: "Check", property: "opacity", value: "opacity-0" },
        { state: "all", slot: "Check", property: "motion", value: "transition-opacity duration-150" },
        { state: "all", slot: "Separator", property: "padding", value: "px-2.5 py-1" },
        { state: "all", slot: "Separator line", property: "border", value: "h-px bg-overlay-ink-8" },
      ],
    },
  ],
  examples: [
    {
      id: "basic",
      title: { ko: "기본 전환기", en: "Basic switcher" },
      description: {
        ko: "세 워크스페이스를 나열하고 고른 값을 트리거 이름으로 되돌려 보여 줍니다.",
        en: "Three workspaces, with the picked value shown back in the trigger.",
      },
    },
    {
      id: "with-actions",
      title: { ko: "동작 행 포함", en: "With action rows" },
      description: {
        ko: "onCreate와 onSettings를 넘기고 제목을 Switch workspace로 바꾼 형태입니다.",
        en: "onCreate and onSettings passed, with the heading changed to Switch workspace.",
      },
    },
    {
      id: "glass-trigger",
      title: { ko: "유리 크롬의 트리거", en: "Trigger in glass chrome" },
      description: {
        ko: "유리 도구 모음 위에서 아이콘 버튼을 트리거로 씁니다. 팝업은 읽히도록 솔리드를 유지합니다.",
        en: "An icon button as the trigger in glass chrome. The popup stays solid so it reads.",
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
        ko: "트리거는 MenuTrigger를 거치므로 aria-haspopup과 펼침 상태를 받습니다. 아이콘만 있는 트리거는 IconButton의 label로 이름을 얻습니다.",
        en: "The trigger goes through MenuTrigger, so it receives aria-haspopup and the expanded state. An icon-only trigger takes its name from IconButton's label.",
      },
      {
        ko: "현재 워크스페이스는 브랜드 바탕과 체크로 표시됩니다. 이 표시는 시각적이므로, 트리거 문구에 지금 이름을 적어 화면을 보지 않아도 현재 값을 알 수 있게 합니다.",
        en: "The current workspace is marked by the brand fill and a check. That mark is visual, so put the name in the trigger text to make the current value audible.",
      },
      {
        ko: "이름이 같거나 비슷한 워크스페이스가 있으면 meta에 인원수를 적어 행마다 다른 이름이 되게 합니다. 스크린 리더는 이름과 meta를 함께 읽습니다.",
        en: "When two workspaces share or echo a name, add the member count in meta so each row is distinct; screen readers read the name with the meta.",
      },
    ],
    keyboard: [
      {
        keys: ["Enter", "Space"],
        action: { ko: "트리거에서 메뉴를 열고, 행에서 그 워크스페이스를 고릅니다.", en: "Opens the menu from the trigger and picks a workspace from a row." },
      },
      {
        keys: ["ArrowDown"],
        action: { ko: "다음 행으로 이동합니다.", en: "Moves to the next row." },
      },
      {
        keys: ["ArrowUp"],
        action: { ko: "이전 행으로 이동합니다.", en: "Moves to the previous row." },
      },
      {
        keys: ["Escape"],
        action: { ko: "메뉴를 닫고 포커스를 트리거로 돌립니다.", en: "Closes the menu and returns focus to the trigger." },
      },
      {
        keys: ["Tab"],
        action: { ko: "메뉴를 닫고 다음 요소로 이동합니다.", en: "Closes the menu and moves on." },
      },
    ],
  },
};
