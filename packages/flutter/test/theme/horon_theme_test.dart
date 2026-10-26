import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:horon_ui/horon_ui.dart';

/// 라이트·다크 두 밝기에서 테마가 생성 토큰과 같은 값을 내는지 확인합니다.
///
/// 테마는 화면이 읽는 유일한 색 출처입니다. 슬롯 하나가 토큰과 어긋나면 그
/// 화면만 다른 색을 그리고, 그 어긋남은 렌더를 눈으로 보기 전에는 드러나지
/// 않습니다. 그래서 여기서는 슬롯 값을 직접 대조합니다.
void main() {
  const Map<Brightness, HoronThemeData> dataByBrightness = <Brightness, HoronThemeData>{
    Brightness.light: HoronThemeData.light,
    Brightness.dark: HoronThemeData.dark,
  };

  /// 둥근 사각형 도형의 반경을 꺼냅니다.
  ///
  /// 도형이 [RoundedRectangleBorder]가 아니면 조용히 0을 돌려주지 않고 실패합니다.
  double radiusOf(ShapeBorder? shape, String where) {
    expect(shape, isA<RoundedRectangleBorder>(), reason: '$where의 도형이 둥근 사각형이 아닙니다');
    final borderRadius = (shape! as RoundedRectangleBorder).borderRadius;
    expect(borderRadius, isA<BorderRadius>(), reason: '$where의 반경이 BorderRadius가 아닙니다');
    return (borderRadius as BorderRadius).topLeft.x;
  }

  /// 입력 필드 테두리의 반경을 꺼냅니다.
  double fieldRadiusOf(InputBorder? border, String where) {
    expect(border, isA<OutlineInputBorder>(), reason: '$where의 테두리가 OutlineInputBorder가 아닙니다');
    final borderRadius = (border! as OutlineInputBorder).borderRadius;
    expect(borderRadius, isA<BorderRadius>(), reason: '$where의 반경이 BorderRadius가 아닙니다');
    return borderRadius.topLeft.x;
  }

  for (final brightness in Brightness.values) {
    final name = brightness == Brightness.light ? '라이트' : '다크';
    final isDark = brightness == Brightness.dark;

    group(name, () {
      test('$name: horonTheme가 ThemeData를 만든다', () {
        final theme = horonTheme(brightness);
        expect(theme.brightness, brightness);
        expect(theme.colorScheme.brightness, brightness);
        expect(theme.extensions.values.whereType<HoronThemeData>(), hasLength(1));
      });

      test('$name: ColorScheme의 surface와 primary가 생성 토큰과 같다', () {
        final scheme = horonTheme(brightness).colorScheme;
        final surface = isDark ? HoronDarkColors.background : HoronLightColors.background;
        final primary = isDark ? HoronDarkColors.primary : HoronLightColors.primary;
        expect(scheme.surface, surface);
        expect(scheme.onSurface, isDark ? HoronDarkColors.foreground : HoronLightColors.foreground);
        expect(scheme.primary, primary);
      });

      test('$name: HoronThemeData.ring이 생성 토큰의 ring과 같다', () {
        final data = dataByBrightness[brightness]!;
        expect(data.ring, isDark ? HoronDarkColors.ring : HoronLightColors.ring);
        expect(data.ring, ringColor(brightness));
      });

      test('$name: 표면 반경이 HoronRadiusRole 값과 같다', () {
        final theme = horonTheme(brightness);
        expect(radiusOf(theme.cardTheme.shape, 'cardTheme.shape'), HoronRadiusRole.card);
        expect(radiusOf(theme.dialogTheme.shape, 'dialogTheme.shape'), HoronRadiusRole.panel);
        expect(fieldRadiusOf(theme.inputDecorationTheme.focusedBorder, 'focusedBorder'), HoronRadiusRole.input);
        expect(fieldRadiusOf(theme.inputDecorationTheme.enabledBorder, 'enabledBorder'), HoronRadiusRole.input);
        expect(radiusOf(theme.bottomSheetTheme.shape, 'bottomSheetTheme.shape'), HoronRadiusRole.panel);
      });

      test('$name: textTheme.bodyMedium의 크기가 생성 토큰의 body와 같다', () {
        final textTheme = horonTheme(brightness).textTheme;
        expect(textTheme.bodyMedium?.fontSize, HoronText.body);
        expect(textTheme.displayLarge?.fontSize, HoronText.hero);
        expect(textTheme.bodyMedium?.fontFamily, HoronFont.body);
        expect(textTheme.bodyMedium?.fontFamilyFallback, HoronFont.fontFamilyFallback);
        expect(textTheme.bodyMedium?.fontWeight, HoronFontWeight.regular);
        expect(textTheme.bodyMedium?.height, HoronLineHeight.normal);
      });

      test('$name: 테마 확장이 HoronThemeData 하나이고 값이 상수와 같다', () {
        final data = horonTheme(brightness).extension<HoronThemeData>();
        expect(data, isNotNull);
        expect(data!.ring, dataByBrightness[brightness]!.ring);
        expect(data.success, isDark ? HoronDarkColors.success : HoronLightColors.success);
        expect(data.chart5, isDark ? HoronDarkColors.chart5 : HoronLightColors.chart5);
        expect(data.glassForeground, isDark ? HoronDarkColors.glassForeground : HoronLightColors.glassForeground);
        expect(data.strings, isA<HoronStrings>());
      });

      test('$name: scaffold 배경이 surface 토큰이고 appBar가 평평하다', () {
        final theme = horonTheme(brightness);
        expect(theme.scaffoldBackgroundColor, theme.colorScheme.surface);
        expect(theme.appBarTheme.elevation, 0);
        expect(theme.appBarTheme.surfaceTintColor, Colors.transparent);
      });
    });
  }

  group('확장 동작', () {
    test('copyWith는 지정한 슬롯만 바꾼다', () {
      final changed = HoronThemeData.light.copyWith(ring: HoronDarkColors.ring);
      expect(changed.ring, HoronDarkColors.ring);
      expect(changed.success, HoronThemeData.light.success);
      expect(changed.strings, HoronThemeData.light.strings);
    });

    test('lerp는 색을 보간하고 strings는 t<0.5에서 앞 값을 유지한다', () {
      final mid = HoronThemeData.light.lerp(HoronThemeData.dark, 0.5);
      expect(mid.ring, Color.lerp(HoronLightColors.ring, HoronDarkColors.ring, 0.5));
      expect(mid.strings, HoronThemeData.dark.strings);
      final early = HoronThemeData.light.lerp(HoronThemeData.dark, 0.25);
      expect(early.strings, HoronThemeData.light.strings);
    });

    testWidgets('HoronTheme.of는 확장이 없는 MaterialApp에서 StateError를 던진다', (tester) async {
      Object? thrown;
      await tester.pumpWidget(
        MaterialApp(
          home: Builder(
            builder: (context) {
              try {
                HoronTheme.of(context);
              } catch (error) {
                thrown = error;
              }
              return const SizedBox.shrink();
            },
          ),
        ),
      );
      expect(thrown, isA<StateError>());
      expect((thrown! as StateError).message, contains('horonTheme'));
    });

    testWidgets('HoronTheme.of는 horonTheme를 쓴 MaterialApp에서 확장을 돌려준다', (tester) async {
      HoronThemeData? seen;
      await tester.pumpWidget(
        MaterialApp(
          theme: horonTheme(Brightness.dark),
          home: Builder(
            builder: (context) {
              seen = HoronTheme.of(context);
              return const SizedBox.shrink();
            },
          ),
        ),
      );
      expect(seen, isNotNull);
      expect(seen!.ring, HoronDarkColors.ring);
    });
  });
}
