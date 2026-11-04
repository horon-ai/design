import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:horon_ui/horon_ui.dart';

Future<void> pumpApproval(WidgetTester tester, Widget child, {Brightness brightness = Brightness.light}) async {
  await tester.pumpWidget(
    MaterialApp(
      theme: horonTheme(brightness),
      home: Scaffold(body: Center(child: child)),
    ),
  );
  await tester.pumpAndSettle();
}

/// 카드 안에서 [color]로 채운 8px 점입니다.
Finder _dot(WidgetTester tester, Color color) => find.byWidgetPredicate((Widget widget) {
  if (widget is! Container) return false;
  final Decoration? decoration = widget.decoration;
  if (decoration is! BoxDecoration || decoration.shape != BoxShape.circle || decoration.color != color) return false;
  return tester.getSize(find.byWidget(widget)) == const Size(8, 8);
});

void main() {
  testWidgets('approval card: pending keeps the brand rim and both actions', (WidgetTester tester) async {
    await pumpApproval(tester, const HoronApprovalCard(title: 'Q3 보드 덱을 팀에 보낼까요?'));
    final HoronThemeData theme = HoronTheme.of(tester.element(find.byType(HoronApprovalCard)));

    expect(tester.getSize(find.byType(HoronApprovalCard)).width, 360);
    expect(find.byType(HoronLiquidGlass), findsAtLeastNWidgets(1));
    expect(find.text('Needs your yes'), findsOneWidget);
    expect(find.text('Approve'), findsOneWidget);
    expect(find.text('Later'), findsOneWidget);

    // `bg-status-live` — 대기 점은 라이브 색입니다.
    expect(_dot(tester, theme.colors.statusLive), findsOneWidget);
    // 액션은 Later → Approve 순서로 오른쪽 끝에 붙고 폭을 채웁니다.
    final double laterX = tester.getTopLeft(find.text('Later')).dx;
    final double approveX = tester.getTopLeft(find.text('Approve')).dx;
    expect(laterX, lessThan(approveX));
    // `flex w-full justify-end` — 액션 줄은 폭을 채우고 오른쪽으로 붙습니다.
    final Finder actions = find.byWidgetPredicate(
      (Widget widget) => widget is Row && widget.mainAxisAlignment == MainAxisAlignment.end,
    );
    expect(actions, findsOneWidget);
    // `w-90`(360)는 border-box라 1px 테두리 두 줄과 `p-4`(32)를 뺀 326이 내용 폭입니다.
    expect(tester.getSize(actions).width, 360 - 32 - 2);
  });

  testWidgets('approval card: the two actions report back', (WidgetTester tester) async {
    int approved = 0;
    int later = 0;
    await pumpApproval(tester, HoronApprovalCard(title: '보낼까요?', onApprove: () => approved++, onLater: () => later++));
    await tester.tap(find.text('Approve'));
    await tester.pumpAndSettle();
    await tester.tap(find.text('Later'));
    await tester.pumpAndSettle();
    expect(approved, 1);
    expect(later, 1);
  });

  testWidgets('approval card: approved and declined hide the actions and paint their status', (
    WidgetTester tester,
  ) async {
    await pumpApproval(tester, const HoronApprovalCard(title: '보냈습니다', state: HoronApprovalState.approved));
    final HoronThemeData theme = HoronTheme.of(tester.element(find.byType(HoronApprovalCard)));
    expect(find.text('Approved'), findsOneWidget);
    // `motion-reveal` — 접혀도 버튼은 트리에 남아 있고 높이만 0입니다.
    expect(find.text('Approve'), findsOneWidget);
    expect(tester.widget<Text>(find.text('Approved')).style!.color, theme.colors.textSecondary);

    await pumpApproval(tester, const HoronApprovalCard(title: '거절했습니다', state: HoronApprovalState.declined));
    expect(find.text('Declined'), findsOneWidget);
    expect(tester.widget<Text>(find.text('Declined')).style!.color, theme.colors.textDanger);
    // `bg-accent-red-500-90` — 거절 점은 위험 원시색 대신 90% 토큰입니다.
    expect(_dot(tester, theme.colors.accentRed500_90), findsOneWidget);
  });

  testWidgets('approval card: the action row collapses and goes inert outside pending', (WidgetTester tester) async {
    int approved = 0;
    await pumpApproval(
      tester,
      HoronApprovalCard(title: '보냈습니다', state: HoronApprovalState.approved, onApprove: () => approved++),
    );
    final Finder reveal = find.byWidgetPredicate((Widget widget) => widget is Align && widget.heightFactor == 0);
    expect(reveal, findsOneWidget);
    expect(tester.getSize(reveal).height, 0);

    // 접힌 동안에는 눌리지 않습니다(React `inert`).
    await tester.tap(find.text('Approve'), warnIfMissed: false);
    await tester.pump();
    expect(approved, 0);
  });

  testWidgets('approval card: the attachment sits in a 5% ink pill', (WidgetTester tester) async {
    await pumpApproval(tester, const HoronApprovalCard(title: '보낼까요?', attachment: 'Q3-board-deck.pdf'));
    expect(find.text('Q3-board-deck.pdf'), findsOneWidget);
    expect(find.byIcon(Icons.attach_file), findsOneWidget);
  });

  testWidgets('approval card: every state renders in both brightnesses', (WidgetTester tester) async {
    for (final Brightness brightness in Brightness.values) {
      for (final HoronApprovalState state in HoronApprovalState.values) {
        await pumpApproval(
          tester,
          HoronApprovalCard(title: '문구', state: state),
          brightness: brightness,
        );
        expect(tester.takeException(), isNull, reason: '${brightness.name} ${state.name}');
      }
    }
  });
}
