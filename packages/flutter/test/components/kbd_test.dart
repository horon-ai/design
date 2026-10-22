import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:horon_ui/horon_ui.dart';
import 'package:horon_ui/src/components/kbd.dart';

Future<void> pumpKbd(WidgetTester tester, Widget child, {Brightness brightness = Brightness.light}) async {
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
          of: find.byType(HoronKbd),
          matching: find.byWidgetPredicate(
            (Widget widget) => widget is DecoratedBox && widget.decoration is BoxDecoration,
          ),
        )
        .first,
  );
  return box.decoration as BoxDecoration;
}

TextStyle _keyStyle(WidgetTester tester) => tester.widget<Text>(find.text('K')).style!;

void main() {
  testWidgets('kbd: the keycap reads its metrics from the React classes', (WidgetTester tester) async {
    await pumpKbd(tester, const HoronKbd(label: 'K'));

    final Size size = tester.getSize(find.byType(HoronKbd));
    final BoxDecoration decoration = _decoration(tester);
    final ColorScheme scheme = Theme.of(tester.element(find.byType(HoronKbd))).colorScheme;

    // `h-5 min-w-5 rounded-sm border border-border bg-muted text-[11px] font-mono`
    expect(size.height, closeTo(20, 0.01));
    expect(size.width, greaterThanOrEqualTo(20));
    expect((decoration.borderRadius! as BorderRadius).topLeft.x, closeTo(HoronRadius.sm, 0.01));
    expect((decoration.border! as Border).top.color, scheme.outline);
    expect(decoration.color, scheme.surfaceContainerHighest);
    expect(_keyStyle(tester).fontSize, 11);
    expect(_keyStyle(tester).fontFamily, HoronFont.mono);
    expect(_keyStyle(tester).color, scheme.onSurfaceVariant);
  });

  testWidgets('kbd: the light keycap is pale with a dark glyph', (WidgetTester tester) async {
    await pumpKbd(tester, const HoronKbd(label: 'K'));
    final ColorScheme scheme = Theme.of(tester.element(find.byType(HoronKbd))).colorScheme;

    // `bg-muted text-muted-foreground`: the fill is lighter than the glyph.
    expect(_decoration(tester).color, scheme.surfaceContainerHighest);
    expect(_keyStyle(tester).color, scheme.onSurfaceVariant);
    expect(_decoration(tester).color!.computeLuminance(), greaterThan(_keyStyle(tester).color!.computeLuminance()));
  });

  testWidgets('kbd: the dark keycap inverts to a dark fill with a pale glyph', (WidgetTester tester) async {
    await pumpKbd(tester, const HoronKbd(label: 'K'), brightness: Brightness.dark);
    final ColorScheme scheme = Theme.of(tester.element(find.byType(HoronKbd))).colorScheme;

    expect(Theme.of(tester.element(find.byType(HoronKbd))).brightness, Brightness.dark);
    expect(_decoration(tester).color, scheme.surfaceContainerHighest);
    expect(_decoration(tester).color, HoronDarkColors.muted);
    expect(_keyStyle(tester).color, HoronDarkColors.mutedForeground);
    // The inversion: dark fill, pale glyph, the opposite of the light keycap.
    expect(_decoration(tester).color!.computeLuminance(), lessThan(_keyStyle(tester).color!.computeLuminance()));
  });

  testWidgets('kbd: a group spaces its keys and keeps the order', (WidgetTester tester) async {
    await pumpKbd(
      tester,
      const HoronKbdGroup(
        children: <Widget>[
          HoronKbd(label: 'Cmd'),
          HoronKbd(label: 'K'),
        ],
      ),
    );

    expect(find.byType(HoronKbd), findsNWidgets(2));
    expect(tester.getRect(find.text('K')).left, greaterThan(tester.getRect(find.text('Cmd')).right));
  });

  testWidgets('kbd: both brightnesses render', (WidgetTester tester) async {
    for (final Brightness brightness in Brightness.values) {
      await pumpKbd(tester, const HoronKbd(label: 'Esc'), brightness: brightness);
      expect(tester.takeException(), isNull, reason: brightness.name);
    }
  });

  testWidgets('kbd: a missing label and child asserts', (WidgetTester tester) async {
    expect(() => HoronKbd(), throwsA(isA<AssertionError>()));
  });

  testWidgets('kbd: an empty group draws nothing and keeps its row width at zero', (WidgetTester tester) async {
    await pumpKbd(tester, const HoronKbdGroup(children: <Widget>[]));

    expect(tester.getSize(find.byType(HoronKbdGroup)).width, 0);
    expect(tester.takeException(), isNull);
  });
}
