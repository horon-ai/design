import 'package:flutter/material.dart';

import '../theme/horon_fonts.dart';
import '../theme/horon_theme.dart';
import '../tokens/horon_tokens.g.dart';

/// `badge.tsx`의 `variant` 옵션입니다.
enum HoronBadgeVariant {
  /// `bg-primary text-primary-foreground`
  defaultValue,

  /// `bg-secondary text-secondary-foreground`
  secondary,

  /// `bg-destructive/10 text-destructive` (다크에서는 `/20`)
  destructive,

  /// `border-border text-foreground` - 테두리만 있는 변형입니다.
  outline,

  /// 채움 없이 hover에서만 배경이 붙는 변형입니다.
  ghost,

  /// `text-primary` - hover에서 밑줄이 붙는 링크 변형입니다.
  link,
}

/// `badge.tsx`의 `text-[11px]`입니다. 생성 스케일의 12보다 작은 값이라 이름을 붙입니다.
const double _badgeFontSize = 11.0;

/// `badge.tsx`의 `py-[3px]`입니다. 4px 스케일의 단계가 아닙니다.
const double _badgeVerticalPadding = 3.0;

/// `badge.tsx`의 `[&>svg]:size-3`입니다.
const double _badgeIconSize = 12.0;

/// `badge.tsx`의 `focus-visible:ring-[3px]`입니다.
const double _badgeFocusRingWidth = 3.0;

/// 짧은 상태 표시를 알약 모양으로 그리는 배지입니다.
///
/// `badge.tsx`를 옮긴 것입니다. 반경은 `rounded-full`이라 [HoronRadiusRole.pill]이고,
/// 아이콘은 [icon](앞)과 [trailingIcon](뒤) 슬롯으로 받습니다. React는 아이콘이 앞에
/// 있으면 왼쪽 패딩을, 뒤에 있으면 오른쪽 패딩을 `px-1.5`로 줄입니다.
///
/// ```dart
/// HoronBadge(label: '신규', variant: HoronBadgeVariant.secondary);
/// ```
class HoronBadge extends StatefulWidget {
  /// 배지를 만듭니다.
  const HoronBadge({
    super.key,
    this.label,
    this.child,
    this.icon,
    this.trailingIcon,
    this.variant = HoronBadgeVariant.defaultValue,
    this.invalid = false,
    this.onTap,
  }) : assert(label != null || child != null, 'HoronBadge needs a label or a child.');

  /// 배지 글자입니다.
  final String? label;

  /// 글자 대신 넣는 내용입니다.
  final Widget? child;

  /// 글자 앞 아이콘입니다.
  final Widget? icon;

  /// 글자 뒤 아이콘입니다.
  final Widget? trailingIcon;

  /// 변형입니다.
  final HoronBadgeVariant variant;

  /// `aria-invalid` 상태입니다. 참이면 테두리와 포커스 링이 파괴 색이 됩니다.
  final bool invalid;

  /// 누르는 동작입니다. 넘기면 hover·focus 반응이 붙습니다(React의 `[a]:hover`).
  final VoidCallback? onTap;

  @override
  State<HoronBadge> createState() => _HoronBadgeState();
}

class _HoronBadgeState extends State<HoronBadge> {
  bool _hovered = false;
  bool _focused = false;

  @override
  Widget build(BuildContext context) {
    final ThemeData theme = Theme.of(context);
    final ColorScheme scheme = theme.colorScheme;
    final HoronThemeData horon = HoronTheme.of(context);
    final bool isDark = theme.brightness == Brightness.dark;
    final bool interactive = widget.onTap != null;

    final (Color background, Color foreground) = switch (widget.variant) {
      HoronBadgeVariant.defaultValue => (scheme.primary, scheme.onPrimary),
      HoronBadgeVariant.secondary => (scheme.secondary, scheme.onSecondary),
      HoronBadgeVariant.destructive => (scheme.error.withValues(alpha: isDark ? 0.2 : 0.1), scheme.error),
      HoronBadgeVariant.outline => (Colors.transparent, scheme.onSurface),
      HoronBadgeVariant.ghost => (Colors.transparent, scheme.onSurface),
      HoronBadgeVariant.link => (Colors.transparent, scheme.primary),
    };

    // `[a]:hover` 클래스가 고르는 쌍입니다. 누를 수 없는 배지는 hover에서 변하지 않습니다.
    final (Color hoveredBackground, Color hoveredForeground) = switch (widget.variant) {
      HoronBadgeVariant.defaultValue => (scheme.primary.withValues(alpha: 0.8), scheme.onPrimary),
      HoronBadgeVariant.secondary => (scheme.secondary.withValues(alpha: 0.8), scheme.onSecondary),
      HoronBadgeVariant.destructive => (scheme.error.withValues(alpha: 0.2), scheme.error),
      // `hover:bg-muted hover:text-muted-foreground`
      HoronBadgeVariant.outline => (scheme.surfaceContainerHighest, scheme.onSurfaceVariant),
      HoronBadgeVariant.ghost => (scheme.surfaceContainerHighest, scheme.onSurfaceVariant),
      HoronBadgeVariant.link => (Colors.transparent, scheme.primary),
    };

    final bool showHover = interactive && _hovered;
    final Color effectiveBackground = showHover ? hoveredBackground : background;
    final Color effectiveForeground = showHover ? hoveredForeground : foreground;

    final Color borderColor = widget.invalid
        ? scheme.error
        : switch (widget.variant) {
            HoronBadgeVariant.outline => scheme.outline,
            _ => Colors.transparent,
          };

    final Color ringColor = widget.invalid
        ? scheme.error.withValues(alpha: isDark ? 0.4 : 0.2)
        : horon.ring.withValues(alpha: 0.5);

    final TextStyle textStyle = TextStyle(
      fontFamily: HoronFont.body,
      fontFamilyFallback: HoronFont.fontFamilyFallback,
      fontSize: _badgeFontSize,
      fontWeight: HoronFontWeight.semibold,
      height: HoronLineHeight.none,
      color: effectiveForeground,
      decoration: widget.variant == HoronBadgeVariant.link && showHover
          ? TextDecoration.underline
          : TextDecoration.none,
      decorationColor: effectiveForeground,
    );

    final Widget content = DecoratedBox(
      decoration: BoxDecoration(
        color: effectiveBackground,
        borderRadius: BorderRadius.circular(HoronRadiusRole.pill),
        border: Border.all(color: borderColor),
        boxShadow: _focused ? <BoxShadow>[BoxShadow(color: ringColor, spreadRadius: _badgeFocusRingWidth)] : null,
      ),
      child: Padding(
        padding: EdgeInsets.only(
          left: widget.icon == null ? HoronSpace.s2_5 : HoronSpace.s1_5,
          right: widget.trailingIcon == null ? HoronSpace.s2_5 : HoronSpace.s1_5,
          top: _badgeVerticalPadding,
          bottom: _badgeVerticalPadding,
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.center,
          children: <Widget>[
            if (widget.icon != null) ...<Widget>[
              IconTheme.merge(
                data: IconThemeData(size: _badgeIconSize, color: effectiveForeground),
                child: widget.icon!,
              ),
              const SizedBox(width: HoronSpace.s1),
            ],
            if (widget.label != null)
              Text(widget.label!, maxLines: 1, softWrap: false, style: textStyle)
            else
              DefaultTextStyle(style: textStyle, child: widget.child!),
            if (widget.trailingIcon != null) ...<Widget>[
              const SizedBox(width: HoronSpace.s1),
              IconTheme.merge(
                data: IconThemeData(size: _badgeIconSize, color: effectiveForeground),
                child: widget.trailingIcon!,
              ),
            ],
          ],
        ),
      ),
    );

    if (!interactive) return content;

    return FocusableActionDetector(
      onShowHoverHighlight: (bool value) => setState(() => _hovered = value),
      onShowFocusHighlight: (bool value) => setState(() => _focused = value),
      actions: <Type, Action<Intent>>{
        ActivateIntent: CallbackAction<ActivateIntent>(
          onInvoke: (ActivateIntent intent) {
            widget.onTap!();
            return null;
          },
        ),
      },
      child: Semantics(
        button: true,
        child: MouseRegion(
          cursor: SystemMouseCursors.click,
          child: GestureDetector(behavior: HitTestBehavior.opaque, onTap: widget.onTap, child: content),
        ),
      ),
    );
  }
}
