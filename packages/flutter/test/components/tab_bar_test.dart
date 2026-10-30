import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:horon_ui/horon_ui.dart';

/// 테마가 적용된 화면에 위젯 하나를 놓습니다.
Widget _host(Widget child, {Brightness brightness = Brightness.light, double width = 1024}) => MaterialApp(
  theme: horonTheme(brightness),
  home: Scaffold(
    body: Center(
      child: SizedBox(width: width, child: child),
    ),
  ),
);

HoronThemeData _theme(WidgetTester tester) => HoronTheme.of(tester.element(find.byType(HoronTabBar)));

const List<HoronTabBarItem> _items = <HoronTabBarItem>[
  HoronTabBarItem(value: 'home', label: '홈', icon: Icon(Icons.home_outlined)),
  HoronTabBarItem(value: 'agents', label: '에이전트', icon: Icon(Icons.smart_toy_outlined)),
  HoronTabBarItem(value: 'chat', label: '대화', icon: Icon(Icons.chat_bubble_outline)),
  HoronTabBarItem(value: 'files', label: '파일', icon: Icon(Icons.folder_outlined)),
  HoronTabBarItem(value: 'settings', label: '설정', icon: Icon(Icons.settings_outlined)),
];

/// 현재 탭 뒤의 10% 잉크 표시자입니다.
Finder _indicator(HoronColors colors) => find.descendant(
  of: find.byType(HoronTabBar),
  matching: find.byWidgetPredicate(
    (Widget widget) => widget is DecoratedBox && (widget.decoration as BoxDecoration).color == colors.overlayInk10,
  ),
);

Finder _tab(IconData icon) => find.ancestor(of: find.byIcon(icon), matching: find.byType(AnimatedContainer)).first;

void main() {
  testWidgets('default state renders in light and dark', (WidgetTester tester) async {
    for (final Brightness brightness in Brightness.values) {
      await tester.pumpWidget(_host(const HoronTabBar(items: _items), brightness: brightness));
      await tester.pump();
      expect(tester.takeException(), isNull);
    }
  });

  testWidgets('surface="glass" hosts a regular glass pill and flat keeps only the fill', (WidgetTester tester) async {
    await tester.pumpWidget(_host(const HoronTabBar(items: _items)));
    await tester.pump();
    final HoronThemeData theme = _theme(tester);

    final HoronLiquidGlass glass = tester.widget<HoronLiquidGlass>(find.byType(HoronLiquidGlass));
    expect(glass.tier, HoronGlassTier.regular, reason: 'bg-glass-regular');
    expect(glass.borderRadius, BorderRadius.circular(theme.radius.full), reason: 'rounded-full');

    await tester.pumpWidget(_host(const HoronTabBar(items: _items, glass: false)));
    await tester.pump();
    expect(find.byType(HoronLiquidGlass), findsNothing, reason: 'surface="flat"에는 유리 레이어가 없습니다');
    expect(
      find.byWidgetPredicate(
        (Widget widget) =>
            widget is Container && (widget.decoration as BoxDecoration?)?.color == theme.colors.glassRegular,
      ),
      findsOneWidget,
    );
  });

  testWidgets('each tab is a 64x48 pill with a 22px icon and the first tab is current', (WidgetTester tester) async {
    await tester.pumpWidget(_host(const HoronTabBar(items: _items)));
    await tester.pump();
    final HoronThemeData theme = _theme(tester);

    expect(
      tester.getSize(_tab(Icons.home_outlined)),
      Size(theme.space.step(16), theme.space.step(12)),
      reason: 'w-16 h-12',
    );
    expect(IconTheme.of(tester.element(find.byIcon(Icons.home_outlined))).size, 22, reason: '[&_svg]:size-5.5');
    expect(IconTheme.of(tester.element(find.byIcon(Icons.home_outlined))).color, theme.colors.textPrimary);
    expect(IconTheme.of(tester.element(find.byIcon(Icons.chat_bubble_outline))).color, theme.colors.textSecondary);
    expect(_indicator(theme.colors), findsOneWidget);
    expect(tester.widget<AnimatedPositioned>(find.byType(AnimatedPositioned)).left, 0, reason: '첫 탭이 목록 시작에 붙습니다');
  });

  testWidgets('tapping a tab moves the indicator and calls back with its value', (WidgetTester tester) async {
    final List<String> changes = <String>[];
    await tester.pumpWidget(_host(HoronTabBar(items: _items, onChanged: changes.add)));
    await tester.pump();

    await tester.tap(find.byIcon(Icons.chat_bubble_outline));
    await tester.pump();
    // 배치 뒤 측정이 끝나 표시자가 새 자리를 받는 프레임입니다.
    await tester.pump();
    expect(changes, <String>['chat']);

    final HoronColors colors = _theme(tester).colors;
    final Rect first = tester.getRect(_tab(Icons.home_outlined));
    final Rect chat = tester.getRect(_tab(Icons.chat_bubble_outline));
    final AnimatedPositioned indicator = tester.widget<AnimatedPositioned>(find.byType(AnimatedPositioned));
    expect(indicator.left, closeTo(chat.left - first.left, 0.01), reason: '표시자가 선택된 탭으로 옮겨 갑니다');
    expect(indicator.width, chat.width);
    expect(IconTheme.of(tester.element(find.byIcon(Icons.chat_bubble_outline))).color, colors.textPrimary);
  });

  testWidgets('narrow widths shrink the tabs instead of overflowing', (WidgetTester tester) async {
    await tester.pumpWidget(_host(const HoronTabBar(items: _items), width: 1024));
    await tester.pump();
    final double wideTab = tester.getSize(_tab(Icons.home_outlined)).width;

    await tester.pumpWidget(_host(const HoronTabBar(items: _items), width: 320));
    await tester.pump();
    final double narrowTab = tester.getSize(_tab(Icons.home_outlined)).width;
    final double barWidth = tester.getSize(find.byType(HoronTabBar)).width;

    expect(wideTab, 64, reason: 'w-16');
    expect(narrowTab, lessThan(wideTab), reason: '320px에서는 탭 폭을 줄입니다');
    expect(barWidth, lessThanOrEqualTo(320), reason: '막대가 화면 폭을 넘지 않습니다');
    expect(tester.takeException(), isNull);
  });
}
