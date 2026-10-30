// `liquid-glass`의 Flutter 대응입니다.
//
// 리퀴드 글래스의 레이어 스택은 엔진(`lib/src/glass/horon_glass.dart`)이 소유합니다.
// 이 파일은 React 컴포넌트와 같은 자리를 배럴과 갤러리에 열어 주는 자리이고, 새 API를
// 만들지 않습니다. React `LiquidGlass`가 받는 props는 셋입니다: `tier`
// (clear|regular|thick), `texture`(Paper의 질감 레이어), `refract`(뒤 배경 굴절).
//
// Flutter에서는 `refract`가 [HoronGlassRefraction]입니다. `off`가 React의
// `refract={false}` 자리이고, 웹의 `prefers-reduced-transparency` ·
// `@supports not (backdrop-filter)` 강등과 같은 서리 채움(`glass-fill-frost`)으로
// 그립니다. 켜져 있어도 셰이더를 못 쓰는 엔진, 모션·투명도 축소 설정, 불투명 호스트,
// 면적 상한을 넘은 호스트는 같은 강등 경로를 탑니다.
//
// 레이어 순서와 높이에 따른 기하는 [HoronLiquidGlass]의 문서를 보십시오.

library;

export '../glass/glass_geometry.dart' show HoronGlassRefraction, HoronGlassTier;
export '../glass/horon_glass.dart';
