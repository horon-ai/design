import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:horon_ui/horon_ui.dart';

Future<void> pumpToggle(WidgetTester tester, Widget child, {Brightness brightness = Brightness.light}) async {
  await tester.pumpWidget(
    MaterialApp(
      theme: horonTheme(brightness),
      home: Scaffold(body: Center(child: child)),
    ),
  );
}

Color _surfaceColor(WidgetTester tester) {
  final DecoratedBox box = tester.widget<DecoratedBox>(
    find
        .descendant(
          of: find.byType(HoronToggle),
          matching: find.byWidgetPredicate(
            (Widget widget) => widget is DecoratedBox && widget.decoration is BoxDecoration,
          ),
        )
        .first,
  );
  return (box.decoration as BoxDecoration).color!;
}

void main() {
  testWidgets('toggle: the three sizes render at the React heights', (WidgetTester tester) async {
    const Map<HoronToggleSize, double> expected = <HoronToggleSize, double>{
      HoronToggleSize.sm: 28, // "h-7"
      HoronToggleSize.defaultValue: 32, // "h-[32px]"
      HoronToggleSize.lg: 37, // "h-[37px]"
    };

    for (final MapEntry<HoronToggleSize, double> entry in expected.entries) {
      await pumpToggle(tester, HoronToggle(label: 'Bold', size: entry.key, onPressedChange: (bool _) {}));
      expect(
        tester.getSize(find.byType(HoronToggle)).height,
        closeTo(entry.value, 0.5),
        reason: 'height for ${entry.key.name}',
      );
    }
  });

  testWidgets('toggle: pressing flips the state and reports it', (WidgetTester tester) async {
    final List<bool> changes = <bool>[];
    await pumpToggle(tester, HoronToggle(label: 'Bold', onPressedChange: changes.add));

    final ColorScheme scheme = Theme.of(tester.element(find.byType(HoronToggle))).colorScheme;
    // 꺼진 상태는 투명 배경입니다("bg-transparent").
    expect(_surfaceColor(tester), Colors.transparent);

    await tester.tap(find.byType(HoronToggle));
    await tester.pumpAndSettle();

    expect(changes, <bool>[true]);
    // 켜진 상태는 "data-pressed:bg-accent"입니다.
    expect(_surfaceColor(tester), scheme.secondaryContainer);

    await tester.tap(find.byType(HoronToggle));
    await tester.pumpAndSettle();

    expect(changes, <bool>[true, false]);
    expect(_surfaceColor(tester), Colors.transparent);
  });

  testWidgets('toggle: a controlled toggle follows the owner, not its own taps', (WidgetTester tester) async {
    await pumpToggle(tester, HoronToggle(label: 'Bold', pressed: false, onPressedChange: (bool _) {}));
    expect(_surfaceColor(tester), Colors.transparent);

    // 소유자가 값을 바꾸지 않으면 눌러도 켜지지 않습니다.
    await tester.tap(find.byType(HoronToggle));
    await tester.pumpAndSettle();
    expect(_surfaceColor(tester), Colors.transparent);

    await pumpToggle(tester, HoronToggle(label: 'Bold', pressed: true, onPressedChange: (bool _) {}));
    expect(_surfaceColor(tester), Theme.of(tester.element(find.byType(HoronToggle))).colorScheme.secondaryContainer);
  });

  testWidgets('toggle: outline variant draws a border and default does not', (WidgetTester tester) async {
    await pumpToggle(
      tester,
      HoronToggle(label: 'Bold', variant: HoronToggleVariant.outline, onPressedChange: (bool _) {}),
    );
    final ColorScheme scheme = Theme.of(tester.element(find.byType(HoronToggle))).colorScheme;
    DecoratedBox box = tester.widget<DecoratedBox>(
      find
          .descendant(
            of: find.byType(HoronToggle),
            matching: find.byWidgetPredicate(
              (Widget widget) => widget is DecoratedBox && widget.decoration is BoxDecoration,
            ),
          )
          .first,
    );
    expect((box.decoration as BoxDecoration).border!.top.color, scheme.outline);

    await pumpToggle(tester, HoronToggle(label: 'Bold', onPressedChange: (bool _) {}));
    box = tester.widget<DecoratedBox>(
      find
          .descendant(
            of: find.byType(HoronToggle),
            matching: find.byWidgetPredicate(
              (Widget widget) => widget is DecoratedBox && widget.decoration is BoxDecoration,
            ),
          )
          .first,
    );
    expect((box.decoration as BoxDecoration).border!.top.color, Colors.transparent);
  });

  testWidgets('toggle: a disabled toggle does not change state', (WidgetTester tester) async {
    int calls = 0;
    await pumpToggle(tester, HoronToggle(label: 'Bold', disabled: true, onPressedChange: (bool _) => calls++));

    await tester.tap(find.byType(HoronToggle), warnIfMissed: false);
    await tester.pumpAndSettle();

    expect(calls, 0);
    expect(_surfaceColor(tester), Colors.transparent);
  });

  testWidgets('toggle: both brightnesses render', (WidgetTester tester) async {
    for (final Brightness brightness in Brightness.values) {
      await pumpToggle(
        tester,
        HoronToggle(label: 'Bold', variant: HoronToggleVariant.outline, onPressedChange: (bool _) {}),
        brightness: brightness,
      );
      expect(tester.takeException(), isNull, reason: brightness.name);
    }
  });
}
