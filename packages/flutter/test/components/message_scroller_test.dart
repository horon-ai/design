import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:horon_ui/horon_ui.dart';
import 'package:horon_ui/src/components/message_scroller.dart';

/// 메시지 스크롤 영역 하나를 띄웁니다.
///
/// [count]개의 메시지를 넣고, [anchorIndex] 항목을 앵커로 켭니다.
Future<void> pumpScroller(
  WidgetTester tester, {
  required int count,
  int? anchorIndex,
  Brightness brightness = Brightness.light,
  double height = 200,
  ScrollController? controller,
  bool jumpButtons = true,
}) async {
  await tester.pumpWidget(
    MaterialApp(
      theme: horonTheme(brightness),
      home: Scaffold(
        body: Center(
          child: SizedBox(
            width: 320,
            height: height,
            child: HoronMessageScroller(
              controller: controller,
              jumpButtons: jumpButtons,
              children: <Widget>[
                HoronMessageScrollerViewport(
                  children: <Widget>[
                    HoronMessageScrollerContent(
                      children: <Widget>[
                        for (int index = 0; index < count; index++)
                          HoronMessageScrollerItem(
                            key: ValueKey<String>('item-$index'),
                            scrollAnchor: index == anchorIndex,
                            child: SizedBox(
                              height: 60,
                              child: Text('메시지 $index', key: ValueKey<String>('text-$index')),
                            ),
                          ),
                      ],
                    ),
                  ],
                ),
              ],
            ),
          ),
        ),
      ),
    ),
  );
}

/// 지금 스크롤 위치입니다.
ScrollPosition positionOf(WidgetTester tester) => tester.state<ScrollableState>(find.byType(Scrollable).first).position;

/// 이동 버튼이 지금 보이는지 여부입니다. 투명도가 1이면 보입니다.
bool buttonVisible(WidgetTester tester, Key key) {
  final Finder opacity = find.ancestor(
    of: find.byKey(key),
    matching: find.byWidgetPredicate((Widget widget) => widget is FadeTransition || widget is AnimatedOpacity),
  );
  if (opacity.evaluate().isEmpty) return false;
  final Widget widget = tester.widget(opacity.first);
  if (widget is AnimatedOpacity) return widget.opacity > 0;
  return true;
}

void main() {
  testWidgets('message scroller: the first layout lands on the newest message', (WidgetTester tester) async {
    await pumpScroller(tester, count: 20);
    await tester.pumpAndSettle();

    final ScrollPosition position = positionOf(tester);
    expect(position.maxScrollExtent, greaterThan(0), reason: '20 items of 60 do not fit in 200');
    expect(position.pixels, moreOrLessEquals(position.maxScrollExtent), reason: 'the newest message is visible');
  });

  testWidgets('message scroller: a new message scrolls down when the user is at the bottom', (
    WidgetTester tester,
  ) async {
    await pumpScroller(tester, count: 10);
    await tester.pumpAndSettle();
    expect(positionOf(tester).pixels, moreOrLessEquals(positionOf(tester).maxScrollExtent));

    final double before = positionOf(tester).maxScrollExtent;
    await pumpScroller(tester, count: 11);
    await tester.pumpAndSettle();

    expect(positionOf(tester).maxScrollExtent, greaterThan(before), reason: 'content grew');
    expect(
      positionOf(tester).pixels,
      moreOrLessEquals(positionOf(tester).maxScrollExtent),
      reason: 'a stuck-to-bottom reader follows the new message',
    );
  });

  testWidgets('message scroller: a new message does NOT force-scroll a reader who scrolled up', (
    WidgetTester tester,
  ) async {
    // 실패 경로 2: 사용자가 위로 올려 둔 상태에서는 새 메시지가 와도 강제로 내리지 않습니다.
    await pumpScroller(tester, count: 10);
    await tester.pumpAndSettle();

    // 위로 올립니다.
    await tester.drag(find.byType(Scrollable).first, const Offset(0, 240));
    await tester.pumpAndSettle();
    final double scrolledUp = positionOf(tester).pixels;
    expect(scrolledUp, lessThan(positionOf(tester).maxScrollExtent - 100), reason: 'the reader moved up');

    await pumpScroller(tester, count: 11);
    await tester.pumpAndSettle();

    expect(
      positionOf(tester).pixels,
      moreOrLessEquals(scrolledUp),
      reason: 'the offset stays where the reader left it',
    );
    expect(
      positionOf(tester).extentAfter,
      greaterThan(1),
      reason: 'new content is below the viewport, not pulled into view',
    );
  });

  testWidgets('message scroller: the jump-to-bottom affordance appears when scrolled up', (WidgetTester tester) async {
    await pumpScroller(tester, count: 10);
    await tester.pumpAndSettle();
    expect(find.byKey(HoronMessageScrollerButton.toEndKey), findsNothing, reason: 'at the bottom, no button');

    await tester.drag(find.byType(Scrollable).first, const Offset(0, 240));
    await tester.pumpAndSettle();
    expect(find.byKey(HoronMessageScrollerButton.toEndKey), findsOneWidget, reason: 'scrolled up shows it');
    expect(find.byKey(HoronMessageScrollerButton.toStartKey), findsOneWidget, reason: 'not at the top either');

    // 누르면 바닥으로 돌아가고 버튼이 사라집니다.
    await tester.tap(find.byKey(HoronMessageScrollerButton.toEndKey));
    await tester.pumpAndSettle();
    expect(positionOf(tester).pixels, moreOrLessEquals(positionOf(tester).maxScrollExtent));
    expect(find.byKey(HoronMessageScrollerButton.toEndKey), findsNothing);
  });

  testWidgets('message scroller: the jump-to-top affordance appears below the top', (WidgetTester tester) async {
    await pumpScroller(tester, count: 10);
    await tester.pumpAndSettle();
    // 바닥에 있으므로 위로 가는 버튼이 보입니다.
    expect(find.byKey(HoronMessageScrollerButton.toStartKey), findsOneWidget);

    await tester.tap(find.byKey(HoronMessageScrollerButton.toStartKey));
    await tester.pumpAndSettle();
    expect(positionOf(tester).pixels, moreOrLessEquals(0), reason: 'the top button returns to the start');
    expect(find.byKey(HoronMessageScrollerButton.toStartKey), findsNothing, reason: 'at the top, no button');
  });

  testWidgets('message scroller: the anchor holds its place when older messages are prepended', (
    WidgetTester tester,
  ) async {
    // 앵커가 없으면 위에 내용이 붙을 때 화면이 밀립니다. 있는 경우와 비교합니다.
    await pumpScroller(tester, count: 10, anchorIndex: 0);
    await tester.pumpAndSettle();
    await tester.drag(find.byType(Scrollable).first, const Offset(0, 240));
    await tester.pumpAndSettle();

    final double before = tester.getRect(find.byKey(const ValueKey<String>('item-0'))).top;
    final double offsetBefore = positionOf(tester).pixels;

    // 앵커 항목을 그대로 두고 그 위에 한 항목을 붙입니다.
    await tester.pumpWidget(
      MaterialApp(
        theme: horonTheme(Brightness.light),
        home: Scaffold(
          body: Center(
            child: SizedBox(
              width: 320,
              height: 200,
              child: HoronMessageScroller(
                children: <Widget>[
                  HoronMessageScrollerViewport(
                    children: <Widget>[
                      HoronMessageScrollerContent(
                        children: <Widget>[
                          const SizedBox(height: 60, child: Text('새 메시지')),
                          for (int index = 0; index < 10; index++)
                            HoronMessageScrollerItem(
                              key: ValueKey<String>('item-$index'),
                              scrollAnchor: index == 0,
                              child: SizedBox(height: 60, child: Text('메시지 $index')),
                            ),
                        ],
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
    await tester.pumpAndSettle();

    final double after = tester.getRect(find.byKey(const ValueKey<String>('item-0'))).top;
    expect(after, moreOrLessEquals(before), reason: 'the anchor item stays where the reader was looking');
    expect(positionOf(tester).pixels, greaterThan(offsetBefore), reason: 'the offset absorbed the inserted height');
  });

  testWidgets('message scroller: the content gap is 32px', (WidgetTester tester) async {
    await pumpScroller(tester, count: 3);
    final Rect first = tester.getRect(find.byKey(const ValueKey<String>('item-0')));
    final Rect second = tester.getRect(find.byKey(const ValueKey<String>('item-1')));
    expect(second.top - first.bottom, moreOrLessEquals(HoronSpace.s8));
  });

  testWidgets('message scroller: a caller-owned controller drives the viewport', (WidgetTester tester) async {
    final ScrollController controller = ScrollController();
    addTearDown(controller.dispose);

    await pumpScroller(tester, count: 20, controller: controller);
    await tester.pumpAndSettle();
    expect(controller.hasClients, isTrue);
    expect(controller.offset, moreOrLessEquals(controller.position.maxScrollExtent));

    controller.jumpTo(0);
    await tester.pumpAndSettle();
    expect(controller.offset, 0);
    expect(tester.takeException(), isNull);
  });

  testWidgets('message scroller: a caller-positioned controller is not overridden on first layout', (
    WidgetTester tester,
  ) async {
    // 호출자가 컨트롤러의 초기 오프셋을 정했으면 컴포넌트가 바닥으로 끌어내리지 않습니다.
    final ScrollController controller = ScrollController(initialScrollOffset: 120);
    addTearDown(controller.dispose);

    await pumpScroller(tester, count: 20, controller: controller);
    await tester.pumpAndSettle();

    expect(controller.offset, moreOrLessEquals(120), reason: 'the caller chose where to start');
    expect(controller.offset, lessThan(controller.position.maxScrollExtent - 100));
    expect(find.byKey(HoronMessageScrollerButton.toEndKey), findsOneWidget, reason: 'the down button shows');
  });

  testWidgets('message scroller: both brightnesses render with the buttons', (WidgetTester tester) async {
    for (final Brightness brightness in Brightness.values) {
      await pumpScroller(tester, count: 10, brightness: brightness);
      await tester.pumpAndSettle();
      expect(tester.takeException(), isNull, reason: brightness.name);
      expect(
        find.byKey(HoronMessageScrollerButton.toStartKey),
        findsOneWidget,
        reason: 'at the bottom only the top button shows (${brightness.name})',
      );
      expect(find.byKey(HoronMessageScrollerButton.toEndKey), findsNothing, reason: brightness.name);
    }
  });

  testWidgets('message scroller: jumpButtons can be turned off for a custom button set', (WidgetTester tester) async {
    await pumpScroller(tester, count: 10, jumpButtons: false);
    await tester.pumpAndSettle();
    expect(find.byType(HoronMessageScrollerButton), findsNothing);
  });
}
