import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:horon_ui/horon_ui.dart';

/// `autocomplete`의 후보 제안·거르기·선택·빈 상태·경계 뒤집기·키보드 없는 조작을
/// 확인합니다. 키보드 없이 동작한다는 것은 입력에 포커스를 주지 않고 펼침 버튼만
/// 눌러도 목록이 열리고 후보를 탭으로 고를 수 있다는 뜻입니다.
void main() {
  const List<HoronAutocompleteSuggestion> suggestions = <HoronAutocompleteSuggestion>[
    HoronAutocompleteSuggestion(value: 'Seoul', description: 'Korea'),
    HoronAutocompleteSuggestion(value: 'Seattle', description: 'USA'),
    HoronAutocompleteSuggestion(value: 'Busan', description: 'Korea'),
    HoronAutocompleteSuggestion(value: 'Blocked', enabled: false),
  ];

  Future<void> pumpAutocomplete(
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

  testWidgets('autocomplete: typing narrows the suggestion list', (WidgetTester tester) async {
    await pumpAutocomplete(tester, const HoronAutocomplete(suggestions: suggestions, placeholder: 'Find a city'));

    expect(find.text('Find a city'), findsOneWidget);

    await tester.enterText(find.byType(TextField), 'se');
    await tester.pumpAndSettle();

    // "se"를 품은 후보 둘만 남습니다. Busan과 Blocked는 사라집니다.
    expect(find.byType(HoronAutocompleteItem), findsNWidgets(2));
    expect(find.text('Seoul'), findsOneWidget);
    expect(find.text('Seattle'), findsOneWidget);
    expect(find.text('Busan'), findsNothing);
  });

  testWidgets('autocomplete: picking a suggestion fills the field', (WidgetTester tester) async {
    final List<String> selected = <String>[];
    await pumpAutocomplete(tester, HoronAutocomplete(suggestions: suggestions, onSelected: selected.add));

    await tester.enterText(find.byType(TextField), 'bus');
    await tester.pumpAndSettle();
    await tester.tap(find.text('Busan'));
    await tester.pumpAndSettle();

    expect(selected, <String>['Busan']);
    expect(tester.widget<TextField>(find.byType(TextField)).controller!.text, 'Busan');
    expect(find.byKey(HoronAutocomplete.contentKey), findsNothing);
  });

  testWidgets('autocomplete: it opens without a keyboard through the toggle button', (WidgetTester tester) async {
    await pumpAutocomplete(tester, const HoronAutocomplete(suggestions: suggestions));

    // 입력에 포커스를 주지 않고 펼침 버튼만 눌러도 목록이 열립니다.
    await tester.tap(find.byKey(HoronAutocomplete.toggleKey));
    await tester.pumpAndSettle();
    expect(find.byKey(HoronAutocomplete.contentKey), findsOneWidget);

    // 후보를 탭으로 고를 수 있습니다.
    await tester.tap(find.text('Seattle'));
    await tester.pumpAndSettle();
    expect(tester.widget<TextField>(find.byType(TextField)).controller!.text, 'Seattle');
  });

  testWidgets('autocomplete: a query with no matches shows the empty state', (WidgetTester tester) async {
    await pumpAutocomplete(tester, const HoronAutocomplete(suggestions: suggestions, emptyLabel: 'No city'));

    await tester.enterText(find.byType(TextField), 'zzz');
    await tester.pumpAndSettle();

    expect(find.byType(HoronAutocompleteEmpty), findsOneWidget);
    expect(find.text('No city'), findsOneWidget);
    expect(find.byType(HoronAutocompleteItem), findsNothing);
  });

  testWidgets('autocomplete: no suggestions at all shows the theme string', (WidgetTester tester) async {
    await pumpAutocomplete(tester, const HoronAutocomplete(suggestions: <HoronAutocompleteSuggestion>[]));

    await tester.tap(find.byKey(HoronAutocomplete.toggleKey));
    await tester.pumpAndSettle();

    final HoronStrings strings = HoronTheme.of(tester.element(find.byType(HoronAutocompleteEmpty))).strings;
    expect(find.text(strings.noResults), findsOneWidget);
  });

  testWidgets('autocomplete: a field near the bottom edge flips the list upward', (WidgetTester tester) async {
    await pumpAutocomplete(
      tester,
      const HoronAutocomplete(suggestions: suggestions),
      alignment: Alignment.bottomCenter,
    );

    await tester.tap(find.byKey(HoronAutocomplete.toggleKey));
    await tester.pumpAndSettle();

    final Rect field = tester.getRect(find.byType(HoronAutocompleteInput));
    final Rect list = tester.getRect(find.byKey(HoronAutocomplete.contentKey));
    expect(list.bottom, lessThanOrEqualTo(field.top));
    expect(list.top, greaterThanOrEqualTo(0));
  });

  testWidgets('autocomplete: a field near the top keeps the list below', (WidgetTester tester) async {
    await pumpAutocomplete(tester, const HoronAutocomplete(suggestions: suggestions), alignment: Alignment.topCenter);

    await tester.tap(find.byKey(HoronAutocomplete.toggleKey));
    await tester.pumpAndSettle();

    final Rect field = tester.getRect(find.byType(HoronAutocompleteInput));
    final Rect list = tester.getRect(find.byKey(HoronAutocomplete.contentKey));
    expect(list.top, greaterThanOrEqualTo(field.bottom));
  });

  testWidgets('autocomplete: a disabled suggestion cannot be picked', (WidgetTester tester) async {
    final List<String> selected = <String>[];
    await pumpAutocomplete(tester, HoronAutocomplete(suggestions: suggestions, onSelected: selected.add));

    await tester.tap(find.byKey(HoronAutocomplete.toggleKey));
    await tester.pumpAndSettle();
    await tester.tap(find.text('Blocked'));
    await tester.pumpAndSettle();

    expect(selected, isEmpty);
    expect(tester.widget<TextField>(find.byType(TextField)).controller!.text, isEmpty);
  });

  testWidgets('autocomplete: the description line renders under the value', (WidgetTester tester) async {
    await pumpAutocomplete(tester, const HoronAutocomplete(suggestions: suggestions));

    await tester.tap(find.byKey(HoronAutocomplete.toggleKey));
    await tester.pumpAndSettle();

    expect(find.text('Korea'), findsNWidgets(2));
    final Rect value = tester.getRect(find.text('Seoul'));
    final Rect description = tester.getRect(find.text('Korea').first);
    expect(description.top, greaterThanOrEqualTo(value.bottom));
  });

  testWidgets('autocomplete: a disabled field never opens', (WidgetTester tester) async {
    await pumpAutocomplete(tester, const HoronAutocomplete(suggestions: suggestions, enabled: false));

    await tester.tap(find.byKey(HoronAutocomplete.toggleKey), warnIfMissed: false);
    await tester.pumpAndSettle();
    expect(find.byKey(HoronAutocomplete.contentKey), findsNothing);
  });

  testWidgets('autocomplete: both brightnesses render', (WidgetTester tester) async {
    for (final Brightness brightness in Brightness.values) {
      await pumpAutocomplete(
        tester,
        const HoronAutocomplete(suggestions: suggestions, invalid: true, placeholder: 'Find'),
        brightness: brightness,
      );
      expect(tester.takeException(), isNull, reason: brightness.name);
    }
  });
}
