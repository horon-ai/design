import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:horon_ui/horon_ui.dart';

Future<void> pumpSkeleton(WidgetTester tester, Widget child, {Brightness brightness = Brightness.light}) async {
  await tester.pumpWidget(
    MaterialApp(
      theme: horonTheme(brightness),
      home: Scaffold(body: Center(child: child)),
    ),
  );
  await tester.pump();
}

void main() {
  testWidgets('skeleton: the block shape is 6px and the pill is fully round', (WidgetTester tester) async {
    await pumpSkeleton(tester, const HoronSkeleton(width: 120, height: 12));
    final HoronThemeData theme = HoronTheme.of(tester.element(find.byType(HoronSkeleton)));
    ClipRRect clip = tester.widget<ClipRRect>(
      find.descendant(of: find.byType(HoronSkeleton), matching: find.byType(ClipRRect)).first,
    );
    expect((clip.borderRadius as BorderRadius).topLeft.x, closeTo(6, 0.01));
    expect(tester.getSize(find.byType(HoronSkeleton)), const Size(120, 12));

    await pumpSkeleton(tester, const HoronSkeleton(width: 36, height: 36, pill: true));
    clip = tester.widget<ClipRRect>(
      find.descendant(of: find.byType(HoronSkeleton), matching: find.byType(ClipRRect)).first,
    );
    expect((clip.borderRadius as BorderRadius).topLeft.x, closeTo(theme.radius.full, 0.01));
  });

  testWidgets('skeleton: the fill is the 7% ink token', (WidgetTester tester) async {
    await pumpSkeleton(tester, const HoronSkeleton(width: 60, height: 8));
    final HoronThemeData theme = HoronTheme.of(tester.element(find.byType(HoronSkeleton)));
    final ColoredBox box = tester.widget<ColoredBox>(
      find.descendant(of: find.byType(HoronSkeleton), matching: find.byType(ColoredBox)).first,
    );
    expect(box.color, theme.colors.overlayInk7);
  });

  testWidgets('skeleton: it shimmers and never throws', (WidgetTester tester) async {
    await pumpSkeleton(tester, const HoronSkeleton(width: 80, height: 8));
    await tester.pump(const Duration(milliseconds: 400));
    expect(tester.takeException(), isNull);
  });

  testWidgets('skeleton card: the row shape shows a round 36px block and two lines', (WidgetTester tester) async {
    await pumpSkeleton(tester, const HoronSkeletonCard.row());
    expect(find.byType(HoronSkeleton), findsNWidgets(3));
    expect(find.byType(HoronLiquidGlass), findsOneWidget);
    expect(find.bySemanticsLabel('Loading'), findsWidgets);
  });

  testWidgets('skeleton card: card and text shapes differ in the number of lines', (WidgetTester tester) async {
    await pumpSkeleton(tester, const HoronSkeletonCard.card());
    expect(find.byType(HoronSkeleton), findsNWidgets(5));

    await pumpSkeleton(tester, const HoronSkeletonCard.text());
    expect(find.byType(HoronSkeleton), findsNWidgets(3));
  });

  testWidgets('skeleton: both brightnesses render', (WidgetTester tester) async {
    for (final Brightness brightness in Brightness.values) {
      await pumpSkeleton(tester, const HoronSkeletonCard.row(), brightness: brightness);
      expect(tester.takeException(), isNull, reason: brightness.name);
    }
  });
}
