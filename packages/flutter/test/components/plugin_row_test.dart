import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:horon_ui/horon_ui.dart';
import 'package:horon_ui/src/theme/horon_motion.dart';

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
    // Paper `1VKS-0`: 타일 글자 14/20 600
    expect(initials.style?.fontWeight, HoronFontWeight.semibold);
    expect(initials.style?.color, HoronPalette.neutral50);

    // Paper `1VKS-0`: 이름 14/20 600
    expect(tester.widget<Text>(find.text('filesystem')).style?.fontWeight, HoronFontWeight.semibold);

    final Text version = tester.widget<Text>(find.text('v1.4.0'));
    // `font-mono text-label-sm text-text-secondary`
    expect(version.style?.fontSize, theme.text.labelSm.fontSize);
    expect(version.style?.height, theme.text.labelSm.height);
    expect(version.style?.fontFamily, theme.text.code.fontFamily);
    expect(version.style?.color, theme.colors.textSecondary);

    final Text author = tester.widget<Text>(find.text('alpox'));
    expect(author.style?.fontSize, theme.text.labelSm.fontSize);
    expect(author.style?.color, theme.colors.textSecondary);

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

  testWidgets('the verified badge is a 14px sky circle with an 8px check', (WidgetTester tester) async {
    await tester.pumpWidget(_host(_row(), width: 720));
    final HoronThemeData theme = _themeOf(tester);

    // 14×14 술어는 `Icon`이 만드는 SizedBox도 잡으므로(Update의 `arrow_upward` 14px),
    // 채움 원과 색으로 배지만 고릅니다.
    final Finder badge = find.byWidgetPredicate(
      (Widget widget) =>
          widget is DecoratedBox &&
          widget.decoration is BoxDecoration &&
          (widget.decoration as BoxDecoration).shape == BoxShape.circle &&
          (widget.decoration as BoxDecoration).color == HoronPalette.sky500,
    );
    expect(badge, findsOneWidget);
    expect(tester.getSize(badge), const Size(14, 14), reason: 'size-3.5 배지');
    final Icon check = tester.widget<Icon>(find.byIcon(Icons.check));
    expect(check.size, theme.space.step(2));
    expect(check.color, HoronPalette.neutral50);
  });

  testWidgets('the actions keep their sizes and colours', (WidgetTester tester) async {
    await tester.pumpWidget(_host(_row(onUpdate: () {}, onMenuPressed: () {}), width: 720));
    final HoronThemeData theme = _themeOf(tester);

    // Update는 `Button`의 `solid`·`sm`입니다. dev React가 primary에서 solid로 바꿨습니다.
    final HoronButton update = tester.widget<HoronButton>(find.byType(HoronButton));
    expect(update.variant, HoronButtonVariant.solid);
    expect(update.size, HoronButtonSize.sm);
    expect(update.label, 'Update');
    expect(tester.getSize(find.byIcon(Icons.arrow_upward)).width, theme.space.s3_5);

    final Finder toggle = _animatedBox(theme.space.step(11), theme.space.step(6.5));
    expect(toggle, findsOneWidget, reason: 'Switch md 44x26');
    expect(_decorationOf(tester, toggle).color, theme.colors.borderStrong);

    // 오버플로는 `IconButton`의 `ghost`·`sm`입니다.
    final HoronIconButton overflow = tester.widget<HoronIconButton>(find.byType(HoronIconButton));
    expect(overflow.variant, HoronIconButtonVariant.ghost);
    expect(overflow.size, HoronIconButtonSize.sm);
    expect(overflow.label, 'More');
    expect(tester.getSize(find.byIcon(Icons.more_horiz)).width, theme.space.s4, reason: 'IconButton sm 16');

    // 액션 사이 간격은 `gap-2`(8)입니다.
    final Wrap actions = tester.widget<Wrap>(find.ancestor(of: find.text('Update'), matching: find.byType(Wrap)).first);
    expect(actions.spacing, theme.space.s2);
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

  testWidgets('the Update button collapses when there is no callback', (WidgetTester tester) async {
    await tester.pumpWidget(_host(_row(), width: 720));
    await tester.pumpAndSettle();

    // `motion-reveal-x` — 버튼은 트리에 남지만 자리를 비우고 입력·포커스에서 빠집니다.
    expect(tester.widget<HoronReveal>(find.byType(HoronReveal)).collapsed, isTrue);
    expect(tester.getSize(find.byType(HoronReveal)).width, 0);
    expect(
      tester
          .widget<IgnorePointer>(
            find.ancestor(of: find.byType(HoronButton), matching: find.byType(IgnorePointer)).first,
          )
          .ignoring,
      isTrue,
    );

    await tester.pumpWidget(_host(_row(onUpdate: () {}), width: 720));
    await tester.pumpAndSettle();
    expect(tester.widget<HoronReveal>(find.byType(HoronReveal)).collapsed, isFalse);
    expect(tester.getSize(find.byType(HoronReveal)).width, greaterThan(0));
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
