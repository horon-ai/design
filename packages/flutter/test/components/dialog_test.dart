import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:horon_ui/horon_ui.dart';

/// 다이얼로그를 확인합니다.
///
/// 계획의 금지 사항(showDialog 미사용, 스크림은 토큰)과 기본 동작을 고정합니다.
void main() {
  Widget host(Widget child, {Brightness brightness = Brightness.light}) => MaterialApp(
    theme: horonTheme(brightness),
    home: Scaffold(body: Center(child: child)),
  );

  group('dialog', () {
    testWidgets('a tap opens the dialog and shows title and description', (WidgetTester tester) async {
      await tester.pumpWidget(host(const HoronDialog(trigger: Text('열기'), title: '제목입니다', description: '설명입니다')));
      expect(find.text('제목입니다'), findsNothing);

      await tester.tap(find.text('열기'));
      await tester.pumpAndSettle();

      expect(find.text('제목입니다'), findsOneWidget);
      expect(find.text('설명입니다'), findsOneWidget);
    });

    testWidgets('the scrim is the token scrim, not Colors.black54', (WidgetTester tester) async {
      await tester.pumpWidget(host(const HoronDialog(trigger: Text('열기'), title: '제목')));
      await tester.tap(find.text('열기'));
      await tester.pumpAndSettle();

      // `barrierColor`는 토큰 스크림입니다. `Colors.black54`(0x8A000000)가 아닙니다.
      final ThemeData theme = Theme.of(tester.element(find.text('제목')));
      expect(theme.colorScheme.scrim, isNot(const Color(0x8A000000)));
    });

    testWidgets('tapping the scrim dismisses when dismissible', (WidgetTester tester) async {
      await tester.pumpWidget(host(const HoronDialog(trigger: Text('열기'), title: '제목')));
      await tester.tap(find.text('열기'));
      await tester.pumpAndSettle();
      expect(find.text('제목'), findsOneWidget);

      // 왼쪽 위 모서리는 스크림입니다.
      await tester.tapAt(const Offset(4, 4));
      await tester.pumpAndSettle();
      expect(find.text('제목'), findsNothing);
    });

    testWidgets('dismissible: false keeps the dialog open on a scrim tap', (WidgetTester tester) async {
      await tester.pumpWidget(host(const HoronDialog(trigger: Text('열기'), title: '제목', dismissible: false)));
      await tester.tap(find.text('열기'));
      await tester.pumpAndSettle();

      await tester.tapAt(const Offset(4, 4));
      await tester.pumpAndSettle();
      expect(find.text('제목'), findsOneWidget);
    });

    testWidgets('does not expose Material showDialog or showModalBottomSheet', (WidgetTester tester) async {
      await tester.pumpWidget(host(const HoronDialog(trigger: Text('열기'), title: '제목')));
      await tester.tap(find.text('열기'));
      await tester.pumpAndSettle();

      expect(find.byType(Dialog), findsNothing);
      expect(find.byType(AlertDialog), findsNothing);
      expect(find.byType(BottomSheet), findsNothing);
    });
  });
}
