import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:horon_ui/horon_ui.dart';

/// 스켈레톤의 시머(2000ms 주기·0.1 바닥 불투명도)와 정지 조건, 드러내기를 확인합니다.
///
/// 동작 정본은 `mobile/lib/src/widgets/skeleton.dart`·`skeleton_bar.dart`·
/// `skeleton_shimmer.dart`입니다. 이 테스트는 그 값이 Horon 토큰 위에서 그대로
/// 재현되는지 봅니다.
void main() {
  Widget harness(
    Widget child, {
    Brightness brightness = Brightness.light,
    bool disableAnimations = false,
    Key? appKey,
  }) => MaterialApp(
    key: appKey,
    theme: horonTheme(brightness),
    builder: (BuildContext context, Widget? app) => MediaQuery(
      data: MediaQuery.of(context).copyWith(disableAnimations: disableAnimations),
      child: app!,
    ),
    home: Scaffold(body: Center(child: child)),
  );

  double pulseOpacity(WidgetTester tester) =>
      tester.widget<Opacity>(find.byKey(HoronSkeletonShimmer.opacityKey)).opacity;

  BoxDecoration fillDecoration(WidgetTester tester) =>
      tester.widget<DecoratedBox>(find.byKey(HoronSkeletonBar.fillKey)).decoration as BoxDecoration;

  testWidgets('skeleton: the bar is a rounded placeholder at 0.1 base opacity', (WidgetTester tester) async {
    await tester.pumpWidget(harness(const HoronSkeleton(width: 160, height: 12)));

    expect(tester.getSize(find.byKey(HoronSkeletonBar.fillKey)), const Size(160, 12));
    final BoxDecoration decoration = fillDecoration(tester);
    final List<Color> colors = decoration.gradient!.colors;
    expect(colors.first.a, closeTo(0.1, 0.001));
    expect(colors[2].a, closeTo(0.5, 0.001));
    expect(decoration.borderRadius, BorderRadius.circular(HoronRadius.sm));
  });

  testWidgets('skeleton: the opacity changes after 1000ms', (WidgetTester tester) async {
    await tester.pumpWidget(harness(const HoronSkeleton(width: 160, height: 12)));
    final double start = pulseOpacity(tester);

    await tester.pump(const Duration(milliseconds: 1000));
    expect(pulseOpacity(tester), isNot(closeTo(start, 0.001)), reason: '1000ms 뒤에도 불투명도가 같습니다');
  });

  testWidgets('skeleton: disableAnimations freezes the opacity and the shimmer', (WidgetTester tester) async {
    await tester.pumpWidget(harness(const HoronSkeleton(width: 160, height: 12), disableAnimations: true));
    final double start = pulseOpacity(tester);

    await tester.pump(const Duration(milliseconds: 1000));
    expect(pulseOpacity(tester), closeTo(start, 0.001), reason: '애니메이션을 끄면 불투명도가 변하면 안 됩니다');

    final BoxDecoration decoration = fillDecoration(tester);
    expect(decoration.gradient, isNull, reason: '정지 상태는 시머 그라디언트 대신 단색입니다');
    expect(decoration.color!.a, closeTo(0.1, 0.001));
  });

  testWidgets('skeleton: the shimmer band travels across the bar', (WidgetTester tester) async {
    await tester.pumpWidget(harness(const HoronSkeleton(width: 160, height: 12)));
    final Alignment first = (fillDecoration(tester).gradient! as LinearGradient).begin as Alignment;

    await tester.pump(const Duration(milliseconds: 500));
    final Alignment later = (fillDecoration(tester).gradient! as LinearGradient).begin as Alignment;

    expect(later.x, isNot(closeTo(first.x, 0.01)), reason: '하이라이트 띠가 움직이지 않았습니다');
  });

  testWidgets('skeleton: a custom radius replaces the default', (WidgetTester tester) async {
    await tester.pumpWidget(
      harness(
        const HoronSkeleton(width: 40, height: 40, borderRadius: BorderRadius.all(Radius.circular(HoronRadius.full))),
      ),
    );

    expect(fillDecoration(tester).borderRadius, BorderRadius.circular(HoronRadius.full));
  });

  testWidgets('skeleton: a child group shares one shimmer controller', (WidgetTester tester) async {
    await tester.pumpWidget(
      harness(
        const HoronSkeleton(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: <Widget>[
              HoronSkeletonBar(width: 180, height: 12),
              SizedBox(height: 8),
              HoronSkeletonBar(width: 120, height: 12),
            ],
          ),
        ),
      ),
    );

    expect(find.byType(HoronSkeletonBar), findsNWidgets(2));
    expect(find.byKey(HoronSkeletonShimmer.opacityKey), findsOneWidget);
  });

  testWidgets('skeleton: the pulse floor is 0.5, not 0', (WidgetTester tester) async {
    await tester.pumpWidget(harness(const HoronSkeleton(width: 160, height: 12)));

    double lowest = 1;
    for (int step = 0; step < 20; step++) {
      await tester.pump(const Duration(milliseconds: 100));
      final double current = pulseOpacity(tester);
      lowest = current < lowest ? current : lowest;
    }
    expect(lowest, greaterThanOrEqualTo(0.5 - 0.001));
    expect(lowest, lessThan(0.6));
  });

  testWidgets('skeleton: the reveal cross-fades placeholder into content', (WidgetTester tester) async {
    Widget reveal({required bool loading}) => harness(
      SizedBox(
        width: 200,
        height: 40,
        child: HoronSkeletonReveal(
          loading: loading,
          skeleton: const HoronSkeleton(width: 200, height: 40),
          content: const Text('내용'),
        ),
      ),
    );

    await tester.pumpWidget(reveal(loading: true));
    expect(tester.widget<Opacity>(find.byKey(HoronSkeletonReveal.contentKey)).opacity, 0);
    expect(tester.widget<Opacity>(find.byKey(HoronSkeletonReveal.placeholderKey)).opacity, 1);

    await tester.pumpWidget(reveal(loading: false));
    await tester.pump();
    await tester.pump(const Duration(milliseconds: 200));

    final double mid = tester.widget<Opacity>(find.byKey(HoronSkeletonReveal.contentKey)).opacity;
    expect(mid, greaterThan(0));
    expect(mid, lessThan(1));

    await tester.pump(const Duration(milliseconds: 300));
    expect(tester.widget<Opacity>(find.byKey(HoronSkeletonReveal.contentKey)).opacity, 1);
    expect(tester.widget<Opacity>(find.byKey(HoronSkeletonReveal.placeholderKey)).opacity, 0);
  });

  testWidgets('skeleton: both brightnesses render the shimmer over their own primary', (WidgetTester tester) async {
    for (final Brightness brightness in Brightness.values) {
      await tester.pumpWidget(
        harness(
          const HoronSkeleton(width: 160, height: 12),
          brightness: brightness,
          appKey: ValueKey<Brightness>(brightness),
        ),
      );
      // 시머는 끝없이 도므로 pumpAndSettle을 쓸 수 없습니다. 새 키로 트리를 새로
      // 만들면 테마 보간 없이 그 밝기의 색으로 바로 그립니다.
      await tester.pump();
      expect(tester.takeException(), isNull, reason: brightness.name);

      final BuildContext context = tester.element(find.byKey(HoronSkeletonBar.fillKey));
      final Color expected = Theme.of(context).colorScheme.primary;
      expect(Theme.of(context).brightness, brightness, reason: brightness.name);
      expect(fillDecoration(tester).gradient!.colors.first.r, closeTo(expected.r, 0.01), reason: brightness.name);
    }
  });

  testWidgets('skeleton: removing the widget mid-shimmer does not leak the controller', (WidgetTester tester) async {
    await tester.pumpWidget(harness(const HoronSkeleton(width: 10, height: 10)));
    await tester.pump(const Duration(milliseconds: 400));
    await tester.pumpWidget(harness(const SizedBox.shrink()));
    await tester.pump(const Duration(milliseconds: 500));

    expect(tester.takeException(), isNull);
  });
}
