import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:horon_ui/horon_ui.dart';
import 'package:horon_ui/src/components/knowledge_base_panel.dart';

const List<HoronKnowledgeBaseTab> _tabs = <HoronKnowledgeBaseTab>[
  HoronKnowledgeBaseTab(id: 'sources', label: 'Sources', count: 12),
  HoronKnowledgeBaseTab(id: 'chunks', label: 'Chunks', count: 248),
  HoronKnowledgeBaseTab(id: 'bots', label: 'Bots'),
];

/// 패널을 [width] 폭 안에 띄웁니다. 느슨한 폭을 주려고 스크롤 뷰 안에 Align을 둡니다.
///
/// 진행 표시처럼 끝나지 않는 애니메이션이 있으면 [settle]을 거짓으로 넘깁니다.
Future<void> pumpPanel(
  WidgetTester tester,
  Widget child, {
  Brightness brightness = Brightness.light,
  double width = 900,
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
        const HoronKnowledgeBasePanel(title: 'Knowledge base', meta: '12 sources · 248 chunks · 3 bots', tabs: _tabs),
        brightness: brightness,
      );
      expect(tester.takeException(), isNull, reason: brightness.name);
      expect(find.text('Knowledge base'), findsOneWidget);
      expect(find.text('12 sources · 248 chunks · 3 bots'), findsOneWidget);
    }
  });

  testWidgets('panel: 24px radius surface on a bg-surface fill with a default border', (WidgetTester tester) async {
    await pumpPanel(tester, const HoronKnowledgeBasePanel(title: 'Knowledge base', tabs: _tabs));
    final HoronThemeData theme = HoronTheme.of(tester.element(_panel));
    final BoxDecoration decoration = tester.widget<Container>(_panel).decoration! as BoxDecoration;

    expect(decoration.color, theme.colors.bgSurface);
    expect(decoration.border, Border.all(color: theme.colors.borderDefault));
    expect(decoration.borderRadius, BorderRadius.circular(24)); // rounded-[24px]
  });

  testWidgets('header: the two round buttons carry their icons at React sizes', (WidgetTester tester) async {
    int settings = 0;
    int adds = 0;
    await pumpPanel(
      tester,
      HoronKnowledgeBasePanel(
        title: 'Knowledge base',
        tabs: _tabs,
        onSettings: () => settings++,
        onAddSource: () => adds++,
      ),
    );
    final HoronThemeData theme = HoronTheme.of(tester.element(_panel));

    expect(tester.getSize(find.byIcon(Icons.tune)), const Size(16, 16)); // [&>svg]:size-4
    expect(find.widgetWithIcon(InkWell, Icons.tune), findsNothing);
    expect(tester.widget<Icon>(find.byIcon(Icons.add)).size, 14); // Plus size-3.5
    expect(tester.widget<Icon>(find.byIcon(Icons.arrow_drop_down)).size, 12); // CaretDown size-3
    expect(find.text('Add source'), findsOneWidget);
    expect(theme.space.step(8.5), 34); // h-8.5

    await tester.tap(find.byIcon(Icons.tune));
    await tester.pumpAndSettle();
    expect(settings, 1);

    await tester.tap(find.text('Add source'));
    await tester.pumpAndSettle();
    expect(adds, 1);
  });

  testWidgets('tabs: the first tab starts selected and carries the 10% ink fill', (WidgetTester tester) async {
    String? selected;
    await pumpPanel(
      tester,
      HoronKnowledgeBasePanel(title: 'Knowledge base', tabs: _tabs, onValueChange: (String id) => selected = id),
    );
    final HoronThemeData theme = HoronTheme.of(tester.element(_panel));

    expect(_tabFill(tester, 'sources'), theme.colors.overlayInk10);
    expect(_tabFill(tester, 'chunks'), Colors.transparent);
    expect(find.text('12'), findsOneWidget); // the tab count

    await tester.tap(find.text('Chunks'));
    await tester.pumpAndSettle();
    expect(selected, 'chunks');
    expect(_tabFill(tester, 'chunks'), theme.colors.overlayInk10);
    expect(_tabFill(tester, 'sources'), Colors.transparent);
  });

  testWidgets('tabs: a controlled value wins over the tap', (WidgetTester tester) async {
    String? selected;
    await pumpPanel(
      tester,
      HoronKnowledgeBasePanel(
        title: 'Knowledge base',
        tabs: _tabs,
        value: 'chunks',
        defaultValue: 'sources',
        onValueChange: (String id) => selected = id,
      ),
    );
    final HoronThemeData theme = HoronTheme.of(tester.element(_panel));
    expect(_tabFill(tester, 'chunks'), theme.colors.overlayInk10);

    await tester.tap(find.text('Bots'));
    await tester.pumpAndSettle();
    expect(selected, 'bots');
    expect(_tabFill(tester, 'chunks'), theme.colors.overlayInk10, reason: 'the host still owns the value');
  });

  testWidgets('indexing: the spinner and the count show only above zero', (WidgetTester tester) async {
    await pumpPanel(
      tester,
      const HoronKnowledgeBasePanel(title: 'Knowledge base', tabs: _tabs, indexing: 3),
      settle: false,
    );
    expect(find.text('3 indexing'), findsOneWidget);
    expect(find.byType(HoronSpinner), findsOneWidget);
    expect(tester.getSize(find.byType(HoronSpinner)), const Size(13, 13));

    await pumpPanel(tester, const HoronKnowledgeBasePanel(title: 'Knowledge base', tabs: _tabs));
    expect(find.text('3 indexing'), findsNothing);
    expect(find.byType(HoronSpinner), findsNothing);
  });

  testWidgets('table head: hidden under sm, shown from 640 up', (WidgetTester tester) async {
    await pumpPanel(tester, const HoronKnowledgeBasePanel(title: 'Knowledge base', tabs: _tabs), width: 600);
    expect(find.text('Source'), findsNothing);
    expect(find.text('Parse'), findsNothing);

    await pumpPanel(tester, const HoronKnowledgeBasePanel(title: 'Knowledge base', tabs: _tabs), width: 700);
    expect(find.text('Source'), findsOneWidget);
    expect(find.text('Parse'), findsOneWidget);
    expect(find.text('Index'), findsOneWidget);
    expect(tester.getSize(find.text('Parse')).height, lessThanOrEqualTo(16)); // h-4
  });

  testWidgets('dropzone: hidden without onFiles, taps browse when it is there', (WidgetTester tester) async {
    await pumpPanel(tester, const HoronKnowledgeBasePanel(title: 'Knowledge base', tabs: _tabs));
    expect(find.byIcon(Icons.upload_file), findsNothing);

    int browses = 0;
    await pumpPanel(
      tester,
      HoronKnowledgeBasePanel(
        title: 'Knowledge base',
        tabs: _tabs,
        onFiles: (Object payload) {},
        onBrowse: () => browses++,
      ),
    );
    expect(find.byIcon(Icons.upload_file), findsOneWidget);
    expect(tester.getSize(find.byIcon(Icons.upload_file)), const Size(18, 18)); // size-4.5
    expect(find.text('Drop files here, or browse'), findsOneWidget);

    await tester.tap(find.byIcon(Icons.upload_file));
    await tester.pumpAndSettle();
    expect(browses, 1);
  });

  testWidgets('dropzone: dropping hands the payload to onFiles', (WidgetTester tester) async {
    Object? received;
    await tester.pumpWidget(
      MaterialApp(
        theme: horonTheme(Brightness.light),
        home: Scaffold(
          body: Column(
            children: <Widget>[
              Draggable<Object>(
                data: 'file-payload',
                feedback: const SizedBox(width: 40, height: 40),
                child: const Text('drag source'),
              ),
              Expanded(
                child: SingleChildScrollView(
                  child: HoronKnowledgeBasePanel(
                    title: 'Knowledge base',
                    tabs: _tabs,
                    onFiles: (Object payload) => received = payload,
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
    await tester.pumpAndSettle();

    await tester.drag(
      find.text('drag source'),
      tester.getCenter(find.byIcon(Icons.upload_file)) - tester.getCenter(find.text('drag source')),
    );
    await tester.pumpAndSettle();
    expect(received, 'file-payload');
  });

  testWidgets('children: the list rows land under the tab row', (WidgetTester tester) async {
    await pumpPanel(
      tester,
      const HoronKnowledgeBasePanel(
        title: 'Knowledge base',
        tabs: _tabs,
        children: <Widget>[Text('row one'), Text('row two')],
      ),
    );
    expect(find.text('row one'), findsOneWidget);
    expect(find.text('row two'), findsOneWidget);
  });

  testWidgets('responsive: fills a 320 phone and caps at 800 on a wide screen', (WidgetTester tester) async {
    await pumpPanel(tester, const HoronKnowledgeBasePanel(title: 'Knowledge base', tabs: _tabs), width: 320);
    expect(tester.getSize(_panel).width, 320);
    expect(tester.takeException(), isNull, reason: 'the header and the tray wrap at 320');

    tester.view.physicalSize = const Size(1200, 900);
    tester.view.devicePixelRatio = 1;
    addTearDown(tester.view.reset);
    await pumpPanel(tester, const HoronKnowledgeBasePanel(title: 'Knowledge base', tabs: _tabs), width: 1200);
    expect(tester.getSize(_panel).width, 800, reason: 'max-w-200 = 800');
  });
}

/// 탭 [id]의 알약 바탕색입니다. 선택되지 않은 탭은 투명입니다.
Color? _tabFill(WidgetTester tester, String id) {
  final AnimatedContainer pill = tester.widget<AnimatedContainer>(find.byKey(ValueKey<String>('kb-tab-$id')));
  return (pill.decoration! as BoxDecoration).color;
}
