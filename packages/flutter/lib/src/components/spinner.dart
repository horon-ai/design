import 'package:flutter/material.dart';

/// `spinner.tsx`의 `size-[18px]`입니다.
const double _spinnerSize = 18.0;

/// `spinner.tsx`의 `border-2`입니다. 지름이 달라져도 이 두께는 그대로입니다.
const double _spinnerStrokeWidth = 2.0;

/// `spinner.tsx`의 `animate-spin` 한 바퀴 시간입니다. Tailwind의 기본값은 1초입니다.
const Duration _spinPeriod = Duration(milliseconds: 1000);

/// `spinner.tsx`의 `border-t-transparent`가 비우는 구간입니다. 원 둘레의 4분의 1로,
/// 12시를 중심으로 10시 30분에서 1시 30분까지입니다.
const double _transparentSweep = 0.25;

/// 비우는 구간의 중심입니다. `SweepGradient`는 3시(0)에서 시작해 시계 방향으로
/// 도므로 12시는 0.75입니다.
const double _transparentCenter = 0.75;

/// 비우는 구간의 시작 위치입니다(10시 30분).
const double _transparentStart = _transparentCenter - _transparentSweep / 2;

/// 비우는 구간의 끝 위치입니다(1시 30분).
const double _transparentEnd = _transparentCenter + _transparentSweep / 2;

/// 작업이 진행 중임을 알리는 18px 링입니다.
///
/// `spinner.tsx`를 옮긴 것입니다. React는 `inline-block size-[18px] shrink-0
/// animate-spin rounded-full border-2 border-foreground border-t-transparent`이라,
/// 2px 두께의 원형 테두리에서 위쪽 4분의 1만 투명하고 나머지가 보입니다. 이 위젯은
/// 그 모양을 그대로 만듭니다. 테두리로 링을 그리고, 12시에서 시작하는 스윕 그라디언트를
/// `BlendMode.dstIn`으로 씌워 위쪽 4분의 1의 알파만 0으로 지운 뒤 1초에 한 바퀴
/// 회전시킵니다. 진행률을 나타내는 호를 따로 그리지 않습니다. 테두리가 곧 모양입니다.
///
/// [size]와 [color]로 크기와 색을 바꿉니다. 색의 기본값은 테마의 `onSurface`
/// (React의 `foreground`)입니다. [MediaQuery.disableAnimations]가 참이면 회전을
/// 멈추고 링만 그립니다.
///
/// ```dart
/// const HoronSpinner();
/// const HoronSpinner(size: 24, color: HoronLightColors.mutedForeground);
/// ```
class HoronSpinner extends StatefulWidget {
  /// 스피너 하나를 만듭니다.
  const HoronSpinner({super.key, this.size = _spinnerSize, this.color, this.semanticsLabel});

  /// 링을 찾는 테스트용 키입니다. React의 `data-slot="spinner"` 자리입니다.
  static const Key ringKey = ValueKey<String>('horon-spinner-ring');

  /// 링의 지름입니다. 기본값은 React의 18입니다.
  final double size;

  /// 링의 색입니다. 없으면 테마의 `onSurface`입니다.
  final Color? color;

  /// 보조 기술이 읽을 이름입니다. 호스트가 넘깁니다.
  ///
  /// React는 `aria-label="Loading"`을 고정으로 넣습니다. 이 패키지는 화면 문구를
  /// 문자열 계약에서 읽으므로, 그 계약에 로딩 문구가 생기기 전까지는 호스트가 넘긴
  /// 문구를 씁니다.
  final String? semanticsLabel;

  @override
  State<HoronSpinner> createState() => _HoronSpinnerState();
}

class _HoronSpinnerState extends State<HoronSpinner> with SingleTickerProviderStateMixin {
  late final AnimationController _controller = AnimationController(vsync: this, duration: _spinPeriod);

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    _sync();
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  void _sync() {
    if (MediaQuery.disableAnimationsOf(context)) {
      _controller
        ..stop()
        ..value = 0;
    } else if (!_controller.isAnimating) {
      _controller.repeat();
    }
  }

  @override
  Widget build(BuildContext context) {
    final Color ringColor = widget.color ?? Theme.of(context).colorScheme.onSurface;

    final Widget ring = SizedBox.square(
      dimension: widget.size,
      child: DecoratedBox(
        key: HoronSpinner.ringKey,
        decoration: BoxDecoration(
          shape: BoxShape.circle,
          border: Border.all(color: ringColor, width: _spinnerStrokeWidth),
        ),
      ),
    );

    // 12시를 중심으로 한 4분의 1만 알파가 0인 스윕 그라디언트입니다. `dstIn`은
    // 목적지의 알파에 근원의 알파를 곱하므로, 테두리 색은 그대로 두고 그 구간만
    // 지웁니다. `startAngle`은 0(3시)이어야 원 전체를 덮습니다. 음수로 주면
    // 그라디언트가 일부만 칠해져 마스크가 먹지 않습니다(2026-10-22 픽셀 검사).
    final Widget masked = ShaderMask(
      blendMode: BlendMode.dstIn,
      shaderCallback: (Rect bounds) => SweepGradient(
        colors: <Color>[ringColor, Colors.transparent, Colors.transparent, ringColor],
        stops: <double>[0, _transparentStart, _transparentEnd, 1],
      ).createShader(bounds),
      child: ring,
    );

    return Semantics(
      container: true,
      label: widget.semanticsLabel,
      liveRegion: true,
      child: RotationTransition(turns: _controller, child: masked),
    );
  }
}
