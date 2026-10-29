import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import '../theme/horon_motion.dart';
import '../theme/horon_theme.dart';
import '../tokens/horon_tokens.g.dart';

/// `switch.tsx`의 `SwitchSize`입니다.
enum HoronSwitchSize {
  /// `size="sm"` — 32x20 트랙에 16px 썸입니다.
  sm,

  /// `size="compact"` — 40x24 트랙에 18px 썸, 안쪽 여백 3px입니다(bot memory 화면).
  compact,

  /// `size="md"` — 44x26 트랙에 22px 썸입니다. 기본값입니다.
  md,
}

/// `data-disabled:opacity-40`입니다.
const double _disabledOpacity = 0.4;

/// `duration-220` — 썸의 이동과 배경색 전환 시간입니다.
const Duration _thumbTransition = Duration(milliseconds: 220);

/// Figma `Switch`(58:264)입니다.
///
/// 트랙은 꺼짐에서 `border-strong`, 켜짐에서 `interactive-primary`이고 hover에서
/// 각각 `interactive-secondary-hover`·`interactive-primary-hover`로 바뀝니다. 썸은
/// 라이트에서 꺼짐 `text-on-ink`·켜짐 `interactive-on-primary`, 다크에서는 둘 다
/// `bg-default`입니다(`dark:bg-bg-default`).
class HoronSwitch extends StatefulWidget {
  /// 스위치를 만듭니다.
  const HoronSwitch({
    super.key,
    required this.value,
    this.onChanged,
    this.size = HoronSwitchSize.md,
    this.label,
    this.enabled = true,
  });

  /// 켜짐 여부입니다.
  final bool value;

  /// 값이 바뀔 때 부를 콜백입니다. null이면 토글하지 않습니다.
  final ValueChanged<bool>? onChanged;

  /// 크기입니다.
  final HoronSwitchSize size;

  /// 왼쪽에 붙는 라벨입니다. 라벨을 누르면 스위치가 토글됩니다.
  final String? label;

  /// 거짓이면 트랙이 `opacity-40`으로 흐려지고 토글하지 않습니다.
  final bool enabled;

  @override
  State<HoronSwitch> createState() => _HoronSwitchState();
}

class _HoronSwitchState extends State<HoronSwitch> {
  bool _hovered = false;
  bool _focused = false;

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    final HoronColors colors = theme.colors;
    final HoronSpaceSpec space = theme.space;
    final bool interactive = widget.enabled && widget.onChanged != null;
    final bool reduceMotion = MediaQuery.disableAnimationsOf(context);

    // h-6.5 w-11 p-0.5 / h-5 w-8 p-0.5 / h-6 w-10 p-[3px]와 썸의 size-5.5 / size-4 / size-[18px].
    final (double trackHeight, double trackWidth, double inset, double thumb) = switch (widget.size) {
      HoronSwitchSize.sm => (space.step(5), space.step(8), space.s0_5, space.step(4)),
      HoronSwitchSize.compact => (space.step(6), space.step(10), space.step(0.75), space.step(4.5)),
      HoronSwitchSize.md => (space.step(6.5), space.step(11), space.s0_5, space.step(5.5)),
    };

    final Color trackColor = widget.value
        ? (_hovered && interactive ? colors.interactivePrimaryHover : colors.interactivePrimary)
        : (_hovered && interactive ? colors.interactiveSecondaryHover : colors.borderStrong);

    // dark:bg-bg-default dark:data-checked:bg-bg-default — 다크에서는 썸이 두 상태 모두 표면색입니다.
    final bool isDark = theme.brightness == Brightness.dark;
    final Color thumbColor = isDark
        ? colors.bgDefault
        : widget.value
        ? colors.interactiveOnPrimary
        : colors.textOnInk;

    final Duration thumbDuration = reduceMotion ? Duration.zero : _thumbTransition;

    final Widget track = AnimatedContainer(
      duration: reduceMotion ? Duration.zero : HoronMotion.colorsDuration,
      curve: HoronMotion.colorsCurve,
      width: trackWidth,
      height: trackHeight,
      padding: EdgeInsets.all(inset),
      decoration: BoxDecoration(color: trackColor, borderRadius: BorderRadius.circular(theme.radius.full)),
      child: AnimatedAlign(
        // data-checked:translate-x-* 를 정렬로 옮깁니다. 안쪽 폭에서 썸을 뺀
        // 거리가 React의 이동 거리와 같습니다(md 44-4-22=18, sm 32-4-16=12, compact 40-6-18=16).
        alignment: widget.value ? Alignment.centerRight : Alignment.centerLeft,
        duration: thumbDuration,
        curve: HoronMotion.easeSpring,
        child: AnimatedContainer(
          duration: thumbDuration,
          curve: HoronMotion.easeSpring,
          width: thumb,
          height: thumb,
          decoration: BoxDecoration(color: thumbColor, shape: BoxShape.circle),
        ),
      ),
    );

    final Widget control = Opacity(
      opacity: widget.enabled ? 1 : _disabledOpacity,
      child: _FocusOutline(
        visible: _focused && interactive,
        radius: theme.radius.full,
        gap: space.s0_5,
        width: space.s0_5,
        color: colors.textBrand,
        child: track,
      ),
    );

    final Widget content = widget.label == null
        ? control
        : Row(
            spacing: space.s4,
            children: <Widget>[
              // `min-w-0 flex-1` — 라벨이 남는 폭을 차지하고 트랙은 고정입니다.
              Expanded(
                child: Text(widget.label!, style: theme.text.bodyMd.copyWith(color: colors.textPrimary)),
              ),
              control,
            ],
          );

    return GestureDetector(
      behavior: HitTestBehavior.opaque,
      onTap: interactive ? () => widget.onChanged?.call(!widget.value) : null,
      child: MergeSemantics(
        child: Semantics(
          toggled: widget.value,
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
                  widget.onChanged?.call(!widget.value);
                  return null;
                },
              ),
            },
            child: content,
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
