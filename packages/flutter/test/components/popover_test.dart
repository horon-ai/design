import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:horon_ui/horon_ui.dart';

/// 팝오버가 열리고 닫히는지, 그리고 배치가 공유 위치 유틸을 쓰는지 확인합니다.
///
/// 패널 위치는 실제 위젯 사각형으로 잽니다. 배치 산수를 테스트가 다시 구현하면
/// 계산이 틀려도 테스트가 같이 틀립니다.
void main() {
  const Key triggerKey = Key('popover-trigger');
  const Key panelKey = Key('popover-panel');
  const Key outsideKey = Key('popover-outside');

  /// 화면 가운데에 트리거를 두고 팝오버를 하나 띄웁니다.
  Future<HoronOverlayController> pumpPopover(
    WidgetTester tester, {
    HoronOverlaySide side = HoronOverlaySide.bottom,
    HoronOverlayAlign align = HoronOverlayAlign.center,
    Offset offset = Offset.zero,
    bool enabled = true,
    bool open = false,
    Brightness brightness = Brightness.light,
    ValueChanged<bool>? onOpenChanged,
    double? width = 288,
  }) async {
    tester.view.physicalSize = const Size(800, 900);
    tester.view.devicePixelRatio = 1.0;
    addTearDown(tester.view.reset);

    final HoronOverlayController controller = HoronOverlayController();
    addTearDown(controller.dispose);

    await tester.pumpWidget(
      MaterialApp(
        theme: horonTheme(brightness),
        home: Scaffold(
          body: Stack(
            children: <Widget>[
              Positioned(
                right: HoronSpace.s2,
                bottom: HoronSpace.s2,
                child: SizedBox(key: outsideKey, width: 80, height: 40),
              ),
              Center(
                child: HoronPopover(
                  controller: controller,
                  side: side,
                  align: align,
                  offset: offset,
                  width: width,
                  enabled: enabled,
                  onOpenChanged: onOpenChanged,
                  trigger: const SizedBox(key: triggerKey, width: 120, height: 40),
                  child: const Text('임의의 내용'),
                ),
              ),
            ],
          ),
        ),
      ),
    );

    if (open) {
      controller.show();
      await tester.pump();
      await tester.pump(const Duration(milliseconds: 200));
    }
    return controller;
  }

  testWidgets('popover: a tap opens the panel and a second tap closes it', (WidgetTester tester) async {
    final HoronOverlayController controller = await pumpPopover(tester);
    expect(find.byKey(panelKey), findsNothing);
    expect(find.text('임의의 내용'), findsNothing);

    // 트리거를 감싼 `GestureDetector`가 불투명하게 hit test하므로, 안쪽
    // `SizedBox`는 hit test 결과에 자기 자신으로 나타나지 않습니다. 경고를
    // 끄고 누릅니다.
    await tester.tap(find.byKey(triggerKey), warnIfMissed: false);
    await tester.pump();
    await tester.pump(const Duration(milliseconds: 200));
    expect(find.text('임의의 내용'), findsOneWidget);
    expect(controller.isOpen, isTrue);

    await tester.tap(find.byKey(triggerKey), warnIfMissed: false);
    await tester.pump();
    await tester.pump(const Duration(milliseconds: 200));
    expect(find.text('임의의 내용'), findsNothing);
    expect(controller.isOpen, isFalse);
  });

  testWidgets('popover: a tap outside closes it', (WidgetTester tester) async {
    await pumpPopover(tester, open: true);
    expect(find.text('임의의 내용'), findsOneWidget);

    await tester.tap(find.byKey(outsideKey));
    await tester.pump();
    await tester.pump(const Duration(milliseconds: 200));
    expect(find.text('임의의 내용'), findsNothing);
  });

  group('popover: the panel sits on the requested side', () {
    for (final HoronOverlaySide side in HoronOverlaySide.values) {
      testWidgets('${side.name} puts the panel on its own side', (WidgetTester tester) async {
        await pumpPopover(tester, side: side, open: true);

        final Rect trigger = tester.getRect(find.byKey(triggerKey));
        final Rect panel = tester.getRect(find.byType(HoronPopoverContent));

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

  testWidgets('popover: align moves the panel along the cross axis', (WidgetTester tester) async {
    // React의 `align`은 고정 폭 패널을 트리거의 어느 변에 맞추는지입니다.
    // start는 왼쪽 변, center는 가운데, end는 오른쪽 변을 맞춥니다. 패널(288)이
    // 트리거(120)보다 넓으므로 세 값은 서로 다른 왼쪽 좌표를 냅니다.
    final Map<HoronOverlayAlign, Rect> panels = <HoronOverlayAlign, Rect>{};
    for (final HoronOverlayAlign align in HoronOverlayAlign.values) {
      await pumpPopover(tester, align: align, open: true);
      panels[align] = tester.getRect(find.byType(HoronPopoverContent));
    }

    final Rect trigger = tester.getRect(find.byKey(triggerKey));
    expect(panels[HoronOverlayAlign.start]!.left, closeTo(trigger.left, 0.01));
    expect(panels[HoronOverlayAlign.center]!.center.dx, closeTo(trigger.center.dx, 0.01));
    expect(panels[HoronOverlayAlign.end]!.right, closeTo(trigger.right, 0.01));
  });

  testWidgets('popover: the offset argument shifts the panel', (WidgetTester tester) async {
    await pumpPopover(tester, open: true);
    final Rect plain = tester.getRect(find.byType(HoronPopoverContent));

    await pumpPopover(tester, offset: const Offset(0, 40), open: true);
    final Rect shifted = tester.getRect(find.byType(HoronPopoverContent));

    expect(shifted.top - plain.top, closeTo(40, 0.01));
  });

  testWidgets('popover: the panel is 288 wide by default, like w-72', (WidgetTester tester) async {
    await pumpPopover(tester, open: true);
    expect(tester.getSize(find.byType(HoronPopoverContent)).width, closeTo(288, 0.01));

    // `width: null`은 내용 폭에 맞춥니다.
    await pumpPopover(tester, open: true, width: null);
    expect(tester.getSize(find.byType(HoronPopoverContent)).width, lessThan(288));
  });

  testWidgets('popover: a disabled trigger does not open the panel', (WidgetTester tester) async {
    await pumpPopover(tester, enabled: false);

    await tester.tap(find.byKey(triggerKey), warnIfMissed: false);
    await tester.pump();
    await tester.pump(const Duration(milliseconds: 200));
    expect(find.text('임의의 내용'), findsNothing);
  });

  testWidgets('popover: onOpenChanged reports each transition once', (WidgetTester tester) async {
    final List<bool> changes = <bool>[];
    await pumpPopover(tester, onOpenChanged: changes.add);

    await tester.tap(find.byKey(triggerKey), warnIfMissed: false);
    await tester.pump();
    await tester.pump(const Duration(milliseconds: 200));
    await tester.tap(find.byKey(triggerKey), warnIfMissed: false);
    await tester.pump();
    await tester.pump(const Duration(milliseconds: 200));

    expect(changes, <bool>[true, false]);
  });

  testWidgets('popover: both brightnesses render', (WidgetTester tester) async {
    for (final Brightness brightness in Brightness.values) {
      await pumpPopover(tester, brightness: brightness, open: true);
      expect(tester.takeException(), isNull, reason: brightness.name);
      expect(find.text('임의의 내용'), findsOneWidget, reason: brightness.name);
    }
  });

  testWidgets('popover: the anchor takes only the width of its child', (WidgetTester tester) async {
    await tester.pumpWidget(
      MaterialApp(
        theme: horonTheme(Brightness.light),
        home: const Scaffold(
          body: Center(child: HoronPopoverAnchor(child: SizedBox(width: 90, height: 30))),
        ),
      ),
    );

    expect(tester.getSize(find.byType(HoronPopoverAnchor)).width, closeTo(90, 0.01));
  });
}
