import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:horon_ui/horon_ui.dart';

/// 시트를 확인합니다.
///
/// 계획이 명시한 단언은 "네 side 각각에서 패널이 해당 가장자리에 붙는지"입니다.
/// 2026-10-22 캡처에서 패널이 화면을 넘었으므로, 넘지 않는지도 함께 고정합니다.
void main() {
  Widget host(Widget child, {Brightness brightness = Brightness.light}) => MaterialApp(
    theme: horonTheme(brightness),
    home: Scaffold(body: Center(child: child)),
  );

  group('sheet', () {
    testWidgets('bottom side hugs the bottom edge', (WidgetTester tester) async {
      await tester.pumpWidget(host(const HoronSheet(trigger: Text('열기'), title: '시트', side: HoronSheetSide.bottom)));
      await tester.tap(find.text('열기'));
      await tester.pumpAndSettle();

      final Rect panel = tester.getRect(find.byType(HoronSheetHeader));
      final Size screen = tester.view.physicalSize / tester.view.devicePixelRatio;
      // 헤더는 패널 위쪽에 있으므로, 패널 바닥은 화면 바닥입니다.
      expect(panel.top, greaterThan(screen.height / 2));
    });

    for (final HoronSheetSide side in HoronSheetSide.values) {
      testWidgets('$side places the panel against its edge', (WidgetTester tester) async {
        await tester.pumpWidget(host(HoronSheet(trigger: const Text('열기'), title: '시트', side: side)));
        await tester.tap(find.text('열기'));
        await tester.pumpAndSettle();

        final Rect header = tester.getRect(find.byType(HoronSheetHeader));
        final Size screen = tester.view.physicalSize / tester.view.devicePixelRatio;

        switch (side) {
          case HoronSheetSide.bottom:
            expect(header.top, greaterThan(screen.height / 2));
          case HoronSheetSide.top:
            expect(header.bottom, lessThan(screen.height / 2));
          case HoronSheetSide.left:
            expect(header.left, lessThan(screen.width / 2));
          case HoronSheetSide.right:
            expect(header.right, greaterThan(screen.width / 2));
        }
      });

      // 2026-10-22 캡처에서 오른쪽·왼쪽 패널이 화면 밖으로 넘쳤습니다. 그 회귀를
      // 잡는 단언입니다. 패널 자체는 배럴에 없는 내부 타입이라, 패널 폭을 꽉
      // 채우는 헤더의 사각형으로 대신 잽니다.
      testWidgets('$side panel stays inside the screen', (WidgetTester tester) async {
        await tester.pumpWidget(host(HoronSheet(trigger: const Text('열기'), title: '시트', side: side)));
        await tester.tap(find.text('열기'));
        await tester.pumpAndSettle();

        final Size screen = tester.view.physicalSize / tester.view.devicePixelRatio;
        final Rect header = tester.getRect(find.byType(HoronSheetHeader));

        expect(header.left, greaterThanOrEqualTo(-0.5));
        expect(header.right, lessThanOrEqualTo(screen.width + 0.5));
        // 세로 방향은 화면의 3/4 폭, 가로 방향은 화면 폭입니다.
        final double expectedMaxWidth = side == HoronSheetSide.left || side == HoronSheetSide.right
            ? screen.width * 0.75 + 1
            : screen.width + 1;
        expect(header.width, lessThanOrEqualTo(expectedMaxWidth));
      });
    }
  });
}
