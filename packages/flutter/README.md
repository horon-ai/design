# horon_ui

Horon 디자인 시스템의 Flutter 컴포넌트 라이브러리입니다. 웹의 `@horon-ai/react`와 같은
이름·변형·상태를 가진 컴포넌트를 Flutter 앱에서 씁니다.

## 쓰는 방법

이 패키지는 pub.dev에 게시하지 않습니다(`publish_to: none`). 이 패키지를 쓰던 곳은 옛 Flutter
모바일 앱 하나였고, 그 앱은 `horon-ai/mobile-archive`로 보관했습니다. 새 `mobile` 앱은 Lynx로 바뀌어
`@horon-ai/lynx`를 쓰므로 지금 이 패키지를 쓰는 앱은 없습니다. 쓸 때는 저장소 안에서 경로로 가져다 씁니다.

```yaml
dependencies:
  horon_ui:
    path: ../design/packages/flutter
```

```dart
import 'package:horon_ui/horon_ui.dart';
```

## 토큰

색·간격·반경 값은 이 패키지가 정하지 않습니다. 웹 토큰 원본(`@horon-ai/tokens`)에서
생성한 Dart 파일을 커밋해 쓰고, 원본과 어긋나면 테스트가 실패합니다. 값을 손으로 고치지
않습니다. 유리(`glass`)와 veil(`veil`) 재료도 같은 생성기를 지나 `HoronThemeData`의
`glass`·`veil` 그룹으로 들어옵니다.

## 표면 재료

표면은 굵은 유리와 가벼운 veil 두 가지입니다. 카드·알약 표시자·유리 사이드바처럼 뒤를
크게 흐려야 하는 자리는 `HoronLiquidGlass`를 쓰고, 입력 필드와 떠 있는 패널은 `HoronVeil`을
씁니다. React가 `LiquidGlass`를 지운 자리에는 veil만 깔고, 두 재료를 겹치지 않습니다.

### veil

React `globals.css`의 `.veil-field`·`.veil-overlay`·`.veil-drop`을 위젯 하나로 옮겼습니다.

| React 클래스 | 호출 | 채움 | 링 | 그림자 | 기본 반경 |
| --- | --- | --- | --- | --- | --- |
| `veil-field` | `HoronVeil(kind: HoronVeilKind.field)` | `field`, 포커스 시 `fieldFocus` | 있음, 오류 시 `borderDanger` | 0 2 10 | 12 |
| `veil-overlay` | `HoronVeil(kind: HoronVeilKind.overlay)` | `overlay`(라이트 74% 흰색, 다크 74% 잉크) | 있음 | 0 6 24 | 20 |
| `veil-drop` | `HoronVeil(kind: HoronVeilKind.drop)` | `field` | 없음, 점선 테두리가 유일한 윤곽 | 0 2 10 | 10 |

값은 `HoronTheme.of(context).veil`에서만 읽습니다. `HoronVeilTokens`가 블러 8, 채도 1.6,
링 1px과 라이트·다크 `HoronVeilScheme`을 들고 있습니다.

- `focused`는 필드 채움만 `fieldFocus`로 바꾸고, `invalid`는 필드 링 색만 `borderDanger`로
  바꿉니다. 링 굵기는 그대로입니다.
- 뒤 배경은 `horonVeilBackdropFilter`로 흐림·채도를 겁니다. Flutter에는
  `prefers-reduced-transparency` 질의가 없으므로 `MediaQuery.disableAnimations`가 참이면
  필터 없이 `glassFillFrost` 한 겹으로 내려갑니다.
- `HoronSurface`에 `veilField`·`veilOverlay`가 있어 `HoronSurfaceLayer`가 두 값을 이 위젯에
  넘깁니다. `glass` 값은 계속 액체 유리입니다. React 어휘가 `glass`인 자리(`HoronInputSurface`,
  `HoronCalendarSurface` 등)는 값 이름을 바꾸지 않고 구현만 veil로 바꿉니다.

## 컴포넌트

### 모달

`HoronModal`은 폼과 긴 글을 담는 패널입니다. 짧은 확인에 쓰는 `HoronDialog`와 달리 머리글,
스크롤하는 본문, 푸터 세 부분으로 고정됩니다.

- 폭은 `HoronModalSize.sm` 400, `md` 560(기본), `lg` 720입니다. 화면이 좁으면 뷰포트에서
  32를 뺀 폭까지만 씁니다.
- 표면은 `HoronModalSurfaceKind.solid`(기본, `bgSurface`와 0/24/64 그림자) 또는 `glass`
  (`veil-overlay`)입니다. `HoronModalSurface`라는 이름은 옛 Flutter 모바일 앱이 쓰던 기존 패널
  위젯이 이미 차지하고 있어 enum에는 `Kind` 접미사를 붙였습니다.
- 머리글은 좌우·위 24, 아래 16이고, 본문만 스크롤합니다. 푸터(`HoronModalFooter`)는 좌우 24,
  위 16, 아래 24에 동작을 오른쪽으로 모읍니다.
- 띄울 때는 `showHoronModal`을 씁니다. 32% 스크림과 6px 흐림, 가운데 배치, 전환은 그 함수가
  맡고 `HoronModal`은 패널만 그립니다.

### 탭 밑줄 변형

`HoronTabsList.variant`가 `HoronTabsListVariant.pill`(기본)과 `underline`을 받습니다.
`underline`은 쟁반과 표면(`surface`)을 쓰지 않고 폭을 채우며, 아래 1px `borderDefault` 위를
2px `textPrimary` 막대가 따라갑니다. 탭 높이는 26/30/36, 목록 여백은 sm·md 3·lg 4,
탭 사이는 24입니다. hover는 바탕을 더하지 않고 글자색만 올립니다.

### 사이드바 plain

`HoronSidebar.plain()`은 채움도 유리도 없이 뒤 레이아웃 색을 쓰고 오른쪽 1px
`borderDefault`로만 경계를 긋습니다. `glass`·`photo`·`flue`에는 이 테두리가 없습니다.
`HoronSidebarItem.href`가 있으면 항목이 링크 시맨틱(`Semantics(link: true)`)을 갖고, 없으면
버튼입니다. 패키지는 URL을 열지 않으므로 이동은 `onPressed`가 맡습니다.

### 스트리밍 텍스트

`HoronStreamingText(text:, streaming:, smooth:)`는 들어오는 답을 초당 90자로 드러내고,
남은 글자가 쌓이면 최대 3배까지 따라잡습니다. 캐럿은 마지막 글자 뒤에 붙어 함께 줄바꿈되고,
글이 멈춘 동안 깜박입니다. `smooth`가 거짓이거나 `MediaQuery.disableAnimations`가 참이면
즉시 전체를 보여 줍니다. 화면 낭독기는 완료된 답을 한 번만 읽습니다.

### Flue 배경 주야간

`HoronFlueBackground`가 `HoronFlueVariant.defaultValue`·`sidebar`·`auth`를 받습니다. 밝기는
테마에서 읽어 라이트면 `HoronFlueConfig.sky`, 다크면 `HoronFlueConfig.night`를 바탕으로 삼고
변형 튜닝을 얹습니다. 색조(`tint`)는 `defaultValue`의 라이트에서만 `glassRegular`를 쓰고
`sidebar`·`auth`와 다크에서는 얹지 않습니다. 변형 위에 몇 값만 고치려면
`HoronFlueConfig.resolve(brightness:, variant:).copyWith(...)`를 씁니다. `cursor`가 0이면
포인터를 따라가지 않고 가상 포인터로 스스로 움직입니다.

### MCP 서버 행의 상태 색

`HoronMcpServerRow`는 `statusTone`으로 오른쪽 상태 알약의 색을 고릅니다. 타입은
`HoronMcpServerStatusTone`이고 값은 `connected`·`warning`·`neutral` 세 가지이며,
생성자 기본값은 `HoronMcpServerStatusTone.connected`입니다(React `statusTone = "connected"`와
같음). 알약 글자는 `statusLabel`이 정하고 기본값은 `'Connected'`입니다.

```dart
HoronMcpServerRow(
  name: 'Linear',
  statusLabel: 'Needs auth',
  statusTone: HoronMcpServerStatusTone.warning,
  onConfigure: openConfig,
)
```

`statusTone`은 22px 알약의 바탕·글자와 6px 점 색을 한 묶음으로 정합니다.

| 값 | 알약 바탕 | 글자 | 점 |
| --- | --- | --- | --- |
| `connected` | `overlayInk6` | `textPrimary` | `statusLive` |
| `warning` | `accentRed500_14` | `textDanger` | `textDanger` |
| `neutral` | `overlayInk6` | `textSecondary` | `textPlaceholder` |

## 아이콘과 문자열

아이콘 폰트는 호스트 앱이 공급합니다. 이 패키지는 폰트를 번들하지 않습니다. 화면 문구는
`HoronStrings` 구현을 호스트 앱이 골라 넘깁니다(`HoronStringsKo`, `HoronStringsEn`).

## 동작 계층

팝업 열림 상태, 바깥 탭 닫기, 키보드 이동, 라우트 경계처럼 모양과 무관한 동작은
Flutter SDK widgets 계층의 헤드리스 부품에 맡깁니다. horon_ui는 그 위에 토큰으로 표면을
그리고 팝업 위치를 정합니다. React 쪽에서 Base UI가 맡는 자리와 여기서 SDK가 맡는 자리가
같은 선에서 나뉩니다.

| 컴포넌트 | SDK 부품 | horon이 직접 맡는 부분 |
| --- | --- | --- |
| `HoronRadioGroup`, `HoronRadio` | `RadioGroup`, `RawRadio` | 원·점·라벨, 포커스 링, 줄 전체 히트 영역 |
| `HoronTooltip` | `RawTooltip` | 말풍선 표면과 화살표, 네 방향 배치 |
| `showHoronDialog` | `RawDialogRoute` | 스크림 색·블러, 패널 표면, 진입 전환 |
| `showHoronBottomSheet` | `RawDialogRoute` | 시트 표면, 슬라이드 진입·퇴장 시간 |
| `showHoronModal` | `RawDialogRoute` | 스크림, 패널 표면 |
| `HoronMenu` | `HoronMenuAnchor`(`RawMenuAnchor` 위) | 트리거, 팝업 내용, 위치·크기 |
| `HoronSelect` | `HoronMenuAnchor`(`RawMenuAnchor` 위) | 필드·팝업 표면, 폭·위치 |
| `HoronCombobox` | `HoronMenuAnchor`(`RawMenuAnchor` 위) | 검색, 다중 선택, 빈 상태 |
| `HoronDateField` | `HoronMenuAnchor`, `HoronOverlayBody` | 달력, 뒤집기·자르기·스크롤 |
| `HoronPickerField` | `HoronMenuAnchor`, `HoronOverlayBody` | 목록, 뒤집기·자르기·스크롤 |

라디오 그룹은 Tab으로 선택된 항목 하나에만 들어가고, 선택이 없으면 첫 항목에 들어갑니다.
화살표가 선택과 포커스를 함께 옮기며 양 끝에서 순환하고, Space는 포커스된 항목을
고릅니다. 이미 선택된 항목을 다시 눌러도 콜백을 부르지 않습니다. 웹에서는 Enter로
선택되지 않습니다.

툴팁은 트리거에 `tooltip` 시맨틱을 달아 스크린 리더가 문구를 읽습니다. 지연 없이 열리고
페이드 없이 닫히며, 한 번에 하나만 보입니다.

다이얼로그·바텀시트·모달 라우트는 `scopesRoute` 경계를 가져 스크린 리더가 모달 밖을
읽지 않습니다. 접이식 기기에서는 하나의 서브 화면 안에만 그려집니다. 스크림 색·블러와
바깥 탭·Escape 닫기는 예전과 같습니다.

팝업은 공용 `HoronMenuAnchor` 하나로 엽니다. `RawMenuAnchor`가 열림 상태와 Escape 닫기,
조상 스크롤·화면 크기 변화 시 닫기를 맡습니다. 바깥 탭 닫기는 이 위젯이 직접 더합니다.
패널을 같은 탭 리전으로 묶어 바깥 탭에서 컨트롤러를 닫고, `absorbOutsideTaps`가 참이면
패널 뒤 화면을 덮는 막이 탭을 먹고 닫습니다. 참을 쓰는 곳은 `HoronMenu` 하나입니다.
메뉴는 뒤 화면을 누르지 못하게 탭을 삼키고, 셀렉트·콤보박스·날짜 필드·시간 선택기는
아래 위젯까지 탭을 통과시킵니다. 셀렉트와 콤보박스도 Escape로 닫힙니다.

날짜 필드와 시간 선택기는 `HoronOverlayBody`로 패널을 재고 배치합니다. 첫 프레임은 패널
크기를 모르므로 자연 크기로 그려 재게 하고, 측정이 끝난 다음 프레임부터 배치가 고른
방향으로 자릅니다. 그래서 아래 공간이 모자라면 위로 뒤집히고, 양쪽 어디에도 다 들어가지
않으면 들어가는 만큼으로 줄여 안에서 스크롤합니다. 뒤집히면 필드에서 띄운 8px도 주축
방향으로 함께 뒤집힙니다.

직접 구현을 유지하는 컴포넌트:

- `segmented_control`(`HoronSegmentedControl`): React `ToggleGroup`에 대응하고, 라디오
  역할을 붙이면 어긋납니다.
- `tabs`, `tab_bar`: 탭·내비게이션 역할이라 SDK 라디오·메뉴 부품의 계약과 맞지 않습니다.
- `choice_card`: `checked`와 `onTap` 계약이라 값 기반 `RawRadio`로 옮기면 공개 API가
  바뀝니다.
- `command_palette`: 페이지 안 오버레이와 빈 상태 계약을 직접 들고 있습니다.
- `sidebar`, `tool_call`, `tool_calls_header`, `agent_activity`는
  SDK `Expansible`을 쓰지 않습니다. 가운데 기준으로 본문을 잘라 드러내는 부품이라,
  위에서부터 펼치는 horon·React `Collapsible`의 동작과 다릅니다.
- `combobox`는 팝업 셸만 `HoronMenuAnchor`를 쓰고 검색·선택은 직접 구현합니다.
  `RawAutocomplete`를 쓰지 않습니다. 빈 상태를 숨기고, 선택하면 필드를 덮어쓴 뒤 닫아서
  다중 선택·빈 상태 계약과 충돌합니다.

## React 변경 따라잡기

React가 진실 원본이고 `packages/tokens`가 값의 원본입니다. React가 바뀌면 아래 순서를
그대로 밟습니다. 한 사람이 전부 훑지 않고, 감사 표의 레인 단위로 나눠 병렬로 옮깁니다.

### 1. 기준 커밋 diff

지난 정합이 끝난 커밋을 기준으로 React·토큰 변경을 뽑습니다.

```sh
git diff --name-only <기준커밋>..HEAD -- packages/react packages/tokens
git diff --stat <기준커밋>..HEAD -- packages/react packages/tokens
```

파일 수와 경로를 먼저 기록합니다. 이 수가 다음 단계 표의 행 수와 같아야 합니다.

### 2. audit 표

바뀐 파일 하나를 표의 행 하나로 적습니다. 열은 React 파일, 바뀐 내용, Flutter 대상 파일,
필요한 Dart 변경, 테스트·갤러리, 검증 grep, 담당 레인입니다.

- 제품 코드 변경이 없는 행(문서·포맷팅)도 적고 "변경 없음"으로 남깁니다.
- 검증 grep은 저장소 루트에서 바로 돌릴 수 있는 명령으로 씁니다. 표를 다 채운 뒤
  `git diff` 경로 집합과 표의 경로 집합을 비교해 빠진 파일이 없는지 확인합니다.
- 레인 배정은 여섯 컴포넌트 묶음(`inputs`·`overlays`·`agents`·`content`·`display`·
  `navigation`)과 토큰·재료를 맡는 `foundation` 일곱 값으로 고정합니다.

### 3. 레인 병렬 포팅

레인마다 자기 컴포넌트·테스트·갤러리 파일만 고칩니다. 공유 파일은 레인이 손대지 않습니다.

| 소유 | 파일 |
| --- | --- |
| 레인 | `lib/src/components/<슬러그>.dart`, `test/components/<슬러그>_test.dart`, `example/lib/gallery/sections/<슬러그>.dart` |
| foundation | 토큰 생성기·생성 파일, `theme/`, `glass/`, `contracts/` |
| integrate | `lib/horon_ui.dart`(배럴), `test/gates/pending_components.dart`, 갤러리 `registry.dart`·`section_builder.dart`, `apps/site` 카탈로그 |
| docs | 이 README와 `CHANGELOG.md` |

포팅 규칙:

- 값은 `HoronTheme.of(context)`의 그룹에서만 읽습니다. `Color(0x…)`, `Colors.white`,
  `BorderRadius.circular(12)` 같은 리터럴은 `no_raw_literals` 게이트에서 막힙니다.
- React가 `export type`으로 선언한 어휘는 값 집합이 정확히 같은 공개 enum 하나를 그
  컴포넌트 파일에 둡니다. 게이트는 이름이 아니라 값으로 비교하므로 kebab-case는
  camelCase로, 예약어 `default`는 `defaultValue`로 적습니다.
- React의 `text-trim` 유틸은 Flutter에 대응이 없습니다. 라벨은 기존 `Text` 구조를
  유지하고, 고정 높이 알약에서 치우침이 보이면 `space.step` 높이 계산을 봅니다.
- `href`는 링크 시맨틱만 붙입니다. 패키지는 URL을 열지 않고 이동은 `onPressed`가 맡습니다.
- 토큰을 고칠 때는 `lib/src/tokens/horon_tokens.g.dart`를 손으로 고치지 않고
  `packages/tokens/src`를 고친 뒤 생성기를 다시 돌립니다.

```sh
bun packages/flutter/scripts/generate-tokens.mjs
```

### 4. integrate

배럴 export, 미구현 원장, 갤러리 등록부, 섹션 표를 스크립트가 디렉터리에서 다시 씁니다.
레인이 배럴을 직접 고치면 슬러그가 빠지거나 순서가 어긋나므로 반드시 이 스크립트를 씁니다.

```sh
cd packages/flutter
node scripts/integrate.mjs          # 쓰기
node scripts/integrate.mjs --check  # 쓰지 않고 누락만 확인 (있으면 exit 1)
```

`--check`가 `catalog=84 implemented=84 pending=0`을 출력하면 맞습니다.

### 5. analyze·format·test 게이트

순서대로 모두 통과해야 합니다. 하나라도 실패하면 그 레인으로 돌아가 고칩니다.

```sh
cd packages/flutter
flutter analyze --fatal-infos
dart format --output=none --set-exit-if-changed lib test example
flutter test
bun test scripts/generate-tokens.test.mjs   # 웹 토큰과 생성 파일 드리프트
node scripts/integrate.mjs --check          # 배럴·원장·갤러리 등록
```

토큰 드리프트 테스트는 `packages/tokens/src`에서 같은 문자열을 다시 만들어 커밋된
Dart 파일과 바이트로 비교합니다. 손으로 고친 값이 있으면 여기서 걸립니다.

## 갤러리

`example/`이 갤러리 앱입니다. 모든 컴포넌트의 변형과 상태를 한 화면에서 확인합니다.

```sh
cd example && flutter run
```

## 검사

```sh
cd packages/flutter
flutter analyze --fatal-infos
dart format --output=none --set-exit-if-changed lib test example
flutter test
bun test scripts/generate-tokens.test.mjs
node scripts/integrate.mjs --check
```

## 라이선스

[PolyForm Strict License 1.0.0](https://polyformproject.org/licenses/strict/1.0.0)입니다. 비상업적 목적의 사용만 허용하고 수정·재배포·상업적 이용은 금지합니다. 전문은 패키지에 동봉된 `LICENSE`에 있습니다. 이 패키지는 `publish_to: none`이라 pub.dev에 올라가지 않으며, 저장소 안에서 경로로 가져다 쓸 때도 같은 조건이 적용됩니다.
