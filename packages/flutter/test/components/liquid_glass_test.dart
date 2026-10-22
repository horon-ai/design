import 'dart:ui' as ui;

import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:horon_ui/horon_ui.dart';
// 배럴 export는 통합 담당자가 소유하므로, 이 랜은 자기 컴포넌트를 하위 경로로 읽습니다.
import 'package:horon_ui/src/components/liquid_glass.dart';

/// [HoronLiquidGlass]를 내용 위에 띄웁니다.
Future<void> pumpLiquid(WidgetTester tester, Widget child, {Brightness brightness = Brightness.light}) async {
  await tester.pumpWidget(
    MaterialApp(
      theme: horonTheme(brightness),
      home: Scaffold(
        body: Stack(
          children: <Widget>[
            const Positioned.fill(
              child: ColoredBox(color: Color(0xFF3366AA), child: Text('뒤 내용')),
            ),
            Center(child: SizedBox(width: 280, child: child)),
          ],
        ),
      ),
    ),
  );
  // MaterialApp은 테마 변경을 암시 애니메이션으로 처리합니다. 한 번만 pump하면
  // 이전 테마의 색이 남으므로 정착시킵니다.
  await tester.pumpAndSettle();
}

/// 표면의 그라디언트 채움입니다.
LinearGradient fillOf(WidgetTester tester) {
  final DecoratedBox box = tester.widget<DecoratedBox>(
    find
        .descendant(
          of: find.byType(HoronLiquidGlass),
          matching: find.byWidgetPredicate(
            (Widget widget) => widget is DecoratedBox && widget.decoration is BoxDecoration,
          ),
        )
        .last,
  );
  return (box.decoration as BoxDecoration).gradient! as LinearGradient;
}

/// 표면 바깥의 그림자입니다.
List<BoxShadow> shadowsOf(WidgetTester tester) {
  final DecoratedBox box = tester.widget<DecoratedBox>(
    find
        .descendant(
          of: find.byType(HoronLiquidGlass),
          matching: find.byWidgetPredicate(
            (Widget widget) => widget is DecoratedBox && widget.decoration is BoxDecoration,
          ),
        )
        .first,
  );
  return (box.decoration as BoxDecoration).boxShadow!;
}

/// 그려진 1px 테두리를 담은 페인터입니다.
CustomPaint ringOf(WidgetTester tester) {
  return tester.widget<CustomPaint>(
    find.descendant(of: find.byType(HoronLiquidGlass), matching: find.byType(CustomPaint)).first,
  );
}

void main() {
  testWidgets('liquid glass: the recipe is a 4px blur over a vertical gradient fill', (WidgetTester tester) async {
    await pumpLiquid(tester, const HoronLiquidGlass(child: Text('헤더')));

    // `glassLiquidBlur`는 4입니다. 표면의 유리 블러(32)와 다른 값입니다.
    expect(horonGlassLiquidBlur, 4.0);
    final BackdropFilter filter = tester.widget<BackdropFilter>(find.byType(BackdropFilter));
    final ui.ImageFilter expected = ui.ImageFilter.blur(sigmaX: horonGlassLiquidBlur, sigmaY: horonGlassLiquidBlur);
    expect(filter.filter.toString(), expected.toString());

    final LinearGradient fill = fillOf(tester);
    expect(fill.begin, Alignment.topCenter);
    expect(fill.end, Alignment.bottomCenter);
    // light는 흰색 40%에서 80%로 갑니다(`glassLiquidFill.light`).
    expect(fill.colors.first.a, closeTo(0.4, 0.01));
    expect(fill.colors.last.a, closeTo(0.8, 0.01));
    expect(fill.stops, <double>[0.1, 1]);
  });

  testWidgets('liquid glass: light and dark use different fills and shadows', (WidgetTester tester) async {
    await pumpLiquid(tester, const HoronLiquidGlass(child: Text('헤더')));
    final LinearGradient lightFill = fillOf(tester);
    final List<BoxShadow> lightShadow = shadowsOf(tester);

    await pumpLiquid(tester, const HoronLiquidGlass(child: Text('헤더')), brightness: Brightness.dark);
    final LinearGradient darkFill = fillOf(tester);
    final List<BoxShadow> darkShadow = shadowsOf(tester);

    // dark는 흰색 8%에서 14%로 훨씬 옅습니다.
    expect(darkFill.colors.first.a, closeTo(0.08, 0.01));
    expect(darkFill.colors.last.a, closeTo(0.14, 0.01));
    expect(darkFill.colors.first.a, isNot(closeTo(lightFill.colors.first.a, 0.01)));

    // 그림자는 light 0.1/0.06, dark 0.4/0.3입니다.
    expect(lightShadow.first.color.a, closeTo(0.1, 0.01));
    expect(lightShadow.last.color.a, closeTo(0.06, 0.01));
    expect(darkShadow.first.color.a, closeTo(0.4, 0.01));
    expect(darkShadow.last.color.a, closeTo(0.3, 0.01));
  });

  testWidgets('liquid glass: the two-layer shadow keeps the measured geometry', (WidgetTester tester) async {
    await pumpLiquid(tester, const HoronLiquidGlass(child: Text('헤더')));

    final List<BoxShadow> shadows = shadowsOf(tester);
    expect(shadows, hasLength(2));
    // `0 12px 12px 2px`
    expect(shadows.first.offset, const Offset(0, 12));
    expect(shadows.first.blurRadius, 12);
    expect(shadows.first.spreadRadius, 2);
    // `0 2px 4px -1px`
    expect(shadows.last.offset, const Offset(0, 2));
    expect(shadows.last.blurRadius, 4);
    expect(shadows.last.spreadRadius, -1);
  });

  testWidgets('liquid glass: a 1px gradient border is painted as the ring', (WidgetTester tester) async {
    await pumpLiquid(tester, const HoronLiquidGlass(child: Text('헤더')));

    final CustomPaint ring = ringOf(tester);
    expect(ring.foregroundPainter, isNotNull);

    // 링은 위·아래가 밝고 75~95%가 투명합니다(`glassLiquidBorder`).
    final LinearGradient border = LinearGradient(
      begin: Alignment.topCenter,
      end: Alignment.bottomCenter,
      colors: <Color>[
        HoronPalette.sand100.withValues(alpha: 0.64),
        HoronPalette.sand100.withValues(alpha: 0.64),
        Colors.transparent,
        Colors.transparent,
        HoronPalette.sand100.withValues(alpha: 0.64),
      ],
      stops: const <double>[0, 0.4, 0.75, 0.95, 1],
    );
    expect(border.colors[2], Colors.transparent);
    expect(border.stops, <double>[0, 0.4, 0.75, 0.95, 1]);
  });

  testWidgets('liquid glass: the panel fill is heavier than the header fill', (WidgetTester tester) async {
    await pumpLiquid(tester, const HoronLiquidGlass(child: Text('헤더')));
    final LinearGradient header = fillOf(tester);

    await pumpLiquid(tester, const HoronLiquidGlass.panel(child: Text('패널')));
    final LinearGradient panel = fillOf(tester);

    expect(header.colors.last.a, closeTo(0.8, 0.01));
    // 패널은 94%에서 98%입니다. 목록이 뒤 내용으로 읽히지 않게 진합니다.
    expect(panel.colors.first.a, closeTo(0.94, 0.01));
    expect(panel.colors.last.a, closeTo(0.98, 0.01));
  });

  testWidgets('liquid glass: the surface is a card-radius panel over the content', (WidgetTester tester) async {
    await pumpLiquid(tester, const HoronLiquidGlass(child: Text('헤더')));

    final ClipRRect clip = tester.widget<ClipRRect>(find.byType(ClipRRect).first);
    final BorderRadius radius = clip.borderRadius as BorderRadius;
    expect(radius.topLeft.x, closeTo(HoronRadiusRole.card, 0.01));

    expect(find.text('뒤 내용'), findsOneWidget);
  });

  testWidgets('liquid glass: both brightnesses render both fills', (WidgetTester tester) async {
    for (final Brightness brightness in Brightness.values) {
      await pumpLiquid(tester, const HoronLiquidGlass(child: Text('헤더')), brightness: brightness);
      expect(tester.takeException(), isNull, reason: 'header on ${brightness.name}');

      await pumpLiquid(tester, const HoronLiquidGlass.panel(child: Text('패널')), brightness: brightness);
      expect(tester.takeException(), isNull, reason: 'panel on ${brightness.name}');
    }
  });
}
