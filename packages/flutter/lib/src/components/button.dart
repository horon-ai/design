import 'package:flutter/material.dart';

import '../theme/horon_fonts.dart';
import '../theme/horon_theme.dart';
import '../tokens/horon_tokens.g.dart';
import 'button_group.dart';

/// `button.tsx`의 `variant` 옵션입니다.
///
/// React의 cva 키를 그대로 옮겼고, Dart 예약어인 `default`만 `defaultValue`로 적습니다.
enum HoronButtonVariant {
  /// `bg-primary text-primary-foreground`
  defaultValue,

  /// `border-border bg-background`
  outline,

  /// `bg-secondary text-secondary-foreground`
  secondary,

  /// 배경 없이 hover에서만 표면을 칠합니다.
  ghost,

  /// `bg-destructive/10 text-destructive`
  destructive,

  /// 밑줄이 있는 글자 버튼입니다.
  link,
}

/// `button.tsx`의 `size` 옵션입니다.
enum HoronButtonSize {
  /// `h-[37px] px-5` - 기본 크기입니다.
  defaultValue,

  /// `h-[26px] px-2.5`
  xs,

  /// `h-[32px] px-3.5`
  sm,

  /// `h-[44px] px-6`
  lg,

  /// `size-8` - 글자 없이 아이콘만 있는 정사각 버튼입니다.
  icon,

  /// `size-6`
  iconXs,

  /// `size-7`
  iconSm,

  /// `size-9`
  iconLg,
}

/// 크기 하나가 그리는 치수입니다.
///
/// 값은 전부 `button.tsx`의 클래스에서 읽었습니다. 높이는 생성 토큰
/// [HoronButtonMetrics]가 이미 들고 있어 그대로 씁니다. 패딩·간격은 4px 스케일의
/// 값과 정확히 겹치므로 [HoronSpace]를 씁니다(`px-5`는 20 = [HoronSpace.s5]).
class _HoronButtonSpec {
  const _HoronButtonSpec({
    required this.height,
    required this.width,
    required this.padding,
    required this.iconPadding,
    required this.gap,
    required this.fontSize,
    required this.fontWeight,
    required this.iconSize,
    required this.outerRadius,
  });

  /// `h-[…]` 또는 `size-…`의 세로 값입니다.
  final double height;

  /// `size-…` 크기의 가로 값입니다. 글자가 있는 크기는 null이라 내용 폭을 씁니다.
  final double? width;

  /// `px-…`의 좌우 패딩입니다.
  final double padding;

  /// 아이콘이 그쪽에 붙었을 때 줄어드는 패딩입니다(`has-data-[icon=inline-…]`).
  final double iconPadding;

  /// 아이콘과 글자 사이 간격입니다(`gap-…`).
  final double gap;

  /// 글자 크기입니다.
  final double fontSize;

  /// 글자 무게입니다.
  final FontWeight fontWeight;

  /// 슬롯에 든 아이콘의 기본 크기입니다(`[&_svg:not([class*='size-'])]:size-…`).
  final double iconSize;

  /// [HoronButtonGroup] 안에서 바깥 모서리에 쓰는 반경입니다.
  ///
  /// 작은 크기는 그룹 안에서 `in-data-[slot=button-group]:rounded-lg`가 붙어
  /// 12가 아니라 14가 됩니다.
  final double outerRadius;
}

/// `button.tsx`의 `text-[13px]`입니다. 생성 토큰 스케일의 12와 14 사이 값이라
/// 이 파일이 이름을 붙여 들고 있습니다.
const double _smFontSize = 13.0;

/// `active:not-aria-[haspopup]:translate-y-px`가 누른 동안 내리는 거리입니다.
const double _pressedShift = 1.0;

/// `button.tsx`의 size 클래스를 픽셀로 옮긴 표입니다.
const Map<HoronButtonSize, _HoronButtonSpec> _buttonSpecs = <HoronButtonSize, _HoronButtonSpec>{
  // "h-[37px] gap-2 px-5 text-sm font-semibold has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2"
  HoronButtonSize.defaultValue: _HoronButtonSpec(
    height: HoronButtonMetrics.height,
    width: null,
    padding: HoronSpace.s5,
    iconPadding: HoronSpace.s2,
    gap: HoronSpace.s2,
    fontSize: HoronText.body,
    fontWeight: HoronFontWeight.semibold,
    iconSize: HoronSpace.s4,
    outerRadius: HoronRadiusRole.control,
  ),
  // "h-[26px] gap-1 rounded-md px-2.5 text-xs … [&_svg…]:size-3"
  HoronButtonSize.xs: _HoronButtonSpec(
    height: HoronButtonMetrics.heightXs,
    width: null,
    padding: HoronSpace.s2_5,
    iconPadding: HoronSpace.s1_5,
    gap: HoronSpace.s1,
    fontSize: HoronFontSize.xs,
    fontWeight: HoronFontWeight.medium,
    iconSize: HoronSpace.s3,
    outerRadius: HoronRadius.lg,
  ),
  // "h-[32px] gap-1 rounded-md px-3.5 text-[13px] … [&_svg…]:size-3.5"
  HoronButtonSize.sm: _HoronButtonSpec(
    height: HoronButtonMetrics.heightSm,
    width: null,
    padding: HoronSpace.s3_5,
    iconPadding: HoronSpace.s1_5,
    gap: HoronSpace.s1,
    fontSize: _smFontSize,
    fontWeight: HoronFontWeight.medium,
    iconSize: HoronSpace.s3_5,
    outerRadius: HoronRadius.lg,
  ),
  // "h-[44px] gap-1.5 rounded-md px-6 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2"
  HoronButtonSize.lg: _HoronButtonSpec(
    height: HoronButtonMetrics.heightLg,
    width: null,
    padding: HoronSpace.s6,
    iconPadding: HoronSpace.s2,
    gap: HoronSpace.s1_5,
    fontSize: HoronText.body,
    fontWeight: HoronFontWeight.medium,
    iconSize: HoronSpace.s4,
    outerRadius: HoronRadiusRole.control,
  ),
  // "size-8"
  HoronButtonSize.icon: _HoronButtonSpec(
    height: HoronButtonMetrics.heightIcon,
    width: HoronButtonMetrics.heightIcon,
    padding: HoronSpace.s0,
    iconPadding: HoronSpace.s0,
    gap: HoronSpace.s0,
    fontSize: HoronText.body,
    fontWeight: HoronFontWeight.medium,
    iconSize: HoronSpace.s4,
    outerRadius: HoronRadiusRole.control,
  ),
  // "size-6 rounded-md in-data-[slot=button-group]:rounded-lg [&_svg…]:size-3"
  HoronButtonSize.iconXs: _HoronButtonSpec(
    height: HoronButtonMetrics.heightIconXs,
    width: HoronButtonMetrics.heightIconXs,
    padding: HoronSpace.s0,
    iconPadding: HoronSpace.s0,
    gap: HoronSpace.s0,
    fontSize: HoronFontSize.xs,
    fontWeight: HoronFontWeight.medium,
    iconSize: HoronSpace.s3,
    outerRadius: HoronRadius.lg,
  ),
  // "size-7 rounded-md in-data-[slot=button-group]:rounded-lg"
  HoronButtonSize.iconSm: _HoronButtonSpec(
    height: HoronButtonMetrics.heightIconSm,
    width: HoronButtonMetrics.heightIconSm,
    padding: HoronSpace.s0,
    iconPadding: HoronSpace.s0,
    gap: HoronSpace.s0,
    fontSize: HoronText.body,
    fontWeight: HoronFontWeight.medium,
    iconSize: HoronSpace.s4,
    outerRadius: HoronRadius.lg,
  ),
  // "size-9"
  HoronButtonSize.iconLg: _HoronButtonSpec(
    height: HoronButtonMetrics.heightIconLg,
    width: HoronButtonMetrics.heightIconLg,
    padding: HoronSpace.s0,
    iconPadding: HoronSpace.s0,
    gap: HoronSpace.s0,
    fontSize: HoronText.body,
    fontWeight: HoronFontWeight.medium,
    iconSize: HoronSpace.s4,
    outerRadius: HoronRadiusRole.control,
  ),
};

/// 변형 하나가 칠하는 색 묶음입니다.
class _HoronButtonPaint {
  const _HoronButtonPaint({
    required this.background,
    required this.foreground,
    required this.border,
    required this.hoverBackground,
    required this.hoverForeground,
  });

  /// 평상시 채움입니다.
  final Color background;

  /// 평상시 글자·아이콘 색입니다.
  final Color foreground;

  /// 평상시 테두리 색입니다. `border border-transparent`가 기본이라 투명이 기본값입니다.
  final Color border;

  /// hover일 때 채움입니다.
  final Color hoverBackground;

  /// hover일 때 글자 색입니다.
  final Color hoverForeground;
}

/// `button.tsx`의 variant 클래스를 [ColorScheme]과 [HoronThemeData]로 옮깁니다.
_HoronButtonPaint _paintFor(HoronButtonVariant variant, ColorScheme scheme, bool isDark) {
  switch (variant) {
    case HoronButtonVariant.defaultValue:
      // "bg-primary text-primary-foreground hover:bg-primary/80"
      return _HoronButtonPaint(
        background: scheme.primary,
        foreground: scheme.onPrimary,
        border: Colors.transparent,
        hoverBackground: scheme.primary.withValues(alpha: 0.8),
        hoverForeground: scheme.onPrimary,
      );
    case HoronButtonVariant.outline:
      // "border-border bg-background hover:bg-muted hover:text-foreground
      //  dark:border-input dark:bg-input/30 dark:hover:bg-input/50"
      return _HoronButtonPaint(
        background: isDark ? scheme.outline.withValues(alpha: 0.3) : scheme.surface,
        foreground: scheme.onSurface,
        border: scheme.outline,
        hoverBackground: isDark ? scheme.outline.withValues(alpha: 0.5) : scheme.surfaceContainerHighest,
        hoverForeground: scheme.onSurface,
      );
    case HoronButtonVariant.secondary:
      // "bg-secondary text-secondary-foreground hover:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_5%)]"
      return _HoronButtonPaint(
        background: scheme.secondary,
        foreground: scheme.onSecondary,
        border: Colors.transparent,
        hoverBackground: Color.lerp(scheme.secondary, scheme.onSurface, 0.05)!,
        hoverForeground: scheme.onSecondary,
      );
    case HoronButtonVariant.ghost:
      // "hover:bg-muted hover:text-foreground"
      return _HoronButtonPaint(
        background: Colors.transparent,
        foreground: scheme.onSurface,
        border: Colors.transparent,
        hoverBackground: scheme.surfaceContainerHighest,
        hoverForeground: scheme.onSurface,
      );
    case HoronButtonVariant.destructive:
      // "bg-destructive/10 text-destructive hover:bg-destructive/20 dark:bg-destructive/20 dark:hover:bg-destructive/30"
      return _HoronButtonPaint(
        background: scheme.error.withValues(alpha: isDark ? 0.2 : 0.1),
        foreground: scheme.error,
        border: Colors.transparent,
        hoverBackground: scheme.error.withValues(alpha: isDark ? 0.3 : 0.2),
        hoverForeground: scheme.error,
      );
    case HoronButtonVariant.link:
      // "text-primary underline-offset-4 hover:underline"
      return _HoronButtonPaint(
        background: Colors.transparent,
        foreground: scheme.primary,
        border: Colors.transparent,
        hoverBackground: Colors.transparent,
        hoverForeground: scheme.primary,
      );
  }
}

/// horon 디자인 시스템의 버튼입니다.
///
/// `button.tsx`의 여섯 변형과 여덟 크기를 그대로 옮겼습니다. 높이는 React의
/// `h-[37px]` 같은 클래스 값을 픽셀로 그대로 쓰고, 아이콘은 [leading]·[trailing]
/// 슬롯으로 받습니다. 슬롯에 아이콘이 들어가면 그쪽 패딩이 React의
/// `has-data-[icon=inline-start]:pl-2`만큼 줄어듭니다.
///
/// ```dart
/// HoronButton(label: '저장', onPressed: save);
/// HoronButton(label: '더 보기', variant: HoronButtonVariant.outline, trailing: const Icon(Icons.expand_more));
/// ```
class HoronButton extends StatefulWidget {
  /// 버튼 하나를 만듭니다.
  ///
  /// [label]·[child]·[leading]·[trailing] 중 하나는 있어야 합니다. 아이콘만 있는
  /// 버튼(React의 `size="icon"`)은 슬롯만 채우므로 슬롯도 내용으로 봅니다.
  /// [label]은 버튼의 글자 스타일을 적용한 [Text]로 그려지고, [child]는
  /// [DefaultTextStyle] 아래에 놓입니다.
  const HoronButton({
    super.key,
    this.label,
    this.child,
    this.onPressed,
    this.onLongPress,
    this.variant = HoronButtonVariant.defaultValue,
    this.size = HoronButtonSize.defaultValue,
    this.leading,
    this.trailing,
    this.invalid = false,
    this.disabled = false,
    this.autofocus = false,
    this.semanticLabel,
  }) : assert(
         label != null || child != null || leading != null || trailing != null,
         'HoronButton needs a label, a child, or an icon slot.',
       );

  /// 버튼 글자입니다.
  final String? label;

  /// 글자 대신 넣는 내용입니다.
  final Widget? child;

  /// 누르면 부르는 콜백입니다. null이면 버튼이 비활성입니다.
  final VoidCallback? onPressed;

  /// 길게 누르면 부르는 콜백입니다. 터치에는 hover가 없어 길게 누르기를 씁니다.
  final VoidCallback? onLongPress;

  /// 변형입니다.
  final HoronButtonVariant variant;

  /// 크기입니다.
  final HoronButtonSize size;

  /// 글자 앞 아이콘입니다.
  final Widget? leading;

  /// 글자 뒤 아이콘입니다.
  final Widget? trailing;

  /// `aria-invalid`에 해당하는 오류 상태입니다. 테두리와 링이 파괴 색이 됩니다.
  final bool invalid;

  /// 누를 수 없는 상태입니다. [onPressed]가 null이어도 같습니다.
  final bool disabled;

  /// 처음 그릴 때 포커스를 받을지 여부입니다.
  final bool autofocus;

  /// 스크린리더가 읽을 이름입니다. 없으면 글자를 읽습니다.
  final String? semanticLabel;

  @override
  State<HoronButton> createState() => _HoronButtonState();
}

class _HoronButtonState extends State<HoronButton> {
  final FocusNode _focusNode = FocusNode();

  bool _hovered = false;
  bool _focused = false;
  bool _pressed = false;

  bool get _enabled => !widget.disabled && widget.onPressed != null;

  @override
  void dispose() {
    _focusNode.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final ThemeData theme = Theme.of(context);
    final ColorScheme scheme = theme.colorScheme;
    final HoronThemeData horon = HoronTheme.of(context);
    final bool isDark = theme.brightness == Brightness.dark;
    final _HoronButtonSpec spec = _buttonSpecs[widget.size]!;
    final _HoronButtonPaint paint = _paintFor(widget.variant, scheme, isDark);
    final HoronButtonGroupScope? group = context.dependOnInheritedWidgetOfExactType<HoronButtonGroupScope>();

    final Color background = _hovered && _enabled ? paint.hoverBackground : paint.background;
    final Color foreground = _hovered && _enabled ? paint.hoverForeground : paint.foreground;
    final Color borderColor = widget.invalid
        ? (isDark ? scheme.error.withValues(alpha: 0.5) : scheme.error)
        : (_focused ? horon.ring : paint.border);
    // `focus-visible:ring-3 focus-visible:ring-ring/50`와 `aria-invalid:ring-3 aria-invalid:ring-destructive/20`입니다.
    final Color? ring = widget.invalid
        ? scheme.error.withValues(alpha: isDark ? 0.4 : 0.2)
        : (_focused ? horon.ring.withValues(alpha: 0.5) : null);

    final bool underline = widget.variant == HoronButtonVariant.link;
    final TextStyle textStyle = TextStyle(
      fontFamily: HoronFont.body,
      fontFamilyFallback: HoronFont.fontFamilyFallback,
      fontSize: spec.fontSize,
      fontWeight: spec.fontWeight,
      height: HoronLineHeight.none,
      color: foreground,
      decoration: underline ? TextDecoration.underline : TextDecoration.none,
      decorationColor: foreground,
    );

    final bool hasText = widget.label != null || widget.child != null;
    final Widget content = Row(
      mainAxisSize: MainAxisSize.min,
      mainAxisAlignment: MainAxisAlignment.center,
      crossAxisAlignment: CrossAxisAlignment.center,
      children: <Widget>[
        if (widget.leading != null) _iconSlot(widget.leading!, spec, foreground),
        if (widget.leading != null && hasText) SizedBox(width: spec.gap),
        if (widget.label != null)
          Text(widget.label!, maxLines: 1, softWrap: false, style: textStyle)
        else if (widget.child != null)
          DefaultTextStyle(style: textStyle, child: widget.child!),
        if (widget.trailing != null && hasText) SizedBox(width: spec.gap),
        if (widget.trailing != null) _iconSlot(widget.trailing!, spec, foreground),
      ],
    );

    final EdgeInsets padding = EdgeInsets.only(
      left: widget.leading != null ? spec.iconPadding : spec.padding,
      right: widget.trailing != null ? spec.iconPadding : spec.padding,
    );

    final Widget surface = DecoratedBox(
      decoration: BoxDecoration(
        color: background,
        borderRadius: _radiusFor(spec, group),
        border: _borderFor(borderColor, group),
        boxShadow: ring == null ? null : <BoxShadow>[BoxShadow(color: ring, spreadRadius: 3)],
      ),
      child: SizedBox(
        height: spec.height,
        width: spec.width,
        child: Padding(
          padding: padding,
          child: Center(widthFactor: 1, heightFactor: 1, child: content),
        ),
      ),
    );

    Widget result = Semantics(
      button: true,
      enabled: _enabled,
      label: widget.semanticLabel,
      child: FocusableActionDetector(
        focusNode: _focusNode,
        autofocus: widget.autofocus,
        enabled: _enabled,
        onShowHoverHighlight: (bool value) => setState(() => _hovered = value),
        onShowFocusHighlight: (bool value) => setState(() => _focused = value),
        actions: <Type, Action<Intent>>{
          ActivateIntent: CallbackAction<ActivateIntent>(
            onInvoke: (ActivateIntent intent) {
              widget.onPressed?.call();
              return null;
            },
          ),
        },
        child: GestureDetector(
          behavior: HitTestBehavior.opaque,
          onTap: _enabled ? widget.onPressed : null,
          onLongPress: _enabled ? widget.onLongPress : null,
          onTapDown: _enabled ? (TapDownDetails details) => setState(() => _pressed = true) : null,
          onTapUp: _enabled ? (TapUpDetails details) => setState(() => _pressed = false) : null,
          onTapCancel: _enabled ? () => setState(() => _pressed = false) : null,
          child: Transform.translate(offset: _pressed ? const Offset(0, _pressedShift) : Offset.zero, child: surface),
        ),
      ),
    );

    if (!_enabled) {
      // "disabled:opacity-50"
      result = Opacity(opacity: 0.5, child: result);
    }
    return result;
  }

  Widget _iconSlot(Widget icon, _HoronButtonSpec spec, Color color) {
    return IconTheme.merge(
      data: IconThemeData(size: spec.iconSize, color: color),
      child: icon,
    );
  }

  /// React의 `rounded-md`와 그룹 안 `rounded-l-none`/`rounded-r-none`을 옮깁니다.
  ///
  /// 그룹 밖에서는 네 모서리가 모두 둥글고, 그룹 안에서는 첫 자식의 시작 쪽과 마지막
  /// 자식의 끝 쪽만 남습니다. 그래서 붙은 자리는 하나의 표면으로 읽힙니다.
  BorderRadius _radiusFor(_HoronButtonSpec spec, HoronButtonGroupScope? group) {
    if (group == null) return BorderRadius.circular(spec.outerRadius);
    final Radius outer = Radius.circular(spec.outerRadius);
    final bool horizontal = group.orientation == HoronButtonGroupOrientation.horizontal;
    final bool roundStart = group.isFirst;
    final bool roundEnd = group.isLast;
    if (horizontal) {
      return BorderRadius.only(
        topLeft: roundStart ? outer : Radius.zero,
        bottomLeft: roundStart ? outer : Radius.zero,
        topRight: roundEnd ? outer : Radius.zero,
        bottomRight: roundEnd ? outer : Radius.zero,
      );
    }
    return BorderRadius.only(
      topLeft: roundStart ? outer : Radius.zero,
      topRight: roundStart ? outer : Radius.zero,
      bottomLeft: roundEnd ? outer : Radius.zero,
      bottomRight: roundEnd ? outer : Radius.zero,
    );
  }

  /// React의 `[&>*:not(:first-child)]:border-l-0`(수직은 `border-t-0`)을 옮깁니다.
  ///
  /// 이음매에서 앞 버튼의 끝 테두리 한 줄만 남기므로 선이 겹쳐 두 줄이 되지 않습니다.
  Border _borderFor(Color color, HoronButtonGroupScope? group) {
    if (group == null) return Border.all(color: color);
    if (group.isFirst) return Border.all(color: color);
    final BorderSide side = BorderSide(color: color);
    if (group.orientation == HoronButtonGroupOrientation.horizontal) {
      return Border(top: side, right: side, bottom: side);
    }
    return Border(left: side, right: side, bottom: side);
  }
}
