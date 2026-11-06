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
//     열려 있는 동안 설정이 켜지면 지금 프레임에서 멈추고, 꺼지면 같은 시계에서 이어 갑니다.
//   - `TickerMode`가 꺼져 있거나 앱이 다시 그려지지 않는 상태면 티커를 멈춥니다.
//   - 포인터는 [Listener]로 받고 aim()과 같은 식으로 정규화합니다. 포인터가 없으면
//     원본의 초기 상태(0, 0)입니다.

import 'dart:math' as math;
import 'dart:ui' as ui;

import 'package:flutter/scheduler.dart';
import 'package:flutter/widgets.dart';

import '../components/flue_background.dart' show HoronFlueVariant;
import '../theme/horon_theme.dart';
import 'glass_shader.dart';

/// Flue의 팔레트와 파라미터입니다.
///
/// `flue-background.tsx`의 `FlueConfig`와 필드 이름과 기본값이 같습니다. 색은 hex 문자열 대신
/// [Color]이고 값은 같습니다. 팔레트를 바꿀 때는 셰이더가 아니라 이 값만 고칩니다.
@immutable
class HoronFlueConfig {
  /// 값을 그대로 받는 생성자입니다. 기본값이 곧 [HoronFlueConfig.sky]입니다.
  const HoronFlueConfig({
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
    this.cursor = 0,
    this.pointerRadius = 0.84,
    this.draft = 1.85,
    this.pointerStrength = 0.16,
    this.parallax = 0.028,
    this.maxDpr = 1,
  });

  /// Horon 하늘 팔레트입니다. 원본의 `FLUE_SKY`입니다.
  static const HoronFlueConfig sky = HoronFlueConfig();

  /// 어두운 모드 팔레트입니다. 원본의 `FLUE_NIGHT`입니다.
  ///
  /// 거의 검은 바탕에 푸른 연기이고, 움직임은 [sky]와 같습니다.
  static const HoronFlueConfig night = HoronFlueConfig(
    bgColor: Color(0xFF050608),
    colorA: Color(0xFF07090D),
    colorB: Color(0xFF0C1A2C),
    colorC: Color(0xFF1F4A78),
    colorD: Color(0xFF4F8FD0),
    glow: 0.35,
  );

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

  /// 일부 값만 덮어쓴 설정입니다. 변형 튜닝이 이 함수로 기본 팔레트를 고칩니다.
  HoronFlueConfig copyWith({
    Color? bgColor,
    Color? colorA,
    Color? colorB,
    Color? colorC,
    Color? colorD,
    double? scale,
    double? speed,
    double? flow,
    double? roughness,
    double? lacunarity,
    double? smokeScale,
    double? curl,
    double? curlScale,
    double? rise,
    double? slender,
    double? width,
    double? spread,
    double? lean,
    double? density,
    double? contrast,
    double? midpoint,
    double? glow,
    double? sink,
    double? grain,
    double? grainAnim,
    double? dither,
    double? vignette,
    double? cursor,
    double? pointerRadius,
    double? draft,
    double? pointerStrength,
    double? parallax,
    double? maxDpr,
  }) {
    return HoronFlueConfig(
      bgColor: bgColor ?? this.bgColor,
      colorA: colorA ?? this.colorA,
      colorB: colorB ?? this.colorB,
      colorC: colorC ?? this.colorC,
      colorD: colorD ?? this.colorD,
      scale: scale ?? this.scale,
      speed: speed ?? this.speed,
      flow: flow ?? this.flow,
      roughness: roughness ?? this.roughness,
      lacunarity: lacunarity ?? this.lacunarity,
      smokeScale: smokeScale ?? this.smokeScale,
      curl: curl ?? this.curl,
      curlScale: curlScale ?? this.curlScale,
      rise: rise ?? this.rise,
      slender: slender ?? this.slender,
      width: width ?? this.width,
      spread: spread ?? this.spread,
      lean: lean ?? this.lean,
      density: density ?? this.density,
      contrast: contrast ?? this.contrast,
      midpoint: midpoint ?? this.midpoint,
      glow: glow ?? this.glow,
      sink: sink ?? this.sink,
      grain: grain ?? this.grain,
      grainAnim: grainAnim ?? this.grainAnim,
      dither: dither ?? this.dither,
      vignette: vignette ?? this.vignette,
      cursor: cursor ?? this.cursor,
      pointerRadius: pointerRadius ?? this.pointerRadius,
      draft: draft ?? this.draft,
      pointerStrength: pointerStrength ?? this.pointerStrength,
      parallax: parallax ?? this.parallax,
      maxDpr: maxDpr ?? this.maxDpr,
    );
  }

  /// 밝기와 변형의 기본 팔레트에 호출자 [config]를 얹은 설정입니다.
  ///
  /// 병합 순서는 React `FlueBackground`와 같습니다: `FLUE_NIGHT`/`FLUE_SKY` →
  /// `FLUE_VARIANTS[variant]` → 호출자 설정.
  ///
  /// React의 `config`는 `Partial<FlueConfig>`이지만 Flutter에는 부분 타입이 없어
  /// [HoronFlueConfig]가 모든 필드를 항상 들고 있습니다. 그래서 [config]는 완전한
  /// 설정으로 보고 최종 값이 됩니다. 변형 튜닝 위에 몇 값만 고치려면 이 함수의 결과에
  /// [copyWith]를 겁니다:
  ///
  /// ```dart
  /// final HoronFlueConfig tuned = HoronFlueConfig.resolve(
  ///   brightness: HoronTheme.of(context).brightness,
  ///   variant: HoronFlueVariant.auth,
  /// ).copyWith(glow: 0.6);
  /// ```
  static HoronFlueConfig resolve({
    required Brightness brightness,
    HoronFlueVariant variant = HoronFlueVariant.defaultValue,
    HoronFlueConfig? config,
  }) {
    final bool dark = brightness == Brightness.dark;
    final HoronFlueConfig base = dark ? night : sky;
    // `sidebar`: 유리가 세부를 흐리므로 연기를 더 느리고 크게, 기둥 아래쪽에 둡니다. 색조는
    // 여기가 아니라 `_variantTint`가 정합니다(라이트의 두꺼운 유리).
    // `auth`: 카드 뒤에서 기둥 폭을 넓히고 아래에서 올립니다. 라이트는 셰이더 비네트가
    // 검정으로 어둡게 하므로 비네트 없이 옅은 하늘을 지키고, 다크만 모서리를 밤 바탕에
    // 가라앉힙니다.
    final HoronFlueConfig tuned = switch (variant) {
      HoronFlueVariant.defaultValue => base,
      HoronFlueVariant.sidebar =>
        dark
            ? base.copyWith(
                speed: 0.22,
                smokeScale: 1.9,
                density: 1.85,
                contrast: 1.5,
                midpoint: 0.8,
                glow: 0.22,
                vignette: 0,
              )
            : base.copyWith(
                speed: 0.22,
                smokeScale: 1.9,
                density: 1.85,
                contrast: 1.45,
                midpoint: 0.8,
                glow: 0.3,
                vignette: 0,
              ),
      HoronFlueVariant.auth =>
        dark
            ? base.copyWith(width: 1.9, spread: 1.3, density: 2, midpoint: 0.76, glow: 0.45, vignette: 0.45)
            : base.copyWith(width: 1.9, spread: 1.3, density: 1.85, midpoint: 0.8, glow: 0.3, vignette: 0),
    };
    return config ?? tuned;
  }
}

/// Flue 캔버스의 키입니다. 셰이더를 칠하고 있을 때만 트리에 있습니다.
const Key horonFlueCanvasKey = Key('horon-flue-canvas');

/// Flue의 한 프레임 상태입니다. 셰이더 유니폼과 1:1입니다.
@immutable
class HoronFlueFrame {
  /// 값을 그대로 받는 생성자입니다.
  const HoronFlueFrame({
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
class HoronFlueDamping {
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

  /// 진짜 포인터가 없을 때 목표를 옮깁니다. React `frame()`의 가상 포인터입니다.
  ///
  /// 화면 비율만큼 가로를 넓혀 두 개의 어긋난 사인으로 천천히 흔듭니다. 시계를 먼저
  /// 진행한 뒤 부르므로 [time]이 이번 프레임의 값입니다.
  void aimVirtual(Size size) {
    final double aspect = size.width / math.max(1, size.height);
    targetX = aspect * (0.3 * math.sin(time * 0.23) + 0.12 * math.sin(time * 0.57 + 0.8));
    targetY = 0.22 * math.sin(time * 0.19 + 1.3) + 0.08 * math.sin(time * 0.41);
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
  HoronFlueFrame toFrame() => HoronFlueFrame(
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
/// 셰이더를 못 쓰면 [HoronFlueConfig.bgColor] 단색에 색조 한 겹만 남습니다.
class HoronFlueBackground extends StatefulWidget {
  /// 배경을 만듭니다.
  const HoronFlueBackground({super.key, this.variant = HoronFlueVariant.defaultValue, this.config, this.tint});

  /// 연기가 놓이는 자리입니다. React `FlueVariant`와 같은 세 값입니다.
  ///
  /// `sidebar`는 유리 뒤의 좁고 긴 열, `auth`는 로그인 카드 뒤의 넓은 화면입니다.
  /// 변형마다 밝기별 튜닝이 다르고, `defaultValue`는 튜닝이 없습니다.
  final HoronFlueVariant variant;

  /// 팔레트와 파라미터 전체를 덮어쓸 때 씁니다.
  ///
  /// 없으면 밝기·변형의 기본값을 씁니다. 넘기면 변형 튜닝 대신 이 설정을 그대로 그리므로,
  /// 변형 위에 몇 값만 바꾸려면 [HoronFlueConfig.resolve] 결과에 `copyWith`를 겁니다.
  final HoronFlueConfig? config;

  /// 연기 위에 얹는 색조입니다.
  ///
  /// 없으면 변형이 정한 색조를 씁니다: 라이트의 `defaultValue`는 테마의
  /// `glass-regular`(React의 `bg-glass-regular dark:bg-transparent`), 라이트의
  /// `sidebar`는 `glass-thick`(React의 `bg-glass-thick dark:bg-transparent`, 80% 흰
  /// 유리로 보조 글자 대비를 지킵니다), `auth`는 없음입니다. 다크에서는 모두 없습니다.
  /// 명시적으로 색조를 없애려면 `Colors.transparent`를 넘깁니다.
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
  final HoronFlueDamping _damping = HoronFlueDamping();
  final ValueNotifier<HoronFlueFrame> _frame = ValueNotifier<HoronFlueFrame>(const HoronFlueFrame());

  ui.FragmentShader? _shader;
  bool _requested = false;
  bool _resumed = true;
  bool _drawn = false;
  Duration _lastElapsed = Duration.zero;
  HoronFlueConfig _settings = HoronFlueConfig.sky;
  Size _size = Size.zero;

  /// 이 배경의 티커입니다. `TickerMode`가 꺼지면 멈춥니다.
  @visibleForTesting
  Ticker get ticker => _ticker;

  /// 지금의 감쇠 상태입니다.
  @visibleForTesting
  HoronFlueDamping get damping => _damping;

  /// 지금 그리는 프레임입니다.
  @visibleForTesting
  HoronFlueFrame get frame => _frame.value;

  /// 지금 적용되는 팔레트입니다. 테마 밝기, [HoronFlueBackground.variant], 명시 config를 모두 반영합니다.
  @visibleForTesting
  HoronFlueConfig get resolvedConfig => _resolveConfig(HoronTheme.of(context));

  /// React의 `{ ...(dark ? FLUE_NIGHT : FLUE_SKY), ...tuning, ...config }`입니다.
  HoronFlueConfig _resolveConfig(HoronThemeData horon) =>
      HoronFlueConfig.resolve(brightness: horon.brightness, variant: widget.variant, config: widget.config);

  /// 변형이 정한 색조입니다. React의 `FLUE_VARIANTS[...].tint`입니다.
  Color? _variantTint(HoronThemeData horon) => switch (widget.variant) {
    // `bg-glass-regular dark:bg-transparent`
    HoronFlueVariant.defaultValue => horon.brightness == Brightness.dark ? null : horon.colors.glassRegular,
    // `bg-glass-thick dark:bg-transparent`: 연기가 사이드바 유리 채움보다 위에 그려지므로 라이트에서는
    // 80% 흰 유리를 직접 얹어 보조 글자 대비를 지킵니다.
    HoronFlueVariant.sidebar => horon.brightness == Brightness.dark ? null : horon.colors.glassThick,
    // 인증 화면은 색조를 얹지 않습니다.
    HoronFlueVariant.auth => null,
  };

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
  /// 멈출 때는 지금 프레임을 그대로 둡니다. 원본도 `cancelAnimationFrame`만 하고 `clock`을
  /// 건드리지 않으므로, 모션 축소를 껐다 켜거나 앱이 돌아오면 같은 시계에서 이어 갑니다.
  /// 한 번도 그린 적이 없으면 [HoronFlueDamping.time]을 12로 둔 프레임을 그립니다(원본의
  /// `clock = still ? 12 : 0`).
  void _syncTicker() {
    if (!mounted) return;
    final bool animated = TickerMode.valuesOf(context).enabled && _resumed && !MediaQuery.disableAnimationsOf(context);
    if (!animated) {
      if (_ticker.isActive) _ticker.stop();
      _freeze();
      return;
    }
    if (_ticker.isActive) return;
    _lastElapsed = Duration.zero;
    _ticker.start();
  }

  /// 지금 프레임에서 멈춥니다. 아직 한 프레임도 그리지 않았으면 12초 시점을 그립니다.
  void _freeze() {
    if (_drawn) {
      _frame.value = _damping.toFrame();
      return;
    }
    _damping.time = 12;
    _frame.value = _damping.toFrame();
  }

  void _onTick(Duration elapsed) {
    final double rawMs = (elapsed - _lastElapsed).inMicroseconds / 1000;
    _lastElapsed = elapsed;
    _damping.advance(rawMs);
    // 진짜 포인터를 받지 않을 때만 가상 포인터를 움직입니다. 시계를 진행한 뒤
    // 목표를 정하므로 React `frame()`과 같은 순서입니다.
    if (_settings.cursor == 0) _damping.aimVirtual(_size);
    _drawn = true;
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
      final ui.FragmentProgram? program = await HoronShaderProbe.loadProgram(horonFlueAsset);
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
    // 다크는 DOM 클래스가 아니라 테마 밝기로 정합니다. 이번 빌드의 설정을 상태에
    // 남겨 두어야 티커와 포인터 처리도 같은 값을 봅니다.
    _settings = HoronFlueConfig.resolve(brightness: horon.brightness, variant: widget.variant, config: widget.config);
    // 변형마다 색조 클래스가 다릅니다(`default`는 glass-regular, `sidebar`는 glass-thick,
    // `auth`는 없음). 다크에서는 모두 `dark:bg-transparent`라 색조를 얹지 않아야 밤
    // 팔레트가 회색으로 뜨지 않습니다.
    final Color? tint = widget.tint ?? _variantTint(horon);
    final ui.FragmentShader? shader = _shader;

    return LayoutBuilder(
      builder: (BuildContext context, BoxConstraints constraints) {
        final Size size = constraints.biggest;
        _size = size;
        final Widget background = ColoredBox(
          color: _settings.bgColor,
          child: Stack(
            fit: StackFit.expand,
            children: <Widget>[
              if (shader != null)
                CustomPaint(
                  key: horonFlueCanvasKey,
                  painter: _HoronFluePainter(shader: shader, config: _settings, repaint: _frame),
                ),
              if (tint != null) IgnorePointer(child: ColoredBox(color: tint)),
            ],
          ),
        );
        // `cursor`가 0이면 실제 포인터를 받지 않습니다. React도 `cfg.cursor`일 때만
        // 포인터 이벤트를 등록합니다.
        if (_settings.cursor == 0) return background;
        return Listener(
          behavior: HitTestBehavior.translucent,
          onPointerDown: (PointerEvent event) => _aim(event.localPosition, size),
          onPointerMove: (PointerEvent event) => _aim(event.localPosition, size),
          child: background,
        );
      },
    );
  }

  void _aim(Offset localPosition, Size size) {
    if (_settings.cursor == 0) return;
    _damping.aim(localPosition: localPosition, size: size);
  }
}

/// `shaders/flue.frag`를 칠하는 페인터입니다.
class _HoronFluePainter extends CustomPainter {
  _HoronFluePainter({required this.shader, required this.config, required ValueNotifier<HoronFlueFrame> repaint})
    : _frame = repaint,
      super(repaint: repaint);

  final ui.FragmentShader shader;
  final HoronFlueConfig config;
  final ValueNotifier<HoronFlueFrame> _frame;

  @override
  void paint(Canvas canvas, Size size) {
    if (size.isEmpty) return;
    _applyUniforms(size, _frame.value);
    canvas.drawRect(Offset.zero & size, Paint()..shader = shader);
  }

  /// 셰이더의 유니폼을 채웁니다. 슬롯 색인은 [horonFlueUniforms]에서 계산됩니다.
  void _applyUniforms(Size size, HoronFlueFrame frame) {
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
