import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:horon_ui/horon_ui.dart';

Future<void> pumpPanel(WidgetTester tester, Widget child, {Brightness brightness = Brightness.light}) async {
  await tester.pumpWidget(
    MaterialApp(
      theme: horonTheme(brightness),
      home: Scaffold(body: Center(child: child)),
    ),
  );
  await tester.pumpAndSettle();
}

BoxDecoration _decoration(WidgetTester tester) {
  final Container box = tester.widget<Container>(
    find.descendant(of: find.byType(HoronCodePanel), matching: find.byType(Container)).first,
  );
  return box.decoration! as BoxDecoration;
}

void main() {
  testWidgets('code panel: the surface is neutral-50 at a 10px radius with a hairline', (WidgetTester tester) async {
    await pumpPanel(tester, const HoronCodePanel(code: 'key: value'));
    final HoronThemeData theme = HoronTheme.of(tester.element(find.byType(HoronCodePanel)));
    final BoxDecoration decoration = _decoration(tester);

    expect(decoration.color, HoronPalette.neutral50);
    expect((decoration.borderRadius! as BorderRadius).topLeft.x, closeTo(10, 0.01));
    expect((decoration.border! as Border).top.color, theme.colors.borderDefault);
  });

  testWidgets('code panel: dark swaps the fill to neutral-800', (WidgetTester tester) async {
    await pumpPanel(tester, const HoronCodePanel(code: 'key: value'), brightness: Brightness.dark);
    expect(_decoration(tester).color, HoronPalette.neutral800);
  });

  testWidgets('code panel: the text is 12px mono on a 21px pitch', (WidgetTester tester) async {
    await pumpPanel(tester, const HoronCodePanel(code: 'alpha: 1'));
    final HoronThemeData theme = HoronTheme.of(tester.element(find.byType(HoronCodePanel)));
    final Text text = tester.widget<Text>(find.text('alpha: 1'));

    expect(text.style!.fontSize, 12);
    expect(text.style!.height, closeTo(21 / 12, 0.001));
    expect(text.style!.fontFamily, theme.text.code.fontFamily);
    expect(text.softWrap, isFalse);
  });

  testWidgets('code panel: a code key uses the syntax key colour', (WidgetTester tester) async {
    await pumpPanel(tester, const HoronCodeKey(label: 'title'));
    final HoronThemeData theme = HoronTheme.of(tester.element(find.byType(HoronCodeKey)));
    expect(tester.widget<Text>(find.text('title')).style!.color, theme.colors.syntaxKey);
  });

  testWidgets('code panel: long lines scroll instead of clipping', (WidgetTester tester) async {
    await pumpPanel(
      tester,
      const SizedBox(
        width: 200,
        child: HoronCodePanel(code: 'a_really_long_line_that_cannot_fit_in_two_hundred_pixels: ok'),
      ),
    );
    expect(find.byType(SingleChildScrollView), findsWidgets);
    expect(tester.takeException(), isNull);
  });
}
