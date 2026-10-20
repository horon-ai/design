# @horon-ai/react

Horon 웹 컴포넌트 라이브러리입니다. shadcn/ui(Base UI 기반) 컴포넌트 75개와 공용 스타일을
TypeScript 소스 그대로 배포합니다. 빌드 산출물(`dist`)이 없고, 소비하는 쪽 번들러가 이 소스를
직접 컴파일합니다.

## 설치

이 패키지는 버전 `0.1.0`에 `publishConfig.access: public`을 두었지만 **아직 npm 레지스트리에
게시되지 않았습니다**(게시용 토큰 만료). 지금 소비하는 쪽은 저장소 안 `file:` 의존으로
가져다 씁니다.

```json
{
  "dependencies": {
    "@horon-ai/react": "file:../design/packages/react",
    "@horon-ai/tokens": "file:../design/packages/tokens"
  }
}
```

레지스트리에 게시된 뒤에는 같은 줄을 정확한 버전으로 바꿉니다.

```bash
bun add @horon-ai/react@0.1.0 @horon-ai/tokens@0.1.0 react react-dom
npm install @horon-ai/react@0.1.0 @horon-ai/tokens@0.1.0 react react-dom
```

`react`와 `react-dom`은 peer 의존성입니다. React 19 이상이 필요하고, 패키지는 React 사본을
따로 들고 오지 않습니다. 소비 프로젝트에 React가 이미 있으면 그 사본을 씁니다.

```json
"peerDependencies": {
  "react": ">=19",
  "react-dom": ">=19"
}
```

## 진입 스타일

앱 진입점에서 CSS를 한 번만 import합니다. 이 파일이 `tailwindcss`, `tw-animate-css`,
`shadcn/tailwind.css`, Geist 폰트, 그리고 `@horon-ai/tokens/theme.css`를 차례로 불러옵니다.

```css
/* app/globals.css 같은 진입 CSS */
@import "@horon-ai/react/globals.css";
```

`@horon-ai/tokens/theme.css`를 따로 import할 필요는 없습니다. `globals.css`가 이미 포함합니다.

## Tailwind 클래스 스캔

Tailwind CSS v4는 프로젝트 밖 소스를 자동으로 스캔하지 않습니다. 이 패키지의 클래스가 생성되게
하려면 진입 CSS에 아래 한 줄을 넣어 패키지 소스를 명시적으로 등록하세요.

```css
@import "tailwindcss";
@source "node_modules/@horon-ai/react/src/**/*.{ts,tsx}";
@import "@horon-ai/react/globals.css";
```

`@horon-ai/react/globals.css`를 import하면 그 파일 안에 이미 같은 경로의 `@source`가 들어 있어
클래스가 생성됩니다. 그래도 명시 줄을 두는 편이 안전합니다. 번들러가 CSS 기준 경로를 다르게
해석하는 경우(예: Next.js의 postcss 처리)와 `globals.css`를 import하지 않고 토큰만 쓰는 경우를
모두 덮기 때문입니다.

경로가 틀리면 Tailwind는 오류를 내지 않고 조용히 스캔을 건너뜁니다. 컴포넌트는 렌더링되지만
레이아웃·색 클래스가 빠지므로, 처음 붙일 때 `min-w-0` 같은 클래스가 실제로 생성되는지 한 번
확인하세요. (로컬 tailwindcss 4.3.3 실측: 잘못된 경로는 패키지 클래스가 하나도 생성되지 않았고,
올바른 경로는 선택자 985개를 생성했습니다.)

## 번들러 설정

패키지가 TypeScript 소스를 그대로 내보내므로 소비하는 쪽이 이 소스를 변환해야 합니다.

- Next.js: `next.config.ts`에 `transpilePackages: ["@horon-ai/react"]`를 넣습니다.
- Vite: 기본 esbuild 변환이 `node_modules`의 `.ts`/`.tsx`를 처리합니다. `optimizeDeps.exclude`에
  `@horon-ai/react`를 넣으면 사전 번들링 캐시가 오래된 소스를 붙드는 일을 피할 수 있습니다.

## 사용

```tsx
import { Button, Card, CardContent, CardTitle } from "@horon-ai/react";

export function Example() {
  return (
    <Card>
      <CardTitle>Horon</CardTitle>
      <CardContent>
        <Button variant="default">시작하기</Button>
      </CardContent>
    </Card>
  );
}
```

## 하위 경로 export

| 지정자 | 가리키는 파일 |
| --- | --- |
| `@horon-ai/react` | `src/index.ts` (컴포넌트 전체) |
| `@horon-ai/react/globals.css` | `src/styles/globals.css` |
| `@horon-ai/react/components/*` | `src/components/*.tsx` |
| `@horon-ai/react/lib/*` | `src/lib/*.ts` |
| `@horon-ai/react/hooks/*` | `src/hooks/*.ts` (예약 경로 — 현재 구현 파일 없음) |
| `@horon-ai/react/package.json` | `package.json` |

컴포넌트를 하나만 가져오고 싶으면 하위 경로를 씁니다.

```tsx
import { Button } from "@horon-ai/react/components/button";
```

## 패키지 내용

tarball에는 `src/`와 이 README가 들어갑니다. 컴포넌트 구현, 스타일, `cn` 유틸이 모두
`src` 아래에 있으므로 소스 맵이나 별도 타입 선언 없이도 추적할 수 있습니다.

## 게시

`@horon-ai` 스코프는 공개 패키지입니다(`publishConfig.access: public`). 저장소 루트에서
`bun run publish:packages`를 실행하면 tokens를 빌드한 뒤 tokens와 react를 차례로 게시합니다.
