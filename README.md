# horon design

웹(React)과 React Native에서 **import 하면 바로 쓰는** 컴포넌트·레이아웃 라이브러리입니다.
디자인 토큰을 한 곳에서 정의하고, 웹은 Tailwind CSS v4, 네이티브는 같은 값의 StyleSheet를
쓰기 때문에 두 플랫폼의 색·간격·타이포가 어긋나지 않습니다.

## 구조

```
apps/
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

| 위치                        | import 가능                   | 금지                                          |
| --------------------------- | ----------------------------- | --------------------------------------------- |
| `packages/app`, 네이티브 앱 | `@horon/app`, `@horon/tokens` | `@horon/web`, `react-native-web`, `react-dom` |
| `packages/web`, 웹 앱       | `@horon/web`, `@horon/tokens` | `@horon/app`, `react-native`                  |

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
`nodeModulesPaths`를 모노레포 루트로 잡아 주세요.

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

## 토큰 수정

1. 색은 `packages/tokens/src/tokens.ts`, 간격·반경·글자 크기는
   `packages/tokens/src/scales.ts`에서 고칩니다.
2. `bun run tokens`로 `packages/tokens/theme.css`를 다시 생성합니다.
3. 웹은 Tailwind 유틸리티(`bg-primary`, `rounded-lg` 등)로, 네이티브는
   `@horon/tokens/native`가 준 hex 값으로 같은 색을 씁니다.

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

## 검증

```bash
bun run typecheck                 # 전 워크스페이스 타입 검사
bun run lint                      # 경계 규칙 포함 린트
bun run build:storybook           # Storybook 정적 빌드
bun run build                     # 토큰 + 웹 앱 빌드
```

## 알아 둘 점

- 두 패키지 모두 소스(`.tsx`) 그대로 배포합니다(내부 패키지 방식). 네이티브는 Metro가,
  웹은 Vite가 각각 변환합니다.
- `@horon/app`의 React Native 컴포넌트를 웹에서 확인하려면 Storybook을 씁니다. 웹 앱은
  `@horon/web`만 쓰므로 웹 번들에 `react-native-web`이 들어가지 않습니다.
- 아직 React Native 앱 프로젝트는 이 저장소에 없습니다. `apps/native`(Expo)를 추가해
  `@horon/app`을 소비하게 하고, 그 앱에도 같은 경계 규칙을 넣으면 됩니다.
