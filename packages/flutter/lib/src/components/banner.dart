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

/// `banner.tsx`의 `gap-3`입니다.
const double _bannerGap = 12;

/// `banner.tsx`의 `px-4`입니다.
const double _bannerPaddingX = 16;

/// `banner.tsx`의 `py-3`입니다.
const double _bannerPaddingY = 12;

/// `banner.tsx`의 `[&_svg]:size-4.5`입니다.
const double _bannerIconSize = 18;

/// Figma `Banner`(62:318): 색이 밴 띠를 두른 regular 유리 띠에 18px 아이콘과 밑줄 동작을 얹습니다.
///
/// `banner.tsx`를 옮긴 것입니다. 표면은 `bg-glass-regular`라 [HoronLiquidGlass]가
/// 뒤에서 칠하고, 테두리·글자는 [tone]이 정합니다. 위험 톤은 화면 낭독기에서
/// `alert`로, 정보 톤은 `status`로 읽힙니다. 등장할 때 React의
/// `tab-panel-in 220ms`와 같은 페이드·이동을 씁니다.
class HoronBanner extends StatelessWidget {
  /// 띠를 만듭니다.
  const HoronBanner({super.key, required this.message, this.tone = HoronBannerTone.info, this.action, this.icon});

  /// 본문입니다.
  final String message;

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
    final Color accent = danger ? theme.colors.textDanger : theme.colors.textBrand;
    final Color border = danger ? theme.colors.borderDanger : theme.colors.borderBrand;
    final BorderRadius radius = BorderRadius.circular(theme.radius.md);
    final bool animate = !MediaQuery.disableAnimationsOf(context);

    final Widget body = Semantics(
      liveRegion: danger,
      container: true,
      label: danger ? '경고' : '안내',
      child: ClipRRect(
        borderRadius: radius,
        child: Stack(
          children: <Widget>[
            Positioned.fill(
              child: HoronLiquidGlass(
                tier: HoronGlassTier.regular,
                borderRadius: radius,
                child: const SizedBox.expand(),
              ),
            ),
            Container(
              decoration: BoxDecoration(
                borderRadius: radius,
                border: Border.all(color: border),
              ),
              padding: const EdgeInsets.symmetric(horizontal: _bannerPaddingX, vertical: _bannerPaddingY),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.center,
                children: <Widget>[
                  IconTheme.merge(
                    data: IconThemeData(size: _bannerIconSize, color: accent),
                    child: icon ?? Icon(danger ? Icons.error_outline : Icons.info_outline),
                  ),
                  const SizedBox(width: _bannerGap),
                  Expanded(
                    child: Text(message, style: theme.text.bodyMd.copyWith(color: accent)),
                  ),
                  if (action != null) ...<Widget>[
                    const SizedBox(width: _bannerGap),
                    DefaultTextStyle.merge(
                      style: theme.text.labelLg.copyWith(
                        color: accent,
                        decoration: TextDecoration.underline,
                        decorationColor: accent,
                      ),
                      child: action!,
                    ),
                  ],
                ],
              ),
            ),
          ],
        ),
      ),
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
