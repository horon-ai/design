import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:horon_ui/horon_ui.dart';

/// `input-group`의 addon 자리·상태·한 테두리 묶음을 확인합니다.
void main() {
  Future<void> pumpGroup(WidgetTester tester, Widget child, {Brightness brightness = Brightness.light}) {
    return tester.pumpWidget(
      MaterialApp(
        theme: horonTheme(brightness),
        home: Scaffold(
          body: Center(child: SizedBox(width: 320, child: child)),
        ),
      ),
    );
  }

  /// 묶음이 그린 테두리 색입니다.
  Color borderColorOf(WidgetTester tester) {
    final DecoratedBox box = tester.widget<DecoratedBox>(
      find.descendant(of: find.byType(HoronInputGroup), matching: find.byType(DecoratedBox)).first,
    );
    return (box.decoration as BoxDecoration).border!.top.color;
  }

  /// React `border-destructive`(다크는 `/50`)입니다.
  Color invalidBorderOf(ColorScheme scheme, Brightness brightness) =>
      brightness == Brightness.dark ? scheme.error.withValues(alpha: 0.5) : scheme.error;

  for (final Brightness brightness in Brightness.values) {
    final String name = brightness == Brightness.light ? '라이트' : '다크';

    testWidgets('$name: addon과 입력을 한 테두리로 묶는다', (WidgetTester tester) async {
      final List<String> changes = <String>[];
      await pumpGroup(
        tester,
        HoronInputGroup(
          children: <Widget>[
            const HoronInputGroupAddon(child: Icon(Icons.alternate_email)),
            HoronInputGroupInput(hintText: 'name@horon.ai', onChanged: changes.add),
            const HoronInputGroupAddon(align: HoronInputGroupAddonAlign.inlineEnd, child: Text('.ai')),
          ],
        ),
        brightness: brightness,
      );

      expect(find.byType(TextField), findsOneWidget);
      expect(tester.getSize(find.byType(HoronInputGroup)).height, 37);

      await tester.enterText(find.byType(TextField), 'minyeol');
      await tester.pump();
      expect(changes, <String>['minyeol']);
    });

    testWidgets('$name: align이 addon의 자리를 정한다', (WidgetTester tester) async {
      await pumpGroup(
        tester,
        const HoronInputGroup(
          children: <Widget>[
            HoronInputGroupAddon(align: HoronInputGroupAddonAlign.inlineEnd, child: Text('끝')),
            HoronInputGroupInput(hintText: '값'),
            HoronInputGroupAddon(child: Text('처음')),
          ],
        ),
        brightness: brightness,
      );

      final double startX = tester.getTopLeft(find.text('처음')).dx;
      final double fieldX = tester.getTopLeft(find.byType(TextField)).dx;
      final double endX = tester.getTopLeft(find.text('끝')).dx;

      expect(startX, lessThan(fieldX));
      expect(fieldX, lessThan(endX));
    });

    testWidgets('$name: 오류 상태면 묶음 테두리가 destructive 색이다', (WidgetTester tester) async {
      await pumpGroup(
        tester,
        const HoronInputGroup(invalid: true, children: <Widget>[HoronInputGroupInput(hintText: '값')]),
        brightness: brightness,
      );

      final ColorScheme scheme = Theme.of(tester.element(find.byType(HoronInputGroup))).colorScheme;
      expect(borderColorOf(tester), invalidBorderOf(scheme, brightness));
    });

    testWidgets('$name: 비활성 묶음은 입력도 버튼도 받지 않는다', (WidgetTester tester) async {
      int presses = 0;
      await pumpGroup(
        tester,
        HoronInputGroup(
          disabled: true,
          children: <Widget>[
            const HoronInputGroupInput(hintText: '값'),
            HoronInputGroupButton(onPressed: () => presses++, child: const Icon(Icons.clear)),
          ],
        ),
        brightness: brightness,
      );

      expect(tester.widget<TextField>(find.byType(TextField)).enabled, isFalse);

      await tester.tap(find.byIcon(Icons.clear));
      await tester.pump();

      expect(presses, 0);
      final Opacity opacity = tester.widget<Opacity>(
        find.descendant(of: find.byType(HoronInputGroup), matching: find.byType(Opacity)).first,
      );
      expect(opacity.opacity, 0.5);
    });
  }

  test('addon 정렬 enum 값이 React의 cva 키와 같다', () {
    expect(HoronInputGroupAddonAlign.values.map((HoronInputGroupAddonAlign value) => value.name).toList(), <String>[
      'inlineStart',
      'inlineEnd',
    ]);
  });

  testWidgets('버튼은 tooltip과 콜백을 받는다', (WidgetTester tester) async {
    int presses = 0;
    await pumpGroup(
      tester,
      HoronInputGroup(
        children: <Widget>[
          const HoronInputGroupInput(hintText: '검색'),
          HoronInputGroupButton(
            tooltip: '지우기',
            semanticsLabel: '지우기',
            onPressed: () => presses++,
            child: const Icon(Icons.clear),
          ),
        ],
      ),
    );

    await tester.tap(find.byIcon(Icons.clear));
    await tester.pump();

    expect(presses, 1);
  });
}
