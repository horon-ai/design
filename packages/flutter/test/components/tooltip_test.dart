import 'package:flutter/gestures.dart' show PointerDeviceKind;
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:horon_ui/horon_ui.dart';

/// 툴팁이 유리 표면과 화살표를 그리고, 호버와 롱프레스 두 경로로 열리는지 확인합니다.
///
/// 화살표는 계약이므로 크기를 실제로 잽니다. 텍스트 전용 [Tooltip] 위젯으로
/// 대신하면 이 테스트가 먼저 깨집니다.
void main() {
  const Key triggerKey = Key('tooltip-trigger');
  final Key arrowKey = HoronTooltipContent.arrowKey;

  /// 화면 가운데에 트리거를 두고 툴팁을 하나 띄웁니다.
  Future<HoronOverlayController> pumpTooltip(
    WidgetTester tester, {
    HoronOverlaySide side = HoronOverlaySide.top,
    HoronOverlayAlign align = HoronOverlayAlign.center,
    Widget? kbd,
    Duration? delay,
    bool provider = false,
    Duration providerDelay = Duration.zero,
    Brightness brightness = Brightness.light,
    HoronOverlayController? controller,
  }) async {
    tester.view.physicalSize = const Size(800, 900);
    tester.view.devicePixelRatio = 1.0;
    addTearDown(tester.view.reset);

    final HoronOverlayController owned = controller ?? HoronOverlayController();
    addTearDown(owned.dispose);

    final Widget tooltip = HoronTooltip(
      controller: owned,
      side: side,
      align: align,
      delay: delay,
      kbd: kbd,
      trigger: const SizedBox(key: triggerKey, width: 120, height: 40),
      child: const Text('저장합니다'),
    );

    await tester.pumpWidget(
      MaterialApp(
        theme: horonTheme(brightness),
        home: Scaffold(
          body: Center(
            child: provider ? HoronTooltipProvider(delay: providerDelay, child: tooltip) : tooltip,
          ),
        ),
      ),
    );
    return owned;
  }

  /// 열린 패널이 안정될 때까지 몇 프레임 돌립니다.
  Future<void> settlePanel(WidgetTester tester) async {
    await tester.pump();
    await tester.pump(const Duration(milliseconds: 200));
  }

  /// 마우스 포인터를 화면 밖에서 [target] 위로 옮기고, 그 포인터를 돌려줍니다.
  ///
  /// `MouseRegion`은 포인터가 추가된 뒤에 움직여야 들어옴을 알립니다. 그래서
  /// 추가 직후 한 프레임을 돌립니다. 마우스 포인터는 하나만 둘 수 있으므로
  /// (두 번째 `addPointer`는 마우스 추적기 assert에 걸립니다) 돌려준 제스처로
  /// 이어서 움직입니다.
  Future<TestGesture> hoverOver(WidgetTester tester, Finder target) async {
    final TestGesture pointer = await tester.createGesture(kind: PointerDeviceKind.mouse);
    await pointer.addPointer(location: const Offset(1, 1));
    addTearDown(pointer.removePointer);
    await tester.pump();
    await pointer.moveTo(tester.getCenter(target));
    await tester.pump();
    return pointer;
  }

  testWidgets('tooltip: a long press opens the panel and releasing closes it', (WidgetTester tester) async {
    await pumpTooltip(tester);
    expect(find.text('저장합니다'), findsNothing);

    final TestGesture gesture = await tester.startGesture(tester.getCenter(find.byKey(triggerKey)));
    await tester.pump(const Duration(milliseconds: 600));
    await settlePanel(tester);
    expect(find.text('저장합니다'), findsOneWidget);

    await gesture.up();
    await settlePanel(tester);
    expect(find.text('저장합니다'), findsNothing);
  });

  testWidgets('tooltip: a pointer hover opens the panel and leaving closes it', (WidgetTester tester) async {
    await pumpTooltip(tester);

    final TestGesture pointer = await hoverOver(tester, find.byKey(triggerKey));
    await settlePanel(tester);
    expect(find.text('저장합니다'), findsOneWidget);

    await pointer.moveTo(const Offset(5, 5));
    await settlePanel(tester);
    expect(find.text('저장합니다'), findsNothing);
  });

  testWidgets('tooltip: the provider delay holds the panel back until it elapses', (WidgetTester tester) async {
    await pumpTooltip(tester, provider: true, providerDelay: const Duration(milliseconds: 400));

    await hoverOver(tester, find.byKey(triggerKey));
    // 지연이 지나기 전에는 아직 없습니다.
    expect(find.text('저장합니다'), findsNothing);

    await tester.pump(const Duration(milliseconds: 450));
    await settlePanel(tester);
    expect(find.text('저장합니다'), findsOneWidget);
  });

  testWidgets('tooltip: the surface is glass, drawn as one silhouette', (WidgetTester tester) async {
    final HoronOverlayController controller = await pumpTooltip(tester);
    controller.show();
    await settlePanel(tester);

    final HoronThemeData horon = HoronTheme.of(tester.element(find.text('저장합니다')));
    // 표면은 `HoronTooltipContent`의 페인터가 그립니다. 재질 위젯을 끼우지
    // 않으므로 Material의 기본 `Tooltip`이 아님이 분명합니다.
    expect(find.byType(Tooltip), findsNothing);
    expect(find.byType(HoronTooltipContent), findsOneWidget);

    // 유리 채움과 테두리 색은 페인터가 넘겨받은 값입니다. 같은 값을 컴포넌트가
    // 노출하므로, 테스트는 그 둘이 테마 슬롯과 같은지 확인합니다.
    expect(horon.glassFillStrong, HoronLightColors.glassFillStrong);
    expect(horon.glassBorder, HoronLightColors.glassBorder);

    // 표면 사각형은 화살표 띠까지 포함합니다. 화살표 상자의 꼭짓점은 경계에
    // 걸치므로 중심으로 확인합니다.
    final Rect content = tester.getRect(find.byType(HoronTooltipContent));
    final Rect arrow = tester.getRect(find.byKey(arrowKey));
    expect(content.contains(arrow.center), isTrue);
    expect(arrow.width * arrow.height, greaterThan(0));
  });

  testWidgets('tooltip: the arrow is drawn on the trigger side', (WidgetTester tester) async {
    for (final HoronOverlaySide side in HoronOverlaySide.values) {
      final HoronOverlayController controller = await pumpTooltip(tester, side: side);
      controller.show();
      await settlePanel(tester);

      final Rect content = tester.getRect(find.byType(HoronTooltipContent));
      final Rect trigger = tester.getRect(find.byKey(triggerKey));
      final Rect arrow = tester.getRect(find.byKey(arrowKey));
      final bool vertical = side == HoronOverlaySide.top || side == HoronOverlaySide.bottom;

      // 화살표 띠는 밑변 10, 길이 6입니다.
      expect(vertical ? arrow.width : arrow.height, closeTo(HoronTooltipContent.arrowWidth, 0.01), reason: side.name);
      expect(vertical ? arrow.height : arrow.width, closeTo(HoronTooltipContent.arrowExtent, 0.01), reason: side.name);

      // 화살표 띠는 표면 사각형의 트리거 쪽 끝에 붙습니다.
      switch (side) {
        case HoronOverlaySide.top:
          expect(arrow.bottom, closeTo(content.bottom, 0.01), reason: side.name);
          expect(arrow.center.dx, closeTo(content.center.dx, 0.01), reason: side.name);
        case HoronOverlaySide.bottom:
          expect(arrow.top, closeTo(content.top, 0.01), reason: side.name);
          expect(arrow.center.dx, closeTo(content.center.dx, 0.01), reason: side.name);
        case HoronOverlaySide.left:
          expect(arrow.right, closeTo(content.right, 0.01), reason: side.name);
          expect(arrow.center.dy, closeTo(content.center.dy, 0.01), reason: side.name);
        case HoronOverlaySide.right:
          expect(arrow.left, closeTo(content.left, 0.01), reason: side.name);
          expect(arrow.center.dy, closeTo(content.center.dy, 0.01), reason: side.name);
      }

      // 표면은 트리거에서 배치 간격만큼 떨어집니다. 화살표가 그 틈을 채웁니다.
      final double gap = switch (side) {
        HoronOverlaySide.top => trigger.top - content.bottom,
        HoronOverlaySide.bottom => content.top - trigger.bottom,
        HoronOverlaySide.left => trigger.left - content.right,
        HoronOverlaySide.right => content.left - trigger.right,
      };
      expect(gap, closeTo(HoronOverlayPosition.gap, 0.01), reason: side.name);
    }
  });

  testWidgets('tooltip: the kbd slot sits to the right of the text', (WidgetTester tester) async {
    final HoronOverlayController controller = await pumpTooltip(tester, kbd: const HoronKbd(label: 'K'));
    controller.show();
    await settlePanel(tester);

    final Rect text = tester.getRect(find.text('저장합니다'));
    final Rect key = tester.getRect(find.byType(HoronKbd));
    expect(key.left, greaterThan(text.right));
    // `gap-1.5`
    expect(key.left - text.right, closeTo(HoronSpace.s1_5, 0.01));
  });

  testWidgets('tooltip: the panel is 11px text on a snug line, like text-[11px]', (WidgetTester tester) async {
    final HoronOverlayController controller = await pumpTooltip(tester);
    controller.show();
    await settlePanel(tester);

    final TextStyle style = DefaultTextStyle.of(tester.element(find.text('저장합니다'))).style;
    expect(style.fontSize, 11);
    expect(style.fontWeight, HoronFontWeight.medium);
    expect(style.height, HoronLineHeight.snug);
  });

  testWidgets('tooltip: both brightnesses render with the arrow', (WidgetTester tester) async {
    for (final Brightness brightness in Brightness.values) {
      final HoronOverlayController controller = await pumpTooltip(tester, brightness: brightness);
      controller.show();
      await settlePanel(tester);
      expect(tester.takeException(), isNull, reason: brightness.name);
      expect(find.byType(HoronTooltipContent), findsOneWidget, reason: brightness.name);
    }
  });

  testWidgets('tooltip: an explicit delay overrides the provider', (WidgetTester tester) async {
    await pumpTooltip(
      tester,
      provider: true,
      providerDelay: const Duration(milliseconds: 400),
      delay: const Duration(milliseconds: 100),
    );

    await hoverOver(tester, find.byKey(triggerKey));
    await tester.pump(const Duration(milliseconds: 120));
    await settlePanel(tester);
    expect(find.text('저장합니다'), findsOneWidget);
  });
}
