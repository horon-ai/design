import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:horon_ui/horon_ui.dart';

const List<HoronBotMemorySetting> _settings = <HoronBotMemorySetting>[
  HoronBotMemorySetting(id: 'remember', label: 'Remember this chat', description: 'Keeps facts from the conversation'),
  HoronBotMemorySetting(id: 'infer', label: 'Infer preferences', defaultChecked: true),
];

const List<HoronBotMemoryItem> _memories = <HoronBotMemoryItem>[
  HoronBotMemoryItem(id: 'm1', text: '선호 시간은 오전입니다', source: '채팅에서 · 10월 8일', group: '선호'),
  HoronBotMemoryItem(id: 'm2', text: '보고서는 표로 정리합니다', source: '채팅에서 · 10월 9일', group: '선호', fresh: true),
  HoronBotMemoryItem(id: 'm3', text: '팀은 디자인 4명입니다', source: '설정에서', group: '사실'),
];

/// 패널을 [width] 폭 안에 띄웁니다. 세로 스크롤만 두고 가로 스크롤은 두지 않습니다.
Future<void> pumpPanel(
  WidgetTester tester,
  Widget child, {
  Brightness brightness = Brightness.light,
  double width = 900,
}) async {
  await tester.pumpWidget(
    MaterialApp(
      theme: horonTheme(brightness),
      home: Scaffold(
        body: Align(
          alignment: Alignment.topLeft,
          child: SizedBox(
            width: width,
            // 스크롤 뷰의 폭은 꽉 차 있으므로, 느슨한 폭을 주는 Align을 한 겹 두어야
            // 패널의 max-w-140 상한이 실제로 걸립니다.
            child: SingleChildScrollView(
              child: Align(alignment: Alignment.topLeft, child: child),
            ),
          ),
        ),
      ),
    ),
  );
  await tester.pumpAndSettle();
}

/// `overflow-clip rounded-[24px] border`인 패널 상자입니다. 미터 Track도 clip을 쓰지만 반경이 24가 아닙니다.
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
        const HoronBotMemoryPanel(usage: 42, settings: _settings, memories: _memories),
        brightness: brightness,
      );
      expect(tester.takeException(), isNull, reason: brightness.name);
      expect(find.text('Memory'), findsOneWidget);
      expect(find.text('42% full'), findsOneWidget);
    }
  });

  testWidgets('panel: 24px radius surface on a bg-surface fill with a default border', (WidgetTester tester) async {
    await pumpPanel(tester, const HoronBotMemoryPanel(usage: 10, memories: _memories));
    final HoronThemeData theme = HoronTheme.of(tester.element(_panel));
    final BoxDecoration decoration = tester.widget<Container>(_panel).decoration! as BoxDecoration;

    expect(decoration.color, theme.colors.bgSurface);
    expect(decoration.border, Border.all(color: theme.colors.borderDefault));
    expect(decoration.borderRadius, BorderRadius.circular(24)); // rounded-[24px]
  });

  testWidgets('meter: half full paints half of the 80x5 track', (WidgetTester tester) async {
    await pumpPanel(tester, const HoronBotMemoryPanel(usage: 50, memories: _memories));
    final HoronThemeData theme = HoronTheme.of(tester.element(_panel));

    expect(find.text('50% full'), findsOneWidget);
    final Finder fill = find.byType(FractionallySizedBox);
    expect(tester.getSize(fill), const Size(40, 5), reason: 'w-20 × 50% = 40, h-1.25 = 5');

    final DecoratedBox painted = tester.widget<DecoratedBox>(
      find.descendant(of: fill, matching: find.byType(DecoratedBox)).first,
    );
    expect((painted.decoration as BoxDecoration).color, theme.colors.interactivePrimary);
  });

  testWidgets('meter: usage is clamped to 0..100', (WidgetTester tester) async {
    await pumpPanel(tester, const HoronBotMemoryPanel(usage: 140, memories: _memories));
    expect(find.text('100% full'), findsOneWidget);
    expect(tester.getSize(find.byType(FractionallySizedBox)).width, 80);
  });

  testWidgets('tabs: the filter and the search button sit on one row 30px high', (WidgetTester tester) async {
    await pumpPanel(tester, const HoronBotMemoryPanel(usage: 20, memories: _memories));
    final HoronThemeData theme = HoronTheme.of(tester.element(_panel));

    expect(find.text('All'), findsOneWidget);
    expect(find.text('선호'), findsWidgets);
    expect(find.byIcon(Icons.search), findsOneWidget);
    expect(tester.widget<Icon>(find.byIcon(Icons.search)).size, 16); // size-4
    expect(tester.getSize(find.byIcon(Icons.search)).height, 16);
    expect(theme.space.step(7.5), 30); // size-7.5, the round search button
  });

  testWidgets('settings: compact switch is 40x24 and reports the id it toggles', (WidgetTester tester) async {
    final List<(String, bool)> changes = <(String, bool)>[];
    await pumpPanel(
      tester,
      HoronBotMemoryPanel(
        usage: 20,
        settings: _settings,
        memories: _memories,
        onSettingChange: (String id, bool checked) => changes.add((id, checked)),
      ),
    );
    final HoronThemeData theme = HoronTheme.of(tester.element(_panel));
    final Finder switches = find.byType(HoronSwitch);
    expect(switches, findsNWidgets(2));
    expect(tester.getSize(switches.first), Size(theme.space.step(10), theme.space.step(6)), reason: 'compact 40x24');

    await tester.tap(switches.first);
    await tester.pumpAndSettle();
    expect(changes, <(String, bool)>[('remember', true)]);

    await tester.tap(switches.last);
    await tester.pumpAndSettle();
    expect(changes.last, ('infer', false));
  });

  testWidgets('filter: picking a group hides the other groups', (WidgetTester tester) async {
    await pumpPanel(tester, const HoronBotMemoryPanel(usage: 20, memories: _memories));
    expect(find.text('선호 시간은 오전입니다'), findsOneWidget);
    expect(find.text('팀은 디자인 4명입니다'), findsOneWidget);

    // 필터 알약은 목록 머리보다 위에 있으므로 첫 번째 '선호'가 알약입니다.
    await tester.tap(find.text('선호').first);
    await tester.pumpAndSettle();
    expect(find.text('선호 시간은 오전입니다'), findsOneWidget);
    expect(find.text('팀은 디자인 4명입니다'), findsNothing);

    await tester.tap(find.text('All'));
    await tester.pumpAndSettle();
    expect(find.text('팀은 디자인 4명입니다'), findsOneWidget);
  });

  testWidgets('rows: a fresh memory carries the sky wash and the others none', (WidgetTester tester) async {
    await pumpPanel(tester, const HoronBotMemoryPanel(usage: 20, memories: _memories));
    final HoronThemeData theme = HoronTheme.of(tester.element(_panel));
    final Iterable<Container> washed = tester
        .widgetList<Container>(find.byType(Container))
        .where((Container box) => box.color == theme.colors.accentSky500_10);
    expect(washed.length, 1);
  });

  testWidgets('toast: pops in, dismisses itself and reports once', (WidgetTester tester) async {
    int dismissed = 0;
    await pumpPanel(
      tester,
      HoronBotMemoryPanel(
        usage: 20,
        memories: _memories,
        toast: const HoronBotMemoryToast(title: 'Memory updated', message: '보고서는 표로 정리합니다'),
        onToastDismiss: () => dismissed++,
      ),
    );
    expect(find.text('Memory updated'), findsOneWidget);
    expect(find.text('보고서는 표로 정리합니다'), findsWidgets);

    await tester.tap(find.byIcon(Icons.close));
    await tester.pumpAndSettle();
    expect(find.text('Memory updated'), findsNothing);
    expect(dismissed, 1);
  });

  testWidgets('add memory: the row calls back', (WidgetTester tester) async {
    int adds = 0;
    await pumpPanel(tester, HoronBotMemoryPanel(usage: 20, memories: _memories, onAdd: () => adds++));
    expect(find.text('Add memory'), findsOneWidget);
    await tester.tap(find.byIcon(Icons.add));
    await tester.pumpAndSettle();
    expect(adds, 1);
  });

  testWidgets('responsive: fills a 320 phone and caps at 560 on a wide screen', (WidgetTester tester) async {
    await pumpPanel(tester, const HoronBotMemoryPanel(usage: 20, memories: _memories), width: 320);
    expect(tester.getSize(_panel).width, 320, reason: 'max-w-140 does not force a floor');

    // 테스트 표면은 800 폭이므로 그보다 좁은 700 상자에서 상한을 확인합니다.
    await pumpPanel(tester, const HoronBotMemoryPanel(usage: 20, memories: _memories), width: 700);
    expect(tester.getSize(_panel).width, 560, reason: 'max-w-140 = 560');
  });
}
