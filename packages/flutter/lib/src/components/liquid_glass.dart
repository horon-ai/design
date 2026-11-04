// `liquid-glass`의 Flutter 대응입니다.
//
// 글래스 재료는 엔진(`lib/src/glass/horon_glass.dart`)이 소유합니다. 이 파일은 React
// 컴포넌트와 같은 자리를 배럴과 갤러리에 열어 주는 자리이고, 새 API를 만들지 않습니다.
//
// React `LiquidGlass`와 Flutter [HoronLiquidGlass] 모두 받는 값은 `tier`
// (clear|regular|thick)와 표면 반경입니다. 뒤 배경 블러·채도·림은 토큰이 정하고,
// 굴절·질감은 어느 플랫폼에도 없습니다.

library;

export '../glass/glass_geometry.dart' show HoronGlassTier;
export '../glass/horon_glass.dart';
