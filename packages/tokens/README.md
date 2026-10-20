# @horon-ai/tokens

Horon 디자인 토큰의 정본입니다. 색(sand 중성, gold 액센트, 잉크 primary, 상태색, 유리 표면),
반경, 간격, 타이포, 모션, 그림자 값이 TypeScript 객체로 정의되어 있고, `theme.css`가 그 값에서
생성됩니다.

## 구성

| 파일 | 역할 |
| --- | --- |
| `src/palette.ts` | 원본 팔레트 단계(oklch) |
| `src/tokens.ts` | 라이트·다크 의미 색 토큰 |
| `src/scales.ts` | 반경, 간격, 타이포, 모션, 그림자, 유리 표면 값 |
| `src/css.ts` | 토큰을 CSS로 직렬화하는 생성기 |
| `src/color.ts` | oklch 파싱·변환 유틸 |
| `theme.css` | 위 값에서 생성된 CSS (직접 수정하지 않습니다) |

## theme.css 재생성

`theme.css`는 손으로 고치지 않습니다. 토큰 소스를 바꾼 뒤 다음 명령으로 다시 씁니다.

```bash
bun run build            # packages/tokens 안에서
bun run --filter @horon-ai/tokens build   # 저장소 루트에서
```

게시할 때도 같은 빌드가 자동으로 돕니다. `package.json`의 `prepublishOnly`가 `bun run build`를
실행하므로 오래된 `theme.css`가 tarball에 실리지 않습니다.

## 소비

앱 진입 CSS에서 한 번 import합니다.

```css
@import "@horon-ai/tokens/theme.css";
```

`@horon-ai/react`를 쓴다면 이 import는 `@horon-ai/react/globals.css`에 이미 들어 있으므로
따로 적지 않아도 됩니다. Tailwind v4의 `@theme inline` 변수, `:root`·`.dark` 색 변수,
브레이크포인트, 역할 반경(`--radius-control|card|panel|pill`)이 모두 이 파일에서 나옵니다.

## 검사

드리프트 가드는 커밋된 `theme.css`가 생성기 출력과 바이트 단위로 같은지 확인합니다. 토큰을
바꾸고 재생성을 잊으면 테스트가 실패합니다.

```bash
bun test packages/tokens      # 저장소 루트에서
```

대비 검사 스크립트는 유리 표면의 전경색이 여러 배경 위에서 WCAG AA(4.5:1)를 넘는지 계산하고,
하나라도 미달이면 0이 아닌 종료 코드로 끝납니다.

```bash
bun run --filter @horon-ai/tokens contrast
```

## 패키지 내용

tarball에는 `src/`, 생성된 `theme.css`, 이 README가 들어갑니다. 토큰 소스를 그대로 배포하므로
소비 프로젝트가 값을 직접 import해 계산에 쓸 수도 있습니다.

```ts
import { colorTokens, radiusRole } from "@horon-ai/tokens";
```

## 게시

`@horon-ai` 스코프는 공개 패키지입니다(`publishConfig.access: public`). 저장소 루트의
`bun run publish:packages`가 tokens를 빌드하고 tokens → react 순서로 게시합니다.
