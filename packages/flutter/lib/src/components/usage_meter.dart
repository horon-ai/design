import 'package:flutter/material.dart';

import '../glass/glass_geometry.dart';
import '../glass/horon_glass.dart';
import '../theme/horon_motion.dart';
import '../theme/horon_theme.dart';
import '../tokens/horon_tokens.g.dart';

/// `usage-meter.tsx`의 `w-75`입니다.
const double _meterWidth = 300;

/// `usage-meter.tsx`의 `p-4`입니다.
const double _meterPadding = 16;

/// `usage-meter.tsx`의 `gap-2.5`입니다.
const double _meterGap = 10;

/// `usage-meter.tsx`의 `h-1.5`입니다.
const double _meterTrackHeight = 6;

/// `usage-meter.tsx`의 `rounded-xl`입니다.
const double _meterRadius = 20;

/// `usage-meter.tsx`의 `duration-400`입니다.
const Duration _meterFillDuration = Duration(milliseconds: 400);

/// Figma `Usage meter`(Loading 109:733): 두꺼운 유리 카드 위에 6px 하늘색 채움을 얹은 사용량 막대입니다.
///
/// `usage-meter.tsx`를 옮긴 것입니다. 값은 0~100이고 React의 `Meter.Value`가
/// 보여 주는 퍼센트를 오른쪽에 그립니다. 트랙은 `bg-overlay-ink-8`, 채움은
/// `bg-sky-500`이며 400ms `ease-out-quint`로 움직입니다.
class HoronUsageMeter extends StatelessWidget {
  /// 사용량 막대를 만듭니다.
  const HoronUsageMeter({super.key, required this.label, required this.value, this.detail, this.note});

  /// 막대 이름입니다.
  final String label;

  /// 0~100 값입니다.
  final double value;

  /// 왼쪽 캡션입니다. 예: `10,000개 중 6,420개`.
  final String? detail;

  /// 오른쪽 캡션입니다. 예: `11월 1일 초기화`.
  final String? note;

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    final double fraction = (value / 100).clamp(0.0, 1.0);
    final BorderRadius radius = BorderRadius.circular(_meterRadius);
    final bool animate = !MediaQuery.disableAnimationsOf(context);

    return Semantics(
      label: label,
      value: '${value.round()}%',
      child: ClipRRect(
        borderRadius: radius,
        child: Stack(
          children: <Widget>[
            Positioned.fill(
              child: HoronLiquidGlass(tier: HoronGlassTier.thick, borderRadius: radius, child: const SizedBox.expand()),
            ),
            Padding(
              padding: const EdgeInsets.all(_meterPadding),
              child: SizedBox(
                width: _meterWidth - _meterPadding * 2,
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: <Widget>[
                    Row(
                      children: <Widget>[
                        Expanded(
                          child: Text(
                            label,
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                            style: theme.text.labelMd.copyWith(color: theme.colors.textPrimary),
                          ),
                        ),
                        Text(
                          '${value.round()}%',
                          style: theme.text.labelMd.copyWith(color: theme.colors.textSecondary),
                        ),
                      ],
                    ),
                    const SizedBox(height: _meterGap),
                    SizedBox(
                      height: _meterTrackHeight,
                      child: ClipRRect(
                        borderRadius: BorderRadius.circular(theme.radius.full),
                        child: ColoredBox(
                          color: theme.colors.overlayInk8,
                          child: Align(
                            alignment: AlignmentDirectional.centerStart,
                            child: TweenAnimationBuilder<double>(
                              tween: Tween<double>(begin: fraction, end: fraction),
                              duration: animate ? _meterFillDuration : Duration.zero,
                              curve: HoronMotion.easeOutQuint,
                              builder: (BuildContext context, double t, Widget? child) =>
                                  FractionallySizedBox(widthFactor: t, heightFactor: 1, child: child),
                              child: ColoredBox(color: HoronPalette.sky500),
                            ),
                          ),
                        ),
                      ),
                    ),
                    if (detail != null || note != null) ...<Widget>[
                      const SizedBox(height: _meterGap),
                      Row(
                        children: <Widget>[
                          Expanded(
                            child: Text(
                              detail ?? '',
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                              style: theme.text.caption.copyWith(color: theme.colors.textSecondary),
                            ),
                          ),
                          if (note != null)
                            Text(
                              note!,
                              maxLines: 1,
                              softWrap: false,
                              style: theme.text.caption.copyWith(color: theme.colors.textSecondary),
                            ),
                        ],
                      ),
                    ],
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
