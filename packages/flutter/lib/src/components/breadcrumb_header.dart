import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import '../theme/horon_motion.dart';
import '../theme/horon_theme.dart';
import '../tokens/horon_tokens.g.dart';
import 'breadcrumb.dart';
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
    this.glass = false,
  });

  /// 참이면 `surface="glass"`입니다. 기본값은 불투명 solid입니다.
  final bool glass;

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

    final BorderRadius radius = BorderRadius.circular(theme.radius.full);
    final Widget content = Container(
      constraints: BoxConstraints(minHeight: space.step(13)), // h-13 = 52
      padding: EdgeInsets.all(space.s2), // p-2
      child: Row(
        spacing: space.s2, // gap-2
        children: <Widget>[
          Expanded(child: _CrumbRow(crumbs: crumbs)),
          // React는 `onSearch`·`onMore`가 있을 때만 아이콘 버튼을 그립니다. 없으면
          // 자리도 차지하지 않습니다.
          if (onSearch != null)
            _HeaderIconButton(icon: const Icon(Icons.search), label: searchLabel, onPressed: onSearch),
          if (onMore != null)
            _HeaderIconButton(icon: const Icon(Icons.more_horiz), label: moreLabel, onPressed: onMore),
        ],
      ),
    );
    if (glass) {
      return HoronLiquidGlass(tier: HoronGlassTier.regular, borderRadius: radius, child: content);
    }
    return DecoratedBox(
      decoration: BoxDecoration(
        color: theme.colors.bgSurface,
        borderRadius: radius,
        border: Border.all(color: theme.colors.borderDefault),
      ),
      child: content,
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
                  // React는 `_Crumb` 대신 `BreadcrumbItem`을 그대로 씁니다. 조각 렌더를
                  // 한 곳으로 모아 타일·현재·링크 스타일이 두 컴포넌트에서 갈라지지 않습니다.
                  child: HoronBreadcrumbItem(
                    label: crumbs[index].label,
                    current: index == crumbs.length - 1,
                    onTap: crumbs[index].onTap,
                    tile: crumbs[index].tile,
                  ),
                ),
              ],
            ),
        ],
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
