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

HoronThemeData _theme(WidgetTester tester) => HoronTheme.of(tester.element(find.byType(HoronTabs)));

Widget _tabs({ValueChanged<String>? onChanged, bool logsEnabled = true}) => HoronTabs(
  onChanged: onChanged,
  children: <Widget>[
    HoronTabsList(
      children: <Widget>[
        const HoronTabsTab(value: 'overview', label: '개요와 통계', icon: Icon(Icons.dashboard_outlined), count: 4),
        const HoronTabsTab(value: 'members', label: '멤버 관리'),
        HoronTabsTab(value: 'logs', label: '활동 로그', count: 12, enabled: logsEnabled),
      ],
    ),
    const HoronTabsPanel(value: 'overview', child: Text('개요 패널')),
    const HoronTabsPanel(value: 'members', child: Text('멤버 패널')),
    const HoronTabsPanel(value: 'logs', child: Text('로그 패널')),
  ],
);

/// 목록 안의 10% 잉크 표시자입니다.
Finder _indicator(HoronColors colors) => find.descendant(
  of: find.byType(HoronTabsList),
  matching: find.byWidgetPredicate(
    (Widget widget) => widget is DecoratedBox && (widget.decoration as BoxDecoration).color == colors.overlayInk10,
  ),
);

void main() {
  testWidgets('default state renders in light and dark', (WidgetTester tester) async {
    for (final Brightness brightness in Brightness.values) {
      await tester.pumpWidget(_host(_tabs(), brightness: brightness));
      await tester.pump();
      expect(tester.takeException(), isNull);
    }
  });

  testWidgets('the first tab is selected and its panel is the only one built', (WidgetTester tester) async {
    await tester.pumpWidget(_host(_tabs()));
    await tester.pump();

    expect(find.text('개요 패널'), findsOneWidget);
    expect(find.text('멤버 패널'), findsNothing);
    expect(find.text('로그 패널'), findsNothing);
    expect(_indicator(_theme(tester).colors), findsOneWidget, reason: '선택 표시자는 하나입니다');
  });

  testWidgets('tapping a tab moves the selection, the indicator and the panel', (WidgetTester tester) async {
    final List<String> changes = <String>[];
    await tester.pumpWidget(_host(_tabs(onChanged: changes.add)));
    await tester.pump();

    final HoronColors colors = _theme(tester).colors;
    expect(_indicator(colors), findsOneWidget, reason: '선택 표시자는 하나입니다');

    // 표시자 자리는 `AnimatedPositioned`의 목표값으로 검사합니다. 280ms 애니메이션의
    // 중간값은 시간에 기대지 않습니다.
    double targetLeft() => tester.widget<AnimatedPositioned>(find.byType(AnimatedPositioned)).left!;
    expect(targetLeft(), 0, reason: '첫 탭이 목록 시작에 붙습니다');

    final Rect first = tester.getRect(
      find.ancestor(of: find.text('개요와 통계'), matching: find.byType(AnimatedContainer)).first,
    );
    final Rect second = tester.getRect(
      find.ancestor(of: find.text('멤버 관리'), matching: find.byType(AnimatedContainer)).first,
    );

    await tester.tap(find.text('멤버 관리'));
    await tester.pump();
    // 배치 뒤 측정이 끝나 표시자가 새 자리를 받는 프레임입니다.
    await tester.pump();

    expect(changes, <String>['members']);
    expect(find.text('멤버 패널'), findsOneWidget);
    expect(find.text('개요 패널'), findsNothing);
    expect(targetLeft(), closeTo(second.left - first.left, 0.01), reason: '표시자가 선택된 탭으로 옮겨 갑니다');
  });

  testWidgets('the count pill is ink on the selected tab and overlay ink otherwise', (WidgetTester tester) async {
    await tester.pumpWidget(_host(_tabs()));
    await tester.pump();
    final HoronThemeData theme = _theme(tester);

    BoxDecoration pill(String count) =>
        tester
                .widget<AnimatedContainer>(
                  find.ancestor(of: find.text(count), matching: find.byType(AnimatedContainer)).first,
                )
                .decoration!
            as BoxDecoration;

    expect(pill('4').color, theme.colors.interactivePrimary, reason: '선택된 탭의 개수는 잉크 바탕');
    expect(pill('12').color, theme.colors.overlayInk6, reason: '나머지는 overlay-ink-6');
    expect(
      tester.getSize(find.ancestor(of: find.text('4'), matching: find.byType(AnimatedContainer)).first).height,
      22,
    );
  });

  testWidgets('a rich tab pads 14/10 and a plain tab pads 4/10 with a 16px icon', (WidgetTester tester) async {
    await tester.pumpWidget(_host(_tabs()));
    await tester.pump();
    final HoronThemeData theme = _theme(tester);

    AnimatedContainer surfaceOf(String label) => tester.widget<AnimatedContainer>(
      find.ancestor(of: find.text(label), matching: find.byType(AnimatedContainer)).first,
    );

    expect(
      surfaceOf('개요와 통계').padding,
      EdgeInsets.symmetric(horizontal: theme.space.s3_5, vertical: theme.space.s2_5),
      reason: 'rich: px-3.5 py-2.5',
    );
    expect(
      surfaceOf('멤버 관리').padding,
      EdgeInsets.symmetric(horizontal: theme.space.s1, vertical: theme.space.s2_5),
      reason: 'plain: px-1 py-2.5',
    );
    expect(IconTheme.of(tester.element(find.byIcon(Icons.dashboard_outlined))).size, 16, reason: '[&_svg]:size-4');
    expect(IconTheme.of(tester.element(find.byIcon(Icons.dashboard_outlined))).color, theme.colors.textPrimary);
  });

  testWidgets('a disabled tab is 40% opaque and does not select', (WidgetTester tester) async {
    final List<String> changes = <String>[];
    await tester.pumpWidget(_host(_tabs(onChanged: changes.add, logsEnabled: false)));
    await tester.pump();

    final Finder logs = find.ancestor(of: find.text('활동 로그'), matching: find.byType(Opacity)).first;
    expect(tester.widget<Opacity>(logs).opacity, 0.4, reason: 'data-disabled:opacity-40');

    await tester.tap(find.text('활동 로그'));
    await tester.pump();
    expect(changes, isEmpty);
    expect(find.text('개요 패널'), findsOneWidget);
  });

  testWidgets('narrow widths wrap the tab strip instead of clipping it', (WidgetTester tester) async {
    await tester.pumpWidget(_host(_tabs(), width: 1024));
    await tester.pump();
    final double wide = tester.getSize(find.byType(HoronTabsList)).height;

    await tester.pumpWidget(_host(_tabs(), width: 320));
    await tester.pump();
    final double narrow = tester.getSize(find.byType(HoronTabsList)).height;

    expect(narrow, greaterThan(wide), reason: '320px에서는 탭이 다음 줄로 넘어갑니다');
    expect(tester.takeException(), isNull);
  });
}
