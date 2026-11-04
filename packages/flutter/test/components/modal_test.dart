import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:horon_ui/horon_ui.dart';

/// `HoronModal`의 크기·표면·스크롤·닫기를 확인합니다.
void main() {
  Future<void> pumpModal(
    WidgetTester tester, {
    HoronModalSize size = HoronModalSize.md,
    HoronModalSurfaceKind surface = HoronModalSurfaceKind.solid,
    Widget? child,
  }) async {
    await tester.pumpWidget(
      MaterialApp(
        theme: horonTheme(Brightness.light),
        home: Scaffold(
          body: Center(
            child: HoronModal(
              size: size,
              surface: surface,
              title: const Text('워크스페이스 삭제'),
              description: const Text('이 작업은 되돌릴 수 없습니다.'),
              footer: const HoronModalFooter(children: <Widget>[Text('취소')]),
              child: child ?? const Text('본문'),
            ),
          ),
        ),
      ),
    );
    await tester.pump();
  }

  HoronThemeData themeOf(WidgetTester tester) => HoronTheme.of(tester.element(find.byType(HoronModal)));

  testWidgets('each size takes its React width', (WidgetTester tester) async {
    for (final (HoronModalSize size, double width) in <(HoronModalSize, double)>[
      (HoronModalSize.sm, 400),
      (HoronModalSize.md, 560),
      (HoronModalSize.lg, 720),
    ]) {
      await pumpModal(tester, size: size);
      expect(tester.getSize(find.byType(HoronModal)).width, width, reason: '${size.name} 폭');
    }
  });

  testWidgets('solid fills with bg-surface and glass lays the veil', (WidgetTester tester) async {
    await pumpModal(tester);
    final HoronThemeData theme = themeOf(tester);

    Finder surfaceColored(Color color) => find.descendant(
      of: find.byType(HoronModal),
      matching: find.byWidgetPredicate(
        (Widget widget) =>
            widget is DecoratedBox &&
            widget.decoration is BoxDecoration &&
            (widget.decoration as BoxDecoration).color == color,
      ),
    );

    expect(surfaceColored(theme.colors.bgSurface), findsOneWidget, reason: 'solid는 bg-surface');
    expect(find.byType(BackdropFilter), findsNothing);

    await pumpModal(tester, surface: HoronModalSurfaceKind.glass);

    expect(find.byType(BackdropFilter), findsOneWidget, reason: 'glass는 8px 흐림 위의 베일');
    expect(
      find.descendant(
        of: find.byType(HoronModal),
        matching: find.byWidgetPredicate(
          (Widget widget) => widget is ColoredBox && widget.color == theme.colors.bgSurface75,
        ),
      ),
      findsOneWidget,
      reason: '베일 채움은 75% 표면입니다',
    );
    expect(surfaceColored(theme.colors.bgSurface), findsNothing, reason: 'glass는 불투명 채움을 쓰지 않습니다');
  });

  testWidgets('a long body scrolls inside the viewport height', (WidgetTester tester) async {
    await pumpModal(tester, child: const SizedBox(height: 2000, child: Text('긴 본문')));

    final Size screen = tester.view.physicalSize / tester.view.devicePixelRatio;
    expect(tester.getSize(find.byType(HoronModal)).height, screen.height - 32, reason: 'max-h-[calc(100dvh-2rem)]');
    final ScrollableState scrollable = tester.state<ScrollableState>(find.byType(Scrollable).first);
    expect(scrollable.position.maxScrollExtent, greaterThan(0), reason: '본문만 스크롤합니다');
    expect(find.text('취소'), findsOneWidget, reason: 'footer는 스크롤 밖에 남습니다');
  });

  testWidgets('the close button dismisses the modal route', (WidgetTester tester) async {
    await tester.pumpWidget(
      MaterialApp(
        theme: horonTheme(Brightness.light),
        home: Scaffold(
          body: Builder(
            builder: (BuildContext context) => TextButton(
              onPressed: () => showHoronModalContent<void>(
                context,
                title: const Text('워크스페이스 삭제'),
                description: const Text('이 작업은 되돌릴 수 없습니다.'),
                footer: const HoronModalFooter(children: <Widget>[Text('취소')]),
                child: const Text('본문'),
              ),
              child: const Text('열기'),
            ),
          ),
        ),
      ),
    );

    await tester.tap(find.text('열기'));
    await tester.pumpAndSettle();
    expect(find.text('워크스페이스 삭제'), findsOneWidget);
    expect(find.byType(HoronModal), findsOneWidget);

    await tester.tap(find.byIcon(Icons.close));
    await tester.pumpAndSettle();
    expect(find.byType(HoronModal), findsNothing, reason: '닫기 버튼이 라우트를 닫습니다');
    expect(tester.takeException(), isNull);
  });
}
