import 'package:flutter/material.dart';

import '../glass/glass_geometry.dart';
import '../glass/horon_glass.dart';
import '../theme/horon_motion.dart';
import '../theme/horon_theme.dart';

/// `banner.tsx`의 `BannerTone`입니다.
enum HoronBannerTone {
  /// `tone="info"` — 브랜드 테두리와 브랜드 글자입니다.
  info,

  /// `tone="danger"` — 위험 테두리와 위험 글자입니다.
  danger,
}

/// `banner.tsx`의 `BannerSurface`입니다.
enum HoronBannerSurface {
  /// `surface="solid"` — 불투명 `bg-surface`에 톤 테두리. 기본값입니다.
  solid,

  /// `surface="glass"` — 이미지나 유리 패널 위의 유리 표면입니다.
  glass,
}

/// `banner.tsx`의 `BannerSize`입니다.
enum HoronBannerSize {
  /// `size="sm"` — 최소 높이 32, `body-sm`, 아이콘 16px.
  sm,

  /// `size="md"` — Figma 기본 띠(48), `body-md`, 아이콘 18px.
  md,

  /// `size="lg"` — 높이 56, `body-lg`, 아이콘 20px.
  lg,
}

typedef _BannerMetrics = ({
  double gap,
  double paddingX,
  double paddingY,
  double icon,
  TextStyle textStyle,
  TextStyle action,
});

_BannerMetrics _metricsOf(HoronBannerSize size, HoronThemeData theme) => switch (size) {
  HoronBannerSize.sm => (
    gap: theme.space.s2,
    paddingX: theme.space.s3,
    paddingY: theme.space.s2,
    icon: 16,
    textStyle: theme.text.bodySm,
    action: theme.text.labelMd,
  ),
  HoronBannerSize.md => (
    gap: theme.space.s3,
    paddingX: theme.space.s4,
    paddingY: theme.space.s3,
    icon: 18,
    textStyle: theme.text.bodyMd,
    action: theme.text.labelLg,
  ),
  HoronBannerSize.lg => (
    gap: theme.space.s3,
    paddingX: theme.space.s5,
    paddingY: theme.space.s3_5,
    icon: 20,
    textStyle: theme.text.bodyLg,
    action: theme.text.labelLg,
  ),
};

/// Paper `TYN-1`의 액션 줄 높이입니다. `label-lg`의 22px보다 2px 낮은 20px입니다.
const double _bannerActionLineHeight = 20;

/// Paper `TYN-1`의 액션 자간입니다. `label-lg`의 -0.08px보다 좁은 -0.04px입니다.
const double _bannerActionLetterSpacing = -0.04;

/// Figma `Banner`(62:318): 색이 밴 띠를 두른 regular 유리 띠에 18px 아이콘과 밑줄 동작을 얹습니다.
///
/// `banner.tsx`를 옮긴 것입니다. 표면은 `bg-glass-regular`라 [HoronLiquidGlass]가
/// 뒤에서 칠하고, 테두리·글자는 [tone]이 정합니다. 위험 톤은 화면 낭독기에서
/// `alert`로, 정보 톤은 `status`로 읽힙니다. 등장할 때 React의
/// `tab-panel-in 220ms`와 같은 페이드·이동을 씁니다.
class HoronBanner extends StatelessWidget {
  /// 띠를 만듭니다.
  const HoronBanner({
    super.key,
    required this.message,
    this.tone = HoronBannerTone.info,
    this.action,
    this.icon,
    this.size = HoronBannerSize.md,
    this.surface = HoronBannerSurface.solid,
  });

  /// 표면입니다. 기본값은 [HoronBannerSurface.solid]입니다.
  final HoronBannerSurface surface;

  /// 본문입니다.
  final String message;

  /// 크기입니다. 기본값은 [HoronBannerSize.md]입니다.
  final HoronBannerSize size;

  /// 톤입니다.
  final HoronBannerTone tone;

  /// 오른쪽에 붙는 밑줄 동작입니다.
  final Widget? action;

  /// 앞 아이콘입니다. 넘기지 않으면 톤에 맞는 기본 아이콘을 씁니다.
  final Widget? icon;

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    final bool danger = tone == HoronBannerTone.danger;
    final _BannerMetrics metrics = _metricsOf(size, theme);
    final Color accent = danger ? theme.colors.textDanger : theme.colors.textBrand;
    final Color edge = danger ? theme.colors.borderDanger : theme.colors.borderBrand;
    final BorderRadius radius = BorderRadius.circular(theme.radius.md);
    final bool animate = !MediaQuery.disableAnimationsOf(context);

    final Widget content = Padding(
      padding: EdgeInsets.symmetric(horizontal: metrics.paddingX, vertical: metrics.paddingY),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.center,
        children: <Widget>[
          IconTheme.merge(
            data: IconThemeData(size: metrics.icon, color: accent),
            child: icon ?? Icon(danger ? Icons.error_outline : Icons.info_outline),
          ),
          SizedBox(width: metrics.gap),
          Expanded(
            child: Text(message, style: metrics.textStyle.copyWith(color: accent)),
          ),
          if (action != null) ...<Widget>[
            SizedBox(width: metrics.gap),
            DefaultTextStyle.merge(
              style: metrics.action.copyWith(
                color: accent,
                height: _bannerActionLineHeight / metrics.action.fontSize!,
                letterSpacing: _bannerActionLetterSpacing,
                decoration: TextDecoration.underline,
                decorationColor: accent,
              ),
              child: action!,
            ),
          ],
        ],
      ),
    );

    final Widget surfaceBody = surface == HoronBannerSurface.glass
        ? Stack(
            children: <Widget>[
              Positioned.fill(
                child: HoronLiquidGlass(
                  tier: HoronGlassTier.regular,
                  borderRadius: radius,
                  edgeColor: edge,
                  child: const SizedBox.expand(),
                ),
              ),
              content,
            ],
          )
        : Container(
            decoration: BoxDecoration(
              color: theme.colors.bgSurface,
              borderRadius: radius,
              border: Border.all(color: edge),
            ),
            child: content,
          );

    final Widget body = Semantics(
      liveRegion: danger,
      container: true,
      label: danger ? '경고' : '안내',
      child: ClipRRect(borderRadius: radius, child: surfaceBody),
    );

    if (!animate) return body;
    return TweenAnimationBuilder<double>(
      tween: Tween<double>(begin: 0, end: 1),
      duration: const Duration(milliseconds: 220),
      curve: HoronMotion.easeOutQuint,
      builder: (BuildContext context, double t, Widget? child) {
        return Opacity(
          opacity: t,
          child: Transform.translate(offset: Offset(0, 4 * (1 - t)), child: child),
        );
      },
      child: body,
    );
  }
}
