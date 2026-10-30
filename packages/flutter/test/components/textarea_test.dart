import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:horon_ui/horon_ui.dart';

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

  /// 상자의 채움이 글래스 엔진 한 겹인지 확인합니다.
  ///
  /// React `textarea.tsx:26`은 `fieldBoxClass.glass` 위에 `<LiquidGlass tier="regular" />`를
  /// 얹습니다. Flutter는 그 자리를 [HoronFieldBox]가 맡으므로, 토큰 색으로 채우는
  /// [AnimatedContainer]가 상자 안에 있으면 유리 표면이 사라진 것입니다.
  void expectGlassSurface(WidgetTester tester) {
    expect(find.byType(HoronLiquidGlass), findsOneWidget, reason: '유리 레이어는 한 겹입니다');
    expect(tester.widget<HoronLiquidGlass>(find.byType(HoronLiquidGlass)).tier, HoronGlassTier.regular);
    expect(
      find.descendant(of: find.byType(HoronFieldBox), matching: find.byType(AnimatedContainer)),
      findsNothing,
      reason: '유리 상자는 토큰 색 채움을 그리지 않습니다',
    );
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
    expectGlassSurface(tester);
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
