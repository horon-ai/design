import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:horon_ui/horon_ui.dart';

Future<void> pumpHeader(WidgetTester tester, Widget child, {Brightness brightness = Brightness.light}) async {
  await tester.pumpWidget(
    MaterialApp(
      theme: horonTheme(brightness),
      home: Scaffold(
        body: Center(child: SizedBox(width: 420, child: child)),
      ),
    ),
  );
  await tester.pumpAndSettle();
}

void main() {
  testWidgets('tool calls header: a card with 28px r10 chips 8px apart', (WidgetTester tester) async {
    await pumpHeader(
      tester,
      const HoronToolCallsHeader(
        toolIcons: <Widget>[Icon(Icons.search), Icon(Icons.code), Icon(Icons.link)],
        elapsed: '4.0s',
      ),
    );
    expect(find.text('Using tools…'), findsOneWidget);
    expect(find.text('· 4.0s'), findsOneWidget);
    final HoronThemeData theme = HoronTheme.of(tester.element(find.byType(HoronToolCallsHeader)));

    // `rounded-xl border border-border-default bg-bg-surface p-3` — 묶음 전체가 카드입니다.
    final Container card = tester.widget<Container>(
      find.ancestor(of: find.text('Using tools…'), matching: find.byType(Container)).first,
    );
    final BoxDecoration cardDecoration = card.decoration! as BoxDecoration;
    expect(cardDecoration.color, theme.colors.bgSurface);
    expect(cardDecoration.borderRadius, BorderRadius.circular(theme.radius.xl));
    expect((cardDecoration.border! as Border).top.color, theme.colors.borderDefault);
    expect(card.padding, const EdgeInsets.all(12));

    for (final IconData icon in <IconData>[Icons.search, Icons.code, Icons.link]) {
      expect(
        tester.getSize(find.ancestor(of: find.byIcon(icon), matching: find.byType(Container)).first),
        const Size(28, 28),
      );
    }
    // `-ml-2 first:ml-0` — 첫 칩 0, 나머지는 8px씩 겹칩니다: 28 + 2 * 20.
    final Finder chips = find.ancestor(of: find.byIcon(Icons.search), matching: find.byType(Stack)).first;
    expect(tester.getSize(chips).width, 28 + 2 * (28 - 8));
    final double first = tester.getTopLeft(find.byIcon(Icons.search)).dx;
    final double second = tester.getTopLeft(find.byIcon(Icons.code)).dx;
    expect(second - first, 20);

    // 칩은 28x28 r10 옅은 타일에 표면색 2px 링입니다.
    final Container chip = tester.widget<Container>(
      find.ancestor(of: find.byIcon(Icons.search), matching: find.byType(Container)).first,
    );
    final BoxDecoration chipDecoration = chip.decoration! as BoxDecoration;
    expect(chipDecoration.color, theme.colors.bgSubtle);
    expect(chipDecoration.borderRadius, BorderRadius.circular(10));
    expect((chipDecoration.border! as Border).top.color, theme.colors.bgSurface);
    expect((chipDecoration.border! as Border).top.width, 2);
  });

  testWidgets('tool calls header: it folds and unfolds its children', (WidgetTester tester) async {
    await pumpHeader(
      tester,
      const HoronToolCallsHeader(
        children: <Widget>[
          SizedBox(key: Key('card-a'), height: 40),
          SizedBox(key: Key('card-b'), height: 40),
        ],
      ),
    );
    expect(find.byKey(const Key('card-a')), findsOneWidget);

    await tester.tap(find.text('Using tools…'));
    await tester.pumpAndSettle();
    expect(find.byKey(const Key('card-a')), findsNothing);

    await tester.tap(find.text('Using tools…'));
    await tester.pumpAndSettle();
    expect(find.byKey(const Key('card-a')), findsOneWidget);
  });

  testWidgets('tool calls header: a controlled open reports the change', (WidgetTester tester) async {
    bool? reported;
    await pumpHeader(tester, HoronToolCallsHeader(open: true, onOpenChange: (bool value) => reported = value));
    await tester.tap(find.text('Using tools…'));
    await tester.pumpAndSettle();
    expect(reported, isFalse);
  });

  testWidgets('tool calls header: both brightnesses render', (WidgetTester tester) async {
    for (final Brightness brightness in Brightness.values) {
      await pumpHeader(
        tester,
        const HoronToolCallsHeader(toolIcons: <Widget>[Icon(Icons.search)], children: <Widget>[SizedBox(height: 20)]),
        brightness: brightness,
      );
      expect(tester.takeException(), isNull, reason: brightness.name);
    }
  });
}
