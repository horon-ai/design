import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:horon_ui/horon_ui.dart';

Future<void> pumpBubble(WidgetTester tester, Widget child, {Brightness brightness = Brightness.light}) async {
  await tester.pumpWidget(
    MaterialApp(
      theme: horonTheme(brightness),
      home: Scaffold(
        body: Center(child: SizedBox(width: 600, child: child)),
      ),
    ),
  );
  await tester.pumpAndSettle();
}

BoxDecoration _bubbleDecoration(WidgetTester tester) {
  final Container box = tester.widget<Container>(
    find.descendant(of: find.byType(HoronChatBubble), matching: find.byType(Container)).first,
  );
  return box.decoration! as BoxDecoration;
}

void main() {
  testWidgets('chat bubble: mine is ink at the 20px radius', (WidgetTester tester) async {
    await pumpBubble(tester, const HoronChatBubble(child: Text('안녕하세요')));
    final HoronThemeData theme = HoronTheme.of(tester.element(find.byType(HoronChatBubble)));
    final BoxDecoration decoration = _bubbleDecoration(tester);

    expect(decoration.color, theme.colors.interactivePrimary);
    expect((decoration.borderRadius! as BorderRadius).topLeft.x, closeTo(theme.radius.xl, 0.01));
    final RichText painted = tester.widget<RichText>(
      find.descendant(of: find.text('안녕하세요'), matching: find.byType(RichText)),
    );
    expect(painted.text.style!.color, theme.colors.interactiveOnPrimary);
  });

  testWidgets('chat bubble: the bot side is a flat subtle surface, right-aligned decides the edge', (
    WidgetTester tester,
  ) async {
    await pumpBubble(tester, const HoronChatBubble(fromMe: false, child: Text('무엇을 도와드릴까요?')));
    final HoronThemeData theme = HoronTheme.of(tester.element(find.byType(HoronChatBubble)));

    expect(_bubbleDecoration(tester).color, theme.colors.bgSubtle);
    // 이름과 달리 왼쪽 정렬을 확인하지 않던 자리입니다. 봇 쪽은 왼쪽에 붙습니다.
    expect(tester.widget<Align>(find.byType(Align).first).alignment, Alignment.centerLeft);
    final RichText painted = tester.widget<RichText>(
      find.descendant(of: find.text('무엇을 도와드릴까요?'), matching: find.byType(RichText)),
    );
    expect(painted.text.style!.color, theme.colors.textPrimary);

    await pumpBubble(tester, const HoronChatBubble(child: Text('내 쪽')));
    final Align align = tester.widget<Align>(find.byType(Align).first);
    expect(align.alignment, Alignment.centerRight);
  });

  testWidgets('chat bubble: the width stops at 560', (WidgetTester tester) async {
    await pumpBubble(tester, const HoronChatBubble(child: SizedBox(key: Key('body'), width: 900, height: 20)));
    final Size size = tester.getSize(
      find.ancestor(of: find.byKey(const Key('body')), matching: find.byType(Container)).first,
    );
    expect(size.width, lessThanOrEqualTo(560));
  });

  testWidgets('chat bubble: both sides render in both brightnesses', (WidgetTester tester) async {
    for (final Brightness brightness in Brightness.values) {
      for (final bool mine in <bool>[true, false]) {
        await pumpBubble(
          tester,
          HoronChatBubble(fromMe: mine, child: const Text('문장')),
          brightness: brightness,
        );
        expect(tester.takeException(), isNull, reason: '${brightness.name} mine=$mine');
      }
    }
  });
}
