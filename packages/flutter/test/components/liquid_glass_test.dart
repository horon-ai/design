import 'dart:ui' as ui;

import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:horon_ui/src/glass/glass_geometry.dart';
import 'package:horon_ui/src/glass/glass_shader.dart';
import 'package:horon_ui/src/glass/horon_glass.dart';
import 'package:horon_ui/src/theme/horon_theme.dart';

/// `HoronLiquidGlass`의 레이어 스택과 강등 경로를 검사합니다.
///
/// `flutter test`는 Impeller 없이 돌기 때문에 `ui.ImageFilter.isShaderFilterSupported`가
/// 거짓입니다. 그 상태가 곧 이 위젯의 기본 경로(서리 채움)이고, 굴절은 기기에서만
/// 보입니다. 여기서는 굴절 대신 그 판정이 실제로 걸리는지(`refractionAttempts`)와
/// 레이어가 빠지는지 보는 것으로 그 자리를 채웁니다.
void main() {
  setUp(() {
    HoronGlassProbe.reset();
    horonShaderProgramCacheClear();
  });

  tearDown(HoronGlassProbe.reset);

  Future<void> pumpGlass(WidgetTester tester, Widget child, {Brightness brightness = Brightness.light}) async {
    await tester.pumpWidget(
      MaterialApp(
        theme: horonTheme(brightness),
        home: Scaffold(
          body: Center(child: SizedBox(width: 240, height: 56, child: child)),
        ),
      ),
    );
    await tester.pump();
  }

  HoronThemeData themeOf(WidgetTester tester) => HoronTheme.of(tester.element(find.byType(HoronLiquidGlass)));

  /// 채움 레이어의 색입니다. 티어에 따라 달라집니다.
  Color fillOf(WidgetTester tester) {
    final ColoredBox box = tester.widget<ColoredBox>(
      find.descendant(of: find.byKey(HoronGlassLayerKeys.fill), matching: find.byType(ColoredBox)),
    );
    return box.color;
  }

  /// 채움 레이어의 블러입니다.
  ui.ImageFilter? fillBlurOf(WidgetTester tester) =>
      tester.widget<BackdropFilter>(find.byKey(HoronGlassLayerKeys.fill)).filter;

  group('tiers', () {
    testWidgets('clear, regular and thick use the token fill colours', (WidgetTester tester) async {
      await pumpGlass(tester, const HoronLiquidGlass(child: Text('clear')));
      expect(fillOf(tester), themeOf(tester).colors.glassClear);

      await pumpGlass(tester, const HoronLiquidGlass(tier: HoronGlassTier.regular, child: Text('regular')));
      expect(fillOf(tester), themeOf(tester).colors.glassRegular);

      await pumpGlass(tester, const HoronLiquidGlass(tier: HoronGlassTier.thick, child: Text('thick')));
      expect(fillOf(tester), themeOf(tester).colors.glassThick);
    });

    testWidgets('each tier keeps its own backdrop blur', (WidgetTester tester) async {
      for (final HoronGlassTier tier in HoronGlassTier.values) {
        await pumpGlass(tester, HoronLiquidGlass(tier: tier, child: Text(tier.name)));
        final double sigma = horonGlassTierBlur(tier);
        expect(
          fillBlurOf(tester)?.toString(),
          ui.ImageFilter.blur(sigmaX: sigma, sigmaY: sigma).toString(),
          reason: tier.name,
        );
      }
    });
  });

  group('layer stack', () {
    testWidgets('the default tier stacks fill, tint, inner shade, edge and sheen', (WidgetTester tester) async {
      // 셰이더가 없으므로 서리 단계입니다. 판정이 걸렸는지를 먼저 확인합니다.
      await pumpGlass(tester, const HoronLiquidGlass(child: Text('유리')));
      expect(HoronGlassProbe.refractionAttempts, 0);

      expect(find.byKey(HoronGlassLayerKeys.frost), findsOneWidget);
      expect(find.byKey(HoronGlassLayerKeys.fill), findsOneWidget);
      for (final Key decorative in <Key>[
        HoronGlassLayerKeys.tint,
        HoronGlassLayerKeys.innerShade,
        HoronGlassLayerKeys.edgeLightSoft,
        HoronGlassLayerKeys.sheen,
        HoronGlassLayerKeys.refraction,
        HoronGlassLayerKeys.texture,
      ]) {
        expect(find.byKey(decorative), findsNothing, reason: '$decorative must be hidden on the frost rung');
      }
      // 내용은 그대로 보입니다.
      expect(find.text('유리'), findsOneWidget);
      expect(tester.takeException(), isNull);
    });

    testWidgets('the frost fill is the token frost colour at full opacity', (WidgetTester tester) async {
      await pumpGlass(tester, const HoronLiquidGlass(child: Text('유리')));
      final ColoredBox frost = tester.widget<ColoredBox>(find.byKey(HoronGlassLayerKeys.frost));
      expect(frost.color, themeOf(tester).colors.glassFillFrost);
      expect(frost.color.a, closeTo(0.9, 0.01));
    });
  });

  group('degrade paths', () {
    testWidgets('an unsupported engine never asks for the shader', (WidgetTester tester) async {
      expect(ui.ImageFilter.isShaderFilterSupported, isFalse);
      await pumpGlass(tester, const HoronLiquidGlass(child: Text('유리')));
      expect(HoronGlassProbe.refractionAttempts, 0);
      expect(find.byKey(HoronGlassLayerKeys.frost), findsOneWidget);
    });

    testWidgets('reduced motion renders the frost layer', (WidgetTester tester) async {
      await tester.pumpWidget(
        MaterialApp(
          theme: horonTheme(Brightness.light),
          home: MediaQuery(
            data: const MediaQueryData(disableAnimations: true),
            child: const Scaffold(
              body: Center(
                child: SizedBox(width: 240, height: 56, child: HoronLiquidGlass(child: Text('유리'))),
              ),
            ),
          ),
        ),
      );
      await tester.pump();
      expect(find.byKey(HoronGlassLayerKeys.frost), findsOneWidget);
      expect(find.byKey(HoronGlassLayerKeys.tint), findsNothing);
      expect(HoronGlassProbe.refractionAttempts, 0);
      expect(tester.takeException(), isNull);
    });

    testWidgets('refraction off renders the frost layer', (WidgetTester tester) async {
      await pumpGlass(tester, const HoronLiquidGlass(refract: HoronGlassRefraction.off, child: Text('유리')));
      expect(find.byKey(HoronGlassLayerKeys.frost), findsOneWidget);
      expect(HoronGlassProbe.refractionAttempts, 0);
    });

    testWidgets('a supported engine whose shader is missing degrades to frost instead of throwing', (
      WidgetTester tester,
    ) async {
      // 엔진이 지원한다고 답하면 위젯은 셰이더를 읽으려 합니다. 자산을 못 읽으면(테스트처럼
      // 컴파일된 셰이더가 없는 자리) 던지지 않고 서리 채움으로 내려가야 합니다.
      HoronGlassProbe.shaderFilterSupported = () => true;
      HoronGlassProbe.loadProgram = (String asset) async => null;
      await pumpGlass(tester, const HoronLiquidGlass(child: Text('유리')));
      await tester.pump();

      expect(HoronGlassProbe.refractionAttempts, 1);
      expect(find.byKey(HoronGlassLayerKeys.frost), findsOneWidget);
      expect(tester.takeException(), isNull);
    });

    testWidgets('a load that throws is caught and degrades to frost', (WidgetTester tester) async {
      HoronGlassProbe.shaderFilterSupported = () => true;
      HoronGlassProbe.loadProgram = (String asset) async => throw StateError('asset exploded');
      await pumpGlass(tester, const HoronLiquidGlass(child: Text('유리')));
      await tester.pump();

      expect(find.byKey(HoronGlassLayerKeys.frost), findsOneWidget);
      expect(tester.takeException(), isNull);
    });

    testWidgets('an opaque host keeps the layered look without refraction', (WidgetTester tester) async {
      HoronGlassProbe.shaderFilterSupported = () => true;
      await pumpGlass(tester, const HoronLiquidGlass(opaque: true, child: Text('유리')));
      await tester.pump(const Duration(milliseconds: 16));

      // 불투명 호스트는 셰이더를 읽지도 않고, 서리로도 내려가지 않습니다.
      expect(HoronGlassProbe.refractionAttempts, 0);
      expect(find.byKey(HoronGlassLayerKeys.frost), findsNothing);
    });
  });

  group('rendering', () {
    testWidgets('three tiers render in both brightnesses without exceptions', (WidgetTester tester) async {
      for (final Brightness brightness in Brightness.values) {
        for (final HoronGlassTier tier in HoronGlassTier.values) {
          await pumpGlass(
            tester,
            HoronLiquidGlass(texture: tier == HoronGlassTier.clear, tier: tier, child: Text(tier.name)),
            brightness: brightness,
          );
          expect(tester.takeException(), isNull, reason: '${brightness.name} ${tier.name}');
        }
      }
    });

    testWidgets('a custom radius is applied to the clip', (WidgetTester tester) async {
      await pumpGlass(
        tester,
        const HoronLiquidGlass(borderRadius: BorderRadius.all(Radius.circular(28)), child: Text('유리')),
      );
      final ClipRRect clip = tester.widget<ClipRRect>(find.byType(ClipRRect).first);
      expect((clip.borderRadius as BorderRadius).topLeft.x, 28);
    });
  });
}
