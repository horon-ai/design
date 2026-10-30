import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:horon_ui/horon_ui.dart';

/// 테마가 적용된 화면에 위젯 하나를 놓습니다.
Widget _host(Widget child, {Brightness brightness = Brightness.light, double? width}) {
  final Widget sized = width == null ? child : SizedBox(width: width, child: child);
  return MaterialApp(
    theme: horonTheme(brightness),
    home: Scaffold(
      body: Center(child: SingleChildScrollView(child: sized)),
    ),
  );
}

List<HoronListDetailGroup> _groups() => const <HoronListDetailGroup>[
  HoronListDetailGroup(
    id: 'pinned',
    label: 'Pinned',
    items: <HoronListDetailItem>[
      HoronListDetailItem(id: 'alpha', title: 'alpha', meta: 'owner · alpox'),
      HoronListDetailItem(id: 'beta', title: 'beta'),
    ],
  ),
  HoronListDetailGroup(
    id: 'all',
    label: 'All',
    items: <HoronListDetailItem>[HoronListDetailItem(id: 'gamma', title: 'gamma')],
  ),
];

Widget _detail(HoronListDetailItem item) => Text('detail:${item.id}');

HoronListDetail _listDetail() => HoronListDetail(groups: _groups(), detailBuilder: _detail);

HoronThemeData _themeOf(WidgetTester tester, Finder finder) => HoronTheme.of(tester.element(finder));

/// `decoration`의 색이 [color]인 [DecoratedBox]를 찾습니다.
Finder _decoratedWith(Color color) => find.byWidgetPredicate(
  (Widget widget) =>
      widget is DecoratedBox &&
      widget.decoration is BoxDecoration &&
      (widget.decoration as BoxDecoration).color == color,
);

void main() {
  testWidgets('renders the default state in light and dark without exceptions', (WidgetTester tester) async {
    for (final Brightness brightness in Brightness.values) {
      await tester.pumpWidget(_host(_listDetail(), brightness: brightness, width: 900));
      await tester.pumpAndSettle();
      expect(tester.takeException(), isNull, reason: brightness.name);
    }
  });

  testWidgets('selects the first item and paints it with the selected background', (WidgetTester tester) async {
    await tester.pumpWidget(_host(_listDetail(), width: 900));
    await tester.pumpAndSettle();
    final HoronThemeData theme = _themeOf(tester, find.byType(HoronListDetail));

    expect(find.text('detail:alpha'), findsOneWidget, reason: 'defaultValue가 없으면 첫 항목이 선택입니다');

    final AnimatedContainer selected = tester.widget<AnimatedContainer>(
      find.ancestor(of: find.text('alpha'), matching: find.byType(AnimatedContainer)).first,
    );
    expect((selected.decoration! as BoxDecoration).color, theme.colors.interactiveSecondary);

    final AnimatedContainer unselected = tester.widget<AnimatedContainer>(
      find.ancestor(of: find.text('beta'), matching: find.byType(AnimatedContainer)).first,
    );
    expect((unselected.decoration! as BoxDecoration).color, Colors.transparent);
    expect((unselected.decoration! as BoxDecoration).borderRadius, BorderRadius.circular(theme.space.s2_5));
  });

  testWidgets('the shell clips at rounded-2xl and the list sits on the inset surface', (WidgetTester tester) async {
    await tester.pumpWidget(_host(_listDetail(), width: 900));
    await tester.pumpAndSettle();
    final HoronThemeData theme = _themeOf(tester, find.byType(HoronListDetail));

    final ClipRRect clip = tester.widget<ClipRRect>(find.byType(ClipRRect).first);
    expect((clip.borderRadius as BorderRadius).topLeft.x, theme.radius.xl2);

    expect(_decoratedWith(theme.colors.bgInset), findsOneWidget);
  });

  testWidgets('tapping an item reports the id and swaps the detail pane', (WidgetTester tester) async {
    String? reported;
    await tester.pumpWidget(
      _host(
        HoronListDetail(groups: _groups(), detailBuilder: _detail, onValueChange: (String id) => reported = id),
        width: 900,
      ),
    );
    await tester.pumpAndSettle();
    await tester.tap(find.text('gamma'));
    await tester.pumpAndSettle();

    expect(reported, 'gamma');
    expect(find.text('detail:gamma'), findsOneWidget);
    expect(find.text('detail:alpha'), findsNothing);

    final AnimatedContainer row = tester.widget<AnimatedContainer>(
      find.ancestor(of: find.text('gamma'), matching: find.byType(AnimatedContainer)).first,
    );
    expect(
      (row.decoration! as BoxDecoration).color,
      _themeOf(tester, find.byType(HoronListDetail)).colors.interactiveSecondary,
    );
  });

  testWidgets('a controlled value wins over the inner selection', (WidgetTester tester) async {
    await tester.pumpWidget(
      _host(HoronListDetail(groups: _groups(), detailBuilder: _detail, value: 'beta'), width: 900),
    );
    await tester.pumpAndSettle();
    expect(find.text('detail:beta'), findsOneWidget);

    await tester.tap(find.text('gamma'));
    await tester.pumpAndSettle();
    expect(find.text('detail:beta'), findsOneWidget, reason: 'value가 고정되어 있으면 내부 선택은 그려지지 않습니다');
  });

  testWidgets('stacks the list above the detail below the md breakpoint', (WidgetTester tester) async {
    await tester.pumpWidget(_host(_listDetail(), width: 900));
    await tester.pumpAndSettle();
    final Offset wideList = tester.getTopLeft(find.text('alpha'));
    final Offset wideDetail = tester.getTopLeft(find.text('detail:alpha'));
    expect(wideDetail.dx, greaterThan(wideList.dx), reason: '넓은 폭에서는 상세가 오른쪽입니다');
    expect(wideDetail.dy, lessThan(wideList.dy + 48));
    expect(find.byType(IntrinsicHeight), findsOneWidget);

    await tester.pumpWidget(_host(_listDetail(), width: 360));
    await tester.pumpAndSettle();
    final Offset narrowList = tester.getTopLeft(find.text('alpha'));
    final Offset narrowDetail = tester.getTopLeft(find.text('detail:alpha'));
    expect(narrowDetail.dy, greaterThan(narrowList.dy), reason: '좁은 폭에서는 상세가 목록 아래입니다');
    expect(narrowDetail.dx, closeTo(narrowList.dx - 8, 24));
    expect(find.byType(IntrinsicHeight), findsNothing);
    expect(tester.takeException(), isNull);
  });

  testWidgets('the header draws a 40px tile, an 18px icon and a 22px tag pill', (WidgetTester tester) async {
    await tester.pumpWidget(
      _host(
        const HoronListDetailHeader(
          title: 'alpha',
          description: '서버 하나를 설명합니다',
          icon: Icon(Icons.dns_outlined),
          actions: Text('on'),
        ),
        width: 480,
      ),
    );
    final HoronThemeData theme = _themeOf(tester, find.byType(HoronListDetailHeader));

    expect(
      find.byWidgetPredicate((Widget widget) => widget is SizedBox && widget.width == theme.space.step(10)),
      findsOneWidget,
    );
    expect(IconTheme.of(tester.element(find.byType(Icon))).size, theme.space.step(4.5));
    expect(IconTheme.of(tester.element(find.byType(Icon))).color, HoronPalette.sky700);
    expect(_decoratedWith(HoronPalette.sky100), findsOneWidget);
    expect(tester.takeException(), isNull);
  });

  testWidgets('the header uses the dark sky tile in dark mode', (WidgetTester tester) async {
    await tester.pumpWidget(
      _host(
        const HoronListDetailHeader(title: 'alpha', icon: Icon(Icons.dns_outlined)),
        brightness: Brightness.dark,
        width: 480,
      ),
    );
    expect(_decoratedWith(HoronPalette.sky900), findsOneWidget);
    expect(IconTheme.of(tester.element(find.byType(Icon))).color, HoronPalette.sky300);
  });

  testWidgets('the meta box keeps rounded-md on the neutral surface in both brightnesses', (WidgetTester tester) async {
    const HoronListDetailMeta meta = HoronListDetailMeta(
      items: <HoronListDetailMetaItem>[
        HoronListDetailMetaItem(id: 'scope', label: 'Scope', value: 'files.read'),
        HoronListDetailMetaItem(id: 'owner', label: 'Owner', value: 'alpox'),
      ],
    );

    await tester.pumpWidget(_host(meta, width: 480));
    HoronThemeData theme = _themeOf(tester, find.byType(HoronListDetailMeta));
    DecoratedBox light = tester.widget<DecoratedBox>(_decoratedWith(HoronPalette.neutral50));
    expect((light.decoration as BoxDecoration).borderRadius, BorderRadius.circular(theme.radius.md));

    await tester.pumpWidget(_host(meta, brightness: Brightness.dark, width: 480));
    await tester.pumpAndSettle();
    theme = _themeOf(tester, find.byType(HoronListDetailMeta));
    final DecoratedBox dark = tester.widget<DecoratedBox>(_decoratedWith(HoronPalette.neutral800));
    expect((dark.decoration as BoxDecoration).borderRadius, BorderRadius.circular(theme.radius.md));
    expect(tester.takeException(), isNull);
  });

  testWidgets('the instructions block opens and closes the editor and reports typed text', (WidgetTester tester) async {
    String? changed;
    await tester.pumpWidget(
      _host(
        HoronListDetailInstructions(
          defaultValue: 'name: alpha\n---\nbody',
          tag: 'AGENTS.md',
          onValueChange: (String value) => changed = value,
        ),
        width: 480,
      ),
    );
    final HoronThemeData theme = _themeOf(tester, find.byType(HoronListDetailInstructions));

    expect(find.byType(TextField), findsNothing);
    final Container pill = tester.widget<Container>(
      find.ancestor(of: find.text('AGENTS.md'), matching: find.byType(Container)).first,
    );
    expect(pill.constraints?.maxHeight, theme.space.step(5.5));
    expect(find.textContaining('name:'), findsOneWidget);

    await tester.tap(find.text('Edit'));
    await tester.pumpAndSettle();
    expect(find.byType(TextField), findsOneWidget);
    expect(find.text('Done'), findsOneWidget);

    await tester.enterText(find.byType(TextField), 'name: beta');
    await tester.pump();
    expect(changed, 'name: beta');

    await tester.tap(find.text('Done'));
    await tester.pumpAndSettle();
    expect(find.byType(TextField), findsNothing);
    expect(tester.takeException(), isNull);
  });

  testWidgets('the files row wraps its chips and the footer draws the top rule', (WidgetTester tester) async {
    await tester.pumpWidget(
      _host(
        Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          mainAxisSize: MainAxisSize.min,
          children: <Widget>[
            const HoronListDetailFiles(children: <Widget>[Text('AGENTS.md'), Text('README.md'), Text('design.md')]),
            const SizedBox(height: 12),
            HoronListDetailFooter(
              children: <Widget>[TextButton(onPressed: () {}, child: const Text('Cancel'))],
            ),
          ],
        ),
        width: 240,
      ),
    );
    final HoronThemeData theme = _themeOf(tester, find.byType(HoronListDetailFiles));
    expect(find.text('AGENTS.md'), findsOneWidget);
    expect(find.byType(Wrap), findsOneWidget);
    final DecoratedBox rule = tester.widget<DecoratedBox>(
      find.byWidgetPredicate(
        (Widget widget) =>
            widget is DecoratedBox &&
            widget.decoration is BoxDecoration &&
            (widget.decoration as BoxDecoration).border != null,
      ),
    );
    expect(((rule.decoration as BoxDecoration).border! as Border).top.color, theme.colors.borderDefault);
    expect(tester.takeException(), isNull);
  });
}
