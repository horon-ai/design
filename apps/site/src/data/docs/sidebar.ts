/**
 * Reference doc for `Sidebar`, written against
 * `packages/react/src/components/sidebar.tsx` and
 * `packages/flutter/lib/src/components/sidebar.dart`.
 */
import type { ComponentDoc } from "@/lib/component-docs";

export const doc: ComponentDoc = {
  slug: "sidebar",
  anatomy: {
    description: {
      ko: "Sidebar는 화면 왼쪽의 세로 열입니다. 위에서부터 워크스페이스 전환, 메뉴 행, 펼쳐지는 프로젝트, 그리고 계정 카드가 놓입니다.",
      en: "The Sidebar is the vertical column on the left of a screen. Top to bottom it holds the workspace switch, menu rows, expandable projects, and the account card.",
    },
    parts: [
      {
        name: "Column",
        slot: "Sidebar",
        description: {
          ko: "부품을 담는 nav 열입니다. 너비 280px을 유지하고 좁은 부모 안에서는 그 폭에 맞춰 줄어듭니다.",
          en: "The nav column that holds the parts. It keeps its 280px width and shrinks to a narrower parent when one caps it.",
        },
      },
      {
        name: "LiquidGlass",
        slot: "LiquidGlass",
        description: {
          ko: "surface가 glass일 때 열 안쪽에 깔리는 유리 레이어입니다. photo와 plain에는 그려지지 않습니다.",
          en: "The glass layer inside the column when surface is glass. It is not drawn for photo or plain.",
        },
      },
      {
        name: "Header",
        slot: "SidebarHeader",
        description: {
          ko: "36px 한 줄에 워크스페이스 전환과 접기 버튼을 담습니다. 접기 버튼은 onCollapse를 넘길 때만 나타납니다.",
          en: "One 36px row holding the workspace switch and a collapse button, which appears only when onCollapse is passed.",
        },
      },
      {
        name: "WorkspaceSwitch",
        slot: "SidebarWorkspaceSwitch",
        description: {
          ko: "워크스페이스 이니셜 타일, 이름, 위아래 케럿을 담은 버튼입니다. 메뉴가 열려 있는 동안 배경이 강조됩니다.",
          en: "A button with the workspace initial tile, the name and an up-down caret, highlighted while its menu is open.",
        },
      },
      {
        name: "Item",
        slot: "SidebarItem",
        description: {
          ko: "32px 메뉴 행입니다. 아이콘, 라벨, 개수, 주의 점 순서로 놓이고 href가 있으면 링크로 렌더링됩니다.",
          en: "A 32px menu row laid out as icon, label, count and attention dot. With href it renders as a link.",
        },
      },
      {
        name: "ProjectTile",
        slot: "SidebarProjectTile",
        description: {
          ko: "프로젝트 행 앞에 붙는 22px 둥근 타일입니다. 채움 색은 className으로 정합니다.",
          en: "A 22px rounded tile before a project row. Its fill comes from className.",
        },
      },
      {
        name: "Group",
        slot: "SidebarGroup",
        description: {
          ko: "케럿이 달린 접이식 묶음입니다. 라벨을 누르면 안쪽 행이 높이 애니메이션으로 접히고 펼쳐집니다.",
          en: "A collapsible group with a caret. Pressing the label folds and unfolds the rows inside with a height animation.",
        },
      },
      {
        name: "Project",
        slot: "SidebarProject",
        description: {
          ko: "펼칠 수 있는 프로젝트 행입니다. 열린 상태에서는 케럿 자리에 More 버튼이 보이고 자식 행이 커넥터로 연결됩니다.",
          en: "An expandable project row. While open, a More button takes the caret's place and child rows are joined by connectors.",
        },
      },
      {
        name: "Tree",
        slot: "SidebarTree",
        description: {
          ko: "프로젝트 아래 자식 행을 잇는 1.5px 커넥터입니다. 자식 수에 맞춰 경로를 계산하므로 32px 행을 그대로 넘깁니다.",
          en: "A 1.5px connector joining a project's child rows. It computes its path from the child count, so pass the 32px rows directly.",
        },
      },
      {
        name: "AddButton",
        slot: "SidebarAddButton",
        description: {
          ko: "점선 테두리의 추가 버튼입니다. 라벨 뒤에 16px plus-circle 아이콘이 붙습니다.",
          en: "An add button with a dashed border and a 16px plus-circle after the label.",
        },
      },
      {
        name: "Spacer",
        slot: "SidebarSpacer",
        description: {
          ko: "남은 세로 공간을 채워 계정 카드를 아래로 밀어내는 빈 상자입니다.",
          en: "An empty box that fills the remaining height and pushes the account card to the bottom.",
        },
      },
      {
        name: "Account",
        slot: "SidebarAccount",
        description: {
          ko: "이니셜 타일, 이름, 이메일, 케럿을 담은 54px 행입니다. 계정 전환 메뉴를 열 때 버튼으로 씁니다.",
          en: "A 54px row with the initials tile, name, email and a caret, used as the button that opens an account menu.",
        },
      },
      {
        name: "ResizeHandle",
        slot: "separator",
        description: {
          ko: "resizable일 때 오른쪽 가장자리에 붙는 8px 손잡이입니다. md 이상에서만 보이고 키보드로도 너비를 바꿉니다.",
          en: "An 8px handle on the right edge when resizable. It shows from the md breakpoint up and also resizes from the keyboard.",
        },
      },
    ],
  },
  properties: [
    {
      id: "surface",
      title: { ko: "surface", en: "surface" },
      description: {
        ko: "열의 바탕입니다. glass는 두꺼운 유리, photo는 하늘색 그라디언트 위에 55% 흰 베일, plain은 바탕 없이 1px 오른쪽 테두리만 씁니다.",
        en: "The column's ground. Glass is the thick glass, photo puts the Horon sky gradient under a 55% white veil, and plain paints no fill and only a 1px right border.",
      },
      values: [
        {
          name: "glass",
          description: {
            ko: "두꺼운 유리 열입니다. 기본값이고, 뒤에 배경이 있는 앱 셸에 맞습니다.",
            en: "The thick glass column. The default, and what an app shell with a background behind it uses.",
          },
        },
        {
          name: "photo",
          description: {
            ko: "Paper 앱의 사이드바처럼 하늘색 그라디언트 위에 흰 베일을 얹습니다. 다크 테마에서는 두꺼운 유리로 돌아갑니다. 이름은 사진을 쓰던 시절의 것이라 사진이 아니라 그라디언트를 가리킵니다.",
            en: "Lays the Horon sky gradient under a white veil, as the Paper app sidebar does. In dark mode it falls back to the thick glass. The name is historical and now refers to a gradient rather than a photograph.",
          },
        },
        {
          name: "plain",
          description: {
            ko: "바탕을 칠하지 않아 뒤 레이아웃의 색을 그대로 쓰고, 오른쪽에 1px 테두리로 열을 나눕니다.",
            en: "Paints nothing so the column takes the color of the layout behind it, and divides itself with a 1px right border.",
          },
        },
      ],
      example: "surfaces",
    },
    {
      id: "resizable",
      title: { ko: "resizable", en: "resizable" },
      description: {
        ko: "오른쪽 가장자리를 끌어 너비를 바꿀 수 있게 합니다. md(768px) 이상에서만 손잡이가 보이고, 그 아래에서는 280px 고정입니다.",
        en: "Lets the right edge be dragged to change the width. The handle shows from md (768px) up; below that the column stays at 280px.",
      },
      example: "resizable",
    },
    {
      id: "defaultWidth",
      title: { ko: "defaultWidth", en: "defaultWidth" },
      description: {
        ko: "resizable일 때 시작 너비입니다. 손잡이를 두 번 누르면 이 값으로 돌아옵니다. minWidth 240과 maxWidth 400 사이로 맞춰집니다.",
        en: "The starting width when resizable. Double-pressing the handle returns to it. It is clamped between minWidth 240 and maxWidth 400.",
      },
      example: "resizable",
    },
    {
      id: "current",
      title: { ko: "current", en: "current" },
      description: {
        ko: "지금 보고 있는 행을 표시합니다. 6% 잉크 배경이 깔리고 aria-current가 page로 붙습니다. SidebarItem과 SidebarProject 모두 받습니다.",
        en: "Marks the row in view: a 6% ink fill and aria-current=\"page\". Both SidebarItem and SidebarProject take it.",
      },
      example: "basic",
    },
    {
      id: "attention",
      title: { ko: "attention", en: "attention" },
      description: {
        ko: "행 끝에 7px 빨간 점을 붙여 확인이 필요하다는 것을 알립니다. 점에는 Needs attention이라는 이름만 있고 role은 없습니다.",
        en: "Puts a 7px red dot at the end of the row to mark it for attention. The dot carries the name Needs attention and no role.",
      },
      example: "basic",
    },
    {
      id: "defaultOpen",
      title: { ko: "defaultOpen", en: "defaultOpen" },
      description: {
        ko: "SidebarGroup과 SidebarProject가 처음에 펼쳐져 있을지 정합니다. 묶음은 기본 true, 프로젝트는 기본 false입니다.",
        en: "Whether a SidebarGroup or SidebarProject starts expanded. Groups default to true and projects to false.",
      },
      example: "projects",
    },
    {
      id: "open",
      title: { ko: "open", en: "open" },
      description: {
        ko: "SidebarProject의 펼침을 직접 제어합니다. onOpenChange와 함께 넘기면 상태를 바깥에서 들고, 넘기지 않으면 defaultOpen으로 시작하는 비제어로 동작합니다.",
        en: "Controls a SidebarProject's expansion. Pass it with onOpenChange to own the state outside; without it the project runs uncontrolled from defaultOpen.",
      },
      example: "projects",
    },
  ],
  guidelines: [
    {
      id: "three-pieces",
      title: { ko: "세 부분으로 나눠 담기", en: "Fill three regions" },
      body: {
        ko: "열은 위의 워크스페이스와 메뉴, 가운데 프로젝트, 아래 계정으로 나뉩니다. 가운데가 길어져도 계정 카드는 SidebarSpacer로 바닥에 붙여 두어야 매번 같은 자리에서 찾을 수 있습니다.",
        en: "The column splits into the workspace and menu on top, projects in the middle, and the account at the bottom. However long the middle grows, SidebarSpacer keeps the account card on the floor so it is always in the same place.",
      },
      do: {
        ko: "SidebarSpacer를 계정 카드 바로 앞에 둡니다.",
        en: "Put SidebarSpacer right before the account card.",
      },
      dont: {
        ko: "계정 카드를 메뉴 행 사이에 끼워 넣지 않습니다.",
        en: "Do not drop the account card between menu rows.",
      },
      example: "basic",
    },
    {
      id: "one-current",
      title: { ko: "현재 위치는 하나", en: "One row is current" },
      body: {
        ko: "current는 한 번에 한 행에만 줍니다. 메뉴 행과 프로젝트 행이 동시에 current면 어느 화면에 있는지 읽히지 않습니다.",
        en: "Mark one row current at a time. Two current rows, a menu item and a project together, leave no answer to which screen is open.",
      },
      example: "basic",
    },
    {
      id: "glass-not-photo",
      title: { ko: "photo는 앱 셸에만", en: "Photo belongs to the app shell" },
      body: {
        ko: "photo 표면은 그라디언트와 베일을 깔아 열이 무거워집니다. 앱 전체를 감싸는 셸의 사이드바에만 쓰고, 패널이나 설정 화면 안쪽에서는 glass나 plain을 씁니다.",
        en: "The photo surface layers a gradient and a veil, which makes the column heavy. Keep it for the app shell's own sidebar and use glass or plain inside panels and settings screens.",
      },
      example: "surfaces",
    },
    {
      id: "resize-bounds",
      title: { ko: "너비는 좁게 잡습니다", en: "Keep the width range tight" },
      body: {
        ko: "resizable을 켜면 minWidth와 maxWidth 사이에서만 너비가 바뀝니다. 라벨이 잘리지 않는 240px과, 본문을 밀어내지 않는 400px 사이를 기본값으로 씁니다.",
        en: "With resizable on, the width only moves between minWidth and maxWidth. The defaults of 240px, where labels still fit, and 400px, where the content is not squeezed, are the working range.",
      },
      example: "resizable",
    },
  ],
  specification: [
    {
      id: "column",
      title: { ko: "열", en: "Column" },
      rows: [
        { state: "any", slot: "Column", property: "width", value: "w-70" },
        { state: "resizable", slot: "Column", property: "width", value: "md:w-(--sidebar-width)" },
        { state: "any", slot: "Column", property: "padding", value: "px-3 pt-4 pb-3" },
        { state: "any", slot: "Column", property: "gap", value: "gap-0.5" },
        { state: "glass", slot: "Column", property: "background", value: "bg-glass-thick" },
        { state: "glass", slot: "Column", property: "background layer", value: "LiquidGlass" },
        { state: "photo", slot: "Column", property: "background", value: "bg-sidebar-photo" },
        { state: "photo · dark", slot: "Column", property: "background", value: "dark:bg-glass-thick" },
        { state: "plain", slot: "Column", property: "border", value: "border-r border-border-default" },
        {
          state: "resizing",
          slot: "Column",
          property: "motion",
          value: "transition-[width] duration-200 ease-out-quint",
        },
        { state: "any", slot: "ResizeHandle", property: "width", value: "w-2" },
        { state: "hover", slot: "ResizeHandle", property: "indicator", value: "bg-overlay-ink-16" },
        { state: "focus-visible", slot: "ResizeHandle", property: "indicator", value: "bg-text-brand" },
      ],
    },
    {
      id: "rows",
      title: { ko: "행", en: "Rows" },
      rows: [
        { state: "any", slot: "Header", property: "height", value: "h-9" },
        { state: "any", slot: "Header", property: "gap", value: "gap-1.5" },
        { state: "any", slot: "WorkspaceSwitch", property: "radius", value: "rounded-md" },
        { state: "any", slot: "WorkspaceSwitch", property: "padding", value: "pr-1 pl-2" },
        { state: "any", slot: "WorkspaceSwitch tile", property: "size", value: "size-7" },
        { state: "any", slot: "WorkspaceSwitch name", property: "font", value: "text-label-lg" },
        { state: "hover", slot: "WorkspaceSwitch", property: "background", value: "bg-overlay-ink-6" },
        { state: "popup-open", slot: "WorkspaceSwitch", property: "background", value: "bg-overlay-ink-6" },
        { state: "any", slot: "Item", property: "height", value: "h-8" },
        { state: "any", slot: "Item", property: "radius", value: "rounded-md" },
        { state: "any", slot: "Item", property: "padding", value: "px-2.5" },
        { state: "any", slot: "Item", property: "gap", value: "gap-2.5" },
        { state: "any", slot: "Item", property: "font", value: "text-label-md" },
        { state: "any", slot: "Item icon", property: "size", value: "size-4.5" },
        { state: "hover", slot: "Item", property: "background", value: "bg-overlay-ink-4" },
        { state: "current", slot: "Item", property: "background", value: "bg-overlay-ink-6" },
        { state: "any", slot: "Item count", property: "font", value: "text-body-sm" },
        { state: "any", slot: "Item attention", property: "size", value: "size-[7px]" },
        { state: "any", slot: "Item attention", property: "background", value: "bg-text-danger" },
      ],
    },
    {
      id: "groups-and-account",
      title: { ko: "묶음과 계정", en: "Groups and account" },
      rows: [
        { state: "any", slot: "Group", property: "margin", value: "mt-3.5" },
        { state: "any", slot: "Group trigger", property: "height", value: "h-7" },
        { state: "any", slot: "Group trigger", property: "padding", value: "px-2.5" },
        { state: "any", slot: "Group trigger", property: "font", value: "text-label-md" },
        { state: "any", slot: "Group trigger", property: "text color", value: "text-text-secondary" },
        { state: "hover", slot: "Group trigger", property: "text color", value: "text-text-primary" },
        { state: "any", slot: "Group panel", property: "motion", value: "motion-collapse" },
        { state: "any", slot: "ProjectTile", property: "size", value: "size-5.5" },
        { state: "any", slot: "ProjectTile", property: "radius", value: "rounded-xs" },
        { state: "any", slot: "Tree", property: "indent", value: "pl-5" },
        { state: "any", slot: "Tree connector", property: "stroke", value: "stroke-overlay-ink-16" },
        { state: "any", slot: "AddButton", property: "height", value: "h-9" },
        { state: "any", slot: "AddButton", property: "border", value: "dashed stroke-overlay-ink-20" },
        { state: "hover", slot: "AddButton", property: "background", value: "bg-overlay-ink-4" },
        { state: "any", slot: "Account", property: "radius", value: "rounded-lg" },
        { state: "any", slot: "Account tile", property: "size", value: "size-9" },
        { state: "any", slot: "Account tile", property: "background", value: "bg-sky-200" },
        { state: "any", slot: "Account tile", property: "text color", value: "text-surface-ink" },
        { state: "any", slot: "Account email", property: "font", value: "text-caption" },
        { state: "hover", slot: "Account", property: "background", value: "bg-overlay-ink-4" },
      ],
    },
  ],
  examples: [
    {
      id: "basic",
      title: { ko: "기본 구성", en: "Basic column" },
      description: {
        ko: "워크스페이스 전환, 메뉴 행, 계정 카드를 담은 열입니다. 현재 행 하나와 주의 점이 붙은 행을 함께 두었습니다.",
        en: "A column with the workspace switch, menu rows and the account card, including one current row and one attention dot.",
      },
    },
    {
      id: "projects",
      title: { ko: "접이식 묶음과 프로젝트", en: "Groups and projects" },
      description: {
        ko: "SidebarGroup 안에 프로젝트를 넣고, 펼친 프로젝트 아래에 커넥터로 자식 행을 이었습니다.",
        en: "Projects inside a SidebarGroup, with a connector joining the child rows under an open project.",
      },
    },
    {
      id: "surfaces",
      title: { ko: "표면", en: "Surfaces" },
      description: {
        ko: "glass, photo, plain 세 표면을 같은 내용으로 놓았습니다. photo는 하늘색 그라디언트 위에 베일이 깔립니다.",
        en: "The same content on the glass, photo and plain surfaces. Photo puts a veil over the sky gradient.",
      },
    },
    {
      id: "resizable",
      title: { ko: "너비 조절", en: "Resizable width" },
      description: {
        ko: "오른쪽 가장자리를 끌어 너비를 바꾸는 열입니다. 바뀐 너비는 onWidthChange로 돌아옵니다.",
        en: "A column whose width follows a drag on the right edge. Each change comes back through onWidthChange.",
      },
    },
  ],
  accessibility: {
    notes: [
      {
        ko: "열은 nav 랜드마크이므로 화면에 다른 nav가 있으면 aria-label로 구분되는 이름을 넘깁니다.",
        en: "The column is a nav landmark, so pass a distinct aria-label when the screen holds other navs.",
      },
      {
        ko: "현재 행은 aria-current가 page로 표시됩니다. 이동은 href가 있는 행이면 브라우저가 처리하고, 없는 행은 버튼으로 렌더링되므로 눌렀을 때 할 일을 onClick으로 붙입니다.",
        en: "The current row carries aria-current=\"page\". Navigation on a row with href is the browser's work; a row without href renders as a button, so give it an onClick.",
      },
      {
        ko: "아이콘만 있는 버튼은 접근 가능한 이름이 필요합니다. 접기, 프로젝트 More, 너비 손잡이는 모두 label을 받아 aria-label로 붙입니다.",
        en: "Icon-only controls need an accessible name. The collapse button, the project More button and the resize handle all take a label that becomes their aria-label.",
      },
      {
        ko: "너비 손잡이는 role=separator에 aria-valuenow, aria-valuemin, aria-valuemax를 붙여 지금 너비를 알립니다. 값은 minWidth와 maxWidth 사이로 맞춰집니다.",
        en: "The resize handle is a separator with aria-valuenow, aria-valuemin and aria-valuemax, reporting the current width between minWidth and maxWidth.",
      },
    ],
    keyboard: [
      {
        keys: ["Tab"],
        action: {
          ko: "행과 버튼 사이로 포커스를 옮깁니다. 작은 버튼은 44px 눌림 영역을 유지합니다.",
          en: "Moves focus between rows and buttons; small buttons keep a 44px hit area.",
        },
      },
      {
        keys: ["Enter", "Space"],
        action: { ko: "포커스한 행이나 버튼을 실행합니다.", en: "Runs the focused row or button." },
      },
      {
        keys: ["ArrowLeft", "ArrowRight"],
        action: {
          ko: "너비 손잡이에 포커스가 있을 때 너비를 16px씩 줄이거나 늘립니다.",
          en: "With focus on the resize handle, narrows or widens the column by 16px.",
        },
      },
      {
        keys: ["Home", "End"],
        action: {
          ko: "너비 손잡이에서 가장 좁은 너비와 가장 넓은 너비로 이동합니다.",
          en: "On the resize handle, jumps to the narrowest or the widest width.",
        },
      },
    ],
  },
};
