import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:horon_ui/horon_ui.dart';

Future<void> pumpMarker(WidgetTester tester, Widget child, {Brightness brightness = Brightness.light}) async {
  await tester.pumpWidget(
    MaterialApp(
      theme: horonTheme(brightness),
      home: Scaffold(body: Center(child: child)),
    ),
  );
  await tester.pumpAndSettle();
}

TextStyle _textStyle(WidgetTester tester) => tester.widget<Text>(find.text('Status')).style!;

void main() {
  testWidgets('marker: the six tones paint their own colours', (WidgetTester tester) async {
    for (final HoronMarkerVariant variant in HoronMarkerVariant.values) {
      await pumpMarker(tester, HoronMarker(label: 'Status', variant: variant));
      final BuildContext context = tester.element(find.byType(HoronMarker));
      final ColorScheme scheme = Theme.of(context).colorScheme;
      final HoronThemeData horon = HoronTheme.of(context);

      final Color expected = switch (variant) {
        HoronMarkerVariant.defaultValue => scheme.onSurface,
        HoronMarkerVariant.muted => scheme.onSurfaceVariant,
        HoronMarkerVariant.success => horon.success,
        HoronMarkerVariant.warning => horon.warning,
        HoronMarkerVariant.destructive => scheme.error,
        HoronMarkerVariant.info => horon.info,
      };
      expect(_textStyle(tester).color, expected, reason: variant.name);
    }
  });

  testWidgets('marker: the icon keeps the tone colour and stays out of semantics', (WidgetTester tester) async {
    await pumpMarker(
      tester,
      const HoronMarker(label: 'Status', variant: HoronMarkerVariant.success, icon: Icon(Icons.check_circle_outline)),
    );

    final IconThemeData iconTheme = IconTheme.of(tester.element(find.byIcon(Icons.check_circle_outline)));
    final HoronThemeData horon = HoronTheme.of(tester.element(find.byType(HoronMarker)));

    expect(iconTheme.color, horon.success);
    // React's MarkerIcon is aria-hidden, so the glyph is excluded from the tree.
    expect(find.descendant(of: find.byType(HoronMarkerIcon), matching: find.byType(ExcludeSemantics)), findsWidgets);
  });

  testWidgets('marker: a long label truncates instead of wrapping', (WidgetTester tester) async {
    await pumpMarker(
      tester,
      const SizedBox(width: 120, child: HoronMarker(label: 'A label that is far too long for a single narrow row')),
    );

    final Text text = tester.widget<Text>(find.textContaining('A label that is far too long'));
    expect(text.maxLines, 1);
    expect(text.overflow, TextOverflow.ellipsis);
  });

  testWidgets('marker: both brightnesses render every tone', (WidgetTester tester) async {
    for (final Brightness brightness in Brightness.values) {
      for (final HoronMarkerVariant variant in HoronMarkerVariant.values) {
        await pumpMarker(
          tester,
          HoronMarker(label: 'Status', variant: variant),
          brightness: brightness,
        );
        expect(tester.takeException(), isNull, reason: '${brightness.name} ${variant.name}');
      }
    }
  });

  testWidgets('marker: a missing label and child asserts', (WidgetTester tester) async {
    expect(() => HoronMarker(), throwsA(isA<AssertionError>()));
  });
}
