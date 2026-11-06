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

/// 컴포넌트 루트의 첫 `Container` 장식입니다.
BoxDecoration rootDecoration(WidgetTester tester, Type owner) {
  final Container box = tester.widget<Container>(
    find.descendant(of: find.byType(owner), matching: find.byType(Container)).first,
  );
  return box.decoration! as BoxDecoration;
}

/// 말풍선이 지금 보여 주는 글자입니다. 인라인 캐럿 자리표시자는 뺍니다.
String bubbleText(WidgetTester tester) {
  final RichText rich = tester.widget<RichText>(
    find.descendant(of: find.byType(HoronStreamingText), matching: find.byType(RichText)).first,
  );
  return rich.text.toPlainText().replaceAll('\uFFFC', '');
}

void main() {
  testWidgets('thinking: a 69x31 surface pill with a default rim and three 7px dots', (WidgetTester tester) async {
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

    final BoxDecoration decoration = rootDecoration(tester, HoronThinkingIndicator);
    expect(decoration.color, theme.colors.bgSurface);
    expect(decoration.border, Border.all(color: theme.colors.borderDefault));
    expect(decoration.borderRadius, BorderRadius.circular(theme.radius.full));
  });

  testWidgets('streaming: the bubble fills surface, rims default and rides a 2x16.1 caret inline', (
    WidgetTester tester,
  ) async {
    await pumpActivity(tester, const HoronStreamingText(text: '문서를 읽고 있습니다'));
    final HoronThemeData theme = HoronTheme.of(tester.element(find.byType(HoronStreamingText)));

    expect(bubbleText(tester), '문서를 읽고 있습니다');

    final BoxDecoration decoration = rootDecoration(tester, HoronStreamingText);
    expect(decoration.color, theme.colors.bgSurface);
    expect(decoration.border, Border.all(color: theme.colors.borderDefault));
    expect(decoration.borderRadius, BorderRadius.circular(theme.radius.xl));

    // 캐럿은 글자와 같은 문단 안에 있어 줄바꿈을 따라갑니다.
    expect(find.descendant(of: find.byType(HoronStreamingText), matching: find.byType(Row)), findsNothing);
    final Iterable<Container> bars = tester.widgetList<Container>(find.byType(Container)).where((Container box) {
      final BoxConstraints? constraints = box.constraints;
      return constraints != null && constraints.maxWidth == 2 && constraints.maxHeight == 16.1;
    });
    expect(bars.length, 1);
  });

  testWidgets('streaming: a finished stream shows everything and drops the caret', (WidgetTester tester) async {
    await pumpActivity(tester, const HoronStreamingText(text: '요약을 마쳤습니다', streaming: false));
    expect(bubbleText(tester), '요약을 마쳤습니다');

    final Iterable<Container> bars = tester.widgetList<Container>(find.byType(Container)).where((Container box) {
      final BoxConstraints? constraints = box.constraints;
      return constraints != null && constraints.maxWidth == 2 && constraints.maxHeight == 16.1;
    });
    expect(bars, isEmpty);
    expect(find.bySemanticsLabel('요약을 마쳤습니다'), findsOneWidget);
  });

  testWidgets('streaming: a growing text reveals from the shared prefix', (WidgetTester tester) async {
    await tester.pumpWidget(
      MaterialApp(
        theme: horonTheme(Brightness.light),
        home: const Scaffold(
          body: Center(
            child: SizedBox(width: 420, child: HoronStreamingText(text: '가나다')),
          ),
        ),
      ),
    );
    await tester.pump();
    expect(bubbleText(tester), '가나다');

    await tester.pumpWidget(
      MaterialApp(
        theme: horonTheme(Brightness.light),
        home: const Scaffold(
          body: Center(
            child: SizedBox(width: 420, child: HoronStreamingText(text: '가나다라마바사아자차카')),
          ),
        ),
      ),
    );
    await tester.pump();
    // 새 글자는 공통 접두사만 남기고 다시 흘러나옵니다.
    expect(bubbleText(tester), '가나다');

    await tester.pump(const Duration(milliseconds: 16));
    await tester.pump(const Duration(milliseconds: 16));
    expect(bubbleText(tester).length, greaterThan(3));
    expect(bubbleText(tester).length, lessThan('가나다라마바사아자차카'.length));

    await tester.pump(const Duration(milliseconds: 500));
    expect(bubbleText(tester), '가나다라마바사아자차카');
  });

  testWidgets('streaming: reduced motion shows the whole text at once', (WidgetTester tester) async {
    Widget host(String text) {
      return MaterialApp(
        theme: horonTheme(Brightness.light),
        home: MediaQuery(
          data: const MediaQueryData(disableAnimations: true),
          child: Scaffold(
            body: Center(
              child: SizedBox(width: 420, child: HoronStreamingText(text: text)),
            ),
          ),
        ),
      );
    }

    await tester.pumpWidget(host('가'));
    await tester.pump();
    await tester.pumpWidget(host('가나다라마바사아자차카'));
    await tester.pump();
    expect(bubbleText(tester), '가나다라마바사아자차카');
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

    final BoxDecoration decoration = rootDecoration(tester, HoronToolStep);
    expect(decoration.color, theme.colors.bgSurface);
    expect(decoration.border, Border.all(color: theme.colors.borderDefault));
    expect(decoration.borderRadius, BorderRadius.circular(theme.radius.md));
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
    expect(find.byType(HoronSpinner), findsOneWidget);

    final HoronThemeData theme = HoronTheme.of(tester.element(find.byType(HoronWorkLog)));
    final BoxDecoration decoration = rootDecoration(tester, HoronWorkLog);
    expect(decoration.color, theme.colors.bgSurface);
    expect(decoration.border, Border.all(color: theme.colors.borderDefault));

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
        const HoronStreamingText(text: '글', streaming: false),
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
