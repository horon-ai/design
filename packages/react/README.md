# @horon-ai/react

Horon 웹 컴포넌트 라이브러리입니다. Figma `Horon` 파일의 Components 보드(`54:81`)를 그대로
옮겼고, 동작과 접근성은 [Base UI](https://base-ui.com)(`@base-ui/react`) 하나에만 기댑니다. `cn()`은 Horon 토큰 이름을 아는 tailwind-merge라서, 넘긴 클래스가 컴포넌트의 Figma 기본값(너비, 반경 등)을 덮어씁니다.
shadcn/ui와 그 CLI는 쓰지 않습니다. 색, 크기, 글자 값은 모두 `@horon-ai/tokens`에서 옵니다.

빌드 산출물 없이 TypeScript 소스를 그대로 배포하므로, 소비하는 쪽 번들러가 소스를 컴파일합니다.

## 설치와 진입 스타일

```json
{ "dependencies": { "@horon-ai/react": "file:../design/packages/react", "@horon-ai/tokens": "file:../design/packages/tokens" } }
```

앱 진입 CSS에서 한 번 import합니다. Tailwind CSS v4, Pretendard, Geist Mono, 토큰 `theme.css`,
유리(liquid glass) 레이어 스타일이 여기서 함께 들어옵니다.

```css
@import "@horon-ai/react/globals.css";
@source "../node_modules/@horon-ai/react/src/**/*.{ts,tsx}";
```

- 다크 모드: 상위 요소에 `class="dark"`를 둡니다. 값은 Figma Components / Dark 보드(`166:1107`)에서 읽었습니다.
- 플랫폼 글자 크기: 데스크톱 앱은 `data-platform="desktop"`, 모바일 웹은 `data-platform="mobile"`을 둡니다.
  Typography 보드(`26:2`)의 Web / Desktop / Mobile 값으로 13개 글자 스타일이 바뀝니다.
- 아이콘: Figma 아이콘은 Phosphor Regular입니다. `@phosphor-icons/react`를 직접 쓰고,
  Phosphor에 없는 Horon 눈 아이콘만 `HoronIcon`으로 제공합니다.

## 사용

```tsx
import { Button, Card, Input } from "@horon-ai/react";
import { Plus } from "@phosphor-icons/react";

<Card title="Inbox Manager" description="6 emails need you." />;
<Button icon={<Plus />}>New bot</Button>;
<Input surface="solid" placeholder="Search bots" />;
```

하위 경로도 됩니다: `@horon-ai/react/components/button`.

## 유리 표면

Figma의 `Liquid layers`(tint, inner shade, soft light edge를 50% 세기로 겹친 것)를 `LiquidGlass`가
그립니다. 유리 컴포넌트는 이것을 첫 자식으로 두고, 채움은 `glass-clear` / `glass-regular` /
`glass-thick` 토큰으로 정합니다. 경계선 흐림과 안쪽 그림자 여백은 Figma처럼 높이에 비례합니다.

Chromium 계열 브라우저(Chrome, Edge, Arc, Android Chrome, Windows 데스크톱 앱)에서는 패키지가 만든 SVG 변위 필터가
뒤 배경을 표면 가장자리에서 휘게 합니다. 칩이나 버튼처럼 작은 표면뿐 아니라 카드, 시트 같은 큰 사각형도 같은 방식으로
휘고, 같은 크기의 표면은 필터 하나를 나눠 씁니다. 한 번에 굴절하는 표면은 16개까지이고, 터치 기기에서는 6개까지입니다.
화면 밖 표면과 터치 기기에서 너무 큰 표면은 굴절하지 않습니다.

Safari, iOS의 모든 브라우저, Firefox, macOS 데스크톱 앱은 배경에 SVG 필터를 걸지 못합니다
([WebKit 245510](https://bugs.webkit.org/show_bug.cgi?id=245510), [Gecko 1961378](https://bugzilla.mozilla.org/show_bug.cgi?id=1961378)).
이 엔진에서는 위의 CSS 레이어에 밝은 테두리를 더한 흐린 유리로 그립니다. 투명도 줄이기 설정이 켜져 있거나
브라우저가 `backdrop-filter`를 지원하지 않으면 불투명한 흐린 표면이 됩니다. `<LiquidGlass refract={false} />`처럼
`refract`를 끄면 굴절만 사라집니다.

## 컴포넌트 (80개)

| 파일 | Figma 노드 | 내용 |
| --- | --- | --- |
| `agent-activity` | 108:660 | Thinking, streaming, tool steps and work log. |
| `agent-lane` | 113:953 | Sub-agent lane card. |
| `agent-lanes-timeline` | YCO-1 | Timeline of each bot's run spans. |
| `agent-panel` | 112:797 | Solid agent panel, task composer and picker chips. |
| `agent-steering-panel` | Y51-1 | Steering panel that redirects a running bot. |
| `approval-card` | 64:398 | Glass approval card. |
| `avatar` | 61:347 | Initials, Bot and Image avatar with a live dot. |
| `badge` | 61:283 | Neutral, Brand, Danger and Solid status pill. |
| `banner` | 62:318 | Info and Danger glass banner. |
| `bot-instructions-panel` | YN3-1 | Bot instructions and examples in tabs. |
| `bot-list-row` | 64:456 | Bot list row with live avatar. |
| `bot-memory-panel` | ZO2-1 | Bot memory grouped by category. |
| `bottom-sheet` | 88:808 | Thick-glass bottom sheet; the light board adds frost. |
| `breadcrumb` | 110:948 | Breadcrumb with workspace tile. |
| `breadcrumb-header` | U8H-1 | Glass header row with a breadcrumb and two icon buttons. |
| `button` | 55:339 | Primary, Glass, Danger and Link in three sizes. |
| `calendar` | 60:245 | Month grid with single and range selection. |
| `card` | 63:310 | Thick-glass card: Default, Interactive, Selected. |
| `chat-bubble` | 64:359 | Flat Me and Bot chat bubbles. |
| `chat-controls` | 88:659 | Jump to latest, new messages, voice input. |
| `checkbox` | 58:217 | Off, On and Mixed checkbox. |
| `chip` | 61:302 | Clear-glass toggle chip. |
| `choice-card` | 1VXM-0 | Radio card that picks one of two options. |
| `code-panel` | 1VV9-0 | Light code panel for settings screens. |
| `command-palette` | 110:676 | Frosted command palette. |
| `composer` | 63:462 | Glass message composer. |
| `data-table` | 192:9046 | Solid data table with header, tags and footer. |
| `date-field` | 60:244 | Glass field that opens the calendar. |
| `dialog` | 63:329 | Thick-glass dialog on a scrim; the light board adds frost. |
| `directory-card` | 1VJJ-0 | Directory card with a description and an add button. |
| `document-extract-panel` | YUT-1 | Document viewer beside the extracted fields. |
| `empty-state` | 64:485 | Mascot empty state. |
| `field` | 58:163 | Label, control, help and error text. |
| `file-drop` | 1VWI-0 | Dashed drop zone for files. |
| `filter-bar` | WLN-1 | Pill filter bar with counts. |
| `horon-icon` | 256:9116 | The Horon falcon-eye icon. |
| `horon-wordmark` | 88:808 | UI-size Horon wordmark. |
| `icon-button` | 57:167 | Primary, Ghost and Glass icon-only buttons. |
| `input` | 58:126 | Glass or Solid text input, MD and LG. |
| `input-group` | 60:429 | Input with a prefix or suffix segment. |
| `integration-row` | 110:883 | Integration row: connected, reconnect, not connected. |
| `kbd` | 110:676 | Keyboard hint chip. |
| `knowledge-base-panel` | XVM-1 | Indexing state of each knowledge source. |
| `liquid-glass` | 55:339 | The liquid glass layer stack. |
| `list-detail` | 1W6P-0 | Two-pane layout with a list on the left and detail on the right. |
| `marketplace-card` | 1VMY-0 | Marketplace card with a description and an install button. |
| `mcp-server-row` | 1VHS-0 | Connected MCP server row with name, tags and state. |
| `menu` | 88:495 | Glass menu and solid account/workspace menu. |
| `message-extras` | 109:667 | Message actions, date separator, attachment, code block. |
| `orchestrator-panel` | X01-1 | Lead bot, parallel lanes and a summary. |
| `page-header` | 88:723 | Glass header with back, title, actions and filter. |
| `plan-card` | XMH-1 | Card shell that wraps plan steps. |
| `plan-step` | 191:8296 | Plan step on a rail. |
| `plugin-row` | 1VKS-0 | Plugin row with name, version, update and an enable switch. |
| `progress` | 109:733 | 6px progress bar. |
| `radio-group` | 58:239 | Radio group with 20px radios. |
| `research-run-panel` | ZUU-1 | Research question, progress and search terms. |
| `schedule` | 110:765 | Time field, weekday picker and routine schedule card. |
| `segmented-control` | 62:379 | Glass segmented control. |
| `select` | 58:162 | Glass or Solid select with a glass list. |
| `settings-list` | 1VD8-0 | Settings card of label and switch rows split by dividers. |
| `sidebar` | 88:808 | Thick-glass sidebar with groups, tree and account. |
| `skeleton` | 109:733 | Placeholder blocks and cards. |
| `source-row` | 114:1287 | Knowledge source with pipeline stages. |
| `spinner` | 109:733 | Ink spinner in three sizes. |
| `split-button` | 1VGK-0 | One pill with a primary action and a secondary menu caret. |
| `switch` | 58:264 | MD and SM switch. |
| `tab-bar` | 63:441 | Mobile glass tab bar. |
| `tabs` | 62:335 | Pill tabs on a glass tray. |
| `task-row` | 112:939 | Task row: running, review, failed, done. |
| `textarea` | 58:137 | Glass multi-line input. |
| `textarea-field` | 60:466 | Labeled textarea with footer and counter. |
| `toast` | 62:307 | Glass toast with Neutral, Success and Danger tones. |
| `tool-call` | 186:7811 | Expandable tool call with JSON arguments and result. |
| `tool-calls-header` | XDG-1 | Title row and tool chips for a group of tool calls. |
| `tool-permissions` | 1VT5-0 | Per-tool permission list: allow, confirm or off. |
| `tooltip` | 62:282 | Ink tooltip with an arrow. |
| `top-bar` | UR5-1 | Mobile app bar with back, bot avatar, title and subtitle, and overflow. |
| `usage-meter` | 109:733 | Glass usage meter card. |
| `workspace-menu` | V56-1 | Solid menu to pick a workspace or create one. |

## 검사

```bash
bun run lint && bun run typecheck   # 이 패키지에서
bun test                            # 저장소 루트에서, 진입점 재수출 커버리지
```
