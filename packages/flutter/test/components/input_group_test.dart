import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:horon_ui/horon_ui.dart';

/// `HoronInputGroup`의 칸·구분선·상태·반응형 계약을 검사합니다.
void main() {
  Future<void> pumpGroup(
    WidgetTester tester, {
    Brightness brightness = Brightness.light,
    HoronInputSurface surface = HoronInputSurface.glass,
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
                surface: surface,
                prefix: prefix ? const HoronInputGroupSegment(child: Text('+82')) : null,
                suffix: suffix ? const HoronInputGroupSegment(child: Icon(Icons.attach_money)) : null,
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

  /// 상자의 veil 표면입니다. glass는 [HoronVeil] 한 겹입니다.
  HoronVeil veilOf(WidgetTester tester) =>
      tester.widget<HoronVeil>(find.descendant(of: find.byType(HoronFieldBox), matching: find.byType(HoronVeil)));

  void expectVeilSurface(WidgetTester tester) {
    expect(find.byType(HoronLiquidGlass), findsNothing, reason: 'glass는 LiquidGlass를 겹치지 않습니다');
    expect(veilOf(tester).kind, HoronVeilKind.field, reason: '.veil-field');
    expect(
      find.descendant(of: find.byType(HoronFieldBox), matching: find.byType(AnimatedContainer)),
      findsNothing,
      reason: 'veil 상자는 토큰 색 채움을 그리지 않습니다',
    );
  }

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

  testWidgets('the 40px group paints the veil field', (WidgetTester tester) async {
    await pumpGroup(tester, prefix: true, suffix: true);
    expect(tester.getSize(find.byType(HoronFieldBox)).height, 40);
    expectVeilSurface(tester);
  });

  testWidgets('the input takes the 12/14/20 padding of a standalone field', (WidgetTester tester) async {
    for (final ({HoronInputGroupSize size, double padding}) row in <({HoronInputGroupSize size, double padding})>[
      (size: HoronInputGroupSize.sm, padding: HoronThemeData.light.space.s3),
      (size: HoronInputGroupSize.md, padding: HoronThemeData.light.space.s3_5),
      (size: HoronInputGroupSize.lg, padding: HoronThemeData.light.space.s5),
    ]) {
      await tester.pumpWidget(
        MaterialApp(
          theme: horonTheme(Brightness.light),
          home: Scaffold(
            body: Center(
              child: SizedBox(
                width: 320,
                child: HoronInputGroup(size: row.size, hintText: 'Hint'),
              ),
            ),
          ),
        ),
      );
      await tester.pump();
      final Padding pad = tester.widget<Padding>(
        find.ancestor(of: find.byType(TextField), matching: find.byType(Padding)).first,
      );
      expect(pad.padding, EdgeInsets.symmetric(horizontal: row.padding), reason: '${row.size}');
    }
  });

  testWidgets('segment sits on overlay-ink-4 with a 16px icon and body-md text', (WidgetTester tester) async {
    await pumpGroup(tester, prefix: true, suffix: true);
    final HoronThemeData horon = themeOf(tester);
    final ColoredBox segment = tester.widget<ColoredBox>(
      find.ancestor(of: find.byIcon(Icons.attach_money), matching: find.byType(ColoredBox)).first,
    );
    expect(segment.color, horon.colors.overlayInk4);
    expect(IconTheme.of(tester.element(find.byIcon(Icons.attach_money))).size, 16, reason: '[&_svg]:size-4');
    final DefaultTextStyle text = tester.widget<DefaultTextStyle>(
      find.ancestor(of: find.text('+82'), matching: find.byType(DefaultTextStyle)).first,
    );
    expect(text.style.fontSize, horon.text.bodyMd.fontSize, reason: 'md 칸은 text-body-md');
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
