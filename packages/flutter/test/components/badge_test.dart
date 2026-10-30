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

BoxDecoration _chip(WidgetTester tester) {
  final Container box = tester.widget<Container>(find.byType(Container).first);
  return box.decoration! as BoxDecoration;
}

void main() {
  testWidgets('badge: the chip is 22 tall at the pill radius', (WidgetTester tester) async {
    await pumpBadge(tester, const HoronBadge(label: '신규'));
    final HoronThemeData theme = HoronTheme.of(tester.element(find.byType(HoronBadge)));
    expect(tester.getSize(find.byType(HoronBadge)).height, 22);
    expect((_chip(tester).borderRadius! as BorderRadius).topLeft.x, closeTo(theme.radius.full, 0.01));
  });

  testWidgets('badge: every tone paints its own pair', (WidgetTester tester) async {
    for (final HoronBadgeTone tone in HoronBadgeTone.values) {
      await pumpBadge(tester, HoronBadge(label: 'Label', tone: tone));
      final HoronThemeData theme = HoronTheme.of(tester.element(find.byType(HoronBadge)));
      final (Color expected, Color text) = switch (tone) {
        HoronBadgeTone.neutral => (theme.colors.overlayInk6, theme.colors.textSecondary),
        HoronBadgeTone.brand => (theme.colors.accentSky500_18, theme.colors.textBrand),
        HoronBadgeTone.danger => (theme.colors.accentRed500_14, theme.colors.textDanger),
        HoronBadgeTone.solid => (theme.colors.interactivePrimary, theme.colors.interactiveOnPrimary),
      };
      expect(_chip(tester).color, expected, reason: tone.name);
      expect(tester.widget<Text>(find.text('Label')).style!.color, text, reason: tone.name);
    }
  });

  testWidgets('badge: the dot adds a 6px status circle', (WidgetTester tester) async {
    await pumpBadge(tester, const HoronBadge(label: 'Live', tone: HoronBadgeTone.brand, dot: true));
    final HoronThemeData theme = HoronTheme.of(tester.element(find.byType(HoronBadge)));
    final Iterable<Container> dots = tester.widgetList<Container>(find.byType(Container)).where((Container c) {
      final Decoration? decoration = c.decoration;
      return decoration is BoxDecoration &&
          decoration.shape == BoxShape.circle &&
          decoration.color == theme.colors.statusLive;
    });
    expect(dots, isNotEmpty);
    expect(tester.getSize(find.byWidget(dots.first)), const Size(6, 6));
  });

  testWidgets('badge: both brightnesses render every tone', (WidgetTester tester) async {
    for (final Brightness brightness in Brightness.values) {
      for (final HoronBadgeTone tone in HoronBadgeTone.values) {
        await pumpBadge(
          tester,
          HoronBadge(label: 'Label', tone: tone, dot: true),
          brightness: brightness,
        );
        expect(tester.takeException(), isNull, reason: '${brightness.name} ${tone.name}');
      }
    }
  });
}
