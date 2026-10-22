import 'package:flutter/material.dart';

import '../theme/horon_theme.dart';
import '../tokens/horon_tokens.g.dart';
import 'button.dart';

/// 화살표와 슬라이드 사이 간격입니다.
///
/// `carousel.tsx`는 화살표를 `-left-12`/`-right-12`로 슬라이드 밖 48에 절대 배치합니다.
/// Flutter에는 그 자리를 밀어내는 절대 배치가 없으므로, 화살표를 슬라이드 옆에 두고
/// 이만큼 띄웁니다. 화면 밖으로 넘치지 않는 쪽을 골랐습니다.
const double _carouselGap = HoronSpace.s2;

/// 한 장 넘기는 애니메이션 시간입니다. React는 Embla의 기본 전환을 쓰므로 토큰의
/// `slower`(300ms)를 씁니다.
const Duration _carouselScrollDuration = Duration(milliseconds: HoronDuration.slower);

/// 인디케이터 점의 지름입니다. React에는 인디케이터가 없어 이 패키지가 정한 값입니다.
const double _carouselDotSize = HoronSpace.s1_5;

/// 인디케이터 점 사이 간격입니다.
const double _carouselDotGap = HoronSpace.s1_5;

/// 선택되지 않은 점의 불투명도입니다. React의 `bg-muted-foreground` 자리에 해당합니다.
const double _carouselDotInactiveAlpha = 0.3;

/// lucide 셰브론의 선 굵기입니다. 24 단위 상자에서 2입니다.
const double _carouselChevronStrokeRatio = 2 / 24;

/// 캐러셀이 놓이는 방향입니다.
///
/// React `carousel.tsx`의 `orientation` prop은 cva 변형 그룹이 아니므로 공개 enum을
/// 두지 않습니다. 호출자는 [HoronCarousel]과 [HoronCarousel.vertical]로 고릅니다.
enum _HoronCarouselOrientation { horizontal, vertical }

/// 셰브론이 향하는 쪽입니다.
enum _HoronChevronDirection { left, right, up, down }

/// 캐러셀 파트가 컨트롤러와 현재 위치를 읽는 범위입니다.
class _HoronCarouselScope extends InheritedWidget {
  const _HoronCarouselScope({
    required this.controller,
    required this.index,
    required this.count,
    required this.orientation,
    required this.onPageChanged,
    required this.scrollPrevious,
    required this.scrollNext,
    required super.child,
  });

  /// 슬라이드를 넘기는 컨트롤러입니다.
  final PageController controller;

  /// 지금 보이는 슬라이드 번호입니다.
  final int index;

  /// 슬라이드 수입니다.
  final int count;

  /// 방향입니다.
  final _HoronCarouselOrientation orientation;

  /// 페이지가 바뀔 때 [PageView]가 부르는 콜백입니다.
  final ValueChanged<int> onPageChanged;

  /// 앞 장으로 넘깁니다.
  final VoidCallback scrollPrevious;

  /// 다음 장으로 넘깁니다.
  final VoidCallback scrollNext;

  /// 앞 장이 있는지 여부입니다. 첫 장에서는 거짓입니다(루프 없음).
  bool get canScrollPrevious => index > 0;

  /// 다음 장이 있는지 여부입니다. 마지막 장에서는 거짓입니다(루프 없음).
  bool get canScrollNext => index < count - 1;

  static _HoronCarouselScope? maybeOf(BuildContext context) =>
      context.dependOnInheritedWidgetOfExactType<_HoronCarouselScope>();

  static _HoronCarouselScope of(BuildContext context) {
    final _HoronCarouselScope? scope = maybeOf(context);
    if (scope == null) {
      throw StateError(
        'Carousel parts must be used inside a HoronCarousel. Put the part in '
        'HoronCarousel.children.',
      );
    }
    return scope;
  }

  @override
  bool updateShouldNotify(_HoronCarouselScope oldWidget) =>
      index != oldWidget.index ||
      count != oldWidget.count ||
      orientation != oldWidget.orientation ||
      controller != oldWidget.controller;
}

/// 한 장씩 스냅해서 넘기는 슬라이드 상자입니다.
///
/// `carousel.tsx`를 옮긴 것입니다. React는 Embla로 트랙을 스크롤하고 `select` 이벤트로
/// 앞뒤 가능 여부를 갱신합니다. Flutter는 [PageView]가 같은 일을 합니다. 페이지가
/// 한 장 단위로 스냅하고, 첫 장에서는 이전 화살표가, 마지막 장에서는 다음 화살표가
/// 비활성입니다.
///
/// **자동 재생, 루프, 무한 스크롤은 없습니다.** React에도 없고 이 이식본에도 넣지
/// 않았습니다. 마지막 장에서 다음으로 넘기면 그대로 멈춥니다.
///
/// 파트는 React와 같은 조립 순서로 [children]에 넣습니다. [HoronCarouselContent]가
/// 슬라이드를 담고, [HoronCarouselPrevious]·[HoronCarouselNext]는 슬라이드 양옆으로,
/// 나머지(보통 [HoronCarouselDots])는 슬라이드 아래로 갑니다.
///
/// [extent]는 슬라이드 한 장의 높이입니다. [PageView]는 넘기는 축과 직각인 축의 길이를
/// 부모에게서 받아야 하므로(웹의 Embla는 내용이 정합니다) Flutter에서는 호출자가
/// 정합니다. 가로 방향은 폭이 부모를 채우고 높이가 [extent]이며, 세로 방향은 폭이
/// 부모를 채우고 높이가 [extent]입니다.
///
/// ```dart
/// HoronCarousel(
///   extent: 200,
///   children: <Widget>[
///     HoronCarouselContent(
///       children: <Widget>[
///         HoronCarouselItem(child: slideOne),
///         HoronCarouselItem(child: slideTwo),
///       ],
///     ),
///     const HoronCarouselPrevious(),
///     const HoronCarouselNext(),
///     const HoronCarouselDots(),
///   ],
/// )
/// ```
class HoronCarousel extends StatefulWidget {
  /// 가로 캐러셀을 만듭니다.
  const HoronCarousel({
    super.key,
    required this.children,
    required this.extent,
    this.initialPage = 0,
    this.onPageChanged,
    this.controller,
    this.semanticLabel,
  }) : _orientation = _HoronCarouselOrientation.horizontal;

  /// 세로 캐러셀을 만듭니다. [extent]가 슬라이드 높이입니다.
  const HoronCarousel.vertical({
    super.key,
    required this.children,
    required this.extent,
    this.initialPage = 0,
    this.onPageChanged,
    this.controller,
    this.semanticLabel,
  }) : _orientation = _HoronCarouselOrientation.vertical;

  /// 캐러셀을 이루는 파트들입니다.
  final List<Widget> children;

  /// 처음 보여 줄 슬라이드 번호입니다.
  final int initialPage;

  /// 페이지가 바뀔 때 부르는 콜백입니다.
  final ValueChanged<int>? onPageChanged;

  /// 페이지를 넘기는 컨트롤러입니다. 없으면 이 위젯이 소유하고 정리합니다.
  final PageController? controller;

  /// 보조 기술이 읽을 영역 이름입니다.
  final String? semanticLabel;

  /// 세로 방향에서 슬라이드가 차지할 높이입니다. 가로 방향에서는 쓰지 않습니다.
  final double extent;

  final _HoronCarouselOrientation _orientation;

  @override
  State<HoronCarousel> createState() => _HoronCarouselState();
}

class _HoronCarouselState extends State<HoronCarousel> {
  PageController? _ownedController;
  late int _index = widget.initialPage;

  PageController get _controller =>
      widget.controller ?? (_ownedController ??= PageController(initialPage: widget.initialPage));

  /// 슬라이드 영역입니다. 화살표 배치와 슬라이드 수를 여기서 읽습니다.
  HoronCarouselContent? get _content {
    for (final Widget child in widget.children) {
      if (child is HoronCarouselContent) return child;
    }
    return null;
  }

  int get _count => _content?.children.length ?? 0;

  bool get _isHorizontal => widget._orientation == _HoronCarouselOrientation.horizontal;

  @override
  void dispose() {
    _ownedController?.dispose();
    super.dispose();
  }

  void _handlePageChanged(int index) {
    if (index == _index) return;
    setState(() => _index = index);
    widget.onPageChanged?.call(index);
  }

  void _goTo(int page) {
    if (_count == 0) return;
    final int target = page.clamp(0, _count - 1);
    if (target == _index) return;
    _controller.animateToPage(target, duration: _carouselScrollDuration, curve: HoronEasing.outCubic);
  }

  @override
  Widget build(BuildContext context) {
    return _HoronCarouselScope(
      controller: _controller,
      index: _index,
      count: _count,
      orientation: widget._orientation,
      onPageChanged: _handlePageChanged,
      scrollPrevious: () => _goTo(_index - 1),
      scrollNext: () => _goTo(_index + 1),
      child: Semantics(container: true, label: widget.semanticLabel, child: _buildBody()),
    );
  }

  Widget _buildBody() {
    Widget? previous;
    Widget? next;
    final List<Widget> stacked = <Widget>[];
    for (final Widget child in widget.children) {
      if (child is HoronCarouselPrevious) {
        previous = child;
      } else if (child is HoronCarouselNext) {
        next = child;
      } else {
        stacked.add(child);
      }
    }

    final Widget track = _content == null
        ? const SizedBox.shrink()
        : (_isHorizontal
              ? Expanded(
                  child: SizedBox(height: widget.extent, child: _content!),
                )
              : SizedBox(height: widget.extent, child: _content!));

    final List<Widget> strip = _isHorizontal
        ? <Widget>[
            if (previous != null) ...<Widget>[previous, const SizedBox(width: _carouselGap)],
            track,
            if (next != null) ...<Widget>[const SizedBox(width: _carouselGap), next],
          ]
        : <Widget>[
            if (previous != null) ...<Widget>[previous, const SizedBox(height: _carouselGap)],
            track,
            if (next != null) ...<Widget>[const SizedBox(height: _carouselGap), next],
          ];

    final Widget first = _isHorizontal
        ? Row(crossAxisAlignment: CrossAxisAlignment.center, children: strip)
        : Column(mainAxisSize: MainAxisSize.min, crossAxisAlignment: CrossAxisAlignment.center, children: strip);

    // 나머지 파트(보통 점 줄)는 슬라이드 아래에 둡니다.
    final List<Widget> below = <Widget>[
      for (final Widget child in stacked)
        if (child is! HoronCarouselContent) child,
    ];
    if (below.isEmpty) return first;

    return Column(
      mainAxisSize: MainAxisSize.min,
      crossAxisAlignment: CrossAxisAlignment.stretch,
      children: <Widget>[
        first,
        for (final Widget child in below) ...<Widget>[
          const SizedBox(height: HoronSpace.s3),
          Align(alignment: Alignment.center, child: child),
        ],
      ],
    );
  }
}

/// 슬라이드 끝에 두는 여백입니다.
///
/// `carousel.tsx`는 항목마다 `pl-4`(수직은 `pt-4`)를 주고 트랙을 `-ml-4`(수직은
/// `-mt-4`)로 당깁니다. 그래서 한 장이 뷰포트를 꽉 채우면서 내용은 왼쪽에 붙고,
/// 넘기는 동안 이웃한 장과 16의 틈이 보입니다. [PageView]는 트랙을 자기 소유로
/// 두므로 같은 결과를 장마다 끝 쪽 16의 여백으로 냅니다. 내용이 시작 쪽에 붙는
/// 것과 틈의 폭이 React와 같습니다.
const double _carouselItemGutter = HoronSpace.s4;

/// 슬라이드를 담는 스크롤 영역입니다.
///
/// `carousel.tsx`의 `CarouselContent`입니다. React의 `overflow-hidden`과 같은 자리이며,
/// [PageView]가 한 장씩 스냅합니다. 자식 하나가 한 장입니다.
///
/// 스냅은 **한 번의 스와이프에 한 장**입니다. Flutter의 [PageView] 기본 물리는 세게
/// 플링하면 여러 장을 건너뛰는데, Embla는 가까운 장에만 붙으므로 그 차이를
/// [_HoronOnePageScrollPhysics]로 막습니다.
class HoronCarouselContent extends StatefulWidget {
  /// 슬라이드 영역 하나를 만듭니다.
  const HoronCarouselContent({super.key, required this.children});

  /// 슬라이드들입니다. 보통 [HoronCarouselItem]을 넣습니다.
  final List<Widget> children;

  @override
  State<HoronCarouselContent> createState() => _HoronCarouselContentState();
}

class _HoronCarouselContentState extends State<HoronCarouselContent> {
  /// 드래그가 시작된 장입니다. 스냅이 이 장에서 한 장 너머로 가지 않게 합니다.
  final _HoronCarouselDragAnchor _anchor = _HoronCarouselDragAnchor();

  @override
  Widget build(BuildContext context) {
    final _HoronCarouselScope scope = _HoronCarouselScope.of(context);
    final bool horizontal = scope.orientation == _HoronCarouselOrientation.horizontal;
    final EdgeInsetsGeometry gutter = horizontal
        ? const EdgeInsetsDirectional.only(end: _carouselItemGutter)
        : const EdgeInsets.only(bottom: _carouselItemGutter);

    return NotificationListener<ScrollStartNotification>(
      onNotification: (ScrollStartNotification notification) {
        if (notification.dragDetails != null) _anchor.page = scope.index;
        return false;
      },
      child: ClipRect(
        child: PageView(
          controller: scope.controller,
          scrollDirection: horizontal ? Axis.horizontal : Axis.vertical,
          onPageChanged: scope.onPageChanged,
          physics: _HoronOnePageScrollPhysics(_anchor),
          children: <Widget>[for (final Widget child in widget.children) Padding(padding: gutter, child: child)],
        ),
      ),
    );
  }
}

/// 드래그가 시작된 장을 기억하는 그릇입니다.
class _HoronCarouselDragAnchor {
  /// 마지막으로 드래그를 시작한 장 번호입니다.
  int page = 0;
}

/// 한 번의 플링이 한 장만 넘기도록 스냅 목표를 제한하는 물리입니다.
///
/// [PageScrollPhysics]는 플링이 빠를수록 목표를 `page + 0.5`에서 반올림하므로
/// 한 장을 훌쩍 넘긴 드래그에서 두 장을 건너뜁니다. Embla는 `slidesToScroll: 1`에
/// 가까운 장으로만 붙으므로, 목표를 드래그 시작 장의 앞뒤 한 장으로 제한해 같은
/// 감각을 만듭니다.
class _HoronOnePageScrollPhysics extends PageScrollPhysics {
  /// 물리 하나를 만듭니다.
  const _HoronOnePageScrollPhysics(this.anchor, {super.parent});

  /// 드래그가 시작된 장입니다.
  final _HoronCarouselDragAnchor anchor;

  @override
  _HoronOnePageScrollPhysics applyTo(ScrollPhysics? ancestor) =>
      _HoronOnePageScrollPhysics(anchor, parent: buildParent(ancestor));

  @override
  Simulation? createBallisticSimulation(ScrollMetrics position, double velocity) {
    final Tolerance tolerance = toleranceFor(position);

    if (position.outOfRange) {
      final double end = position.pixels.clamp(position.minScrollExtent, position.maxScrollExtent);
      return ScrollSpringSimulation(spring, position.pixels, end, velocity, tolerance: tolerance);
    }
    if (velocity.abs() < tolerance.velocity) return null;

    final double viewport = position.viewportDimension;
    if (viewport <= 0) return super.createBallisticSimulation(position, velocity);

    final double page = position.pixels / viewport;
    final double wanted = (page + (velocity > 0 ? 0.5 : -0.5)).roundToDouble();
    final double lower = (anchor.page - 1).toDouble();
    final double upper = (anchor.page + 1).toDouble();
    final double maxPage = position.maxScrollExtent / viewport;
    final double target = wanted.clamp(lower, upper).clamp(0.0, maxPage);
    final double targetPixels = target * viewport;

    if ((targetPixels - position.pixels).abs() < tolerance.distance) return null;
    return ScrollSpringSimulation(spring, position.pixels, targetPixels, velocity, tolerance: tolerance);
  }
}

/// 슬라이드 한 장입니다.
///
/// `carousel.tsx`의 `CarouselItem`입니다. React는 `basis-full shrink-0 grow-0`으로
/// 폭을 꽉 채웁니다. [PageView]가 이미 한 장에 뷰포트 전체를 주므로, 이 위젯은 자식을
/// 그대로 채우고 보조 기술용 묶음만 표시합니다.
class HoronCarouselItem extends StatelessWidget {
  /// 슬라이드 하나를 만듭니다.
  const HoronCarouselItem({super.key, required this.child, this.semanticLabel});

  /// 슬라이드 내용입니다.
  final Widget child;

  /// 보조 기술이 읽을 슬라이드 이름입니다. React의 `aria-roledescription="slide"` 자리입니다.
  final String? semanticLabel;

  @override
  Widget build(BuildContext context) {
    return Semantics(container: true, label: semanticLabel, child: child);
  }
}

/// 이전 슬라이드로 넘기는 화살표입니다.
///
/// `carousel.tsx`의 `CarouselPrevious`입니다. React는 `Button`에 `variant="outline"`,
/// `size="icon"`, `rounded-full`을 주고 첫 장에서 비활성으로 둡니다. Flutter도
/// [HoronButton]을 그대로 쓰므로 비활성 모양(불투명도 0.5)이 같습니다.
class HoronCarouselPrevious extends StatelessWidget {
  /// 이전 화살표 하나를 만듭니다.
  const HoronCarouselPrevious({super.key, this.semanticLabel});

  /// 화살표를 찾는 키입니다. React의 `data-slot="carousel-previous"` 자리입니다.
  static const Key buttonKey = ValueKey<String>('horon-carousel-previous');

  /// 보조 기술이 읽을 이름입니다. 없으면 테마의 `strings.previousPage`입니다.
  final String? semanticLabel;

  @override
  Widget build(BuildContext context) {
    final _HoronCarouselScope scope = _HoronCarouselScope.of(context);
    final bool horizontal = scope.orientation == _HoronCarouselOrientation.horizontal;
    final String label = semanticLabel ?? HoronTheme.of(context).strings.previousPage;

    return HoronButton(
      key: buttonKey,
      variant: HoronButtonVariant.outline,
      size: HoronButtonSize.icon,
      semanticLabel: label,
      disabled: !scope.canScrollPrevious,
      onPressed: scope.scrollPrevious,
      leading: _HoronCarouselChevron(direction: horizontal ? _HoronChevronDirection.left : _HoronChevronDirection.up),
    );
  }
}

/// 다음 슬라이드로 넘기는 화살표입니다.
///
/// `carousel.tsx`의 `CarouselNext`입니다. 마지막 장에서는 비활성입니다.
class HoronCarouselNext extends StatelessWidget {
  /// 다음 화살표 하나를 만듭니다.
  const HoronCarouselNext({super.key, this.semanticLabel});

  /// 화살표를 찾는 키입니다. React의 `data-slot="carousel-next"` 자리입니다.
  static const Key buttonKey = ValueKey<String>('horon-carousel-next');

  /// 보조 기술이 읽을 이름입니다. 없으면 테마의 `strings.nextPage`입니다.
  final String? semanticLabel;

  @override
  Widget build(BuildContext context) {
    final _HoronCarouselScope scope = _HoronCarouselScope.of(context);
    final bool horizontal = scope.orientation == _HoronCarouselOrientation.horizontal;
    final String label = semanticLabel ?? HoronTheme.of(context).strings.nextPage;

    return HoronButton(
      key: buttonKey,
      variant: HoronButtonVariant.outline,
      size: HoronButtonSize.icon,
      semanticLabel: label,
      disabled: !scope.canScrollNext,
      onPressed: scope.scrollNext,
      leading: _HoronCarouselChevron(
        direction: horizontal ? _HoronChevronDirection.right : _HoronChevronDirection.down,
      ),
    );
  }
}

/// 지금 몇 번째 슬라이드인지 보여 주는 점 줄입니다.
///
/// React `carousel.tsx`에는 인디케이터가 없습니다. 소비하는 화면이 매번 점을 직접
/// 그려야 했으므로 이 패키지가 파트 하나로 더했습니다. 점 수는 슬라이드 수이고,
/// 지금 장의 점만 `primary`로 칠합니다.
class HoronCarouselDots extends StatelessWidget {
  /// 점 줄 하나를 만듭니다.
  const HoronCarouselDots({super.key, this.semanticLabel});

  /// 점 줄을 찾는 키입니다.
  static const Key dotsKey = ValueKey<String>('horon-carousel-dots');

  /// 보조 기술이 읽을 이름입니다. 없으면 `1 / 3` 꼴의 위치를 읽습니다.
  final String? semanticLabel;

  @override
  Widget build(BuildContext context) {
    final _HoronCarouselScope scope = _HoronCarouselScope.of(context);
    final ColorScheme scheme = Theme.of(context).colorScheme;
    final bool horizontal = scope.orientation == _HoronCarouselOrientation.horizontal;

    return Semantics(
      label: semanticLabel ?? '${scope.index + 1} / ${scope.count}',
      child: SizedBox(
        key: dotsKey,
        child: Flex(
          direction: horizontal ? Axis.horizontal : Axis.vertical,
          mainAxisSize: MainAxisSize.min,
          children: <Widget>[
            for (int index = 0; index < scope.count; index++) ...<Widget>[
              if (index > 0)
                SizedBox(width: horizontal ? _carouselDotGap : 0, height: horizontal ? 0 : _carouselDotGap),
              SizedBox.square(
                dimension: _carouselDotSize,
                child: DecoratedBox(
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    color: index == scope.index
                        ? scheme.primary
                        : scheme.onSurface.withValues(alpha: _carouselDotInactiveAlpha),
                  ),
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }
}

/// 셰브론을 그리는 위젯입니다.
///
/// 이 패키지는 아이콘 폰트를 번들하지 않으므로 화살표를 선 두 개로 그립니다.
/// [HoronButton]이 아이콘 슬롯에 넣어 주는 `IconTheme`의 크기·색을 그대로 씁니다.
class _HoronCarouselChevron extends StatelessWidget {
  const _HoronCarouselChevron({required this.direction});

  final _HoronChevronDirection direction;

  @override
  Widget build(BuildContext context) {
    final IconThemeData theme = IconTheme.of(context);
    final Color color = theme.color ?? Theme.of(context).colorScheme.onSurface;
    return CustomPaint(
      size: Size.square(theme.size ?? HoronSpace.s4),
      painter: _HoronChevronPainter(color: color, direction: direction),
    );
  }
}

/// lucide `chevron-left`(`m15 18-6-6 6-6`)를 24 단위 상자의 비율로 그립니다.
///
/// 네 방향 모두 같은 세 점을 돌려 그립니다. `carousel.tsx`는 세로에서 화살표를
/// `rotate-90`으로 돌리므로, 그 회전을 여기서 방향으로 옮겼습니다.
class _HoronChevronPainter extends CustomPainter {
  const _HoronChevronPainter({required this.color, required this.direction});

  final Color color;
  final _HoronChevronDirection direction;

  @override
  void paint(Canvas canvas, Size size) {
    final Paint paint = Paint()
      ..color = color
      ..style = PaintingStyle.stroke
      ..strokeWidth = size.shortestSide * _carouselChevronStrokeRatio
      ..strokeCap = StrokeCap.round
      ..strokeJoin = StrokeJoin.round;

    const double near = 0.375;
    const double far = 0.625;
    const double mid = 0.5;
    final double width = size.width;
    final double height = size.height;

    final Offset start;
    final Offset corner;
    final Offset end;
    switch (direction) {
      case _HoronChevronDirection.left:
        start = Offset(far * width, 0.75 * height);
        corner = Offset(near * width, mid * height);
        end = Offset(far * width, 0.25 * height);
      case _HoronChevronDirection.right:
        start = Offset(near * width, 0.75 * height);
        corner = Offset(far * width, mid * height);
        end = Offset(near * width, 0.25 * height);
      case _HoronChevronDirection.up:
        start = Offset(0.25 * width, far * height);
        corner = Offset(mid * width, near * height);
        end = Offset(0.75 * width, far * height);
      case _HoronChevronDirection.down:
        start = Offset(0.25 * width, near * height);
        corner = Offset(mid * width, far * height);
        end = Offset(0.75 * width, near * height);
    }

    canvas.drawPath(
      Path()
        ..moveTo(start.dx, start.dy)
        ..lineTo(corner.dx, corner.dy)
        ..lineTo(end.dx, end.dy),
      paint,
    );
  }

  @override
  bool shouldRepaint(_HoronChevronPainter oldDelegate) =>
      color != oldDelegate.color || direction != oldDelegate.direction;
}
