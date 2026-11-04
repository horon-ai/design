// `flue-background`의 Flutter 대응입니다.
//
// 배경의 셰이더·감쇠·티커는 엔진(`lib/src/glass/flue_background.dart`)이 소유합니다.
// 이 파일은 React 컴포넌트와 같은 자리를 배럴과 갤러리에 열어 주는 자리입니다.
//
// React `FlueBackground`가 받는 props는 넷입니다: `className`·`style`(호스트가 정하는
// 배치와 크기), `variant`(연기가 놓이는 자리), `config`(팔레트 덮어쓰기),
// `tintClassName`(연기 위의 유리 색조).
//
// Flutter에서는 배치와 크기를 `Positioned.fill`이나 `SizedBox`가 정하므로
// `className`·`style`에 대응하는 인자가 없습니다. `variant`는 [HoronFlueVariant],
// `config`는 [HoronFlueConfig], `tintClassName`은 [HoronFlueBackground.tint]입니다.
// 색조를 넘기지 않으면 `defaultValue` 변형에서 테마의 `glassRegular`(React의
// `bg-glass-regular`)를 쓰고, `sidebar`·`auth`에서는 색조를 얹지 않습니다.
//
// 셰이더를 못 쓰면 [HoronFlueConfig.bgColor] 단색으로 남고, 모션 축소
// (`MediaQuery.disableAnimations`)면 12초 시점의 한 프레임만 그립니다.

library;

export '../glass/flue_background.dart';

/// 연기가 놓이는 자리입니다. React `flue-background.tsx`의
/// `FlueVariant = "default" | "sidebar" | "auth"`와 같은 값 집합입니다.
///
/// `variants` 게이트가 이 파일만 읽으므로 공개 enum은 여기 있어야 합니다.
/// `default`는 Dart 예약어라 [defaultValue]로 씁니다.
enum HoronFlueVariant {
  /// 기본 자리입니다. 변형 튜닝이 없고 `glass-regular` 색조를 씁니다.
  defaultValue,

  /// 유리 사이드바 뒤의 좁고 긴 열입니다. 연기가 크고 느리며 색조가 없습니다.
  sidebar,

  /// 로그인 화면의 카드 뒤입니다. 연기가 넓고 아래에서 올라오며 색조가 없습니다.
  auth,
}
