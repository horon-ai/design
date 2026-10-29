import 'dart:ui' show Brightness, Color, Rect, Size;

import 'package:flutter_test/flutter_test.dart';
import 'package:horon_ui/src/glass/glass_geometry.dart';
import 'package:horon_ui/src/tokens/horon_tokens.g.dart';

/// 리퀴드 글래스의 순수 계산을 검사합니다.
///
/// 기대값은 `packages/tokens/src/glass.ts` 주석의 Figma 규칙입니다:
/// - 안쪽 그늘 여백 `min(H/14, 6)` 세로, `min(H/14, 5)` 가로
/// - 어두운 가장자리 `min(4, 4H/84)`, 밝은 가장자리 `clamp(0.75, 1.5H/84, 1.5)`
/// - 광택 여백 `clamp(3, 0.1H, 10)`
/// 토큰은 비율을 소수 6자리로 반올림해 들고 있으므로(1/14 → 0.071429), 허용 오차는
/// 그 반올림 폭(최대 3.3e-5)보다 크고 실제 수식 실수(클램프 누락 등)보다 작은 1e-4입니다.
void main() {
  const HoronGlassTokens glass = HoronGlassTokens();

  group('glass metrics: 호스트 높이에 따른 레이어 기하', () {
    // height, insetY, insetX, edgeDarkBlur, edgeLightBlur, sheenPadding
    const List<List<double>> table = <List<double>>[
      <double>[32, 2.285714, 2.285714, 1.523810, 0.75, 3.2],
      <double>[40, 2.857143, 2.857143, 1.904762, 0.75, 4],
      <double>[48, 3.428571, 3.428571, 2.285714, 0.857143, 4.8],
      <double>[52, 3.714286, 3.714286, 2.476190, 0.928571, 5.2],
      <double>[74, 5.285714, 5, 3.523810, 1.321429, 7.4],
      <double>[76, 5.428571, 5, 3.619048, 1.357143, 7.6],
      <double>[112, 6, 5, 4, 1.5, 10],
      <double>[120, 6, 5, 4, 1.5, 10],
    ];

    for (final List<double> row in table) {
      final double height = row[0];
      test('height $height', () {
        final HoronGlassMetrics metrics = HoronGlassMetrics.forHeight(height, glass);
        expect(metrics.innerInsetY, closeTo(row[1], 1e-4), reason: 'insetY @$height');
        expect(metrics.innerInsetX, closeTo(row[2], 1e-4), reason: 'insetX @$height');
        expect(metrics.edgeDarkBlur, closeTo(row[3], 1e-4), reason: 'edgeDark @$height');
        expect(metrics.edgeLightBlur, closeTo(row[4], 1e-4), reason: 'edgeLight @$height');
        expect(metrics.sheenPadding, closeTo(row[5], 1e-4), reason: 'sheen @$height');
      });
    }

    test('fixed blurs and layer opacity come from the tokens', () {
      final HoronGlassMetrics metrics = HoronGlassMetrics.forHeight(48, glass);
      expect(metrics.layerOpacity, 0.5);
      expect(metrics.tintBlur, 45);
      expect(metrics.innerShadeBlur, 4);
    });

    test('the inner shade rect stays inside the host', () {
      final HoronGlassMetrics small = HoronGlassMetrics.forHeight(32, glass);
      final Rect rect = small.innerShadeRect(const Size(120, 32));
      expect(rect.top, closeTo(2.285714, 1e-4));
      expect(rect.height, closeTo(32 - 4.571428, 1e-4));
      expect(rect.width, closeTo(120 - 4.571428, 1e-4));

      // 아주 낮은 호스트에서도 음수가 되지 않습니다.
      final Rect flat = HoronGlassMetrics.forHeight(4, glass).innerShadeRect(const Size(8, 4));
      expect(flat.height, greaterThanOrEqualTo(0));
      expect(flat.width, greaterThanOrEqualTo(0));
    });

    test('sheen strength and texture constants follow the CSS', () {
      expect(horonGlassSheenStrength(Brightness.light), 0.32);
      expect(horonGlassSheenStrength(Brightness.dark), 0.16);
      expect(horonGlassTextureBlur, 2);
      expect(horonGlassTextureBleedY, 9);
      expect(horonGlassTextureBleedX, 8);
      expect(horonGlassTextureFill, const Color(0x03FFFFFF));
      expect(horonGlassEdgeWidth, 1);
    });
  });

  group('glass tiers', () {
    test('each tier maps to the token fill colour', () {
      expect(horonGlassTierFill(HoronGlassTier.clear, HoronColors.light), HoronLightColors.glassClear);
      expect(horonGlassTierFill(HoronGlassTier.regular, HoronColors.light), HoronLightColors.glassRegular);
      expect(horonGlassTierFill(HoronGlassTier.thick, HoronColors.light), HoronLightColors.glassThick);
      expect(horonGlassTierFill(HoronGlassTier.clear, HoronColors.dark), HoronDarkColors.glassClear);
      expect(horonGlassTierFill(HoronGlassTier.thick, HoronColors.dark), HoronDarkColors.glassThick);
    });

    test('thicker glass blurs more, and thick stops at the documented 24', () {
      expect(horonGlassTierBlur(HoronGlassTier.clear), lessThan(horonGlassTierBlur(HoronGlassTier.regular)));
      expect(horonGlassTierBlur(HoronGlassTier.regular), lessThan(horonGlassTierBlur(HoronGlassTier.thick)));
      expect(horonGlassTierBlur(HoronGlassTier.thick), 24);
    });
  });

  group('displacement map port (map.ts)', () {
    test('normalizeShape rounds to whole pixels and half steps inside half the short side', () {
      final HoronGlassShape shape = horonGlassNormalizeShape(
        const HoronGlassShape(width: 120.4, height: 40.6, radius: 20.3),
      );
      expect(shape.width, 120);
      expect(shape.height, 41);
      // 20.3 → 20.5(0.5 단계) → 짧은 변의 절반(20)으로 잘립니다.
      expect(shape.radius, 20);
    });

    test('normalizeShape never throws on an empty host', () {
      final HoronGlassShape shape = horonGlassNormalizeShape(const HoronGlassShape(width: 0, height: -4, radius: 0));
      expect(shape.width, 1);
      expect(shape.height, 1);
      expect(shape.radius, 0);
    });

    test('bezel is a quarter of the short side, kept 6..24 and never wider than the radius', () {
      expect(horonGlassBezel(const HoronGlassShape(width: 120, height: 40, radius: 20)), 10);
      expect(horonGlassBezel(const HoronGlassShape(width: 300, height: 60, radius: 30)), 15);
      // 반경 0이면 띠는 최소값 6입니다.
      expect(horonGlassBezel(const HoronGlassShape(width: 400, height: 200, radius: 0)), 6);
      // 24를 넘는 띠는 24로 자릅니다.
      expect(horonGlassBezel(const HoronGlassShape(width: 400, height: 200, radius: 100)), 24);
    });

    test('scale is 1.5x the bezel, clamped to 8..36', () {
      expect(horonGlassScale(const HoronGlassShape(width: 120, height: 40, radius: 20)), 15);
      expect(horonGlassScale(const HoronGlassShape(width: 400, height: 200, radius: 100)), 36);
      // 30x30: 띠 = round(30 * 0.25) = 8, 변위 = 8 * 1.5 = 12.
      expect(horonGlassScale(const HoronGlassShape(width: 30, height: 30, radius: 15)), 12);
      // 12x12: 띠 = 6(최소값), 변위 = 9.
      expect(horonGlassScale(const HoronGlassShape(width: 12, height: 12, radius: 6)), 9);
    });

    test('rim displacement falls off as (1 - x)^2 from the edge inward', () {
      expect(horonGlassRimMagnitude(6, 12), closeTo(0.25, 1e-12));
      expect(horonGlassRimMagnitude(3, 12), closeTo(0.5625, 1e-12));
      expect(horonGlassRimMagnitude(9, 12), closeTo(0.0625, 1e-12));
      // 지도는 띠 바깥과 안쪽 끝에서 이동 없는 값(128)을 돌려줍니다.
      expect(horonGlassRimMagnitude(0, 12), 0);
      expect(horonGlassRimMagnitude(12, 12), 0);
      expect(horonGlassRimMagnitude(-1, 12), 0);
      expect(horonGlassRimMagnitude(13, 12), 0);
    });

    test('area caps are 600000 px² and 250000 px² on a coarse pointer', () {
      expect(
        horonGlassAreaAllowed(const HoronGlassShape(width: 600, height: 1000, radius: 8), coarsePointer: false),
        isTrue,
      );
      expect(
        horonGlassAreaAllowed(const HoronGlassShape(width: 601, height: 1000, radius: 8), coarsePointer: false),
        isFalse,
      );
      expect(
        horonGlassAreaAllowed(const HoronGlassShape(width: 500, height: 500, radius: 8), coarsePointer: true),
        isTrue,
      );
      expect(
        horonGlassAreaAllowed(const HoronGlassShape(width: 501, height: 500, radius: 8), coarsePointer: true),
        isFalse,
      );
      // 정밀 포인터에서 250000~600000 사이는 허용됩니다.
      expect(
        horonGlassAreaAllowed(const HoronGlassShape(width: 500, height: 500, radius: 8), coarsePointer: false),
        isTrue,
      );
    });
  });

  group('degrade ladder', () {
    HoronGlassRung rung({
      bool shaderSupported = true,
      bool reducedTransparency = false,
      HoronGlassRefraction refraction = HoronGlassRefraction.auto,
      bool opaque = false,
      bool areaAllowed = true,
      bool shaderReady = true,
    }) => horonGlassRungOf(
      shaderSupported: shaderSupported,
      reducedTransparency: reducedTransparency,
      refraction: refraction,
      opaque: opaque,
      areaAllowed: areaAllowed,
      shaderReady: shaderReady,
    );

    test('refracts when everything is available', () {
      expect(rung(), HoronGlassRung.refracted);
    });

    test('frost when the engine has no shader filter', () {
      expect(rung(shaderSupported: false), HoronGlassRung.frost);
      // 다른 조건이 모두 좋아도 마찬가지입니다.
      expect(rung(shaderSupported: false, shaderReady: true), HoronGlassRung.frost);
    });

    test('frost on reduced transparency', () {
      expect(rung(reducedTransparency: true), HoronGlassRung.frost);
    });

    test('frost when refraction is explicitly off', () {
      expect(rung(refraction: HoronGlassRefraction.off), HoronGlassRung.frost);
    });

    test('opaque hosts and over-cap hosts keep the layered look, not frost', () {
      expect(rung(opaque: true), HoronGlassRung.layered);
      expect(rung(areaAllowed: false), HoronGlassRung.layered);
      // 굴절 자격이 없는 호스트는 서리로 내려가지 않습니다.
      expect(rung(areaAllowed: false, shaderReady: false), HoronGlassRung.layered);
    });

    test('while the shader is still loading the layered look stands in', () {
      expect(rung(shaderReady: false), HoronGlassRung.layered);
    });
  });
}
