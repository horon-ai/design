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

  testWidgets('tooltip: leaving the trigger hides the bubble on the next frame', (WidgetTester tester) async {
    await pumpTooltip(
      tester,
      const HoronTooltip.top(
        label: '복사',
        child: SizedBox(key: Key('trigger'), width: 40, height: 40),
      ),
    );

    final TestGesture pointer = await tester.createGesture(kind: PointerDeviceKind.mouse);
    await pointer.addPointer(location: tester.getCenter(find.byKey(const Key('trigger'))));
    await tester.pumpAndSettle();
    expect(find.text('복사'), findsOneWidget);

    // 한 번의 프레임 뒤 바로 사라져야 합니다. SDK 기본 닫기 애니메이션(75ms)이면
    // 이 프레임에도 말풍선이 남습니다.
    await pointer.moveTo(const Offset(5, 5));
    await tester.pump();
    expect(find.text('복사'), findsNothing);

    await pointer.removePointer();
    await tester.pumpAndSettle();
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

  testWidgets('tooltip: the arrow is a 10x6 ink triangle 1.5px off the bubble', (WidgetTester tester) async {
    await pumpTooltip(
      tester,
      const HoronTooltip.top(
        label: '복사',
        child: SizedBox(key: Key('trigger'), width: 40, height: 40),
      ),
    );
    final TestGesture pointer = await tester.createGesture(kind: PointerDeviceKind.mouse);
    await pointer.addPointer(location: tester.getCenter(find.byKey(const Key('trigger'))));
    await tester.pumpAndSettle();

    final Finder clip = find.descendant(of: find.byType(RawTooltip), matching: find.byType(ClipPath)).last;
    expect(clip, findsOneWidget);
    expect(tester.getSize(clip), const Size(10, 6));

    final CustomClipper<Path> clipper = tester.widget<ClipPath>(clip).clipper!;
    final Rect triangle = clipper.getClip(const Size(10, 6)).getBounds();
    expect(triangle.width, moreOrLessEquals(8.66, epsilon: 0.01), reason: 'TVV-1 밑변 폭');
    expect(triangle.height, moreOrLessEquals(4.5, epsilon: 0.01), reason: 'TVV-1 삼각형 높이');
    expect(triangle.top, moreOrLessEquals(1.5, epsilon: 0.01), reason: 'TVV-1 밑변과 말풍선 사이');

    final HoronThemeData theme = HoronTheme.of(tester.element(find.byType(HoronTooltip)));
    final ColoredBox fill = tester.widget<ColoredBox>(find.descendant(of: clip, matching: find.byType(ColoredBox)));
    expect(fill.color, theme.colors.interactivePrimary, reason: 'TVV-1 채움색');

    // 화살표 상자는 말풍선 아래 여백(6)에 바로 붙습니다. 둘 다 같은 오버레이 좌표계라
    // 차이만 재며, 6px 안쪽 여백이 말풍선과 화살표 사이를 만듭니다.
    expect(tester.getRect(clip).top - tester.getRect(find.text('복사')).bottom, moreOrLessEquals(6), reason: '말풍선 아래 여백');

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

  testWidgets('tooltip: the trigger announces the label as a tooltip', (WidgetTester tester) async {
    final SemanticsHandle handle = tester.ensureSemantics();
    await pumpTooltip(
      tester,
      const HoronTooltip.top(
        label: '복사',
        child: SizedBox(key: Key('trigger'), width: 40, height: 40),
      ),
    );
    expect(tester.getSemantics(find.byKey(const Key('trigger'))).tooltip, '복사');
    handle.dispose();
  });

  testWidgets('tooltip: opening a second tooltip closes the first', (WidgetTester tester) async {
    await pumpTooltip(
      tester,
      const Row(
        mainAxisSize: MainAxisSize.min,
        children: <Widget>[
          HoronTooltip.top(
            label: '첫째',
            child: SizedBox(key: Key('first'), width: 40, height: 40),
          ),
          SizedBox(width: 40),
          HoronTooltip.top(
            label: '둘째',
            child: SizedBox(key: Key('second'), width: 40, height: 40),
          ),
        ],
      ),
    );

    // 마우스를 첫째에서 둘째로 옮기면 그 프레임에 첫째가 사라지고 둘째만 남아야
    // 합니다. 말풍선 닫기에 페이드가 붙으면 두 말풍선이 잠깐 겹칩니다.
    final TestGesture pointer = await tester.createGesture(kind: PointerDeviceKind.mouse);
    await pointer.addPointer(location: tester.getCenter(find.byKey(const Key('first'))));
    await tester.pumpAndSettle();
    expect(find.text('첫째'), findsOneWidget);

    await pointer.moveTo(tester.getCenter(find.byKey(const Key('second'))));
    await tester.pump();
    expect(find.text('첫째'), findsNothing, reason: '옮긴 첫 프레임에 첫째가 닫힘');
    expect(find.text('둘째'), findsOneWidget, reason: '옮긴 첫 프레임에 둘째가 열림');

    // 같은 규칙이 터치 길게 누르기에도 섭니다. 첫째에 마우스가 올라가 있어도 둘째가
    // 열리는 프레임에는 첫째가 이미 닫혀 있습니다.
    await pointer.moveTo(tester.getCenter(find.byKey(const Key('first'))));
    await tester.pump();
    expect(find.text('첫째'), findsOneWidget);

    final TestGesture hold = await tester.startGesture(tester.getCenter(find.byKey(const Key('second'))));
    await tester.pump(const Duration(milliseconds: 600));
    expect(find.text('첫째'), findsNothing, reason: '길게 누른 프레임에 첫째가 닫힘');
    expect(find.text('둘째'), findsOneWidget, reason: '길게 누른 프레임에 둘째가 열림');

    await hold.up();
    await pointer.removePointer();
    await tester.pumpAndSettle();
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
