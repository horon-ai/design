import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:horon_ui/horon_ui.dart';

/// 두 봇에 걸친 작업 다섯 개입니다. 시간은 창 끝(0)에서 거꾸로 센 분입니다.
const List<HoronLaneBot> _bots = <HoronLaneBot>[
  HoronLaneBot(
    id: 'analyst',
    name: 'Analyst',
    initial: 'A',
    tone: HoronLaneBotTone.sky,
    tools: 'Notion · Slack',
    tasks: <HoronLaneTask>[
      HoronLaneTask(id: 'scan', label: '지표를 모읍니다', tone: HoronLaneTaskTone.done, start: -28, end: -16),
      HoronLaneTask(
        id: 'chart',
        label: '대시보드를 엽니다',
        tone: HoronLaneTaskTone.running,
        start: -16,
        end: -3,
        badge: 'Needs you',
      ),
    ],
  ),
  HoronLaneBot(
    id: 'writer',
    name: 'Writer',
    initial: 'W',
    tone: HoronLaneBotTone.ink,
    badge: 'Idle',
    badgeInk: true,
    tasks: <HoronLaneTask>[
      HoronLaneTask(id: 'draft', label: '요약을 씁니다', tone: HoronLaneTaskTone.waiting, start: -3, end: 0),
    ],
  ),
];

/// 타임라인을 [width] 폭으로 세우고 한 프레임 그립니다.
Future<void> pumpTimeline(
  WidgetTester tester,
  Widget child, {
  Brightness brightness = Brightness.light,
  double width = 900,
}) async {
  // 테스트 기본 표면은 800×600이라, 더 넓은 폭도 그릴 수 있게 표면을 먼저 넓힙니다.
  await tester.binding.setSurfaceSize(Size(width, 700));
  addTearDown(() => tester.binding.setSurfaceSize(null));
  await tester.pumpWidget(
    MaterialApp(
      theme: horonTheme(brightness),
      home: Scaffold(
        body: Align(
          alignment: Alignment.topLeft,
          child: SizedBox(width: width, child: child),
        ),
      ),
    ),
  );
  await tester.pump();
}

/// 인계 곡선 페인터로 그린 자리의 수입니다.
int _handoffCurves(WidgetTester tester) => tester
    .widgetList<CustomPaint>(find.byType(CustomPaint))
    .where((CustomPaint paint) => '${paint.painter.runtimeType}'.contains('Handoff'))
    .length;

/// 그려진 [DecoratedBox] 중 [color]로 채운 것이 있는지 봅니다.
bool _paints(WidgetTester tester, Color color) => tester
    .widgetList<DecoratedBox>(find.byType(DecoratedBox))
    .any((DecoratedBox box) => box.decoration is BoxDecoration && (box.decoration as BoxDecoration).color == color);

/// [label] 글자가 그려진 색입니다.
Color? _labelColor(WidgetTester tester, String label) =>
    tester.widget<RichText>(find.descendant(of: find.text(label), matching: find.byType(RichText))).text.style?.color;

/// 상태 하나와 작업 하나로 이루어진 작은 타임라인입니다.
HoronAgentLanesTimeline _single(HoronLaneTaskTone tone) => HoronAgentLanesTimeline(
  bots: <HoronLaneBot>[
    HoronLaneBot(
      id: 'one',
      name: 'One',
      initial: 'O',
      tone: HoronLaneBotTone.sky,
      tasks: <HoronLaneTask>[HoronLaneTask(id: 't', label: '한 작업', tone: tone, start: -20, end: -10)],
    ),
  ],
);

void main() {
  testWidgets('timeline: the default panel renders in light and dark', (WidgetTester tester) async {
    for (final Brightness brightness in Brightness.values) {
      await pumpTimeline(tester, const HoronAgentLanesTimeline(bots: _bots), brightness: brightness);
      expect(tester.takeException(), isNull, reason: brightness.name);
      expect(find.text('Bots'), findsOneWidget);
      expect(find.text('Last 30m'), findsOneWidget);
      expect(find.text('Analyst'), findsOneWidget);
      expect(find.text('Writer'), findsOneWidget);
    }
  });

  testWidgets('timeline: the header carries an 18px pulse icon, the title and the range pill', (
    WidgetTester tester,
  ) async {
    await pumpTimeline(tester, const HoronAgentLanesTimeline(bots: _bots));
    final HoronThemeData theme = HoronTheme.of(tester.element(find.byType(HoronAgentLanesTimeline)));
    // `Pulse size-4.5 text-text-primary`.
    final Icon pulse = tester.widget<Icon>(find.byIcon(Icons.monitor_heart_outlined));
    expect(pulse.size, 18);
    expect(pulse.color, theme.colors.textPrimary);
    // `text-label-lg`.
    expect(_labelColor(tester, 'Bots'), theme.colors.textPrimary);
    // `CaretDown size-3`.
    expect(tester.widget<Icon>(find.byIcon(Icons.keyboard_arrow_down)).size, 12);
    // `text-label-sm`.
    expect(tester.widget<Text>(find.text('Last 30m')).style!.fontSize, 12);
    // `h-7.5 px-3` — 범위 알약은 높이 30, 좌우 12입니다.
    final AnimatedContainer pill = tester.widget<AnimatedContainer>(
      find.ancestor(of: find.text('Last 30m'), matching: find.byType(AnimatedContainer)).first,
    );
    expect(pill.padding, const EdgeInsets.symmetric(horizontal: 12));
    // 좌우 여백 `px-5` — 레인 줄은 왼쪽 20에서 시작합니다.
    expect(
      find.byWidgetPredicate(
        (Widget widget) => widget is AnimatedContainer && widget.padding == const EdgeInsets.only(left: 20),
      ),
      findsWidgets,
    );
  });

  testWidgets('timeline: each task tone paints its own bar', (WidgetTester tester) async {
    await pumpTimeline(tester, _single(HoronLaneTaskTone.done));
    final HoronThemeData theme = HoronTheme.of(tester.element(find.text('Bots')));

    // `bg-overlay-ink-6 text-text-secondary`.
    expect(_paints(tester, theme.colors.overlayInk6), isTrue);
    expect(_labelColor(tester, '한 작업'), theme.colors.textSecondary);

    await pumpTimeline(tester, _single(HoronLaneTaskTone.running));
    // 막대 톤은 `indicatorDuration`(280ms) `AnimatedContainer`라, `pump()` 한 번으로는
    // 이전 톤 색이 남습니다. 실행 중 톤은 12px 스피너가 계속 돌아 `pumpAndSettle`이 끝나지
    // 않으므로, 전환 길이만큼 고정으로 넘겨 새 색을 확인합니다.
    await tester.pump(const Duration(milliseconds: 300));
    // `bg-status-live/20 text-text-primary` + 12px 스피너.
    expect(_paints(tester, theme.colors.accentSky500_20), isTrue);
    expect(_labelColor(tester, '한 작업'), theme.colors.textPrimary);
    expect(find.byType(HoronSpinner), findsOneWidget);
    expect(tester.widget<HoronSpinner>(find.byType(HoronSpinner)).pixelSize, 12);

    await pumpTimeline(tester, _single(HoronLaneTaskTone.failed));
    // 실패 톤에는 스피너가 없으므로 280ms 색 전환이 끝날 때까지 정착시킵니다.
    await tester.pumpAndSettle();
    // `bg-red-500/14 text-text-danger`.
    expect(_paints(tester, theme.colors.accentRed500_14), isTrue);
    expect(_labelColor(tester, '한 작업'), theme.colors.textDanger);

    await pumpTimeline(tester, _single(HoronLaneTaskTone.waiting));
    await tester.pumpAndSettle();
    // `border border-interactive-primary bg-bg-surface-90 text-text-primary`.
    expect(_paints(tester, theme.colors.bgSurface90), isTrue);
    expect(_labelColor(tester, '한 작업'), theme.colors.textPrimary);
    expect(find.byType(HoronSpinner), findsNothing);
  });

  testWidgets('timeline: every bot tone and task tone renders', (WidgetTester tester) async {
    for (final Brightness brightness in Brightness.values) {
      await pumpTimeline(
        tester,
        HoronAgentLanesTimeline(
          bots: <HoronLaneBot>[
            for (final HoronLaneBotTone tone in HoronLaneBotTone.values)
              HoronLaneBot(
                id: tone.name,
                name: tone.name,
                initial: 'B',
                tone: tone,
                tasks: <HoronLaneTask>[
                  for (final HoronLaneTaskTone taskTone in HoronLaneTaskTone.values)
                    HoronLaneTask(
                      id: '${tone.name}-${taskTone.name}',
                      label: taskTone.name,
                      tone: taskTone,
                      start: -12,
                      end: -2,
                    ),
                ],
              ),
          ],
        ),
        brightness: brightness,
        width: 1100,
      );
      expect(tester.takeException(), isNull, reason: brightness.name);
    }
  });

  testWidgets('timeline: the bar keeps the 36px height and its share of the track', (WidgetTester tester) async {
    await pumpTimeline(tester, const HoronAgentLanesTimeline(bots: _bots), width: 900);
    // 이름 열 230, 오른쪽 여백 18 → 트랙 652. 12분짜리 막대는 652 × 12/30 입니다.
    final Size bar = tester.getSize(find.ancestor(of: find.text('지표를 모읍니다'), matching: find.byType(ClipRRect)).first);
    expect(bar.height, 36); // `h-9`
    expect(bar.width, closeTo(652 * 12 / 30, 0.01));
  });

  testWidgets('timeline: the approval strip reports Later, Approve and the range tap', (WidgetTester tester) async {
    int later = 0;
    int approve = 0;
    int rangeTaps = 0;
    await pumpTimeline(
      tester,
      HoronAgentLanesTimeline(
        bots: _bots,
        onRangeClick: () => rangeTaps++,
        approval: HoronAgentLanesTimelineApproval(
          message: 'Writer가 배포를 기다립니다',
          onLater: () => later++,
          onApprove: () => approve++,
        ),
      ),
    );
    expect(find.text('Writer가 배포를 기다립니다'), findsOneWidget);
    expect(tester.widget<Icon>(find.byIcon(Icons.warning_amber_rounded)).size, 14);

    await tester.tap(find.text('Later'));
    await tester.pump();
    await tester.tap(find.text('Approve'));
    await tester.pump();
    await tester.tap(find.text('Last 30m'));
    await tester.pump();

    expect(later, 1);
    expect(approve, 1);
    expect(rangeTaps, 1);
  });

  testWidgets('timeline: the range pill is a button only when onRangeClick is wired', (WidgetTester tester) async {
    await pumpTimeline(tester, const HoronAgentLanesTimeline(bots: _bots));
    // 처리기가 없으면 React처럼 누를 수 없는 라벨입니다.
    expect(find.ancestor(of: find.text('Last 30m'), matching: find.byType(GestureDetector)), findsNothing);
    expect(find.byIcon(Icons.keyboard_arrow_down), findsOneWidget);

    await pumpTimeline(tester, HoronAgentLanesTimeline(bots: _bots, onRangeClick: () {}));
    expect(find.ancestor(of: find.text('Last 30m'), matching: find.byType(GestureDetector)), findsOneWidget);
  });

  testWidgets('timeline: the body grows with the rows and never drops below two', (WidgetTester tester) async {
    // `height: TOP + max(2, bots.length) * ROW` — 한 봇이어도 두 줄만큼 자리를 잡습니다.
    await pumpTimeline(tester, HoronAgentLanesTimeline(bots: _bots.take(1).toList()));
    final double one = tester.getSize(find.byType(HoronAgentLanesTimeline)).height;
    await pumpTimeline(tester, const HoronAgentLanesTimeline(bots: _bots));
    final double two = tester.getSize(find.byType(HoronAgentLanesTimeline)).height;
    expect(two, one);

    await pumpTimeline(
      tester,
      HoronAgentLanesTimeline(
        bots: <HoronLaneBot>[
          ..._bots,
          for (final String id in <String>['third', 'fourth'])
            HoronLaneBot(
              id: id,
              name: id,
              initial: 'X',
              tone: HoronLaneBotTone.neutral,
              tasks: const <HoronLaneTask>[],
            ),
        ],
      ),
    );
    final double four = tester.getSize(find.byType(HoronAgentLanesTimeline)).height;
    expect(four - two, 2 * 64, reason: 'ROW가 64이므로 두 줄이 늘면 128이 늘어납니다');
  });

  testWidgets('timeline: a handoff paints a curve only when both task ids exist', (WidgetTester tester) async {
    await pumpTimeline(
      tester,
      const HoronAgentLanesTimeline(
        bots: _bots,
        handoffs: <HoronLaneHandoff>[HoronLaneHandoff(from: 'scan', to: 'draft')],
      ),
    );
    expect(_handoffCurves(tester), 1);
    expect(tester.takeException(), isNull);

    await pumpTimeline(
      tester,
      const HoronAgentLanesTimeline(
        bots: _bots,
        handoffs: <HoronLaneHandoff>[HoronLaneHandoff(from: 'scan', to: 'missing')],
      ),
    );
    expect(_handoffCurves(tester), 0);
    expect(tester.takeException(), isNull);
  });

  testWidgets('timeline: narrow widths fit the panel instead of scrolling sideways', (WidgetTester tester) async {
    await pumpTimeline(tester, const HoronAgentLanesTimeline(bots: _bots), width: 1200);
    // 넓은 쪽은 5분 눈금 라벨이 섭니다.
    expect(find.text('-25m'), findsOneWidget);
    expect(find.text('-5m'), findsOneWidget);

    await pumpTimeline(tester, const HoronAgentLanesTimeline(bots: _bots), width: 320);
    expect(tester.takeException(), isNull);
    // 가로 스크롤 없이 판 폭에 맞춥니다. 좁은 쪽은 눈금 라벨을 감춥니다.
    expect(
      find.descendant(of: find.byType(HoronAgentLanesTimeline), matching: find.byType(SingleChildScrollView)),
      findsNothing,
    );
    expect(tester.getSize(find.byType(HoronAgentLanesTimeline)).width, 320);
    expect(find.text('Analyst'), findsOneWidget);
    expect(find.text('-25m'), findsNothing);
  });

  testWidgets('timeline: the panel stops at 1010 wide', (WidgetTester tester) async {
    await tester.binding.setSurfaceSize(const Size(1400, 700));
    addTearDown(() => tester.binding.setSurfaceSize(null));
    await tester.pumpWidget(
      MaterialApp(
        theme: horonTheme(Brightness.light),
        home: const Scaffold(
          body: Center(child: HoronAgentLanesTimeline(bots: _bots)),
        ),
      ),
    );
    await tester.pump();
    // `max-w-252.5` — 부모가 느슨한 폭을 주면 1010에서 멈춥니다.
    expect(tester.getSize(find.byType(HoronAgentLanesTimeline)).width, 1010);
  });
}
