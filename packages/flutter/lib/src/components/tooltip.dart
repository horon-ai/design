import 'package:flutter/material.dart';

import '../theme/horon_theme.dart';

enum _TooltipSide { top, bottom, left, right }

/// Figma `Tooltip`(62:282): 잉크 말풍선에 10/6 여백, 8 반경, 10x6 화살표를 붙인 안내입니다.
///
/// `tooltip.tsx`의 `side`는 props 안의 인라인 유니온이라 variant 어휘가 아니므로,
/// 네 방향을 이름 있는 생성자로 엽니다. 포인터는 호버로, 터치 기기는 길게 누르기로
/// 열립니다. `MenuAnchor`가 아니라 `OverlayPortal`을 쓰는 이유는 메뉴 패널이 자식의
/// 고유 크기를 물어 `LayoutBuilder`를 품은 표면을 깨뜨리기 때문입니다.
class HoronTooltip extends StatefulWidget {
  /// 위쪽에 여는 말풍선입니다.
  const HoronTooltip.top({super.key, required this.label, required this.child}) : _side = _TooltipSide.top;

  /// 아래쪽에 여는 말풍선입니다.
  const HoronTooltip.bottom({super.key, required this.label, required this.child}) : _side = _TooltipSide.bottom;

  /// 왼쪽에 여는 말풍선입니다.
  const HoronTooltip.left({super.key, required this.label, required this.child}) : _side = _TooltipSide.left;

  /// 오른쪽에 여는 말풍선입니다.
  const HoronTooltip.right({super.key, required this.label, required this.child}) : _side = _TooltipSide.right;

  /// 말풍선 문구입니다.
  final String label;

  /// 말풍선을 여는 대상입니다.
  final Widget child;

  final _TooltipSide _side;

  @override
  State<HoronTooltip> createState() => _HoronTooltipState();
}

class _HoronTooltipState extends State<HoronTooltip> {
  final OverlayPortalController _portal = OverlayPortalController();
  final LayerLink _link = LayerLink();

  void _show() {
    if (!_portal.isShowing) _portal.show();
  }

  void _hide() {
    if (_portal.isShowing) _portal.hide();
  }

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    final BorderRadius radius = BorderRadius.circular(theme.radius.sm);

    return OverlayPortal(
      controller: _portal,
      overlayChildBuilder: (BuildContext context) {
        final Widget bubble = DecoratedBox(
          decoration: BoxDecoration(color: theme.colors.interactivePrimary, borderRadius: radius),
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
            child: Text(widget.label, style: theme.text.labelSm.copyWith(color: theme.colors.interactiveOnPrimary)),
          ),
        );

        final (Alignment target, Alignment follower, Offset offset) = switch (widget._side) {
          _TooltipSide.top => (Alignment.topCenter, Alignment.bottomCenter, const Offset(0, -6)),
          _TooltipSide.bottom => (Alignment.bottomCenter, Alignment.topCenter, const Offset(0, 6)),
          _TooltipSide.left => (Alignment.centerLeft, Alignment.centerRight, const Offset(-6, 0)),
          _TooltipSide.right => (Alignment.centerRight, Alignment.centerLeft, const Offset(6, 0)),
        };

        return CompositedTransformFollower(
          link: _link,
          showWhenUnlinked: false,
          targetAnchor: target,
          followerAnchor: follower,
          offset: offset,
          child: Align(alignment: Alignment.topLeft, child: bubble),
        );
      },
      child: CompositedTransformTarget(
        link: _link,
        child: MouseRegion(
          onEnter: (_) => _show(),
          onExit: (_) => _hide(),
          child: GestureDetector(onLongPressStart: (_) => _show(), onLongPressEnd: (_) => _hide(), child: widget.child),
        ),
      ),
    );
  }
}
