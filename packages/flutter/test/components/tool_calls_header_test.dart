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
  testWidgets('tool calls header: the chips are 28px and overlap by 6', (WidgetTester tester) async {
    await pumpHeader(
      tester,
      const HoronToolCallsHeader(
        toolIcons: <Widget>[Icon(Icons.search), Icon(Icons.code), Icon(Icons.link)],
        elapsed: '4.0s',
      ),
    );
    expect(find.text('Using tools…'), findsOneWidget);
    expect(find.text('· 4.0s'), findsOneWidget);
    for (final IconData icon in <IconData>[Icons.search, Icons.code, Icons.link]) {
      expect(
        tester.getSize(find.ancestor(of: find.byIcon(icon), matching: find.byType(Container)).first),
        const Size(28, 28),
      );
    }
    // 세 칩이 6px 씩 겹칩니다: 28 + 2 * 22.
    expect(tester.getSize(find.byType(Stack).first).width, 72);
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
