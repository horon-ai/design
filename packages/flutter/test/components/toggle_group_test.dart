import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:horon_ui/horon_ui.dart';
import 'package:horon_ui/src/components/toggle_group.dart';

Future<void> pumpGroup(WidgetTester tester, Widget child, {Brightness brightness = Brightness.light}) async {
  await tester.pumpWidget(
    MaterialApp(
      theme: horonTheme(brightness),
      home: Scaffold(body: Center(child: child)),
    ),
  );
}

List<Widget> _items() => const <Widget>[
  HoronToggleGroupItem(value: 'bold', label: 'Bold'),
  HoronToggleGroupItem(value: 'italic', label: 'Italic'),
  HoronToggleGroupItem(value: 'underline', label: 'Underline'),
];

void main() {
  testWidgets('toggle_group: single selection keeps one value', (WidgetTester tester) async {
    final List<Set<String>> changes = <Set<String>>[];
    await pumpGroup(tester, HoronToggleGroup(onChanged: changes.add, children: _items()));

    await tester.tap(find.text('Bold'));
    await tester.pumpAndSettle();
    expect(changes.last, <String>{'bold'});

    await tester.tap(find.text('Italic'));
    await tester.pumpAndSettle();
    // 단일 선택: 앞의 선택이 사라지고 마지막 하나만 남습니다.
    expect(changes.last, <String>{'italic'});

    // 이미 눌린 항목을 다시 누르면 비워집니다.
    await tester.tap(find.text('Italic'));
    await tester.pumpAndSettle();
    expect(changes.last, isEmpty);
  });

  testWidgets('toggle_group: multiple selection accumulates', (WidgetTester tester) async {
    final List<Set<String>> changes = <Set<String>>[];
    await pumpGroup(tester, HoronToggleGroup(multiple: true, onChanged: changes.add, children: _items()));

    await tester.tap(find.text('Bold'));
    await tester.pumpAndSettle();
    expect(changes.last, <String>{'bold'});

    await tester.tap(find.text('Italic'));
    await tester.pumpAndSettle();
    // 다중 선택: 앞의 선택이 남습니다.
    expect(changes.last, <String>{'bold', 'italic'});

    await tester.tap(find.text('Bold'));
    await tester.pumpAndSettle();
    expect(changes.last, <String>{'italic'});
  });

  testWidgets('toggle_group: the pressed item fills its cell', (WidgetTester tester) async {
    await pumpGroup(tester, HoronToggleGroup(onChanged: (Set<String> _) {}, children: _items()));

    Color backgroundOf(String label) {
      final DecoratedBox box = tester.widget<DecoratedBox>(
        find
            .ancestor(
              of: find.text(label),
              matching: find.byWidgetPredicate(
                (Widget widget) => widget is DecoratedBox && widget.decoration is BoxDecoration,
              ),
            )
            .first,
      );
      return (box.decoration as BoxDecoration).color!;
    }

    final ColorScheme scheme = Theme.of(tester.element(find.text('Bold'))).colorScheme;
    expect(backgroundOf('Bold'), Colors.transparent);

    await tester.tap(find.text('Bold'));
    await tester.pumpAndSettle();

    // default 컨테이너에서 눌린 항목은 "data-pressed:bg-background"입니다.
    expect(backgroundOf('Bold'), scheme.surface);
    expect(backgroundOf('Italic'), Colors.transparent);
  });

  testWidgets('toggle_group: outline and default containers differ in surface', (WidgetTester tester) async {
    Color containerOf() {
      final DecoratedBox box = tester.widget<DecoratedBox>(
        find
            .descendant(
              of: find.byType(HoronToggleGroup),
              matching: find.byWidgetPredicate(
                (Widget widget) => widget is DecoratedBox && widget.decoration is BoxDecoration,
              ),
            )
            .first,
      );
      return (box.decoration as BoxDecoration).color!;
    }

    await pumpGroup(tester, HoronToggleGroup(onChanged: (Set<String> _) {}, children: _items()));
    final ColorScheme scheme = Theme.of(tester.element(find.text('Bold'))).colorScheme;
    expect(containerOf(), scheme.surfaceContainerHighest);

    await pumpGroup(
      tester,
      HoronToggleGroup(variant: HoronToggleGroupVariant.outline, onChanged: (Set<String> _) {}, children: _items()),
    );
    expect(containerOf(), Colors.transparent);
  });

  testWidgets('toggle_group: a controlled group reports without changing itself', (WidgetTester tester) async {
    final List<Set<String>> changes = <Set<String>>[];
    await pumpGroup(
      tester,
      HoronToggleGroup(selected: const <String>{'bold'}, onChanged: changes.add, children: _items()),
    );

    await tester.tap(find.text('Italic'));
    await tester.pumpAndSettle();

    expect(changes.last, <String>{'italic'});
    // 소유자가 selected를 바꾸지 않았으므로 화면은 그대로입니다.
    final ColorScheme scheme = Theme.of(tester.element(find.text('Bold'))).colorScheme;
    final DecoratedBox boldBox = tester.widget<DecoratedBox>(
      find
          .ancestor(
            of: find.text('Bold'),
            matching: find.byWidgetPredicate(
              (Widget widget) => widget is DecoratedBox && widget.decoration is BoxDecoration,
            ),
          )
          .first,
    );
    expect((boldBox.decoration as BoxDecoration).color, scheme.surface);
  });

  testWidgets('toggle_group: an item outside a group never fires', (WidgetTester tester) async {
    // 그룹 없이 홀로 놓인 항목은 선택 집합이 없어 눌러도 아무 일도 하지 않습니다.
    await pumpGroup(tester, const HoronToggleGroupItem(value: 'bold', label: 'Bold'));

    await tester.tap(find.text('Bold'), warnIfMissed: false);
    await tester.pumpAndSettle();
    expect(tester.takeException(), isNull);
  });

  testWidgets('toggle_group: both brightnesses render', (WidgetTester tester) async {
    for (final Brightness brightness in Brightness.values) {
      await pumpGroup(
        tester,
        HoronToggleGroup(onChanged: (Set<String> _) {}, children: _items()),
        brightness: brightness,
      );
      expect(tester.takeException(), isNull, reason: brightness.name);
    }
  });
}
