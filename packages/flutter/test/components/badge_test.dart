import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:horon_ui/horon_ui.dart';

Future<void> pumpBadge(WidgetTester tester, Widget child, {Brightness brightness = Brightness.light}) async {
  await tester.pumpWidget(
    MaterialApp(
      theme: horonTheme(brightness),
      home: Scaffold(body: Center(child: child)),
    ),
  );
  await tester.pumpAndSettle();
}

BoxDecoration _decoration(WidgetTester tester) {
  final DecoratedBox box = tester.widget<DecoratedBox>(
    find
        .descendant(
          of: find.byType(HoronBadge),
          matching: find.byWidgetPredicate(
            (Widget widget) => widget is DecoratedBox && widget.decoration is BoxDecoration,
          ),
        )
        .first,
  );
  return box.decoration as BoxDecoration;
}

TextStyle _labelStyle(WidgetTester tester) => tester.widget<Text>(find.text('Label')).style!;

void main() {
  testWidgets('badge: the six variants paint their own colours', (WidgetTester tester) async {
    for (final HoronBadgeVariant variant in HoronBadgeVariant.values) {
      await pumpBadge(tester, HoronBadge(label: 'Label', variant: variant));
      final ColorScheme scheme = Theme.of(tester.element(find.byType(HoronBadge))).colorScheme;

      final Color expected = switch (variant) {
        HoronBadgeVariant.defaultValue => scheme.primary,
        HoronBadgeVariant.secondary => scheme.secondary,
        HoronBadgeVariant.destructive => scheme.error.withValues(alpha: 0.1),
        HoronBadgeVariant.outline => Colors.transparent,
        HoronBadgeVariant.ghost => Colors.transparent,
        HoronBadgeVariant.link => Colors.transparent,
      };
      expect(_decoration(tester).color, expected, reason: variant.name);
    }
  });

  testWidgets('badge: the destructive fill deepens in dark', (WidgetTester tester) async {
    await pumpBadge(
      tester,
      const HoronBadge(label: 'Label', variant: HoronBadgeVariant.destructive),
      brightness: Brightness.dark,
    );
    final ColorScheme scheme = Theme.of(tester.element(find.byType(HoronBadge))).colorScheme;
    expect(_decoration(tester).color, scheme.error.withValues(alpha: 0.2));
  });

  testWidgets('badge: the surface is a pill and only the outline variant draws a border', (WidgetTester tester) async {
    await pumpBadge(tester, const HoronBadge(label: 'Label', variant: HoronBadgeVariant.outline));
    final BoxDecoration outline = _decoration(tester);
    final ColorScheme scheme = Theme.of(tester.element(find.byType(HoronBadge))).colorScheme;

    expect((outline.borderRadius! as BorderRadius).topLeft.x, closeTo(HoronRadiusRole.pill, 0.01));
    expect((outline.border! as Border).top.color, scheme.outline);

    await pumpBadge(tester, const HoronBadge(label: 'Label'));
    expect((_decoration(tester).border! as Border).top.color, Colors.transparent);
  });

  testWidgets('badge: the icon slots shrink the padding they sit on', (WidgetTester tester) async {
    await pumpBadge(
      tester,
      const HoronBadge(label: 'Label', icon: Icon(Icons.star), trailingIcon: Icon(Icons.chevron_right)),
    );
    final Padding padding = tester.widget<Padding>(
      find.descendant(of: find.byType(HoronBadge), matching: find.byType(Padding)).first,
    );
    final EdgeInsets inset = padding.padding as EdgeInsets;

    expect(find.byIcon(Icons.star), findsOneWidget);
    expect(find.byIcon(Icons.chevron_right), findsOneWidget);
    // React shortens the inner padding to px-1.5 when an icon sits in that slot.
    expect(inset.left, HoronSpace.s1_5);
    expect(inset.right, HoronSpace.s1_5);
    expect(_labelStyle(tester).fontSize, 11);
  });

  testWidgets('badge: an invalid badge draws the destructive border', (WidgetTester tester) async {
    await pumpBadge(tester, const HoronBadge(label: 'Label', variant: HoronBadgeVariant.outline, invalid: true));
    final ColorScheme scheme = Theme.of(tester.element(find.byType(HoronBadge))).colorScheme;
    expect((_decoration(tester).border! as Border).top.color, scheme.error);
  });

  testWidgets('badge: both brightnesses render every variant', (WidgetTester tester) async {
    for (final Brightness brightness in Brightness.values) {
      for (final HoronBadgeVariant variant in HoronBadgeVariant.values) {
        await pumpBadge(
          tester,
          HoronBadge(label: 'Label', variant: variant),
          brightness: brightness,
        );
        expect(tester.takeException(), isNull, reason: '${brightness.name} ${variant.name}');
      }
    }
  });

  testWidgets('badge: a missing label and child asserts', (WidgetTester tester) async {
    expect(() => HoronBadge(), throwsA(isA<AssertionError>()));
  });
}
