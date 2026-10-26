import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:horon_ui/horon_ui.dart';

/// `menubar`가 폭에 따라 나타나고 사라지는지, 트리거가 드롭다운을 여는지
/// 확인합니다.
void main() {
  /// 주어진 폭의 화면에서 메뉴 바를 그립니다.
  Widget host(Widget child, {required Size screen, Brightness brightness = Brightness.light}) => MaterialApp(
    theme: horonTheme(brightness),
    home: MediaQuery(
      data: MediaQueryData(size: screen),
      child: Scaffold(
        body: Align(alignment: Alignment.topLeft, child: child),
      ),
    ),
  );

  Widget sample({VoidCallback? onNew}) => HoronMenubar(
    semanticLabel: '편집기 메뉴',
    children: <Widget>[
      HoronMenubarMenu(
        trigger: const HoronMenubarTrigger(label: '파일'),
        children: <Widget>[
          HoronMenubarItem(label: '새로 만들기', onSelected: onNew),
          const HoronMenubarSeparator(),
          HoronMenubarItem(label: '닫기', onSelected: () {}),
        ],
      ),
      HoronMenubarMenu(
        trigger: const HoronMenubarTrigger(label: '편집'),
        children: <Widget>[
          const HoronMenubarLabel(label: '최근'),
          HoronMenubarItem(label: '되돌리기'),
        ],
      ),
    ],
  );

  testWidgets('the bar is hidden below the tablet breakpoint', (WidgetTester tester) async {
    await tester.pumpWidget(host(sample(), screen: const Size(600, 800)));

    expect(find.text('파일'), findsNothing);
    expect(find.text('편집'), findsNothing);
  });

  testWidgets('the bar shows at tablet and desktop widths', (WidgetTester tester) async {
    for (final double width in <double>[HoronBreakpoint.md, HoronBreakpoint.lg, 1440]) {
      await tester.pumpWidget(host(sample(), screen: Size(width, 800)));

      expect(find.text('파일'), findsOneWidget, reason: 'width=$width');
      expect(find.text('편집'), findsOneWidget, reason: 'width=$width');
    }
  });

  testWidgets('a trigger opens its menu below the bar', (WidgetTester tester) async {
    await tester.pumpWidget(host(sample(), screen: const Size(1024, 800)));
    expect(find.text('새로 만들기'), findsNothing);

    await tester.tap(find.text('파일'));
    await tester.pump();
    await tester.pump(const Duration(milliseconds: 200));

    expect(find.text('새로 만들기'), findsOneWidget);
    final Rect bar = tester.getRect(find.text('파일'));
    final Rect item = tester.getRect(find.text('새로 만들기'));
    expect(item.top, greaterThan(bar.top));
  });

  testWidgets('choosing an item calls back and closes the menu', (WidgetTester tester) async {
    int created = 0;
    await tester.pumpWidget(host(sample(onNew: () => created++), screen: const Size(1024, 800)));

    await tester.tap(find.text('파일'));
    await tester.pump();
    await tester.pump(const Duration(milliseconds: 200));

    await tester.tap(find.text('새로 만들기'));
    await tester.pump();
    await tester.pump(const Duration(milliseconds: 200));

    expect(created, 1);
    expect(find.text('새로 만들기'), findsNothing);
  });

  testWidgets('a disabled item in the bar does not call back', (WidgetTester tester) async {
    int created = 0;
    await tester.pumpWidget(
      host(
        HoronMenubar(
          children: <Widget>[
            HoronMenubarMenu(
              trigger: const HoronMenubarTrigger(label: '파일'),
              children: <Widget>[HoronMenubarItem(label: '꺼짐', enabled: false, onSelected: () => created++)],
            ),
          ],
        ),
        screen: const Size(1024, 800),
      ),
    );

    await tester.tap(find.text('파일'));
    await tester.pump();
    await tester.pump(const Duration(milliseconds: 200));

    await tester.tap(find.text('꺼짐'));
    await tester.pump();

    expect(created, 0);
  });

  testWidgets('the bar renders on both brightnesses', (WidgetTester tester) async {
    for (final Brightness brightness in Brightness.values) {
      await tester.pumpWidget(host(sample(), screen: const Size(1024, 800), brightness: brightness));

      expect(find.text('파일'), findsOneWidget);
    }
  });
}
