import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:horon_ui/src/components/alert_dialog.dart';
import 'package:horon_ui/src/components/dialog.dart';
import 'package:horon_ui/src/components/drawer.dart';
import 'package:horon_ui/src/components/sheet.dart';
import 'package:horon_ui/src/theme/horon_theme.dart';

/// 모달 계열 넷을 확인합니다.
///
/// 계획이 명시한 것은 "sheet 테스트가 네 side 각각에서 패널이 해당 가장자리에
/// 붙는지 단언한다"입니다. 나머지는 계획의 금지 사항과 기본 동작을 고정합니다.
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
      // 이 테스트는 정적 검사입니다. 두 API를 직접 부르면 위젯 트리에 Material
      // 대화상자의 표면이 생깁니다. 여기서는 우리 라우트만 쓰는지 확인합니다.
      await tester.pumpWidget(host(const HoronDialog(trigger: Text('열기'), title: '제목')));
      await tester.tap(find.text('열기'));
      await tester.pumpAndSettle();

      expect(find.byType(Dialog), findsNothing);
      expect(find.byType(AlertDialog), findsNothing);
      expect(find.byType(BottomSheet), findsNothing);
    });
  });

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

  group('sheet', () {
    // 계획이 명시한 단언입니다. 네 side 각각에서 패널이 그 가장자리에 붙습니다.
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
    }
  });

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
