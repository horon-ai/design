import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:horon_ui/horon_ui.dart';

/// 진행 막대의 두 상태(확정·미결정)와 라벨 줄을 확인합니다.
///
/// React `progress.tsx`의 다섯 조각을 옮겼으므로, 확정 상태는 인디케이터가 트랙의
/// 값 비율만큼 차지하고, 값이 null이면 미결정 인디케이터로 움직이는지 봅니다.
void main() {
  Widget harness(
    Widget child, {
    Brightness brightness = Brightness.light,
    bool disableAnimations = false,
    Key? appKey,
  }) => MaterialApp(
    key: appKey,
    theme: horonTheme(brightness),
    // MaterialApp은 뷰의 MediaQuery로 자기 MediaQuery를 만듭니다. 접근성 설정은
    // 그 아래에서 덮어써야 위젯이 읽습니다.
    builder: (BuildContext context, Widget? app) => MediaQuery(
      data: MediaQuery.of(context).copyWith(disableAnimations: disableAnimations),
      child: app!,
    ),
    home: Scaffold(
      body: Center(child: SizedBox(width: 240, child: child)),
    ),
  );

  Finder indicator() => find.byKey(HoronProgress.indicatorKey);

  /// 인디케이터 안에서 실제로 칠해지는 막대입니다. 확정이면
  /// `FractionallySizedBox` 안에, 미결정이면 `Positioned` 안에 있습니다.
  Finder bar() => find.descendant(of: indicator(), matching: find.byType(DecoratedBox)).first;

  Color barColor(WidgetTester tester) => (tester.widget<DecoratedBox>(bar()).decoration as BoxDecoration).color!;

  testWidgets('progress: a null value renders the indeterminate indicator', (WidgetTester tester) async {
    await tester.pumpWidget(harness(const HoronProgress()));

    expect(find.byType(HoronProgress), findsOneWidget);
    expect(indicator(), findsOneWidget);
    // 확정 상태만 폭을 비율로 고정합니다. 미결정은 위치가 애니메이션으로 움직입니다.
    expect(find.descendant(of: indicator(), matching: find.byType(FractionallySizedBox)), findsNothing);

    final double first = tester.getRect(bar()).left;
    await tester.pump(const Duration(milliseconds: 400));
    expect(tester.getRect(bar()).left, isNot(closeTo(first, 0.5)), reason: '미결정 인디케이터가 움직이지 않았습니다');
  });

  testWidgets('progress: a value fills that fraction of the track', (WidgetTester tester) async {
    await tester.pumpWidget(harness(const HoronProgress(value: 0.25)));

    final double trackWidth = tester.getSize(find.byKey(HoronProgress.trackKey)).width;
    expect(tester.getSize(bar()).width, closeTo(trackWidth * 0.25, 1.0));
    expect(find.descendant(of: indicator(), matching: find.byType(FractionallySizedBox)), findsOneWidget);
  });

  testWidgets('progress: the value is clamped to the track', (WidgetTester tester) async {
    await tester.pumpWidget(harness(const HoronProgress(value: 4)));

    final double trackWidth = tester.getSize(find.byKey(HoronProgress.trackKey)).width;
    expect(tester.getSize(bar()).width, closeTo(trackWidth, 1.0));
  });

  testWidgets('progress: label and percentage share the row above the track', (WidgetTester tester) async {
    await tester.pumpWidget(harness(const HoronProgress(value: 0.42, label: '업로드', showValue: true)));

    expect(find.text('업로드'), findsOneWidget);
    expect(find.text('42%'), findsOneWidget);
    expect(
      tester.getRect(find.text('업로드')).bottom,
      lessThanOrEqualTo(tester.getRect(find.byKey(HoronProgress.trackKey)).top),
    );
  });

  testWidgets('progress: an explicit value label wins over the percentage', (WidgetTester tester) async {
    await tester.pumpWidget(harness(const HoronProgress(value: 0.5, showValue: true, valueLabel: '3 / 6')));

    expect(find.text('3 / 6'), findsOneWidget);
    expect(find.text('50%'), findsNothing);
  });

  testWidgets('progress: the track is an 8px pill on the muted surface', (WidgetTester tester) async {
    await tester.pumpWidget(harness(const HoronProgress(value: 0.5)));

    expect(tester.getSize(find.byKey(HoronProgress.trackKey)).height, 8);
    final DecoratedBox box = tester.widget<DecoratedBox>(
      find.descendant(of: find.byKey(HoronProgress.trackKey), matching: find.byType(DecoratedBox)).first,
    );
    final BoxDecoration decoration = box.decoration as BoxDecoration;
    expect(decoration.color, HoronLightColors.muted);
    expect(decoration.borderRadius, BorderRadius.circular(HoronRadiusRole.pill));
  });

  testWidgets('progress: reduced motion parks the indeterminate indicator', (WidgetTester tester) async {
    await tester.pumpWidget(harness(const HoronProgress(), disableAnimations: true));

    final double first = tester.getRect(bar()).left;
    await tester.pump(const Duration(milliseconds: 500));
    expect(tester.getRect(bar()).left, closeTo(first, 0.5));
  });

  testWidgets('progress: both brightnesses render their own primary fill', (WidgetTester tester) async {
    for (final Brightness brightness in Brightness.values) {
      await tester.pumpWidget(
        harness(const HoronProgress(value: 0.6), brightness: brightness, appKey: ValueKey<Brightness>(brightness)),
      );
      // 테마가 바뀌면 MaterialApp이 색을 보간합니다. 보간이 끝난 뒤에 잽니다.
      await tester.pumpAndSettle();
      expect(tester.takeException(), isNull, reason: brightness.name);
      expect(
        barColor(tester),
        brightness == Brightness.dark ? HoronDarkColors.primary : HoronLightColors.primary,
        reason: brightness.name,
      );
    }
  });
}
