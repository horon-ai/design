// `flue-background`의 Flutter 대응입니다.
//
// 배경의 셰이더·감쇠·티커는 엔진(`lib/src/glass/flue_background.dart`)이 소유합니다.
// 이 파일은 React 컴포넌트와 같은 자리를 배럴과 갤러리에 열어 주고, 변형 어휘
// [HoronFlueVariant]를 선언합니다. 변형 표가 이 파일에 있어야 변형 게이트가 React의
// `FlueVariant`와 Dart의 열거형을 같은 파일에서 맞춰 봅니다.
//
// React `FlueBackground`가 받는 props는 다섯입니다: `className`·`style`(호스트가 정하는
// 배치와 크기), `variant`(그리는 자리), `config`(팔레트 덮어쓰기), `tintClassName`
// (연기 위의 유리 색조).
//
// Flutter에서는 배치와 크기를 `Positioned.fill`이나 `SizedBox`가 정하므로
// `className`·`style`에 대응하는 인자가 없습니다. `variant`는 [HoronFlueVariant]이고,
// `config`는 [HoronFlueConfig], `tintClassName`은 [HoronFlueBackground.tint]입니다.
// 색조를 넘기지 않으면 변형이 정합니다: `defaultValue`는 라이트에서 테마의
// `glassRegular`(React의 `bg-glass-regular dark:bg-transparent`), `sidebar`는 라이트에서
// `glassThick`(React의 `bg-glass-thick dark:bg-transparent`, 80% 흰 유리로 보조 글자
// 대비를 지킴), `auth`는 없음입니다. `config`는 변형 튜닝을 덮어씁니다.
//
// 셰이더를 못 쓰면 [HoronFlueConfig.bgColor] 단색으로 남고, 모션 축소
// (`MediaQuery.disableAnimations`)면 12초 시점의 한 프레임만 그립니다. 열려 있는 동안
// 설정이 켜지면 지금 프레임에서 멈추고, 꺼지면 같은 시계에서 이어 갑니다.

library;

export '../glass/flue_background.dart';

/// `flue-background.tsx`의 `FlueVariant`입니다.
///
/// 연기를 그리는 자리마다 [HoronFlueConfig.sky]·[HoronFlueConfig.night] 위에 모션과
/// 색을 조금씩 다르게 얹습니다. `variants` 게이트가 이 파일만 읽으므로 공개 enum은
/// 여기 있어야 하고, `default`는 Dart 예약어라 [defaultValue]로 씁니다.
enum HoronFlueVariant {
  /// `default` — 사이드바와 인증 화면이 아닌 기본 배경입니다. `glass-regular` 색조를 씁니다.
  defaultValue,

  /// `sidebar` — 사이드바 유리 아래의 좁고 긴 기둥입니다. 연기가 더 느리고 크게 흐르며,
  /// 라이트에서는 80% 흰 유리(`glass-thick`)를 직접 얹어 그 위 보조 글자의 대비를 지킵니다.
  sidebar,

  /// `auth` — 로그인 화면 가운데 카드 뒤의 넓은 연기입니다. 아래에서 올라오고 색조가 없습니다.
  auth,
}
