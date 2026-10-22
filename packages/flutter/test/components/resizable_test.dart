import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:horon_ui/horon_ui.dart';
// 배럴 export는 통합 담당자가 소유하므로, 이 랜은 자기 컴포넌트를 하위 경로로 읽습니다.
import 'package:horon_ui/src/components/resizable.dart';

/// 두 패널을 나눈 그룹을 400×300 상자에 띄웁니다.
Future<void> pumpGroup(
  WidgetTester tester, {
  Axis axis = Axis.horizontal,
  double firstMinSize = 0.2,
  double secondMinSize = 0.2,
  Brightness brightness = Brightness.light,
}) async {
  final Widget group = axis == Axis.horizontal
      ? HoronResizablePanelGroup(
          children: <Widget>[
            HoronResizablePanel(minSize: firstMinSize, child: const Text('왼쪽')),
            const HoronResizableHandle(withHandle: true),
            HoronResizablePanel(minSize: secondMinSize, child: const Text('오른쪽')),
          ],
        )
      : HoronResizablePanelGroup.vertical(
          children: <Widget>[
            HoronResizablePanel(minSize: firstMinSize, child: const Text('위')),
            const HoronResizableHandle(withHandle: true),
            HoronResizablePanel(minSize: secondMinSize, child: const Text('아래')),
          ],
        );

  await tester.pumpWidget(
    MaterialApp(
      theme: horonTheme(brightness),
      home: Scaffold(
        body: Center(child: SizedBox(width: 400, height: 300, child: group)),
      ),
    ),
  );
}

/// 첫 패널의 폭(가로) 또는 높이(세로)입니다.
///
/// 글자가 아니라 패널을 감싸는 `ClipRect` 상자를 읽습니다. 글자는 내용 폭이라
/// 패널 비율을 말해 주지 않습니다.
double firstPanelExtent(WidgetTester tester, Axis axis) {
  final Finder panel = find
      .ancestor(of: find.text(axis == Axis.horizontal ? '왼쪽' : '위'), matching: find.byType(ClipRect))
      .first;
  final Rect panelRect = tester.getRect(panel);
  return axis == Axis.horizontal ? panelRect.width : panelRect.height;
}

void main() {
  testWidgets('resizable: two panels split the width evenly and a handle sits between them', (
    WidgetTester tester,
  ) async {
    await pumpGroup(tester);

    expect(find.byType(HoronResizablePanelGroup), findsOneWidget);
    expect(find.byType(HoronResizableHandle), findsOneWidget);

    final double first = firstPanelExtent(tester, Axis.horizontal);
    final Rect left = tester.getRect(find.text('왼쪽'));
    final Rect right = tester.getRect(find.text('오른쪽'));
    final Rect handle = tester.getRect(find.byType(HoronResizableHandle));

    expect(handle.left, greaterThan(left.left));
    expect(handle.right, lessThan(right.right));
    expect(first, greaterThan(0));
  });

  testWidgets('resizable: dragging the handle changes the panel ratio', (WidgetTester tester) async {
    await pumpGroup(tester);

    final double before = firstPanelExtent(tester, Axis.horizontal);

    await tester.drag(find.byType(HoronResizableHandle), const Offset(80, 0));
    await tester.pumpAndSettle();

    final double after = firstPanelExtent(tester, Axis.horizontal);
    expect(after, greaterThan(before), reason: 'dragging right must widen the first panel');
    expect(tester.takeException(), isNull);
  });

  testWidgets('resizable: dragging past the minimum stops at the minimum', (WidgetTester tester) async {
    // 첫 패널 하한은 0.2입니다. 그보다 훨씬 왼쪽으로 끌어도 그 아래로 줄지 않습니다.
    await pumpGroup(tester, firstMinSize: 0.3, secondMinSize: 0.2);

    await tester.drag(find.byType(HoronResizableHandle), const Offset(-400, 0));
    await tester.pumpAndSettle();

    final double first = firstPanelExtent(tester, Axis.horizontal);
    final Rect group = tester.getRect(find.byType(HoronResizablePanelGroup));
    final double contentExtent = group.width - 9; // 구분선 접촉 영역 9를 뺀 나머지

    // 하한 0.3 아래로 내려가지 않았습니다.
    expect(first, greaterThanOrEqualTo(contentExtent * 0.3 - 0.5));
    expect(first, lessThan(contentExtent * 0.5));
  });

  testWidgets('resizable: dragging past the maximum stops at the maximum', (WidgetTester tester) async {
    await pumpGroup(tester, firstMinSize: 0.2, secondMinSize: 0.4);

    await tester.drag(find.byType(HoronResizableHandle), const Offset(400, 0));
    await tester.pumpAndSettle();

    final double first = firstPanelExtent(tester, Axis.horizontal);
    final Rect group = tester.getRect(find.byType(HoronResizablePanelGroup));
    final double contentExtent = group.width - 9;

    // 이웃의 하한 0.4가 지켜지므로 첫 패널은 0.6을 넘지 않습니다.
    expect(first, lessThanOrEqualTo(contentExtent * 0.6 + 0.5));
  });

  testWidgets('resizable: the vertical group splits height and drags on the y axis', (WidgetTester tester) async {
    await pumpGroup(tester, axis: Axis.vertical);

    final double before = firstPanelExtent(tester, Axis.vertical);
    await tester.drag(find.byType(HoronResizableHandle), const Offset(0, 60));
    await tester.pumpAndSettle();
    final double after = firstPanelExtent(tester, Axis.vertical);

    expect(after, greaterThan(before));
    expect(tester.takeException(), isNull);
  });

  testWidgets('resizable: the handle is a 1px line with a 9px touch target', (WidgetTester tester) async {
    await pumpGroup(tester);

    final Rect handle = tester.getRect(find.byType(HoronResizableHandle));
    // React의 `w-px` + `after:-inset-x-1`(양쪽 4px)입니다.
    expect(handle.width, 9);
  });

  testWidgets('resizable: both brightnesses render both axes', (WidgetTester tester) async {
    for (final Brightness brightness in Brightness.values) {
      for (final Axis axis in Axis.values) {
        await pumpGroup(tester, axis: axis, brightness: brightness);
        expect(tester.takeException(), isNull, reason: '${axis.name} on ${brightness.name}');
      }
    }
  });

  testWidgets('resizable: a panel with minSize above maxSize asserts', (WidgetTester tester) async {
    // 계약 위반은 조용히 이상한 비율로 그리지 않고 즉시 실패합니다.
    expect(
      () => HoronResizablePanel(minSize: 0.8, maxSize: 0.2, child: const SizedBox.shrink()),
      throwsA(isA<AssertionError>()),
    );
  });
}
