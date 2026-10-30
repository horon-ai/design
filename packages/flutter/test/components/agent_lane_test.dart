import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:horon_ui/horon_ui.dart';

Future<void> pumpLane(WidgetTester tester, Widget child, {Brightness brightness = Brightness.light}) async {
  await tester.pumpWidget(
    MaterialApp(
      theme: horonTheme(brightness),
      home: Scaffold(
        body: Center(child: SizedBox(width: 380, child: child)),
      ),
    ),
  );
  await tester.pump();
  await tester.pump(const Duration(milliseconds: 200));
}

void main() {
  testWidgets('agent lane: the running state shows a spinner and a sky tile', (WidgetTester tester) async {
    await pumpLane(
      tester,
      const HoronAgentLane(
        status: HoronAgentLaneStatus.running,
        initial: 'A',
        name: 'Analyst',
        task: '지표를 모은다',
        elapsed: '1.9s',
      ),
    );
    expect(find.byType(HoronSpinner), findsOneWidget);
    expect(find.text('Analyst'), findsOneWidget);
    expect(find.text('1.9s'), findsOneWidget);
    expect(tester.widget<Text>(find.text('지표를 모은다')).style!.fontSize, 16);
  });

  testWidgets('agent lane: done shows a check and failed adds the danger rim', (WidgetTester tester) async {
    await pumpLane(
      tester,
      const HoronAgentLane(status: HoronAgentLaneStatus.done, initial: 'B', name: 'Writer', task: '노트를 쓴다'),
    );
    expect(find.byIcon(Icons.check_circle), findsOneWidget);
    expect(find.byType(HoronSpinner), findsNothing);

    await pumpLane(
      tester,
      const HoronAgentLane(
        status: HoronAgentLaneStatus.failed,
        initial: 'C',
        name: 'Writer',
        task: '노트를 쓴다',
        output: '응답이 잘렸습니다',
      ),
    );
    final HoronThemeData theme = HoronTheme.of(tester.element(find.byType(HoronAgentLane)));
    final AnimatedContainer box = tester.widget<AnimatedContainer>(find.byType(AnimatedContainer).first);
    expect(((box.decoration! as BoxDecoration).border! as Border).top.color, theme.colors.borderDanger);
    expect(find.byIcon(Icons.error), findsOneWidget);
    final RichText output = tester.widget<RichText>(
      find.descendant(of: find.text('응답이 잘렸습니다'), matching: find.byType(RichText)),
    );
    expect(output.text.style!.color, theme.colors.textDanger);
  });

  testWidgets('agent lane: tool and usage captions sit under the task', (WidgetTester tester) async {
    await pumpLane(
      tester,
      const HoronAgentLane(
        status: HoronAgentLaneStatus.done,
        initial: 'D',
        name: 'Researcher',
        task: '시장을 조사한다',
        tool: 'Notion · Q3 metrics',
        usage: '2.6k tokens',
      ),
    );
    expect(find.text('Notion · Q3 metrics'), findsOneWidget);
    expect(find.text('2.6k tokens'), findsOneWidget);
  });

  testWidgets('agent lane: every status renders in both brightnesses', (WidgetTester tester) async {
    for (final Brightness brightness in Brightness.values) {
      for (final HoronAgentLaneStatus status in HoronAgentLaneStatus.values) {
        await pumpLane(
          tester,
          HoronAgentLane(status: status, initial: 'E', name: 'Lane', task: '일'),
          brightness: brightness,
        );
        expect(tester.takeException(), isNull, reason: '${brightness.name} ${status.name}');
      }
    }
  });
}
