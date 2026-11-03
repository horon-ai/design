// `flue-background`의 Flutter 대응입니다.
//
// 배경의 셰이더·감쇠·티커는 엔진(`lib/src/glass/flue_background.dart`)이 소유합니다.
// 이 파일은 React 컴포넌트와 같은 자리를 배럴과 갤러리에 열어 주는 자리이고, 새 API를
// 만들지 않습니다.
//
// React `FlueBackground`가 받는 props는 넷입니다: `className`·`style`(호스트가 정하는
// 배치와 크기), `config`(팔레트 덮어쓰기), `tintClassName`(연기 위의 유리 색조).
//
// Flutter에서는 배치와 크기를 `Positioned.fill`이나 `SizedBox`가 정하므로
// `className`·`style`에 대응하는 인자가 없습니다. `config`는 [HoronFlueConfig]이고,
// `tintClassName`은 [HoronFlueBackground.tint]입니다. 색조를 넘기지 않으면 테마의
// `glassRegular`(React의 `bg-glass-regular`)를 씁니다.
//
// 셰이더를 못 쓰면 [HoronFlueConfig.bgColor] 단색으로 남고, 모션 축소
// (`MediaQuery.disableAnimations`)면 12초 시점의 한 프레임만 그립니다.

library;

export '../glass/flue_background.dart';
