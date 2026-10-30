import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:horon_ui/src/components/research_run_panel.dart';
import 'package:horon_ui/src/components/spinner.dart';
import 'package:horon_ui/src/theme/horon_theme.dart';

const List<HoronResearchQuery> _queries = <HoronResearchQuery>[
  HoronResearchQuery(id: 'q1', text: 'horon design system release notes', results: '8 results'),
  HoronResearchQuery(id: 'q2', text: 'flutter widget rebuild rules', searching: true),
];

Future<void> pumpPanel(WidgetTester tester, Widget child, {Brightness brightness = Brightness.light}) async {
  await tester.pumpWidget(
    MaterialApp(
      theme: horonTheme(brightness),
      home: Scaffold(
        body: Align(alignment: Alignment.topLeft, child: child),
      ),
    ),
  );
  // 실행 중 상태는 스피너와 캐럿이 계속 돌아 pumpAndSettle이 끝나지 않습니다.
  await tester.pump();
}

HoronThemeData themeOf(WidgetTester tester) => HoronTheme.of(tester.element(find.byType(HoronResearchRunPanel)));

Container panelOf(WidgetTester tester) => tester.widget<Container>(
  find.descendant(of: find.byType(HoronResearchRunPanel), matching: find.byType(Container)).first,
);

void main() {
  testWidgets('research run panel: the shell is a 24px surface card with a header and a question', (
    WidgetTester tester,
  ) async {
    await pumpPanel(tester, const HoronResearchRunPanel(question: 'What changed in the rebuild?', running: false));
    final HoronThemeData theme = themeOf(tester);
    final BoxDecoration decoration = panelOf(tester).decoration! as BoxDecoration;

    expect(find.text('Research'), findsOneWidget);
    expect(find.text('New research'), findsOneWidget);
    expect(find.text('What changed in the rebuild?'), findsOneWidget);
    expect(tester.getSize(find.byIcon(Icons.search)), const Size(16, 16));
    expect(decoration.color, theme.colors.bgSurface);
    expect((decoration.borderRadius! as BorderRadius).topLeft.x, theme.space.s6);
    expect((decoration.border! as Border).top.color, theme.colors.borderDefault);

    final Text question = tester.widget<Text>(find.text('What changed in the rebuild?'));
    expect(question.style!.color, theme.colors.textInverse);
    final Container bubble = tester.widget<Container>(
      find.ancestor(of: find.text('What changed in the rebuild?'), matching: find.byType(Container)).first,
    );
    expect((bubble.decoration! as BoxDecoration).color, theme.colors.interactivePrimary);
    expect(((bubble.decoration! as BoxDecoration).borderRadius! as BorderRadius).topLeft.x, theme.radius.xl2);
  });

  testWidgets('research run panel: running shows the status line, the caret and the queries', (
    WidgetTester tester,
  ) async {
    await pumpPanel(
      tester,
      const HoronResearchRunPanel(question: 'What changed?', elapsed: '12s', read: 3, total: 8, queries: _queries),
    );
    final HoronThemeData theme = themeOf(tester);

    expect(find.text('Researching'), findsOneWidget);
    expect(find.text('· 12s · 3 of 8 read'), findsOneWidget);
    expect(find.byType(HoronSpinner), findsNWidgets(2)); // 상태 줄 + 검색 중인 질의
    expect(find.text('horon design system release notes'), findsOneWidget);
    expect(find.text('8 results'), findsOneWidget);
    expect(tester.widget<Text>(find.text('horon design system release notes')).style!.color, theme.colors.textPrimary);
    expect(tester.widget<Text>(find.text('flutter widget rebuild rules')).style!.color, theme.colors.textSecondary);
    expect(find.byIcon(Icons.check), findsOneWidget);
  });

  testWidgets('research run panel: not running hides the status line and shows the send button', (
    WidgetTester tester,
  ) async {
    await pumpPanel(tester, const HoronResearchRunPanel(question: 'What changed?', running: false));

    expect(find.text('Researching'), findsNothing);
    expect(find.byIcon(Icons.arrow_upward), findsOneWidget);
    expect(find.byIcon(Icons.stop), findsNothing);
    expect(tester.widget<Icon>(find.byIcon(Icons.arrow_upward)).size, 16);
  });

  testWidgets('research run panel: a follow-up is sent and the field is cleared', (WidgetTester tester) async {
    final List<String> sent = <String>[];
    await pumpPanel(tester, HoronResearchRunPanel(question: 'What changed?', running: false, onFollowUp: sent.add));

    await tester.enterText(find.byType(TextField), 'Which files changed?');
    await tester.pump();
    await tester.tap(find.byIcon(Icons.arrow_upward));
    await tester.pump();

    expect(sent, <String>['Which files changed?']);
    expect(tester.widget<TextField>(find.byType(TextField)).controller!.text, isEmpty);
  });

  testWidgets('research run panel: while running the button stops the run', (WidgetTester tester) async {
    int stops = 0;
    final List<String> sent = <String>[];
    await pumpPanel(
      tester,
      HoronResearchRunPanel(question: 'What changed?', onStop: () => stops++, onFollowUp: sent.add),
    );

    await tester.enterText(find.byType(TextField), 'ignored');
    await tester.pump();
    await tester.tap(find.byIcon(Icons.stop));
    await tester.pump();

    expect(stops, 1);
    expect(sent, isEmpty);
  });

  testWidgets('research run panel: the new research button and the source avatars render', (WidgetTester tester) async {
    int started = 0;
    await pumpPanel(
      tester,
      HoronResearchRunPanel(
        question: 'What changed?',
        read: 3,
        total: 8,
        sources: const <String>['J', 'M', 'A'],
        onNewResearch: () => started++,
      ),
    );

    await tester.tap(find.text('New research'));
    await tester.pump();
    expect(started, 1);

    expect(find.text('3 of 8 sources read'), findsOneWidget);
    for (final String initial in <String>['J', 'M', 'A']) {
      expect(find.text(initial), findsOneWidget);
    }
    expect(tester.getSize(find.byIcon(Icons.add)), const Size(14, 14));
  });

  testWidgets('research run panel: running and finished both render in both brightnesses', (WidgetTester tester) async {
    for (final Brightness brightness in Brightness.values) {
      for (final bool running in <bool>[true, false]) {
        await pumpPanel(
          tester,
          HoronResearchRunPanel(
            question: 'What changed?',
            running: running,
            elapsed: '12s',
            read: 3,
            total: 8,
            queries: _queries,
            sources: const <String>['J', 'M'],
            onStop: () {},
            onNewResearch: () {},
            onFollowUp: (String value) {},
          ),
          brightness: brightness,
        );
        expect(tester.takeException(), isNull, reason: '${brightness.name} running=$running');
      }
    }
  });

  testWidgets('research run panel: it fills a phone width and caps at 600 on a desktop', (WidgetTester tester) async {
    addTearDown(tester.view.reset);

    for (final (double width, double expected) in <(double, double)>[(320, 320), (390, 390), (1440, 600)]) {
      tester.view.devicePixelRatio = 1;
      tester.view.physicalSize = Size(width, 900);
      await pumpPanel(
        tester,
        const HoronResearchRunPanel(
          question: 'What changed in the rebuilt design system this week?',
          queries: _queries,
          sources: <String>['J', 'M', 'A'],
        ),
      );
      expect(tester.takeException(), isNull, reason: 'width $width');
      expect(tester.getSize(find.byType(HoronResearchRunPanel)).width, expected, reason: 'width $width');
    }
  });
}
