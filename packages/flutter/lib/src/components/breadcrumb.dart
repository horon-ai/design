import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import '../theme/horon_motion.dart';
import '../theme/horon_theme.dart';
import '../tokens/horon_tokens.g.dart';
import 'liquid_glass.dart';

/// `breadcrumb.tsx`의 `focus-visible:outline-2`입니다.
const double _focusWidth = 2;

/// Figma `Breadcrumb`(110:948)입니다.
///
/// 조각 사이를 6px(`gap-1.5`)로 벌리고 14px 캐럿(`size-3.5`)으로 잇습니다. 마지막 조각이
/// 현재 페이지입니다. React는 `flex` 행이라 좁은 폭에서 조각이 잘리지만, Flutter 판은
/// 같은 간격을 유지한 채 [Wrap]으로 줄을 바꿔 모든 조각을 남깁니다.
class HoronBreadcrumb extends StatelessWidget {
  /// 조각 목록을 받아 빵부스러기를 만듭니다.
  const HoronBreadcrumb({super.key, required this.children, this.glass = false, this.label = 'Breadcrumb'});

  /// 순서대로 놓을 조각입니다. 보통 [HoronBreadcrumbItem]입니다.
  final List<Widget> children;

  /// 참이면 `surface="glass"`입니다. 조각을 regular 유리 쟁반 안에 넣습니다.
  final bool glass;

  /// 접근성 이름입니다. React의 `aria-label`이고 기본값은 `Breadcrumb`입니다.
  final String label;

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    final HoronSpaceSpec space = theme.space;
    final HoronColors colors = theme.colors;

    final Widget crumbs = Semantics(
      container: true,
      label: label,
      child: Wrap(
        // `ol`의 `gap-1.5`입니다. React의 `whitespace-nowrap`은 조각마다 걸려 있고,
        // 행 자체는 줄을 바꾸지 않습니다. Flutter 판은 폭이 모자라면 줄을 바꿉니다.
        spacing: space.s1_5,
        runSpacing: space.s1_5,
        crossAxisAlignment: WrapCrossAlignment.center,
        children: <Widget>[
          for (int index = 0; index < children.length; index++)
            Row(
              mainAxisSize: MainAxisSize.min,
              spacing: space.s1_5, // `li`의 `gap-1.5`
              children: <Widget>[
                if (index > 0)
                  Icon(
                    Icons.chevron_right,
                    // `size-3.5` = 14.
                    size: space.s3_5,
                    color: colors.textSecondary,
                  ),
                Flexible(child: children[index]),
              ],
            ),
        ],
      ),
    );

    if (!glass) return crumbs;

    // `rounded-xl bg-glass-regular px-4 py-3.5`입니다. 유리는 레이어 엔진이 그립니다.
    return HoronLiquidGlass(
      tier: HoronGlassTier.regular,
      borderRadius: BorderRadius.circular(theme.radius.xl),
      child: Padding(
        padding: EdgeInsets.symmetric(horizontal: space.s4, vertical: space.s3_5),
        child: crumbs,
      ),
    );
  }
}

/// `breadcrumb.tsx`의 `BreadcrumbItem`입니다.
///
/// 조각 하나입니다. [current]가 참이면 현재 페이지로 그려지고, 아니고 [onTap]이 있으면
/// 링크로 동작합니다. React의 `href`는 Flutter에 없으므로 [onTap]이 그 자리입니다.
class HoronBreadcrumbItem extends StatelessWidget {
  /// 조각 하나를 만듭니다.
  const HoronBreadcrumbItem({super.key, required this.label, this.current = false, this.onTap, this.tile});

  /// 조각의 글자입니다.
  final String label;

  /// 현재 페이지인지 여부입니다. 참이면 기본 글자색이고 `aria-current` 자리입니다.
  final bool current;

  /// 눌렀을 때 부를 콜백입니다. 없으면 링크가 아닌 글자입니다.
  final VoidCallback? onTap;

  /// 앞에 붙는 20px 잉크 타일입니다(예: 워크스페이스 머리글자).
  final Widget? tile;

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    final HoronColors colors = theme.colors;
    final HoronSpaceSpec space = theme.space;
    final bool link = onTap != null && !current;

    return _Pressable(
      onTap: link ? onTap : null,
      radius: theme.radius.sm, // rounded-sm
      builder: (bool hovered) {
        final Color foreground = current || hovered ? colors.textPrimary : colors.textSecondary;
        return AnimatedDefaultTextStyle(
          duration: MediaQuery.disableAnimationsOf(context) ? Duration.zero : HoronMotion.colorsDuration,
          curve: HoronMotion.colorsCurve,
          style: theme.text.labelMd.copyWith(color: foreground),
          child: Padding(
            // `py-1 pr-2 pl-1.5`입니다.
            padding: EdgeInsets.only(top: space.s1, bottom: space.s1, right: space.s2, left: space.s1_5),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              spacing: space.s1_5, // gap-1.5
              children: <Widget>[
                if (tile != null) _CrumbTile(tile: tile!),
                Flexible(
                  child: Text(
                    label,
                    maxLines: 1, // whitespace-nowrap
                    overflow: TextOverflow.ellipsis,
                  ),
                ),
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
      // `size-5` = 20.
      width: space.step(5),
      height: space.step(5),
      alignment: Alignment.center,
      decoration: BoxDecoration(color: colors.interactivePrimary, borderRadius: BorderRadius.circular(theme.radius.xs)),
      child: IconTheme.merge(
        data: IconThemeData(
          // `[&_svg]` 자리에 오는 아이콘이 타일보다 크지 않게 14px로 둡니다.
          size: space.s3_5,
          color: colors.textInverse,
        ),
        child: DefaultTextStyle.merge(
          style: theme.text.labelSm.copyWith(color: colors.textInverse),
          child: tile,
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
    final HoronThemeData theme = HoronTheme.of(context);
    final double offset = theme.space.s0_5; // outline-offset-2
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
