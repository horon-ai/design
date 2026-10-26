import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:horon_ui/horon_ui.dart';

Future<void> pumpGroup(WidgetTester tester, Widget child, {Brightness brightness = Brightness.light}) async {
  await tester.pumpWidget(
    MaterialApp(
      theme: horonTheme(brightness),
      home: Scaffold(body: Center(child: child)),
    ),
  );
}

/// [HoronButton]이 그린 표면의 반경입니다.
BorderRadius _radiusOf(WidgetTester tester, String label) {
  final Finder surface = find.ancestor(
    of: find.text(label),
    matching: find.byWidgetPredicate((Widget widget) => widget is DecoratedBox && widget.decoration is BoxDecoration),
  );
  final DecoratedBox box = tester.widget<DecoratedBox>(surface.first);
  return (box.decoration as BoxDecoration).borderRadius! as BorderRadius;
}

void main() {
  testWidgets('button_group: only the outer corners keep the radius', (WidgetTester tester) async {
    await pumpGroup(
      tester,
      HoronButtonGroup(
        children: <Widget>[
          HoronButton(label: 'One', onPressed: () {}),
          HoronButton(label: 'Two', onPressed: () {}),
          HoronButton(label: 'Three', onPressed: () {}),
        ],
      ),
    );

    final double outer = HoronRadiusRole.control;

    final BorderRadius first = _radiusOf(tester, 'One');
    expect(first.topLeft.x, closeTo(outer, 0.01));
    expect(first.bottomLeft.x, closeTo(outer, 0.01));
    expect(first.topRight, Radius.zero);
    expect(first.bottomRight, Radius.zero);

    final BorderRadius middle = _radiusOf(tester, 'Two');
    expect(middle.topLeft, Radius.zero);
    expect(middle.topRight, Radius.zero);

    final BorderRadius last = _radiusOf(tester, 'Three');
    expect(last.topLeft, Radius.zero);
    expect(last.topRight.x, closeTo(outer, 0.01));
    expect(last.bottomRight.x, closeTo(outer, 0.01));
  });

  testWidgets('button_group: adjacent buttons share one seam, not two borders', (WidgetTester tester) async {
    await pumpGroup(
      tester,
      HoronButtonGroup(
        children: <Widget>[
          HoronButton(label: 'One', variant: HoronButtonVariant.outline, onPressed: () {}),
          HoronButton(label: 'Two', variant: HoronButtonVariant.outline, onPressed: () {}),
        ],
      ),
    );

    final Rect first = tester.getRect(find.ancestor(of: find.text('One'), matching: find.byType(HoronButton)));
    final Rect second = tester.getRect(find.ancestor(of: find.text('Two'), matching: find.byType(HoronButton)));

    // 두 버튼이 정확히 맞닿습니다. React의 `border-l-0`이 이음매에서 앞 버튼의
    // 오른쪽 테두리 한 줄만 남기기 때문에 선이 2px로 두꺼워지지 않습니다.
    expect(second.left, closeTo(first.right, 0.01));

    final DecoratedBox middle = tester.widget<DecoratedBox>(
      find
          .ancestor(
            of: find.text('Two'),
            matching: find.byWidgetPredicate(
              (Widget widget) => widget is DecoratedBox && widget.decoration is BoxDecoration,
            ),
          )
          .first,
    );
    final Border border = (middle.decoration as BoxDecoration).border! as Border;
    expect(border.left, BorderSide.none);
  });

  testWidgets('button_group: vertical joins along the vertical axis', (WidgetTester tester) async {
    await pumpGroup(
      tester,
      HoronButtonGroup(
        orientation: HoronButtonGroupOrientation.vertical,
        children: <Widget>[
          HoronButton(label: 'Top', onPressed: () {}),
          HoronButton(label: 'Bottom', onPressed: () {}),
        ],
      ),
    );

    final BorderRadius top = _radiusOf(tester, 'Top');
    expect(top.topLeft.x, closeTo(HoronRadiusRole.control, 0.01));
    expect(top.topRight.x, closeTo(HoronRadiusRole.control, 0.01));
    expect(top.bottomLeft, Radius.zero);

    final BorderRadius bottom = _radiusOf(tester, 'Bottom');
    expect(bottom.topLeft, Radius.zero);
    expect(bottom.bottomLeft.x, closeTo(HoronRadiusRole.control, 0.01));
  });

  testWidgets('button_group: a child outside a group keeps all four corners', (WidgetTester tester) async {
    await pumpGroup(tester, HoronButton(label: 'Solo', onPressed: () {}));

    final BorderRadius solo = _radiusOf(tester, 'Solo');
    expect(solo.topLeft.x, closeTo(HoronRadiusRole.control, 0.01));
    expect(solo.topRight.x, closeTo(HoronRadiusRole.control, 0.01));
    expect(solo.bottomLeft.x, closeTo(HoronRadiusRole.control, 0.01));
    expect(solo.bottomRight.x, closeTo(HoronRadiusRole.control, 0.01));
  });

  testWidgets('button_group: an empty group draws nothing and throws nothing', (WidgetTester tester) async {
    await pumpGroup(tester, const HoronButtonGroup(children: <Widget>[]));
    expect(tester.takeException(), isNull);
    expect(find.byType(HoronButton), findsNothing);
  });
}
