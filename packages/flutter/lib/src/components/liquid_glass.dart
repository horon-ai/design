// `liquid-glass`의 Flutter 대응입니다.
//
// 글래스 재료는 엔진(`lib/src/glass/horon_glass.dart`)이 소유합니다. 이 파일은 React
// 컴포넌트와 같은 자리를 배럴과 갤러리에 열어 주는 자리입니다.
//
// React `LiquidGlass`와 Flutter [HoronLiquidGlass] 모두 받는 값은 `tier`
// (clear|regular|thick)와 표면 반경입니다. 뒤 배경 블러·채도·림은 토큰이 정하고,
// 굴절·질감은 어느 플랫폼에도 없습니다.
//
// 입력 필드와 오버레이가 쓰는 더 가벼운 재료는 별도의 veil 표면([HoronVeil])입니다.
// React가 `LiquidGlass`를 지운 자리에는 이 파일의 [HoronLiquidGlass] 대신
// `HoronVeil(kind: field|overlay)`를 씁니다. 두 재료를 겹치지 않습니다.

library;

export '../glass/glass_geometry.dart' show HoronGlassTier;
export '../glass/horon_glass.dart';
export '../glass/horon_veil.dart';
