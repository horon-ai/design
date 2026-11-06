import 'dart:ui' as ui;

import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:horon_ui/horon_ui.dart';

/// `HoronLiquidGlass`가 그리는 세 층을 검사합니다.
///
/// 계약은 플랫폼 공통입니다: 뒤 배경은 토큰 블러 다음 토큰 채도 행렬, 채움은 티어 색,
/// 림은 밝기별 세로 그라디언트입니다. 그림자·굴절·질감·안쪽 그늘·광택은 없습니다.
void main() {
  Future<void> pumpGlass(
    WidgetTester tester,
    Widget child, {
    Brightness brightness = Brightness.light,
    bool disableAnimations = false,
  }) async {
    await tester.pumpWidget(
      MaterialApp(
        theme: horonTheme(brightness),
        home: Builder(
          builder: (BuildContext context) => MediaQuery(
            data: MediaQuery.of(context).copyWith(disableAnimations: disableAnimations),
            child: Scaffold(
              body: Center(child: SizedBox(width: 240, height: 56, child: child)),
            ),
          ),
        ),
      ),
    );
  }

  HoronThemeData themeOf(WidgetTester tester) => HoronTheme.of(tester.element(find.byType(HoronLiquidGlass)));

  /// 채움 레이어의 색입니다. 티어와 밝기에 따라 달라집니다.
  Color fillOf(WidgetTester tester) => tester.widget<ColoredBox>(find.byKey(HoronGlassKeys.fill)).color;

  /// 뒤 배경을 필터하는 레이어입니다. 서리 단계에는 없습니다.
  ui.ImageFilter backdropOf(WidgetTester tester) =>
      tester.widget<BackdropFilter>(find.byKey(HoronGlassKeys.backdrop)).filter!;

  HoronGlassRimPainter rimOf(WidgetTester tester) {
    final CustomPaint paint = tester.widget<CustomPaint>(find.byKey(HoronGlassKeys.rim));
    return paint.painter! as HoronGlassRimPainter;
  }

  group('fill', () {
    testWidgets('clear, regular and thick use the token fill colours', (WidgetTester tester) async {
      for (final Brightness brightness in Brightness.values) {
        for (final HoronGlassTier tier in HoronGlassTier.values) {
          await pumpGlass(
            tester,
            HoronLiquidGlass(tier: tier, child: Text(tier.name)),
            brightness: brightness,
          );
          expect(
            fillOf(tester),
            horonGlassTierFill(tier, themeOf(tester).colors),
            reason: '${brightness.name} ${tier.name}',
          );
        }
      }
    });

    testWidgets('the default tier is clear', (WidgetTester tester) async {
      await pumpGlass(tester, const HoronLiquidGlass(child: Text('clear')));
      expect(fillOf(tester), themeOf(tester).colors.glassClear);
    });
  });

  group('backdrop', () {
    testWidgets('blurs with the token sigma and then applies the token saturate matrix', (WidgetTester tester) async {
      await pumpGlass(tester, const HoronLiquidGlass(child: Text('유리')));
      final HoronGlassTokens glass = themeOf(tester).glass;

      expect(glass.blur, 20);
      expect(glass.saturate, 1.8);
      expect(
        backdropOf(tester),
        ui.ImageFilter.compose(
          outer: ui.ColorFilter.matrix(glass.saturateMatrix),
          inner: ui.ImageFilter.blur(sigmaX: glass.blur, sigmaY: glass.blur, tileMode: ui.TileMode.mirror),
        ),
      );
      // 필터는 배경 레이어 하나에만 걸립니다.
      expect(find.byType(BackdropFilter), findsOneWidget);
    });
  });

  group('rim', () {
    testWidgets('uses the light brightness colours and the token stops', (WidgetTester tester) async {
      await pumpGlass(tester, const HoronLiquidGlass(child: Text('유리')));
      final HoronGlassTokens glass = themeOf(tester).glass;
      final HoronGlassRim rim = glass.rimFor(Brightness.light);
      final HoronGlassRimPainter painter = rimOf(tester);

      expect(painter.rim, rim);
      expect(painter.gradient.colors, rim.colors);
      expect(painter.gradient.stops, <double>[0, glass.rimMidStop, 1]);
      expect(painter.gradient.begin, Alignment.topCenter);
      expect(painter.gradient.end, Alignment.bottomCenter);
      expect(painter.width, glass.rimWidth);
      expect(painter.midStop, glass.rimMidStop);
    });

    testWidgets('uses the dark brightness colours', (WidgetTester tester) async {
      await pumpGlass(tester, const HoronLiquidGlass(child: Text('유리')), brightness: Brightness.dark);
      final HoronGlassTokens glass = themeOf(tester).glass;
      final HoronGlassRim rim = glass.rimFor(Brightness.dark);
      final HoronGlassRimPainter painter = rimOf(tester);

      expect(painter.rim, rim);
      expect(painter.gradient.colors, rim.colors);
    });

    testWidgets('edgeColor replaces the gradient with one solid rim colour', (WidgetTester tester) async {
      const Color danger = Color(0xFFCC3333);
      await pumpGlass(tester, const HoronLiquidGlass(edgeColor: danger, child: Text('유리')));
      final HoronGlassRimPainter painter = rimOf(tester);
      expect(painter.edgeColor, danger);
      // 그라디언트 정의는 남지만, 그리는 색은 단색입니다.
      expect(painter.gradient.colors.length, 3);
    });

    testWidgets('the rim is drawn inside the surface edge', (WidgetTester tester) async {
      // 1px 링이 반경 안쪽에 붙도록 선 두께의 절반만큼 들어간 사각형을 씁니다.
      await pumpGlass(tester, const HoronLiquidGlass(child: Text('유리')));
      final HoronGlassRimPainter painter = rimOf(tester);
      expect(painter.width, 1);
      expect(painter.radius, BorderRadius.circular(themeOf(tester).radius.md));
    });
  });

  group('frost fallback', () {
    testWidgets('reduced motion drops the backdrop filter and keeps the frost fill and rim', (
      WidgetTester tester,
    ) async {
      await pumpGlass(tester, const HoronLiquidGlass(child: Text('유리')), disableAnimations: true);

      expect(find.byKey(HoronGlassKeys.backdrop), findsNothing);
      expect(find.byType(BackdropFilter), findsNothing);
      expect(find.byKey(HoronGlassKeys.fill), findsOneWidget);
      expect(fillOf(tester), themeOf(tester).colors.glassFillFrost);
      expect(find.byKey(HoronGlassKeys.rim), findsOneWidget);
      expect(find.text('유리'), findsOneWidget);
      expect(tester.takeException(), isNull);
    });
  });

  group('separation from the veil', () {
    testWidgets('the liquid material draws no veil layers', (WidgetTester tester) async {
      await pumpGlass(tester, const HoronLiquidGlass(child: Text('유리')));
      // 두 재료를 겹치지 않습니다. veil은 HoronVeil이 따로 그립니다.
      expect(find.byKey(HoronVeilKeys.backdrop), findsNothing);
      expect(find.byKey(HoronVeilKeys.fill), findsNothing);
      expect(find.byKey(HoronVeilKeys.decoration), findsNothing);
    });
  });

  group('material', () {
    testWidgets('the bare material paints no shadow', (WidgetTester tester) async {
      await pumpGlass(tester, const HoronLiquidGlass(child: Text('유리')));
      // 그림자는 컴포넌트의 몫입니다. 재료 안에는 DecoratedBox도 BoxShadow도 없습니다.
      expect(find.descendant(of: find.byType(HoronLiquidGlass), matching: find.byType(DecoratedBox)), findsNothing);
      expect(find.descendant(of: find.byType(HoronLiquidGlass), matching: find.byType(PhysicalModel)), findsNothing);
    });

    testWidgets('a custom radius is applied to the clip', (WidgetTester tester) async {
      await pumpGlass(
        tester,
        const HoronLiquidGlass(borderRadius: BorderRadius.all(Radius.circular(28)), child: Text('유리')),
      );
      final ClipRRect clip = tester.widget<ClipRRect>(find.byType(ClipRRect).first);
      expect((clip.borderRadius as BorderRadius).topLeft.x, 28);
      expect(rimOf(tester).radius.topLeft.x, 28);
    });

    testWidgets('three tiers render in both brightnesses without exceptions', (WidgetTester tester) async {
      for (final Brightness brightness in Brightness.values) {
        for (final HoronGlassTier tier in HoronGlassTier.values) {
          await pumpGlass(
            tester,
            HoronLiquidGlass(tier: tier, child: Text(tier.name)),
            brightness: brightness,
          );
          expect(tester.takeException(), isNull, reason: '${brightness.name} ${tier.name}');
        }
      }
    });
  });
}
