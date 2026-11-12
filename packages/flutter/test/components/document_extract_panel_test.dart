import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:horon_ui/horon_ui.dart';

const List<HoronExtractGroup> _groups = <HoronExtractGroup>[
  HoronExtractGroup(
    id: 'invoice',
    label: 'Invoice',
    fields: <HoronExtractEntry>[
      HoronExtractField(
        id: 'vendor',
        label: 'Vendor',
        value: 'Northwind',
        type: 'Text',
        status: HoronExtractFieldStatus.filled,
      ),
      HoronExtractField(
        id: 'number',
        label: 'Invoice no.',
        value: 'INV-1',
        type: 'Text',
        status: HoronExtractFieldStatus.check,
      ),
      HoronExtractTable(
        id: 'lines',
        label: 'Lines',
        type: 'Table',
        columns: <HoronExtractColumn>[HoronExtractColumn('Item'), HoronExtractColumn('Amount', alignEnd: true)],
        rows: <List<String>>[
          <String>['Paper', '480.00'],
        ],
      ),
    ],
  ),
  HoronExtractGroup(
    id: 'totals',
    label: 'Totals',
    fields: <HoronExtractEntry>[
      HoronExtractField(id: 'total', label: 'Total', value: '480.00', status: HoronExtractFieldStatus.check),
    ],
  ),
];

Future<void> pumpPanel(
  WidgetTester tester,
  Widget child, {
  Brightness brightness = Brightness.light,
  double width = 800,
}) async {
  tester.view.physicalSize = Size(width * 2, 3000);
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

Widget panel({
  int defaultZoom = 70,
  Key? key,
  VoidCallback? onExtract,
  VoidCallback? onAcceptAll,
  VoidCallback? onOpenFile,
  List<HoronExtractGroup> groups = _groups,
  HoronExtractBot? bot,
}) {
  return HoronDocumentExtractPanel(
    key: key,
    fileName: 'invoice.pdf',
    groups: groups,
    defaultZoom: defaultZoom,
    bot: bot,
    onExtract: onExtract,
    onAcceptAll: onAcceptAll,
    onOpenFile: onOpenFile,
    sheet: const Text('Sheet body'),
  );
}

List<BoxDecoration> decorations(WidgetTester tester) => <BoxDecoration>[
  for (final Container container in tester.widgetList<Container>(find.byType(Container)))
    if (container.decoration case final BoxDecoration decoration) decoration,
  for (final DecoratedBox box in tester.widgetList<DecoratedBox>(find.byType(DecoratedBox)))
    if (box.decoration case final BoxDecoration decoration) decoration,
];

double? radiusOf(BoxDecoration decoration) =>
    decoration.borderRadius is BorderRadius ? (decoration.borderRadius! as BorderRadius).topLeft.x : null;

/// 확인이 필요한 값 상자는 `bg-overlay-ink-12`에 `border-border-danger`입니다.
BoxDecoration checkedBox(WidgetTester tester, HoronThemeData theme) => decorations(tester).firstWhere(
  (BoxDecoration decoration) =>
      decoration.color == theme.colors.overlayInk12 &&
      radiusOf(decoration) == theme.radius.md &&
      decoration.border != null,
);

void main() {
  testWidgets('document extract panel: xl surface with a default border on bg-surface', (WidgetTester tester) async {
    await pumpPanel(tester, panel());
    final HoronThemeData theme = HoronTheme.of(tester.element(find.byType(HoronDocumentExtractPanel)));
    expect(tester.takeException(), isNull);
    final List<BoxDecoration> painted = decorations(tester);
    expect(
      painted.where((BoxDecoration d) => d.color == theme.colors.bgSurface && radiusOf(d) == theme.radius.xl),
      isNotEmpty,
      reason: 'rounded-xl bg-bg-surface',
    );
    expect(
      painted.where(
        (BoxDecoration d) => d.border?.top.color == theme.colors.borderDefault && radiusOf(d) == theme.radius.xl,
      ),
      isNotEmpty,
      reason: 'border-border-default',
    );
    // FilePdf는 size-4입니다. CaretDown(size-3.5)은 onOpenFile이 있을 때만 붙습니다.
    expect(tester.widget<Icon>(find.byIcon(Icons.picture_as_pdf)).size, 16);
    expect(find.byIcon(Icons.expand_more), findsNothing, reason: 'onOpenFile이 없으면 이름은 라벨입니다');
  });

  testWidgets('document extract panel: onOpenFile makes the file name a caret button', (WidgetTester tester) async {
    int opens = 0;
    await pumpPanel(tester, panel(onOpenFile: () => opens++));

    expect(tester.widget<Icon>(find.byIcon(Icons.expand_more)).size, 14); // CaretDown size-3.5
    await tester.tap(find.text('invoice.pdf'));
    await tester.pumpAndSettle();
    expect(opens, 1);
  });

  testWidgets('document extract panel: the paper sheet is neutral-50 with an 8% ink ring', (WidgetTester tester) async {
    await pumpPanel(tester, panel());
    final HoronThemeData theme = HoronTheme.of(tester.element(find.byType(HoronDocumentExtractPanel)));
    final List<BoxDecoration> painted = decorations(tester);

    expect(
      painted.where((BoxDecoration d) => d.color == HoronPalette.neutral50),
      isNotEmpty,
      reason: 'bg-neutral-50 시트',
    );
    expect(
      painted.where((BoxDecoration d) => d.border?.top.color == theme.colors.overlayInk8),
      isNotEmpty,
      reason: 'ring-1 ring-overlay-ink-8',
    );
    final Text sheet = tester.widget<Text>(find.text('Sheet body'));
    expect(sheet.style, isNull, reason: '시트 글자색은 DefaultTextStyle이 정합니다');
    expect(
      DefaultTextStyle.of(tester.element(find.text('Sheet body'))).style.color,
      HoronPalette.neutral900,
      reason: 'text-neutral-900',
    );
  });

  testWidgets('document extract panel: both brightnesses render at phone width', (WidgetTester tester) async {
    for (final Brightness brightness in Brightness.values) {
      await pumpPanel(
        tester,
        panel(
          bot: const HoronExtractBot(initial: 'N', name: 'Extractor', elapsed: '8s'),
        ),
        brightness: brightness,
        width: 320,
      );
      expect(tester.takeException(), isNull, reason: brightness.name);
      expect(find.text('Extractor · 8s'), findsOneWidget);
      expect(find.text('2 of 4 filled · 2 to check'), findsOneWidget);
    }
  });

  testWidgets('document extract panel: the check field paints danger ink and resolves on tap', (
    WidgetTester tester,
  ) async {
    await pumpPanel(tester, panel());
    final HoronThemeData theme = HoronTheme.of(tester.element(find.byType(HoronDocumentExtractPanel)));
    final BoxDecoration checked = checkedBox(tester, theme);
    expect(checked.border!.top.color, theme.colors.borderDanger, reason: 'border-border-danger');
    expect(find.text('Check'), findsNWidgets(2));
    expect(find.text('2 of 4 filled · 2 to check'), findsOneWidget);

    await tester.tap(find.text('INV-1'));
    await tester.pumpAndSettle();
    expect(find.text('Check'), findsOneWidget, reason: '누른 항목만 확인됩니다');
    expect(find.text('3 of 4 filled · 1 to check'), findsOneWidget);
    expect(
      decorations(tester)
          .where((BoxDecoration d) => d.color == theme.colors.overlayInk4 && radiusOf(d) == theme.radius.md),
      isNotEmpty,
      reason: '확인한 항목은 bg-overlay-ink-4로 돌아갑니다',
    );
  });

  testWidgets('document extract panel: each field status paints its own row', (WidgetTester tester) async {
    for (final HoronExtractFieldStatus status in HoronExtractFieldStatus.values) {
      await pumpPanel(
        tester,
        panel(
          groups: <HoronExtractGroup>[
            HoronExtractGroup(
              id: 'one',
              label: 'One',
              fields: <HoronExtractEntry>[
                HoronExtractField(id: 'f', label: 'Field', value: 'value', type: 'Text', status: status),
              ],
            ),
          ],
        ),
      );
      final HoronThemeData theme = HoronTheme.of(tester.element(find.byType(HoronDocumentExtractPanel)));
      expect(tester.takeException(), isNull, reason: status.name);
      final List<BoxDecoration> rows = decorations(tester)
          .where(
            (BoxDecoration d) => radiusOf(d) == theme.radius.md && d.color != null && d.color != theme.colors.bgSurface,
          )
          .toList();
      switch (status) {
        case HoronExtractFieldStatus.check:
          expect(rows.any((BoxDecoration d) => d.color == theme.colors.overlayInk12), isTrue, reason: 'check');
          expect(find.text('Check'), findsOneWidget);
          expect(find.byIcon(Icons.check), findsNothing);
        case HoronExtractFieldStatus.filled:
          expect(rows.any((BoxDecoration d) => d.color == theme.colors.overlayInk4), isTrue, reason: 'filled');
          expect(find.text('Check'), findsNothing);
          expect(find.byIcon(Icons.check), findsOneWidget);
      }
      expect(
        find.text(
          '${status == HoronExtractFieldStatus.check ? 0 : 1} of 1 filled · ${status == HoronExtractFieldStatus.check ? 1 : 0} to check',
        ),
        findsOneWidget,
      );
    }
  });

  testWidgets('document extract panel: zoom steps clamp at 30 and 150, Fit returns to 70', (WidgetTester tester) async {
    await pumpPanel(tester, panel());
    expect(find.text('70%'), findsOneWidget);
    await tester.tap(find.byIcon(Icons.add));
    await tester.pumpAndSettle();
    expect(find.text('80%'), findsOneWidget);
    await tester.tap(find.text('Fit'));
    await tester.pumpAndSettle();
    expect(find.text('70%'), findsOneWidget);

    await pumpPanel(tester, panel(defaultZoom: 30, key: const ValueKey<String>('zoom-30')));
    expect(find.text('30%'), findsOneWidget);
    await tester.tap(find.byIcon(Icons.remove));
    await tester.pumpAndSettle();
    expect(find.text('30%'), findsOneWidget, reason: 'ZOOM_MIN 아래로 내려가지 않습니다');

    await pumpPanel(tester, panel(defaultZoom: 150, key: const ValueKey<String>('zoom-150')));
    expect(find.text('150%'), findsOneWidget);
    await tester.tap(find.byIcon(Icons.add));
    await tester.pumpAndSettle();
    expect(find.text('150%'), findsOneWidget, reason: 'ZOOM_MAX 위로 올라가지 않습니다');
  });

  testWidgets('document extract panel: Extract, the three views and Accept all', (WidgetTester tester) async {
    int extracts = 0;
    int accepted = 0;
    await pumpPanel(tester, panel(onExtract: () => extracts++, onAcceptAll: () => accepted++));
    await tester.tap(find.text('Extract'));
    await tester.pumpAndSettle();
    expect(extracts, 1);
    expect(find.text('4 fields read from this document'), findsOneWidget);

    await tester.tap(find.text('JSON'));
    await tester.pumpAndSettle();
    expect(find.textContaining('"Vendor": "Northwind"'), findsOneWidget);
    expect(find.textContaining('"Amount": "480.00"'), findsOneWidget);

    await tester.tap(find.text('Schema'));
    await tester.pumpAndSettle();
    expect(find.text('Table'), findsOneWidget, reason: '표의 type 칩');
    expect(find.text('Text'), findsWidgets);

    await tester.tap(find.text('Accept all'));
    await tester.pumpAndSettle();
    expect(accepted, 1);
    await tester.tap(find.text('Fields'));
    await tester.pumpAndSettle();
    expect(find.text('Check'), findsNothing);
    expect(find.text('4 of 4 filled · 0 to check'), findsOneWidget);
  });

  testWidgets('document extract panel: the audited sizes land on the surfaces', (WidgetTester tester) async {
    await pumpPanel(tester, panel());
    final HoronThemeData theme = HoronTheme.of(tester.element(find.byType(HoronDocumentExtractPanel)));
    final List<BoxDecoration> painted = decorations(tester);

    expect(
      painted.where((BoxDecoration d) => d.color == theme.colors.overlayInk5 && radiusOf(d) == theme.radius.md),
      isNotEmpty,
      reason: '파일 타일 rounded-md',
    );
    expect(
      painted.where(
        (BoxDecoration d) => d.border?.top.color == theme.colors.overlayInk10 && radiusOf(d) == theme.radius.md,
      ),
      isNotEmpty,
      reason: '표 상자 rounded-md',
    );

    final AnimatedContainer extract = tester.widget<AnimatedContainer>(
      find.ancestor(of: find.text('Extract'), matching: find.byType(AnimatedContainer)).first,
    );
    expect(extract.constraints!.maxHeight, 30, reason: 'Extract h-7.5');
    final AnimatedContainer accept = tester.widget<AnimatedContainer>(
      find.ancestor(of: find.text('Accept all'), matching: find.byType(AnimatedContainer)).first,
    );
    expect(accept.constraints!.maxHeight, 30, reason: 'Accept all h-7.5');

    await tester.tap(find.text('JSON'));
    await tester.pumpAndSettle();
    expect(
      decorations(tester)
          .where((BoxDecoration d) => d.color == theme.colors.overlayInk4 && radiusOf(d) == theme.radius.md),
      isNotEmpty,
      reason: 'JSON pre rounded-md',
    );

    await tester.tap(find.text('Schema'));
    await tester.pumpAndSettle();
    final SizedBox label = tester.widget<SizedBox>(
      find.ancestor(of: find.text('Vendor'), matching: find.byType(SizedBox)).first,
    );
    expect(label.width, 100, reason: '스키마 라벨 w-25');

    await tester.tap(find.text('Fields'));
    await tester.pumpAndSettle();
    // React dev: 툴바는 `p-[3px]`이고, 값 상자는 `max-w-75`를 버리고 `flex-1`로 남는 폭을 다 씁니다.
    final Container track = tester.widget<Container>(
      find
          .byWidgetPredicate(
            (Widget widget) =>
                widget is Container &&
                widget.decoration is BoxDecoration &&
                (widget.decoration as BoxDecoration).color == theme.colors.overlayInk5 &&
                (widget.decoration as BoxDecoration).borderRadius == BorderRadius.circular(theme.radius.full),
          )
          .first,
    );
    expect(track.padding, const EdgeInsets.all(3), reason: 'p-[3px]');

    final Size fieldBox = tester.getSize(
      find.ancestor(of: find.text('Northwind'), matching: find.byType(AnimatedContainer)).first,
    );
    expect(fieldBox.width, greaterThan(300), reason: '필드 상자는 flex-1입니다');
  });

  testWidgets('document extract panel: one column below 1024 and two columns above', (WidgetTester tester) async {
    await pumpPanel(tester, panel(), width: 640);
    final Offset narrowFile = tester.getTopLeft(find.text('invoice.pdf'));
    final Offset narrowFields = tester.getTopLeft(find.text('Fields'));
    expect(narrowFields.dy, greaterThan(narrowFile.dy), reason: '@4xl 아래에서는 한 단으로 쌓입니다');
    expect(tester.takeException(), isNull);

    await pumpPanel(tester, panel(), width: 1280);
    final Offset wideFile = tester.getTopLeft(find.text('invoice.pdf'));
    final Offset wideFields = tester.getTopLeft(find.text('Fields'));
    expect(wideFields.dx, greaterThan(wideFile.dx), reason: '두 단에서 오른쪽 패널은 뷰어 오른쪽입니다');
    expect((wideFields.dy - wideFile.dy).abs(), lessThan(40));
    expect(tester.takeException(), isNull);
  });

  testWidgets('document extract panel: every highlight tone uses its own border and fill', (WidgetTester tester) async {
    const List<(String, HoronExtractHighlightTone)> tones = <(String, HoronExtractHighlightTone)>[
      ('sky', HoronExtractHighlightTone.sky),
      ('brand', HoronExtractHighlightTone.brand),
      ('neutral', HoronExtractHighlightTone.neutral),
      ('ink', HoronExtractHighlightTone.ink),
    ];
    for (final (String name, HoronExtractHighlightTone tone) in tones) {
      await pumpPanel(tester, HoronExtractHighlight(tone: tone, child: Text('value $name')));
      final HoronThemeData theme = HoronTheme.of(tester.element(find.byType(HoronExtractHighlight)));
      final (Color border, Color fill) = switch (name) {
        'brand' => (theme.colors.accentSky700_90, theme.colors.accentSky700_12),
        'neutral' => (theme.colors.textPlaceholder90, theme.colors.textPlaceholder12),
        'ink' => (theme.colors.interactivePrimary, theme.colors.overlayInk12),
        _ => (theme.colors.accentSky500_90, theme.colors.accentSky500_12),
      };
      final BoxDecoration decoration = decorations(tester)
          .firstWhere((BoxDecoration d) => d.color == fill && radiusOf(d) == theme.radius.sm);
      expect(decoration.border!.top.color, border, reason: name);
      expect(decoration.border!.top.width, 1.2, reason: 'border-[1.2px]');
    }
  });
}
