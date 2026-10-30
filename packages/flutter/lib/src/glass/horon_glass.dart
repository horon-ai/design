// 리퀴드 글래스 레이어 스택입니다.
//
// React 세트의 `.liquid-layers`(`packages/react/src/styles/globals.css`)를 Flutter로
// 옮긴 것입니다. 같은 호스트에 대해 아래에서 위로 같은 것을 그립니다.
//
//   1. 채움        — 티어 색(glass-clear/regular/thick) + 티어 블러
//   2. 굴절        — 셰이더 필터로 뒤 배경을 가장자리에서 당김 (선택)
//   3. 질감        — 흰색 3% + 2px 블러, 호스트 밖으로 9/8px 번짐 (선택)
//   4. 색조        — 글래스 색조 + 45px 블러, layerOpacity(0.5)
//   5. 안쪽 그늘   — 높이에 비례한 여백 + 4px 블러 + overlay 혼합, 0.5
//   6. 부드러운 가장자리 — 1px 테두리 + 클램프된 블러 + plus-lighter, 0.5
//   7. 광택        — 135°/315° 그라디언트 링, screen 혼합, 불투명도 1
//
// CSS도 굴절이 켜지면 광택을 숨깁니다(`[data-refract="on"] > [sheen] { display: none }`).
// 서리 단계에서는 4번 자리에 `glass-fill-frost`가 불투명도 1로 들어오고 5~7번이 빠집니다.

import 'dart:math' as math;
import 'dart:ui' as ui;

import 'package:flutter/widgets.dart';

import '../theme/horon_theme.dart';
import '../tokens/horon_tokens.g.dart';
import 'glass_geometry.dart';
import 'glass_shader.dart';

/// 레이어 위젯을 찾기 위한 키입니다. 테스트가 스택의 각 겹을 검사합니다.
abstract final class HoronGlassLayerKeys {
  /// 채움 레이어입니다.
  static const Key fill = Key('horon-glass-fill');

  /// 굴절 레이어입니다.
  static const Key refraction = Key('horon-glass-refraction');

  /// 질감 레이어입니다.
  static const Key texture = Key('horon-glass-texture');

  /// 색조 레이어입니다.
  static const Key tint = Key('horon-glass-tint');

  /// 안쪽 그늘 레이어입니다.
  static const Key innerShade = Key('horon-glass-inner-shade');

  /// 부드러운 가장자리 레이어입니다.
  static const Key edgeLightSoft = Key('horon-glass-edge-light-soft');

  /// 광택 레이어입니다.
  static const Key sheen = Key('horon-glass-sheen');

  /// 서리 채움 레이어입니다.
  static const Key frost = Key('horon-glass-frost');
}

/// Figma `Liquid layers` 그룹을 그리는 표면입니다.
///
/// React `LiquidGlass`의 Flutter 대응입니다. React는 이 그룹을 호스트의 첫 자식으로
/// 놓고 호스트가 자기 채움과 테두리를 그리지만, Flutter에는 "부모의 스타일을 읽는
/// 자식"이 없으므로 이 위젯이 채움까지 함께 그립니다.
///
/// ```dart
/// Stack(
///   children: <Widget>[
///     const Positioned.fill(child: HoronFlueBackground()),
///     Center(
///       child: HoronLiquidGlass(
///         tier: HoronGlassTier.regular,
///         borderRadius: BorderRadius.circular(HoronRadius.full),
///         child: Padding(padding: EdgeInsets.all(16), child: Text('유리')),
///       ),
///     ),
///   ],
/// )
/// ```
///
/// 굴절은 Impeller의 `ui.ImageFilter.shader`가 필요합니다. 셰이더를 못 쓰는 엔진,
/// 투명도 축소 설정([HoronGlassRefraction.off] 포함), 불투명 호스트, 면적 상한을 넘은
/// 호스트는 웹과 같은 강등 경로를 탑니다([horonGlassRungOf]).
class HoronLiquidGlass extends StatefulWidget {
  /// 표면을 만듭니다.
  const HoronLiquidGlass({
    super.key,
    this.tier = HoronGlassTier.clear,
    this.texture = false,
    this.refract = HoronGlassRefraction.auto,
    this.opaque = false,
    this.borderRadius,
    required this.child,
  });

  /// 채움 두께입니다. React `tier`와 같은 세 값입니다.
  final HoronGlassTier tier;

  /// Paper의 Texture 레이어를 그릴지 여부입니다(React `texture`, 칩이 씁니다).
  final bool texture;

  /// 굴절을 켤지 여부입니다. React `refract`와 같은 자리이고, `off`가 `false`입니다.
  final HoronGlassRefraction refract;

  /// 호스트가 불투명한 채움을 스스로 그리는지 여부입니다.
  ///
  /// 웹은 `getComputedStyle(host).backgroundColor`의 알파를 재서 판단합니다. Flutter에는
  /// 그 계산된 스타일이 없으므로 호출자가 알려 줍니다. 불투명 호스트는 뒤 배경이
  /// 비치지 않아 굴절이 옆 내용만 끌어오므로 레이어만 그립니다.
  final bool opaque;

  /// 표면의 반경입니다. 없으면 테마의 `radius.md`(12)입니다.
  final BorderRadius? borderRadius;

  /// 표면 안에 넣을 내용입니다. 내용이 표면의 크기를 정합니다.
  final Widget child;

  @override
  State<HoronLiquidGlass> createState() => _HoronLiquidGlassState();
}

class _HoronLiquidGlassState extends State<HoronLiquidGlass> {
  /// 호스트가 그려진 뒤에 잴 실제 크기입니다.
  Size _hostSize = Size.zero;

  /// 크기를 재기 위해 호스트 루트에 다는 키입니다.
  final GlobalKey _hostKey = GlobalKey();
  ui.FragmentShader? _shader;
  bool _loadFailed = false;
  bool _requested = false;

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    _maybeLoadShader();
  }

  /// 굴절이 가능한 환경이면 셰이더를 한 번 읽습니다.
  ///
  /// 면적 상한은 여기서 보지 않습니다. 프로그램은 페이지 전체가 나눠 쓰는 자원이라
  /// 한 번 읽어 두고, 상한을 넘은 호스트는 [horonGlassRungOf]가 레이어 단계로
  /// 떨어뜨립니다.
  void _maybeLoadShader() {
    if (_requested || _shader != null || _loadFailed) return;
    if (widget.refract == HoronGlassRefraction.off) return;
    if (widget.opaque) return;
    if (MediaQuery.maybeDisableAnimationsOf(context) ?? false) return;
    if (!HoronGlassProbe.shaderFilterSupported()) return;
    _requested = true;
    _loadShader();
  }

  Future<void> _loadShader() async {
    HoronGlassProbe.refractionAttempts += 1;
    try {
      final ui.FragmentProgram? program = await HoronGlassProbe.loadProgram(horonGlassRefractAsset);
      if (!mounted) return;
      if (program == null) {
        setState(() => _loadFailed = true);
        return;
      }
      final ui.FragmentShader shader = program.fragmentShader();
      // 지금 바로 필터를 하나 만들어 봅니다. `ui.ImageFilter.shader`는 Impeller가
      // 아니면 `UnsupportedError`를, 유니폼 계약이 틀리면 `StateError`를 던집니다.
      // 여기서 걸러야 그렸어야 할 광택을 숨기고 굴절도 없는 어중간한 표면이 남지 않습니다.
      ui.ImageFilter.shader(shader);
      setState(() => _shader = shader);
    } catch (_) {
      // 자산이 없거나 엔진이 거부하면 던지지 않고 서리 채움으로 내려갑니다.
      if (!mounted) return;
      setState(() => _loadFailed = true);
    }
  }

  @override
  Widget build(BuildContext context) {
    final HoronThemeData horon = HoronTheme.of(context);
    final BorderRadius radius = widget.borderRadius ?? BorderRadius.circular(horon.radius.md);

    // 호스트 크기는 LayoutBuilder 대신 실제 레이아웃 뒤에 잽니다. 메뉴·팝업처럼 자식의
    // 고유 크기를 묻는 부모 아래에서 LayoutBuilder 는 예외를 던지기 때문입니다. 첫
    // 프레임은 크기 없이(Size.zero) 그리고, 크기가 잠히면 다시 그립니다.
    _scheduleMeasure();
    final Size size = _hostSize;
    final bool finite = size.width.isFinite && size.height.isFinite && size.width > 0 && size.height > 0;
    final Size host = finite ? size : Size.zero;
    final double height = host.height;

    final HoronGlassRung rung = horonGlassRungOf(
      // 셰이더를 읽었는데 필터를 못 만들었으면 엔진이 "지원한다"고 답한 것과 같으므로
      // 서리로 내려갑니다. 광택만 숨기고 굴절은 없는 표면을 남기지 않습니다.
      shaderSupported: HoronGlassProbe.shaderFilterSupported() && !_loadFailed,
      reducedTransparency: MediaQuery.disableAnimationsOf(context),
      refraction: widget.refract,
      opaque: widget.opaque,
      areaAllowed:
          finite &&
          horonGlassAreaAllowed(
            HoronGlassShape(width: size.width, height: size.height, radius: _topLeft(radius)),
            coarsePointer: false,
          ),
      shaderReady: _shader != null,
    );

    return SizeChangedLayoutNotifier(
      child: KeyedSubtree(
        key: _hostKey,
        child: ClipRRect(
          borderRadius: radius,
          child: Stack(
            fit: StackFit.passthrough,
            children: <Widget>[
              Positioned.fill(child: IgnorePointer(child: _layers(horon, rung, host, radius, height))),
              widget.child,
            ],
          ),
        ),
      ),
    );
  }

  /// 레이아웃이 끝난 뒤 호스트 크기를 읽어 상태에 적어 둡니다.
  void _scheduleMeasure() {
    WidgetsBinding.instance.addPostFrameCallback((Duration _) {
      if (!mounted) return;
      final RenderObject? render = _hostKey.currentContext?.findRenderObject();
      if (render is! RenderBox || !render.hasSize) return;
      if (render.size != _hostSize) setState(() => _hostSize = render.size);
    });
  }

  /// 반경의 왼쪽 위 값입니다. React가 `borderTopLeftRadius`를 읽는 자리입니다.
  double _topLeft(BorderRadius radius) => radius.topLeft.x;

  Widget _layers(HoronThemeData horon, HoronGlassRung rung, Size size, BorderRadius radius, double height) {
    final HoronGlassTokens glass = horon.glass;
    final HoronGlassMetrics metrics = HoronGlassMetrics.forHeight(height, glass);

    final double layerOpacity = metrics.layerOpacity;
    // 채움은 호스트 자체의 색이라 서리 단계에서도 남습니다(CSS도 호스트의 배경 위에
    // 서리 색조를 덮습니다).
    final List<Widget> layers = <Widget>[
      Positioned.fill(
        child: BackdropFilter(
          key: HoronGlassLayerKeys.fill,
          filter: _blur(horonGlassTierBlur(widget.tier)),
          child: ColoredBox(color: horonGlassTierFill(widget.tier, horon.colors)),
        ),
      ),
    ];

    if (rung == HoronGlassRung.frost) {
      // `@supports not` / `prefers-reduced-transparency`: 불투명한 서리 채움 한 겹만
      // 남기고 장식 레이어를 모두 빼집니다.
      layers.add(
        Positioned.fill(
          child: ColoredBox(key: HoronGlassLayerKeys.frost, color: horon.colors.glassFillFrost),
        ),
      );
      return Stack(fit: StackFit.expand, children: layers);
    }

    if (rung == HoronGlassRung.refracted) {
      final ui.ImageFilter? filter = _refractFilter(size, radius);
      if (filter != null) {
        layers.add(
          Positioned.fill(
            child: BackdropFilter(key: HoronGlassLayerKeys.refraction, filter: filter),
          ),
        );
      }
    }

    if (widget.texture) {
      layers.add(
        Positioned(
          left: -horonGlassTextureBleedX,
          top: -horonGlassTextureBleedY,
          right: -horonGlassTextureBleedX,
          bottom: -horonGlassTextureBleedY,
          child: BackdropFilter(
            key: HoronGlassLayerKeys.texture,
            filter: _blur(horonGlassTextureBlur),
            child: const ColoredBox(color: horonGlassTextureFill),
          ),
        ),
      );
    }

    layers
      ..add(
        Positioned.fill(
          child: BackdropFilter(
            key: HoronGlassLayerKeys.tint,
            filter: _blur(metrics.tintBlur),
            child: ColoredBox(color: _faded(glass.tintColor, layerOpacity)),
          ),
        ),
      )
      ..add(
        Positioned.fromRect(
          rect: metrics.innerShadeRect(size),
          child: ClipRRect(
            borderRadius: radius,
            child: BackdropFilter(
              key: HoronGlassLayerKeys.innerShade,
              filter: _blur(metrics.innerShadeBlur),
              child: CustomPaint(
                painter: _HoronFlatLayerPainter(
                  color: _faded(glass.innerShadeColor, layerOpacity),
                  blendMode: BlendMode.overlay,
                ),
                child: const SizedBox.expand(),
              ),
            ),
          ),
        ),
      )
      ..add(
        Positioned.fill(
          child: CustomPaint(
            key: HoronGlassLayerKeys.edgeLightSoft,
            painter: _HoronEdgeLightPainter(
              color: _faded(glass.edgeLightSoftColor, layerOpacity),
              sigma: metrics.edgeLightBlur,
              radius: radius,
            ),
          ),
        ),
      );

    // CSS는 굴절이 켜지면 광택을 숨깁니다. 테두리는 굴절이 이미 만듭니다.
    if (rung != HoronGlassRung.refracted) {
      layers.add(
        Positioned.fill(
          child: CustomPaint(
            key: HoronGlassLayerKeys.sheen,
            painter: _HoronSheenPainter(
              radius: radius,
              padding: metrics.sheenPadding,
              strength: horonGlassSheenStrength(horon.brightness),
            ),
          ),
        ),
      );
    }

    return Stack(fit: StackFit.expand, children: layers);
  }

  ui.ImageFilter _blur(double sigma) => ui.ImageFilter.blur(sigmaX: sigma, sigmaY: sigma);

  /// 알파에 레이어 불투명도를 곱합니다. CSS는 레이어 전체에 `opacity`를 걸지만, 같은
  /// 결과를 색 알파에 곱해 얻을 수 있고 그러면 레이어 하나가 덜 필요합니다.
  Color _faded(Color color, double opacity) => color.withValues(alpha: color.a * opacity);

  /// 굴절 필터를 만듭니다. 실패하면 `null`입니다.
  ///
  /// `ui.ImageFilter.shader`는 Impeller가 아니면 `UnsupportedError`를 던집니다. 단계
  /// 판정이 이미 막지만, 판정과 실제 호출 사이에 엔진이 바뀌는 경우까지 덮습니다.
  ui.ImageFilter? _refractFilter(Size size, BorderRadius radius) {
    final ui.FragmentShader? shader = _shader;
    if (shader == null) return null;
    try {
      HoronGlassRefractValues.of(size: size, cornerRadius: _topLeft(radius)).applyTo(shader);
      return ui.ImageFilter.shader(shader);
    } catch (_) {
      return null;
    }
  }
}

/// 한 겹을 단색으로 채우는 페인터입니다.
///
/// `BlendMode.overlay`처럼 배경과 섞는 혼합은 `Paint.blendMode`로만 걸 수 있고,
/// `ColoredBox`에는 그 자리가 없습니다.
class _HoronFlatLayerPainter extends CustomPainter {
  const _HoronFlatLayerPainter({required this.color, this.blendMode = BlendMode.srcOver});

  final Color color;
  final BlendMode blendMode;

  @override
  void paint(Canvas canvas, Size size) {
    final Paint paint = Paint()
      ..color = color
      ..blendMode = blendMode;
    canvas.drawRect(Offset.zero & size, paint);
  }

  @override
  bool shouldRepaint(_HoronFlatLayerPainter oldDelegate) =>
      color != oldDelegate.color || blendMode != oldDelegate.blendMode;
}

/// 1px 테두리를 흐리게 그리는 페인터입니다.
///
/// CSS `.liquid-layers > [data-layer="edge-light-soft"]`는 `border: 1px solid`에
/// `filter: blur(clamp(...))`와 `mix-blend-mode: plus-lighter`를 겁니다. Flutter의
/// `BlendMode.plus`가 plus-lighter입니다.
class _HoronEdgeLightPainter extends CustomPainter {
  const _HoronEdgeLightPainter({required this.color, required this.sigma, required this.radius});

  final Color color;
  final double sigma;
  final BorderRadius radius;

  @override
  void paint(Canvas canvas, Size size) {
    final Rect outer = Offset.zero & size;
    final Paint paint = Paint()
      ..style = PaintingStyle.stroke
      ..strokeWidth = horonGlassEdgeWidth
      ..color = color
      ..blendMode = BlendMode.plus
      ..maskFilter = sigma > 0 ? MaskFilter.blur(BlurStyle.normal, sigma) : null;
    canvas.drawRRect(radius.toRRect(outer.deflate(horonGlassEdgeWidth / 2)), paint);
  }

  @override
  bool shouldRepaint(_HoronEdgeLightPainter oldDelegate) =>
      color != oldDelegate.color || sigma != oldDelegate.sigma || radius != oldDelegate.radius;
}

/// 광택 링을 그리는 페인터입니다.
///
/// CSS는 `padding`과 `mask-composite: exclude`로 테두리 링만 남기고, 두 그라디언트를
/// `screen`으로 얹습니다. Flutter에는 마스크 합성이 없지만, 같은 두께의 링 경로를
/// even-odd로 만들면 같은 모양이 남습니다.
class _HoronSheenPainter extends CustomPainter {
  const _HoronSheenPainter({required this.radius, required this.padding, required this.strength});

  final BorderRadius radius;
  final double padding;
  final double strength;

  @override
  void paint(Canvas canvas, Size size) {
    if (size.isEmpty) return;
    final Rect outer = Offset.zero & size;
    final ui.RRect outerRing = radius.toRRect(outer);
    final double inset = math.min(padding, math.min(size.width, size.height) / 2);
    final ui.RRect innerRing = radius.toRRect(outer.deflate(inset));
    final Path ring = Path()
      ..fillType = PathFillType.evenOdd
      ..addRRect(outerRing)
      ..addRRect(innerRing);

    final Color bright = HoronPalette.baseWhite;
    final Color clear = bright.withValues(alpha: 0);
    final LinearGradient head = LinearGradient(
      begin: Alignment.topLeft,
      end: Alignment.bottomRight,
      colors: <Color>[
        bright.withValues(alpha: strength),
        clear,
      ],
      stops: const <double>[0, 0.45],
    );
    final LinearGradient tail = LinearGradient(
      begin: Alignment.bottomRight,
      end: Alignment.topLeft,
      colors: <Color>[
        bright.withValues(alpha: strength * 0.45),
        clear,
      ],
      stops: const <double>[0, 0.4],
    );

    canvas
      ..drawPath(
        ring,
        Paint()
          ..shader = head.createShader(outer)
          ..blendMode = BlendMode.screen,
      )
      ..drawPath(
        ring,
        Paint()
          ..shader = tail.createShader(outer)
          ..blendMode = BlendMode.screen,
      );
  }

  @override
  bool shouldRepaint(_HoronSheenPainter oldDelegate) =>
      radius != oldDelegate.radius || padding != oldDelegate.padding || strength != oldDelegate.strength;
}
