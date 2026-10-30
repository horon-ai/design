import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:horon_ui/horon_ui.dart';

/// `HoronSelect`의 트리거·목록·선택·칩·상태를 검사합니다.
void main() {
  const List<HoronSelectItem> items = <HoronSelectItem>[
    HoronSelectItem(value: 'alpha', label: 'Alpha'),
    HoronSelectItem(value: 'beta', label: 'Beta'),
    HoronSelectItem(value: 'gamma', label: 'Gamma', disabled: true),
  ];

  Future<void> pumpSelect(
    WidgetTester tester, {
    Brightness brightness = Brightness.light,
    HoronInputSurface surface = HoronInputSurface.glass,
    bool invalid = false,
    bool chip = false,
    bool showIndicator = true,
    bool disabled = false,
    String? value,
    ValueChanged<String>? onChanged,
    double width = 320,
  }) async {
    await tester.pumpWidget(
      MaterialApp(
        theme: horonTheme(brightness),
        home: Scaffold(
          body: Center(
            child: SizedBox(
              width: width,
              child: Align(
                alignment: Alignment.topLeft,
                child: HoronSelect(
                  items: items,
                  value: value,
                  surface: surface,
                  invalid: invalid,
                  chip: chip,
                  showIndicator: showIndicator,
                  disabled: disabled,
                  onChanged: onChanged,
                ),
              ),
            ),
          ),
        ),
      ),
    );
    await tester.pump();
  }

  HoronThemeData themeOf(WidgetTester tester) => HoronTheme.of(tester.element(find.byType(HoronSelect)));

  Color borderOf(WidgetTester tester) {
    final DecoratedBox box = tester
        .widgetList<DecoratedBox>(find.descendant(of: find.byType(HoronFieldBox), matching: find.byType(DecoratedBox)))
        .firstWhere((DecoratedBox box) => box.position == DecorationPosition.foreground);
    return (box.decoration as BoxDecoration).border!.top.color;
  }

  Future<void> open(WidgetTester tester) async {
    await tester.tap(find.byType(HoronSelect));
    await tester.pump();
    await tester.pump();
  }

  testWidgets('renders in light and dark without an exception', (WidgetTester tester) async {
    for (final Brightness brightness in Brightness.values) {
      await pumpSelect(tester, brightness: brightness);
      expect(tester.takeException(), isNull, reason: 'brightness $brightness');
    }
  });

  testWidgets('the field trigger is 40 tall and shows the placeholder until chosen', (WidgetTester tester) async {
    await pumpSelect(tester);
    expect(tester.getSize(find.byType(HoronFieldBox)).height, 40);
    expect(find.text('Select'), findsOneWidget);
    expect(tester.widget<HoronLiquidGlass>(find.byType(HoronLiquidGlass)).tier, HoronGlassTier.regular);
    expect(borderOf(tester), Colors.transparent);
  });

  testWidgets('tapping opens the list, choosing reports the value and closes it', (WidgetTester tester) async {
    final List<String> seen = <String>[];
    await pumpSelect(tester, onChanged: seen.add);
    expect(find.text('Alpha'), findsNothing);

    await open(tester);
    expect(find.text('Alpha'), findsOneWidget);
    expect(find.text('Gamma'), findsOneWidget);
    expect(tester.widget<AnimatedRotation>(find.byType(AnimatedRotation)).turns, 0.5);

    await tester.tap(find.text('Beta'));
    await tester.pumpAndSettle();
    expect(seen, <String>['beta']);
    expect(find.text('Beta'), findsOneWidget, reason: 'the trigger keeps the chosen label');
    expect(find.text('Alpha'), findsNothing, reason: 'the popup closed');
    expect(tester.widget<AnimatedRotation>(find.byType(AnimatedRotation)).turns, 0);
  });

  testWidgets('the chosen row is 6% ink with an 18px check', (WidgetTester tester) async {
    await pumpSelect(tester, value: 'alpha');
    await open(tester);
    final AnimatedContainer row = tester.widget<AnimatedContainer>(
      find.ancestor(of: find.byIcon(Icons.check), matching: find.byType(AnimatedContainer)).first,
    );
    expect((row.decoration! as BoxDecoration).color, themeOf(tester).colors.overlayInk6);
    expect(IconTheme.of(tester.element(find.byIcon(Icons.check))).size, 18);
    expect(tester.getSize(find.byType(AnimatedContainer).first).height, 40);
  });

  testWidgets('disabled rows ignore taps', (WidgetTester tester) async {
    final List<String> seen = <String>[];
    await pumpSelect(tester, onChanged: seen.add);
    await open(tester);
    await tester.tap(find.text('Gamma'));
    await tester.pumpAndSettle();
    expect(seen, isEmpty);
  });

  testWidgets('solid uses body-lg, glass uses body-md, chip is a 32px subtle pill', (WidgetTester tester) async {
    await pumpSelect(tester);
    expect(tester.widget<Text>(find.text('Select')).style!.fontSize, themeOf(tester).text.bodyMd.fontSize);

    await pumpSelect(tester, surface: HoronInputSurface.solid);
    expect(tester.widget<Text>(find.text('Select')).style!.fontSize, themeOf(tester).text.bodyLg.fontSize);

    await pumpSelect(tester, chip: true);
    expect(tester.getSize(find.byType(HoronSelect)).height, 32);
    expect(find.byType(HoronLiquidGlass), findsNothing);
    final AnimatedContainer pill = tester.widget<AnimatedContainer>(find.byType(AnimatedContainer).first);
    expect((pill.decoration! as BoxDecoration).color, themeOf(tester).colors.bgSubtle);
    expect(tester.widget<Text>(find.text('Select')).style!.fontSize, 13);
  });

  testWidgets('invalid reddens the border and a disabled trigger cannot open', (WidgetTester tester) async {
    await pumpSelect(tester, invalid: true);
    expect(borderOf(tester), themeOf(tester).colors.borderDanger);

    await pumpSelect(tester, disabled: true);
    await open(tester);
    expect(find.text('Alpha'), findsNothing);
  });

  testWidgets('showIndicator false drops the caret', (WidgetTester tester) async {
    await pumpSelect(tester, showIndicator: false);
    expect(find.byIcon(Icons.keyboard_arrow_down), findsNothing);
  });

  testWidgets('at 320 wide the popup still fits the trigger width', (WidgetTester tester) async {
    await pumpSelect(tester, width: 320);
    await open(tester);
    expect(tester.takeException(), isNull);
    expect(tester.getSize(find.text('Alpha')).width, lessThanOrEqualTo(320));
  });
}
