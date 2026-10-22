import 'package:flutter/gestures.dart' show PointerDeviceKind;
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:horon_ui/horon_ui.dart';

/// 미리보기 카드가 터치에서는 롱프레스로, 포인터에서는 호버로 열리는지 확인합니다.
///
/// 계획이 이름으로 지정한 두 시나리오가 여기 있습니다. 하나는 길게 누르면
/// 미리보기가 뜨고 놓으면 닫히는지, 다른 하나는 포인터가 빠지면 닫히는지입니다.
void main() {
  const Key triggerKey = Key('hover-card-trigger');

  /// 화면 가운데에 트리거를 두고 미리보기 카드를 하나 띄웁니다.
  Future<HoronOverlayController> pumpHoverCard(
    WidgetTester tester, {
    HoronOverlaySide side = HoronOverlaySide.bottom,
    Duration openDelay = Duration.zero,
    Duration closeDelay = Duration.zero,
    Brightness brightness = Brightness.light,
    ValueChanged<bool>? onOpenChanged,
    HoronOverlayController? controller,
  }) async {
    tester.view.physicalSize = const Size(800, 900);
    tester.view.devicePixelRatio = 1.0;
    addTearDown(tester.view.reset);

    final HoronOverlayController owned = controller ?? HoronOverlayController();
    addTearDown(owned.dispose);

    await tester.pumpWidget(
      MaterialApp(
        theme: horonTheme(brightness),
        home: Scaffold(
          body: Center(
            child: HoronHoverCard(
              controller: owned,
              side: side,
              openDelay: openDelay,
              closeDelay: closeDelay,
              onOpenChanged: onOpenChanged,
              trigger: const SizedBox(key: triggerKey, width: 120, height: 40),
              child: const Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: <Widget>[Text('Horon'), Text('디자인 시스템')],
              ),
            ),
          ),
        ),
      ),
    );
    return owned;
  }

  Future<void> settle(WidgetTester tester) async {
    await tester.pump();
    await tester.pump(const Duration(milliseconds: 200));
  }

  /// 마우스 포인터를 화면 밖에서 [target] 위로 옮기고, 그 포인터를 돌려줍니다.
  Future<TestGesture> hoverOver(WidgetTester tester, Finder target) async {
    final TestGesture pointer = await tester.createGesture(kind: PointerDeviceKind.mouse);
    await pointer.addPointer(location: const Offset(1, 1));
    addTearDown(pointer.removePointer);
    await tester.pump();
    await pointer.moveTo(tester.getCenter(target));
    await tester.pump();
    return pointer;
  }

  testWidgets('hover card: a long press opens the preview and releasing closes it', (WidgetTester tester) async {
    await pumpHoverCard(tester);
    expect(find.text('디자인 시스템'), findsNothing);

    final TestGesture gesture = await tester.startGesture(tester.getCenter(find.byKey(triggerKey)));
    await tester.pump(const Duration(milliseconds: 600));
    await settle(tester);
    expect(find.text('디자인 시스템'), findsOneWidget);

    await gesture.up();
    await settle(tester);
    expect(find.text('디자인 시스템'), findsNothing);
  });

  testWidgets('hover card: a pointer hover opens the preview and leaving closes it', (WidgetTester tester) async {
    await pumpHoverCard(tester);

    final TestGesture pointer = await hoverOver(tester, find.byKey(triggerKey));
    await settle(tester);
    expect(find.text('디자인 시스템'), findsOneWidget);

    await pointer.moveTo(const Offset(5, 5));
    await settle(tester);
    expect(find.text('디자인 시스템'), findsNothing);
  });

  testWidgets('hover card: the open delay holds the preview back', (WidgetTester tester) async {
    await pumpHoverCard(tester, openDelay: const Duration(milliseconds: 600));

    await hoverOver(tester, find.byKey(triggerKey));
    await tester.pump(const Duration(milliseconds: 300));
    expect(find.text('디자인 시스템'), findsNothing);

    await tester.pump(const Duration(milliseconds: 350));
    await settle(tester);
    expect(find.text('디자인 시스템'), findsOneWidget);
  });

  testWidgets('hover card: moving from the trigger into the card keeps it open', (WidgetTester tester) async {
    await pumpHoverCard(tester, closeDelay: const Duration(milliseconds: 300));

    final TestGesture pointer = await hoverOver(tester, find.byKey(triggerKey));
    await settle(tester);
    expect(find.text('디자인 시스템'), findsOneWidget);

    // 카드 위로 옮깁니다. 닫힘 타이머가 취소되어야 합니다.
    await pointer.moveTo(tester.getCenter(find.text('디자인 시스템')));
    await tester.pump(const Duration(milliseconds: 400));
    expect(find.text('디자인 시스템'), findsOneWidget);

    // 카드 밖으로 나가면 닫힙니다.
    await pointer.moveTo(const Offset(5, 5));
    await tester.pump(const Duration(milliseconds: 350));
    await settle(tester);
    expect(find.text('디자인 시스템'), findsNothing);
  });

  testWidgets('hover card: the surface is 256 wide with p-4, like w-64 p-4', (WidgetTester tester) async {
    final HoronOverlayController controller = await pumpHoverCard(tester);
    controller.show();
    await settle(tester);

    final Size panel = tester.getSize(find.byType(HoronHoverCardContent));
    expect(panel.width, closeTo(256, 0.01));

    // `p-4`: 본문 글자의 왼쪽이 패널 왼쪽에서 16 떨어집니다.
    final Rect content = tester.getRect(find.byType(HoronHoverCardContent));
    final Rect text = tester.getRect(find.text('Horon'));
    expect(text.left - content.left, closeTo(HoronSpace.s4, 0.01));
  });

  testWidgets('hover card: the surface uses the glass fill', (WidgetTester tester) async {
    final HoronOverlayController controller = await pumpHoverCard(tester);
    controller.show();
    await settle(tester);

    final HoronThemeData horon = HoronTheme.of(tester.element(find.text('Horon')));
    final Iterable<DecoratedBox> boxes = tester.widgetList<DecoratedBox>(
      find.descendant(of: find.byType(HoronOverlayPanel), matching: find.byType(DecoratedBox)),
    );
    final BoxDecoration decoration = boxes.first.decoration as BoxDecoration;
    expect(decoration.color, horon.glassFillStrong);
  });

  testWidgets('hover card: it opens below the trigger by default', (WidgetTester tester) async {
    final HoronOverlayController controller = await pumpHoverCard(tester);
    controller.show();
    await settle(tester);

    final Rect trigger = tester.getRect(find.byKey(triggerKey));
    final Rect panel = tester.getRect(find.byType(HoronHoverCardContent));
    expect(panel.top, greaterThanOrEqualTo(trigger.bottom));
  });

  testWidgets('hover card: onOpenChanged reports each transition once', (WidgetTester tester) async {
    final List<bool> changes = <bool>[];
    await pumpHoverCard(tester, onOpenChanged: changes.add);

    final TestGesture gesture = await tester.startGesture(tester.getCenter(find.byKey(triggerKey)));
    await tester.pump(const Duration(milliseconds: 600));
    await settle(tester);
    await gesture.up();
    await settle(tester);

    expect(changes, <bool>[true, false]);
  });

  testWidgets('hover card: both brightnesses render', (WidgetTester tester) async {
    for (final Brightness brightness in Brightness.values) {
      final HoronOverlayController controller = await pumpHoverCard(tester, brightness: brightness);
      controller.show();
      await settle(tester);
      expect(tester.takeException(), isNull, reason: brightness.name);
      expect(find.byType(HoronHoverCardContent), findsOneWidget, reason: brightness.name);
    }
  });
}
