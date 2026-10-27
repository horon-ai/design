# horon design

웹(React)에서 **import 하면 바로 쓰는** 컴포넌트·레이아웃 라이브러리입니다. 디자인 토큰을
한 곳에서 정의하고, 웹은 Tailwind CSS v4로 그 값을 소비하기 때문에 컴포넌트와 문서 사이트의
색·간격·타이포가 어긋나지 않습니다.

토큰 정본은 `@horon-ai/tokens` 하나입니다. 확정 Horon 팔레트(sand 중성 + gold 액센트 + 잉크
primary), glass 표면, 모션, 폰트·그림자 값이 모두 여기서 나옵니다.

## 구조

```
apps/
  site/         @horon/site        문서 사이트 — design.horon.ai (Astro + React)
  storybook/    @horon/storybook   컴포넌트 미리보기 (개발 도구)
packages/
  tokens/       @horon-ai/tokens   디자인 토큰 단일 소스 (+ 생성된 theme.css)
  react/        @horon-ai/react    웹 컴포넌트 — shadcn/ui (Base UI) + Tailwind v4
  flutter/      horon_ui           Flutter 컴포넌트 — 같은 75개 + example 갤러리 앱
```

## 레이어

컴포넌트 레이어는 둘입니다. `@horon-ai/react`가 웹을, `horon_ui`가 Flutter를 맡고, 둘 다 같은 토큰을 읽고 같은 75개 컴포넌트를 제공합니다. site·storybook은 React 패키지를 소비하고, 스타일은 `@horon-ai/tokens`의 `theme.css`에서 읽습니다. 정적 검사는 각 패키지·앱의 `.oxlintrc.json`을 읽는 oxlint가 맡고, `bun run lint`가 이를 실행합니다. Flutter 패키지는 bun 워크스페이스 밖이고(`package.json`이 없습니다) `dart`·`flutter` 명령으로 검사합니다.

```tsx
import { Button, Card, CardTitle, CardContent } from "@horon-ai/react";
```

```dart
import 'package:horon_ui/horon_ui.dart';

HoronCard(
  children: <Widget>[
    HoronCardHeader(
      children: <Widget>[HoronCardTitle(text: '제목')],
    ),
    HoronButton(
      label: '취소',
      variant: HoronButtonVariant.outline,
      onPressed: () {},
    ),
  ],
);
```

## 시작하기

```bash
bun install
bun run tokens        # 토큰 CSS(theme.css) 생성
bun run storybook     # Storybook → http://localhost:6006
bun run site          # 문서 사이트 → http://localhost:4321
```

## 컴포넌트 사용

### React 웹 앱 — `@horon-ai/react`

```tsx
import { Button, Card, CardHeader, CardTitle } from "@horon-ai/react";
import "@horon-ai/react/globals.css"; // 엔트리에서 한 번

<Card>
  <CardHeader>
    <CardTitle>제목</CardTitle>
  </CardHeader>
  <Button variant="outline">취소</Button>
</Card>;
```

`@horon-ai/react`은 단일 진입점(`"."`)과 하위 경로(`@horon-ai/react/components/button`)를 모두
제공합니다.

### Flutter 앱 — `horon_ui`

`design/packages/flutter`에 있고 패키지 이름은 `horon_ui`입니다. 소비는 `pubspec.yaml`의 경로
의존으로 합니다.

```yaml
dependencies:
  horon_ui:
    path: ../design/packages/flutter
```

```dart
import 'package:horon_ui/horon_ui.dart';

MaterialApp(
  theme: horonTheme(Brightness.light),
  darkTheme: horonTheme(Brightness.dark),
);
```

단일 진입점은 `package:horon_ui/horon_ui.dart`이고, 하위 경로는 `package:horon_ui/chart.dart`
하나뿐입니다. `chart`는 `fl_chart`에 의존하므로 모든 앱 번들에 실리지 않도록 배럴에서 뺐습니다.

## 토큰

정본은 `packages/tokens` 하나입니다. 색·표면·모션·폰트·그림자가 여기서 나오고, 컴포넌트와
문서 사이트가 같은 값을 씁니다.

- **팔레트**: `packages/tokens/src/palette.ts`의 raw 램프(sand 12+6, gold, status)를
  `tokens.ts`에서 시맨틱 이름으로 매핑합니다. 표면·텍스트·경계는 sand, `primary`는 잉크,
  `accent`/`ring`은 gold입니다.
- **glass**: `glass-fill`·`glass-border`·`glass-foreground`(자체 foreground)와 강등 래더
  (frost, solid)를 `tokens.ts`에, blur 반경은 `scales.ts`에 둡니다. 웹의 `.glass` /
  `.glass-strong` 유틸리티와 `prefers-reduced-transparency`·`no backdrop-filter` 강등이
  여기서 파생됩니다.
- **모션**: `scales.ts`의 `duration`(ms 숫자)과 `easing`(CSS 문자열).
- **폰트·그림자**: `scales.ts`에서 CSS 스택과 `box-shadow` 문자열로 나옵니다.

수정 순서는 이렇습니다.

1. 색은 `packages/tokens/src/palette.ts`, 간격·반경·글자·모션·폰트·그림자는
   `packages/tokens/src/scales.ts`에서 고칩니다.
2. `bun run tokens`로 `packages/tokens/theme.css`를 다시 생성합니다.
3. 컴포넌트는 Tailwind 유틸리티(`bg-primary`, `rounded-lg` 등)로 같은 색·간격을 씁니다.

## shadcn 컴포넌트 추가·커스텀

`packages/react`에 `components.json`(style: `base-nova`)이 있어 Base UI 기반으로
벤더링됩니다.

```bash
npx shadcn@latest add dialog sheet -c packages/react
```

파일은 `packages/react/src/components/`에 생성됩니다. 새 컴포넌트를 단일 진입점에서도
쓰려면 `packages/react/src/index.ts`에 한 줄 추가하세요.

```ts
export * from "./components/dialog";
```

`cn()`은 `@horon-ai/react/lib/utils`에서 가져옵니다.

## 배포 (Storybook)

Storybook 정적 사이트는 Cloudflare Pages 프로젝트 `horon-storybook`으로 배포합니다.

- 프로덕션 URL: https://storybook.horon.ai (별칭 https://horon-storybook.pages.dev)
- 브랜치: **`main`이 프로덕션 브랜치**, `dev`가 통합 브랜치입니다. 작업은 `dev`에 쌓고, 배포할 때 `dev`를 `main`으로 병합합니다.
- **자동 배포**: GitHub 저장소(`horon-ai/design`)가 연결돼 있어 **`main` 브랜치에 푸시하면 자동으로 빌드·배포**됩니다.
  - 빌드: `bun install && bun run build:storybook`
  - 출력: `apps/storybook/storybook-static`
- 수동 배포(폴백): `bun run deploy:storybook` — `wrangler` CLI가 설치·로그인돼 있어야 합니다(`wrangler login`).

## 배포 (문서 사이트)

문서 사이트는 별도 Cloudflare Pages 프로젝트 `horon-design`으로 배포합니다.

- 프로덕션 URL: https://design.horon.ai (별칭 https://horon-design.pages.dev)
- 같은 브랜치 규칙(`main` = 프로덕션)과 같은 GitHub 연동을 씁니다.
  - 빌드: `bun install && bun run build:site`
  - 출력: `apps/site/dist`
- 수동 배포(폴백): `bun run deploy:site`

사이트의 컴포넌트 목록은 `apps/site/src/data/components.ts`가 소유합니다. 컴포넌트를
추가하면 이 파일에 항목을 넣고, 라이브 프리뷰를 붙이려면
`apps/site/src/components/demos/<slug>.tsx`를 만들어 같은 항목에 `demo`를 지정합니다.
데모 래퍼(`components/demo-wrappers/`)는 `bun run build`가 자동으로 생성하므로
커밋하지 않습니다.

마스코트 컷은 저장소 루트의 `assets/horon-mascot-*.png`가 원본입니다. 사이트 빌드가
`apps/site/scripts/sync-mascots.ts`로 768px WebP를 `apps/site/public/mascots/`에 만들고
`/mascot` 페이지가 그 목록(`src/data/mascots.ts`)을 그립니다. 변환물은 커밋하지 않으며,
컷을 추가하면 `assets/`에 PNG를 넣고 `src/data/mascots.ts`에 항목을 더합니다.
파비콘·앱 아이콘은 `web` 앱의 `favicon.ico`·`icon.png`·`apple-icon.png`를 그대로 복사한
것이므로, 아이콘을 바꿀 때는 두 저장소를 함께 맞춥니다.

## 패키지 게시 (npm)

라이브러리 두 패키지(`@horon-ai/react`, `@horon-ai/tokens`)는 버전 `0.1.0`이고
`publishConfig.access`가 `public`입니다. 앱 셋(`apps/*`)과 저장소 루트는 `private: true`라
게시 대상이 아닙니다.

**2026-10-20 현재 두 패키지는 npm 레지스트리에 아직 올라가 있지 않습니다.** 게시용 토큰이
만료되어 `npm whoami`가 401을 돌려줬습니다. 그래서 지금 `web`과 `desktop`은 커밋된
`file:` 의존(`file:../design/packages/react`, `file:../design/packages/tokens`)으로 이
저장소의 소스를 직접 가져다 씁니다. 두 패키지를 설치하는 외부 소비자는 아직 없습니다.

게시할 때는 다음 순서를 따릅니다.

```bash
# 1. 자격증명이 살아 있는지 먼저 확인한다 (401이면 게시가 불가능하다)
TOKEN=$(grep -m1 'registry.npmjs.org/:_authToken=' ~/.npmrc | cut -d= -f2-)
curl -s -o /dev/null -w '%{http_code}\n' -H "Authorization: Bearer $TOKEN" \
  https://registry.npmjs.org/-/whoami

# 2. 토큰이 살아 있으면 두 패키지를 순서대로 게시한다 (tokens build → tokens → react)
bun run publish:packages

# 3. 레지스트리에서 확인한다
npm view @horon-ai/tokens@0.1.0 version
npm view @horon-ai/react@0.1.0 version
```

게시한 뒤에는 `web/package.json`과 `desktop/package.json`의 `file:` 의존을
`"@horon-ai/react": "0.1.0"`, `"@horon-ai/tokens": "0.1.0"` 같은 정확한 버전으로 바꾸고
`bun install`로 확인합니다. 범위(`^0.1.0`)는 쓰지 않습니다.

## 검증

```bash
bun test                          # 토큰 드리프트 가드 + 팔레트 스냅샷
bun run typecheck                 # 전 워크스페이스 타입 검사
bun run lint                      # 경계 규칙 포함 린트
bun run build                     # 토큰 + 웹 앱 + 문서 사이트 빌드
bun run build:storybook           # Storybook 정적 빌드
bun run build:site                # 문서 사이트 정적 빌드
```

`bun test`가 토큰 드리프트 가드를 돌립니다. `theme.css`를 손으로 고치거나 생성기를 낡게
두면 재생성 결과와 달라져 테스트가 실패합니다. CI(GitHub Actions)도 같은
lint·typecheck·test·build를 돌립니다.

Flutter 패키지는 별도 잡으로 검사합니다.

```bash
cd packages/flutter
flutter pub get
dart analyze --fatal-infos
dart format --output=none --set-exit-if-changed lib test example
flutter test
```

`flutter test`가 토큰 드리프트 가드와 게이트 다섯을 함께 돌립니다. 게이트는 React 75개와 Dart
파일의 전수 대조, 갤러리 등록, `Horon` 이름, 변형 어휘, 원시 리터럴 금지를 검사합니다.

## 알아 둘 점

- 패키지는 소스(`.tsx`) 그대로 배포합니다(내부 패키지 방식). Vite와 Astro가 각각 변환합니다.
- 문서 사이트(`apps/site`)는 `@horon-ai/react` 컴포넌트를 Astro 섬으로 렌더하고, 시각 값은
  전부 `@horon-ai/tokens`에서 읽습니다.
