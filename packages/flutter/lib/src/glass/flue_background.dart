// Flue: 사이드바 뒤에서 타는 연기 그라디언트입니다.
//
// `packages/react/src/components/flue-background.tsx`의 포트입니다. 원본은 WebGL2 풀스크린
// 삼각형 하나에 프래그먼트 셰이더 하나이고, 여기서는 `shaders/flue.frag`를 칠하는
// `CustomPaint` 하나입니다. 셰이더 수식은 원본과 같고, 시간·해상도·포인터 유니폼은
// [Ticker]가 매 프레임 채웁니다. 감쇠 상수(kLead 0.105, kBody 0.043, kWake 0.017)도
// 원본 루프와 같습니다.
//
// 웹의 규칙을 그대로 따릅니다.
//   - 부모를 채우고 내용 뒤에 놓입니다.
//   - 셰이더를 못 쓰면 `bgColor` 단색으로 남습니다.
//   - 모션 축소(`MediaQuery.disableAnimationsOf`)면 한 프레임만 그립니다(시계 12초).
//   - `TickerMode`가 꺼져 있거나 앱이 다시 그려지지 않는 상태면 티커를 멈춥니다.
//   - 포인터는 [Listener]로 받고 aim()과 같은 식으로 정규화합니다. 포인터가 없으면
//     원본의 초기 상태(0, 0)입니다.

import 'dart:ui' as ui;

import 'package:flutter/scheduler.dart';
import 'package:flutter/widgets.dart';

import '../theme/horon_theme.dart';
import 'glass_shader.dart';

/// Flue의 팔레트와 파라미터입니다.
/// Flue의 팔레트와 파라미터입니다.
///
/// `flue-background.tsx`의 `FlueConfig`와 이름과 기본값이 같습니다. 색은 hex 문자열 대신
/// [Color]이고 값은 같습니다. 팔레트를 바꿀 때는 셰이더가 아니라 이 값만 고칩니다.
@immutable
class FlueConfig {
  /// 값을 그대로 받는 생성자입니다. 기본값이 곧 [FlueConfig.sky]입니다.
  const FlueConfig({
    this.bgColor = const Color(0xFFEEF3F8),
    this.colorA = const Color(0xFFE3ECF6),
    this.colorB = const Color(0xFFC3D7EA),
    this.colorC = const Color(0xFF7FA3C6),
    this.colorD = const Color(0xFF1D3C5E),
    this.scale = 0.2,
    this.speed = 0.33,
    this.flow = 0.04,
    this.roughness = 0.36,
    this.lacunarity = 2.55,
    this.smokeScale = 2.51,
    this.curl = 0.36,
    this.curlScale = 0.88,
    this.rise = 0.03,
    this.slender = 1.55,
    this.width = 1.55,
    this.spread = 1.11,
    this.lean = 1.25,
    this.density = 2.15,
    this.contrast = 1.7,
    this.midpoint = 0.76,
    this.glow = 0.53,
    this.sink = 0.2,
    this.grain = 0.02,
    this.grainAnim = 0,
    this.dither = 1.1,
    this.vignette = 0.26,
    this.cursor = 1,
    this.pointerRadius = 0.84,
    this.draft = 1.85,
    this.pointerStrength = 0.16,
    this.parallax = 0.028,
    this.maxDpr = 1,
  });

  /// Horon 하늘 팔레트입니다. 원본의 `FLUE_SKY`입니다.
  static const FlueConfig sky = FlueConfig();

  /// 셰이더를 못 쓸 때 남는 바탕색입니다.
  final Color bgColor;

  /// 가장 옅은 연기 색입니다.
  final Color colorA;

  /// 두 번째 색입니다.
  final Color colorB;

  /// 세 번째 색입니다.
  final Color colorC;

  /// 가장 진한 색입니다.
  final Color colorD;

  /// 노이즈 좌표 배율입니다.
  final double scale;

  /// 시간 진행 속도입니다.
  final double speed;

  /// 소용돌이가 위로 흐르는 속도입니다.
  final double flow;

  /// fbm 옥타브마다 줄어드는 진폭입니다.
  final double roughness;

  /// fbm 옥타브마다 커지는 좌표 배율입니다.
  final double lacunarity;

  /// 연기 좌표의 배율입니다.
  final double smokeScale;

  /// 소용돌이 세기입니다.
  final double curl;

  /// 소용돌이 좌표 배율입니다.
  final double curlScale;

  /// 연기가 위로 오르는 속도입니다.
  final double rise;

  /// 연기를 세로로 늘리는 비율입니다.
  final double slender;

  /// 연기 기둥의 폭입니다.
  final double width;

  /// 높이에 따라 기둥이 퍼지는 정도입니다.
  final double spread;

  /// 포인터가 기둥을 기울이는 정도입니다.
  final double lean;

  /// 연기 밀도입니다.
  final double density;

  /// 밀도를 색으로 옮기는 대비입니다.
  final double contrast;

  /// 색이 시작하는 밀도입니다.
  final double midpoint;

  /// 진한 색의 발광입니다.
  final double glow;

  /// 바탕색으로 가라앉는 정도입니다.
  final double sink;

  /// 필름 그레인 세기입니다.
  final double grain;

  /// 그레인이 초당 몇 번 바뀌는지에 대한 배율입니다(0이면 정지).
  final double grainAnim;

  /// 디더 세기입니다.
  final double dither;

  /// 모서리 어두워짐입니다.
  final double vignette;

  /// 포인터 추적을 켤지 여부입니다(0이면 끕니다). 원본의 `cursor`입니다.
  final double cursor;

  /// 포인터 흔적의 반경입니다.
  final double pointerRadius;

  /// 포인터 속도가 연기를 끄는 정도입니다.
  final double draft;

  /// 포인터 흔적이 색에 더하는 세기입니다.
  final double pointerStrength;

  /// 포인터 위치가 노이즈 좌표를 옮기는 정도입니다.
  final double parallax;

  /// React에서만 쓰는 값입니다. 원본은 캔버스 드로잉 버퍼를
  /// `min(devicePixelRatio, maxDpr)`배로 잡습니다. Flutter의 캔버스는 기기 배율로
  /// 래스터화되므로 여기서는 쓰지 않고, 팔레트 이식을 위해 값만 유지합니다.
  final double maxDpr;
}

/// Flue 캔버스의 키입니다. 셰이더를 칠하고 있을 때만 트리에 있습니다.
const Key horonFlueCanvasKey = Key('horon-flue-canvas');

/// Flue의 한 프레임 상태입니다. 셰이더 유니폼과 1:1입니다.
@immutable
class FlueFrame {
  /// 값을 그대로 받는 생성자입니다.
  const FlueFrame({
    this.time = 0,
    this.mouse = Offset.zero,
    this.mouseVelocity = Offset.zero,
    this.mouseWake = Offset.zero,
  });

  /// `iTime`입니다. 초 단위입니다.
  final double time;

  /// `iMouse`입니다. 정규화된 포인터 위치입니다.
  final Offset mouse;

  /// `iMouseVel`입니다. 이번 프레임의 포인터 이동량입니다.
  final Offset mouseVelocity;

  /// `iMouseWake`입니다. 더 느리게 따라오는 포인터 흔적입니다.
  final Offset mouseWake;
}

/// JS 루프의 마우스 감쇠 상태입니다.
///
/// `aim()`은 포인터를 목표로 옮기고, `advance()`는 한 프레임만큼 세 겹(lead·body·wake)을
/// 따라가게 합니다. 원본 `frame()`과 같은 상수를 씁니다.
class FlueDamping {
  /// 목표 위치입니다. JS의 `tx`·`ty`입니다.
  double targetX = 0;
  double targetY = 0;

  /// 목표를 빠르게 따라가는 겹입니다. JS의 `ax`·`ay`입니다.
  double leadX = 0;
  double leadY = 0;

  /// 본체입니다. JS의 `x`·`y`입니다.
  double x = 0;
  double y = 0;

  /// 느린 흔적입니다. JS의 `wx`·`wy`입니다.
  double wakeX = 0;
  double wakeY = 0;

  /// 누적 시계입니다. JS의 `clock`입니다.
  double time = 0;

  /// 목표를 겨냥합니다. `aim()`입니다.
  ///
  /// `tx = (px / w - 0.5) * (w / h)`, `ty = 0.5 - py / h`입니다. 가로는 높이로 나눠
  /// 정규화하므로 화면 비율이 달라도 같은 모양이 됩니다.
  void aim({required Offset localPosition, required Size size}) {
    if (size.width <= 0 || size.height <= 0) return;
    targetX = (localPosition.dx / size.width - 0.5) * (size.width / size.height);
    targetY = 0.5 - localPosition.dy / size.height;
  }

  /// 한 프레임을 진행합니다.
  ///
  /// [rawMs]는 이전 프레임과의 간격입니다. JS와 같이 4.167~50ms로 자르고, 36.7ms보다
  /// 길면(드롭) step을 2.2로 고정합니다.
  void advance(double rawMs) {
    final double ms = rawMs.clamp(4.167, 50);
    final double step = ms > 36.7 ? 2.2 : ms * 0.06;
    time += ms * 0.001;
    final double kLead = 0.105 * step;
    final double kBody = 0.043 * step;
    final double kWake = 0.017 * step;
    leadX += (targetX - leadX) * kLead;
    leadY += (targetY - leadY) * kLead;
    x += (leadX - x) * kBody;
    y += (leadY - y) * kBody;
    wakeX += (x - wakeX) * kWake;
    wakeY += (y - wakeY) * kWake;
  }

  /// 지금 상태를 프레임 값으로 읽습니다.
  FlueFrame toFrame() => FlueFrame(
    time: time,
    mouse: Offset(x, y),
    mouseVelocity: Offset(leadX - x, leadY - y),
    mouseWake: Offset(wakeX, wakeY),
  );
}

/// Flue를 그리는 배경입니다.
///
/// 부모의 자리를 채우고 내용 뒤에 놓습니다. 뒤에 내용이 있어야 의미가 있으므로
/// `Positioned.fill`이나 크기가 정해진 자리에 넣습니다.
///
/// ```dart
/// Stack(
///   children: <Widget>[
///     const Positioned.fill(child: HoronFlueBackground()),
///     content,
///   ],
/// )
/// ```
///
/// 셰이더를 못 쓰면 [FlueConfig.bgColor] 단색에 색조 한 겹만 남습니다.
class HoronFlueBackground extends StatefulWidget {
  /// 배경을 만듭니다.
  const HoronFlueBackground({super.key, this.config = FlueConfig.sky, this.tint});

  /// 팔레트와 파라미터입니다.
  final FlueConfig config;

  /// 연기 위에 얹는 색조입니다. 없으면 테마의 `glass-regular`입니다(React의
  /// `bg-glass-regular`).
  final Color? tint;

  @override
  State<HoronFlueBackground> createState() => HoronFlueBackgroundState();
}

/// [HoronFlueBackground]의 상태입니다.
///
/// 티커·감쇠·셰이더를 들고 있습니다. 테스트가 `ticker.isActive`와 [damping]을 읽습니다.
class HoronFlueBackgroundState extends State<HoronFlueBackground>
    with SingleTickerProviderStateMixin, WidgetsBindingObserver {
  late final Ticker _ticker;
  final FlueDamping _damping = FlueDamping();
  final ValueNotifier<FlueFrame> _frame = ValueNotifier<FlueFrame>(const FlueFrame());

  ui.FragmentShader? _shader;
  bool _requested = false;
  bool _resumed = true;
  Duration _lastElapsed = Duration.zero;

  /// 이 배경의 티커입니다. `TickerMode`가 꺼지면 멈춥니다.
  @visibleForTesting
  Ticker get ticker => _ticker;

  /// 지금의 감쇠 상태입니다.
  @visibleForTesting
  FlueDamping get damping => _damping;

  /// 지금 그리는 프레임입니다.
  @visibleForTesting
  FlueFrame get frame => _frame.value;

  @override
  void initState() {
    super.initState();
    _ticker = createTicker(_onTick);
    WidgetsBinding.instance.addObserver(this);
    final AppLifecycleState? state = WidgetsBinding.instance.lifecycleState;
    _resumed = state == null || state == AppLifecycleState.resumed;
  }

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    _syncTicker();
    _maybeLoadShader();
  }

  @override
  void didChangeAppLifecycleState(AppLifecycleState state) {
    final bool resumed = state == AppLifecycleState.resumed;
    if (resumed == _resumed) return;
    _resumed = resumed;
    _syncTicker();
  }

  /// 티커를 켜고 끕니다.
  ///
  /// 세 조건이 모두 참일 때만 돕니다: `TickerMode` 켜짐, 앱이 앞에 있음, 모션 축소 아님.
  /// 모션 축소일 때는 [FlueDamping.time]을 12로 둔 한 프레임을 그립니다(원본과 같은 값).
  void _syncTicker() {
    if (!mounted) return;
    final bool animated = TickerMode.valuesOf(context).enabled && _resumed && !MediaQuery.disableAnimationsOf(context);
    if (!animated) {
      if (_ticker.isActive) _ticker.stop();
      _drawStill();
      return;
    }
    if (_ticker.isActive) return;
    _lastElapsed = Duration.zero;
    _ticker.start();
  }

  /// 한 프레임만 그립니다. 원본의 `clock = still ? 12 : 0; draw();` 중 정지 쪽입니다.
  void _drawStill() {
    _damping.time = 12;
    _frame.value = _damping.toFrame();
  }

  void _onTick(Duration elapsed) {
    final double rawMs = (elapsed - _lastElapsed).inMicroseconds / 1000;
    _lastElapsed = elapsed;
    _damping.advance(rawMs);
    _frame.value = _damping.toFrame();
  }

  /// 셰이더를 한 번 읽습니다. 실패하면 단색으로 남습니다.
  void _maybeLoadShader() {
    if (_requested) return;
    _requested = true;
    _loadShader();
  }

  Future<void> _loadShader() async {
    try {
      final ui.FragmentProgram? program = await HoronGlassProbe.loadProgram(horonFlueAsset);
      if (!mounted || program == null) return;
      setState(() => _shader = program.fragmentShader());
    } catch (_) {
      // 자산이 없거나 엔진이 거부하면 던지지 않고 단색으로 내려갑니다.
    }
  }

  @override
  void dispose() {
    WidgetsBinding.instance.removeObserver(this);
    _ticker.dispose();
    _frame.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final HoronThemeData horon = HoronTheme.of(context);
    final Color tint = widget.tint ?? horon.colors.glassRegular;
    final ui.FragmentShader? shader = _shader;

    return LayoutBuilder(
      builder: (BuildContext context, BoxConstraints constraints) {
        final Size size = constraints.biggest;
        return Listener(
          behavior: HitTestBehavior.translucent,
          onPointerDown: (PointerEvent event) => _aim(event.localPosition, size),
          onPointerMove: (PointerEvent event) => _aim(event.localPosition, size),
          child: ColoredBox(
            color: widget.config.bgColor,
            child: Stack(
              fit: StackFit.expand,
              children: <Widget>[
                if (shader != null)
                  CustomPaint(
                    key: horonFlueCanvasKey,
                    painter: _HoronFluePainter(shader: shader, config: widget.config, repaint: _frame),
                  ),
                IgnorePointer(child: ColoredBox(color: tint)),
              ],
            ),
          ),
        );
      },
    );
  }

  void _aim(Offset localPosition, Size size) {
    if (widget.config.cursor == 0) return;
    _damping.aim(localPosition: localPosition, size: size);
  }
}

/// `shaders/flue.frag`를 칠하는 페인터입니다.
class _HoronFluePainter extends CustomPainter {
  _HoronFluePainter({required this.shader, required this.config, required ValueNotifier<FlueFrame> repaint})
    : _frame = repaint,
      super(repaint: repaint);

  final ui.FragmentShader shader;
  final FlueConfig config;
  final ValueNotifier<FlueFrame> _frame;

  @override
  void paint(Canvas canvas, Size size) {
    if (size.isEmpty) return;
    _applyUniforms(size, _frame.value);
    canvas.drawRect(Offset.zero & size, Paint()..shader = shader);
  }

  /// 셰이더의 유니폼을 채웁니다. 슬롯 색인은 [horonFlueUniforms]에서 계산됩니다.
  void _applyUniforms(Size size, FlueFrame frame) {
    final Map<String, int> slots = horonFlueSlots;

    void scalar(String name, double value) => shader.setFloat(slots[name]!, value);

    void pair(String name, double x, double y) {
      final int slot = slots[name]!;
      shader
        ..setFloat(slot, x)
        ..setFloat(slot + 1, y);
    }

    void triple(String name, Color color) {
      final int slot = slots[name]!;
      shader
        ..setFloat(slot, color.r)
        ..setFloat(slot + 1, color.g)
        ..setFloat(slot + 2, color.b);
    }

    pair('iResolution', size.width, size.height);
    scalar('iTime', frame.time);
    pair('iMouse', frame.mouse.dx, frame.mouse.dy);
    pair('iMouseVel', frame.mouseVelocity.dx, frame.mouseVelocity.dy);
    pair('iMouseWake', frame.mouseWake.dx, frame.mouseWake.dy);
    triple('uBgColor', config.bgColor);
    triple('uColorA', config.colorA);
    triple('uColorB', config.colorB);
    triple('uColorC', config.colorC);
    triple('uColorD', config.colorD);
    scalar('uScale', config.scale);
    scalar('uSpeed', config.speed);
    scalar('uFlow', config.flow);
    scalar('uRoughness', config.roughness);
    scalar('uLacunarity', config.lacunarity);
    scalar('uSmokeScale', config.smokeScale);
    scalar('uCurl', config.curl);
    scalar('uCurlScale', config.curlScale);
    scalar('uRise', config.rise);
    scalar('uSlender', config.slender);
    scalar('uWidth', config.width);
    scalar('uSpread', config.spread);
    scalar('uLean', config.lean);
    scalar('uDensity', config.density);
    scalar('uContrast', config.contrast);
    scalar('uMidpoint', config.midpoint);
    scalar('uGlow', config.glow);
    scalar('uSink', config.sink);
    scalar('uGrain', config.grain);
    scalar('uDither', config.dither);
    scalar('uVignette', config.vignette);
    scalar('uPointerRadius', config.pointerRadius);
    scalar('uDraft', config.draft);
    scalar('uPointerStrength', config.pointerStrength);
    scalar('uParallax', config.parallax);
    scalar('uGrainAnim', config.grainAnim);
  }

  @override
  bool shouldRepaint(_HoronFluePainter oldDelegate) =>
      shader != oldDelegate.shader || config != oldDelegate.config || _frame != oldDelegate._frame;
}
