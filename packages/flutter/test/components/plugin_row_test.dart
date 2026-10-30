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

HoronPluginRow _row({
  ValueChanged<bool>? onEnabledChange,
  VoidCallback? onUpdate,
  VoidCallback? onMenuPressed,
  bool enabled = false,
}) {
  return HoronPluginRow(
    initials: 'PL',
    name: 'filesystem',
    version: 'v1.4.0',
    updateBadge: '업데이트',
    author: 'alpox',
    verified: true,
    chips: const <HoronPluginRowChip>[
      HoronPluginRowChip(id: 'read', label: 'files.read', icon: Icon(Icons.description_outlined)),
      HoronPluginRowChip(id: 'write', label: 'files.write'),
    ],
    enabled: enabled,
    onEnabledChange: onEnabledChange,
    onUpdate: onUpdate,
    onMenuPressed: onMenuPressed,
  );
}

HoronThemeData _themeOf(WidgetTester tester) => HoronTheme.of(tester.element(find.byType(HoronPluginRow)));

Finder _sizedBox(double size) =>
    find.byWidgetPredicate((Widget widget) => widget is SizedBox && widget.width == size && widget.height == size);

Finder _animatedBox(double width, double height) => find.byWidgetPredicate(
  (Widget widget) =>
      widget is AnimatedContainer && widget.constraints?.maxWidth == width && widget.constraints?.maxHeight == height,
);

Finder _decoratedWith(Color color) => find.byWidgetPredicate(
  (Widget widget) =>
      widget is DecoratedBox &&
      widget.decoration is BoxDecoration &&
      (widget.decoration as BoxDecoration).color == color,
);

BoxDecoration _decorationOf(WidgetTester tester, Finder finder) =>
    tester.widget<AnimatedContainer>(finder).decoration! as BoxDecoration;

void main() {
  testWidgets('renders in light and dark without exceptions', (WidgetTester tester) async {
    for (final Brightness brightness in Brightness.values) {
      await tester.pumpWidget(_host(_row(onUpdate: () {}), brightness: brightness, width: 720));
      await tester.pumpAndSettle();
      expect(tester.takeException(), isNull, reason: brightness.name);
    }
  });

  testWidgets('the tile, version and update pill keep their classes', (WidgetTester tester) async {
    await tester.pumpWidget(_host(_row(), width: 720));
    final HoronThemeData theme = _themeOf(tester);

    expect(_sizedBox(theme.space.step(10)), findsOneWidget, reason: 'size-10 타일');
    expect(_decoratedWith(HoronPalette.sky500), findsWidgets);
    final Text initials = tester.widget<Text>(find.text('PL'));
    expect(initials.style?.fontSize, theme.text.labelMd.fontSize);
    expect(initials.style?.color, HoronPalette.neutral50);

    final Text version = tester.widget<Text>(find.text('v1.4.0'));
    expect(version.style?.fontSize, 12);
    expect(version.style?.fontFamily, theme.text.code.fontFamily);
    expect(version.style?.color, theme.colors.textPlaceholder);

    final Container badge = tester.widget<Container>(
      find.ancestor(of: find.text('업데이트'), matching: find.byType(Container)).first,
    );
    expect(badge.constraints?.maxHeight, theme.space.step(5.5));
    expect((badge.decoration! as BoxDecoration).color, theme.colors.accentSky500_18);
  });

  testWidgets('chips are 22px pills on overlay-ink-6 with an 11px icon', (WidgetTester tester) async {
    await tester.pumpWidget(_host(_row(), width: 720));
    final HoronThemeData theme = _themeOf(tester);

    final Container chip = tester.widget<Container>(
      find.ancestor(of: find.text('files.read'), matching: find.byType(Container)).first,
    );
    expect(chip.constraints?.maxHeight, theme.space.step(5.5));
    expect((chip.decoration! as BoxDecoration).color, theme.colors.overlayInk6);

    final Icon icon = tester.widget<Icon>(find.byIcon(Icons.description_outlined));
    expect(IconTheme.of(tester.element(find.byIcon(Icons.description_outlined))).size, theme.space.step(2.75));
    expect(icon.size, isNull, reason: '크기는 IconTheme이 정합니다');
  });

  testWidgets('the verified badge is a 13px sky circle with an 8px check', (WidgetTester tester) async {
    await tester.pumpWidget(_host(_row(), width: 720));
    final HoronThemeData theme = _themeOf(tester);

    expect(_sizedBox(theme.space.step(3.25)), findsOneWidget);
    final Icon check = tester.widget<Icon>(find.byIcon(Icons.check));
    expect(check.size, theme.space.step(2));
    expect(check.color, HoronPalette.neutral50);
  });

  testWidgets('the actions keep their sizes and colours', (WidgetTester tester) async {
    await tester.pumpWidget(_host(_row(onUpdate: () {}, onMenuPressed: () {}), width: 720));
    final HoronThemeData theme = _themeOf(tester);

    final AnimatedContainer update = tester.widget<AnimatedContainer>(
      find.ancestor(of: find.text('Update'), matching: find.byType(AnimatedContainer)).first,
    );
    expect(update.constraints?.maxHeight, theme.space.step(8), reason: 'Update 버튼 h-8');
    expect((update.decoration! as BoxDecoration).color, theme.colors.interactivePrimary);
    expect((update.decoration! as BoxDecoration).borderRadius, BorderRadius.circular(theme.radius.full));

    final Finder toggle = _animatedBox(theme.space.step(11), theme.space.step(6.5));
    expect(toggle, findsOneWidget, reason: 'Switch md 44x26');
    expect(_decorationOf(tester, toggle).color, theme.colors.borderStrong);

    final AnimatedContainer overflow = tester.widget<AnimatedContainer>(
      find.ancestor(of: find.byIcon(Icons.more_horiz), matching: find.byType(AnimatedContainer)).first,
    );
    expect(overflow.constraints?.maxHeight, theme.space.step(8), reason: '오버플로 size-8');
    expect((overflow.decoration! as BoxDecoration).borderRadius, BorderRadius.circular(theme.radius.lg));
    final Icon dots = tester.widget<Icon>(find.byIcon(Icons.more_horiz));
    expect(dots.size, theme.space.step(5));
    expect(dots.color, theme.colors.textPrimary);
  });

  testWidgets('the switch reports the toggled value and paints the checked track', (WidgetTester tester) async {
    bool? reported;
    await tester.pumpWidget(_host(_row(onEnabledChange: (bool value) => reported = value), width: 720));
    final HoronThemeData theme = _themeOf(tester);

    await tester.tap(_animatedBox(theme.space.step(11), theme.space.step(6.5)));
    await tester.pumpAndSettle();
    expect(reported, isTrue);

    await tester.pumpWidget(_host(_row(enabled: true), width: 720));
    await tester.pumpAndSettle();
    expect(
      _decorationOf(tester, _animatedBox(theme.space.step(11), theme.space.step(6.5))).color,
      theme.colors.interactivePrimary,
    );
  });

  testWidgets('the Update and overflow buttons call back', (WidgetTester tester) async {
    int updates = 0;
    int menus = 0;
    await tester.pumpWidget(_host(_row(onUpdate: () => updates += 1, onMenuPressed: () => menus += 1), width: 720));
    final HoronThemeData theme = _themeOf(tester);

    await tester.tap(find.text('Update'));
    await tester.pumpAndSettle();
    expect(updates, 1);

    await tester.tap(find.byIcon(Icons.more_horiz));
    await tester.pumpAndSettle();
    expect(menus, 1);
    expect(tester.takeException(), isNull);
    expect(theme.space.step(8), 32);
  });

  testWidgets('moves the actions below the text under the sm breakpoint', (WidgetTester tester) async {
    await tester.pumpWidget(_host(_row(onUpdate: () {}, onMenuPressed: () {}), width: 900));
    final Offset wideName = tester.getTopLeft(find.text('filesystem'));
    final Offset wideUpdate = tester.getTopLeft(find.text('Update'));
    expect(wideUpdate.dx, greaterThan(wideName.dx), reason: '넓은 폭에서는 액션이 오른쪽입니다');
    expect((wideUpdate.dy - wideName.dy).abs(), lessThan(32), reason: '같은 줄에 있습니다');

    await tester.pumpWidget(_host(_row(onUpdate: () {}, onMenuPressed: () {}), width: 360));
    await tester.pumpAndSettle();
    final Offset narrowName = tester.getTopLeft(find.text('filesystem'));
    final Offset narrowUpdate = tester.getTopLeft(find.text('Update'));
    expect(narrowUpdate.dy, greaterThan(narrowName.dy + 20), reason: '좁은 폭에서는 액션이 아래로 내려갑니다');
    expect(tester.takeException(), isNull);
  });
}
