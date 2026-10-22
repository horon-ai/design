import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:horon_ui/horon_ui.dart';

/// `menu` 패널과 그 부품을 확인합니다.
///
/// 계획이 이름으로 지정한 단언은 **패널 폭 200**입니다. React의 `menu.tsx`가
/// `w-[200px]`를 고정 폭으로 쓰기 때문에, 호스트가 폭을 넘기지 않으면 정확히
/// 200이어야 합니다.
void main() {
  Widget host(Widget child, {Brightness brightness = Brightness.light}) => MaterialApp(
    theme: horonTheme(brightness),
    home: Scaffold(
      body: Align(alignment: Alignment.topLeft, child: child),
    ),
  );

  Widget sampleMenu({String? shortcut}) => HoronMenu(
    semanticLabel: '계정 메뉴',
    children: <Widget>[
      const HoronMenuLabel(label: '계정'),
      HoronMenuItem(label: '프로필', onSelected: () {}),
      const HoronMenuSeparator(),
      HoronMenuItem(
        label: '로그아웃',
        onSelected: () {},
        trailing: shortcut == null ? null : HoronMenuShortcut(label: shortcut),
      ),
      const HoronMenuItem(label: '꺼진 항목', enabled: false),
    ],
  );

  testWidgets('the panel is exactly 200 wide by default', (WidgetTester tester) async {
    await tester.pumpWidget(host(sampleMenu()));

    final Rect panel = tester.getRect(find.byKey(HoronMenu.panelKey));
    expect(panel.width, HoronMenuMetrics.width);
    expect(panel.width, 200);
  });

  testWidgets('a host can widen the panel and the parts follow it', (WidgetTester tester) async {
    await tester.pumpWidget(host(HoronMenu(width: 260, children: <Widget>[HoronMenuItem(label: '하나')])));

    expect(tester.getRect(find.byKey(HoronMenu.panelKey)).width, 260);
    expect(find.text('하나'), findsOneWidget);
  });

  testWidgets('label, items, separator and shortcut all render in order', (WidgetTester tester) async {
    await tester.pumpWidget(host(sampleMenu(shortcut: 'Cmd+K')));

    expect(find.text('계정'), findsOneWidget);
    expect(find.text('프로필'), findsOneWidget);
    expect(find.text('로그아웃'), findsOneWidget);
    expect(find.text('Cmd+K'), findsOneWidget);
    expect(find.byType(HoronMenuSeparator), findsOneWidget);

    // 세로로 쌓이고, 라벨이 첫 항목 위에 옵니다.
    final double label = tester.getRect(find.text('계정')).top;
    final double profile = tester.getRect(find.text('프로필')).top;
    final double signOut = tester.getRect(find.text('로그아웃')).top;
    expect(label, lessThan(profile));
    expect(profile, lessThan(signOut));
  });

  testWidgets('a disabled item never calls its callback', (WidgetTester tester) async {
    int taps = 0;
    await tester.pumpWidget(
      host(
        HoronMenu(
          children: <Widget>[
            HoronMenuItem(label: '꺼짐', enabled: false, onSelected: () => taps++),
            HoronMenuItem(label: '켜짐', onSelected: () => taps++),
          ],
        ),
      ),
    );

    await tester.tap(find.text('꺼짐'));
    await tester.pump();
    expect(taps, 0);

    await tester.tap(find.text('켜짐'));
    await tester.pump();
    expect(taps, 1);
  });

  testWidgets('a group stacks its items under one label', (WidgetTester tester) async {
    await tester.pumpWidget(
      host(
        HoronMenu(
          children: <Widget>[
            HoronMenuGroup(
              label: '정렬',
              children: <Widget>[
                HoronMenuItem(label: '이름'),
                HoronMenuItem(label: '날짜'),
              ],
            ),
          ],
        ),
      ),
    );

    expect(find.text('정렬'), findsOneWidget);
    expect(tester.getRect(find.text('이름')).top, lessThan(tester.getRect(find.text('날짜')).top));
    expect(tester.getRect(find.byKey(HoronMenu.panelKey)).width, 200);
  });

  testWidgets('the panel renders on both brightnesses with themed colours', (WidgetTester tester) async {
    for (final Brightness brightness in Brightness.values) {
      await tester.pumpWidget(host(sampleMenu(), brightness: brightness));
      await tester.pumpAndSettle();

      final BuildContext context = tester.element(find.byType(HoronMenu));
      final Color expected = HoronTheme.of(context).glassFillStrong;
      final DecoratedBox surface = tester.widget<DecoratedBox>(
        find.descendant(of: find.byType(HoronMenu), matching: find.byType(DecoratedBox)).first,
      );
      expect((surface.decoration as BoxDecoration).color, expected);
    }
  });

  testWidgets('a menu without items still lays out at 200', (WidgetTester tester) async {
    await tester.pumpWidget(host(const HoronMenu(children: <Widget>[])));

    expect(tester.getRect(find.byKey(HoronMenu.panelKey)).width, 200);
    expect(find.byType(HoronMenuItem), findsNothing);
  });
}
