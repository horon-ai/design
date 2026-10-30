import 'package:flutter/material.dart';

import '../theme/horon_theme.dart';

enum _TooltipSide { top, bottom, left, right }

/// 화살표 상자의 긴 변입니다. Paper `TVV-1`의 10입니다.
const double _arrowLength = 10;

/// 화살표 상자의 짧은 변입니다. Paper `TVV-1`의 6입니다.
const double _arrowDepth = 6;

/// 화살표 삼각형의 밑변 폭입니다. Paper `TVV-1`의 8.66입니다.
const double _arrowBase = 8.66;

/// 삼각형 밑변과 말풍선 사이의 거리입니다. Paper `TVV-1`의 1.5입니다.
const double _arrowGap = 1.5;

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

        final (Alignment target, Alignment follower) = switch (widget._side) {
          _TooltipSide.top => (Alignment.topCenter, Alignment.bottomCenter),
          _TooltipSide.bottom => (Alignment.bottomCenter, Alignment.topCenter),
          _TooltipSide.left => (Alignment.centerLeft, Alignment.centerRight),
          _TooltipSide.right => (Alignment.centerRight, Alignment.centerLeft),
        };

        // Paper `TVV-1`은 6px 화살표 상자를 말풍선과 트리거 사이에 둡니다. 두 변이
        // 모두 같아서(6) 맞닿은 변이 트리거 끝에 바로 붙고, 사이의 1.5px은 삼각형
        // 안쪽 여백이 만듭니다.
        final bool vertical = widget._side == _TooltipSide.top || widget._side == _TooltipSide.bottom;
        final Widget arrow = SizedBox(
          width: vertical ? _arrowLength : _arrowDepth,
          height: vertical ? _arrowDepth : _arrowLength,
          child: ClipPath(
            clipper: _TooltipArrowClipper(widget._side),
            child: ColoredBox(color: theme.colors.interactivePrimary),
          ),
        );
        final Widget content = switch (widget._side) {
          _TooltipSide.top => Column(mainAxisSize: MainAxisSize.min, children: <Widget>[bubble, arrow]),
          _TooltipSide.bottom => Column(mainAxisSize: MainAxisSize.min, children: <Widget>[arrow, bubble]),
          _TooltipSide.left => Row(mainAxisSize: MainAxisSize.min, children: <Widget>[bubble, arrow]),
          _TooltipSide.right => Row(mainAxisSize: MainAxisSize.min, children: <Widget>[arrow, bubble]),
        };

        return CompositedTransformFollower(
          link: _link,
          showWhenUnlinked: false,
          targetAnchor: target,
          followerAnchor: follower,
          child: Align(alignment: Alignment.topLeft, child: content),
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

/// 말풍선 화살표를 삼각형으로 오려 낼니다.
///
/// Paper `TVV-1`은 6px 상자 안에 밑변 8.66px·높이 4.5px 삼각형을 그립니다. 밑변을
/// 말풍선에서 1.5px 띄우고 꼭짓점을 상자의 바깥 변에 두어, 화살표가 트리거에 닿습니다.
class _TooltipArrowClipper extends CustomClipper<Path> {
  const _TooltipArrowClipper(this.side);

  final _TooltipSide side;

  @override
  Path getClip(Size size) {
    final double midX = size.width / 2;
    final double midY = size.height / 2;
    return switch (side) {
      _TooltipSide.top =>
        Path()
          ..moveTo(midX - _arrowBase / 2, _arrowGap)
          ..lineTo(midX + _arrowBase / 2, _arrowGap)
          ..lineTo(midX, size.height)
          ..close(),
      _TooltipSide.bottom =>
        Path()
          ..moveTo(midX - _arrowBase / 2, size.height - _arrowGap)
          ..lineTo(midX + _arrowBase / 2, size.height - _arrowGap)
          ..lineTo(midX, 0)
          ..close(),
      _TooltipSide.left =>
        Path()
          ..moveTo(_arrowGap, midY - _arrowBase / 2)
          ..lineTo(_arrowGap, midY + _arrowBase / 2)
          ..lineTo(size.width, midY)
          ..close(),
      _TooltipSide.right =>
        Path()
          ..moveTo(size.width - _arrowGap, midY - _arrowBase / 2)
          ..lineTo(size.width - _arrowGap, midY + _arrowBase / 2)
          ..lineTo(0, midY)
          ..close(),
    };
  }

  @override
  bool shouldReclip(_TooltipArrowClipper oldClipper) => oldClipper.side != side;
}
