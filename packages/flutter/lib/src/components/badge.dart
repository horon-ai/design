import 'package:flutter/material.dart';

import '../theme/horon_theme.dart';

/// `badge.tsx`의 `BadgeTone`입니다.
enum HoronBadgeTone {
  /// `tone="neutral"` — 6% 잉크 바탕에 보조 글자색입니다.
  neutral,

  /// `tone="brand"` — 하늘색 18% 바탕에 브랜드 글자색입니다.
  brand,

  /// `tone="danger"` — 위험색 14% 바탕에 위험 글자색입니다.
  danger,

  /// `tone="solid"` — 잉크 바탕에 반대색 글자입니다.
  solid,

  /// `tone="surface"` — 올라온 흰 알약에 1px 기본 테두리와 기본 글자색입니다.
  surface,
}

/// `badge.tsx`의 `BadgeSize`입니다.
enum HoronBadgeSize {
  /// `size="sm"` — 높이 20, `caption`, 점 4px.
  sm,

  /// `size="md"` — 높이 22, `label-sm`, 점 6px. 기본값입니다.
  md,

  /// `size="lg"` — 높이 26, `label-md`, 점 8px.
  lg,
}

typedef _BadgeMetrics = ({double height, double paddingX, double gap, double dot, TextStyle textStyle});

_BadgeMetrics _metricsOf(HoronBadgeSize size, HoronThemeData theme) => switch (size) {
  HoronBadgeSize.sm => (
    height: 20,
    paddingX: theme.space.s1_5,
    gap: theme.space.s1,
    dot: 4,
    textStyle: theme.text.caption,
  ),
  HoronBadgeSize.md => (
    height: 22,
    paddingX: theme.space.s2,
    gap: theme.space.s1_5,
    dot: 6,
    textStyle: theme.text.labelSm,
  ),
  HoronBadgeSize.lg => (
    height: 26,
    paddingX: theme.space.s2_5,
    gap: theme.space.s1_5,
    dot: 8,
    textStyle: theme.text.labelMd,
  ),
};

/// Figma `Badge`(61:283): 22px 반투명 알약에 `label-sm` 글자를 얹은 상태 표시입니다.
///
/// `badge.tsx`를 옮긴 것입니다. 네 톤이 각각 바탕과 글자색을 정하고, [dot]을 켜면
/// 앞에 6px 상태 점이 붙습니다. 반경은 `rounded-full`입니다.
class HoronBadge extends StatelessWidget {
  /// 배지를 만듭니다.
  const HoronBadge({
    super.key,
    required this.label,
    this.tone = HoronBadgeTone.neutral,
    this.dot = false,
    this.size = HoronBadgeSize.md,
  });

  /// 표시할 글자입니다.
  final String label;

  /// 크기입니다. 기본값은 [HoronBadgeSize.md]입니다.
  final HoronBadgeSize size;

  /// 색조입니다.
  final HoronBadgeTone tone;

  /// 앞에 6px 상태 점을 붙입니다.
  final bool dot;

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);

    final (Color background, Color foreground) = switch (tone) {
      HoronBadgeTone.neutral => (theme.colors.overlayInk6, theme.colors.textSecondary),
      HoronBadgeTone.brand => (theme.colors.accentSky500_18, theme.colors.textBrand),
      HoronBadgeTone.danger => (theme.colors.accentRed500_14, theme.colors.textDanger),
      HoronBadgeTone.solid => (theme.colors.interactivePrimary, theme.colors.interactiveOnPrimary),
      HoronBadgeTone.surface => (theme.colors.bgSurface, theme.colors.textPrimary),
    };
    final Color dotColor = switch (tone) {
      HoronBadgeTone.neutral => theme.colors.textSecondary,
      HoronBadgeTone.brand => theme.colors.statusLive,
      HoronBadgeTone.danger => theme.colors.textDanger,
      HoronBadgeTone.solid => theme.colors.interactiveOnPrimary,
      HoronBadgeTone.surface => theme.colors.textPrimary,
    };

    final _BadgeMetrics metrics = _metricsOf(size, theme);
    return Container(
      height: metrics.height,
      padding: EdgeInsets.symmetric(horizontal: metrics.paddingX),
      decoration: BoxDecoration(
        color: background,
        borderRadius: BorderRadius.circular(theme.radius.full),
        border: tone == HoronBadgeTone.surface ? Border.all(color: theme.colors.borderDefault) : null,
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: <Widget>[
          if (dot) ...<Widget>[
            Container(
              width: metrics.dot,
              height: metrics.dot,
              decoration: BoxDecoration(color: dotColor, shape: BoxShape.circle),
            ),
            SizedBox(width: metrics.gap),
          ],
          Text(
            label,
            maxLines: 1,
            softWrap: false,
            overflow: TextOverflow.ellipsis,
            style: metrics.textStyle.copyWith(color: foreground),
          ),
        ],
      ),
    );
  }
}
