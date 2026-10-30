import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:horon_ui/horon_ui.dart';

Future<void> pumpKbd(WidgetTester tester, Widget child, {Brightness brightness = Brightness.light}) async {
  await tester.pumpWidget(
    MaterialApp(
      theme: horonTheme(brightness),
      home: Scaffold(body: Center(child: child)),
    ),
  );
  await tester.pumpAndSettle();
}

BoxDecoration _chip(WidgetTester tester) {
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

void main() {
  testWidgets('kbd: the chip is 6% ink at the xs radius', (WidgetTester tester) async {
    await pumpKbd(tester, const HoronKbd(label: 'K'));
    final HoronThemeData theme = HoronTheme.of(tester.element(find.byType(HoronKbd)));
    final BoxDecoration decoration = _chip(tester);

    expect(decoration.color, theme.colors.overlayInk6);
    expect((decoration.borderRadius! as BorderRadius).topLeft.x, closeTo(theme.radius.xs, 0.01));
    expect(theme.radius.xs, 6);
  });

  testWidgets('kbd: the label is caption text in the secondary colour', (WidgetTester tester) async {
    await pumpKbd(tester, const HoronKbd(label: '⌘K'));
    final HoronThemeData theme = HoronTheme.of(tester.element(find.byType(HoronKbd)));
    final TextStyle style = tester.widget<Text>(find.text('⌘K')).style!;

    expect(style.fontSize, theme.text.caption.fontSize);
    expect(style.color, theme.colors.textSecondary);
  });

  testWidgets('kbd: an icon sits in front at 12px', (WidgetTester tester) async {
    await pumpKbd(tester, const HoronKbd(label: '⌘K', icon: Icon(Icons.keyboard_command_key)));
    final IconThemeData iconTheme = IconTheme.of(tester.element(find.byIcon(Icons.keyboard_command_key)));

    expect(find.byIcon(Icons.keyboard_command_key), findsOneWidget);
    expect(iconTheme.size, 12);
  });

  testWidgets('kbd: both brightnesses render', (WidgetTester tester) async {
    for (final Brightness brightness in Brightness.values) {
      await pumpKbd(tester, const HoronKbd(label: 'Esc'), brightness: brightness);
      expect(tester.takeException(), isNull, reason: brightness.name);
      expect(find.text('Esc'), findsOneWidget);
    }
  });

  testWidgets('kbd: a missing label and child asserts', (WidgetTester tester) async {
    expect(() => HoronKbd(), throwsA(isA<AssertionError>()));
  });
}
