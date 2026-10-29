import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import '../theme/horon_motion.dart';
import '../theme/horon_theme.dart';
import '../tokens/horon_tokens.g.dart';

/// `border-[1.5px]` — 선택 전 원의 테두리 두께입니다.
const double _borderWidth = 1.5;

/// `size-2` — 선택된 원 안의 점 8px입니다.
const double _dotUnits = 2;

/// `has-[[data-disabled]]:opacity-40`입니다.
const double _disabledOpacity = 0.4;

/// 라디오 그룹입니다.
///
/// React의 `RadioGroup`처럼 `flex flex-col gap-3`으로 자식을 세로로 쌓고, 선택
/// 값과 콜백을 자식 [HoronRadio]에 전달합니다. 그룹 밖의 라디오는 선택되지 않은
/// 모습으로 그려지고 눌러도 아무 일도 하지 않습니다(React도 그룹이 있어야 선택을
/// 옮깁니다).
class HoronRadioGroup extends StatelessWidget {
  /// 라디오 그룹을 만듭니다.
  const HoronRadioGroup({super.key, required this.value, this.onValueChange, required this.children});

  /// 지금 선택된 라디오의 값입니다.
  final String? value;

  /// 다른 라디오를 골랐을 때 부를 콜백입니다.
  final ValueChanged<String>? onValueChange;

  /// 그룹에 넣을 [HoronRadio] 목록입니다.
  final List<Widget> children;

  @override
  Widget build(BuildContext context) {
    final HoronSpaceSpec space = HoronTheme.of(context).space;
    return _HoronRadioScope(
      value: value,
      onValueChange: onValueChange,
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        spacing: space.s3,
        children: children,
      ),
    );
  }
}

/// Figma `Radio`(58:239)입니다.
///
/// 20px 원이고, 선택되면 잉크색으로 채워지며 8px 점이 나타납니다. [value]는
/// [HoronRadioGroup]의 [HoronRadioGroup.value]와 같은 타입의 값입니다.
class HoronRadio extends StatefulWidget {
  /// 라디오를 만듭니다.
  const HoronRadio({super.key, required this.value, this.label, this.enabled = true});

  /// 이 라디오의 값입니다.
  final String value;

  /// 원 오른쪽 라벨입니다.
  final String? label;

  /// 거짓이면 줄 전체가 `opacity-40`으로 흐려지고 선택되지 않습니다.
  final bool enabled;

  @override
  State<HoronRadio> createState() => _HoronRadioState();
}

class _HoronRadioState extends State<HoronRadio> {
  bool _hovered = false;
  bool _focused = false;

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    final HoronColors colors = theme.colors;
    final HoronSpaceSpec space = theme.space;
    final _HoronRadioScope? scope = context.dependOnInheritedWidgetOfExactType<_HoronRadioScope>();
    final bool selected = scope?.value == widget.value;
    final bool interactive = widget.enabled && scope?.onValueChange != null;
    final bool reduceMotion = MediaQuery.disableAnimationsOf(context);

    final double side = space.step(5);
    final Color fill = selected
        ? (_hovered && interactive ? colors.interactivePrimaryHover : colors.interactivePrimary)
        : colors.bgSurface;
    final Color borderColor = selected
        ? Colors.transparent
        : (_hovered && interactive ? colors.textSecondary : colors.borderStrong);

    final Widget circle = AnimatedContainer(
      duration: reduceMotion ? Duration.zero : HoronMotion.colorsDuration,
      curve: HoronMotion.colorsCurve,
      width: side,
      height: side,
      decoration: BoxDecoration(
        color: fill,
        shape: BoxShape.circle,
        // data-checked:border-0 — 선택되면 테두리가 사라집니다.
        border: Border.all(color: borderColor, width: selected ? 0 : _borderWidth),
      ),
      child: selected
          ? Center(
              child: TweenAnimationBuilder<double>(
                tween: Tween<double>(begin: HoronMotion.popInScale, end: 1),
                duration: reduceMotion ? Duration.zero : HoronMotion.popInDuration,
                curve: HoronMotion.popInCurve,
                builder: (BuildContext context, double scale, Widget? child) =>
                    Transform.scale(scale: scale, child: child),
                child: Container(
                  width: space.step(_dotUnits),
                  height: space.step(_dotUnits),
                  decoration: BoxDecoration(color: colors.interactiveOnPrimary, shape: BoxShape.circle),
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
          radius: theme.radius.full,
          gap: space.s0_5,
          width: space.s0_5,
          color: colors.textBrand,
          child: circle,
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
        onTap: interactive ? () => scope?.onValueChange?.call(widget.value) : null,
        child: MergeSemantics(
          child: Semantics(
            inMutuallyExclusiveGroup: true,
            checked: selected,
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
                    scope?.onValueChange?.call(widget.value);
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

/// 그룹의 선택 값과 콜백을 자식 라디오에 내려 줍니다.
class _HoronRadioScope extends InheritedWidget {
  const _HoronRadioScope({required this.value, required this.onValueChange, required super.child});

  final String? value;
  final ValueChanged<String>? onValueChange;

  @override
  bool updateShouldNotify(_HoronRadioScope oldWidget) =>
      value != oldWidget.value || onValueChange != oldWidget.onValueChange;
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
