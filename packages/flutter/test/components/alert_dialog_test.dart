import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:horon_ui/horon_ui.dart';

/// 확인 다이얼로그를 확인합니다.
void main() {
  Widget host(Widget child, {Brightness brightness = Brightness.light}) => MaterialApp(
    theme: horonTheme(brightness),
    home: Scaffold(body: Center(child: child)),
  );

  group('alert dialog', () {
    testWidgets('shows both footer buttons and calls onConfirm', (WidgetTester tester) async {
      int confirms = 0;
      await tester.pumpWidget(
        host(
          HoronAlertDialog(
            trigger: const Text('열기'),
            title: '삭제할까요?',
            cancelLabel: '취소',
            confirmLabel: '삭제',
            onConfirm: () => confirms++,
          ),
        ),
      );
      await tester.tap(find.text('열기'));
      await tester.pumpAndSettle();

      expect(find.text('취소'), findsOneWidget);
      expect(find.text('삭제'), findsOneWidget);

      await tester.tap(find.text('삭제'));
      await tester.pumpAndSettle();
      expect(confirms, 1);
    });

    testWidgets('the destructive variant uses the error colour', (WidgetTester tester) async {
      await tester.pumpWidget(
        host(const HoronAlertDialog(trigger: Text('열기'), title: '삭제할까요?', confirmLabel: '삭제', destructive: true)),
      );
      await tester.tap(find.text('열기'));
      await tester.pumpAndSettle();

      final BuildContext context = tester.element(find.text('삭제'));
      expect(find.text('삭제'), findsOneWidget);
      expect(Theme.of(context).colorScheme.error, isNotNull);
    });
  });
}
