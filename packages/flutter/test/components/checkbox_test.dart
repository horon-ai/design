import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:horon_ui/horon_ui.dart';

Widget _host(Widget child, {Brightness brightness = Brightness.light}) => MaterialApp(
  theme: horonTheme(brightness),
  home: Scaffold(body: Center(child: child)),
);

HoronThemeData _theme(WidgetTester tester) => HoronTheme.of(tester.element(find.byType(HoronCheckbox)));

Finder _box() => find.descendant(of: find.byType(HoronCheckbox), matching: find.byType(AnimatedContainer));

AnimatedContainer _container(WidgetTester tester) => tester.widget<AnimatedContainer>(_box());

BoxDecoration _decoration(WidgetTester tester) => _container(tester).decoration! as BoxDecoration;

void main() {
  testWidgets('default state renders in light and dark', (WidgetTester tester) async {
    for (final Brightness brightness in Brightness.values) {
      await tester.pumpWidget(
        _host(
          HoronCheckbox(value: false, label: '동의', onChanged: (_) {}),
          brightness: brightness,
        ),
      );
      expect(tester.takeException(), isNull);
    }
  });

  testWidgets('an unchecked box is the React 20px surface box with a 1.5px border', (WidgetTester tester) async {
    await tester.pumpWidget(_host(HoronCheckbox(value: false, onChanged: (_) {})));
    final HoronThemeData theme = _theme(tester);

    expect(tester.getSize(_box()), const Size(20, 20), reason: 'size-5');
    expect(_decoration(tester).color, theme.colors.bgSurface, reason: 'bg-bg-surface');
    expect(_decoration(tester).border!.top.color, theme.colors.borderStrong, reason: 'border-border-strong');
    expect(_decoration(tester).border!.top.width, 1.5, reason: 'border-[1.5px]');
    expect((_decoration(tester).borderRadius! as BorderRadius).topLeft.x, theme.radius.xs, reason: 'rounded-xs');
    expect(find.byIcon(Icons.check), findsNothing);
  });

  testWidgets('the sm size is the 18px data-table box with a 5px radius', (WidgetTester tester) async {
    await tester.pumpWidget(_host(HoronCheckbox(value: false, small: true, onChanged: (_) {})));
    expect(tester.getSize(_box()), const Size(18, 18), reason: 'size-4.5');
    expect((_decoration(tester).borderRadius! as BorderRadius).topLeft.x, 5, reason: 'rounded-[5px]');
  });

  testWidgets('checked and indeterminate fill with ink and draw a 14px indicator', (WidgetTester tester) async {
    final HoronColors colors = HoronThemeData.light.colors;

    await tester.pumpWidget(_host(HoronCheckbox(value: true, onChanged: (_) {})));
    await tester.pumpAndSettle();
    expect(_decoration(tester).color, colors.interactivePrimary, reason: 'data-checked:bg-interactive-primary');
    expect(_decoration(tester).border!.top.width, 0, reason: 'data-checked:border-0');
    final Icon check = tester.widget<Icon>(find.byIcon(Icons.check));
    expect(check.size, 14, reason: '[&_svg]:size-3.5');
    expect(check.color, colors.interactiveOnPrimary, reason: 'text-interactive-on-primary');

    await tester.pumpWidget(_host(HoronCheckbox(value: null, onChanged: (_) {})));
    await tester.pumpAndSettle();
    expect(_decoration(tester).color, colors.interactivePrimary, reason: 'data-indeterminate:bg-interactive-primary');
    expect(find.byIcon(Icons.remove), findsOneWidget, reason: '부분 선택은 빼기 표시입니다');
    expect(find.byIcon(Icons.check), findsNothing);
  });

  testWidgets('tapping cycles false to true to false, and indeterminate to true', (WidgetTester tester) async {
    final List<bool?> changes = <bool?>[];

    await tester.pumpWidget(_host(HoronCheckbox(value: false, onChanged: changes.add)));
    await tester.tap(find.byType(HoronCheckbox));
    await tester.pumpAndSettle();

    await tester.pumpWidget(_host(HoronCheckbox(value: true, onChanged: changes.add)));
    await tester.tap(find.byType(HoronCheckbox));
    await tester.pumpAndSettle();

    await tester.pumpWidget(_host(HoronCheckbox(value: null, onChanged: changes.add)));
    await tester.tap(find.byType(HoronCheckbox));
    await tester.pumpAndSettle();

    expect(changes, <bool?>[true, false, true], reason: '꺼짐→켜짐, 켜짐→꺼짐, 부분 선택→켜짐');
  });

  testWidgets('the label sits 10px from the box and the whole row toggles', (WidgetTester tester) async {
    int toggles = 0;
    await tester.pumpWidget(_host(HoronCheckbox(value: false, label: '이용 약관에 동의합니다', onChanged: (_) => toggles += 1)));
    final Row row = tester.widget<Row>(find.descendant(of: find.byType(HoronCheckbox), matching: find.byType(Row)));
    expect(row.spacing, HoronThemeData.light.space.s2_5, reason: 'gap-2.5');

    await tester.tap(find.text('이용 약관에 동의합니다'));
    await tester.pumpAndSettle();
    expect(toggles, 1, reason: 'label도 같은 상자를 누릅니다');
  });

  testWidgets('a disabled checkbox dims the row and does not change', (WidgetTester tester) async {
    int toggles = 0;
    await tester.pumpWidget(
      _host(HoronCheckbox(value: false, label: '동의', enabled: false, onChanged: (_) => toggles += 1)),
    );
    await tester.tap(find.byType(HoronCheckbox));
    await tester.pumpAndSettle();

    expect(toggles, 0);
    expect(
      tester.widget<Opacity>(find.descendant(of: find.byType(HoronCheckbox), matching: find.byType(Opacity))).opacity,
      0.4,
      reason: 'has-[[data-disabled]]:opacity-40',
    );
  });
}
