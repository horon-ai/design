import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:horon_ui/horon_ui.dart';

// 배럴 export는 통합 담당자가 소유하므로, 이 랜은 자기 컴포넌트를 하위 경로로 읽습니다.

/// [HoronGlassSurface]를 내용 위에 겹쳐 띄웁니다.
///
/// 블러는 뒤에 있는 것을 흐리게 만드는 효과라, 뒤에 내용이 있어야 의미가 있습니다.
Future<void> pumpGlass(
  WidgetTester tester,
  Widget child, {
  Brightness brightness = Brightness.light,
  bool disableAnimations = false,
  bool accessibleNavigation = false,
}) async {
  await tester.pumpWidget(
    MaterialApp(
      theme: horonTheme(brightness),
      home: MediaQuery(
        data: MediaQueryData(disableAnimations: disableAnimations, accessibleNavigation: accessibleNavigation),
        child: Scaffold(
          body: Stack(
            children: <Widget>[
              const Positioned.fill(
                child: ColoredBox(color: Color(0xFF3366AA), child: Text('뒤 내용')),
              ),
              Center(child: SizedBox(width: 240, child: child)),
            ],
          ),
        ),
      ),
    ),
  );
  // MaterialApp은 테마 변경을 암시 애니메이션으로 처리합니다. 한 번만 pump하면
  // 이전 테마의 색이 남으므로 정착시킵니다.
  await tester.pumpAndSettle();
}

/// 표면이 칠한 `BoxDecoration`입니다.
BoxDecoration surfaceOf(WidgetTester tester) {
  final DecoratedBox box = tester.widget<DecoratedBox>(
    find.descendant(of: find.byType(HoronGlassSurface), matching: find.byType(DecoratedBox)).first,
  );
  return box.decoration as BoxDecoration;
}

void main() {
  for (final Brightness brightness in Brightness.values) {
    final String name = brightness == Brightness.light ? '라이트' : '다크';

    testWidgets('$name: 유리 단계는 glassFill을 칠하고 32px 블러를 건다', (WidgetTester tester) async {
      await pumpGlass(tester, const HoronGlassSurface(child: Text('유리')), brightness: brightness);

      final HoronThemeData horon = HoronTheme.of(tester.element(find.byType(HoronGlassSurface)));
      expect(surfaceOf(tester).color, horon.glassFill);
      expect(surfaceOf(tester).border!.top.color, horon.glassBorder);

      // 블러는 뒤 내용을 흐리게 만드는 레이어입니다.
      expect(find.byType(BackdropFilter), findsOneWidget);
      // 그리고 뒤 내용이 실제로 표면 아래에 있습니다.
      expect(find.text('뒤 내용'), findsOneWidget);
    });
  }

  testWidgets('glass: the light and dark fills differ', (WidgetTester tester) async {
    await pumpGlass(tester, const HoronGlassSurface(child: Text('유리')));
    final Color light = surfaceOf(tester).color!;

    await pumpGlass(tester, const HoronGlassSurface(child: Text('유리')), brightness: Brightness.dark);
    final Color dark = surfaceOf(tester).color!;

    expect(light, isNot(dark));
    expect(light, HoronLightColors.glassFill);
    expect(dark, HoronDarkColors.glassFill);
  });

  testWidgets('glass: disableAnimations drops to the frost rung without a blur', (WidgetTester tester) async {
    await pumpGlass(tester, const HoronGlassSurface(child: Text('유리')), disableAnimations: true);

    final HoronThemeData horon = HoronTheme.of(tester.element(find.byType(HoronGlassSurface)));
    expect(surfaceOf(tester).color, horon.glassFillFrost);
    expect(surfaceOf(tester).color, isNot(horon.glassFill));
    // 서리 단계는 블러를 걸지 않습니다. 웹의 `prefers-reduced-transparency` 자리입니다.
    expect(find.byType(BackdropFilter), findsNothing);
  });

  testWidgets('glass: accessibleNavigation drops to the frost rung too', (WidgetTester tester) async {
    await pumpGlass(tester, const HoronGlassSurface(child: Text('유리')), accessibleNavigation: true);

    final HoronThemeData horon = HoronTheme.of(tester.element(find.byType(HoronGlassSurface)));
    expect(surfaceOf(tester).color, horon.glassFillFrost);
    expect(find.byType(BackdropFilter), findsNothing);
  });

  testWidgets('glass: solid uses the opaque rung for hosts without a backdrop filter', (WidgetTester tester) async {
    await pumpGlass(tester, const HoronGlassSurface(solid: true, child: Text('유리')));

    final HoronThemeData horon = HoronTheme.of(tester.element(find.byType(HoronGlassSurface)));
    expect(surfaceOf(tester).color, horon.glassFillSolid);
    expect(find.byType(BackdropFilter), findsNothing);
  });

  testWidgets('glass: the strong variant uses the stronger fill', (WidgetTester tester) async {
    await pumpGlass(tester, const HoronGlassSurface.strong(child: Text('유리')));

    final HoronThemeData horon = HoronTheme.of(tester.element(find.byType(HoronGlassSurface)));
    expect(surfaceOf(tester).color, horon.glassFillStrong);
    expect(find.byType(BackdropFilter), findsOneWidget);
  });

  testWidgets('glass: the surface is a card-radius panel with px-4 py-3 padding', (WidgetTester tester) async {
    await pumpGlass(tester, const HoronGlassSurface(child: Text('유리')));

    final BorderRadius radius = surfaceOf(tester).borderRadius! as BorderRadius;
    expect(radius.topLeft.x, closeTo(HoronRadiusRole.card, 0.01));

    final Rect surface = tester.getRect(find.byType(HoronGlassSurface));
    final Rect text = tester.getRect(find.text('유리'));
    expect(text.left - surface.left, closeTo(HoronSpace.s4, 0.5));
    expect(text.top - surface.top, closeTo(HoronSpace.s3, 0.5));
  });

  testWidgets('glass: an explicit radius overrides the default', (WidgetTester tester) async {
    await pumpGlass(
      tester,
      HoronGlassSurface(borderRadius: BorderRadius.circular(HoronRadiusRole.pill), child: const Text('유리')),
    );

    final BorderRadius radius = surfaceOf(tester).borderRadius! as BorderRadius;
    expect(radius.topLeft.x, closeTo(HoronRadiusRole.pill, 0.01));
  });
}
