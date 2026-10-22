/// 공개 이름 정책입니다.
///
/// 공개 클래스와 enum에는 모두 `Horon` 접두사를 붙입니다. 접두사가 없으면
/// `package:flutter/material.dart`가 이미 내보내는 이름과 정면으로 충돌합니다:
/// `Card`, `Chip`, `Switch`, `Slider`, `Tooltip`, `Drawer`, `Dialog`, `Badge`,
/// `Stepper`, `Typography`, `Table`, `Form`. `List`는 `dart:core`를 가려
/// 소비하는 앱의 화면 코드가 컴파일되지 않습니다.
///
/// 접두사는 소비하는 쪽의 `import ... hide`·`as` 별칭으로 피할 수 있는 문제가 아닙니다.
/// 앱 화면은 두 라이브러리를 함께 쓰므로, 충돌을 라이브러리 이름으로 미리 없앱니다.
library;
