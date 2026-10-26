import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:horon_ui/horon_ui.dart';

Future<void> pumpSeparator(WidgetTester tester, Widget child, {Brightness brightness = Brightness.light}) async {
  await tester.pumpWidget(
    MaterialApp(
      theme: horonTheme(brightness),
      home: Scaffold(body: Center(child: child)),
    ),
  );
  await tester.pumpAndSettle();
}

Color _lineColor(WidgetTester tester) {
  final ColoredBox box = tester.widget<ColoredBox>(
    find.descendant(of: find.byType(HoronSeparator), matching: find.byType(ColoredBox)).first,
  );
  return box.color;
}

void main() {
  testWidgets('separator: horizontal is one pixel tall and fills the width', (WidgetTester tester) async {
    await pumpSeparator(tester, const SizedBox(width: 200, child: HoronSeparator()));
    final Size size = tester.getSize(find.byType(HoronSeparator));

    expect(size.height, 1);
    expect(size.width, 200);
    expect(_lineColor(tester), HoronLightColors.border);
  });

  testWidgets('separator: vertical fills its parent height', (WidgetTester tester) async {
    await pumpSeparator(
      tester,
      const SizedBox(
        height: 120,
        child: Row(children: <Widget>[SizedBox(width: 40), HoronSeparator.vertical(), SizedBox(width: 40)]),
      ),
    );
    final Size size = tester.getSize(find.byType(HoronSeparator));

    // React's `data-vertical:self-stretch` in a row with a definite height.
    expect(size.height, 120);
    expect(size.width, 1);
  });

  testWidgets('separator: the line reads the dark border token in dark', (WidgetTester tester) async {
    await pumpSeparator(tester, const SizedBox(width: 200, child: HoronSeparator()), brightness: Brightness.dark);
    expect(_lineColor(tester), HoronDarkColors.border);
    expect(_lineColor(tester), isNot(HoronLightColors.border));
  });

  testWidgets('separator: a label splits the line and is centred', (WidgetTester tester) async {
    await pumpSeparator(tester, const SizedBox(width: 240, child: HoronSeparator(label: 'or')));

    expect(find.text('or'), findsOneWidget);
    expect(tester.getCenter(find.text('or')).dx, closeTo(tester.getCenter(find.byType(HoronSeparator)).dx, 0.5));
  });

  testWidgets('separator: a vertical separator takes no label and an empty label is refused', (
    WidgetTester tester,
  ) async {
    expect(() => HoronSeparator(label: ''), throwsA(isA<AssertionError>()));

    await pumpSeparator(tester, const SizedBox(height: 40, child: Row(children: <Widget>[HoronSeparator.vertical()])));
    expect(find.byType(Text), findsNothing);
  });
}
