# HORON Design System

HORON 제품의 화면을 만드는 토큰과 React 컴포넌트, 그리고 그 값을 그대로 보여 주는 문서 사이트의 계약입니다. 색·간격·글자·모션·표면 값을 `@horon-ai/tokens` 한 곳에서 정의하고, `@horon-ai/react`와 `apps/site`가 그 값을 그대로 소비합니다. 이 문서의 모든 값은 저장소의 실제 토큰과 컴포넌트에서 읽었으며, 외부 레퍼런스 브랜드의 값을 빌려오지 않습니다.

Core v2 anchors: `experience`, `foundations`, `typography-assets`, `components-states`, `layout-platforms`, `content-locales`, `governance`.

## 1. Experience

**제품과 범위.** HORON Design System은 디자인과 코드가 같은 값을 바라보게 만드는 사내 디자인 시스템입니다. 표면은 두 가지입니다. 첫째, `@horon-ai/react`의 React 컴포넌트를 제품 화면에 바로 쓰는 라이브러리 표면. 둘째, `design.horon.ai`에서 토큰 값과 컴포넌트 프리뷰·사용법을 확인하는 문서 표면입니다. 이 문서는 두 표면, 그중에서도 문서 사이트의 셸과 페이지 구성을 규정합니다.

**핵심 과업.** 문서 사이트 방문자는 세 가지를 가장 빠르게 얻습니다.

1. 토큰 이름과 실제 값(색, 글자 크기, 반경, 간격, 유리 표면)을 찾습니다.
2. 컴포넌트의 변형과 상태를 라이브 프리뷰로 확인합니다.
3. 복사해 쓸 수 있는 사용 예시와 import 경로를 얻습니다.

따라서 모든 페이지는 "무엇을 하는 컴포넌트인가 → 어떻게 생겼는가 → 어떻게 쓰는가" 순서를 지킵니다. 마케팅 문구나 기능 소개보다 값과 예시가 먼저 옵니다.

**방향.** 잉크(`--color-text-primary`)와 종이(`--color-bg-default`)를 백본으로 두고, 하늘색(`--color-sky-500`, `--color-sky-700`)을 브랜드 액센트로 씁니다. 표면은 리퀴드 글래스 레이어로 깊이를 만들고, 그림자와 그라데이션으로 장식하지 않습니다. 문장은 짧고 건조하게, 화면은 값의 밀도가 드러나게 구성합니다.

**레퍼런스 권위.** HORON 자체 토큰·컴포넌트·README·`assets/README.md`가 유일한 권위입니다. 외부 브랜드의 색, 반경, 서체, 카피 톤을 가져오지 않습니다.

## 2. Foundations

### 2.1 색

색은 **프리미티브**와 **시맨틱** 두 층입니다. 프리미티브는 `--color-sky-50`부터 `--color-sky-950`, `--color-red-50`부터 `--color-red-950`, `--color-neutral-50`부터 `--color-neutral-950`, 그리고 `--color-mascot-ink`, `--color-mascot-cream`, `--color-mascot-gold`처럼 원시 값을 이름 붙인 것이고, 시맨틱은 컴포넌트가 실제로 참조하는 역할 이름입니다. 다크 모드에서는 시맨틱 값만 `.dark` 아래에서 바뀌고 프리미티브는 그대로입니다. 화면 코드는 프리미티브가 아니라 시맨틱 토큰을 씁니다.

| 역할 | 토큰 | 쓰는 곳 |
| --- | --- | --- |
| 페이지 바탕 | `--color-bg-default` (`bg-bg-default`) | 문서 본문, 헤더 바탕 |
| 올라온 표면 | `--color-bg-surface` (`bg-bg-surface`) | 불투명 카드, 입력의 solid 표면 |
| 낮은 바탕 | `--color-bg-subtle` (`bg-bg-subtle`), `--color-bg-inset` (`bg-bg-inset`) | 코드 칩, 현재 항목, 데모 스테이지 |
| 브랜드 바탕 | `--color-bg-brand` (`bg-bg-brand`) | 선택·강조 영역의 옅은 바탕 |
| 기본 글자 | `--color-text-primary` (`text-text-primary`) | 제목, 강조 본문 |
| 보조 글자 | `--color-text-secondary` (`text-text-secondary`) | 본문, 설명, 캡션 |
| 브랜드 글자 | `--color-text-brand` (`text-text-brand`) | 링크 밑줄, 브랜드 라벨, 포커스 링 |
| 위험 | `--color-text-danger` (`text-text-danger`), `--color-bg-danger` (`bg-bg-danger`), `--color-border-danger` (`border-border-danger`) | 오류 문구, 위험 배너 |
| 기본 테두리 | `--color-border-default` (`border-border-default`), `--color-border-strong` (`border-border-strong`) | 구분선, 입력 테두리 |
| 포커스 | `--color-border-focus` (`border-border-focus`), `outline-text-brand` | 키보드 포커스 |
| 상호작용 | `--color-interactive-primary` (`bg-interactive-primary`), `--color-interactive-primary-hover`, `--color-interactive-primary-pressed`, `--color-interactive-on-primary` (`text-interactive-on-primary`) | Primary 버튼 |
| 상태 | `--color-status-live` (`bg-status-live`), `--color-accent-sky-500-18`, `--color-accent-red-500-14` | 라이브 점, 브랜드·위험 배지 바탕 |
| 유리 | `--color-glass-clear` (`bg-glass-clear`), `--color-glass-regular` (`bg-glass-regular`), `--color-glass-thick` (`bg-glass-thick`), `--color-glass-fill-frost` (`bg-glass-fill-frost`), `--color-glass-fill-solid` (`bg-glass-fill-solid`) | 리퀴드 글래스 표면 |
| 유리 테두리 | `--color-glass-border` (`border-glass-border`), `--color-glass-rim-strong` (`border-glass-rim-strong`) | 유리 가장자리 |
| 겹침 | `--color-overlay-ink-4`, `--color-overlay-ink-5`, `--color-overlay-ink-6`, `--color-overlay-ink-10`, `--color-overlay-ink-20`, `--color-overlay-ink-30` (`bg-overlay-ink-6` 등) | 호버·선택·스크림 |
| 코드 | `--color-syntax-key` (`text-syntax-key`), `--color-syntax-string`, `--color-syntax-number`, `--color-syntax-punctuation` | `CodePanel` 토큰 강조 |

**대비.** 토큰 값으로 WCAG 대비를 계산했습니다. 라이트 모드에서 `text-primary`/`bg-default`는 17.77:1, `text-secondary`/`bg-default`는 6.22:1, `text-brand`/`bg-default`는 6.60:1, `text-danger`/`bg-danger`는 6.48:1입니다. 다크 모드에서 같은 조합은 18.73:1, 9.12:1, 12.03:1, 9.47:1입니다. 본문·보조 문구·링크는 모두 WCAG AA 본문 기준(4.5:1)을 넘습니다. 비활성 글자(`--color-text-disabled`)는 정보를 전달하지 않는 상태 표시에만 씁니다.

**금지.** hex·rgba 리터럴, `style={{ color }}`, 임의의 색 클래스(`bg-[#...]`)를 쓰지 않습니다. 색이 필요하면 토큰을 추가하고 `theme.css`를 다시 생성합니다.

### 2.2 간격과 밀도

간격 스케일은 `spacing` 객체의 `0.5`, `1`, `1.5`, `2`, `2.5`, `3`, `3.5`, `4`, `5`, `6`, `8` 키에 2, 4, 6, 8, 10, 12, 14, 16, 20, 24, 32px로 들어 있습니다. Tailwind 기본 4px 단위와 같아서 `p-*`, `gap-*`, `space-*`가 그대로 맞습니다. 스케일 밖 값(예: 18px, 30px)을 쓰지 않습니다.

문서는 **편안한 밀도**를 기준으로 합니다. 본문 문단 사이는 `--paragraph-body-md`(0.75em), 섹션 사이는 4rem, 컴포넌트 데모 주변은 1.5rem입니다. 컨트롤 높이는 32px(sm), 40px(md), 48px(lg) 세 단계이고, 44px 터치 타깃은 실제 크기를 바꾸지 않고 의사 요소로 넓힙니다.

### 2.3 반경

| 토큰 | 값 | 쓰는 곳 |
| --- | --- | --- |
| `--radius-xs` (`rounded-xs`) | 6px | `Kbd`, 작은 상태 칩, 스켈레톤 블록 |
| `--radius-sm` (`rounded-sm`) | 8px | 툴팁, 작은 타일 |
| `--radius-md` (`rounded-md`) | 12px | 입력, 메뉴 항목, 사이드바 행 |
| `--radius-lg` (`rounded-lg`) | 14px | 토스트, 큰 행 |
| `--radius-xl` (`rounded-xl`) | 20px | 카드, 다이얼로그, 메뉴 팝업, 브레드크럼 트레이 |
| `--radius-2xl` (`rounded-2xl`) | 16px | 스켈레톤 카드, 중간 표면 |
| `--radius-full` (`rounded-full`) | 9999px | 버튼, 칩, 배지, 세그먼트, 아바타 |

주의: `--radius-2xl`(16px)이 `--radius-xl`(20px)보다 작습니다. 이름 순서가 아니라 값으로 고릅니다. 카드·다이얼로그는 `rounded-xl`, 입력·메뉴 행은 `rounded-md`, 알약형 컨트롤은 `rounded-full`입니다.

### 2.4 깊이와 그림자

유리 표면은 그림자 대신 테두리·림·배경 흐림으로 떠 보입니다. 그림자는 유리 위에 다시 뜨는 **불투명** 표면에만 씁니다. `--shadow-popover`는 계정·워크스페이스 메뉴, `--shadow-palette`는 커맨드 팔레트입니다. 임의의 `box-shadow` 값을 만들지 않습니다.

### 2.5 리퀴드 글래스

유리는 채움색 위에 레이어를 겹친 표면입니다. `LiquidGlass`가 Figma `Liquid layers`의 비율을 그대로 재현하며, 레이어 묶음 전체가 `--glass-layer-opacity`(0.5)로 그려집니다. 흐림과 안쪽 음영은 호스트 높이에 비례합니다.

| 등급 | 채움 토큰 | 쓰는 곳 |
| --- | --- | --- |
| clear | `--color-glass-clear` (`bg-glass-clear`) | Glass 버튼, 아이콘 버튼, 칩 |
| regular | `--color-glass-regular` (`bg-glass-regular`) | 배너, 탭 트레이, 입력, 브레드크럼, 페이지 헤더, 토스트, 탑 바 |
| thick | `--color-glass-thick` (`bg-glass-thick`) | 사이드바, 메뉴, 카드, 다이얼로그, 커맨드 팔레트 |

레이어 값은 `--glass-tint`, `--glass-tint-blur`, `--glass-inner-shade`, `--glass-inner-shade-blur`, `--glass-edge-dark`, `--glass-edge-light`, `--glass-edge-light-soft`가 소유합니다. 칩은 `texture` 레이어를 하나 더 얹습니다. 배경을 굴절시킬 수 없는 엔진(Safari, iOS 전체, Firefox)은 rim sheen으로 가장자리를 대신하고, `prefers-reduced-transparency: reduce` 또는 `backdrop-filter` 미지원 환경은 `bg-glass-fill-frost` 불투명 표면으로 떨어집니다.

### 2.6 모션

| 유틸리티 | 용도 | 시간 |
| --- | --- | --- |
| `motion-colors` | 색·테두리·불투명도 피드백 | 150ms ease-out |
| `motion-press` | 누르는 컨트롤의 색 피드백과 `scale(0.97)` | 150ms `--ease-out-quint` |
| `motion-popup` | 메뉴·셀렉트·툴팁·다이얼로그 진입/이탈 | 200ms in, 130ms out |
| `motion-fade` | 스크림·배경 페이드 | 200ms ease-out |
| `motion-collapse` | 접히는 패널 높이 | 240ms `--ease-out-quint` |
| `motion-indicator` | 탭·세그먼트 선택 표시 이동 | 280ms `--ease-emphasized` |
| `motion-rise` | 패널·행 진입 | 220ms `--ease-out-quint` |

이징은 `--ease-out-quint`, `--ease-emphasized`, `--ease-spring` 세 개만 씁니다. `prefers-reduced-motion: reduce`에서는 모든 애니메이션·전환이 0.01ms로 줄고 반복 애니메이션은 한 번만 재생됩니다. 문서 사이트는 스크롤 위치 이동에만 `scroll-behavior: smooth`를 쓰고, 이 설정에서도 즉시 이동으로 바뀝니다.

## 3. Typography & Assets

### 3.1 서체와 굵기

본문은 **Pretendard Variable**, 코드는 **Geist Mono Variable**입니다. 폴백은 `--font-sans`가 `Pretendard Variable, Pretendard, system-ui, sans-serif`, `--font-mono`가 `Geist Mono Variable, Geist Mono, ui-monospace, monospace`입니다. 굵기는 `--font-weight-regular`(400), `--font-weight-medium`(500), `--font-weight-semibold`(600), `--font-weight-bold`(700) 네 개만 씁니다. Thin과 Light는 제품에 없습니다.

### 3.2 글자 스타일 13개

크기와 줄 높이는 픽셀, 자간과 문단 간격은 em입니다. 웹 값이 문서 사이트의 기준입니다.

| 스타일 | 웹 | 데스크톱 | 모바일 | 굵기 | 자간 |
| --- | --- | --- | --- | --- | --- |
| `display-lg` | 56 / 68 | 48 / 58 | 36 / 44 | 700 | -0.03em |
| `display-md` | 44 / 52 | 40 / 48 | 30 / 36 | 700 | -0.025em |
| `title-lg` | 32 / 40 | 28 / 36 | 24 / 32 | 600 | -0.02em |
| `title-md` | 24 / 32 | 22 / 28 | 20 / 28 | 600 | -0.015em |
| `title-sm` | 20 / 28 | 18 / 26 | 18 / 26 | 600 | -0.01em |
| `body-lg` | 18 / 30 | 16 / 26 | 17 / 28 | 400 | -0.008em |
| `body-md` | 16 / 26 | 14 / 22 | 16 / 26 | 400 | -0.005em |
| `body-sm` | 14 / 22 | 13 / 20 | 14 / 22 | 400 | -0.002em |
| `label-lg` | 16 / 22 | 14 / 20 | 16 / 22 | 500 | -0.005em |
| `label-md` | 14 / 20 | 13 / 18 | 14 / 20 | 500 | -0.003em |
| `label-sm` | 12 / 16 | 11 / 16 | 12 / 16 | 500 | 0 |
| `caption` | 12 / 18 | 11 / 18 | 12 / 18 | 400 | 0.005em |
| `code` | 14 / 22 | 13 / 20 | 13 / 20 | 400 | 0 |

`code`만 `--font-mono`를 씁니다. 각 스타일의 CSS 변수는 `--text-display-lg`, `--text-title-md`, `--text-body-md`, `--text-label-sm`, `--text-caption`, `--text-code`처럼 이름이 같고, Tailwind 유틸리티는 `text-display-lg`, `text-title-md`, `text-body-md`, `text-label-sm`, `text-caption`, `text-code`입니다. 유틸리티가 크기·줄 높이·자간·굵기를 함께 설정합니다.

### 3.3 문서 사이트의 역할별 유틸리티

다른 노드는 아래 이름을 그대로 씁니다. 임의의 `text-[...]`, `font-medium`, `leading-*` 조합으로 같은 모양을 다시 만들지 않습니다.

| 역할 | 유틸리티 | 색 |
| --- | --- | --- |
| 페이지 제목(h1) | `text-display-md` | `text-text-primary` |
| 히어로 제목(랜딩) | `text-display-lg` | `text-text-primary` |
| 리드 문단 | `text-body-lg` | `text-text-secondary` |
| 섹션 제목(h2) | `text-title-md` | `text-text-primary` |
| 하위 제목(h3) | `text-title-sm` | `text-text-primary` |
| 본문 | `text-body-md` | `text-text-secondary` |
| 강조 본문 | `text-body-md` | `text-text-primary` |
| 캡션·메타 | `text-caption` | `text-text-secondary` |
| UI 라벨 | `text-label-md` | `text-text-primary` |
| 코드 | `text-code` | `text-syntax-string` |

문단 사이는 `--paragraph-body-lg`, `--paragraph-body-md`, `--paragraph-body-sm`(각 0.75em)로 띄웁니다. 빈 `<br>`이나 임의 마진으로 문단을 나누지 않습니다.

### 3.4 플랫폼 모드

`data-platform="desktop"` 또는 `data-platform="mobile"`을 상위 요소에 두면 `--text-*` 값이 해당 플랫폼 표로 바뀝니다. 이는 제품의 데스크톱 앱·모바일 웹을 위한 것이며, 문서 사이트의 반응형 분기와 다릅니다. 문서 사이트는 `data-platform`을 설정하지 않고 웹 값을 씁니다.

### 3.5 자산

- **아이콘.** `@phosphor-icons/react`를 기본 세트로 쓰고, HORON 고유 표식은 `HoronIcon`(라인 팔콘 눈, `currentColor`, `size` prop)을 씁니다. 다른 아이콘 세트를 섞지 않습니다.
- **워드마크.** `HoronWordmark`는 `currentColor` 벡터이고 기본 높이 11.5px입니다. 텍스트로 "HORON"을 다시 조판하지 않습니다.
- **마스코트.** `assets/horon-mascot-*.png` 26컷, 1254×1254 RGBA 투명 배경. 팔레트는 `--color-mascot-ink`(#1c1a17), `--color-mascot-cream`(#fbf7f0), `--color-mascot-gold`(#e0921f)입니다. 문서 사이트는 `apps/site/public/mascots/*.webp`로 변환한 파일을 씁니다.
- **메타 이미지.** `og.png`(1200×630), `icon.png`(256), `icon-512.png`, `apple-icon.png`(180), `favicon.ico`.
- **라이선스.** Pretendard는 SIL Open Font License 1.1, Geist Mono는 SIL Open Font License 1.1입니다. 마스코트는 저장소가 소유한 브랜드 자산이며 `assets/README.md`에 제작 경위가 있습니다. 저장소 밖 재배포 조건은 별도 라이선스 파일로 선언되어 있지 않습니다.

## 4. Components & States

### 4.1 소비 규칙

`@horon-ai/react`는 단일 진입점(`"."`)과 하위 경로(`@horon-ai/react/components/<name>`)를 함께 제공합니다. 문서 사이트는 엔트리에서 `@horon-ai/react/globals.css`를 한 번 불러오고, 모든 시각·상호작용 요소를 라이브러리 컴포넌트로 렌더합니다. `className`은 레이아웃(마진, 너비·최대 너비, flex/grid 배치, 반응형 표시, sticky 위치)에만 허용하고 색·반경·패딩·높이·서체·그림자·배경을 덮지 않습니다.

### 4.2 컴포넌트 목록 (82개)

카탈로그는 `apps/site/src/data/components.ts`가 소유하며, 라이브러리에 없는 컴포넌트를 사이트가 나열할 수 없습니다.

- **입력과 선택 (22).** Button, Icon Button, Input, Textarea, Field, Textarea Field, Input Group, Select, Checkbox, Radio Group, Switch, Slider, Chip, Segmented Control, Date Field, Calendar, Schedule, Composer, Split Button, Tool Permissions, File Drop, Choice Card.
- **표시 (23).** Badge, Avatar, Card, Banner, Kbd, Progress, Usage Meter, Spinner, Skeleton, Empty State, Data Table, Integration Row, Liquid Glass, Flue Background, Horon Icon, Horon Wordmark, Settings List, MCP Server Row, Directory Card, Plugin Row, Marketplace Card, List Detail, Code Panel.
- **내비게이션 (8).** Tabs, Tab Bar, Breadcrumb, Sidebar, Page Header, Top Bar, Breadcrumb Header, Filter Bar.
- **오버레이 (7).** Dialog, Bottom Sheet, Menu, Tooltip, Toast, Command Palette, Workspace Menu.
- **대화 (5).** Chat Bubble, Approval Card, Bot List Row, Chat Controls, Message Extras.
- **에이전트 (17).** Agent Activity, Agent Panel, Task Row, Agent Lane, Tool Call, Plan Step, Source Row, Orchestrator Panel, Plan Card, Knowledge Base Panel, Agent Steering Panel, Agent Lanes Timeline, Bot Instructions Panel, Document Extract Panel, Bot Memory Panel, Research Run Panel, Tool Calls Header.

### 4.3 주요 변형

| 컴포넌트 | 변형·크기 | 메모 |
| --- | --- | --- |
| `Button` | `primary`, `glass`, `danger`, `link` × `sm`, `md`, `lg` | `link`은 크기 독립. 아이콘은 16/20px |
| `IconButton` | `primary`, `ghost`, `glass` × `sm`, `md`, `lg` | `label` 필수, 원형 |
| `Input` | `md`, `lg` × `glass`, `solid`, `solid-on-page`, `invalid` | `Field` 안에서는 `invalid`가 자동 전파 |
| `Chip` | pressed/unpressed 토글 | 선택 시 체크와 `border-border-brand` |
| `SegmentedControl` | `sm`, `md`, `lg`, `tab` × `glass`, `inset`, `inset-faint`, `subtle` | 선택 표시는 하나의 이동 pill |
| `Tabs` | `TabsList`, `TabsTab`(icon/count), `TabsPanel` | 선택 표시는 `motion-indicator` |
| `Menu` | `glass`, `solid`, `paper` | `MenuContent`, `MenuItem`, `MenuTrigger` |
| `Card` | `glass`, `frost` + `interactive`, `selected` | 카드 전체가 링크·버튼이 될 수 있음 |
| `Badge` | `neutral`, `brand`, `danger`, `solid` + `dot` | 22px 알약 |
| `Banner` | `info`, `danger` + `action` | regular glass, `role="status"`/`alert` |
| `Toast` | `neutral`, `success`, `danger` | `Toaster` + `useToast` |
| `Dialog` | `glass`, `solid` | 제목·설명·닫기 필수 |
| `Sidebar` | `glass`, `photo` + `resizable` | `SidebarHeader`, `SidebarItem`, `SidebarGroup`, `SidebarTree`, `SidebarAccount` |
| `EmptyState` | `illustration`, `title`, `description`, `action` | 140px 마스코트 |
| `Skeleton` | `block`, `pill` + `SkeletonCard` `row`, `card`, `text` | `aria-hidden`, `SkeletonCard`는 `role="status"` |
| `Tooltip` | `top`, `bottom`, `left`, `right` | ink bubble, 8px 반경 |
| `CommandPalette` | `groups`, `hints`, `trigger` | 560px frost dialog |
| `CodePanel` | `CodeKey` 강조 | Geist Mono 12/21, neutral-50 바탕 |

### 4.4 상태 매트릭스

상호작용 컴포넌트는 아래 상태를 실제로 갖습니다. 해당하지 않는 상태는 이유와 함께 생략합니다.

| 상태 | 적용 대상 | 구현 |
| --- | --- | --- |
| default | 모든 컴포넌트 | 토큰 기본값 |
| hover | 버튼, 링크, 행, 메뉴 항목, 입력 | `motion-colors`, overlay 또는 hover 토큰 |
| pressed/active | 버튼, 칩, 세그먼트, 탭 | `motion-press`, `bg-interactive-primary-pressed`, `data-pressed` |
| focus-visible | 모든 포커스 가능 요소 | 2px 실선 링과 2px 오프셋, `outline-text-brand` |
| disabled | 버튼, 입력, 선택 컨트롤 | `data-disabled:opacity-40`, `cursor-not-allowed` |
| selected/current | 칩, 탭, 세그먼트, 사이드바, 카드 | `data-pressed`, `data-active`, `aria-current="page"`, `data-selected` |
| invalid/error | 입력, 필드 | `data-invalid`, `border-border-danger`, `aria-invalid` |
| loading | 데이터 표시, 제출 버튼 | `Skeleton`, `Spinner`, 버튼 비활성 |
| empty | 목록, 검색 결과, 데모 없음 | `EmptyState` + 마스코트 |
| success | 토스트, 배너 성공 메시지 | `Toast` `success`, `Banner`는 info/danger만 |

`Card`처럼 비상호작용인 표면에는 focus 상태를 억지로 만들지 않습니다. `Button`에 success 변형은 없고, 성공 피드백은 `Toast`가 맡습니다.

### 4.5 문서 사이트 매핑

- 헤더의 텍스트 링크는 `Button variant="link"`, 테마·검색·메뉴 트리거는 `IconButton`을 씁니다.
- 검색은 `CommandPalette`를 엽니다.
- 왼쪽 문서 목차는 `Sidebar` + `SidebarItem`(`href` 지원), 그룹은 `SidebarGroup`입니다.
- 현재 위치는 `Breadcrumb` + `BreadcrumbItem current`입니다.
- 컴포넌트 페이지 상단은 `PageHeader`, 데모가 없을 때는 `EmptyState`, 코드는 `CodePanel` + `CodeKey`입니다.
- 로딩 자리표시자는 `Skeleton`, 알림은 `Banner`, 일시 피드백은 `Toast`, 도움말은 `Tooltip`입니다.
- 브랜드 표식은 `HoronIcon`·`HoronWordmark`입니다. 헤더와 푸터의 로고가 이 두 컴포넌트이고, 마스코트는 홈·Get Started·Mascot 페이지에서 `assets` 이미지로 씁니다.

## 5. Layout & Platforms

### 5.1 셸

문서 사이트는 **고정 상단 헤더 + 왼쪽 문서 사이드바 + 가운데 본문 + 오른쪽 페이지 목차**의 4영역 셸입니다.

- **헤더.** `fixed inset-x-0 top-0 z-50`, 높이 64px(`h-16`), `md`부터 76px(`md:h-19`). 바탕은 `bg-bg-default`, 아래 경계는 `border-border-default`. 왼쪽에 `HoronIcon`·`HoronWordmark`·"Design System", 가운데에 주요 섹션 내비게이션(`md` 이상), 오른쪽에 언어 전환·검색·테마·모바일 메뉴를 둡니다. 헤더는 스크롤해도 사라지지 않습니다.
- **브랜드 링크.** 홈으로 가는 로고 링크는 정적 Astro 마크업이고, 포커스는 2px 브랜드 링(`focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-brand`)입니다. 그 오른쪽의 내비게이션·컨트롤만 React 아일랜드입니다.
- **푸터.** 푸터는 아일랜드가 아닌 정적 마크업입니다. 소개문·링크 라벨은 `T.astro`와 같은 `data-locale-text` 두 span으로 렌더하고 `src/styles/i18n.css`가 비활성 언어를 숨기며, 저작권 연도는 빌드 시점 값입니다.
- **본문 여백.** `body`의 위 패딩은 헤더 높이와 같게 두고, 앵커 이동 시 `scroll-margin-top`을 헤더보다 크게 잡습니다.
- **문서 영역.** `lg`부터 왼쪽 사이드바 240px(`w-60`)는 헤더 아래 왼쪽에 `fixed`로 고정하고 자체 스크롤을 갖습니다. 가운데 본문은 `flex-1 min-w-0`, `xl`부터 오른쪽 목차 200px(`w-50`)는 `sticky top-19`입니다. 목차 열은 목차가 비거나 꺼진 페이지에서도 자리를 지켜, 페이지를 옮겨도 본문이 좌우로 움직이지 않습니다.
- **한 가지 틀.** 홈과 404를 뺀 모든 페이지(Get Started, Foundations, Components, Mascot, Updates)는 `DocsLayout` 하나를 씁니다. 별도 컨테이너나 넓은 페이지 변형은 두지 않습니다.
- **본문 폭.** 문서 본문은 최대 900px(`max-w-225`)이고 가운데 정렬합니다. 좌우 여백은 모바일 16px(`px-4`), `md`부터 24px(`md:px-6`)입니다.
- **세로 리듬.** 모든 문서 페이지는 경로 표시(`홈 / 섹션 / 페이지`) → 제목 → 리드 → 본문 순서이고, 경로 표시를 생략하지 않아 제목 높이가 페이지마다 같습니다. 섹션 제목은 위 4rem, 아래 1.5rem, 하위 제목은 위 2.5rem, 아래 1rem입니다. 페이지 하단에는 푸터를 둡니다.

### 5.2 반응형

| 구간 | 헤더 | 사이드바 | 목차 | 본문 |
| --- | --- | --- | --- | --- |
| `< md` (320–767) | 로고·언어·검색·메뉴, 섹션 내비는 접힌 패널 | `details` 요약 "목차"로 접힘 | 숨김 | 전체 폭, 16px 여백 |
| `md`–`lg` (768–1023) | 가운데 섹션 내비 노출, 모바일 메뉴 숨김 | `details` 요약 "목차" | 숨김 | 전체 폭, 24px 여백 |
| `lg`–`xl` (1024–1279) | 동일 | 240px 고정, sticky | 숨김 | 남은 폭, 최대 900px |
| `≥ xl` (1280+) | 동일 | 240px 고정, sticky | 200px 고정, sticky | 남은 폭, 최대 900px |

- **모바일 우선.** 320px에서 가로 스크롤이 생기지 않아야 합니다. 표와 `CodePanel`은 자체적으로 가로 스크롤하고 페이지를 밀지 않습니다.
- **터치.** 버튼과 아이콘 버튼은 최소 44×44px 터치 영역을 갖습니다. 작은 시각 크기는 의사 요소로 도달 영역만 넓힙니다. 텍스트 링크와 탭은 충분한 줄 간격·패딩으로 도달 영역을 확보합니다.
- **200% 확대.** 320px 폭 기준 200% 확대에서도 읽기 순서(제목 → 리드 → 본문 → 목차)가 유지되고, 고정 헤더가 본문을 가리지 않아야 합니다.
- **키보드.** 헤더 → 사이드바 → 본문 → 목차 순서로 포커스가 이동하고, 모든 포커스에 2px 브랜드 링이 보입니다.

### 5.3 플랫폼과 테마

문서 사이트는 웹 플랫폼 하나입니다. 제품의 데스크톱·모바일 글자 크기는 `data-platform`으로 전환하는 별도 표면이고, 문서의 반응형 브레이크포인트와 섞지 않습니다. 다크 모드는 `<html class="dark">`로 전환하고 `localStorage` 키 `horon-theme`에 저장합니다. 첫 페인트 전 인라인 스크립트가 저장값 또는 `prefers-color-scheme`을 읽어 클래스를 정합니다. 테마 색은 `--color-bg-default`의 라이트·다크 값과 맞춥니다.

## 6. Content & Locales

### 6.1 로케일 모델

- 지원 로케일은 `ko`(기본, canonical)와 `en` 둘입니다.
- **경로 기반 로케일은 쓰지 않습니다.** `/en/` 라우트, Astro i18n 라우팅, `localizePath`가 없습니다. 한 페이지에 URL 하나입니다.
- 언어는 헤더의 언어 버튼으로 바꾸고, 선택은 `localStorage` 키 `horon-locale`에 저장합니다.
- 첫 페인트 전 인라인 스크립트가 `<html lang>`과 `<html data-locale>`을 정합니다. 잘못된 값은 `ko`로 떨어집니다.
- 정적 Astro 텍스트는 `T.astro`가 ko/en 두 `<span data-locale-text>`를 렌더하고, `src/styles/i18n.css`가 비활성 로케일을 숨깁니다. JavaScript 없이 전환됩니다.
- 아일랜드가 아닌 정적 React 컴포넌트(푸터, 카탈로그 카드, 코드 블록, 복사 버튼)도 같은 두 span을 씁니다. 이들은 `useLocale()`을 쓰지 않으므로 첫 HTML부터 현재 언어가 맞습니다.
- React 아일랜드는 `useLocale()`과 `pick(entry, locale)`로 문자열을 고릅니다. 서버 스냅샷은 `ko`입니다.
- 주석이 로케일마다 다른 코드 샘플은 `CodeBlock`에 `Localized`를 넘겨 패널 두 개를 렌더합니다.
- 날짜를 그리는 `Calendar`·`DateField`는 `localeTags`의 BCP47 태그(`ko-KR`/`en-US`)를 받습니다. 브라우저 기본 로케일을 따르지 않습니다.
- 모든 문자열은 모듈별 `src/i18n/messages/<module>.ts`의 `defineMessages`가 소유합니다. 한국어가 원문이고 영어는 로케일 적응입니다.

### 6.2 문체

**한국어(ko, canonical).** 간결한 다나까체. 문장은 `~합니다`, `~입니다`로 끝맺고, `~해요`·`~하자`·감탄문을 쓰지 않습니다. 기술 용어는 첫 등장에만 풀어 쓰고 이후에는 같은 표기를 유지합니다. 제품·컴포넌트 이름은 원어를 유지합니다(Button, Token, Sidebar). "정말", "아주", "다양한", "핵심적인" 같은 강조어를 넣지 않고 값과 동작으로 말합니다. 명령형 안내는 "~하세요" 대신 "~합니다" 또는 "~를 씁니다"로 씁니다.

**영어(en).** Action-first, plain English. 첫 문장은 동작이나 결과로 시작합니다("Copy the token name", "Open the preview"). 슬로건, 마케팅 형용사, "simply/just/seamless"를 쓰지 않습니다. 한국어 원문에 없는 사실·수치·약속을 더하지 않습니다. 제목은 sentence case, 제품·컴포넌트 이름은 대문자를 유지합니다. UI 라벨은 가능하면 동사 원형으로 시작합니다.

### 6.3 용어

| 한국어 | 영어 | 금지 |
| --- | --- | --- |
| 토큰 | token | "변수"를 UI 이름으로 쓰지 않음 |
| 컴포넌트 | component | "위젯" |
| 파운데이션 | Foundations | "기초"를 섹션 이름으로 쓰지 않음 |
| 문서 | docs | "documentation"을 라벨에 쓰지 않음 |
| 미리보기 | Preview | "데모"를 섹션 제목으로 쓰지 않음 |
| 사용법 | Usage | "사용 방법" |
| 목차 | On this page | "컨텐츠" |
| 테마 | Theme | "모드" |
| 언어 | Language | "로케일"을 UI 라벨로 쓰지 않음 |
| 검색 | Search | "찾기" |
| 복사 | Copy | "클립보드에 저장" |
| 이전 / 다음 | Previous / Next | "뒤로 / 앞으로" |
| 비활성 | Disabled | "사용 불가" |

### 6.4 조판과 확장

- 한국어 본문은 `word-break: keep-all`로 단어 단위 줄바꿈을 합니다. 영어는 기본 줄바꿈을 씁니다.
- 두 로케일 모두 Pretendard를 쓰고 로케일별 서체를 따로 두지 않습니다.
- 영어 문자열이 한국어보다 길어질 수 있으므로 버튼·탭·배지에는 `whitespace-nowrap`을 쓰되, 본문·설명은 줄바꿈을 허용합니다. 고정 높이 안에 긴 영어를 가두지 않습니다.
- 숫자·단위·코드 이름은 번역하지 않습니다. `px`, `rem`, `em`, 토큰 이름, import 경로는 그대로 둡니다.
- 정적 Astro의 `aria-label`·`placeholder`는 아일랜드 밖이면 한국어 문자열을 씁니다. 이 제약은 알려진 접근성 한계이며, 아일랜드 안에서는 `pick()`으로 로케일을 따릅니다.
- 언어 전환은 페이지를 새로 고치지 않고, 현재 URL과 스크롤 위치를 유지합니다.

## 7. Governance

### 7.1 권위 순서

1. `packages/tokens/src/*.ts` — 색·글자·반경·간격·유리·그림자의 유일한 정본.
2. 생성된 `packages/tokens/theme.css` — `src`에서만 생성. 손으로 고치지 않음.
3. `packages/react/src` — 토큰을 소비하는 컴포넌트. 자체 색·크기 리터럴을 만들지 않음.
4. `apps/site` — 라이브러리와 토큰을 소비하는 문서 표면. 시각 값을 새로 정의하지 않음.
5. 이 문서 — 위 네 층의 계약을 요약. 값의 정본이 아니라 사용 규칙의 정본.

값을 바꾸려면 Figma `Horon` 파일(Components `54:81`, Typography `26:2`)에서 읽어 `packages/tokens/src`를 고치고, `bun run --filter @horon-ai/tokens build`로 `theme.css`를 다시 생성한 뒤, 컴포넌트와 사이트가 같은 유틸리티를 쓰는지 확인합니다. 드리프트 가드 테스트가 `theme.css`와 `src`의 불일치를 잡습니다.

### 7.2 상속 규칙

- 시각·상호작용 요소에 `@horon-ai/react` 대응물이 있으면 **반드시 그 컴포넌트를 씁니다**. 원시 `<button>`, `<a>` 스타일링, 자체 CSS 버튼을 만들지 않습니다.
- 라이브러리 컴포넌트의 `className`은 레이아웃에만 씁니다: 마진, 너비·최대 너비, flex/grid 배치, 반응형 표시(`hidden md:flex`), sticky 위치.
- 색, 반경, 패딩, 높이, 서체, 그림자, 배경을 `className`으로 덮지 않습니다. 인라인 `style`과 Tailwind 임의값(`[...]`), hex/px 리터럴을 쓰지 않습니다.
- `apps/site/src/styles/site.css`에 새 규칙을 추가하지 않습니다. 셸 노드가 끝나면 이 파일의 시각 규칙은 제거됩니다. 남는 것은 `@source`, 기본 `body` 바탕, 스크롤·선택 스타일 같은 문서 전역뿐입니다.
- 새 컴포넌트가 필요하면 `packages/react/src/components/<name>.tsx`에 Base UI로 만들고, `index.ts`에 넣고, `apps/site/src/data/components.ts`와 데모를 추가합니다. 사이트에만 있는 컴포넌트를 만들지 않습니다.

### 7.3 예외와 금지

- 예외는 레이아웃 컨테이너의 폭·배치뿐입니다. 데모 스테이지의 최소 높이처럼 문서 표면의 구조 값은 허용하지만, 색·타이포·표면 값은 토큰과 컴포넌트가 소유합니다.
- "임시로" hex를 넣거나, 라이브러리 컴포넌트를 복사해 사이트에서 고치지 않습니다. 고칠 필요가 있으면 라이브러리를 고치고 모든 소비자가 함께 갱신됩니다.
- `theme.css` 직접 편집, `site.css`에 컴포넌트 재정의 추가, `!important`로 라이브러리 스타일 덮기를 금지합니다.
- 값이 없으면 가장 가까운 값을 흉내 내지 않고 토큰을 추가합니다. 세 플랫폼(Web·Desktop·Mobile) 값을 함께 추가하는 것이 규칙입니다.

### 7.4 출처와 미해결

- 이 문서의 모든 토큰·컴포넌트·구조 값은 `packages/tokens`, `packages/react/src`, `apps/site/src/pages/foundations`, `README.md`, `assets/README.md`에서 확인한 `repository-fact`입니다.
- 외부 레퍼런스 브랜드에서 가져온 `verified-reference-inspiration` 값은 없습니다.
- 미해결: 마스코트 자산의 저장소 밖 재배포 조건은 별도 라이선스 파일로 선언되어 있지 않습니다. 정적 Astro의 `aria-label`·`placeholder`는 아일랜드 밖에서 한국어로 고정됩니다. 두 항목은 값을 임의로 채우지 않고 이 문서에만 기록합니다.
- 미해결 값은 토큰·컴포넌트·제품 코드에서 소비하지 않습니다. 해결되면 해당 계층에 반영하고 이 절을 갱신합니다.

### 7.5 검증

변경은 `bun test`(토큰 드리프트, 배럴 재수출, 사이트 카탈로그 커버리지), `bun run typecheck`, `bun run lint`, `bun run build`를 통과해야 합니다. 문서 사이트는 `@horon-ai/react`와 `@horon-ai/tokens`를 소비하고, 시각 값은 전부 토큰에서 읽습니다.
