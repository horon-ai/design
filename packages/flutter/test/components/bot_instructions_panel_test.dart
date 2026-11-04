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
    // h-7.5 알약 트랙과 Run 버튼의 높이는 간격 단계에서 옵니다.
    expect(
      tester.getSize(find.byType(HoronPanelPillTabs)).height,
      theme.space.step(7.5) + theme.space.step(0.75) * 2,
      reason: 'h-7.5 항목 + p-[3px] 트랙 여백',
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
      final Color ring = switch (tone) {
        HoronInstructionVariableTone.sky => theme.colors.accentSky500_90.withValues(alpha: 0.4),
        HoronInstructionVariableTone.brand => theme.colors.accentSky700_90.withValues(alpha: 0.4),
        HoronInstructionVariableTone.neutral => theme.colors.textPlaceholder90.withValues(alpha: 0.4),
      };
      final List<BoxDecoration> painted = decorations(tester);
      expect(
        painted.where((BoxDecoration d) => d.color == chip && radiusOf(d) == theme.radius.xs),
        isNotEmpty,
        reason: 'rounded-xs 칩 바탕색: ${tone.name}',
      );
      // `ring-1 ring-inset` — tone의 90% 색을 40%로 두른 테두리.
      expect(
        painted.where((BoxDecoration d) => d.color == chip && (d.border as Border?)?.top.color == ring),
        isNotEmpty,
        reason: '칩 링: ${tone.name}',
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

  testWidgets('bot instructions panel: the header pills are 30px ink-6 surfaces', (WidgetTester tester) async {
    await pumpPanel(
      tester,
      HoronBotInstructionsPanel(
        version: 'v4',
        versionStatus: 'Live',
        bot: const HoronBotSummary(initial: 'H', name: 'Horon Helper'),
        instructions: _instructions,
      ),
    );
    final HoronThemeData theme = HoronTheme.of(tester.element(find.byType(HoronBotInstructionsPanel)));

    // `h-7.5 rounded-full bg-overlay-ink-6` — 버전·봇 알약은 30 높이입니다.
    final Finder pills = find.byWidgetPredicate((Widget widget) {
      if (widget is! AnimatedContainer) return false;
      final Decoration? decoration = widget.decoration;
      if (decoration is! BoxDecoration) return false;
      return decoration.color == theme.colors.overlayInk6 &&
          decoration.borderRadius == BorderRadius.circular(theme.radius.full);
    });
    expect(pills, findsNWidgets(2));
    for (final Element element in pills.evaluate()) {
      expect(tester.getSize(find.byWidget(element.widget)).height, 30);
    }
    expect(find.text('v4'), findsOneWidget);
    expect(find.byIcon(Icons.expand_more), findsNWidgets(2));
  });

  testWidgets('bot instructions panel: variable values are 40px md boxes and Run is a 30px pill', (
    WidgetTester tester,
  ) async {
    await pumpPanel(
      tester,
      HoronBotInstructionsPanel(
        bot: const HoronBotSummary(initial: 'H', name: 'Helper'),
        instructions: _instructions,
        variables: const <HoronInstructionVariable>[HoronInstructionVariable(name: 'language', value: 'Korean')],
        scenarios: const <String>['Onboarding'],
      ),
    );
    final HoronThemeData theme = HoronTheme.of(tester.element(find.byType(HoronBotInstructionsPanel)));
    final List<BoxDecoration> painted = decorations(tester);

    // `h-10 rounded-md` — 변수 값 상자입니다.
    expect(
      painted.where((BoxDecoration d) => d.color == theme.colors.overlayInk5 && radiusOf(d) == theme.radius.md),
      isNotEmpty,
    );
    final Finder valueBox = find.ancestor(of: find.text('Korean'), matching: find.byType(Container)).first;
    expect(tester.getSize(valueBox).height, 40);

    // `h-7.5` — Run 버튼과 그 안의 Kbd.
    final Finder run = find.ancestor(of: find.text('Run'), matching: find.byType(AnimatedContainer)).first;
    expect(tester.getSize(run).height, 30);
    expect(find.byType(HoronKbd), findsOneWidget);
    expect(find.byIcon(Icons.play_arrow), findsOneWidget);

    // `Kbd className="bg-bg-surface-6 text-text-inverse/80"` — 칩 채움과 라벨 색을 덮습니다.
    final HoronKbd kbd = tester.widget<HoronKbd>(find.byType(HoronKbd));
    expect(kbd.label, '⌘↵');
    expect(kbd.background, theme.colors.bgSurface6);
    expect(kbd.foreground, theme.colors.textInverse.withValues(alpha: 0.8));
    final Container kbdBox = tester.widget<Container>(
      find.ancestor(of: find.text('⌘↵'), matching: find.byType(Container)).first,
    );
    expect((kbdBox.decoration! as BoxDecoration).color, theme.colors.bgSurface6);
    expect(tester.widget<Text>(find.text('⌘↵')).style!.color, theme.colors.textInverse.withValues(alpha: 0.8));
  });

  testWidgets('bot instructions panel: a lone punctuation part is pulled back 4px', (WidgetTester tester) async {
    await pumpPanel(
      tester,
      HoronBotInstructionsPanel(
        bot: const HoronBotSummary(initial: 'H', name: 'Helper'),
        instructions: const <List<HoronInstructionPart>>[
          <HoronInstructionPart>[HoronInstructionPart.variable('name'), HoronInstructionPart.text('.')],
        ],
      ),
    );
    expect(find.text('.'), findsOneWidget);
    // React의 `-ml-1` — 구두점 조각만 4px 왼쪽으로 당깁니다.
    expect(
      find.byWidgetPredicate((Widget widget) => widget is Transform && widget.transform.getTranslation().x == -4),
      findsOneWidget,
    );
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
