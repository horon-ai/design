/**
 * The component catalog. Every entry maps one file in
 * packages/react/src/components to its docs route, so the site cannot list a
 * component the library does not ship. The live preview and the usage code are
 * both src/components/demos/<slug>.tsx; `story` is the Storybook story id.
 */
export type ComponentGroupId = "inputs" | "display" | "navigation" | "overlays" | "conversation" | "agents";

export interface ComponentEntry {
  slug: string;
  title: string;
  group: ComponentGroupId;
  description: string;
  story: string;
  overlay?: boolean;
}

export const componentGroups: { id: ComponentGroupId; title: string; description: string }[] = [
  { id: "inputs", title: "입력과 선택", description: "값을 입력하거나 선택지를 고르는 컨트롤입니다." },
  { id: "display", title: "표시", description: "데이터와 상태, 브랜드 요소를 화면에 보여줍니다." },
  { id: "navigation", title: "내비게이션", description: "화면과 섹션 사이를 이동합니다." },
  { id: "overlays", title: "오버레이", description: "현재 화면 위에 떠서 맥락을 보조하는 표면입니다." },
  { id: "conversation", title: "대화", description: "봇과 주고받는 메시지와 그 주변 컨트롤입니다." },
  { id: "agents", title: "에이전트", description: "봇이 일하는 과정과 결과를 보여주는 블록입니다." },
];

export const components: ComponentEntry[] = [
  {
    slug: "button",
    title: "Button",
    group: "inputs",
    description: "동작을 실행하는 버튼입니다. Primary, Glass, Danger 세 종류와 세 크기가 있습니다.",
    story: "web-button--playground",
  },
  {
    slug: "icon-button",
    title: "Icon Button",
    group: "inputs",
    description: "아이콘 하나로 동작을 실행하는 원형 버튼입니다.",
    story: "web-iconbutton--playground",
  },
  {
    slug: "input",
    title: "Input",
    group: "inputs",
    description: "한 줄 텍스트 입력 필드입니다. 유리(Glass)와 불투명(Solid) 표면을 고릅니다.",
    story: "web-input--playground",
  },
  {
    slug: "textarea",
    title: "Textarea",
    group: "inputs",
    description: "여러 줄 텍스트를 입력받습니다.",
    story: "web-textarea--playground",
  },
  {
    slug: "field",
    title: "Field",
    group: "inputs",
    description: "라벨, 설명, 오류 문구를 입력과 묶습니다.",
    story: "web-field--filled",
  },
  {
    slug: "textarea-field",
    title: "Textarea Field",
    group: "inputs",
    description: "글자 수 표시와 보내기 버튼이 붙은 여러 줄 입력입니다.",
    story: "web-textareafield--default",
  },
  {
    slug: "input-group",
    title: "Input Group",
    group: "inputs",
    description: "입력 앞뒤에 선택 영역과 아이콘을 붙여 하나로 묶습니다.",
    story: "web-inputgroup--prefix",
  },
  {
    slug: "select",
    title: "Select",
    group: "inputs",
    description: "목록에서 하나를 고르는 드롭다운입니다.",
    story: "web-select--glass",
    overlay: true,
  },
  {
    slug: "checkbox",
    title: "Checkbox",
    group: "inputs",
    description: "항목을 독립적으로 켜고 끄는 선택 컨트롤입니다.",
    story: "web-checkbox--playground",
  },
  {
    slug: "radio-group",
    title: "Radio Group",
    group: "inputs",
    description: "여러 선택지 중 하나만 고릅니다.",
    story: "web-radiogroup--default",
  },
  {
    slug: "switch",
    title: "Switch",
    group: "inputs",
    description: "즉시 반영되는 켜짐·꺼짐을 전환합니다.",
    story: "web-switch--playground",
  },
  {
    slug: "chip",
    title: "Chip",
    group: "inputs",
    description: "필터처럼 눌러서 켜고 끄는 유리 칩입니다.",
    story: "web-chip--playground",
  },
  {
    slug: "segmented-control",
    title: "Segmented Control",
    group: "inputs",
    description: "몇 개의 보기 중 하나를 고르는 분할 컨트롤입니다.",
    story: "web-segmentedcontrol--two-items",
  },
  {
    slug: "date-field",
    title: "Date Field",
    group: "inputs",
    description: "달력을 열어 날짜를 고르는 입력입니다.",
    story: "web-datefield--empty",
  },
  {
    slug: "calendar",
    title: "Calendar",
    group: "inputs",
    description: "날짜 하나 또는 범위를 고르는 월 달력입니다.",
    story: "web-calendar--single",
  },
  {
    slug: "schedule",
    title: "Schedule",
    group: "inputs",
    description: "루틴의 반복, 요일, 시간을 정하는 일정 카드와 부품입니다.",
    story: "web-schedule--parts",
  },
  {
    slug: "composer",
    title: "Composer",
    group: "inputs",
    description: "첨부, 입력, 음성·보내기 버튼을 갖춘 메시지 입력창입니다.",
    story: "web-composer--empty",
  },
  {
    slug: "badge",
    title: "Badge",
    group: "display",
    description: "상태를 짧은 알약 모양 라벨로 표시합니다.",
    story: "web-badge--playground",
  },
  {
    slug: "avatar",
    title: "Avatar",
    group: "display",
    description: "사람의 이니셜, 봇, 이미지를 원형으로 보여주고 실행 중이면 점을 붙입니다.",
    story: "web-avatar--playground",
  },
  {
    slug: "card",
    title: "Card",
    group: "display",
    description: "제목과 설명을 담는 두꺼운 유리 카드입니다.",
    story: "web-card--default",
  },
  {
    slug: "banner",
    title: "Banner",
    group: "display",
    description: "화면 위쪽에 정보나 위험을 알리는 띠입니다.",
    story: "web-banner--info",
  },
  {
    slug: "kbd",
    title: "Kbd",
    group: "display",
    description: "단축키를 작은 키캡으로 표시합니다.",
    story: "web-kbd--default",
  },
  {
    slug: "progress",
    title: "Progress",
    group: "display",
    description: "작업의 진행률을 6px 막대로 보여줍니다.",
    story: "web-progress--playground",
  },
  {
    slug: "usage-meter",
    title: "Usage Meter",
    group: "display",
    description: "이번 달 사용량을 막대와 설명으로 보여주는 카드입니다.",
    story: "web-usagemeter--default",
  },
  {
    slug: "spinner",
    title: "Spinner",
    group: "display",
    description: "처리 중임을 알리는 회전 표시입니다.",
    story: "web-spinner--sizes",
  },
  {
    slug: "skeleton",
    title: "Skeleton",
    group: "display",
    description: "내용이 오기 전 자리를 회색 면으로 잡아 둡니다.",
    story: "web-skeleton--cards",
  },
  {
    slug: "empty-state",
    title: "Empty State",
    group: "display",
    description: "결과가 없거나 오류가 났을 때 마스코트와 안내를 보여줍니다.",
    story: "web-emptystate--no-bots",
  },
  {
    slug: "data-table",
    title: "Data Table",
    group: "display",
    description: "머리 행, 태그, 행 추가를 갖춘 표입니다.",
    story: "web-datatable--default",
  },
  {
    slug: "integration-row",
    title: "Integration Row",
    group: "display",
    description: "연결된 서비스의 상태와 연결 동작을 한 줄로 보여줍니다.",
    story: "web-integrationrow--states",
  },
  {
    slug: "liquid-glass",
    title: "Liquid Glass",
    group: "display",
    description: "모든 유리 표면 아래 깔리는 다섯 장의 레이어입니다.",
    story: "web-liquidglass--tiers",
  },
  {
    slug: "horon-icon",
    title: "Horon Icon",
    group: "display",
    description: "내비게이션에서 Horon을 나타내는 매의 눈 아이콘입니다.",
    story: "web-horonicon--sizes",
  },
  {
    slug: "horon-wordmark",
    title: "Horon Wordmark",
    group: "display",
    description: "UI 크기의 Horon 글자 로고입니다.",
    story: "web-horonwordmark--sizes",
  },
  {
    slug: "tabs",
    title: "Tabs",
    group: "navigation",
    description: "같은 맥락의 화면을 알약 모양 탭으로 나눕니다.",
    story: "web-tabs--default",
  },
  {
    slug: "tab-bar",
    title: "Tab Bar",
    group: "navigation",
    description: "모바일 하단의 아이콘 탭 막대입니다.",
    story: "web-tabbar--default",
  },
  {
    slug: "breadcrumb",
    title: "Breadcrumb",
    group: "navigation",
    description: "워크스페이스부터 현재 위치까지의 경로입니다.",
    story: "web-breadcrumb--two-levels",
  },
  {
    slug: "sidebar",
    title: "Sidebar",
    group: "navigation",
    description: "워크스페이스, 메뉴, 펼쳐지는 프로젝트, 계정을 담는 왼쪽 패널입니다.",
    story: "web-sidebar--default",
  },
  {
    slug: "page-header",
    title: "Page Header",
    group: "navigation",
    description: "뒤로 가기, 제목, 동작, 필터를 담는 유리 머리말입니다.",
    story: "web-pageheader--with-filter",
  },
  {
    slug: "dialog",
    title: "Dialog",
    group: "overlays",
    description: "화면을 어둡게 덮고 확인을 받는 대화상자입니다.",
    story: "web-dialog--default",
    overlay: true,
  },
  {
    slug: "bottom-sheet",
    title: "Bottom Sheet",
    group: "overlays",
    description: "모바일에서 아래에서 올라오는 시트입니다.",
    story: "web-bottomsheet--default",
    overlay: true,
  },
  {
    slug: "menu",
    title: "Menu",
    group: "overlays",
    description: "동작 목록을 띄우는 메뉴입니다. 유리와 불투명 표면이 있습니다.",
    story: "web-menu--glass",
    overlay: true,
  },
  {
    slug: "tooltip",
    title: "Tooltip",
    group: "overlays",
    description: "아이콘 버튼의 이름을 짧게 알려 줍니다.",
    story: "web-tooltip--top",
    overlay: true,
  },
  {
    slug: "toast",
    title: "Toast",
    group: "overlays",
    description: "작업 결과를 잠깐 띄워 알립니다.",
    story: "web-toast--default",
    overlay: true,
  },
  {
    slug: "command-palette",
    title: "Command Palette",
    group: "overlays",
    description: "봇, 프로젝트, 동작을 검색해 바로 엽니다.",
    story: "web-commandpalette--default",
    overlay: true,
  },
  {
    slug: "chat-bubble",
    title: "Chat Bubble",
    group: "conversation",
    description: "내가 보낸 말과 봇의 답을 구분하는 말풍선입니다.",
    story: "web-chatbubble--conversation",
  },
  {
    slug: "approval-card",
    title: "Approval Card",
    group: "conversation",
    description: "봇이 실행 전에 승인을 받는 카드입니다.",
    story: "web-approvalcard--pending",
  },
  {
    slug: "bot-list-row",
    title: "Bot List Row",
    group: "conversation",
    description: "봇 이름, 최근 활동, 실행 여부를 한 줄로 보여줍니다.",
    story: "web-botlistrow--list",
  },
  {
    slug: "chat-controls",
    title: "Chat Controls",
    group: "conversation",
    description: "최신 메시지로 이동, 새 메시지 알림, 음성 입력 막대입니다.",
    story: "web-chatcontrols--all",
  },
  {
    slug: "message-extras",
    title: "Message Extras",
    group: "conversation",
    description: "메시지 동작, 날짜 구분선, 첨부, 코드 블록입니다.",
    story: "web-messageextras--all",
  },
  {
    slug: "agent-activity",
    title: "Agent Activity",
    group: "agents",
    description: "생각 중 표시, 스트리밍 글, 도구 단계, 작업 기록입니다.",
    story: "web-agentactivity--all",
  },
  {
    slug: "agent-panel",
    title: "Agent Panel",
    group: "agents",
    description: "봇에게 일을 맡기는 입력창과 작업 목록을 담는 패널입니다.",
    story: "web-agentpanel--agent-tasks",
  },
  {
    slug: "task-row",
    title: "Task Row",
    group: "agents",
    description: "맡긴 작업의 진행, 검토, 실패, 완료 상태를 보여줍니다.",
    story: "web-taskrow--states",
  },
  {
    slug: "agent-lane",
    title: "Agent Lane",
    group: "agents",
    description: "나눠 맡긴 하위 봇 하나의 진행을 보여줍니다.",
    story: "web-agentlane--states",
  },
  {
    slug: "tool-call",
    title: "Tool Call",
    group: "agents",
    description: "봇이 부른 도구의 인자와 결과를 펼쳐 봅니다.",
    story: "web-toolcall--done",
  },
  {
    slug: "plan-step",
    title: "Plan Step",
    group: "agents",
    description: "실행 계획의 한 단계를 레일 위에 표시합니다.",
    story: "web-planstep--plan",
  },
  {
    slug: "source-row",
    title: "Source Row",
    group: "agents",
    description: "지식 소스의 수집·분할·임베딩 단계를 보여줍니다.",
    story: "web-sourcerow--states",
  },
];

export const componentCount = components.length;

export function componentBySlug(slug: string | undefined): ComponentEntry | undefined {
  return components.find((component) => component.slug === slug);
}

export function componentsInGroup(id: ComponentGroupId): ComponentEntry[] {
  return components.filter((component) => component.group === id);
}
