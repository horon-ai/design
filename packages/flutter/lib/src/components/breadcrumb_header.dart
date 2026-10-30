import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import '../theme/horon_motion.dart';
import '../theme/horon_theme.dart';
import '../tokens/horon_tokens.g.dart';
import 'liquid_glass.dart';

/// `breadcrumb-header.tsx`의 `focus-visible:outline-2`입니다.
const double _focusWidth = 2;

/// `[&_svg]:size-4.5` — 헤더 아이콘 18px입니다.
const double _iconSize = 18;

/// `data-disabled:opacity-40`입니다.
const double _disabledOpacity = 0.4;

/// `breadcrumb-header.tsx`의 `BreadcrumbHeaderCrumb`입니다.
///
/// 조각 하나입니다. React의 `href`는 Flutter에 없으므로 [onTap]이 그 자리이고, 마지막
/// 조각이 현재 페이지입니다.
class HoronBreadcrumbHeaderCrumb {
  /// 조각 하나를 만듭니다.
  const HoronBreadcrumbHeaderCrumb({required this.label, this.onTap, this.tile});

  /// 조각의 글자입니다.
  final String label;

  /// 눌렀을 때 부를 콜백입니다. 현재 페이지에서는 무시됩니다.
  final VoidCallback? onTap;

  /// 앞에 붙는 20px 잉크 타일입니다(예: 워크스페이스 머리글자).
  final Widget? tile;
}

/// Paper `Header with breadcrumb`입니다.
///
/// 조각 줄, 검색 버튼, 더 보기 버튼을 담은 52px(`h-13`) regular 유리 알약입니다.
/// React는 조각 줄을 `overflow-clip`으로 잘라 내지만, Flutter 판은 폭이 모자라면 조각을
/// 다음 줄로 넘기고 알약 높이를 그만큼 늘립니다.
class HoronBreadcrumbHeader extends StatelessWidget {
  /// 조각 목록을 받아 헤더를 만듭니다.
  const HoronBreadcrumbHeader({
    super.key,
    required this.crumbs,
    this.onSearch,
    this.onMore,
    this.searchLabel = 'Search',
    this.moreLabel = 'More',
  });

  /// 순서대로 놓을 조각입니다. 마지막 조각이 현재 페이지입니다.
  final List<HoronBreadcrumbHeaderCrumb> crumbs;

  /// 검색 버튼을 눌렀을 때 부를 콜백입니다.
  final VoidCallback? onSearch;

  /// 더 보기 버튼을 눌렀을 때 부를 콜백입니다.
  final VoidCallback? onMore;

  /// 검색 버튼의 접근성 이름입니다.
  final String searchLabel;

  /// 더 보기 버튼의 접근성 이름입니다.
  final String moreLabel;

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    final HoronSpaceSpec space = theme.space;

    // `h-13 items-center gap-2 rounded-full bg-glass-regular p-2`입니다.
    return HoronLiquidGlass(
      tier: HoronGlassTier.regular,
      borderRadius: BorderRadius.circular(theme.radius.full),
      child: Container(
        constraints: BoxConstraints(minHeight: space.step(13)), // h-13 = 52
        padding: EdgeInsets.all(space.s2), // p-2
        child: Row(
          spacing: space.s2, // gap-2
          children: <Widget>[
            Expanded(child: _CrumbRow(crumbs: crumbs)),
            _HeaderIconButton(icon: const Icon(Icons.search), label: searchLabel, onPressed: onSearch),
            _HeaderIconButton(icon: const Icon(Icons.more_horiz), label: moreLabel, onPressed: onMore),
          ],
        ),
      ),
    );
  }
}

/// `nav > ol`의 조각 줄입니다.
class _CrumbRow extends StatelessWidget {
  const _CrumbRow({required this.crumbs});

  final List<HoronBreadcrumbHeaderCrumb> crumbs;

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    final HoronSpaceSpec space = theme.space;
    final HoronColors colors = theme.colors;

    return Semantics(
      container: true,
      label: 'Breadcrumb',
      child: Wrap(
        spacing: space.s1_5,
        runSpacing: space.s1_5,
        crossAxisAlignment: WrapCrossAlignment.center,
        children: <Widget>[
          for (int index = 0; index < crumbs.length; index++)
            Row(
              mainAxisSize: MainAxisSize.min,
              spacing: space.s1_5,
              children: <Widget>[
                if (index > 0)
                  Icon(
                    Icons.chevron_right,
                    size: space.s3_5, // size-3.5 = 14
                    color: colors.textSecondary,
                  ),
                Flexible(
                  child: _Crumb(crumb: crumbs[index], current: index == crumbs.length - 1),
                ),
              ],
            ),
        ],
      ),
    );
  }
}

/// 조각 하나입니다. `py-1 pr-2 pl-1.5 rounded-sm text-label-md`입니다.
class _Crumb extends StatelessWidget {
  const _Crumb({required this.crumb, required this.current});

  final HoronBreadcrumbHeaderCrumb crumb;
  final bool current;

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    final HoronColors colors = theme.colors;
    final HoronSpaceSpec space = theme.space;
    final VoidCallback? onTap = current ? null : crumb.onTap;

    return _Pressable(
      onTap: onTap,
      radius: theme.radius.sm,
      builder: (bool hovered) {
        final Color foreground = current || hovered ? colors.textPrimary : colors.textSecondary;
        return AnimatedDefaultTextStyle(
          duration: MediaQuery.disableAnimationsOf(context) ? Duration.zero : HoronMotion.colorsDuration,
          curve: HoronMotion.colorsCurve,
          style: theme.text.labelMd.copyWith(color: foreground),
          child: Padding(
            padding: EdgeInsets.only(top: space.s1, bottom: space.s1, right: space.s2, left: space.s1_5),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              spacing: space.s1_5,
              children: <Widget>[
                if (crumb.tile != null) _CrumbTile(tile: crumb.tile!),
                Flexible(child: Text(crumb.label, maxLines: 1, overflow: TextOverflow.ellipsis)),
              ],
            ),
          ),
        );
      },
    );
  }
}

/// `size-5 rounded-xs bg-interactive-primary text-label-sm text-text-inverse` 타일입니다.
class _CrumbTile extends StatelessWidget {
  const _CrumbTile({required this.tile});

  final Widget tile;

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    final HoronColors colors = theme.colors;
    final HoronSpaceSpec space = theme.space;
    return Container(
      width: space.step(5), // size-5 = 20
      height: space.step(5),
      alignment: Alignment.center,
      decoration: BoxDecoration(color: colors.interactivePrimary, borderRadius: BorderRadius.circular(theme.radius.xs)),
      child: IconTheme.merge(
        data: IconThemeData(size: space.s3_5, color: colors.textInverse),
        child: DefaultTextStyle.merge(
          style: theme.text.labelSm.copyWith(color: colors.textInverse),
          child: tile,
        ),
      ),
    );
  }
}

/// `IconButton className="size-9 [&_svg]:size-4.5"`의 자리입니다.
///
/// `icon-button.tsx`의 기본 크기는 32·40·48px이라 React가 여기서 덮어쓴 36px을 표현할 수
/// 없습니다. 그래서 이 파일이 그 크기와 ghost 상태만 따로 그립니다.
class _HeaderIconButton extends StatefulWidget {
  const _HeaderIconButton({required this.icon, required this.label, this.onPressed});

  final Widget icon;
  final String label;
  final VoidCallback? onPressed;

  @override
  State<_HeaderIconButton> createState() => _HeaderIconButtonState();
}

class _HeaderIconButtonState extends State<_HeaderIconButton> {
  bool _hovered = false;
  bool _pressed = false;
  bool _focused = false;

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    final HoronColors colors = theme.colors;
    final HoronSpaceSpec space = theme.space;
    final bool interactive = widget.onPressed != null;
    final bool reduceMotion = MediaQuery.disableAnimationsOf(context);

    // ghost: 바탕 없이 hover에서 `overlay-ink-6`, 누르면 `overlay-ink-10`입니다.
    final Color background = _pressed && interactive
        ? colors.overlayInk10
        : _hovered && interactive
        ? colors.overlayInk6
        : Colors.transparent;

    return Semantics(
      label: widget.label,
      button: true,
      enabled: interactive,
      child: Opacity(
        opacity: interactive ? 1 : _disabledOpacity,
        child: AnimatedScale(
          // motion-press: scale .97.
          scale: _pressed && interactive ? HoronMotion.pressScale : 1,
          duration: reduceMotion ? Duration.zero : HoronMotion.pressDuration,
          curve: HoronMotion.pressCurve,
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
              child: _FocusRing(
                visible: _focused && interactive,
                radius: theme.radius.full,
                color: colors.textBrand,
                child: AnimatedContainer(
                  duration: reduceMotion ? Duration.zero : HoronMotion.colorsDuration,
                  curve: HoronMotion.colorsCurve,
                  width: space.step(9), // size-9 = 36
                  height: space.step(9),
                  decoration: BoxDecoration(color: background, shape: BoxShape.circle),
                  child: Center(
                    child: IconTheme.merge(
                      data: IconThemeData(size: _iconSize, color: colors.textPrimary),
                      child: widget.icon,
                    ),
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

/// `motion-colors`와 `focus-visible:outline-2 outline-text-brand`을 옮긴 누름 표면입니다.
class _Pressable extends StatefulWidget {
  const _Pressable({required this.onTap, required this.radius, required this.builder});

  final VoidCallback? onTap;
  final double radius;
  final Widget Function(bool hovered) builder;

  @override
  State<_Pressable> createState() => _PressableState();
}

class _PressableState extends State<_Pressable> {
  bool _hovered = false;
  bool _focused = false;

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    final bool interactive = widget.onTap != null;
    final Widget surface = widget.builder(_hovered && interactive);

    return FocusableActionDetector(
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
            widget.onTap?.call();
            return null;
          },
        ),
      },
      child: GestureDetector(
        onTap: interactive ? widget.onTap : null,
        child: _FocusRing(
          visible: _focused && interactive,
          radius: widget.radius,
          color: theme.colors.textBrand,
          child: surface,
        ),
      ),
    );
  }
}

/// `outline-2 outline-offset-2`를 바깥으로 그립니다.
class _FocusRing extends StatelessWidget {
  const _FocusRing({required this.visible, required this.radius, required this.color, required this.child});

  final bool visible;
  final double radius;
  final Color color;
  final Widget child;

  @override
  Widget build(BuildContext context) {
    if (!visible) return child;
    final double offset = HoronTheme.of(context).space.s0_5;
    return Stack(
      clipBehavior: Clip.none,
      children: <Widget>[
        Positioned(
          left: -offset,
          top: -offset,
          right: -offset,
          bottom: -offset,
          child: IgnorePointer(
            child: DecoratedBox(
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(radius + offset),
                border: Border.all(color: color, width: _focusWidth),
              ),
            ),
          ),
        ),
        child,
      ],
    );
  }
}
