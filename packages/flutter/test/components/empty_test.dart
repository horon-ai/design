import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:horon_ui/src/components/empty.dart';
import 'package:horon_ui/src/theme/horon_theme.dart';
import 'package:horon_ui/src/tokens/horon_tokens.g.dart';

/// 빈 상태 상자의 폭·테두리와 여섯 조각(Empty·Header·Title·Description·Content·Media)을
/// 확인합니다.
void main() {
  Widget harness(Widget child, {Brightness brightness = Brightness.light}) => MaterialApp(
    theme: horonTheme(brightness),
    home: Scaffold(body: Center(child: child)),
  );

  Finder surfaceFinder() => find.descendant(of: find.byType(HoronEmpty), matching: find.byType(DecoratedBox)).first;

  BoxDecoration surface(WidgetTester tester) =>
      tester.widget<DecoratedBox>(surfaceFinder()).decoration as BoxDecoration;

  testWidgets('empty: the box is 240 wide with a bordered card surface', (WidgetTester tester) async {
    await tester.pumpWidget(
      harness(
        const HoronEmpty(
          header: HoronEmptyHeader(
            title: HoronEmptyTitle('받은 편지가 없습니다'),
            description: HoronEmptyDescription('새 메시지가 오면 여기에 보입니다.'),
          ),
        ),
      ),
    );

    expect(tester.getSize(find.byType(HoronEmpty)).width, 240);
    expect(surface(tester).borderRadius, BorderRadius.circular(HoronRadius.md));
    expect((surface(tester).border! as Border).top.color, HoronLightColors.border);
    expect(find.text('받은 편지가 없습니다'), findsOneWidget);
    expect(find.text('새 메시지가 오면 여기에 보입니다.'), findsOneWidget);
  });

  testWidgets('empty: the icon media variant paints a 32px muted tile', (WidgetTester tester) async {
    await tester.pumpWidget(
      harness(
        const HoronEmpty(
          header: HoronEmptyHeader(
            media: HoronEmptyMedia(variant: HoronEmptyMediaVariant.icon, icon: Icon(Icons.inbox)),
            title: HoronEmptyTitle('비어 있음'),
          ),
        ),
      ),
    );

    final Finder tile = find.byWidgetPredicate(
      (Widget widget) =>
          widget is DecoratedBox &&
          widget.decoration is BoxDecoration &&
          (widget.decoration as BoxDecoration).color == HoronLightColors.muted,
    );
    expect(tile, findsOneWidget);
    expect(tester.getSize(tile), const Size(32, 32));
    expect(
      (tester.widget<DecoratedBox>(tile).decoration as BoxDecoration).borderRadius,
      BorderRadius.circular(HoronRadius.lg),
    );
  });

  testWidgets('empty: the default media variant has no tile behind the icon', (WidgetTester tester) async {
    await tester.pumpWidget(
      harness(
        const HoronEmpty(
          header: HoronEmptyHeader(
            media: HoronEmptyMedia(icon: Icon(Icons.inbox)),
            title: HoronEmptyTitle('비어 있음'),
          ),
        ),
      ),
    );

    expect(
      find.byWidgetPredicate(
        (Widget widget) =>
            widget is DecoratedBox &&
            widget.decoration is BoxDecoration &&
            (widget.decoration as BoxDecoration).color == HoronLightColors.muted,
      ),
      findsNothing,
    );
  });

  testWidgets('empty: the content slot sits below the header', (WidgetTester tester) async {
    await tester.pumpWidget(
      harness(
        HoronEmpty(
          header: const HoronEmptyHeader(title: HoronEmptyTitle('결과 없음')),
          content: HoronEmptyContent(
            child: TextButton(onPressed: () {}, child: const Text('다시 시도')),
          ),
        ),
      ),
    );

    expect(find.text('다시 시도'), findsOneWidget);
    expect(tester.getRect(find.text('다시 시도')).top, greaterThan(tester.getRect(find.text('결과 없음')).bottom));
  });

  testWidgets('empty: a media slot with no icon renders nothing instead of throwing', (WidgetTester tester) async {
    await tester.pumpWidget(harness(const HoronEmptyMedia()));

    expect(tester.takeException(), isNull);
  });

  testWidgets('empty: both brightnesses render their own border', (WidgetTester tester) async {
    for (final Brightness brightness in Brightness.values) {
      await tester.pumpWidget(
        harness(
          const HoronEmpty(header: HoronEmptyHeader(title: HoronEmptyTitle('비어 있음'))),
          brightness: brightness,
        ),
      );
      await tester.pump(const Duration(milliseconds: 400));
      expect(tester.takeException(), isNull, reason: brightness.name);
      final Color expected = brightness == Brightness.dark ? HoronDarkColors.border : HoronLightColors.border;
      expect((surface(tester).border! as Border).top.color, expected, reason: brightness.name);
    }
  });
}
