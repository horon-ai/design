import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:horon_ui/horon_ui.dart';

/// 드로어를 확인합니다.
void main() {
  Widget host(Widget child, {Brightness brightness = Brightness.light}) => MaterialApp(
    theme: horonTheme(brightness),
    home: Scaffold(body: Center(child: child)),
  );

  group('drawer', () {
    testWidgets('left drawer sits in the left half', (WidgetTester tester) async {
      await tester.pumpWidget(host(const HoronDrawer(trigger: Text('열기'), title: '드로어')));
      await tester.tap(find.text('열기'));
      await tester.pumpAndSettle();

      final Rect title = tester.getRect(find.text('드로어'));
      final Size screen = tester.view.physicalSize / tester.view.devicePixelRatio;
      expect(title.left, lessThan(screen.width / 2));
    });

    testWidgets('right drawer sits in the right half', (WidgetTester tester) async {
      await tester.pumpWidget(host(const HoronDrawer(trigger: Text('열기'), title: '드로어', side: HoronDrawerSide.right)));
      await tester.tap(find.text('열기'));
      await tester.pumpAndSettle();

      final Rect title = tester.getRect(find.text('드로어'));
      final Size screen = tester.view.physicalSize / tester.view.devicePixelRatio;
      expect(title.right, greaterThan(screen.width / 2));
    });

    testWidgets('a flick towards the edge closes it', (WidgetTester tester) async {
      await tester.pumpWidget(host(const HoronDrawer(trigger: Text('열기'), title: '드로어')));
      await tester.tap(find.text('열기'));
      await tester.pumpAndSettle();
      expect(find.text('드로어'), findsOneWidget);

      await tester.fling(find.text('드로어'), const Offset(-400, 0), 2000);
      await tester.pumpAndSettle();
      expect(find.text('드로어'), findsNothing);
    });
  });
}
