// 글래스 표면입니다. 웹(`packages/react`)·데스크톱·모바일이 같은 재료를 씁니다.
//
// 층은 아래에서 위로 셋입니다.
//
//   1. 뒤 배경 — `blur`만큼 흐린 뒤 `saturate`만큼 채도를 올립니다. 둘 다 토큰 값이고,
//      CSS `blur()`와 Flutter `ImageFilter.blur`가 같은 가우스 표준편차를 받으므로
//      같은 수치를 그대로 넘깁니다.
//   2. 채움     — 티어 색(glass-clear/regular/thick) 한 겹.
//   3. 림       — 표면 안쪽 가장자리의 1px 링. 위에서 아래로 밝음 → `rimMidStop` → 밝음
//      그라디언트를 칠합니다. 호스트가 상태(선택·대기·위험·오류)를 알리면 [edgeColor]로
//      링 전체를 그 단색으로 칠합니다.
//
// 굴절·질감·안쪽 그늘·광택·혼합 모드는 없습니다. 그림자도 재료가 아니라 컴포넌트의
// 몫이므로, 떠 있는 표면은 자기 그림자를 `HoronShadow`에서 골라 답니다.
//
// 뒤 배경을 필터할 수 없을 때(동작 줄이기 설정)는 `BackdropFilter` 없이
// `glass-fill-frost` 한 겹으로 그리고 림은 그대로 남깁니다.

import 'package:flutter/widgets.dart';

import '../theme/horon_theme.dart';
import '../tokens/horon_tokens.g.dart';
import 'glass_geometry.dart';

/// 글래스 표면의 노드를 찾기 위한 키입니다. 테스트가 각 층을 검사합니다.
abstract final class HoronGlassKeys {
  /// 채움 레이어입니다. 서리 단계에서도 있습니다.
  static const Key fill = Key('horon-glass-fill');

  /// 뒤 배경을 필터하는 레이어입니다. 서리 단계에는 없습니다.
  static const Key backdrop = Key('horon-glass-backdrop');

  /// 안쪽 가장자리 림입니다.
  static const Key rim = Key('horon-glass-rim');
}

/// 뒤 배경이 있는 자리에 얹는 유리 표면입니다.
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
/// 표면은 내용의 크기를 따르고, 모서리는 [borderRadius]로 자릅니다. 그림자를 원하는
/// 호출자는 이 위젯 바깥에 `DecoratedBox` 등으로 자기 그림자를 답니다.
///
/// 상태 테두리(선택·대기·위험·오류)는 호스트 위에 겹쳐 그리지 않고 [edgeColor]로
/// 림에 칠합니다. React의 `--glass-edge`와 같은 자리입니다.
class HoronLiquidGlass extends StatelessWidget {
  /// 표면을 만듭니다.
  const HoronLiquidGlass({
    super.key,
    this.tier = HoronGlassTier.clear,
    this.borderRadius,
    this.edgeColor,
    required this.child,
  });

  /// 채움 두께입니다. React `tier`와 같은 세 값입니다.
  final HoronGlassTier tier;

  /// 표면의 반경입니다. 없으면 테마의 `radius.md`(12)입니다.
  final BorderRadius? borderRadius;

  /// 림 전체를 이 단색으로 칠합니다. 없으면 밝기별 세로 그라디언트입니다.
  ///
  /// 호스트의 상태(선택·대기·위험·오류)를 표시할 때 테두리를 겹쳐 그리는 대신
  /// 이 값을 넘깁니다. React는 같은 자리를 `--glass-edge`로 칠합니다.
  final Color? edgeColor;

  /// 표면 안에 넣을 내용입니다. 내용이 표면의 크기를 정합니다.
  final Widget child;

  @override
  Widget build(BuildContext context) {
    final HoronThemeData horon = HoronTheme.of(context);
    final BorderRadius radius = borderRadius ?? BorderRadius.circular(horon.radius.md);
    final HoronGlassTokens glass = horon.glass;

    // 동작 줄이기 설정은 기존 입력입니다. 이 설정이 켜지면 뒤 배경을 필터하지 않고
    // 불투명한 서리 채움으로 내려갑니다. 림은 그대로 남습니다.
    final bool frost = MediaQuery.maybeDisableAnimationsOf(context) ?? false;
    final Color fill = frost ? horon.colors.glassFillFrost : horonGlassTierFill(tier, horon.colors);
    final HoronGlassRim rim = glass.rimFor(horon.brightness);

    return ClipRRect(
      borderRadius: radius,
      child: Stack(
        fit: StackFit.passthrough,
        children: <Widget>[
          Positioned.fill(
            child: frost
                ? ColoredBox(key: HoronGlassKeys.fill, color: fill)
                : BackdropFilter(
                    key: HoronGlassKeys.backdrop,
                    filter: horonGlassBackdropFilter(glass),
                    child: ColoredBox(key: HoronGlassKeys.fill, color: fill),
                  ),
          ),
          Positioned.fill(
            child: IgnorePointer(
              child: CustomPaint(
                key: HoronGlassKeys.rim,
                painter: HoronGlassRimPainter(
                  radius: radius,
                  rim: rim,
                  width: glass.rimWidth,
                  midStop: glass.rimMidStop,
                  edgeColor: edgeColor,
                ),
              ),
            ),
          ),
          child,
        ],
      ),
    );
  }
}

/// 표면 안쪽 가장자리에 세로 그라디언트 림을 그리는 페인터입니다.
///
/// 링은 테두리 안쪽에 놓입니다. 선 두께의 절반만큼 사각형을 안쪽으로 넣어야 획이
/// 표면 밖으로 나가지 않고 1px이 정확히 가장자리에 붙습니다.
class HoronGlassRimPainter extends CustomPainter {
  /// 값을 그대로 받는 생성자입니다.
  const HoronGlassRimPainter({
    required this.radius,
    required this.rim,
    required this.width,
    required this.midStop,
    this.edgeColor,
  });

  /// 표면의 모서리 반경입니다.
  final BorderRadius radius;

  /// 밝기별 림 색입니다.
  final HoronGlassRim rim;

  /// 림의 두께(논리 픽셀)입니다.
  final double width;

  /// 가운데 색이 놓이는 자리(0~1)입니다.
  final double midStop;

  /// 림 전체를 칠할 단색입니다. 없으면 [gradient]를 씁니다.
  final Color? edgeColor;

  /// 위에서 아래로 가는 림 그라디언트입니다.
  LinearGradient get gradient => LinearGradient(
    begin: Alignment.topCenter,
    end: Alignment.bottomCenter,
    colors: rim.colors,
    stops: rim.stops(midStop),
  );

  @override
  void paint(Canvas canvas, Size size) {
    if (size.isEmpty || width <= 0) return;
    final Rect bounds = Offset.zero & size;
    final RRect ring = radius.toRRect(bounds.deflate(width / 2));
    final Color? solid = edgeColor;
    final Paint paint = Paint()
      ..style = PaintingStyle.stroke
      ..strokeWidth = width
      ..shader = solid == null ? gradient.createShader(bounds) : null
      ..color = solid ?? const Color(0x00000000);
    canvas.drawRRect(ring, paint);
  }

  @override
  bool shouldRepaint(HoronGlassRimPainter oldDelegate) =>
      radius != oldDelegate.radius ||
      rim != oldDelegate.rim ||
      width != oldDelegate.width ||
      midStop != oldDelegate.midStop ||
      edgeColor != oldDelegate.edgeColor;
}
