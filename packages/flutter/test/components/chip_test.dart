import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:horon_ui/horon_ui.dart';
import 'package:horon_ui/src/components/chip.dart';

Future<void> pumpChip(WidgetTester tester, Widget child, {Brightness brightness = Brightness.light}) async {
  await tester.pumpWidget(
    MaterialApp(
      theme: horonTheme(brightness),
      home: Scaffold(body: Center(child: child)),
    ),
  );
}

Color _fill(WidgetTester tester) {
  final DecoratedBox box = tester.widget<DecoratedBox>(
    find
        .descendant(
          of: find.byType(HoronChip),
          matching: find.byWidgetPredicate(
            (Widget widget) => widget is DecoratedBox && widget.decoration is BoxDecoration,
          ),
        )
        .first,
  );
  return (box.decoration as BoxDecoration).color!;
}

BorderRadius _radius(WidgetTester tester) {
  final DecoratedBox box = tester.widget<DecoratedBox>(
    find
        .descendant(
          of: find.byType(HoronChip),
          matching: find.byWidgetPredicate(
            (Widget widget) => widget is DecoratedBox && widget.decoration is BoxDecoration,
          ),
        )
        .first,
  );
  return (box.decoration as BoxDecoration).borderRadius! as BorderRadius;
}

void main() {
  testWidgets('chip: the seven variants paint their own colours', (WidgetTester tester) async {
    for (final HoronChipVariant variant in HoronChipVariant.values) {
      await pumpChip(tester, HoronChip(label: variant.name, variant: variant));
      final ColorScheme scheme = Theme.of(tester.element(find.byType(HoronChip))).colorScheme;
      final HoronThemeData horon = HoronTheme.of(tester.element(find.byType(HoronChip)));

      final Color expected = switch (variant) {
        HoronChipVariant.defaultValue => scheme.primary,
        HoronChipVariant.secondary => scheme.secondary,
        HoronChipVariant.outline => Colors.transparent,
        HoronChipVariant.accent => scheme.secondaryContainer,
        HoronChipVariant.success => horon.success,
        HoronChipVariant.warning => horon.warning,
        HoronChipVariant.destructive => scheme.error,
      };
      expect(_fill(tester), expected, reason: variant.name);
    }
  });

  testWidgets('chip: the surface is a pill', (WidgetTester tester) async {
    await pumpChip(tester, const HoronChip(label: 'Design'));
    final BorderRadius radius = _radius(tester);
    expect(radius.topLeft.x, closeTo(HoronRadiusRole.pill, 0.01));
    expect(radius.bottomRight.x, closeTo(HoronRadiusRole.pill, 0.01));
  });

  testWidgets('chip: the remove affordance calls onRemove', (WidgetTester tester) async {
    int removed = 0;
    await pumpChip(tester, HoronChip(label: 'Design', onRemove: () => removed++));

    // React의 `data-slot="chip-remove"` 자리입니다.
    expect(find.byKey(HoronChip.removeButtonKey), findsOneWidget);

    await tester.tap(find.byKey(HoronChip.removeButtonKey));
    await tester.pumpAndSettle();

    expect(removed, 1);
  });

  testWidgets('chip: the remove label comes from the theme strings', (WidgetTester tester) async {
    await pumpChip(tester, HoronChip(label: 'Design', onRemove: () {}));

    final HoronStrings strings = HoronTheme.of(tester.element(find.byType(HoronChip))).strings;
    // 접근성 이름은 `strings.remove`입니다. React의 `removeLabel = "Remove"` 자리입니다.
    expect(strings.remove, 'Remove');
    expect(
      find.bySemanticsLabel(strings.remove),
      findsOneWidget,
      reason: 'the close button must carry an accessible label',
    );

    // 명시한 라벨이 있으면 그것이 이깁니다.
    await pumpChip(tester, HoronChip(label: 'Design', onRemove: () {}, removeLabel: '지우기'));
    expect(find.bySemanticsLabel('지우기'), findsOneWidget);
  });

  testWidgets('chip: without onRemove there is no close button', (WidgetTester tester) async {
    await pumpChip(tester, const HoronChip(label: 'Design'));
    expect(find.byKey(HoronChip.removeButtonKey), findsNothing);
  });

  testWidgets('chip: both brightnesses render', (WidgetTester tester) async {
    for (final Brightness brightness in Brightness.values) {
      await pumpChip(
        tester,
        HoronChip(label: 'Design', variant: HoronChipVariant.outline, onRemove: () {}),
        brightness: brightness,
      );
      expect(tester.takeException(), isNull, reason: brightness.name);
    }
  });

  testWidgets('chip: a missing label and child asserts', (WidgetTester tester) async {
    expect(() => HoronChip(), throwsA(isA<AssertionError>()));
  });
}
