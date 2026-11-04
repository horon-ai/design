# horon_ui

Horon 디자인 시스템의 Flutter 컴포넌트 라이브러리입니다. 웹의 `@horon-ai/react`와 같은
이름·변형·상태를 가진 컴포넌트를 Flutter 앱에서 씁니다.

## 쓰는 방법

이 패키지는 pub.dev에 게시하지 않습니다(`publish_to: none`). 지금 소비하는 곳은 `mobile`
앱 하나이고, 저장소 안에서 경로로 가져다 씁니다.

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
않습니다.

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

## 갤러리

`example/`이 갤러리 앱입니다. 모든 컴포넌트의 변형과 상태를 한 화면에서 확인합니다.

```sh
cd example && flutter run
```

## 검사

```sh
flutter analyze --fatal-infos
dart format --output=none --set-exit-if-changed lib test example
flutter test
```
