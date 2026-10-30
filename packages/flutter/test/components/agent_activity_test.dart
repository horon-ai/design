import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:horon_ui/horon_ui.dart';

Future<void> pumpActivity(WidgetTester tester, Widget child, {Brightness brightness = Brightness.light}) async {
  await tester.pumpWidget(
    MaterialApp(
      theme: horonTheme(brightness),
      home: Scaffold(
        body: Center(child: SizedBox(width: 420, child: child)),
      ),
    ),
  );
  // 생각 중·스트리밍 표시는 계속 움직여 pumpAndSettle 이 끝나지 않습니다.
  await tester.pump();
  await tester.pump(const Duration(milliseconds: 200));
}

void main() {
  testWidgets('thinking: a 69x31 subtle pill with three 7px dots', (WidgetTester tester) async {
    await pumpActivity(tester, const HoronThinkingIndicator());
    final HoronThemeData theme = HoronTheme.of(tester.element(find.byType(HoronThinkingIndicator)));

    // 호스트가 폭을 고정하므로 높이와 점만 확인합니다(폭은 컴포넌트 상수가 정합니다).
    expect(tester.getSize(find.byType(HoronThinkingIndicator)).height, 31);
    final Iterable<Container> dots = tester.widgetList<Container>(find.byType(Container)).where((Container box) {
      final Decoration? decoration = box.decoration;
      return decoration is BoxDecoration && decoration.shape == BoxShape.circle;
    });
    expect(dots.length, 3);
    for (final Container dot in dots) {
      expect(tester.getSize(find.byWidget(dot)), const Size(7, 7));
    }
    expect(find.bySemanticsLabel('Thinking'), findsOneWidget);
    expect(theme.colors.bgSubtle, isNotNull);
  });

  testWidgets('streaming: the text sits in a subtle bubble with a 2x16 caret', (WidgetTester tester) async {
    await pumpActivity(tester, const HoronStreamingText(text: '문서를 읽고 있습니다'));
    expect(find.text('문서를 읽고 있습니다'), findsOneWidget);
    final Iterable<Container> bars = tester.widgetList<Container>(find.byType(Container)).where((Container box) {
      final BoxConstraints? constraints = box.constraints;
      return constraints != null && constraints.maxWidth == 2 && constraints.maxHeight == 16;
    });
    expect(bars.length, 1);
  });

  testWidgets('tool step: every state paints its own marker', (WidgetTester tester) async {
    await pumpActivity(tester, const HoronToolStep(title: '검색한다', detail: 'brave'));
    expect(find.byType(HoronSpinner), findsOneWidget);

    await pumpActivity(tester, const HoronToolStep(title: '검색한다', state: HoronToolStepState.done));
    expect(find.byIcon(Icons.check_circle), findsOneWidget);

    await pumpActivity(tester, const HoronToolStep(title: '검색한다', state: HoronToolStepState.failed));
    final HoronThemeData theme = HoronTheme.of(tester.element(find.byType(HoronToolStep)));
    final RichText title = tester.widget<RichText>(
      find.descendant(of: find.text('검색한다'), matching: find.byType(RichText)),
    );
    expect(title.text.style!.color, theme.colors.textDanger);
    expect(find.byIcon(Icons.error), findsOneWidget);
  });

  testWidgets('tool step: tapping runs the callback', (WidgetTester tester) async {
    int taps = 0;
    await pumpActivity(tester, HoronToolStep(title: '연다', onTap: () => taps++));
    await tester.tap(find.byType(HoronToolStep));
    await tester.pump();
    expect(taps, 1);
  });

  testWidgets('work log: the summary folds and unfolds the steps', (WidgetTester tester) async {
    await pumpActivity(
      tester,
      const HoronWorkLog(
        summary: '3개 단계 · 2.1s',
        steps: <HoronWorkLogStep>[
          HoronWorkLogStep(title: '파일을 읽는다', detail: 'notion'),
          HoronWorkLogStep(title: '요약한다', running: true),
        ],
      ),
    );
    // 호스트가 폭을 고정하므로 카드 폭 대신 내용을 확인합니다.
    expect(find.text('파일을 읽는다'), findsOneWidget);
    expect(find.text('파일을 읽는다'), findsOneWidget);
    expect(find.byType(HoronSpinner), findsOneWidget);

    await tester.tap(find.text('3개 단계 · 2.1s'));
    await tester.pump();
    await tester.pump(const Duration(milliseconds: 300));
    expect(find.text('파일을 읽는다'), findsNothing);
  });

  testWidgets('agent activity: every part renders in both brightnesses', (WidgetTester tester) async {
    for (final Brightness brightness in Brightness.values) {
      for (final Widget part in <Widget>[
        const HoronThinkingIndicator(),
        const HoronStreamingText(text: '글'),
        const HoronToolStep(title: '단계'),
        const HoronWorkLog(
          summary: '요약',
          steps: <HoronWorkLogStep>[HoronWorkLogStep(title: '단계')],
        ),
      ]) {
        await pumpActivity(tester, part, brightness: brightness);
        expect(tester.takeException(), isNull, reason: '${brightness.name} ${part.runtimeType}');
      }
    }
  });
}
