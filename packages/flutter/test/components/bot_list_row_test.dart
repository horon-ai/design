import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:horon_ui/horon_ui.dart';

Future<void> pumpRow(WidgetTester tester, Widget child, {Brightness brightness = Brightness.light}) async {
  await tester.pumpWidget(
    MaterialApp(
      theme: horonTheme(brightness),
      home: Scaffold(
        body: Center(child: SizedBox(width: 360, child: child)),
      ),
    ),
  );
  await tester.pumpAndSettle();
}

void main() {
  testWidgets('bot list row: the name, time and preview are laid out', (WidgetTester tester) async {
    await pumpRow(tester, const HoronBotListRow(name: '지원 봇', time: '8:41 AM', preview: '세 개의 문서를 요약했습니다'));
    final HoronThemeData theme = HoronTheme.of(tester.element(find.byType(HoronBotListRow)));

    expect(find.text('지원 봇'), findsOneWidget);
    expect(find.text('8:41 AM'), findsOneWidget);
    expect(find.text('세 개의 문서를 요약했습니다'), findsOneWidget);
    expect(tester.widget<Text>(find.text('지원 봇')).style!.fontSize, theme.text.labelLg.fontSize);
    expect(find.byType(HoronAvatar), findsOneWidget);
  });

  testWidgets('bot list row: selected paints 10% ink and hover 5%', (WidgetTester tester) async {
    await pumpRow(tester, const HoronBotListRow(name: '봇', selected: true));
    final HoronThemeData theme = HoronTheme.of(tester.element(find.byType(HoronBotListRow)));
    bool paints(Color colour) {
      return tester
          .widgetList<Container>(find.descendant(of: find.byType(HoronBotListRow), matching: find.byType(Container)))
          .any((Container box) {
            final Decoration? decoration = box.decoration;
            return decoration is BoxDecoration && decoration.color == colour;
          });
    }

    expect(paints(theme.colors.overlayInk10), isTrue, reason: 'selected 이면 10% 잉크');

    await pumpRow(tester, const HoronBotListRow(name: '봇'));
    expect(paints(theme.colors.overlayInk10), isFalse);
    expect(paints(theme.colors.overlayInk5), isFalse, reason: 'hover 전에는 바탕이 없습니다');
  });

  testWidgets('bot list row: tapping calls back and the live dot shows', (WidgetTester tester) async {
    int taps = 0;
    await pumpRow(tester, HoronBotListRow(name: '봇', live: true, onTap: () => taps++));
    await tester.tap(find.byType(HoronBotListRow));
    await tester.pumpAndSettle();
    expect(taps, 1);
  });

  testWidgets('bot list row: both brightnesses render', (WidgetTester tester) async {
    for (final Brightness brightness in Brightness.values) {
      await pumpRow(
        tester,
        const HoronBotListRow(name: '봇', time: '9:00', preview: '대기 중'),
        brightness: brightness,
      );
      expect(tester.takeException(), isNull, reason: brightness.name);
    }
  });
}
