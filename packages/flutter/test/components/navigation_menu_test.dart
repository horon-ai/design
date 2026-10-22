import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:horon_ui/horon_ui.dart';

/// 내비게이션 메뉴가 열리고 닫히는지, 그리고 배치가 공유 유틸을 쓰는지 확인합니다.
void main() {
  Widget host({bool? openAsSheet}) => MaterialApp(
    theme: horonTheme(Brightness.light),
    home: Scaffold(
      body: Align(
        alignment: Alignment.topLeft,
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: HoronNavigationMenu(
            openAsSheet: openAsSheet ?? false,
            semanticLabel: '제품',
            trigger: const Text('제품'),
            children: <Widget>[
              HoronNavigationMenuLink(label: '개요', description: '한눈에 보기'),
              HoronNavigationMenuLink(label: '가격', onSelected: () {}),
            ],
          ),
        ),
      ),
    ),
  );

  testWidgets('a tap opens the flyout and a second tap closes it', (WidgetTester tester) async {
    await tester.pumpWidget(host());
    expect(find.text('개요'), findsNothing);

    await tester.tap(find.text('제품'));
    await tester.pump();
    await tester.pump(const Duration(milliseconds: 200));
    expect(find.text('개요'), findsOneWidget);
    expect(find.text('가격'), findsOneWidget);

    await tester.tap(find.text('제품'));
    await tester.pump();
    await tester.pump(const Duration(milliseconds: 200));
    expect(find.text('개요'), findsNothing);
  });

  testWidgets('the flyout is placed by the shared positioner below the trigger', (WidgetTester tester) async {
    await tester.pumpWidget(host());
    await tester.tap(find.text('제품'));
    await tester.pump();
    await tester.pump(const Duration(milliseconds: 200));

    final Rect trigger = tester.getRect(find.text('제품'));
    final Rect panel = tester.getRect(find.text('개요'));
    // 공유 위치 유틸이 트리거 아래에 놓습니다.
    expect(panel.top, greaterThanOrEqualTo(trigger.bottom - 0.01));
  });

  testWidgets('touch mode opens the same content as a sheet-width panel', (WidgetTester tester) async {
    await tester.pumpWidget(host(openAsSheet: true));
    await tester.tap(find.text('제품'));
    await tester.pump();
    await tester.pump(const Duration(milliseconds: 200));
    expect(find.text('개요'), findsOneWidget);
  });

  testWidgets('the menu list lays items out in a row', (WidgetTester tester) async {
    await tester.pumpWidget(
      MaterialApp(
        theme: horonTheme(Brightness.light),
        home: Scaffold(
          body: HoronNavigationMenuList(
            children: <Widget>[
              HoronNavigationMenuItem(child: const Text('하나')),
              HoronNavigationMenuItem(child: const Text('둘')),
            ],
          ),
        ),
      ),
    );

    final Rect first = tester.getRect(find.text('하나'));
    final Rect second = tester.getRect(find.text('둘'));
    expect(second.left, greaterThan(first.right));
  });

  testWidgets('a disabled link does not call its callback', (WidgetTester tester) async {
    int taps = 0;
    await tester.pumpWidget(
      MaterialApp(
        theme: horonTheme(Brightness.light),
        home: Scaffold(
          body: HoronNavigationMenuLink(label: '꺼짐', enabled: false, onSelected: () => taps++),
        ),
      ),
    );
    await tester.tap(find.text('꺼짐'));
    await tester.pump();
    expect(taps, 0);
  });
}
