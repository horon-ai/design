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

void main() {
  testWidgets('approval card: pending keeps the brand rim and both actions', (WidgetTester tester) async {
    await pumpApproval(tester, const HoronApprovalCard(title: 'Q3 보드 덱을 팀에 보낼까요?'));
    final HoronThemeData theme = HoronTheme.of(tester.element(find.byType(HoronApprovalCard)));

    expect(tester.getSize(find.byType(HoronApprovalCard)).width, 360);
    expect(find.byType(HoronLiquidGlass), findsOneWidget);
    expect(find.text('Needs your yes'), findsOneWidget);
    expect(find.text('Approve'), findsOneWidget);
    expect(find.text('Later'), findsOneWidget);
    expect(theme.colors.statusLive, isNotNull);
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
    expect(find.text('Approve'), findsNothing);
    expect(tester.widget<Text>(find.text('Approved')).style!.color, theme.colors.textSecondary);

    await pumpApproval(tester, const HoronApprovalCard(title: '거절했습니다', state: HoronApprovalState.declined));
    expect(find.text('Declined'), findsOneWidget);
    expect(tester.widget<Text>(find.text('Declined')).style!.color, theme.colors.textDanger);
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
