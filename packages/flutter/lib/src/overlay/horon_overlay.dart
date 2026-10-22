import 'dart:math' as math;

import 'package:flutter/material.dart';
import 'package:flutter/rendering.dart' show RenderProxyBox;
import 'package:flutter/scheduler.dart' show SchedulerBinding, SchedulerPhase;

import '../theme/horon_theme.dart';
import '../tokens/horon_tokens.g.dart';

/// 오버레이 패널이 트리거의 어느 쪽에 붙을지입니다.
enum HoronOverlaySide {
  /// 트리거 위.
  top,

  /// 트리거 아래.
  bottom,

  /// 트리거 왼쪽.
  left,

  /// 트리거 오른쪽.
  right,
}

/// 트리거와 패널을 어느 축으로 맞출지입니다.
enum HoronOverlayAlign {
  /// 시작 변에 맞춥니다. 세로 배치에서는 왼쪽, 가로 배치에서는 위입니다.
  start,

  /// 가운데를 맞춥니다.
  center,

  /// 끝 변에 맞춥니다. 세로 배치에서는 오른쪽, 가로 배치에서는 아래입니다.
  end,
}

/// 오버레이 패널의 배치 요청입니다.
///
/// [side]는 선호일 뿐입니다. 화면에 자리가 없으면 [placeHoronOverlay]가 반대쪽으로
/// 뒤집고, 그래도 넘치면 화면 안으로 밀어 넣습니다.
@immutable
class HoronOverlayPosition {
  /// 배치 요청을 만듭니다.
  const HoronOverlayPosition({
    this.side = HoronOverlaySide.bottom,
    this.align = HoronOverlayAlign.start,
    this.offset = Offset.zero,
  });

  /// 선호하는 방향입니다.
  final HoronOverlaySide side;

  /// 트리거와 맞출 축입니다.
  final HoronOverlayAlign align;

  /// 기준점을 맞춘 뒤 더 미는 거리입니다.
  final Offset offset;

  /// 트리거와 패널 사이의 기본 간격입니다.
  static const double gap = HoronSpace.s1;

  /// 화면 가장자리에서 최소한 띄울 거리입니다.
  static const double screenMargin = HoronSpace.s2;
}

/// 한 번의 배치 계산 결과입니다.
///
/// [targetAnchor]는 트리거 쪽 기준점, [followerAnchor]는 패널 쪽 기준점입니다.
/// 둘을 맞추고 [offset]을 더하면 패널이 놓일 자리가 됩니다.
@immutable
class HoronOverlayPlacement {
  /// 계산 결과를 담습니다.
  const HoronOverlayPlacement({
    required this.side,
    required this.targetAnchor,
    required this.followerAnchor,
    required this.offset,
    required this.maxWidth,
    required this.maxHeight,
  });

  /// 실제로 고른 방향입니다. 뒤집혔으면 요청과 다를 수 있습니다.
  final HoronOverlaySide side;

  /// 트리거 쪽 기준점입니다.
  final Alignment targetAnchor;

  /// 패널 쪽 기준점입니다.
  final Alignment followerAnchor;

  /// 기준점을 맞춘 뒤 더 미는 거리입니다.
  final Offset offset;

  /// 패널이 쓸 수 있는 최대 폭입니다.
  final double maxWidth;

  /// 패널이 쓸 수 있는 최대 높이입니다.
  final double maxHeight;
}

/// 트리거 사각형과 화면 크기를 받아 패널 배치를 계산합니다.
///
/// 세 단계로 정합니다.
///
/// 1. 선호 방향에 자리가 있는지 봅니다.
/// 2. 없으면 반대 방향에 자리가 있는지 보고, 있으면 뒤집습니다.
/// 3. 어느 쪽도 넉넉하지 않으면 자리가 더 많은 쪽을 고르고, 패널 크기를 그 자리에
///    맞춰 줄입니다. 위치는 화면 안으로 밀어 넣습니다.
///
/// 화면 밖으로 나가는 경우를 계산하지 않고 넘기지 않는 것이 이 함수의 계약입니다.
HoronOverlayPlacement placeHoronOverlay({
  required Rect anchor,
  required Size screen,
  required HoronOverlayPosition position,
  EdgeInsets safeArea = EdgeInsets.zero,
  Size? panelSize,
}) {
  final double minLeft = HoronOverlayPosition.screenMargin + safeArea.left;
  final double maxRight = screen.width - HoronOverlayPosition.screenMargin - safeArea.right;
  final double minTop = HoronOverlayPosition.screenMargin + safeArea.top;
  final double maxBottom = screen.height - HoronOverlayPosition.screenMargin - safeArea.bottom;

  final bool horizontal = position.side == HoronOverlaySide.left || position.side == HoronOverlaySide.right;

  // 선호 방향과 반대 방향에 쓸 수 있는 길이입니다.
  final double preferredSpace = horizontal
      ? (position.side == HoronOverlaySide.right ? maxRight - anchor.right : anchor.left - minLeft)
      : (position.side == HoronOverlaySide.bottom ? maxBottom - anchor.bottom : anchor.top - minTop);
  final double oppositeSpace = horizontal
      ? (position.side == HoronOverlaySide.right ? anchor.left - minLeft : maxRight - anchor.right)
      : (position.side == HoronOverlaySide.bottom ? anchor.top - minTop : maxBottom - anchor.bottom);

  // 패널이 실제로 필요한 길이입니다. 모르면 0으로 두고 자리만 봅니다.
  final double needed = horizontal ? (panelSize?.width ?? 0) : (panelSize?.height ?? 0);
  final double usable = needed + HoronOverlayPosition.gap;

  final bool flip = preferredSpace < usable && oppositeSpace > preferredSpace;
  final HoronOverlaySide side = flip ? _opposite(position.side) : position.side;
  final double available = math.max(flip ? oppositeSpace : preferredSpace, 0);

  final Alignment targetAnchor;
  final Alignment followerAnchor;
  final Offset offset;

  switch (side) {
    case HoronOverlaySide.bottom:
    case HoronOverlaySide.top:
      targetAnchor = side == HoronOverlaySide.bottom ? Alignment.bottomLeft : Alignment.topLeft;
      followerAnchor = side == HoronOverlaySide.bottom ? Alignment.topLeft : Alignment.bottomLeft;
      final double dy = side == HoronOverlaySide.bottom ? HoronOverlayPosition.gap : -HoronOverlayPosition.gap;
      final double dx = _horizontalShift(
        anchor: anchor,
        align: position.align,
        panelWidth: panelSize?.width,
        minLeft: minLeft,
        maxRight: maxRight,
      );
      offset = Offset(dx, dy) + position.offset;
    case HoronOverlaySide.right:
    case HoronOverlaySide.left:
      targetAnchor = side == HoronOverlaySide.right ? Alignment.topRight : Alignment.topLeft;
      followerAnchor = side == HoronOverlaySide.right ? Alignment.topLeft : Alignment.topRight;
      final double dx = side == HoronOverlaySide.right ? HoronOverlayPosition.gap : -HoronOverlayPosition.gap;
      final double dy = _verticalShift(
        anchor: anchor,
        align: position.align,
        panelHeight: panelSize?.height,
        minTop: minTop,
        maxBottom: maxBottom,
      );
      offset = Offset(dx, dy) + position.offset;
  }

  final double maxWidth = horizontal
      ? math.max(available - HoronOverlayPosition.gap, 0)
      : math.max(maxRight - minLeft, 0);
  final double maxHeight = horizontal
      ? math.max(maxBottom - minTop, 0)
      : math.max(available - HoronOverlayPosition.gap, 0);

  return HoronOverlayPlacement(
    side: side,
    targetAnchor: targetAnchor,
    followerAnchor: followerAnchor,
    offset: offset,
    maxWidth: maxWidth,
    maxHeight: maxHeight,
  );
}

HoronOverlaySide _opposite(HoronOverlaySide side) => switch (side) {
  HoronOverlaySide.top => HoronOverlaySide.bottom,
  HoronOverlaySide.bottom => HoronOverlaySide.top,
  HoronOverlaySide.left => HoronOverlaySide.right,
  HoronOverlaySide.right => HoronOverlaySide.left,
};

/// 세로 배치에서 가로 위치를 화면 안으로 밀어 넣는 거리입니다.
///
/// 패널이 화면보다 넓으면 밀어 넣을 자리가 없습니다. 그때는 화면 왼쪽 여백에
/// 붙이고, 넘치는 폭은 [HoronOverlayPlacement.maxWidth]가 줄입니다. 2026-10-22에
/// 이 경우를 계산하지 않아 패널이 화면 밖으로 90px 나가는 것을 테스트가 잡았습니다.
double _horizontalShift({
  required Rect anchor,
  required HoronOverlayAlign align,
  required double? panelWidth,
  required double minLeft,
  required double maxRight,
}) {
  if (panelWidth == null) return 0;
  final double usableWidth = math.max(maxRight - minLeft, 0);
  if (panelWidth >= usableWidth) return minLeft - anchor.left;
  final double desiredLeft = switch (align) {
    HoronOverlayAlign.start => anchor.left,
    HoronOverlayAlign.center => anchor.center.dx - panelWidth / 2,
    HoronOverlayAlign.end => anchor.right - panelWidth,
  };
  final double clamped = desiredLeft.clamp(minLeft, maxRight - panelWidth);
  return clamped - anchor.left;
}

/// 가로 배치에서 세로 위치를 화면 안으로 밀어 넣는 거리입니다.
double _verticalShift({
  required Rect anchor,
  required HoronOverlayAlign align,
  required double? panelHeight,
  required double minTop,
  required double maxBottom,
}) {
  if (panelHeight == null) return 0;
  final double usableHeight = math.max(maxBottom - minTop, 0);
  if (panelHeight >= usableHeight) return minTop - anchor.top;
  final double desiredTop = switch (align) {
    HoronOverlayAlign.start => anchor.top,
    HoronOverlayAlign.center => anchor.center.dy - panelHeight / 2,
    HoronOverlayAlign.end => anchor.bottom - panelHeight,
  };
  final double clamped = desiredTop.clamp(minTop, maxBottom - panelHeight);
  return clamped - anchor.top;
}

/// 오버레이 패널의 표면입니다.
///
/// 유리 표면 + 그림자 + 모서리 자르기를 한 자리에 묶습니다. 배경 흐림이 패널
/// 사각형 밖으로 번지지 않게 [ClipRRect]로 자릅니다. 2026-10-22에 select 레인이
/// 같은 결함을 렌더에서 찾았습니다.
class HoronOverlayPanel extends StatelessWidget {
  /// 패널을 만듭니다.
  const HoronOverlayPanel({
    super.key,
    required this.child,
    this.maxWidth,
    this.maxHeight,
    this.padding = const EdgeInsets.all(HoronSpace.s2),
  });

  /// 패널 내용입니다.
  final Widget child;

  /// 패널이 넘지 않을 최대 폭입니다.
  final double? maxWidth;

  /// 패널이 넘지 않을 최대 높이입니다.
  final double? maxHeight;

  /// 내용 주변 여백입니다.
  final EdgeInsets padding;

  @override
  Widget build(BuildContext context) {
    final HoronThemeData theme = HoronTheme.of(context);
    final BorderRadius radius = BorderRadius.circular(HoronRadiusRole.panel);

    return ConstrainedBox(
      constraints: BoxConstraints(maxWidth: maxWidth ?? double.infinity, maxHeight: maxHeight ?? double.infinity),
      child: DecoratedBox(
        decoration: BoxDecoration(
          color: theme.glassFillStrong,
          borderRadius: radius,
          border: Border.all(color: theme.glassBorder),
          boxShadow: HoronShadow.lg,
        ),
        child: ClipRRect(
          borderRadius: radius,
          child: Padding(padding: padding, child: child),
        ),
      ),
    );
  }
}

/// [HoronOverlay]가 만드는 오버레이의 컨트롤러입니다.
///
/// 트리거 쪽이 [show]와 [hide]를 부르고, [HoronOverlay]가 그 상태를 포털에
/// 반영합니다.
class HoronOverlayController extends ChangeNotifier {
  bool _isOpen = false;

  /// 지금 열려 있는지입니다.
  bool get isOpen => _isOpen;

  /// 엽니다.
  void show() {
    if (_isOpen) return;
    _isOpen = true;
    notifyListeners();
  }

  /// 닫습니다.
  void hide() {
    if (!_isOpen) return;
    _isOpen = false;
    notifyListeners();
  }

  /// 열려 있으면 닫고, 닫혀 있으면 엽니다.
  void toggle() => _isOpen ? hide() : show();
}

/// 트리거에 붙는 오버레이 하나를 만듭니다.
///
/// `OverlayPortal`과 `CompositedTransformTarget/Follower`로 배치합니다. 패널은
/// [HoronOverlayPosition]을 선호로 삼되 화면 밖으로 나가면 뒤집히고 밀려
/// 들어옵니다([placeHoronOverlay]).
class HoronOverlay extends StatefulWidget {
  /// 오버레이를 만듭니다.
  const HoronOverlay({
    super.key,
    required this.controller,
    required this.position,
    required this.trigger,
    required this.panelBuilder,
  });

  /// 열고 닫는 컨트롤러입니다.
  final HoronOverlayController controller;

  /// 배치 요청입니다.
  final HoronOverlayPosition position;

  /// 기준이 되는 트리거 위젯입니다.
  final Widget trigger;

  /// 패널을 만드는 함수입니다. 계산된 배치를 받습니다.
  final Widget Function(BuildContext context, HoronOverlayPlacement placement) panelBuilder;

  @override
  State<HoronOverlay> createState() => _HoronOverlayState();
}

class _HoronOverlayState extends State<HoronOverlay> {
  final LayerLink _link = LayerLink();
  final GlobalKey _triggerKey = GlobalKey();
  final OverlayPortalController _portal = OverlayPortalController();

  @override
  void initState() {
    super.initState();
    widget.controller.addListener(_syncPortal);
    // 첫 프레임에는 포털을 만들 수 없으므로 프레임 뒤에 맞춥니다.
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (mounted) _syncPortal();
    });
  }

  @override
  void didUpdateWidget(HoronOverlay oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.controller != widget.controller) {
      oldWidget.controller.removeListener(_syncPortal);
      widget.controller.addListener(_syncPortal);
    }
  }

  @override
  void dispose() {
    widget.controller.removeListener(_syncPortal);
    super.dispose();
  }

  /// 컨트롤러 상태를 포털에 반영합니다.
  ///
  /// `OverlayPortalController.show/hide`는 빌드·레이아웃 도중에 부를 수 없습니다.
  /// 그래서 프레임 도중이면 다음 프레임으로 미루고, 아니면 바로 반영합니다.
  /// 무조건 미루면 열고 닫는 데 프레임이 하나 더 걸립니다.
  void _syncPortal() {
    if (SchedulerBinding.instance.schedulerPhase == SchedulerPhase.persistentCallbacks) {
      WidgetsBinding.instance.addPostFrameCallback((_) {
        if (!mounted) return;
        _applyPortalState();
      });
      return;
    }
    _applyPortalState();
  }

  void _applyPortalState() {
    if (widget.controller.isOpen) {
      _portal.show();
    } else {
      _portal.hide();
    }
    setState(() {});
  }

  @override
  Widget build(BuildContext context) {
    return OverlayPortal(
      controller: _portal,
      overlayChildBuilder: (BuildContext overlayContext) {
        final Rect? anchor = _anchorRect();
        if (anchor == null) return const SizedBox.shrink();
        final MediaQueryData media = MediaQuery.of(overlayContext);
        // 패널 크기를 모르면 "이 자리에 들어가는가"를 판단할 수 없으므로 뒤집힘이
        // 동작하지 않습니다. 그래서 측정과 배치를 한 위젯 안에서 되풀이합니다.
        return _OverlayBody(
          link: _link,
          anchor: anchor,
          screen: media.size,
          safeArea: media.padding,
          position: widget.position,
          panelBuilder: widget.panelBuilder,
        );
      },
      child: CompositedTransformTarget(
        link: _link,
        child: KeyedSubtree(key: _triggerKey, child: widget.trigger),
      ),
    );
  }

  Rect? _anchorRect() {
    final RenderObject? box = _triggerKey.currentContext?.findRenderObject();
    if (box is! RenderBox || !box.hasSize) return null;
    final Offset topLeft = box.localToGlobal(Offset.zero);
    return topLeft & box.size;
  }
}

/// 오버레이 패널 하나를 재고, 그 크기로 배치를 다시 계산해 그립니다.
///
/// 크기를 재는 일과 배치하는 일을 같은 State가 들고 있어야 합니다. 바깥 상태의
/// setState는 `OverlayPortal`의 자식까지 전파되지 않으므로, 바깥에서 재면 측정값이
/// 배치에 반영되지 않습니다(2026-10-22에 테스트가 잡았습니다).
class _OverlayBody extends StatefulWidget {
  const _OverlayBody({
    required this.link,
    required this.anchor,
    required this.screen,
    required this.safeArea,
    required this.position,
    required this.panelBuilder,
  });

  final LayerLink link;
  final Rect anchor;
  final Size screen;
  final EdgeInsets safeArea;
  final HoronOverlayPosition position;
  final Widget Function(BuildContext context, HoronOverlayPlacement placement) panelBuilder;

  @override
  State<_OverlayBody> createState() => _OverlayBodyState();
}

class _OverlayBodyState extends State<_OverlayBody> {
  Size? _panelSize;

  void _onMeasured(Size size) {
    if (_panelSize == size) return;
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (!mounted) return;
      setState(() => _panelSize = size);
    });
  }

  @override
  Widget build(BuildContext context) {
    final HoronOverlayPlacement placement = placeHoronOverlay(
      anchor: widget.anchor,
      screen: widget.screen,
      position: widget.position,
      safeArea: widget.safeArea,
      panelSize: _panelSize,
    );

    return CompositedTransformFollower(
      link: widget.link,
      showWhenUnlinked: false,
      targetAnchor: placement.targetAnchor,
      followerAnchor: placement.followerAnchor,
      offset: placement.offset,
      child: Align(
        alignment: Alignment.topLeft,
        child: _FadeIn(
          child: _MeasureSize(onMeasured: _onMeasured, child: widget.panelBuilder(context, placement)),
        ),
      ),
    );
  }
}

/// 자식의 실제 크기를 재서 알려 줍니다.
///
/// 뒤집힘은 "패널이 이 자리에 들어가는가"의 문제라 패널 크기를 모르면 판단할 수
/// 없습니다. 크기가 바뀔 때만 알립니다.
class _MeasureSize extends SingleChildRenderObjectWidget {
  const _MeasureSize({required this.onMeasured, required Widget super.child});

  final ValueChanged<Size> onMeasured;

  @override
  RenderObject createRenderObject(BuildContext context) => _RenderMeasureSize(onMeasured);

  @override
  void updateRenderObject(BuildContext context, _RenderMeasureSize renderObject) {
    renderObject.onMeasured = onMeasured;
  }
}

class _RenderMeasureSize extends RenderProxyBox {
  _RenderMeasureSize(this.onMeasured);

  ValueChanged<Size> onMeasured;
  Size? _reported;

  @override
  void performLayout() {
    super.performLayout();
    final Size next = size;
    if (_reported == next) return;
    _reported = next;
    onMeasured(next);
  }
}

/// 등장 애니메이션입니다. `HoronDuration.fast`로 짧게 나타납니다.
class _FadeIn extends StatefulWidget {
  const _FadeIn({required this.child});

  final Widget child;

  @override
  State<_FadeIn> createState() => _FadeInState();
}

class _FadeInState extends State<_FadeIn> with SingleTickerProviderStateMixin {
  late final AnimationController _controller = AnimationController(
    vsync: this,
    duration: const Duration(milliseconds: HoronDuration.fast),
  )..forward();

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return FadeTransition(
      opacity: CurvedAnimation(parent: _controller, curve: HoronEasing.out),
      child: widget.child,
    );
  }
}
