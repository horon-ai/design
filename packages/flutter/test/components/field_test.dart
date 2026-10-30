import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:horon_ui/horon_ui.dart';

/// `HoronField` 묶음의 간격·색·비활성 문맥·오류 진입 애니메이션을 검사합니다.
void main() {
  Future<void> pumpField(
    WidgetTester tester, {
    Brightness brightness = Brightness.light,
    bool disabled = false,
    bool withError = false,
  }) async {
    await tester.pumpWidget(
      MaterialApp(
        theme: horonTheme(brightness),
        home: Scaffold(
          body: Center(
            child: SizedBox(
              width: 320,
              child: HoronField(
                disabled: disabled,
                children: <Widget>[
                  const HoronFieldLabel('이름'),
                  const HoronFieldDescription('도움말'),
                  if (withError) const HoronFieldError('값이 필요합니다'),
                ],
              ),
            ),
          ),
        ),
      ),
    );
    await tester.pump();
  }

  HoronThemeData themeOf(WidgetTester tester) => HoronTheme.of(tester.element(find.byType(HoronField)));

  Color textColorOf(WidgetTester tester, String text) => tester.widget<Text>(find.text(text)).style!.color!;

  testWidgets('renders in light and dark without an exception', (WidgetTester tester) async {
    for (final Brightness brightness in Brightness.values) {
      await pumpField(tester, brightness: brightness);
      expect(tester.takeException(), isNull, reason: 'brightness $brightness');
    }
  });

  testWidgets('stacks its children 8px apart', (WidgetTester tester) async {
    await pumpField(tester);
    final Column column = tester.widget<Column>(
      find.descendant(of: find.byType(HoronField), matching: find.byType(Column)).first,
    );
    expect(column.spacing, themeOf(tester).space.s2);
    expect(column.crossAxisAlignment, CrossAxisAlignment.start);
  });

  testWidgets('label, description and error take their token colours', (WidgetTester tester) async {
    await pumpField(tester, withError: true);
    final HoronThemeData horon = themeOf(tester);
    expect(textColorOf(tester, '이름'), horon.colors.textPrimary);
    expect(textColorOf(tester, '도움말'), horon.colors.textSecondary);
    expect(textColorOf(tester, '값이 필요합니다'), horon.colors.textDanger);
    expect(tester.widget<Text>(find.text('도움말')).style!.fontSize, horon.text.caption.fontSize);
  });

  testWidgets('a disabled field greys the label', (WidgetTester tester) async {
    await pumpField(tester, disabled: true);
    expect(textColorOf(tester, '이름'), themeOf(tester).colors.textDisabled);
  });

  testWidgets('the error slides in: transparent first, opaque once settled', (WidgetTester tester) async {
    await pumpField(tester, withError: true);
    double opacityOf() {
      final Finder wrapper = find.ancestor(of: find.text('값이 필요합니다'), matching: find.byType(Opacity)).first;
      return tester.widget<Opacity>(wrapper).opacity;
    }

    expect(opacityOf(), 0);
    await tester.pumpAndSettle();
    expect(opacityOf(), 1);
  });

  testWidgets('at 320 wide the label and help text still fit', (WidgetTester tester) async {
    await pumpField(tester, withError: true);
    expect(tester.takeException(), isNull);
    expect(tester.getSize(find.byType(HoronField)).width, 320);
  });
}
