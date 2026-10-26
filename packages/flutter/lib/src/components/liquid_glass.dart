import 'dart:ui' as ui;

import 'package:flutter/material.dart';

import '../theme/horon_fonts.dart';
import '../tokens/horon_tokens.g.dart';

/// `scales.ts`의 `glassLiquidFill` 정지점입니다. 첫 색이 10%에서 끝나고 마지막 색이
/// 아래 끝까지 이어집니다.
const List<double> _fillStops = <double>[0.1, 1];

/// `scales.ts`의 `glassLiquidBorder` 정지점입니다.
///
/// `linear-gradient(white/α 40%, transparent 75% 95%, white/α)`이라 위에서 40%까지
/// 밝고, 75~95%가 투명하며, 마지막 5%가 다시 밝습니다.
const List<double> _borderStops = <double>[0, 0.4, 0.75, 0.95, 1];

/// `scales.ts`의 `glassLiquidBorder`가 밝은 구간에서 쓰는 흰색 불투명도입니다.
///
/// light는 `oklch(1 0 0 / 0.64)`, dark는 `oklch(1 0 0 / 0.24)`입니다.
const double _borderAlphaLight = 0.64;
const double _borderAlphaDark = 0.24;

/// `scales.ts`의 `glassLiquidShadow` 두 겹입니다.
///
/// light: `0 12px 12px 2px oklch(0 0 0 / 0.1), 0 2px 4px -1px oklch(0 0 0 / 0.06)`
/// dark: `0 12px 12px 2px oklch(0 0 0 / 0.4), 0 2px 4px -1px oklch(0 0 0 / 0.3)`
const double _shadowAlphaNearLight = 0.1;
const double _shadowAlphaNearDark = 0.4;
const double _shadowAlphaFarLight = 0.06;
const double _shadowAlphaFarDark = 0.3;

/// 그림자 첫 겹의 오프셋·번짐·확산입니다(`0 12px 12px 2px`).
const Offset _shadowNearOffset = Offset(0, 12);
const double _shadowNearBlur = 12;
const double _shadowNearSpread = 2;

/// 그림자 둘째 겹입니다(`0 2px 4px -1px`).
const Offset _shadowFarOffset = Offset(0, 2);
const double _shadowFarBlur = 4;
const double _shadowFarSpread = -1;

/// 그라디언트 테두리 두께입니다. CSS `padding: 1px` + 마스크 조합이 남기는 1px입니다.
const double _borderWidth = 1;

/// 표면의 기본 반경입니다. React의 `rounded-md`입니다.
const double _defaultRadius = HoronRadiusRole.card;

/// CSS `oklch(1 0 0 / α)`의 흰색입니다.
///
/// 팔레트에는 순수 흰색이 없고 가장 밝은 단계가 sand-100(#FAFAFA)입니다. 두 값의
/// 밝기 차이는 2%라 같은 표면으로 읽히고, 값은 토큰에서 옵니다. 리터럴을 쓰지 않는
/// 이유는 이 파일도 컴포넌트이고 raw literal 게이트가 `lib/src/components/**`를
/// 검사하기 때문입니다.
Color _white(double alpha) => HoronPalette.sand100.withValues(alpha: alpha);

/// CSS `oklch(0 0 0 / α)`의 검정입니다.
///
/// 팔레트의 잉크(sand-1200, #0A0A0A)를 씁니다. 그림자 토큰 `sand1200Shadow`도 같은
/// 잉크에 알파를 준 값이라, 이 표면의 그림자가 나머지 그림자와 같은 색 계열입니다.
Color _ink(double alpha) => HoronPalette.sand1200.withValues(alpha: alpha);

/// 채움 그라디언트의 색 두 개입니다.
///
/// `glassLiquidFill`(헤더)과 `glassLiquidFillPanel`(목록 패널)이 여기 대응합니다.
/// 패널 채움만 진합니다. 블러·링·그림자는 두 채움이 공유합니다.
class _HoronLiquidFill {
  const _HoronLiquidFill({required this.top, required this.bottom});

  final Color top;
  final Color bottom;
}

/// 밝기별 채움 색입니다.
///
/// light: `linear-gradient(180deg, oklch(1 0 0 / 0.4) 10%, oklch(1 0 0 / 0.8))`
/// dark: `linear-gradient(180deg, oklch(1 0 0 / 0.08) 10%, oklch(1 0 0 / 0.14))`
_HoronLiquidFill _headerFill(Brightness brightness) {
  if (brightness == Brightness.dark) {
    return _HoronLiquidFill(top: _white(0.08), bottom: _white(0.14));
  }
  return _HoronLiquidFill(top: _white(0.4), bottom: _white(0.8));
}

/// 패널 채움입니다.
///
/// light는 `oklch(1 0 0 / 0.94)`에서 0.98로, dark는 sand-1100 94%에서 dark card
/// 98%로 갑니다. 목록을 담는 넓은 표면이라 뒤 내용이 링크 사이로 읽히지 않게
/// 진합니다.
_HoronLiquidFill _panelFill(Brightness brightness) {
  if (brightness == Brightness.dark) {
    return _HoronLiquidFill(
      top: HoronPalette.sand1100.withValues(alpha: 0.94),
      bottom: HoronDarkColors.card.withValues(alpha: 0.98),
    );
  }
  return _HoronLiquidFill(top: _white(0.94), bottom: _white(0.98));
}

/// 채움 그라디언트입니다. CSS의 `180deg`는 위에서 아래입니다.
LinearGradient _fillGradient(_HoronLiquidFill fill) => LinearGradient(
  begin: Alignment.topCenter,
  end: Alignment.bottomCenter,
  colors: <Color>[fill.top, fill.bottom],
  stops: _fillStops,
);

/// 테두리 그라디언트입니다. 같은 방향이고 위·아래만 밝습니다.
LinearGradient _borderGradient(Brightness brightness) {
  final Color bright = _white(brightness == Brightness.dark ? _borderAlphaDark : _borderAlphaLight);
  return LinearGradient(
    begin: Alignment.topCenter,
    end: Alignment.bottomCenter,
    colors: <Color>[bright, bright, Colors.transparent, Colors.transparent, bright],
    stops: _borderStops,
  );
}

/// 두 겹 그림자입니다.
List<BoxShadow> _shadows(Brightness brightness) {
  final bool dark = brightness == Brightness.dark;
  return <BoxShadow>[
    BoxShadow(
      color: _ink(dark ? _shadowAlphaNearDark : _shadowAlphaNearLight),
      offset: _shadowNearOffset,
      blurRadius: _shadowNearBlur,
      spreadRadius: _shadowNearSpread,
    ),
    BoxShadow(
      color: _ink(dark ? _shadowAlphaFarDark : _shadowAlphaFarLight),
      offset: _shadowFarOffset,
      blurRadius: _shadowFarBlur,
      spreadRadius: _shadowFarSpread,
    ),
  ];
}

/// 테두리 그라디언트를 1px 링으로만 남기는 페인터입니다.
///
/// CSS는 `padding: 1px` + `mask-composite: exclude`로 내용 상자를 잘라냅니다.
/// Flutter에는 그 마스크 조합이 없지만, 둥근 사각형의 테두리를 1px로 그리고 그
/// 획에 그라디언트 셰이더를 물리면 남는 것은 같은 1px 링입니다. 링은 반경 안쪽에
/// 그려져 표면 밖으로 나가지 않습니다.
class _HoronLiquidGlassBorderPainter extends CustomPainter {
  const _HoronLiquidGlassBorderPainter({required this.brightness, required this.radius});

  final Brightness brightness;
  final double radius;

  @override
  void paint(Canvas canvas, Size size) {
    final Rect outer = Offset.zero & size;
    // 획은 경로 가운데에 걸치므로 반경을 절반만큼 안으로 줄여야 표면과 맞습니다.
    final RRect ring = RRect.fromRectAndRadius(
      outer.deflate(_borderWidth / 2),
      Radius.circular(radius > _borderWidth / 2 ? radius - _borderWidth / 2 : radius),
    );
    final Paint paint = Paint()
      ..style = PaintingStyle.stroke
      ..strokeWidth = _borderWidth
      ..shader = _borderGradient(brightness).createShader(outer);
    canvas.drawRRect(ring, paint);
  }

  @override
  bool shouldRepaint(_HoronLiquidGlassBorderPainter oldDelegate) =>
      brightness != oldDelegate.brightness || radius != oldDelegate.radius;
}

/// baalda.com 헤더에서 실측한 액체 유리 표면입니다.
///
/// `liquid-glass.tsx`와 `scales.ts`의 값을 그대로 옮긴 네 겹입니다.
///
/// 1. 세로 그라디언트 채움 - light는 흰색 40%→80%, dark는 8%→14%
/// 2. 낮은 블러 - [horonGlassLiquidBlur] 4px
/// 3. 마스킹된 1px 그라디언트 테두리 - 위 40%가 밝고 75~95%가 투명합니다
/// 4. 두 겹 그림자 - `0 12px 12px 2px`와 `0 2px 4px -1px`
///
/// 반경은 React의 `rounded-md`와 같은 [HoronRadiusRole.card]입니다. 목록을 담는
/// 넓은 표면은 [HoronLiquidGlass.panel]이 진한 채움으로 그립니다.
///
/// ```dart
/// HoronLiquidGlass(
///   padding: const EdgeInsets.symmetric(horizontal: HoronSpace.s4),
///   child: Row(children: <Widget>[brand, const Spacer(), actions]),
/// );
/// ```
class HoronLiquidGlass extends StatelessWidget {
  /// 헤더 채움으로 표면을 만듭니다.
  const HoronLiquidGlass({super.key, required this.child, this.padding = EdgeInsets.zero, this.borderRadius})
    : _panel = false;

  /// 목록을 담는 패널 채움으로 표면을 만듭니다.
  const HoronLiquidGlass.panel({super.key, required this.child, this.padding = EdgeInsets.zero, this.borderRadius})
    : _panel = true;

  /// 표면 위에 얹을 내용입니다.
  final Widget child;

  /// 안쪽 여백입니다. React는 여백을 정하지 않으므로 기본값은 0입니다.
  final EdgeInsetsGeometry padding;

  /// 표면의 반경입니다. 없으면 [HoronRadiusRole.card]입니다.
  final BorderRadius? borderRadius;

  final bool _panel;

  @override
  Widget build(BuildContext context) {
    final ThemeData theme = Theme.of(context);
    final Brightness brightness = theme.brightness;
    final BorderRadius radius = borderRadius ?? BorderRadius.circular(_defaultRadius);
    final _HoronLiquidFill fill = _panel ? _panelFill(brightness) : _headerFill(brightness);
    // React의 `text-foreground`입니다. 글자 크기는 정하지 않고 부모 것을 이어받습니다.
    final TextStyle textStyle = TextStyle(
      fontFamily: HoronFont.body,
      fontFamilyFallback: HoronFont.fontFamilyFallback,
      color: theme.colorScheme.onSurface,
      decoration: TextDecoration.none,
    );

    return DecoratedBox(
      // 그림자는 클립 바깥으로 퍼져야 하므로 클립보다 먼저 칠합니다.
      decoration: BoxDecoration(borderRadius: radius, boxShadow: _shadows(brightness)),
      child: ClipRRect(
        borderRadius: radius,
        child: BackdropFilter(
          filter: ui.ImageFilter.blur(sigmaX: horonGlassLiquidBlur, sigmaY: horonGlassLiquidBlur),
          child: DecoratedBox(
            decoration: BoxDecoration(borderRadius: radius, gradient: _fillGradient(fill)),
            child: CustomPaint(
              foregroundPainter: _HoronLiquidGlassBorderPainter(brightness: brightness, radius: _defaultRadius),
              child: DefaultTextStyle.merge(
                style: textStyle,
                child: Padding(padding: padding, child: child),
              ),
            ),
          ),
        ),
      ),
    );
  }
}
