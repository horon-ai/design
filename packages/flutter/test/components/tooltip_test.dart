import 'package:flutter/gestures.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:horon_ui/horon_ui.dart';

Future<void> pumpTooltip(WidgetTester tester, Widget child, {Brightness brightness = Brightness.light}) async {
  await tester.pumpWidget(
    MaterialApp(
      theme: horonTheme(brightness),
      home: Scaffold(body: Center(child: child)),
    ),
  );
  await tester.pumpAndSettle();
}

/// 손을 뗀 채로 하는 `longPress` 는 열자마자 닫히므로, 누른 상태를 유지합니다.
Future<TestGesture> holdOpen(WidgetTester tester) async {
  final TestGesture gesture = await tester.startGesture(tester.getCenter(find.byType(HoronTooltip)));
  await tester.pump(const Duration(milliseconds: 600));
  await tester.pumpAndSettle();
  return gesture;
}

void main() {
  testWidgets('tooltip: it stays hidden until the pointer enters', (WidgetTester tester) async {
    await pumpTooltip(tester, const HoronTooltip.top(label: '복사', child: SizedBox(width: 40, height: 40)));
    expect(find.text('복사'), findsNothing);

    final TestGesture pointer = await tester.createGesture(kind: PointerDeviceKind.mouse);
    await pointer.addPointer(location: tester.getCenter(find.byType(SizedBox).first));
    await tester.pumpAndSettle();
    expect(find.text('복사'), findsOneWidget);

    await pointer.removePointer();
    await tester.pumpAndSettle();
    expect(find.text('복사'), findsNothing);
  });

  testWidgets('tooltip: the bubble is ink at an 8px radius with label-sm text', (WidgetTester tester) async {
    await pumpTooltip(tester, const HoronTooltip.bottom(label: '붙여넣기', child: SizedBox(width: 40, height: 40)));
    // 내용 검사는 호버로 엽니다(터치 길게 누르기는 아래 전용 테스트가 봅니다).
    final TestGesture pointer = await tester.createGesture(kind: PointerDeviceKind.mouse);
    await pointer.addPointer(location: tester.getCenter(find.byType(SizedBox).first));
    await tester.pumpAndSettle();

    final HoronThemeData theme = HoronTheme.of(tester.element(find.byType(HoronTooltip)));
    final Text text = tester.widget<Text>(find.text('붙여넣기'));
    expect(text.style!.fontSize, theme.text.labelSm.fontSize);

    final bool hasInkBubble = tester.widgetList<DecoratedBox>(find.byType(DecoratedBox)).any((DecoratedBox box) {
      final Decoration decoration = box.decoration;
      return decoration is BoxDecoration &&
          decoration.color == theme.colors.interactivePrimary &&
          (decoration.borderRadius! as BorderRadius).topLeft.x == theme.radius.sm;
    });
    expect(hasInkBubble, isTrue);

    await pointer.removePointer();
    await tester.pumpAndSettle();
  });

  testWidgets('tooltip: holding on a touch screen opens it without an exception', (WidgetTester tester) async {
    await pumpTooltip(tester, const HoronTooltip.top(label: '길게', child: SizedBox(width: 40, height: 40)));
    final TestGesture hold = await holdOpen(tester);
    expect(tester.takeException(), isNull);
    await hold.up();
    await tester.pumpAndSettle();
  });

  testWidgets('tooltip: all four sides show the label', (WidgetTester tester) async {
    final List<Widget> sides = <Widget>[
      const HoronTooltip.top(label: '위', child: SizedBox(width: 30, height: 30)),
      const HoronTooltip.bottom(label: '아래', child: SizedBox(width: 30, height: 30)),
      const HoronTooltip.left(label: '왼쪽', child: SizedBox(width: 30, height: 30)),
      const HoronTooltip.right(label: '오른쪽', child: SizedBox(width: 30, height: 30)),
    ];
    for (final Widget side in sides) {
      await pumpTooltip(tester, side);
      final TestGesture hold = await holdOpen(tester);
      expect(tester.takeException(), isNull);
      await hold.up();
      await tester.pumpAndSettle();
    }
  });

  testWidgets('tooltip: both brightnesses render', (WidgetTester tester) async {
    for (final Brightness brightness in Brightness.values) {
      await pumpTooltip(
        tester,
        const HoronTooltip.top(label: '라벨', child: SizedBox(width: 30, height: 30)),
        brightness: brightness,
      );
      final TestGesture hold = await holdOpen(tester);
      expect(tester.takeException(), isNull, reason: brightness.name);
      await hold.up();
      await tester.pumpAndSettle();
    }
  });
}
