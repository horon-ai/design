import 'package:flutter/gestures.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:horon_ui/horon_ui.dart';

Future<void> pumpRow(WidgetTester tester, Widget child, {Brightness brightness = Brightness.light}) async {
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

int _barCount(WidgetTester tester) => tester
    .widgetList<SizedBox>(find.byType(SizedBox))
    .where((SizedBox box) => box.width == 44 && box.height == 3)
    .length;

void main() {
  testWidgets('source row: the tile is 32px at a 10px radius with a 16px icon', (WidgetTester tester) async {
    await pumpRow(
      tester,
      const HoronSourceRow(
        status: HoronSourceStatus.ready,
        icon: Icon(Icons.description_outlined),
        name: 'Q3 metrics',
        detail: '12 pages · 44 chunks',
      ),
    );
    final Container tile = tester.widgetList<Container>(find.byType(Container)).firstWhere((Container box) {
      final Decoration? decoration = box.decoration;
      return decoration is BoxDecoration &&
          decoration.borderRadius != null &&
          (decoration.borderRadius! as BorderRadius).topLeft.x == 10;
    });
    expect(tester.getSize(find.byWidget(tile)), const Size(32, 32));
    expect(IconTheme.of(tester.element(find.byIcon(Icons.description_outlined))).size, 16);
    expect(find.byIcon(Icons.check), findsOneWidget);
    expect(find.text('12 pages · 44 chunks'), findsOneWidget);
  });

  testWidgets('source row: the card is a bordered surface with 12px inline padding', (WidgetTester tester) async {
    await pumpRow(
      tester,
      const HoronSourceRow(
        status: HoronSourceStatus.ready,
        icon: Icon(Icons.description_outlined),
        name: 'Q3 metrics',
        detail: '12 pages · 44 chunks',
      ),
    );
    final HoronThemeData theme = HoronTheme.of(tester.element(find.byType(HoronSourceRow)));
    final Container card = tester.widget<Container>(find.byType(Container).first);
    final BoxDecoration decoration = card.decoration! as BoxDecoration;

    expect(decoration.color, theme.colors.bgSurface, reason: 'bg-bg-surface');
    expect((decoration.border! as Border).top.color, theme.colors.borderDefault, reason: 'border-border-default');
    expect(card.padding, EdgeInsets.symmetric(horizontal: theme.space.s3, vertical: theme.space.s3));
  });

  testWidgets('source row: indexing shows the percent and a sky active bar', (WidgetTester tester) async {
    await pumpRow(
      tester,
      const HoronSourceRow(
        status: HoronSourceStatus.indexing,
        icon: Icon(Icons.description_outlined),
        name: 'Q3 metrics',
        detail: '색인 중',
        progress: 40,
      ),
    );
    expect(find.text('40%'), findsOneWidget);
    expect(_barCount(tester), 4);
    expect(find.byType(FractionallySizedBox), findsOneWidget);
  });

  testWidgets('source row: failed paints the danger detail and a retry button', (WidgetTester tester) async {
    int retries = 0;
    await pumpRow(
      tester,
      HoronSourceRow(
        status: HoronSourceStatus.failed,
        icon: const Icon(Icons.description_outlined),
        name: 'Q3 metrics',
        detail: '파싱에 실패했습니다',
        onRetry: () => retries++,
      ),
    );
    final HoronThemeData theme = HoronTheme.of(tester.element(find.byType(HoronSourceRow)));
    final RichText detail = tester.widget<RichText>(
      find.descendant(of: find.text('파싱에 실패했습니다'), matching: find.byType(RichText)),
    );
    expect(detail.text.style!.color, theme.colors.textDanger);
    expect(find.byIcon(Icons.error_outline), findsOneWidget);
    final Container retry = tester.widget<Container>(
      find.ancestor(of: find.text('Retry'), matching: find.byType(Container)).first,
    );
    expect(retry.constraints?.maxHeight, theme.space.step(7.5), reason: 'h-7.5 = 30');
    expect((retry.decoration! as BoxDecoration).color, theme.colors.overlayInk6);

    final TestGesture pointer = await tester.createGesture(kind: PointerDeviceKind.mouse);
    await pointer.addPointer(location: Offset.zero);
    addTearDown(pointer.removePointer);
    await pointer.moveTo(tester.getCenter(find.text('Retry')));
    await tester.pumpAndSettle();
    expect(
      (tester
                  .widget<Container>(find.ancestor(of: find.text('Retry'), matching: find.byType(Container)).first)
                  .decoration!
              as BoxDecoration)
          .color,
      theme.colors.overlayInk10,
      reason: 'hover:bg-overlay-ink-10',
    );

    await tester.tap(find.text('Retry'));
    await tester.pumpAndSettle();
    expect(retries, 1);
  });

  testWidgets('source row: the list variant drops the card fill and draws a divider', (WidgetTester tester) async {
    await pumpRow(
      tester,
      const HoronSourceRow(
        status: HoronSourceStatus.ready,
        icon: Icon(Icons.description_outlined),
        name: '문서',
        detail: '3 pages',
        card: false,
      ),
    );
    final HoronThemeData theme = HoronTheme.of(tester.element(find.byType(HoronSourceRow)));
    final Container row = tester.widget<Container>(find.byType(Container).first);
    expect((row.decoration! as BoxDecoration).color, isNull);
    expect(((row.decoration! as BoxDecoration).border! as Border).bottom.color, theme.colors.overlayInk8);
  });

  testWidgets('source row: every status renders in both brightnesses', (WidgetTester tester) async {
    for (final Brightness brightness in Brightness.values) {
      for (final HoronSourceStatus status in HoronSourceStatus.values) {
        await pumpRow(
          tester,
          HoronSourceRow(status: status, icon: const Icon(Icons.description_outlined), name: '문서', detail: '설명'),
          brightness: brightness,
        );
        expect(tester.takeException(), isNull, reason: '${brightness.name} ${status.name}');
      }
    }
  });
}
