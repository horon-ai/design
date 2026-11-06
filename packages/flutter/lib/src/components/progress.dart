import 'package:flutter/material.dart';

import '../theme/horon_motion.dart';
import '../theme/horon_theme.dart';

/// `progress.tsx`의 `w-60`입니다.
const double _progressDefaultWidth = 240;

/// `progress.tsx`의 `h-1.5`입니다.
const double _progressTrackHeight = 6;

/// `progress.tsx`의 `duration-400`입니다. `globals.css`의 `motion` 절에 있는 값입니다.
const Duration _progressFillDuration = Duration(milliseconds: 400);

/// Figma `Progress bar`(Loading 109:733): 8% 잉크 트랙 위에 잉크 채움을 얹은 진행 막대입니다.
///
/// `progress.tsx`를 옮긴 것입니다. 트랙은 `bg-overlay-ink-8`, 채움은
/// `bg-interactive-primary`이고 둘 다 `rounded-full`(9999)입니다. 값이 바뀌면
/// React의 `transition-[width] duration-400 ease-out-quint`와 같은 곡선으로
/// 너비가 움직입니다. [value]를 생략하면 React의 `data-indeterminate`처럼 1/3 폭
/// 채움이 1.4초 `sweep`으로 지나갑니다. 모션 축소 설정에서는 애니메이션 없이 바로
/// 그립니다.
class HoronProgress extends StatefulWidget {
  /// 진행 막대를 만듭니다.
  const HoronProgress({super.key, this.value, this.max = 1, this.width, this.semanticsLabel});

  /// 현재 값입니다. React `value?: number | null`처럼 생략하면 불확정 막대입니다.
  final double? value;

  /// 최대 값입니다.
  final double max;

  /// 폭입니다. 넘기지 않으면 React의 `w-60`(240)입니다.
  final double? width;

  /// 스크린리더에 읽힐 이름입니다.
  final String? semanticsLabel;

  /// `data-indeterminate:w-1/3`입니다. 채움은 트랙의 3분의 1입니다.
  static const double indeterminateWidthFactor = 1 / 3;

  @override
  State<HoronProgress> createState() => _HoronProgressState();
}

class _HoronProgressState extends State<HoronProgress> with SingleTickerProviderStateMixin {
  late final AnimationController _sweep = AnimationController(vsync: this, duration: HoronMotion.sweepDuration);

  bool get _indeterminate => widget.value == null;

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    _sync();
  }

  @override
  void didUpdateWidget(HoronProgress oldWidget) {
    super.didUpdateWidget(oldWidget);
    _sync();
  }

  void _sync() {
    if (_indeterminate && !MediaQuery.disableAnimationsOf(context)) {
      if (!_sweep.isAnimating) _sweep.repeat();
    } else if (_sweep.isAnimating) {
      _sweep.stop();
    }
  }

  @override
  void dispose() {
    _sweep.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    final double fraction = switch (widget.value) {
      final double value => widget.max <= 0 ? 0 : (value / widget.max).clamp(0.0, 1.0),
      null => 0,
    };
    final BorderRadius radius = BorderRadius.circular(theme.radius.full);
    final bool animate = !MediaQuery.disableAnimationsOf(context);

    final Widget fill = _indeterminate
        ? AnimatedBuilder(
            animation: _sweep,
            builder: (BuildContext context, Widget? child) {
              // `sweep`: translateX(-100%) → 400%.
              final double t = animate
                  ? HoronMotion.sweepFrom +
                        (HoronMotion.sweepTo - HoronMotion.sweepFrom) * HoronMotion.sweepCurve.transform(_sweep.value)
                  : HoronMotion.sweepFrom;
              return FractionallySizedBox(
                widthFactor: HoronProgress.indeterminateWidthFactor,
                heightFactor: 1,
                alignment: AlignmentDirectional.centerStart,
                child: FractionalTranslation(translation: Offset(t, 0), child: child),
              );
            },
            child: ColoredBox(color: theme.colors.interactivePrimary),
          )
        : Align(
            alignment: AlignmentDirectional.centerStart,
            child: TweenAnimationBuilder<double>(
              tween: Tween<double>(begin: fraction, end: fraction),
              duration: animate ? _progressFillDuration : Duration.zero,
              curve: HoronMotion.easeOutQuint,
              builder: (BuildContext context, double animated, Widget? child) {
                return FractionallySizedBox(widthFactor: animated, heightFactor: 1, child: child);
              },
              child: ColoredBox(color: theme.colors.interactivePrimary),
            ),
          );

    return Semantics(
      label: widget.semanticsLabel,
      value: _indeterminate ? null : '${(fraction * 100).round()}%',
      child: SizedBox(
        width: widget.width ?? _progressDefaultWidth,
        height: _progressTrackHeight,
        child: ClipRRect(
          borderRadius: radius,
          child: ColoredBox(
            color: theme.colors.overlayInk8,
            child: _indeterminate ? ClipRect(child: fill) : fill,
          ),
        ),
      ),
    );
  }
}
