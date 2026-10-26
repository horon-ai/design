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

Figma의 `Liquid layers`(tint, inner shade, 경계선 세 겹을 50% 세기로 겹친 것)를 `LiquidGlass`가
그립니다. 유리 컴포넌트는 이것을 첫 자식으로 두고, 채움은 `glass-clear` / `glass-regular` /
`glass-thick` 토큰으로 정합니다. 경계선 흐림과 안쪽 그림자 여백은 Figma처럼 높이에 비례합니다.

Chromium 계열 브라우저에서는 그 아래에 [liquid-glass-react](https://github.com/rdev/liquid-glass-react)(MIT)를
호스트 크기에 맞춰 띄웁니다. SVG 변위 필터가 뒤 배경을 가장자리에서 휘게 하고, 테두리가 빛을 받습니다.
Safari와 Firefox는 배경에 SVG 필터를 걸지 못해서 CSS 유리 그대로 그립니다. 투명도 줄이기 설정이 켜져 있거나
`<LiquidGlass refract={false} />`이면 굴절을 쓰지 않습니다.

## 컴포넌트 (55개)

| 파일 | Figma 노드 | 내용 |
| --- | --- | --- |
| `agent-activity` | 108:660 | Thinking, streaming, tool steps and work log. |
| `agent-lane` | 113:953 | Sub-agent lane card. |
| `agent-panel` | 112:797 | Solid agent panel, task composer and picker chips. |
| `approval-card` | 64:398 | Glass approval card. |
| `avatar` | 61:347 | Initials, Bot and Image avatar with a live dot. |
| `badge` | 61:283 | Neutral, Brand, Danger and Solid status pill. |
| `banner` | 62:318 | Info and Danger glass banner. |
| `bot-list-row` | 64:456 | Bot list row with live avatar. |
| `bottom-sheet` | 88:808 | Thick-glass bottom sheet. |
| `breadcrumb` | 110:948 | Breadcrumb with workspace tile. |
| `button` | 55:339 | Primary, Glass and Danger in three sizes. |
| `calendar` | 60:245 | Month grid with single and range selection. |
| `card` | 63:310 | Thick-glass card: Default, Interactive, Selected. |
| `chat-bubble` | 64:359 | Flat Me and Bot chat bubbles. |
| `chat-controls` | 88:659 | Jump to latest, new messages, voice input. |
| `checkbox` | 58:217 | Off, On and Mixed checkbox. |
| `chip` | 61:302 | Clear-glass toggle chip. |
| `command-palette` | 110:676 | Frosted command palette. |
| `composer` | 63:462 | Glass message composer. |
| `data-table` | 192:9046 | Solid data table with header, tags and footer. |
| `date-field` | 60:244 | Glass field that opens the calendar. |
| `dialog` | 63:329 | Thick-glass dialog on a scrim. |
| `empty-state` | 64:485 | Mascot empty state. |
| `field` | 58:163 | Label, control, help and error text. |
| `horon-icon` | 256:9116 | The Horon falcon-eye icon. |
| `horon-wordmark` | 88:808 | UI-size Horon wordmark. |
| `icon-button` | 57:167 | Primary, Ghost and Glass icon-only buttons. |
| `input` | 58:126 | Glass or Solid text input, MD and LG. |
| `input-group` | 60:429 | Input with a prefix or suffix segment. |
| `integration-row` | 110:883 | Integration row: connected, reconnect, not connected. |
| `kbd` | 110:676 | Keyboard hint chip. |
| `liquid-glass` | 55:339 | The liquid glass layer stack. |
| `menu` | 88:495 | Glass menu and solid account/workspace menu. |
| `message-extras` | 109:667 | Message actions, date separator, attachment, code block. |
| `page-header` | 88:723 | Glass header with back, title, actions and filter. |
| `plan-step` | 191:8296 | Plan step on a rail. |
| `progress` | 109:733 | 6px progress bar. |
| `radio-group` | 58:239 | Radio group with 20px radios. |
| `schedule` | 110:765 | Time field, weekday picker and routine schedule card. |
| `segmented-control` | 62:379 | Glass segmented control. |
| `select` | 58:162 | Glass or Solid select with a glass list. |
| `sidebar` | 88:808 | Thick-glass sidebar with groups, tree and account. |
| `skeleton` | 109:733 | Placeholder blocks and cards. |
| `source-row` | 114:1287 | Knowledge source with pipeline stages. |
| `spinner` | 109:733 | Ink spinner in three sizes. |
| `switch` | 58:264 | MD and SM switch. |
| `tab-bar` | 63:441 | Mobile glass tab bar. |
| `tabs` | 62:335 | Pill tabs on a glass tray. |
| `task-row` | 112:939 | Task row: running, review, failed, done. |
| `textarea` | 58:137 | Glass multi-line input. |
| `textarea-field` | 60:466 | Labeled textarea with footer and counter. |
| `toast` | 62:307 | Glass toast with Neutral, Success and Danger tones. |
| `tool-call` | 186:7811 | Expandable tool call with JSON arguments and result. |
| `tooltip` | 62:282 | Ink tooltip with an arrow. |
| `usage-meter` | 109:733 | Glass usage meter card. |

## 검사

```bash
bun run lint && bun run typecheck   # 이 패키지에서
bun test apps/storybook             # 저장소 루트에서, 진입점·스토리 커버리지
```
