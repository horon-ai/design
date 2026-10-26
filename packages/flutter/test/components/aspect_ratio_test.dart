import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:horon_ui/horon_ui.dart';

Future<void> pumpRatio(WidgetTester tester, Widget child) async {
  await tester.pumpWidget(
    MaterialApp(
      theme: horonTheme(Brightness.light),
      home: Scaffold(body: Center(child: child)),
    ),
  );
  await tester.pumpAndSettle();
}

void main() {
  testWidgets('aspect ratio: 16/9 yields width/height == 16/9', (WidgetTester tester) async {
    await pumpRatio(
      tester,
      const SizedBox(
        width: 320,
        child: HoronAspectRatio(child: ColoredBox(color: Colors.transparent)),
      ),
    );

    final Size size = tester.getSize(find.byType(HoronAspectRatio));
    expect(size.width, 320);
    expect(size.width / size.height, closeTo(16 / 9, 0.0001));
  });

  testWidgets('aspect ratio: a custom ratio drives the height', (WidgetTester tester) async {
    await pumpRatio(
      tester,
      const SizedBox(
        width: 200,
        child: HoronAspectRatio(ratio: 4 / 3, child: SizedBox.expand()),
      ),
    );

    final Size size = tester.getSize(find.byType(HoronAspectRatio));
    expect(size.width / size.height, closeTo(4 / 3, 0.0001));
  });

  testWidgets('aspect ratio: overflowing content is clipped to the box', (WidgetTester tester) async {
    await pumpRatio(
      tester,
      const SizedBox(
        width: 160,
        child: HoronAspectRatio(
          child: OverflowBox(maxWidth: 400, maxHeight: 400, child: ColoredBox(color: Colors.transparent)),
        ),
      ),
    );

    // `overflow-hidden`: the box keeps its ratio even when the child is larger.
    final Size size = tester.getSize(find.byType(HoronAspectRatio));
    expect(size.width, 160);
    expect(size.width / size.height, closeTo(16 / 9, 0.0001));
    expect(find.descendant(of: find.byType(HoronAspectRatio), matching: find.byType(ClipRect)), findsWidgets);
  });

  testWidgets('aspect ratio: a non-positive ratio asserts', (WidgetTester tester) async {
    expect(() => HoronAspectRatio(ratio: 0), throwsA(isA<AssertionError>()));
    expect(() => HoronAspectRatio(ratio: -1), throwsA(isA<AssertionError>()));
  });
}
