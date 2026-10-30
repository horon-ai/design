import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:horon_ui/horon_ui.dart';

Future<void> pumpStep(WidgetTester tester, Widget child, {Brightness brightness = Brightness.light}) async {
  await tester.pumpWidget(
    MaterialApp(
      theme: horonTheme(brightness),
      home: Scaffold(
        body: Center(child: SizedBox(width: 420, child: child)),
      ),
    ),
  );
  // 실행 중 단계는 스피너가 돌아 pumpAndSettle 이 끝나지 않습니다.
  await tester.pump();
  await tester.pump(const Duration(milliseconds: 300));
}

void main() {
  testWidgets('plan step: the marker is 24px at the md radius', (WidgetTester tester) async {
    await pumpStep(tester, const HoronPlanStep(status: HoronPlanStepStatus.pending, index: 3, title: '요약한다'));
    final HoronThemeData theme = HoronTheme.of(tester.element(find.byType(HoronPlanStep)));

    final Container marker = tester.widget<Container>(
      find.descendant(of: find.byType(HoronPlanStep), matching: find.byType(Container)).first,
    );
    expect(tester.getSize(find.byType(Container).first), const Size(24, 24));
    expect(((marker.decoration! as BoxDecoration).borderRadius! as BorderRadius).topLeft.x, theme.radius.md);
    expect(find.text('3'), findsOneWidget);
  });

  testWidgets('plan step: done paints the sky marker and rail with a check', (WidgetTester tester) async {
    await pumpStep(tester, const HoronPlanStep(status: HoronPlanStepStatus.done, index: 1, title: '읽는다'));
    final HoronThemeData theme = HoronTheme.of(tester.element(find.byType(HoronPlanStep)));
    expect(find.byIcon(Icons.check), findsOneWidget);

    final bool paintsLive = tester.widgetList<Container>(find.byType(Container)).any((Container box) {
      final Decoration? decoration = box.decoration;
      return decoration is BoxDecoration && decoration.color == theme.colors.statusLive;
    });
    expect(paintsLive, isTrue);
  });

  testWidgets('plan step: running shows a spinner, failed a warning and a retry', (WidgetTester tester) async {
    await pumpStep(tester, const HoronPlanStep(status: HoronPlanStepStatus.running, index: 2, title: '분류한다'));
    expect(find.byType(HoronSpinner), findsOneWidget);

    int retries = 0;
    await pumpStep(
      tester,
      HoronPlanStep(
        status: HoronPlanStepStatus.failed,
        index: 2,
        title: '분류한다',
        error: '도구가 실패했습니다',
        onRetry: () => retries++,
      ),
    );
    expect(find.text('!'), findsOneWidget);
    expect(find.text('도구가 실패했습니다'), findsOneWidget);
    await tester.tap(find.text('Retry from here'));
    await tester.pump();
    expect(retries, 1);
  });

  testWidgets('plan step: last hides the rail, description and tool sit under the title', (WidgetTester tester) async {
    await pumpStep(
      tester,
      const HoronPlanStep(
        status: HoronPlanStepStatus.done,
        index: 1,
        title: '질의한다',
        description: '도구를 두 번 호출합니다',
        tool: 'stripe.query',
        last: true,
      ),
    );
    expect(find.text('stripe.query'), findsOneWidget);
    expect(find.text('도구를 두 번 호출합니다'), findsOneWidget);
    // 마지막 단계는 레일 컨테이너가 하나 적습니다.
    final int railCount = tester.widgetList<Container>(find.byType(Container)).where((Container box) {
      final Decoration? decoration = box.decoration;
      return decoration is BoxDecoration && decoration.color != null && (box.constraints?.maxWidth ?? 0) == 2;
    }).length;
    expect(railCount, 0);
  });

  testWidgets('plan step: every status renders in both brightnesses', (WidgetTester tester) async {
    for (final Brightness brightness in Brightness.values) {
      for (final HoronPlanStepStatus status in HoronPlanStepStatus.values) {
        await pumpStep(
          tester,
          HoronPlanStep(status: status, index: 1, title: '단계'),
          brightness: brightness,
        );
        expect(tester.takeException(), isNull, reason: '${brightness.name} ${status.name}');
      }
    }
  });
}
