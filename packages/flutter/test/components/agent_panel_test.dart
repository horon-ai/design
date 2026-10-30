import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:horon_ui/horon_ui.dart';

Future<void> pumpPanel(WidgetTester tester, Widget child, {Brightness brightness = Brightness.light}) async {
  await tester.pumpWidget(
    MaterialApp(
      theme: horonTheme(brightness),
      home: Scaffold(
        body: Center(child: SizedBox(width: 560, child: child)),
      ),
    ),
  );
  await tester.pumpAndSettle();
}

void main() {
  testWidgets('agent panel: a surface plate with the 24px radius and 16px padding', (WidgetTester tester) async {
    await pumpPanel(tester, const HoronAgentPanel(filter: Text('필터'), children: <Widget>[Text('블록')]));
    final HoronThemeData theme = HoronTheme.of(tester.element(find.byType(HoronAgentPanel)));
    final Container plate = tester.widget<Container>(find.byType(Container).first);
    final BoxDecoration decoration = plate.decoration! as BoxDecoration;

    expect(decoration.color, theme.colors.bgSurface);
    expect((decoration.borderRadius! as BorderRadius).topLeft.x, 24);
    expect(find.text('필터'), findsOneWidget);
    expect(find.text('블록'), findsOneWidget);
  });

  testWidgets('composer chip: a 30px 5% ink chip with the bot tile or the project icon', (WidgetTester tester) async {
    await pumpPanel(tester, const HoronComposerChip(label: 'Analyst', initial: 'A'));
    expect(tester.getSize(find.byType(HoronComposerChip)).height, 30);
    expect(find.text('Analyst'), findsOneWidget);
    expect(find.byIcon(Icons.keyboard_arrow_down), findsOneWidget);

    await pumpPanel(tester, const HoronComposerChip(label: 'Q3 board', icon: Icon(Icons.folder_outlined)));
    expect(find.byIcon(Icons.folder_outlined), findsOneWidget);
  });

  testWidgets('task composer: typing reports the value and Start calls back', (WidgetTester tester) async {
    String? typed;
    int starts = 0;
    await pumpPanel(
      tester,
      HoronTaskComposer(
        onValueChange: (String value) => typed = value,
        onStart: () => starts++,
        pickers: const <Widget>[
          HoronComposerChip(label: 'Analyst', initial: 'A'),
          HoronComposerChip(label: 'Q3 board', icon: Icon(Icons.folder_outlined)),
        ],
      ),
    );
    expect(find.byType(HoronKbd), findsNWidgets(2));
    expect(find.text('Start'), findsOneWidget);

    await tester.enterText(find.byType(TextField), '보드 덱을 만들어 줘');
    await tester.pump();
    expect(typed, '보드 덱을 만들어 줘');

    await tester.tap(find.text('Start'));
    await tester.pumpAndSettle();
    expect(starts, 1);
  });

  testWidgets('task composer: the placeholder is shown when empty', (WidgetTester tester) async {
    await pumpPanel(tester, const HoronTaskComposer());
    expect(find.text('Describe a task for a bot'), findsOneWidget);
  });

  testWidgets('agent panel: every part renders in both brightnesses', (WidgetTester tester) async {
    for (final Brightness brightness in Brightness.values) {
      await pumpPanel(
        tester,
        HoronAgentPanel(
          children: <Widget>[
            HoronTaskComposer(
              pickers: const <Widget>[HoronComposerChip(label: 'Bot', initial: 'B')],
            ),
          ],
        ),
        brightness: brightness,
      );
      expect(tester.takeException(), isNull, reason: brightness.name);
    }
  });
}
