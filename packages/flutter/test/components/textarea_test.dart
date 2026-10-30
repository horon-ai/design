import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:horon_ui/src/components/input.dart';
import 'package:horon_ui/src/components/textarea.dart';
import 'package:horon_ui/src/glass/glass_geometry.dart';
import 'package:horon_ui/src/glass/horon_glass.dart';
import 'package:horon_ui/src/theme/horon_theme.dart';

/// `HoronTextarea`의 표면·높이·상태·성장 계약을 검사합니다.
void main() {
  Future<void> pumpTextarea(
    WidgetTester tester, {
    Brightness brightness = Brightness.light,
    bool invalid = false,
    bool enabled = true,
    ValueChanged<String>? onChanged,
  }) async {
    await tester.pumpWidget(
      MaterialApp(
        theme: horonTheme(brightness),
        home: Scaffold(
          body: Center(
            child: SizedBox(
              width: 320,
              child: HoronTextarea(invalid: invalid, enabled: enabled, onChanged: onChanged),
            ),
          ),
        ),
      ),
    );
    await tester.pump();
  }

  HoronThemeData themeOf(WidgetTester tester) => HoronTheme.of(tester.element(find.byType(HoronTextarea)));

  Color borderOf(WidgetTester tester) {
    final DecoratedBox box = tester
        .widgetList<DecoratedBox>(find.descendant(of: find.byType(HoronFieldBox), matching: find.byType(DecoratedBox)))
        .firstWhere((DecoratedBox box) => box.position == DecorationPosition.foreground);
    return (box.decoration as BoxDecoration).border!.top.color;
  }

  testWidgets('renders in light and dark without an exception', (WidgetTester tester) async {
    for (final Brightness brightness in Brightness.values) {
      await pumpTextarea(tester, brightness: brightness);
      expect(tester.takeException(), isNull, reason: 'brightness $brightness');
    }
  });

  testWidgets('starts at min-h-28 (112) on the regular glass layer', (WidgetTester tester) async {
    await pumpTextarea(tester);
    expect(tester.getSize(find.byType(HoronTextarea)).height, greaterThanOrEqualTo(112));
    expect(tester.widget<HoronLiquidGlass>(find.byType(HoronLiquidGlass)).tier, HoronGlassTier.regular);
    expect(borderOf(tester), Colors.transparent);
  });

  testWidgets('grows past the minimum when the text needs more lines', (WidgetTester tester) async {
    await pumpTextarea(tester);
    final double before = tester.getSize(find.byType(HoronTextarea)).height;
    await tester.enterText(find.byType(TextField), '1\n2\n3\n4\n5\n6\n7\n8');
    await tester.pump();
    expect(tester.getSize(find.byType(HoronTextarea)).height, greaterThan(before));
  });

  testWidgets('invalid turns the border danger', (WidgetTester tester) async {
    await pumpTextarea(tester, invalid: true);
    expect(borderOf(tester), themeOf(tester).colors.borderDanger);
  });

  testWidgets('typing reaches onChanged, disabled refuses it', (WidgetTester tester) async {
    final List<String> seen = <String>[];
    await pumpTextarea(tester, onChanged: seen.add);
    await tester.enterText(find.byType(TextField), 'hello');
    expect(seen, <String>['hello']);

    await pumpTextarea(tester, enabled: false, onChanged: seen.add);
    expect(tester.widget<TextField>(find.byType(TextField)).enabled, isFalse);
  });

  testWidgets('fits a 320 wide column without overflowing', (WidgetTester tester) async {
    await pumpTextarea(tester);
    expect(tester.takeException(), isNull);
    expect(tester.getSize(find.byType(HoronTextarea)).width, 320);
  });
}
