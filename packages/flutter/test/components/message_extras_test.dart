import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:horon_ui/horon_ui.dart';

Future<void> pumpExtras(WidgetTester tester, Widget child, {Brightness brightness = Brightness.light}) async {
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
  testWidgets('date separator: the label sits between two ink rules', (WidgetTester tester) async {
    await pumpExtras(tester, const HoronDateSeparator(label: '오늘'));
    final HoronThemeData theme = HoronTheme.of(tester.element(find.byType(HoronDateSeparator)));

    expect(find.text('오늘'), findsOneWidget);
    final Iterable<ColoredBox> rules = tester.widgetList<ColoredBox>(find.byType(ColoredBox));
    expect(rules.where((ColoredBox box) => box.color == theme.colors.overlayInk10).length, 2);
  });

  testWidgets('message actions: a regular glass pill of 30px buttons with 16px icons', (WidgetTester tester) async {
    int copied = 0;
    await pumpExtras(
      tester,
      HoronMessageActions(
        surface: HoronSurface.glass,
        actions: <HoronMessageAction>[
          HoronMessageAction(label: 'Copy', icon: const Icon(Icons.copy), onPressed: () => copied++),
          HoronMessageAction(label: 'Retry', icon: const Icon(Icons.refresh)),
        ],
      ),
    );
    expect(find.byType(HoronLiquidGlass), findsOneWidget);
    expect(tester.widget<HoronLiquidGlass>(find.byType(HoronLiquidGlass)).tier, HoronGlassTier.regular);
    expect(tester.getSize(find.byIcon(Icons.copy)), const Size(16, 16));

    await tester.tap(find.byIcon(Icons.copy));
    await tester.pumpAndSettle();
    expect(copied, 1);
  });

  testWidgets('attachment: a 40px thumb, the name, the detail and the remove button', (WidgetTester tester) async {
    int removed = 0;
    // 폭을 고정한 호스트에 넣으면 280px 단언이 무의미해지므로, 자유 폭으로 띄웁니다.
    await tester.pumpWidget(
      MaterialApp(
        theme: horonTheme(Brightness.light),
        home: Scaffold(
          body: Center(
            child: HoronAttachment(name: 'Q3-board-deck.pdf', detail: 'PDF · 2.4 MB', onRemove: () => removed++),
          ),
        ),
      ),
    );
    await tester.pumpAndSettle();
    final HoronThemeData theme = HoronTheme.of(tester.element(find.byType(HoronAttachment)));
    expect(tester.getSize(find.byType(HoronAttachment)).width, 280);
    expect(find.text('Q3-board-deck.pdf'), findsOneWidget);
    expect(find.text('PDF · 2.4 MB'), findsOneWidget);
    expect(find.byIcon(Icons.description_outlined), findsOneWidget);

    // React dev: 파일 타일은 accent-sky-500-16 바탕에 text-brand 아이콘입니다.
    expect(
      tester
          .widgetList<ColoredBox>(find.byType(ColoredBox))
          .any((ColoredBox box) => box.color == theme.colors.accentSky500_16),
      isTrue,
    );
    expect(tester.widget<Icon>(find.byIcon(Icons.description_outlined)).color, theme.colors.textBrand);
    // 제거는 `IconButton size="sm"`(32px 상자)입니다.
    expect(
      tester.getSize(find.ancestor(of: find.byIcon(Icons.close), matching: find.byType(AnimatedContainer)).first),
      const Size(32, 32),
    );

    await tester.tap(find.byIcon(Icons.close));
    await tester.pumpAndSettle();
    expect(removed, 1);
  });

  testWidgets('code block: the ink surface keeps its header and copies the code', (WidgetTester tester) async {
    // `Clipboard.setData`가 성공해야 'Copied'로 바뀝니다(React는 성공 콜백에서만 바꿉니다).
    final List<MethodCall> calls = <MethodCall>[];
    tester.binding.defaultBinaryMessenger.setMockMethodCallHandler(SystemChannels.platform, (MethodCall call) async {
      calls.add(call);
      return null;
    });
    addTearDown(() => tester.binding.defaultBinaryMessenger.setMockMethodCallHandler(SystemChannels.platform, null));

    await pumpExtras(tester, const HoronCodeBlock(code: 'const a = 1;', language: 'ts'));
    final HoronThemeData theme = HoronTheme.of(tester.element(find.byType(HoronCodeBlock)));

    expect(find.text('ts'), findsOneWidget);
    expect(find.text('Copy'), findsOneWidget);
    final Text code = tester.widget<Text>(find.text('const a = 1;'));
    expect(code.style!.fontSize, theme.text.code.fontSize, reason: 'text-code');
    expect(code.style!.height, theme.text.code.height, reason: 'text-code 행간');
    final bool hasInk = tester.widgetList<ColoredBox>(find.byType(ColoredBox)).any((ColoredBox box) {
      return box.color == theme.colors.surfaceInk;
    });
    expect(hasInk, isTrue);

    // 라벨 자리는 min-w-10(40px)이라 글자가 바뀌어도 폭이 흔들리지 않습니다.
    expect(tester.getSize(find.ancestor(of: find.text('Copy'), matching: find.byType(SizedBox)).first).width, 40);

    await tester.tap(find.text('Copy'));
    await tester.pumpAndSettle();
    final MethodCall write = calls.firstWhere((MethodCall call) => call.method == 'Clipboard.setData');
    expect((write.arguments as Map<Object?, Object?>)['text'], 'const a = 1;');
    expect(find.text('Copied'), findsOneWidget);

    // React dev: 복사 표시는 1.5초 뒤 스스로 되돌아갑니다.
    await tester.pump(const Duration(milliseconds: 1500));
    await tester.pumpAndSettle();
    expect(find.text('Copied'), findsNothing);
    expect(find.text('Copy'), findsOneWidget);
  });

  testWidgets('message extras: both brightnesses render every part', (WidgetTester tester) async {
    for (final Brightness brightness in Brightness.values) {
      for (final Widget part in <Widget>[
        const HoronDateSeparator(label: '오늘'),
        HoronMessageActions(
          actions: <HoronMessageAction>[HoronMessageAction(label: 'Copy', icon: const Icon(Icons.copy))],
        ),
        const HoronAttachment(name: 'a.pdf'),
        const HoronCodeBlock(code: 'x', language: 'sh'),
      ]) {
        await pumpExtras(tester, part, brightness: brightness);
        expect(tester.takeException(), isNull, reason: '${brightness.name} ${part.runtimeType}');
      }
    }
  });
}
