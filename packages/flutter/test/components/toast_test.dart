import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:horon_ui/src/components/toast.dart';
import 'package:horon_ui/src/theme/horon_theme.dart';
import 'package:horon_ui/src/tokens/horon_tokens.g.dart';

/// 토스트의 자동 닫힘·액션 취소·닫기·스택·위아래 배치를 확인합니다.
///
/// 계획이 이름으로 지정한 두 단언이 여기 있습니다.
/// 1. 자동 닫힘 시간이 지나면 위젯이 사라진다.
/// 2. 액션 버튼을 누르면 자동 닫힘이 취소된다.
///
/// 시간은 `tester.pump(Duration(...))`으로만 흘립니다. `Future.delayed`나 실제
/// 시계를 쓰지 않습니다.
void main() {
  /// 화면 전체를 덮는 `Stack` 위에 뷰포트를 얹은 하네스입니다.
  Widget harness(
    HoronToastController controller, {
    Brightness brightness = Brightness.light,
    bool top = false,
    Widget? child,
    Key? appKey,
  }) => MaterialApp(
    key: appKey,
    theme: horonTheme(brightness),
    home: Scaffold(
      body: HoronToastProvider(
        controller: controller,
        child: Stack(
          children: <Widget>[
            const SizedBox.expand(),
            Positioned.fill(child: top ? const HoronToastViewport.top() : const HoronToastViewport()),
            ?child,
          ],
        ),
      ),
    ),
  );

  test('toast: the default auto-dismiss duration is not zero', () {
    expect(horonToastDefaultDuration, const Duration(milliseconds: 5000));
    expect(horonToastDefaultDuration, greaterThan(Duration.zero));
    expect(const HoronToastData().duration, horonToastDefaultDuration);
  });

  test('toast: a zero duration is rejected instead of meaning "never close"', () {
    final HoronToastController controller = HoronToastController();
    addTearDown(controller.dispose);
    expect(() => controller.show(const HoronToastData(title: '즉시', duration: Duration.zero)), throwsAssertionError);
  });

  testWidgets('toast: a card renders its title and description', (WidgetTester tester) async {
    final HoronToastController controller = HoronToastController();
    addTearDown(controller.dispose);

    await tester.pumpWidget(harness(controller));
    controller.show(const HoronToastData(title: '일정을 저장했습니다', description: '오후 3시에 알려 드립니다.'));
    await tester.pump();
    await tester.pump(const Duration(milliseconds: HoronDuration.slower));

    expect(find.text('일정을 저장했습니다'), findsOneWidget);
    expect(find.text('오후 3시에 알려 드립니다.'), findsOneWidget);
    expect(find.byType(HoronToastRoot), findsOneWidget);
    expect(find.byType(HoronToastTitle), findsOneWidget);
    expect(find.byType(HoronToastDescription), findsOneWidget);
  });

  testWidgets('toast: the card disappears after its auto-dismiss duration', (WidgetTester tester) async {
    final HoronToastController controller = HoronToastController();
    addTearDown(controller.dispose);

    await tester.pumpWidget(harness(controller));
    controller.show(const HoronToastData(title: '곧 사라집니다', duration: Duration(milliseconds: 1000)));
    await tester.pump();
    await tester.pump(const Duration(milliseconds: 500));

    expect(find.text('곧 사라집니다'), findsOneWidget, reason: '닫힘 시간 전에 사라졌습니다');

    await tester.pump(const Duration(milliseconds: 600));

    expect(find.text('곧 사라집니다'), findsNothing, reason: '자동 닫힘 시간이 지났는데 위젯이 남아 있습니다');
    expect(find.byType(HoronToastRoot), findsNothing);
    expect(controller.toasts, isEmpty);
  });

  testWidgets('toast: pressing the action cancels the auto-dismiss', (WidgetTester tester) async {
    final HoronToastController controller = HoronToastController();
    addTearDown(controller.dispose);
    int actions = 0;

    await tester.pumpWidget(harness(controller));
    controller.show(
      HoronToastData(
        title: '삭제했습니다',
        actionLabel: '되돌리기',
        duration: const Duration(milliseconds: 1000),
        onAction: () => actions++,
      ),
    );
    await tester.pump();
    await tester.pump(const Duration(milliseconds: 300));

    await tester.tap(find.byKey(HoronToastRoot.actionKey));
    await tester.pump();

    expect(actions, 1, reason: '액션 콜백이 한 번 불려야 합니다');

    // 원래 닫힘 시간(1000ms)을 훌쩍 넘겨도 카드가 남아 있어야 합니다.
    await tester.pump(const Duration(milliseconds: 3000));

    expect(find.text('삭제했습니다'), findsOneWidget, reason: '액션을 눌렀는데 자동 닫힘이 계속 살아 있습니다');
    expect(controller.toasts, hasLength(1));
  });

  testWidgets('toast: pressing close dismisses immediately', (WidgetTester tester) async {
    final HoronToastController controller = HoronToastController();
    addTearDown(controller.dispose);

    await tester.pumpWidget(harness(controller));
    controller.show(const HoronToastData(title: '닫아 보세요', duration: Duration(seconds: 30)));
    await tester.pump();
    await tester.pump(const Duration(milliseconds: HoronDuration.slower));

    await tester.tap(find.byKey(HoronToastRoot.closeKey));
    await tester.pump();

    expect(find.text('닫아 보세요'), findsNothing);
    expect(controller.toasts, isEmpty);
  });

  testWidgets('toast: a null duration never closes on its own', (WidgetTester tester) async {
    final HoronToastController controller = HoronToastController();
    addTearDown(controller.dispose);

    await tester.pumpWidget(harness(controller));
    controller.show(const HoronToastData(title: '계속 남습니다', duration: null));
    await tester.pump();
    await tester.pump(const Duration(seconds: 10));

    expect(find.text('계속 남습니다'), findsOneWidget);
  });

  testWidgets('toast: the stack peeks the cards behind the newest one', (WidgetTester tester) async {
    final HoronToastController controller = HoronToastController();
    addTearDown(controller.dispose);

    await tester.pumpWidget(harness(controller));
    controller.show(const HoronToastData(title: '첫째', duration: Duration(seconds: 30)));
    controller.show(const HoronToastData(title: '둘째', duration: Duration(seconds: 30)));
    controller.show(const HoronToastData(title: '셋째', duration: Duration(seconds: 30)));
    await tester.pump();
    await tester.pump(const Duration(milliseconds: HoronDuration.slower));

    expect(find.byType(HoronToastRoot), findsNWidgets(3));

    // 아래쪽 정렬이므로 뒤 카드는 위로 비켜나고, 작게 그려집니다. React의
    // `translateY(-index*peek - shrink*height) scale(...)`과 같은 기하입니다.
    final double newestTop = tester.getTopLeft(find.byKey(HoronToastRoot.keyFor(controller.toasts[2].id))).dy;
    final double secondTop = tester.getTopLeft(find.byKey(HoronToastRoot.keyFor(controller.toasts[1].id))).dy;
    final double oldestTop = tester.getTopLeft(find.byKey(HoronToastRoot.keyFor(controller.toasts[0].id))).dy;

    expect(newestTop - secondTop, closeTo(HoronSpace.s3, 0.5), reason: '둘째 카드의 가장자리가 12px 드러나야 합니다');
    expect(newestTop - oldestTop, closeTo(HoronSpace.s3 * 2, 0.5), reason: '셋째 카드의 가장자리가 24px 드러나야 합니다');
  });

  testWidgets('toast: the default viewport hugs the bottom edge', (WidgetTester tester) async {
    final HoronToastController controller = HoronToastController();
    addTearDown(controller.dispose);

    await tester.pumpWidget(harness(controller));
    controller.show(const HoronToastData(title: '아래', duration: Duration(seconds: 30)));
    await tester.pump();
    await tester.pump(const Duration(milliseconds: HoronDuration.slower));

    final Rect card = tester.getRect(find.byType(HoronToastRoot));
    final Size screen = tester.view.physicalSize / tester.view.devicePixelRatio;
    expect(card.bottom, closeTo(screen.height - HoronSpace.s4, 1.0), reason: '카드가 아래 가장자리에서 16 떨어져야 합니다');
  });

  testWidgets('toast: the top viewport hugs the top edge', (WidgetTester tester) async {
    final HoronToastController controller = HoronToastController();
    addTearDown(controller.dispose);

    await tester.pumpWidget(harness(controller, top: true));
    controller.show(const HoronToastData(title: '위', duration: Duration(seconds: 30)));
    await tester.pump();
    await tester.pump(const Duration(milliseconds: HoronDuration.slower));

    final Rect card = tester.getRect(find.byType(HoronToastRoot));
    expect(card.top, closeTo(HoronSpace.s4, 1.0), reason: '카드가 위 가장자리에서 16 떨어져야 합니다');
  });

  testWidgets('toast: both brightnesses render the card', (WidgetTester tester) async {
    for (final Brightness brightness in Brightness.values) {
      final HoronToastController controller = HoronToastController();
      addTearDown(controller.dispose);

      await tester.pumpWidget(harness(controller, brightness: brightness, appKey: ValueKey<Brightness>(brightness)));
      controller.show(const HoronToastData(title: '밝기', description: '두 밝기 모두', duration: Duration(seconds: 30)));
      await tester.pump();
      await tester.pump(const Duration(milliseconds: HoronDuration.slower));

      expect(tester.takeException(), isNull, reason: brightness.name);
      final BuildContext context = tester.element(find.byType(HoronToastRoot));
      expect(Theme.of(context).brightness, brightness, reason: brightness.name);
      expect(HoronTheme.of(context).glassFillStrong, isNotNull);
      expect(find.text('밝기'), findsOneWidget, reason: brightness.name);
    }
  });

  testWidgets('toast: the controller refuses to dismiss an unknown id', (WidgetTester tester) async {
    final HoronToastController controller = HoronToastController();
    addTearDown(controller.dispose);

    await tester.pumpWidget(harness(controller));
    final String id = controller.show(const HoronToastData(title: '하나', duration: Duration(seconds: 30)));
    await tester.pump();

    controller.dismiss('horon-toast-does-not-exist');
    await tester.pump();
    expect(controller.toasts, hasLength(1), reason: '없는 식별자를 닫으려 하면 목록이 그대로여야 합니다');

    controller.dismiss(id);
    await tester.pump();
    expect(controller.toasts, isEmpty);
  });
}
