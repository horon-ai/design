import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:horon_ui/src/components/agent_steering_panel.dart';
import 'package:horon_ui/src/components/spinner.dart';
import 'package:horon_ui/src/theme/horon_theme.dart';

/// 세 단계와 쪽지 두 장입니다. 하나는 아직 대기열에 있고 하나는 적용되었습니다.
const List<HoronSteeringStep> _steps = <HoronSteeringStep>[
  HoronSteeringStep(id: 'read', label: '메일을 읽습니다', status: HoronSteeringStepStatus.done, time: '1.4s'),
  HoronSteeringStep(id: 'plan', label: '답장을 계획합니다', status: HoronSteeringStepStatus.active),
  HoronSteeringStep(id: 'send', label: '답장을 보냅니다', status: HoronSteeringStepStatus.todo),
];

const List<HoronSteeringNote> _notes = <HoronSteeringNote>[
  HoronSteeringNote(id: 'tone', text: '더 짧게 써 주세요'),
  HoronSteeringNote(id: 'sign', text: '서명을 빼 주세요', applied: true),
];

/// 패널을 [width] 폭으로 세우고 한 프레임 그립니다.
///
/// 테스트 기본 표면은 800×600이라, 더 넓은 폭도 그릴 수 있게 표면을 먼저 넓힙니다.
Future<void> pumpPanel(
  WidgetTester tester,
  Widget child, {
  Brightness brightness = Brightness.light,
  double width = 520,
}) async {
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

/// 그려진 [DecoratedBox]나 [ColoredBox] 중 [color]로 채운 것이 있는지 봅니다.
bool _paints(WidgetTester tester, Color color) =>
    tester
        .widgetList<DecoratedBox>(find.byType(DecoratedBox))
        .any(
          (DecoratedBox box) => box.decoration is BoxDecoration && (box.decoration as BoxDecoration).color == color,
        ) ||
    tester.widgetList<ColoredBox>(find.byType(ColoredBox)).any((ColoredBox box) => box.color == color);

/// [label] 글자가 그려진 색입니다.
Color? _labelColor(WidgetTester tester, String label) =>
    tester.widget<RichText>(find.descendant(of: find.text(label), matching: find.byType(RichText))).text.style?.color;

void main() {
  testWidgets('steering: the default panel renders in light and dark', (WidgetTester tester) async {
    for (final Brightness brightness in Brightness.values) {
      await pumpPanel(
        tester,
        const HoronAgentSteeringPanel(
          title: 'Draft the reply',
          subtitle: 'Inbox · 3 threads',
          status: 'Running · 2m 10s',
          steps: _steps,
        ),
        brightness: brightness,
      );
      expect(tester.takeException(), isNull, reason: brightness.name);
      expect(find.text('Draft the reply'), findsOneWidget);
      expect(find.text('Inbox · 3 threads'), findsOneWidget);
      expect(find.text('Running · 2m 10s'), findsOneWidget);
      expect(find.text('Steer the bot…'), findsOneWidget);
    }
  });

  testWidgets('steering: the header carries the 18px sparkle and a 32px pause button', (WidgetTester tester) async {
    await pumpPanel(tester, const HoronAgentSteeringPanel(title: 'Draft', steps: _steps));
    final HoronThemeData theme = HoronTheme.of(tester.element(find.byType(HoronAgentSteeringPanel)));
    // `Sparkle size-4.5 text-text-primary`.
    final Icon sparkle = tester.widget<Icon>(find.byIcon(Icons.auto_awesome));
    expect(sparkle.size, 18);
    expect(sparkle.color, theme.colors.textPrimary);
    // `text-label-lg`.
    expect(_labelColor(tester, 'Draft'), theme.colors.textPrimary);
    // `size-8 rounded-[10px]`, `[&>svg]:size-4`.
    expect(tester.widget<Icon>(find.byIcon(Icons.pause)).size, 16);
    expect(
      tester.getSize(find.ancestor(of: find.byIcon(Icons.pause), matching: find.byType(AnimatedContainer)).first),
      const Size(32, 32),
    );
  });

  testWidgets('steering: the pause button reports the flipped state', (WidgetTester tester) async {
    bool? reported;
    await pumpPanel(
      tester,
      HoronAgentSteeringPanel(title: 'Draft', steps: _steps, onPausedChange: (bool paused) => reported = paused),
    );
    await tester.tap(find.byIcon(Icons.pause));
    await tester.pump();
    expect(reported, isTrue);

    reported = null;
    await pumpPanel(
      tester,
      HoronAgentSteeringPanel(
        title: 'Draft',
        steps: _steps,
        paused: true,
        onPausedChange: (bool paused) => reported = paused,
      ),
    );
    // `aria-label={paused ? "Resume" : "Pause"}` — 일시정지 중에는 재생 아이콘입니다.
    expect(find.byIcon(Icons.play_arrow), findsOneWidget);
    await tester.tap(find.byIcon(Icons.play_arrow));
    await tester.pump();
    expect(reported, isFalse);
  });

  testWidgets('steering: the step rail marks done, active and todo', (WidgetTester tester) async {
    await pumpPanel(tester, const HoronAgentSteeringPanel(title: 'Draft', steps: _steps));
    final HoronThemeData theme = HoronTheme.of(tester.element(find.byType(HoronAgentSteeringPanel)));

    // `Check size-3` — 끝난 단계만 체크가 붙습니다.
    expect(find.byIcon(Icons.check), findsOneWidget);
    expect(tester.widget<Icon>(find.byIcon(Icons.check)).size, 12);
    // `<Spinner size={18} />` — 도는 단계는 18px 스피너입니다.
    expect(tester.widget<HoronSpinner>(find.byType(HoronSpinner)).pixelSize, 18);
    // `text-body-sm text-text-secondary` (todo) / `text-text-primary`.
    expect(_labelColor(tester, '메일을 읽습니다'), theme.colors.textPrimary);
    expect(_labelColor(tester, '답장을 계획합니다'), theme.colors.textPrimary);
    expect(_labelColor(tester, '답장을 보냅니다'), theme.colors.textSecondary);
    // `time` 캡션.
    expect(find.text('1.4s'), findsOneWidget);
  });

  testWidgets('steering: the connector follows the step status', (WidgetTester tester) async {
    await pumpPanel(tester, const HoronAgentSteeringPanel(title: 'Draft', steps: _steps));
    final HoronThemeData theme = HoronTheme.of(tester.element(find.byType(HoronAgentSteeringPanel)));
    // 끝난 단계 아래는 라이브 색, 도는 단계 아래는 10% 잉크입니다.
    expect(_paints(tester, theme.colors.statusLive), isTrue);
    expect(_paints(tester, theme.colors.overlayInk10), isTrue);
  });

  testWidgets('steering: every step status renders in both brightnesses', (WidgetTester tester) async {
    for (final Brightness brightness in Brightness.values) {
      for (final HoronSteeringStepStatus status in HoronSteeringStepStatus.values) {
        await pumpPanel(
          tester,
          HoronAgentSteeringPanel(
            title: 'Draft',
            steps: <HoronSteeringStep>[HoronSteeringStep(id: 'only', label: status.name, status: status)],
          ),
          brightness: brightness,
        );
        expect(tester.takeException(), isNull, reason: '${brightness.name} ${status.name}');
      }
    }
  });

  testWidgets('steering: the notes queue counts, applies and removes', (WidgetTester tester) async {
    String? applied;
    String? removed;
    await pumpPanel(
      tester,
      HoronAgentSteeringPanel(
        title: 'Draft',
        steps: _steps,
        notes: _notes,
        onApplyNow: (String id) => applied = id,
        onRemoveNote: (String id) => removed = id,
      ),
    );
    final HoronThemeData theme = HoronTheme.of(tester.element(find.byType(HoronAgentSteeringPanel)));

    // `Queued for the next step` + 대기 중인 쪽지 수 1.
    expect(find.text('QUEUED FOR THE NEXT STEP'), findsOneWidget);
    expect(find.text('1'), findsOneWidget);
    // `bg-overlay-ink-4`.
    expect(_paints(tester, theme.colors.overlayInk4), isTrue);

    // 적용된 쪽지는 "Now" 알약만 남고 제거 버튼이 없습니다.
    expect(find.text('Now'), findsNWidgets(2));
    expect(find.byIcon(Icons.close), findsOneWidget);

    await tester.tap(find.text('Now').first);
    await tester.pump();
    expect(applied, 'tone');

    await tester.tap(find.byIcon(Icons.close));
    await tester.pump();
    expect(removed, 'tone');
  });

  testWidgets('steering: the steer box sends the typed text and clears it', (WidgetTester tester) async {
    final List<(String, bool)> sent = <(String, bool)>[];
    await pumpPanel(
      tester,
      HoronAgentSteeringPanel(
        title: 'Draft',
        steps: _steps,
        onSteer: (String text, bool interrupt) => sent.add((text, interrupt)),
      ),
    );

    // 빈 글자는 보내지 않습니다.
    await tester.tap(find.byIcon(Icons.arrow_upward));
    await tester.pump();
    expect(sent, isEmpty);

    await tester.enterText(find.byType(TextField), '  서명을 빼 주세요  ');
    await tester.pump();
    await tester.tap(find.byIcon(Icons.arrow_upward));
    await tester.pump();
    expect(sent, <(String, bool)>[('서명을 빼 주세요', false)]);
    expect(tester.widget<TextField>(find.byType(TextField)).controller!.text, isEmpty);

    // Enter는 다음 단계에 쌓습니다.
    await tester.enterText(find.byType(TextField), '짧게');
    await tester.testTextInput.receiveAction(TextInputAction.send);
    await tester.pump();
    expect(sent.last, ('짧게', false));

    // ⌘Enter는 지금 끼어듭니다.
    await tester.enterText(find.byType(TextField), '멈춰');
    await tester.sendKeyDownEvent(LogicalKeyboardKey.meta);
    await tester.sendKeyEvent(LogicalKeyboardKey.enter);
    await tester.sendKeyUpEvent(LogicalKeyboardKey.meta);
    await tester.pump();
    expect(sent.last, ('멈춰', true));
  });

  testWidgets('steering: the steer box keeps the 44px height and the 16px send icon', (WidgetTester tester) async {
    await pumpPanel(tester, const HoronAgentSteeringPanel(title: 'Draft', steps: _steps));
    // `h-11` — 조타 상자는 44입니다.
    final Finder box = find.ancestor(of: find.byType(TextField), matching: find.byType(Container)).first;
    expect(tester.getSize(box).height, 44);
    // `[&>svg]:size-4`.
    expect(tester.widget<Icon>(find.byIcon(Icons.arrow_upward)).size, 16);
  });

  testWidgets('steering: narrow widths keep the panel inside the screen', (WidgetTester tester) async {
    await pumpPanel(
      tester,
      const HoronAgentSteeringPanel(title: 'Draft the reply with a long title', steps: _steps),
      width: 320,
    );
    expect(tester.takeException(), isNull);
    expect(find.text('Draft the reply with a long title'), findsOneWidget);
  });

  testWidgets('steering: the panel stops at 520 wide', (WidgetTester tester) async {
    await tester.binding.setSurfaceSize(const Size(900, 700));
    addTearDown(() => tester.binding.setSurfaceSize(null));
    await tester.pumpWidget(
      MaterialApp(
        theme: horonTheme(Brightness.light),
        home: const Scaffold(
          body: Center(
            child: HoronAgentSteeringPanel(title: 'Draft', steps: _steps),
          ),
        ),
      ),
    );
    await tester.pump();
    // `max-w-130` — 부모가 느슨한 폭을 주면 520에서 멈춥니다.
    expect(tester.getSize(find.byType(HoronAgentSteeringPanel)).width, 520);
  });
}
