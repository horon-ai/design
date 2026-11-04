import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import '../theme/horon_motion.dart';
import '../theme/horon_theme.dart';
import '../tokens/horon_tokens.g.dart';

/// `border-[1.5px]` — 선택 전 상자의 테두리 두께입니다.
const double _borderWidth = 1.5;

/// `checkbox.tsx`의 `CheckboxSize`입니다.
enum HoronCheckboxSize {
  /// `size="sm"` — 18px 상자, 6px 반경, `body-sm`, 아이콘 12px.
  sm,

  /// `size="md"` — 20px 상자, 6px 반경, `body-md`, 아이콘 14px. 기본값입니다.
  md,

  /// `size="lg"` — 24px 상자, 6px 반경, `body-lg`, 아이콘 16px.
  lg,
}

typedef _CheckboxMetrics = ({double side, double radius, double gap, double indicator, TextStyle textStyle});

_CheckboxMetrics _metricsOf(HoronCheckboxSize size, HoronThemeData theme) => switch (size) {
  HoronCheckboxSize.sm => (
    side: theme.space.step(4.5),
    radius: theme.radius.xs,
    gap: theme.space.s2,
    indicator: 12,
    textStyle: theme.text.bodySm,
  ),
  HoronCheckboxSize.md => (
    side: theme.space.step(5),
    radius: theme.radius.xs,
    gap: theme.space.s2_5,
    indicator: 14,
    textStyle: theme.text.bodyMd,
  ),
  HoronCheckboxSize.lg => (
    side: theme.space.step(6),
    radius: theme.radius.xs,
    gap: theme.space.s3,
    indicator: 16,
    textStyle: theme.text.bodyLg,
  ),
};

/// `has-[[data-disabled]]:opacity-40`입니다.
const double _disabledOpacity = 0.4;

/// Figma `Checkbox`(58:217)입니다.
///
/// 20px 상자에 6px 반경, 라벨과 10px 간격입니다. [value]가 null이면 React의
/// `indeterminate`와 같은 상태로 빼기 표시를 그립니다. `size="sm"`은 데이터 표가
/// 쓰는 18px 상자(192:9046)입니다.
class HoronCheckbox extends StatefulWidget {
  /// 체크박스를 만듭니다.
  const HoronCheckbox({
    super.key,
    this.value,
    this.onChanged,
    this.label,
    this.size = HoronCheckboxSize.md,
    this.enabled = true,
  });

  /// 선택 여부입니다. null이면 부분 선택(indeterminate)입니다.
  final bool? value;

  /// 값이 바뀔 때 부를 콜백입니다. 부분 선택에서 누르면 true가 됩니다.
  final ValueChanged<bool?>? onChanged;

  /// 상자 오른쪽 라벨입니다.
  final String? label;

  /// 크기입니다. 기본값은 [HoronCheckboxSize.md]입니다.
  final HoronCheckboxSize size;

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

    final _CheckboxMetrics metrics = _metricsOf(widget.size, theme);
    final double side = metrics.side;
    final double radius = metrics.radius;

    final Color fill = _marked
        ? (_hovered && interactive ? colors.interactivePrimaryHover : colors.interactivePrimary)
        : colors.bgSurface;
    // React `data-checked:border-interactive-primary` — 선택해도 테두리 두께 1.5는 남고
    // 색만 잉크색으로 바뀝니다. 꺼짐은 `border-border-strong`(hover에서 `text-secondary`)입니다.
    final Color borderColor = _marked
        ? (_hovered && interactive ? colors.interactivePrimaryHover : colors.interactivePrimary)
        : (_hovered && interactive ? colors.textSecondary : colors.borderStrong);

    final Widget box = AnimatedContainer(
      duration: reduceMotion ? Duration.zero : HoronMotion.colorsDuration,
      curve: HoronMotion.colorsCurve,
      width: side,
      height: side,
      decoration: BoxDecoration(
        color: fill,
        borderRadius: BorderRadius.circular(radius),
        border: Border.all(color: borderColor, width: _borderWidth),
      ),
      child: Center(
        // React는 `animate-pop-in`으로 들어오고 `data-ending-style:animate-scale-out`으로
        // 나갑니다. AnimatedSwitcher의 reverseDuration이 나가는 쪽 시간을 나릅니다.
        child: AnimatedSwitcher(
          duration: reduceMotion ? Duration.zero : HoronMotion.popInDuration,
          reverseDuration: reduceMotion ? Duration.zero : HoronMotion.scaleOutDuration,
          switchInCurve: HoronMotion.popInCurve,
          switchOutCurve: HoronMotion.scaleOutCurve,
          transitionBuilder: (Widget child, Animation<double> animation) => FadeTransition(
            opacity: animation,
            child: ScaleTransition(
              scale: Tween<double>(begin: HoronMotion.popInScale, end: 1).animate(animation),
              child: child,
            ),
          ),
          child: _marked
              ? Icon(
                  widget.value == null ? Icons.remove : Icons.check,
                  key: ValueKey<String>(widget.value == null ? 'indeterminate' : 'checked'),
                  size: metrics.indicator,
                  color: colors.interactiveOnPrimary,
                )
              : const SizedBox.shrink(key: ValueKey<String>('unchecked')),
        ),
      ),
    );

    final Widget content = Row(
      mainAxisSize: MainAxisSize.min,
      spacing: metrics.gap,
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
            child: Text(widget.label!, style: metrics.textStyle.copyWith(color: colors.textPrimary)),
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
