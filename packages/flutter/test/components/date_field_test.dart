import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:horon_ui/horon_ui.dart';

Future<void> pumpField(
  WidgetTester tester,
  Widget child, {
  Brightness brightness = Brightness.light,
}) async {
  await tester.pumpWidget(
    MaterialApp(
      theme: horonTheme(brightness),
      home: Scaffold(body: Center(child: SizedBox(width: 360, child: child))),
    ),
  );
  await tester.pumpAndSettle();
}

void main() {
  testWidgets('date field: the placeholder shows when there is no value', (WidgetTester tester) async {
    await pumpField(tester, const HoronDateField(placeholder: '날짜 선택'));
    expect(find.text('날짜 선택'), findsOneWidget);
  });

  testWidgets('date field: a value is formatted through the caller formatter', (WidgetTester tester) async {
    DateTime? picked;
    await pumpField(
      tester,
      HoronDateField(
        value: DateTime(2026, 10, 29),
        formatDate: (DateTime date) => '2026-10-29',
        onValueChange: (DateTime? date) => picked = date,
      ),
    );
    expect(find.text('2026-10-29'), findsOneWidget);
    expect(picked, isNull);
  });

  testWidgets('date field: tapping opens the calendar', (WidgetTester tester) async {
    await pumpField(tester, HoronDateField(value: DateTime(2026, 10, 29), onValueChange: (_) {}));
    await tester.tap(find.byType(HoronDateField));
    await tester.pumpAndSettle();
    expect(find.byType(HoronCalendar), findsWidgets);
  });

  testWidgets('date field: a disabled field does not open', (WidgetTester tester) async {
    await pumpField(tester, const HoronDateField(placeholder: '날짜 선택', disabled: true));
    await tester.tap(find.byType(HoronDateField));
    await tester.pumpAndSettle();
    expect(find.byType(HoronCalendar), findsNothing);
  });

  testWidgets('date field: both brightnesses render', (WidgetTester tester) async {
    for (final Brightness brightness in Brightness.values) {
      await pumpField(tester, const HoronDateField(placeholder: '날짜 선택'), brightness: brightness);
      expect(tester.takeException(), isNull, reason: brightness.name);
    }
  });
}
