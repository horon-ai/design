import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import '../theme/horon_motion.dart';
import '../theme/horon_theme.dart';
import '../tokens/horon_tokens.g.dart';

/// `border-[1.5px]` — 선택 전 상자의 테두리 두께입니다.
const double _borderWidth = 1.5;

/// `[&_svg]:size-3.5` — 체크·빼기 아이콘 14px입니다.
const double _indicatorSize = 14;

/// `rounded-[5px]` — `size="sm"` 상자의 반경입니다. 토큰 단계에 없는 값이라 간격 단위로 계산합니다.
const double _smallRadiusUnits = 1.25;

/// `has-[[data-disabled]]:opacity-40`입니다.
const double _disabledOpacity = 0.4;

/// Figma `Checkbox`(58:217)입니다.
///
/// 20px 상자에 6px 반경, 라벨과 10px 간격입니다. [value]가 null이면 React의
/// `indeterminate`와 같은 상태로 빼기 표시를 그립니다. `size="sm"`은 데이터 표가
/// 쓰는 18px 상자(192:9046)입니다.
class HoronCheckbox extends StatefulWidget {
  /// 체크박스를 만듭니다.
  const HoronCheckbox({super.key, this.value, this.onChanged, this.label, this.small = false, this.enabled = true});

  /// 선택 여부입니다. null이면 부분 선택(indeterminate)입니다.
  final bool? value;

  /// 값이 바뀔 때 부를 콜백입니다. 부분 선택에서 누르면 true가 됩니다.
  final ValueChanged<bool?>? onChanged;

  /// 상자 오른쪽 라벨입니다.
  final String? label;

  /// React `size="sm"`(18px 상자)에 대응합니다. 기본값은 `size="md"`(20px)입니다.
  final bool small;

  /// 거짓이면 줄 전체가 `opacity-40`으로 흐려지고 바뀌지 않습니다.
  final bool enabled;

  @override
  State<HoronCheckbox> createState() => _HoronCheckboxState();
}

class _HoronCheckboxState extends State<HoronCheckbox> {
  bool _hovered = false;
  bool _focused = false;

  /// 선택도 부분 선택도 아닉 꺼짐 상태입니다.
  ///
  /// `value`가 null이면 부분 선택(`indeterminate`)이므로 선택된 것으로 그립니다.
  bool get _marked => widget.value ?? true;

  void _toggle() {
    widget.onChanged?.call(widget.value == true ? false : true);
  }

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    final HoronColors colors = theme.colors;
    final HoronSpaceSpec space = theme.space;
    final bool interactive = widget.enabled && widget.onChanged != null;
    final bool reduceMotion = MediaQuery.disableAnimationsOf(context);

    // size-5 rounded-xs(6) / size-4.5 rounded-[5px].
    final double side = widget.small ? space.step(4.5) : space.step(5);
    final double radius = widget.small ? space.step(_smallRadiusUnits) : theme.radius.xs;

    final Color fill = _marked
        ? (_hovered && interactive ? colors.interactivePrimaryHover : colors.interactivePrimary)
        : colors.bgSurface;
    final Color borderColor = _marked
        ? Colors.transparent
        : (_hovered && interactive ? colors.textSecondary : colors.borderStrong);

    final Widget box = AnimatedContainer(
      duration: reduceMotion ? Duration.zero : HoronMotion.colorsDuration,
      curve: HoronMotion.colorsCurve,
      width: side,
      height: side,
      decoration: BoxDecoration(
        color: fill,
        borderRadius: BorderRadius.circular(radius),
        // data-checked:border-0 data-indeterminate:border-0 — 선택되면 테두리가 사라집니다.
        border: Border.all(color: borderColor, width: _marked ? 0 : _borderWidth),
      ),
      child: _marked
          ? Center(
              child: TweenAnimationBuilder<double>(
                tween: Tween<double>(begin: HoronMotion.popInScale, end: 1),
                duration: reduceMotion ? Duration.zero : HoronMotion.popInDuration,
                curve: HoronMotion.popInCurve,
                builder: (BuildContext context, double scale, Widget? child) =>
                    Transform.scale(scale: scale, child: child),
                child: Icon(
                  widget.value == null ? Icons.remove : Icons.check,
                  size: _indicatorSize,
                  color: colors.interactiveOnPrimary,
                ),
              ),
            )
          : null,
    );

    final Widget content = Row(
      mainAxisSize: MainAxisSize.min,
      spacing: space.s2_5,
      children: <Widget>[
        _FocusOutline(
          visible: _focused && interactive,
          radius: radius,
          gap: space.s0_5,
          width: space.s0_5,
          color: colors.textBrand,
          child: box,
        ),
        if (widget.label != null)
          Flexible(
            child: Text(widget.label!, style: theme.text.bodyMd.copyWith(color: colors.textPrimary)),
          ),
      ],
    );

    return Opacity(
      opacity: widget.enabled ? 1 : _disabledOpacity,
      child: GestureDetector(
        behavior: HitTestBehavior.opaque,
        onTap: interactive ? _toggle : null,
        child: MergeSemantics(
          child: Semantics(
            checked: widget.value,
            mixed: widget.value == null,
            enabled: interactive,
            child: FocusableActionDetector(
              enabled: interactive,
              mouseCursor: interactive ? SystemMouseCursors.click : SystemMouseCursors.basic,
              onShowHoverHighlight: (bool value) => setState(() => _hovered = value),
              onShowFocusHighlight: (bool value) => setState(() => _focused = value),
              shortcuts: const <ShortcutActivator, Intent>{
                SingleActivator(LogicalKeyboardKey.enter): ActivateIntent(),
                SingleActivator(LogicalKeyboardKey.space): ActivateIntent(),
              },
              actions: <Type, Action<Intent>>{
                ActivateIntent: CallbackAction<ActivateIntent>(
                  onInvoke: (ActivateIntent intent) {
                    _toggle();
                    return null;
                  },
                ),
              },
              child: content,
            ),
          ),
        ),
      ),
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
