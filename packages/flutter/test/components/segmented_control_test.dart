import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:horon_ui/src/components/segmented_control.dart';
import 'package:horon_ui/src/glass/glass_geometry.dart';
import 'package:horon_ui/src/glass/horon_glass.dart';
import 'package:horon_ui/src/theme/horon_theme.dart';

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
