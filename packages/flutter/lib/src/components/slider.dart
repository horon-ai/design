import 'dart:math' as math;

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import '../theme/horon_theme.dart';
import '../tokens/horon_tokens.g.dart';

/// `w-55` — 데스크톱에서 React가 잡는 폭 220px입니다. 좁은 화면에서는 이 값 대신
/// 부모가 준 폭을 씁니다.
const double _maxWidthUnits = 55;

/// `data-disabled:opacity-40`입니다.
const double _disabledOpacity = 0.4;

/// 키보드 한 번에 옮기는 비율입니다. React의 화살표 이동과 같은 성격의 보조 동작입니다.
const double _keyboardStepFraction = 0.05;

/// Paper 설정 화면의 슬라이더(Voice / Speed)입니다.
///
/// 높이 20px 조작부, 8% 잉크 트랙, 잉크로 채운 진행분, 1px 헤어라인과
/// `0 1px 3px` 그림자가 있는 18px 흰 썸으로 이루어집니다. React는 `w-55`(220px)를
/// 잡지만 좁은 화면에서는 줄어듭니다.
class HoronSlider extends StatefulWidget {
  /// 슬라이더를 만듭니다.
  const HoronSlider({
    super.key,
    required this.value,
    this.onChanged,
    this.min = 0,
    this.max = 100,
    this.semanticLabel,
    this.enabled = true,
  });

  /// 현재 값입니다.
  final double value;

  /// 값이 바뀔 때 부를 콜백입니다. null이면 조작할 수 없습니다.
  final ValueChanged<double>? onChanged;

  /// 최솟값입니다. React `Slider.Root`의 기본값과 같습니다.
  final double min;

  /// 최댓값입니다.
  final double max;

  /// 접근성 이름입니다. React의 `aria-label`입니다.
  final String? semanticLabel;

  /// 거짓이면 `opacity-40`으로 흐려지고 조작할 수 없습니다.
  final bool enabled;

  @override
  State<HoronSlider> createState() => _HoronSliderState();
}

class _HoronSliderState extends State<HoronSlider> {
  bool _focused = false;

  double get _range => widget.max - widget.min;

  double get _fraction => _range <= 0 ? 0 : ((widget.value - widget.min) / _range).clamp(0, 1).toDouble();

  void _emitFraction(double fraction) {
    final double next = widget.min + fraction.clamp(0, 1) * _range;
    widget.onChanged?.call(next);
  }

  void _emitAt(double dx, double width, double thumb) {
    final double travel = width - thumb;
    if (travel <= 0) return;
    _emitFraction((dx - thumb / 2) / travel);
  }

  void _nudge(int direction) {
    _emitFraction(_fraction + direction * _keyboardStepFraction);
  }

  /// 접근성으로 한 단계 옮겼을 때 읽어 줄 값입니다.
  String _nudgedText(int direction) {
    final double next = widget.value + direction * _range * _keyboardStepFraction;
    return next.clamp(widget.min, widget.max).round().toString();
  }

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    final HoronColors colors = theme.colors;
    final HoronSpaceSpec space = theme.space;
    final bool interactive = widget.enabled && widget.onChanged != null;

    // h-5 조작부, h-1.5 트랙, size-[18px] 썸.
    final double controlHeight = space.step(5);
    final double trackHeight = space.step(1.5);
    final double thumbSize = space.step(4.5);
    final double fraction = _fraction;

    return LayoutBuilder(
      builder: (BuildContext context, BoxConstraints constraints) {
        // w-55 = 220px. 부모가 그보다 좁으면 부모 폭을 따릅니다.
        final double width = constraints.maxWidth.isFinite
            ? math.min(space.step(_maxWidthUnits), constraints.maxWidth)
            : space.step(_maxWidthUnits);

        final Widget thumb = Container(
          width: thumbSize,
          height: thumbSize,
          decoration: BoxDecoration(
            color: colors.bgDefault,
            shape: BoxShape.circle,
            border: Border.all(color: colors.borderDefault),
            // shadow-[0_1px_3px_#0000001f] — 그림자 색은 overlay-ink-12 토큰입니다.
            boxShadow: <BoxShadow>[
              BoxShadow(color: colors.overlayInk12, blurRadius: space.step(0.75), offset: const Offset(0, 1)),
            ],
          ),
        );

        final Widget control = Opacity(
          opacity: widget.enabled ? 1 : _disabledOpacity,
          child: SizedBox(
            width: width,
            height: controlHeight,
            child: Stack(
              children: <Widget>[
                // bg-overlay-ink-8 트랙과 bg-interactive-primary 진행분입니다.
                Center(
                  child: SizedBox(
                    height: trackHeight,
                    child: Stack(
                      children: <Widget>[
                        Positioned.fill(
                          child: DecoratedBox(
                            decoration: BoxDecoration(
                              color: colors.overlayInk8,
                              borderRadius: BorderRadius.circular(theme.radius.full),
                            ),
                          ),
                        ),
                        Positioned.fill(
                          child: FractionallySizedBox(
                            alignment: Alignment.centerLeft,
                            widthFactor: fraction,
                            child: DecoratedBox(
                              decoration: BoxDecoration(
                                color: colors.interactivePrimary,
                                borderRadius: BorderRadius.circular(theme.radius.full),
                              ),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
                Positioned(
                  left: fraction * (width - thumbSize),
                  top: (controlHeight - thumbSize) / 2,
                  child: _FocusOutline(
                    visible: _focused && interactive,
                    radius: theme.radius.full,
                    gap: space.s0_5,
                    width: space.s0_5,
                    color: colors.textBrand,
                    child: thumb,
                  ),
                ),
              ],
            ),
          ),
        );

        // w-55를 상한으로 두고, 부모가 좁으면 그 폭을 씁니다. `Align`에 배율 1을
        // 주는 이유는 부모가 폭을 꽉 잡는 경우(예: `SizedBox(width: ...)`)에도 트랙이
        // 220을 넘지 않고 왼쪽에 서게 하기 위해서입니다. 이게 없으면 꽉 잔 부모의
        // 폭으로 슬라이더가 늘어납니다.
        return Align(
          alignment: Alignment.centerLeft,
          widthFactor: 1,
          heightFactor: 1,
          child: Semantics(
            slider: true,
            label: widget.semanticLabel,
            value: widget.value.round().toString(),
            increasedValue: _nudgedText(1),
            decreasedValue: _nudgedText(-1),
            enabled: interactive,
            onIncrease: interactive ? () => _nudge(1) : null,
            onDecrease: interactive ? () => _nudge(-1) : null,
            child: FocusableActionDetector(
              enabled: interactive,
              mouseCursor: interactive ? SystemMouseCursors.click : SystemMouseCursors.basic,
              onShowFocusHighlight: (bool value) => setState(() => _focused = value),
              child: CallbackShortcuts(
                bindings: <ShortcutActivator, VoidCallback>{
                  const SingleActivator(LogicalKeyboardKey.arrowLeft): () => _nudge(-1),
                  const SingleActivator(LogicalKeyboardKey.arrowRight): () => _nudge(1),
                },
                child: GestureDetector(
                  behavior: HitTestBehavior.opaque,
                  onTapDown: interactive
                      ? (TapDownDetails details) => _emitAt(details.localPosition.dx, width, thumbSize)
                      : null,
                  onHorizontalDragStart: interactive
                      ? (DragStartDetails details) => _emitAt(details.localPosition.dx, width, thumbSize)
                      : null,
                  onHorizontalDragUpdate: interactive
                      ? (DragUpdateDetails details) => _emitAt(details.localPosition.dx, width, thumbSize)
                      : null,
                  child: control,
                ),
              ),
            ),
          ),
        );
      },
    );
  }
}

/// `focus-visible:outline-2 outline-offset-2 outline-text-brand`을 그립니다.
class _FocusOutline extends StatelessWidget {
  const _FocusOutline({
    required this.visible,
    required this.radius,
    required this.gap,
    required this.width,
    required this.color,
    required this.child,
  });

  final bool visible;
  final double radius;
  final double gap;
  final double width;
  final Color color;
  final Widget child;

  @override
  Widget build(BuildContext context) {
    if (!visible) return child;
    return Stack(
      clipBehavior: Clip.none,
      children: <Widget>[
        Positioned(
          left: -gap,
          top: -gap,
          right: -gap,
          bottom: -gap,
          child: IgnorePointer(
            child: DecoratedBox(
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(radius + gap),
                border: Border.all(color: color, width: width),
              ),
            ),
          ),
        ),
        child,
      ],
    );
  }
}
