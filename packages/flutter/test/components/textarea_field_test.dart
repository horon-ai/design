import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:horon_ui/horon_ui.dart';

/// `HoronTextareaField`의 라벨 줄·상자·푸터·글자 수·반응형 폭을 검사합니다.
void main() {
  Future<void> pumpField(
    WidgetTester tester, {
    Brightness brightness = Brightness.light,
    String? description,
    String? error,
    int? maxLength,
    bool disabled = false,
    double width = 800,
  }) async {
    await tester.pumpWidget(
      MaterialApp(
        theme: horonTheme(brightness),
        home: Scaffold(
          body: Center(
            child: SizedBox(
              width: width,
              child: Center(
                child: HoronTextareaField(
                  label: '메모',
                  hint: 'Optional',
                  description: description,
                  error: error,
                  maxLength: maxLength,
                  disabled: disabled,
                ),
              ),
            ),
          ),
        ),
      ),
    );
    await tester.pump();
  }

  HoronThemeData themeOf(WidgetTester tester) => HoronTheme.of(tester.element(find.byType(HoronTextareaField)));

  Color borderOf(WidgetTester tester) {
    final DecoratedBox box = tester
        .widgetList<DecoratedBox>(find.descendant(of: find.byType(HoronFieldBox), matching: find.byType(DecoratedBox)))
        .firstWhere((DecoratedBox box) => box.position == DecorationPosition.foreground);
    return (box.decoration as BoxDecoration).border!.top.color;
  }

  testWidgets('renders in light and dark without an exception', (WidgetTester tester) async {
    for (final Brightness brightness in Brightness.values) {
      await pumpField(tester, brightness: brightness, description: 'help', maxLength: 20);
      expect(tester.takeException(), isNull, reason: 'brightness $brightness');
    }
  });

  testWidgets('label row, 120px box and footer are all present', (WidgetTester tester) async {
    await pumpField(tester, description: 'help', maxLength: 20);
    expect(find.text('메모'), findsOneWidget);
    expect(find.text('Optional'), findsOneWidget);
    expect(find.text('help'), findsOneWidget);
    expect(tester.getSize(find.byType(HoronFieldBox)).height, 120);
  });

  testWidgets('the counter follows the field text', (WidgetTester tester) async {
    await pumpField(tester, maxLength: 20);
    expect(find.text('0 / 20'), findsOneWidget);
    await tester.enterText(find.byType(TextField), '다섯글자임');
    await tester.pump();
    expect(find.text('5 / 20'), findsOneWidget);
  });

  testWidgets('an error replaces the description and reddens box and footer', (WidgetTester tester) async {
    await pumpField(tester, description: 'help', error: '필수입니다');
    expect(find.text('help'), findsNothing);
    expect(find.text('필수입니다'), findsOneWidget);
    expect(tester.widget<Text>(find.text('필수입니다')).style!.color, themeOf(tester).colors.textDanger);
    expect(borderOf(tester), themeOf(tester).colors.borderDanger);
  });

  testWidgets('disabled dims the whole field to 60%', (WidgetTester tester) async {
    await pumpField(tester, disabled: true);
    final Opacity dim = tester.widget<Opacity>(
      find.ancestor(of: find.byType(HoronFieldBox), matching: find.byType(Opacity)).first,
    );
    expect(dim.opacity, 0.6);
  });

  testWidgets('w-90 caps at 360 and shrinks on a narrow screen', (WidgetTester tester) async {
    await pumpField(tester, width: 800);
    expect(tester.getSize(find.byType(HoronTextareaField)).width, 360);

    await pumpField(tester, width: 280);
    expect(tester.getSize(find.byType(HoronTextareaField)).width, 280);
    expect(tester.takeException(), isNull);
  });
}
