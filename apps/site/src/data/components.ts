/**
 * The component catalog. Every entry maps one file in
 * packages/react/src/components to its docs route, so the site cannot list a
 * component the library does not ship. The live preview and the usage code are
 * both src/components/demos/<slug>.tsx.
 *
 * Every user-facing string is a `Localized` pair. Titles keep the library's
 * English product name in both locales; descriptions keep the Korean source and
 * add an English adaptation. Render with `pick(entry.title, locale)` or
 * `<T m={entry.title} />`.
 */
import type { Localized } from "@/i18n";

export type ComponentGroupId = "inputs" | "display" | "navigation" | "overlays" | "conversation" | "agents";

export interface ComponentEntry {
  slug: string;
  title: Localized;
  group: ComponentGroupId;
  description: Localized;
  overlay?: boolean;
}

export const componentGroups: { id: ComponentGroupId; title: Localized; description: Localized }[] = [
  {
    id: "inputs",
    title: { ko: "입력과 선택", en: "Inputs and selection" },
    description: {
      ko: "값을 입력하거나 선택지를 고르는 컨트롤입니다.",
      en: "Controls that take a value or let people choose an option.",
    },
  },
  {
    id: "display",
    title: { ko: "표시", en: "Display" },
    description: {
      ko: "데이터와 상태, 브랜드 요소를 화면에 보여줍니다.",
      en: "Shows data, state, and brand elements on screen.",
    },
  },
  {
    id: "navigation",
    title: { ko: "내비게이션", en: "Navigation" },
    description: {
      ko: "화면과 섹션 사이를 이동합니다.",
      en: "Moves between screens and sections.",
    },
  },
  {
    id: "overlays",
    title: { ko: "오버레이", en: "Overlays" },
    description: {
      ko: "현재 화면 위에 떠서 맥락을 보조하는 표면입니다.",
      en: "Surfaces that float above the current screen to add context.",
    },
  },
  {
    id: "conversation",
    title: { ko: "대화", en: "Conversation" },
    description: {
      ko: "봇과 주고받는 메시지와 그 주변 컨트롤입니다.",
      en: "Messages exchanged with a bot, plus the controls around them.",
    },
  },
  {
    id: "agents",
    title: { ko: "에이전트", en: "Agents" },
    description: {
      ko: "봇이 일하는 과정과 결과를 보여주는 블록입니다.",
      en: "Blocks that show how a bot works and what it produced.",
    },
  },
];

export const components: ComponentEntry[] = [
  {
    slug: "button",
    title: { ko: "Button", en: "Button" },
    group: "inputs",
    description: {
      ko: "동작을 실행하는 버튼입니다. Primary, Glass, Danger, Link 변형과 세 크기가 있습니다.",
      en: "Runs an action. Comes in Primary, Glass, Danger, and Link variants at three sizes.",
    },
  },
  {
    slug: "icon-button",
    title: { ko: "Icon Button", en: "Icon Button" },
    group: "inputs",
    description: {
      ko: "아이콘 하나로 동작을 실행하는 원형 버튼입니다.",
      en: "A round button that runs an action from a single icon.",
    },
  },
  {
    slug: "input",
    title: { ko: "Input", en: "Input" },
    group: "inputs",
    description: {
      ko: "한 줄 텍스트 입력 필드입니다. 유리(Glass)와 불투명(Solid) 표면을 고릅니다.",
      en: "A single-line text field. Choose a glass or solid surface.",
    },
  },
  {
    slug: "textarea",
    title: { ko: "Textarea", en: "Textarea" },
    group: "inputs",
    description: {
      ko: "여러 줄 텍스트를 입력받습니다.",
      en: "Takes text across multiple lines.",
    },
  },
  {
    slug: "field",
    title: { ko: "Field", en: "Field" },
    group: "inputs",
    description: {
      ko: "라벨, 설명, 오류 문구를 입력과 묶습니다.",
      en: "Groups a label, description, and error message with an input.",
    },
  },
  {
    slug: "textarea-field",
    title: { ko: "Textarea Field", en: "Textarea Field" },
    group: "inputs",
    description: {
      ko: "글자 수 표시와 보내기 버튼이 붙은 여러 줄 입력입니다.",
      en: "A multi-line input with a character count and a send button.",
    },
  },
  {
    slug: "input-group",
    title: { ko: "Input Group", en: "Input Group" },
    group: "inputs",
    description: {
      ko: "입력 앞뒤에 선택 영역과 아이콘을 붙여 하나로 묶습니다.",
      en: "Joins a select and icons to the front or back of an input.",
    },
  },
  {
    slug: "select",
    title: { ko: "Select", en: "Select" },
    group: "inputs",
    description: {
      ko: "목록에서 하나를 고르는 드롭다운입니다.",
      en: "A dropdown for choosing one item from a list.",
    },
    overlay: true,
  },
  {
    slug: "checkbox",
    title: { ko: "Checkbox", en: "Checkbox" },
    group: "inputs",
    description: {
      ko: "항목을 독립적으로 켜고 끄는 선택 컨트롤입니다.",
      en: "Turns individual items on or off independently.",
    },
  },
  {
    slug: "radio-group",
    title: { ko: "Radio Group", en: "Radio Group" },
    group: "inputs",
    description: {
      ko: "여러 선택지 중 하나만 고릅니다.",
      en: "Chooses exactly one option from a set.",
    },
  },
  {
    slug: "switch",
    title: { ko: "Switch", en: "Switch" },
    group: "inputs",
    description: {
      ko: "즉시 반영되는 켜짐·꺼짐을 전환합니다.",
      en: "Toggles on and off, taking effect immediately.",
    },
  },
  {
    slug: "slider",
    title: { ko: "Slider", en: "Slider" },
    group: "inputs",
    description: {
      ko: "가는 트랙 위 손잡이로 값을 고릅니다.",
      en: "Picks a value with a handle on a thin track.",
    },
  },
  {
    slug: "chip",
    title: { ko: "Chip", en: "Chip" },
    group: "inputs",
    description: {
      ko: "필터처럼 눌러서 켜고 끄는 유리 칩입니다.",
      en: "A glass chip you press to toggle, as in a filter.",
    },
  },
  {
    slug: "segmented-control",
    title: { ko: "Segmented Control", en: "Segmented Control" },
    group: "inputs",
    description: {
      ko: "몇 개의 보기 중 하나를 고르는 분할 컨트롤입니다.",
      en: "A segmented control for choosing one of a few views.",
    },
  },
  {
    slug: "date-field",
    title: { ko: "Date Field", en: "Date Field" },
    group: "inputs",
    description: {
      ko: "달력을 열어 날짜를 고르는 입력입니다.",
      en: "An input that opens a calendar to pick a date.",
    },
  },
  {
    slug: "calendar",
    title: { ko: "Calendar", en: "Calendar" },
    group: "inputs",
    description: {
      ko: "날짜 하나 또는 범위를 고르는 월 달력입니다.",
      en: "A month calendar for picking a single date or a range.",
    },
  },
  {
    slug: "schedule",
    title: { ko: "Schedule", en: "Schedule" },
    group: "inputs",
    description: {
      ko: "루틴의 반복, 요일, 시간을 정하는 일정 카드와 부품입니다.",
      en: "A schedule card and parts for setting a routine's repeat, weekdays, and time.",
    },
  },
  {
    slug: "composer",
    title: { ko: "Composer", en: "Composer" },
    group: "inputs",
    description: {
      ko: "첨부, 입력, 음성·보내기 버튼을 갖춘 메시지 입력창입니다.",
      en: "A message box with attachment, text entry, and voice and send buttons.",
    },
  },
  {
    slug: "split-button",
    title: { ko: "Split Button", en: "Split Button" },
    group: "inputs",
    description: {
      ko: "주 동작과 보조 메뉴 캐럿을 한 알약에 담은 버튼입니다.",
      en: "A pill button that pairs a primary action with a caret for a secondary menu.",
    },
    overlay: true,
  },
  {
    slug: "tool-permissions",
    title: { ko: "Tool Permissions", en: "Tool Permissions" },
    group: "inputs",
    description: {
      ko: "도구마다 허용, 확인, 끔을 고르는 권한 목록입니다.",
      en: "A permission list that sets allow, ask, or off per tool.",
    },
  },
  {
    slug: "file-drop",
    title: { ko: "File Drop", en: "File Drop" },
    group: "inputs",
    description: {
      ko: "파일을 끌어다 놓는 점선 영역입니다.",
      en: "A dashed area for dropping files.",
    },
  },
  {
    slug: "choice-card",
    title: { ko: "Choice Card", en: "Choice Card" },
    group: "inputs",
    description: {
      ko: "두 카드 중 하나를 고르는 라디오 카드입니다.",
      en: "A radio card for choosing one of two cards.",
    },
  },
  {
    slug: "badge",
    title: { ko: "Badge", en: "Badge" },
    group: "display",
    description: {
      ko: "상태를 짧은 알약 모양 라벨로 표시합니다.",
      en: "Shows state as a short pill label.",
    },
  },
  {
    slug: "avatar",
    title: { ko: "Avatar", en: "Avatar" },
    group: "display",
    description: {
      ko: "사람의 이니셜, 봇, 이미지를 원형으로 보여주고 실행 중이면 점을 붙입니다.",
      en: "Shows initials, a bot, or an image in a circle, with a dot while it runs.",
    },
  },
  {
    slug: "card",
    title: { ko: "Card", en: "Card" },
    group: "display",
    description: {
      ko: "제목과 설명을 담는 두꺼운 유리 카드입니다.",
      en: "A thick glass card holding a title and description.",
    },
  },
  {
    slug: "banner",
    title: { ko: "Banner", en: "Banner" },
    group: "display",
    description: {
      ko: "화면 위쪽에 정보나 위험을 알리는 띠입니다.",
      en: "A strip at the top of the screen that flags information or risk.",
    },
  },
  {
    slug: "kbd",
    title: { ko: "Kbd", en: "Kbd" },
    group: "display",
    description: {
      ko: "단축키를 작은 키캡으로 표시합니다.",
      en: "Shows a keyboard shortcut as a small keycap.",
    },
  },
  {
    slug: "progress",
    title: { ko: "Progress", en: "Progress" },
    group: "display",
    description: {
      ko: "작업의 진행률을 6px 막대로 보여줍니다.",
      en: "Shows task progress on a 6px bar.",
    },
  },
  {
    slug: "usage-meter",
    title: { ko: "Usage Meter", en: "Usage Meter" },
    group: "display",
    description: {
      ko: "이번 달 사용량을 막대와 설명으로 보여주는 카드입니다.",
      en: "A card that shows this month's usage as a bar with a caption.",
    },
  },
  {
    slug: "spinner",
    title: { ko: "Spinner", en: "Spinner" },
    group: "display",
    description: {
      ko: "처리 중임을 알리는 회전 표시입니다.",
      en: "A spinning indicator that shows work is in progress.",
    },
  },
  {
    slug: "skeleton",
    title: { ko: "Skeleton", en: "Skeleton" },
    group: "display",
    description: {
      ko: "내용이 오기 전 자리를 회색 면으로 잡아 둡니다.",
      en: "Holds a place with a gray surface until content arrives.",
    },
  },
  {
    slug: "empty-state",
    title: { ko: "Empty State", en: "Empty State" },
    group: "display",
    description: {
      ko: "결과가 없거나 오류가 났을 때 마스코트와 안내를 보여줍니다.",
      en: "Shows the mascot and guidance when there are no results or an error occurs.",
    },
  },
  {
    slug: "data-table",
    title: { ko: "Data Table", en: "Data Table" },
    group: "display",
    description: {
      ko: "TanStack Table로 정렬, 검색, 행 선택, 페이지 나눔을 처리하는 표입니다.",
      en: "A table built on TanStack Table with sorting, search, row selection, and paging.",
    },
  },
  {
    slug: "integration-row",
    title: { ko: "Integration Row", en: "Integration Row" },
    group: "display",
    description: {
      ko: "연결된 서비스의 상태와 연결 동작을 한 줄로 보여줍니다.",
      en: "One row showing a connected service's status and connect action.",
    },
  },
  {
    slug: "liquid-glass",
    title: { ko: "Liquid Glass", en: "Liquid Glass" },
    group: "display",
    description: {
      ko: "모든 유리 표면 아래 깔리는 색조, 안쪽 음영, 빛 테두리 레이어입니다.",
      en: "The tint, inner shadow, and light border layer under every glass surface.",
    },
  },
  {
    slug: "flue-background",
    title: { ko: "Flue Background", en: "Flue Background" },
    group: "display",
    description: {
      ko: "사이드바 뒤에서 천천히 피어오르는 하늘색 연기 그라데이션입니다. 커서를 따라 휘어집니다.",
      en: "A pale blue smoke gradient that drifts behind the sidebar and bends toward the cursor.",
    },
  },
  {
    slug: "horon-icon",
    title: { ko: "Horon Icon", en: "Horon Icon" },
    group: "display",
    description: {
      ko: "내비게이션에서 Horon을 나타내는 매의 눈 아이콘입니다.",
      en: "The hawk-eye icon that stands for Horon in navigation.",
    },
  },
  {
    slug: "horon-wordmark",
    title: { ko: "Horon Wordmark", en: "Horon Wordmark" },
    group: "display",
    description: {
      ko: "UI 크기의 Horon 글자 로고입니다.",
      en: "The Horon letter logo at UI size.",
    },
  },
  {
    slug: "settings-list",
    title: { ko: "Settings List", en: "Settings List" },
    group: "display",
    description: {
      ko: "라벨과 스위치를 구분선으로 나눈 설정 목록 카드입니다.",
      en: "A settings card that separates label and switch rows with dividers.",
    },
  },
  {
    slug: "mcp-server-row",
    title: { ko: "MCP Server Row", en: "MCP Server Row" },
    group: "display",
    description: {
      ko: "연결된 MCP 서버의 이름, 태그, 상태를 보여 주는 행입니다.",
      en: "A row showing a connected MCP server's name, tags, and status.",
    },
  },
  {
    slug: "directory-card",
    title: { ko: "Directory Card", en: "Directory Card" },
    group: "display",
    description: {
      ko: "디렉터리 항목을 소개하고 추가 버튼을 둔 카드입니다.",
      en: "A card that introduces a directory entry and offers an add button.",
    },
  },
  {
    slug: "plugin-row",
    title: { ko: "Plugin Row", en: "Plugin Row" },
    group: "display",
    description: {
      ko: "플러그인 이름, 버전, 업데이트와 켜기 스위치를 담은 행입니다.",
      en: "A row with a plugin's name, version, update, and on switch.",
    },
  },
  {
    slug: "marketplace-card",
    title: { ko: "Marketplace Card", en: "Marketplace Card" },
    group: "display",
    description: {
      ko: "마켓플레이스 항목의 설명과 설치 버튼을 담은 카드입니다.",
      en: "A card with a marketplace item's description and an install button.",
    },
  },
  {
    slug: "list-detail",
    title: { ko: "List Detail", en: "List Detail" },
    group: "display",
    description: {
      ko: "왼쪽 목록과 오른쪽 상세를 나란히 놓은 두 단 패널입니다.",
      en: "A two-column panel with a list on the left and detail on the right.",
    },
  },
  {
    slug: "code-panel",
    title: { ko: "Code Panel", en: "Code Panel" },
    group: "display",
    description: {
      ko: "설정 화면에서 쓰는 밝은 코드 패널입니다.",
      en: "A light code panel for settings screens.",
    },
  },
  {
    slug: "tabs",
    title: { ko: "Tabs", en: "Tabs" },
    group: "navigation",
    description: {
      ko: "같은 맥락의 화면을 알약 모양 탭으로 나눕니다.",
      en: "Splits screens in one context into pill-shaped tabs.",
    },
  },
  {
    slug: "tab-bar",
    title: { ko: "Tab Bar", en: "Tab Bar" },
    group: "navigation",
    description: {
      ko: "모바일 하단의 아이콘 탭 막대입니다.",
      en: "An icon tab bar at the bottom of mobile screens.",
    },
  },
  {
    slug: "breadcrumb",
    title: { ko: "Breadcrumb", en: "Breadcrumb" },
    group: "navigation",
    description: {
      ko: "워크스페이스부터 현재 위치까지의 경로입니다.",
      en: "The path from the workspace down to the current location.",
    },
  },
  {
    slug: "sidebar",
    title: { ko: "Sidebar", en: "Sidebar" },
    group: "navigation",
    description: {
      ko: "워크스페이스, 메뉴, 펼쳐지는 프로젝트, 계정을 담는 왼쪽 패널입니다.",
      en: "The left panel with the workspace, menu, expandable projects, and account.",
    },
  },
  {
    slug: "page-header",
    title: { ko: "Page Header", en: "Page Header" },
    group: "navigation",
    description: {
      ko: "뒤로 가기, 제목, 동작, 필터를 담는 유리 머리말입니다.",
      en: "A glass header with back, title, actions, and filters.",
    },
  },
  {
    slug: "top-bar",
    title: { ko: "Top Bar", en: "Top Bar" },
    group: "navigation",
    description: {
      ko: "뒤로가기, 봇 아바타, 제목과 부제, 더보기를 한 줄에 담은 모바일 상단 바입니다.",
      en: "A mobile top bar with back, bot avatar, title and subtitle, and more in one row.",
    },
  },
  {
    slug: "breadcrumb-header",
    title: { ko: "Breadcrumb Header", en: "Breadcrumb Header" },
    group: "navigation",
    description: {
      ko: "브레드크럼과 아이콘 버튼 두 개를 한 줄에 담은 유리 머리말입니다.",
      en: "A glass header with a breadcrumb and two icon buttons in one row.",
    },
  },
  {
    slug: "filter-bar",
    title: { ko: "Filter Bar", en: "Filter Bar" },
    group: "navigation",
    description: {
      ko: "개수를 함께 보여 주는 알약 필터 바입니다.",
      en: "A pill filter bar that shows counts alongside each filter.",
    },
  },
  {
    slug: "dialog",
    title: { ko: "Dialog", en: "Dialog" },
    group: "overlays",
    description: {
      ko: "화면을 어둡게 덮고 확인을 받는 대화상자입니다.",
      en: "A dialog that dims the screen and asks for confirmation.",
    },
    overlay: true,
  },
  {
    slug: "bottom-sheet",
    title: { ko: "Bottom Sheet", en: "Bottom Sheet" },
    group: "overlays",
    description: {
      ko: "모바일에서 아래에서 올라오는 시트입니다.",
      en: "A sheet that rises from the bottom on mobile.",
    },
    overlay: true,
  },
  {
    slug: "menu",
    title: { ko: "Menu", en: "Menu" },
    group: "overlays",
    description: {
      ko: "동작 목록을 띄우는 메뉴입니다. 유리와 불투명 표면이 있습니다.",
      en: "A menu that lists actions, with glass and solid surfaces.",
    },
    overlay: true,
  },
  {
    slug: "tooltip",
    title: { ko: "Tooltip", en: "Tooltip" },
    group: "overlays",
    description: {
      ko: "아이콘 버튼의 이름을 짧게 알려 줍니다.",
      en: "Briefly names an icon button.",
    },
    overlay: true,
  },
  {
    slug: "toast",
    title: { ko: "Toast", en: "Toast" },
    group: "overlays",
    description: {
      ko: "작업 결과를 잠깐 띄워 알립니다.",
      en: "Flashes a task result for a moment.",
    },
    overlay: true,
  },
  {
    slug: "command-palette",
    title: { ko: "Command Palette", en: "Command Palette" },
    group: "overlays",
    description: {
      ko: "봇, 프로젝트, 동작을 검색해 바로 엽니다.",
      en: "Search bots, projects, and actions and open them directly.",
    },
    overlay: true,
  },
  {
    slug: "workspace-menu",
    title: { ko: "Workspace Menu", en: "Workspace Menu" },
    group: "overlays",
    description: {
      ko: "워크스페이스를 고르고 새 워크스페이스를 만드는 솔리드 메뉴입니다.",
      en: "A solid menu for choosing a workspace or creating a new one.",
    },
    overlay: true,
  },
  {
    slug: "chat-bubble",
    title: { ko: "Chat Bubble", en: "Chat Bubble" },
    group: "conversation",
    description: {
      ko: "내가 보낸 말과 봇의 답을 구분하는 말풍선입니다.",
      en: "A bubble that tells your messages apart from the bot's replies.",
    },
  },
  {
    slug: "approval-card",
    title: { ko: "Approval Card", en: "Approval Card" },
    group: "conversation",
    description: {
      ko: "봇이 실행 전에 승인을 받는 카드입니다.",
      en: "A card the bot uses to get approval before it runs something.",
    },
  },
  {
    slug: "bot-list-row",
    title: { ko: "Bot List Row", en: "Bot List Row" },
    group: "conversation",
    description: {
      ko: "봇 이름, 최근 활동, 실행 여부를 한 줄로 보여줍니다.",
      en: "One row with a bot's name, latest activity, and running state.",
    },
  },
  {
    slug: "chat-controls",
    title: { ko: "Chat Controls", en: "Chat Controls" },
    group: "conversation",
    description: {
      ko: "최신 메시지로 이동, 새 메시지 알림, 음성 입력 막대입니다.",
      en: "A bar for jumping to the latest message, new-message alerts, and voice input.",
    },
  },
  {
    slug: "message-extras",
    title: { ko: "Message Extras", en: "Message Extras" },
    group: "conversation",
    description: {
      ko: "메시지 동작, 날짜 구분선, 첨부, 코드 블록입니다.",
      en: "Message actions, date dividers, attachments, and code blocks.",
    },
  },
  {
    slug: "agent-activity",
    title: { ko: "Agent Activity", en: "Agent Activity" },
    group: "agents",
    description: {
      ko: "생각 중 표시, 스트리밍 글, 도구 단계, 작업 기록입니다.",
      en: "Thinking indicators, streamed text, tool steps, and a work log.",
    },
  },
  {
    slug: "agent-panel",
    title: { ko: "Agent Panel", en: "Agent Panel" },
    group: "agents",
    description: {
      ko: "봇에게 일을 맡기는 입력창과 작업 목록을 담는 패널입니다.",
      en: "A panel with the input for assigning work to a bot and the task list.",
    },
  },
  {
    slug: "task-row",
    title: { ko: "Task Row", en: "Task Row" },
    group: "agents",
    description: {
      ko: "맡긴 작업의 진행, 검토, 실패, 완료 상태를 보여줍니다.",
      en: "Shows whether an assigned task is running, in review, failed, or done.",
    },
  },
  {
    slug: "agent-lane",
    title: { ko: "Agent Lane", en: "Agent Lane" },
    group: "agents",
    description: {
      ko: "나눠 맡긴 하위 봇 하나의 진행을 보여줍니다.",
      en: "Shows the progress of one delegated sub-bot.",
    },
  },
  {
    slug: "tool-call",
    title: { ko: "Tool Call", en: "Tool Call" },
    group: "agents",
    description: {
      ko: "봇이 부른 도구의 인자와 결과를 펼쳐 봅니다.",
      en: "Expands the arguments and result of a tool the bot called.",
    },
  },
  {
    slug: "plan-step",
    title: { ko: "Plan Step", en: "Plan Step" },
    group: "agents",
    description: {
      ko: "실행 계획의 한 단계를 레일 위에 표시합니다.",
      en: "Marks one step of a plan on a rail.",
    },
  },
  {
    slug: "source-row",
    title: { ko: "Source Row", en: "Source Row" },
    group: "agents",
    description: {
      ko: "지식 소스의 수집·분할·임베딩 단계를 보여줍니다.",
      en: "Shows the collect, split, and embed steps for a knowledge source.",
    },
  },
  {
    slug: "orchestrator-panel",
    title: { ko: "Orchestrator Panel", en: "Orchestrator Panel" },
    group: "agents",
    description: {
      ko: "리드 봇과 병렬 레인, 요약을 보여 주는 오케스트레이터 패널입니다.",
      en: "An orchestrator panel showing the lead bot, parallel lanes, and a summary.",
    },
  },
  {
    slug: "plan-card",
    title: { ko: "Plan Card", en: "Plan Card" },
    group: "agents",
    description: {
      ko: "계획 단계를 감싸는 카드 껍데기입니다.",
      en: "A card shell that wraps plan steps.",
    },
  },
  {
    slug: "knowledge-base-panel",
    title: { ko: "Knowledge Base Panel", en: "Knowledge Base Panel" },
    group: "agents",
    description: {
      ko: "지식 소스의 색인 상태를 보여 주는 패널입니다.",
      en: "A panel that shows the indexing state of knowledge sources.",
    },
  },
  {
    slug: "agent-steering-panel",
    title: { ko: "Agent Steering Panel", en: "Agent Steering Panel" },
    group: "agents",
    description: {
      ko: "실행 중인 봇에게 방향을 지시하는 스티어링 패널입니다.",
      en: "A steering panel for giving direction to a running bot.",
    },
  },
  {
    slug: "agent-lanes-timeline",
    title: { ko: "Agent Lanes Timeline", en: "Agent Lanes Timeline" },
    group: "agents",
    description: {
      ko: "봇별 실행 구간을 시간축에 놓은 타임라인입니다.",
      en: "A timeline that places each bot's run on a time axis.",
    },
  },
  {
    slug: "bot-instructions-panel",
    title: { ko: "Bot Instructions Panel", en: "Bot Instructions Panel" },
    group: "agents",
    description: {
      ko: "봇 지침과 예시를 탭으로 보여 주는 패널입니다.",
      en: "A panel that shows bot instructions and examples in tabs.",
    },
  },
  {
    slug: "document-extract-panel",
    title: { ko: "Document Extract Panel", en: "Document Extract Panel" },
    group: "agents",
    description: {
      ko: "문서 뷰어와 추출된 필드를 나란히 보여 주는 패널입니다.",
      en: "A panel that sets a document viewer beside extracted fields.",
    },
  },
  {
    slug: "bot-memory-panel",
    title: { ko: "Bot Memory Panel", en: "Bot Memory Panel" },
    group: "agents",
    description: {
      ko: "봇이 기억한 내용을 분류해 보여 주는 메모리 패널입니다.",
      en: "A memory panel that groups what the bot remembers.",
    },
  },
  {
    slug: "research-run-panel",
    title: { ko: "Research Run Panel", en: "Research Run Panel" },
    group: "agents",
    description: {
      ko: "리서치 질문, 진행 상태, 검색어 목록을 보여 주는 패널입니다.",
      en: "A panel showing a research question, progress, and the list of queries.",
    },
  },
  {
    slug: "tool-calls-header",
    title: { ko: "Tool Calls Header", en: "Tool Calls Header" },
    group: "agents",
    description: {
      ko: "도구 호출 묶음의 제목 줄과 도구 칩입니다.",
      en: "The title row and tool chips for a group of tool calls.",
    },
  },
];

export const componentCount = components.length;

export function componentBySlug(slug: string | undefined): ComponentEntry | undefined {
  return components.find((component) => component.slug === slug);
}

export function componentsInGroup(id: ComponentGroupId): ComponentEntry[] {
  return components.filter((component) => component.group === id);
}
