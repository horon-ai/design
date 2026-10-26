import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import '../theme/horon_theme.dart';
import '../tokens/horon_tokens.g.dart';

/// `slider.tsx`의 슬라이더입니다.
///
/// React는 트랙(`h-1.5 w-full grow rounded-full bg-muted`), 채워진 범위
/// (`absolute rounded-full bg-primary`), 썸(`size-4 rounded-full border-2
/// border-primary bg-background shadow-sm`)을 따로 그립니다. 이 위젯은 그 셋을
/// [HoronSliderPainter] 한 좌표계에서 그립니다. 그래서 채움의 끝과 썸의 중심이
/// 언제나 같은 자리에 있고, 세로 변형도 같은 코드로 뒤집어 그립니다.
///
/// 값은 호출자가 소유합니다. [onChanged]가 `null`이면 비활성이고(React
/// `data-disabled:opacity-50`), 그때는 끌어도 값이 바뀌지 않습니다. 넘기는 값은
/// 언제나 [min]과 [max] 사이이고, [divisions]가 있으면 눈금에 맞춰 반올림된
/// 값입니다. 화면에 그리는 위치도 같은 함수로 계산하므로 범위를 벗어난 [value]가
/// 썸을 밖으로 밀지 않습니다.
///
/// 방향은 React의 `orientation`을 Flutter의 [Axis]로 받습니다. 세로 변형은
/// 높이가 정해진 부모 안에 넣거나 [height]를 넘깁니다(React의 `h-full`과 같은
/// 조건).
///
/// React 소스에 `variants:` 블록이 없으므로 공개 변형 enum을 두지 않습니다.
class HoronSlider extends StatefulWidget {
  /// 슬라이더를 만듭니다.
  const HoronSlider({
    super.key,
    required this.value,
    this.onChanged,
    this.min = 0,
    this.max = 100,
    this.divisions,
    this.orientation = Axis.horizontal,
    this.enabled = true,
    this.showValue = false,
    this.height,
    this.semanticsLabel,
  }) : assert(min <= max, 'min은 max보다 클 수 없습니다'),
       assert(divisions == null || divisions > 0, 'divisions는 1 이상이어야 합니다');

  /// 지금 값입니다. 범위를 벗어나면 [min]·[max]로 잘라 그립니다.
  final double value;

  /// 값이 바뀔 때 부릅니다. `null`이면 비활성입니다.
  final ValueChanged<double>? onChanged;

  /// 범위의 시작입니다.
  final double min;

  /// 범위의 끝입니다.
  final double max;

  /// 눈금 수입니다. `null`이면 연속 값입니다.
  final int? divisions;

  /// 수평·수직 방향입니다.
  final Axis orientation;

  /// 누름·끌기·키보드에 반응할지 여부입니다.
  final bool enabled;

  /// 값 숫자를 함께 보여줄지 여부입니다. React는 [HoronSliderValue]를 따로
  /// 놓지만, 값 하나짜리 슬라이더에서는 이 스위치가 같은 일을 합니다.
  final bool showValue;

  /// 세로 슬라이더의 높이입니다. 없으면 부모가 준 높이를 쓰고, 그것도 없으면
  /// [HoronSpace.s24]입니다.
  final double? height;

  /// 보조 기술이 읽을 이름입니다. 호스트가 넘깁니다.
  final String? semanticsLabel;

  /// React `h-1.5`입니다. 트랙의 두께입니다.
  static const double trackThickness = HoronSpace.s1_5;

  /// React `size-4`입니다. 썸의 지름입니다.
  static const double thumbDiameter = HoronSpace.s4;

  /// React `border-2`입니다. 썸 테두리의 두께입니다.
  static const double thumbBorderWidth = HoronSpace.s0_5;

  /// 테스트가 트랙을 찾는 키입니다.
  static const Key trackKey = ValueKey<String>('horon-slider-track');

  @override
  State<HoronSlider> createState() => _HoronSliderState();
}

class _HoronSliderState extends State<HoronSlider> {
  bool _focused = false;

  bool get _enabled => widget.enabled && widget.onChanged != null;

  double get _range => widget.max - widget.min;

  /// 지금 값입니다. 범위 밖의 값은 범위 안으로 잘립니다.
  double get _value => widget.value.clamp(widget.min, widget.max).toDouble();

  /// 값이 범위에서 차지하는 비율입니다. 범위가 0이면 0입니다.
  double get _fraction => _range <= 0 ? 0 : (_value - widget.min) / _range;

  /// 눈금이 있으면 한 눈금, 없으면 범위의 1%만큼 움직이는 비율입니다.
  double get _stepFraction {
    if (_range <= 0) return 0;
    final int? divisions = widget.divisions;
    return divisions == null ? 1 / _keyboardSteps : 1 / divisions;
  }

  /// 비율을 값으로 옮깁니다. 눈금이 있으면 가장 가까운 눈금으로 반올림하고,
  /// 범위 밖으로는 넘기지 않습니다.
  double _valueAt(double fraction) {
    final double clamped = fraction.clamp(0.0, 1.0).toDouble();
    final double raw = widget.min + clamped * _range;
    final int? divisions = widget.divisions;
    if (divisions == null || _range <= 0) return raw.clamp(widget.min, widget.max).toDouble();
    final double step = _range / divisions;
    final double snapped = widget.min + ((raw - widget.min) / step).round() * step;
    return snapped.clamp(widget.min, widget.max).toDouble();
  }

  void _emitFraction(double fraction) {
    if (!_enabled) return;
    widget.onChanged?.call(_valueAt(fraction));
  }

  void _nudge(int direction) => _emitFraction(_fraction + direction * _stepFraction);

  /// 트랙 상자의 좌표를 비율로 옮깁니다.
  ///
  /// 썸의 중심은 트랙 양 끝에서 썸 반지름만큼 안쪽까지만 움직입니다. 그래야 양
  /// 끝에서 썸이 잘리지 않고, React의 `calc(100%-2px)` 이동과 같은 인상을 냅니다.
  void _emitAtPosition(Offset position, Size size) {
    final double inset = HoronSlider.thumbDiameter / 2;
    final bool horizontal = widget.orientation == Axis.horizontal;
    final double travel = (horizontal ? size.width : size.height) - HoronSlider.thumbDiameter;
    if (travel <= 0) {
      _emitFraction(0);
      return;
    }
    final double offset = horizontal ? position.dx - inset : size.height - inset - position.dy;
    _emitFraction(offset / travel);
  }

  KeyEventResult _handleKey(FocusNode node, KeyEvent event) {
    if (event is! KeyDownEvent) return KeyEventResult.ignored;
    final LogicalKeyboardKey key = event.logicalKey;
    final bool horizontal = widget.orientation == Axis.horizontal;
    final bool forward = horizontal ? key == LogicalKeyboardKey.arrowRight : key == LogicalKeyboardKey.arrowUp;
    final bool backward = horizontal ? key == LogicalKeyboardKey.arrowLeft : key == LogicalKeyboardKey.arrowDown;
    if (!forward && !backward) return KeyEventResult.ignored;
    if (_enabled) _nudge(forward ? 1 : -1);
    return KeyEventResult.handled;
  }

  @override
  Widget build(BuildContext context) {
    final ThemeData theme = Theme.of(context);
    final ColorScheme scheme = theme.colorScheme;
    final HoronThemeData horon = HoronTheme.of(context);
    final bool horizontal = widget.orientation == Axis.horizontal;
    final bool focused = _focused && _enabled;

    final Widget track = LayoutBuilder(
      builder: (BuildContext context, BoxConstraints constraints) {
        final Size size = Size(
          horizontal ? constraints.maxWidth : HoronSlider.thumbDiameter,
          horizontal
              ? HoronSlider.thumbDiameter
              : (constraints.maxHeight.isFinite ? constraints.maxHeight : _defaultVerticalHeight),
        );
        return GestureDetector(
          behavior: HitTestBehavior.opaque,
          onTapDown: _enabled ? (TapDownDetails details) => _emitAtPosition(details.localPosition, size) : null,
          onHorizontalDragStart: _enabled && horizontal
              ? (DragStartDetails details) => _emitAtPosition(details.localPosition, size)
              : null,
          onHorizontalDragUpdate: _enabled && horizontal
              ? (DragUpdateDetails details) => _emitAtPosition(details.localPosition, size)
              : null,
          onVerticalDragStart: _enabled && !horizontal
              ? (DragStartDetails details) => _emitAtPosition(details.localPosition, size)
              : null,
          onVerticalDragUpdate: _enabled && !horizontal
              ? (DragUpdateDetails details) => _emitAtPosition(details.localPosition, size)
              : null,
          child: CustomPaint(
            key: HoronSlider.trackKey,
            size: size,
            painter: HoronSliderPainter(
              fraction: _fraction,
              horizontal: horizontal,
              trackColor: scheme.surfaceContainer,
              rangeColor: scheme.primary,
              thumbFill: scheme.surface,
              thumbBorder: scheme.primary,
              shadowColor: HoronShadow.sm.first.color,
              haloColor: focused ? horon.ring.withValues(alpha: _focusRingAlpha) : null,
            ),
          ),
        );
      },
    );

    final Widget body = horizontal
        ? Row(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.center,
            children: <Widget>[
              Expanded(child: track),
              if (widget.showValue) ...<Widget>[const SizedBox(width: HoronSpace.s3), HoronSliderValue(value: _value)],
            ],
          )
        : Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.center,
            children: <Widget>[
              SizedBox(height: widget.height ?? _defaultVerticalHeight, child: track),
              if (widget.showValue) ...<Widget>[const SizedBox(height: HoronSpace.s3), HoronSliderValue(value: _value)],
            ],
          );

    final String valueText = formatSliderValue(_value);
    return Semantics(
      container: true,
      slider: true,
      enabled: _enabled,
      label: widget.semanticsLabel,
      value: valueText,
      increasedValue: formatSliderValue(_valueAt((_fraction + _stepFraction).clamp(0.0, 1.0))),
      decreasedValue: formatSliderValue(_valueAt((_fraction - _stepFraction).clamp(0.0, 1.0))),
      onIncrease: _enabled ? () => _nudge(1) : null,
      onDecrease: _enabled ? () => _nudge(-1) : null,
      child: Opacity(
        opacity: _enabled ? 1 : _disabledOpacity,
        child: Focus(
          onFocusChange: (bool value) {
            if (_focused == value) return;
            setState(() => _focused = value);
          },
          onKeyEvent: _handleKey,
          child: body,
        ),
      ),
    );
  }
}

/// `slider.tsx`의 `SliderValue`입니다.
///
/// React의 `text-sm text-muted-foreground tabular-nums`를 옮깁니다. 숫자 폭을
/// 고정해야 값이 바뀔 때 옆 글자가 흔들리지 않습니다.
class HoronSliderValue extends StatelessWidget {
  /// 값 표시를 만듭니다.
  const HoronSliderValue({super.key, required this.value, this.style});

  /// 보여줄 값입니다.
  final double value;

  /// 스타일을 덮어쓸 때 씁니다.
  final TextStyle? style;

  @override
  Widget build(BuildContext context) {
    final ThemeData theme = Theme.of(context);
    final ColorScheme scheme = theme.colorScheme;
    final TextStyle resolved = (style ?? theme.textTheme.bodyMedium ?? const TextStyle()).copyWith(
      color: scheme.onSurfaceVariant,
      fontSize: HoronText.body,
      fontFeatures: const <FontFeature>[FontFeature.tabularFigures()],
    );
    return Text(formatSliderValue(value), style: resolved);
  }
}

/// 슬라이더 값의 표시 문자열입니다.
///
/// 정수면 소수점을 붙이지 않고, 아니면 소수 한 자리로 줄입니다. 소수 자리를
/// 늘리면 `0.30000000000000004` 같은 부동소수 잔여가 화면에 나옵니다.
String formatSliderValue(double value) =>
    value == value.roundToDouble() ? value.toStringAsFixed(0) : value.toStringAsFixed(1);

/// 트랙·채움·썸을 한 좌표계에서 그립니다.
///
/// 수평에서는 왼쪽에서 오른쪽으로, 수직에서는 아래에서 위로 값이 커집니다
/// (Base UI의 세로 슬라이더와 같은 방향입니다). 채움은 트랙의 시작에서 썸의
/// 중심까지 그리므로, 양 끝에서는 채움의 끝이 썸 아래에 가립니다.
class HoronSliderPainter extends CustomPainter {
  const HoronSliderPainter({
    required this.fraction,
    required this.horizontal,
    required this.trackColor,
    required this.rangeColor,
    required this.thumbFill,
    required this.thumbBorder,
    required this.shadowColor,
    this.haloColor,
  });

  /// 0~1 사이의 값 위치입니다.
  final double fraction;

  /// 수평이면 참입니다.
  final bool horizontal;

  /// 트랙 색입니다. React `bg-muted`입니다.
  final Color trackColor;

  /// 채워진 범위의 색입니다. React `bg-primary`입니다.
  final Color rangeColor;

  /// 썸의 채움입니다. React `bg-background`입니다.
  final Color thumbFill;

  /// 썸의 테두리입니다. React `border-primary`입니다.
  final Color thumbBorder;

  /// 썸 아래 그림자 색입니다. React `shadow-sm`입니다.
  final Color shadowColor;

  /// 포커스 링 색입니다. 없으면 그리지 않습니다.
  final Color? haloColor;

  @override
  void paint(Canvas canvas, Size size) {
    final Rect rect = Offset.zero & size;
    final double inset = HoronSlider.thumbDiameter / 2;
    final double travel = (horizontal ? rect.width : rect.height) - HoronSlider.thumbDiameter;
    final double position = horizontal
        ? rect.left + inset + travel * fraction
        : rect.bottom - inset - travel * fraction;

    final Rect trackRect = horizontal
        ? Rect.fromCenter(center: rect.center, width: rect.width, height: HoronSlider.trackThickness)
        : Rect.fromCenter(center: rect.center, width: HoronSlider.trackThickness, height: rect.height);
    final Radius cap = Radius.circular(HoronSlider.trackThickness / 2);
    canvas.drawRRect(RRect.fromRectAndRadius(trackRect, cap), Paint()..color = trackColor);

    final Rect rangeRect = horizontal
        ? Rect.fromLTRB(rect.left, trackRect.top, position, trackRect.bottom)
        : Rect.fromLTRB(trackRect.left, position, trackRect.right, rect.bottom);
    canvas.drawRRect(RRect.fromRectAndRadius(rangeRect, cap), Paint()..color = rangeColor);

    final Offset center = horizontal ? Offset(position, rect.center.dy) : Offset(rect.center.dx, position);
    final Color? halo = haloColor;
    if (halo != null) {
      canvas.drawCircle(center, HoronSlider.thumbDiameter / 2 + _focusRingSpread, Paint()..color = halo);
    }
    canvas.drawCircle(
      center,
      HoronSlider.thumbDiameter / 2,
      Paint()
        ..color = shadowColor
        ..maskFilter = const MaskFilter.blur(BlurStyle.normal, _thumbShadowBlur),
    );
    canvas.drawCircle(center, HoronSlider.thumbDiameter / 2, Paint()..color = thumbFill);
    canvas.drawCircle(
      center,
      (HoronSlider.thumbDiameter - HoronSlider.thumbBorderWidth) / 2,
      Paint()
        ..color = thumbBorder
        ..style = PaintingStyle.stroke
        ..strokeWidth = HoronSlider.thumbBorderWidth,
    );
  }

  @override
  bool shouldRepaint(covariant HoronSliderPainter oldDelegate) =>
      oldDelegate.fraction != fraction ||
      oldDelegate.horizontal != horizontal ||
      oldDelegate.trackColor != trackColor ||
      oldDelegate.rangeColor != rangeColor ||
      oldDelegate.thumbFill != thumbFill ||
      oldDelegate.thumbBorder != thumbBorder ||
      oldDelegate.shadowColor != shadowColor ||
      oldDelegate.haloColor != haloColor;
}

/// 눈금이 없을 때 키보드가 한 번에 움직이는 칸 수입니다. 범위의 1%씩입니다.
const int _keyboardSteps = 100;

/// 세로 슬라이더의 기본 높이입니다. React는 `h-full`이라 부모가 정하지만,
/// Flutter에서는 높이가 없으면 그릴 수 없으므로 이 값으로 떨어집니다.
const double _defaultVerticalHeight = HoronSpace.s24;

/// 썸 그림자의 번짐 반지름입니다.
const double _thumbShadowBlur = 2;

/// React `ring-ring/50`의 투명도입니다.
const double _focusRingAlpha = 0.5;

/// 포커스 링이 썸 바깥으로 번지는 거리입니다.
const double _focusRingSpread = HoronSpace.s0_5;

/// React `data-disabled:opacity-50`입니다.
const double _disabledOpacity = 0.5;
