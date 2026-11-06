import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:horon_ui/horon_ui.dart';

/// `HoronTextarea`의 표면·높이·상태·성장 계약을 검사합니다.
void main() {
  Future<void> pumpTextarea(
    WidgetTester tester, {
    Brightness brightness = Brightness.light,
    HoronInputSurface surface = HoronInputSurface.glass,
    HoronTextareaSize size = HoronTextareaSize.md,
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
              child: HoronTextarea(
                surface: surface,
                size: size,
                invalid: invalid,
                enabled: enabled,
                onChanged: onChanged,
              ),
            ),
          ),
        ),
      ),
    );
    await tester.pump();
  }

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
      await pumpTextarea(tester, brightness: brightness);
      expect(tester.takeException(), isNull, reason: 'brightness $brightness');
    }
  });

  testWidgets('starts at min-h-28 (112) on the veil field', (WidgetTester tester) async {
    await pumpTextarea(tester);
    expect(tester.getSize(find.byType(HoronTextarea)).height, greaterThanOrEqualTo(112));
    expectVeilSurface(tester);
  });

  testWidgets('grows past the minimum when the text needs more lines', (WidgetTester tester) async {
    await pumpTextarea(tester);
    final double before = tester.getSize(find.byType(HoronTextarea)).height;
    await tester.enterText(find.byType(TextField), '1\n2\n3\n4\n5\n6\n7\n8');
    await tester.pump();
    expect(tester.getSize(find.byType(HoronTextarea)).height, greaterThan(before));
  });

  testWidgets('each size takes the React 12/14/20 horizontal padding', (WidgetTester tester) async {
    for (final ({HoronTextareaSize size, double padding}) row in <({HoronTextareaSize size, double padding})>[
      (size: HoronTextareaSize.sm, padding: HoronThemeData.light.space.s3),
      (size: HoronTextareaSize.md, padding: HoronThemeData.light.space.s3_5),
      (size: HoronTextareaSize.lg, padding: HoronThemeData.light.space.s5),
    ]) {
      await pumpTextarea(tester, size: row.size);
      final Padding pad = tester.widget<Padding>(
        find.ancestor(of: find.byType(TextField), matching: find.byType(Padding)).first,
      );
      expect((pad.padding as EdgeInsets).left, row.padding, reason: '${row.size} 좌우 여백');
    }
  });

  testWidgets('invalid turns the veil ring danger', (WidgetTester tester) async {
    await pumpTextarea(tester, invalid: true);
    expect(veilOf(tester).invalid, isTrue);
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
