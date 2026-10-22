import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:horon_ui/horon_ui.dart';
// 배럴 export는 통합 담당자가 소유하므로, 이 랜은 자기 컴포넌트를 하위 경로로 읽습니다.
import 'package:horon_ui/src/components/scroll_area.dart';

/// [HoronScrollArea]를 고정 크기 상자 안에 띄웁니다.
Future<void> pumpScrollArea(
  WidgetTester tester, {
  required int rows,
  Axis axis = Axis.vertical,
  Brightness brightness = Brightness.light,
  ScrollController? controller,
}) async {
  final List<Widget> children = <Widget>[
    for (int index = 0; index < rows; index++)
      SizedBox(width: 400, height: 40, child: Text('행 $index', key: ValueKey<String>('row-$index'))),
  ];
  await tester.pumpWidget(
    MaterialApp(
      theme: horonTheme(brightness),
      home: Scaffold(
        body: Center(
          child: SizedBox(
            width: 200,
            height: 200,
            child: axis == Axis.vertical
                ? HoronScrollArea(
                    controller: controller,
                    child: Column(children: children),
                  )
                : HoronScrollArea.horizontal(
                    controller: controller,
                    child: Row(children: children),
                  ),
          ),
        ),
      ),
    ),
  );
}

/// 스크롤바를 그리는 페인터입니다.
///
/// `ScrollbarPainter`는 `package:flutter`의 공개 타입이라 위젯 트리에서 집을 수
/// 있습니다. 페인터는 스크롤할 것이 있을 때만 손잡이를 칠하고, 그 판단은
/// `fadeoutOpacityAnimation`에 드러납니다: 스크롤 중에는 1, 스크롤이 없거나 멈춘
/// 뒤에는 0입니다.
ScrollbarPainter scrollbarPainterOf(WidgetTester tester) {
  final Finder painter = find.byWidgetPredicate(
    (Widget widget) => widget is CustomPaint && widget.foregroundPainter is ScrollbarPainter,
  );
  expect(painter, findsOneWidget);
  return tester.widget<CustomPaint>(painter).foregroundPainter! as ScrollbarPainter;
}

/// 지금 손잡이가 칠해지는지 여부입니다.
bool thumbIsPainted(WidgetTester tester) => scrollbarPainterOf(tester).fadeoutOpacityAnimation.value > 0;

void main() {
  testWidgets('scroll area: the scrollbar shows when the content overflows and not before', (
    WidgetTester tester,
  ) async {
    // 내용이 상자 안에 다 들어가는 경우: 스크롤할 것이 없으므로 손잡이가 칠해지지 않습니다.
    await pumpScrollArea(tester, rows: 2);
    expect(find.byType(RawScrollbar), findsOneWidget);
    await tester.drag(find.byType(Scrollable).first, const Offset(0, -80));
    await tester.pumpAndSettle();
    expect(thumbIsPainted(tester), isFalse, reason: 'nothing to scroll means no thumb');

    // 넘치는 경우: 스크롤하는 동안 손잡이가 칠해집니다.
    await pumpScrollArea(tester, rows: 20);
    expect(thumbIsPainted(tester), isFalse, reason: 'idle: React fades the thumb out');
    await tester.drag(find.byType(Scrollable).first, const Offset(0, -80));
    await tester.pumpAndSettle();
    expect(thumbIsPainted(tester), isTrue, reason: 'overflow must paint a thumb');
  });

  testWidgets('scroll area: dragging scrolls the viewport', (WidgetTester tester) async {
    await pumpScrollArea(tester, rows: 20);

    final ScrollableState scrollable = tester.state<ScrollableState>(find.byType(Scrollable).first);
    expect(scrollable.position.maxScrollExtent, greaterThan(0));
    expect(scrollable.position.pixels, 0);

    await tester.drag(find.byType(Scrollable).first, const Offset(0, -120));
    await tester.pumpAndSettle();

    expect(scrollable.position.pixels, greaterThan(0));
    expect(tester.takeException(), isNull);
  });

  testWidgets('scroll area: the thumb is 10 wide, full radius, foreground at 20%', (WidgetTester tester) async {
    await pumpScrollArea(tester, rows: 20);

    final RawScrollbar bar = tester.widget<RawScrollbar>(find.byType(RawScrollbar));
    // React `scroll-area.tsx`의 `w-2.5`(10)와 `rounded-full`입니다.
    expect(bar.thickness, HoronSpace.s2_5);
    expect((bar.radius!).x, closeTo(HoronRadius.full, 0.01));
    // React는 스크롤 중에만 손잡이를 보입니다(`transition-opacity`).
    expect(bar.thumbVisibility, isFalse);
    expect(bar.scrollbarOrientation, ScrollbarOrientation.right);

    // 손잡이 색은 전경 색의 20%입니다(`bg-foreground/20`).
    final ColorScheme scheme = Theme.of(tester.element(find.byType(HoronScrollArea))).colorScheme;
    expect(scrollbarPainterOf(tester).color, scheme.onSurface.withValues(alpha: 0.2));
  });

  testWidgets('scroll area: horizontal axis scrolls sideways with a bottom thumb', (WidgetTester tester) async {
    await pumpScrollArea(tester, rows: 20, axis: Axis.horizontal);

    final RawScrollbar bar = tester.widget<RawScrollbar>(find.byType(RawScrollbar));
    expect(bar.scrollbarOrientation, ScrollbarOrientation.bottom);

    final ScrollableState scrollable = tester.state<ScrollableState>(find.byType(Scrollable).first);
    expect(scrollable.position.axis, Axis.horizontal);
    await tester.drag(find.byType(Scrollable).first, const Offset(-160, 0));
    await tester.pumpAndSettle();
    expect(scrollable.position.pixels, greaterThan(0));
  });

  testWidgets('scroll area: a caller-owned controller drives the viewport and is not disposed', (
    WidgetTester tester,
  ) async {
    final ScrollController controller = ScrollController();
    addTearDown(controller.dispose);

    await pumpScrollArea(tester, rows: 20, controller: controller);
    expect(controller.hasClients, isTrue);
    controller.jumpTo(80);
    await tester.pump();
    expect(controller.offset, 80);

    // 위젯이 사라져도 호출자의 컨트롤러를 폐기하지 않아야 합니다. 폐기했다면 다음
    // 사용에서 "A ScrollController was used after being disposed"로 실패합니다.
    await tester.pumpWidget(const SizedBox.shrink());
    await pumpScrollArea(tester, rows: 20, controller: controller);
    expect(controller.hasClients, isTrue);
    expect(tester.takeException(), isNull);
  });

  testWidgets('scroll area: one controller cannot drive two areas', (WidgetTester tester) async {
    // 컨트롤러 하나는 스크롤 뷰 하나에만 붙습니다. 두 곳에 넘기면 Flutter가
    // `_positions.length == 1` 단언으로 거부합니다. 그 계약을 테스트로 고정합니다.
    final ScrollController controller = ScrollController();
    addTearDown(controller.dispose);

    await tester.pumpWidget(
      MaterialApp(
        theme: horonTheme(Brightness.light),
        home: Scaffold(
          body: Column(
            children: <Widget>[
              for (int index = 0; index < 2; index++)
                SizedBox(
                  height: 120,
                  child: HoronScrollArea(
                    controller: controller,
                    child: Column(children: <Widget>[for (int row = 0; row < 10; row++) const SizedBox(height: 40)]),
                  ),
                ),
            ],
          ),
        ),
      ),
    );

    expect(() => controller.offset, throwsA(isA<AssertionError>()));
  });

  testWidgets('scroll area: both brightnesses render', (WidgetTester tester) async {
    for (final Brightness brightness in Brightness.values) {
      await pumpScrollArea(tester, rows: 20, brightness: brightness);
      expect(tester.takeException(), isNull, reason: brightness.name);
    }
  });
}
