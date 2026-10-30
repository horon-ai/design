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
}

/// `badge.tsx`의 `h-5.5`입니다.
const double _badgeHeight = 22;

/// `badge.tsx`의 `px-2`입니다.
const double _badgePaddingX = 8;

/// `badge.tsx`의 `gap-1.5`입니다.
const double _badgeGap = 6;

/// `badge.tsx`의 `size-1.5`입니다. 앞 상태 점의 지름입니다.
const double _dotSize = 6;

/// Figma `Badge`(61:283): 22px 반투명 알약에 `label-sm` 글자를 얹은 상태 표시입니다.
///
/// `badge.tsx`를 옮긴 것입니다. 네 톤이 각각 바탕과 글자색을 정하고, [dot]을 켜면
/// 앞에 6px 상태 점이 붙습니다. 반경은 `rounded-full`입니다.
class HoronBadge extends StatelessWidget {
  /// 배지를 만듭니다.
  const HoronBadge({super.key, required this.label, this.tone = HoronBadgeTone.neutral, this.dot = false});

  /// 표시할 글자입니다.
  final String label;

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
    };
    final Color dotColor = switch (tone) {
      HoronBadgeTone.neutral => theme.colors.textSecondary,
      HoronBadgeTone.brand => theme.colors.statusLive,
      HoronBadgeTone.danger => theme.colors.textDanger,
      HoronBadgeTone.solid => theme.colors.interactiveOnPrimary,
    };

    return Container(
      height: _badgeHeight,
      padding: const EdgeInsets.symmetric(horizontal: _badgePaddingX),
      decoration: BoxDecoration(color: background, borderRadius: BorderRadius.circular(theme.radius.full)),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: <Widget>[
          if (dot) ...<Widget>[
            Container(
              width: _dotSize,
              height: _dotSize,
              decoration: BoxDecoration(color: dotColor, shape: BoxShape.circle),
            ),
            const SizedBox(width: _badgeGap),
          ],
          Text(
            label,
            maxLines: 1,
            softWrap: false,
            overflow: TextOverflow.ellipsis,
            style: theme.text.labelSm.copyWith(color: foreground),
          ),
        ],
      ),
    );
  }
}
