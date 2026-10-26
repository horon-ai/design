import 'dart:math' as math;
import 'dart:ui' as ui;

import 'package:flutter/material.dart';

import '../tokens/horon_tokens.g.dart';

/// 시머 한 주기입니다. `mobile/lib/src/widgets/skeleton.dart`의 `_shimmerDuration`을
/// 그대로 옮긴 2000ms입니다.
const Duration _shimmerDuration = Duration(milliseconds: 2000);

/// 플레이스홀더의 바닥 불투명도입니다. `mobile/lib/src/widgets/skeleton.dart`의
/// `_skeletonOpacity`(0.1)입니다. 이 값이 시머의 최소 불투명도입니다.
const double _skeletonOpacity = 0.1;

/// 하이라이트 띠의 불투명도입니다. `skeleton_shimmer.dart`의 `_shimmerMinOpacity`(0.5)에서
/// 온 값입니다. 원본은 이 값을 바닥 불투명도에 곱했지만, 그러면 띠가 바닥(0.1)보다
/// 흐려져 시머가 아니라 어두운 띠로 보입니다. 이 구현은 띠의 불투명도로 그대로 씁니다.
const double _shimmerHighlightOpacity = 0.5;

/// 시머 그라디언트의 정지점입니다. `skeleton_shimmer.dart`의 값 그대로입니다.
const List<double> _shimmerStops = <double>[0, 0.34, 0.5, 0.66, 1];

/// 하이라이트 띠의 출발 위치입니다. `skeleton_shimmer.dart`의
/// `center = -1.5 + value * 3`을 그대로 옮겼습니다.
const double _shimmerStart = -1.5;

/// 한 주기에 띠가 지나가는 거리입니다. 위 식의 `value * 3`입니다.
const double _shimmerTravel = 3;

/// 드러내기 크로스페이드의 길이입니다. `skeleton_reveal.dart`의 `_revealDuration`입니다.
const Duration _revealDuration = Duration(milliseconds: 400);

/// 드러내기 동안 흐려지는 정도입니다. `skeleton_reveal.dart`의 `_revealBlur`입니다.
const double _revealBlur = 2.0;

/// React `animate-pulse`가 오가는 두 불투명도입니다. `skeleton.tsx`의 스켈레톤은
/// `animate-pulse`라 2000ms 주기로 1.0과 0.5 사이를 오갑니다.
const double _pulseMaxOpacity = 1.0;

/// 위 박동의 바닥값입니다.
const double _pulseMinOpacity = 0.5;

/// 박동 불투명도를 읽는 테스트용 키입니다. `HoronSkeleton.opacityKey`와 같은 값입니다.
const Key _pulseOpacityKey = ValueKey<String>('horon-skeleton-opacity');

/// 시머 단계를 아래 플레이스홀더에 알려 주는 범위입니다.
///
/// `skeleton_mask.dart`의 `_SkeletonMask`와 같은 역할이되, 애니메이션 값까지 함께
/// 나릅니다. [phase]가 `null`이면 애니메이션이 꺼진 상태라 플레이스홀더가 바닥
/// 불투명도로 고정됩니다.
class _HoronSkeletonScope extends InheritedWidget {
  const _HoronSkeletonScope({required this.phase, required super.child});

  final Animation<double>? phase;

  static Animation<double>? phaseOf(BuildContext context) =>
      context.dependOnInheritedWidgetOfExactType<_HoronSkeletonScope>()?.phase;

  @override
  bool updateShouldNotify(_HoronSkeletonScope oldWidget) => phase != oldWidget.phase;
}

/// 시머 한 단계의 그라디언트입니다.
///
/// `skeleton_shimmer.dart`가 `ShaderMask`에 넘기던 그라디언트와 같은 정지점·색입니다.
/// 바닥은 [_skeletonOpacity], 띠는 [_shimmerHighlightOpacity]입니다. [value]가 0에서
/// 1로 가는 동안 띠가 왼쪽 밖에서 오른쪽 밖으로 지나갑니다.
LinearGradient _shimmerGradient(double value, Color base) {
  final double center = _shimmerStart + value * _shimmerTravel;
  return LinearGradient(
    begin: Alignment(center - 1, 0),
    end: Alignment(center + 1, 0),
    colors: <Color>[
      base.withValues(alpha: _skeletonOpacity),
      base.withValues(alpha: _skeletonOpacity),
      base.withValues(alpha: _shimmerHighlightOpacity),
      base.withValues(alpha: _skeletonOpacity),
      base.withValues(alpha: _skeletonOpacity),
    ],
    stops: _shimmerStops,
  );
}

/// 여러 플레이스홀더에 하나의 시머를 입히는 묶음입니다.
///
/// `mobile/lib/src/widgets/skeleton_shimmer.dart`의 `SkeletonShimmer`를 옮긴 것입니다.
/// 2000ms 주기로 하이라이트 띠가 지나가고, 바닥 불투명도는 0.1, 띠는 0.5입니다.
///
/// [MediaQuery.disableAnimations]가 참이거나 [enabled]가 거짓이면 컨트롤러를 멈추고
/// [HoronSkeletonBar]를 바닥 불투명도로 고정합니다. 모양은 그대로 두고 움직임만 뺍니다.
///
/// ```dart
/// const HoronSkeletonShimmer(
///   child: Column(
///     children: <Widget>[
///       HoronSkeletonBar(width: 180, height: 12),
///       HoronSkeletonBar(width: 120, height: 12),
///     ],
///   ),
/// );
/// ```
class HoronSkeletonShimmer extends StatefulWidget {
  /// 시머 묶음 하나를 만듭니다.
  const HoronSkeletonShimmer({super.key, required this.child, this.enabled = true});

  /// 박동 불투명도를 읽는 테스트용 키입니다.
  static const Key opacityKey = _pulseOpacityKey;

  /// 묶음 안의 플레이스홀더들입니다.
  final Widget child;

  /// 시머를 켤지 여부입니다. `disableAnimations`가 참이면 무시하고 멈춥니다.
  final bool enabled;

  @override
  State<HoronSkeletonShimmer> createState() => _HoronSkeletonShimmerState();
}

class _HoronSkeletonShimmerState extends State<HoronSkeletonShimmer> with SingleTickerProviderStateMixin {
  late final AnimationController _controller = AnimationController(vsync: this, duration: _shimmerDuration);

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    _sync();
  }

  @override
  void didUpdateWidget(covariant HoronSkeletonShimmer oldWidget) {
    super.didUpdateWidget(oldWidget);
    _sync();
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  bool get _reducedMotion => MediaQuery.disableAnimationsOf(context);

  void _sync() {
    if (_reducedMotion || !widget.enabled) {
      _controller
        ..stop()
        ..value = 0;
    } else if (!_controller.isAnimating) {
      _controller.repeat();
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_reducedMotion || !widget.enabled) {
      return Opacity(
        key: _pulseOpacityKey,
        opacity: _pulseMaxOpacity,
        child: _HoronSkeletonScope(phase: null, child: widget.child),
      );
    }
    return AnimatedBuilder(
      animation: _controller,
      builder: (BuildContext context, Widget? child) {
        // 한 주기 안에서 1.0 → 0.5 → 1.0을 부드럽게 오갑니다. 1000ms에 바닥입니다.
        final double wave = 0.5 - 0.5 * math.cos(_controller.value * 2 * math.pi);
        return Opacity(
          key: _pulseOpacityKey,
          opacity: _pulseMaxOpacity - (_pulseMaxOpacity - _pulseMinOpacity) * wave,
          child: _HoronSkeletonScope(phase: _controller, child: child!),
        );
      },
      child: widget.child,
    );
  }
}

/// 반경이 있는 플레이스홀더 하나입니다.
///
/// `mobile/lib/src/widgets/skeleton_bar.dart`의 `SkeletonBar`를 옮긴 것입니다. 반경
/// 기본값은 Buzz `Radii.sm`이 아니라 생성 토큰 [HoronRadius.sm]입니다.
///
/// [HoronSkeletonShimmer] 안에 있으면 시머 그라디언트로 채우고, 밖에 있거나
/// 애니메이션이 꺼져 있으면 바닥 불투명도 0.1의 단색으로 채웁니다.
///
/// ```dart
/// const HoronSkeletonBar(width: 180, height: 12);
/// ```
class HoronSkeletonBar extends StatelessWidget {
  /// 플레이스홀더 하나를 만듭니다.
  const HoronSkeletonBar({super.key, required this.width, required this.height, this.borderRadius, this.color});

  /// 채움을 찾는 테스트용 키입니다.
  static const Key fillKey = ValueKey<String>('horon-skeleton-bar-fill');

  /// 너비입니다.
  final double width;

  /// 높이입니다.
  final double height;

  /// 반경입니다. 없으면 [HoronRadius.sm]입니다.
  final BorderRadius? borderRadius;

  /// 채움 색입니다. 없으면 테마의 `primary`입니다.
  final Color? color;

  @override
  Widget build(BuildContext context) {
    final Color base = color ?? Theme.of(context).colorScheme.primary;
    final Animation<double>? phase = _HoronSkeletonScope.phaseOf(context);
    final BorderRadius radius = borderRadius ?? BorderRadius.circular(HoronRadius.sm);

    return ExcludeSemantics(
      child: SizedBox(
        width: width,
        height: height,
        child: phase == null
            ? DecoratedBox(
                key: fillKey,
                decoration: BoxDecoration(
                  color: base.withValues(alpha: _skeletonOpacity),
                  borderRadius: radius,
                ),
              )
            : AnimatedBuilder(
                animation: phase,
                builder: (BuildContext context, Widget? _) => DecoratedBox(
                  key: fillKey,
                  decoration: BoxDecoration(borderRadius: radius, gradient: _shimmerGradient(phase.value, base)),
                ),
              ),
      ),
    );
  }
}

/// 시머가 흐르는 둥근 플레이스홀더입니다.
///
/// `skeleton.tsx`의 `Skeleton`(`animate-pulse rounded-sm bg-muted`)과 위 두 위젯을
/// 합친 것입니다. [child]를 넘기면 그 묶음 전체에 하나의 시머를 입히고, 넘기지
/// 않으면 [width]·[height] 크기의 [HoronSkeletonBar] 하나를 그립니다.
///
/// 시머 주기는 2000ms이고 바닥 불투명도는 0.1입니다.
/// [MediaQuery.disableAnimations]가 참이면 애니메이션을 멈춥니다.
///
/// ```dart
/// const HoronSkeleton(width: 160, height: 12);
/// HoronSkeleton(
///   child: Column(
///     children: <Widget>[
///       HoronSkeletonBar(width: 180, height: 12),
///       HoronSkeletonBar(width: 120, height: 12),
///     ],
///   ),
/// );
/// ```
class HoronSkeleton extends StatelessWidget {
  /// 플레이스홀더 하나 또는 묶음을 만듭니다.
  const HoronSkeleton({super.key, this.width, this.height, this.borderRadius, this.child, this.shimmer = true});

  /// 채움을 찾는 테스트용 키입니다. [HoronSkeletonBar.fillKey]와 같은 값입니다.
  static const Key fillKey = HoronSkeletonBar.fillKey;

  /// 박동 불투명도를 읽는 테스트용 키입니다.
  static const Key opacityKey = _pulseOpacityKey;

  /// [child]가 없을 때 그릴 바의 너비입니다.
  final double? width;

  /// [child]가 없을 때 그릴 바의 높이입니다.
  final double? height;

  /// [child]가 없을 때 그릴 바의 반경입니다.
  final BorderRadius? borderRadius;

  /// 묶음으로 그릴 내용입니다.
  final Widget? child;

  /// 시머를 켤지 여부입니다.
  final bool shimmer;

  @override
  Widget build(BuildContext context) {
    return HoronSkeletonShimmer(
      enabled: shimmer,
      child:
          child ??
          HoronSkeletonBar(
            width: width ?? double.infinity,
            height: height ?? HoronSpace.s3,
            borderRadius: borderRadius,
          ),
    );
  }
}

/// 플레이스홀더와 실제 내용을 같은 자리에 겹쳐 두고 내용을 드러냅니다.
///
/// `mobile/lib/src/widgets/skeleton_reveal.dart`의 `SkeletonReveal`을 옮긴 것입니다.
/// 로딩으로 들어갈 때는 애니메이션 없이 즉시 바뀌고(재연결에서 거꾸로 재생되지
/// 않게), 로딩에서 나올 때만 400ms 동안 두 겹을 크로스페이드하며 플레이스홀더는
/// 흐려지고 내용은 선명해집니다. [MediaQuery.disableAnimations]가 참이면 흐림 없이
/// 상태만 바뀝니다.
class HoronSkeletonReveal extends StatefulWidget {
  /// 크로스페이드 하나를 만듭니다.
  const HoronSkeletonReveal({
    super.key,
    required this.loading,
    required this.skeleton,
    required this.content,
    this.shimmerEnabled = true,
    this.loadingLabel,
    this.loadingSemanticsKey,
    this.skeletonPadding = EdgeInsets.zero,
    this.onReadyChanged,
  });

  /// 내용 겹을 찾는 키입니다.
  static const Key contentKey = ValueKey<String>('horon-skeleton-reveal-content');

  /// 플레이스홀더 겹을 찾는 키입니다.
  static const Key placeholderKey = ValueKey<String>('horon-skeleton-reveal-placeholder');

  /// 로딩 중인지 여부입니다.
  final bool loading;

  /// 로딩 중에 보이는 플레이스홀더입니다.
  final Widget skeleton;

  /// 로딩이 끝나면 보이는 내용입니다.
  final Widget content;

  /// 플레이스홀더의 시머를 켤지 여부입니다.
  final bool shimmerEnabled;

  /// 보조 기술이 읽을 로딩 문구입니다.
  final String? loadingLabel;

  /// 로딩 문구를 담는 의미 노드의 키입니다.
  final Key? loadingSemanticsKey;

  /// 플레이스홀더에 적용하는 여백입니다.
  final EdgeInsets skeletonPadding;

  /// 드러내기가 끝났는지 알리는 콜백입니다.
  final ValueChanged<bool>? onReadyChanged;

  @override
  State<HoronSkeletonReveal> createState() => _HoronSkeletonRevealState();
}

class _HoronSkeletonRevealState extends State<HoronSkeletonReveal> with SingleTickerProviderStateMixin {
  late final AnimationController _reveal = AnimationController(
    vsync: this,
    duration: _revealDuration,
    value: widget.loading ? 0 : 1,
  );
  bool? _previousLoading;
  late Widget _retainedSkeleton = widget.skeleton;

  @override
  void initState() {
    super.initState();
    _previousLoading = widget.loading;
  }

  @override
  void didUpdateWidget(covariant HoronSkeletonReveal oldWidget) {
    super.didUpdateWidget(oldWidget);
    final bool reducedMotion = MediaQuery.disableAnimationsOf(context);
    final bool? previous = _previousLoading;
    if (widget.loading && previous != true) {
      // 로딩 한 주기 동안 같은 플레이스홀더 배치를 유지합니다. 새로 도착한 정보는
      // 내용 겹의 것입니다.
      _retainedSkeleton = widget.skeleton;
      _reveal
        ..stop()
        ..value = 0;
    } else if (!widget.loading && previous == true) {
      if (reducedMotion) {
        _reveal
          ..stop()
          ..value = 1;
      } else {
        _reveal.forward(from: 0);
      }
    } else if (reducedMotion) {
      _reveal
        ..stop()
        ..value = widget.loading ? 0 : 1;
    }
    _previousLoading = widget.loading;
    _reportReady();
  }

  @override
  void dispose() {
    _reveal.dispose();
    super.dispose();
  }

  void _reportReady() {
    final ValueChanged<bool>? callback = widget.onReadyChanged;
    if (callback == null) return;
    final bool ready = !widget.loading && _reveal.isCompleted;
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (mounted) callback(ready);
    });
  }

  @override
  Widget build(BuildContext context) {
    final bool reducedMotion = MediaQuery.disableAnimationsOf(context);
    return AnimatedBuilder(
      animation: _reveal,
      builder: (BuildContext context, Widget? _) {
        final double progress = _reveal.value;
        final double skeletonBlur = reducedMotion ? 0 : _revealBlur * progress;
        final double contentBlur = reducedMotion ? 0 : _revealBlur * (1 - progress);

        return Stack(
          fit: StackFit.expand,
          children: <Widget>[
            Opacity(
              key: HoronSkeletonReveal.contentKey,
              opacity: progress,
              child: ImageFiltered(
                enabled: contentBlur > 0.01,
                imageFilter: ui.ImageFilter.blur(sigmaX: contentBlur, sigmaY: contentBlur),
                child: IgnorePointer(
                  ignoring: widget.loading || progress < 1,
                  child: ExcludeFocus(
                    excluding: widget.loading || progress < 1,
                    child: ExcludeSemantics(excluding: widget.loading || progress < 1, child: widget.content),
                  ),
                ),
              ),
            ),
            Opacity(
              key: HoronSkeletonReveal.placeholderKey,
              opacity: 1 - progress,
              child: ImageFiltered(
                enabled: skeletonBlur > 0.01,
                imageFilter: ui.ImageFilter.blur(sigmaX: skeletonBlur, sigmaY: skeletonBlur),
                child: IgnorePointer(
                  child: ExcludeSemantics(
                    excluding: !widget.loading,
                    child: Semantics(
                      key: widget.loadingSemanticsKey,
                      label: widget.loadingLabel,
                      liveRegion: widget.loadingLabel != null,
                      excludeSemantics: widget.loadingLabel != null,
                      child: Padding(
                        padding: widget.skeletonPadding,
                        child: HoronSkeletonShimmer(
                          enabled: widget.loading && widget.shimmerEnabled,
                          child: _retainedSkeleton,
                        ),
                      ),
                    ),
                  ),
                ),
              ),
            ),
          ],
        );
      },
    );
  }
}
