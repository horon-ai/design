import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import '../theme/horon_motion.dart';
import '../theme/horon_theme.dart';
import '../tokens/horon_tokens.g.dart';

/// `data-disabled:opacity-40`입니다.
const double _disabledOpacity = 0.4;

/// `size-3.5` — 선택 표시 체크 아이콘 14px입니다.
const double _checkSize = 14;

/// `transition-[width,margin] duration-150 ease-out`의 시간입니다.
const Duration _revealDuration = Duration(milliseconds: 150);

/// Figma `Chip`(61:302)입니다.
///
/// 높이 32px의 유리 칩입니다. 선택하면 체크가 나타나고 테두리가
/// `border-brand`, 바탕이 `glass-clear-pressed`, 글자가 `text-brand`로 바뀝니다.
/// React의 `Toggle`처럼 [pressed]를 주지 않으면 스스로 선택 상태를 들고, 주면
/// 부모가 소유합니다.
class HoronChip extends StatefulWidget {
  /// 칩을 만듭니다.
  const HoronChip({super.key, required this.label, this.pressed, this.onPressedChange, this.enabled = true});

  /// 칩의 문구입니다. React의 `children`입니다.
  final String label;

  /// 선택 여부입니다. null이면 위젯이 스스로 상태를 들고 토글합니다.
  final bool? pressed;

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

    final Color background = pressed
        ? colors.glassClearPressed
        : (_hovered && interactive ? colors.glassClearHover : colors.glassClear);
    final Color foreground = pressed ? colors.textBrand : colors.textPrimary;
    final Color border = pressed ? colors.borderBrand : Colors.transparent;

    // 체크 자리는 `w-0 -mr-1.5`에서 `w-[1.375rem] mr-0`으로 자랍니다. 그래서 선택
    // 전에는 라벨이 왼쪽 여백 12px에서 6px만큼 당겨진 6px에 서고, 선택하면 22px
    // 자리(체크 14px + 8px) 뒤 12px에서 시작합니다.
    final EdgeInsets padding = EdgeInsets.only(left: pressed ? space.s3 : space.s3 - space.s1_5, right: space.s3);

    final Widget check = TweenAnimationBuilder<double>(
      tween: Tween<double>(begin: HoronMotion.popInScale, end: 1),
      duration: reduceMotion ? Duration.zero : HoronMotion.popInDuration,
      curve: HoronMotion.popInCurve,
      builder: (BuildContext context, double scale, Widget? child) => Transform.scale(scale: scale, child: child),
      child: SizedBox(
        width: space.step(5.5),
        child: Align(
          alignment: Alignment.centerLeft,
          child: Icon(Icons.check, size: _checkSize, color: foreground),
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
                height: space.step(8),
                padding: padding,
                decoration: BoxDecoration(
                  color: background,
                  borderRadius: BorderRadius.circular(theme.radius.full),
                  border: Border.all(color: border),
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: <Widget>[
                    if (pressed) check,
                    Flexible(
                      child: Text(
                        widget.label,
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style: theme.text.labelMd.copyWith(color: foreground),
                      ),
                    ),
                  ],
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
