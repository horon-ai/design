import 'package:flutter/gestures.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:horon_ui/horon_ui.dart';

Widget _host(Widget child, {Brightness brightness = Brightness.light}) => MaterialApp(
  theme: horonTheme(brightness),
  home: Scaffold(body: Center(child: child)),
);

HoronThemeData _theme(WidgetTester tester) => HoronTheme.of(tester.element(find.byType(HoronIconButton)));

Finder _surface() => find.descendant(of: find.byType(HoronIconButton), matching: find.byType(AnimatedContainer));

BoxDecoration _decoration(WidgetTester tester) =>
    tester.widget<AnimatedContainer>(_surface()).decoration! as BoxDecoration;

Color? _iconColor(WidgetTester tester) => IconTheme.of(tester.element(find.byType(Icon))).color;

void main() {
  testWidgets('default state renders in light and dark', (WidgetTester tester) async {
    for (final Brightness brightness in Brightness.values) {
      await tester.pumpWidget(
        _host(
          HoronIconButton(icon: const Icon(Icons.add), label: '추가', onPressed: () {}),
          brightness: brightness,
        ),
      );
      expect(tester.takeException(), isNull);
    }
  });

  testWidgets('each size paints the square and the icon size React sets', (WidgetTester tester) async {
    for (final HoronIconButtonSize size in HoronIconButtonSize.values) {
      await tester.pumpWidget(
        _host(HoronIconButton(icon: const Icon(Icons.add), label: '추가', size: size, onPressed: () {})),
      );
      await tester.pumpAndSettle();
      final (double side, double iconSize) = switch (size) {
        HoronIconButtonSize.sm => (32, 16), // size-8 [&_svg]:size-4
        HoronIconButtonSize.md => (40, 20), // size-10 [&_svg]:size-5
        HoronIconButtonSize.lg => (48, 24), // size-12 [&_svg]:size-6
      };
      expect(tester.getSize(_surface()), Size(side, side), reason: '$size 상자');
      expect(IconTheme.of(tester.element(find.byType(Icon))).size, iconSize, reason: '$size 아이콘');
      final double reach = side < 44 ? 44 : side;
      expect(tester.getSize(find.byType(HoronIconButton)), Size(reach, reach), reason: 'after:min-h-11 after:min-w-11');
    }
  });

  testWidgets('each variant paints its own background and foreground', (WidgetTester tester) async {
    for (final HoronIconButtonVariant variant in HoronIconButtonVariant.values) {
      await tester.pumpWidget(
        _host(HoronIconButton(icon: const Icon(Icons.add), label: '추가', variant: variant, onPressed: () {})),
      );
      final HoronColors colors = _theme(tester).colors;
      final (Color background, Color foreground) expected = switch (variant) {
        HoronIconButtonVariant.primary => (colors.interactivePrimary, colors.interactiveOnPrimary),
        HoronIconButtonVariant.ghost => (Colors.transparent, colors.textPrimary),
        HoronIconButtonVariant.glass => (colors.glassClear, colors.textPrimary),
      };
      expect(_decoration(tester).color, expected.$1, reason: '$variant 배경색');
      expect((_decoration(tester).shape), BoxShape.circle, reason: 'rounded-full');
      expect(_iconColor(tester), expected.$2, reason: '$variant 아이콘색');
    }
  });

  testWidgets('hover on ghost lays the ink overlay and tapping calls onPressed', (WidgetTester tester) async {
    int taps = 0;
    final TestGesture pointer = await tester.createGesture(kind: PointerDeviceKind.mouse);
    await pointer.addPointer(location: Offset.zero);
    addTearDown(pointer.removePointer);

    await tester.pumpWidget(
      _host(HoronIconButton(icon: const Icon(Icons.add), label: '추가', onPressed: () => taps += 1)),
    );
    await pointer.moveTo(tester.getCenter(find.byType(HoronIconButton)));
    await tester.pump();
    expect(_decoration(tester).color, _theme(tester).colors.overlayInk6, reason: 'hover:bg-overlay-ink-6');

    await tester.tap(find.byType(HoronIconButton));
    await tester.pumpAndSettle();
    expect(taps, 1);
  });

  testWidgets('the accessible name is the React aria-label, and a disabled button is inert', (
    WidgetTester tester,
  ) async {
    final SemanticsHandle handle = tester.ensureSemantics();
    int taps = 0;
    await tester.pumpWidget(
      _host(HoronIconButton(icon: const Icon(Icons.add), label: '추가', onPressed: () => taps += 1)),
    );
    expect(find.bySemanticsLabel('추가'), findsOneWidget);

    await tester.pumpWidget(
      _host(HoronIconButton(icon: const Icon(Icons.add), label: '추가', enabled: false, onPressed: () => taps += 1)),
    );
    await tester.tap(find.byType(HoronIconButton));
    await tester.pumpAndSettle();
    expect(taps, 0);
    expect(
      tester.widget<Opacity>(find.descendant(of: find.byType(HoronIconButton), matching: find.byType(Opacity))).opacity,
      0.4,
      reason: 'data-disabled:opacity-40',
    );
    handle.dispose();
  });
}
