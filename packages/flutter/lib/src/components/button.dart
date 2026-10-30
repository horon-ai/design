import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import '../glass/glass_geometry.dart';
import '../glass/horon_glass.dart';
import '../theme/horon_motion.dart';
import '../theme/horon_theme.dart';
import '../tokens/horon_tokens.g.dart';

/// `button.tsx`의 `ButtonVariant`입니다.
enum HoronButtonVariant {
  /// `variant="primary"` — 잉크 바탕에 반대색 라벨입니다.
  primary,

  /// `variant="glass"` — 유리 바탕에 기본 텍스트 색 라벨입니다.
  glass,

  /// `variant="danger"` — 위험 색 바탕에 반대색 라벨입니다.
  danger,

  /// `variant="link"` — 바탕 없는 텍스트 버튼입니다. 크기를 무시하고 항상 같은 모양입니다.
  link,
}

/// `button.tsx`의 `ButtonSize`입니다.
enum HoronButtonSize {
  /// `size="sm"` — 높이 32, 라벨 `label-md`.
  sm,

  /// `size="md"` — 높이 40, 라벨 `label-lg`. 기본값입니다.
  md,

  /// `size="lg"` — 높이 48, 라벨 `label-lg`.
  lg,
}

/// `[&_svg]:size-4` — sm·md 아이콘 16px입니다.
const double _iconSizeSmall = 16;

/// `[&_svg]:size-5` — lg 아이콘 20px입니다.
const double _iconSizeLarge = 20;

/// `[&_svg]:size-3.5` — link 아이콘 14px입니다.
const double _linkIconSize = 14;

/// `data-disabled:opacity-40`입니다.
const double _disabledOpacity = 0.4;

/// `after:min-h-11 after:min-w-11` — 터치 영역 44px입니다.
const double _minTapTarget = 44;

/// Figma `Button`(55:339)입니다.
///
/// Primary·Glass·Danger 세 변형과 세 크기, 그리고 크기와 무관한 텍스트 전용
/// `link` 변형이 있습니다. `link`만 `motion-press` 배율과 44px 터치 영역을 쓰지
/// 않고, `glass`는 자기 사각형 밖으로 터치 영역을 넓히지 않습니다(React가
/// `overflow-clip`으로 자르기 때문입니다).
class HoronButton extends StatefulWidget {
  /// 버튼을 만듭니다.
  const HoronButton({
    super.key,
    required this.label,
    this.variant = HoronButtonVariant.primary,
    this.size = HoronButtonSize.md,
    this.icon,
    this.onPressed,
    this.enabled = true,
  });

  /// 라벨 문구입니다. React의 `children`입니다.
  final String label;

  /// 변형입니다. 기본값은 [HoronButtonVariant.primary]입니다.
  final HoronButtonVariant variant;

  /// 크기입니다. [HoronButtonVariant.link]에서는 쓰이지 않습니다.
  final HoronButtonSize size;

  /// 라벨 앞 아이콘입니다. 크기는 이 위젯이 정하고 색은 라벨 색을 따릅니다.
  final Widget? icon;

  /// 눌렀을 때 부를 콜백입니다. null이면 아무 일도 하지 않습니다.
  final VoidCallback? onPressed;

  /// 거짓이면 `opacity-40`으로 흐려지고 눌리지 않습니다.
  final bool enabled;

  @override
  State<HoronButton> createState() => _HoronButtonState();
}

class _HoronButtonState extends State<HoronButton> {
  bool _hovered = false;
  bool _pressed = false;
  bool _focused = false;

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    final HoronColors colors = theme.colors;
    final HoronSpaceSpec space = theme.space;

    final bool isLink = widget.variant == HoronButtonVariant.link;
    final bool interactive = widget.enabled && widget.onPressed != null;
    final bool reduceMotion = MediaQuery.disableAnimationsOf(context);

    // h-8 / h-10 / h-12, gap-1.5 / gap-2, px-3 / px-4 / px-5, text-label-md / text-label-lg.
    // link는 `h-auto gap-1.5 rounded-sm px-1 text-label-sm`으로 크기와 무관합니다.
    final ({double? height, double gap, double paddingX, TextStyle label, double iconSize}) metrics = isLink
        ? (height: null, gap: space.s1_5, paddingX: space.s1, label: theme.text.labelSm, iconSize: _linkIconSize)
        : switch (widget.size) {
            HoronButtonSize.sm => (
              height: space.step(8),
              gap: space.s1_5,
              paddingX: space.s3,
              label: theme.text.labelMd,
              iconSize: _iconSizeSmall,
            ),
            HoronButtonSize.md => (
              height: space.step(10),
              gap: space.s2,
              paddingX: space.s4,
              label: theme.text.labelLg,
              iconSize: _iconSizeSmall,
            ),
            HoronButtonSize.lg => (
              height: space.step(12),
              gap: space.s2,
              paddingX: space.s5,
              label: theme.text.labelLg,
              iconSize: _iconSizeLarge,
            ),
          };

    // variantClass의 바탕색과 hover·active 색입니다. link만 바탕이 투명하고
    // hover에서 라벨 색이 text-secondary → text-primary로 바뀝니다.
    final (Color background, Color hoverBackground, Color pressedBackground, Color foreground) palette =
        switch (widget.variant) {
          HoronButtonVariant.primary => (
            colors.interactivePrimary,
            colors.interactivePrimaryHover,
            colors.interactivePrimaryPressed,
            colors.interactiveOnPrimary,
          ),
          HoronButtonVariant.glass => (
            colors.glassClear,
            colors.glassClearHover,
            colors.glassClearPressed,
            colors.textPrimary,
          ),
          HoronButtonVariant.danger => (
            colors.interactiveDanger,
            colors.interactiveDangerHover,
            colors.interactiveDangerHover,
            colors.interactiveOnDanger,
          ),
          HoronButtonVariant.link => (
            Colors.transparent,
            Colors.transparent,
            Colors.transparent,
            _hovered && interactive ? colors.textPrimary : colors.textSecondary,
          ),
        };

    final Color surfaceColor = _pressed && interactive
        ? palette.$3
        : _hovered && interactive
        ? palette.$2
        : palette.$1;
    final Color labelColor = palette.$4;

    // React는 glass 변형에서 `<LiquidGlass />`를 깔고 그 위에 라벨을 얹습니다
    // (`button.tsx:54`). Flutter도 같은 순서로, 바탕은 유리 엔진이 그리고
    // 호버·누름 동안만 토큰 색을 얇게 덧칩니다.
    final bool isGlass = widget.variant == HoronButtonVariant.glass;
    final double surfaceRadius = isLink ? theme.radius.sm : theme.radius.full;

    final Widget label = Row(
      mainAxisSize: MainAxisSize.min,
      spacing: metrics.gap,
      children: <Widget>[
        if (widget.icon != null)
          IconTheme.merge(
            data: IconThemeData(size: metrics.iconSize, color: labelColor),
            child: widget.icon!,
          ),
        Flexible(
          child: Text(
            widget.label,
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
            style: metrics.label.copyWith(color: labelColor),
          ),
        ),
      ],
    );

    final Widget paddedLabel = Padding(
      padding: EdgeInsets.symmetric(horizontal: metrics.paddingX),
      child: label,
    );

    final Widget surface = AnimatedContainer(
      duration: reduceMotion ? Duration.zero : HoronMotion.colorsDuration,
      curve: HoronMotion.colorsCurve,
      height: metrics.height,
      padding: isGlass ? null : EdgeInsets.symmetric(horizontal: metrics.paddingX),
      decoration: BoxDecoration(
        color: isGlass ? (interactive && (_pressed || _hovered) ? surfaceColor : null) : surfaceColor,
        borderRadius: BorderRadius.circular(surfaceRadius),
      ),
      child: isGlass
          ? Stack(
              alignment: Alignment.center,
              children: <Widget>[
                Positioned.fill(
                  child: HoronLiquidGlass(
                    tier: HoronGlassTier.clear,
                    borderRadius: BorderRadius.circular(surfaceRadius),
                    child: const SizedBox.expand(),
                  ),
                ),
                paddedLabel,
              ],
            )
          : label,
    );

    // React는 sm·md의 primary·danger에만 `after:min-h-11 after:min-w-11`로 44px
    // 터치 영역을 그립니다. 보이는 크기는 그대로 두고 히트 영역만 넓힙니다.
    final bool needsWideReach =
        !isLink && widget.variant != HoronButtonVariant.glass && widget.size != HoronButtonSize.lg;
    final Widget target = needsWideReach
        ? ConstrainedBox(
            constraints: const BoxConstraints(minWidth: _minTapTarget, minHeight: _minTapTarget),
            // `Align`에 배율 1을 주면 자식 크기만큼만 차지합니다. `Center`를 쓰면
            // 폭이 넓은 부모에서 버튼이 가로로 늘어납니다.
            child: Align(widthFactor: 1, heightFactor: 1, child: surface),
          )
        : surface;

    return Opacity(
      opacity: widget.enabled ? 1 : _disabledOpacity,
      child: AnimatedScale(
        // motion-press: scale .97. link는 배율을 쓰지 않습니다.
        scale: _pressed && !isLink && interactive ? HoronMotion.pressScale : 1,
        duration: reduceMotion ? Duration.zero : HoronMotion.pressDuration,
        curve: HoronMotion.pressCurve,
        child: _FocusOutline(
          visible: _focused && interactive,
          radius: isLink ? theme.radius.sm : theme.radius.full,
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
    );
  }
}

/// `focus-visible:outline-2 outline-offset-2 outline-text-brand`을 그립니다.
///
/// 레이아웃을 밀지 않도록 테두리를 자식 바깥에 겹쳐 그립니다. React의 outline은
/// 상자 크기를 바꾸지 않습니다.
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
