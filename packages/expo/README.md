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
| iOS 26 이상, 투명도 줄이기 꺼짐 | `GlassView`. 떠 있는 크롬(`material="glass"`, `clear`·`regular` 단계)은 `glass.native[scheme]`을 따릅니다. 라이트는 `regular` 효과에 불투명도 `0.75`, 다크는 `clear` 효과에 불투명도 `0.85`로 곡면 굴절과 투명도를 맞춥니다. `thick`과 `veil`은 가독성을 위해 `regular` 효과를 유지하고 `thick`에는 `glass-thick`(다크는 `glass-fill-strong`) 색조를 더합니다. `glass` 재료는 가장자리를 잘라 내지 않아 시스템 굴절 테두리가 그대로 보이고, `veil`은 모서리에서 잘라 냅니다. 앱 화면 모드를 `colorScheme`으로 넘깁니다. |
| Android, iOS 26 미만, 투명도 줄이기 켜짐, `glass="frost"` | 뒤 배경을 흐리게 할 수 없으므로 `glass-fill-frost` 채움에 토큰 테두리(위 밝음, 옆 옅음, 아래 중간)를 둡니다. `@horon-ai/tokens` `glass.ts`가 정한 대체 규칙과 같습니다. |

- 판정은 `isLiquidGlassAvailable()`과 `isGlassEffectAPIAvailable()`(일부 iOS 26 베타의 API 누락 대비)이 모두 참이고 `AccessibilityInfo`의 투명도 줄이기가 꺼져 있을 때만 네이티브입니다. 함수가 예외를 던지면 대체 모양으로 갑니다.
- 메뉴·팝업·대화상자 같은 오버레이는 `material="veil"`로 그립니다. 대체 모양에서는 링과 그림자가 붙습니다.
- 눌림 반응: 네이티브 유리는 `isInteractive`로 iOS가 직접 반응합니다. 대체 모양에는 시스템 효과가 없으므로 `pressed`가 참인 동안 `overlay-ink-8`(밝은 화면에서는 어두운 잉크, 어두운 화면에서는 밝은 잉크)을 채움 위에 한 겹 더 칠합니다.
- Apple 권고대로 유리와 그 부모의 `opacity`는 1로 둡니다(`GlassSurface` 내부 유리 층만 `glass.native[scheme].fillOpacity`로 옅게 깔고 그 위 자식은 흐리지 않습니다).
- `LiquidGlass`는 react처럼 호스트 안에 까는 레이어이고, 표면 전체를 소유하는 컴포넌트는 `GlassSurface`를 직접 씁니다.

## 아이콘 선 굵기

`@horon-ai/tokens`의 `icon` 토큰(`strokeWidth.default: 1.3`, `strokeWidth.active: 1.8`, `phosphorWeight.default: "light"`, `phosphorWeight.active: "regular"`)을 기본값으로 씁니다.

- `HoronProvider`가 `IconContext`에 기본 무게(`DEFAULT_ICON_WEIGHT = "light"`)를 내려 주고, `IconButton`·`Button`·`TabBar`·`Tabs`·`Input`·`Menu` 등 내부 `IconContext.Provider`가 이 무게를 덮어쓰지 않고 이어받습니다.
- 선택·강조 아이콘(`TabBar`·`Tabs` 활성 탭, 체크 표시, 더보기 아이콘 등)은 `ACTIVE_ICON_WEIGHT("regular")`를 쓰고, 직접 그리는 SVG 선은 `DEFAULT_ICON_STROKE_WIDTH(1.3)`를 씁니다.
- 16·20·24px 크기에서 라이트·다크 모두 비텍스트 대비 3:1 이상을 유지합니다.

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

## 입력창 글자 정렬

`TextInput`은 `Text`와 달리 lineHeight 안에서 글자를 가운데에 두지 않습니다. iOS 한 줄 입력은 토큰 lineHeight를 주면 placeholder가 약 3pt, 입력 글자가 약 7pt 아래로 처지고, Android 여러 줄 입력은 placeholder만 줄 맨 위에 붙습니다. 키트의 입력 컴포넌트(`Input`, `InputGroup`, `Textarea`, `TextareaField`, `Combobox`, `Composer`, `CommandPalette` 등)는 모두 `useFieldText`로 이 차이를 보정합니다.

앱에서 `TextInput`을 직접 쓸 때도 같은 훅을 씁니다. `useHoronTheme().text()`를 입력창에 그대로 넣지 않습니다.

```tsx
import { TextInput, View } from "react-native";
import { FIELD_MAX_FONT_SCALE, useFieldText } from "@horon-ai/expo";

function ChatInput({ placeholder }: { placeholder: string }) {
  const fieldText = useFieldText("body-md");
  return (
    <View style={{ minHeight: 44, justifyContent: "center" }}>
      <TextInput placeholder={placeholder} maxFontSizeMultiplier={FIELD_MAX_FONT_SCALE} style={[{ paddingHorizontal: 16 }, fieldText]} />
    </View>
  );
}
```

- 한 줄 입력은 상자(`minHeight`)가 높이를 갖고 가운데 정렬하며, 입력창 자체에는 높이를 주지 않습니다.
- 여러 줄 입력은 `useFieldText(name, { multiline: true, empty })`를 씁니다. `empty`는 지금 placeholder가 보이는지(값이 빈 문자열인지)입니다.
- 입력창이 직접 테두리와 배경을 그리면 세로 안쪽 여백을 `padding` 옵션으로 넘깁니다. 보정이 테두리 밖으로 나가지 않고 여백 안에서 이뤄집니다.
- 한계: iOS는 큰 글자 설정에서 입력창 폭보다 긴 placeholder를 줄여 넣고, 이때 최대 3pt 아래로 처집니다. 큰 글자에서도 한 줄에 들어가는 짧은 placeholder를 씁니다.

## 텍스트 콘텐츠 렌더링 (RichText)

`RichText`는 채팅 응답, 공지, 도움말처럼 서식이 있는 글을 키트 토큰으로 그립니다. WebView 없이 React Native `Text`와 `View`로 그려서 Expo Go, 개발 빌드, 웹에서 똑같이 동작합니다. `@horon-ai/react`에는 아직 없는 Expo 전용 컴포넌트입니다.

```tsx
import { RichText } from "@horon-ai/expo";

<RichText format="markdown" streaming={!done} selectable confirmLinks>
  {reply}
</RichText>
```

| `format` | 읽는 방식 |
|---|---|
| `text`(기본) | 글자 그대로. 줄바꿈만 유지하고 기호와 태그를 해석하지 않습니다. |
| `basic` | 굵게(`**`), 기울임(`*`), 취소선(`~~`), 밑줄(`++`), 순서 없는/있는 목록(`-`, `1.`), 링크, 표, 인라인 코드와 코드 블록만 서식을 적용합니다. 제목, 인용, 구분선, 이미지, 체크리스트, HTML은 쓴 글자 그대로 보입니다. |
| `markdown` | GFM 전체(제목, 인용, 목록과 체크리스트, 표, 코드, 구분선, 이미지)와 `++밑줄++`. 한 줄 바꿈도 줄을 바꿉니다(채팅 응답 방식). |
| `html` | 허용 목록에 있는 태그만 markdown과 같은 블록으로 옮깁니다. |

- 네 형식은 하나의 문서 모델로 해석되므로 같은 내용은 형식이 달라도 같은 모양으로 그려집니다. `basic`은 markdown과 같은 해석기를 쓰고, 허용하지 않는 요소만 원래 글자로 되돌립니다.
- **밑줄 표기**: CommonMark에는 밑줄이 없고 `__글자__`는 굵게입니다. 그래서 markdown-it-ins 확장의 관례인 `++글자++`를 씁니다. HTML에서는 `<u>`, `<ins>`입니다.
- **스트리밍**: `streaming`을 켜면 덜 도착한 문법을 정리한 뒤 그립니다. 열린 코드 블록은 바로 닫고, 구분 줄이 아직 없는 표 행은 기다리게 하고, 닫히지 않은 `` ` ``, `**`, `~~`, `++`, `*`는 닫거나(뒤에 글자가 없으면 지움) 주소가 덜 온 링크는 글자만 보여 줍니다. HTML은 덜 온 태그를 잘라 냅니다. 기호가 잠깐 보였다가 사라지는 깜박임이 없습니다.
- **글꼴과 크기**: 본문은 `size`(`sm`·`md`·`lg`)에 따라 `body-*`, 제목은 `title-*`·`label-lg`, 코드는 `code`(Geist Mono) 토큰입니다. 색은 현재 화면 모드의 토큰이고, 시스템 글자 크기를 최대 2배까지 따릅니다. 한계: Pretendard에는 이탤릭 글꼴이 없어서 iOS는 기울임을 똑바로 그리고, Android는 기울여 흉내 냅니다.
- **선택과 복사**: `selectable`을 켜면 블록 단위로 글을 선택해 복사할 수 있습니다. 코드 블록에는 복사 버튼이 있고(`copyCode={false}`로 숨김) `expo-clipboard`로 복사합니다.
- **긴 내용**: 긴 링크와 단어는 줄을 바꿉니다. 긴 코드 줄은 코드 블록 안에서 가로로 스크롤되고, `wrapCode`를 켜면 줄을 바꿉니다. 코드 블록의 언어 표기(` ```ts `)는 무시합니다.
- **표(모바일 컴팩트)**: 작은 글자(`md` 기준 `body-sm`, 머리 `label-md`), 좁은 칸 여백(6×8pt), 배경으로 구분한 머리 행, 행 구분선 없음. 화면보다 넓은 표는 표 안에서만 가로로 스크롤되고 페이지는 움직이지 않습니다. 열 폭은 칸 내용으로 정하되 48pt에서 240pt 사이이고(글자 배율만큼 함께 커짐), 그보다 긴 칸은 말줄임 없이 여러 줄로 바뀝니다. 정렬(`:--`, `:-:`, `--:` 또는 `align`)을 따릅니다.

### 보안 정책

- **HTML 정화**: `p`, `br`, `h1`∼`h6`, `strong`·`b`, `em`·`i`, `s`·`del`·`strike`, `u`·`ins`, `code`·`kbd`·`samp`, `pre`, `blockquote`, `ul`·`ol`·`li`, 체크박스 `input`, `table`·`tr`·`th`·`td`, `hr`, `a`, `img`만 해석합니다. 읽는 속성은 `href`, `src`, `alt`, `start`, `align`, `type`, `checked`뿐이라 `on*` 이벤트, `style`, `class`는 아예 읽지 않습니다. `script`, `style`, `iframe`, `object`, `embed`, `svg`, `form` 같은 요소는 내용까지 지웁니다. 모르는 태그는 벗기고 안의 글자만 남깁니다. markdown 안의 HTML은 해석하지 않고 글자로 보여 줍니다.
- **링크**: `https`, `http`, `mailto`, `tel`만 링크가 됩니다. `javascript:`, `data:`, 상대 주소, 엔티티나 공백·제어 문자로 숨긴 주소는 일반 글자로 보입니다. `confirmLinks`를 켜면 전체 주소를 보여 주고 확인을 받은 뒤 엽니다. `onLinkPress`를 넘기면 앱이 직접 처리합니다(허용된 주소만 전달).
- **이미지**: 기본값 `images="block"`은 원격 이미지를 받지 않고 대체 텍스트를 칩으로 보여 줍니다. `images="load"`일 때만 `https` 이미지를 받고, `data:`, `file:`, `http:`는 계속 막습니다.

### 접근성

제목은 header, 링크는 문장 안의 link, 체크리스트 표시는 checkbox(완료 여부 상태), 이미지는 대체 텍스트로 읽힙니다. 읽는 순서는 원문 순서입니다. 키트가 직접 넣는 글자(`Copy`, `Image`, 링크 확인 문구 등)는 `labels`로 바꿉니다.

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

배럴에서 빠진 이름은 `mountCursorGhost`·`CursorGhostOptions`(DOM 전용 데스크톱 커서 꼬리)와 `cn`·`ClassValue`(클래스 이름 병합 도구)입니다. 대신 `GlassSurface`, `HoronPressable`, `useHaptic`, `HoronText`, `useFieldText`, `useInsets`, `HoronProvider`, `useHoronTheme`, 아이콘 기본 상수(`DEFAULT_ICON_STROKE_WIDTH`, `ACTIVE_ICON_STROKE_WIDTH`, `DEFAULT_ICON_WEIGHT`, `ACTIVE_ICON_WEIGHT`)와 Expo 전용 컴포넌트 `RichText`를 더 내보냅니다.

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
