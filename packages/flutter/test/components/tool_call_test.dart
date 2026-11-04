import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:horon_ui/src/components/spinner.dart';
import 'package:horon_ui/src/components/tool_call.dart';
import 'package:horon_ui/src/theme/horon_motion.dart';
import 'package:horon_ui/src/theme/horon_theme.dart';

Future<void> pumpCall(
  WidgetTester tester,
  Widget child, {
  Brightness brightness = Brightness.light,
  double width = 420,
}) async {
  await tester.pumpWidget(
    MaterialApp(
      theme: horonTheme(brightness),
      home: Scaffold(
        body: Center(
          child: SizedBox(width: width, child: child),
        ),
      ),
    ),
  );
  // 실행 중 상태의 스피너는 끝나지 않으므로 pumpAndSettle을 쓰지 않습니다.
  await tester.pump();
}

HoronThemeData themeOf(WidgetTester tester) => HoronTheme.of(tester.element(find.byType(HoronToolCall)));

Container cardOf(WidgetTester tester) =>
    tester.widget<Container>(find.descendant(of: find.byType(HoronToolCall), matching: find.byType(Container)).first);

void main() {
  testWidgets('tool call: the header is a 16px card with a tool chip and a status mark', (WidgetTester tester) async {
    await pumpCall(
      tester,
      const HoronToolCall(
        status: HoronToolCallStatus.done,
        toolName: 'Web search',
        toolIcon: Icon(Icons.search),
        summary: 'Searching the web',
        elapsed: '1.2s',
      ),
    );
    final HoronThemeData theme = themeOf(tester);
    final BoxDecoration decoration = cardOf(tester).decoration! as BoxDecoration;

    expect(find.text('Web search'), findsOneWidget);
    expect(find.text('Searching the web'), findsOneWidget);
    expect(find.text('1.2s'), findsOneWidget);
    expect(find.byIcon(Icons.check_circle), findsOneWidget);
    expect(tester.getSize(find.byIcon(Icons.check_circle)), const Size(16, 16));
    expect(decoration.color, theme.colors.bgSurface);
    // `rounded-2xl`.
    expect((decoration.borderRadius! as BorderRadius).topLeft.x, theme.radius.xl2);
    expect((decoration.border! as Border).top.color, theme.colors.borderDefault);
  });

  testWidgets('tool call: the trigger folds and unfolds the arguments and the result', (WidgetTester tester) async {
    await pumpCall(
      tester,
      const HoronToolCall(
        status: HoronToolCallStatus.done,
        toolName: 'Web search',
        summary: 'Searching the web',
        args: <String, Object?>{'query': 'horon'},
        result: <String, Object?>{'count': 2},
      ),
    );
    expect(find.text('ARGUMENTS'), findsNothing);

    await tester.tap(find.text('Searching the web'));
    await tester.pump();
    await tester.pump(HoronMotion.collapseDuration);
    expect(find.text('ARGUMENTS'), findsOneWidget);
    expect(find.text('RESULT'), findsOneWidget);

    await tester.tap(find.text('Searching the web'));
    await tester.pump();
    await tester.pump(HoronMotion.collapseDuration);
    expect(find.text('ARGUMENTS'), findsNothing);
  });

  testWidgets('tool call: a failed call paints the danger border and offers a retry', (WidgetTester tester) async {
    int retries = 0;
    await pumpCall(
      tester,
      HoronToolCall(
        status: HoronToolCallStatus.failed,
        toolName: 'Stripe',
        summary: 'Creating a charge',
        error: 'The card was declined',
        onRetry: () => retries++,
        initiallyOpen: true,
      ),
    );
    final HoronThemeData theme = themeOf(tester);
    final BoxDecoration decoration = cardOf(tester).decoration! as BoxDecoration;

    expect((decoration.border! as Border).top.color, theme.colors.borderDanger);
    expect(find.text('Failed'), findsOneWidget);
    // `WarningCircle size-4` — 상태 아이콘 자리는 16px입니다.
    expect(find.byIcon(Icons.error_outline), findsOneWidget);
    expect(find.text('The card was declined'), findsOneWidget);
    expect(tester.widget<Text>(find.text('The card was declined')).style!.color, theme.colors.textDanger);
    expect(find.text('RESULT'), findsNothing);

    // `h-7.5 rounded-full` — 재시도는 30 높이 알약입니다.
    final Finder retry = find.ancestor(of: find.text(theme.strings.retry), matching: find.byType(TextButton)).first;
    expect(tester.getSize(retry).height, 30);
    expect(
      tester.widget<TextButton>(retry).style!.shape!.resolve(<WidgetState>{}),
      RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(theme.radius.full),
        side: BorderSide(color: theme.colors.borderDefault),
      ),
    );

    await tester.tap(find.text(theme.strings.retry));
    await tester.pump();
    expect(retries, 1);
  });

  testWidgets('tool call: a running call shows the spinner and waits for the result', (WidgetTester tester) async {
    await pumpCall(
      tester,
      const HoronToolCall(
        status: HoronToolCallStatus.running,
        toolName: 'Web search',
        summary: 'Searching the web',
        initiallyOpen: true,
      ),
    );
    expect(find.byType(HoronSpinner), findsOneWidget);
    expect(find.text('Waiting for result…'), findsOneWidget);
  });

  testWidgets('tool call: a truncated result shows the show-all link', (WidgetTester tester) async {
    int shown = 0;
    await pumpCall(
      tester,
      HoronToolCall(
        status: HoronToolCallStatus.done,
        toolName: 'Web search',
        summary: 'Searching the web',
        result: <String, Object?>{'count': 2},
        truncated: true,
        onShowAll: () => shown++,
        initiallyOpen: true,
      ),
    );
    // `Show all`은 결과 섹션의 footer 슬롯에 놓입니다.
    expect(find.text('Show all'), findsOneWidget);
    final double footerTop = tester.getTopLeft(find.text('Show all')).dy;
    final double bodyTop = tester.getTopLeft(find.text('RESULT')).dy;
    expect(footerTop, greaterThan(bodyTop));
    await tester.tap(find.text('Show all'));
    await tester.pump();
    expect(shown, 1);
  });

  testWidgets('tool call: the section copy button writes the body and flips to a check', (WidgetTester tester) async {
    final List<MethodCall> calls = <MethodCall>[];
    tester.binding.defaultBinaryMessenger.setMockMethodCallHandler(SystemChannels.platform, (MethodCall call) async {
      calls.add(call);
      return null;
    });
    addTearDown(() => tester.binding.defaultBinaryMessenger.setMockMethodCallHandler(SystemChannels.platform, null));

    await pumpCall(
      tester,
      const HoronToolCall(
        status: HoronToolCallStatus.done,
        toolName: 'Web search',
        summary: 'Searching the web',
        args: <String, Object?>{'query': 'horon'},
        result: <String, Object?>{'count': 2},
        initiallyOpen: true,
      ),
    );

    // `aria-label="Copy arguments"` — 섹션마다 복사 버튼이 하나씩입니다.
    expect(find.bySemanticsLabel('Copy arguments'), findsOneWidget);
    expect(find.bySemanticsLabel('Copy result'), findsOneWidget);
    expect(find.byIcon(Icons.content_copy), findsNWidgets(2));

    await tester.tap(find.bySemanticsLabel('Copy arguments'));
    await tester.pump();

    final MethodCall call = calls.firstWhere((MethodCall call) => call.method == 'Clipboard.setData');
    expect((call.arguments as Map<Object?, Object?>)['text'], contains('"query": "horon"'));
    // 복사 직후에는 체크 아이콘 하나로 바뀝니다.
    expect(find.byIcon(Icons.check), findsOneWidget);
    expect(find.bySemanticsLabel('Copied'), findsOneWidget);

    // 1.5초 뒤 원래대로 돌아옵니다.
    await tester.pump(const Duration(milliseconds: 1600));
    expect(find.byIcon(Icons.check), findsNothing);
    expect(find.bySemanticsLabel('Copy arguments'), findsOneWidget);
  });

  testWidgets('tool call: a running call has no copy button for a missing result', (WidgetTester tester) async {
    await pumpCall(
      tester,
      const HoronToolCall(
        status: HoronToolCallStatus.running,
        toolName: 'Web search',
        summary: 'Searching the web',
        args: <String, Object?>{'query': 'horon'},
        initiallyOpen: true,
      ),
    );
    expect(find.bySemanticsLabel('Copy arguments'), findsOneWidget);
    expect(find.bySemanticsLabel('Copy result'), findsNothing);
  });

  testWidgets('tool call: every status renders in both brightnesses', (WidgetTester tester) async {
    for (final Brightness brightness in Brightness.values) {
      for (final HoronToolCallStatus status in HoronToolCallStatus.values) {
        await pumpCall(
          tester,
          HoronToolCall(
            status: status,
            toolName: 'Web search',
            summary: 'Searching the web',
            error: 'boom',
            args: <String, Object?>{'query': 'horon'},
            result: <String, Object?>{'count': 2},
            onRetry: () {},
            initiallyOpen: true,
          ),
          brightness: brightness,
        );
        expect(tester.takeException(), isNull, reason: '${brightness.name} ${status.name}');
      }
    }
  });

  testWidgets('tool call: json code paints keys, numbers and punctuation with syntax colours', (
    WidgetTester tester,
  ) async {
    await tester.pumpWidget(
      MaterialApp(
        theme: horonTheme(Brightness.light),
        home: const Scaffold(
          body: HoronJsonCode(
            value: <String, Object?>{
              'a': 1,
              'b': <Object?>[true, null],
            },
          ),
        ),
      ),
    );
    final HoronThemeData theme = HoronTheme.of(tester.element(find.byType(HoronJsonCode)));
    final Text text = tester.widget<Text>(find.byType(Text));
    final List<TextSpan> spans = (text.textSpan! as TextSpan).children!.cast<TextSpan>();
    Color? colourOf(String value) => spans.firstWhere((TextSpan span) => span.text == value).style?.color;

    expect(text.textSpan!.style!.fontFamily, theme.text.code.fontFamily);
    expect(colourOf('"a"'), theme.colors.syntaxKey);
    expect(colourOf('1'), theme.colors.syntaxNumber);
    expect(colourOf('true'), theme.colors.syntaxNumber);
    expect(colourOf('null'), theme.colors.syntaxNumber);
    expect(colourOf('{'), theme.colors.syntaxPunctuation);
    // 닫는 괄호는 앞 줄바꿈과 한 span입니다(React의 `{"\n"}{pad}{close}`).
    expect(spans.last.text, '\n}');
    expect(spans.last.style!.color, theme.colors.syntaxPunctuation);
  });

  testWidgets('tool call: a long tool name and summary fit a phone width without overflowing', (
    WidgetTester tester,
  ) async {
    for (final double width in <double>[320, 390, 1024]) {
      await pumpCall(
        tester,
        const HoronToolCall(
          status: HoronToolCallStatus.done,
          toolName: 'Browser navigation and page reading tool',
          toolIcon: Icon(Icons.public),
          summary: 'Reading the release notes of the design system package',
          elapsed: '12.4s',
          args: <String, Object?>{'url': 'https://example.com/very/long/path/that/keeps/going'},
          initiallyOpen: true,
        ),
        width: width,
      );
      expect(tester.takeException(), isNull, reason: 'width $width');
      final Text summary = tester.widget<Text>(find.text('Reading the release notes of the design system package'));
      expect(summary.maxLines, 1);
      expect(summary.overflow, TextOverflow.ellipsis);
    }
  });
}
