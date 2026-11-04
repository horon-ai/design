# design

horon의 디자인 시스템입니다. 색·간격·글자·모션·표면 값을 토큰 한 곳에서 정의하고, 웹 컴포넌트와 문서 사이트가 그 값을 그대로 소비합니다. 그래서 컴포넌트와 문서의 색·간격·타이포가 어긋나지 않습니다.

토큰 정본은 `@horon-ai/tokens` 하나이고, 값은 Figma `Horon` 파일(Components `54:81`, Typography `26:2`)에서 읽었습니다. 색(잉크·종이·하늘), 유리 표면, 글자, 반경, 그림자가 여기서 나옵니다. 컴포넌트는 `@horon-ai/react` 하나이고, Base UI(`@base-ui/react`)와 Tailwind CSS v4 위에 올라갑니다. shadcn/ui는 쓰지 않습니다.

## 무엇을 제공하나

- **토큰**: 라이트·다크 시맨틱 색, 유리 레이어, 13개 글자 스타일(Web·Desktop·Mobile), 반경·그림자, 생성된 `theme.css`
- **웹 컴포넌트**: import하면 바로 쓰는 React 컴포넌트. 단일 진입점과 하위 경로 진입점을 함께 제공
- **문서 사이트**: design.horon.ai. 컴포넌트 목록과 라이브 프리뷰

## 구조

```
apps/
  site/         @horon/site        문서 사이트 — design.horon.ai (Astro + React)
packages/
  tokens/       @horon-ai/tokens   디자인 토큰 단일 소스 (+ 생성된 theme.css)
  react/        @horon-ai/react    웹 컴포넌트 — Base UI + Tailwind v4
  flutter/      horon_ui           Flutter 컴포넌트 + example 갤러리 앱
```

컴포넌트 레이어는 웹의 `@horon-ai/react`와 Flutter의 `horon_ui` 둘이고, 둘은 같은 토큰 정본을 읽습니다. site가 `@horon-ai/react`를 소비하고, 스타일은 `@horon-ai/tokens`의 `theme.css`에서 읽습니다. `packages/flutter`는 Dart 패키지라 `package.json`이 없어 bun 워크스페이스 밖에 있고, `dart`·`flutter` 명령으로 검사합니다. 정적 검사는 각 패키지·앱의 `.oxlintrc.json`을 읽는 oxlint가 맡고, `bun run lint`가 이를 실행합니다.

```tsx
import { Button, Card, Input } from "@horon-ai/react";
```

## 시작하기

```bash
bun install
bun run tokens        # 토큰 CSS(theme.css) 생성
bun run site          # 문서 사이트 → http://localhost:4321 (tokens 원본·react 변경을 hot reload)
```

## 컴포넌트 사용

```tsx
import { Button, Card } from "@horon-ai/react";
import "@horon-ai/react/globals.css"; // 엔트리에서 한 번

<Card title="Inbox Manager" description="6 emails need you." />;
<Button variant="glass">취소</Button>;
```

`@horon-ai/react`는 단일 진입점(`"."`)과 하위 경로(`@horon-ai/react/components/button`)를 모두 제공합니다.

## 토큰

- **색**: `packages/tokens/src/color.ts`에 Figma 시맨틱 변수의 라이트·다크 값이 있습니다. 이름은 Figma WEB 코드 문법과 같습니다(`--color-text-primary`).
- **유리**: `glass.ts`에 Figma `Liquid layers`의 값과 높이 비례 규칙이 있습니다. 웹은 `LiquidGlass` 컴포넌트로 그립니다.
- **글자**: `typography.ts`에 13개 스타일의 Web·Desktop·Mobile 크기와 줄 높이가 있습니다. `data-platform="desktop"` / `"mobile"`로 바꿉니다.
- **반경·그림자**: `scale.ts`.

수정 순서는 이렇습니다.

1. Figma에서 값을 읽어 `packages/tokens/src/*.ts`를 고칩니다.
2. `bun run --filter @horon-ai/tokens build`로 `packages/tokens/theme.css`를 다시 생성합니다.
3. 컴포넌트는 Tailwind 유틸리티(`bg-interactive-primary`, `text-label-md`, `rounded-xl` 등)로 같은 값을 씁니다.

`theme.css`를 손으로 고치거나 생성기를 낡게 두면 드리프트 가드 테스트가 실패합니다.

## 컴포넌트 추가

새 컴포넌트는 Figma Components 보드의 실제 노드 값을 읽어 `packages/react/src/components/<이름>.tsx`에 Base UI로 만듭니다. `packages/react/src/index.ts`에 넣고, `apps/site/src/data/components.ts`에 항목을 추가하고, `apps/site/src/components/demos/<slug>.tsx`에 라이브 프리뷰를 만듭니다. `bun test`가 배럴 재수출과 사이트 목록·프리뷰가 서로 맞는지 확인합니다.

`cn()`은 `@horon-ai/react`에서 가져옵니다.

## 문서 사이트

사이트의 컴포넌트 목록은 `apps/site/src/data/components.ts`가 소유합니다. 컴포넌트를 추가하면 이 파일에 항목을 넣고, 라이브 프리뷰를 붙이려면 `apps/site/src/components/demos/<slug>.tsx`를 만들어 같은 항목에 `demo`를 지정합니다. 데모 래퍼(`components/demo-wrappers/`)는 `bun run build`가 자동으로 생성하므로 커밋하지 않습니다. 사이트는 `@horon-ai/react` 컴포넌트를 Astro 섬으로 렌더하고, 시각 값은 전부 `@horon-ai/tokens`에서 읽습니다.

## 패키지 게시 (npm)

라이브러리 두 패키지(`@horon-ai/react`, `@horon-ai/tokens`)는 버전 `0.1.0`이고
`publishConfig.access`가 `public`입니다. 앱(`@horon/site`)과 저장소 루트는 `private: true`라
게시 대상이 아닙니다.

두 패키지는 같은 버전으로 움직입니다. `0.1.0`이 첫 게시 버전이고, 이후에도
`packages/tokens/package.json`과 `packages/react/package.json`의 `version`을 함께 올립니다.
`@horon-ai/react`의 `@horon-ai/tokens` 의존은 워크스페이스에서 `workspace:*`로 두고,
`bun pm pack`이 게시 시점에 같은 버전으로 바꿉니다. 그래서 `packages/react/package.json`의
`workspace:*`를 손으로 고치지 않습니다.

### GitHub Actions로 게시

`.github/workflows/publish.yml`이 두 패키지를 npm에 게시합니다. 태그를 밀거나 Actions 탭에서
`Publish npm packages`를 수동 실행하면 됩니다. 두 경로 모두 게시 전에 lint·typecheck·test·build를
다시 돌리고, npm에 이미 있는 버전은 건너뛰므로 재실행해도 안전합니다. 게시에는 npm provenance가
붙습니다(OIDC 서명, 실행한 워크플로와 커밋이 npm 패키지 페이지에 표시됨).

```bash
# 1. 저장소 시크릿 NPM_TOKEN 을 한 번 등록한다 (npm granular access token, 공개 패키지 게시 권한)
#    Settings → Secrets and variables → Actions → New repository secret

# 2. 버전을 함께 올린다 (아직 0.1.0이면 생략)
#    packages/tokens/package.json, packages/react/package.json

# 3. 커밋을 dev 또는 main에 올린 뒤, 같은 커밋에 태그를 만들어 민다
git tag v0.1.0
git push origin v0.1.0
```

태그 이름은 `v`와 패키지 버전을 붙인 형식이어야 합니다. `v0.1.0` 태그인데 package.json이
`0.1.1`이면 워크플로가 게시 전에 멈춥니다. 태그 없이 게시하려면 Actions 탭에서 수동 실행합니다.

```bash
# 4. 레지스트리에서 확인한다
npm view @horon-ai/tokens@0.1.0 version
npm view @horon-ai/react@0.1.0 version
```

### 로컬에서 게시

CI를 거치지 않고 급할 때만 씁니다. provenance는 붙지 않습니다.

```bash
bun run publish:packages
```

게시한 뒤에는 `web/package.json`과 `desktop/package.json`의 `file:` 의존을
`"@horon-ai/react": "0.1.0"`, `"@horon-ai/tokens": "0.1.0"` 같은 정확한 버전으로 바꾸고
`bun install`로 확인합니다. 범위(`^0.1.0`)는 쓰지 않습니다.

## 검증

```bash
bun test                          # 토큰 드리프트 가드 + 배럴 재수출 + 사이트 목록 커버리지
bun run typecheck                 # 전 워크스페이스 타입 검사
bun run lint                      # 경계 규칙 포함 린트
bun run build                     # 토큰 + 문서 사이트 빌드
bun run build:site                # 문서 사이트 정적 빌드
```

CI(`.github/workflows/ci.yml`)도 같은 lint·typecheck·test·build를 돌립니다. Flutter 패키지는
별도 잡이 `flutter analyze --fatal-infos`, `dart format --set-exit-if-changed lib test example`,
`flutter test`, 갤러리 테스트로 검사합니다.

## 배포

문서 사이트를 Cloudflare Pages 프로젝트로 배포합니다. `main`이 프로덕션 브랜치이고 `dev`가 통합 브랜치입니다. 작업은 `dev`에 쌓고 배포할 때 `dev`를 `main`으로 병합합니다.

| 대상        | 프로젝트       | URL                     | 출력             | 수동 배포             |
| ----------- | -------------- | ----------------------- | ---------------- | --------------------- |
| 문서 사이트 | `horon-design` | https://design.horon.ai | `apps/site/dist` | `bun run deploy:site` |

프로젝트는 GitHub 저장소(`horon-ai/design`)가 연결돼 있어 `main`에 푸시하면 자동으로 빌드·배포됩니다. 수동 배포는 `wrangler` CLI가 설치·로그인돼 있어야 합니다(`wrangler login`).

## 알아 둘 점

- 패키지는 소스(`.tsx`) 그대로 배포합니다(내부 패키지 방식). Vite와 Astro가 각각 변환합니다.
- 앱 `@horon/site`와 저장소 루트는 `private: true`입니다. 라이브러리 두 패키지는 게시 설정이 `public`이고, 실제 게시는 위 npm 절차를 따릅니다.
