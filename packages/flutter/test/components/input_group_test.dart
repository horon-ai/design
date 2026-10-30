import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:horon_ui/horon_ui.dart';

/// `HoronInputGroup`의 칸·구분선·상태·반응형 계약을 검사합니다.
void main() {
  Future<void> pumpGroup(
    WidgetTester tester, {
    Brightness brightness = Brightness.light,
    bool prefix = false,
    bool suffix = false,
    bool invalid = false,
    bool disabled = false,
    double width = 320,
    ValueChanged<String>? onChanged,
  }) async {
    await tester.pumpWidget(
      MaterialApp(
        theme: horonTheme(brightness),
        home: Scaffold(
          body: Center(
            child: SizedBox(
              width: width,
              child: HoronInputGroup(
                prefix: prefix ? const Text('+82') : null,
                suffix: suffix ? const Icon(Icons.attach_money) : null,
                invalid: invalid,
                disabled: disabled,
                hintText: 'Hint',
                onChanged: onChanged,
              ),
            ),
          ),
        ),
      ),
    );
    await tester.pump();
  }

  HoronThemeData themeOf(WidgetTester tester) => HoronTheme.of(tester.element(find.byType(HoronInputGroup)));

  Iterable<ColoredBox> dividerBoxes(WidgetTester tester) => tester.widgetList<ColoredBox>(
    find.descendant(
      of: find.byWidgetPredicate((Widget widget) => widget is SizedBox && widget.width == 1),
      matching: find.byType(ColoredBox),
    ),
  );

  testWidgets('renders in light and dark without an exception', (WidgetTester tester) async {
    for (final Brightness brightness in Brightness.values) {
      await pumpGroup(tester, brightness: brightness, prefix: true, suffix: true);
      expect(tester.takeException(), isNull, reason: 'brightness $brightness');
    }
  });

  testWidgets('is 40 tall and splits into segments with 1px dividers', (WidgetTester tester) async {
    await pumpGroup(tester, prefix: true, suffix: true);
    expect(tester.getSize(find.byType(HoronInputGroup)).height, 40);
    expect(find.text('+82'), findsOneWidget);
    expect(find.byIcon(Icons.attach_money), findsOneWidget);
    expect(dividerBoxes(tester).length, 2);
  });

  testWidgets('segment sits on overlay-ink-4 with a 14px icon', (WidgetTester tester) async {
    await pumpGroup(tester, suffix: true);
    final HoronThemeData horon = themeOf(tester);
    final ColoredBox segment = tester.widget<ColoredBox>(
      find.ancestor(of: find.byIcon(Icons.attach_money), matching: find.byType(ColoredBox)).first,
    );
    expect(segment.color, horon.colors.overlayInk4);
    expect(IconTheme.of(tester.element(find.byIcon(Icons.attach_money))).size, 14);
  });

  testWidgets('dividers go strong on hover and danger on invalid', (WidgetTester tester) async {
    await pumpGroup(tester, prefix: true);
    expect(dividerBoxes(tester).map((ColoredBox box) => box.color), <Color>[themeOf(tester).colors.borderDefault]);

    await pumpGroup(tester, prefix: true, invalid: true);
    expect(dividerBoxes(tester).map((ColoredBox box) => box.color), <Color>[themeOf(tester).colors.borderDanger]);
  });

  testWidgets('typing reaches onChanged and disabled turns the field off', (WidgetTester tester) async {
    final List<String> seen = <String>[];
    await pumpGroup(tester, onChanged: seen.add);
    await tester.enterText(find.byType(TextField), '1010');
    expect(seen, <String>['1010']);

    await pumpGroup(tester, disabled: true, onChanged: seen.add);
    expect(tester.widget<TextField>(find.byType(TextField)).enabled, isFalse);
  });

  testWidgets('a prefix and suffix both fit at 320 wide', (WidgetTester tester) async {
    await pumpGroup(tester, prefix: true, suffix: true, width: 320);
    expect(tester.takeException(), isNull);
    expect(tester.getSize(find.byType(HoronInputGroup)).width, 320);
  });
}
