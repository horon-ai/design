import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:horon_ui/horon_ui.dart';
import 'package:horon_ui/src/components/breadcrumb.dart';

/// 테마가 적용된 화면에 위젯 하나를 놓습니다.
Widget _host(Widget child, {Brightness brightness = Brightness.light, double width = 1024}) => MaterialApp(
  theme: horonTheme(brightness),
  home: Scaffold(
    body: Center(
      child: SizedBox(width: width, child: child),
    ),
  ),
);

HoronThemeData _theme(WidgetTester tester) => HoronTheme.of(tester.element(find.byType(HoronBreadcrumb)));

List<Widget> _crumbs({VoidCallback? onHome}) => <Widget>[
  HoronBreadcrumbItem(label: '워크스페이스', onTap: onHome, tile: const Icon(Icons.workspace_premium)),
  HoronBreadcrumbItem(label: '에이전트', onTap: () {}),
  const HoronBreadcrumbItem(label: '설정', current: true),
];

void main() {
  testWidgets('default state renders in light and dark', (WidgetTester tester) async {
    for (final Brightness brightness in Brightness.values) {
      await tester.pumpWidget(_host(HoronBreadcrumb(children: _crumbs()), brightness: brightness));
      expect(tester.takeException(), isNull);
    }
  });

  testWidgets('the current crumb is primary and the others are secondary', (WidgetTester tester) async {
    await tester.pumpWidget(_host(HoronBreadcrumb(children: _crumbs())));
    final HoronColors colors = _theme(tester).colors;

    Color? colorOf(String label) => DefaultTextStyle.of(tester.element(find.text(label))).style.color;

    expect(colorOf('설정'), colors.textPrimary, reason: 'aria-current="page"는 text-text-primary');
    expect(colorOf('워크스페이스'), colors.textSecondary, reason: '나머지는 text-text-secondary');
    expect(colorOf('에이전트'), colors.textSecondary);
  });

  testWidgets('a 14px caret separates each pair of crumbs', (WidgetTester tester) async {
    await tester.pumpWidget(_host(HoronBreadcrumb(children: _crumbs())));
    final HoronThemeData theme = _theme(tester);
    final Finder carets = find.byIcon(Icons.chevron_right);

    expect(carets, findsNWidgets(2), reason: '조각 3개면 캐럿 2개');
    expect(tester.widget<Icon>(carets.first).size, theme.space.s3_5, reason: 'size-3.5 = 14');
    expect(tester.widget<Icon>(carets.first).color, theme.colors.textSecondary);
  });

  testWidgets('the leading tile is a 20px ink box with label-sm inverse text', (WidgetTester tester) async {
    await tester.pumpWidget(_host(HoronBreadcrumb(children: _crumbs())));
    final HoronThemeData theme = _theme(tester);
    final Finder tileIcon = find.byIcon(Icons.workspace_premium);
    final Finder tileBox = find.ancestor(of: tileIcon, matching: find.byType(Container)).first;

    expect(tester.getSize(tileBox), Size.square(theme.space.step(5)), reason: 'size-5 = 20');
    final BoxDecoration decoration = tester.widget<Container>(tileBox).decoration! as BoxDecoration;
    expect(decoration.color, theme.colors.interactivePrimary, reason: 'bg-interactive-primary');
    expect(decoration.borderRadius, BorderRadius.circular(theme.radius.xs), reason: 'rounded-xs');
    expect(IconTheme.of(tester.element(tileIcon)).color, theme.colors.textInverse);
  });

  testWidgets('surface="glass" hosts a regular glass tray with rounded-xl', (WidgetTester tester) async {
    await tester.pumpWidget(_host(HoronBreadcrumb(children: _crumbs())));
    expect(find.byType(HoronLiquidGlass), findsNothing, reason: 'surface가 없으면 맨 조각입니다');

    await tester.pumpWidget(_host(HoronBreadcrumb(glass: true, children: _crumbs())));
    final HoronThemeData theme = _theme(tester);
    final HoronLiquidGlass glass = tester.widget<HoronLiquidGlass>(find.byType(HoronLiquidGlass));
    expect(glass.tier, HoronGlassTier.regular);
    expect(glass.borderRadius, BorderRadius.circular(theme.radius.xl), reason: 'rounded-xl');
  });

  testWidgets('tapping a linked crumb calls back, and the current crumb stays inert', (WidgetTester tester) async {
    int home = 0;
    await tester.pumpWidget(_host(HoronBreadcrumb(children: _crumbs(onHome: () => home += 1))));

    await tester.tap(find.text('워크스페이스'));
    await tester.pump();
    expect(home, 1);

    int current = 0;
    await tester.pumpWidget(
      _host(
        HoronBreadcrumb(
          children: <Widget>[HoronBreadcrumbItem(label: '설정', current: true, onTap: () => current += 1)],
        ),
      ),
    );
    await tester.tap(find.text('설정'));
    await tester.pump();
    expect(current, 0, reason: 'current면 링크가 아닙니다');
  });

  testWidgets('narrow widths wrap the crumbs instead of clipping them', (WidgetTester tester) async {
    final Widget crumbs = HoronBreadcrumb(
      children: <Widget>[
        HoronBreadcrumbItem(label: '워크스페이스 설정과 통합', onTap: () {}),
        HoronBreadcrumbItem(label: '에이전트 관리 목록', onTap: () {}),
        const HoronBreadcrumbItem(label: '위험한 도구 승인 기록', current: true),
      ],
    );

    await tester.pumpWidget(_host(crumbs, width: 1024));
    final double wide = tester.getSize(find.byType(HoronBreadcrumb)).height;

    await tester.pumpWidget(_host(crumbs, width: 320));
    final double narrow = tester.getSize(find.byType(HoronBreadcrumb)).height;

    expect(narrow, greaterThan(wide), reason: '320px에서는 조각이 다음 줄로 넘어갑니다');
    expect(tester.takeException(), isNull, reason: '넘침이 아니라 줄바꿈이어야 합니다');
  });
}
