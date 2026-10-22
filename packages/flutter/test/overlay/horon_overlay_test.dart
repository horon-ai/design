import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:horon_ui/src/overlay/horon_overlay.dart';

/// 오버레이 배치를 확인합니다.
///
/// 계획이 요구하는 것은 두 가지입니다.
///
/// 1. 네 side 각각에서 패널 사각형이 트리거 기준 올바른 방향에 온다.
/// 2. 화면 밖으로 나가면 반대 방향으로 뒤집힌다.
///
/// 패널 사각형은 실제 위젯에서 `tester.getRect`로 잽니다. 배치 계산을 테스트가
/// 다시 구현하면 계산이 틀려도 테스트가 같이 틀리기 때문입니다.
void main() {
  const Key panelKey = Key('overlay-panel');
  const Key triggerKey = Key('overlay-trigger');
  const Size panelSize = Size(120, 60);

  /// 트리거를 주어진 위치에 두고 오버레이를 엽니다.
  Future<void> pumpOverlay(
    WidgetTester tester, {
    required HoronOverlayPosition position,
    required Offset triggerTopLeft,
    Size size = panelSize,
    Size screen = const Size(400, 800),
  }) async {
    tester.view.physicalSize = screen;
    tester.view.devicePixelRatio = 1.0;
    addTearDown(tester.view.reset);

    final HoronOverlayController controller = HoronOverlayController();
    addTearDown(controller.dispose);

    await tester.pumpWidget(
      MaterialApp(
        home: Scaffold(
          body: Stack(
            children: <Widget>[
              Positioned(
                left: triggerTopLeft.dx,
                top: triggerTopLeft.dy,
                child: HoronOverlay(
                  controller: controller,
                  position: position,
                  trigger: const SizedBox(key: triggerKey, width: 100, height: 40),
                  panelBuilder: (BuildContext context, HoronOverlayPlacement placement) =>
                      SizedBox(key: panelKey, width: size.width, height: size.height),
                ),
              ),
            ],
          ),
        ),
      ),
    );

    controller.show();
    // `OverlayPortalController.show()`는 프레임 도중에 부르면 안 됩니다.
    // 테스트에서 pump 전에 부르면 위젯 라이브러리 assert에 걸립니다.
    await tester.pump();
    await tester.pump(const Duration(milliseconds: 200));
  }

  group('four sides place the panel on the correct side of the trigger', () {
    const Offset centered = Offset(150, 350);

    for (final HoronOverlaySide side in HoronOverlaySide.values) {
      testWidgets('$side puts the panel on its own side', (WidgetTester tester) async {
        await pumpOverlay(
          tester,
          position: HoronOverlayPosition(side: side),
          triggerTopLeft: centered,
        );

        final Rect trigger = tester.getRect(find.byKey(triggerKey));
        final Rect panel = tester.getRect(find.byKey(panelKey));

        switch (side) {
          case HoronOverlaySide.bottom:
            expect(panel.top, greaterThanOrEqualTo(trigger.bottom - 0.01));
          case HoronOverlaySide.top:
            expect(panel.bottom, lessThanOrEqualTo(trigger.top + 0.01));
          case HoronOverlaySide.right:
            expect(panel.left, greaterThanOrEqualTo(trigger.right - 0.01));
          case HoronOverlaySide.left:
            expect(panel.right, lessThanOrEqualTo(trigger.left + 0.01));
        }
      });
    }
  });

  group('align controls the cross axis', () {
    testWidgets('start, center and end line up under the trigger', (WidgetTester tester) async {
      const Offset centered = Offset(150, 350);
      final List<({HoronOverlayAlign align, double expected, String name})> cases =
          <({HoronOverlayAlign align, double expected, String name})>[
            (align: HoronOverlayAlign.start, expected: 150, name: 'start'),
            (align: HoronOverlayAlign.center, expected: 200 - 60, name: 'center'),
            (align: HoronOverlayAlign.end, expected: 250 - 120, name: 'end'),
          ];

      for (final ({HoronOverlayAlign align, double expected, String name}) item in cases) {
        await pumpOverlay(
          tester,
          position: HoronOverlayPosition(align: item.align),
          triggerTopLeft: centered,
        );
        final Rect panel = tester.getRect(find.byKey(panelKey));
        expect(panel.left, closeTo(item.expected, 0.01), reason: item.name);
      }
    });
  });

  group('flip when there is no room', () {
    testWidgets('a bottom request near the bottom edge flips above', (WidgetTester tester) async {
      await pumpOverlay(
        tester,
        position: const HoronOverlayPosition(),
        triggerTopLeft: const Offset(150, 740),
        size: const Size(120, 200),
      );
      final Rect trigger = tester.getRect(find.byKey(triggerKey));
      final Rect panel = tester.getRect(find.byKey(panelKey));
      expect(panel.bottom, lessThanOrEqualTo(trigger.top + 0.01));
    });

    testWidgets('a top request near the top edge flips below', (WidgetTester tester) async {
      await pumpOverlay(
        tester,
        position: const HoronOverlayPosition(side: HoronOverlaySide.top),
        triggerTopLeft: const Offset(150, 6),
        size: const Size(120, 200),
      );
      final Rect trigger = tester.getRect(find.byKey(triggerKey));
      final Rect panel = tester.getRect(find.byKey(panelKey));
      expect(panel.top, greaterThanOrEqualTo(trigger.bottom - 0.01));
    });

    testWidgets('a right request near the right edge flips left', (WidgetTester tester) async {
      await pumpOverlay(
        tester,
        position: const HoronOverlayPosition(side: HoronOverlaySide.right),
        triggerTopLeft: const Offset(290, 350),
        size: const Size(200, 60),
      );
      final Rect trigger = tester.getRect(find.byKey(triggerKey));
      final Rect panel = tester.getRect(find.byKey(panelKey));
      expect(panel.right, lessThanOrEqualTo(trigger.left + 0.01));
    });

    testWidgets('a left request near the left edge flips right', (WidgetTester tester) async {
      await pumpOverlay(
        tester,
        position: const HoronOverlayPosition(side: HoronOverlaySide.left),
        triggerTopLeft: const Offset(6, 350),
        size: const Size(200, 60),
      );
      final Rect trigger = tester.getRect(find.byKey(triggerKey));
      final Rect panel = tester.getRect(find.byKey(panelKey));
      expect(panel.left, greaterThanOrEqualTo(trigger.right - 0.01));
    });
  });

  group('the panel is pushed back inside the screen', () {
    testWidgets('an end-aligned panel wider than its room stays on screen', (WidgetTester tester) async {
      await pumpOverlay(
        tester,
        position: const HoronOverlayPosition(align: HoronOverlayAlign.end),
        triggerTopLeft: const Offset(290, 350),
        size: const Size(300, 80),
      );
      final Rect panel = tester.getRect(find.byKey(panelKey));
      expect(panel.left, greaterThanOrEqualTo(HoronOverlayPosition.screenMargin - 0.01));
      expect(panel.right, lessThanOrEqualTo(400 - HoronOverlayPosition.screenMargin + 0.01));
    });
  });

  group('the widget opens and closes', () {
    testWidgets('show paints the panel and hide removes it', (WidgetTester tester) async {
      final HoronOverlayController controller = HoronOverlayController();
      addTearDown(controller.dispose);

      await tester.pumpWidget(
        MaterialApp(
          home: Scaffold(
            body: Center(
              child: HoronOverlay(
                controller: controller,
                position: const HoronOverlayPosition(),
                trigger: const SizedBox(width: 100, height: 40),
                panelBuilder: (BuildContext context, HoronOverlayPlacement placement) =>
                    const SizedBox(key: panelKey, width: 80, height: 40),
              ),
            ),
          ),
        ),
      );
      expect(find.byKey(panelKey), findsNothing);

      controller.show();
      await tester.pump();
      await tester.pump(const Duration(milliseconds: 200));
      expect(find.byKey(panelKey), findsOneWidget);

      controller.hide();
      await tester.pump();
      expect(find.byKey(panelKey), findsNothing);
    });
  });
}
