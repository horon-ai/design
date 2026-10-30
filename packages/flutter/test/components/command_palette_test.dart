import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:horon_ui/horon_ui.dart';

const double _outside = 5;

Widget _host(Widget child, {Brightness brightness = Brightness.light, double width = 800}) => MaterialApp(
  theme: horonTheme(brightness),
  home: Scaffold(
    body: Center(
      child: SizedBox(width: width, height: 600, child: child),
    ),
  ),
);

HoronThemeData _theme(WidgetTester tester) => HoronTheme.of(tester.element(find.byType(HoronCommandPaletteBody)));

List<HoronCommandGroup> _groups({VoidCallback? onSelectFirst}) => <HoronCommandGroup>[
  HoronCommandGroup(
    label: 'Workspaces',
    items: <HoronCommandItem>[
      HoronCommandItem(
        value: 'horon',
        label: 'Horon team',
        keywords: 'design',
        tile: const Text('H'),
        meta: const Text('12 members'),
        hint: const Text('↵'),
        onSelect: onSelectFirst,
      ),
      const HoronCommandItem(value: 'paper', label: 'Paper workspace', tile: Text('P')),
    ],
  ),
  const HoronCommandGroup(
    label: 'Actions',
    items: <HoronCommandItem>[
      HoronCommandItem(value: 'settings', label: 'Workspace settings', keywords: 'preferences'),
      HoronCommandItem(value: 'invite', label: 'Invite teammate'),
    ],
  ),
];

Finder _popup() => find.ancestor(of: find.byType(HoronCommandPaletteBody), matching: find.byType(ClipRRect)).first;

Finder _rowFor(String label) => find.ancestor(of: find.text(label), matching: find.byType(AnimatedContainer)).first;

BoxDecoration _rowDecoration(WidgetTester tester, String label) =>
    tester.widget<AnimatedContainer>(_rowFor(label)).decoration! as BoxDecoration;

void main() {
  testWidgets('default state renders in light and dark', (WidgetTester tester) async {
    for (final Brightness brightness in Brightness.values) {
      await tester.pumpWidget(_host(HoronCommandPalette(open: true, groups: _groups()), brightness: brightness));
      await tester.pumpAndSettle();
      expect(tester.takeException(), isNull, reason: '$brightness에서 예외가 없어야 합니다');
    }
  });

  testWidgets('a closed palette draws only its trigger', (WidgetTester tester) async {
    await tester.pumpWidget(_host(HoronCommandPalette(groups: _groups(), trigger: const Text('열기'))));
    expect(find.text('열기'), findsOneWidget);
    expect(find.byType(HoronCommandPaletteBody), findsNothing);
  });

  testWidgets('the popup is a 560px frost surface with the 24px palette radius', (WidgetTester tester) async {
    await tester.pumpWidget(_host(HoronCommandPalette(open: true, groups: _groups())));
    await tester.pumpAndSettle();

    final HoronThemeData theme = _theme(tester);
    expect(tester.getSize(_popup()).width, 560, reason: 'w-140 = 560');
    expect(tester.widget<ClipRRect>(_popup()).borderRadius, BorderRadius.circular(24), reason: 'rounded-[24px]');

    final Iterable<DecoratedBox> boxes = tester.widgetList<DecoratedBox>(
      find.ancestor(of: find.byType(HoronCommandPaletteBody), matching: find.byType(DecoratedBox)),
    );
    final BoxDecoration shadowed = boxes
        .map((DecoratedBox box) => box.decoration)
        .whereType<BoxDecoration>()
        .firstWhere((BoxDecoration decoration) => decoration.boxShadow != null);
    expect(shadowed.boxShadow, theme.shadows.palette, reason: 'shadow-palette');

    final ColoredBox frost = tester
        .widgetList<ColoredBox>(
          find.descendant(of: find.byType(HoronCommandPalette), matching: find.byType(ColoredBox)),
        )
        .firstWhere((ColoredBox box) => box.color == theme.colors.glassFillFrost);
    expect(frost.color, theme.colors.glassFillFrost, reason: 'bg-glass-fill-frost');
    expect(
      tester.widget<HoronLiquidGlass>(find.byType(HoronLiquidGlass).first).tier,
      HoronGlassTier.thick,
      reason: 'LiquidGlass tier="thick"',
    );
  });

  testWidgets('the search row is 48px with a 20px icon and the 14px padding', (WidgetTester tester) async {
    await tester.pumpWidget(_host(HoronCommandPalette(open: true, groups: _groups())));
    await tester.pumpAndSettle();

    final HoronThemeData theme = _theme(tester);
    final Finder row = find.ancestor(of: find.byType(TextField), matching: find.byType(SizedBox)).first;
    expect(tester.getSize(row).height, 48, reason: 'h-12');
    expect(tester.getSize(find.byIcon(Icons.search)).width, 20, reason: 'size-5');
    expect(
      tester.widget<Icon>(find.byIcon(Icons.search)).color,
      theme.colors.textSecondary,
      reason: 'text-text-secondary',
    );
    expect(
      tester.widget<TextField>(find.byType(TextField)).style!.fontSize,
      theme.text.bodySm.fontSize,
      reason: 'text-body-sm',
    );
  });

  testWidgets('results are 44px rows on a 12px radius with a 28px tile', (WidgetTester tester) async {
    await tester.pumpWidget(_host(HoronCommandPalette(open: true, groups: _groups())));
    await tester.pumpAndSettle();

    final HoronThemeData theme = _theme(tester);
    final Finder row = _rowFor('Horon team');
    expect(tester.getSize(row).height, 44, reason: 'h-11');
    final BoxDecoration decoration = _rowDecoration(tester, 'Horon team');
    expect(decoration.color, theme.colors.overlayInk6, reason: 'autoHighlight이 첫 결과를 강조합니다');
    expect((decoration.borderRadius! as BorderRadius).topLeft.x, theme.radius.md, reason: 'rounded-md');

    final Finder tile = find.ancestor(of: find.text('H'), matching: find.byType(Container)).first;
    expect(tester.getSize(tile), const Size(28, 28), reason: 'size-7');
    final BoxDecoration tileDecoration = tester.widget<Container>(tile).decoration! as BoxDecoration;
    expect(tileDecoration.color, theme.colors.interactivePrimary, reason: '기본 타일 바탕');
    expect((tileDecoration.borderRadius! as BorderRadius).topLeft.x, theme.radius.sm, reason: 'rounded-sm');
    final TextStyle tileStyle = DefaultTextStyle.of(tester.element(find.text('H'))).style;
    expect(tileStyle.fontSize, theme.text.labelSm.fontSize, reason: 'text-label-sm');
    expect(tileStyle.color, theme.colors.interactiveOnPrimary, reason: 'text-interactive-on-primary');
    expect(
      tester.widget<Text>(find.text('Horon team')).style!.fontSize,
      theme.text.labelMd.fontSize,
      reason: 'text-label-md',
    );
    final TextStyle metaStyle = DefaultTextStyle.of(tester.element(find.text('12 members'))).style;
    expect(metaStyle.fontSize, theme.text.caption.fontSize, reason: 'meta는 text-caption입니다');
    expect(metaStyle.color, theme.colors.textSecondary, reason: 'meta는 text-text-secondary입니다');
  });

  testWidgets('typing filters results and the empty state shows the theme wording', (WidgetTester tester) async {
    await tester.pumpWidget(_host(HoronCommandPalette(open: true, groups: _groups())));
    await tester.pumpAndSettle();

    await tester.enterText(find.byType(TextField), 'paper');
    await tester.pumpAndSettle();
    expect(find.text('Paper workspace'), findsOneWidget);
    expect(find.text('Horon team'), findsNothing);
    expect(find.text('Workspaces'), findsOneWidget, reason: '남은 결과의 묶음 제목은 유지됩니다');
    expect(find.text('Actions'), findsNothing);

    await tester.enterText(find.byType(TextField), 'zzzz');
    await tester.pumpAndSettle();
    expect(find.text(_theme(tester).strings.noResults), findsOneWidget);
    expect(find.text('Paper workspace'), findsNothing);
  });

  testWidgets('selecting a result calls the item and the palette callbacks', (WidgetTester tester) async {
    int itemSelects = 0;
    final List<bool> openChanges = <bool>[];
    await tester.pumpWidget(
      _host(
        HoronCommandPalette(
          open: true,
          groups: _groups(onSelectFirst: () => itemSelects += 1),
          onOpenChange: openChanges.add,
        ),
      ),
    );
    await tester.pumpAndSettle();

    await tester.tap(find.text('Horon team'));
    await tester.pumpAndSettle();
    expect(itemSelects, 1);
    expect(openChanges, <bool>[false], reason: '고르면 팔레트가 닫히기를 요청합니다');
  });

  testWidgets('escape and the scrim ask the palette to close', (WidgetTester tester) async {
    final List<bool> openChanges = <bool>[];
    await tester.pumpWidget(_host(HoronCommandPalette(open: true, groups: _groups(), onOpenChange: openChanges.add)));
    await tester.pumpAndSettle();

    await tester.sendKeyEvent(LogicalKeyboardKey.escape);
    await tester.pumpAndSettle();
    expect(openChanges, <bool>[false], reason: 'esc는 닫기를 요청합니다');

    await tester.tapAt(const Offset(_outside, _outside));
    await tester.pumpAndSettle();
    expect(openChanges, <bool>[false, false], reason: '바깥 누르기도 닫기를 요청합니다');
  });

  testWidgets('arrow keys move the highlight and enter opens the highlighted result', (WidgetTester tester) async {
    int selects = 0;
    final HoronCommandGroup group = HoronCommandGroup(
      label: 'Actions',
      items: <HoronCommandItem>[
        const HoronCommandItem(value: 'a', label: 'First'),
        const HoronCommandItem(value: 'b', label: 'Second'),
        HoronCommandItem(value: 'c', label: 'Third', onSelect: () => selects += 1),
      ],
    );
    await tester.pumpWidget(_host(HoronCommandPalette(open: true, groups: <HoronCommandGroup>[group])));
    await tester.pumpAndSettle();

    final HoronThemeData theme = _theme(tester);
    expect(_rowDecoration(tester, 'First').color, theme.colors.overlayInk6);
    expect(_rowDecoration(tester, 'Second').color, Colors.transparent);

    await tester.sendKeyEvent(LogicalKeyboardKey.arrowDown);
    await tester.pumpAndSettle();
    expect(_rowDecoration(tester, 'First').color, Colors.transparent);
    expect(_rowDecoration(tester, 'Second').color, theme.colors.overlayInk6);

    await tester.sendKeyEvent(LogicalKeyboardKey.arrowDown);
    await tester.pumpAndSettle();
    await tester.sendKeyEvent(LogicalKeyboardKey.enter);
    await tester.pumpAndSettle();
    expect(selects, 1, reason: 'Enter는 강조된 결과를 엽니다');
  });

  testWidgets('the popup shrinks to the phone width', (WidgetTester tester) async {
    await tester.pumpWidget(_host(HoronCommandPalette(open: true, groups: _groups()), width: 320));
    await tester.pumpAndSettle();
    expect(tester.getSize(_popup()).width, 304, reason: '320에서 좌우 8px을 남깁니다');
    expect(tester.takeException(), isNull);

    await tester.pumpWidget(_host(HoronCommandPalette(open: true, groups: _groups()), width: 1024));
    await tester.pumpAndSettle();
    expect(tester.getSize(_popup()).width, 560);
    expect(tester.takeException(), isNull);
  });
}
