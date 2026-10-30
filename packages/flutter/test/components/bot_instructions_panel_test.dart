import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:horon_ui/horon_ui.dart';

const List<List<HoronInstructionPart>> _instructions = <List<HoronInstructionPart>>[
  <HoronInstructionPart>[
    HoronInstructionPart.text('Answer in'),
    HoronInstructionPart.variable('language'),
    HoronInstructionPart.text('briefly.'),
  ],
  <HoronInstructionPart>[HoronInstructionPart.text('Escalate billing questions.')],
];

Future<void> pumpPanel(
  WidgetTester tester,
  Widget child, {
  Brightness brightness = Brightness.light,
  double width = 620,
}) async {
  tester.view.physicalSize = Size(width * 2, 2000);
  tester.view.devicePixelRatio = 2;
  addTearDown(tester.view.reset);
  await tester.pumpWidget(
    MaterialApp(
      theme: horonTheme(brightness),
      home: Scaffold(
        body: SizedBox(
          width: width,
          child: SingleChildScrollView(child: child),
        ),
      ),
    ),
  );
  await tester.pumpAndSettle();
}

/// 화면에 그려진 모든 [BoxDecoration]입니다. `Container`와 `DecoratedBox`를 모두 봅니다.
List<BoxDecoration> decorations(WidgetTester tester) => <BoxDecoration>[
  for (final Container container in tester.widgetList<Container>(find.byType(Container)))
    if (container.decoration case final BoxDecoration decoration) decoration,
  for (final DecoratedBox box in tester.widgetList<DecoratedBox>(find.byType(DecoratedBox)))
    if (box.decoration case final BoxDecoration decoration) decoration,
];

double? radiusOf(BoxDecoration decoration) =>
    decoration.borderRadius is BorderRadius ? (decoration.borderRadius! as BorderRadius).topLeft.x : null;

void main() {
  testWidgets('bot instructions panel: the surface is a 24px radius card on bg-surface', (WidgetTester tester) async {
    await pumpPanel(
      tester,
      HoronBotInstructionsPanel(
        bot: const HoronBotSummary(initial: 'H', name: 'Horon Helper'),
        instructions: _instructions,
      ),
    );
    final HoronThemeData theme = HoronTheme.of(tester.element(find.byType(HoronBotInstructionsPanel)));
    expect(tester.takeException(), isNull);
    final List<BoxDecoration> painted = decorations(tester);
    expect(
      painted.where((BoxDecoration d) => d.color == theme.colors.bgSurface && radiusOf(d) == 24),
      isNotEmpty,
      reason: 'rounded-[24px] bg-bg-surface',
    );
    expect(
      painted.where((BoxDecoration d) => d.border?.top.color == theme.colors.borderDefault && radiusOf(d) == 24),
      isNotEmpty,
      reason: 'border-border-default',
    );
    // h-7 알약 트랙과 Run 버튼의 높이는 간격 단계에서 옵니다.
    expect(
      tester.getSize(find.byType(HoronPanelPillTabs)).height,
      theme.space.step(7) + theme.space.step(0.75) * 2,
      reason: 'h-7 항목 + p-[3px] 트랙 여백',
    );
  });

  testWidgets('bot instructions panel: both brightnesses render', (WidgetTester tester) async {
    for (final Brightness brightness in Brightness.values) {
      await pumpPanel(
        tester,
        HoronBotInstructionsPanel(
          version: 'v4',
          versionStatus: 'Live',
          bot: const HoronBotSummary(initial: 'H', name: 'Horon Helper'),
          instructions: _instructions,
          tokenCount: 184,
          variables: const <HoronInstructionVariable>[HoronInstructionVariable(name: 'language', value: 'Korean')],
          scenarios: const <String>['Onboarding', 'Pricing'],
          output: const Text('Sure.'),
        ),
        brightness: brightness,
        width: 320,
      );
      expect(tester.takeException(), isNull, reason: brightness.name);
      expect(find.text('184 tokens'), findsOneWidget);
      expect(find.text('Live'), findsOneWidget);
      expect(find.text('Sure.'), findsOneWidget);
    }
  });

  testWidgets('bot instructions panel: every variable tone paints its chip and dot', (WidgetTester tester) async {
    for (final HoronInstructionVariableTone tone in HoronInstructionVariableTone.values) {
      await pumpPanel(
        tester,
        HoronBotInstructionsPanel(
          bot: const HoronBotSummary(initial: 'H', name: 'Helper'),
          instructions: <List<HoronInstructionPart>>[
            <HoronInstructionPart>[HoronInstructionPart.variable('name', tone: tone)],
          ],
          variables: <HoronInstructionVariable>[HoronInstructionVariable(name: 'name', value: 'value', tone: tone)],
        ),
      );
      final HoronThemeData theme = HoronTheme.of(tester.element(find.byType(HoronBotInstructionsPanel)));
      expect(tester.takeException(), isNull, reason: tone.name);
      final Color chip = switch (tone) {
        HoronInstructionVariableTone.sky => theme.colors.accentSky500_18,
        HoronInstructionVariableTone.brand => theme.colors.accentSky700_18,
        HoronInstructionVariableTone.neutral => theme.colors.textPlaceholder18,
      };
      final Color dot = switch (tone) {
        HoronInstructionVariableTone.sky => HoronPalette.sky500,
        HoronInstructionVariableTone.brand => HoronPalette.sky700,
        HoronInstructionVariableTone.neutral => HoronPalette.neutral500,
      };
      final List<BoxDecoration> painted = decorations(tester);
      expect(
        painted.where((BoxDecoration d) => d.color == chip && radiusOf(d) == theme.radius.xs),
        isNotEmpty,
        reason: 'rounded-xs 칩 바탕색: ${tone.name}',
      );
      expect(
        painted.where((BoxDecoration d) => d.color == dot && d.shape == BoxShape.circle),
        isNotEmpty,
        reason: '변수 점: ${tone.name}',
      );
    }
  });

  testWidgets('bot instructions panel: the Example tab swaps the prompt, arrows move the tab', (
    WidgetTester tester,
  ) async {
    await pumpPanel(
      tester,
      HoronBotInstructionsPanel(
        title: 'Prompt',
        bot: const HoronBotSummary(initial: 'H', name: 'Helper'),
        instructions: _instructions,
        example: const Text('Where is my invoice?'),
      ),
    );
    expect(find.text('Where is my invoice?'), findsNothing);
    await tester.tap(find.text('Example'));
    await tester.pumpAndSettle();
    expect(find.text('Where is my invoice?'), findsOneWidget);
    expect(find.text('briefly.'), findsNothing);

    // Example 탭에 포커스가 남아 있으므로 왼쪽 화살표가 Instructions를 고릅니다.
    await tester.sendKeyEvent(LogicalKeyboardKey.arrowLeft);
    await tester.pumpAndSettle();
    expect(find.text('briefly.'), findsOneWidget);
    expect(find.text('Where is my invoice?'), findsNothing);
  });

  testWidgets('bot instructions panel: Run passes the selected scenario', (WidgetTester tester) async {
    final List<String?> runs = <String?>[];
    await pumpPanel(
      tester,
      HoronBotInstructionsPanel(
        bot: const HoronBotSummary(initial: 'H', name: 'Helper'),
        instructions: _instructions,
        scenarios: const <String>['Onboarding', 'Pricing'],
        onRun: runs.add,
      ),
    );
    final Icon play = tester.widget<Icon>(find.byIcon(Icons.play_arrow));
    expect(play.size, 14, reason: 'Play size-3.5');
    expect(find.text('⌘↵'), findsOneWidget);

    await tester.tap(find.text('Run'));
    await tester.pumpAndSettle();
    expect(runs, <String?>['Onboarding'], reason: 'defaultScenario가 없으면 첫 시나리오입니다');

    await tester.tap(find.text('Pricing'));
    await tester.pumpAndSettle();
    await tester.tap(find.text('Run'));
    await tester.pumpAndSettle();
    expect(runs, <String?>['Onboarding', 'Pricing']);
  });

  testWidgets('bot instructions panel: the header pills drop non-essential width at phone width', (
    WidgetTester tester,
  ) async {
    await pumpPanel(
      tester,
      HoronBotInstructionsPanel(
        version: 'v4',
        versionStatus: 'Live',
        bot: const HoronBotSummary(initial: 'H', name: 'Horon Helper with a long name'),
        instructions: _instructions,
      ),
      width: 320,
    );
    expect(tester.takeException(), isNull, reason: 'phone');
    expect(tester.getSize(find.byType(HoronBotInstructionsPanel)).width, lessThanOrEqualTo(320));
    expect(find.text('v4'), findsOneWidget);

    await pumpPanel(
      tester,
      HoronBotInstructionsPanel(
        version: 'v4',
        versionStatus: 'Live',
        bot: const HoronBotSummary(initial: 'H', name: 'Horon Helper'),
        instructions: _instructions,
      ),
      width: 900,
    );
    expect(tester.takeException(), isNull, reason: 'tablet');
    expect(find.text('Instructions'), findsNWidgets(2), reason: '제목과 탭 라벨');
  });
}
