import 'dart:ui' show CheckedState;

import 'package:flutter/material.dart';
import 'package:flutter/semantics.dart';
import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:horon_ui/horon_ui.dart';

Widget _host(Widget child, {Brightness brightness = Brightness.light, double? width}) {
  final Widget sized = width == null ? child : SizedBox(width: width, child: child);
  return MaterialApp(
    theme: horonTheme(brightness),
    home: Scaffold(body: Center(child: sized)),
  );
}

Finder _circle(int index) =>
    find.descendant(of: find.byType(HoronRadio).at(index), matching: find.byType(AnimatedContainer));

BoxDecoration _circleDecoration(WidgetTester tester, int index) =>
    tester.widget<AnimatedContainer>(_circle(index)).decoration! as BoxDecoration;

/// 한 라디오 안의 모든 `Container`가 그리는 크기입니다.
///
/// `AnimatedContainer`도 내부적으로 `Container`를 만들기 때문에 타입만으로는
/// 선택 점을 집을 수 없습니다. 크기로 구분합니다.
List<Size> _containerSizes(WidgetTester tester, int index) => <Size>[
  for (final Element element
      in find.descendant(of: find.byType(HoronRadio).at(index), matching: find.byType(Container)).evaluate())
    (element.renderObject! as RenderBox).size,
];

/// 라디오 하나가 키보드 포커스를 가졌는지 봅니다.
///
/// `HoronRadio`는 포커스 노드를 직접 들고 있으므로 가장 바깥 `Focus`의 노드를
/// 봅니다.
bool _hasFocus(WidgetTester tester, int index) => tester
    .widget<Focus>(find.descendant(of: find.byType(HoronRadio).at(index), matching: find.byType(Focus)).first)
    .focusNode!
    .hasFocus;

Widget _group({required String? value, ValueChanged<String>? onValueChange, bool secondEnabled = true}) {
  return HoronRadioGroup(
    value: value,
    onValueChange: onValueChange,
    children: <Widget>[
      const HoronRadio(value: 'monthly', label: '월간 결제'),
      HoronRadio(value: 'yearly', label: '연간 결제', enabled: secondEnabled),
    ],
  );
}

void main() {
  testWidgets('default state renders in light and dark', (WidgetTester tester) async {
    for (final Brightness brightness in Brightness.values) {
      await tester.pumpWidget(_host(_group(value: null), brightness: brightness));
      expect(tester.takeException(), isNull);
      expect(find.byType(HoronRadio), findsNWidgets(2));
    }
  });

  testWidgets('the group stacks its radios with the React 12px gap', (WidgetTester tester) async {
    await tester.pumpWidget(_host(_group(value: null)));
    final Column column = tester.widget<Column>(
      find.descendant(of: find.byType(HoronRadioGroup), matching: find.byType(Column)),
    );
    expect(column.spacing, HoronThemeData.light.space.s3, reason: 'gap-3');
    expect(column.crossAxisAlignment, CrossAxisAlignment.start);
  });

  testWidgets('the selected radio fills with ink and shows the 8px dot', (WidgetTester tester) async {
    final HoronColors colors = HoronThemeData.light.colors;
    await tester.pumpWidget(_host(_group(value: 'yearly')));
    await tester.pumpAndSettle();

    expect(tester.getSize(_circle(1)), const Size(20, 20), reason: 'size-5');
    expect(
      _circleDecoration(tester, 1).color,
      colors.interactivePrimary,
      reason: 'data-checked:bg-interactive-primary',
    );
    expect(_circleDecoration(tester, 1).border!.top.width, 0, reason: 'data-checked:border-0');
    expect(_containerSizes(tester, 1), contains(const Size(8, 8)), reason: 'size-2 점');

    expect(_circleDecoration(tester, 0).color, colors.bgSurface, reason: 'bg-bg-surface');
    expect(_circleDecoration(tester, 0).border!.top.color, colors.borderStrong, reason: 'border-border-strong');
    expect(_containerSizes(tester, 0), isNot(contains(const Size(8, 8))), reason: '선택되지 않은 라디오에는 점이 없습니다');
  });

  testWidgets('tapping a radio reports its own value to the group', (WidgetTester tester) async {
    final List<String> changes = <String>[];
    await tester.pumpWidget(_host(_group(value: 'monthly', onValueChange: changes.add)));

    await tester.tap(find.text('연간 결제'));
    await tester.pumpAndSettle();
    await tester.tap(find.byType(HoronRadio).at(0));
    await tester.pumpAndSettle();

    expect(changes, <String>['yearly'], reason: '이미 선택된 라디오를 다시 눌러도 콜백을 부르지 않습니다');
  });

  testWidgets('a disabled radio dims and does not report', (WidgetTester tester) async {
    final List<String> changes = <String>[];
    await tester.pumpWidget(_host(_group(value: 'monthly', onValueChange: changes.add, secondEnabled: false)));

    await tester.tap(find.text('연간 결제'));
    await tester.pumpAndSettle();
    expect(changes, isEmpty);
    expect(
      tester
          .widget<Opacity>(find.descendant(of: find.byType(HoronRadio).at(1), matching: find.byType(Opacity)).first)
          .opacity,
      0.4,
      reason: 'has-[[data-disabled]]:opacity-40',
    );
  });

  testWidgets('a radio outside a group renders unchecked and stays inert', (WidgetTester tester) async {
    await tester.pumpWidget(_host(const HoronRadio(value: 'solo', label: '그룹 없음')));
    expect(tester.takeException(), isNull);
    expect(_circleDecoration(tester, 0).color, HoronThemeData.light.colors.bgSurface);

    await tester.tap(find.text('그룹 없음'));
    await tester.pumpAndSettle();
    expect(tester.takeException(), isNull);
  });

  testWidgets('the group holds together at phone and desktop width', (WidgetTester tester) async {
    for (final double width in <double>[320, 1024]) {
      await tester.pumpWidget(
        _host(
          HoronRadioGroup(
            value: 'monthly',
            onValueChange: (_) {},
            children: const <Widget>[
              HoronRadio(value: 'monthly', label: '아주 긴 선택 항목 이름이 들어와도 원은 그대로 남습니다'),
              HoronRadio(value: 'yearly', label: '연간 결제'),
            ],
          ),
          width: width,
        ),
      );
      expect(tester.takeException(), isNull, reason: '폭 $width에서 예외가 없어야 합니다');
      expect(tester.getSize(_circle(0)).width, 20, reason: '원은 라벨 길이에 영향받지 않습니다');
    }
  });

  testWidgets('Tab enters only the selected radio', (WidgetTester tester) async {
    await tester.pumpWidget(_host(_group(value: 'yearly', onValueChange: (_) {})));
    await tester.sendKeyEvent(LogicalKeyboardKey.tab);
    await tester.pumpAndSettle();

    expect(_hasFocus(tester, 1), isTrue, reason: 'Tab은 선택된 라디오 하나에만 들어갑니다');
    expect(_hasFocus(tester, 0), isFalse, reason: '선택되지 않은 라디오는 탭 순서에서 건너뜁니다');
  });

  testWidgets('arrow keys move selection and focus and wrap', (WidgetTester tester) async {
    final List<String> changes = <String>[];
    await tester.pumpWidget(_host(_group(value: 'monthly', onValueChange: changes.add)));
    await tester.sendKeyEvent(LogicalKeyboardKey.tab);
    await tester.pumpAndSettle();
    expect(_hasFocus(tester, 0), isTrue);

    await tester.sendKeyEvent(LogicalKeyboardKey.arrowDown);
    await tester.pumpAndSettle();
    expect(changes, <String>['yearly'], reason: '아래 화살표는 다음 라디오를 고릅니다');
    expect(_hasFocus(tester, 1), isTrue, reason: '선택과 포커스가 함께 움직입니다');

    await tester.sendKeyEvent(LogicalKeyboardKey.arrowDown);
    await tester.pumpAndSettle();
    expect(changes, <String>['yearly', 'monthly'], reason: '마지막 다음은 처음으로 돌아옵니다');
    expect(_hasFocus(tester, 0), isTrue, reason: '순환이 포커스에도 적용됩니다');
  });

  testWidgets('Space selects the focused radio', (WidgetTester tester) async {
    final List<String> changes = <String>[];
    await tester.pumpWidget(_host(_group(value: 'monthly', onValueChange: changes.add)));
    await tester.sendKeyEvent(LogicalKeyboardKey.tab);
    await tester.pumpAndSettle();
    await tester.sendKeyEvent(LogicalKeyboardKey.arrowDown);
    await tester.pumpAndSettle();
    expect(changes, <String>['yearly']);

    await tester.sendKeyEvent(LogicalKeyboardKey.space);
    await tester.pumpAndSettle();
    expect(changes, <String>['yearly', 'yearly'], reason: 'Space는 포커스된 라디오의 값을 올립니다');
  });

  testWidgets('re-tapping the selected radio does not report again', (WidgetTester tester) async {
    final List<String> changes = <String>[];
    await tester.pumpWidget(_host(_group(value: 'monthly', onValueChange: changes.add)));

    await tester.tap(find.byType(HoronRadio).at(0));
    await tester.pumpAndSettle();

    expect(changes, isEmpty, reason: '이미 선택된 라디오를 다시 눌러도 콜백을 부르지 않습니다');
  });

  testWidgets('a group without onValueChange ignores arrow keys', (WidgetTester tester) async {
    final HoronColors colors = HoronThemeData.light.colors;
    await tester.pumpWidget(_host(_group(value: 'monthly')));

    await tester.sendKeyEvent(LogicalKeyboardKey.tab);
    await tester.pumpAndSettle();
    await tester.sendKeyEvent(LogicalKeyboardKey.arrowDown);
    await tester.pumpAndSettle();

    expect(tester.takeException(), isNull);
    expect(_hasFocus(tester, 0), isFalse, reason: '콜백이 없는 그룹의 라디오는 활성 상태가 아닙니다');
    expect(_circleDecoration(tester, 0).color, colors.interactivePrimary, reason: '콜백 없는 그룹은 선택을 옮기지 않습니다');
    expect(_circleDecoration(tester, 1).color, colors.bgSurface, reason: '화살표가 값을 바꾸지 않습니다');
  });

  testWidgets('the label is the accessible name of the checked radio', (WidgetTester tester) async {
    final SemanticsHandle handle = tester.ensureSemantics();
    await tester.pumpWidget(_host(_group(value: 'yearly', onValueChange: (_) {})));

    final SemanticsNode node = tester.getSemantics(find.byType(HoronRadio).at(1));
    expect(node.label, contains('연간 결제'));
    expect(node.flagsCollection.isChecked, CheckedState.isTrue, reason: '선택된 라디오는 checked 상태로 읽힙니다');
    handle.dispose();
  });
}
