import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:horon_ui/horon_ui.dart';

Widget _host(Widget child, {Brightness brightness = Brightness.light, double? width}) {
  final Widget sized = width == null ? child : SizedBox(width: width, child: child);
  return MaterialApp(
    theme: horonTheme(brightness),
    home: Scaffold(
      body: Center(child: SingleChildScrollView(child: sized)),
    ),
  );
}

HoronMarketplaceCard _card({VoidCallback? onInstall}) {
  return HoronMarketplaceCard(
    initials: 'WB',
    name: 'web-search',
    author: 'horon',
    description: '웹을 검색하고 인용할 수 있는 근거를 모읍니다',
    chips: const <HoronMarketplaceCardChip>[
      HoronMarketplaceCardChip(id: 'web', label: 'web.read', icon: Icon(Icons.public)),
      HoronMarketplaceCardChip(id: 'cite', label: 'citations'),
    ],
    score: '4.8',
    installs: '12k',
    onInstall: onInstall,
  );
}

HoronThemeData _themeOf(WidgetTester tester) => HoronTheme.of(tester.element(find.byType(HoronMarketplaceCard)));

Finder _sizedBox(double size) =>
    find.byWidgetPredicate((Widget widget) => widget is SizedBox && widget.width == size && widget.height == size);

Finder _decoratedWith(Color color) => find.byWidgetPredicate(
  (Widget widget) =>
      widget is DecoratedBox &&
      widget.decoration is BoxDecoration &&
      (widget.decoration as BoxDecoration).color == color,
);

void main() {
  testWidgets('renders in light and dark without exceptions', (WidgetTester tester) async {
    for (final Brightness brightness in Brightness.values) {
      await tester.pumpWidget(_host(_card(onInstall: () {}), brightness: brightness, width: 320));
      await tester.pumpAndSettle();
      expect(tester.takeException(), isNull, reason: brightness.name);
    }
  });

  testWidgets('the glass shell clips at rounded-xl and the ink tile is 40px', (WidgetTester tester) async {
    await tester.pumpWidget(_host(_card(), width: 320));
    final HoronThemeData theme = _themeOf(tester);

    final ClipRRect clip = tester.widget<ClipRRect>(find.byType(ClipRRect).first);
    expect((clip.borderRadius as BorderRadius).topLeft.x, theme.radius.xl);

    expect(_sizedBox(theme.space.step(10)), findsOneWidget);
    expect(_decoratedWith(HoronPalette.neutral900), findsOneWidget);
    final Text initials = tester.widget<Text>(find.text('WB'));
    expect(initials.style?.color, HoronPalette.neutral50);
    expect(initials.style?.fontSize, theme.text.labelMd.fontSize);
  });

  testWidgets('name and author truncate on one line', (WidgetTester tester) async {
    await tester.pumpWidget(_host(_card(), width: 320));
    final HoronThemeData theme = _themeOf(tester);

    final Text name = tester.widget<Text>(find.text('web-search'));
    expect(name.maxLines, 1);
    expect(name.overflow, TextOverflow.ellipsis);
    expect(name.style?.color, theme.colors.textPrimary);

    final Text author = tester.widget<Text>(find.text('horon'));
    expect(author.maxLines, 1);
    expect(author.style?.fontSize, 12);
    expect(author.style?.color, theme.colors.textPlaceholder);

    final Text description = tester.widget<Text>(find.text('웹을 검색하고 인용할 수 있는 근거를 모읍니다'));
    expect(description.style?.fontSize, 13);
    expect(description.style?.color, theme.colors.textSecondary);
  });

  testWidgets('chips are 22px pills with an 11px icon', (WidgetTester tester) async {
    await tester.pumpWidget(_host(_card(), width: 320));
    final HoronThemeData theme = _themeOf(tester);

    final Container chip = tester.widget<Container>(
      find.ancestor(of: find.text('web.read'), matching: find.byType(Container)).first,
    );
    expect(chip.constraints?.maxHeight, theme.space.step(5.5));
    expect((chip.decoration! as BoxDecoration).color, theme.colors.overlayInk6);
    expect(IconTheme.of(tester.element(find.byIcon(Icons.public))).size, theme.space.step(2.75));
  });

  testWidgets('the footer draws the rule, a gold star and the install button', (WidgetTester tester) async {
    await tester.pumpWidget(_host(_card(onInstall: () {}), width: 320));
    final HoronThemeData theme = _themeOf(tester);

    // 괘선은 여러 DecoratedBox 중 하나이므로, 그중 기본 테두리를 가진 상자가 있는지 봅니다.
    final bool hasRule = tester.widgetList<DecoratedBox>(find.byType(DecoratedBox)).any((DecoratedBox box) {
      final Decoration decoration = box.decoration;
      if (decoration is! BoxDecoration || decoration.border is! Border) return false;
      return (decoration.border! as Border).top.color == theme.colors.borderDefault;
    });
    expect(hasRule, isTrue, reason: 'the footer keeps a default-colour rule');

    final Icon star = tester.widget<Icon>(find.byIcon(Icons.star));
    expect(star.size, theme.space.step(3.25));
    expect(star.color, HoronPalette.mascotGold);
    expect(tester.widget<Text>(find.text('4.8')).style?.color, theme.colors.textPrimary);
    expect(find.text('· 12k'), findsOneWidget);

    expect(find.text('Install'), findsOneWidget);
    expect(
      tester.getSize(find.ancestor(of: find.text('Install'), matching: find.byType(SizedBox)).first).height,
      theme.space.step(8),
      reason: 'glass sm h-8',
    );
    expect(tester.takeException(), isNull);
  });

  testWidgets('the Install button calls back and hides without a callback', (WidgetTester tester) async {
    int installs = 0;
    await tester.pumpWidget(_host(_card(onInstall: () => installs += 1), width: 320));
    await tester.tap(find.text('Install'));
    await tester.pumpAndSettle();
    expect(installs, 1);

    await tester.pumpWidget(_host(_card(), width: 320));
    await tester.pumpAndSettle();
    expect(find.text('Install'), findsOneWidget, reason: 'React는 onInstall이 없어도 버튼을 그립니다');
  });

  testWidgets('omits the score and installs lines when they are absent', (WidgetTester tester) async {
    await tester.pumpWidget(_host(const HoronMarketplaceCard(initials: 'WB', name: 'web-search'), width: 320));
    expect(find.byIcon(Icons.star), findsNothing);
    expect(find.text('· 12k'), findsNothing);
    expect(find.text('Install'), findsOneWidget);
    expect(tester.takeException(), isNull);
  });

  testWidgets('keeps its layout at phone width without overflowing', (WidgetTester tester) async {
    for (final double width in <double>[240, 320, 640]) {
      await tester.pumpWidget(_host(_card(onInstall: () {}), width: width));
      await tester.pumpAndSettle();
      expect(tester.takeException(), isNull, reason: '$width px');
      final Size size = tester.getSize(find.byType(HoronMarketplaceCard));
      expect(size.width, width);
    }
  });
}
