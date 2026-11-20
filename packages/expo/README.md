# @horon-ai/expo

Horon 디자인 시스템의 React Native(Expo) 구현입니다. `@horon-ai/react`와 같은 84개 컴포넌트를 같은 슬러그, 같은 export 이름, 같은 variant 값, 같은 `@horon-ai/tokens` 값으로 React Native 뷰 위에 다시 만들었습니다. 유리 표면은 `expo-glass-effect`로, 안전 영역은 `react-native-safe-area-context`로 그립니다.

## 설치

Expo SDK 58(React Native 0.88, React 19.3) 앱을 기준으로 합니다.

```sh
bun add @horon-ai/expo
bunx expo install expo-glass-effect expo-haptics expo-clipboard expo-document-picker react-native-safe-area-context react-native-svg expo-font
```

글꼴은 앱이 등록합니다. 컴포넌트는 `@horon-ai/tokens`의 첫 번째 글꼴 이름(`Pretendard Variable`, `Geist Mono Variable`)을 쓰므로 `expo-font`에 같은 이름으로 올립니다. 다른 이름으로 올렸다면 `HoronProvider`의 `fonts`로 알려 줍니다. 글꼴 파일과 라이선스는 `apps/expo-gallery/assets/fonts/`에 있습니다.

```tsx
import { useFonts } from "expo-font";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Button, Card, HoronProvider } from "@horon-ai/expo";

export default function App() {
  const [loaded] = useFonts({
    "Pretendard Variable": require("./assets/fonts/PretendardVariable.ttf"),
    "Geist Mono Variable": require("./assets/fonts/GeistMono-Variable.ttf"),
  });
  if (!loaded) return null;
  return (
    <SafeAreaProvider>
      <HoronProvider>
        <Card title="Inbox Manager" description="6 emails need you." />
        <Button onPress={() => console.log("tap")}>Continue</Button>
      </HoronProvider>
    </SafeAreaProvider>
  );
}
```

Expo Router를 쓰면 `SafeAreaProvider`는 라우터가 이미 넣으므로 `HoronProvider`만 감쌉니다.

## HoronProvider

| prop | 기본값 | 뜻 |
|---|---|---|
| `scheme` | `"system"` | `light`·`dark`·`system`. `system`은 OS 화면 모드를 실시간으로 따릅니다. |
| `platform` | `"mobile"` | 글자 크기 보드(`web`·`desktop`·`mobile`). 폰·태블릿은 Mobile 열을 씁니다. |
| `reducedMotion` | OS 설정 | 비워 두면 OS의 동작 줄이기를 따르고, 켜지면 모든 애니메이션이 끝 상태로 바로 갑니다. |
| `touch` | `true` | 44pt보다 작은 컨트롤에 `hitSlop`을 붙여 손가락 타깃을 44pt로 맞춥니다. 그려지는 크기는 그대로입니다. |
| `haptics` | `true` | 누를 때마다 `expo-haptics` 진동을 줍니다. 끄면 앱 전체에서 진동이 멈춥니다. |
| `glass` | `"auto"` | `auto`는 가능한 곳에서 네이티브 Liquid Glass, `frost`는 어디서나 대체 모양을 씁니다. |
| `fonts` | 토큰 첫 글꼴 | `expo-font`에 등록한 글꼴 이름(`sans`, `mono`). |

`useHoronTheme()`은 현재 색(`color(token)`), 글자 스타일(`text(style)`), 화면 모드, 유리 방식, 접근성 상태를 돌려줍니다. 컴포넌트는 이 값만 읽고 색·간격을 직접 적지 않습니다.

## 유리 표면 (Liquid Glass)

유리는 직접 그리지 않고 `expo-glass-effect`를 씁니다. `GlassSurface`가 판단을 한곳에서 합니다.

| 환경 | 그리는 것 |
|---|---|
| iOS 26 이상, 투명도 줄이기 꺼짐 | `GlassView`. `clear` 단계는 `clear` 효과, `regular`·`thick`은 `regular` 효과이고 `thick`에는 `glass-thick` 색조를 더합니다. 앱 화면 모드를 `colorScheme`으로 넘깁니다. |
| Android, iOS 26 미만, 투명도 줄이기 켜짐, `glass="frost"` | 뒤 배경을 흐리게 할 수 없으므로 `glass-fill-frost` 채움에 토큰 테두리(위 밝음, 옆 옅음, 아래 중간)를 둡니다. `@horon-ai/tokens` `glass.ts`가 정한 대체 규칙과 같습니다. |

- 판정은 `isLiquidGlassAvailable()`과 `isGlassEffectAPIAvailable()`(일부 iOS 26 베타의 API 누락 대비)이 모두 참이고 `AccessibilityInfo`의 투명도 줄이기가 꺼져 있을 때만 네이티브입니다. 함수가 예외를 던지면 대체 모양으로 갑니다.
- 메뉴·팝업·대화상자 같은 오버레이는 `material="veil"`로 그립니다. 대체 모양에서는 링과 그림자가 붙습니다.
- 눌림 반응: 네이티브 유리는 `isInteractive`로 iOS가 직접 반응합니다. 대체 모양에는 시스템 효과가 없으므로 `pressed`가 참인 동안 `overlay-ink-8`(밝은 화면에서는 어두운 잉크, 어두운 화면에서는 밝은 잉크)을 채움 위에 한 겹 더 칠합니다.
- Apple 권고대로 유리와 그 부모에 1보다 작은 `opacity`를 주지 않습니다.
- `LiquidGlass`는 react처럼 호스트 안에 까는 레이어이고, 표면 전체를 소유하는 컴포넌트는 `GlassSurface`를 직접 씁니다.

## 안전 영역

`react-native-safe-area-context`의 insets를 읽습니다. 화면 가장자리에 붙는 컴포넌트만 그 가장자리만큼 안쪽 여백을 둡니다.

| 컴포넌트 | 반영하는 가장자리 |
|---|---|
| `TopBar` | 위 |
| `TabBar` | 아래 |
| `BottomSheet` | 아래 |
| `Toaster` | 위·아래(놓인 쪽) |
| `Sidebar` | 위·아래·왼쪽 |
| `Modal`, `Dialog`(전체 화면) | 필요한 가장자리 |

`useInsets()`는 `SafeAreaProvider`가 없으면 네 방향 모두 0을 돌려줍니다. 미리보기·테스트·다른 앱 안에 끼워 넣은 화면에서도 깨지지 않게 하려는 것입니다.

## 접근성과 상태

- 눌리는 요소는 `HoronPressable`(RN `Pressable` 기반)이고 `role`(button, link, switch, checkbox, radio, tab, menuitem, combobox, adjustable, progressbar 등), 접근 이름, `accessibilityState`(disabled, checked, selected, expanded, busy), 필요한 곳에 `accessibilityValue`를 붙입니다. 슬라이더는 VoiceOver의 올리기·내리기 동작을 받습니다.
- 눌림은 react의 `active:` 색, 비활성은 40% 불투명도에 누름 무시, 로딩은 react와 같이 스피너와 `busy` 상태입니다. react가 `motion-press`를 쓰는 컨트롤은 누르는 동안 0.97배로 줄어듭니다(동작 줄이기에서는 생략).
- 햅틱: 모든 눌리는 요소는 `HoronPressable` 위에 있고, 누르기 시작할 때 동작 버튼·행은 가벼운 충격, 스위치·체크박스·탭·세그먼트·선택 목록·달력 날짜는 선택 틱을 냅니다. 비활성 상태에서는 울리지 않고, `HoronProvider haptics={false}`로 전체를, 컨트롤의 `haptic="none"`으로 하나만 끕니다.
- 글자는 모두 `HoronText`로 그려 시스템 글자 크기(Dynamic Type)를 따르고, 최대 2배에서 멈춰 한 줄 컨트롤이 깨지지 않게 합니다.
- 오버레이는 RN `Modal`이라 Android 뒤로 가기로 닫히고, 내용은 `accessibilityViewIsModal`입니다.

## React 패키지와 다른 점

- **이벤트 이름**: DOM에서 물려받은 `onClick` 대신 React Native 관례인 `onPress`를 씁니다. react가 직접 선언한 콜백 이름은 그대로입니다.
- **스타일**: `className` 대신 `style`을 받습니다. `cn()`은 클래스 이름을 합치는 도구라 내보내지 않습니다. 스타일 배열을 쓰면 됩니다.
- **DOM 전용 제외**: `mountCursorGhost`(데스크톱 커서 꼬리)는 옮기지 않았습니다.
- **Base UI에서 물려받는 prop**: 동작에 관한 prop(`open`/`onOpenChange`, `value`/`onValueChange`, `checked`, `orientation` 등)은 같은 이름으로 받습니다. DOM·폼·키보드 포커스에 묶인 prop은 받지 않고, 목록과 이유는 `test/props-parity.test.ts`에 있습니다.
- **hooks**: `useHotkey`는 네이티브에 전역 키 이벤트가 없어 동작하지 않고 react-native-web에서만 붙습니다. `useMediaQuery`는 폭·높이·방향·화면 모드·동작 줄이기·포인터 쿼리만 해석합니다. `useActiveIndicator`는 DOM 선택자 대신 활성 인덱스와 `bindItem(index)`의 `onLayout`으로 잽니다.

## 컴포넌트 대응표

`@horon-ai/react`의 84개 슬러그를 모두 옮겼고 빠진 컴포넌트는 없습니다. "구현"은 react와 같은 이름·prop·variant로 동작한다는 뜻이고, "대체"에는 React Native에 같은 기능이 없어 다른 수단을 쓴 부분을 적었습니다. 모든 눌리는 요소는 `HoronPressable`(햅틱, react `motion-press`)을 쓰고, `className` 계열 prop은 `style`로 바뀝니다(표에서 따로 적지 않음).

| 슬러그 | 상태 | 대체 방식과 차이 |
|---|---|---|
| agent-activity | 구현 | 스트리밍 캐럿을 텍스트 옆 형제 요소로 둠(RN `Text` 안에 뷰를 넣을 수 없음). 완료 문장은 라이브 영역으로 한 번 알림. WorkLog `<details>`는 열림 상태와 회전 캐럿으로 |
| agent-lane | 구현 | live-pulse 링을 `Animated` 크기·불투명도 링으로 |
| agent-lanes-timeline | 구현 | `calc()` 배치를 고정 라벨 열과 절대 배치 트랙으로, 현재선은 `translateX`, 넘김 곡선은 `react-native-svg` |
| agent-panel | 구현 | focus-within 테두리를 `boxShadow` 링으로, `Mod+Enter` 제출은 휴대폰에 수정 키가 없어 Start 버튼으로 |
| agent-steering-panel | 구현 | `Enter`/`Mod+Enter` 대신 키보드 전송 키와 Send 버튼이 대기열에 넣음 |
| approval-card | 구현 | glass는 `GlassSurface` thick, 결정된 카드는 액션을 내림(react는 접고 `inert`) |
| avatar | 구현 | 이미지 오류 시 이니셜로, live 점은 `Animated` 후광 |
| badge | 구현 | `text-trim`을 고정 높이·가운데 정렬로 |
| banner | 구현 | `role="status"`를 `accessibilityLiveRegion="polite"`로(RN에 status 역할 없음), danger는 `alert` 유지 |
| bot-instructions-panel | 구현 | 키보드 포커스가 없어 프롬프트 캐럿과 화살표 이동 생략 |
| bot-list-row | 구현 | `aria-pressed`를 `accessibilityState.selected`로 |
| bot-memory-panel | 구현 | 높이 접힘 애니메이션을 알약 등장·퇴장으로, 사용량은 `progressbar` 값 |
| bottom-sheet | 구현 | Base UI Drawer를 RN `Modal`과 `Animated` 이동으로, 손잡이 끌기(72pt 이상 닫힘), 아래 안전 영역 |
| breadcrumb | 구현 | 링크를 `href` + `onPress` 링크 버튼으로 |
| breadcrumb-header | 구현 | — |
| button | 구현 | `href` 앵커 렌더 대신 `onPress`, glass는 `GlassSurface` clear |
| calendar | 구현 | 탭 선택·월 넘김·min/max/비활성 날짜·범위 선택, 화살표 키 이동 생략 |
| card | 구현 | `render` 요소 교체를 `onPress`로 |
| chat-bubble | 구현 | 요소 자식은 줄바꿈되는 행에 배치 |
| chat-controls | 구현 | 파형은 `Animated` 반복 |
| checkbox | 구현 | 부분 선택은 `checked: "mixed"`, `parent`는 react에 CheckboxGroup이 없어 생략 |
| chip | 구현 | — |
| choice-card | 구현 | RadioGroup 상태를 공용 컨텍스트로 공유 |
| code-panel | 구현 | 가로 `ScrollView`로 줄바꿈 없는 코드 유지 |
| combobox | 구현 | 목록을 트리거 위치에 맞춘 RN `Modal`로, 여러 개 선택 시 칩 |
| command-palette | 구현 | Base UI Autocomplete를 `TextInput`과 걸러진 목록으로, 화살표 강조 생략 |
| composer | 구현 | `<form>`을 여러 줄 `TextInput`과 전송 키로 |
| data-table | 구현 | `@tanstack/react-table` 없이 정렬·검색·쪽 넘김·행 선택을 직접 구현, 넓은 표는 가로 스크롤, `aria-sort`는 접근성 값 |
| date-field | 구현 | 달력을 트리거에 맞춘 `Modal`로 |
| dialog | 구현 | 포털·포커스 가둠을 RN `Modal`, Android 뒤로 가기, 배경 탭 닫기로 |
| directory-card | 구현 | glass는 `GlassSurface` thick |
| document-extract-panel | 구현 | 컨테이너 쿼리를 `onLayout` 폭 896pt 기준으로 |
| empty-state | 구현 | `text-balance`가 없어 가운데 정렬만 |
| field | 구현 | Base UI Field를 컨텍스트로, 라벨이 컨트롤의 접근 이름이 됨. DOM 폼 검증 prop 생략 |
| file-drop | 구현 | 끌어 놓기가 없어 탭하면 `expo-document-picker`로 파일 선택, `accept` 걸러냄, 결과는 `FileDropFile[]`(`name`, `size`, `type`, `uri`) |
| filter-bar | 구현 | 넘치면 가로 스크롤 |
| flue-background | 대체 | WebGL2 셰이더 대신 토큰 색 그라디언트 기둥을 `Animated`로 천천히 올림. 노이즈·입자·포인터 반응은 없음, 동작 줄이기에서 정지 |
| horon-icon | 구현 | 같은 경로와 78개 이름을 `react-native-svg`로, `1em`은 주변 아이콘 크기 |
| horon-wordmark | 구현 | 같은 경로를 `react-native-svg`로 |
| icon-button | 구현 | glass는 `GlassSurface` clear |
| input | 구현 | `TextInput`, 비활성·읽기 전용은 `editable` |
| input-group | 구현 | — |
| integration-row | 구현 | 상태에 맞는 액션 하나만 그림 |
| kbd | 구현 | 운영체제별 기호는 `formatShortcut` |
| knowledge-base-panel | 구현 | 놓는 영역을 탭하면 `expo-document-picker`로 여러 파일 선택 |
| liquid-glass | 구현 | iOS 26 이상 `expo-glass-effect` `GlassView`, 그 밖에는 frost. 단계(`tier`)를 prop으로 받음 |
| list-detail | 구현 | `<textarea>`를 접히는 `TextInput`으로 |
| marketplace-card | 구현 | glass는 `GlassSurface` thick |
| mcp-server-row | 구현 | `:last-child` 구분선 제거를 마지막 행 `style`로 |
| menu | 구현 | Base UI 위치 계산을 `measureInWindow` + RN `Modal`로, 측정 실패 시 가운데에 표시 |
| message-extras | 구현 | 복사는 `expo-clipboard` |
| modal | 구현 | dialog와 같은 방식 |
| orchestrator-panel | 구현 | 팬아웃 연결선을 뷰 테두리로 |
| page-header | 구현 | — |
| plan-card | 구현 | Collapsible을 측정 높이 애니메이션으로 |
| plan-step | 구현 | 오류 블록은 실패일 때만 그림(접힘 애니메이션 없음) |
| plugin-row | 구현 | mcp-server-row와 같은 구분선 처리 |
| progress | 구현 | 미정 상태는 1.4초 sweep |
| radio-group | 구현 | 터치만 지원(화살표 이동 없음) |
| research-run-panel | 구현 | 라이브 영역 알림, 캐럿 깜박임 |
| schedule | 구현 | Base UI Select·ToggleGroup을 트리거 맞춤 `Modal` 선택기와 토글 버튼으로 |
| segmented-control | 구현 | 선택 알약은 측정 후 280ms 이동, 넘치면 가로 스크롤 |
| select | 구현 | 목록을 트리거 위치의 RN `Modal`로, `multiple`은 react Select가 단일 값이라 생략 |
| settings-list | 구현 | 마지막 행 구분선은 카드가 그림 |
| sidebar | 구현 | `surface="photo"`는 사진 대신 `bg-brand` 하늘색 바탕(사진 출처 미확인), 크기 조절은 끌기만, 위·아래·왼쪽 안전 영역 |
| skeleton | 구현 | 폭을 잰 그라디언트 sweep |
| slider | 구현 | 끌기·탭 이동, VoiceOver 올리기·내리기, 단계마다 선택 햅틱. 키보드 큰 단계와 여러 썸 prop 생략 |
| source-row | 구현 | 구분선은 실제 뷰 |
| spinner | 구현 | 동작 줄이기에서 정지 |
| split-button | 구현 | 캐럿이 `Menu`를 끝 정렬로 엶 |
| switch | 구현 | `id`는 `nativeID`로 |
| tab-bar | 구현 | 아래 안전 영역 |
| tabs | 구현 | Base UI Tabs를 제어·비제어 컨텍스트로, 표시기는 `onLayout` 측정 |
| task-row | 구현 | 목록 구분선은 들여 쓴 뷰 |
| textarea | 구현 | 여러 줄 `TextInput`, 크기 단계별 최소 높이 |
| textarea-field | 구현 | — |
| toast | 구현 | `toast()`·`useToast`·`Toaster` 그대로, 추가될 때마다 `announceForAccessibility`, 아래 안전 영역 |
| tool-call | 구현 | Collapsible을 열림 상태로(높이 애니메이션 없음) |
| tool-calls-header | 구현 | — |
| tool-permissions | 구현 | 행마다 SegmentedControl |
| tooltip | 구현 | 호버·포커스 대신 탭·길게 누르기로 열고 바깥 탭으로 닫음 |
| top-bar | 구현 | 위 안전 영역, `GlassSurface` 크롬 |
| usage-meter | 구현 | Base UI Meter를 `Animated` 채움과 `progressbar` 값으로 |
| workspace-menu | 구현 | `render` 트리거를 측정 래퍼 안에서 복제 |

배럴에서 빠진 이름은 `mountCursorGhost`·`CursorGhostOptions`(DOM 전용 데스크톱 커서 꼬리)와 `cn`·`ClassValue`(클래스 이름 병합 도구)입니다. 대신 `GlassSurface`, `HoronPressable`, `useHaptic`, `HoronText`, `useInsets`, `HoronProvider`, `useHoronTheme`을 더 내보냅니다.

## 명령

```sh
bun run test         # 렌더·상호작용 테스트 (jest-expo, test/render/*.jest.tsx)
bun test             # 패리티 검사 (저장소 루트 `bun test`에 포함)
bun run integrate    # 배럴·미구현 원장·갤러리 레지스트리 재생성
bun run typecheck    # tsc --noEmit
bun run lint         # oxlint
```

갤러리는 `apps/expo-gallery`입니다. `cd apps/expo-gallery && bun run ios`로 Expo Go(iOS 시뮬레이터)에서 84개 데모를 엽니다. 머리의 `Dark`, `Frost`, `Haptics` 스위치로 어두운 화면, 유리 대체 모양, 진동 끄기를 바로 비교할 수 있습니다. 탭 없이 열려면 `exp://127.0.0.1:8081/--/<slug>?scheme=dark&glass=frost&haptics=off` 같은 링크를 씁니다.

생성 파일(`src/index.ts`, `test/pending.ts`, `apps/expo-gallery/registry.g.ts`)은 직접 고치지 않습니다. CI가 `integrate.ts --check`로 커밋본과 생성 결과를 비교합니다.

## 패리티 검사

- `test/parity.test.ts`: react와 슬러그 집합, 파일마다 값 export·타입 export 이름, 문자열 유니언 리터럴, 배럴 이름을 비교합니다.
- `test/props-parity.test.ts`: 저장소의 `test/props-parity.ts`(TypeScript 검사기)로 컴포넌트마다 react prop의 이름·필수 여부·리터럴·기본값을 비교하고, 플랫폼 때문에 다른 항목은 이유와 함께 허용 목록에 둡니다.

## 라이선스

[PolyForm Strict License 1.0.0](https://polyformproject.org/licenses/strict/1.0.0)입니다. 비상업적 목적의 사용만 허용하고 수정·재배포·상업적 이용은 금지합니다. 전문은 패키지에 동봉된 `LICENSE`에 있습니다. 서드파티 고지는 `THIRD_PARTY_NOTICES.md`에 있습니다.
