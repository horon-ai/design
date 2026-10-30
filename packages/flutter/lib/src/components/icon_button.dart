import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import '../theme/horon_motion.dart';
import '../theme/horon_theme.dart';
import '../tokens/horon_tokens.g.dart';

/// `icon-button.tsx`의 `IconButtonVariant`입니다.
enum HoronIconButtonVariant {
  /// `variant="primary"` — 잉크 원 안의 반대색 아이콘입니다.
  primary,

  /// `variant="ghost"` — 바탕 없이 hover에서만 옅은 잉크가 깔립니다. 기본값입니다.
  ghost,

  /// `variant="glass"` — 유리 바탕 위의 기본 텍스트 색 아이콘입니다.
  glass,
}

/// `icon-button.tsx`의 `IconButtonSize`입니다.
enum HoronIconButtonSize {
  /// `size="sm"` — 32px 상자에 16px 아이콘입니다.
  sm,

  /// `size="md"` — 40px 상자에 20px 아이콘입니다. 기본값입니다.
  md,

  /// `size="lg"` — 48px 상자에 24px 아이콘입니다.
  lg,
}

/// `[&_svg]:size-6` — lg 아이콘 24px입니다. sm은 `size-4`, md는 `size-5`입니다.
const double _iconSizeLarge = 24;

/// `data-disabled:opacity-40`입니다.
const double _disabledOpacity = 0.4;

/// `after:min-h-11 after:min-w-11` — 터치 영역 44px입니다.
const double _minTapTarget = 44;

/// Figma `Icon button`(57:167)입니다.
///
/// Primary·Ghost·Glass 세 변형과 세 크기가 있습니다. 보이는 상자는 32·40·48px이지만
/// React가 `after:min-h-11 after:min-w-11`로 그리는 44px 터치 영역을 히트 영역으로
/// 넓혀 둡니다.
class HoronIconButton extends StatefulWidget {
  /// 아이콘 버튼을 만듭니다.
  const HoronIconButton({
    super.key,
    required this.icon,
    required this.label,
    this.variant = HoronIconButtonVariant.ghost,
    this.size = HoronIconButtonSize.md,
    this.onPressed,
    this.enabled = true,
  });

  /// 그릴 아이콘입니다. 크기는 이 위젯이 정하고 색은 변형의 전경색을 따릅니다.
  final Widget icon;

  /// 접근성 이름입니다. 버튼에는 보이는 텍스트가 없습니다. React의 `aria-label`입니다.
  final String label;

  /// 변형입니다. 기본값은 [HoronIconButtonVariant.ghost]입니다.
  final HoronIconButtonVariant variant;

  /// 크기입니다.
  final HoronIconButtonSize size;

  /// 눌렀을 때 부를 콜백입니다.
  final VoidCallback? onPressed;

  /// 거짓이면 `opacity-40`으로 흐려지고 눌리지 않습니다.
  final bool enabled;

  @override
  State<HoronIconButton> createState() => _HoronIconButtonState();
}

class _HoronIconButtonState extends State<HoronIconButton> {
  bool _hovered = false;
  bool _pressed = false;
  bool _focused = false;

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    final HoronColors colors = theme.colors;
    final HoronSpaceSpec space = theme.space;
    final bool interactive = widget.enabled && widget.onPressed != null;
    final bool reduceMotion = MediaQuery.disableAnimationsOf(context);

    // size-8 / size-10 / size-12, [&_svg]:size-4 / size-5 / size-6.
    final (double side, double iconSize) = switch (widget.size) {
      HoronIconButtonSize.sm => (space.step(8), space.step(4)),
      HoronIconButtonSize.md => (space.step(10), space.step(5)),
      HoronIconButtonSize.lg => (space.step(12), _iconSizeLarge),
    };

    // variantClass의 바탕색과 hover·active 색입니다. ghost는 바탕이 없고
    // hover에서 `overlay-ink-6`, 누르면 `overlay-ink-10`이 깔립니다.
    final (Color background, Color hoverBackground, Color pressedBackground, Color foreground) palette = switch (widget
        .variant) {
      HoronIconButtonVariant.primary => (
        colors.interactivePrimary,
        colors.interactivePrimaryHover,
        colors.interactivePrimaryPressed,
        colors.interactiveOnPrimary,
      ),
      HoronIconButtonVariant.ghost => (Colors.transparent, colors.overlayInk6, colors.overlayInk10, colors.textPrimary),
      HoronIconButtonVariant.glass => (
        colors.glassClear,
        colors.glassClearHover,
        colors.glassClearPressed,
        colors.textPrimary,
      ),
    };

    final Color surfaceColor = _pressed && interactive
        ? palette.$3
        : _hovered && interactive
        ? palette.$2
        : palette.$1;

    final Widget surface = AnimatedContainer(
      duration: reduceMotion ? Duration.zero : HoronMotion.colorsDuration,
      curve: HoronMotion.colorsCurve,
      width: side,
      height: side,
      decoration: BoxDecoration(color: surfaceColor, shape: BoxShape.circle),
      child: Center(
        child: IconTheme.merge(
          data: IconThemeData(size: iconSize, color: palette.$4),
          child: widget.icon,
        ),
      ),
    );

    // 아이콘 버튼은 크기와 무관하게 44px 터치 영역을 그립니다.
    final Widget target = ConstrainedBox(
      constraints: const BoxConstraints(minWidth: _minTapTarget, minHeight: _minTapTarget),
      // `Align`에 배율 1을 주면 자식 크기만큼만 차지합니다. `Center`를 쓰면
      // 폭이 넓은 부모에서 버튼이 가로로 늘어납니다.
      child: Align(widthFactor: 1, heightFactor: 1, child: surface),
    );

    return Semantics(
      label: widget.label,
      button: true,
      enabled: interactive,
      child: Opacity(
        opacity: widget.enabled ? 1 : _disabledOpacity,
        child: AnimatedScale(
          // motion-press: scale .97.
          scale: _pressed && interactive ? HoronMotion.pressScale : 1,
          duration: reduceMotion ? Duration.zero : HoronMotion.pressDuration,
          curve: HoronMotion.pressCurve,
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
                    widget.onPressed?.call();
                    return null;
                  },
                ),
              },
              child: GestureDetector(
                onTap: interactive ? widget.onPressed : null,
                onTapDown: (TapDownDetails details) {
                  if (interactive) setState(() => _pressed = true);
                },
                onTapUp: (TapUpDetails details) {
                  if (_pressed) setState(() => _pressed = false);
                },
                onTapCancel: () {
                  if (_pressed) setState(() => _pressed = false);
                },
                child: target,
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
