import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:horon_ui/horon_ui.dart';

/// `HoronFlueBackground`의 공개 표면을 검사합니다.
///
/// 셰이더는 `flutter test`에서 로드되지 않으므로(자산 로딩이 위젯 테스트의 가짜 시간
/// 안에서 끝나지 않습니다) 여기서 보는 그림은 단색 대체 경로입니다. 그래도 배경의 계약
/// — 모션 축소 시 한 프레임, 셰이더가 없을 때의 바탕색과 색조, 포인터 정규화 — 은
/// 전부 이 경로에서 확인할 수 있습니다.
void main() {
  const Size hostSize = Size(320, 200);

  setUp(() {
    HoronShaderProbe.reset();
    horonShaderProgramCacheClear();
  });

  tearDown(HoronShaderProbe.reset);

  Future<void> pumpFlue(
    WidgetTester tester, {
    HoronFlueConfig config = HoronFlueConfig.sky,
    Color? tint,
    bool animations = true,
  }) async {
    await tester.pumpWidget(
      MaterialApp(
        theme: horonTheme(Brightness.light),
        home: MediaQuery(
          data: MediaQueryData(size: hostSize, disableAnimations: !animations),
          child: Scaffold(
            body: SizedBox(
              width: hostSize.width,
              height: hostSize.height,
              child: HoronFlueBackground(config: config, tint: tint),
            ),
          ),
        ),
      ),
    );
    await tester.pump();
  }

  /// 살아 있는 티커를 두고 테스트를 끝내면 실패하므로 트리를 비웁니다.
  Future<void> drain(WidgetTester tester) async {
    await tester.pumpWidget(const SizedBox.shrink());
  }

  testWidgets('disabled animations render one still frame at clock 12', (WidgetTester tester) async {
    await pumpFlue(tester, animations: false);

    final HoronFlueBackgroundState state = tester.state<HoronFlueBackgroundState>(find.byType(HoronFlueBackground));
    expect(state.ticker.isActive, isFalse);
    expect(state.frame.time, 12);
    // 정지 프레임은 여전히 바탕색을 칠합니다. 빈 화면이 아닙니다.
    expect(
      find.byWidgetPredicate((Widget widget) => widget is ColoredBox && widget.color == HoronFlueConfig.sky.bgColor),
      findsOneWidget,
    );
    expect(tester.takeException(), isNull);

    await drain(tester);
  });

  testWidgets('without a shader the bgColor and the glass-regular tint are painted', (WidgetTester tester) async {
    await pumpFlue(tester);

    final HoronThemeData horon = HoronTheme.of(tester.element(find.byType(HoronFlueBackground)));
    expect(
      find.byWidgetPredicate((Widget widget) => widget is ColoredBox && widget.color == HoronFlueConfig.sky.bgColor),
      findsOneWidget,
    );
    expect(
      find.byWidgetPredicate((Widget widget) => widget is ColoredBox && widget.color == horon.colors.glassRegular),
      findsOneWidget,
    );
    // 셰이더 캔버스는 위젯 테스트 환경에서 붙지 않습니다.
    expect(find.byKey(horonFlueCanvasKey), findsNothing);

    await drain(tester);
  });

  testWidgets('a tint override replaces the default glass tint', (WidgetTester tester) async {
    const Color tint = Color(0x33FF0000);
    await pumpFlue(tester, tint: tint);
    expect(find.byWidgetPredicate((Widget widget) => widget is ColoredBox && widget.color == tint), findsOneWidget);
    await drain(tester);
  });

  testWidgets('the ticker advances the clock and the frame while animations are allowed', (WidgetTester tester) async {
    await pumpFlue(tester);
    final HoronFlueBackgroundState state = tester.state<HoronFlueBackgroundState>(find.byType(HoronFlueBackground));
    expect(state.ticker.isActive, isTrue);

    await tester.pump(const Duration(milliseconds: 32));
    expect(state.frame.time, greaterThan(0));

    await drain(tester);
  });

  testWidgets('pointer steering aims at the normalized position like aim()', (WidgetTester tester) async {
    await pumpFlue(tester);
    final HoronFlueBackgroundState state = tester.state<HoronFlueBackgroundState>(find.byType(HoronFlueBackground));
    final Rect rect = tester.getRect(find.byType(HoronFlueBackground));

    final TestGesture gesture = await tester.startGesture(rect.center);
    await gesture.moveTo(rect.center + const Offset(80, 40));
    await gesture.up();
    await tester.pump();

    // tx = (px / w - 0.5) * (w / h), ty = 0.5 - py / h.
    expect(state.damping.targetX, closeTo(0.4, 1e-6));
    expect(state.damping.targetY, closeTo(-0.2, 1e-6));

    await drain(tester);
  });
}
