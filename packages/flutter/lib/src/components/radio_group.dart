import 'package:flutter/material.dart';

import '../theme/horon_motion.dart';
import '../theme/horon_theme.dart';
import '../tokens/horon_tokens.g.dart';

/// `border-[1.5px]` — 선택 전 원의 테두리 두께입니다.
const double _borderWidth = 1.5;

/// `radio-group.tsx`의 `RadioSize`입니다.
enum HoronRadioSize {
  /// `size="sm"` — 16px 원, 6px 점, `body-sm`.
  sm,

  /// `size="md"` — 20px 원, 8px 점, `body-md`. 기본값입니다.
  md,

  /// `size="lg"` — 24px 원, 10px 점, `body-lg`.
  lg,
}

typedef _RadioMetrics = ({double side, double dot, double gap, TextStyle textStyle});

_RadioMetrics _metricsOf(HoronRadioSize size, HoronThemeData theme) => switch (size) {
  HoronRadioSize.sm => (
    side: theme.space.step(4),
    dot: theme.space.step(1.5),
    gap: theme.space.s2,
    textStyle: theme.text.bodySm,
  ),
  HoronRadioSize.md => (
    side: theme.space.step(5),
    dot: theme.space.step(2),
    gap: theme.space.s2_5,
    textStyle: theme.text.bodyMd,
  ),
  HoronRadioSize.lg => (
    side: theme.space.step(6),
    dot: theme.space.step(2.5),
    gap: theme.space.s3,
    textStyle: theme.text.bodyLg,
  ),
};

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
  const HoronRadioGroup({
    super.key,
    required this.value,
    this.onValueChange,
    this.size = HoronRadioSize.md,
    required this.children,
  });

  /// 지금 선택된 라디오의 값입니다.
  final String? value;

  /// 그룹 안 라디오의 크기입니다. 기본값은 [HoronRadioSize.md]입니다.
  final HoronRadioSize size;

  /// 다른 라디오를 골랐을 때 부를 콜백입니다.
  final ValueChanged<String>? onValueChange;

  /// 그룹에 넣을 [HoronRadio] 목록입니다.
  final List<Widget> children;

  @override
  Widget build(BuildContext context) {
    final HoronSpaceSpec space = HoronTheme.of(context).space;
    return RadioGroup<String>(
      groupValue: value,
      onChanged: (String? next) {
        if (next != null) onValueChange?.call(next);
      },
      child: _HoronRadioSizeScope(
        size: size,
        enabled: onValueChange != null,
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          spacing: space.s3,
          children: children,
        ),
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
  const HoronRadio({super.key, required this.value, this.label, this.size, this.enabled = true});

  /// 이 라디오의 값입니다.
  final String value;

  /// 그룹 크기를 덮어쓸 때 넘깁니다. 없으면 그룹 값을 씁니다.
  final HoronRadioSize? size;

  /// 원 오른쪽 라벨입니다.
  final String? label;

  /// 거짓이면 줄 전체가 `opacity-40`으로 흐려지고 선택되지 않습니다.
  final bool enabled;

  @override
  State<HoronRadio> createState() => _HoronRadioState();
}

class _HoronRadioState extends State<HoronRadio> {
  final FocusNode _focusNode = FocusNode();

  @override
  void dispose() {
    _focusNode.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    final _HoronRadioSizeScope? scope = context.dependOnInheritedWidgetOfExactType<_HoronRadioSizeScope>();
    final RadioGroupRegistry<String>? registry = RadioGroup.maybeOf<String>(context);
    final bool enabled = registry != null && widget.enabled && (scope?.enabled ?? false);
    final bool reduceMotion = MediaQuery.disableAnimationsOf(context);

    final _RadioMetrics metrics = _metricsOf(widget.size ?? scope?.size ?? HoronRadioSize.md, theme);

    // 라벨이 접근성 이름이 되도록 라디오의 시맨틱과 라벨을 한 노드로 합칩니다.
    return MergeSemantics(
      child: RawRadio<String>(
        value: widget.value,
        mouseCursor: WidgetStateProperty.resolveWith(
          (Set<WidgetState> states) =>
              states.contains(WidgetState.disabled) ? SystemMouseCursors.basic : SystemMouseCursors.click,
        ),
        toggleable: false,
        focusNode: _focusNode,
        autofocus: false,
        groupRegistry: registry,
        enabled: enabled,
        builder: (BuildContext context, ToggleableStateMixin state) {
          final HoronColors colors = theme.colors;
          final HoronSpaceSpec space = theme.space;
          final double side = metrics.side;
          final bool selected = state.value ?? false;
          final bool hovered = state.states.contains(WidgetState.hovered);
          final bool focused = state.states.contains(WidgetState.focused);
          final Color fill = selected
              ? (hovered ? colors.interactivePrimaryHover : colors.interactivePrimary)
              : colors.bgSurface;
          // React `data-checked:border-interactive-primary` — 선택해도 1.5px 테두리는
          // 남고 색만 바뀝니다. hover에서는 그 색이 `-hover`가 됩니다.
          final Color borderColor = selected
              ? (hovered ? colors.interactivePrimaryHover : colors.interactivePrimary)
              : (hovered ? colors.textSecondary : colors.borderStrong);

          final Widget circle = AnimatedContainer(
            duration: reduceMotion ? Duration.zero : HoronMotion.colorsDuration,
            curve: HoronMotion.colorsCurve,
            width: side,
            height: side,
            decoration: BoxDecoration(
              color: fill,
              shape: BoxShape.circle,
              border: Border.all(color: borderColor, width: _borderWidth),
            ),
            child: Center(
              // React는 `animate-pop-in`으로 들어오고 `data-ending-style:animate-scale-out`으로
              // 나갑니다. AnimatedSwitcher가 두 방향의 시간을 나눠 잡습니다.
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
                child: selected
                    ? Container(
                        key: const ValueKey<String>('horon-radio-dot'),
                        width: metrics.dot,
                        height: metrics.dot,
                        decoration: BoxDecoration(color: colors.interactiveOnPrimary, shape: BoxShape.circle),
                      )
                    : const SizedBox.shrink(key: ValueKey<String>('horon-radio-empty')),
              ),
            ),
          );

          final Widget content = Row(
            mainAxisSize: MainAxisSize.min,
            spacing: metrics.gap,
            children: <Widget>[
              _FocusOutline(
                visible: focused,
                radius: theme.radius.full,
                gap: space.s0_5,
                width: space.s0_5,
                color: colors.textBrand,
                child: circle,
              ),
              if (widget.label != null)
                Flexible(
                  child: Text(widget.label!, style: metrics.textStyle.copyWith(color: colors.textPrimary)),
                ),
            ],
          );

          // `ColoredBox`는 투명해도 히트 테스트를 하므로 행 전체가 탭 영역이 됩니다.
          return Opacity(
            opacity: widget.enabled ? 1 : _disabledOpacity,
            child: ColoredBox(color: Colors.transparent, child: content),
          );
        },
      ),
    );
  }
}

/// 그룹의 크기와 활성 여부를 자식 라디오에 내려 줍니다.
///
/// 선택 값과 키보드 이동은 위쪽 [RadioGroup]이 나릅니다.
class _HoronRadioSizeScope extends InheritedWidget {
  const _HoronRadioSizeScope({required this.size, required this.enabled, required super.child});

  final HoronRadioSize size;
  final bool enabled;

  @override
  bool updateShouldNotify(_HoronRadioSizeScope oldWidget) => size != oldWidget.size || enabled != oldWidget.enabled;
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
