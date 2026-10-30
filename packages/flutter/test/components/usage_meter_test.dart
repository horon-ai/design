import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:horon_ui/horon_ui.dart';

Future<void> pumpMeter(WidgetTester tester, Widget child, {Brightness brightness = Brightness.light}) async {
  await tester.pumpWidget(
    MaterialApp(
      theme: horonTheme(brightness),
      home: Scaffold(body: Center(child: child)),
    ),
  );
  await tester.pumpAndSettle();
}

void main() {
  testWidgets('usage meter: the card is 300 wide on thick glass', (WidgetTester tester) async {
    await pumpMeter(tester, const HoronUsageMeter(label: 'Tasks', value: 42));
    expect(tester.getSize(find.byType(HoronUsageMeter)).width, 300);
    expect(find.byType(HoronLiquidGlass), findsOneWidget);
  });

  testWidgets('usage meter: label, percent, detail and note are all shown', (WidgetTester tester) async {
    await pumpMeter(
      tester,
      const HoronUsageMeter(label: 'Tasks', value: 64, detail: '10,000개 중 6,420개', note: '11월 1일 초기화'),
    );
    expect(find.text('Tasks'), findsOneWidget);
    expect(find.text('64%'), findsOneWidget);
    expect(find.text('10,000개 중 6,420개'), findsOneWidget);
    expect(find.text('11월 1일 초기화'), findsOneWidget);
  });

  testWidgets('usage meter: the fill is sky-500 over the 8% ink track and follows the value', (
    WidgetTester tester,
  ) async {
    await pumpMeter(tester, const HoronUsageMeter(label: 'Tasks', value: 25));
    final HoronThemeData theme = HoronTheme.of(tester.element(find.byType(HoronUsageMeter)));

    final Iterable<ColoredBox> boxes = tester.widgetList<ColoredBox>(find.byType(ColoredBox));
    expect(boxes.where((ColoredBox b) => b.color == theme.colors.overlayInk8), isNotEmpty);
    expect(boxes.where((ColoredBox b) => b.color == HoronPalette.sky500), isNotEmpty);

    final FractionallySizedBox fill = tester.widget<FractionallySizedBox>(find.byType(FractionallySizedBox));
    expect(fill.widthFactor, closeTo(0.25, 0.001));
  });

  testWidgets('usage meter: the value clamps to 0-100', (WidgetTester tester) async {
    await pumpMeter(tester, const HoronUsageMeter(label: 'Tasks', value: 140));
    final FractionallySizedBox fill = tester.widget<FractionallySizedBox>(find.byType(FractionallySizedBox));
    expect(fill.widthFactor, closeTo(1, 0.001));
    expect(find.text('140%'), findsOneWidget);
  });

  testWidgets('usage meter: both brightnesses render', (WidgetTester tester) async {
    for (final Brightness brightness in Brightness.values) {
      await pumpMeter(tester, const HoronUsageMeter(label: 'Tasks', value: 50), brightness: brightness);
      expect(tester.takeException(), isNull, reason: brightness.name);
    }
  });
}
