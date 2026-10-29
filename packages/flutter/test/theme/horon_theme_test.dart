import 'dart:io';

import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:horon_ui/src/contracts/horon_strings.dart';
import 'package:horon_ui/src/theme/horon_fonts.dart';
import 'package:horon_ui/src/theme/horon_theme.dart';
import 'package:horon_ui/src/tokens/horon_tokens.g.dart';

/// 테마 브리지가 토큰과 같은 값을 내는지 확인합니다.
///
/// 테마는 화면이 읽는 유일한 값 출처입니다. 슬롯 하나가 토큰과 어긋나면 그 화면만 다른
/// 색을 그리고, 그 어긋남은 렌더를 눈으로 보기 전에는 드러나지 않습니다. 그래서 여기서는
/// 슬롯 값을 직접 대조하고, 다리 파일에 손으로 옮긴 색 리터럴이 없는지도 확인합니다.
void main() {
  ColorScheme schemeOf(Brightness brightness) =>
      brightness == Brightness.dark ? horonDarkColorScheme : horonLightColorScheme;

  /// brief가 요구한 ColorScheme 슬롯 열세 개를 토큰과 대조합니다.
  void expectSchemeSlots(ColorScheme scheme, HoronColors colors) {
    expect(scheme.surface, colors.bgSurface);
    expect(scheme.onSurface, colors.textPrimary);
    expect(scheme.primary, colors.interactivePrimary);
    expect(scheme.onPrimary, colors.interactiveOnPrimary);
    expect(scheme.secondary, colors.bgSubtle);
    expect(scheme.onSecondary, colors.textPrimary);
    expect(scheme.error, colors.interactiveDanger);
    expect(scheme.onError, colors.interactiveOnDanger);
    expect(scheme.outline, colors.borderDefault);
    expect(scheme.outlineVariant, colors.borderStrong);
    expect(scheme.surfaceContainerHighest, colors.bgSubtle);
    expect(scheme.inverseSurface, colors.surfaceInk);
    expect(scheme.onInverseSurface, colors.textOnInk);
  }

  for (final brightness in Brightness.values) {
    final name = brightness == Brightness.light ? '라이트' : '다크';
    final data = brightness == Brightness.dark ? HoronThemeData.dark : HoronThemeData.light;

    group('$name 테마', () {
      test('$name: 확장이 하나이고 값이 상수와 같다', () {
        final theme = horonTheme(brightness);
        expect(theme.brightness, brightness);
        final extensions = theme.extensions.values.whereType<HoronThemeData>();
        expect(extensions, hasLength(1));
        expect(extensions.single.brightness, brightness);
        expect(extensions.single.colors, data.colors);
        expect(extensions.single.strings, isA<HoronStrings>());
      });

      test('$name: ColorScheme 슬롯이 토큰 색과 같다', () {
        expect(schemeOf(brightness).brightness, brightness);
        expectSchemeSlots(horonTheme(brightness).colorScheme, data.colors);
      });

      test('$name: 확장 안에서 색 리터럴 없이 토큰 표를 쓴다', () {
        expect(data.colors, brightness == Brightness.dark ? HoronColors.dark : HoronColors.light);
        expect(data.text.labelSm.fontFamily, HoronFont.sans);
      });

      test('$name: scaffold 배경과 appBar가 토큰 색이고 평평하다', () {
        final theme = horonTheme(brightness);
        expect(theme.scaffoldBackgroundColor, data.colors.bgDefault);
        expect(theme.appBarTheme.backgroundColor, data.colors.bgDefault);
        expect(theme.appBarTheme.foregroundColor, data.colors.textPrimary);
        expect(theme.appBarTheme.elevation, 0);
        expect(theme.appBarTheme.surfaceTintColor, Colors.transparent);
      });

      test('$name: textTheme가 토큰 타이포에서 온다', () {
        final textTheme = horonTheme(brightness).textTheme;
        expect(textTheme.bodyMedium?.fontSize, data.text.bodyMd.fontSize);
        expect(textTheme.bodyMedium?.fontFamily, HoronFont.sans);
        expect(textTheme.bodyMedium?.fontFamilyFallback, HoronFont.sansFallback);
        expect(textTheme.displayLarge?.fontSize, data.text.displayLg.fontSize);
        expect(textTheme.labelSmall?.fontSize, data.text.labelSm.fontSize);
      });

      test('$name: 카드와 입력 필드 반경이 토큰 단계다', () {
        final theme = horonTheme(brightness);
        final cardShape = theme.cardTheme.shape! as RoundedRectangleBorder;
        expect(cardShape.borderRadius, BorderRadius.circular(data.radius.xl));
        final fieldBorder = theme.inputDecorationTheme.focusedBorder! as OutlineInputBorder;
        expect(fieldBorder.borderRadius, BorderRadius.circular(data.radius.md));
        expect(fieldBorder.borderSide.color, data.colors.borderFocus);
      });

      test('$name: 다리 파일의 그림자·간격·브레이크포인트가 토큰 값이다', () {
        expect(data.shadows.popover, HoronShadow.popover);
        expect(data.shadows.palette, HoronShadow.palette);
        expect(data.space.s3_5, HoronSpace.s3_5);
        expect(data.breakpoints.md, HoronBreakpoint.md);
        expect(data.glass.edgeLightSoftColor, const Color(0x33FFFFFF));
      });
    });
  }

  group('묶음 접근', () {
    test('반경 묶음이 생성된 단계와 같다', () {
      const radius = HoronRadiusSpec();
      expect(radius.none, HoronRadius.none);
      expect(radius.xs, HoronRadius.xs);
      expect(radius.sm, HoronRadius.sm);
      expect(radius.md, HoronRadius.md);
      expect(radius.lg, HoronRadius.lg);
      expect(radius.xl, HoronRadius.xl);
      expect(radius.xl2, HoronRadius.xl2);
      expect(radius.full, HoronRadius.full);
    });

    test('간격 묶음이 Tailwind 단위를 4px로 센다', () {
      const space = HoronSpaceSpec();
      expect(space.s1, 4);
      expect(space.s1_5, 6);
      expect(space.step(1), space.s1);
      expect(space.step(5.5), 22);
      expect(space.step(4.5), 18);
    });

    test('텍스트·글래스 묶음이 기본 토큰 값을 쓴다', () {
      const text = HoronTextStyles();
      const glass = HoronGlassTokens();
      expect(text.labelSm.fontSize, 12);
      expect(glass.layerOpacity, 0.5);
    });
  });

  group('확장 동작', () {
    test('copyWith는 지정한 묶음만 바꾼다', () {
      final changed = HoronThemeData.light.copyWith(colors: HoronColors.dark);
      expect(changed.colors, HoronColors.dark);
      expect(changed.brightness, Brightness.light);
      expect(changed.text, HoronThemeData.light.text);
      expect(changed.strings, HoronThemeData.light.strings);
    });

    test('lerp는 색을 보간하고 나머지 묶음은 t<0.5에서 앞 값을 유지한다', () {
      final mid = HoronThemeData.light.lerp(HoronThemeData.dark, 0.5);
      expect(mid.colors.bgSurface, Color.lerp(HoronColors.light.bgSurface, HoronColors.dark.bgSurface, 0.5));
      expect(mid.brightness, Brightness.dark);
      expect(mid.strings, HoronThemeData.dark.strings);
      final early = HoronThemeData.light.lerp(HoronThemeData.dark, 0.25);
      expect(early.brightness, Brightness.light);
      expect(early.shadows, HoronThemeData.light.shadows);
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

    testWidgets('HoronTheme.of는 horonTheme를 쓴 MaterialApp에서 묶음을 돌려준다', (tester) async {
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
      expect(seen!.colors, HoronColors.dark);
      expect(seen!.brightness, Brightness.dark);
    });
  });

  group('손으로 옮긴 값', () {
    test('다리 파일에 색 리터럴과 시드 파생이 없다', () {
      final source = File('lib/src/theme/horon_theme.dart').readAsStringSync();
      expect(RegExp(r'Color\(0x').hasMatch(source), isFalse, reason: '색은 토큰에서만 옵니다');
      expect(RegExp(r'ColorScheme\.fromSeed\(').hasMatch(source), isFalse);
      expect(RegExp(r'^  background: ', multiLine: true).hasMatch(source), isFalse);
      expect(RegExp(r'^  onBackground: ', multiLine: true).hasMatch(source), isFalse);
      expect(RegExp(r'^  surfaceVariant: ', multiLine: true).hasMatch(source), isFalse);
    });

    test('다리 파일이 생성된 토큰을 값의 출처로 쓴다', () {
      final source = File('lib/src/theme/horon_theme.dart').readAsStringSync();
      expect(source.contains("import '../tokens/horon_tokens.g.dart';"), isTrue);
      expect(source.contains('HoronLightColors.interactivePrimary'), isTrue);
      expect(source.contains('HoronDarkColors.interactivePrimary'), isTrue);
    });
  });
}
