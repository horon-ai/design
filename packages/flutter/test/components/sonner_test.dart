import 'dart:async';

import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:horon_ui/horon_ui.dart';

/// sonner 토스터의 promise 상태 이동, 스와이프 닫기, 겹친 스택, 모서리 배치를
/// 확인합니다.
///
/// 계획이 이름으로 지정한 두 단언이 여기 있습니다.
/// 1. promise 상태가 loading → success로 넘어간다.
/// 2. 스와이프로 카드가 닫힌다.
///
/// promise는 [Completer]로 붙잡아 두므로 "아직 로딩"과 "이미 성공" 사이에 실제
/// 시간이 흐르지 않습니다. 시간이 필요한 곳은 `tester.pump(Duration(...))`만
/// 씁니다.
void main() {
  /// 화면 전체를 덮는 `Stack` 위에 토스터를 얹은 하네스입니다.
  Widget harness(
    HoronSonnerController controller, {
    Brightness brightness = Brightness.light,
    HoronSonnerPosition position = HoronSonnerPosition.bottomRight,
    Key? appKey,
  }) => MaterialApp(
    key: appKey,
    theme: horonTheme(brightness),
    home: Scaffold(
      body: Stack(
        children: <Widget>[
          const SizedBox.expand(),
          Positioned.fill(
            child: HoronSonnerToaster(controller: controller, position: position),
          ),
        ],
      ),
    ),
  );

  test('sonner: the default auto-dismiss duration is not zero', () {
    expect(horonSonnerDefaultDuration, const Duration(milliseconds: 4000));
    expect(horonSonnerDefaultDuration, greaterThan(Duration.zero));
    expect(const HoronSonnerToastData().duration, horonSonnerDefaultDuration);
  });

  test('sonner: a zero duration is rejected', () {
    final HoronSonnerController controller = HoronSonnerController();
    addTearDown(controller.dispose);
    expect(
      () => controller.show(const HoronSonnerToastData(title: '즉시', duration: Duration.zero)),
      throwsAssertionError,
    );
  });

  testWidgets('sonner: a card renders its title and description', (WidgetTester tester) async {
    final HoronSonnerController controller = HoronSonnerController();
    addTearDown(controller.dispose);

    await tester.pumpWidget(harness(controller));
    controller.show(
      const HoronSonnerToastData(title: '동기화했습니다', description: '마지막 변경 3건을 올렸습니다.', duration: Duration(seconds: 30)),
    );
    await tester.pump();

    expect(find.text('동기화했습니다'), findsOneWidget);
    expect(find.text('마지막 변경 3건을 올렸습니다.'), findsOneWidget);
    expect(find.byType(HoronSonnerToast), findsOneWidget);
  });

  testWidgets('sonner: a promise moves loading -> success', (WidgetTester tester) async {
    final HoronSonnerController controller = HoronSonnerController();
    addTearDown(controller.dispose);
    final Completer<int> completer = Completer<int>();

    await tester.pumpWidget(harness(controller));
    final Future<int> pending = controller.promise<int>(
      completer.future,
      loading: '올리는 중',
      success: (int count) => '$count건을 올렸습니다',
      error: (Object error) => '올리지 못했습니다',
    );
    await tester.pump();

    // promise가 아직 끝나지 않았습니다: 로딩 표시가 있고 성공 표시는 없습니다.
    expect(find.text('올리는 중'), findsOneWidget);
    expect(find.byKey(HoronSonnerToast.loadingKey), findsOneWidget);
    expect(find.byKey(HoronSonnerToast.successKey), findsNothing);
    expect(controller.toasts.single.data.state, HoronSonnerToastState.loading);

    completer.complete(3);
    await expectLater(pending, completion(3));
    await tester.pump();

    // 끝난 뒤: 성공 표시로 바뀌고 로딩 표시는 사라집니다.
    expect(find.text('3건을 올렸습니다'), findsOneWidget);
    expect(find.byKey(HoronSonnerToast.successKey), findsOneWidget);
    expect(find.byKey(HoronSonnerToast.loadingKey), findsNothing);
    expect(controller.toasts.single.data.state, HoronSonnerToastState.success);
  });

  testWidgets('sonner: a rejected promise moves loading -> error and rethrows', (WidgetTester tester) async {
    final HoronSonnerController controller = HoronSonnerController();
    addTearDown(controller.dispose);
    final Completer<int> completer = Completer<int>();

    await tester.pumpWidget(harness(controller));
    final Future<int> pending = controller.promise<int>(
      completer.future,
      loading: '올리는 중',
      success: (int count) => '$count건을 올렸습니다',
      error: (Object error) => '올리지 못했습니다: $error',
    );
    await tester.pump();
    expect(find.byKey(HoronSonnerToast.loadingKey), findsOneWidget);

    completer.completeError(StateError('network down'));
    await expectLater(pending, throwsStateError);
    await tester.pump();

    expect(find.textContaining('올리지 못했습니다'), findsOneWidget);
    expect(find.byKey(HoronSonnerToast.errorKey), findsOneWidget);
    expect(find.byKey(HoronSonnerToast.loadingKey), findsNothing);
    expect(controller.toasts.single.data.state, HoronSonnerToastState.error);
  });

  testWidgets('sonner: a loading card does not auto-dismiss', (WidgetTester tester) async {
    final HoronSonnerController controller = HoronSonnerController();
    addTearDown(controller.dispose);

    await tester.pumpWidget(harness(controller));
    controller.show(
      const HoronSonnerToastData(
        title: '올리는 중',
        state: HoronSonnerToastState.loading,
        duration: Duration(milliseconds: 200),
      ),
    );
    await tester.pump();

    await tester.pump(const Duration(seconds: 2));

    expect(find.text('올리는 중'), findsOneWidget, reason: '로딩 카드는 promise가 끝날 때까지 남아야 합니다');
    expect(controller.toasts, hasLength(1));
  });

  testWidgets('sonner: a resolved card auto-dismisses after its duration', (WidgetTester tester) async {
    final HoronSonnerController controller = HoronSonnerController();
    addTearDown(controller.dispose);

    await tester.pumpWidget(harness(controller));
    controller.show(const HoronSonnerToastData(title: '곧 사라집니다', duration: Duration(milliseconds: 500)));
    await tester.pump();
    expect(find.text('곧 사라집니다'), findsOneWidget);

    await tester.pump(const Duration(milliseconds: 600));

    expect(find.text('곧 사라집니다'), findsNothing);
    expect(controller.toasts, isEmpty);
  });

  testWidgets('sonner: a swipe dismisses the card', (WidgetTester tester) async {
    final HoronSonnerController controller = HoronSonnerController();
    addTearDown(controller.dispose);

    await tester.pumpWidget(harness(controller));
    controller.show(const HoronSonnerToastData(title: '밀어서 닫기', duration: Duration(seconds: 30)));
    await tester.pump();
    expect(find.text('밀어서 닫기'), findsOneWidget);

    // 임계 거리(45)보다 훨씬 크게 밉니다.
    final TestGesture gesture = await tester.startGesture(tester.getCenter(find.byType(HoronSonnerToast)));
    await tester.pump(const Duration(milliseconds: 20));
    await gesture.moveBy(const Offset(-200, 0), timeStamp: const Duration(milliseconds: 300));
    await tester.pump();
    await gesture.up();
    await tester.pump();

    expect(find.text('밀어서 닫기'), findsNothing, reason: '스와이프했는데 카드가 남아 있습니다');
    expect(controller.toasts, isEmpty);
  });

  testWidgets('sonner: a short slow drag puts the card back', (WidgetTester tester) async {
    final HoronSonnerController controller = HoronSonnerController();
    addTearDown(controller.dispose);

    await tester.pumpWidget(harness(controller));
    controller.show(const HoronSonnerToastData(title: '그대로', duration: Duration(seconds: 30)));
    await tester.pump();

    // 20px를 500ms에 걸쳐 밀면 거리(45 미만)도 속도(400px/s 미만)도 임계값 아래입니다.
    final TestGesture gesture = await tester.startGesture(tester.getCenter(find.byType(HoronSonnerToast)));
    await tester.pump(const Duration(milliseconds: 20));
    await gesture.moveBy(const Offset(-20, 0), timeStamp: const Duration(milliseconds: 520));
    await tester.pump();
    await gesture.up();
    await tester.pump(const Duration(milliseconds: HoronDuration.normal));

    expect(find.text('그대로'), findsOneWidget, reason: '짧은 스와이프로 카드가 닫혔습니다');
    expect(controller.toasts, hasLength(1));
  });

  testWidgets('sonner: the cards overlap with a shrinking scale', (WidgetTester tester) async {
    final HoronSonnerController controller = HoronSonnerController();
    addTearDown(controller.dispose);

    await tester.pumpWidget(harness(controller));
    controller.show(const HoronSonnerToastData(title: '첫째', duration: Duration(seconds: 30)));
    controller.show(const HoronSonnerToastData(title: '둘째', duration: Duration(seconds: 30)));
    controller.show(const HoronSonnerToastData(title: '셋째', duration: Duration(seconds: 30)));
    await tester.pump();

    expect(find.byType(HoronSonnerToast), findsNWidgets(3));

    // 아래 모서리 정렬이므로 뒤 카드는 위로 비켜나고, 폭이 작아집니다.
    final double newestTop = tester.getRect(find.byKey(HoronSonnerToaster.cardKeyFor(controller.toasts[2].id))).top;
    final double secondTop = tester.getRect(find.byKey(HoronSonnerToaster.cardKeyFor(controller.toasts[1].id))).top;
    final double oldestTop = tester.getRect(find.byKey(HoronSonnerToaster.cardKeyFor(controller.toasts[0].id))).top;
    expect(secondTop, lessThan(newestTop), reason: '둘째 카드가 첫째보다 위로 비켜나야 합니다');
    expect(oldestTop, lessThan(secondTop), reason: '셋째 카드가 둘째보다 더 위로 비켜나야 합니다');

    final double newestWidth = tester.getRect(find.byKey(HoronSonnerToaster.cardKeyFor(controller.toasts[2].id))).width;
    final double secondWidth = tester.getRect(find.byKey(HoronSonnerToaster.cardKeyFor(controller.toasts[1].id))).width;
    expect(secondWidth, lessThan(newestWidth), reason: '뒤 카드가 5%만큼 작아야 합니다');
  });

  testWidgets('sonner: the default corner is the bottom right', (WidgetTester tester) async {
    final HoronSonnerController controller = HoronSonnerController();
    addTearDown(controller.dispose);

    await tester.pumpWidget(harness(controller));
    controller.show(const HoronSonnerToastData(title: '오른쪽 아래', duration: Duration(seconds: 30)));
    await tester.pump();

    final Rect card = tester.getRect(find.byType(HoronSonnerToast));
    final Size screen = tester.view.physicalSize / tester.view.devicePixelRatio;
    expect(card.right, closeTo(screen.width - HoronSpace.s8, 1.0), reason: '오른쪽에서 32 떨어져야 합니다');
    expect(card.bottom, closeTo(screen.height - HoronSpace.s8, 1.0), reason: '아래에서 32 떨어져야 합니다');
  });

  testWidgets('sonner: the top left corner flips the stack', (WidgetTester tester) async {
    final HoronSonnerController controller = HoronSonnerController();
    addTearDown(controller.dispose);

    await tester.pumpWidget(harness(controller, position: HoronSonnerPosition.topLeft));
    controller.show(const HoronSonnerToastData(title: '왼쪽 위', duration: Duration(seconds: 30)));
    await tester.pump();

    final Rect card = tester.getRect(find.byType(HoronSonnerToast));
    expect(card.left, closeTo(HoronSpace.s8, 1.0), reason: '왼쪽에서 32 떨어져야 합니다');
    expect(card.top, closeTo(HoronSpace.s8, 1.0), reason: '위에서 32 떨어져야 합니다');
  });

  testWidgets('sonner: the close button dismisses the card', (WidgetTester tester) async {
    final HoronSonnerController controller = HoronSonnerController();
    addTearDown(controller.dispose);

    await tester.pumpWidget(harness(controller));
    controller.show(const HoronSonnerToastData(title: '닫아 보세요', duration: Duration(seconds: 30)));
    await tester.pump();

    await tester.tap(find.byKey(HoronSonnerToast.closeKey));
    await tester.pump();

    expect(find.text('닫아 보세요'), findsNothing);
    expect(controller.toasts, isEmpty);
  });

  testWidgets('sonner: both brightnesses render the card', (WidgetTester tester) async {
    for (final Brightness brightness in Brightness.values) {
      final HoronSonnerController controller = HoronSonnerController();
      addTearDown(controller.dispose);

      await tester.pumpWidget(harness(controller, brightness: brightness, appKey: ValueKey<Brightness>(brightness)));
      controller.show(
        HoronSonnerToastData(
          title: '밝기 ${brightness.name}',
          state: HoronSonnerToastState.success,
          duration: const Duration(seconds: 30),
        ),
      );
      await tester.pump();

      expect(tester.takeException(), isNull, reason: brightness.name);
      final BuildContext context = tester.element(find.byType(HoronSonnerToast));
      expect(Theme.of(context).brightness, brightness, reason: brightness.name);
      expect(find.text('밝기 ${brightness.name}'), findsOneWidget, reason: brightness.name);
      expect(find.byKey(HoronSonnerToast.successKey), findsOneWidget, reason: brightness.name);
    }
  });

  testWidgets('sonner: the stack is capped at three cards', (WidgetTester tester) async {
    final HoronSonnerController controller = HoronSonnerController();
    addTearDown(controller.dispose);

    await tester.pumpWidget(harness(controller));
    for (int index = 0; index < 5; index++) {
      controller.show(HoronSonnerToastData(title: '카드 $index', duration: const Duration(seconds: 30)));
    }
    await tester.pump();

    expect(controller.toasts, hasLength(3));
    expect(find.byType(HoronSonnerToast), findsNWidgets(3));
    expect(find.text('카드 0'), findsNothing, reason: '가장 오래된 카드가 스택에서 빠져야 합니다');
    expect(find.text('카드 4'), findsOneWidget);
  });
}
