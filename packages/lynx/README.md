# @horon-ai/lynx

Horon 디자인 시스템의 ReactLynx 구현입니다. `@horon-ai/react`와 같은 84개 컴포넌트를 같은 슬러그, 같은 export 이름, 같은 variant 값, 같은 `@horon-ai/tokens` 값으로 Lynx 요소 위에 다시 만들었습니다. 웹·iOS·Android·HarmonyOS 앱에서 한 번 작성한 UI를 그대로 씁니다.

## 설치

이 패키지는 `@horon-ai/react`·`@horon-ai/tokens`와 같은 게시 흐름으로 npm에 `@horon-ai/lynx`로 올라갑니다. 세 패키지는 늘 같은 버전(0.1.x)으로 함께 게시되고, 여기서 쓰는 `@horon-ai/tokens`도 같은 버전입니다.

```sh
bun add @horon-ai/lynx @lynx-js/react
bun add -d tailwindcss@^3 @lynx-js/tailwind-preset
```

Tailwind는 **v3**여야 합니다. `@lynx-js/tailwind-preset`이 v4와 호환되지 않습니다.

```js
// tailwind.config.cjs
const lynxPreset = require("@lynx-js/tailwind-preset");
const horonPreset = require("@horon-ai/lynx/tailwind-preset");

module.exports = {
  content: ["./src/**/*.{ts,tsx}", "./node_modules/@horon-ai/lynx/src/**/*.{ts,tsx}"],
  presets: [lynxPreset, horonPreset],
  corePlugins: { preflight: false },
};
```

`content`에 `./node_modules/@horon-ai/lynx/src/**/*.{ts,tsx}`를 넣는 이유는 이 패키지가 TypeScript 소스를 그대로 배포하기 때문입니다. `globals.css`의 `@tailwind utilities`는 소비자의 `content`를 보고 클래스를 만들므로, 패키지 소스를 스캔하지 않으면 컴포넌트 안에서만 쓰는 클래스가 CSS에 빠집니다.

```tsx
// 앱 진입점
import "@horon-ai/lynx/globals.css";
```

```tsx
import { root } from "@lynx-js/react";
import { HoronProvider, Button, Card } from "@horon-ai/lynx";

function App() {
  return (
    <HoronProvider scheme="dark" platform="mobile">
      <Card>
        <Button onClick={() => console.log("tap")}>Continue</Button>
      </Card>
    </HoronProvider>
  );
}

root.render(<App />);
```

## 구성

| 경로 | 내용 |
|---|---|
| `src/components/<slug>.tsx` | 컴포넌트 84개. `@horon-ai/react`와 같은 슬러그·이름 |
| `src/index.ts` | 배럴. `scripts/integrate.ts`가 생성 |
| `src/provider.tsx` | `HoronProvider`, `useHoronTheme`, 테마 값 |
| `src/hooks` | react 훅의 Lynx 대체 8종 |
| `src/icons` | phosphor 아이콘을 `<svg content>` 문자열로 생성한 글리프 |
| `src/styles/tokens.css` | 토큰 CSS 변수. `scripts/generate-tokens.ts`가 생성 |
| `tailwind-preset.cjs` | 토큰 클래스 프리셋. 같은 스크립트가 생성 |
| `example/` | 갤러리 앱. `main.lynx.bundle`과 `main.web.bundle` 두 번들 |

## 명령

```sh
bun run build        # example/dist/main.lynx.bundle + main.web.bundle
bun run gallery:web  # 브라우저에서 갤러리 (PORT, 기본 4610)
bun run test         # 렌더·상호작용 테스트 (rstest)
bun test             # 패리티·토큰 드리프트 검사 (저장소 루트 `bun test`에 포함)
bun run integrate    # 배럴·갤러리 레지스트리·미구현 원장 재생성
bun run tokens       # 토큰 CSS·Tailwind 프리셋 재생성
bun run icons        # 아이콘 글리프 재생성
bun run lint         # oxlint (React 패키지와 같은 규칙)
bun run lint:fix     # oxlint 자동 수정
bun run typecheck    # tsc --noEmit
bun run format       # Prettier. 이 패키지의 .prettierrc.json은 Tailwind v3 설정으로 클래스를 정렬
```

생성 파일(`src/index.ts`, `example/registry.g.ts`, `test/pending.ts`, `src/styles/tokens.css`, `tailwind-preset.cjs`, `src/icons/phosphor.g.ts`)은 직접 고치지 않습니다. CI가 재생성 결과가 커밋과 같은지 확인합니다.

## React 패키지와 다른 점

Lynx에는 DOM이 없고, 일부 CSS·API도 없습니다. 컴포넌트의 이름·variant·색·치수는 같지만 다음은 다릅니다.

- **요소**: `div`/`button`/`input` 대신 `view`/`text`/`image`/`input`/`textarea`/`scroll-view`/`blur-view`. 글자는 반드시 `<text>` 안에 들어갑니다.
- **상태**: Base UI가 없어 checked/open/value 같은 상태 prop을 컴포넌트가 직접 받습니다. 이름과 기본값은 같습니다.
- **유리**: `<blur-view>`(Lynx 4.0)로 backdrop을 필터합니다. iOS는 Liquid Glass, web은 CSS `backdrop-filter`, Android·HarmonyOS는 캡처 블러입니다. Clay 데스크톱 렌더러처럼 지원하지 않는 엔진은 `glass-fill-frost`로 떨어집니다. `saturate(1.8)`은 `<blur-view>`가 받지 않아 빠집니다.
- **모션**: `hover:`·`focus-visible:`가 없어 `active:`(터치)로 대체하고, `data-*`·`:last-child`·`has-[]`를 쓸 수 없어 상태를 JS로 계산합니다. Tailwind v4 전용 간격은 같은 px 임의값으로 적었습니다.
- **오버레이**: 포털이 없어 `position: fixed` 뷰를 그 자리에서 그립니다. 스크림 탭·닫기 컨트롤이 종료 경로입니다(Escape·포커스 트랩 없음).
- **달력·목록**: 키보드 포커스 이동이 없어 탭으로만 선택합니다.
- **파일**: `file-drop`은 `File`·드래그 API가 없어 호스트가 넘긴 파일 기술자를 `onFiles`로 보고합니다.
- **DOM 전용 제외**: `mountCursorGhost`(데스크톱 커서 꼬리)는 옮기지 않았습니다.
- **Base UI에서 물려받는 prop**: 동작에 관한 prop(`open`/`onOpenChange`, `onValueChange`, `orientation`, `readOnly`, `format`/`locale` 등)은 같은 이름으로 받습니다. DOM·폼·키보드 포커스에 묶인 prop(`render`, `nativeButton`, `ref`, `inputRef`, `actionsRef`, `form`, `name`, 토글의 폼 `value`, `uncheckedValue`, `required`, `autoComplete`, `initialFocus`/`finalFocus`, `focusableWhenDisabled`, `loopFocus`, `activateOnFocus`, `largeStep`, `highlightItemOnHover`, `nativeLabel`, Field 검증·폼 상태)은 받지 않습니다. 목록과 이유는 `test/props-parity.test.ts`에 있습니다.
- **`style`**: Base UI는 상태를 받는 함수도 허용하지만 Lynx는 `CSSProperties` 객체만 받습니다.

## 패리티 검사

`bun test packages/lynx/test/parity.test.ts`가 `packages/react/src/components`와 이 패키지를 비교합니다.

- 파일 슬러그 집합이 같아야 합니다(미구현은 `test/pending.ts`, 지금은 비어 있음).
- 파일마다 값 export 이름과 `export type` 이름이 같아야 합니다.
- `export type X = "a" | "b"` 형태의 문자열 유니언은 리터럴 집합이 같아야 합니다.

`bun test packages/lynx/test/props-parity.test.ts`는 TypeScript 검사기로 컴포넌트마다 prop을 비교합니다(`bun packages/lynx/test/props-parity.ts`로 실행하면 차이 목록만 출력합니다).

- React가 직접 선언한 prop은 Lynx에도 같은 이름, 같은 필수 여부, 같은 문자열 리터럴 집합, 같은 기본값(`@default` 태그나 구조 분해 기본값)으로 있어야 합니다.
- React가 Base UI에서 물려받은 prop은 같은 이름, 필수 여부, 리터럴 집합으로 있어야 합니다. 기본값은 Base UI d.ts가 정하므로 비교하지 않습니다.
- React DOM 속성(`onKeyDown`, `tabIndex` 등)은 개수만 셉니다.
- 플랫폼 때문에 다른 항목은 이유와 함께 허용 목록에 두고, 실제 차이와 맞지 않는 허용 항목이 남으면 실패합니다.
