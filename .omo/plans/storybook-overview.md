# storybook-overview - Work Plan

## TL;DR (For humans)

**Who this is for and what changes for them:** 민열님과 Storybook(`storybook.horon.ai`)을 여는 팀원은 지금 컴포넌트 하나를 보려면 사이드바에서 항목을 하나씩 열어야 합니다. 앞으로는 사이드바 맨 위에 App용·Web용 통합 페이지 두 개가 생겨서, 한 화면에서 그 레이어에 무엇이 있는지 전부 훑고 원하는 컴포넌트로 바로 들어갈 수 있습니다.

**What you'll get:** 디자인 시스템 전체를 한눈에 보는 인덱스 페이지 2장(앱용·웹용). 각 페이지는 컴포넌트를 Buttons, Forms, Data display, Overlays 같은 구역으로 나누고, 컴포넌트마다 이름과 대표 상태를 보여줍니다. 추가로, 컴포넌트를 새로 넣었는데 통합 페이지에 빠뜨리면 자동 검사가 실패해서 알려줍니다(요청에 없던 추가입니다).

**Why this approach:** 페이지를 손으로 한 장씩 쓰면 오버레이(대화상자·시트)처럼 화면 전체를 덮는 컴포넌트를 페이지에 맞게 처리할 수 있고, 컴포넌트마다 무엇을 보여줄지 직접 고를 수 있습니다. 대신 목록이 낡지 않도록 자동 검사를 함께 넣습니다. 사이드바 맨 위에 올리는 일은 Storybook의 정렬 설정 한 곳에서 처리합니다.

**What it will NOT do:** 기존 컴포넌트 코드와 기존 개별 스토리는 하나도 건드리지 않습니다. 새 라이브러리나 의존성을 추가하지 않고, 기존 그룹 순서(App·Foundations·Web)도 바꾸지 않습니다(그 위에 새 그룹을 얹기만 합니다).

**Effort:** Medium
**Risk:** Low - 추가만 하는 변경이고, 자동 검사로 지켜지며, 설정 한 줄로 되돌릴 수 있습니다.
**Decisions to sanity-check:** (1) "맨 위에"를 새 최상위 그룹(`Overview` 아래 `App`·`Web`)으로 해석했습니다. (2) 통합 페이지는 컴포넌트마다 대표 상태 하나만 보여줍니다(모든 변형은 기존 개별 스토리에 그대로 있습니다). (3) 대화상자·시트는 페이지를 덮으므로 여는 버튼과 한 줄 설명으로 보여줍니다. (4) 요청에 없던 추가: 컴포넌트 누락을 잡는 자동 검사. 없애도 페이지 자체는 동작하지만, 목록이 조용히 낡게 됩니다.

Your next move: approve, or run a high-accuracy review. Full execution detail follows below.

---

> TL;DR (machine): Medium/Low - two new hand-written Storybook pages (Overview/App, Overview/Web) rendering every component of a layer in labelled sections, a storySort that pins the new Overview group above all others, and a per-layer drift-guard test; 5 implementation todos + 4 final verifiers.

## Scope

### Affected user and ideal state

**Affected user:** 민열님과 팀원(배포된 Storybook을 여는 사람), 디자이너(기존 패턴을 찾는 사람 - 화면에 보이는 이름으로 컴포넌트를 식별해야 함), 디자인 시스템을 유지보수하는 사람(컴포넌트를 추가·수정하는 쪽), 그리고 화면을 구현하는 엔지니어(무엇이 이미 있는지 먼저 확인하는 쪽). 오늘은 사이드바에서 `App/…`, `Web/…` 항목을 하나씩 열어야 하고, 컴포넌트가 빠져도 알려주는 장치가 없습니다.

| Row   | Statement                                                                                                                                                                   | Reason                                                                                           |
| ----- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| IS-1  | 사이드바 첫 그룹이 `Overview`이고 그 첫 항목이 `App`·`Web`이며, 각 페이지는 그 레이어의 컴포넌트 전체를 한 화면에 보여준다                                                  | 전체 목록은 가장 먼저 닿는 곳에 있어야 하므로, 사이드바 최상단에 있어야 한다                     |
| IS-2  | 페이지 위에 그 레이어의 모든 컴포넌트가 대표 상태로, 구역 라벨과 컴포넌트 이름과 함께 보인다                                                                                | 일부만 보여주거나 이름 없는 표본을 보여주는 목록은 완전한 목록으로 오해되므로 없는 것보다 나쁘다 |
| IS-3  | 화면 전체를 덮는 컴포넌트(Dialog·Sheet)도 페이지에 등장한다. 여는 버튼(Web은 `DialogTrigger`/`SheetTrigger`, App은 로컬 상태로 실제 열리는 버튼)과 한 줄 설명으로 표현된다                                                                            | 그대로 펼쳐 두면 페이지를 덮어버리거나, 조용히 빠지게 된다                                       |
| IS-4  | 새 컴포넌트를 추가하면 통합 페이지에 이름을 넣기 전까지 검사가 실패한다(검사는 이름의 존재를 증명하고, 렌더는 렌더 QA가 증명한다)                                           | 시스템이 커져도 목록이 조용히 낡지 않게 한다                                                     |
| IS-5  | 기존 개별 스토리·제목·그룹 순서(`Foundations` → `App` → `Web`)는 그대로다                                                                                                   | 기존에 익힌 위치와 링크가 깨지지 않는다                                                          |
| GAP-1 | 레이어 전체를 한 페이지에 그리는 페이지가 없다. 가장 가까운 것은 다른 앱의 수기 쇼케이스(`apps/playground/src/App.tsx`)뿐이다                                               | IS-1, IS-2                                                                                       |
| GAP-2 | 사이드바에 정렬 설정이 없어서, 새 그룹을 만들어도 파일 발견 순서에 따라 중간에 끼거나 아래로 밀린다(알파벳순이 아니라 발견 순서)                                            | IS-1                                                                                             |
| GAP-3 | Dialog·Sheet는 화면 전체를 덮는 오버레이로 portal되므로 "전부 렌더"하는 순진한 페이지는 불가능하다. App 레이어의 Dialog·Sheet는 트리거 컴포넌트가 없고 `open` prop이 필수다 | IS-3                                                                                             |
| GAP-4 | `apps/storybook/test/exports.test.ts`는 배럴 export와 컴포넌트별 스토리 존재만 검사하고, 통합 페이지가 완전한지는 검사하지 않는다                                           | IS-4                                                                                             |

### Must have

- `apps/storybook/stories/overview/Web.stories.tsx` — 제목 `Overview/Web`, 스토리 export `All` 하나.
- `apps/storybook/stories/overview/App.stories.tsx` — 제목 `Overview/App`, 스토리 export `All` 하나.
- `apps/storybook/.storybook/preview.tsx`의 `parameters.options.storySort` — 새 `Overview` 그룹을 최상단에 고정.
- `apps/storybook/test/exports.test.ts`의 레이어별 drift guard 검사 1개씩.
- 두 페이지 모두 `data-component="<PascalName>"` 마커로 컴포넌트 자리를 표시(drift guard가 읽는 계약).
- 두 페이지의 구역 라벨은 실제 제목 요소(`<h2>`/`<h3>`)로 쓴다. `@storybook/addon-a11y`가 켜져 있어, `div`로 만든 가짜 제목은 헤딩 구조 경고를 만든다.
- 두 페이지 모두 라이트·다크 양쪽에서 헤드리스 렌더로 확인.

### Must NOT have (guardrails, anti-slop, scope boundaries)

- `packages/web/src`, `packages/app/src` 아래 어떤 파일도 수정하지 않는다.
- 기존 `*.stories.tsx` 파일을 수정하지 않는다(제목·export 이름 변경 금지).
- 새 의존성, Storybook 프레임워크·addon·`main.ts` 글롭 변경 없음.
- MDX 문서 페이지를 만들지 않는다.
- 기존 스토리·그룹을 삭제·개명·재명명하지 않는다.
- App·Foundations·Web 그룹의 상대 순서를 바꾸지 않는다(새 Overview 그룹을 그 위에 얹기만 한다).
- 통합 페이지에 컴포넌트의 모든 변형·상태를 나열하지 않는다(대표 상태 하나만; 전체 변형은 기존 스토리에 있다).

### Page composition (section map)

각 컴포넌트 자리는 `<div data-component="<PascalName>">`로 감싼다(정확한 값은 `packages/*/src/components/` 파일명을 PascalCase로 바꾼 이름). 이 속성은 검사용 계약이다. 별개로, 각 표본 위에 컴포넌트 이름을 실제 제목 요소로 눈에 보이게 쓴다(디자이너가 이름으로 식별할 수 있도록). 구역 라벨도 실제 제목 요소로 쓴다.

**Overview/Web — 26개**

| Section      | Components                                                                           | Representative state                                                                                                                                                                                                             |
| ------------ | ------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Buttons      | Button                                                                               | 6개 변형 한 줄                                                                                                                                                                                                                   |
| Forms        | Input, Textarea, Label, Select, Checkbox, RadioGroup, Switch                         | Input default/disabled/invalid; Textarea default/filled; Label+Input 쌍; Select 닫힌 트리거(`defaultValue="apple"`); Checkbox unchecked/checked/indeterminate/disabled; RadioGroup 3개 중 1개 선택; Switch on/off/small/disabled |
| Data display | Avatar, Badge, Chip, Card, List, Empty, Progress, Skeleton, Spinner, Separator, Tabs | Avatar 크기; Badge 변형; Chip 변형; Card 전체; List 3행; Empty(아이콘+설명+액션); Progress 60% + indeterminate; Skeleton 3줄; Spinner; Separator 가로; Tabs 3개                                                                  |
| Overlays     | Dialog, Sheet, Menu, Tooltip, Toast                                                  | Dialog·Sheet는 트리거 버튼 + caption; Menu 인라인; Tooltip `defaultOpen`; Toast는 `<Toaster>` 안 트리거 버튼                                                                                                                     |
| Glass        | GlassSurface, LiquidGlass                                                            | 그라디언트 stage 위에 배치(glass가 읽히도록)                                                                                                                                                                                     |

**Overview/App — 21개 + Typography** (Typography의 `Text`는 primitive라 `data-component` 마커를 붙이지 않는다. 마커는 정확히 21개)

| Section      | Components                                                                | Representative state                                                                                                                                                          |
| ------------ | ------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Buttons      | Button                                                                    | 6개 변형                                                                                                                                                                      |
| Forms        | Input, Textarea, Checkbox, Switch, Radio, Select                          | Input default/invalid/disabled; Textarea default/filled; Checkbox checked/unchecked/indeterminate/disabled; Switch on/off/disabled; RadioGroup 4개 중 1개; Select 닫힌 트리거 |
| Data display | Avatar, Badge, Chip, Card, List, Empty, Progress, Skeleton, Spinner, Tabs | Avatar 이니셜; Badge 변형; Chip 상태; Card 전체; List 3행; Empty(액션); Progress 60% + label; Skeleton 줄; Spinner + label; Tabs segmented                                    |
| Overlays     | Dialog, Sheet, Tooltip, Toast                                             | Dialog·Sheet는 트리거 + caption; Tooltip `defaultOpen`; Toast variant 인라인                                                                                                  |
| Typography   | Text (primitive — 마커 없음)                                              | variant 스케일(`App/Typography`와 동일)                                                                                                                                       |

## Verification strategy

> Zero human intervention - all verification is agent-executed.

- Test decision: tests-after (the drift guard is a new test) + agent-executed render QA. Framework: `bun test` (repo root), `tsc --noEmit` via `bun run typecheck`, Storybook static build via `bun run build:storybook`, headless render via `Bun.WebView` (see the `storybook-render-check` skill).
- Evidence: `.omo/evidence/storybook-overview/task-<N>-storybook-overview.<ext>` (outside ulw-loop; under ulw-loop use `<attemptDir>/task-<N>-storybook-overview.<ext>` where attemptDir = `result.currentAttemptDir` from `await agentToolkit.status()` after `await import(`${env("OMO_AGENT_TOOLKIT_SDK_ROOT")}/sdk.js`)`). `.omo/evidence/` is gitignored in this repo, so evidence is not committed.

## Execution strategy

### Parallel execution waves

- **Wave 1** (serial, 1 todo): 3 (capture the pre-change `index.json` baseline, then add the `storySort` config). The baseline must be captured before any page exists, and `bun run build:storybook` writes to the single shared `apps/storybook/storybook-static` directory, so no two todos may run that command concurrently.
- **Wave 2** (2 todos, disjoint files): 1 (web page), 2 (app page). They may write in parallel; run their `build:storybook` checks one after the other, not simultaneously.
- **Wave 3** (2 todos): 4 (drift guard, needs the pages to exist so the guard passes), 5 (rendered-page QA sweep with evidence, needs pages + config). Both run `build:storybook`; serialize that command.
- **Final verification wave**: F1-F4 after all todos.

### Dependency matrix

| Todo | Depends on | Blocks | Can parallelize with |
| ---- | ---------- | ------ | -------------------- |
| 1    | 3 (build serialization) | 4, 5   | 2                    |
| 2    | 3 (build serialization) | 4, 5   | 1                    |
| 3    | -                       | 1, 2, 5 | -                   |
| 4    | 1, 2                    | -      | 5                    |
| 5    | 1, 2, 3                 | -      | 4                    |

## Todos

> Implementation + Test = ONE todo. Never separate.

<!-- APPEND TASK BATCHES BELOW THIS LINE WITH edit/apply_patch - never rewrite the headers above. -->

- [x] 1. Create the Overview/Web page rendering every @horon/web component
      What to do / Must NOT do: 새 파일 `apps/storybook/stories/overview/Web.stories.tsx`를 만든다. `export default meta`에서 `title: "Overview/Web"`, `parameters: { layout: "padded" }`, 스토리 export는 `All` 하나. `@horon/web` 배럴에서 아래 26개 컴포넌트를 import하고, 구역(라벨이 붙은 섹션)으로 배치한다. 각 컴포넌트의 자리를 `<div data-component="<PascalName>">`로 감싸고(이 마커가 todo 4의 검사 계약이다), 표본 위에 컴포넌트 이름을 실제 제목 요소로 눈에 보이게 쓴다. 구역과 대표 상태는 아래 "웹 페이지 구역표"를 그대로 따른다. Dialog·Sheet는 실제 트리거 버튼(`DialogTrigger`/`SheetTrigger`)과 한 줄 설명(caption)으로 표현하고, 절대 열린 상태로 두지 않는다(페이지를 덮는다). 클릭하면 오버레이가 열린다. Menu는 인라인, Tooltip은 `defaultOpen`, Select는 닫힌 트리거(`defaultValue="apple"`), Toast는 `<Toaster>` 안의 트리거 버튼으로 표현한다(구역표와 동일하게 Select는 열지 않는다). Must NOT: 기존 `stories/web/*.stories.tsx` 수정, `packages/web` 수정, 새 의존성 추가, `data-component` 마커 누락, Dialog/Sheet를 열린 채로 렌더.
      Closes: GAP-1, GAP-2(부분), GAP-3
      Parallelization: Wave 2 | Blocked by: 3 | Blocks: 4, 5
      References (executor has NO interview context - be exhaustive):
  - 웹 페이지 구역표(아래 "Page composition" 절): Buttons(Button 6변형) / Forms(Input, Textarea, Label, Select, Checkbox, RadioGroup, Switch) / Data display(Avatar, Badge, Chip, Card, List, Empty, Progress, Skeleton, Spinner, Separator, Tabs) / Overlays(Dialog, Sheet, Menu, Tooltip, Toast) / Glass(GlassSurface, LiquidGlass).
  - `packages/web/src/index.ts` — 배럴 export 목록(26개 컴포넌트). `@horon/web`에서 import.
  - 기존 스토리에서 각 컴포넌트의 정확한 props/상태: `apps/storybook/stories/web/{Avatar,Badge,Button,Card,Checkbox,Chip,Dialog,Empty,GlassSurface,Input,Label,LiquidGlass,List,Menu,Progress,RadioGroup,Select,Separator,Sheet,Skeleton,Spinner,Switch,Tabs,Textarea,Toast,Tooltip}.stories.tsx`. 특히 `apps/storybook/stories/web/Dialog.stories.tsx`(trigger 패턴), `Sheet.stories.tsx`, `Select.stories.tsx`(`defaultOpen`), `Tooltip.stories.tsx`(`defaultOpen`), `Toast.stories.tsx`(`<Toaster>` + 트리거), `Menu.stories.tsx`(인라인), `LiquidGlass.stories.tsx`(그라디언트 stage).
  - 섹션 래퍼는 기존 `apps/playground/src/App.tsx`의 `<section>` + `<h2>` 패턴을 참고하되 Tailwind 유틸을 쓴다.
  - `apps/storybook/.storybook/preview.tsx` — 페이지가 테마 decorator 안에서 렌더되므로 별도 테마 처리는 불필요.
    Acceptance criteria (agent-executable): `bun run typecheck` exit 0; `bun run build:storybook` exit 0; 빌드된 `apps/storybook/storybook-static/index.json`에 `overview-web--all` 항목 존재.
    QA scenarios (name the exact tool + invocation): happy — `storybook-static`를 `Bun.serve({ routes: { "/*": { dir: ... } } })`로 서빙하고 `Bun.WebView`로 `iframe.html?id=overview-web--all&viewMode=story`를 열어 `document.body.innerText`에 5개 구역 라벨이 모두 있고 `document.querySelectorAll('[data-component]').length === 26`임을 확인하고, 각 `[data-component]` 안에 0이 아닌 크기의 자손 요소가 실제로 있고 그 컴포넌트 이름 텍스트가 `innerText`에 나타나며, `document.querySelectorAll('[data-slot]')`의 값 집합이 최소 `button`,`checkbox`,`switch`,`select-trigger`,`tabs`,`progress`,`avatar`,`badge`,`chip`,`input`,`textarea`,`card`,`dialog-trigger`,`sheet-trigger`,`list`,`menu`,`separator`,`label`,`skeleton`,`spinner`,`empty`,`tooltip-content`를 포함함(실제 컴포넌트가 렌더됐다는 증거)을 확인한 뒤 PNG 캡처(라이트). failure(negative control) — 존재하지 않는 `iframe.html?id=does-not-exist--x&viewMode=story`에서 `document.body.innerText`가 빈 문자열임을 확인(빈 값은 통과가 아님을 증명). Evidence `.omo/evidence/storybook-overview/task-1-storybook-overview.png` + `.md`.
    Commit: Y | `feat(storybook): add Overview/Web page rendering every web component`
    Recommended task executor category: visual-engineering - 새 UI 페이지를 여러 컴포넌트로 조립하는 프론트엔드 레이아웃 작업

- [x] 2. Create the Overview/App page rendering every @horon/app component
      What to do / Must NOT do: 새 파일 `apps/storybook/stories/overview/App.stories.tsx`를 만든다. `export default meta`에서 `title: "Overview/App"`, `parameters: { layout: "padded" }`, 스토리 export는 `All` 하나. `@horon/app` 배럴에서 아래 21개 컴포넌트를 import하고 구역으로 배치한다. 각 자리를 `<div data-component="<PascalName>">`로 감싸고 표본 위에 컴포넌트 이름을 실제 제목 요소로 눈에 보이게 쓴다. **정확히 21개 마커다** — Typography 구역의 `Text`는 `packages/app/src/primitives/`에 있고 컴포넌트 파일이 아니므로 `data-component` 마커를 붙이지 않는다(붙이면 drift guard와 개수 단언이 깨진다). 구역과 대표 상태는 아래 "앱 페이지 구역표"를 따른다. App 레이어는 react-native-web으로 렌더되므로 섹션 chrome은 일반 `div`, 표본은 `@horon/app` primitive(`Stack`, `HStack`, `Text`)를 쓴다(기존 App 스토리 관례). Dialog·Sheet는 트리거 컴포넌트가 없고 `open` prop이 필수이므로, 각각 로컬 `useState`로 감싼 버튼을 두어 클릭하면 실제로 열리고 닫히게 한다(기존 `apps/storybook/stories/app/Dialog.stories.tsx:44-48`의 `DialogDemo`, `Sheet.stories.tsx:57-61`의 `SheetDemo` 패턴). 페이지가 처음 뜰 때는 닫힌 상태이고 caption을 붙인다. Select는 닫힌 트리거(`value="apple"`, `options`)로, Tooltip은 `defaultOpen`, Toast는 인라인 variant로 표현한다(구역표와 동일하게 App Select도 열지 않는다). App 페이지 맨 위에 "이 페이지는 react-native-web 렌더이며 네이티브 화면과 픽셀이 다를 수 있다"는 caption 한 줄을 둔다. Must NOT: 기존 `stories/app/*.stories.tsx` 수정, `packages/app` 수정, Dialog/Sheet를 `open` 상태로 렌더, `data-component` 마커 누락 또는 21개 초과.
      Closes: GAP-1, GAP-2(부분), GAP-3
      Parallelization: Wave 2 | Blocked by: 3 | Blocks: 4, 5
      References (executor has NO interview context - be exhaustive):
  - 앱 페이지 구역표(아래 "Page composition" 절): Buttons(Button 6변형) / Forms(Input, Textarea, Checkbox, Switch, Radio, Select) / Data display(Avatar, Badge, Chip, Card, List, Empty, Progress, Skeleton, Spinner, Tabs) / Overlays(Dialog, Sheet, Tooltip, Toast) / Typography(Text 스케일).
  - `packages/app/src/index.ts` — 배럴 export(21 컴포넌트 + primitive `Box`·`Text`·`Stack`·`VStack`·`HStack`·`Divider`·`Pressable`).
  - `packages/app/src/components/Dialog.tsx:13`(`open: boolean` 필수), `Sheet.tsx:16`(`open: boolean` 필수), `Select.tsx:25`(`defaultOpen`), `Tooltip.tsx:12`(`defaultOpen`), `Toast.tsx:31`(인라인 렌더).
  - 기존 스토리에서 정확한 props/상태: `apps/storybook/stories/app/{Avatar,Badge,Button,Card,Checkbox,Chip,Dialog,Empty,Input,List,Progress,Radio,Select,Sheet,Skeleton,Spinner,Switch,Tabs,Textarea,Toast,Tooltip,Typography}.stories.tsx`. `List`는 `style={{ width: 420 }}`, `Card`는 `{ width: 420 }`, `Select`는 `{ width: 260 }`, `Empty`는 `{ width: 420 }`(기존 스토리와 동일).
  - primitive 시그니처: `packages/app/src/primitives/Stack.tsx`(`direction`, `gap`, `align`, `wrap`).
    Acceptance criteria (agent-executable): `bun run typecheck` exit 0; `bun run build:storybook` exit 0; `storybook-static/index.json`에 `overview-app--all` 항목 존재.
    QA scenarios (name the exact tool + invocation): happy — `Bun.WebView`로 `iframe.html?id=overview-app--all&viewMode=story`를 열어 `document.body.innerText`에 5개 구역 라벨이 있고 `document.querySelectorAll('[data-component]').length === 21`임을 확인하고, 각 `[data-component]` 래퍼가 이름 제목 외에 0이 아닌 크기의 자손 요소를 2개 이상 포함하고(제목만 있는 래퍼는 1개이므로 배제된다) 그 컴포넌트 이름 텍스트가 `innerText`에 나타나며, 페이지 전체 `document.querySelectorAll('*').length`가 300 이상임을 확인한 뒤 PNG 캡처(라이트). App 레이어는 `data-slot`을 쓰지 않으므로 이 구조 단언과 사람이 보는 스크린샷이 렌더 충실성의 증거다. failure(negative control) — `id=does-not-exist--x`에서 innerText가 빈 문자열임을 확인. Evidence `.omo/evidence/storybook-overview/task-2-storybook-overview.png` + `.md`.
    Commit: Y | `feat(storybook): add Overview/App page rendering every app component`
    Recommended task executor category: visual-engineering - RN 컴포넌트를 react-native-web으로 조립하는 프론트엔드 레이아웃 작업

- [x] 3. Pin the Overview group above every other sidebar group
      What to do / Must NOT do: **먼저 기준선을 잡는다**: `bun run build:storybook`을 돌려 변경 전 `apps/storybook/storybook-static/index.json`을 `.omo/evidence/storybook-overview/baseline-index.json`으로 복사한다(IS-5의 "그룹 순서 불변"을 비교로 증명하는 기준). 그다음 `apps/storybook/.storybook/preview.tsx`의 `parameters` 객체에 `options: { storySort: { order: ['Overview', ['App', 'Web'], 'Foundations', 'App', 'Web'] } }`를 추가한다. 이 배열이 유일한 정렬 설정이며, 앞의 `'Overview'` + 자식 배열이 새 그룹을 최상단에 올리고, 뒤의 `'Foundations'`, `'App'`, `'Web'` 항목이 기존 그룹 순서와 그룹 내부 순서를 그대로 보존한다. Must NOT: `main.ts` 글롭·addon 변경, 다른 `parameters` 값 변경, 컴포넌트 파일의 `parameters.options.storySort` 사용(Storybook이 전역만 허용하고 오류를 낸다), 배열에 죽은 항목 추가, 기준선 캡처 생략.
      Closes: GAP-2
      Parallelization: Wave 1 | Blocked by: - | Blocks: 1, 2, 5
      References (executor has NO interview context - be exhaustive):
  - `apps/storybook/.storybook/preview.tsx` — 현재 `parameters` 객체(정렬 설정 없음). 여기에 `options`를 추가.
  - 검증된 사실: 설치된 Storybook 10.6.2의 비교기를 `apps/storybook/node_modules/storybook/dist/_browser-chunks/chunk-M6YZR3ZW.js`에서 추출해 실제 타이틀에 적용하면 위 배열이 `Overview/App, Overview/Web, Foundations/Tokens`, 그 다음 기존 `App/...`, `Web/...` 순서를 만든다. 배열 끝의 `'App'`·`'Web'`은 그룹 순서 고정용이며, 그룹 내부는 정렬되지 않고(비교기가 0을 반환) 파일 발견 순서가 그대로 유지된다.
  - 정렬은 인덱스 생성 시점에 적용된다: `apps/storybook/node_modules/storybook/dist/core-server/index.js`의 `getIndexAndStats()`가 `this.sortStories(indexEntries, getStorySortParameter(previewCode))`를 호출한다. 따라서 정적 빌드의 `index.json`과 사이드바가 함께 바뀐다.
  - 현재 그룹 순서(실측): Foundations → App → Web.
    Acceptance criteria (agent-executable): `bun run typecheck` exit 0; `bun run build:storybook` exit 0; 빌드된 `storybook-static/index.json`의 최상위 그룹 순서가 정확히 `Overview, Foundations, App, Web`이고 `Overview` 자식이 `App, Web`이며, 기존 `App`·`Web` 그룹 내부 순서가 기준선(`baseline-index.json`)과 동일하다.
    QA scenarios (name the exact tool + invocation): happy — `storybook-static`을 서빙하고 `Bun.WebView`로 `/`를 열어 사이드바 트리(`#storybook-explorer-tree`)의 그룹 헤더 순서가 `overview, foundations, app, web`(대소문자 무시 비교)이고 Overview 안이 `App, Web`임을 확인, PNG 캡처. failure(negative control) — 설치본 비교기를 `order: []`(정렬 설정 없음과 동일)로 돌려 결과 첫 그룹이 `Foundations`임을 확인해, 통과가 자동으로 참이 아님을 증명. Evidence `.omo/evidence/storybook-overview/task-3-storybook-overview.png` + `.md`, `.omo/evidence/storybook-overview/baseline-index.json`.
    Commit: Y | `feat(storybook): pin the Overview group above all other groups`
    Recommended task executor category: quick - 설정 한 줄 추가와 그 효과 확인

- [x] 4. Add a per-layer drift guard for the overview pages
      What to do / Must NOT do: `apps/storybook/test/exports.test.ts`의 `Layer` 타입에 `overviewPath: string`을 추가하고 두 레이어 항목에 각각 `${repoRoot}/apps/storybook/stories/overview/Web.stories.tsx`, `${repoRoot}/apps/storybook/stories/overview/App.stories.tsx`를 넣는다. 각 레이어의 `describe` 안에 검사 1개를 추가한다: `layer.overviewPath`를 읽어, `files`의 모든 컴포넌트 파일에 대해 `expect(source).toContain(`data-component="${pascalCase(withoutExtension(file))}"`)`를 단언한다. 기존 `pascalCase`·`withoutExtension`·`files` 헬퍼를 재사용한다. Must NOT: 기존 4개 검사의 의미 변경, 다른 파일 수정, 마커 문자열 형식 변경(todo 1·2가 같은 형식을 쓴다).
      Closes: GAP-4
      Parallelization: Wave 3 | Blocked by: 1, 2 | Blocks: -
      References (executor has NO interview context - be exhaustive):
  - `apps/storybook/test/exports.test.ts` — `type Layer`(`:12-18`), `layers` 배열(`:20-35`), `listFiles`(`:37`), `withoutExtension`(`:40`), `pascalCase`(`:42`), `files` 스캔(`:65-66`), `describe`(`:69`), 기존 검사 4개(`:70`,`:74`,`:81`,`:92`). 참고: 이 스캔은 `packages/*/src/components/*.tsx`만 본다(primitive 제외).
  - `Layer` 타입에는 현재 overview 경로 필드가 없다 — `overviewPath: string`을 새로 추가해야 한다(기존 헬퍼 재사용만으로는 부족).
  - 마커 계약: todo 1·2가 `<div data-component="Button">` 형태로 감싼다. 정확히 닫는 따옴표까지 포함해 부분 문자열 충돌을 피한다.
    Acceptance criteria (agent-executable): `bun test apps/storybook/test/exports.test.ts` exit 0, 새 검사 2개가 pass(기존 8개 단언도 pass 유지).
    QA scenarios (name the exact tool + invocation): happy — `bun test apps/storybook/test/exports.test.ts` 실행해 전체 pass 확인, 출력을 증거로 저장. failure(negative control) — 웹 페이지 소스에서 마커 하나(예: `data-component="Toast"`)를 뺀 사본을 만들어 같은 단언 로직을 돌려 실패함을 확인하고 사본 삭제(원본 불변). Evidence `.omo/evidence/storybook-overview/task-4-storybook-overview.md`.
    Commit: Y | `test(storybook): guard that each layer overview page lists every component`
    Recommended task executor category: quick - 기존 테스트 파일에 검사 하나 추가

- [x] 5. Render both overview pages in both themes and capture evidence
      What to do / Must NOT do: `bun run build:storybook`로 최신 정적 빌드를 만든 뒤 `storybook-static`를 서빙하고, `Bun.WebView`로 두 스토리(`overview-web--all`, `overview-app--all`)를 라이트·다크로 렌더한다. 각 렌더에서 `document.body.innerText`에 구역 라벨이 모두 있는지, `document.querySelectorAll('[data-component]').length`가 각각 26·21인지, 웹 페이지에서 `[data-slot]` 값 집합이 todo 1의 필수 목록을 포함하는지, 앱 페이지에서 각 래퍼가 자손 요소 2개 이상을 갖는지 단언하고 PNG를 캡처한다. 다크는 `document.documentElement.classList.add('dark')`를 주입한 뒤 캡처한다(`storybook-render-check` 스킬 3b 참고). 웹 페이지의 Toast 트리거를 클릭해 토스트가 실제로 뜨는지도 확인한다(마크업만이 아니라 동작 확인). Must NOT: 소스 파일 수정, 임시 서버를 남긴 채 종료, 스크린샷을 저장소에 커밋(증거 디렉터리는 gitignore됨).
      Closes: IS-1, IS-2, IS-3 (증거 확보)
      Parallelization: Wave 3 | Blocked by: 1, 2, 3 | Blocks: -
      References (executor has NO interview context - be exhaustive):
  - `storybook-render-check` 스킬(메모리 `skills/storybook-render-check`) — 서빙·`iframe.html?...&viewMode=story`·`evaluate`는 단일 표현식·다크 주입 절차.
  - 스토리 id 규칙: 제목+스토리명 소문자, 비영숫자를 `-`로 → `overview-web--all`, `overview-app--all`.
  - 서버: `Bun.serve({ port: 0, hostname: "127.0.0.1", routes: { "/*": { dir: "<repo>/apps/storybook/storybook-static" } } })`; 정리 시 `server.stop(true)`.
    Acceptance criteria (agent-executable): 4개 PNG(web/app × light/dark)와 innerText 단언 결과가 `.omo/evidence/storybook-overview/`에 존재하고, 모든 단언이 통과; Toast 클릭 후 토스트 텍스트가 innerText에 나타난다.
    QA scenarios (name the exact tool + invocation): happy — 위 4회 렌더 + Toast 클릭. happy 보강 — 라이트·다크 각 캡처에서 `getComputedStyle(document.body).backgroundColor`를 읽어 두 값이 서로 다름을 단언(라이트와 "같지 않음"이 아니라 실제 값 변화를 확인). failure(negative control) — 다크 캡처 전 `classList.add('dark')`를 생략한 렌더에서 그 값이 라이트와 같음을 확인(테마 주입이 실제로 먹는다는 증거). Evidence `.omo/evidence/storybook-overview/task-5-storybook-overview-{web,app}-{light,dark}.png` + `.md`.
    Commit: N | (증거만 생성; 커밋 대상 아님)
    Recommended task executor category: quick - 빌드 실행과 헤드리스 렌더 캡처

- [x] 6. Remove the unused `Radio` import and replace the raw hex chrome in Overview/App
  What to do / Must NOT do: F2 code review found two real defects in `apps/storybook/stories/overview/App.stories.tsx`: (a) the `Radio` import (line 27) is unused — only `RadioGroup` is used; (b) the section chrome uses raw hex — `borderTop: "1px solid #e5e5e5"` and `color: "#737373"` — which ignores tokens and does not adapt to dark mode (the caption `#737373` on the dark background is ~3.7:1, below AA). Fix: drop the unused `Radio` import; replace the two hex values with theme-adaptive token references (`var(--border)` and `var(--muted-foreground)`, matching the web page's `border-border`/`text-muted-foreground`). Must NOT: change any `data-component` marker (there must stay exactly 21), touch any other file, or alter the rendered component states.
  Closes: F2 finding (dead code + raw hex)
  Parallelization: post-verification fix | Blocked by: - | Blocks: -
  References: `apps/storybook/stories/overview/App.stories.tsx:27,67,80`; `apps/storybook/stories/overview/Web.stories.tsx` (`border-border`/`text-muted-foreground` convention); `packages/web/src/styles/globals.css` (defines `--border`/`--muted-foreground`).
  Acceptance criteria (agent-executable): `bun run typecheck` exit 0; `bun test` exit 0; `grep -c 'data-component=' App.stories.tsx` still 21; no `#`-hex remains in the file; a dark render shows the caption color differs from the light caption color.
  QA scenarios: happy — headless render of `overview-app--all` in light and dark; assert the caption's computed color differs between themes and no hex literals remain. Evidence `.omo/evidence/storybook-overview/task-6-storybook-overview.md`.
  Commit: Y | `fix(storybook): tokenize the Overview/App chrome and drop an unused import`
  Recommended task executor category: quick - two-line token fix plus a dead import

## Final verification wave

> Runs in parallel after ALL todos. ALL must APPROVE. Surface results and wait for the user's explicit okay before declaring complete.

- [x] F1. Plan compliance audit
- [x] F2. Code quality review
- [x] F3. Real manual QA
- [x] F4. Ideal-state fidelity

## Commit strategy

- Todo 1·2·3·4는 각각 완료 즉시 해당 파일만 커밋한다(위 각 todo의 Commit 줄). Todo 5는 증거만 만들고 커밋하지 않는다(`.omo/evidence/`는 gitignore됨).
- 커밋 메시지는 위에 명시한 conventional commit 형식을 그대로 쓴다. 한 커밋에 두 파일 이상을 묶지 않는다.
- 최종 검증(F1-F4)이 모두 APPROVE한 뒤에만 `dev` 브랜치로 병합·푸시한다. Cloudflare Pages가 `dev` 푸시에 자동 배포하므로, 배포 확인은 `storybook.horon.ai`에서 Overview 그룹 노출로 한다.
- 동시 작업 주의: 이 저장소에서 다른 세션이 별도 계획(`.omo/plans/web-component-parity.md`)으로 `packages/web`에 컴포넌트를 추가할 수 있다. 그 작업이 먼저 병합되면 drift guard(todo 4)가 의도대로 실패한다 — 새 컴포넌트를 `Overview/Web` 페이지에 추가하는 것이 정상 대응이다. 다른 세션의 파일(`.omo/plans/web-component-parity.md` 등)은 이 작업의 범위 밖이므로 수정·커밋하지 않는다.

## Success criteria

> One row per IS row. The plan is complete only when every IS row has a delivering todo and a proving QA scenario; F4 checks the delivered behavior against these rows 1:1, and a shortfall becomes new `- [ ] N.` rows, never a note.

| IS   | Delivering todo(s) | Proving QA scenario                                                | Evidence                                                                          |
| ---- | ------------------ | ------------------------------------------------------------------ | --------------------------------------------------------------------------------- |
| IS-1 | 1, 2, 3            | todo 3 happy(사이드바 그룹 순서) + todo 5 렌더                     | `.omo/evidence/storybook-overview/task-3-storybook-overview.png`, `task-5-...png` |
| IS-2 | 1, 2, 4            | todo 1·2 happy(`[data-component]` 개수 26/21) + todo 4 drift guard | `.omo/evidence/storybook-overview/task-1-*.png`, `task-2-*.png`, `task-4-*.md`    |
| IS-3 | 1, 2               | todo 1·2 happy(Overlays 구역 존재) + todo 5 Toast 클릭             | `.omo/evidence/storybook-overview/task-5-*.md`                                    |
| IS-4 | 4                  | todo 4 happy + failure(마커 제거 사본)                             | `.omo/evidence/storybook-overview/task-4-storybook-overview.md`                   |
| IS-5 | 3                  | todo 3 happy(기존 그룹 순서 보존) + F1(기존 스토리 무변경)         | `.omo/evidence/storybook-overview/task-3-storybook-overview.md`                   |
