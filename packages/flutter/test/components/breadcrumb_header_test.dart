import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:horon_ui/horon_ui.dart';
import 'package:horon_ui/src/components/breadcrumb_header.dart';

/// 테마가 적용된 화면에 위젯 하나를 놓습니다.
Widget _host(Widget child, {Brightness brightness = Brightness.light, double width = 1024}) => MaterialApp(
  theme: horonTheme(brightness),
  home: Scaffold(
    body: Center(
      child: SizedBox(width: width, child: child),
    ),
  ),
);

HoronThemeData _theme(WidgetTester tester) => HoronTheme.of(tester.element(find.byType(HoronBreadcrumbHeader)));

List<HoronBreadcrumbHeaderCrumb> _crumbs({VoidCallback? onWorkspace}) => <HoronBreadcrumbHeaderCrumb>[
  HoronBreadcrumbHeaderCrumb(label: '워크스페이스', onTap: onWorkspace, tile: const Icon(Icons.workspace_premium)),
  HoronBreadcrumbHeaderCrumb(label: '에이전트', onTap: () {}),
  const HoronBreadcrumbHeaderCrumb(label: '설정'),
];

void main() {
  testWidgets('default state renders in light and dark', (WidgetTester tester) async {
    for (final Brightness brightness in Brightness.values) {
      await tester.pumpWidget(_host(HoronBreadcrumbHeader(crumbs: _crumbs()), brightness: brightness));
      expect(tester.takeException(), isNull);
    }
  });

  testWidgets('the pill is 52px tall regular glass with rounded-full', (WidgetTester tester) async {
    await tester.pumpWidget(_host(HoronBreadcrumbHeader(crumbs: _crumbs())));
    final HoronThemeData theme = _theme(tester);

    expect(tester.getSize(find.byType(HoronBreadcrumbHeader)).height, theme.space.step(13), reason: 'h-13 = 52');
    final HoronLiquidGlass glass = tester.widget<HoronLiquidGlass>(find.byType(HoronLiquidGlass));
    expect(glass.tier, HoronGlassTier.regular, reason: 'bg-glass-regular');
    expect(glass.borderRadius, BorderRadius.circular(theme.radius.full), reason: 'rounded-full');
  });

  testWidgets('the last crumb is the current page and the rest are secondary', (WidgetTester tester) async {
    await tester.pumpWidget(_host(HoronBreadcrumbHeader(crumbs: _crumbs())));
    final HoronColors colors = _theme(tester).colors;

    Color? colorOf(String label) => DefaultTextStyle.of(tester.element(find.text(label))).style.color;

    expect(colorOf('설정'), colors.textPrimary);
    expect(colorOf('워크스페이스'), colors.textSecondary);
    expect(colorOf('에이전트'), colors.textSecondary);
  });

  testWidgets('crumbs keep the 14px caret and the 20px ink tile', (WidgetTester tester) async {
    await tester.pumpWidget(_host(HoronBreadcrumbHeader(crumbs: _crumbs())));
    final HoronThemeData theme = _theme(tester);

    final Finder carets = find.byIcon(Icons.chevron_right);
    expect(carets, findsNWidgets(2));
    expect(tester.widget<Icon>(carets.first).size, theme.space.s3_5, reason: 'size-3.5 = 14');

    final Finder tileIcon = find.byIcon(Icons.workspace_premium);
    final Finder tileBox = find.ancestor(of: tileIcon, matching: find.byType(Container)).first;
    expect(tester.getSize(tileBox), Size.square(theme.space.step(5)), reason: 'size-5 = 20');
    final BoxDecoration decoration = tester.widget<Container>(tileBox).decoration! as BoxDecoration;
    expect(decoration.color, theme.colors.interactivePrimary);
    expect(IconTheme.of(tester.element(tileIcon)).color, theme.colors.textInverse);
  });

  testWidgets('search and more are 36px ghost buttons with 18px icons', (WidgetTester tester) async {
    final SemanticsHandle handle = tester.ensureSemantics();
    int searches = 0;
    int mores = 0;
    await tester.pumpWidget(
      _host(HoronBreadcrumbHeader(crumbs: _crumbs(), onSearch: () => searches += 1, onMore: () => mores += 1)),
    );
    final HoronThemeData theme = _theme(tester);

    for (final IconData icon in <IconData>[Icons.search, Icons.more_horiz]) {
      final Finder glyph = find.byIcon(icon);
      final Finder box = find.ancestor(of: glyph, matching: find.byType(AnimatedContainer)).first;
      expect(tester.getSize(box), Size.square(theme.space.step(9)), reason: 'size-9 = 36');
      expect(IconTheme.of(tester.element(glyph)).size, 18, reason: '[&_svg]:size-4.5');
    }

    expect(find.bySemanticsLabel('Search'), findsOneWidget);
    expect(find.bySemanticsLabel('More'), findsOneWidget);

    await tester.tap(find.bySemanticsLabel('Search'));
    await tester.pump();
    await tester.tap(find.bySemanticsLabel('More'));
    await tester.pump();
    expect(searches, 1);
    expect(mores, 1);
    handle.dispose();
  });

  testWidgets('a crumb tap calls back only when the crumb is not the current page', (WidgetTester tester) async {
    int taps = 0;
    await tester.pumpWidget(_host(HoronBreadcrumbHeader(crumbs: _crumbs(onWorkspace: () => taps += 1))));

    await tester.tap(find.text('워크스페이스'));
    await tester.pump();
    expect(taps, 1);
  });

  testWidgets('narrow widths wrap the crumb row instead of clipping it', (WidgetTester tester) async {
    final Widget header = HoronBreadcrumbHeader(crumbs: _crumbs());

    await tester.pumpWidget(_host(header, width: 1024));
    final double wide = tester.getSize(find.byType(HoronBreadcrumbHeader)).height;

    await tester.pumpWidget(_host(header, width: 320));
    final double narrow = tester.getSize(find.byType(HoronBreadcrumbHeader)).height;

    expect(wide, 52, reason: 'h-13');
    expect(narrow, greaterThan(wide), reason: '320px에서는 조각이 다음 줄로 넘어가 알약이 자랍니다');
    expect(tester.takeException(), isNull);
  });
}
