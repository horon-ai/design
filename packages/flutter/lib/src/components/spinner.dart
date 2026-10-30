import 'dart:math' as math;

import 'package:flutter/material.dart';

import '../theme/horon_theme.dart';

/// `spinner.tsx`의 `SpinnerSize`입니다.
enum HoronSpinnerSize {
  /// `size="xs"` — 14px입니다.
  xs,

  /// `size="sm"` — 16px. 기본값입니다.
  sm,

  /// `size="md"` — 24px입니다.
  md,

  /// `size="lg"` — 32px입니다.
  lg,
}

/// `sizeClass`의 값입니다.
const Map<HoronSpinnerSize, double> _sizePx = <HoronSpinnerSize, double>{
  HoronSpinnerSize.xs: 14,
  HoronSpinnerSize.sm: 16,
  HoronSpinnerSize.md: 24,
  HoronSpinnerSize.lg: 32,
};

/// Figma `Spinner`(Loading 109:733): 10% 잉크 링 위에 4분의 1 잉크 호를 얹고 11% 굵기로 그립니다.
///
/// `spinner.tsx`를 옮긴 것입니다. React는 `SpinnerSize` 유니온에 숫자 크기도
/// 받으므로, Dart는 [size]와 [pixelSize] 두 인자로 나눴습니다. 화면 낭독기에는
/// [label]이 읽힙니다.
class HoronSpinner extends StatefulWidget {
  /// 스피너를 만듭니다.
  const HoronSpinner({super.key, this.size = HoronSpinnerSize.sm, this.pixelSize, this.label = 'Loading'});

  /// 이름 붙은 크기입니다.
  final HoronSpinnerSize size;

  /// 픽셀 크기입니다. 넘기면 [size]보다 우선합니다.
  final double? pixelSize;

  /// 화면 낭독기에 읽힐 이름입니다.
  final String label;

  @override
  State<HoronSpinner> createState() => _HoronSpinnerState();
}

class _HoronSpinnerState extends State<HoronSpinner> with SingleTickerProviderStateMixin {
  late final AnimationController _controller = AnimationController(
    vsync: this,
    duration: const Duration(milliseconds: 900),
  );

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    if (MediaQuery.disableAnimationsOf(context)) {
      _controller.stop();
    } else if (!_controller.isAnimating) {
      _controller.repeat();
    }
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    final double side = widget.pixelSize ?? _sizePx[widget.size]!;

    return Semantics(
      label: widget.label,
      liveRegion: true,
      child: SizedBox(
        width: side,
        height: side,
        child: AnimatedBuilder(
          animation: _controller,
          builder: (BuildContext context, Widget? child) {
            return CustomPaint(
              painter: _SpinnerPainter(
                turn: _controller.value,
                track: theme.colors.overlayInk10,
                arc: theme.colors.interactivePrimary,
              ),
            );
          },
        ),
      ),
    );
  }
}

/// 100 단위 viewBox를 그대로 옮긴 페인터입니다.
class _SpinnerPainter extends CustomPainter {
  const _SpinnerPainter({required this.turn, required this.track, required this.arc});

  final double turn;
  final Color track;
  final Color arc;

  @override
  void paint(Canvas canvas, Size size) {
    final Offset center = Offset(size.width / 2, size.height / 2);
    final double radius = size.shortestSide * 44.5 / 100;
    final double stroke = size.shortestSide * 11 / 100;
    final Paint paint = Paint()
      ..style = PaintingStyle.stroke
      ..strokeWidth = stroke;

    canvas.drawCircle(center, radius, paint..color = track);

    // `M50 5.5A44.5 44.5 0 0 1 94.5 50` - 왼쪽 위에서 오른쪽으로 90도.
    canvas.save();
    canvas.translate(center.dx, center.dy);
    canvas.rotate(turn * 2 * math.pi);
    canvas.drawArc(
      Rect.fromCircle(center: Offset.zero, radius: radius),
      -math.pi / 2,
      math.pi / 2,
      false,
      paint..color = arc,
    );
    canvas.restore();
  }

  @override
  bool shouldRepaint(_SpinnerPainter oldDelegate) =>
      oldDelegate.turn != turn || oldDelegate.track != track || oldDelegate.arc != arc;
}
