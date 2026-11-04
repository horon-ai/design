import 'dart:ui' as ui;

import 'package:flutter/painting.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:horon_ui/horon_ui.dart';

/// 글래스 재료의 순수 계산을 검사합니다.
///
/// 기대값은 `packages/tokens/src/glass.ts`의 계약입니다. 층은 셋입니다: 뒤 배경
/// (`blur` 20, `saturate` 1.8), 티어 채움, 안쪽 rim 1px. 굴절·질감·안쪽 그늘·광택과
/// 높이에 따른 값은 없습니다.
void main() {
  const HoronGlassTokens glass = HoronGlassTokens();

  group('glass tokens', () {
    test('기본값이 glass.ts와 같다', () {
      expect(glass.blur, 20);
      expect(glass.saturate, 1.8);
      expect(glass.rimWidth, 1);
      expect(glass.rimMidStop, 0.5);
    });

    test('채도 행렬이 Filter Effects의 saturate 계수다', () {
      final List<double> matrix = glass.saturateMatrix;
      expect(matrix, hasLength(20));
      // R' = (0.213+0.787s)R + (0.715-0.715s)G + (0.072-0.072s)B
      // G' = (0.213-0.213s)R + (0.715+0.285s)G + (0.072-0.072s)B
      // B' = (0.213-0.213s)R + (0.715-0.715s)G + (0.072+0.928s)B
      expect(matrix[0], closeTo(1.6296, 1e-12));
      expect(matrix[1], closeTo(-0.572, 1e-12));
      expect(matrix[2], closeTo(-0.0576, 1e-12));
      expect(matrix[5], closeTo(-0.1704, 1e-12));
      expect(matrix[6], closeTo(1.228, 1e-12));
      expect(matrix[7], closeTo(-0.0576, 1e-12));
      expect(matrix[10], closeTo(-0.1704, 1e-12));
      expect(matrix[11], closeTo(-0.572, 1e-12));
      expect(matrix[12], closeTo(1.7424, 1e-12));
      // 알파 행은 단위 행렬이고 나머지 알파 계수는 0입니다.
      expect(matrix.sublist(3, 5), <double>[0, 0]);
      expect(matrix.sublist(8, 10), <double>[0, 0]);
      expect(matrix.sublist(13, 15), <double>[0, 0]);
      expect(matrix.sublist(15), <double>[0, 0, 0, 1, 0]);
    });

    test('채도 행렬은 흰색을 그대로 둔다', () {
      // CSS saturate()는 선형 연산이라 흰색(1,1,1)이 흰색으로 남아야 합니다.
      final List<double> m = glass.saturateMatrix;
      expect(m[0] + m[1] + m[2], closeTo(1, 1e-12));
      expect(m[5] + m[6] + m[7], closeTo(1, 1e-12));
      expect(m[10] + m[11] + m[12], closeTo(1, 1e-12));
    });

    test('채도 값을 바꾸면 행렬도 따라온다', () {
      const HoronGlassTokens mono = HoronGlassTokens(saturate: 0);
      final List<double> matrix = mono.saturateMatrix;
      // s=0이면 각 행이 회색 계수(0.213, 0.715, 0.072)가 됩니다.
      expect(matrix.sublist(0, 3), <double>[0.213, 0.715, 0.072]);
      expect(matrix.sublist(5, 8), <double>[0.213, 0.715, 0.072]);
      expect(matrix.sublist(10, 13), <double>[0.213, 0.715, 0.072]);
    });

    test('림 색이 밝기별 토큰과 같다', () {
      final HoronGlassRim light = glass.rimFor(ui.Brightness.light);
      expect(light.top, const Color(0xB3FFFFFF));
      expect(light.mid, const Color(0x1FFFFFFF));
      expect(light.bottom, const Color(0x4DFFFFFF));
      expect(light.colors, <Color>[light.top, light.mid, light.bottom]);
      expect(light.stops(0.5), <double>[0, 0.5, 1]);

      final HoronGlassRim dark = glass.rimFor(ui.Brightness.dark);
      expect(dark.top, const Color(0x38FFFFFF));
      expect(dark.mid, const Color(0x0AFFFFFF));
      expect(dark.bottom, const Color(0x1AFFFFFF));
      expect(dark.colors, <Color>[dark.top, dark.mid, dark.bottom]);
      expect(dark.stops(0.35), <double>[0, 0.35, 1]);
    });
  });

  group('glass material', () {
    test('각 티어가 토큰 채움 색으로 간다', () {
      expect(horonGlassTierFill(HoronGlassTier.clear, HoronColors.light), HoronLightColors.glassClear);
      expect(horonGlassTierFill(HoronGlassTier.regular, HoronColors.light), HoronLightColors.glassRegular);
      expect(horonGlassTierFill(HoronGlassTier.thick, HoronColors.light), HoronLightColors.glassThick);
      expect(horonGlassTierFill(HoronGlassTier.clear, HoronColors.dark), HoronDarkColors.glassClear);
      expect(horonGlassTierFill(HoronGlassTier.regular, HoronColors.dark), HoronDarkColors.glassRegular);
      expect(horonGlassTierFill(HoronGlassTier.thick, HoronColors.dark), HoronDarkColors.glassThick);
    });

    test('뒤 배경 필터는 블러 다음 채도 순서다', () {
      final ui.ImageFilter filter = horonGlassBackdropFilter(glass);
      expect(
        filter,
        ui.ImageFilter.compose(
          outer: ui.ColorFilter.matrix(glass.saturateMatrix),
          inner: ui.ImageFilter.blur(sigmaX: glass.blur, sigmaY: glass.blur, tileMode: ui.TileMode.mirror),
        ),
      );
      // 블러는 토큰 하나를 양축에 같은 값으로 넘깁니다.
      expect(glass.blur, 20);
    });
  });
}
