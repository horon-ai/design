import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:horon_ui/horon_ui.dart';

/// `combobox`의 거르기·단일·다중 선택·칩·빈 상태·경계 뒤집기를 확인합니다.
void main() {
  const List<HoronComboboxOption> options = <HoronComboboxOption>[
    HoronComboboxOption(value: 'design', label: 'Design'),
    HoronComboboxOption(value: 'code', label: 'Code'),
    HoronComboboxOption(value: 'research', label: 'Research'),
    HoronComboboxOption(value: 'retired', label: 'Retired', enabled: false),
  ];

  Future<void> pumpCombobox(
    WidgetTester tester,
    Widget child, {
    Brightness brightness = Brightness.light,
    Alignment alignment = Alignment.center,
  }) async {
    await tester.pumpWidget(
      MaterialApp(
        theme: horonTheme(brightness),
        home: Scaffold(
          body: Align(
            alignment: alignment,
            child: SizedBox(width: 280, child: child),
          ),
        ),
      ),
    );
    await tester.pumpAndSettle();
  }

  /// 선택 집합을 스스로 들고 있는 콤보 상자입니다.
  Widget controlled({bool multiple = false, Set<String>? initial}) {
    Set<String> selected = Set<String>.of(initial ?? const <String>{});
    return StatefulBuilder(
      builder: (BuildContext context, StateSetter setState) => HoronCombobox(
        multiple: multiple,
        options: options,
        selected: selected,
        onSelectionChanged: (Set<String> next) => setState(() {
          selected = next;
        }),
      ),
    );
  }

  testWidgets('combobox: typing filters the popup list', (WidgetTester tester) async {
    await pumpCombobox(tester, const HoronCombobox(options: options, placeholder: 'Find a tag'));

    expect(find.text('Find a tag'), findsOneWidget);

    await tester.tap(find.byType(TextField));
    await tester.pumpAndSettle();
    expect(find.text('Research'), findsOneWidget);

    await tester.enterText(find.byType(TextField), 'co');
    await tester.pumpAndSettle();

    expect(find.text('Code'), findsOneWidget);
    expect(find.text('Design'), findsNothing);
    expect(find.text('Research'), findsNothing);
  });

  testWidgets('combobox: a single select reports one value and closes', (WidgetTester tester) async {
    final List<Set<String>> changes = <Set<String>>[];
    await pumpCombobox(tester, HoronCombobox(options: options, onSelectionChanged: changes.add));

    await tester.tap(find.byType(TextField));
    await tester.pumpAndSettle();
    await tester.tap(find.text('Code'));
    await tester.pumpAndSettle();

    expect(changes, <Set<String>>[
      <String>{'code'},
    ]);
    expect(find.byKey(HoronCombobox.contentKey), findsNothing);
  });

  testWidgets('combobox: a multi select accumulates values and draws HoronChips', (WidgetTester tester) async {
    await pumpCombobox(tester, controlled(multiple: true));

    await tester.tap(find.byType(TextField));
    await tester.pumpAndSettle();
    await tester.tap(find.text('Design'));
    await tester.pumpAndSettle();
    await tester.tap(find.text('Code'));
    await tester.pumpAndSettle();

    // 칩은 Material `Chip`이 아니라 todo 8의 [HoronChip]입니다.
    expect(find.byType(HoronChip), findsNWidgets(2));
    expect(find.byType(Chip), findsNothing);
    expect(find.widgetWithText(HoronChip, 'Design'), findsOneWidget);
    expect(find.widgetWithText(HoronChip, 'Code'), findsOneWidget);
  });

  testWidgets('combobox: a chip remove drops its value', (WidgetTester tester) async {
    await pumpCombobox(tester, controlled(multiple: true, initial: <String>{'design', 'code'}));

    expect(find.byType(HoronChip), findsNWidgets(2));

    await tester.tap(find.byKey(HoronChip.removeButtonKey).first);
    await tester.pumpAndSettle();

    expect(find.byType(HoronChip), findsOneWidget);
  });

  testWidgets('combobox: a selected item carries a check mark', (WidgetTester tester) async {
    await pumpCombobox(tester, const HoronCombobox(options: options, selected: <String>{'research'}));

    await tester.tap(find.byType(TextField));
    await tester.pumpAndSettle();

    final int marks = tester
        .widgetList<CustomPaint>(
          find.descendant(of: find.byKey(HoronCombobox.contentKey), matching: find.byType(CustomPaint)),
        )
        .where((CustomPaint paint) => paint.painter is HoronCheckMarkPainter)
        .length;
    expect(marks, 1);
  });

  testWidgets('combobox: a query with no matches shows the empty state', (WidgetTester tester) async {
    await pumpCombobox(tester, const HoronCombobox(options: options, emptyLabel: 'Nothing here'));

    await tester.tap(find.byType(TextField));
    await tester.pumpAndSettle();
    await tester.enterText(find.byType(TextField), 'zzz');
    await tester.pumpAndSettle();

    expect(find.byType(HoronComboboxEmpty), findsOneWidget);
    expect(find.text('Nothing here'), findsOneWidget);
    expect(find.byType(HoronComboboxItem), findsNothing);
  });

  testWidgets('combobox: an empty option list shows the theme string', (WidgetTester tester) async {
    await pumpCombobox(tester, const HoronCombobox(options: <HoronComboboxOption>[]));

    await tester.tap(find.byType(TextField));
    await tester.pumpAndSettle();

    final HoronStrings strings = HoronTheme.of(tester.element(find.byType(HoronComboboxEmpty))).strings;
    expect(find.text(strings.noResults), findsOneWidget);
  });

  testWidgets('combobox: a field near the bottom edge flips the list upward', (WidgetTester tester) async {
    await pumpCombobox(tester, const HoronCombobox(options: options), alignment: Alignment.bottomCenter);

    await tester.tap(find.byType(TextField));
    await tester.pumpAndSettle();

    final Rect field = tester.getRect(find.byType(HoronComboboxInput));
    final Rect list = tester.getRect(find.byKey(HoronCombobox.contentKey));
    expect(list.bottom, lessThanOrEqualTo(field.top));
    expect(list.top, greaterThanOrEqualTo(0));
  });

  testWidgets('combobox: the field near the top keeps the list below', (WidgetTester tester) async {
    await pumpCombobox(tester, const HoronCombobox(options: options), alignment: Alignment.topCenter);

    await tester.tap(find.byType(TextField));
    await tester.pumpAndSettle();

    final Rect field = tester.getRect(find.byType(HoronComboboxInput));
    final Rect list = tester.getRect(find.byKey(HoronCombobox.contentKey));
    expect(list.top, greaterThanOrEqualTo(field.bottom));
  });

  testWidgets('combobox: a disabled item cannot be picked', (WidgetTester tester) async {
    final List<Set<String>> changes = <Set<String>>[];
    await pumpCombobox(tester, HoronCombobox(options: options, onSelectionChanged: changes.add));

    await tester.tap(find.byType(TextField));
    await tester.pumpAndSettle();
    await tester.tap(find.text('Retired'));
    await tester.pumpAndSettle();

    expect(changes, isEmpty);
  });

  testWidgets('combobox: a disabled field never opens', (WidgetTester tester) async {
    await pumpCombobox(tester, const HoronCombobox(options: options, enabled: false));

    await tester.tap(find.byType(TextField), warnIfMissed: false);
    await tester.pumpAndSettle();

    expect(find.byKey(HoronCombobox.contentKey), findsNothing);
  });

  testWidgets('combobox: the chevron button toggles the list', (WidgetTester tester) async {
    await pumpCombobox(tester, const HoronCombobox(options: options));

    await tester.tap(find.byKey(HoronCombobox.toggleKey));
    await tester.pumpAndSettle();
    expect(find.byKey(HoronCombobox.contentKey), findsOneWidget);

    await tester.tap(find.byKey(HoronCombobox.toggleKey));
    await tester.pumpAndSettle();
    expect(find.byKey(HoronCombobox.contentKey), findsNothing);
  });

  testWidgets('combobox: both brightnesses render', (WidgetTester tester) async {
    for (final Brightness brightness in Brightness.values) {
      await pumpCombobox(
        tester,
        const HoronCombobox(multiple: true, options: options, selected: <String>{'design'}, invalid: true),
        brightness: brightness,
      );
      expect(tester.takeException(), isNull, reason: brightness.name);
    }
  });
}
