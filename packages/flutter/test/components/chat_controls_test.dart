import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:horon_ui/horon_ui.dart';

Future<void> pumpControls(WidgetTester tester, Widget child, {Brightness brightness = Brightness.light}) async {
  await tester.pumpWidget(
    MaterialApp(
      theme: horonTheme(brightness),
      home: Scaffold(body: Center(child: child)),
    ),
  );
  await tester.pump();
  await tester.pump(const Duration(milliseconds: 200));
}

void main() {
  testWidgets('jump to latest: 44px clear glass circle with a 20px caret', (WidgetTester tester) async {
    await pumpControls(tester, const HoronJumpToLatest());
    expect(tester.getSize(find.byType(HoronJumpToLatest)), const Size(44, 44));
    expect(tester.widget<HoronLiquidGlass>(find.byType(HoronLiquidGlass).first).tier, HoronGlassTier.clear);
    expect(tester.widget<Icon>(find.byIcon(Icons.keyboard_arrow_down)).size, 20);
  });

  testWidgets('new messages: 40px pill with a 16px caret and the label', (WidgetTester tester) async {
    await pumpControls(tester, const HoronNewMessagesPill(label: '3 new messages'));
    expect(tester.getSize(find.byType(HoronNewMessagesPill)).height, 40);
    expect(find.text('3 new messages'), findsOneWidget);
    expect(tester.widget<Icon>(find.byIcon(Icons.keyboard_arrow_down)).size, 16);
  });

  testWidgets('voice input: 240x52 regular glass with a red stop and a timer', (WidgetTester tester) async {
    await pumpControls(tester, const HoronVoiceInput(elapsed: '0:07'));
    final HoronThemeData theme = HoronTheme.of(tester.element(find.byType(HoronVoiceInput)));

    expect(tester.getSize(find.byType(HoronVoiceInput)), const Size(240, 52));
    expect(find.text('0:07'), findsOneWidget);
    expect(tester.widget<HoronLiquidGlass>(find.byType(HoronLiquidGlass).first).tier, HoronGlassTier.regular);

    final bool hasRedStop = tester.widgetList<Container>(find.byType(Container)).any((Container box) {
      final Decoration? decoration = box.decoration;
      return decoration is BoxDecoration &&
          decoration.color == theme.colors.textDanger &&
          decoration.shape == BoxShape.circle;
    });
    expect(hasRedStop, isTrue);
  });

  testWidgets('voice input: custom levels clamp to at least 4px and the stop fires', (WidgetTester tester) async {
    int stops = 0;
    await pumpControls(
      tester,
      HoronVoiceInput(elapsed: '0:03', levels: const <double>[0, 0.5, 1], recording: false, onStop: () => stops++),
    );
    // 정지 버튼은 왼쪽 8px 여백 뒤 36px 원이므로, 그 중심을 직접 누릅니다.
    await tester.tapAt(tester.getTopLeft(find.byType(HoronVoiceInput)) + const Offset(8 + 18, 26));
    await tester.pump();
    expect(stops, 1);

    final Iterable<Container> bars = tester.widgetList<Container>(find.byType(Container)).where((Container box) {
      final BoxConstraints? constraints = box.constraints;
      return constraints != null && constraints.maxWidth == 3;
    });
    expect(bars.length, 3);
    for (final Container bar in bars) {
      expect(bar.constraints!.maxHeight, greaterThanOrEqualTo(4));
    }
  });

  testWidgets('chat controls: both brightnesses render', (WidgetTester tester) async {
    for (final Brightness brightness in Brightness.values) {
      await pumpControls(tester, const HoronVoiceInput(elapsed: '0:01'), brightness: brightness);
      expect(tester.takeException(), isNull, reason: brightness.name);
      await pumpControls(tester, const HoronJumpToLatest(), brightness: brightness);
      expect(tester.takeException(), isNull, reason: brightness.name);
    }
  });
}
