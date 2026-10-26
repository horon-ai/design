import 'package:flutter/material.dart';

import '../theme/horon_fonts.dart';
import '../tokens/horon_tokens.g.dart';

/// `progress.tsx`의 트랙 높이입니다. React `h-2`는 8입니다.
const double _progressTrackHeight = HoronSpace.s2;

/// `progress.tsx`의 `gap-3`입니다. 라벨 줄과 트랙 사이의 거리입니다.
const double _progressGap = HoronSpace.s3;

/// 미결정 인디케이터가 트랙을 한 번 가로지르는 시간입니다.
///
/// React는 미결정 상태를 Base UI의 CSS 키프레임으로 그리므로 값이 토큰에 없습니다.
/// 1600ms는 같은 파일의 시머(2000ms)보다 조금 빠르고, 짧은 트랙에서도 이동이 읽히는
/// 값입니다.
const Duration _indeterminatePeriod = Duration(milliseconds: 1600);

/// 미결정 인디케이터가 트랙 폭에서 차지하는 비율입니다.
const double _indeterminateWidthFraction = 0.4;

/// 진행률을 보여 주는 막대입니다.
///
/// `progress.tsx`를 옮긴 것입니다. React의 다섯 조각(`Progress`, `ProgressTrack`,
/// `ProgressIndicator`, `ProgressLabel`, `ProgressValue`)이 모두 있습니다. [value]가
/// 0에서 1 사이의 비율이면 확정 상태로 그 폭만큼 채우고, `null`이면 미결정 상태로
/// 인디케이터가 트랙을 가로지릅니다. [MediaQuery.disableAnimations]가 참이면 미결정
/// 인디케이터는 트랙 왼쪽 끝에 멈춰 있습니다.
///
/// ```dart
/// const HoronProgress(value: 0.42, label: '업로드', showValue: true);
/// const HoronProgress(); // 미결정
/// ```
class HoronProgress extends StatefulWidget {
  /// 진행 막대를 만듭니다.
  const HoronProgress({super.key, this.value, this.label, this.valueLabel, this.showValue = false, this.child});

  /// 트랙을 찾는 키입니다. React의 `data-slot="progress-track"` 자리입니다.
  static const Key trackKey = ValueKey<String>('horon-progress-track');

  /// 인디케이터를 찾는 키입니다. React의 `data-slot="progress-indicator"` 자리입니다.
  static const Key indicatorKey = ValueKey<String>('horon-progress-indicator');

  /// 0에서 1 사이의 진행 비율입니다. `null`이면 미결정입니다.
  final double? value;

  /// 트랙 위에 붙는 라벨입니다.
  final String? label;

  /// 오른쪽에 붙는 값 문구입니다. 없고 [showValue]가 참이면 [value]를 백분율로 씁니다.
  final String? valueLabel;

  /// [valueLabel]이 없을 때 [value]를 백분율로 보여 줄지 여부입니다.
  final bool showValue;

  /// 트랙 아래에 넣는 추가 내용입니다. React의 `children` 자리입니다.
  final Widget? child;

  @override
  State<HoronProgress> createState() => _HoronProgressState();
}

class _HoronProgressState extends State<HoronProgress> with SingleTickerProviderStateMixin {
  late final AnimationController _controller = AnimationController(vsync: this, duration: _indeterminatePeriod);

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    _syncAnimation();
  }

  @override
  void didUpdateWidget(covariant HoronProgress oldWidget) {
    super.didUpdateWidget(oldWidget);
    _syncAnimation();
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  /// 미결정일 때만 애니메이션을 돌립니다. 접근성 설정이 애니메이션을 끄면
  /// 인디케이터는 트랙 왼쪽 끝에 멈춰 있습니다.
  void _syncAnimation() {
    final bool shouldRun = widget.value == null && !MediaQuery.disableAnimationsOf(context);
    if (shouldRun) {
      if (!_controller.isAnimating) _controller.repeat();
    } else {
      _controller
        ..stop()
        ..value = 0;
    }
  }

  @override
  Widget build(BuildContext context) {
    final double? value = widget.value;
    final String? valueText =
        widget.valueLabel ?? (widget.showValue && value != null ? '${(value.clamp(0.0, 1.0) * 100).round()}%' : null);

    return Column(
      crossAxisAlignment: CrossAxisAlignment.stretch,
      mainAxisSize: MainAxisSize.min,
      children: <Widget>[
        if (widget.label != null || valueText != null)
          Padding(
            padding: const EdgeInsets.only(bottom: _progressGap),
            child: Row(
              children: <Widget>[
                if (widget.label != null) Expanded(child: HoronProgressLabel(widget.label!)) else const Spacer(),
                if (valueText != null) HoronProgressValue(valueText),
              ],
            ),
          ),
        HoronProgressTrack(
          key: HoronProgress.trackKey,
          child: HoronProgressIndicator(key: HoronProgress.indicatorKey, value: value, animation: _controller),
        ),
        if (widget.child != null) ...<Widget>[const SizedBox(height: _progressGap), widget.child!],
      ],
    );
  }
}

/// `progress.tsx`의 `ProgressTrack`입니다.
///
/// React는 `relative flex h-2 w-full items-center overflow-x-hidden rounded-full
/// bg-muted`입니다. 반경은 `rounded-full`이라 [HoronRadiusRole.pill]이고, 넘치는
/// 인디케이터는 잘립니다.
class HoronProgressTrack extends StatelessWidget {
  /// 트랙 하나를 만듭니다.
  const HoronProgressTrack({super.key, this.child});

  /// 트랙 안에 그리는 인디케이터입니다.
  final Widget? child;

  @override
  Widget build(BuildContext context) {
    final ColorScheme scheme = Theme.of(context).colorScheme;
    final BorderRadius radius = BorderRadius.circular(HoronRadiusRole.pill);
    return DecoratedBox(
      decoration: BoxDecoration(color: scheme.surfaceContainerHighest, borderRadius: radius),
      child: ClipRRect(
        borderRadius: radius,
        child: SizedBox(width: double.infinity, height: _progressTrackHeight, child: child),
      ),
    );
  }
}

/// `progress.tsx`의 `ProgressIndicator`입니다.
///
/// React는 `h-full rounded-full bg-primary transition-all`입니다. [value]가 있으면 그
/// 비율만큼 채우고, 없으면 [animation]의 진행에 따라 폭
/// [_indeterminateWidthFraction]짜리 막대가 왼쪽 밖에서 오른쪽 밖으로 지나갑니다.
class HoronProgressIndicator extends StatelessWidget {
  /// 인디케이터 하나를 만듭니다.
  const HoronProgressIndicator({super.key, this.value, this.animation, this.color});

  /// 0에서 1 사이의 진행 비율입니다. `null`이면 미결정입니다.
  final double? value;

  /// 미결정일 때 위치를 정하는 애니메이션입니다.
  final Animation<double>? animation;

  /// 채움 색입니다. 없으면 `primary`입니다.
  final Color? color;

  @override
  Widget build(BuildContext context) {
    final ColorScheme scheme = Theme.of(context).colorScheme;
    final Widget bar = DecoratedBox(
      decoration: BoxDecoration(
        color: color ?? scheme.primary,
        borderRadius: BorderRadius.circular(HoronRadiusRole.pill),
      ),
    );

    final double? clamped = value?.clamp(0.0, 1.0);
    if (clamped != null) {
      return Align(
        alignment: Alignment.centerLeft,
        child: FractionallySizedBox(widthFactor: clamped, heightFactor: 1, child: bar),
      );
    }

    final Animation<double> progress = animation ?? const AlwaysStoppedAnimation<double>(0);
    return LayoutBuilder(
      builder: (BuildContext context, BoxConstraints constraints) {
        final double width = constraints.maxWidth * _indeterminateWidthFraction;
        return AnimatedBuilder(
          animation: progress,
          builder: (BuildContext context, Widget? child) {
            final double left = -width + (constraints.maxWidth + width) * progress.value;
            return Stack(
              children: <Widget>[Positioned(left: left, top: 0, bottom: 0, width: width, child: child!)],
            );
          },
          child: bar,
        );
      },
    );
  }
}

/// `progress.tsx`의 `ProgressLabel`입니다. React는 `text-xs font-normal`입니다.
class HoronProgressLabel extends StatelessWidget {
  /// 라벨 하나를 만듭니다.
  const HoronProgressLabel(this.label, {super.key});

  /// 라벨 글자입니다.
  final String label;

  @override
  Widget build(BuildContext context) {
    final ColorScheme scheme = Theme.of(context).colorScheme;
    return Text(
      label,
      maxLines: 1,
      overflow: TextOverflow.ellipsis,
      style: TextStyle(
        fontFamily: HoronFont.body,
        fontFamilyFallback: HoronFont.fontFamilyFallback,
        fontSize: HoronText.caption,
        fontWeight: HoronFontWeight.regular,
        height: HoronLineHeight.normal,
        color: scheme.onSurface,
      ),
    );
  }
}

/// `progress.tsx`의 `ProgressValue`입니다.
///
/// React는 `ml-auto text-sm text-muted-foreground tabular-nums`입니다. 숫자가 흔들리지
/// 않도록 표 형식 숫자를 씁니다.
class HoronProgressValue extends StatelessWidget {
  /// 값 문구 하나를 만듭니다.
  const HoronProgressValue(this.value, {super.key});

  /// 보여 줄 문구입니다.
  final String value;

  @override
  Widget build(BuildContext context) {
    final ColorScheme scheme = Theme.of(context).colorScheme;
    return Text(
      value,
      maxLines: 1,
      style: TextStyle(
        fontFamily: HoronFont.body,
        fontFamilyFallback: HoronFont.fontFamilyFallback,
        fontSize: HoronText.body,
        fontWeight: HoronFontWeight.regular,
        height: HoronLineHeight.normal,
        color: scheme.onSurfaceVariant,
        fontFeatures: const <FontFeature>[FontFeature.tabularFigures()],
      ),
    );
  }
}
