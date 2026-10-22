import 'package:flutter/material.dart';
import 'package:flutter/rendering.dart';

import '../theme/horon_theme.dart';
import '../tokens/horon_tokens.g.dart';
import 'button.dart';

/// `message-scroller.tsx`의 `gap-8`입니다. 메시지 사이의 간격입니다.
const double _scrollerContentGap = HoronSpace.s8;

/// `message-scroller.tsx`의 `bottom-4`·`top-4`입니다. 이동 버튼이 가장자리에서 뜨는 거리입니다.
const double _scrollerButtonInset = HoronSpace.s4;

/// 버튼 아이콘(`ArrowDownIcon`)의 크기입니다. React `[&_svg]`의 기본값 16입니다.
const double _scrollerChevronSize = HoronSpace.s4;

/// 화살표 선 두께의 아이콘 상자 대비 비율입니다. lucide 기본값은 2/24입니다.
const double _scrollerChevronStrokeRatio = 2 / 24;

/// "가장자리에 붙어 있다"고 볼 거리입니다.
///
/// 새 메시지가 왔을 때 따라 내려갈지, 이동 버튼을 보일지 정하는 경계입니다. 1px보다
/// 조금 넉넉하게 두어 반올림 오차로 붙어 있는 상태를 놓치지 않게 합니다.
const double _scrollerEdgeThreshold = 1.0;

/// 이동 버튼이 나타나고 사라지는 시간입니다. React의 `transition-opacity`에 대응합니다.
const Duration _scrollerFadeDuration = Duration(milliseconds: HoronDuration.fast);

/// 스크롤 방향입니다.
///
/// React `message-scroller.tsx`의 `direction` prop은 cva 변형 그룹이 아니므로 공개 enum을
/// 두지 않습니다. 호출자는 [HoronMessageScrollerButton.toEnd]와
/// [HoronMessageScrollerButton.toStart]로 고릅니다.
enum _HoronScrollerDirection { start, end }

/// 스크롤 앵커와 이동 버튼을 가진 메시지 스크롤 영역입니다.
///
/// `message-scroller.tsx`를 옮긴 것입니다. React의 다섯 조각(`MessageScroller`,
/// `MessageScrollerViewport`, `MessageScrollerContent`, `MessageScrollerItem`,
/// `MessageScrollerButton`)이 모두 있습니다.
///
/// 이 위젯은 `reverse: true`인 [ListView] 하나가 아닙니다. 세 가지가 계약입니다.
///
/// 1. **앵커** — [HoronMessageScrollerItem.scrollAnchor]를 켠 항목은 위쪽에 옛 메시지가
///    덧붙어도 화면의 같은 자리에 남습니다. 내용 크기가 바뀐 뒤 앵커가 밀린 만큼 스크롤
///    오프셋을 되돌립니다. React의 `data-scroll-anchor`와 CSS scroll anchoring이 하던 일을
///    Flutter에서 같은 결과로 냅니다. 앵커는 스크롤 영역마다 하나입니다.
/// 2. **이동 버튼** — [HoronMessageScrollerButton]을 넣으면 지금 위치에 따라 나타납니다.
///    바닥에서 떨어져 있으면 아래로 가는 버튼이, 위에서 떨어져 있으면 위로 가는 버튼이
///    보입니다. [jumpButtons]가 참이면 두 버튼을 이 위젯이 직접 넣습니다.
/// 3. **자동 스크롤** — [autoScroll]이 참이면 바닥에 붙어 있던 사용자만 새 내용을 따라
///    내려갑니다. 사용자가 위로 올려 둔 상태면 오프셋이 그대로이고, 대신 아래로 가는
///    버튼이 나타납니다. 첫 배치에서는 가장 최근 메시지가 보이도록 바닥에 섭니다.
///
/// ```dart
/// HoronMessageScroller(
///   children: <Widget>[
///     HoronMessageScrollerViewport(
///       children: <Widget>[HoronMessageScrollerContent(children: messages)],
///     ),
///   ],
/// )
/// ```
class HoronMessageScroller extends StatefulWidget {
  /// 스크롤 영역 하나를 만듭니다.
  const HoronMessageScroller({
    super.key,
    required this.children,
    this.controller,
    this.autoScroll = true,
    this.jumpButtons = true,
    this.semanticLabel,
  });

  /// 루트 안에 겹쳐 놓을 조각입니다. 뷰포트를 넣습니다.
  final List<Widget> children;

  /// 스크롤 위치를 읽고 옮기는 컨트롤러입니다. 없으면 이 위젯이 소유합니다.
  final ScrollController? controller;

  /// 바닥에 붙어 있을 때 새 내용을 따라 내려갈지 여부입니다.
  final bool autoScroll;

  /// 두 이동 버튼을 이 위젯이 넣을지 여부입니다.
  ///
  /// 끄면 호출자가 [HoronMessageScrollerButton]을 직접 넣습니다. 그때도 버튼은 이
  /// 위젯의 자식이어야 스크롤 상태를 읽을 수 있습니다.
  final bool jumpButtons;

  /// 보조 기술이 읽을 영역 이름입니다.
  final String? semanticLabel;

  @override
  State<HoronMessageScroller> createState() => _HoronMessageScrollerState();
}

class _HoronMessageScrollerState extends State<HoronMessageScroller> {
  ScrollController? _ownedController;

  /// 앵커 항목이 붙는 키입니다.
  final GlobalKey _anchorKey = GlobalKey(debugLabel: 'HoronMessageScrollerAnchor');

  /// 직전에 잰 앵커의 내용 기준 오프셋입니다.
  double? _lastAnchorOffset;

  /// 사용자가 바닥에 붙어 있는지 여부입니다. 스크롤이 움직일 때마다 갱신합니다.
  bool _stickToEnd = true;

  /// 아직 첫 배치를 하지 않았는지 여부입니다.
  bool _awaitingFirstLayout = true;

  /// 바닥에서 떨어져 있는지 여부입니다. 아래로 가는 버튼이 이 값을 봅니다.
  bool _detachedFromEnd = false;

  /// 위에서 떨어져 있는지 여부입니다. 위로 가는 버튼이 이 값을 봅니다.
  bool _detachedFromStart = false;

  ScrollController get _controller => widget.controller ?? (_ownedController ??= ScrollController());

  @override
  void initState() {
    super.initState();
    _controller.addListener(_handleScroll);
  }

  @override
  void didUpdateWidget(covariant HoronMessageScroller oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (oldWidget.controller != widget.controller) {
      (oldWidget.controller ?? _ownedController)?.removeListener(_handleScroll);
      _controller.addListener(_handleScroll);
    }
  }

  @override
  void dispose() {
    (widget.controller ?? _ownedController)?.removeListener(_handleScroll);
    _ownedController?.dispose();
    super.dispose();
  }

  /// 사용자가 스크롤을 움직였을 때 바닥 고정 여부와 버튼 표시를 다시 정합니다.
  void _handleScroll() {
    if (!_controller.hasClients) return;
    _syncEdges(_controller.position);
  }

  /// 내용이나 뷰포트의 크기가 바뀐 뒤 앵커를 붙잡고 필요하면 따라 내려갑니다.
  ///
  /// [ScrollMetricsNotification]은 프레임이 끝난 뒤 마이크로태스크로 옵니다. 그래서 여기서
  /// [ScrollPosition.jumpTo]를 불러도 레이아웃 도중이 아닙니다.
  bool _handleMetricsChange(ScrollMetricsNotification notification) {
    if (!mounted || !_controller.hasClients) return false;
    final ScrollPosition position = _controller.position;
    final double? anchorOffset = _anchorOffsetOf();

    if (_awaitingFirstLayout) {
      _awaitingFirstLayout = false;
      _lastAnchorOffset = anchorOffset;
      // 첫 배치: 가장 최근 메시지가 보이게 바닥에 섭니다. 다만 호출자가 컨트롤러의
      // 초기 오프셋을 정했거나 이 프레임 안에서 이미 위치를 옮겼다면 그 뜻을 존중합니다.
      final bool callerMoved =
          _controller.initialScrollOffset != 0 || position.pixels > position.minScrollExtent + _scrollerEdgeThreshold;
      if (widget.autoScroll && !callerMoved && position.extentAfter > _scrollerEdgeThreshold) {
        position.jumpTo(position.maxScrollExtent);
      }
      _syncEdges(position);
      return false;
    }

    final double? previousAnchor = _lastAnchorOffset;
    _lastAnchorOffset = anchorOffset;

    // 사용자가 위로 올려 둔 상태에서 위쪽에 내용이 붙으면, 앵커가 밀린 만큼 되돌려
    // 앵커를 화면의 같은 자리에 둡니다.
    if (!_stickToEnd && anchorOffset != null && previousAnchor != null && anchorOffset != previousAnchor) {
      final double delta = anchorOffset - previousAnchor;
      position.jumpTo((position.pixels + delta).clamp(position.minScrollExtent, position.maxScrollExtent));
      _syncEdges(position);
      return false;
    }

    if (widget.autoScroll && _stickToEnd && position.extentAfter > _scrollerEdgeThreshold) {
      // 바닥에 붙어 있던 사용자만 따라 내려갑니다.
      position.jumpTo(position.maxScrollExtent);
    }
    _syncEdges(position);
    return false;
  }

  /// 바닥 고정 여부와 버튼 표시 여부를 지금 위치에 맞춥니다.
  void _syncEdges(ScrollPosition position) {
    final bool detachedFromEnd = position.extentAfter > _scrollerEdgeThreshold;
    final bool detachedFromStart = position.extentBefore > _scrollerEdgeThreshold;
    _stickToEnd = !detachedFromEnd;
    if (detachedFromEnd != _detachedFromEnd || detachedFromStart != _detachedFromStart) {
      setState(() {
        _detachedFromEnd = detachedFromEnd;
        _detachedFromStart = detachedFromStart;
      });
    }
  }

  /// 앵커 항목의 내용 기준 오프셋입니다. 앵커가 없거나 뷰포트 밖이면 `null`입니다.
  double? _anchorOffsetOf() {
    final BuildContext? anchorContext = _anchorKey.currentContext;
    if (anchorContext == null) return null;
    final RenderObject? anchor = anchorContext.findRenderObject();
    if (anchor == null || !anchor.attached) return null;
    final RenderAbstractViewport? viewport = RenderAbstractViewport.maybeOf(anchor);
    if (viewport == null) return null;
    return viewport.getOffsetToReveal(anchor, 0).offset;
  }

  @override
  Widget build(BuildContext context) {
    return _HoronMessageScrollerScope(
      controller: _controller,
      anchorKey: _anchorKey,
      detachedFromEnd: _detachedFromEnd,
      detachedFromStart: _detachedFromStart,
      child: NotificationListener<ScrollMetricsNotification>(
        onNotification: _handleMetricsChange,
        child: Semantics(
          container: true,
          label: widget.semanticLabel,
          child: ClipRect(
            child: Stack(
              children: <Widget>[
                ...widget.children,
                if (widget.jumpButtons) ...<Widget>[
                  const HoronMessageScrollerButton.toStart(),
                  const HoronMessageScrollerButton.toEnd(),
                ],
              ],
            ),
          ),
        ),
      ),
    );
  }
}

/// 뷰포트와 버튼이 같은 컨트롤러·앵커 키·표시 상태를 보게 하는 스코프입니다.
class _HoronMessageScrollerScope extends InheritedWidget {
  const _HoronMessageScrollerScope({
    required this.controller,
    required this.anchorKey,
    required this.detachedFromEnd,
    required this.detachedFromStart,
    required super.child,
  });

  final ScrollController controller;
  final GlobalKey anchorKey;
  final bool detachedFromEnd;
  final bool detachedFromStart;

  static _HoronMessageScrollerScope? maybeOf(BuildContext context) =>
      context.dependOnInheritedWidgetOfExactType<_HoronMessageScrollerScope>();

  @override
  bool updateShouldNotify(_HoronMessageScrollerScope oldWidget) =>
      controller != oldWidget.controller ||
      anchorKey != oldWidget.anchorKey ||
      detachedFromEnd != oldWidget.detachedFromEnd ||
      detachedFromStart != oldWidget.detachedFromStart;
}

/// `message-scroller.tsx`의 `MessageScrollerViewport`입니다.
///
/// React는 `size-full min-h-0 min-w-0 overflow-y-auto overscroll-contain
/// contain-content`입니다. Flutter는 [ListView]로 세로 스크롤만 두고, 스크롤이 끝에서
/// 튕겨 넘어가지 않게 [ClampingScrollPhysics]를 씁니다(`overscroll-contain`).
class HoronMessageScrollerViewport extends StatelessWidget {
  /// 뷰포트 하나를 만듭니다.
  const HoronMessageScrollerViewport({super.key, required this.children, this.padding = EdgeInsets.zero});

  /// 뷰포트 안에 넣을 조각입니다. 보통 [HoronMessageScrollerContent] 하나입니다.
  final List<Widget> children;

  /// 내용 주위 여백입니다. React는 정하지 않으므로 기본값은 0입니다.
  final EdgeInsetsGeometry padding;

  @override
  Widget build(BuildContext context) {
    final _HoronMessageScrollerScope? scope = _HoronMessageScrollerScope.maybeOf(context);
    return ListView(
      controller: scope?.controller,
      padding: padding,
      physics: const ClampingScrollPhysics(),
      children: children,
    );
  }
}

/// `message-scroller.tsx`의 `MessageScrollerContent`입니다.
///
/// React는 `flex h-max min-h-full flex-col gap-8`입니다. 메시지 사이 간격이 32입니다.
class HoronMessageScrollerContent extends StatelessWidget {
  /// 내용 하나를 만듭니다.
  const HoronMessageScrollerContent({super.key, required this.children});

  /// 세로로 쌓을 메시지입니다.
  final List<Widget> children;

  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisSize: MainAxisSize.min,
      crossAxisAlignment: CrossAxisAlignment.stretch,
      spacing: _scrollerContentGap,
      children: children,
    );
  }
}

/// `message-scroller.tsx`의 `MessageScrollerItem`입니다.
///
/// React는 `min-w-0 shrink-0`에 `[contain-intrinsic-size:auto_10rem]`과
/// `[content-visibility:auto]`를 겁니다. Flutter에는 같은 지연 배치가 없으므로 크기 힌트는
/// 쓰지 않고, 항목이 차지하는 폭만 내용에 맡깁니다.
///
/// [scrollAnchor]를 켜면 이 항목이 앵커가 됩니다. 위쪽에 옛 메시지가 덧붙어도 이 항목은
/// 화면에서 제자리에 있습니다. 앵커는 스크롤 영역마다 하나만 켭니다.
class HoronMessageScrollerItem extends StatelessWidget {
  /// 항목 하나를 만듭니다.
  const HoronMessageScrollerItem({super.key, required this.child, this.scrollAnchor = false});

  /// 항목 내용입니다.
  final Widget child;

  /// 참이면 이 항목이 스크롤 앵커입니다.
  final bool scrollAnchor;

  @override
  Widget build(BuildContext context) {
    if (!scrollAnchor) return child;
    final _HoronMessageScrollerScope? scope = _HoronMessageScrollerScope.maybeOf(context);
    if (scope == null) return child;
    return KeyedSubtree(key: scope.anchorKey, child: child);
  }
}

/// `message-scroller.tsx`의 `MessageScrollerButton`입니다.
///
/// React는 루트 가운데에 붙는 원형 버튼이고, `direction="end"`면 아래(`bottom-4`),
/// `direction="start"`면 위(`top-4`)에 놓이며 위쪽 화살표는 `rotate-180`으로 뒤집습니다.
/// `variant`와 `size`의 기본값은 Button과 같습니다(`secondary`, `icon-sm`).
///
/// 표시 여부는 스크롤 위치가 정합니다. 바닥에서 떨어져 있으면 [toEnd] 버튼이, 위에서
/// 떨어져 있으면 [toStart] 버튼이 나타납니다. 버튼은 [HoronMessageScroller]의 자식으로
/// 넣어야 합니다.
class HoronMessageScrollerButton extends StatelessWidget {
  /// 아래(끝)로 가는 버튼을 만듭니다.
  const HoronMessageScrollerButton.toEnd({
    super.key,
    this.variant = HoronButtonVariant.secondary,
    this.size = HoronButtonSize.iconSm,
    this.onPressed,
    this.semanticLabel,
  }) : _direction = _HoronScrollerDirection.end;

  /// 위(시작)로 가는 버튼을 만듭니다.
  const HoronMessageScrollerButton.toStart({
    super.key,
    this.variant = HoronButtonVariant.secondary,
    this.size = HoronButtonSize.iconSm,
    this.onPressed,
    this.semanticLabel,
  }) : _direction = _HoronScrollerDirection.start;

  /// 버튼 변형입니다. React 기본값은 `secondary`입니다.
  final HoronButtonVariant variant;

  /// 버튼 크기입니다. React 기본값은 `icon-sm`입니다.
  final HoronButtonSize size;

  /// 누르면 부르는 콜백입니다. 없으면 이 위젯이 스코프의 컨트롤러를 움직입니다.
  final VoidCallback? onPressed;

  /// 보조 기술이 읽을 이름입니다. 없으면 테마의 `strings.nextPage`·`previousPage`를
  /// 씁니다.
  final String? semanticLabel;

  final _HoronScrollerDirection _direction;

  /// 테스트가 아래로 가는 버튼을 찾는 키입니다.
  static const Key toEndKey = ValueKey<String>('horon-message-scroller-to-end');

  /// 테스트가 위로 가는 버튼을 찾는 키입니다.
  static const Key toStartKey = ValueKey<String>('horon-message-scroller-to-start');

  @override
  Widget build(BuildContext context) {
    final _HoronMessageScrollerScope? scope = _HoronMessageScrollerScope.maybeOf(context);
    final bool toEnd = _direction == _HoronScrollerDirection.end;
    final bool visible = scope == null ? true : (toEnd ? scope.detachedFromEnd : scope.detachedFromStart);
    final HoronThemeData horon = HoronTheme.of(context);

    return Positioned(
      left: 0,
      right: 0,
      top: toEnd ? null : _scrollerButtonInset,
      bottom: toEnd ? _scrollerButtonInset : null,
      child: Align(
        alignment: Alignment.center,
        child: AnimatedSwitcher(
          duration: _scrollerFadeDuration,
          child: visible
              ? HoronButton(
                  key: toEnd ? toEndKey : toStartKey,
                  variant: variant,
                  size: size,
                  onPressed: onPressed ?? () => _scrollToEdge(scope),
                  semanticLabel: semanticLabel ?? (toEnd ? horon.strings.nextPage : horon.strings.previousPage),
                  child: SizedBox.square(
                    dimension: _scrollerChevronSize,
                    child: CustomPaint(
                      painter: _HoronScrollerChevronPainter(
                        color: _foregroundFor(variant, Theme.of(context)),
                        up: !toEnd,
                      ),
                    ),
                  ),
                )
              : const SizedBox.shrink(),
        ),
      ),
    );
  }

  /// 버튼 변형의 전경 색입니다. 화살표가 버튼 글자와 같은 색이어야 합니다.
  Color _foregroundFor(HoronButtonVariant variant, ThemeData theme) {
    final ColorScheme scheme = theme.colorScheme;
    return switch (variant) {
      HoronButtonVariant.defaultValue => scheme.onPrimary,
      HoronButtonVariant.secondary => scheme.onSecondary,
      HoronButtonVariant.destructive => scheme.error,
      HoronButtonVariant.outline || HoronButtonVariant.ghost || HoronButtonVariant.link => scheme.onSurface,
    };
  }

  /// 스코프의 컨트롤러를 끝이나 시작으로 옮깁니다.
  void _scrollToEdge(_HoronMessageScrollerScope? scope) {
    if (scope == null || !scope.controller.hasClients) return;
    final ScrollPosition position = scope.controller.position;
    final double target = _direction == _HoronScrollerDirection.end
        ? position.maxScrollExtent
        : position.minScrollExtent;
    position.animateTo(target, duration: _scrollerFadeDuration, curve: HoronEasing.out);
  }
}

/// lucide `arrow-down`(`M12 5v14` + `m19 12-7 7-7-7`)을 그립니다.
///
/// 아이콘 폰트를 번들하지 않으므로 화살표를 직접 그립니다. [up]이 참이면 180도 뒤집은
/// 모양이 되어 위를 가리킵니다(React `direction="start"`의 `[&_svg]:rotate-180`).
class _HoronScrollerChevronPainter extends CustomPainter {
  const _HoronScrollerChevronPainter({required this.color, required this.up});

  final Color color;
  final bool up;

  @override
  void paint(Canvas canvas, Size size) {
    final Paint paint = Paint()
      ..color = color
      ..style = PaintingStyle.stroke
      ..strokeWidth = size.shortestSide * _scrollerChevronStrokeRatio
      ..strokeCap = StrokeCap.round
      ..strokeJoin = StrokeJoin.round;

    final double width = size.width;
    final double height = size.height;
    // `arrow-down`의 세 점을 24 단위에서 비율로 옮기고, 위 화살표는 세로로 뒤집습니다.
    final double startY = up ? 19 / 24 * height : 5 / 24 * height;
    final double tipY = up ? 5 / 24 * height : 19 / 24 * height;
    final double headY = 12 / 24 * height;

    canvas.drawLine(Offset(width / 2, startY), Offset(width / 2, tipY), paint);
    canvas.drawPath(
      Path()
        ..moveTo(5 / 24 * width, headY)
        ..lineTo(width / 2, tipY)
        ..lineTo(19 / 24 * width, headY),
      paint,
    );
  }

  @override
  bool shouldRepaint(_HoronScrollerChevronPainter oldDelegate) => color != oldDelegate.color || up != oldDelegate.up;
}
