import 'dart:math' as math;
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
    HoronShaderProbe.reset();
    horonShaderProgramCacheClear();
  });

  tearDown(HoronShaderProbe.reset);

  Future<void> pumpFlue(
    WidgetTester tester, {
    HoronFlueConfig? config,
    HoronFlueVariant variant = HoronFlueVariant.defaultValue,
    Color? tint,
    bool animations = true,
    bool tickerMode = true,
    Brightness brightness = Brightness.light,
  }) async {
    await tester.pumpWidget(
      MaterialApp(
        theme: horonTheme(brightness),
        home: MediaQuery(
          data: MediaQueryData(size: hostSize, disableAnimations: !animations),
          child: TickerMode(
            enabled: tickerMode,
            child: Scaffold(
              body: SizedBox(
                width: hostSize.width,
                height: hostSize.height,
                child: HoronFlueBackground(variant: variant, config: config, tint: tint),
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

  group('HoronFlueConfig', () {
    test('mirrors FLUE_NIGHT field for field', () {
      const HoronFlueConfig night = HoronFlueConfig.night;
      expect(night.bgColor, const Color(0xFF050608));
      expect(night.colorA, const Color(0xFF07090D));
      expect(night.colorB, const Color(0xFF0C1A2C));
      expect(night.colorC, const Color(0xFF1F4A78));
      expect(night.colorD, const Color(0xFF4F8FD0));
      expect(night.glow, 0.35);
      // 나머지 필드는 FLUE_SKY와 같습니다.
      const HoronFlueConfig sky = HoronFlueConfig.sky;
      expect(night.speed, sky.speed);
      expect(night.smokeScale, sky.smokeScale);
      expect(night.midpoint, sky.midpoint);
      expect(night.vignette, sky.vignette);
    });

    test('mirrors FLUE_SKY field for field', () {
      const HoronFlueConfig sky = HoronFlueConfig.sky;
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
      expect(sky.cursor, 0);
      expect(sky.pointerRadius, 0.84);
      expect(sky.draft, 1.85);
      expect(sky.pointerStrength, 0.16);
      expect(sky.parallax, 0.028);
      expect(sky.maxDpr, 1);
    });

    test('mirrors FLUE_NIGHT field for field', () {
      const HoronFlueConfig night = HoronFlueConfig.night;
      expect(night.bgColor, const Color(0xFF050608));
      expect(night.colorA, const Color(0xFF07090D));
      expect(night.colorB, const Color(0xFF0C1A2C));
      expect(night.colorC, const Color(0xFF1F4A78));
      expect(night.colorD, const Color(0xFF4F8FD0));
      expect(night.glow, 0.35);
      // 나머지 값은 하늘 팔레트와 같습니다.
      expect(night.speed, HoronFlueConfig.sky.speed);
      expect(night.cursor, 0);
    });

    test('resolve picks the night palette in dark and the sky palette in light', () {
      expect(HoronFlueConfig.resolve(brightness: Brightness.light), HoronFlueConfig.sky);
      expect(HoronFlueConfig.resolve(brightness: Brightness.dark), HoronFlueConfig.night);
    });

    test('resolve applies the sidebar tuning per brightness', () {
      const HoronFlueVariant variant = HoronFlueVariant.sidebar;
      final HoronFlueConfig light = HoronFlueConfig.resolve(brightness: Brightness.light, variant: variant);
      expect(light.speed, 0.22);
      expect(light.smokeScale, 1.9);
      expect(light.density, 1.85);
      expect(light.contrast, 1.45);
      expect(light.midpoint, 0.8);
      expect(light.glow, 0.3);
      expect(light.vignette, 0);

      final HoronFlueConfig dark = HoronFlueConfig.resolve(brightness: Brightness.dark, variant: variant);
      expect(dark.contrast, 1.5);
      expect(dark.glow, 0.22);
      expect(dark.vignette, 0);
      expect(dark.bgColor, const Color(0xFF050608));
    });

    test('resolve applies the auth tuning per brightness', () {
      const HoronFlueVariant variant = HoronFlueVariant.auth;
      final HoronFlueConfig light = HoronFlueConfig.resolve(brightness: Brightness.light, variant: variant);
      expect(light.width, 1.9);
      expect(light.spread, 1.3);
      // dev React `8354345`의 auth 라이트 튜닝입니다. 셰이더 비네트는 검정으로 어두워지므로
      // 라이트는 비네트 없이 옅은 하늘을 지킵니다.
      expect(light.density, 1.85);
      expect(light.midpoint, 0.8);
      expect(light.glow, 0.3);
      expect(light.vignette, 0);

      final HoronFlueConfig dark = HoronFlueConfig.resolve(brightness: Brightness.dark, variant: variant);
      expect(dark.midpoint, 0.76);
      expect(dark.vignette, 0.45);
      expect(dark.glow, 0.45);
    });

    test('a caller config wins over the variant tuning', () {
      const HoronFlueConfig config = HoronFlueConfig(glow: 0.9);
      final HoronFlueConfig resolved = HoronFlueConfig.resolve(
        brightness: Brightness.dark,
        variant: HoronFlueVariant.auth,
        config: config,
      );
      expect(resolved.glow, 0.9);
      expect(resolved.bgColor, HoronFlueConfig.sky.bgColor);
    });
  });

  group('damping loop', () {
    test('aim normalizes like the JS aim()', () {
      final HoronFlueDamping damping = HoronFlueDamping();
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
      final HoronFlueDamping damping = HoronFlueDamping();
      damping.aim(localPosition: const Offset(10, 10), size: Size.zero);
      expect(damping.targetX, 0);
      expect(damping.targetY, 0);
    });

    test('the first frame advances the clock by the clamped delta', () {
      final HoronFlueDamping damping = HoronFlueDamping()..advance(16.7);
      expect(damping.time, closeTo(0.0167, 1e-9));

      // 4.167ms보다 짧은 간격은 4.167로 올립니다.
      final HoronFlueDamping fast = HoronFlueDamping()..advance(1);
      expect(fast.time, closeTo(0.004167, 1e-9));

      // 50ms보다 긴 간격은 50으로 자릅니다.
      final HoronFlueDamping slow = HoronFlueDamping()..advance(500);
      expect(slow.time, closeTo(0.05, 1e-9));
    });

    test('lead follows the target with kLead = 0.105 * step', () {
      final HoronFlueDamping damping = HoronFlueDamping()
        ..aim(localPosition: const Offset(320, 0), size: hostSize)
        ..advance(16.7);
      // step = 16.7 * 0.06 = 1.002, kLead = 0.105 * 1.002.
      expect(damping.leadX, closeTo(0.8 * 0.10521, 1e-9));
      expect(damping.leadY, closeTo(0.5 * 0.10521, 1e-9));
      // 본체는 lead를 더 느리게 따라갑니다.
      expect(damping.x, closeTo(damping.leadX * 0.043086, 1e-9));
    });

    test('a dropped frame pins step at 2.2', () {
      final HoronFlueDamping damping = HoronFlueDamping()
        ..aim(localPosition: const Offset(320, 0), size: hostSize)
        ..advance(40);
      // ms 40 > 36.7이므로 step은 2.2, kLead = 0.105 * 2.2 = 0.231.
      expect(damping.leadX, closeTo(0.8 * 0.231, 1e-9));
    });

    test('no pointer keeps the JS initial state', () {
      final HoronFlueDamping damping = HoronFlueDamping();
      damping.advance(16.7);
      final HoronFlueFrame frame = damping.toFrame();
      expect(frame.mouse, Offset.zero);
      expect(frame.mouseVelocity, Offset.zero);
      expect(frame.mouseWake, Offset.zero);
    });

    test('aimVirtual wanders on two sines and scales with the aspect ratio', () {
      final HoronFlueDamping damping = HoronFlueDamping();
      damping.aimVirtual(hostSize);
      expect(damping.targetX, closeTo(1.6 * 0.12 * math.sin(0.8), 1e-12));
      expect(damping.targetY, closeTo(0.22 * math.sin(1.3), 1e-12));

      final HoronFlueDamping later = HoronFlueDamping()..advance(1000);
      later.aimVirtual(hostSize);
      expect(later.targetX, isNot(closeTo(0, 1e-6)));
      // 세로 성분은 가로 비율과 무관합니다.
      expect(
        later.targetY,
        closeTo(0.22 * math.sin(later.time * 0.19 + 1.3) + 0.08 * math.sin(later.time * 0.41), 1e-12),
      );
    });

    test('the three layers converge on the target', () {
      final HoronFlueDamping damping = HoronFlueDamping()..aim(localPosition: const Offset(320, 0), size: hostSize);
      for (int i = 0; i < 400; i++) {
        damping.advance(16.7);
      }
      expect(damping.x, closeTo(0.8, 1e-3));
      expect(damping.y, closeTo(0.5, 1e-3));
      expect(damping.wakeX, closeTo(0.8, 1e-2));
    });
  });

  group('variants', () {
    testWidgets('the sidebar variant tunes the sky palette and veils it with thick glass in light', (
      WidgetTester tester,
    ) async {
      await pumpFlue(tester, variant: HoronFlueVariant.sidebar);
      final HoronFlueBackgroundState state = tester.state<HoronFlueBackgroundState>(find.byType(HoronFlueBackground));
      final HoronFlueConfig config = state.resolvedConfig;

      expect(config.speed, 0.22, reason: '더 느리게 흐릅니다');
      expect(config.smokeScale, 1.9);
      expect(config.density, 1.85);
      expect(config.contrast, 1.45, reason: '밝은 모드 조정');
      expect(config.midpoint, 0.8);
      expect(config.glow, 0.3);
      expect(config.vignette, 0, reason: '사이드바는 모서리를 어둡게 하지 않습니다');
      expect(config.bgColor, HoronFlueConfig.sky.bgColor, reason: '팔레트 위에 조정만 얹습니다');
      expect(
        find.byWidgetPredicate(
          (Widget widget) =>
              widget is ColoredBox &&
              widget.color == HoronTheme.of(tester.element(find.byType(HoronFlueBackground))).colors.glassThick,
        ),
        findsOneWidget,
        reason: '연기가 사이드바 유리 채움보다 위에 그려지므로 라이트에서는 80% 유리를 직접 얹습니다',
      );
      await drain(tester);
    });

    testWidgets('the auth variant widens the plume and keeps the light sky free of the vignette', (
      WidgetTester tester,
    ) async {
      await pumpFlue(tester, variant: HoronFlueVariant.auth);
      final HoronFlueBackgroundState state = tester.state<HoronFlueBackgroundState>(find.byType(HoronFlueBackground));
      final HoronFlueConfig config = state.resolvedConfig;

      expect(config.width, 1.9);
      expect(config.spread, 1.3);
      expect(config.density, 1.85);
      expect(config.midpoint, 0.8);
      expect(config.glow, 0.3);
      expect(config.vignette, 0, reason: '라이트는 비네트로 하늘을 회색으로 만들지 않습니다');
      expect(state.resolvedConfig.speed, HoronFlueConfig.sky.speed, reason: 'auth는 속도를 바꾸지 않습니다');
      await drain(tester);
    });

    testWidgets('an explicit config wins over the variant tuning', (WidgetTester tester) async {
      await pumpFlue(tester, variant: HoronFlueVariant.sidebar, config: HoronFlueConfig.sky);
      final HoronFlueBackgroundState state = tester.state<HoronFlueBackgroundState>(find.byType(HoronFlueBackground));
      expect(state.resolvedConfig.speed, HoronFlueConfig.sky.speed);
      expect(state.resolvedConfig.vignette, HoronFlueConfig.sky.vignette);
      await drain(tester);
    });

    testWidgets('dark mode starts from the night palette', (WidgetTester tester) async {
      await pumpFlue(tester, brightness: Brightness.dark);
      final HoronFlueBackgroundState state = tester.state<HoronFlueBackgroundState>(find.byType(HoronFlueBackground));
      expect(state.resolvedConfig.bgColor, HoronFlueConfig.night.bgColor);
      expect(state.resolvedConfig.glow, HoronFlueConfig.night.glow);
      expect(
        find.byWidgetPredicate(
          (Widget widget) => widget is ColoredBox && widget.color == HoronFlueConfig.night.bgColor,
        ),
        findsOneWidget,
      );
      await drain(tester);
    });
  });

  group('HoronFlueBackground', () {
    testWidgets('without a shader it paints the flat bgColor and the tint', (WidgetTester tester) async {
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
      // 셰이더 캔버스는 없습니다(테스트 환경은 Impeller가 없습니다).
      expect(find.byKey(horonFlueCanvasKey), findsNothing);
      expect(tester.takeException(), isNull);

      await drain(tester);
    });

    testWidgets('cursor 0 attaches no pointer listener', (WidgetTester tester) async {
      await pumpFlue(tester);
      expect(find.descendant(of: find.byType(HoronFlueBackground), matching: find.byType(Listener)), findsNothing);
      await drain(tester);

      await pumpFlue(tester, config: HoronFlueConfig.sky.copyWith(cursor: 1));
      expect(find.descendant(of: find.byType(HoronFlueBackground), matching: find.byType(Listener)), findsOneWidget);
      await drain(tester);
    });

    testWidgets('dark theme paints the night bgColor', (WidgetTester tester) async {
      await pumpFlue(tester, brightness: Brightness.dark);
      expect(
        find.byWidgetPredicate(
          (Widget widget) => widget is ColoredBox && widget.color == HoronFlueConfig.night.bgColor,
        ),
        findsOneWidget,
      );
      await drain(tester);
    });

    testWidgets('sidebar and auth lay no tint of their own', (WidgetTester tester) async {
      for (final HoronFlueVariant variant in <HoronFlueVariant>[HoronFlueVariant.sidebar, HoronFlueVariant.auth]) {
        await pumpFlue(tester, variant: variant);
        final HoronThemeData horon = HoronTheme.of(tester.element(find.byType(HoronFlueBackground)));
        expect(
          find.byWidgetPredicate((Widget widget) => widget is ColoredBox && widget.color == horon.colors.glassRegular),
          findsNothing,
          reason: variant.name,
        );
        await drain(tester);
      }
    });

    testWidgets('dark theme lays no glass-regular tint over the night palette', (WidgetTester tester) async {
      await pumpFlue(tester, brightness: Brightness.dark);
      final HoronThemeData horon = HoronTheme.of(tester.element(find.byType(HoronFlueBackground)));
      expect(
        find.byWidgetPredicate((Widget widget) => widget is ColoredBox && widget.color == horon.colors.glassRegular),
        findsNothing,
      );
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

    testWidgets('reduced motion switched on while running freezes the frame and resumes the clock', (
      WidgetTester tester,
    ) async {
      await pumpFlue(tester);
      final HoronFlueBackgroundState state = tester.state<HoronFlueBackgroundState>(find.byType(HoronFlueBackground));
      expect(state.ticker.isActive, isTrue);

      await tester.pump(const Duration(milliseconds: 32));
      final double running = state.frame.time;
      expect(running, greaterThan(0));

      // React는 열려 있는 동안 켜진 모션 축소에 `cancelAnimationFrame`만 하고 시계를 12로
      // 되돌리지 않습니다. Flutter도 같은 자리에서 멈춰야 합니다. 축소로 다시 `pumpWidget`
      // 하는 프레임에서 티커가 한 번 더 진행하므로(0.032 → 0.036167) 비교 기준은 32ms에서
      // 읽은 값이 아니라 실제로 멈춘 프레임입니다.
      await pumpFlue(tester, animations: false);
      expect(state.ticker.isActive, isFalse);
      final double frozen = state.frame.time;
      expect(frozen, greaterThanOrEqualTo(running), reason: '켜지는 순간의 프레임에서 멈춥니다');
      // 감쇠는 한 프레임을 50ms로 자르므로, 다시 그리는 프레임에서 늘어날 수 있는 최대가 한 프레임입니다.
      expect(frozen, lessThan(running + 0.05), reason: '멈추기 전에 한 프레임 넘게 진행하지 않습니다');
      expect(frozen, lessThan(12), reason: '정지 시계 12초로 되돌리지 않습니다');
      expect(state.frame.time, frozen, reason: '켜지는 순간의 프레임에서 멈춥니다');

      await tester.pump(const Duration(milliseconds: 32));
      expect(state.frame.time, frozen, reason: '켜지는 순간의 프레임에서 멈춥니다');

      await pumpFlue(tester);
      expect(state.ticker.isActive, isTrue);
      await tester.pump(const Duration(milliseconds: 32));
      expect(state.frame.time, greaterThan(frozen), reason: '같은 시계에서 이어 갑니다');

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
      // React의 `FLUE_SKY.cursor`는 0이라 기본값은 포인터를 받지 않습니다. 여기서는
      // 정규화 식만 검증하려고 `cursor`를 켠 설정을 넣습니다.
      await pumpFlue(tester, config: HoronFlueConfig.sky.copyWith(cursor: 1));
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
      HoronShaderProbe.loadProgram = (String asset) async => flueProgram;

      await pumpFlue(tester);
      await tester.pump(const Duration(milliseconds: 16));

      expect(find.byKey(horonFlueCanvasKey), findsOneWidget);
      expect(tester.takeException(), isNull);
      await drain(tester);
    });
  });
}
