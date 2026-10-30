import 'dart:math' as math;

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import '../glass/glass_geometry.dart';
import '../glass/horon_glass.dart';
import '../theme/horon_motion.dart';
import '../theme/horon_theme.dart';
import '../tokens/horon_tokens.g.dart';

/// `w-55` — 유리 메뉴의 220px 폭입니다.
const double _glassWidth = 220;

/// `w-64` — 단색 메뉴의 256px 폭입니다.
const double _solidWidth = 256;

/// `w-76` — Paper 메뉴의 304px 폭입니다.
const double _paperWidth = 304;

/// `rounded-[18px]` — 토큰 반경 단계에 없는 단색 메뉴의 반경입니다.
const double _solidRadius = 18;

/// `rounded-[10px]` — 토큰 반경 단계에 없는 단색 메뉴 항목의 반경입니다.
const double _itemRadius = 10;

/// `[&>svg]:size-4.5` — 항목 앞 아이콘 18px입니다.
const double _menuIconSize = 18;

/// `[&>svg]:size-4` — 항목 뒤 아이콘 16px입니다.
const double _trailingIconSize = 16;

/// `data-disabled:opacity-40` — 비활성 항목의 불투명도입니다.
const double _disabledOpacity = 0.4;

/// `h-px` — 구분선 두께입니다.
const double _hairline = 1;

/// `shadow-[0_12px_32px_#0A142424]`의 세로 이동입니다.
const double _paperShadowOffset = 12;

/// `shadow-[0_12px_32px_#0A142424]`의 번짐입니다.
const double _paperShadowBlur = 32;

/// `shadow-[0_12px_32px_#0A142424]`의 알파입니다.
const double _paperShadowAlpha = 0.14;

/// 메뉴 표면입니다. React `MenuSurface`입니다.
enum HoronMenuSurface {
  /// Figma `Menu` — 두꺼운 유리, 20px 반경, 40px 줄입니다.
  glass,

  /// 계정·워크스페이스 메뉴 — 불투명 채움, 18px 반경, 36px 줄입니다.
  solid,

  /// Paper 워크스페이스 전환기 — 기본 채움, 1px 테두리, 14px 반경, 304px 폭입니다.
  paper,
}

/// 메뉴 안쪽에서 표면을 알려 주는 스코프입니다. React `SurfaceContext`입니다.
class _MenuSurfaceScope extends InheritedWidget {
  const _MenuSurfaceScope({required this.surface, required super.child});

  final HoronMenuSurface surface;

  static HoronMenuSurface of(BuildContext context) =>
      context.dependOnInheritedWidgetOfExactType<_MenuSurfaceScope>()?.surface ?? HoronMenuSurface.glass;

  @override
  bool updateShouldNotify(_MenuSurfaceScope oldWidget) => oldWidget.surface != surface;
}

/// 항목이 골라졌을 때 메뉴를 닫게 해 주는 스코프입니다.
class _MenuDismissScope extends InheritedWidget {
  const _MenuDismissScope({required this.dismiss, required super.child});

  final VoidCallback dismiss;

  static VoidCallback? maybeOf(BuildContext context) =>
      context.getInheritedWidgetOfExactType<_MenuDismissScope>()?.dismiss;

  @override
  bool updateShouldNotify(_MenuDismissScope oldWidget) => oldWidget.dismiss != dismiss;
}

/// Figma `Menus and popovers`(88:495)의 메뉴 뿌리입니다. React `Menu`입니다.
///
/// [trigger]를 누르면 [content]를 그 아래에 띄우고, 바깥을 누르거나 Escape를 누르거나
/// 항목을 고르면 닫습니다. React는 `MenuTrigger`에 `render`로 요소를 넘기지만
/// Flutter에서는 [trigger]가 위젯 자체입니다. 트리거의 유일한 동작이 메뉴 열기이므로
/// 그 안의 터지는 흡수합니다(`AbsorbPointer`).
class HoronMenu extends StatefulWidget {
  /// 메뉴를 만듭니다.
  const HoronMenu({super.key, required this.trigger, required this.content, this.onOpenChange});

  /// 메뉴를 여는 요소입니다(React `MenuTrigger`).
  final Widget trigger;

  /// 열릴 때 그리는 메뉴입니다(React `MenuContent`).
  final HoronMenuContent content;

  /// 열림이 바뀔 때 부를 콜백입니다.
  final ValueChanged<bool>? onOpenChange;

  @override
  State<HoronMenu> createState() => _HoronMenuState();
}

class _HoronMenuState extends State<HoronMenu> {
  final LayerLink _link = LayerLink();
  final OverlayPortalController _portal = OverlayPortalController();
  bool _open = false;

  void _setOpen(bool value) {
    if (_open == value) return;
    setState(() => _open = value);
    if (value) {
      _portal.show();
    } else {
      _portal.hide();
    }
    widget.onOpenChange?.call(value);
  }

  @override
  Widget build(BuildContext context) {
    return CompositedTransformTarget(
      link: _link,
      child: OverlayPortal(
        controller: _portal,
        overlayChildBuilder: _buildOverlay,
        child: GestureDetector(
          behavior: HitTestBehavior.opaque,
          onTap: () => _setOpen(!_open),
          child: AbsorbPointer(child: widget.trigger),
        ),
      ),
    );
  }

  Widget _buildOverlay(BuildContext context) {
    final HoronMenuContent content = widget.content;
    final bool reduceMotion = MediaQuery.disableAnimationsOf(context);

    // 바깥을 누르면 닫는 자리입니다. 투명한 전체 화면 막을 팝업 아래에 깔아, 팝업
    // 밖의 포인터를 모두 메뉴가 받습니다(`TapRegion`은 팝업 위젯의 상자가 오버레이
    // 전체로 늘어나 바깥 판정이 어긋납니다).
    return Stack(
      children: <Widget>[
        Positioned.fill(
          child: GestureDetector(behavior: HitTestBehavior.opaque, onTap: () => _setOpen(false)),
        ),
        CompositedTransformFollower(
          link: _link,
          showWhenUnlinked: false,
          targetAnchor: content._targetAnchor,
          followerAnchor: content._followerAnchor,
          offset: content._offset,
          child: Focus(
            autofocus: true,
            onKeyEvent: (FocusNode node, KeyEvent event) {
              if (event is KeyDownEvent && event.logicalKey == LogicalKeyboardKey.escape) {
                _setOpen(false);
                return KeyEventResult.handled;
              }
              return KeyEventResult.ignored;
            },
            child: TweenAnimationBuilder<double>(
              tween: Tween<double>(begin: 0, end: 1),
              duration: reduceMotion ? Duration.zero : HoronMotion.popupEnterDuration,
              curve: HoronMotion.easeEmphasized,
              // `motion-popup` — 0.95배에서 1배로 자라며 나타납니다.
              builder: (BuildContext context, double t, Widget? child) => Opacity(
                opacity: t,
                child: Transform.scale(
                  scale: HoronMotion.popupEnterScale + (1 - HoronMotion.popupEnterScale) * t,
                  child: child,
                ),
              ),
              child: _MenuDismissScope(dismiss: () => _setOpen(false), child: content),
            ),
          ),
        ),
      ],
    );
  }
}

/// 메뉴의 팝업 상자입니다. React `MenuContent`입니다.
///
/// [surface]에 따라 폭·반경·채움·그림자가 달라집니다. 폭은 React의 고정값을 상한으로
/// 두고 화면이 좁으면 줄어듭니다.
class HoronMenuContent extends StatelessWidget {
  /// 팝업을 만듭니다.
  const HoronMenuContent({
    super.key,
    this.surface = HoronMenuSurface.glass,
    this.side = AxisDirection.down,
    this.align = Alignment.centerLeft,
    this.sideOffset = 8,
    this.alignOffset = 0,
    required this.children,
  });

  /// 표면입니다(React `surface`). 기본값은 `glass`입니다.
  final HoronMenuSurface surface;

  /// 트리거 기준 어느 쪽에 열지입니다(React `side`). 기본값은 아래입니다.
  final AxisDirection side;

  /// 트리거의 어느 모서리에 맞출지입니다(React `align`). 기본값은 시작(`start`)입니다.
  final Alignment align;

  /// 트리거와의 거리입니다(React `sideOffset`, 기본 8).
  final double sideOffset;

  /// 맞춤 축의 이동입니다(React `alignOffset`).
  final double alignOffset;

  /// 메뉴 내용입니다(React `children`).
  final List<Widget> children;

  /// 트리거 쪽 맞춤점입니다.
  Alignment get _targetAnchor => switch (side) {
    AxisDirection.down => Alignment(align.x, 1),
    AxisDirection.up => Alignment(align.x, -1),
    AxisDirection.right => Alignment(1, align.y),
    AxisDirection.left => Alignment(-1, align.y),
  };

  /// 팝업 쪽 맞춤점입니다.
  Alignment get _followerAnchor => switch (side) {
    AxisDirection.down => Alignment(align.x, -1),
    AxisDirection.up => Alignment(align.x, 1),
    AxisDirection.right => Alignment(-1, align.y),
    AxisDirection.left => Alignment(1, align.y),
  };

  /// 맞춤점 사이의 이동입니다.
  Offset get _offset => switch (side) {
    AxisDirection.up => Offset(alignOffset, -sideOffset),
    AxisDirection.right => Offset(sideOffset, alignOffset),
    AxisDirection.left => Offset(-sideOffset, alignOffset),
    AxisDirection.down => Offset(alignOffset, sideOffset),
  };

  double get _fixedWidth => switch (surface) {
    HoronMenuSurface.glass => _glassWidth,
    HoronMenuSurface.solid => _solidWidth,
    HoronMenuSurface.paper => _paperWidth,
  };

  /// 오버레이 상자 안에서 팝업을 어디에 둘지입니다.
  ///
  /// 오버레이 자식은 화면 크기의 tight 제약을 받으므로 팝업 상자는 그보다 작아질 수
  /// 없습니다. 그래서 `Align`이 트리거 기준 가장자리에 팝업을 붙입니다.
  Alignment get _childAlignment => switch (side) {
    AxisDirection.down => Alignment(align.x, -1),
    AxisDirection.up => Alignment(align.x, 1),
    AxisDirection.right => Alignment(-1, align.y),
    AxisDirection.left => Alignment(1, align.y),
  };

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    final HoronColors colors = theme.colors;
    final BorderRadius radius = BorderRadius.circular(switch (surface) {
      HoronMenuSurface.glass => theme.radius.xl, // rounded-xl = 20
      HoronMenuSurface.solid => _solidRadius, // rounded-[18px]
      HoronMenuSurface.paper => theme.radius.lg, // rounded-[14px] = radius.lg
    });

    // 팝업은 트리거에 매달린 떠 있는 요소라 크기 기준이 자기 상자가 아니라 화면입니다
    // (Base UI 포지셔너도 `window.innerWidth`로 충돌을 피합니다). 화면 가장자리에는
    // 좌우 각각 `space.s4`만큼 여백을 남기고, React의 고정 폭은 상한으로만 씁니다.
    final double width = math.min(_fixedWidth, math.max(0, MediaQuery.sizeOf(context).width - theme.space.s4 * 2));
    return Align(
      alignment: _childAlignment,
      child: SizedBox(width: width, child: _chrome(theme, colors, radius)),
    );
  }

  Widget _chrome(HoronThemeData theme, HoronColors colors, BorderRadius radius) {
    final BoxDecoration decoration = switch (surface) {
      // `rounded-xl bg-glass-thick` — 채움은 유리 레이어가 그립니다.
      HoronMenuSurface.glass => BoxDecoration(borderRadius: radius),
      // `rounded-[18px] bg-glass-fill-solid shadow-popover`.
      HoronMenuSurface.solid => BoxDecoration(
        borderRadius: radius,
        color: colors.glassFillSolid,
        boxShadow: theme.shadows.popover,
      ),
      // `rounded-[14px] border border-border-default bg-bg-default shadow-[0_12px_32px_#0A142424]`.
      HoronMenuSurface.paper => BoxDecoration(
        borderRadius: radius,
        color: colors.bgDefault,
        border: Border.all(color: colors.borderDefault),
        boxShadow: <BoxShadow>[
          BoxShadow(
            color: colors.bgScrim.withValues(alpha: _paperShadowAlpha),
            offset: const Offset(0, _paperShadowOffset),
            blurRadius: _paperShadowBlur,
          ),
        ],
      ),
    };

    return DecoratedBox(
      decoration: decoration,
      child: ClipRRect(
        borderRadius: radius,
        child: Stack(
          children: <Widget>[
            // Paper는 유리 레이어를 그리지 않습니다(`surface === "paper" ? null`).
            if (surface != HoronMenuSurface.paper)
              Positioned.fill(
                child: HoronLiquidGlass(
                  tier: HoronGlassTier.thick,
                  borderRadius: radius,
                  child: const SizedBox.expand(),
                ),
              ),
            // `flex flex-col gap-0.5 p-1.5`.
            Padding(
              padding: EdgeInsets.all(theme.space.s1_5),
              child: _MenuSurfaceScope(
                surface: surface,
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  spacing: theme.space.s0_5,
                  children: children,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

/// 메뉴 항목입니다. React `MenuItem`입니다.
class HoronMenuItem extends StatefulWidget {
  /// 항목을 만듭니다.
  const HoronMenuItem({
    super.key,
    required this.label,
    this.icon,
    this.description,
    this.trailing,
    this.danger = false,
    this.selected = false,
    this.background,
    this.enabled = true,
    this.onTap,
  });

  /// 항목의 문구입니다(React `children`).
  final String label;

  /// 앞쪽 아이콘(18px)이나 28px 워크스페이스 타일입니다(React `icon`).
  final Widget? icon;

  /// 라벨 아래 설명입니다(React `description`). 있으면 줄 높이가 46px이 됩니다.
  final String? description;

  /// 오른쪽 단축키나 체크 표시입니다(React `trailing`).
  final Widget? trailing;

  /// 참이면 라벨과 아이콘이 `textDanger`가 됩니다(React `danger`).
  final bool danger;

  /// 현재 선택을 브랜드 바탕으로 그립니다(React `selected`).
  final bool selected;

  /// 이 항목의 바탕색입니다.
  ///
  /// React는 `className`으로 임의의 바탕을 칠합니다. 워크스페이스 메뉴의 현재 행처럼
  /// 강조색을 직접 지정해야 하는 자리를 위해 열어 둡니다. 강조(hover)는 이 값보다
  /// 우선합니다.
  final Color? background;

  /// 거짓이면 `opacity-40`으로 흐려지고 눌리지 않습니다(React `disabled`).
  final bool enabled;

  /// 항목을 골랐을 때 부를 콜백입니다(React `onClick`).
  final VoidCallback? onTap;

  @override
  State<HoronMenuItem> createState() => _HoronMenuItemState();
}

class _HoronMenuItemState extends State<HoronMenuItem> {
  bool _hovered = false;

  void _handleTap() {
    if (!widget.enabled) return;
    widget.onTap?.call();
    _MenuDismissScope.maybeOf(context)?.call();
  }

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    final HoronColors colors = theme.colors;
    final HoronSpaceSpec space = theme.space;
    final HoronMenuSurface surface = _MenuSurfaceScope.of(context);
    final bool reduceMotion = MediaQuery.disableAnimationsOf(context);
    final bool hasDescription = widget.description != null;

    // 유리는 `rounded-md px-3`, 단색·Paper는 `rounded-[10px] px-2.5`.
    final bool glass = surface == HoronMenuSurface.glass;
    final BorderRadius radius = BorderRadius.circular(glass ? theme.radius.md : _itemRadius);
    final double horizontal = glass ? space.s3 : space.s2_5;
    final EdgeInsets padding = hasDescription
        ? EdgeInsets.only(left: space.s2, right: horizontal) // `pl-2`
        : EdgeInsets.symmetric(horizontal: horizontal);
    // `description ? h-11.5 : glass ? h-10 : h-9`.
    final double height = space.step(hasDescription ? 11.5 : (glass ? 10 : 9));

    final Color base = widget.background ?? (widget.selected ? colors.bgBrand : Colors.transparent);
    // `data-highlighted:bg-overlay-ink-6`, 선택 행은 강조에서도 브랜드를 유지합니다.
    final Color fill = _hovered ? (widget.selected ? colors.bgBrand : colors.overlayInk6) : base;

    final Color labelColor = widget.danger ? colors.textDanger : colors.textPrimary;

    return Opacity(
      opacity: widget.enabled ? 1 : _disabledOpacity,
      child: MouseRegion(
        cursor: widget.enabled ? SystemMouseCursors.click : SystemMouseCursors.basic,
        onEnter: (_) => setState(() => _hovered = true),
        onExit: (_) => setState(() => _hovered = false),
        child: GestureDetector(
          behavior: HitTestBehavior.opaque,
          onTap: widget.enabled ? _handleTap : null,
          child: AnimatedContainer(
            duration: reduceMotion ? Duration.zero : HoronMotion.colorsDuration,
            curve: HoronMotion.colorsCurve,
            height: height,
            padding: padding,
            decoration: BoxDecoration(color: fill, borderRadius: radius),
            child: Row(
              spacing: space.s2_5,
              children: <Widget>[
                ?_icon(theme, surface),
                Expanded(
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: <Widget>[
                      Text(
                        widget.label,
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                        style: theme.text.labelMd.copyWith(color: labelColor),
                      ),
                      if (widget.description != null)
                        Text(
                          widget.description!,
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          style: theme.text.caption.copyWith(color: colors.textSecondary),
                        ),
                    ],
                  ),
                ),
                ?_trailing(theme),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget? _icon(HoronThemeData theme, HoronMenuSurface surface) {
    final Widget? icon = widget.icon;
    if (icon == null) return null;
    final Color color = widget.danger
        ? theme.colors.textDanger
        : (surface == HoronMenuSurface.glass ? theme.colors.textSecondary : theme.colors.textPrimary);
    return IconTheme.merge(
      data: IconThemeData(size: _menuIconSize, color: color),
      child: icon,
    );
  }

  Widget? _trailing(HoronThemeData theme) {
    final Widget? trailing = widget.trailing;
    if (trailing == null) return null;
    return IconTheme.merge(
      data: IconThemeData(size: _trailingIconSize, color: theme.colors.textPrimary),
      child: DefaultTextStyle.merge(
        style: theme.text.caption.copyWith(color: theme.colors.textSecondary),
        child: trailing,
      ),
    );
  }
}

/// 메뉴 구분선입니다. React `MenuSeparator`입니다.
class HoronMenuSeparator extends StatelessWidget {
  /// 구분선을 만듭니다.
  const HoronMenuSeparator({super.key});

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    final HoronMenuSurface surface = _MenuSurfaceScope.of(context);
    // `py-1`, 유리는 `px-1.5`, 나머지는 `px-2.5`.
    return Padding(
      padding: EdgeInsets.symmetric(
        vertical: theme.space.s1,
        horizontal: surface == HoronMenuSurface.glass ? theme.space.s1_5 : theme.space.s2_5,
      ),
      child: SizedBox(
        height: _hairline,
        width: double.infinity,
        child: ColoredBox(color: theme.colors.overlayInk8),
      ),
    );
  }
}

/// 메뉴 묶음 제목입니다. React `MenuLabel`입니다.
class HoronMenuLabel extends StatelessWidget {
  /// 제목을 만듭니다.
  const HoronMenuLabel({super.key, required this.label});

  /// 제목 문구입니다(React `children`).
  final String label;

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    // `px-2.5 pt-2 pb-1 text-caption text-text-secondary`.
    return Padding(
      padding: EdgeInsets.only(
        left: theme.space.s2_5,
        right: theme.space.s2_5,
        top: theme.space.s2,
        bottom: theme.space.s1,
      ),
      child: Text(
        label,
        maxLines: 1,
        overflow: TextOverflow.ellipsis,
        style: theme.text.caption.copyWith(color: theme.colors.textSecondary),
      ),
    );
  }
}

/// 워크스페이스 이니셜을 담는 28px 타일입니다. React `MenuTile`입니다.
class HoronMenuTile extends StatelessWidget {
  /// 타일을 만듭니다.
  const HoronMenuTile({super.key, required this.label});

  /// 타일에 그릴 이니셜입니다(React `children`).
  final String label;

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    final double size = theme.space.step(7);
    return Container(
      // `size-7 rounded-sm bg-interactive-primary text-label-sm text-text-inverse`.
      width: size,
      height: size,
      alignment: Alignment.center,
      decoration: BoxDecoration(
        color: theme.colors.interactivePrimary,
        borderRadius: BorderRadius.circular(theme.radius.sm),
      ),
      child: Text(label, maxLines: 1, style: theme.text.labelSm.copyWith(color: theme.colors.textInverse)),
    );
  }
}
