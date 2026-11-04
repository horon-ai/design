import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:horon_ui/horon_ui.dart';

/// `HoronTextareaField`의 라벨 줄·상자·푸터·글자 수·반응형 폭을 검사합니다.
void main() {
  Future<void> pumpField(
    WidgetTester tester, {
    Brightness brightness = Brightness.light,
    HoronInputSurface surface = HoronInputSurface.glass,
    HoronTextareaFieldSize size = HoronTextareaFieldSize.md,
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
                  surface: surface,
                  size: size,
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
      await pumpField(tester, brightness: brightness, description: 'help', maxLength: 20);
      expect(tester.takeException(), isNull, reason: 'brightness $brightness');
    }
  });

  testWidgets('label row, 112px box and footer are all present', (WidgetTester tester) async {
    await pumpField(tester, description: 'help', maxLength: 20);
    expect(find.text('메모'), findsOneWidget);
    expect(find.text('Optional'), findsOneWidget);
    expect(find.text('help'), findsOneWidget);
    expect(tester.getSize(find.byType(HoronFieldBox)).height, 112);
  });

  testWidgets('the 112 box paints the veil field', (WidgetTester tester) async {
    await pumpField(tester);
    expect(tester.getSize(find.byType(HoronFieldBox)).height, 112);
    expectVeilSurface(tester);
  });

  testWidgets('each size keeps the Textarea box heights and 12/14/20 padding', (WidgetTester tester) async {
    for (final ({HoronTextareaFieldSize size, double height, double padding}) row
        in <({HoronTextareaFieldSize size, double height, double padding})>[
          (size: HoronTextareaFieldSize.sm, height: 88, padding: HoronThemeData.light.space.s3),
          (size: HoronTextareaFieldSize.md, height: 112, padding: HoronThemeData.light.space.s3_5),
          (size: HoronTextareaFieldSize.lg, height: 136, padding: HoronThemeData.light.space.s5),
        ]) {
      await pumpField(tester, size: row.size);
      expect(tester.getSize(find.byType(HoronFieldBox)).height, row.height, reason: '${row.size} 높이');
      final Padding pad = tester.widget<Padding>(
        find.ancestor(of: find.byType(TextField), matching: find.byType(Padding)).first,
      );
      expect((pad.padding as EdgeInsets).left, row.padding, reason: '${row.size} 좌우 여백');
    }
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
    expect(veilOf(tester).invalid, isTrue);
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
