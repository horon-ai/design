import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:horon_ui/horon_ui.dart';

const HoronOrchestratorLead _lead = HoronOrchestratorLead(
  initial: 'H',
  name: 'Horon',
  status: '1 working',
  elapsed: '0:42',
);

const List<HoronOrchestratorPlanItem> _plan = <HoronOrchestratorPlanItem>[
  HoronOrchestratorPlanItem(label: '지표를 모은다'),
  HoronOrchestratorPlanItem(label: '요약을 쓴다', running: true),
];

const List<Widget> _lanes = <Widget>[
  SizedBox(height: 40, child: Text('lane one')),
  SizedBox(height: 40, child: Text('lane two')),
  SizedBox(height: 40, child: Text('lane three')),
];

/// 패널을 [width] 폭 안에 띄웁니다. 끝나지 않는 애니메이션이 있으면 [settle]을 끕니다.
Future<void> pumpPanel(
  WidgetTester tester,
  Widget child, {
  Brightness brightness = Brightness.light,
  double width = 560,
  bool settle = true,
}) async {
  await tester.pumpWidget(
    MaterialApp(
      theme: horonTheme(brightness),
      home: Scaffold(
        body: Align(
          alignment: Alignment.topLeft,
          child: SizedBox(
            width: width,
            child: SingleChildScrollView(
              child: Align(alignment: Alignment.topLeft, child: child),
            ),
          ),
        ),
      ),
    ),
  );
  if (settle) {
    await tester.pumpAndSettle();
  } else {
    await tester.pump();
    await tester.pump(const Duration(milliseconds: 16));
  }
}

/// `overflow-clip rounded-[24px] border`인 패널 상자입니다.
final Finder _panel = find.byWidgetPredicate((Widget widget) {
  if (widget is! Container || widget.clipBehavior != Clip.antiAlias) return false;
  final Decoration? decoration = widget.decoration;
  return decoration is BoxDecoration && decoration.borderRadius == BorderRadius.circular(24);
});

void main() {
  testWidgets('panel: renders in both brightnesses without an exception', (WidgetTester tester) async {
    for (final Brightness brightness in Brightness.values) {
      await pumpPanel(
        tester,
        const HoronOrchestratorPanel(
          title: 'Research run',
          parallelOptions: <int>[2, 3, 4],
          parallelValue: 3,
          onStop: _noop,
          lead: _lead,
          plan: _plan,
          summary: HoronOrchestratorSummary(title: 'Summary', count: '1 of 3 returned', body: '두 레인이 끝났습니다'),
          children: _lanes,
        ),
        brightness: brightness,
        settle: false,
      );
      expect(tester.takeException(), isNull, reason: brightness.name);
      expect(find.text('Research run'), findsOneWidget);
      expect(find.text('Horon'), findsOneWidget);
    }
  });

  testWidgets('panel: 24px radius surface on a bg-surface fill with a default border', (WidgetTester tester) async {
    await pumpPanel(tester, const HoronOrchestratorPanel(title: 'Research run', lead: _lead));
    final HoronThemeData theme = HoronTheme.of(tester.element(_panel));
    final BoxDecoration decoration = tester.widget<Container>(_panel).decoration! as BoxDecoration;

    expect(decoration.color, theme.colors.bgSurface);
    expect(decoration.border, Border.all(color: theme.colors.borderDefault));
    expect(decoration.borderRadius, BorderRadius.circular(24)); // rounded-[24px]
  });

  testWidgets('header: the picker moves its 30x28 indicator 32px per step', (WidgetTester tester) async {
    int? picked;
    await pumpPanel(
      tester,
      HoronOrchestratorPanel(
        title: 'Research run',
        parallelOptions: const <int>[2, 3, 4],
        parallelValue: 3,
        onParallelChange: (int value) => picked = value,
        lead: _lead,
      ),
    );
    expect(find.text('Bots in parallel'), findsOneWidget);
    // 기본 선택이 없으면 표시자를 그리지 않습니다.
    expect(find.byType(AnimatedPositioned), findsOneWidget);
    expect(tester.widget<AnimatedPositioned>(find.byType(AnimatedPositioned)).left, 32);

    await tester.tap(find.text('4'));
    await tester.pumpAndSettle();
    expect(picked, 4);
  });

  testWidgets('header: no options means no picker, no onStop means no button', (WidgetTester tester) async {
    await pumpPanel(tester, const HoronOrchestratorPanel(title: 'Research run', lead: _lead));
    expect(find.byType(AnimatedPositioned), findsNothing);
    expect(find.text('Stop'), findsNothing);
  });

  testWidgets('header: the Stop button is 30 high with a 14px icon', (WidgetTester tester) async {
    int stops = 0;
    await pumpPanel(tester, HoronOrchestratorPanel(title: 'Research run', lead: _lead, onStop: () => stops++));
    expect(tester.widget<Icon>(find.byIcon(Icons.stop)).size, 14); // size-3.5
    expect(find.text('Stop'), findsOneWidget);

    await tester.tap(find.text('Stop'));
    await tester.pumpAndSettle();
    expect(stops, 1);
  });

  testWidgets('lead row: a 22px ink tile, the default Lead role and the running spinner', (WidgetTester tester) async {
    await pumpPanel(
      tester,
      const HoronOrchestratorPanel(
        title: 'Research run',
        lead: HoronOrchestratorLead(initial: 'H', name: 'Horon', running: true, status: '1 working', elapsed: '0:42'),
      ),
      settle: false,
    );
    final HoronThemeData theme = HoronTheme.of(tester.element(_panel));
    final Iterable<Container> tiles = tester
        .widgetList<Container>(find.byType(Container))
        .where((Container box) => box.constraints?.maxWidth == 22 && box.constraints?.maxHeight == 22);
    expect(tiles.length, 1);
    expect((tiles.first.decoration! as BoxDecoration).color, theme.colors.interactivePrimary);

    expect(find.text('Lead'), findsOneWidget);
    expect(find.byType(HoronSpinner), findsOneWidget);
    expect(tester.getSize(find.byType(HoronSpinner)), const Size(13, 13));
    expect(find.text('1 working'), findsOneWidget);
    expect(find.text('0:42'), findsOneWidget);
  });

  testWidgets('plan: 6px dots, a custom dot color and a pulsing dot', (WidgetTester tester) async {
    await pumpPanel(
      tester,
      HoronOrchestratorPanel(
        title: 'Research run',
        lead: _lead,
        plan: const <HoronOrchestratorPlanItem>[
          HoronOrchestratorPlanItem(label: 'quiet', dotColor: HoronPalette.sky700),
          HoronOrchestratorPlanItem(label: 'working', running: true),
        ],
      ),
      settle: false,
    );
    final HoronThemeData theme = HoronTheme.of(tester.element(_panel));

    Iterable<Container> dots() => tester.widgetList<Container>(find.byType(Container)).where((Container box) {
      return box.constraints?.maxWidth == 6 && box.constraints?.maxHeight == 6;
    });
    expect(dots().length, 2);
    expect((dots().first.decoration! as BoxDecoration).color, HoronPalette.sky700);
    final BoxDecoration pulsing = dots().last.decoration! as BoxDecoration;
    expect(pulsing.color, theme.colors.statusLive); // 기본 bg-status-live
    expect(pulsing.boxShadow, isNotNull);
    expect(pulsing.boxShadow!.length, 1, reason: 'animate-live-pulse가 고리를 그립니다');
  });

  testWidgets('lanes: every lane but the last carries the vertical connector', (WidgetTester tester) async {
    await pumpPanel(tester, const HoronOrchestratorPanel(title: 'Research run', lead: _lead, children: _lanes));
    final HoronThemeData theme = HoronTheme.of(tester.element(_panel));

    final Iterable<ColoredBox> connectors = tester
        .widgetList<ColoredBox>(find.byType(ColoredBox))
        .where((ColoredBox box) => box.color == theme.colors.overlayInk14);
    expect(connectors.length, 2, reason: '세 레인 중 마지막을 뺀 둘');

    // 팔꿈치는 팔레인터가 그립니다.
    final Iterable<CustomPaint> elbows = tester.widgetList<CustomPaint>(find.byType(CustomPaint)).where((
      CustomPaint paint,
    ) {
      return paint.painter.runtimeType.toString() == '_ElbowPainter';
    });
    expect(elbows.length, 3);

    // 레인은 px-5(20) + 1px 테두리 + pl-7.5(30)만큼 들여 씁니다.
    final double panelLeft = tester.getTopLeft(_panel).dx;
    expect(tester.getTopLeft(find.text('lane one')).dx - panelLeft, 20 + 1 + 30);
  });

  testWidgets('summary: 16px radius box on 4% ink with the default title', (WidgetTester tester) async {
    await pumpPanel(
      tester,
      const HoronOrchestratorPanel(
        title: 'Research run',
        lead: _lead,
        summary: HoronOrchestratorSummary(count: '2 of 3 returned', body: '두 레인이 끝났습니다'),
        children: _lanes,
      ),
    );
    final HoronThemeData theme = HoronTheme.of(tester.element(_panel));
    expect(find.text('Summary'), findsOneWidget);
    expect(find.text('2 of 3 returned'), findsOneWidget);
    expect(find.text('두 레인이 끝났습니다'), findsOneWidget);

    final Container box = tester.widget<Container>(
      find.ancestor(of: find.text('두 레인이 끝났습니다'), matching: find.byType(Container)).first,
    );
    final BoxDecoration decoration = box.decoration! as BoxDecoration;
    expect(decoration.color, theme.colors.overlayInk4);
    expect(decoration.borderRadius, BorderRadius.circular(16)); // rounded-[16px]
  });

  testWidgets('responsive: a 320 phone lays the header out without an exception', (WidgetTester tester) async {
    await pumpPanel(
      tester,
      const HoronOrchestratorPanel(
        title: 'Research run with a long title that keeps going',
        parallelOptions: <int>[2, 3, 4, 5, 6],
        parallelValue: 2,
        onStop: _noop,
        lead: _lead,
        plan: _plan,
        summary: HoronOrchestratorSummary(body: '본문'),
        children: _lanes,
      ),
      width: 320,
      settle: false,
    );
    expect(tester.takeException(), isNull);
    expect(tester.getSize(_panel).width, 320);
  });
}

void _noop() {}
