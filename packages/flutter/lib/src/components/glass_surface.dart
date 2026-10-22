import 'dart:ui' as ui;

import 'package:flutter/material.dart';

import '../theme/horon_fonts.dart';
import '../theme/horon_theme.dart';
import '../tokens/horon_tokens.g.dart';

/// `globals.css`의 `.glass` / `.glass-strong` 중 어느 채움을 쓸지 고르는 값입니다.
///
/// React 소스(`glass-surface.tsx`)에는 `variants:` 블록이 없고 두 유틸은 CSS에만
/// 있으므로 공개 enum을 두지 않습니다. 호출자는 [HoronGlassSurface]와
/// [HoronGlassSurface.strong]으로 고릅니다.
enum _HoronGlassStrength { glass, strong }

/// 표면이 지금 어느 단계로 그려지는지 나타냅니다.
///
/// 웹의 강등 사다리와 같은 순서입니다: 유리(채움 + 32px 블러) → 서리(불투명도 90%,
/// 블러 없음) → 불투명(100%). 웹은 `prefers-reduced-transparency: reduce`에서 서리로,
/// `@supports not (backdrop-filter)`에서 불투명으로 내려갑니다.
enum _HoronGlassRung { glass, strong, frost, solid }

/// `glass-surface.tsx`의 `px-4 py-3`입니다.
const double _glassPaddingHorizontal = HoronSpace.s4;

/// `glass-surface.tsx`의 세로 여백입니다.
const double _glassPaddingVertical = HoronSpace.s3;

/// `glass-surface.tsx`의 `text-[13px]`입니다. 생성 스케일의 12와 14 사이 값이라
/// 이 파일이 이름을 붙여 들고 있습니다.
const double _glassFontSize = 13.0;

/// 유리 표면의 테두리 두께입니다. CSS의 `border: 1px`입니다.
const double _glassBorderWidth = 1.0;

/// 유리 표면의 채움·테두리·블러를 가진 표면입니다.
///
/// `glass-surface.tsx`의 `GlassSurface`를 옮긴 것입니다. 채움은
/// [HoronThemeData.glassFill], 테두리는 [HoronThemeData.glassBorder], 블러는
/// [horonGlassBlur](32)입니다. 반경은 `rounded-md`라 [HoronRadiusRole.card]입니다.
///
/// 웹의 강등 사다리를 그대로 따릅니다. [MediaQuery.disableAnimations]나
/// [MediaQueryData.accessibleNavigation]이 켜져 있으면 서리 단계
/// ([HoronThemeData.glassFillFrost], 불투명도 90%)로 내려가고 블러를 걸지 않습니다.
/// 그 신호가 웹의 `prefers-reduced-transparency`에 대응하는 앱 쪽 대리값입니다.
/// 블러를 아예 합성할 수 없는 호스트는 [solid]를 켜서 불투명 단계
/// ([HoronThemeData.glassFillSolid])를 씁니다. 웹의
/// `@supports not (backdrop-filter)` 자리입니다.
///
/// 블러는 뒤에 있는 내용을 흐리게 만드는 효과라, 이 표면은 반드시 내용 위에
/// 겹쳐 놓아야 의미가 있습니다. 성능 때문에 스크롤 목록의 항목마다 중첩하지
/// 않습니다.
///
/// ```dart
/// Stack(children: <Widget>[
///   const Positioned.fill(child: Photo()),
///   Center(child: HoronGlassSurface(child: Text('유리 위 글자'))),
/// ]);
/// ```
class HoronGlassSurface extends StatelessWidget {
  /// `.glass` 표면을 만듭니다.
  const HoronGlassSurface({
    super.key,
    required this.child,
    this.padding = const EdgeInsets.symmetric(horizontal: _glassPaddingHorizontal, vertical: _glassPaddingVertical),
    this.borderRadius,
    this.solid = false,
  }) : _strength = _HoronGlassStrength.glass;

  /// `.glass-strong` 표면을 만듭니다. 채움이 65%로 진해집니다.
  const HoronGlassSurface.strong({
    super.key,
    required this.child,
    this.padding = const EdgeInsets.symmetric(horizontal: _glassPaddingHorizontal, vertical: _glassPaddingVertical),
    this.borderRadius,
    this.solid = false,
  }) : _strength = _HoronGlassStrength.strong;

  /// 표면 안에 넣을 내용입니다.
  final Widget child;

  /// 안쪽 여백입니다. 기본값은 `px-4 py-3`(16/12)입니다.
  final EdgeInsetsGeometry padding;

  /// 표면의 반경입니다. 없으면 [HoronRadiusRole.card]입니다.
  final BorderRadius? borderRadius;

  /// 블러를 합성할 수 없는 호스트에서 불투명 단계를 쓸지 여부입니다.
  final bool solid;

  final _HoronGlassStrength _strength;

  /// 지금 밝기·접근성 설정에서 그릴 단계를 정합니다.
  _HoronGlassRung _rungOf(BuildContext context) {
    if (solid) return _HoronGlassRung.solid;
    final MediaQueryData query = MediaQuery.of(context);
    // `prefers-reduced-transparency`의 앱 쪽 대리 신호입니다. 웹은 이 신호에서
    // 서리 단계로 내려가고, 그 값이 `glass-fill-frost`(불투명도 90%)입니다.
    if (query.disableAnimations || query.accessibleNavigation) return _HoronGlassRung.frost;
    return _strength == _HoronGlassStrength.strong ? _HoronGlassRung.strong : _HoronGlassRung.glass;
  }

  @override
  Widget build(BuildContext context) {
    final HoronThemeData horon = HoronTheme.of(context);
    final _HoronGlassRung rung = _rungOf(context);
    final BorderRadius radius = borderRadius ?? BorderRadius.circular(HoronRadiusRole.card);

    final Color fill = switch (rung) {
      _HoronGlassRung.glass => horon.glassFill,
      _HoronGlassRung.strong => horon.glassFillStrong,
      _HoronGlassRung.frost => horon.glassFillFrost,
      _HoronGlassRung.solid => horon.glassFillSolid,
    };
    final bool blurred = rung == _HoronGlassRung.glass || rung == _HoronGlassRung.strong;

    final Widget surface = DecoratedBox(
      decoration: BoxDecoration(
        color: fill,
        borderRadius: radius,
        border: Border.all(color: horon.glassBorder, width: _glassBorderWidth),
      ),
      child: Padding(padding: padding, child: child),
    );

    final Widget layered = blurred
        ? BackdropFilter(
            filter: ui.ImageFilter.blur(sigmaX: horonGlassBlur, sigmaY: horonGlassBlur),
            child: surface,
          )
        : surface;

    final TextStyle textStyle = TextStyle(
      fontFamily: HoronFont.body,
      fontFamilyFallback: HoronFont.fontFamilyFallback,
      fontSize: _glassFontSize,
      height: HoronLineHeight.normal,
      color: horon.glassForeground,
      // Material 조상이 없는 자리에서 기본 `DefaultTextStyle`의 노란 이중 밑줄이
      // 새어 들어오지 않게 명시합니다.
      decoration: TextDecoration.none,
    );

    return DefaultTextStyle.merge(style: textStyle, child: layered);
  }
}
