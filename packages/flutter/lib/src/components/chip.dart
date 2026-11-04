import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import '../theme/horon_motion.dart';
import '../theme/horon_theme.dart';
import '../tokens/horon_tokens.g.dart';

/// `data-disabled:opacity-40`입니다.
const double _disabledOpacity = 0.4;

/// `chip.tsx`의 `ChipSize`입니다.
enum HoronChipSize {
  /// `size="sm"` — 높이 28, 좌우 10, `label-sm`, 체크 12px.
  sm,

  /// `size="md"` — 높이 32, 좌우 12, `label-md`, 체크 14px. 기본값입니다.
  md,

  /// `size="lg"` — 높이 36, 좌우 14, `label-lg`, 체크 16px.
  lg,
}

typedef _ChipMetrics = ({double height, double paddingX, double slot, double check, TextStyle textStyle});

_ChipMetrics _metricsOf(HoronChipSize size, HoronThemeData theme) => switch (size) {
  HoronChipSize.sm => (
    height: theme.space.step(7),
    paddingX: theme.space.s2_5,
    slot: theme.space.step(4.5),
    check: 12,
    textStyle: theme.text.labelSm,
  ),
  HoronChipSize.md => (
    height: theme.space.step(8),
    paddingX: theme.space.s3,
    slot: theme.space.step(5.5),
    check: 14,
    textStyle: theme.text.labelMd,
  ),
  HoronChipSize.lg => (
    height: theme.space.step(9),
    paddingX: theme.space.s3_5,
    slot: theme.space.step(6.5),
    check: 16,
    textStyle: theme.text.labelLg,
  ),
};

/// `transition-[width,margin] duration-150 ease-out`의 시간입니다.
const Duration _revealDuration = Duration(milliseconds: 150);

/// Figma `Chip`(61:302)입니다.
///
/// 높이 32px의 불투명 칩입니다. `bg-surface` 바탕에 `border-default` 1px 테두리를
/// 두르고, 선택하면 체크가 나타나며 테두리가 `border-brand`, 글자가 `text-brand`로
/// 바뀝니다. 유리 표면은 쓰지 않습니다.
/// React의 `Toggle`처럼 [pressed]를 주지 않으면 스스로 선택 상태를 들고, 주면
/// 부모가 소유합니다.
class HoronChip extends StatefulWidget {
  /// 칩을 만듭니다.
  const HoronChip({
    super.key,
    required this.label,
    this.pressed,
    this.onPressedChange,
    this.size = HoronChipSize.md,
    this.enabled = true,
  });

  /// 칩의 문구입니다. React의 `children`입니다.
  final String label;

  /// 선택 여부입니다. null이면 위젯이 스스로 상태를 들고 토글합니다.
  final bool? pressed;

  /// 크기입니다. 기본값은 [HoronChipSize.md]입니다.
  final HoronChipSize size;

  /// 선택이 바뀔 때 부를 콜백입니다.
  final ValueChanged<bool>? onPressedChange;

  /// 거짓이면 `opacity-40`으로 흐려지고 토글하지 않습니다.
  final bool enabled;

  @override
  State<HoronChip> createState() => _HoronChipState();
}

class _HoronChipState extends State<HoronChip> {
  bool _internalPressed = false;
  bool _hovered = false;
  bool _focused = false;

  bool get _pressed => widget.pressed ?? _internalPressed;

  void _toggle() {
    final bool next = !_pressed;
    if (widget.pressed == null) setState(() => _internalPressed = next);
    widget.onPressedChange?.call(next);
  }

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    final HoronColors colors = theme.colors;
    final HoronSpaceSpec space = theme.space;
    final bool interactive = widget.enabled && (widget.onPressedChange != null || widget.pressed == null);
    final bool pressed = _pressed;
    final bool reduceMotion = MediaQuery.disableAnimationsOf(context);
    final _ChipMetrics metrics = _metricsOf(widget.size, theme);

    // 칩은 유리를 쓰지 않는 불투명 표면입니다. React
    // `border border-border-default bg-bg-surface`에 대응하고, 선택하면 테두리가
    // `border-brand`, 글자가 `text-brand`로 바뀝니다.
    final Color background = _hovered && interactive && !pressed ? colors.bgSubtle : colors.bgSurface;
    final Color foreground = pressed ? colors.textBrand : colors.textPrimary;
    final Color border = pressed ? colors.borderBrand : colors.borderDefault;

    // 체크 자리는 `w-0`에서 `w-[1.125rem]`(sm)처럼 자랍니다. React가 음수 마진을
    // 없앴으므로 라벨은 선택 전후 모두 paddingX에서 시작하고, 선택하면 체크 자리만큼
    // 오른쪽으로 밀립니다.
    final EdgeInsets padding = EdgeInsets.symmetric(horizontal: metrics.paddingX);

    final Widget check = TweenAnimationBuilder<double>(
      tween: Tween<double>(begin: HoronMotion.popInScale, end: 1),
      duration: reduceMotion ? Duration.zero : HoronMotion.popInDuration,
      curve: HoronMotion.popInCurve,
      builder: (BuildContext context, double scale, Widget? child) => Transform.scale(scale: scale, child: child),
      child: SizedBox(
        width: metrics.slot,
        child: Align(
          alignment: Alignment.centerLeft,
          child: Icon(Icons.check, size: metrics.check, color: foreground),
        ),
      ),
    );

    return Opacity(
      opacity: widget.enabled ? 1 : _disabledOpacity,
      child: _FocusOutline(
        visible: _focused && interactive,
        radius: theme.radius.full,
        gap: space.s0_5,
        width: space.s0_5,
        color: colors.textBrand,
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
          child: GestureDetector(
            onTap: interactive ? _toggle : null,
            child: Semantics(
              button: true,
              toggled: pressed,
              enabled: interactive,
              child: AnimatedContainer(
                duration: reduceMotion ? Duration.zero : _revealDuration,
                curve: Curves.easeOut,
                height: metrics.height,
                decoration: BoxDecoration(
                  color: background,
                  borderRadius: BorderRadius.circular(theme.radius.full),
                  border: Border.all(color: border),
                ),
                child: Padding(
                  padding: padding,
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: <Widget>[
                      if (pressed) check,
                      Flexible(
                        child: Text(
                          widget.label,
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          style: metrics.textStyle.copyWith(color: foreground),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
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
