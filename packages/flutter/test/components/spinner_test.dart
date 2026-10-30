import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:horon_ui/horon_ui.dart';

Future<void> pumpSpinner(WidgetTester tester, Widget child, {Brightness brightness = Brightness.light}) async {
  await tester.pumpWidget(
    MaterialApp(
      theme: horonTheme(brightness),
      home: Scaffold(body: Center(child: child)),
    ),
  );
  await tester.pump();
}

void main() {
  testWidgets('spinner: the four named sizes are 14, 16, 24 and 32', (WidgetTester tester) async {
    const Map<HoronSpinnerSize, double> expected = <HoronSpinnerSize, double>{
      HoronSpinnerSize.xs: 14,
      HoronSpinnerSize.sm: 16,
      HoronSpinnerSize.md: 24,
      HoronSpinnerSize.lg: 32,
    };
    for (final MapEntry<HoronSpinnerSize, double> entry in expected.entries) {
      await pumpSpinner(tester, HoronSpinner(size: entry.key));
      expect(tester.getSize(find.byType(HoronSpinner)), Size(entry.value, entry.value), reason: entry.key.name);
    }
  });

  testWidgets('spinner: a pixel size overrides the named size', (WidgetTester tester) async {
    await pumpSpinner(tester, const HoronSpinner(pixelSize: 15));
    expect(tester.getSize(find.byType(HoronSpinner)), const Size(15, 15));
  });

  testWidgets('spinner: the label is announced', (WidgetTester tester) async {
    await pumpSpinner(tester, const HoronSpinner(label: '불러오는 중'));
    expect(find.bySemanticsLabel('불러오는 중'), findsOneWidget);
  });

  testWidgets('spinner: it draws a ring and an arc and keeps turning', (WidgetTester tester) async {
    await pumpSpinner(tester, const HoronSpinner(size: HoronSpinnerSize.md));
    expect(find.byType(CustomPaint), findsWidgets);

    await tester.pump(const Duration(milliseconds: 200));
    expect(tester.takeException(), isNull);
  });

  testWidgets('spinner: both brightnesses render', (WidgetTester tester) async {
    for (final Brightness brightness in Brightness.values) {
      await pumpSpinner(tester, const HoronSpinner(size: HoronSpinnerSize.lg), brightness: brightness);
      expect(tester.takeException(), isNull, reason: brightness.name);
    }
  });
}
