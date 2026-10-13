# horon design

웹(React)과 React Native에서 **import 하면 바로 쓰는** 컴포넌트·레이아웃 라이브러리입니다.
디자인 토큰을 한 곳에서 정의하고, 웹은 Tailwind CSS v4, 네이티브는 같은 값의 StyleSheet를
쓰기 때문에 두 플랫폼의 색·간격·타이포가 어긋나지 않습니다.

토큰 정본은 `@horon/tokens` 하나입니다. 확정 Horon 팔레트(sand 중성 + gold 액센트 + 잉크
primary), glass 표면, 모션, 그리고 React Native가 그대로 쓰는 폰트·그림자 값이 모두 여기서
나옵니다.

## 구조

```
apps/
  native/       @horon/native      Expo 앱 — @horon/app 을 소비해 네이티브 렌더를 증명
  playground/   @horon/playground  웹 데모 앱 (@horon/web 만 사용)
  storybook/    @horon/storybook   두 레이어를 함께 미리보기 (개발 도구)
packages/
  tokens/       @horon/tokens      디자인 토큰 단일 소스 (+ 생성된 theme.css)
  app/          @horon/app         앱(React Native) 컴포넌트 — 네이티브 전용
  web/          @horon/web         웹 컴포넌트 — shadcn/ui (Base UI) + Tailwind v4
```

## import 경계 (중요)

**앱 코드는 `@horon/app`만, 웹 코드는 `@horon/web`만 import 합니다.** 두 패키지는 서로를
참조하지 않고, 이 경계는 각 패키지·앱의 `eslint.config.js`에 있는
`no-restricted-imports` 규칙으로 강제됩니다. 어기면 `bun run lint`가 막습니다.

| 위치                          | import 가능                   | 금지                                          |
| ----------------------------- | ----------------------------- | --------------------------------------------- |
| `packages/app`, `apps/native` | `@horon/app`, `@horon/tokens` | `@horon/web`, `react-native-web`, `react-dom` |
| `packages/web`, 웹 앱         | `@horon/web`, `@horon/tokens` | `@horon/app`, `react-native`                  |

```tsx
// 앱(React Native)
import { Button, Card, CardTitle, CardContent, Text } from "@horon/app"

// 웹
import { Button, Card, CardTitle, CardContent } from "@horon/web"
```

Storybook(`apps/storybook`)만 예외입니다. 이 앱은 `@horon/app`의 React Native 컴포넌트를
`react-native-web`으로 렌더해 웹에서 확인하는 **미리보기 도구**라서 두 레이어를 함께
불러옵니다. 제품 코드는 여기에 해당하지 않습니다.

## 시작하기

```bash
bun install
bun run tokens        # 토큰 CSS(theme.css) 생성
bun run storybook     # Storybook → http://localhost:6006 (두 레이어 미리보기)
bun run playground    # 웹 데모 앱
```

네이티브는 별도로 띄웁니다. `apps/native`가 `@horon/app`을 그대로 소비합니다.

```bash
cd apps/native
bunx expo start --ios    # iOS 시뮬레이터에서 네이티브 렌더 확인
```

## 컴포넌트 사용

### React Native 앱 — `@horon/app`

```tsx
import { Button, Card, CardTitle, CardContent, Text } from "@horon/app"

export function Screen() {
  return (
    <Card>
      <CardTitle>제목</CardTitle>
      <CardContent>
        <Text variant="bodySm" tone="muted">설명</Text>
        <Button>확인</Button>
      </CardContent>
    </Card>
  )
}
```

Metro가 워크스페이스 패키지를 읽도록 `metro.config.js`에 `watchFolders`와
`nodeModulesPaths`를 모노레포 루트로 잡아 주세요. `apps/native`가 그 예입니다.

### React 웹 앱 — `@horon/web`

```tsx
import { Button, Card, CardHeader, CardTitle } from "@horon/web"
import "@horon/web/globals.css" // 엔트리에서 한 번

<Card>
  <CardHeader>
    <CardTitle>제목</CardTitle>
  </CardHeader>
  <Button variant="outline">취소</Button>
</Card>
```

`@horon/web`은 단일 진입점(`"."`)과 하위 경로(`@horon/web/components/button`)를 모두
제공합니다.

## 토큰

정본은 `packages/tokens` 하나입니다. 색·표면·모션·폰트·그림자가 여기서 나오고, 웹과
네이티브가 같은 값을 씁니다.

- **팔레트**: `packages/tokens/src/palette.ts`의 raw 램프(sand 12+6, gold, status)를
  `tokens.ts`에서 시맨틱 이름으로 매핑합니다. 표면·텍스트·경계는 sand, `primary`는 잉크,
  `accent`/`ring`은 gold입니다.
- **glass**: `glass-fill`·`glass-border`·`glass-foreground`(자체 foreground)와 강등 래더
  (frost, solid)를 `tokens.ts`에, blur 반경은 `scales.ts`에 둡니다. 웹의 `.glass` /
  `.glass-strong` 유틸리티와 `prefers-reduced-transparency`·`no backdrop-filter` 강등이
  여기서 파생됩니다.
- **모션**: `scales.ts`의 `duration`(ms 숫자)과 `easing`(웹은 CSS 문자열, 네이티브는
  `Easing.bezier`가 먹는 4-튜플).
- **폰트·그림자**: `scales.ts`에서 웹/네이티브로 나뉩니다. 네이티브는 RN 단일 패밀리명
  (`Geist`)과 플랫폼별 그림자(iOS shadow props / Android elevation)를 씁니다.

수정 순서는 이렇습니다.

1. 색은 `packages/tokens/src/palette.ts`, 간격·반경·글자·모션·폰트·그림자는
   `packages/tokens/src/scales.ts`에서 고칩니다.
2. `bun run tokens`로 `packages/tokens/theme.css`를 다시 생성합니다.
3. 웹은 Tailwind 유틸리티(`bg-primary`, `rounded-lg` 등)로, 네이티브는
   `@horon/tokens/native`가 주는 hex·숫자 값으로 같은 색·간격을 씁니다.

## shadcn 컴포넌트 추가·커스텀

`packages/web`에 `components.json`(style: `base-nova`)이 있어 Base UI 기반으로
벤더링됩니다.

```bash
npx shadcn@latest add dialog sheet -c packages/web
```

파일은 `packages/web/src/components/`에 생성됩니다. 새 컴포넌트를 단일 진입점에서도
쓰려면 `packages/web/src/index.ts`에 한 줄 추가하세요.

```ts
export * from "./components/dialog"
```

`cn()`은 `@horon/web/lib/utils`에서 가져옵니다.

## 배포 (Storybook)

Storybook 정적 사이트는 Cloudflare Pages 프로젝트 `horon-storybook`으로 배포합니다.

- 프로덕션 URL: https://horon-storybook.pages.dev
- **자동 배포**: GitHub 저장소(`horon-ai/design`)가 연결돼 있어 **`dev` 브랜치에 푸시하면 자동으로 빌드·배포**됩니다.
  - 빌드: `bun install && bun run build:storybook`
  - 출력: `apps/storybook/storybook-static`
- 수동 배포(폴백): `bun run deploy:storybook` — `wrangler` CLI가 설치·로그인돼 있어야 합니다(`wrangler login`).

## 검증

```bash
bun test                          # 토큰 드리프트 가드 + 팔레트 스냅샷
bun run typecheck                 # 전 워크스페이스 타입 검사
bun run lint                      # 경계 규칙 포함 린트
bun run build                     # 토큰 + 웹 앱 빌드
bun run build:storybook           # Storybook 정적 빌드
```

`bun test`가 토큰 드리프트 가드를 돌립니다. `theme.css`를 손으로 고치거나 생성기를 낡게
두면 재생성 결과와 달라져 테스트가 실패합니다. CI(GitHub Actions)도 같은
lint·typecheck·test·build를 돌립니다.

## 알아 둘 점

- 두 패키지 모두 소스(`.tsx`) 그대로 배포합니다(내부 패키지 방식). 네이티브는 Metro가,
  웹은 Vite가 각각 변환합니다.
- `@horon/app`의 React Native 컴포넌트를 웹에서 확인하려면 Storybook을 씁니다. 웹 앱은
  `@horon/web`만 쓰므로 웹 번들에 `react-native-web`이 들어가지 않습니다.
- `apps/native`(Expo)는 `@horon/app`을 그대로 소비해 네이티브 렌더를 증명합니다.
  `metro.config.js`가 모노레포 루트를 watch하고, Geist 폰트는 `expo-font`로 로드해
  `fontFamily.native.sans`가 런타임에 해석됩니다.
