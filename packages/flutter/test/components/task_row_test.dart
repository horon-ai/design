import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:horon_ui/horon_ui.dart';

Future<void> pumpTask(WidgetTester tester, Widget child, {Brightness brightness = Brightness.light}) async {
  await tester.pumpWidget(
    MaterialApp(
      theme: horonTheme(brightness),
      home: Scaffold(
        body: Center(child: SizedBox(width: 520, child: child)),
      ),
    ),
  );
  await tester.pump();
  await tester.pump(const Duration(milliseconds: 200));
}

void main() {
  testWidgets('task row: running shows a spinner, the pill actions and the metadata', (WidgetTester tester) async {
    await pumpTask(
      tester,
      const HoronTaskRow(
        status: HoronTaskStatus.running,
        title: 'Q3 보드 덱을 준비합니다',
        botInitial: 'A',
        botName: 'Analyst',
        message: '지표를 모으는 중',
        elapsed: '1m 56s',
        project: 'Q3 board',
        detail: '2 drafts',
      ),
    );
    expect(find.byType(HoronSpinner), findsOneWidget);
    expect(find.text('Cancel'), findsOneWidget);
    expect(find.text('Q3 board'), findsOneWidget);
    expect(find.text('2 drafts'), findsOneWidget);
    expect(find.byIcon(Icons.folder_outlined), findsOneWidget);
  });

  testWidgets('task row: review shows the primary Review pill and the archive action', (WidgetTester tester) async {
    int reviews = 0;
    int archived = 0;
    await pumpTask(
      tester,
      HoronTaskRow(
        status: HoronTaskStatus.review,
        title: '검토가 필요합니다',
        botInitial: 'B',
        botName: 'Writer',
        message: '초안이 준비되었습니다',
        onReview: () => reviews++,
        onArchive: () => archived++,
      ),
    );
    final HoronThemeData theme = HoronTheme.of(tester.element(find.byType(HoronTaskRow)));
    final bool hasPrimary = tester.widgetList<Container>(find.byType(Container)).any((Container box) {
      final Decoration? decoration = box.decoration;
      return decoration is BoxDecoration && decoration.color == theme.colors.interactivePrimary;
    });
    expect(hasPrimary, isTrue);
    expect(find.byIcon(Icons.archive_outlined), findsOneWidget);

    await tester.tap(find.text('Review'));
    await tester.pump();
    expect(reviews, 1);
    await tester.tap(find.byIcon(Icons.archive_outlined));
    await tester.pump();
    expect(archived, 1);
  });

  testWidgets('task row: failed paints the danger message and offers retry', (WidgetTester tester) async {
    int retries = 0;
    await pumpTask(
      tester,
      HoronTaskRow(
        status: HoronTaskStatus.failed,
        title: '슬라이드를 만들지 못했습니다',
        botInitial: 'C',
        botName: 'Deck',
        message: '도구가 실패했습니다',
        onRetry: () => retries++,
      ),
    );
    final HoronThemeData theme = HoronTheme.of(tester.element(find.byType(HoronTaskRow)));
    final Text message = tester.widget<Text>(find.text('도구가 실패했습니다'));
    expect(message.style!.color, theme.colors.textDanger);
    expect(find.byIcon(Icons.error), findsOneWidget);

    await tester.tap(find.text('Retry'));
    await tester.pump();
    expect(retries, 1);
  });

  testWidgets('task row: the list variant drops the card fill', (WidgetTester tester) async {
    await pumpTask(
      tester,
      const HoronTaskRow(
        status: HoronTaskStatus.done,
        title: '끝났습니다',
        botInitial: 'D',
        botName: 'Ops',
        message: '완료',
        card: false,
      ),
    );
    final HoronThemeData theme = HoronTheme.of(tester.element(find.byType(HoronTaskRow)));
    final Container row = tester.widget<Container>(find.byType(Container).first);
    final BoxDecoration decoration = row.decoration! as BoxDecoration;
    // Paper WM4-1: 목록 안 행은 배경 없이 아래 모서리만 r16입니다.
    expect(decoration.color, isNull);
    expect(decoration.borderRadius, const BorderRadius.vertical(bottom: Radius.circular(16)));

    // Paper WM4-1: 목록 안 행은 배경 없이 1px 구분선으로 나뉘고, 구분선은 좌우 16을 들여씁니다.
    final Finder divider = find.byKey(const Key('horon-task-row-divider'));
    expect(divider, findsOneWidget);
    expect(tester.widget<ColoredBox>(divider).color, theme.colors.overlayInk8);
    expect(tester.getSize(divider).height, 1);

    final Rect rowRect = tester.getRect(find.byType(HoronTaskRow));
    final Rect dividerRect = tester.getRect(divider);
    expect(dividerRect.left - rowRect.left, 16);
    expect(rowRect.right - dividerRect.right, 16);
    expect(rowRect.bottom - dividerRect.bottom, 0);

    await pumpTask(
      tester,
      const HoronTaskRow(
        status: HoronTaskStatus.done,
        title: '마지막 행',
        botInitial: 'D',
        botName: 'Ops',
        message: '완료',
        card: false,
        last: true,
      ),
    );
    expect(find.byKey(const Key('horon-task-row-divider')), findsNothing);
  });

  testWidgets('task row: every status renders in both brightnesses', (WidgetTester tester) async {
    for (final Brightness brightness in Brightness.values) {
      for (final HoronTaskStatus status in HoronTaskStatus.values) {
        await pumpTask(
          tester,
          HoronTaskRow(status: status, title: '작업', botInitial: 'E', botName: 'Bot', message: '상태'),
          brightness: brightness,
        );
        expect(tester.takeException(), isNull, reason: '${brightness.name} ${status.name}');
      }
    }
  });
}
