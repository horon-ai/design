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
