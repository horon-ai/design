/**
 * The component catalog. Every entry maps one file in
 * packages/web/src/components to its docs route, so the site cannot list a
 * component the library does not ship. `demo` names a file under
 * src/components/demos; a component without one renders its usage snippet and
 * a Storybook link instead of a live preview.
 */
export type ComponentGroupId = "inputs" | "display" | "navigation" | "overlays" | "layout";

export interface ComponentEntry {
  slug: string;
  title: string;
  group: ComponentGroupId;
  description: string;
  demo?: string;
  overlay?: boolean;
}

export const componentGroups: { id: ComponentGroupId; title: string; description: string }[] = [
  { id: "inputs", title: "입력과 선택", description: "사용자가 값을 입력하거나 선택지를 고르는 컨트롤입니다." },
  { id: "display", title: "표시", description: "데이터와 상태를 화면에 보여주는 컨트롤입니다." },
  { id: "navigation", title: "내비게이션", description: "화면과 섹션 사이를 이동하는 컨트롤입니다." },
  { id: "overlays", title: "오버레이", description: "현재 화면 위에 떠서 맥락을 보조하는 표면입니다." },
  { id: "layout", title: "레이아웃", description: "콘텐츠를 배치하고 감싸는 구조 컴포넌트입니다." },
];

export const components: ComponentEntry[] = [
  { slug: "button", title: "Button", group: "inputs", description: "동작을 실행하는 기본 버튼입니다. variant와 size로 계층과 크기를 정합니다.", demo: "button" },
  { slug: "button-group", title: "Button Group", group: "inputs", description: "여러 버튼을 하나의 표면으로 묶어 선택지를 나란히 보여줍니다." },
  { slug: "input", title: "Input", group: "inputs", description: "한 줄 텍스트를 입력받는 기본 필드입니다.", demo: "input" },
  { slug: "input-group", title: "Input Group", group: "inputs", description: "인풋 앞뒤에 아이콘·접두사·버튼을 붙여 하나의 컨트롤로 묶습니다." },
  { slug: "textarea", title: "Textarea", group: "inputs", description: "여러 줄 텍스트를 입력받습니다.", demo: "textarea" },
  { slug: "checkbox", title: "Checkbox", group: "inputs", description: "여러 항목을 독립적으로 켜고 끄는 선택 컨트롤입니다.", demo: "checkbox" },
  { slug: "radio-group", title: "Radio Group", group: "inputs", description: "여러 선택지 중 하나만 고르는 그룹입니다.", demo: "radio-group" },
  { slug: "switch", title: "Switch", group: "inputs", description: "즉시 반영되는 켜짐·꺼짐 상태를 전환합니다.", demo: "switch" },
  { slug: "slider", title: "Slider", group: "inputs", description: "연속된 범위에서 값을 끌어 정합니다.", demo: "slider" },
  { slug: "select", title: "Select", group: "inputs", description: "목록에서 하나를 고르는 드롭다운입니다.", demo: "select", overlay: true },
  { slug: "native-select", title: "Native Select", group: "inputs", description: "플랫폼 기본 선택 상자를 그대로 사용합니다." },
  { slug: "combobox", title: "Combobox", group: "inputs", description: "검색어로 목록을 좁혀 하나를 고릅니다.", demo: "combobox", overlay: true },
  { slug: "autocomplete", title: "Autocomplete", group: "inputs", description: "입력하는 동안 후보를 제안합니다.", demo: "autocomplete", overlay: true },
  { slug: "date-picker", title: "Date Picker", group: "inputs", description: "달력에서 날짜를 고르는 입력 컨트롤입니다.", demo: "date-picker" },
  { slug: "calendar", title: "Calendar", group: "inputs", description: "월 단위 달력 그리드입니다." },
  { slug: "input-otp", title: "Input OTP", group: "inputs", description: "한 글자씩 칸을 나눠 인증 코드를 입력받습니다.", demo: "input-otp" },
  { slug: "form", title: "Form", group: "inputs", description: "react-hook-form과 연결된 폼 필드 묶음입니다.", demo: "form" },
  { slug: "field", title: "Field", group: "inputs", description: "라벨·설명·오류를 하나의 필드로 묶는 레이아웃입니다.", demo: "field" },
  { slug: "label", title: "Label", group: "inputs", description: "컨트롤에 연결되는 접근성 라벨입니다." },
  { slug: "file-upload", title: "File Upload", group: "inputs", description: "끌어 놓기와 파일 선택을 지원하는 업로드 영역입니다.", demo: "file-upload" },
  { slug: "attachment", title: "Attachment", group: "inputs", description: "첨부된 파일을 아이콘·이름·크기와 함께 보여줍니다." },
  { slug: "questionnaire", title: "Questionnaire", group: "inputs", description: "여러 질문을 단계적으로 받는 설문 레이아웃입니다." },
  { slug: "toggle", title: "Toggle", group: "inputs", description: "한 번 눌러 켜고 끄는 단일 상태 버튼입니다." },
  { slug: "toggle-group", title: "Toggle Group", group: "inputs", description: "여러 토글을 묶어 하나 또는 여럿을 선택합니다.", demo: "toggle-group" },
  { slug: "alert", title: "Alert", group: "display", description: "중요한 안내를 제목과 본문으로 강조해 보여줍니다." },
  { slug: "badge", title: "Badge", group: "display", description: "상태나 분류를 짧은 라벨로 표시합니다.", demo: "badge" },
  { slug: "chip", title: "Chip", group: "display", description: "필터·태그처럼 지우거나 고를 수 있는 작은 라벨입니다." },
  { slug: "avatar", title: "Avatar", group: "display", description: "사용자나 대상을 원형 이미지와 이니셜로 표시합니다.", demo: "avatar" },
  { slug: "card", title: "Card", group: "display", description: "제목·본문·액션을 한 표면에 묶는 기본 컨테이너입니다.", demo: "card" },
  { slug: "table", title: "Table", group: "display", description: "행과 열로 데이터를 정렬해 보여줍니다.", demo: "table" },
  { slug: "data-table", title: "Data Table", group: "display", description: "정렬·필터·페이지 처리를 갖춘 표입니다." },
  { slug: "list", title: "List", group: "display", description: "항목을 세로로 나열하는 목록입니다.", demo: "list" },
  { slug: "item", title: "Item", group: "display", description: "아이콘·제목·설명·액션을 한 줄에 배치합니다." },
  { slug: "typography", title: "Typography", group: "display", description: "제목·본문·캡션 등 타입 스케일을 적용하는 텍스트입니다." },
  { slug: "kbd", title: "Kbd", group: "display", description: "키보드 입력을 키캡 모양으로 표시합니다." },
  { slug: "code-block", title: "Code Block", group: "display", description: "코드를 복사 버튼과 함께 보여줍니다." },
  { slug: "progress", title: "Progress", group: "display", description: "작업의 진행률을 막대로 보여줍니다.", demo: "progress" },
  { slug: "spinner", title: "Spinner", group: "display", description: "처리 중임을 알리는 회전 인디케이터입니다." },
  { slug: "skeleton", title: "Skeleton", group: "display", description: "콘텐츠가 로드되기 전 형태를 회색 면으로 보여줍니다.", demo: "skeleton" },
  { slug: "empty", title: "Empty", group: "display", description: "결과가 없을 때 아이콘과 안내 문구를 보여줍니다.", demo: "empty" },
  { slug: "aspect-ratio", title: "Aspect Ratio", group: "display", description: "자식 요소의 가로세로 비율을 고정합니다." },
  { slug: "separator", title: "Separator", group: "display", description: "구획 사이를 나누는 얇은 선입니다." },
  { slug: "marker", title: "Marker", group: "display", description: "목록이나 타임라인의 위치를 표시합니다." },
  { slug: "bubble", title: "Bubble", group: "display", description: "대화 말풍선을 보낸 사람 방향에 맞춰 그립니다." },
  { slug: "message", title: "Message", group: "display", description: "보낸 사람·시간·본문을 갖춘 대화 메시지입니다." },
  { slug: "message-scroller", title: "Message Scroller", group: "display", description: "대화 목록을 스크롤하며 최신 메시지로 이동합니다." },
  { slug: "tabs", title: "Tabs", group: "navigation", description: "같은 맥락의 화면을 탭으로 나눠 전환합니다.", demo: "tabs" },
  { slug: "breadcrumb", title: "Breadcrumb", group: "navigation", description: "현재 위치까지의 경로를 단계로 보여줍니다.", demo: "breadcrumb" },
  { slug: "pagination", title: "Pagination", group: "navigation", description: "여러 페이지를 번호로 나눠 이동합니다.", demo: "pagination" },
  { slug: "navigation-menu", title: "Navigation Menu", group: "navigation", description: "사이트 상단 내비게이션을 하위 메뉴와 함께 구성합니다.", overlay: true },
  { slug: "menubar", title: "Menubar", group: "navigation", description: "데스크톱 앱식 메뉴 모음을 만듭니다.", overlay: true },
  { slug: "sidebar", title: "Sidebar", group: "navigation", description: "앱의 좌측 내비게이션 패널을 구성합니다." },
  { slug: "stepper", title: "Stepper", group: "navigation", description: "여러 단계로 진행되는 흐름의 현재 위치를 보여줍니다.", demo: "stepper" },
  { slug: "command", title: "Command", group: "navigation", description: "명령 팔레트와 검색 목록을 제공합니다.", demo: "command", overlay: true },
  { slug: "dialog", title: "Dialog", group: "overlays", description: "화면 위에 뜨는 모달 대화상자입니다.", demo: "dialog", overlay: true },
  { slug: "alert-dialog", title: "Alert Dialog", group: "overlays", description: "되돌릴 수 없는 동작을 확인받는 대화상자입니다.", overlay: true },
  { slug: "sheet", title: "Sheet", group: "overlays", description: "화면 가장자리에서 밀려 나오는 패널입니다.", demo: "sheet", overlay: true },
  { slug: "drawer", title: "Drawer", group: "overlays", description: "모바일 하단에서 올라오는 시트입니다.", overlay: true },
  { slug: "popover", title: "Popover", group: "overlays", description: "트리거 옆에 뜨는 임의의 콘텐츠 패널입니다.", demo: "popover", overlay: true },
  { slug: "hover-card", title: "Hover Card", group: "overlays", description: "마우스를 올리면 대상의 요약 카드를 띄웁니다.", overlay: true },
  { slug: "tooltip", title: "Tooltip", group: "overlays", description: "짧은 설명을 커서 옆에 띄웁니다.", demo: "tooltip", overlay: true },
  { slug: "dropdown-menu", title: "Dropdown Menu", group: "overlays", description: "트리거에서 펼쳐지는 메뉴 목록입니다.", demo: "dropdown-menu", overlay: true },
  { slug: "context-menu", title: "Context Menu", group: "overlays", description: "오른쪽 클릭 위치에 뜨는 메뉴입니다.", overlay: true },
  { slug: "menu", title: "Menu", group: "overlays", description: "공용 메뉴 프리미티브로 항목·구분선·단축키를 그립니다.", overlay: true },
  { slug: "toast", title: "Toast", group: "overlays", description: "짧은 알림을 화면 구석에 잠시 띄웁니다.", demo: "toast", overlay: true },
  { slug: "sonner", title: "Sonner", group: "overlays", description: "sonner 기반 토스트 스택과 큐잉을 제공합니다.", overlay: true },
  { slug: "accordion", title: "Accordion", group: "layout", description: "접었다 펼 수 있는 섹션 묶음입니다.", demo: "accordion" },
  { slug: "collapsible", title: "Collapsible", group: "layout", description: "한 영역을 열고 닫습니다.", demo: "collapsible" },
  { slug: "resizable", title: "Resizable", group: "layout", description: "드래그로 패널 크기를 나눕니다.", demo: "resizable" },
  { slug: "scroll-area", title: "Scroll Area", group: "layout", description: "커스텀 스크롤바가 있는 스크롤 영역입니다." },
  { slug: "carousel", title: "Carousel", group: "layout", description: "콘텐츠를 좌우로 넘겨 봅니다.", demo: "carousel" },
  { slug: "direction", title: "Direction", group: "layout", description: "RTL·LTR 방향을 하위 트리에 적용합니다." },
  { slug: "glass-surface", title: "Glass Surface", group: "layout", description: "뒤 배경을 흐리는 유리 표면입니다.", demo: "glass" },
  { slug: "liquid-glass", title: "Liquid Glass", group: "layout", description: "baalda 헤더 레시피의 리퀴드 글래스 표면입니다.", demo: "glass" },
  { slug: "chart", title: "Chart", group: "layout", description: "recharts 기반 차트 컨테이너와 범례·툴팁입니다.", demo: "chart" },
];

export const componentCount = components.length;

export function componentBySlug(slug: string): ComponentEntry | undefined {
  return components.find((component) => component.slug === slug);
}

export function componentsInGroup(group: ComponentGroupId): ComponentEntry[] {
  return components.filter((component) => component.group === group);
}
