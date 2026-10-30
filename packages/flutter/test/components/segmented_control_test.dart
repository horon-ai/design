import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:horon_ui/horon_ui.dart';

/// `HoronSegmentedControl`의 크기·표면·선택·비활성·채움 계약을 검사합니다.
void main() {
  const List<HoronSegmentedItem> items = <HoronSegmentedItem>[
    HoronSegmentedItem(value: 'a', label: 'A'),
    HoronSegmentedItem(value: 'b', label: 'B'),
    HoronSegmentedItem(value: 'c', label: 'C', disabled: true),
  ];

  Future<void> pumpControl(
    WidgetTester tester, {
    Brightness brightness = Brightness.light,
    HoronSegmentedControlSize size = HoronSegmentedControlSize.md,
    HoronSegmentedControlSurface surface = HoronSegmentedControlSurface.glass,
    String? value,
    bool? fill,
    ValueChanged<String>? onValueChange,
    double width = 400,
  }) async {
    await tester.pumpWidget(
      MaterialApp(
        theme: horonTheme(brightness),
        home: Scaffold(
          body: Center(
            child: Align(
              alignment: Alignment.topLeft,
              child: SizedBox(
                width: width,
                child: HoronSegmentedControl(
                  items: items,
                  value: value,
                  size: size,
                  surface: surface,
                  fill: fill,
                  onValueChange: onValueChange,
                ),
              ),
            ),
          ),
        ),
      ),
    );
    await tester.pump();
  }

  HoronThemeData themeOf(WidgetTester tester) => HoronTheme.of(tester.element(find.byType(HoronSegmentedControl)));

  double segmentWidth(WidgetTester tester, String label) =>
      tester.getSize(find.ancestor(of: find.text(label), matching: find.byType(GestureDetector)).first).width;

  testWidgets('renders in light and dark without an exception', (WidgetTester tester) async {
    for (final Brightness brightness in Brightness.values) {
      await pumpControl(tester, brightness: brightness, value: 'a');
      expect(tester.takeException(), isNull, reason: 'brightness $brightness');
    }
  });

  testWidgets('each size sets its own track height', (WidgetTester tester) async {
    for (final ({HoronSegmentedControlSize size, double height}) row
        in <({HoronSegmentedControlSize size, double height})>[
          (size: HoronSegmentedControlSize.sm, height: 36),
          (size: HoronSegmentedControlSize.md, height: 36),
          (size: HoronSegmentedControlSize.lg, height: 44),
          (size: HoronSegmentedControlSize.tab, height: 40),
        ]) {
      await pumpControl(tester, size: row.size, value: 'a');
      expect(tester.getSize(find.byType(HoronSegmentedControl)).height, row.height, reason: '${row.size}');
    }
  });

  testWidgets('each surface paints its own track fill', (WidgetTester tester) async {
    await pumpControl(tester, surface: HoronSegmentedControlSurface.glass, value: 'a');
    expect(
      tester.widgetList<HoronLiquidGlass>(find.byType(HoronLiquidGlass)).map((HoronLiquidGlass glass) => glass.tier),
      contains(HoronGlassTier.regular),
    );

    for (final ({HoronSegmentedControlSurface surface, Color Function(HoronThemeData) color}) row
        in <({HoronSegmentedControlSurface surface, Color Function(HoronThemeData) color})>[
          (surface: HoronSegmentedControlSurface.inset, color: (HoronThemeData h) => h.colors.overlayInk5),
          (surface: HoronSegmentedControlSurface.insetFaint, color: (HoronThemeData h) => h.colors.overlayInk4),
          (surface: HoronSegmentedControlSurface.subtle, color: (HoronThemeData h) => h.colors.bgSubtle),
        ]) {
      await pumpControl(tester, surface: row.surface, value: 'a');
      final AnimatedContainer track = tester.widget<AnimatedContainer>(find.byType(AnimatedContainer).first);
      expect((track.decoration! as BoxDecoration).color, row.color(themeOf(tester)), reason: '${row.surface}');
    }
  });

  testWidgets('the glass pill takes the Paper fill of each brightness', (WidgetTester tester) async {
    // Paper U4K-1의 선택 채움이 라이트 #FFFFFFCC(glass-thick), 다크 보드 CEV-0이 #FFFFFF1A입니다.
    for (final ({Brightness brightness, Color Function(HoronThemeData) fill}) row
        in <({Brightness brightness, Color Function(HoronThemeData) fill})>[
          (brightness: Brightness.light, fill: (HoronThemeData h) => h.colors.glassThick),
          (brightness: Brightness.dark, fill: (HoronThemeData h) => h.colors.overlayInk10),
        ]) {
      await pumpControl(tester, brightness: row.brightness, value: 'a');
      // `MaterialApp`은 테마 변경을 200ms 동안 이어 그리므로 밝기가 자리를 잡을 때까지 기다립니다.
      await tester.pumpAndSettle();
      final Finder pill = find.byWidgetPredicate(
        (Widget widget) => widget is HoronLiquidGlass && widget.tier == HoronGlassTier.clear,
      );
      expect(pill, findsOneWidget, reason: '${row.brightness}');

      final AnimatedContainer fill = tester.widget<AnimatedContainer>(
        find.descendant(of: pill, matching: find.byType(AnimatedContainer)),
      );
      expect((fill.decoration! as BoxDecoration).color, row.fill(themeOf(tester)), reason: '${row.brightness}');

      // Paper U4K-1·CEV-0의 1px 림입니다.
      final DecoratedBox rim = tester.widget<DecoratedBox>(
        find.ancestor(of: pill, matching: find.byType(DecoratedBox)).first,
      );
      expect((rim.decoration as BoxDecoration).border!.top.color, themeOf(tester).colors.glassRimStrong);
    }
  });

  testWidgets('the chosen segment takes the primary text colour', (WidgetTester tester) async {
    await pumpControl(tester, value: 'b');
    expect(tester.widget<Text>(find.text('B')).style!.color, themeOf(tester).colors.textPrimary);
    expect(tester.widget<Text>(find.text('A')).style!.color, themeOf(tester).colors.textSecondary);
  });

  testWidgets('tapping reports the value and a controlled control does not move', (WidgetTester tester) async {
    final List<String> seen = <String>[];
    await pumpControl(tester, value: 'a', onValueChange: seen.add);
    await tester.tap(find.text('B'));
    await tester.pumpAndSettle();
    expect(seen, <String>['b']);
    expect(tester.widget<Text>(find.text('A')).style!.color, themeOf(tester).colors.textPrimary);

    await pumpControl(tester, onValueChange: seen.add);
    await tester.tap(find.text('B'));
    await tester.pumpAndSettle();
    expect(tester.widget<Text>(find.text('B')).style!.color, themeOf(tester).colors.textPrimary);
  });

  testWidgets('a disabled segment ignores taps and is held at 40% opacity', (WidgetTester tester) async {
    final List<String> seen = <String>[];
    await pumpControl(tester, onValueChange: seen.add);
    await tester.tap(find.text('C'));
    await tester.pumpAndSettle();
    expect(seen, isEmpty);
    final Opacity dim = tester.widget<Opacity>(find.ancestor(of: find.text('C'), matching: find.byType(Opacity)).first);
    expect(dim.opacity, 0.4);
  });

  testWidgets('fill shares the width, no fill hugs the labels', (WidgetTester tester) async {
    await pumpControl(tester, value: 'a');
    final double filled = segmentWidth(tester, 'A');

    await pumpControl(tester, value: 'a', size: HoronSegmentedControlSize.sm, fill: false);
    final double hugged = segmentWidth(tester, 'A');

    expect(filled, greaterThan(hugged * 3), reason: 'md fills the 400px track, sm hugs its label');
  });

  testWidgets('at 320 wide three segments still fit', (WidgetTester tester) async {
    await pumpControl(tester, value: 'a', width: 320);
    expect(tester.takeException(), isNull);
    expect(tester.getSize(find.byType(HoronSegmentedControl)).width, 320);
  });
}
