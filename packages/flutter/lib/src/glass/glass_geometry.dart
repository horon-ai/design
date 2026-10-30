// 리퀴드 글래스의 순수 계산입니다. 위젯도 셰이더도 아닙니다.
//
// 값의 출처는 둘입니다.
//   - 레이어 기하는 `packages/tokens/src/glass.ts`의 주석에 있는 Figma 규칙이고,
//     생성된 `HoronGlassTokens`의 `*For(hostHeight)` 함수가 그 계산을 이미 들고 있습니다.
//   - 굴절은 `packages/react/src/lib/glass/map.ts`와 `support.ts`의 이식입니다.
// 이 파일에는 Flutter 위젯이 없으므로 `flutter test`에서 전부 단위 테스트할 수 있습니다.

import 'dart:math' as math;

import 'package:flutter/foundation.dart';
import 'package:flutter/painting.dart';

import '../tokens/horon_tokens.g.dart';

/// 채움의 두께입니다. React `liquid-glass.tsx`의 `tier`와 같은 세 값입니다.
///
/// `clear`는 버튼·칩, `regular`은 배너·토스트·탭 바, `thick`은 카드·사이드바가 씁니다.
enum HoronGlassTier {
  /// `glass-clear` — 흰색 20%(다크 30%). 가장 옅은 유리입니다.
  clear,

  /// `glass-regular` — 흰색 55%(다크 60%).
  regular,

  /// `glass-thick` — 흰색 80%(다크 80%). 뒤 내용이 거의 비치지 않습니다.
  thick,
}

/// 굴절을 켜는 방식입니다.
enum HoronGlassRefraction {
  /// 엔진이 가능하면 굴절합니다. 웹의 `refract` 기본값입니다.
  auto,

  /// 굴절하지 않고 서리 채움으로 그립니다. 웹의 `prefers-reduced-transparency`와
  /// `@supports not (backdrop-filter)`가 내려가는 자리와 같습니다.
  off,
}

/// 표면이 지금 그리는 단계입니다.
enum HoronGlassRung {
  /// 레이어 스택만 그립니다(색조·안쪽 그늘·가장자리·광택). 굴절은 없습니다.
  layered,

  /// 레이어 스택 아래에 굴절 레이어를 더합니다.
  refracted,

  /// 서리 채움 한 겹만 그립니다. 장식 레이어는 모두 빠집니다.
  frost,
}

/// 굴절 레이어의 채도 배율입니다. `filters.ts`의 `feColorMatrix saturate 1.2`입니다.
const double horonGlassSaturation = 1.2;

/// 채움 두께별 뒤 배경 블러 반경입니다.
///
/// React 호스트는 자기 블러를 갖지 않습니다(CSS `backdrop-blur`는 다이얼로그의 서리
/// 표면 24px과 스크림 6px뿐). Flutter 표면은 혼자 서므로 채움 자체에 블러가 필요하고,
/// 세트가 실제로 쓰는 유일한 유리 블러 값인 24를 `thick`에 두고 8씩 내립니다.
double horonGlassTierBlur(HoronGlassTier tier) => switch (tier) {
  HoronGlassTier.clear => 8,
  HoronGlassTier.regular => 16,
  HoronGlassTier.thick => 24,
};

/// 채움 두께에 대응하는 채움 색입니다.
///
/// 색은 이미 토큰에 있습니다(`glass-clear` → `colors.glassClear`).
Color horonGlassTierFill(HoronGlassTier tier, HoronColors colors) => switch (tier) {
  HoronGlassTier.clear => colors.glassClear,
  HoronGlassTier.regular => colors.glassRegular,
  HoronGlassTier.thick => colors.glassThick,
};

/// 호스트 높이에 따라 달라지는 레이어 기하입니다.
///
/// CSS `.liquid-layers`의 계산식과 같은 값을 담습니다. 값은 전부 논리 픽셀입니다.
@immutable
class HoronGlassMetrics {
  /// 값을 그대로 받는 생성자입니다. 보통은 [HoronGlassMetrics.forHeight]를 씁니다.
  const HoronGlassMetrics({
    required this.layerOpacity,
    required this.innerInsetY,
    required this.innerInsetX,
    required this.edgeDarkBlur,
    required this.edgeLightBlur,
    required this.sheenPadding,
    required this.tintBlur,
    required this.innerShadeBlur,
  });

  /// 호스트 높이 [hostHeight]에서 CSS가 쓰는 값을 계산합니다.
  ///
  /// - 색조 블러 45, 안쪽 그늘 블러 4 (고정)
  /// - 안쪽 그늘 여백 `min(H/14, 6)` 세로, `min(H/14, 5)` 가로
  /// - 어두운 가장자리 블러 `min(4, 4H/84)`
  /// - 밝은 가장자리 블러 `clamp(0.75, 1.5H/84, 1.5)`
  /// - 광택 여백 `clamp(3, 0.1H, 10)` (CSS `clamp(3px, 100cqh * 0.1, 10px)`)
  factory HoronGlassMetrics.forHeight(double hostHeight, HoronGlassTokens glass) {
    return HoronGlassMetrics(
      layerOpacity: glass.layerOpacity,
      innerInsetY: glass.innerInsetYFor(hostHeight),
      innerInsetX: glass.innerInsetXFor(hostHeight),
      edgeDarkBlur: glass.edgeDarkBlurFor(hostHeight),
      edgeLightBlur: glass.edgeLightBlurFor(hostHeight),
      sheenPadding: horonGlassSheenPadding(hostHeight),
      tintBlur: glass.tintBlur,
      innerShadeBlur: glass.innerShadeBlur,
    );
  }

  /// 레이어 불투명도(0.5)입니다.
  final double layerOpacity;

  /// 안쪽 그늘의 세로 여백입니다.
  final double innerInsetY;

  /// 안쪽 그늘의 가로 여백입니다.
  final double innerInsetX;

  /// 어두운 가장자리 블러입니다. 지금 CSS는 이 레이어를 그리지 않지만, 토큰 계약과
  /// 테스트를 위해 값을 유지합니다.
  final double edgeDarkBlur;

  /// 밝은 가장자리 블러입니다.
  final double edgeLightBlur;

  /// 광택 링의 두께입니다. CSS는 `padding`으로 링을 만듭니다.
  final double sheenPadding;

  /// 색조 레이어의 뒤 배경 블러입니다.
  final double tintBlur;

  /// 안쪽 그늘 레이어의 뒤 배경 블러입니다.
  final double innerShadeBlur;

  /// 안쪽 그늘 레이어가 호스트 안에서 차지하는 사각형입니다.
  Rect innerShadeRect(Size size) {
    final double height = math.max(0, size.height - innerInsetY * 2);
    final double width = math.max(0, size.width - innerInsetX * 2);
    return Rect.fromLTWH(innerInsetX, innerInsetY, width, height);
  }
}

/// 광택 링의 두께입니다. CSS `clamp(3px, 100cqh * 0.1, 10px)`입니다.
double horonGlassSheenPadding(double hostHeight) => (hostHeight * 0.1).clamp(3, 10);

/// 광택 그라디언트의 세기입니다. 밝기에 따라 다릅니다(CSS `--glass-sheen-strength`).
double horonGlassSheenStrength(Brightness brightness) => brightness == Brightness.dark ? 0.16 : 0.32;

/// 질감 레이어가 호스트 밖으로 번지는 거리입니다. CSS `inset: -9px -8px`입니다.
const double horonGlassTextureBleedY = 9;

/// 질감 레이어의 가로 번짐입니다.
const double horonGlassTextureBleedX = 8;

/// 질감 레이어의 뒤 배경 블러입니다. CSS `blur(2px)`입니다.
const double horonGlassTextureBlur = 2;

/// 질감 레이어의 채움입니다. CSS `#ffffff03`입니다.
const Color horonGlassTextureFill = Color(0x03FFFFFF);

/// 가장자리 테두리의 두께입니다. CSS `border: 1px solid`입니다.
const double horonGlassEdgeWidth = 1;

/// 둥근 사각형 도형입니다. `map.ts`의 `GlassShape`입니다.
@immutable
class HoronGlassShape {
  /// 도형을 만듭니다.
  const HoronGlassShape({required this.width, required this.height, required this.radius});

  /// 레이아웃 가로(px)입니다.
  final double width;

  /// 레이아웃 세로(px)입니다.
  final double height;

  /// 모서리 반경(px)입니다. 짧은 변의 절반으로 잘립니다.
  final double radius;

  @override
  bool operator ==(Object other) =>
      other is HoronGlassShape && other.width == width && other.height == height && other.radius == radius;

  @override
  int get hashCode => Object.hash(width, height, radius);

  @override
  String toString() => 'HoronGlassShape($width x $height r$radius)';
}

/// 변위 지도에서 "이동 없음"을 뜻하는 채널 값입니다.
const int horonGlassNeutralChannel = 128;

/// 변위 채널이 움직일 수 있는 최대 폭입니다.
const int horonGlassChannelRange = 127;

/// 가장자리 띠의 최소 폭(px)입니다.
const double horonGlassMinBezel = 6;

/// 가장자리 띠의 최대 폭(px)입니다.
const double horonGlassMaxBezel = 24;

/// 짧은 변에서 띠가 차지하는 비율입니다.
const double horonGlassBezelShare = 0.25;

/// 띠 폭에서 최대 변위를 계산하는 배율입니다.
const double horonGlassScalePerBezel = 1.5;

/// 최소 변위(px)입니다.
const double horonGlassMinScale = 8;

/// 최대 변위(px)입니다.
const double horonGlassMaxScale = 36;

/// 정밀 포인터에서 한 번에 굴절할 수 있는 표면 수입니다(`support.ts`).
const int horonGlassMaxRefractingFine = 16;

/// 손가락 입력에서 한 번에 굴절할 수 있는 표면 수입니다.
const int horonGlassMaxRefractingCoarse = 6;

/// 정밀 포인터에서 굴절을 허용하는 최대 면적(px²)입니다.
const double horonGlassFineArea = 600000;

/// 손가락 입력에서 굴절을 허용하는 최대 면적(px²)입니다.
const double horonGlassCoarseArea = 250000;

/// 도형을 정수 픽셀과 0.5 단계 반경으로 정리합니다.
///
/// `map.ts`의 `normalizeShape`입니다. 반경이 0.5px씩 흔들려도 같은 지도가 나오게 하고,
/// 면적이 0인 호스트는 1x1로 떨어뜨립니다(던지지 않습니다).
HoronGlassShape horonGlassNormalizeShape(HoronGlassShape shape) {
  double toPixels(double value) => value.isFinite ? math.max(1, value.roundToDouble()) : 1;
  final double width = toPixels(shape.width);
  final double height = toPixels(shape.height);
  final double largest = (math.min(width, height) / 2).floorToDouble();
  final double radius = shape.radius.isFinite ? (shape.radius * 2).round() / 2 : 0;
  return HoronGlassShape(width: width, height: height, radius: radius.clamp(0, largest));
}

/// 가장자리에서 배경이 휘는 띠의 폭입니다. `map.ts`의 `glassBezel`입니다.
///
/// 짧은 변의 1/4을 6~24px로 자르고, 다시 모서리 반경보다 넓지 않게 자릅니다.
double horonGlassBezel(HoronGlassShape shape) {
  final HoronGlassShape normalized = horonGlassNormalizeShape(shape);
  final double band = (math.min(normalized.width, normalized.height) * horonGlassBezelShare).roundToDouble().clamp(
    horonGlassMinBezel,
    horonGlassMaxBezel,
  );
  return math.min(band, math.max(normalized.radius, horonGlassMinBezel));
}

/// 가장 긴 변위(px)입니다. `map.ts`의 `glassScale`이고 `feDisplacementMap`의 `scale`입니다.
double horonGlassScale(HoronGlassShape shape) =>
    (horonGlassBezel(shape) * horonGlassScalePerBezel).roundToDouble().clamp(horonGlassMinScale, horonGlassMaxScale);

/// 가장자리에서 [depth]만큼 들어온 픽셀의 변위 세기입니다.
///
/// `map.ts`의 `channelsAt`이 쓰는 `(1 - ratio)^2`입니다. 띠의 가장자리에서 1, 안쪽
/// 끝에서 0입니다.
double horonGlassRimMagnitude(double depth, double bezel) {
  if (depth <= 0 || depth >= bezel) return 0;
  final double ratio = depth / bezel;
  return (1 - ratio) * (1 - ratio);
}

/// 도형이 굴절을 감당할 만큼 작은지 봅니다. `support.ts`의 `areaAllowed`입니다.
bool horonGlassAreaAllowed(HoronGlassShape shape, {required bool coarsePointer}) {
  final HoronGlassShape normalized = horonGlassNormalizeShape(shape);
  final double cap = coarsePointer ? horonGlassCoarseArea : horonGlassFineArea;
  return normalized.width * normalized.height <= cap;
}

/// 지금 그릴 단계를 정합니다.
///
/// 웹의 강등 사다리를 그대로 따릅니다.
///
/// - 서리: 셰이더 필터를 못 쓰는 엔진, 투명도 축소 요청(앱에서는
///   `MediaQuery.disableAnimationsOf`), 또는 [HoronGlassRefraction.off].
///   `@supports not (backdrop-filter)` / `prefers-reduced-transparency` 자리입니다.
/// - 레이어만: 불투명 호스트이거나 면적 상한을 넘은 호스트(웹은 굴절만 포기합니다).
/// - 굴절: 셰이더가 준비된 경우.
HoronGlassRung horonGlassRungOf({
  required bool shaderSupported,
  required bool reducedTransparency,
  required HoronGlassRefraction refraction,
  required bool opaque,
  required bool areaAllowed,
  required bool shaderReady,
}) {
  if (!shaderSupported || reducedTransparency || refraction == HoronGlassRefraction.off) {
    return HoronGlassRung.frost;
  }
  if (opaque || !areaAllowed) return HoronGlassRung.layered;
  return shaderReady ? HoronGlassRung.refracted : HoronGlassRung.layered;
}
