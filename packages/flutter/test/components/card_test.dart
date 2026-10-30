import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:horon_ui/horon_ui.dart';

Future<void> pumpCard(WidgetTester tester, Widget child, {Brightness brightness = Brightness.light}) async {
  await tester.pumpWidget(
    MaterialApp(
      theme: horonTheme(brightness),
      home: Scaffold(
        body: Center(child: SizedBox(width: 320, child: child)),
      ),
    ),
  );
  await tester.pumpAndSettle();
}

void main() {
  testWidgets('card: the glass surface is a 20px rounded thick glass card', (WidgetTester tester) async {
    await pumpCard(tester, const HoronCard(title: '제목', description: '설명'));
    expect(find.byType(HoronLiquidGlass), findsOneWidget);
    final ClipRRect clip = tester.widget<ClipRRect>(
      find.descendant(of: find.byType(HoronCard), matching: find.byType(ClipRRect)).first,
    );
    expect((clip.borderRadius as BorderRadius).topLeft.x, closeTo(20, 0.01));
    expect(find.text('제목'), findsOneWidget);
    expect(find.text('설명'), findsOneWidget);
  });

  testWidgets('card: the frost surface drops the glass layer for a frosted fill', (WidgetTester tester) async {
    await pumpCard(tester, const HoronCard(title: '제목', frost: true));
    final HoronThemeData theme = HoronTheme.of(tester.element(find.byType(HoronCard)));
    expect(find.byType(HoronLiquidGlass), findsNothing);
    final DecoratedBox box = tester.widget<DecoratedBox>(
      find.descendant(of: find.byType(HoronCard), matching: find.byType(DecoratedBox)).first,
    );
    expect((box.decoration as BoxDecoration).color, theme.colors.glassFillFrost);
  });

  testWidgets('card: an interactive card shows the caret and reports taps', (WidgetTester tester) async {
    int taps = 0;
    await pumpCard(tester, HoronCard(title: '열기', interactive: true, onTap: () => taps++));
    expect(find.byIcon(Icons.chevron_right), findsOneWidget);
    await tester.tap(find.byType(HoronCard));
    await tester.pumpAndSettle();
    expect(taps, 1);
  });

  testWidgets('card: the title row keeps the 8px gap', (WidgetTester tester) async {
    await pumpCard(tester, HoronCard(title: '열기', interactive: true, onTap: () {}));
    final HoronThemeData theme = HoronThemeData.light;
    final Row titleRow = tester.widget<Row>(
      find.descendant(of: find.byType(HoronCard), matching: find.byType(Row)).first,
    );
    expect(titleRow.spacing, theme.space.s2, reason: 'Paper UAP-1: 제목 행 gap 8');
  });

  testWidgets('card: the selected card adds the brand border', (WidgetTester tester) async {
    await pumpCard(tester, const HoronCard(title: '선택됨', selected: true));
    final HoronThemeData theme = HoronTheme.of(tester.element(find.byType(HoronCard)));
    final bool hasBrandBorder = tester.widgetList<DecoratedBox>(find.byType(DecoratedBox)).any((DecoratedBox box) {
      final Decoration decoration = box.decoration;
      return decoration is BoxDecoration &&
          decoration.border is Border &&
          (decoration.border! as Border).top.color == theme.colors.borderBrand;
    });
    expect(hasBrandBorder, isTrue);
  });

  testWidgets('card: both surfaces render in both brightnesses', (WidgetTester tester) async {
    for (final Brightness brightness in Brightness.values) {
      for (final bool frost in <bool>[false, true]) {
        await pumpCard(
          tester,
          HoronCard(title: '제목', frost: frost),
          brightness: brightness,
        );
        expect(tester.takeException(), isNull, reason: '${brightness.name} frost=$frost');
      }
    }
  });
}
