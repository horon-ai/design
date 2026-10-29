import 'dart:ui' as ui;

import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:horon_ui/horon_ui.dart';

/// Flue 배경의 팔레트, 감쇠, 그리고 위젯의 강등·정지 규칙을 검사합니다.
///
/// `flutter test`는 Impeller 없이 돌기 때문에 셰이더는 언제나 로드에 실패합니다.
/// 그래서 여기서 확인하는 것은 셰이더가 그린 그림이 아니라, 셰이더가 없을 때 남는
/// 단색과 색조, 그리고 티커가 언제 도는지입니다.
void main() {
  const Size hostSize = Size(320, 200);

  // 셰이더 프로그램은 위젯 테스트의 가짜 시간 안에서 읽으면 끝나지 않습니다. `setUpAll`은
  // 그 밖에서 돌기 때문에 여기서 한 번 읽어 두고, 위젯 테스트에 넣어 봅니다.
  ui.FragmentProgram? flueProgram;

  setUpAll(() async {
    flueProgram = await horonLoadShaderProgram(horonFlueAsset);
  });

  setUp(() {
    HoronGlassProbe.reset();
    horonShaderProgramCacheClear();
  });

  tearDown(HoronGlassProbe.reset);

  Future<void> pumpFlue(
    WidgetTester tester, {
    FlueConfig config = FlueConfig.sky,
    Color? tint,
    bool animations = true,
    bool tickerMode = true,
  }) async {
    await tester.pumpWidget(
      MaterialApp(
        theme: horonTheme(Brightness.light),
        home: MediaQuery(
          data: MediaQueryData(size: hostSize, disableAnimations: !animations),
          child: TickerMode(
            enabled: tickerMode,
            child: Scaffold(
              body: SizedBox(
                width: hostSize.width,
                height: hostSize.height,
                child: HoronFlueBackground(config: config, tint: tint),
              ),
            ),
          ),
        ),
      ),
    );
    await tester.pump();
  }

  /// 티커를 정리합니다. `flutter test`는 살아 있는 티커를 두고 끝나면 실패합니다.
  Future<void> drain(WidgetTester tester) async {
    await tester.pumpWidget(const SizedBox.shrink());
  }

  group('FlueConfig', () {
    test('mirrors FLUE_SKY field for field', () {
      const FlueConfig sky = FlueConfig.sky;
      expect(sky.bgColor, const Color(0xFFEEF3F8));
      expect(sky.colorA, const Color(0xFFE3ECF6));
      expect(sky.colorB, const Color(0xFFC3D7EA));
      expect(sky.colorC, const Color(0xFF7FA3C6));
      expect(sky.colorD, const Color(0xFF1D3C5E));
      expect(sky.scale, 0.2);
      expect(sky.speed, 0.33);
      expect(sky.flow, 0.04);
      expect(sky.roughness, 0.36);
      expect(sky.lacunarity, 2.55);
      expect(sky.smokeScale, 2.51);
      expect(sky.curl, 0.36);
      expect(sky.curlScale, 0.88);
      expect(sky.rise, 0.03);
      expect(sky.slender, 1.55);
      expect(sky.width, 1.55);
      expect(sky.spread, 1.11);
      expect(sky.lean, 1.25);
      expect(sky.density, 2.15);
      expect(sky.contrast, 1.7);
      expect(sky.midpoint, 0.76);
      expect(sky.glow, 0.53);
      expect(sky.sink, 0.2);
      expect(sky.grain, 0.02);
      expect(sky.grainAnim, 0);
      expect(sky.dither, 1.1);
      expect(sky.vignette, 0.26);
      expect(sky.cursor, 1);
      expect(sky.pointerRadius, 0.84);
      expect(sky.draft, 1.85);
      expect(sky.pointerStrength, 0.16);
      expect(sky.parallax, 0.028);
      expect(sky.maxDpr, 1);
    });
  });

  group('damping loop', () {
    test('aim normalizes like the JS aim()', () {
      final FlueDamping damping = FlueDamping();
      // 화면 한가운데 → (0, 0).
      damping.aim(localPosition: const Offset(160, 100), size: hostSize);
      expect(damping.targetX, closeTo(0, 1e-12));
      expect(damping.targetY, closeTo(0, 1e-12));

      // 오른쪽 위 모서리 → (0.5 * 320/200, 0.5) = (0.8, 0.5).
      damping.aim(localPosition: const Offset(320, 0), size: hostSize);
      expect(damping.targetX, closeTo(0.8, 1e-12));
      expect(damping.targetY, closeTo(0.5, 1e-12));

      // 왼쪽 아래 모서리 → (-0.8, -0.5).
      damping.aim(localPosition: const Offset(0, 200), size: hostSize);
      expect(damping.targetX, closeTo(-0.8, 1e-12));
      expect(damping.targetY, closeTo(-0.5, 1e-12));
    });

    test('aim ignores a host with no area', () {
      final FlueDamping damping = FlueDamping();
      damping.aim(localPosition: const Offset(10, 10), size: Size.zero);
      expect(damping.targetX, 0);
      expect(damping.targetY, 0);
    });

    test('the first frame advances the clock by the clamped delta', () {
      final FlueDamping damping = FlueDamping()..advance(16.7);
      expect(damping.time, closeTo(0.0167, 1e-9));

      // 4.167ms보다 짧은 간격은 4.167로 올립니다.
      final FlueDamping fast = FlueDamping()..advance(1);
      expect(fast.time, closeTo(0.004167, 1e-9));

      // 50ms보다 긴 간격은 50으로 자릅니다.
      final FlueDamping slow = FlueDamping()..advance(500);
      expect(slow.time, closeTo(0.05, 1e-9));
    });

    test('lead follows the target with kLead = 0.105 * step', () {
      final FlueDamping damping = FlueDamping()
        ..aim(localPosition: const Offset(320, 0), size: hostSize)
        ..advance(16.7);
      // step = 16.7 * 0.06 = 1.002, kLead = 0.105 * 1.002.
      expect(damping.leadX, closeTo(0.8 * 0.10521, 1e-9));
      expect(damping.leadY, closeTo(0.5 * 0.10521, 1e-9));
      // 본체는 lead를 더 느리게 따라갑니다.
      expect(damping.x, closeTo(damping.leadX * 0.043086, 1e-9));
    });

    test('a dropped frame pins step at 2.2', () {
      final FlueDamping damping = FlueDamping()
        ..aim(localPosition: const Offset(320, 0), size: hostSize)
        ..advance(40);
      // ms 40 > 36.7이므로 step은 2.2, kLead = 0.105 * 2.2 = 0.231.
      expect(damping.leadX, closeTo(0.8 * 0.231, 1e-9));
    });

    test('no pointer keeps the JS initial state', () {
      final FlueDamping damping = FlueDamping();
      damping.advance(16.7);
      final FlueFrame frame = damping.toFrame();
      expect(frame.mouse, Offset.zero);
      expect(frame.mouseVelocity, Offset.zero);
      expect(frame.mouseWake, Offset.zero);
    });

    test('the three layers converge on the target', () {
      final FlueDamping damping = FlueDamping()..aim(localPosition: const Offset(320, 0), size: hostSize);
      for (int i = 0; i < 400; i++) {
        damping.advance(16.7);
      }
      expect(damping.x, closeTo(0.8, 1e-3));
      expect(damping.y, closeTo(0.5, 1e-3));
      expect(damping.wakeX, closeTo(0.8, 1e-2));
    });
  });

  group('HoronFlueBackground', () {
    testWidgets('without a shader it paints the flat bgColor and the tint', (WidgetTester tester) async {
      await pumpFlue(tester);

      final HoronThemeData horon = HoronTheme.of(tester.element(find.byType(HoronFlueBackground)));
      expect(
        find.byWidgetPredicate((Widget widget) => widget is ColoredBox && widget.color == FlueConfig.sky.bgColor),
        findsOneWidget,
      );
      expect(
        find.byWidgetPredicate((Widget widget) => widget is ColoredBox && widget.color == horon.colors.glassRegular),
        findsOneWidget,
      );
      // 셰이더 캔버스는 없습니다(테스트 환경은 Impeller가 없습니다).
      expect(find.byKey(horonFlueCanvasKey), findsNothing);
      expect(tester.takeException(), isNull);

      await drain(tester);
    });

    testWidgets('a tint override replaces the glass-regular overlay', (WidgetTester tester) async {
      const Color tint = Color(0x33FF0000);
      await pumpFlue(tester, tint: tint);
      expect(find.byWidgetPredicate((Widget widget) => widget is ColoredBox && widget.color == tint), findsOneWidget);
      await drain(tester);
    });

    testWidgets('the ticker runs while the animation is allowed', (WidgetTester tester) async {
      await pumpFlue(tester);
      final HoronFlueBackgroundState state = tester.state<HoronFlueBackgroundState>(find.byType(HoronFlueBackground));
      expect(state.ticker.isActive, isTrue);
      expect(state.frame.time, greaterThan(0));
      await drain(tester);
    });

    testWidgets('reduced motion draws a single still frame at clock 12', (WidgetTester tester) async {
      await pumpFlue(tester, animations: false);
      final HoronFlueBackgroundState state = tester.state<HoronFlueBackgroundState>(find.byType(HoronFlueBackground));
      expect(state.ticker.isActive, isFalse);
      expect(state.frame.time, 12);
      expect(tester.takeException(), isNull);
      await drain(tester);
    });

    testWidgets('TickerMode off stops the ticker', (WidgetTester tester) async {
      await pumpFlue(tester, tickerMode: false);
      final HoronFlueBackgroundState state = tester.state<HoronFlueBackgroundState>(find.byType(HoronFlueBackground));
      expect(state.ticker.isActive, isFalse);
      await drain(tester);
    });

    testWidgets('a paused app stops the ticker and resuming starts it again', (WidgetTester tester) async {
      await pumpFlue(tester);
      final HoronFlueBackgroundState state = tester.state<HoronFlueBackgroundState>(find.byType(HoronFlueBackground));
      expect(state.ticker.isActive, isTrue);

      tester.binding.handleAppLifecycleStateChanged(AppLifecycleState.paused);
      await tester.pump();
      expect(state.ticker.isActive, isFalse);

      tester.binding.handleAppLifecycleStateChanged(AppLifecycleState.resumed);
      await tester.pump();
      expect(state.ticker.isActive, isTrue);

      await drain(tester);
    });

    testWidgets('pointer steering aims the damping at the normalized position', (WidgetTester tester) async {
      await pumpFlue(tester);
      final HoronFlueBackgroundState state = tester.state<HoronFlueBackgroundState>(find.byType(HoronFlueBackground));
      final Rect rect = tester.getRect(find.byType(HoronFlueBackground));

      // 한가운데에서 오른쪽 80px, 아래 40px으로 끕니다.
      final TestGesture gesture = await tester.startGesture(rect.center);
      await gesture.moveTo(rect.center + const Offset(80, 40));
      await gesture.up();
      await tester.pump();

      // aim(): tx = (px / w - 0.5) * (w / h), ty = 0.5 - py / h.
      expect(state.damping.targetX, closeTo(0.4, 1e-6));
      expect(state.damping.targetY, closeTo(-0.2, 1e-6));
      await drain(tester);
    });

    testWidgets('a loaded shader paints the flue canvas and sets its uniforms', (WidgetTester tester) async {
      if (flueProgram == null) {
        markTestSkipped('이 톨체인의 flutter test는 컴파일된 셰이더 자산을 싣지 않습니다.');
        return;
      }
      // 읽어 둔 프로그램을 위젯에 넣고 한 프레임 그립니다. 픽셀은 볼 수 없지만,
      // 캔버스가 붙고 유니폼이 채워진 채로 예외 없이 그려지는지는 여기서 확인합니다.
      HoronGlassProbe.loadProgram = (String asset) async => flueProgram;

      await pumpFlue(tester);
      await tester.pump(const Duration(milliseconds: 16));

      expect(find.byKey(horonFlueCanvasKey), findsOneWidget);
      expect(tester.takeException(), isNull);
      await drain(tester);
    });
  });
}
