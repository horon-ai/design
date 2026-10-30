import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:horon_ui/horon_ui.dart';

Future<void> pumpPlan(WidgetTester tester, Widget child, {Brightness brightness = Brightness.light}) async {
  await tester.pumpWidget(
    MaterialApp(
      theme: horonTheme(brightness),
      home: Scaffold(
        body: Center(child: SizedBox(width: 460, child: child)),
      ),
    ),
  );
  // 진행 중 상태는 스피너가 계속 돌아 pumpAndSettle 이 끝나지 않습니다.
  await tester.pump();
  await tester.pump(const Duration(milliseconds: 300));
}

void main() {
  testWidgets('plan card: the label, title and steps are laid out', (WidgetTester tester) async {
    await pumpPlan(
      tester,
      const HoronPlanCard(
        label: 'Plan · 2 steps',
        title: '문서를 정리합니다',
        steps: <Widget>[Text('1. 파일을 읽습니다'), Text('2. 요약합니다')],
      ),
    );
    final HoronThemeData theme = HoronTheme.of(tester.element(find.byType(HoronPlanCard)));

    expect(find.text('Plan · 2 steps'), findsOneWidget);
    expect(find.text('문서를 정리합니다'), findsOneWidget);
    expect(tester.widget<Text>(find.text('문서를 정리합니다')).style!.fontSize, theme.text.labelLg.fontSize);
    expect(find.byIcon(Icons.checklist), findsOneWidget);
  });

  testWidgets('plan card: no status hides the footer and a status shows it', (WidgetTester tester) async {
    await pumpPlan(tester, const HoronPlanCard(title: '계획', statusLabel: 'Running · 1 of 2'));
    expect(find.text('Running · 1 of 2'), findsNothing);

    await pumpPlan(
      tester,
      const HoronPlanCard(
        title: '계획',
        status: HoronPlanCardStatus.running,
        statusLabel: 'Running · 1 of 2',
        elapsed: '3.1s',
      ),
    );
    expect(find.text('Running · 1 of 2'), findsOneWidget);
    expect(find.text('3.1s'), findsOneWidget);
    expect(find.byType(HoronSpinner), findsOneWidget);
  });

  testWidgets('plan card: the failed status paints the danger colour and the warning icon', (
    WidgetTester tester,
  ) async {
    await pumpPlan(
      tester,
      const HoronPlanCard(title: '계획', status: HoronPlanCardStatus.failed, statusLabel: 'Stopped · step 2 failed'),
    );
    final HoronThemeData theme = HoronTheme.of(tester.element(find.byType(HoronPlanCard)));

    expect(find.byIcon(Icons.error_outline), findsOneWidget);
    expect(find.byType(HoronSpinner), findsNothing);
    expect(tester.widget<Text>(find.text('Stopped · step 2 failed')).style!.color, theme.colors.textDanger);
  });

  testWidgets('plan card: both statuses render in both brightnesses', (WidgetTester tester) async {
    for (final Brightness brightness in Brightness.values) {
      for (final HoronPlanCardStatus status in HoronPlanCardStatus.values) {
        await pumpPlan(
          tester,
          HoronPlanCard(title: '계획', status: status, statusLabel: '문구'),
          brightness: brightness,
        );
        expect(tester.takeException(), isNull, reason: '${brightness.name} ${status.name}');
      }
    }
  });
}
